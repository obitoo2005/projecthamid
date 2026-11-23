// Safe recursive-descent mathematical expression parser (no eval)

export function evaluateMathExpression(expr, angleMode = 'DEG') {
  const tokens = tokenize(expr);
  if (tokens.length === 0) throw new Error('Enter an expression');
  let pos = 0;

  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  const toRad = (val) => (angleMode === 'DEG' ? (val * Math.PI) / 180 : val);

  function parseExpression() {
    let left = parseTerm();
    while (peek() && (peek().value === '+' || peek().value === '-')) {
      const op = consume().value;
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm() {
    let left = parsePower();
    while (peek() && (peek().value === '*' || peek().value === '/' || peek().value === '%')) {
      const op = consume().value;
      const right = parsePower();
      if (op === '*') left *= right;
      else if (op === '/') {
        if (right === 0) throw new Error('Division by zero');
        left /= right;
      } else {
        left %= right;
      }
    }
    return left;
  }

  function parsePower() {
    let base = parseUnary();
    if (peek() && peek().value === '^') {
      consume();
      const exp = parsePower();
      return Math.pow(base, exp);
    }
    return base;
  }

  function parseUnary() {
    if (peek() && peek().value === '-') {
      consume();
      return -parseUnary();
    }
    if (peek() && peek().value === '+') {
      consume();
      return parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary() {
    const tok = peek();
    if (!tok) throw new Error('Unexpected end of expression');

    if (tok.type === 'number') {
      consume();
      return tok.value;
    }

    if (tok.type === 'ident') {
      consume();
      const name = tok.value.toLowerCase();
      if (name === 'pi' || name === 'π') return Math.PI;
      if (name === 'e') return Math.E;

      if (!peek() || peek().value !== '(') {
        throw new Error(`Expected '(' after ${tok.value}`);
      }
      consume();
      const arg = parseExpression();
      if (!peek() || peek().value !== ')') {
        throw new Error('Missing closing parenthesis');
      }
      consume();

      switch (name) {
        case 'sin':
          return Math.sin(toRad(arg));
        case 'cos':
          return Math.cos(toRad(arg));
        case 'tan':
          return Math.tan(toRad(arg));
        case 'sqrt':
        case '√':
          if (arg < 0) throw new Error('Square root of negative number');
          return Math.sqrt(arg);
        case 'log':
          if (arg <= 0) throw new Error('Logarithm requires positive input');
          return Math.log10(arg);
        case 'ln':
          if (arg <= 0) throw new Error('Natural log requires positive input');
          return Math.log(arg);
        case 'abs':
          return Math.abs(arg);
        default:
          throw new Error(`Unknown function: ${tok.value}`);
      }
    }

    if (tok.value === '(') {
      consume();
      const val = parseExpression();
      if (!peek() || peek().value !== ')') {
        throw new Error('Missing closing parenthesis');
      }
      consume();
      return val;
    }

    throw new Error(`Unexpected token: ${tok.value}`);
  }

  const result = parseExpression();
  if (pos < tokens.length) {
    throw new Error(`Unexpected token: ${tokens[pos].value}`);
  }
  if (!Number.isFinite(result)) {
    throw new Error('Result is undefined or infinite');
  }
  return Number(result.toPrecision(12));
}

function tokenize(input) {
  const cleaned = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  const tokens = [];
  let i = 0;

  while (i < cleaned.length) {
    const ch = cleaned[i];
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      while (i < cleaned.length && /[0-9.]/.test(cleaned[i])) {
        numStr += cleaned[i++];
      }
      const val = Number(numStr);
      if (Number.isNaN(val)) throw new Error(`Invalid number: ${numStr}`);
      tokens.push({ type: 'number', value: val });
      continue;
    }
    if (/[a-zA-Zπ√]/.test(ch)) {
      let id = '';
      while (i < cleaned.length && /[a-zA-Zπ√]/.test(cleaned[i])) {
        id += cleaned[i++];
      }
      tokens.push({ type: 'ident', value: id });
      continue;
    }
    if ('+-*/^%()'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i += 1;
      continue;
    }
    throw new Error(`Unsupported character: ${ch}`);
  }
  return tokens;
}

export function solveLinearEquation(a, b, c) {
  if (a === 0) {
    return b === c
      ? { summary: 'Infinite solutions (identity)', steps: [`${b} = ${c} is always true.`] }
      : { summary: 'No solution', steps: [`0x + ${b} = ${c} is inconsistent.`] };
  }
  const x = (c - b) / a;
  return {
    summary: `x = ${Number(x.toPrecision(8))}`,
    steps: [
      `Start with: ${a}x + (${b}) = ${c}`,
      `Subtract ${b} from both sides: ${a}x = ${c - b}`,
      `Divide by ${a}: x = ${(c - b)} / ${a} = ${Number(x.toPrecision(8))}`,
    ],
  };
}

export function solveQuadraticEquation(a, b, c) {
  if (a === 0) return solveLinearEquation(b, c, 0);
  const d = b * b - 4 * a * c;
  const denom = 2 * a;
  if (d > 0) {
    const r1 = (-b + Math.sqrt(d)) / denom;
    const r2 = (-b - Math.sqrt(d)) / denom;
    return {
      summary: `x₁ = ${Number(r1.toPrecision(6))}, x₂ = ${Number(r2.toPrecision(6))}`,
      steps: [
        `Equation: ${a}x² + (${b})x + (${c}) = 0`,
        `Discriminant Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${d}`,
        `Since Δ > 0, two real roots: x = (-b ± √Δ) / 2a`,
        `x₁ = ${Number(r1.toPrecision(6))}, x₂ = ${Number(r2.toPrecision(6))}`,
      ],
    };
  }
  if (d === 0) {
    const r = -b / denom;
    return {
      summary: `x = ${Number(r.toPrecision(6))} (double root)`,
      steps: [
        `Discriminant Δ = 0 → one repeated real root`,
        `x = -(${b}) / ${denom} = ${Number(r.toPrecision(6))}`,
      ],
    };
  }
  const real = (-b / denom).toPrecision(5);
  const imag = (Math.sqrt(-d) / Math.abs(denom)).toPrecision(5);
  return {
    summary: `x = ${real} ± ${imag}i`,
    steps: [
      `Discriminant Δ = ${d} < 0 → two complex conjugate roots`,
      `x = (${-b} ± i√${-d}) / ${denom}`,
      `x = ${real} ± ${imag}i`,
    ],
  };
}
