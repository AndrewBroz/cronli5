// Round-trip comprehension helpers for the add-language pipeline. The Verify
// phase renders a wide, shape-deduped slice of the fuzz space, has a Claude
// agent recover a cron from each description BLIND (prose only), and compares
// the recovered schedule to the original by expanded per-field value sets. A
// clear, correct description round-trips to the same schedule; a mismatch
// flags prose that is unclear or wrong. The agent is the reverse parser; the
// comparison here is exact. Quartz operators (L/W/#) have no value set and
// are skipped. Driven by .claude/workflows/add-language.js — no standalone
// CLI, no model client of its own.

import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import {sampleShapes, spread} from './sample.mjs';
import {enumerateFires} from '../../src/core/analyze.js';
import cronli5 from '../../src/cronli5.js';

// The review substrate is the committed core set: the cell sweep PLUS the
// curated spanning patterns folded into its `spanning` field
// (test/core/core-set.json).
const CORE_SET = JSON.parse(readFileSync(join(
  dirname(fileURLToPath(import.meta.url)), '..', '..',
  'test', 'core', 'core-set.json'), 'utf8'));
const reviewPatterns = [...CORE_SET.patterns, ...CORE_SET.spanning];

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

// Whether both day-of-month and day-of-week are restricted — cron's OR case,
// which the back-translator recovers unreliably, so its mismatches are mostly
// model noise rather than rendering bugs.
function bothDays(pattern) {
  const raw = pattern.trim().split(/\s+/u);
  const fields = raw.length >= 6 ? raw.slice(0, 6) : ['0', ...raw];

  return fields[3] !== '*' && fields[5] !== '*';
}

function render(pattern, lang) {
  // A 6-field pattern ending in a 4-digit token is minute..weekday + year;
  // without {years} the year is parsed as a weekday and throws. (5/6/7-field
  // patterns without a trailing year need no option.)
  const tokens = pattern.trim().split(/\s+/u);
  const years = tokens.length === 6 && (/\d{4}/u).test(tokens[5]);

  try {
    return cronli5(pattern, years ? {lang, years: true} : {lang});
  }
  catch {
    return null;
  }
}

// Sampled, rendered, checkable items for one renderer: each {pattern,
// description}. Quartz / non-expandable patterns are dropped (no value set
// to compare), as are null renders. The caller shows ONLY `description` to
// the blind recovery step.
function prepareRoundtrip(lang, limit) {
  const chosen = spread(sampleShapes(lang), limit);

  return chosen
    .filter((pattern) => expandCron(pattern))
    .map((pattern) => ({pattern, description: render(pattern, lang)}))
    .filter((item) => item.description);
}

// The review substrate: the whole expanded core set (cell sweep + curated
// spanning patterns) rendered with `lang` — broad coverage of every rendering
// plan plus realistic curated patterns, far wider than the shape-deduped fuzz
// sample prepareRoundtrip draws. Quartz patterns are included (reviewed for
// naturalness); tallyRoundtrip skips them for the correctness comparison.
function prepareReview(lang) {
  return reviewPatterns
    .map((pattern) => ({pattern, description: render(pattern, lang)}))
    .filter((item) => item.description);
}

// Tally recovered crons against their originals. `recoveries` is
// [{pattern, recovered}]; the cron OR-case (both date and weekday set) is
// partitioned out as model-noisy rather than counted as a defect.
function tallyRoundtrip(recoveries) {
  const verified = [];
  const needsReview = [];
  const orNoise = [];
  const skipped = [];

  for (const {pattern, recovered} of recoveries) {
    const original = expandCron(pattern);

    if (original) {
      const parsed = recovered ? expandCron(recovered) : null;
      const ok = parsed && cronsEqual(original, parsed);

      if (ok) {
        verified.push(pattern);
      }
      else if (bothDays(pattern)) {
        orNoise.push({pattern, recovered});
      }
      else {
        needsReview.push({pattern, recovered});
      }
    }
    else {
      skipped.push(pattern);
    }
  }

  return {
    checked: recoveries.length - skipped.length,
    verified: verified.length,
    needsReview,
    orNoise,
    skipped
  };
}

// The differential substrate: every review pattern rendered in EVERY language,
// so a blind recovery of each rendering can be cross-checked. A pattern where
// some languages recover the right schedule and others don't is a per-renderer
// bug — the agreeing languages are the oracle, so no per-language ground truth
// is needed. The caller shows ONLY the descriptions to the blind recovery step.
function prepareDifferential(langs) {
  return reviewPatterns.map(function each(pattern) {
    const descriptions = {};

    for (const code of Object.keys(langs)) {
      descriptions[code] = render(pattern, langs[code]);
    }

    return {pattern, descriptions};
  }).filter(function complete(item) {
    return Object.values(item.descriptions).every(Boolean);
  });
}

// Cross-language tally. `recoveries` is [{pattern, recovered: {code: cron}}].
// `diverge` holds patterns where some languages (`bad`) recovered a schedule
// disagreeing with the original while others matched — the divergence signal
// that localizes a per-renderer bug. The cron OR-case is segregated as noise.
function tallyDifferential(recoveries) {
  const agree = [];
  const diverge = [];
  const orNoise = [];
  const skipped = [];

  for (const {pattern, recovered} of recoveries) {
    const original = expandCron(pattern);

    if (original) {
      const bad = Object.keys(recovered).filter(function wrong(code) {
        const parsed = recovered[code] ? expandCron(recovered[code]) : null;

        return !(parsed && cronsEqual(original, parsed));
      });

      if (bad.length === 0) {
        agree.push(pattern);
      }
      else if (bothDays(pattern)) {
        orNoise.push({pattern, bad});
      }
      else {
        diverge.push({pattern, bad, recovered});
      }
    }
    else {
      skipped.push(pattern);
    }
  }

  return {
    checked: recoveries.length - skipped.length,
    agree: agree.length,
    diverge,
    orNoise,
    skipped
  };
}

export {
  bothDays, cronsEqual, expandCron, prepareDifferential, prepareReview,
  prepareRoundtrip, tallyDifferential, tallyRoundtrip
};
