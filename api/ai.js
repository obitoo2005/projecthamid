const ALLOWED_TASKS = new Set([
  'summary',
  'qa',
  'mcqs',
  'questions',
  'explain',
  'flashcards',
  'tool',
]);

function buildPrompt(task, sourceText, options = {}) {
  if (task === 'summary') {
    return {
      expectJson: false,
      prompt: `Summarize these student notes clearly with a short title, 5 key terms, and crisp bullet-point exam takeaways.\n\nNOTES:\n${sourceText}`,
    };
  }

  if (task === 'explain') {
    const lang = options.language === 'Urdu' ? 'Urdu' : 'English';
    return {
      expectJson: false,
      prompt:
        lang === 'Urdu'
          ? `Explain the difficult concepts in these notes in very simple, clear Urdu (اردو) suitable for a student, using short headings and 1 relatable everyday example.\n\nNOTES:\n${sourceText}`
          : `Explain the difficult concepts in these notes in simple, clear English with an everyday analogy and key exam tips.\n\nNOTES:\n${sourceText}`,
    };
  }

  if (task === 'qa') {
    const question = String(options.question || '').trim();
    return {
      expectJson: false,
      prompt: `Answer the student's question accurately using the provided study document. If the document does not contain the answer, clearly state that.\n\nQUESTION: ${question}\n\nDOCUMENT:\n${sourceText}`,
    };
  }

  if (task === 'mcqs') {
    return {
      expectJson: true,
      prompt: `Create 4 exam-quality multiple choice questions from the notes. Return ONLY a valid JSON array of objects matching: {"question": string, "options": [string, string, string, string], "correctIndex": number (0-3), "explanation": string}.\n\nNOTES:\n${sourceText}`,
    };
  }

  if (task === 'questions') {
    return {
      expectJson: true,
      prompt: `Create 3 short questions and 2 long exam questions with concise model answers from the notes. Return ONLY a valid JSON object matching: {"shortQuestions": [{"q": string, "a": string}], "longQuestions": [{"q": string, "a": string}]}.\n\nNOTES:\n${sourceText}`,
    };
  }

  if (task === 'flashcards') {
    return {
      expectJson: true,
      prompt: `Convert these study notes into 5 revision flashcards. Return ONLY a valid JSON array of objects matching: {"front": string, "back": string}.\n\nNOTES:\n${sourceText}`,
    };
  }

  // task === 'tool'
  const mode = options.mode || 'write';
  if (mode === 'summarize') {
    return {
      expectJson: false,
      prompt: `Summarize the following text into clear, high-impact study bullet points:\n\n${sourceText}`,
    };
  }
  if (mode === 'translate') {
    const targetLang = String(options.targetLang || 'Urdu').slice(0, 40);
    return {
      expectJson: false,
      prompt: `Translate the following text naturally and accurately into ${targetLang}:\n\n${sourceText}`,
    };
  }
  if (mode === 'explain') {
    const lang = options.language === 'Urdu' ? 'Urdu (اردو)' : 'simple English';
    return {
      expectJson: false,
      prompt: `Explain the following topic clearly in ${lang} for a student, using short steps and an example:\n\n${sourceText}`,
    };
  }
  return {
    expectJson: false,
    prompt: `Improve the grammar, clarity, and academic structure of the following student writing while keeping the author's meaning:\n\n${sourceText}`,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  const primaryModel = (process.env.GEMINI_MODEL || 'gemini-flash-lite-latest').trim();
  const candidateModels = [...new Set([
    primaryModel,
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
    'gemini-3.6-flash',
  ].filter(Boolean))];
  // Include a quick second attempt on primary if the first pass hits a momentary 503 spike
  const attemptPlan = [...candidateModels, primaryModel];

  if (!apiKey) {
    return res.status(503).json({
      ok: false,
      code: 'AI_NOT_CONFIGURED',
      error:
        'Gemini AI is not configured on the server yet. Add GEMINI_API_KEY in Vercel Environment Variables (or local .env) and redeploy/restart.',
    });
  }

  const body = typeof req.body === 'string' ? safeJsonParse(req.body) : req.body || {};
  const task = String(body.task || '').trim();
  const sourceText = String(body.sourceText || '').trim();
  const options = body.options && typeof body.options === 'object' ? body.options : {};

  if (!ALLOWED_TASKS.has(task)) {
    return res.status(400).json({ ok: false, error: 'Unsupported AI task.' });
  }

  if (!sourceText || sourceText.length < 5) {
    return res.status(400).json({ ok: false, error: 'Please provide at least a short text or document.' });
  }

  if (task === 'qa' && !String(options.question || '').trim()) {
    return res.status(400).json({ ok: false, error: 'Please enter a question to ask about your document.' });
  }

  const boundedText = sourceText.slice(0, 16000);
  const { prompt, expectJson } = buildPrompt(task, boundedText, options);

  let lastError = 'Gemini service unavailable.';

  for (let i = 0; i < attemptPlan.length; i += 1) {
    const model = attemptPlan[i];
    if (i > 0) await new Promise((r) => setTimeout(r, 400));
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
      const upstream = await fetch(endpoint, {
        method: 'POST',
        signal: AbortSignal.timeout(12000),
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.35,
          },
        }),
      });

      if (!upstream.ok) {
        let detail = `Upstream status ${upstream.status}`;
        try {
          const errJson = await upstream.json();
          if (errJson?.error?.message) detail = errJson.error.message;
        } catch {
          // keep generic status message
        }
        lastError = `Gemini service request failed: ${detail}`;
        // Retry next fallback model on transient capacity/rate/model availability errors
        if (upstream.status === 503 || upstream.status === 429 || upstream.status === 404 || upstream.status === 400) {
          continue;
        }
        return res.status(502).json({ ok: false, error: lastError });
      }

      const payload = await upstream.json();
      const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!rawText) {
        lastError = 'Gemini returned an empty response. Please try again with clearer input.';
        continue;
      }

      if (expectJson) {
        const parsed = extractJsonPayload(rawText);
        if (!parsed) {
          lastError = 'AI returned malformed structured data. Please retry.';
          continue;
        }
        return res.status(200).json({ ok: true, modelUsed: model, data: parsed });
      }

      return res.status(200).json({ ok: true, modelUsed: model, data: rawText.trim() });
    } catch (err) {
      lastError = `Unable to reach Gemini backend service: ${err.message || 'Network error'}`;
    }
  }

  return res.status(502).json({ ok: false, error: lastError });
}

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function extractJsonPayload(rawText) {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  const direct = safeJsonParse(cleaned);
  if (direct) return direct;

  const arrStart = cleaned.indexOf('[');
  const arrEnd = cleaned.lastIndexOf(']');
  if (arrStart !== -1 && arrEnd > arrStart) {
    const parsedArr = safeJsonParse(cleaned.slice(arrStart, arrEnd + 1));
    if (parsedArr) return parsedArr;
  }

  const objStart = cleaned.indexOf('{');
  const objEnd = cleaned.lastIndexOf('}');
  if (objStart !== -1 && objEnd > objStart) {
    const parsedObj = safeJsonParse(cleaned.slice(objStart, objEnd + 1));
    if (parsedObj) return parsedObj;
  }

  return null;
}
