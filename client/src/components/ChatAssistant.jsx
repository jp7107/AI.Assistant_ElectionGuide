import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="typing-dot w-2 h-2 rounded-full bg-indigo-400" />
      <div className="typing-dot w-2 h-2 rounded-full bg-indigo-400" />
      <div className="typing-dot w-2 h-2 rounded-full bg-indigo-400" />
    </div>
  );
}

const QUICK_PROMPTS = [
  'How do I register to vote?',
  'What documents do I need for voting?',
  'Explain the election process',
  'Am I eligible to vote?',
  'What is NOTA?',
  'How does EVM work?',
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content:
        "Namaste! 🙏 I'm **ElectraGuide**, your AI Election Process Assistant for India.\n\nI'm here to help you understand every step of the Indian election process in a simple, personalised way.\n\nTo give you the best guidance, could you tell me:\n1. **Your age?**\n2. **Which state are you from?**\n3. **Are you a first-time voter?**\n\nOr feel free to ask me anything about Indian elections!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await axios.post(`${API}/chat`, {
        message: userMsg,
        history: history.slice(0, -1), // exclude the current message from history
        sessionId: sessionId.current,
      });

      setMessages((prev) => [...prev, { role: 'model', content: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: '⚠️ Sorry, I encountered an error. Please make sure the Gemini API key is configured and try again.',
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="section-title text-white">
          🤖 AI Chat Assistant
        </h1>
        <p className="section-subtitle !mb-6">
          Ask anything about Indian elections — registration, voting process, eligibility, and more.
        </p>
      </div>

      {/* Chat Container */}
      <div className="glass-card flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-md'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    <span className="text-lg">🗳️</span>
                    <span className="text-xs font-semibold text-indigo-300">ElectraGuide</span>
                  </div>
                )}
                <div className="chat-markdown text-sm sm:text-base">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-4 sm:px-6 pb-2">
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500/30 hover:text-white transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 border-t border-white/10">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Indian elections..."
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              id="chat-send-btn"
              disabled={loading || !input.trim()}
              className="btn-primary px-5 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
