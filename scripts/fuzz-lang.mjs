// Fuzz a language module against a broad combinatorial set of cron patterns.
// This is a NECESSARY-not-sufficient check: a clean run proves the renderer
// never throws and emits no degenerate output (undefined/NaN/empty/garbage/
// doubled words/dropped values) across the long tail that the one-per-kind
// spanning set misses. It does NOT prove semantic correctness — that is the
// panel and round-trip review's job. Run it before attestation, and read the
// sampled
// output shapes to confirm the non-throwing outputs are not fudged.
//
// Usage: node --import tsx scripts/fuzz-lang.mjs <code> [--samples=N]

import {pathToFileURL} from 'node:url';
import cronli5 from '../src/cronli5.js';

// A spread of forms per field: wildcard, single, list, range, step (even and
// uneven), folded list, and the Quartz operators.
const FORMS = {
  second: ['*', '0', '30', '*/15', '0-10', '5,30', '*/45'],
  minute: ['0', '5', '30', '*/15', '*/45', '*/25', '0-30', '5,10,30', '*'],
  hour: ['0', '9', '12', '9-17', '9,17', '*/2', '*/5', '9-17/2', '9-20,22',
    '*'],
  date: ['1', '15', '31', '1,15', '1-5', 'L', '15W', 'LW', '*'],
  month: ['1', '6', '12', '1,7', '*/3', '6-8', '*'],
  weekday: ['MON', 'FRI', 'MON-FRI', 'SAT,SUN', '5L', 'MON#2', '0', '7', '*']
};

// The Cartesian product of the given lists.
function product(lists) {
  return lists.reduce(function step(acc, list) {
    return acc.flatMap(function combine(combo) {
      return list.map(function add(value) {
        return [...combo, value];
      });
    });
  }, [[]]);
}

// The broad set: the 5-field cross product, plus a seconds sweep (6-field)
// with the day fields open. Exported so other tools can reuse the same
// generated pattern space.
function patterns() {
  const {second, minute, hour, date, month, weekday} = FORMS;
  const five = product([minute, hour, date, month, weekday])
    .map((combo) => combo.join(' '));
  const six = product([second, minute, hour, date])
    .map((combo) => combo.join(' ') + ' * *');

  return [...five, ...six];
}

// Obvious garbage in an output.
function degenerate(output) {
  if (!output || !output.trim()) {
    return 'empty';
  }

  if ((/undefined|NaN|null|\[object|Infinity/).test(output)) {
    return 'junk token';
  }

  if ((/\s{2,}/).test(output) || (/^\s|\s$/).test(output)) {
    return 'stray whitespace';
  }

  const doubled = (/\b(\w+)\s+\1\b/).exec(output);

  return doubled ? 'doubled word "' + doubled[1] + '"' : null;
}

// A salient numeric value that should surface but does not — a dropped field,
// the clearest "fudge". Membership against the output's integer set handles
// zero-padding (`0:05` contains 5). Skips steps and Quartz (rendered as
// cadence/fires/words), months and weekdays (names), and 0 (a word or a
// dropped :00).
//
// This assumes a 24-hour clock and digit numerals (true for de/es/fi). A
// 12-hour or number-spelling language (en: `17`→`5 p.m.`, `5`→`five`) will
// flag benign PM hours and spelled small numbers — read those as noise.
function missingValue(pattern, output) {
  const fields = pattern.split(' ');
  const offset = fields.length - 5;
  const present = new Set((output.match(/\d+/g) || []).map(Number));
  const checked = [
    ['second', offset >= 1 ? fields[0] : '*'],
    ['minute', fields[offset]],
    ['hour', fields[offset + 1]],
    ['date', fields[offset + 2]]
  ];
  const dropped = checked
    .filter(([, field]) => field !== '*' && !(/[/LW#]/).test(field))
    .flatMap(([name, field]) => (field.match(/\d+/g) || [])
      .map(Number)
      // 0 (midnight) and an hour 12 (noon) commonly render as a word
      // (Mitternacht / keskipäivällä), so they need not appear as digits.
      .filter((value) => value !== 0 &&
        !(name === 'hour' && value === 12) &&
        !present.has(value))
      .map((value) => name + '=' + value));

  return dropped.length ? dropped[0] + ' not in output' : null;
}

function note(byKey, key, example) {
  if (!byKey[key]) {
    byKey[key] = example;
  }
}

function classify(pattern, lang, sink) {
  let output = null;

  try {
    output = cronli5(pattern, {lang});
  }
  catch (error) {
    note(sink.throwsBy, error.message.replace(/\d+/g, 'N'), pattern);

    return;
  }

  const bad = degenerate(output);

  if (bad) {
    note(sink.degenBy, bad, pattern + ' -> ' + output);
  }

  const missing = missingValue(pattern, output);

  if (missing) {
    note(sink.missingBy, missing, pattern + ' -> ' + output);
  }

  const template = output.replace(/\d+/g, 'N');

  if (!sink.templates.has(template)) {
    sink.templates.set(template, pattern + ' -> ' + output);
  }
}

function report(label, byKey) {
  const keys = Object.keys(byKey);

  console.log(label + ': ' + keys.length);
  keys.forEach((key) => console.log('  [' + key + ']  ' + byKey[key]));
}

async function main(code, samples) {
  const lang = (await import('../src/lang/' + code + '/index.js')).default;
  const sink = {throwsBy: {}, degenBy: {}, missingBy: {}, templates: new Map()};
  let tried = 0;

  for (const pattern of patterns()) {
    tried += 1;
    classify(pattern, lang, sink);
  }

  report('THROWS', sink.throwsBy);
  report('DEGENERATE', sink.degenBy);
  report('MISSING VALUE', sink.missingBy);
  console.log('\ntried ' + tried + ', distinct output shapes ' +
    sink.templates.size);

  if (samples) {
    console.log('\nsample output shapes:');
    [...sink.templates.values()].slice(0, samples)
      .forEach((shape) => console.log('  ' + shape));
  }
}

export {patterns};

// Run only when invoked directly (argv[1] is absent when imported via -e).
if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  const code = process.argv[2];
  const samplesArg = process.argv.find((arg) => arg.startsWith('--samples='));
  const samples = samplesArg ?
    Number(samplesArg.slice('--samples='.length)) :
    0;

  if (!code) {
    throw new Error('usage: fuzz-lang.mjs <code> [--samples=N]');
  }

  await main(code, samples);
}
