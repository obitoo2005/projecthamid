import {
  BookOpen,
  Calculator,
  ChevronRight,
  CheckCircle2,
  Gamepad2,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { CORE_PILLARS } from '../data/hubData';

function MiniPreview({ type }) {
  if (type === 'study') {
    return (
      <div className="offer-preview" aria-hidden="true">
        <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
          <span className="status-chip status-chip-accent">PDF / DOCX / Notes</span>
          <span className="status-chip status-chip-gold">English + اردو</span>
        </div>
        <div className="panel" style={{ padding: '0.65rem 0.8rem' }}>
          <strong style={{ fontSize: '0.82rem' }}>Chapter Summary &amp; Quiz Ready</strong>
          <p className="muted" style={{ fontSize: '0.76rem', marginBlockStart: '0.2rem' }}>
            4 MCQs · 3 Short Qs · 5 Revision Flashcards generated
          </p>
        </div>
      </div>
    );
  }

  if (type === 'calculator') {
    return (
      <div className="offer-preview" aria-hidden="true">
        <div className="calc-display" style={{ minBlockSize: 'auto', padding: '0.65rem 0.85rem' }}>
          <span className="muted" style={{ fontSize: '0.72rem' }}>2x² - 7x + 3 = 0 · DEG</span>
          <strong style={{ fontSize: '1.05rem', color: '#ffd54f' }}>x₁ = 3, x₂ = 0.5</strong>
        </div>
        <div className="row-wrap" style={{ justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <span className="status-chip">sin / cos / log / √</span>
          <span className="status-chip">Step-by-step</span>
        </div>
      </div>
    );
  }

  if (type === 'tools') {
    return (
      <div className="offer-preview" aria-hidden="true">
        <div className="row-wrap">
          <span className="status-chip status-chip-accent">Essay Polish</span>
          <span className="status-chip">Summarizer</span>
          <span className="status-chip">Translator</span>
        </div>
        <p className="muted" style={{ fontSize: '0.78rem' }}>
          “Explain Quantum Tunneling in simple Urdu with 1 exam example → Generated in 1.2s”
        </p>
      </div>
    );
  }

  if (type === 'esports') {
    return (
      <div className="offer-preview" aria-hidden="true">
        <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
          <strong style={{ fontSize: '0.82rem' }}>PUBG Mobile Standings</strong>
          <span className="status-chip status-chip-accent">8 Subsections</span>
        </div>
        <div className="stack-sm" style={{ fontSize: '0.76rem', gap: '0.3rem' }}>
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <span>#1 Leader Esports</span>
            <strong className="mono">132 PTS</strong>
          </div>
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <span>#2 Nice Esports</span>
            <strong className="mono">121 PTS</strong>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'productivity') {
    return (
      <div className="offer-preview" aria-hidden="true">
        <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
          <strong style={{ fontSize: '0.82rem' }}>Today&apos;s Study Sprint</strong>
          <span className="status-chip">25:00 Focus</span>
        </div>
        <div className="stack-sm" style={{ fontSize: '0.78rem', gap: '0.3rem' }}>
          <div className="row-wrap">
            <CheckCircle2 size={14} color="#16a34a" />
            <span>Revise Physics Ch. 3 Flashcards</span>
          </div>
          <div className="row-wrap">
            <CheckCircle2 size={14} color="#2563eb" />
            <span>8:00 PM Blitz Scrims Check-in</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="offer-preview" aria-hidden="true">
      <div className="row-wrap">
        <span className="status-chip status-chip-accent">Blitz Official Scrims</span>
        <span className="status-chip">Nice Esports</span>
      </div>
      <div className="row-wrap">
        <span className="status-chip">Leader Esports</span>
        <span className="status-chip">56 Esports</span>
      </div>
    </div>
  );
}

export default function DashboardView({ onNavigate, stats }) {
  const highlights = [
    {
      label: 'Main Feature',
      value: 'Study AI',
      desc: 'PDF, DOCX, MCQs, English/Urdu & Flashcards.',
      Icon: BookOpen,
    },
    {
      label: 'Smart Math',
      value: 'Solver',
      desc: 'Scientific calculator & equation derivations.',
      Icon: Calculator,
    },
    {
      label: 'Your Progress',
      value:
        stats.quizzesTaken > 0
          ? `${stats.avgScore}%`
          : `${stats.tasksDone}/${stats.totalTasks}`,
      desc: `${stats.quizzesTaken} quizzes logged · ${stats.tasksDone} of ${stats.totalTasks} tasks done.`,
      Icon: Trophy,
    },
    {
      label: 'Arena & Orgs',
      value: '4+ Squads',
      desc: 'Blitz Scrims, Nice, Leader & 56 Esports.',
      Icon: Gamepad2,
    },
  ];

  return (
    <>
      {/* Hero Banner matching reference layout */}
      <section className="hero-banner" aria-labelledby="hero-heading">
        <img
          src="/hero-campus.jpg"
          alt=""
          aria-hidden="true"
          className="hero-bg-img"
          fetchPriority="high"
          width="1280"
          height="720"
        />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-content">
          <span className="pill-badge">
            <Sparkles size={13} aria-hidden="true" />
            <span>Discover Your All-In-One Student Hub</span>
          </span>
          <h1 id="hero-heading" className="hero-title">
            Your AI-Powered Path to Academic &amp; Esports Mastery!
          </h1>
          <p className="hero-subtitle">
            Upload PDFs &amp; notes for instant AI study help, solve mathematical equations, manage
            your daily tasks, and connect with PUBG Mobile esports communities.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate('study')}
            >
              Get Started
            </button>
            <button
              type="button"
              className="btn btn-white"
              onClick={() => onNavigate('esports')}
            >
              Explore Esports Hub
            </button>
          </div>
        </div>
      </section>

      {/* Compact highlight stats row */}
      <section aria-label="Platform highlights">
        <div className="bento-grid">
          {highlights.map(({ label, value, desc, Icon }) => (
            <article key={label} className="bento-card reveal-on-scroll">
              <div className="bento-top">
                <span className="bento-label">{label}</span>
                <span className="bento-icon-box" aria-hidden="true">
                  <Icon size={18} />
                </span>
              </div>
              <p className="bento-value">{value}</p>
              <p className="bento-desc">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* What we offer (6 Pillars in horizontal reference cards) */}
      <section aria-labelledby="offers-heading">
        <div className="section-head reveal-on-scroll">
          <h2 id="offers-heading" className="section-title">
            What we offer
          </h2>
          <span className="section-kicker">Make Your First Move</span>
        </div>

        <div className="offers-stack">
          {CORE_PILLARS.map((item) => (
            <div key={item.num} className="offer-wrapper reveal-on-scroll">
              <article className="offer-card">
                <div className="offer-left">
                  <span className="offer-eyebrow">{item.eyebrow}</span>
                  <h3 className="offer-title">{item.title}</h3>
                  <button
                    type="button"
                    className="btn btn-dark btn-sm"
                    onClick={() => onNavigate(item.targetView)}
                  >
                    <span>{item.cta}</span>
                    <ChevronRight size={15} aria-hidden="true" />
                  </button>
                </div>

                <MiniPreview type={item.previewType} />

                <p className="offer-desc">{item.description}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted metrics strip */}
      <section className="trusted-strip reveal-on-scroll" aria-labelledby="trusted-heading">
        <h2 id="trusted-heading" className="section-title">
          Trusted by Students &amp; Squads
        </h2>
        <div className="trusted-metrics">
          <div>
            <p className="trusted-num">1,200+</p>
            <p className="muted">Active Students</p>
          </div>
          <div>
            <p className="trusted-num">50+</p>
            <p className="muted">Scrims &amp; Events</p>
          </div>
          <div>
            <p className="trusted-num">90%</p>
            <p className="muted">Faster Exam Prep</p>
          </div>
        </div>
      </section>

      {/* Ready to Start Bottom CTA Banner */}
      <section className="cta-banner reveal-on-scroll" aria-labelledby="cta-heading">
        <div className="stack-md">
          <div className="stack-sm">
            <span className="offer-eyebrow">Ready to Start?</span>
            <h2 id="cta-heading" className="section-title">
              Join Today and Start Your BLITZ AI Journey!
            </h2>
            <p className="offer-desc">
              Upload your first study chapter, solve equations, or connect with Blitz Official
              Scrims, Nice Esports, Leader Esports, and 56 Esports.
            </p>
          </div>
          <div className="row-wrap">
            <button type="button" className="btn btn-primary" onClick={() => onNavigate('study')}>
              Open Study AI
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => onNavigate('community')}>
              <Users size={16} aria-hidden="true" />
              <span>Join Community</span>
            </button>
          </div>
        </div>

        {/* Clean SVG illustration matching reference bottom banner aesthetic */}
        <div className="cta-art" aria-hidden="true">
          <svg viewBox="0 0 300 180" width="300" height="180" fill="none">
            <rect x="24" y="24" width="252" height="132" rx="20" fill="#EFF4FF" />
            <circle cx="98" cy="72" r="22" fill="#1D63ED" opacity="0.16" />
            <circle cx="202" cy="72" r="22" fill="#1D63ED" opacity="0.16" />
            <path
              d="M74 134c0-20 12-34 24-34s24 14 24 34"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M178 134c0-20 12-34 24-34s24 14 24 34"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="98" cy="72" r="14" stroke="#1E293B" strokeWidth="4" fill="#FFFFFF" />
            <circle cx="202" cy="72" r="14" stroke="#1E293B" strokeWidth="4" fill="#FFFFFF" />
            <path
              d="M122 96l28-16 28 16"
              stroke="#1D63ED"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M150 42l-7 14h11l-4 14 13-18h-11l5-10z"
              fill="#F5B800"
              stroke="#18181B"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>
    </>
  );
}
