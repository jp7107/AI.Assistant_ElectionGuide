import { Router } from 'express';
import QuizScore from '../models/QuizScore.js';

const router = Router();

const QUESTIONS = [
  {
    question: 'What is the minimum age to vote in Indian elections?',
    options: ['16 years', '18 years', '21 years', '25 years'],
    correct: 1,
    explanation: 'As per the Constitution of India, the minimum age to vote is 18 years.',
  },
  {
    question: 'Which body conducts elections in India?',
    options: ['Supreme Court', 'Parliament', 'Election Commission of India', 'President of India'],
    correct: 2,
    explanation: 'The Election Commission of India (ECI) is the constitutional body responsible for conducting elections.',
  },
  {
    question: 'What does MCC stand for in the context of Indian elections?',
    options: ['Model Campaign Committee', 'Model Code of Conduct', 'Mandatory Code of Candidates', 'Municipal Campaign Council'],
    correct: 1,
    explanation: 'MCC stands for Model Code of Conduct — guidelines for political parties and candidates during elections.',
  },
  {
    question: 'Which document is primarily needed to vote in India?',
    options: ['Passport', 'Aadhaar Card', 'Voter ID Card (EPIC)', 'PAN Card'],
    correct: 2,
    explanation: 'The Voter ID Card (EPIC — Electors Photo Identity Card) is the primary document for voting.',
  },
  {
    question: 'How many phases can a general election in India have?',
    options: ['Only 1 phase', 'Maximum 3 phases', 'Multiple phases (up to 7+)', 'Exactly 5 phases'],
    correct: 2,
    explanation: 'Indian general elections can be conducted in multiple phases, sometimes 7 or more, due to the vast size of the country.',
  },
  {
    question: 'What is EVM?',
    options: ['Electronic Verification Machine', 'Election Validation Module', 'Electronic Voting Machine', 'Electoral Voting Mechanism'],
    correct: 2,
    explanation: 'EVM stands for Electronic Voting Machine, used for casting votes in Indian elections.',
  },
  {
    question: 'What is NOTA in Indian elections?',
    options: ['National Organization for Transparency in Administration', 'None Of The Above', 'New Online Ticket Application', 'National Office for Tally Automation'],
    correct: 1,
    explanation: 'NOTA allows voters to officially reject all candidates. It was introduced in 2013.',
  },
  {
    question: 'How many seats are there in the Lok Sabha?',
    options: ['500', '543', '550', '600'],
    correct: 1,
    explanation: 'The Lok Sabha has 543 elected seats. A party needs 272 seats for a majority.',
  },
  {
    question: 'What is VVPAT?',
    options: ['Voter Verified Paper Audit Trail', 'Virtual Vote Processing And Tracking', 'Verified Voting Protocol And Technology', 'Vote Validation Process And Test'],
    correct: 0,
    explanation: 'VVPAT is a slip printed by the EVM that allows voters to verify their vote was recorded correctly.',
  },
  {
    question: 'When does the election campaign officially stop before polling day?',
    options: ['24 hours before', '48 hours before', '72 hours before', 'On the morning of polling day'],
    correct: 1,
    explanation: 'Election campaigning must stop 48 hours before the polling day as per election rules.',
  },
];

// GET /api/quiz/questions
router.get('/questions', (req, res) => {
  // Send questions without correct answers
  const safeQuestions = QUESTIONS.map(({ correct, explanation, ...q }) => q);
  res.json(safeQuestions);
});

// POST /api/quiz/submit
router.post('/submit', async (req, res) => {
  try {
    const { answers, playerName } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length !== QUESTIONS.length) {
      return res.status(400).json({ error: 'Please answer all 10 questions' });
    }

    let score = 0;
    const detailed = answers.map((selected, idx) => {
      const isCorrect = selected === QUESTIONS[idx].correct;
      if (isCorrect) score++;
      return {
        questionIndex: idx,
        selected,
        correct: QUESTIONS[idx].correct,
        isCorrect,
      };
    });

    const percentage = Math.round((score / QUESTIONS.length) * 100);

    // Save to MongoDB
    try {
      await QuizScore.create({
        playerName: playerName || 'Anonymous',
        score,
        totalQuestions: QUESTIONS.length,
        percentage,
        answers: detailed,
      });
    } catch (dbErr) {
      console.warn('Could not save quiz score:', dbErr.message);
    }

    // Return results with explanations
    const results = QUESTIONS.map((q, idx) => ({
      question: q.question,
      options: q.options,
      correct: q.correct,
      selected: answers[idx],
      isCorrect: detailed[idx].isCorrect,
      explanation: q.explanation,
    }));

    res.json({ score, total: QUESTIONS.length, percentage, results });
  } catch (err) {
    console.error('Quiz submit error:', err);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// GET /api/quiz/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const top = await QuizScore.find()
      .sort({ percentage: -1, createdAt: -1 })
      .limit(20)
      .select('playerName score totalQuestions percentage createdAt')
      .lean();
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
