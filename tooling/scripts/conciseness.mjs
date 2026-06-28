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
// Necessary-not-sufficient, and a DISCOVERY tool first: it ranks the worst
// offenders for review and counts them so a fix's progress is measurable. The
// budget is read from the cron field strings (a `/` is a step → 3, no need to
// know the core enumerated it); the actual is digit-groups in the output
// (enumerations are always digits; compact forms spell or use one or two, so a
// language that spells its numbers only ever under-counts, never over-flags).
//
// Usage: conciseness.mjs [code] [--threshold=N]  (run via node --import tsx)

import {pathToFileURL} from 'node:url';
import cronli5 from '../../src/cronli5.js';
import {enumerateFires} from '../../src/core/analyze.js';
import {patterns} from '../../scripts/fuzz-lang.mjs';

const LANGS = ['en', 'es', 'de', 'fi', 'fr', 'pt', 'zh'];

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

// Digit-groups carried by the description — the blowup signal.
function outputNumbers(description) {
  return (description.match(/\d+/gu) || []).length;
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

async function sweep(code, threshold) {
  const langModule = code === 'en' ?
    null :
    (await import('../../src/lang/' + code + '/index.js')).default;
  const seen = new Set();
  const hits = [];

  for (const cron of patterns()) {
    const description = describe(cron, langModule);
    const want = budget(cron);
    const got = description ? outputNumbers(description) : 0;
    const shape = description ? description.replace(/\d+/gu, 'N') : '';

    if (description && got - want > threshold && !seen.has(shape)) {
      seen.add(shape);
      hits.push({cron, want, got, excess: got - want, description});
    }
  }

  return hits.sort((a, b) => b.excess - a.excess);
}

// Returns the total over-budget shape count so callers can gate on it.
async function main(code, threshold) {
  let total = 0;

  for (const lang of code ? [code] : LANGS) {
    const hits = await sweep(lang, threshold);

    total += hits.length;
    console.log('\n=== ' + lang + ': ' + hits.length +
      ' distinct over-budget shapes (excess > ' + threshold + ') ===');
    hits.slice(0, 12).forEach((h) => {
      console.log('  +' + h.excess + ' (budget ' + h.want + ', got ' + h.got +
        ')  ' + h.cron + '\n       ' + h.description);
    });
  }

  return total;
}

export {budget, fieldBudget, outputNumbers, sweep};

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  const code = process.argv.find((arg) => LANGS.includes(arg));
  const flag = process.argv.find((arg) => arg.startsWith('--threshold='));
  const threshold = flag ? Number(flag.slice('--threshold='.length)) : 6;
  const total = await main(code, threshold);

  // Gate: any over-budget shape is a verbosity regression.
  if (total > 0) {
    console.log('\nFAIL: ' + total + ' over-budget shape(s).');
    process.exitCode = 1;
  }
  else {
    console.log('\nOK: no over-budget shapes.');
  }
}
