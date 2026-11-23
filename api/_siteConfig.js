/**
 * Central backend-managed links configuration.
 * All external social & community URLs are resolved strictly on the backend.
 * Vercel Environment Variables automatically override these defaults when set.
 */

const BACKEND_DEFAULT_LINKS = {
  instagram: 'https://www.instagram.com/blitzoffical.scrims?gwpx=MTV4Y2pnZmoyY24zeA==',
  whatsapp: 'https://chat.whatsapp.com/GA08YwCQYyl9wRzA5Kh0OU',
  discord: 'https://discord.gg/WX4SU7jX',
  telegram: '',
  blitzScrims: 'https://chat.whatsapp.com/GA08YwCQYyl9wRzA5Kh0OU',
  niceEsports: '',
  leaderEsports: '',
  esports56: '',
};

function normalizeUrl(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return '';
  } catch {
    return '';
  }
}

export function getPublicSiteConfig(env = process.env) {
  const whatsapp = normalizeUrl(env.WHATSAPP_URL || BACKEND_DEFAULT_LINKS.whatsapp);
  return {
    aiConfigured: Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim()),
    links: {
      instagram: normalizeUrl(env.INSTAGRAM_URL || BACKEND_DEFAULT_LINKS.instagram),
      whatsapp,
      discord: normalizeUrl(env.DISCORD_URL || BACKEND_DEFAULT_LINKS.discord),
      telegram: normalizeUrl(env.TELEGRAM_URL || BACKEND_DEFAULT_LINKS.telegram),
      orgs: {
        blitzScrims: normalizeUrl(env.BLITZ_SCRIMS_URL || BACKEND_DEFAULT_LINKS.blitzScrims || whatsapp),
        niceEsports: normalizeUrl(env.NICE_ESPORTS_URL || BACKEND_DEFAULT_LINKS.niceEsports),
        leaderEsports: normalizeUrl(env.LEADER_ESPORTS_URL || BACKEND_DEFAULT_LINKS.leaderEsports),
        esports56: normalizeUrl(env.ESPORTS_56_URL || BACKEND_DEFAULT_LINKS.esports56),
      },
    },
  };
}
