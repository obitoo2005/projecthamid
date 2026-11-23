import { useEffect, useRef } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { NAV_ITEMS } from '../data/hubData';

export default function Navbar({
  activeView,
  onNavigate,
  theme,
  onToggleTheme,
}) {
  const headerRef = useRef(null);
  const innerRef = useRef(null);
  const menuRef = useRef(null);
  const isWideRef = useRef(false);
  const lastCollapsedWidthRef = useRef(0);

  useEffect(() => {
    if (!Object.hasOwn(HTMLElement.prototype, 'popover')) {
      import('@oddbird/popover-polyfill').catch(() => {});
    }
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    const inner = innerRef.current;
    const menu = menuRef.current;
    if (!header || !inner || !menu) return;

    const measure = () => {
      const currentWidth = header.clientWidth;
      if (!isWideRef.current && currentWidth <= lastCollapsedWidthRef.current) {
        return;
      }

      const wasOpen = menu.matches(':popover-open') || menu.classList.contains(':popover-open');
      header.classList.add('is-measuring');
      header.classList.add('is-wide');
      menu.removeAttribute('popover');

      const fits = inner.scrollWidth <= inner.clientWidth;

      if (fits) {
        isWideRef.current = true;
        header.classList.add('is-wide');
        menu.removeAttribute('popover');
      } else {
        isWideRef.current = false;
        lastCollapsedWidthRef.current = currentWidth;
        header.classList.remove('is-wide');
        menu.setAttribute('popover', 'auto');
        if (wasOpen) {
          try {
            menu.showPopover?.();
          } catch {
            // noop
          }
        }
      }

      requestAnimationFrame(() => {
        header.classList.remove('is-measuring');
      });
    };

    let rafId = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };

    measure();
    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(header);
    ro.observe(menu);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const handleNavClick = (id) => {
    onNavigate(id);
    const menu = menuRef.current;
    if (menu && !isWideRef.current) {
      try {
        menu.hidePopover?.();
      } catch {
        // noop
      }
    }
  };

  return (
    <header ref={headerRef} className="site-header">
      <div ref={innerRef} className="header-inner">
        <a
          href="#dashboard"
          className="brand-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('dashboard');
          }}
        >
          <img
            src="/blitz-logo.jpg"
            alt="BLITZ AI Logo"
            className="brand-logo"
            width="38"
            height="38"
          />
          <span>
            BLITZ AI
            <span className="brand-sub">The Student Hub</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <button
            className="menu-button"
            type="button"
            popoverTarget="site-menu"
            popoverTargetAction="toggle"
            aria-controls="site-menu"
          >
            <Menu size={16} aria-hidden="true" />
            <span>Menu</span>
          </button>

          <ul id="site-menu" ref={menuRef} className="site-menu">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="nav-btn"
                  aria-current={activeView === item.id ? 'page' : undefined}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label={theme === 'light' ? 'Switch to Slate Dark theme' : 'Switch to Clean Light theme'}
            title={theme === 'light' ? 'Slate Dark Theme' : 'Clean Light Theme'}
            onClick={onToggleTheme}
          >
            {theme === 'light' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm desktop-only-cta"
            onClick={() => onNavigate('study')}
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
