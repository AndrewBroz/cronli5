// Round-trip correctness check over a wide, shape-deduped slice of the fuzz
// pattern space (docs/i18n-design.md §4 Pass 2). For each pattern it renders
// the English description, asks the cross-family model to recover a cron
// expression from that description, and compares the two crons by their
// expanded per-field value sets — a mechanical, objective verdict. A clear,
// correct description round-trips to the same schedule; a mismatch flags a
// pattern whose prose is unclear or wrong (the model is the reverse parser,
// but the comparison is exact). Quartz operators (L/W/#) have no simple value
// set and are skipped. It complements the naturalness panel: this scales to
// the long tail without a human, leaving the panel a representative sample.
//
// Usage: node --import tsx scripts/roundtrip.mjs [--limit=N]

import {pathToFileURL} from 'node:url';
import {askJson} from './llm.mjs';
import {sampleShapes, spread} from './sample.mjs';
import {enumerateFires} from '../src/core/analyze.js';
import cronli5 from '../src/cronli5.js';
import en from '../src/lang/en/index.js';

const MONTHS = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
};
const DOWS = {SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6};
const FIELDS = ['second', 'minute', 'hour', 'date', 'month', 'weekday'];

// The inclusive integer range [min, max].
function range(min, max) {
  const out = [];

  for (let value = min; value <= max; value += 1) {
    out.push(value);
  }

  return out;
}

// The set of values a cron field matches, cron names mapped to their numbers.
function fieldSet(field, min, max, names) {
  let token = field.toUpperCase();

  Object.keys(names).forEach(function map(name) {
    token = token.split(name).join(String(names[name]));
  });

  const values = token === '*' || token === '?' ?
    range(min, max) :
    enumerateFires(token, min, max);

  return new Set(values);
}

// Expand a cron string to per-field value sets, or null when it carries a
// Quartz operator (no simple value set) or is not a 5/6/7-field expression.
function expandCron(cron) {
  if ((/[LW#]/iu).test(cron)) {
    return null;
  }

  let fields = cron.trim().split(/\s+/u);

  if (fields.length === 5) {
    fields = ['0', ...fields];
  }

  if (fields.length === 7) {
    fields = fields.slice(0, 6);
  }

  if (fields.length !== 6) {
    return null;
  }

  // Cron treats weekday 7 and 0 as Sunday.
  const dow = [...fieldSet(fields[5], 0, 7, DOWS)]
    .map(function sunday(day) {
      return day === 7 ? 0 : day;
    });

  return {
    second: fieldSet(fields[0], 0, 59, {}),
    minute: fieldSet(fields[1], 0, 59, {}),
    hour: fieldSet(fields[2], 0, 23, {}),
    date: fieldSet(fields[3], 1, 31, {}),
    month: fieldSet(fields[4], 1, 12, MONTHS),
    weekday: new Set(dow)
  };
}

// Whether two value sets hold the same members.
function sameSet(a, b) {
  return a.size === b.size && [...a].every((value) => b.has(value));
}

// Whether two expanded crons match the same schedule (every field's set).
function cronsEqual(a, b) {
  return FIELDS.every((field) => sameSet(a[field], b[field]));
}

// Ask the cross-family model to recover a cron expression from a description.
async function backTranslate(description) {
  const prompt = 'Convert this recurring-schedule description into one ' +
    'standard cron expression. Use field order "minute hour day-of-month ' +
    'month day-of-week", or prepend a seconds field if the description ' +
    'mentions seconds. When the description gives both a day-of-month and a ' +
    'weekday joined by "or", set both fields (cron fires when either ' +
    'matches); otherwise leave unmentioned fields as "*". Reply JSON only: ' +
    '{"cron": "<expression>"}.\n\nDescription: ' + description;
  const result = await askJson(prompt).catch(() => ({}));

  return typeof result.cron === 'string' ? result.cron : null;
}

function render(pattern) {
  try {
    return cronli5(pattern, {lang: en});
  }
  catch {
    return null;
  }
}

async function main(limit) {
  const shapes = sampleShapes(en);
  const chosen = spread(shapes, limit);
  const checkable = chosen
    .map((pattern) => ({pattern, original: expandCron(pattern)}))
    .filter((item) => item.original);
  const mismatches = [];

  for (const {pattern, original} of checkable) {
    const description = render(pattern);
    const recovered = await backTranslate(description);
    const parsed = recovered ? expandCron(recovered) : null;
    const ok = parsed && cronsEqual(original, parsed);

    if (!ok) {
      mismatches.push({
        description, pattern, recovered, orCase: bothDays(pattern)
      });
    }
  }

  report(shapes.length, chosen.length, checkable.length, mismatches);
}

// Whether both day-of-month and day-of-week are restricted — cron's OR case,
// which the back-translator recovers unreliably, so its mismatches are mostly
// model noise rather than rendering bugs.
function bothDays(pattern) {
  const raw = pattern.trim().split(/\s+/u);
  const fields = raw.length >= 6 ? raw.slice(0, 6) : ['0', ...raw];

  return fields[3] !== '*' && fields[5] !== '*';
}

function report(total, sampled, checked, mismatches) {
  const review = mismatches.filter((item) => !item.orCase);
  const orNoise = mismatches.filter((item) => item.orCase);

  console.log(total + ' distinct output shapes; sampled ' + sampled +
    ', checked ' + checked + ' (Quartz skipped).');
  console.log('verified ' + (checked - mismatches.length) +
    ', needs-review ' + review.length +
    ', day-or (model-noisy) ' + orNoise.length);

  show('NEEDS REVIEW (back-translation differed)', review);
  show('DAY-OR (both date and weekday set — usually model noise)', orNoise);
}

function show(heading, items) {
  if (items.length) {
    console.log('\n=== ' + heading + ' ===');
    items.forEach(function each(item) {
      console.log('\n  [' + item.pattern + ']');
      console.log('    cronli5:   ' + item.description);
      console.log('    recovered: ' + (item.recovered || '(no cron)'));
    });
  }
}

export {cronsEqual, expandCron};

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
  const limit = limitArg ? Number(limitArg.slice('--limit='.length)) : 0;

  await main(limit);
}
