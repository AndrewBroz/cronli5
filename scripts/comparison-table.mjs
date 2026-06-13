// Generate the cronli5 vs. cRonstrue output tables from live library
// output, replacing the content between the GENERATED markers in place:
// the English head-to-head in docs/cronli5-vs-cronstrue.md, and one
// per-language table in each docs/lang/<code>.md against the matching
// cRonstrue locale.
//
// Usage:
//   npm run compare            regenerate the tables in the docs
//   npm run compare -- --check exit non-zero if any doc is stale
//
// Patterns are curated: `basic` shows everyday crontab lines where the
// two libraries agree on meaning and differ only in voice; `showcase`
// shows compound patterns where cronli5's folded, single-sentence output
// is most dramatically better than fragment assembly; the shared
// language set shows the same schedules across languages, plus a few
// rows per language that exercise its distinctive grammar.

import {readFileSync, writeFileSync} from 'node:fs';
import cronli5 from '../src/cronli5.js';
import cronstrue from 'cronstrue';
import cronstrueI18n from 'cronstrue/i18n.js';
import en from '../src/lang/en/index.js';
import es from '../src/lang/es/index.js';
import fi from '../src/lang/fi/index.js';

const cronstrueVersion = JSON.parse(readFileSync(
  new URL('../node_modules/cronstrue/package.json', import.meta.url),
  'utf8')).version;

const tables = {
  basic: [
    '* * * * *',
    '*/5 * * * *',
    '0 12 * * *',
    '30 9 * * MON-FRI',
    '0 9,17 * * *',
    '0 9-17 * * *',
    '0-29 * * * *',
    '0 0 1,15 * *',
    '0 12 1 1 *',
    '@daily',
    '*/30 * * * * *',
    '0 0 * * 5L'
  ],
  showcase: [
    // Compound fields fold into one sentence.
    '5,10 30 9 * * MON',
    '*/15 30 9-17 * * MON-FRI',
    '15 30 9 * * MON',
    '45 17,9 0 * * *',
    // Lists, wrap-around ranges, and Quartz tokens expand concretely —
    // capped, so long expansions read as windows instead of walls of times.
    '0-30 9,17-19 * * *',
    '0 22-2,12 * * *',
    '0 9-20,22 * * *',
    '* 9,12,17 * * MON-FRI',
    '30 9 15W 6 *',
    // Dates fold; degenerate and unit-step shapes normalize.
    '0 0 29 2 *',
    '0 9-9 * * *',
    '1/1 * * * *',
    '1 1 * * * *',
    // Day-of-month with day-of-week: cron fires on either.
    '59 23 31 12 5'
  ]
};

// The shared cross-language set: the same schedules in every language
// doc, so the languages can be compared against each other as well as
// against the cRonstrue locale.
const languagePatterns = [
  '*/5 * * * *',
  '0 0 * * *',
  '30 9 * * MON-FRI',
  '0 9,17 * * *',
  '0 22-2 * * *',
  '*/15 9-17 * * *',
  '0 0 1,15 * *',
  '0 12 1 1 *',
  '0 12 * 11-2 *',
  '0 0 * * 5L',
  '5,10 30 9 * * MON',
  '1/1 * * * *'
];

// Per-language rows exercising that language's distinctive grammar.
const languages = [
  {code: 'en', extras: [], lang: en},
  {
    code: 'es',
    // Singular "a la 1" article even on the 24-hour clock; sábados takes
    // a plural -s.
    extras: ['0 1 * * *', '0 12 * * SAT'],
    lang: es
  },
  {
    code: 'fi',
    // Consonant gradation (keskiviikosta); the date-or-weekday "tai".
    extras: ['0 9 * * WED-FRI', '0 0 13 * FRI'],
    lang: fi
  }
];

function describe(fn, pattern) {
  try {
    return fn(pattern);
  }
  catch (error) {
    const message = error instanceof Error ? error.message : '' + error;

    return '*error: ' + message.replace(/`/g, '\'') + '*';
  }
}

function tableFrom(header, rows) {
  return [header, '| --- | --- | --- |', ...rows].join('\n');
}

function renderEnglishTable(patterns) {
  const rows = patterns.map(function compare(pattern) {
    const ours = describe(cronli5, pattern);
    const theirs = describe(function cronstrueToString(p) {
      return cronstrue.toString(p);
    }, pattern);

    return '| `' + pattern + '` | ' + ours + ' | ' + theirs + ' |';
  });

  return tableFrom(
    '| Pattern | cronli5 | cRonstrue ' + cronstrueVersion + ' |', rows);
}

function renderLanguageTable(language) {
  const patterns = [...languagePatterns, ...language.extras];
  const rows = patterns.map(function compare(pattern) {
    const ours = describe(function cronli5Lang(p) {
      return cronli5(p, {lang: language.lang});
    }, pattern);
    const theirs = describe(function cronstrueLocale(p) {
      return cronstrueI18n.toString(p, {locale: language.code});
    }, pattern);

    return '| `' + pattern + '` | ' + ours + ' | ' + theirs + ' |';
  });

  return tableFrom('| Pattern | cronli5 (' + language.code +
    ') | cRonstrue ' + cronstrueVersion + ' (' + language.code +
    ' locale) |', rows);
}

// Replace the body between a table's BEGIN/END markers.
function inject(content, name, body, docName) {
  const begin = '<!-- BEGIN GENERATED: ' + name + ' -->';
  const end = '<!-- END GENERATED: ' + name + ' -->';
  const beginAt = content.indexOf(begin);
  const endAt = content.indexOf(end);

  if (beginAt === -1 || endAt === -1) {
    throw new Error('Missing GENERATED markers for "' + name + '" in ' +
      docName);
  }

  return content.slice(0, beginAt + begin.length) + '\n' + body + '\n' +
    content.slice(endAt);
}

// One job per documentation file carrying its named table bodies.
const jobs = [
  {
    doc: 'docs/cronli5-vs-cronstrue.md',
    tables: {
      basic: renderEnglishTable(tables.basic),
      showcase: renderEnglishTable(tables.showcase)
    }
  },
  ...languages.map(function job(language) {
    return {
      doc: 'docs/lang/' + language.code + '.md',
      tables: {comparison: renderLanguageTable(language)}
    };
  })
];

const check = process.argv.includes('--check');
const stale = [];

for (const job of jobs) {
  const url = new URL('../' + job.doc, import.meta.url);
  const current = readFileSync(url, 'utf8');
  let updated = current;

  for (const [name, body] of Object.entries(job.tables)) {
    updated = inject(updated, name, body, job.doc);
  }

  if (!check && updated !== current) {
    writeFileSync(url, updated);
    console.log('Updated ' + job.doc + '.');
  }
  else if (check && updated !== current) {
    stale.push(job.doc);
  }
}

if (check && stale.length > 0) {
  console.error('Stale generated tables in: ' + stale.join(', ') +
    '; run `npm run compare` to regenerate.');
  process.exitCode = 1;
}
else if (check) {
  console.log('All generated comparison tables are up to date.');
}
else {
  console.log('Compared against cronstrue ' + cronstrueVersion + '.');
}
