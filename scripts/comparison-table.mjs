// Generate the cronli5 vs. cRonstrue output comparison table embedded in the
// README. Curated to show both convergence (the libraries agree on meaning)
// and divergence (phrasing philosophy, validation, window endpoints).
//
// Usage: node scripts/comparison-table.mjs
// Paste the output into README.md under "cronli5 vs. cRonstrue".

import cronli5 from '../src/cronli5.js';
import cronstrue from 'cronstrue';

const patterns = [
  // Broad agreement: same meaning, different voice.
  '*/5 * * * *',
  '30 9 * * MON-FRI',
  '0 9,17 * * *',
  '* 9 * * *',
  '0-30,45 9 * * *',
  '0 0 L * *',
  '0 0 * * 5L',
  '0 0 * * 1#2',
  '0 22-2 * * *',
  // Divergent windows and composition.
  '*/15 9-17 * * *',
  '*/15 30 9 * * *',
  // Folded, subject-first English vs. per-field fragments.
  '0 12 1 1 *',
  '0 0 29 2 *',
  '30 9 * * 1,3,5',
  '0 */4 * * *',
  '0 12 */2 * *',
  '15 30 9 * * *',
  // Edges where the fragment style trips: grammar, degenerate ranges,
  // and cron's day-of-month OR day-of-week semantics.
  '1 1 * * * *',
  '0 9-9 * * *',
  '59 23 31 12 5',
  '1/1 * * * *',
  '5-* * * * *'
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

const rows = patterns.map(function compare(pattern) {
  const ours = describe(cronli5, pattern);
  const theirs = describe(function cronstrueToString(p) {
    return cronstrue.toString(p);
  }, pattern);

  return '| `' + pattern + '` | ' + ours + ' | ' + theirs + ' |';
});

console.log('| Pattern | cronli5 | cRonstrue |');
console.log('| --- | --- | --- |');
console.log(rows.join('\n'));