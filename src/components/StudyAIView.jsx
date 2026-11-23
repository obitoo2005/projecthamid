import { useState } from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  FileUp,
  HelpCircle,
  Languages,
  Layers,
  ListChecks,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_CHAPTERS } from '../data/hubData';
import { extractDocumentText } from '../services/documentParser';
import { requestBackendAI } from '../services/apiClient';

const STUDY_MODES = [
  { id: 'summary', label: 'Chapter Summary', icon: BookOpen },
  { id: 'qa', label: 'Ask Document', icon: HelpCircle },
  { id: 'mcqs', label: 'MCQs & Practice Test', icon: ListChecks },
  { id: 'questions', label: 'Short & Long Qs', icon: Sparkles },
  { id: 'explain', label: 'English / Urdu Explain', icon: Languages },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
];

export default function StudyAIView({ aiConfigured, quizHistory, onRecordQuiz }) {
  const [docTitle, setDocTitle] = useState(SAMPLE_CHAPTERS[0].title);
  const [notes, setNotes] = useState(SAMPLE_CHAPTERS[0].content);
  const [activeMode, setActiveMode] = useState('summary');
  const [extracting, setExtracting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [summaryText, setSummaryText] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [qaMessages, setQaMessages] = useState([]);
  const [explainLang, setExplainLang] = useState('English');
  const [explainText, setExplainText] = useState('');

  const [mcqs, setMcqs] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const [qaPairs, setQaPairs] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    setStatusNote('');
    setExtracting(true);
    try {
      const text = await extractDocumentText(file);
      if (!text) throw new Error('No readable text found inside this file.');
      setDocTitle(file.name);
      setNotes(text);
      setStatusNote(`Extracted "${file.name}" (${text.length.toLocaleString()} characters) locally.`);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setExtracting(false);
      e.target.value = '';
    }
  };

  const runStudyAction = async (mode, extra = {}) => {
    if (!notes.trim()) {
      setErrorMsg('Please upload a PDF/DOCX or paste your study notes first.');
      return;
    }
    setErrorMsg('');
    setStatusNote('');
    setLoading(true);

    try {
      const data = await requestBackendAI({
        task: mode,
        sourceText: notes,
        options: extra,
      });

      if (mode === 'summary') setSummaryText(String(data));
      if (mode === 'explain') setExplainText(String(data));
      if (mode === 'qa') {
        setQaMessages((prev) => [...prev, { q: extra.question, a: String(data) }]);
        setQuestionInput('');
      }
      if (mode === 'mcqs') {
        if (!Array.isArray(data) || !data.length) {
          throw new Error('AI did not return valid MCQ items. Please try again.');
        }
        setMcqs(data);
        setSelectedAnswers({});
        setQuizResult(null);
      }
      if (mode === 'questions') setQaPairs(data);
      if (mode === 'flashcards') {
        if (!Array.isArray(data) || !data.length) {
          throw new Error('AI did not return valid flashcards. Please try again.');
        }
        setFlashcards(data);
        setCardIndex(0);
        setCardFlipped(false);
        setMasteredCount(0);
      }
      setStatusNote('Generated securely via BLITZ AI Gemini backend.');
    } catch (err) {
      setErrorMsg(err.message || 'Backend AI request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = () => {
    if (!mcqs.length) return;
    let correct = 0;
    mcqs.forEach((item, idx) => {
      if (selectedAnswers[idx] === item.correctIndex) correct += 1;
    });
    const percent = Math.round((correct / mcqs.length) * 100);
    setQuizResult({ correct, total: mcqs.length, percent });
    onRecordQuiz({
      topic: docTitle,
      score: correct,
      total: mcqs.length,
      percent,
      date: new Date().toLocaleDateString(),
    });
  };

  const avgQuiz = quizHistory.length
    ? Math.round(quizHistory.reduce((acc, q) => acc + q.percent, 0) / quizHistory.length)
    : 0;

  return (
    <section className="workspace-view" aria-labelledby="study-heading">
      <div className="view-header">
        <div className="view-header-row">
          <div className="stack-sm">
            <div className="row-wrap">
              <span className="status-chip status-chip-accent">01 · Backend Gemini AI</span>
              <span className={`status-chip ${aiConfigured ? 'status-chip-success' : 'status-chip-gold'}`}>
                {aiConfigured ? 'AI Service Ready' : 'Server Key Pending'}
              </span>
            </div>
            <h1 id="study-heading" className="section-title">
              AI Study Assistant
            </h1>
            <p className="offer-desc">
              Upload PDF, DOCX, or class notes (parsed locally) and run real Gemini AI analysis on
              our secure backend for summaries, document Q&amp;A, MCQs, exam questions, English/Urdu
              explanations, and revision flashcards.
            </p>
          </div>

          <div className="panel-soft" style={{ minInlineSize: '13.5rem' }}>
            <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>
                Quiz Mastery
              </span>
              <Award size={16} color="var(--accent-primary)" aria-hidden="true" />
            </div>
            <strong style={{ fontSize: '1.35rem' }}>
              {quizHistory.length ? `${avgQuiz}% Avg` : 'No Tests Yet'}
            </strong>
            <div className="muted" style={{ fontSize: '0.78rem' }}>
              {quizHistory.length} practice tests logged
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left: Document & Notes Uploader (Local Non-AI extraction) */}
        <div className="panel stack-md">
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.1rem' }}>1. Upload or Paste Study Material</h2>
            <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
              {extracting ? (
                <Loader2 size={15} className="spin" aria-hidden="true" />
              ) : (
                <FileUp size={15} aria-hidden="true" />
              )}
              <span>{extracting ? 'Extracting...' : 'Upload PDF / DOCX / TXT'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt,.md,.csv"
                onChange={handleFileUpload}
                disabled={extracting}
                hidden
              />
            </label>
          </div>

          <div className="stack-sm">
            <span className="muted" style={{ fontSize: '0.8rem' }}>
              Quick Sample Chapters:
            </span>
            <div className="tab-row">
              {SAMPLE_CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  className="tab-pill"
                  aria-pressed={docTitle === ch.title}
                  onClick={() => {
                    setDocTitle(ch.title);
                    setNotes(ch.content);
                    setErrorMsg('');
                    setStatusNote(`Loaded sample chapter: ${ch.title}`);
                  }}
                >
                  {ch.title.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="stack-sm">
            <label htmlFor="study-title" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Chapter / Document Title
            </label>
            <input
              id="study-title"
              className="input"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
            />
          </div>

          <div className="stack-sm">
            <label htmlFor="study-notes" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Extracted Text or Notes ({notes.length.toLocaleString()} chars)
            </label>
            <textarea
              id="study-notes"
              className="textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste lecture notes or upload a PDF/DOCX file above..."
            />
          </div>

          {errorMsg && (
            <div role="alert" className="alert-banner alert-error">
              <AlertCircle size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}
          {statusNote && !errorMsg && (
            <p className="status-chip status-chip-accent">{statusNote}</p>
          )}
        </div>

        {/* Right: Backend AI Study Actions */}
        <div className="panel stack-md">
          <h2 style={{ fontSize: '1.1rem' }}>2. AI Study Actions</h2>

          <div className="tab-row" role="tablist" aria-label="Study AI tools">
            {STUDY_MODES.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  className="tab-pill"
                  aria-selected={activeMode === m.id}
                  onClick={() => setActiveMode(m.id)}
                >
                  <Icon size={14} aria-hidden="true" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {activeMode === 'summary' && (
            <div className="stack-md">
              <button
                type="button"
                className="btn btn-primary"
                disabled={loading}
                onClick={() => runStudyAction('summary')}
              >
                {loading && <Loader2 size={15} className="spin" aria-hidden="true" />}
                <span>{loading ? 'Analyzing with Gemini...' : 'Generate Chapter Summary'}</span>
              </button>
              {summaryText && (
                <div className="panel-soft" style={{ whiteSpace: 'pre-wrap', fontSize: '0.92rem' }}>
                  {summaryText}
                </div>
              )}
            </div>
          )}

          {activeMode === 'qa' && (
            <div className="stack-md">
              <form
                className="row-wrap"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!questionInput.trim()) return;
                  runStudyAction('qa', { question: questionInput.trim() });
                }}
              >
                <input
                  className="input"
                  style={{ flex: '1 1 200px' }}
                  placeholder="Ask any question from your uploaded document..."
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading && <Loader2 size={15} className="spin" aria-hidden="true" />}
                  <span>Ask AI</span>
                </button>
              </form>
              <div className="stack-sm">
                {qaMessages.map((item, idx) => (
                  <div key={idx} className="panel-soft stack-sm">
                    <strong>Q: {item.q}</strong>
                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMode === 'mcqs' && (
            <div className="stack-md">
              <button
                type="button"
                className="btn btn-primary"
                disabled={loading}
                onClick={() => runStudyAction('mcqs')}
              >
                {loading && <Loader2 size={15} className="spin" aria-hidden="true" />}
                <span>{loading ? 'Building Practice Test...' : 'Generate MCQs & Practice Test'}</span>
              </button>

              {mcqs.length > 0 && (
                <div className="stack-md">
                  {mcqs.map((q, qIdx) => (
                    <fieldset key={qIdx} className="mcq-card">
                      <legend className="mcq-legend">
                        {qIdx + 1}. {q.question}
                      </legend>
                      {q.options.map((opt, oIdx) => {
                        const chosen = selectedAnswers[qIdx] === oIdx;
                        const isCorrect = quizResult && oIdx === q.correctIndex;
                        const isWrong = quizResult && chosen && oIdx !== q.correctIndex;
                        return (
                          <label
                            key={oIdx}
                            className="mcq-option"
                            style={{
                              background: isCorrect
                                ? 'rgb(22 163 74 / 0.14)'
                                : isWrong
                                  ? 'rgb(220 38 38 / 0.14)'
                                  : undefined,
                            }}
                          >
                            <input
                              type="radio"
                              name={`mcq-${qIdx}`}
                              checked={chosen}
                              disabled={Boolean(quizResult)}
                              onChange={() =>
                                setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                              }
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                      {quizResult && (
                        <p className="muted" style={{ fontSize: '0.8rem' }}>
                          Explanation: {q.explanation}
                        </p>
                      )}
                    </fieldset>
                  ))}

                  {!quizResult ? (
                    <button type="button" className="btn btn-dark" onClick={handleSubmitQuiz}>
                      Submit Practice Test &amp; Save Score
                    </button>
                  ) : (
                    <div className="alert-banner alert-success">
                      Scored <strong>{quizResult.correct} / {quizResult.total}</strong> ({quizResult.percent}%) — saved to Learning Progress.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeMode === 'questions' && (
            <div className="stack-md">
              <button
                type="button"
                className="btn btn-primary"
                disabled={loading}
                onClick={() => runStudyAction('questions')}
              >
                {loading && <Loader2 size={15} className="spin" aria-hidden="true" />}
                <span>{loading ? 'Generating Exam Questions...' : 'Generate Short & Long Questions'}</span>
              </button>
              {qaPairs && (
                <div className="stack-md">
                  <div className="stack-sm">
                    <h3 style={{ fontSize: '0.98rem' }}>Short Questions</h3>
                    {qaPairs.shortQuestions?.map((item, i) => (
                      <details key={i} className="study-details">
                        <summary>{item.q}</summary>
                        <p className="offer-desc">{item.a}</p>
                      </details>
                    ))}
                  </div>
                  <div className="stack-sm">
                    <h3 style={{ fontSize: '0.98rem' }}>Long Questions</h3>
                    {qaPairs.longQuestions?.map((item, i) => (
                      <details key={i} className="study-details">
                        <summary>{item.q}</summary>
                        <p className="offer-desc">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeMode === 'explain' && (
            <div className="stack-md">
              <div className="row-wrap">
                <button
                  type="button"
                  className="tab-pill"
                  aria-pressed={explainLang === 'English'}
                  onClick={() => setExplainLang('English')}
                >
                  Simple English
                </button>
                <button
                  type="button"
                  className="tab-pill"
                  aria-pressed={explainLang === 'Urdu'}
                  onClick={() => setExplainLang('Urdu')}
                >
                  Simple Urdu (اردو)
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={loading}
                  onClick={() => runStudyAction('explain', { language: explainLang })}
                >
                  {loading && <Loader2 size={14} className="spin" aria-hidden="true" />}
                  <span>{loading ? 'Explaining...' : `Explain in ${explainLang}`}</span>
                </button>
              </div>
              {explainText && (
                <div
                  className={`panel-soft ${explainLang === 'Urdu' ? 'urdu-text' : ''}`}
                  lang={explainLang === 'Urdu' ? 'ur' : 'en'}
                  style={{ whiteSpace: 'pre-wrap', fontSize: '0.94rem' }}
                >
                  {explainText}
                </div>
              )}
            </div>
          )}

          {activeMode === 'flashcards' && (
            <div className="stack-md">
              <button
                type="button"
                className="btn btn-primary"
                disabled={loading}
                onClick={() => runStudyAction('flashcards')}
              >
                {loading && <Loader2 size={15} className="spin" aria-hidden="true" />}
                <span>{loading ? 'Creating Flashcards...' : 'Convert Notes to Flashcards'}</span>
              </button>

              {flashcards.length > 0 && (
                <div className="stack-md">
                  <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
                    <span className="status-chip">
                      Card {cardIndex + 1} of {flashcards.length}
                    </span>
                    <span className="status-chip status-chip-accent">
                      Mastered: {masteredCount}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="flashcard"
                    onClick={() => setCardFlipped((f) => !f)}
                    aria-label="Flip flashcard"
                  >
                    <span className="muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      {cardFlipped ? 'Answer / Definition (Click to flip)' : 'Prompt (Click to reveal answer)'}
                    </span>
                    <strong style={{ fontSize: '1.05rem' }}>
                      {cardFlipped ? flashcards[cardIndex].back : flashcards[cardIndex].front}
                    </strong>
                  </button>

                  <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setCardFlipped(false);
                        setCardIndex((i) => (i - 1 + flashcards.length) % flashcards.length);
                      }}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark btn-sm"
                      onClick={() => {
                        setMasteredCount((c) => Math.min(flashcards.length, c + 1));
                        setCardFlipped(false);
                        setCardIndex((i) => (i + 1) % flashcards.length);
                      }}
                    >
                      Got It → Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quiz History & Learning Progress */}
      <div className="panel stack-md">
        <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.1rem' }}>Learning Progress &amp; Quiz Scores</h2>
          <span className="status-chip">{quizHistory.length} Tests Logged</span>
        </div>
        {quizHistory.length === 0 ? (
          <p className="muted" style={{ fontSize: '0.9rem' }}>
            Complete a practice test above to track your chapter scores and accuracy trend.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Topic / Chapter</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.topic}</td>
                    <td className="mono">
                      {row.score} / {row.total}
                    </td>
                    <td>
                      <span className="status-chip status-chip-accent">{row.percent}%</span>
                    </td>
                    <td className="muted">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
