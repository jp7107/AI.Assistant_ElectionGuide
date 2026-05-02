import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Chat Assistant',
    desc: 'Get personalised guidance on voter registration, eligibility, and the complete election process.',
    link: '/chat',
    gradient: 'from-indigo-600 to-violet-600',
  },
  {
    icon: '📅',
    title: 'Election Timeline',
    desc: 'Explore every phase of the Indian election process — from announcement to government formation.',
    link: '/timeline',
    gradient: 'from-saffron-500 to-amber-500',
  },
  {
    icon: '📍',
    title: 'Polling Booth Finder',
    desc: 'Locate nearby polling booths across major Indian cities with an interactive map.',
    link: '/booth-finder',
    gradient: 'from-trigreen-500 to-emerald-500',
  },
  {
    icon: '🧠',
    title: 'Election Quiz',
    desc: 'Test your knowledge about Indian elections with 10 curated questions and earn your score.',
    link: '/quiz',
    gradient: 'from-rose-500 to-pink-500',
  },
];

const STATS = [
  { value: '950M+', label: 'Registered Voters' },
  { value: '10L+', label: 'Polling Booths' },
  { value: '543', label: 'Lok Sabha Seats' },
  { value: '28+8', label: 'States & UTs' },
];

export default function Hero() {
  return (
    <main>
      {/* ── Hero Section ── */}
      <section className="relative px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse-soft" />
            AI-Powered Election Education
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
            <span className="gradient-text">Your Guide to</span>
            <br />
            <span className="text-white">Indian Elections</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Understand every step of the democratic process — from voter registration to results.
            Personalised, interactive, and powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/chat" className="btn-primary text-lg px-8 py-4" id="hero-start-chat">
              🗳️ Start Learning
            </Link>
            <Link to="/timeline" className="btn-secondary text-lg px-8 py-4" id="hero-view-timeline">
              📅 View Timeline
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="px-4 pb-24" id="features">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-white">
            Everything You Need to Know
          </h2>
          <p className="section-subtitle">
            From AI-powered guidance to interactive quizzes — explore the tools designed to make elections simple.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <Link
                key={i}
                to={feature.link}
                id={`feature-card-${i}`}
                className="glass-card-hover p-6 sm:p-8 group block"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
                <div className="mt-4 flex items-center gap-2 text-indigo-400 text-sm font-medium group-hover:gap-3 transition-all">
                  Explore
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>🗳️</span>
            <span className="font-semibold text-slate-400">ElectraGuide</span>
            <span>— AI Election Education Assistant</span>
          </div>
          <div>Made for India's Democracy 🇮🇳</div>
        </div>
      </footer>
    </main>
  );
}
