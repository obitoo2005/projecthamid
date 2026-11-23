import { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Gamepad2,
  Instagram,
  Loader2,
  MessageCircle,
  Radio,
  Send,
  ShieldCheck,
  Trophy,
  Users,
} from 'lucide-react';
import {
  ACADEMY_GUIDES,
  ESPORTS_NEWS,
  ESPORTS_SUBSECTIONS,
  LEADERBOARD_ROWS,
  SCRIMS_SCHEDULE,
  TEAMS_ROSTERS,
  TOURNAMENTS_DATA,
} from '../data/hubData';
import { submitBackendForm } from '../services/apiClient';

export default function EsportsView({ links }) {
  const [subTab, setSubTab] = useState('news');
  const [selectedScrim, setSelectedScrim] = useState(null);
  const [squadName, setSquadName] = useState('');
  const [iglTag, setIglTag] = useState('');
  const [scrimLoading, setScrimLoading] = useState(false);
  const [regStatus, setRegStatus] = useState('');
  const [regError, setRegError] = useState('');

  const [creatorName, setCreatorName] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [streamerLoading, setStreamerLoading] = useState(false);
  const [streamerMsg, setStreamerMsg] = useState('');
  const [streamerError, setStreamerError] = useState('');

  const dialogRef = useRef(null);

  const openScrimModal = (scrim) => {
    setSelectedScrim(scrim);
    setRegStatus('');
    setRegError('');
    dialogRef.current?.showModal();
  };

  const handleScrimSubmit = async (e) => {
    e.preventDefault();
    if (!squadName.trim() || !iglTag.trim()) return;
    setScrimLoading(true);
    setRegError('');
    setRegStatus('');
    try {
      const res = await submitBackendForm({
        type: 'scrim',
        tier: selectedScrim?.tier || 'Blitz Official Scrims',
        squadName: squadName.trim(),
        iglContact: iglTag.trim(),
      });
      setRegStatus(res.message);
      setSquadName('');
      setIglTag('');
    } catch (err) {
      setRegError(err.message);
    } finally {
      setScrimLoading(false);
    }
  };

  const handleStreamerSubmit = async (e) => {
    e.preventDefault();
    setStreamerLoading(true);
    setStreamerError('');
    setStreamerMsg('');
    try {
      const res = await submitBackendForm({
        type: 'streamer',
        creatorName: creatorName.trim(),
        channelUrl: channelUrl.trim(),
      });
      setStreamerMsg(res.message);
      setCreatorName('');
      setChannelUrl('');
    } catch (err) {
      setStreamerError(err.message);
    } finally {
      setStreamerLoading(false);
    }
  };

  const communityChannels = [
    {
      key: 'whatsapp',
      title: 'WhatsApp Community',
      desc: 'Daily scrim room IDs, pass alerts, and campus esports announcements.',
      cta: 'Join WhatsApp Community',
      icon: MessageCircle,
      iconColor: 'var(--accent-success)',
      btnClass: 'btn-primary',
    },
    {
      key: 'instagram',
      title: 'Official Instagram',
      desc: 'Match highlights, MVP posters, tournament brackets, and Blitz updates.',
      cta: 'Follow on Instagram',
      icon: Instagram,
      iconColor: 'var(--accent-warm)',
      btnClass: 'btn-dark',
    },
    {
      key: 'discord',
      title: 'Discord Server',
      desc: 'Voice lobbies, team verification, and scrim check-in channels.',
      cta: 'Join Discord Server',
      icon: Gamepad2,
      iconColor: 'var(--accent-primary)',
      btnClass: 'btn-primary',
    },
    {
      key: 'telegram',
      title: 'Telegram Channel',
      desc: 'Instant tournament schedules, bracket drops, and point tables.',
      cta: 'Join Telegram',
      icon: Send,
      iconColor: 'var(--accent-primary)',
      btnClass: 'btn-ghost',
    },
  ];

  return (
    <section className="workspace-view" aria-labelledby="esports-heading">
      <div className="view-header">
        <div className="stack-sm">
          <span className="status-chip status-chip-accent">04 · PUBG Mobile Competitive Hub</span>
          <h1 id="esports-heading" className="section-title">
            Esports Hub
          </h1>
          <p className="offer-desc">
            PUBG Mobile Esports updates, Blitz Official Scrims, backend-managed social channels,
            tournaments, team rosters, Esports Academy, Streamer Zone, and leaderboard standings.
          </p>
        </div>

        <div className="tab-row" role="tablist" aria-label="Esports subsections">
          {ESPORTS_SUBSECTIONS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className="tab-pill"
              aria-selected={subTab === tab.id}
              onClick={() => setSubTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {subTab === 'news' && (
        <div className="grid-3">
          {ESPORTS_NEWS.map((item) => (
            <article key={item.title} className="panel stack-sm reveal-on-scroll">
              <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
                <span className="status-chip status-chip-accent">{item.tag}</span>
                <span className="muted" style={{ fontSize: '0.78rem' }}>
                  {item.date}
                </span>
              </div>
              <h2 style={{ fontSize: '1.05rem' }}>{item.title}</h2>
              <p className="offer-desc">{item.summary}</p>
            </article>
          ))}
        </div>
      )}

      {subTab === 'scrims' && (
        <div className="grid-3">
          {SCRIMS_SCHEDULE.map((scrim) => (
            <article key={scrim.id} className="panel stack-md">
              <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
                <span className="status-chip status-chip-gold">{scrim.slots}</span>
                <span className="status-chip">{scrim.status}</span>
              </div>
              <div className="stack-sm">
                <h2 style={{ fontSize: '1.08rem' }}>{scrim.tier}</h2>
                <p className="muted" style={{ fontSize: '0.85rem' }}>
                  {scrim.time}
                </p>
                <p className="offer-desc">{scrim.maps}</p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={scrim.status === 'Full'}
                onClick={() => openScrimModal(scrim)}
              >
                {scrim.status === 'Full' ? 'Lobby Full' : 'Register Squad'}
              </button>
            </article>
          ))}
        </div>
      )}

      {subTab === 'communities' && (
        <div className="grid-2">
          {communityChannels.map((ch) => {
            const Icon = ch.icon;
            const url = links?.[ch.key] || '';
            return (
              <article key={ch.key} className="panel stack-md">
                <Icon size={24} color={ch.iconColor} aria-hidden="true" />
                <div className="stack-sm">
                  <h2 style={{ fontSize: '1.08rem' }}>{ch.title}</h2>
                  <p className="offer-desc">{ch.desc}</p>
                </div>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn ${ch.btnClass} btn-sm`}
                  >
                    {ch.cta}
                  </a>
                ) : (
                  <span className="status-chip">Official invite link coming soon</span>
                )}
              </article>
            );
          })}
        </div>
      )}

      {subTab === 'tournaments' && (
        <div className="grid-2">
          <div className="panel stack-md">
            <h2 style={{ fontSize: '1.1rem' }}>Upcoming Tournaments</h2>
            {TOURNAMENTS_DATA.upcoming.map((t) => (
              <div key={t.name} className="panel-soft stack-sm">
                <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
                  <strong>{t.name}</strong>
                  <span className="status-chip status-chip-accent">{t.status}</span>
                </div>
                <span className="muted" style={{ fontSize: '0.85rem' }}>
                  {t.date} · {t.format}
                </span>
                <strong style={{ color: 'var(--accent-success)', fontSize: '0.9rem' }}>
                  Prize Pool: {t.prize}
                </strong>
              </div>
            ))}
          </div>

          <div className="panel stack-md">
            <h2 style={{ fontSize: '1.1rem' }}>Previous Results</h2>
            {TOURNAMENTS_DATA.previous.map((t) => (
              <div key={t.name} className="panel-soft stack-sm">
                <strong>{t.name}</strong>
                <div className="row-wrap" style={{ fontSize: '0.85rem' }}>
                  <Trophy size={15} color="#eab308" aria-hidden="true" />
                  <span>
                    Winner: <strong>{t.winner}</strong> · Runner-up: {t.runnerUp}
                  </span>
                </div>
                <span className="muted" style={{ fontSize: '0.8rem' }}>
                  MVP: {t.mvp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'rosters' && (
        <div className="grid-2">
          {TEAMS_ROSTERS.map((team) => (
            <article key={team.team} className="panel stack-md">
              <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1.08rem' }}>{team.team}</h2>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>
                    {team.region}
                  </span>
                </div>
                <span className="status-chip status-chip-accent">{team.tag}</span>
              </div>
              <ul className="roster-grid">
                {team.players.map((p) => (
                  <li key={p.ign} className="panel-soft" style={{ padding: '0.55rem 0.75rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>{p.ign}</strong>
                    <div className="muted" style={{ fontSize: '0.75rem' }}>
                      {p.role}
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}

      {subTab === 'academy' && (
        <div className="grid-2">
          {ACADEMY_GUIDES.map((g) => (
            <article key={g.title} className="panel stack-md">
              <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
                <span className="status-chip status-chip-gold">{g.level}</span>
                <ShieldCheck size={18} color="var(--accent-primary)" aria-hidden="true" />
              </div>
              <h2 style={{ fontSize: '1.08rem' }}>{g.title}</h2>
              <ul className="stack-sm" style={{ paddingInlineStart: '1rem', listStyle: 'disc' }}>
                {g.drills.map((d) => (
                  <li key={d} className="offer-desc">
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}

      {subTab === 'streamers' && (
        <div className="grid-2">
          <div className="panel stack-md">
            <div className="row-wrap">
              <Radio size={20} color="var(--accent-warm)" aria-hidden="true" />
              <h2 style={{ fontSize: '1.1rem' }}>Streamer Zone &amp; Recruitment</h2>
            </div>
            <p className="offer-desc">
              Stream Blitz Official Scrims, campus cups, or study-with-me sessions. Approved
              creators receive lobby observer access, social shoutouts, and featured tags.
            </p>
            <ul className="stack-sm" style={{ paddingInlineStart: '1rem', listStyle: 'disc' }}>
              <li className="offer-desc">Minimum 720p60 stream stability on YouTube / TikTok / Kick</li>
              <li className="offer-desc">Clean comms &amp; fair-play community standards</li>
              <li className="offer-desc">Co-promotion with Blitz, Nice, Leader &amp; 56 Esports</li>
            </ul>
          </div>

          <form className="panel stack-md" onSubmit={handleStreamerSubmit}>
            <h2 style={{ fontSize: '1.08rem' }}>Apply as Blitz Creator</h2>
            <label className="stack-sm">
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Creator / Channel Name</span>
              <input
                className="input"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="e.g., BlitzGamingYT"
                required
              />
            </label>
            <label className="stack-sm">
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Channel URL</span>
              <input
                className="input"
                type="url"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
                required
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={streamerLoading}>
              {streamerLoading && <Loader2 size={15} className="spin" aria-hidden="true" />}
              <span>{streamerLoading ? 'Submitting...' : 'Submit Creator Application'}</span>
            </button>
            {streamerError && (
              <div role="alert" className="alert-banner alert-error">
                <AlertCircle size={15} aria-hidden="true" />
                <span>{streamerError}</span>
              </div>
            )}
            {streamerMsg && (
              <div role="status" className="alert-banner alert-success">
                <CheckCircle2 size={15} aria-hidden="true" />
                <span>{streamerMsg}</span>
              </div>
            )}
          </form>
        </div>
      )}

      {subTab === 'leaderboard' && (
        <div className="panel stack-md">
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Esports Leaderboard — Blitz Pro Circuit</h2>
            <span className="status-chip status-chip-gold">
              <Users size={13} aria-hidden="true" />
              <span>Top 6 Standings</span>
            </span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Squad</th>
                  <th>WWCD</th>
                  <th>Placement Pts</th>
                  <th>Finishes</th>
                  <th>Total Pts</th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD_ROWS.map((row) => (
                  <tr key={row.rank}>
                    <td className="mono">#{row.rank}</td>
                    <td>
                      <strong>{row.team}</strong>
                    </td>
                    <td className="mono">{row.wwcd}</td>
                    <td className="mono">{row.placement}</td>
                    <td className="mono">{row.finishes}</td>
                    <td>
                      <span className="status-chip status-chip-accent mono">{row.total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Native <dialog> for Scrim Registration */}
      <dialog ref={dialogRef} className="modal-dialog" closedby="any">
        <div className="stack-md">
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.15rem' }}>
              Register for {selectedScrim?.tier || 'Blitz Scrims'}
            </h2>
            <form method="dialog">
              <button type="submit" className="btn btn-ghost btn-sm">
                Close
              </button>
            </form>
          </div>

          <form className="stack-md" onSubmit={handleScrimSubmit}>
            <label className="stack-sm">
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Squad / Team Name</span>
              <input
                className="input"
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                placeholder="e.g., Blitz Alpha"
                required
              />
            </label>
            <label className="stack-sm">
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>IGL WhatsApp / Discord Tag</span>
              <input
                className="input"
                value={iglTag}
                onChange={(e) => setIglTag(e.target.value)}
                placeholder="e.g., +92 300 0000000 or @BLZxNova"
                required
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={scrimLoading}>
              {scrimLoading && <Loader2 size={15} className="spin" aria-hidden="true" />}
              <span>{scrimLoading ? 'Submitting...' : 'Confirm Slot Request'}</span>
            </button>
          </form>

          {regError && (
            <div role="alert" className="alert-banner alert-error">
              <AlertCircle size={15} aria-hidden="true" />
              <span>{regError}</span>
            </div>
          )}
          {regStatus && (
            <div role="status" className="alert-banner alert-success">
              <CheckCircle2 size={15} aria-hidden="true" />
              <span>{regStatus}</span>
            </div>
          )}
        </div>
      </dialog>
    </section>
  );
}
