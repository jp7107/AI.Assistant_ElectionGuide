import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';

const STEP_COLORS = [
  'from-indigo-500 to-violet-500',
  'from-violet-500 to-purple-500',
  'from-purple-500 to-fuchsia-500',
  'from-fuchsia-500 to-pink-500',
  'from-pink-500 to-rose-500',
  'from-rose-500 to-red-500',
  'from-saffron-500 to-amber-500',
  'from-amber-500 to-yellow-500',
  'from-yellow-500 to-lime-500',
  'from-lime-500 to-trigreen-500',
  'from-trigreen-500 to-emerald-500',
];

export default function Timeline() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');
  const [expandedStep, setExpandedStep] = useState(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await axios.get(`${API}/timeline`);
        setSteps(res.data.data);
        setSource(res.data.source);
      } catch {
        setSteps([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-400">Loading election timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="section-title text-white">📅 Election Timeline</h1>
        <p className="section-subtitle !mb-4">
          The complete Indian election process — step by step, from announcement to government formation.
        </p>
        {source && (
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
            <span className={`w-1.5 h-1.5 rounded-full ${source === 'sheets' ? 'bg-trigreen-400' : 'bg-amber-400'}`} />
            Data source: {source === 'sheets' ? 'Google Sheets (Live)' : 'Built-in Reference'}
          </span>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 via-saffron-500 to-trigreen-500 opacity-30" />

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className="relative pl-16 sm:pl-20 animate-slide-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Step number circle */}
              <div
                className={`absolute left-2.5 sm:left-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br ${STEP_COLORS[i % STEP_COLORS.length]} flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg z-10`}
              >
                {step.step}
              </div>

              {/* Card */}
              <button
                onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                className={`w-full text-left glass-card-hover p-5 sm:p-6 cursor-pointer ${
                  expandedStep === i ? 'bg-white/10 border-indigo-500/30' : ''
                }`}
                id={`timeline-step-${step.step}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{step.icon}</span>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                    {step.duration && (
                      <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 mb-3">
                        {step.duration}
                      </span>
                    )}
                    <p
                      className={`text-slate-400 text-sm sm:text-base leading-relaxed ${
                        expandedStep === i ? '' : 'line-clamp-2'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${
                      expandedStep === i ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <p className="text-slate-500 text-sm">
          Have questions about any step?{' '}
          <a href="/chat" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
            Ask ElectraGuide AI →
          </a>
        </p>
      </div>
    </div>
  );
}
