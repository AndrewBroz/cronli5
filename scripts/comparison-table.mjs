// Generate the cronli5 vs. cRonstrue output tables in
// docs/cronli5-vs-cronstrue.md from live library output, replacing the
// content between the GENERATED markers in place.
//
// Usage:
//   npm run compare            regenerate the tables in the doc
//   npm run compare -- --check exit non-zero if the doc is stale
//
// Patterns are curated: `basic` shows everyday crontab lines where the two
// libraries agree on meaning and differ only in voice; `showcase` shows
// compound patterns where cronli5's folded, single-sentence output is most
// dramatically better than fragment assembly.

import {readFileSync, writeFileSync} from 'node:fs';
import cronli5 from '../src/cronli5.js';
import cronstrue from 'cronstrue';

const docUrl = new URL('../docs/cronli5-vs-cronstrue.md', import.meta.url);
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

function describe(fn, pattern) {
  try {
    return fn(pattern);
  }
  catch (error) {
    const message = error instanceof Error ? error.message : '' + error;

    return '*error: ' + message.replace(/`/g, '\'') + '*';
  }
}

function renderTable(patterns) {
  const rows = patterns.map(function compare(pattern) {
    const ours = describe(cronli5, pattern);
    const theirs = describe(function cronstrueToString(p) {
      return cronstrue.toString(p);
    }, pattern);

    return '| `' + pattern + '` | ' + ours + ' | ' + theirs + ' |';
  });

  return [
    '| Pattern | cronli5 | cRonstrue ' + cronstrueVersion + ' |',
    '| --- | --- | --- |',
    ...rows
  ].join('\n');
}

// Replace the body between a table's BEGIN/END markers.
function inject(content, name) {
  const begin = '<!-- BEGIN GENERATED: ' + name + ' -->';
  const end = '<!-- END GENERATED: ' + name + ' -->';
  const beginAt = content.indexOf(begin);
  const endAt = content.indexOf(end);

  if (beginAt === -1 || endAt === -1) {
    throw new Error('Missing GENERATED markers for "' + name + '" in ' +
      docUrl.pathname);
  }

  return content.slice(0, beginAt + begin.length) + '\n' +
    renderTable(tables[name]) + '\n' + content.slice(endAt);
}

const current = readFileSync(docUrl, 'utf8');
const updated = Object.keys(tables).reduce(inject, current);

if (process.argv.includes('--check')) {
  if (updated === current) {
    console.log('docs/cronli5-vs-cronstrue.md is up to date.');
  }
  else {
    console.error('docs/cronli5-vs-cronstrue.md is stale; ' +
      'run `npm run compare` to regenerate.');
    process.exitCode = 1;
  }
}
else {
  writeFileSync(docUrl, updated);
  console.log('Updated docs/cronli5-vs-cronstrue.md (' +
    tables.basic.length + ' basic + ' + tables.showcase.length +
    ' showcase rows, against cronstrue ' + cronstrueVersion + ').');
}
