import SocialLinksBar from './SocialLinksBar';

export default function Footer({ onNavigate, links }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="stack-sm">
            <div className="row-wrap">
              <img
                src="/blitz-logo.jpg"
                alt="BLITZ AI Logo"
                className="brand-logo"
                width="38"
                height="38"
                loading="lazy"
              />
              <div>
                <strong>BLITZ AI</strong>
                <span className="brand-sub">The Student Hub</span>
              </div>
            </div>
            <p className="offer-desc" style={{ maxInlineSize: '25rem' }}>
              One unified student platform combining backend-powered AI study assistance, instant
              math and text utilities, productivity planning, and PUBG Mobile esports communities.
            </p>
          </div>

          <div className="footer-columns">
            <div className="stack-sm">
              <strong>Platform</strong>
              <ul className="stack-sm" style={{ gap: '0.35rem' }}>
                <li>
                  <button type="button" className="footer-link" onClick={() => onNavigate('study')}>
                    AI Study Assistant
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link" onClick={() => onNavigate('calculator')}>
                    Smart Calculator &amp; GPA
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link" onClick={() => onNavigate('tools')}>
                    Student &amp; AI Tools
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link" onClick={() => onNavigate('profile')}>
                    Student Profile
                  </button>
                </li>
              </ul>
            </div>

            <div className="stack-sm">
              <strong>Esports &amp; Community</strong>
              <ul className="stack-sm" style={{ gap: '0.35rem' }}>
                <li>
                  <button type="button" className="footer-link" onClick={() => onNavigate('esports')}>
                    PUBG Mobile Hub
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link" onClick={() => onNavigate('community')}>
                    Blitz Official Scrims
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link" onClick={() => onNavigate('community')}>
                    Nice / Leader / 56 Esports
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} BLITZ AI — The Student Hub. All rights reserved.</span>
          <SocialLinksBar links={links} compact />
        </div>
      </div>
    </footer>
  );
}
