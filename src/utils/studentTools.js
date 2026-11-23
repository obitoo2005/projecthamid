// Deterministic, zero-AI student utilities: Text analysis, formatting, converters, and GPA

export function analyzeTextStats(input) {
  const text = input || '';
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const sentences = trimmed
    ? trimmed.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)
    : [];
  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, '').length;
  const readingMinutes = words.length ? Math.max(1, Math.ceil(words.length / 200)) : 0;
  const speakingMinutes = words.length ? Math.max(1, Math.ceil(words.length / 130)) : 0;

  const stop = new Set([
    'about', 'after', 'again', 'being', 'below', 'between', 'could', 'every',
    'first', 'found', 'great', 'house', 'large', 'might', 'never', 'other',
    'place', 'point', 'right', 'small', 'sound', 'still', 'study', 'their',
    'there', 'these', 'thing', 'think', 'those', 'three', 'under', 'water',
    'where', 'which', 'while', 'world', 'would', 'write', 'years',
  ]);
  const freq = new Map();
  for (const w of words) {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.length < 4 || stop.has(clean)) continue;
    freq.set(clean, (freq.get(clean) || 0) + 1);
  }
  const topKeywords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word, count]) => ({ word, count }));

  return {
    words: words.length,
    characters: charCount,
    charactersNoSpaces: charNoSpaces,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    readingMinutes,
    speakingMinutes,
    topKeywords,
  };
}

export function transformText(input, action) {
  const text = input || '';
  switch (action) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    case 'sentence':
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
    case 'cleanSpaces':
      return text
        .split('\n')
        .map((line) => line.replace(/[ \t]+/g, ' ').trim())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    case 'dedupeLines': {
      const seen = new Set();
      return text
        .split('\n')
        .filter((line) => {
          const key = line.trim();
          if (!key) return true;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .join('\n');
    }
    case 'sortLines':
      return text
        .split('\n')
        .filter((l) => l.trim().length > 0)
        .sort((a, b) => a.localeCompare(b))
        .join('\n');
    default:
      return text;
  }
}

export function runFormatConverter(input, mode) {
  const text = input || '';
  if (!text.trim()) throw new Error('Enter input text to convert.');

  if (mode === 'jsonPretty') {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  }
  if (mode === 'jsonMinify') {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed);
  }
  if (mode === 'base64Encode') {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    return btoa(binary);
  }
  if (mode === 'base64Decode') {
    const binary = atob(text.trim());
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  if (mode === 'urlEncode') {
    return encodeURIComponent(text);
  }
  if (mode === 'urlDecode') {
    return decodeURIComponent(text);
  }
  throw new Error('Unknown conversion mode.');
}

export const UNIT_CATEGORIES = {
  length: {
    label: 'Length',
    units: {
      m: { label: 'Meters (m)', factor: 1 },
      km: { label: 'Kilometers (km)', factor: 1000 },
      cm: { label: 'Centimeters (cm)', factor: 0.01 },
      mm: { label: 'Millimeters (mm)', factor: 0.001 },
      in: { label: 'Inches (in)', factor: 0.0254 },
      ft: { label: 'Feet (ft)', factor: 0.3048 },
      mi: { label: 'Miles (mi)', factor: 1609.344 },
    },
  },
  mass: {
    label: 'Mass',
    units: {
      kg: { label: 'Kilograms (kg)', factor: 1 },
      g: { label: 'Grams (g)', factor: 0.001 },
      mg: { label: 'Milligrams (mg)', factor: 0.000001 },
      lb: { label: 'Pounds (lb)', factor: 0.45359237 },
      oz: { label: 'Ounces (oz)', factor: 0.028349523125 },
    },
  },
  data: {
    label: 'Digital Storage',
    units: {
      B: { label: 'Bytes (B)', factor: 1 },
      KB: { label: 'Kilobytes (KB)', factor: 1024 },
      MB: { label: 'Megabytes (MB)', factor: 1024 ** 2 },
      GB: { label: 'Gigabytes (GB)', factor: 1024 ** 3 },
      TB: { label: 'Terabytes (TB)', factor: 1024 ** 4 },
    },
  },
  temperature: {
    label: 'Temperature',
    units: {
      C: { label: 'Celsius (°C)' },
      F: { label: 'Fahrenheit (°F)' },
      K: { label: 'Kelvin (K)' },
    },
  },
};

export function convertUnitValue(value, category, fromUnit, toUnit) {
  const num = Number(value);
  if (Number.isNaN(num)) throw new Error('Enter a valid number');

  if (category === 'temperature') {
    let celsius = num;
    if (fromUnit === 'F') celsius = ((num - 32) * 5) / 9;
    else if (fromUnit === 'K') celsius = num - 273.15;

    let out = celsius;
    if (toUnit === 'F') out = (celsius * 9) / 5 + 32;
    else if (toUnit === 'K') out = celsius + 273.15;
    return Number(out.toPrecision(8));
  }

  const group = UNIT_CATEGORIES[category];
  if (!group || !group.units[fromUnit] || !group.units[toUnit]) {
    throw new Error('Invalid unit selection');
  }
  const inBase = num * group.units[fromUnit].factor;
  const converted = inBase / group.units[toUnit].factor;
  return Number(converted.toPrecision(8));
}

export const GRADE_POINTS = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  D: 1.0,
  F: 0.0,
};

export function calculateGPA(courses) {
  let totalCredits = 0;
  let totalPoints = 0;
  for (const c of courses) {
    const credits = Number(c.credits);
    const gp = GRADE_POINTS[c.grade];
    if (credits > 0 && typeof gp === 'number') {
      totalCredits += credits;
      totalPoints += credits * gp;
    }
  }
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  return {
    gpa: Number(gpa.toFixed(2)),
    totalCredits,
    percentage: Number(((gpa / 4) * 100).toFixed(1)),
  };
}
