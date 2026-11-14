// Compare a rebuilt renderer with the baseline captured from the one it
// replaced: size, branches, and how far a one-field or one-character edit
// moves the description. The word-change figures are a rough instrument,
// not a target: they reward long sentences and cannot tell a correct
// description from a wrong one, so read them beside the paradigms and the
// continuity test, never in place of them.
//
// Usage: compare-baseline.mjs <code>  (run via node --import tsx)

import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {baseline} from './baseline.mjs';

const BASELINE_DIR =
  new URL('../experiments/renderer-process/baseline/', import.meta.url);

function percent(fraction) {
  return `${(fraction * 100).toFixed(0)}%`;
}

// The rows of the comparison, each [label, before, now].
function comparison(before, now) {
  return [
    ['Lines', before.size.lines, now.size.lines],
    ['Branches', before.size.branches, now.size.branches],
    ['Grid, median change', percent(before.grid.median),
      percent(now.grid.median)],
    ['Grid, 90th percentile', percent(before.grid.p90),
      percent(now.grid.p90)],
    ['One character, median change', percent(before.singleCharacter.median),
      percent(now.singleCharacter.median)],
    ['One character, 90th percentile', percent(before.singleCharacter.p90),
      percent(now.singleCharacter.p90)],
    ['Equal schedules worded differently',
      before.singleCharacter.equivalentViolations.length,
      now.singleCharacter.equivalentViolations.length],
    ['Grid rows that throw', before.failures, now.failures]
  ];
}

async function main(argv) {
  const [code] = argv;

  if (!code) {
    throw new Error('usage: compare-baseline.mjs <code>');
  }

  const before = JSON.parse(
    readFileSync(new URL(`${code}.json`, BASELINE_DIR), 'utf8'));
  const rows = comparison(before, await baseline(code));

  console.log(`| Measure | Before (${before.commit}) | Now |`);
  console.log('| --- | --- | --- |');
  rows.forEach(function print(row) {
    console.log(`| ${row.join(' | ')} |`);
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  await main(process.argv.slice(2));
}

export {comparison};
