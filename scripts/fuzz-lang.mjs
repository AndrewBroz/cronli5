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
  minute: ['0', '5', '30', '*/15', '*/45', '*/25', '5/15', '3/2', '*/7', '0-30',
    '5,10,30', '*'],
  hour: ['0', '9', '12', '9-17', '9,17', '*/2', '*/5', '2/6', '9-17/2',
    '9-20,22', '*'],
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

// A targeted invariant the digit-sweep cannot see: under a sub-minute second,
// a minute of 0 is a real restriction and must be STATED, not absorbed into a
// coarser hourly idiom. The sweep generates these shapes, but `missingValue`
// exempts 0 (it legitimately renders as a word, a dropped :00, or implicit
// on-the-hour times), so the dropped-minute-0 bug slipped through. The
// second=0 sibling renders the legitimate hourly idiom for minute 0; the
// sub-minute-second form must add an explicit minute-0 clause to it, never
// reduce to it. (Holds for a restricted hour, where the fixed form enumerates
// distinct clock times rather than restating the hour idiom; a wildcard hour's
// minute-0 clause can legitimately share the bare "every hour" tail, so it is
// pinned by the corpus instead.)
function minuteZeroStated() {
  return [
    {hour: '9-17', minute0: '* 0 9-17 * * *', second0: '0 0 9-17 * * *'},
    {hour: '*/2', minute0: '* 0 */2 * * *', second0: '0 0 */2 * * *'}
  ];
}

// Two ADJACENT identical clauses — a doubled clause, the clause-level analog of
// the doubled-word check. A compose path that both prepends a lead clause AND
// routes through a sub-renderer that re-emits it yields output like "at 30
// seconds past the minute, at 30 seconds past the minute, ...". Split on the
// clause separators every language uses (", " and zh's "，"/"、"), then flag the
// first pair of adjacent, trimmed, non-empty, identical clauses. Conservative
// by design: only ADJACENT duplicates flag, so a legitimately repeated short
// token across non-neighboring clauses is not a false positive.
function doubledClause(output) {
  const clauses = output.split(/, |，|、/).map((clause) => clause.trim());

  for (let i = 1; i < clauses.length; i += 1) {
    if (clauses[i] && clauses[i] === clauses[i - 1]) {
      return clauses[i];
    }
  }

  return null;
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

  if (doubled) {
    return 'doubled word "' + doubled[1] + '"';
  }

  const clause = doubledClause(output);

  return clause ? 'doubled clause "' + clause + '"' : null;
}

// The last fire of a whole-cycle step `start/interval` within [0, cycle): the
// bound a non-uniform stride names ("…，至K分" / "…，至K点"), e.g. `*/25` over a
// 60-cycle fires :00,:25,:50, bound 50. Returns null when there is no cycle.
function stepBound(start, interval, cycle) {
  return cycle === null ?
    null :
    start + interval * Math.floor((cycle - 1 - start) / interval);
}

// The numeric values a field contributes to the "must surface" check. A plain
// segment contributes its digits; a STEP segment contributes its START fire —
// an offset like `5/6` fires at :05, so the 5 must surface even when the
// cadence reads "every six minutes" (this is what catches a dropped step
// offset). A NON-UNIFORM step (start >= interval, OR interval does not divide
// the cycle) also contributes its LAST fire (the bound) — the endpoint a
// renderer spells out ("至50分"). `*/25` (start 0, 60 % 25 != 0) thus
// surfaces its bound 50, so a dropped `*/N`-from-0 clause is caught even
// though its start 0 is exempt. A UNIFORM step (`*/2`, `5/6`, `5/15` — the
// interval divides the cycle and the start is within it) names no bound, so
// none is added (adding one would false-flag its absent endpoint). A bounded
// `A-B/N` and Quartz (L/W/#) add nothing. `cycle` is 60 for minute/second, 24
// for hour, null elsewhere (no cyclic bound).
function fieldValues(field, cycle) {
  return field.split(',').flatMap(function segment(seg) {
    if ((/[LW#]/).test(seg)) {
      return [];
    }

    if (seg.includes('/')) {
      const [startToken, intervalToken] = seg.split('/');

      if (startToken.includes('-')) {
        return [];
      }

      const start = startToken === '*' ? 0 : Number(startToken);
      const interval = Number(intervalToken);
      const nonUniform = start >= interval ||
        cycle !== null && cycle % interval !== 0;
      const values = startToken === '*' ? [] : [start];

      if (nonUniform) {
        values.push(stepBound(start, interval, cycle));
      }

      return values;
    }

    return (seg.match(/\d+/g) || []).map(Number);
  });
}

// A salient numeric value that should surface but does not — a dropped field or
// step offset, the clearest "fudge". Membership against the output's integer
// set handles zero-padding (`0:05` contains 5). Skips Quartz and `0` (a word or
// a dropped :00); months/weekdays render as names but normalize to numbers, so
// only the time fields are checked.
//
// This assumes a 24-hour clock and digit numerals (true for de/es/fi). A
// 12-hour or number-spelling language (en: `17`→`5 p.m.`, `5`→`five`) will
// flag benign PM hours and spelled small numbers — read those as noise.
function missingValue(pattern, output) {
  const fields = pattern.split(' ');
  const offset = fields.length - 5;
  const present = new Set((output.match(/\d+/g) || []).map(Number));
  // The cycle a whole-cycle step wraps over (so a non-uniform step's bound can
  // be computed): 60 for second/minute, 24 for hour, none for the date.
  const checked = [
    ['second', offset >= 1 ? fields[0] : '*', 60],
    ['minute', fields[offset], 60],
    ['hour', fields[offset + 1], 24],
    ['date', fields[offset + 2], null]
  ];
  const dropped = checked
    .filter(([, field]) => field !== '*')
    .flatMap(([name, field, cycle]) => fieldValues(field, cycle)
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

// Run the targeted minute-0 invariant against a language. Each restricted-hour
// case must NOT collapse back to its absorbing second=0 sibling.
function checkMinuteZero(lang) {
  const failures = {};

  minuteZeroStated().forEach(function each({hour, minute0, second0}) {
    const stated = cronli5(minute0, {lang});
    const absorbed = cronli5(second0, {lang});

    if (stated.includes(absorbed)) {
      note(failures, 'hour ' + hour, minute0 + ' -> ' + stated +
        ' (absorbs the minute 0 idiom "' + absorbed + '")');
    }
  });

  return failures;
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
  report('DROPPED MINUTE 0', checkMinuteZero(lang));
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
