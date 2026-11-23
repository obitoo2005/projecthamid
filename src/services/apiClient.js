/**
 * Frontend API client — communicates strictly with our Vercel/local backend.
 * Zero API keys and zero external social URLs are hardcoded in the frontend.
 */

export async function fetchSiteConfig() {
  const res = await fetch('/api/config', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload?.ok) {
    throw new Error(payload?.error || `Failed to load site configuration (${res.status})`);
  }
  return {
    aiConfigured: Boolean(payload.aiConfigured),
    links: payload.links || {
      instagram: '',
      whatsapp: '',
      discord: '',
      telegram: '',
      orgs: {},
    },
  };
}

export async function requestBackendAI({ task, sourceText, options = {} }) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, sourceText, options }),
  });

  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload?.ok) {
    throw new Error(
      payload?.error || `AI request failed with status ${res.status}. Please try again.`,
    );
  }
  return payload.data;
}

export async function submitBackendForm(data) {
  const res = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload?.ok) {
    throw new Error(payload?.error || `Submission failed (${res.status})`);
  }
  return payload;
}
