// cRonstrue-vs-cronli5 divergence sweep: a mechanical engine that renders both
// libraries over the committed core set and surfaces where they diverge without
// a model in the loop. This is the substrate the round-trip/panel quality pass
// and the generated comparison docs build on; it changes no library behavior.
//
// It does three things:
//   1. classify(pattern) buckets each pattern simple/medium/complex the way a
//      user perceives it (everyday cadence vs. a specific schedule vs. advanced
//      operators), so the comparison can group rows by difficulty.
//   2. sweep({patterns, langs}) renders cronli5 AND cRonstrue for every pattern
//      in every language, capturing each side's output or thrown message.
//   3. acceptanceDivergences(results) extracts the one finding that needs no
//      judgement: rows where exactly one library accepted the pattern and the
//      other threw a parse error. Those are objective coverage gaps.
//
// The language list is data: each entry carries the cronli5 lang module, the
// cRonstrue locale (docs.mjs's map: zh -> zh_CN), and an optional cronli5
// `dialect` style. pt/fr/ja and the zh-Hant dialect slot in by adding one
// entry — nothing else changes.
//
// Usage: node --import tsx tooling/scripts/cronstrue-divergence.mjs [code]
//   code  restrict the sweep + sample to one language (default: all)

import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {analyze, prepare} from '../../src/core/index.js';
import cronli5 from '../../src/cronli5.js';
import en from '../../src/lang/en/index.js';
import cronstrueI18n from 'cronstrue/i18n.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');

// The review substrate is the committed core set: the cell sweep PLUS the
// curated spanning patterns (test/core/core-set.json) — 257 patterns total,
// the same substrate roundtrip.mjs reviews over.
const CORE_SET = JSON.parse(
  readFileSync(join(ROOT, 'test', 'core', 'core-set.json'), 'utf8'));
const CORE_PATTERNS = [...CORE_SET.patterns, ...CORE_SET.spanning];

// One entry per cronli5 language. `code` is the cronli5/docs code; `locale` is
// the cRonstrue locale (its i18n build), matching docs.mjs's `cronstrueLocale`
// (zh -> zh_CN). `dialect` is an optional cronli5 style ('gb'/'house'); absent
// means the default 'us'. Adding pt/fr/ja or a zh-Hant entry is a one-line
// change here once the renderer + cRonstrue locale exist.
const LANGS = [
  {code: 'en', locale: 'en'},
  {code: 'es', locale: 'es'},
  {code: 'de', locale: 'de'},
  {code: 'fi', locale: 'fi'},
  {code: 'pt', locale: 'pt_BR'},
  {code: 'zh', locale: 'zh_CN'}
];

// Returns a code -> lang-module map for the sweep. English is the bundled
// default module; the others load on demand the way conciseness.mjs does.
async function loadLangModules(langs) {
  const modules = {};

  for (const {code} of langs) {
    modules[code] = code === 'en' ?
      en :
      (await import('../../src/lang/' + code + '/index.js')).default;
  }

  return modules;
}

// CLASSIFICATION
//
// The rule is USER-FACING — it buckets by how a person perceives their cron,
// not by the renderer's internal plan shape (a plain `*/15` every-15-minutes
// cron reads as simple even though its PlanNode is a compound minuteFrequency).
//
//   simple  — an everyday cadence or a single daily time, with NO calendar
//             restriction: every minute, every N minutes/hours, hourly, or
//             "every day at HH:MM" (e.g. `*/15 * * * *`, `0 */6 * * *`,
//             `0 9 * * *`).
//   medium  — "a specific schedule": one calendar axis (a weekday, a
//             day-of-month, or a month) and/or an hour/minute window or list
//             (e.g. `0 9 * * 1`, `0 9-17 * * *`, `0 0 1,15 * *`).
//   complex — what a casual user would call advanced: a seconds field, a Quartz
//             operator (L/W/#), the OR-union day case (date AND weekday both
//             restricted), a step-within-a-range (`a-b/n`), or a heavily
//             stacked pattern (calendar axes + time windows scoring 3+).
//
// The signals are read off the cron's surface fields, plus the parsed Schedule
// for the qualifier axes and the OR-union — not invented numbers.

// The neutral Schedule the renderers consume, or null when the pattern does not
// parse (so classify can still bucket it as complex rather than throwing). The
// seconds/years options mirror core-set.mjs's corpusCell so a trailing 4-digit
// token reads as a year, not a weekday.
function scheduleOf(pattern) {
  const tokens = pattern.trim().split(/\s+/u);
  const years = (/\d{4}/u).test(tokens[tokens.length - 1]);
  const seconds = years ? tokens.length >= 7 : tokens.length >= 6;

  try {
    return analyze(prepare(pattern, {seconds, years}));
  }
  catch {
    return null;
  }
}

// The count of distinct day-axis restrictions (date, month, weekday) the
// pattern carries — the "qualifier load".
function qualifierAxes(schedule) {
  const {pattern} = schedule;

  return ['date', 'month', 'weekday']
    .filter((field) => pattern[field] !== '*' && pattern[field] !== '?')
    .length;
}

// Whether the pattern carries a Quartz operator (L, W, or #) in any field.
function hasQuartz(pattern) {
  return (/[LW#]/iu).test(pattern);
}

// Whether both the day-of-month AND the weekday are restricted — cron's
// OR-union case, which both libraries phrase awkwardly and which always reads
// as complex.
function isOrUnion(schedule) {
  const {pattern} = schedule;

  return pattern.date !== '*' && pattern.date !== '?' &&
    pattern.weekday !== '*' && pattern.weekday !== '?';
}

// A minute/hour field that is a window or list (a range or list — not a `*/n`
// cadence), which adds everyday "load".
function isWindowOrList(field) {
  return (/[,-]/u).test(field);
}

// The advanced features that put a pattern straight into `complex`: a
// restricted seconds field, a Quartz operator (L/W/#), the OR-union day case,
// or a step-within-a-range (`a-b/n`).
function hasAdvancedFeature(pattern, schedule, tokens, secondsPresent) {
  const secondsRestricted = secondsPresent && tokens[0] !== '*';
  const stepInRange = tokens.some((token) => (/\d+-\d+\/\d+/u).test(token));

  return secondsRestricted || hasQuartz(pattern) || isOrUnion(schedule) ||
    stepInRange;
}

// simple | medium | complex for one pattern, user-facing (see the rule above).
// An unparseable pattern (the core throws) is `complex` — at least as hard as
// anything it could parse to.
function classify(pattern) {
  const schedule = scheduleOf(pattern);

  if (!schedule) {
    return 'complex';
  }

  const tokens = pattern.trim().split(/\s+/u);
  const years = (/\d{4}/u).test(tokens[tokens.length - 1]);
  const secondsPresent = years ? tokens.length >= 7 : tokens.length >= 6;

  if (hasAdvancedFeature(pattern, schedule, tokens, secondsPresent)) {
    return 'complex';
  }

  // Otherwise score the everyday "load": each calendar axis, plus a minute or
  // hour window/list, counts one.
  const [minute, hour] = tokens.slice(secondsPresent ? 1 : 0);
  const score = qualifierAxes(schedule) +
    (isWindowOrList(minute) ? 1 : 0) + (isWindowOrList(hour) ? 1 : 0);

  if (score === 0) {
    return 'simple';
  }

  return score <= 2 ? 'medium' : 'complex';
}

// SWEEP
//
// Render one pattern in one language with cronli5, mirroring the year handling
// the rest of the tooling uses. Returns {text, err} — exactly one is set.
function renderCronli5(pattern, langModule) {
  const tokens = pattern.trim().split(/\s+/u);
  const years = tokens.length === 6 && (/\d{4}/u).test(tokens[5]);
  const opts = {
    ...langModule ? {lang: langModule} : {},
    ...years ? {years: true} : {}
  };

  try {
    return {text: cronli5(pattern, opts), err: null};
  }
  catch (error) {
    return {text: null, err: String(error && error.message || error)};
  }
}

// Render one pattern in one cRonstrue locale. throwExceptionOnParseError lets
// us observe a parse error (the acceptance signal) instead of cRonstrue's
// silent "an error occured" string.
function renderCronstrue(pattern, locale) {
  try {
    const text = cronstrueI18n.toString(pattern, {
      locale,
      throwExceptionOnParseError: true,
      use24HourTimeFormat: false
    });

    return {text, err: null};
  }
  catch (error) {
    return {text: null, err: String(error && error.message || error)};
  }
}

// The full sweep: one flat row per pattern x language. Each row is
// {pattern, class, lang, locale, c5, crs, c5Err, crsErr}, where c5/crs hold the
// rendered text (null on error) and c5Err/crsErr hold the thrown message (null
// on success). `langModules` is the code -> module map from loadLangModules;
// when omitted it is loaded for the given langs.
async function sweep({patterns = CORE_PATTERNS, langs = LANGS,
  langModules} = {}) {
  const modules = langModules || await loadLangModules(langs);
  const results = [];

  for (const pattern of patterns) {
    const cls = classify(pattern);

    for (const {code, locale} of langs) {
      const c5 = renderCronli5(pattern, modules[code]);
      const crs = renderCronstrue(pattern, locale);

      results.push({
        pattern,
        class: cls,
        lang: code,
        locale,
        c5: c5.text,
        crs: crs.text,
        c5Err: c5.err,
        crsErr: crs.err
      });
    }
  }

  return results;
}

// ACCEPTANCE DIVERGENCES
//
// The mechanical finding: rows where exactly one library accepted the pattern
// and the other threw. Two directions: `crsOnlyError` (cronli5 rendered,
// cRonstrue threw) and `c5OnlyError` (cRonstrue rendered, cronli5 threw). Rows
// where both errored or both succeeded are not divergences. Returns the rows
// split by direction plus per-direction, per-language counts.
function acceptanceDivergences(results) {
  const crsOnlyError = [];
  const c5OnlyError = [];

  for (const row of results) {
    const c5Ok = row.c5Err === null;
    const crsOk = row.crsErr === null;

    if (c5Ok && !crsOk) {
      crsOnlyError.push(row);
    }
    else if (!c5Ok && crsOk) {
      c5OnlyError.push(row);
    }
  }

  return {
    crsOnlyError,
    c5OnlyError,
    counts: {
      crsOnlyError: countByLang(crsOnlyError),
      c5OnlyError: countByLang(c5OnlyError)
    }
  };
}

// A code -> count tally of divergence rows.
function countByLang(rows) {
  const counts = {};

  for (const {lang} of rows) {
    counts[lang] = (counts[lang] || 0) + 1;
  }

  return counts;
}

// The full structured sweep Phase 2/3 imports: the flat rows, the class
// distribution over the patterns, and the acceptance divergences in one object.
async function divergenceSweep(options = {}) {
  const langs = options.langs || LANGS;
  const patterns = options.patterns || CORE_PATTERNS;
  const results = await sweep({patterns, langs, ...options});
  const distribution = classDistribution(patterns);

  return {
    patterns,
    langs,
    results,
    distribution,
    acceptance: acceptanceDivergences(results)
  };
}

// simple/medium/complex counts over a pattern list (one classify per pattern,
// independent of language).
function classDistribution(patterns = CORE_PATTERNS) {
  const counts = {simple: 0, medium: 0, complex: 0};

  for (const pattern of patterns) {
    counts[classify(pattern)] += 1;
  }

  return counts;
}

export {
  CORE_PATTERNS, LANGS, acceptanceDivergences, classDistribution, classify,
  divergenceSweep, sweep
};

// THIN CLI: a readable summary for eyeballing — per-class counts, acceptance
// divergence counts per side per language, and a sample of side-by-side rows.
function printSummary(report, only) {
  const {distribution, acceptance, results} = report;
  const total = report.patterns.length;

  console.log('\n=== class distribution over ' + total + ' patterns ===');
  for (const cls of ['simple', 'medium', 'complex']) {
    console.log('  ' + cls.padEnd(8) + distribution[cls]);
  }

  console.log('\n=== acceptance divergences (exactly one side threw) ===');
  console.log('  cRonstrue threw, cronli5 rendered (per lang): ' +
    JSON.stringify(acceptance.counts.crsOnlyError));
  console.log('  cronli5 threw, cRonstrue rendered (per lang): ' +
    JSON.stringify(acceptance.counts.c5OnlyError));

  const divergent = [...acceptance.crsOnlyError, ...acceptance.c5OnlyError]
    .filter((row, index, all) =>
      all.findIndex((other) => other.pattern === row.pattern) === index);

  if (divergent.length > 0) {
    console.log('\n  distinct patterns with an acceptance divergence:');
    divergent.forEach((row) => {
      const dir = row.crsErr ? 'cRonstrue threw' : 'cronli5 threw';

      console.log('    ' + row.pattern.padEnd(26) + dir);
    });
  }

  console.log('\n=== sample side-by-side (' +
    (only || 'all langs') + ') ===');
  const sample = results
    .filter((row) => !only || row.lang === only)
    .filter((row, index) => index % Math.max(1,
      Math.floor(results.length / 24)) === 0)
    .slice(0, 12);

  sample.forEach((row) => {
    console.log('\n  ' + row.pattern + '  [' + row.class + ', ' +
      row.lang + ']');
    console.log('    cronli5  : ' + (row.c5 || 'ERROR: ' + row.c5Err));
    console.log('    cRonstrue: ' + (row.crs || 'ERROR: ' + row.crsErr));
  });
}

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  const only = process.argv.find((arg) =>
    LANGS.some((entry) => entry.code === arg));
  const langs = only ?
    LANGS.filter((entry) => entry.code === only) :
    LANGS;
  const report = await divergenceSweep({langs});

  printSummary(report, only);
}
