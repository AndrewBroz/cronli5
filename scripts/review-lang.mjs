// Build a language review packet (docs/i18n-design.md §4): extract the
// cron patterns exercised by the English corpus, render each through the
// language under review alongside the English oracle and (where available)
// the cronstrue locale, cluster by plan kind and output template, and emit
// one representative per distinct template for row-cited review.
//
// Usage: node --import tsx scripts/review-lang.mjs es > /tmp/review-es.md (the
// `tsx` loader is required since the move to TypeScript source).

import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {analyze, prepare} from '../src/core/index.js';
import cronli5 from '../src/cronli5.js';
import cronstrue from 'cronstrue/i18n.js';

const code = process.argv[2] || 'es';
const lang = (await import(`../src/lang/${code}/index.js`)).default;

// Matches a quoted 5- or 6/7-field cron string in a test file.
const CRON_RE =
  /(['"`])([\d*?LW#][\d*?,/\-A-Z]*(?:\s+[\d*?,/\-A-Z]+){4,6})\1/g;

function walk(dir) {
  return readdirSync(dir).flatMap(function expand(name) {
    const path = join(dir, name);

    if (statSync(path).isDirectory()) {
      return walk(path);
    }

    return path.endsWith('.js') ? [path] : [];
  });
}

// 1. Extract the English corpus's pattern set.
const patterns = new Set();

for (const file of walk('test/lang/en')) {
  const source = readFileSync(file, 'utf8');

  for (let m = CRON_RE.exec(source); m; m = CRON_RE.exec(source)) {
    patterns.add(m[2]);
  }
}

// 2. Supplement with the language's hazard matrix: boundary hours crossed
// with the main constructions (articles, day periods, 12:00 words).
const hazardHours = [0, 1, 5, 6, 11, 12, 13, 19, 20, 23];

for (const h of hazardHours) {
  patterns.add(`0 ${h} * * *`);
  patterns.add(`30 ${h} * * *`);
  patterns.add(`*/15 ${h} * * *`);
  patterns.add(`0 ${h}-${(h + 3) % 24} * * *`);
  patterns.add(`0 ${h},${(h + 1) % 24} * * *`);
}

// 3. Render each pattern through the language, the English oracle, and the
// cronstrue locale; cluster by plan kind + output template.
function template(text) {
  return text.replace(/\d+/g, 'N');
}

// Build the row for one pattern, or null when it is invalid under the
// default options.
function buildRow(pattern) {
  try {
    const plan = analyze(prepare(pattern, lang.options())).plan;
    const ours = cronli5(pattern, {lang});
    const en = cronli5(pattern);
    let reference = '';

    try {
      reference = cronstrue.toString(pattern, {locale: code});
    }
    catch {
      reference = '(cronstrue: error)';
    }

    return {en, key: plan.kind + ' | ' + template(ours), ours, pattern,
      reference};
  }
  catch {
    return null;
  }
}

const rows = [...patterns].sort().map(buildRow).filter(Boolean);
const clusters = new Map();

for (const row of rows) {
  if (!clusters.has(row.key)) {
    clusters.set(row.key, {count: 0, row});
  }

  clusters.get(row.key).count += 1;
}

// 4. Emit the packet, grouped by plan kind.
const byKind = new Map();

for (const {count, row} of clusters.values()) {
  const kind = row.key.split(' | ')[0];

  if (!byKind.has(kind)) {
    byKind.set(kind, []);
  }

  byKind.get(kind).push({count, row});
}

console.log(`# Review packet: ${code}`);
console.log(`\n${rows.length} patterns rendered, ` +
  `${clusters.size} distinct templates.\n`);

for (const [kind, kindRows] of [...byKind.entries()].sort()) {
  console.log(`## ${kind} (${kindRows.length} templates)\n`);

  for (const {count, row} of kindRows) {
    console.log(`- \`${row.pattern}\` ×${count}`);
    console.log(`  - ${code}: ${row.ours}`);
    console.log(`  - en: ${row.en}`);
    console.log(`  - cronstrue-${code}: ${row.reference}`);
  }

  console.log('');
}
