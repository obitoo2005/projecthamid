import { Gamepad2, Instagram, MessageCircle, Send } from 'lucide-react';

const SOCIAL_ITEMS = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, variant: 'btn-dark' },
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, variant: 'btn-primary' },
  { key: 'discord', label: 'Discord', icon: Gamepad2, variant: 'btn-ghost' },
  { key: 'telegram', label: 'Telegram', icon: Send, variant: 'btn-ghost' },
];

export default function SocialLinksBar({ links, compact = false }) {
  const configured = SOCIAL_ITEMS.filter((item) => Boolean(links?.[item.key]));

  if (!configured.length) {
    return (
      <div className="row-wrap" aria-label="Social links">
        {SOCIAL_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <span
              key={item.key}
              className="status-chip"
              title={`${item.label} link pending backend configuration`}
            >
              <Icon size={14} aria-hidden="true" />
              <span>{item.label}</span>
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="row-wrap" aria-label="Official social media links">
      {configured.map((item) => {
        const Icon = item.icon;
        const btnStyle = compact ? 'btn-ghost' : item.variant;
        return (
          <a
            key={item.key}
            href={links[item.key]}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn ${btnStyle} btn-sm`}
            aria-label={`Open BLITZ AI on ${item.label}`}
          >
            <Icon size={15} aria-hidden="true" />
            <span>{item.label}</span>
          </a>
        );
      })}
    </div>
  );
}
