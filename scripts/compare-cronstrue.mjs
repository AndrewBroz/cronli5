// Side-by-side comparison of cronli5 vs. cronstrue over the cron patterns that
// our own test suite exercises. This is NOT an assertion of 1:1 equality —
// the two libraries phrase things differently by design. It's a tool for
// eyeballing *semantic quality*: are we saying the right thing, and where does
// cronstrue read better (or worse)?
//
// Usage: node scripts/compare-cronstrue.mjs [--only=<substr>] [--diffs]
//   --only=<substr>  only show patterns containing <substr>
//   --diffs          (reserved) reserved for future filtering

import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import cronli5 from '../src/cronli5.js';
import cronstrue from 'cronstrue';

const root = fileURLToPath(new URL('..', import.meta.url));
const testDir = join(root, 'test');

const only = (process.argv.find((a) => a.startsWith('--only=')) || '')
  .split('=')[1];

// Matches a quoted 5- or 6-field cron string (the first element of most test
// tuples). Deliberately permissive about the cron character set.
const CRON_RE =
  /(['"`])([\d*?LW#][\d*?,/\-A-Z]*(?:\s+[\d*?,/\-A-Z]+){4,5})\1/g;

function walk(dir) {
  return readdirSync(dir).flatMap(function(name) {
    const path = join(dir, name);

    if (statSync(path).isDirectory()) {
      return walk(path);
    }

    return path.endsWith('.js') ? [path] : [];
  });
}

// Collect unique patterns, remembering the first test file each appeared in.
const patterns = new Map();

for (const file of walk(testDir)) {
  const source = readFileSync(file, 'utf8');
  const group = relative(testDir, file).split('/')[0];

  for (
    let match = CRON_RE.exec(source);
    match !== null;
    match = CRON_RE.exec(source)
  ) {
    const pattern = match[2];

    if (!patterns.has(pattern)) {
      patterns.set(pattern, group);
    }
  }
}

function describe(fn, pattern) {
  try {
    return {ok: true, text: fn(pattern)};
  }
  catch (error) {
    const message = String(error && error.message || error);

    return {ok: false, text: 'ERROR: ' + message.split('\n')[0]};
  }
}

// Group patterns by their originating test area for readable output.
const byGroup = new Map();

for (const [pattern, group] of patterns) {
  if (!only || pattern.includes(only)) {
    if (!byGroup.has(group)) {
      byGroup.set(group, []);
    }

    byGroup.get(group).push(pattern);
  }
}

let total = 0;
let cronstrueErrors = 0;
let cronli5Errors = 0;

for (const [group, list] of [...byGroup].sort()) {
  console.log('\n\n=== ' + group + ' (' + list.length + ') ===');

  for (const pattern of list.sort()) {
    total += 1;
    const ours = describe(cronli5, pattern);
    const theirs = describe(function(p) {
      return cronstrue.toString(p, {throwExceptionOnParseError: true});
    }, pattern);

    if (!ours.ok) {
      cronli5Errors += 1;
    }

    if (!theirs.ok) {
      cronstrueErrors += 1;
    }

    console.log('\n' + pattern);
    console.log('  cronli5  : ' + ours.text);
    console.log('  cronstrue: ' + theirs.text);
  }
}

console.log('\n\n=== summary ===');
console.log('patterns compared : ' + total);
console.log('cronli5 errors    : ' + cronli5Errors);
console.log('cronstrue errors  : ' + cronstrueErrors);
