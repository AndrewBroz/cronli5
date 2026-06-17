// The cross-family double-blind review panel for a beta language module.
// For each pattern it assembles a candidate field (cronli5, the cRonstrue
// locale, and one Gemma baseline rendering per persona), anonymizes and
// shuffles it into a slate, runs the Gemma half of the judge panel, and
// aggregates into a per-item beta verdict for cronli5.
//
// The Claude half of the panel needs the `Agent` tool, which only the skill
// orchestrator can call: the slates are written to `tmp/panel-<code>.json`
// so the skill can run Claude judges on the same blind slates and fold their
// verdicts into `aggregate()`. See docs/language-pipeline.md.

import {pathToFileURL} from 'node:url';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import cronli5 from '../src/cronli5.js';
import cronstrueI18n from 'cronstrue/i18n.js';
import de from '../src/lang/de/index.js';
import es from '../src/lang/es/index.js';
import fi from '../src/lang/fi/index.js';
import {ask, askJson} from './llm.mjs';
import {sampleShapes, spread} from './sample.mjs';
import {spanningSet} from './spanning-set.mjs';

const MODULES = {de, es, fi};
const NAMES = {de: 'German', es: 'Spanish', fi: 'Finnish'};

// Regional varieties for the dialect-aware panel; the persona prompts use
// these so baselines and judges phrase and judge as that region's speakers.
const DIALECT_NAMES = {
  'es-ES': 'Spanish (Spain)',
  'es-MX': 'Mexican Spanish',
  'es-US': 'US Spanish'
};

// Clock-time patterns that exercise where the dialects diverge; the rest of
// the spanning set renders identically across dialects.
const DIALECT_PATTERNS = [
  '0 9 * * *', '30 9 * * *', '0 14 * * *', '30 14 * * *', '0 22 * * *',
  '0 0 * * *', '0 12 * * *', '30 14 * * 1-5', '0 8,20 * * *'
];

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const NATURAL_BAR = 4;

// The fraction of judges that must call a rendering correct, scaled to the
// panel size so the gate is never pinned to a fixed count. A panel exists to
// outvote outliers, so it tolerates one dissenter — (judges - 1) / judges —
// capped at 0.8 so a large panel still allows ~20% to dissent. An unjudged
// item (no judges) cannot pass.
function correctBar(judges) {
  return judges < 1 ? 1 : Math.min((judges - 1) / judges, 0.8);
}

// The reviewer personas, shared by the baseline and judge steps.
// The cross-family model account serves one model at a time, so every Gemma
// call serializes. Keep Gemma's footprint small — a couple of baselines and
// a single combined judge — and let the parallel Claude half (added by the
// skill via --judges) carry the panel's statistical weight.
const BASELINE_PERSONAS = [
  'an everyday native speaker',
  'a meticulous copy editor'
];
const JUDGE_PERSONA =
  'a fluent native speaker and careful editor weighing naturalness, grammar, ' +
  'and accuracy';

// The cRonstrue locale rendering, or null when it cannot parse the pattern.
function cronstrueText(pattern, code) {
  try {
    return cronstrueI18n.toString(pattern,
      {locale: code, throwExceptionOnParseError: true});
  }
  catch {
    return null;
  }
}

// The candidate field for one pattern: cronli5, cRonstrue, and one Gemma
// baseline per persona (the baselines render the *meaning* afresh).
async function buildField(code, pattern, dialect) {
  const meaning = cronli5(pattern);
  const name = dialect ? DIALECT_NAMES[dialect] : NAMES[code];
  const opts = dialect
    ? {lang: MODULES[code], dialect}
    : {lang: MODULES[code]};
  const field = [
    {src: 'cronli5', text: cronli5(pattern, opts)}
  ];
  const their = cronstrueText(pattern, code);

  if (their) {
    field.push({src: 'cronstrue', text: their});
  }

  const baselines = await Promise.all(BASELINE_PERSONAS.map((persona) =>
    ask('You are ' + persona + ' of ' + name + '. In natural ' + name +
      ', describe this schedule in one line. Reply with ONLY the ' +
      'description. Schedule (English): "' + meaning + '"')));

  baselines.forEach((text) => {
    field.push({src: 'gemma-baseline', text: text.split('\n')[0].trim()});
  });

  return {pattern, meaning, field};
}

// Shuffle a field into an anonymized slate, returning the slate and the key
// that maps each letter back to its source.
function anonymize(field) {
  const order = [...field.keys()].sort(() => Math.random() - 0.5);
  const slate = order.map((idx, i) => ({letter: LETTERS[i], ...field[idx]}));
  const key = {};

  slate.forEach((entry) => {
    key[entry.letter] = entry.src;
  });

  return {slate, key};
}

// One Gemma judge persona scores every candidate in a slate (blind).
function gemmaJudge(meaning, slate, name, persona) {
  const lines = slate.map((entry) => entry.letter + ') ' + entry.text)
    .join('\n');

  return askJson('You are ' + persona + ' of ' + name + ', judging ' + name +
    ' descriptions of a schedule. The schedule means (English, ' +
    'authoritative): "' + meaning + '". Every candidate is a lowercase ' +
    'sentence fragment meant to be embedded mid-sentence (like the English ' +
    'meaning); do NOT penalize missing capitalization or a final period — ' +
    'judge only the wording, naturalness, and accuracy.\nCandidates:\n' +
    lines + '\nFor EACH letter reply JSON only: {"A":{"natural":0,' +
    '"correct":true,"note":"<brief critique or fix>"},...,"best":"X"}. ' +
    'natural is 0-5.');
}

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 ?
    sorted[mid] :
    (sorted[mid - 1] + sorted[mid]) / 2;
}

// Aggregate every panelist's verdicts for one item into per-source stats and
// cronli5's beta verdict (absolute bar + rank within the blind field).
function aggregate(item, verdicts) {
  const stats = {};

  item.slate.forEach((entry) => {
    const scored = verdicts.map((v) => v[entry.letter]).filter(Boolean);
    const naturals = scored.map((s) => s.natural)
      .filter((n) => typeof n === 'number');

    stats[entry.src] = {
      natural: naturals.length ? median(naturals) : 0,
      correct: scored.filter((s) => s.correct).length / (verdicts.length || 1),
      best: verdicts.filter((v) => v.best === entry.letter).length,
      notes: scored.map((s) => s.note).filter(Boolean)
    };
  });

  const mine = stats.cronli5;
  const rank = Object.values(stats)
    .filter((s) => s.natural > mine.natural).length + 1;

  return {
    pattern: item.pattern,
    stats,
    rank,
    candidates: item.slate.length,
    pass: mine.natural >= NATURAL_BAR &&
      mine.correct >= correctBar(verdicts.length)
  };
}

// Build + judge one pattern with the Gemma half of the panel.
async function reviewPattern(code, pattern, dialect) {
  const {meaning, field} = await buildField(code, pattern, dialect);
  const {slate, key} = anonymize(field);
  const name = dialect ? DIALECT_NAMES[dialect] : NAMES[code];
  const verdict = await gemmaJudge(meaning, slate, name, JUDGE_PERSONA)
    .catch(() => null);
  const verdicts = verdict ? [verdict] : [];

  return {item: {pattern, meaning, slate, key, gemmaVerdicts: verdicts},
    result: aggregate({pattern, slate, key}, verdicts)};
}

// The pattern set under review: a wide shape-deduped sample (--wide), a
// dialect's clock-time set, or the curated spanning set.
function basePatterns(code, dialect, wide, limit) {
  if (wide) {
    return spread(sampleShapes(MODULES[code]), wide);
  }

  const base = dialect ? DIALECT_PATTERNS : spanningSet;

  return limit ? base.slice(0, limit) : base;
}

// Where a run's slates are written / re-read; the wide run gets its own tag so
// it never clobbers the spanning-set or dialect slates.
function panelTag(code, dialect, wide) {
  if (wide) {
    return code + '-wide';
  }

  return dialect || code;
}

// The --wide sample size: the given N, a default when bare, or 0 when absent.
function parseWide(arg) {
  if (!arg) {
    return 0;
  }

  return arg === '--wide' ? 40 : Number(arg.slice('--wide='.length));
}

async function run(code, limit, dialect, wide) {
  const patterns = basePatterns(code, dialect, wide, limit);
  const items = [];
  let passes = 0;

  for (const pattern of patterns) {
    const {item, result} = await reviewPattern(code, pattern, dialect);

    items.push(item);
    passes += result.pass ? 1 : 0;
    console.log((result.pass ? 'PASS ' : 'FAIL ') + pattern +
      '  natural=' + result.stats.cronli5.natural +
      ' correct=' + result.stats.cronli5.correct.toFixed(2) +
      ' rank=' + result.rank + '/' + result.candidates);

    if (!result.pass && result.stats.cronli5.notes.length) {
      console.log('     fixes: ' + result.stats.cronli5.notes.join(' | '));
    }
  }

  mkdirSync('tmp', {recursive: true});
  const tag = panelTag(code, dialect, wide);

  writeFileSync('tmp/panel-' + tag + '.json', JSON.stringify(items, null, 2));
  console.log('\nGemma-half: ' + passes + '/' + patterns.length +
    ' patterns pass. Slates → tmp/panel-' + tag +
    '.json (add Claude judges, then re-aggregate).');
}

// Re-aggregate with the Claude half folded in. Reads the slates written by a
// prior run and a judges file keyed by pattern ({pattern: [verdict, ...]}),
// combines them with the stored Gemma verdicts, and prints the final gate.
function aggregateWithJudges(code, judgesPath, dialect, wide) {
  const tag = panelTag(code, dialect, wide);
  const items = JSON.parse(readFileSync('tmp/panel-' + tag + '.json', 'utf8'));
  const judges = JSON.parse(readFileSync(judgesPath, 'utf8'));
  let passes = 0;

  for (const item of items) {
    const verdicts = [...item.gemmaVerdicts, ...judges[item.pattern] || []];
    const result = aggregate(item, verdicts);

    passes += result.pass ? 1 : 0;
    console.log((result.pass ? 'PASS ' : 'FAIL ') + item.pattern +
      '  natural=' + result.stats.cronli5.natural +
      ' correct=' + result.stats.cronli5.correct.toFixed(2) +
      ' rank=' + result.rank + '/' + result.candidates);

    if (!result.pass && result.stats.cronli5.notes.length) {
      console.log('     fixes: ' + result.stats.cronli5.notes.join(' | '));
    }
  }

  console.log('\nFull panel: ' + passes + '/' + items.length +
    ' patterns pass the beta gate.');
}

export {aggregate, aggregateWithJudges, anonymize, buildField, gemmaJudge,
  reviewPattern};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const code = process.argv[2];
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number(limitArg.slice('--limit='.length)) : 0;

  if (!MODULES[code]) {
    throw new Error('usage: panel.mjs <es|fi> [--limit=N] [--judges=FILE] ' +
      '[--dialect=es-MX] [--wide[=N]]');
  }

  const judgesArg = process.argv.find((a) => a.startsWith('--judges='));
  const dialectArg = process.argv.find((a) => a.startsWith('--dialect='));
  const dialect = dialectArg ? dialectArg.slice('--dialect='.length) : '';
  const wideArg = process.argv.find((a) => a === '--wide' ||
    a.startsWith('--wide='));
  const wide = parseWide(wideArg);

  if (judgesArg) {
    aggregateWithJudges(code, judgesArg.slice('--judges='.length), dialect,
      wide);
  }
  else {
    await run(code, limit, dialect, wide);
  }
}
