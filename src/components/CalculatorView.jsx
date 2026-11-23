import { useState } from 'react';
import { ArrowLeftRight, Delete, Plus, RotateCcw, Trash2 } from 'lucide-react';
import {
  evaluateMathExpression,
  solveLinearEquation,
  solveQuadraticEquation,
} from '../utils/mathParser';
import {
  GRADE_POINTS,
  UNIT_CATEGORIES,
  calculateGPA,
  convertUnitValue,
} from '../utils/studentTools';

const CALC_BUTTONS = [
  ['sin(', 'cos(', 'tan(', 'sqrt(', 'C'],
  ['log(', 'ln(', '(', ')', 'DEL'],
  ['7', '8', '9', '/', '^'],
  ['4', '5', '6', '*', 'pi'],
  ['1', '2', '3', '-', 'e'],
  ['0', '.', '%', '+', '='],
];

export default function CalculatorView() {
  const [subTool, setSubTool] = useState('scientific');

  // Scientific calculator state
  const [expr, setExpr] = useState('sin(30) + sqrt(144)');
  const [result, setResult] = useState('12.5');
  const [error, setError] = useState('');
  const [angleMode, setAngleMode] = useState('DEG');
  const [history, setHistory] = useState([
    { expr: '2 * pi * 7', result: '43.9822971503' },
  ]);

  // Equation solver state
  const [solverType, setSolverType] = useState('quadratic');
  const [coeffA, setCoeffA] = useState('2');
  const [coeffB, setCoeffB] = useState('-7');
  const [coeffC, setCoeffC] = useState('3');
  const [solverOutput, setSolverOutput] = useState(() => solveQuadraticEquation(2, -7, 3));

  // Unit converter state (100% deterministic, zero AI)
  const [unitCat, setUnitCat] = useState('length');
  const [unitVal, setUnitVal] = useState('1000');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');

  // GPA Calculator state (100% deterministic, zero AI)
  const [courses, setCourses] = useState([
    { id: 1, name: 'Calculus & Analytical Geometry', credits: 3, grade: 'A' },
    { id: 2, name: 'Programming Fundamentals', credits: 4, grade: 'A-' },
    { id: 3, name: 'Applied Physics', credits: 3, grade: 'B+' },
  ]);

  const runEval = (targetExpr = expr) => {
    try {
      const val = evaluateMathExpression(targetExpr, angleMode);
      const valStr = String(val);
      setResult(valStr);
      setError('');
      setHistory((prev) => [{ expr: targetExpr, result: valStr }, ...prev.slice(0, 9)]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleKey = (key) => {
    if (key === 'C') {
      setExpr('');
      setResult('0');
      setError('');
      return;
    }
    if (key === 'DEL') {
      setExpr((prev) => prev.slice(0, -1));
      return;
    }
    if (key === '=') {
      runEval();
      return;
    }
    setExpr((prev) => prev + key);
  };

  const handleSolve = (e) => {
    e.preventDefault();
    const a = Number(coeffA);
    const b = Number(coeffB);
    const c = Number(coeffC);
    if ([a, b, c].some((n) => Number.isNaN(n))) return;
    setSolverOutput(
      solverType === 'quadratic'
        ? solveQuadraticEquation(a, b, c)
        : solveLinearEquation(a, b, c),
    );
  };

  const handleCategoryChange = (nextCat) => {
    setUnitCat(nextCat);
    const keys = Object.keys(UNIT_CATEGORIES[nextCat].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  let unitOutput = '';
  let unitError = '';
  try {
    unitOutput = String(convertUnitValue(unitVal, unitCat, fromUnit, toUnit));
  } catch (err) {
    unitError = err.message;
  }

  const gpaStats = calculateGPA(courses);

  return (
    <section className="workspace-view" aria-labelledby="calc-heading">
      <div className="view-header">
        <div className="view-header-row">
          <div className="stack-sm">
            <span className="status-chip status-chip-accent">02 · Instant Math Engine (No AI Needed)</span>
            <h1 id="calc-heading" className="section-title">
              Smart Calculator, Units &amp; GPA
            </h1>
            <p className="offer-desc">
              100% deterministic local computation — scientific expressions, step-by-step equation
              derivations, scientific unit conversions, and semester GPA calculation.
            </p>
          </div>
          <div className="tab-row" role="tablist" aria-label="Calculator tools">
            <button
              type="button"
              role="tab"
              className="tab-pill"
              aria-selected={subTool === 'scientific'}
              onClick={() => setSubTool('scientific')}
            >
              Scientific &amp; Solver
            </button>
            <button
              type="button"
              role="tab"
              className="tab-pill"
              aria-selected={subTool === 'units'}
              onClick={() => setSubTool('units')}
            >
              Unit Converter
            </button>
            <button
              type="button"
              role="tab"
              className="tab-pill"
              aria-selected={subTool === 'gpa'}
              onClick={() => setSubTool('gpa')}
            >
              GPA Calculator
            </button>
          </div>
        </div>
      </div>

      {subTool === 'scientific' && (
        <div className="grid-2">
          <div className="panel calc-shell">
            <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.05rem' }}>Scientific Calculator</h2>
              <div className="tab-row">
                <button
                  type="button"
                  className="tab-pill"
                  aria-pressed={angleMode === 'DEG'}
                  onClick={() => setAngleMode('DEG')}
                >
                  DEG
                </button>
                <button
                  type="button"
                  className="tab-pill"
                  aria-pressed={angleMode === 'RAD'}
                  onClick={() => setAngleMode('RAD')}
                >
                  RAD
                </button>
              </div>
            </div>

            <div className="calc-display" aria-live="polite">
              <span className="muted" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {angleMode} · Expression
              </span>
              <input
                aria-label="Calculator expression"
                className="mono calc-expr-input"
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runEval();
                }}
              />
              <strong style={{ fontSize: '1.65rem', color: error ? '#fca5a5' : '#f5b800' }}>
                {error || result}
              </strong>
            </div>

            <div className="calc-pad">
              {CALC_BUTTONS.flat().map((btn) => {
                const isOp = ['/', '*', '-', '+', '^', '%'].includes(btn);
                const isEq = btn === '=';
                return (
                  <button
                    key={btn}
                    type="button"
                    className={`calc-key ${isOp ? 'calc-key-op' : ''} ${isEq ? 'calc-key-eq' : ''}`}
                    onClick={() => handleKey(btn)}
                  >
                    {btn === 'DEL' ? <Delete size={16} aria-hidden="true" /> : btn}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="stack-md">
            <div className="panel stack-md">
              <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.08rem' }}>Equation Solver</h2>
                <div className="tab-row">
                  <button
                    type="button"
                    className="tab-pill"
                    aria-pressed={solverType === 'quadratic'}
                    onClick={() => setSolverType('quadratic')}
                  >
                    ax² + bx + c = 0
                  </button>
                  <button
                    type="button"
                    className="tab-pill"
                    aria-pressed={solverType === 'linear'}
                    onClick={() => setSolverType('linear')}
                  >
                    ax + b = c
                  </button>
                </div>
              </div>

              <form className="stack-md" onSubmit={handleSolve}>
                <div className="grid-3">
                  <label className="stack-sm">
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>a</span>
                    <input
                      className="input mono"
                      type="number"
                      step="any"
                      value={coeffA}
                      onChange={(e) => setCoeffA(e.target.value)}
                    />
                  </label>
                  <label className="stack-sm">
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>b</span>
                    <input
                      className="input mono"
                      type="number"
                      step="any"
                      value={coeffB}
                      onChange={(e) => setCoeffB(e.target.value)}
                    />
                  </label>
                  <label className="stack-sm">
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>c</span>
                    <input
                      className="input mono"
                      type="number"
                      step="any"
                      value={coeffC}
                      onChange={(e) => setCoeffC(e.target.value)}
                    />
                  </label>
                </div>
                <button type="submit" className="btn btn-primary">
                  Solve Step-by-Step
                </button>
              </form>

              {solverOutput && (
                <div className="panel-soft stack-sm">
                  <strong className="mono" style={{ color: 'var(--accent-primary)' }}>
                    {solverOutput.summary}
                  </strong>
                  <ol
                    className="stack-sm"
                    style={{ fontSize: '0.875rem', paddingInlineStart: '1.1rem', listStyle: 'decimal' }}
                  >
                    {solverOutput.steps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="panel stack-sm">
              <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1rem' }}>Recent History</h2>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setHistory([])}
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  <span>Clear</span>
                </button>
              </div>
              {history.length === 0 ? (
                <p className="muted" style={{ fontSize: '0.85rem' }}>
                  No calculations logged yet.
                </p>
              ) : (
                <ul className="stack-sm">
                  {history.map((item, idx) => (
                    <li
                      key={idx}
                      className="row-wrap"
                      style={{ justifyContent: 'space-between', fontSize: '0.85rem' }}
                    >
                      <button
                        type="button"
                        className="history-item-btn mono"
                        onClick={() => setExpr(item.expr)}
                      >
                        {item.expr}
                      </button>
                      <strong className="mono">= {item.result}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {subTool === 'units' && (
        <div className="panel stack-md">
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Scientific Unit Converter</h2>
            <div className="tab-row">
              {Object.entries(UNIT_CATEGORIES).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  className="tab-pill"
                  aria-pressed={unitCat === key}
                  onClick={() => handleCategoryChange(key)}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-3" style={{ alignItems: 'end' }}>
            <label className="stack-sm">
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Value</span>
              <input
                className="input mono"
                type="number"
                step="any"
                value={unitVal}
                onChange={(e) => setUnitVal(e.target.value)}
              />
            </label>

            <label className="stack-sm">
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>From</span>
              <select
                className="select"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
              >
                {Object.entries(UNIT_CATEGORIES[unitCat].units).map(([k, u]) => (
                  <option key={k} value={k}>
                    {u.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="stack-sm">
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>To</span>
              <select
                className="select"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
              >
                {Object.entries(UNIT_CATEGORIES[unitCat].units).map(([k, u]) => (
                  <option key={k} value={k}>
                    {u.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <div className="panel-soft" style={{ flex: '1 1 240px' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>
                Converted Result
              </span>
              <div className="mono" style={{ fontSize: '1.45rem', fontWeight: 700, marginBlockStart: '0.25rem' }}>
                {unitError || `${unitVal || 0} ${fromUnit} = ${unitOutput} ${toUnit}`}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setFromUnit(toUnit);
                setToUnit(fromUnit);
              }}
            >
              <ArrowLeftRight size={15} aria-hidden="true" />
              <span>Swap Units</span>
            </button>
          </div>
        </div>
      )}

      {subTool === 'gpa' && (
        <div className="panel stack-md">
          <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem' }}>Semester GPA Calculator (4.0 Scale)</h2>
              <p className="muted" style={{ fontSize: '0.85rem' }}>
                Add courses, credit hours, and grades to compute your weighted GPA instantly.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() =>
                setCourses((prev) => [
                  ...prev,
                  { id: Date.now(), name: `Course ${prev.length + 1}`, credits: 3, grade: 'A' },
                ])
              }
            >
              <Plus size={15} aria-hidden="true" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="grid-3">
            <div className="panel-soft">
              <span className="muted" style={{ fontSize: '0.8rem' }}>Weighted GPA</span>
              <div className="bento-value mono" style={{ color: 'var(--accent-primary)' }}>
                {gpaStats.gpa.toFixed(2)} / 4.00
              </div>
            </div>
            <div className="panel-soft">
              <span className="muted" style={{ fontSize: '0.8rem' }}>Total Credits</span>
              <div className="bento-value mono">{gpaStats.totalCredits}</div>
            </div>
            <div className="panel-soft">
              <span className="muted" style={{ fontSize: '0.8rem' }}>Equivalent %</span>
              <div className="bento-value mono">{gpaStats.percentage}%</div>
            </div>
          </div>

          <div className="stack-sm">
            {courses.map((course) => (
              <div key={course.id} className="gpa-row">
                <input
                  className="input"
                  aria-label="Course name"
                  value={course.name}
                  onChange={(e) =>
                    setCourses((prev) =>
                      prev.map((c) => (c.id === course.id ? { ...c, name: e.target.value } : c)),
                    )
                  }
                />
                <input
                  className="input mono"
                  type="number"
                  min="1"
                  max="6"
                  aria-label="Credit hours"
                  value={course.credits}
                  onChange={(e) =>
                    setCourses((prev) =>
                      prev.map((c) =>
                        c.id === course.id ? { ...c, credits: Number(e.target.value) || 0 } : c,
                      ),
                    )
                  }
                />
                <select
                  className="select"
                  aria-label="Grade"
                  value={course.grade}
                  onChange={(e) =>
                    setCourses((prev) =>
                      prev.map((c) => (c.id === course.id ? { ...c, grade: e.target.value } : c)),
                    )
                  }
                >
                  {Object.keys(GRADE_POINTS).map((g) => (
                    <option key={g} value={g}>
                      {g} ({GRADE_POINTS[g].toFixed(1)})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`Remove ${course.name}`}
                  onClick={() => setCourses((prev) => prev.filter((c) => c.id !== course.id))}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
