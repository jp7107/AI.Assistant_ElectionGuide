import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState('intro'); // intro | playing | submitting | results
  const [playerName, setPlayerName] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${API}/quiz/questions`);
        setQuestions(res.data);
        setAnswers(new Array(res.data.length).fill(-1));
      } catch {
        setQuestions([]);
      }
    };
    fetchQuestions();
  }, []);

  const selectAnswer = (optionIdx) => {
    const newAnswers = [...answers];
    newAnswers[current] = optionIdx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const prevQuestion = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const submitQuiz = async () => {
    if (answers.includes(-1)) return;
    setPhase('submitting');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/quiz/submit`, {
        answers,
        playerName: playerName || 'Anonymous',
      });
      setResults(res.data);
      setPhase('results');
    } catch {
      setPhase('playing');
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setCurrent(0);
    setAnswers(new Array(questions.length).fill(-1));
    setResults(null);
    setPhase('intro');
  };

  const answeredCount = answers.filter((a) => a !== -1).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // ── Intro Screen ──
  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="glass-card p-8 sm:p-12 text-center animate-fade-in">
          <div className="text-6xl mb-6">🧠</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Election Knowledge Quiz
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Test your knowledge about Indian elections with 10 carefully crafted questions.
            Learn as you go!
          </p>
          <div className="flex flex-col gap-4 max-w-sm mx-auto mb-8">
            <input
              type="text"
              id="quiz-player-name"
              placeholder="Enter your name (optional)"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-center"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-indigo-400">10</div>
              <div className="text-xs text-slate-500 mt-1">Questions</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-saffron-400">MCQ</div>
              <div className="text-xs text-slate-500 mt-1">Format</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-trigreen-400">∞</div>
              <div className="text-xs text-slate-500 mt-1">Retries</div>
            </div>
          </div>
          <button
            onClick={() => setPhase('playing')}
            id="quiz-start-btn"
            className="btn-primary text-lg px-10 py-4"
            disabled={questions.length === 0}
          >
            🚀 Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // ── Results Screen ──
  if (phase === 'results' && results) {
    const emoji =
      results.percentage >= 80 ? '🏆' : results.percentage >= 60 ? '👏' : results.percentage >= 40 ? '📚' : '💪';
    const msg =
      results.percentage >= 80
        ? 'Outstanding! You know your elections!'
        : results.percentage >= 60
        ? 'Great job! You have solid knowledge.'
        : results.percentage >= 40
        ? 'Good effort! Keep learning.'
        : "Don't worry, learning is a journey!";

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Score Card */}
        <div className="glass-card p-8 text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-slate-400 mb-6">{msg}</p>
          <div className="flex items-center justify-center gap-8 mb-6">
            <div>
              <div className="text-5xl font-extrabold text-indigo-400">{results.score}</div>
              <div className="text-sm text-slate-500">out of {results.total}</div>
            </div>
            <div className="w-px h-16 bg-white/10" />
            <div>
              <div className="text-5xl font-extrabold text-trigreen-400">{results.percentage}%</div>
              <div className="text-sm text-slate-500">accuracy</div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={restart} className="btn-primary" id="quiz-retry-btn">
              🔄 Try Again
            </button>
            <a href="/chat" className="btn-secondary">
              💬 Ask AI
            </a>
          </div>
        </div>

        {/* Detailed Results */}
        <h3 className="text-xl font-bold text-white mb-4">📋 Detailed Review</h3>
        <div className="space-y-4">
          {results.results.map((r, i) => (
            <div
              key={i}
              className={`glass-card p-5 border-l-4 animate-slide-up ${
                r.isCorrect ? 'border-l-trigreen-500' : 'border-l-red-500'
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-lg">{r.isCorrect ? '✅' : '❌'}</span>
                <p className="text-white font-medium text-sm sm:text-base">{r.question}</p>
              </div>
              <div className="ml-8 space-y-1.5">
                {r.options.map((opt, oi) => (
                  <div
                    key={oi}
                    className={`text-sm px-3 py-1.5 rounded-lg ${
                      oi === r.correct
                        ? 'bg-trigreen-500/15 text-trigreen-300 border border-trigreen-500/20'
                        : oi === r.selected && !r.isCorrect
                        ? 'bg-red-500/15 text-red-300 border border-red-500/20'
                        : 'text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + oi)}. {opt}
                    {oi === r.correct && ' ✓'}
                    {oi === r.selected && oi !== r.correct && ' ✗'}
                  </div>
                ))}
                <p className="text-xs text-slate-400 mt-2 italic">💡 {r.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Submitting Screen ──
  if (phase === 'submitting') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-400">Calculating your score...</p>
        </div>
      </div>
    );
  }

  // ── Playing Screen ──
  const q = questions[current];
  if (!q) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
          <span>
            Question {current + 1} of {questions.length}
          </span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card p-6 sm:p-8 mb-6 animate-fade-in" key={current}>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-300 font-bold text-sm border border-indigo-500/20">
            {current + 1}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white flex-1">{q.question}</h2>
        </div>

        <div className="space-y-3">
          {q.options.map((option, oi) => (
            <button
              key={oi}
              onClick={() => selectAnswer(oi)}
              id={`quiz-option-${oi}`}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 group ${
                answers[current] === oi
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-colors ${
                  answers[current] === oi
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-slate-400 group-hover:bg-white/15'
                }`}
              >
                {String.fromCharCode(65 + oi)}
              </span>
              <span className="text-sm sm:text-base">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevQuestion}
          disabled={current === 0}
          className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {current === questions.length - 1 ? (
          <button
            onClick={submitQuiz}
            disabled={answers.includes(-1)}
            id="quiz-submit-btn"
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            🎯 Submit Quiz ({answeredCount}/{questions.length})
          </button>
        ) : (
          <button onClick={nextQuestion} className="btn-primary">
            Next →
          </button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="mt-8 glass-card p-4">
        <p className="text-xs text-slate-500 mb-3">Jump to question:</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                i === current
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : answers[i] !== -1
                  ? 'bg-trigreen-500/20 text-trigreen-300 border border-trigreen-500/20'
                  : 'bg-white/5 text-slate-500 border border-white/10 hover:bg-white/10'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
