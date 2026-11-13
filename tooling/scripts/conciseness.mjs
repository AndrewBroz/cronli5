// Conciseness sweep: a deterministic, oracle-free check that a description is
// no longer than the cron's structure warrants. Each field has a SHORTEST
// correct rendering whose size is bounded regardless of how often it fires: a
// wildcard says nothing, a single names one value, a range is "X through Y",
// and a STEP is "every N from M through K" — all O(1). Only an IRREGULAR list
// must name each element. So a faithful description's number count is a small
// function of the cron's operators, NOT of its expanded fire count. A
// description carrying far more numbers than that budget has enumerated
// something that had a compact idiom — a verbosity defect (a missing or
// unreached idiom), the class that turns `3/2 1/2` into sixty words.
//
// Two measures, for every shipped language. The first counts the things a
// description names against that budget; a clock time or a date written
// with several groups of digits («9:00:30», « 2 h 00 min 05 s », 6月1日) is
// one thing, as "9 a.m." is. The budget is read from the cron field strings
// (a `/` is a step → 3, with no need to know the core enumerated it) and is
// the same in every language: the reader's task does not change with the
// language. The second is a ceiling on length, which does change: Japanese
// says in fifty characters what French says in a hundred and thirty. So the
// ceiling is 2.25 times the language's median over the sweep, taken once,
// when the language is first held to the gate, and kept on record. It does
// not follow the median afterwards: a ceiling that fell every time a
// language was shortened could never be met. It catches what the count
// cannot, a dozen clock times each written to the second.
//
// A failure is a failure. The languages that fail today are recorded with
// their counts in tooling/docs/length-gate.json, and the gate fails when a
// count rises or when a recorded count is no longer true; a language at
// zero has no allowance at all. `--update` rewrites the record.
//
// Usage: conciseness.mjs [code] [--threshold=N] [--update]
// (run via node --import tsx)

import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import cronli5 from '../../src/cronli5.js';
import {enumerateFires} from '../../src/core/util.js';
import {patterns} from '../../scripts/fuzz-lang.mjs';

const LANGS = readdirSync(new URL('../../src/lang/', import.meta.url))
  .filter((name) => !name.includes('.'))
  .sort();
const RECORD = new URL('../docs/length-gate.json', import.meta.url);

// A language's ceiling, when it is first held to the gate: this many times
// the median length of its descriptions over the sweep. (English, the
// language the budget was first held to, reaches about twice its median.)
const CEILING = 2.25;

// Up to this many fires, naming each as an explicit clock time ("9:05 a.m.,
// 9:10 a.m., …") is the accepted readable form rather than a defect; beyond it
// the renderer factors. (Matches the renderer's six-item cap.)
const CLOCK_TIME_CAP = 6;

// The numbers a faithful rendering of one field needs at most. A step is "every
// N from M through K" — three numbers however often it fires; a Quartz operator
// (L/W/#) renders as words with at most a couple of numbers.
function fieldBudget(field) {
  if (field === '*' || field === '?') {
    return 0;
  }

  if (field.includes(',')) {
    return field.split(',').reduce((sum, part) => sum + fieldBudget(part), 0);
  }

  if ((/[LW#]/).test(field)) {
    return 2;
  }

  if (field.includes('/')) {
    return 3;
  }

  return field.includes('-') ? 2 : 1;
}

// A restricted (non-wildcard, non-Quartz) field contributes a fire count.
function restricted(field) {
  return field !== '*' && field !== '?' && !(/[LW#]/).test(field);
}

// When minute AND hour are both restricted, the schedule is a set of clock
// times — the minute×hour cross product. Up to CLOCK_TIME_CAP of them, naming
// each is accepted (the maintainer's call), so the budget gets an allowance of
// a few numbers per clock time. A restricted second is either carried inside
// each clock time or factored out as its own clause — either way it does not
// multiply the count, so it is left to the additive per-field budget. Beyond
// the cap the renderer factors, so no allowance — an enumeration there is still
// flagged.
function clockTimeAllowance(cron) {
  const f = cron.trim().split(/\s+/u);
  const six = f.length === 6;
  const minute = six ? f[1] : f[0];
  const hour = six ? f[2] : f[1];

  if (!restricted(minute) || !restricted(hour)) {
    return 0;
  }

  const size = enumerateFires(minute, 0, 59).length *
    enumerateFires(hour, 0, 23).length;

  return size > 1 && size <= CLOCK_TIME_CAP ? 3 * size : 0;
}

function budget(cron) {
  const additive = cron.trim().split(/\s+/u)
    .reduce((sum, f) => sum + fieldBudget(f), 0);

  return additive + clockTimeAllowance(cron);
}

// One thing named: a group of digits, or a clock time or date written as
// several groups.
const THING = /\d+(?:(?::|\.(?=\d)| h | min |[時时点分月])\d+)*/gu;

// The things a description names — the blowup signal.
function outputNumbers(description) {
  return (description.match(THING) || []).length;
}

function describe(cron, langModule) {
  const tokens = cron.trim().split(/\s+/u);
  const opts = {
    ...langModule ? {lang: langModule} : {},
    ...tokens.length === 6 && (/\d{4}/u).test(tokens[5]) ? {years: true} : {}
  };

  try {
    return cronli5(cron, opts);
  }
  catch {
    return null;
  }
}

function median(lengths) {
  return [...lengths].sort((a, b) => a - b)[Math.floor(lengths.length / 2)];
}

// Every description of the sweep with what it names and what it may name.
async function described(code) {
  const langModule = code === 'en' ?
    null :
    (await import('../../src/lang/' + code + '/index.js')).default;
  const all = [];

  for (const cron of patterns()) {
    const description = describe(cron, langModule);

    if (description) {
      all.push({
        cron,
        description,
        excess: outputNumbers(description) - budget(cron),
        shape: description.replace(/\d+/gu, 'N')
      });
    }
  }

  return all;
}

// One hit per distinct shape, the worst first by `measure`.
function distinct(hits, measure) {
  const seen = new Set();

  return hits.filter(function fresh(hit) {
    const isNew = !seen.has(hit.shape);

    seen.add(hit.shape);

    return isNew;
  }).sort((a, b) => measure(b) - measure(a));
}

async function sweep(code, threshold, recorded) {
  const all = await described(code);
  const ceiling = recorded || Math.round(CEILING *
    median(all.map((hit) => hit.description.length)));

  return {
    ceiling,
    overBudget: distinct(all.filter((hit) => hit.excess > threshold),
      (hit) => hit.excess),
    overLong: distinct(all.filter((hit) => hit.description.length > ceiling),
      (hit) => hit.description.length)
  };
}

function show(title, hits, label) {
  console.log('  ' + hits.length + ' ' + title);
  hits.slice(0, 3).forEach((hit) => {
    console.log('    ' + label(hit) + '  ' + hit.cron + '\n       ' +
      hit.description);
  });
}

// Returns each language's counts so callers can gate on them.
async function main(codes, threshold, record) {
  const counts = {};

  for (const lang of codes) {
    const {ceiling, overBudget, overLong} =
      await sweep(lang, threshold, record[lang]?.ceiling);

    counts[lang] = {
      ceiling,
      overBudget: overBudget.length,
      overLong: overLong.length
    };
    console.log('\n=== ' + lang + ' ===');
    show('distinct shapes naming more than budget + ' + threshold,
      overBudget, (hit) => '+' + hit.excess);
    show('distinct shapes longer than ' + ceiling + ' characters',
      overLong, (hit) => '[' + hit.description.length + ']');
  }

  return counts;
}

// What differs between the counts found and the counts on record: a rise
// is a regression, and a fall must be recorded so it cannot come back.
function drift(counts, record) {
  return Object.keys(counts).flatMap(function ofLanguage(lang) {
    const allowed = record[lang] || {overBudget: 0, overLong: 0};

    return ['overBudget', 'overLong'].filter(function differs(key) {
      return counts[lang][key] !== allowed[key];
    }).map(function line(key) {
      return lang + ' ' + key + ': ' + counts[lang][key] + ' (on record: ' +
        allowed[key] + ')';
    });
  });
}

export {budget, drift, fieldBudget, outputNumbers, sweep};

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  const code = process.argv.find((arg) => LANGS.includes(arg));
  const flag = process.argv.find((arg) => arg.startsWith('--threshold='));
  const threshold = flag ? Number(flag.slice('--threshold='.length)) : 6;
  const record = JSON.parse(readFileSync(RECORD, 'utf8'));
  const counts = await main(code ? [code] : LANGS, threshold, record);
  const drifted = drift(counts, record);
  const failing = Object.keys(counts).filter((lang) =>
    counts[lang].overBudget + counts[lang].overLong > 0);

  if (process.argv.includes('--update')) {
    writeFileSync(RECORD,
      JSON.stringify({...record, ...counts}, null, 2) + '\n');
    console.log('\nRecorded.');
  }
  else if (drifted.length > 0) {
    console.log('\nFAIL: the counts differ from the record ' +
      '(tooling/docs/length-gate.json):\n  ' + drifted.join('\n  '));
    process.exitCode = 1;
  }

  console.log(failing.length > 0 ?
    '\nNOT CONCISE: ' + failing.join(', ') + '.' :
    '\nOK: no description over budget or over length.');
}
