import crypto from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};
  const type = String(body.type || '').trim();

  if (type !== 'scrim' && type !== 'streamer') {
    return res.status(400).json({ ok: false, error: 'Invalid submission type.' });
  }

  let record;
  if (type === 'scrim') {
    const tier = String(body.tier || '').trim();
    const squadName = String(body.squadName || '').trim();
    const iglContact = String(body.iglContact || '').trim();
    if (!tier || !squadName || !iglContact) {
      return res.status(400).json({
        ok: false,
        error: 'Squad name, scrim tier, and IGL contact are required.',
      });
    }
    record = { type, tier, squadName, iglContact };
  } else {
    const creatorName = String(body.creatorName || '').trim();
    const channelUrl = String(body.channelUrl || '').trim();
    if (!creatorName || !channelUrl) {
      return res.status(400).json({
        ok: false,
        error: 'Creator name and channel URL are required.',
      });
    }
    try {
      const parsed = new URL(channelUrl);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        throw new Error('bad protocol');
      }
    } catch {
      return res.status(400).json({
        ok: false,
        error: 'Please enter a valid http:// or https:// channel link.',
      });
    }
    record = { type, creatorName, channelUrl };
  }

  const id = `BLZ-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const receivedAt = new Date().toISOString();

  // Optional webhook forwarding configured via Vercel Environment Variables
  const webhookUrl = (process.env.SUBMISSIONS_WEBHOOK_URL || '').trim();
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `[BLITZ AI ${type.toUpperCase()} ${id}] ${JSON.stringify(record)}`,
          submission: { id, receivedAt, ...record },
        }),
      });
    } catch {
      // Do not fail user confirmation if optional webhook is unreachable
    }
  }

  return res.status(200).json({
    ok: true,
    id,
    receivedAt,
    message:
      type === 'scrim'
        ? `Registration #${id} confirmed for ${record.squadName} (${record.tier}).`
        : `Creator application #${id} received for ${record.creatorName}.`,
  });
}

function safeJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}
