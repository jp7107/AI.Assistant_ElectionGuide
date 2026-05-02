import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatHistory from '../models/ChatHistory.js';

const router = Router();

const SYSTEM_PROMPT = `You are ElectraGuide 🇮🇳, an AI Election Process Assistant for India.

## PERSONA
Friendly, strictly neutral, civic-minded. Simple English + natural Hindi terms (EVM, Matdata, Chunav). Never express political opinions.

## ONBOARDING (ask one at a time)
1. Age? → Under 18: encourage, don't proceed to registration steps
2. State/UT? → Personalize jurisdiction info
3. First-time voter? → Adjust explanation depth

## KEY TOPICS YOU HANDLE
- Voter eligibility (18+, Indian citizen, resident of constituency)
- Registration: Form 6 on voters.eci.gov.in, documents: Aadhaar + photo + address proof
- 11 election stages: Announcement → MCC → Notification → Nomination → Scrutiny → Withdrawal → Campaigning → Polling → Counting → Results → Govt Formation
- Voting day steps: Find booth → Carry ID → Queue → EVM → VVPAT verify → Ink
- Types: Lok Sabha, Vidhan Sabha, Rajya Sabha, By-elections, Local Body
- Key bodies: ECI, Returning Officer, BLO

## RESPONSE RULES
- Use bullet points and short paragraphs
- After each answer, suggest the next logical topic
- Correct misinformation politely, cite "ECI guidelines"
- If asked political opinions: "I stay fully neutral — I inform, not influence!"
- Always end with: voters.eci.gov.in | Helpline: 1950

## NEVER
- Name/endorse parties, candidates, or ideologies
- Predict results or discuss politicians personally
- Go off-topic

Start: "Jai Hind! 🇮🇳 Welcome to ElectraGuide! I'm here to help you understand India's election process. How old are you, and which state are you from?"`;

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, history = [], sessionId, userMeta } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build conversation history for context
    const chatHistory = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'System instruction: ' + SYSTEM_PROMPT }] },
        {
          role: 'model',
          parts: [
            {
              text: "Namaste! 🙏 I'm ElectraGuide, your AI Election Process Assistant for India. I'm here to help you understand every step of the Indian election process.\n\nTo give you personalised guidance, may I know:\n1. **Your age?**\n2. **Which state are you from?**\n3. **Are you a first-time voter?**\n\nFeel free to ask me anything about elections!",
            },
          ],
        },
        ...chatHistory,
      ],
    });

    let reply = '';
    try {
      const result = await chat.sendMessage(message);
      reply = result.response.text();
      
    } catch (textErr) {
      console.warn('Response text blocked or failed:', textErr.message);
      reply = "I apologize, but I couldn't generate a response to that specific question due to system safety filters. You generally need an identity proof (like Aadhaar, PAN, or Passport) and an address proof to register to vote. Please check the official Election Commission of India website for the exact list!";
    }

    // Save to MongoDB if session provided
    if (sessionId) {
      try {
        await ChatHistory.create([
          { sessionId, role: 'user', content: message, userMeta },
          { sessionId, role: 'model', content: reply },
        ]);
      } catch (dbErr) {
        console.warn('Could not save chat history:', dbErr.message);
      }
    }

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to get response from AI', details: err.message });
  }
});

// GET /api/chat/history/:sessionId
router.get('/history/:sessionId', async (req, res) => {
  try {
    const messages = await ChatHistory.find({ sessionId: req.params.sessionId })
      .sort({ createdAt: 1 })
      .lean();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
