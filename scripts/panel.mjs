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
import es from '../src/lang/es/index.js';
import fi from '../src/lang/fi/index.js';
import {ask, askJson} from './llm.mjs';
import {spanningSet} from './spanning-set.mjs';

const MODULES = {es, fi};
const NAMES = {es: 'Spanish', fi: 'Finnish'};
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const NATURAL_BAR = 4;
const CORRECT_BAR = 0.8;

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
async function buildField(code, pattern) {
  const meaning = cronli5(pattern);
  const name = NAMES[code];
  const field = [
    {src: 'cronli5', text: cronli5(pattern, {lang: MODULES[code]})}
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
    pass: mine.natural >= NATURAL_BAR && mine.correct >= CORRECT_BAR
  };
}

// Build + judge one pattern with the Gemma half of the panel.
async function reviewPattern(code, pattern) {
  const {meaning, field} = await buildField(code, pattern);
  const {slate, key} = anonymize(field);
  const verdict = await gemmaJudge(meaning, slate, NAMES[code], JUDGE_PERSONA)
    .catch(() => null);
  const verdicts = verdict ? [verdict] : [];

  return {item: {pattern, meaning, slate, key, gemmaVerdicts: verdicts},
    result: aggregate({pattern, slate, key}, verdicts)};
}

async function run(code, limit) {
  const patterns = limit ? spanningSet.slice(0, limit) : spanningSet;
  const items = [];
  let passes = 0;

  for (const pattern of patterns) {
    const {item, result} = await reviewPattern(code, pattern);

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
  writeFileSync('tmp/panel-' + code + '.json', JSON.stringify(items, null, 2));
  console.log('\nGemma-half: ' + passes + '/' + patterns.length +
    ' patterns pass. Slates → tmp/panel-' + code +
    '.json (add Claude judges, then re-aggregate).');
}

// Re-aggregate with the Claude half folded in. Reads the slates written by a
// prior run and a judges file keyed by pattern ({pattern: [verdict, ...]}),
// combines them with the stored Gemma verdicts, and prints the final gate.
function aggregateWithJudges(code, judgesPath) {
  const items = JSON.parse(readFileSync('tmp/panel-' + code + '.json', 'utf8'));
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
    throw new Error('usage: panel.mjs <es|fi> [--limit=N] [--judges=FILE]');
  }

  const judgesArg = process.argv.find((a) => a.startsWith('--judges='));

  if (judgesArg) {
    aggregateWithJudges(code, judgesArg.slice('--judges='.length));
  }
  else {
    await run(code, limit);
  }
}
