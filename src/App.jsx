import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import DashboardView from './components/DashboardView';
import StudyAIView from './components/StudyAIView';
import CalculatorView from './components/CalculatorView';
import AIToolsView from './components/AIToolsView';
import EsportsView from './components/EsportsView';
import CommunityView from './components/CommunityView';
import ProfileView from './components/ProfileView';
import { fetchSiteConfig } from './services/apiClient';

function readStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const EMPTY_CONFIG = {
  aiConfigured: false,
  links: {
    instagram: '',
    whatsapp: '',
    discord: '',
    telegram: '',
    orgs: {},
  },
};

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [theme, setTheme] = useState(() => readStored('blitz_theme', 'light'));
  const [siteConfig, setSiteConfig] = useState(EMPTY_CONFIG);
  const [configError, setConfigError] = useState('');

  const [profile, setProfile] = useState(() =>
    readStored('blitz_profile', {
      name: 'Student Challenger',
      school: 'University / College',
      ign: 'BLZxPlayer · IGL',
    }),
  );
  const [quizHistory, setQuizHistory] = useState(() => readStored('blitz_quizzes', []));
  const [tasks, setTasks] = useState(() =>
    readStored('blitz_tasks', [
      { id: 1, title: "Revise Newton's Laws flashcards", due: 'Today', done: true },
      { id: 2, title: 'Solve 5 quadratic equations', due: 'Today', done: false },
      { id: 3, title: '8:00 PM Blitz Official Scrims lobby', due: 'Tonight', done: false },
    ]),
  );

  // Clean up any legacy client-side API key/link keys from previous builds
  useEffect(() => {
    try {
      localStorage.removeItem('blitz_gemini_key');
      localStorage.removeItem('blitz_gemini_model');
      localStorage.removeItem('blitz_links');
    } catch {
      // noop
    }
  }, []);

  // Load backend-managed links and AI readiness strictly from /api/config
  useEffect(() => {
    let cancelled = false;
    fetchSiteConfig()
      .then((cfg) => {
        if (!cancelled) {
          setSiteConfig(cfg);
          setConfigError('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setConfigError(err.message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('blitz_theme', JSON.stringify(theme));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0f1217' : '#ffffff');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('blitz_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('blitz_quizzes', JSON.stringify(quizHistory));
  }, [quizHistory]);

  useEffect(() => {
    localStorage.setItem('blitz_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Fallback scroll progress & reveal animations ONLY when browser lacks native CSS Scroll-Driven Animations
  useEffect(() => {
    const prefersMotion = window.matchMedia?.('(prefers-reduced-motion: no-preference)')?.matches;
    if (!prefersMotion) return undefined;

    const cleanups = [];

    if (!CSS.supports('animation-timeline', 'scroll()')) {
      const bar = document.getElementById('scroll-progress');
      if (bar) {
        const onScroll = () => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
          bar.style.transform = `scaleX(${ratio})`;
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        cleanups.push(() => window.removeEventListener('scroll', onScroll));
      }
    }

    if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
      const targets = document.querySelectorAll('.reveal-on-scroll');
      if (targets.length) {
        const io = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                entry.target.classList.add('reveal-fallback-visible');
                io.unobserve(entry.target);
              }
            }
          },
          { threshold: 0.12 },
        );
        targets.forEach((el) => {
          el.classList.add('reveal-fallback-hidden');
          io.observe(el);
        });
        cleanups.push(() => io.disconnect());
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, [activeView]);

  const navigate = (view) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const avgScore = quizHistory.length
    ? Math.round(quizHistory.reduce((acc, q) => acc + q.percent, 0) / quizHistory.length)
    : 0;

  const stats = {
    avgScore,
    quizzesTaken: quizHistory.length,
    tasksDone: tasks.filter((t) => t.done).length,
    totalTasks: tasks.length,
  };

  return (
    <div className="app-frame">
      <div id="scroll-progress" className="scroll-progress-bar" aria-hidden="true" />
      <Navbar
        activeView={activeView}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="sheet-main">
        {configError && (
          <div role="status" className="alert-banner alert-warning" style={{ marginBlockStart: '1rem' }}>
            Backend config check: {configError}
          </div>
        )}

        <div key={activeView} className="view-enter">
          {activeView === 'dashboard' && <DashboardView onNavigate={navigate} stats={stats} />}
          {activeView === 'study' && (
            <StudyAIView
              aiConfigured={siteConfig.aiConfigured}
              quizHistory={quizHistory}
              onRecordQuiz={(entry) => setQuizHistory((prev) => [entry, ...prev])}
            />
          )}
          {activeView === 'calculator' && <CalculatorView />}
          {activeView === 'tools' && <AIToolsView aiConfigured={siteConfig.aiConfigured} />}
          {activeView === 'esports' && <EsportsView links={siteConfig.links} />}
          {activeView === 'community' && (
            <CommunityView
              links={siteConfig.links}
              tasks={tasks}
              onAddTask={(t) => setTasks((prev) => [t, ...prev])}
              onToggleTask={(id) =>
                setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
              }
              onDeleteTask={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
            />
          )}
          {activeView === 'profile' && (
            <ProfileView
              profile={profile}
              onSaveProfile={setProfile}
              theme={theme}
              onToggleTheme={toggleTheme}
              quizHistory={quizHistory}
              onClearHistory={() => setQuizHistory([])}
            />
          )}
        </div>
      </main>

      <Footer onNavigate={navigate} links={siteConfig.links} />
      <MobileBottomNav activeView={activeView} onNavigate={navigate} />
    </div>
  );
}
