import { useState } from 'react';
import { AlertCircle, Check, Copy, Loader2, Sparkles, Wrench } from 'lucide-react';
import { requestBackendAI } from '../services/apiClient';
import {
  analyzeTextStats,
  runFormatConverter,
  transformText,
} from '../utils/studentTools';

const AI_MODES = [
  { id: 'write', label: 'Writing Assistant' },
  { id: 'explain', label: 'Topic Explainer' },
  { id: 'summarize', label: 'Smart Summarizer' },
  { id: 'translate', label: 'Translator' },
];

export default function AIToolsView({ aiConfigured }) {
  const [section, setSection] = useState('utilities');

  // Non-AI Instant Utilities state
  const [utilText, setUtilText] = useState(
    'BLITZ AI combines fast deterministic student utilities with backend Gemini AI.\nUse instant word count, case formatting, and JSON/Base64 converters with zero AI latency.',
  );
  const [converterInput, setConverterInput] = useState('{"platform":"BLITZ AI","hub":"Student","ready":true}');
  const [converterMode, setConverterMode] = useState('jsonPretty');
  const [converterOutput, setConverterOutput] = useState('');
  const [converterError, setConverterError] = useState('');
  const [copiedId, setCopiedId] = useState('');

  // Backend AI Studio state
  const [aiMode, setAiMode] = useState('write');
  const [aiInput, setAiInput] = useState(
    'Artificial intelligence helps students review lectures faster, identify weak topics, and practice exam questions efficiently.',
  );
  const [language, setLanguage] = useState('English');
  const [targetLang, setTargetLang] = useState('Urdu');
  const [aiOutput, setAiOutput] = useState('');
  const [aiError, setAiError] = useState('');
  const [loading, setLoading] = useState(false);

  const stats = analyzeTextStats(utilText);

  const copyText = async (text, id) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 1800);
  };

  const handleConvert = (mode = converterMode) => {
    setConverterMode(mode);
    setConverterError('');
    try {
      setConverterOutput(runFormatConverter(converterInput, mode));
    } catch (err) {
      setConverterOutput('');
      setConverterError(err.message);
    }
  };

  const handleRunAI = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setLoading(true);
    setAiError('');
    try {
      const data = await requestBackendAI({
        task: 'tool',
        sourceText: aiInput,
        options: { mode: aiMode, language, targetLang },
      });
      setAiOutput(String(data));
    } catch (err) {
      setAiError(err.message || 'AI request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="workspace-view" aria-labelledby="tools-heading">
      <div className="view-header">
        <div className="view-header-row">
          <div className="stack-sm">
            <span className="status-chip status-chip-accent">03 · Instant Utilities + Backend AI</span>
            <h1 id="tools-heading" className="section-title">
              Student &amp; AI Tools
            </h1>
            <p className="offer-desc">
              Everyday text analysis, case formatting, and JSON/Base64/URL conversions run locally
              with zero AI requests. Writing, summarizing, explaining, and translation run on our
              secure Gemini backend.
            </p>
          </div>

          <div className="tab-row" role="tablist" aria-label="Tool category">
            <button
              type="button"
              role="tab"
              className="tab-pill"
              aria-selected={section === 'utilities'}
              onClick={() => setSection('utilities')}
            >
              <Wrench size={14} aria-hidden="true" />
              <span>Instant Utilities (No AI)</span>
            </button>
            <button
              type="button"
              role="tab"
              className="tab-pill"
              aria-selected={section === 'ai'}
              onClick={() => setSection('ai')}
            >
              <Sparkles size={14} aria-hidden="true" />
              <span>AI Studio (Gemini Backend)</span>
            </button>
          </div>
        </div>
      </div>

      {section === 'utilities' && (
        <div className="grid-2">
          {/* Non-AI Word Counter & Text Formatter */}
          <div className="panel stack-md">
            <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.08rem' }}>Text Analyzer &amp; Formatter</h2>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => copyText(utilText, 'util')}
              >
                {copiedId === 'util' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedId === 'util' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <textarea
              className="textarea"
              value={utilText}
              onChange={(e) => setUtilText(e.target.value)}
              placeholder="Paste text to analyze word count or format instantly..."
            />

            <div className="row-wrap">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setUtilText(transformText(utilText, 'title'))}
              >
                Title Case
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setUtilText(transformText(utilText, 'sentence'))}
              >
                Sentence case
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setUtilText(transformText(utilText, 'upper'))}
              >
                UPPER
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setUtilText(transformText(utilText, 'lower'))}
              >
                lower
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setUtilText(transformText(utilText, 'cleanSpaces'))}
              >
                Clean Spaces
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setUtilText(transformText(utilText, 'dedupeLines'))}
              >
                Dedupe Lines
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setUtilText(transformText(utilText, 'sortLines'))}
              >
                Sort A–Z
              </button>
            </div>

            <div className="stats-mini-grid">
              <div className="panel-soft">
                <span className="muted" style={{ fontSize: '0.74rem' }}>Words</span>
                <strong className="mono" style={{ display: 'block', fontSize: '1.15rem' }}>{stats.words}</strong>
              </div>
              <div className="panel-soft">
                <span className="muted" style={{ fontSize: '0.74rem' }}>Characters</span>
                <strong className="mono" style={{ display: 'block', fontSize: '1.15rem' }}>{stats.characters}</strong>
              </div>
              <div className="panel-soft">
                <span className="muted" style={{ fontSize: '0.74rem' }}>Sentences</span>
                <strong className="mono" style={{ display: 'block', fontSize: '1.15rem' }}>{stats.sentences}</strong>
              </div>
              <div className="panel-soft">
                <span className="muted" style={{ fontSize: '0.74rem' }}>Read Time</span>
                <strong className="mono" style={{ display: 'block', fontSize: '1.15rem' }}>{stats.readingMinutes}m</strong>
              </div>
            </div>
          </div>

          {/* Non-AI Format Converter */}
          <div className="panel stack-md">
            <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.08rem' }}>JSON / Base64 / URL Converter</h2>
              {converterOutput && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => copyText(converterOutput, 'conv')}
                >
                  {copiedId === 'conv' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedId === 'conv' ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <textarea
              className="textarea mono"
              value={converterInput}
              onChange={(e) => setConverterInput(e.target.value)}
              placeholder="Paste JSON, plain text, Base64, or URL string..."
            />

            <div className="row-wrap">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleConvert('jsonPretty')}
              >
                Pretty JSON
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleConvert('jsonMinify')}
              >
                Minify JSON
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleConvert('base64Encode')}
              >
                Base64 Encode
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleConvert('base64Decode')}
              >
                Base64 Decode
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleConvert('urlEncode')}
              >
                URL Encode
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleConvert('urlDecode')}
              >
                URL Decode
              </button>
            </div>

            {converterError && (
              <div role="alert" className="alert-banner alert-error">
                <AlertCircle size={16} aria-hidden="true" />
                <span>{converterError}</span>
              </div>
            )}

            <pre
              className="panel-soft mono"
              style={{
                margin: 0,
                minBlockSize: '8.5rem',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                fontSize: '0.84rem',
              }}
            >
              <code>{converterOutput || 'Choose a conversion button above to run instantly.'}</code>
            </pre>
          </div>
        </div>
      )}

      {section === 'ai' && (
        <div className="stack-md">
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <div className="tab-row">
              {AI_MODES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="tab-pill"
                  aria-pressed={aiMode === t.id}
                  onClick={() => setAiMode(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <span className={`status-chip ${aiConfigured ? 'status-chip-success' : 'status-chip-gold'}`}>
              {aiConfigured ? 'Gemini Backend Connected' : 'Server Key Pending'}
            </span>
          </div>

          <div className="grid-2">
            <form className="panel stack-md" onSubmit={handleRunAI}>
              <h2 style={{ fontSize: '1.08rem' }}>Input Text or Topic</h2>

              {aiMode === 'explain' && (
                <label className="stack-sm">
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Explanation Language</span>
                  <select
                    className="select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="English">Simple English</option>
                    <option value="Urdu">Simple Urdu (اردو)</option>
                  </select>
                </label>
              )}

              {aiMode === 'translate' && (
                <label className="stack-sm">
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Target Language</span>
                  <select
                    className="select"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                  >
                    <option value="Urdu">Urdu (اردو)</option>
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </label>
              )}

              <textarea
                className="textarea"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Paste an essay paragraph, topic to explain, or text to translate..."
              />

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <Loader2 size={15} className="spin" aria-hidden="true" />
                ) : (
                  <Sparkles size={15} aria-hidden="true" />
                )}
                <span>{loading ? 'Processing on Backend...' : 'Run Backend AI'}</span>
              </button>
            </form>

            <div className="panel stack-md">
              <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.08rem' }}>AI Result</h2>
                {aiOutput && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => copyText(aiOutput, 'ai')}
                  >
                    {copiedId === 'ai' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedId === 'ai' ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {aiError && (
                <div role="alert" className="alert-banner alert-error">
                  <AlertCircle size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
                  <span>{aiError}</span>
                </div>
              )}

              <div
                className={`panel-soft ${
                  (aiMode === 'explain' && language === 'Urdu') ||
                  (aiMode === 'translate' && targetLang === 'Urdu')
                    ? 'urdu-text'
                    : ''
                }`}
                style={{ minBlockSize: '11rem', whiteSpace: 'pre-wrap', fontSize: '0.92rem' }}
              >
                {aiOutput || 'Submit your input on the left to run Gemini analysis through our backend.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
