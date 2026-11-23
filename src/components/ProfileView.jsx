import { useState } from 'react';
import { Award, CheckCircle2, Palette, Trash2, User } from 'lucide-react';

export default function ProfileView({
  profile,
  onSaveProfile,
  theme,
  onToggleTheme,
  quizHistory,
  onClearHistory,
}) {
  const [formProfile, setFormProfile] = useState(profile);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    onSaveProfile({
      name: formProfile.name.trim() || 'Student Challenger',
      school: formProfile.school.trim() || 'University / College',
      ign: formProfile.ign.trim() || 'BLZxPlayer',
    });
    setSavedMsg('Profile saved.');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const avgScore = quizHistory.length
    ? Math.round(quizHistory.reduce((acc, q) => acc + q.percent, 0) / quizHistory.length)
    : 0;

  return (
    <section className="workspace-view" aria-labelledby="profile-heading">
      <div className="view-header">
        <div className="view-header-row">
          <div className="stack-sm">
            <span className="status-chip status-chip-accent">Account · Preferences · Progress</span>
            <h1 id="profile-heading" className="section-title">
              Student Profile
            </h1>
            <p className="offer-desc">
              Manage your student identity, PUBG Mobile squad tag, display theme, and study quiz
              progress.
            </p>
          </div>

          <button type="button" className="btn btn-dark btn-sm" onClick={onToggleTheme}>
            <Palette size={15} aria-hidden="true" />
            <span>Theme: {theme === 'light' ? 'Clean Light' : 'Slate Dark'}</span>
          </button>
        </div>
      </div>

      <div className="grid-2">
        <form className="panel stack-md" onSubmit={handleSave}>
          <div className="row-wrap">
            <User size={18} color="var(--accent-primary)" aria-hidden="true" />
            <h2 style={{ fontSize: '1.1rem' }}>Student &amp; Squad Identity</h2>
          </div>

          <label className="stack-sm">
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Full Name</span>
            <input
              className="input"
              value={formProfile.name}
              onChange={(e) => setFormProfile({ ...formProfile, name: e.target.value })}
            />
          </label>

          <label className="stack-sm">
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>University / College</span>
            <input
              className="input"
              value={formProfile.school}
              onChange={(e) => setFormProfile({ ...formProfile, school: e.target.value })}
            />
          </label>

          <label className="stack-sm">
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>PUBG Mobile IGN &amp; Role</span>
            <input
              className="input"
              value={formProfile.ign}
              onChange={(e) => setFormProfile({ ...formProfile, ign: e.target.value })}
            />
          </label>

          <div className="row-wrap">
            <button type="submit" className="btn btn-primary btn-sm">
              Save Profile
            </button>
            {savedMsg && (
              <span className="status-chip status-chip-success">
                <CheckCircle2 size={14} aria-hidden="true" />
                <span>{savedMsg}</span>
              </span>
            )}
          </div>
        </form>

        <div className="panel stack-md">
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <div className="row-wrap">
              <Award size={18} color="var(--accent-primary)" aria-hidden="true" />
              <h2 style={{ fontSize: '1.1rem' }}>Learning Progress</h2>
            </div>
            {quizHistory.length > 0 && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={onClearHistory}>
                <Trash2 size={14} aria-hidden="true" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            <div className="panel-soft">
              <span className="muted" style={{ fontSize: '0.78rem' }}>Practice Tests</span>
              <strong className="bento-value mono" style={{ display: 'block' }}>
                {quizHistory.length}
              </strong>
            </div>
            <div className="panel-soft">
              <span className="muted" style={{ fontSize: '0.78rem' }}>Average Score</span>
              <strong className="bento-value mono" style={{ display: 'block', color: 'var(--accent-primary)' }}>
                {quizHistory.length ? `${avgScore}%` : '—'}
              </strong>
            </div>
          </div>

          {quizHistory.length === 0 ? (
            <p className="offer-desc">
              Complete practice tests inside Study AI to see your recent chapters and score trend
              here.
            </p>
          ) : (
            <ul className="stack-sm">
              {quizHistory.slice(0, 5).map((q, idx) => (
                <li
                  key={idx}
                  className="panel-soft row-wrap"
                  style={{ justifyContent: 'space-between', padding: '0.6rem 0.85rem', fontSize: '0.86rem' }}
                >
                  <span>{q.topic}</span>
                  <strong className="mono">{q.score}/{q.total} ({q.percent}%)</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
