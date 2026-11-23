import { BookOpen, Calculator, Gamepad2, Home, Users } from 'lucide-react';

const MOBILE_TABS = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'study', label: 'Study AI', icon: BookOpen },
  { id: 'calculator', label: 'Calc', icon: Calculator },
  { id: 'esports', label: 'Esports', icon: Gamepad2 },
  { id: 'community', label: 'Community', icon: Users },
];

export default function MobileBottomNav({ activeView, onNavigate }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
      {MOBILE_TABS.map((tab) => {
        const Icon = tab.icon;
        const isCurrent = activeView === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className="mobile-tab-btn"
            aria-current={isCurrent ? 'page' : undefined}
            onClick={() => onNavigate(tab.id)}
          >
            <Icon size={20} strokeWidth={isCurrent ? 2.4 : 1.9} aria-hidden="true" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
