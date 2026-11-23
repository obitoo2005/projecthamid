import { useEffect, useState } from 'react';
import {
  CheckSquare,
  Clock,
  ExternalLink,
  Megaphone,
  Plus,
  Trash2,
} from 'lucide-react';
import { COMMUNITY_ORGS } from '../data/hubData';
import SocialLinksBar from './SocialLinksBar';

const TIMER_MODES = [
  { id: 'focus', label: 'Focus 25m', seconds: 25 * 60 },
  { id: 'short', label: 'Short 5m', seconds: 5 * 60 },
  { id: 'long', label: 'Long 15m', seconds: 15 * 60 },
];

export default function CommunityView({
  links,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) {
  const [taskInput, setTaskInput] = useState('');
  const [taskDue, setTaskDue] = useState('Today');
  const [taskFilter, setTaskFilter] = useState('all');

  const [timerMode, setTimerMode] = useState('focus');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedSprints, setCompletedSprints] = useState(0);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setTimerRunning(false);
          if (timerMode === 'focus') setCompletedSprints((c) => c + 1);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerMode]);

  const switchTimerMode = (modeObj) => {
    setTimerRunning(false);
    setTimerMode(modeObj.id);
    setSecondsLeft(modeObj.seconds);
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    onAddTask({
      id: Date.now(),
      title: taskInput.trim(),
      due: taskDue,
      done: false,
    });
    setTaskInput('');
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'active') return !t.done;
    if (taskFilter === 'done') return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;
  const progressPct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <section className="workspace-view" aria-labelledby="community-heading">
      <div className="view-header">
        <div className="view-header-row">
          <div className="stack-sm">
            <span className="status-chip status-chip-accent">05 &amp; 06 · Productivity &amp; Blitz Orgs</span>
            <h1 id="community-heading" className="section-title">
              Blitz Community &amp; Study Planner
            </h1>
            <p className="offer-desc">
              Connect with Blitz Official Scrims, Nice Esports, Leader Esports, and 56 Esports —
              plus manage your daily tasks and Pomodoro focus timer.
            </p>
          </div>
          <SocialLinksBar links={links} />
        </div>
      </div>

      {/* Dedicated Blitz Community Orgs */}
      <div className="stack-md">
        <h2 style={{ fontSize: '1.2rem' }}>Featured Esports Communities</h2>
        <div className="grid-2">
          {COMMUNITY_ORGS.map((org) => {
            const orgUrl = links?.orgs?.[org.configKey] || '';
            return (
              <article key={org.name} className="panel stack-sm reveal-on-scroll">
                <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
                  <span className="status-chip status-chip-accent">{org.badge}</span>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>
                    {org.members}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem' }}>{org.name}</h3>
                <p className="offer-desc">{org.description}</p>
                {orgUrl && (
                  <a
                    href={orgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ marginBlockStart: '0.25rem' }}
                  >
                    <span>Visit Community</span>
                    <ExternalLink size={13} aria-hidden="true" />
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Student Productivity + Announcements */}
      <div className="grid-2">
        <div className="panel stack-md">
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <div className="row-wrap">
              <CheckSquare size={18} color="var(--accent-primary)" aria-hidden="true" />
              <h2 style={{ fontSize: '1.1rem' }}>Student Study Planner &amp; Tasks</h2>
            </div>
            <span className="status-chip">
              {doneCount} / {tasks.length} Done ({progressPct}%)
            </span>
          </div>

          <progress
            className="progress-bar"
            value={progressPct}
            max="100"
            aria-label="Task completion progress"
          />

          <form className="task-form" onSubmit={handleTaskSubmit}>
            <input
              className="input"
              placeholder="Add assignment, revision chapter, or scrim reminder..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <select
              className="select"
              style={{ inlineSize: 'auto' }}
              value={taskDue}
              onChange={(e) => setTaskDue(e.target.value)}
              aria-label="Reminder timing"
            >
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
              <option value="This Week">This Week</option>
            </select>
            <button type="submit" className="btn btn-primary btn-sm">
              <Plus size={15} aria-hidden="true" />
              <span>Add</span>
            </button>
          </form>

          <div className="tab-row" role="tablist" aria-label="Filter tasks">
            {['all', 'active', 'done'].map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                className="tab-pill"
                aria-selected={taskFilter === f}
                onClick={() => setTaskFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
              </button>
            ))}
          </div>

          {filteredTasks.length === 0 ? (
            <p className="muted" style={{ fontSize: '0.88rem' }}>
              No tasks in this view.
            </p>
          ) : (
            <ul className="stack-sm">
              {filteredTasks.map((t) => (
                <li
                  key={t.id}
                  className="panel-soft row-wrap"
                  style={{ justifyContent: 'space-between', padding: '0.6rem 0.85rem' }}
                >
                  <label className="row-wrap" style={{ cursor: 'pointer', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => onToggleTask(t.id)}
                    />
                    <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
                      {t.title}
                    </span>
                  </label>
                  <div className="row-wrap">
                    <span className="status-chip">{t.due}</span>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Remove ${t.title}`}
                      onClick={() => onDeleteTask(t.id)}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="stack-md">
          <div className="panel stack-md">
            <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
              <div className="row-wrap">
                <Clock size={18} color="var(--accent-warm)" aria-hidden="true" />
                <h2 style={{ fontSize: '1.1rem' }}>Focus Sprint Timer</h2>
              </div>
              <span className="status-chip status-chip-gold">
                {completedSprints} Sprints Done
              </span>
            </div>

            <div className="tab-row">
              {TIMER_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="tab-pill"
                  aria-pressed={timerMode === m.id}
                  onClick={() => switchTimerMode(m)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="calc-display" style={{ textAlign: 'center', placeItems: 'center' }}>
              <strong style={{ fontSize: '2.25rem', color: '#f5b800' }}>
                {mins}:{secs}
              </strong>
            </div>

            <div className="row-wrap">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setTimerRunning((r) => !r)}
              >
                {timerRunning ? 'Pause' : 'Start Focus'}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setTimerRunning(false);
                  const current = TIMER_MODES.find((m) => m.id === timerMode) || TIMER_MODES[0];
                  setSecondsLeft(current.seconds);
                }}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="panel stack-sm">
            <div className="row-wrap">
              <Megaphone size={18} color="var(--accent-primary)" aria-hidden="true" />
              <h2 style={{ fontSize: '1.08rem' }}>Community Announcements</h2>
            </div>
            <div className="panel-soft stack-sm" style={{ fontSize: '0.88rem' }}>
              <strong>BLITZ Campus Cup Registration Live</strong>
              <p className="muted">
                64 student &amp; competitive PUBG Mobile squads. Check Esports Hub for daily scrim slots.
              </p>
            </div>
            <div className="panel-soft stack-sm" style={{ fontSize: '0.88rem' }}>
              <strong>Backend-Secured AI Study Assistant</strong>
              <p className="muted">
                Upload PDF or DOCX notes to generate summaries, Urdu explanations, MCQs, and flashcards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
