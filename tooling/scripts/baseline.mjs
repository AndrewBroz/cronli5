// Capture how a language's renderer measures today, so a rebuilt renderer
// can be compared with it on the same terms: source size, branch count,
// the edit-diff score over one-character neighbors and over the paradigm
// grid, and its rendering of every grid row.
//
// Usage: baseline.mjs <code>  (run via node --import tsx)
// Writes tooling/experiments/renderer-process/baseline/<code>.json.

import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {allRows, pairs} from '../../test/paradigms/grid.js';
import {coreSetSeeds, languageBinding, neighborPairs, score}
  from './edit-diff.mjs';

const OUTPUT_DIR =
  new URL('../experiments/renderer-process/baseline/', import.meta.url);

// A decision point: an `if`, a `case` label, or a ternary. The ternary's
// `?` may end its line; a nullish `??`, an optional `?.` and a type's
// optional `?:` are not decisions.
const BRANCH = /\bif \(|\bcase |(?<!\?)\?(?![?.:])\s/gu;

// A rough count of the decision points in a source text.
function countBranches(source) {
  return (source.match(BRANCH) || []).length;
}

// Every TypeScript source under a directory, however deeply nested.
function sourcesUnder(dir) {
  return readdirSync(dir, {withFileTypes: true}).flatMap(function read(entry) {
    if (entry.isDirectory()) {
      return sourcesUnder(new URL(`${entry.name}/`, dir));
    }

    return entry.name.endsWith('.ts') ?
      [readFileSync(new URL(entry.name, dir), 'utf8')] :
      [];
  });
}

// Lines and rough branch count across a language's TypeScript sources.
function sourceSize(code) {
  const sources =
    sourcesUnder(new URL(`../../src/lang/${code}/`, import.meta.url));

  return {
    branches: sources.reduce(function count(total, source) {
      return total + countBranches(source);
    }, 0),
    lines: sources.reduce(function count(total, source) {
      return total + source.split('\n').length;
    }, 0)
  };
}

// The renderer's output for a pattern, or the error it threw.
function attempt(render, pattern, options) {
  try {
    return {text: render(pattern, options)};
  }
  catch (error) {
    return {error: String(error && error.message), text: null};
  }
}

// Score the pairs both of whose sides render, and count the ones dropped
// because a side threw: one throw should not hide the distribution, and a
// renderer must not score better by failing on the hard patterns.
function scoreRenderable(render, candidates, stem) {
  const usable = candidates.filter(function bothRender(pair) {
    return attempt(render, pair[0], pair[2]).text !== null &&
      attempt(render, pair[1], pair[2]).text !== null;
  });

  return {
    ...score(render, usable, stem),
    dropped: candidates.length - usable.length
  };
}

function currentCommit() {
  return execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
    cwd: fileURLToPath(new URL('.', import.meta.url)),
    encoding: 'utf8'
  }).trim();
}

// Remember each rendering: the scores render every pattern many times
// over, once per pair it appears in.
function remembering(render) {
  const seen = new Map();

  return function remembered(pattern, options) {
    const key = `${pattern}|${JSON.stringify(options || null)}`;

    if (!seen.has(key)) {
      seen.set(key, attempt(render, pattern, options));
    }

    const result = seen.get(key);

    if (result.text === null) {
      throw new Error(result.error);
    }

    return result.text;
  };
}

/** Measure a language's current renderer. */
async function baseline(code) {
  const binding = await languageBinding(code);
  const render = remembering(binding.render);
  const {stem} = binding;
  const renderings = allRows().map(function renderRow(row) {
    return {
      pattern: row.pattern,
      quartz: row.quartz,
      ...attempt(render, row.pattern)
    };
  });

  return {
    capturedAt: new Date().toISOString(),
    code,
    commit: currentCommit(),
    failures: renderings.filter(function failed(row) {
      return row.text === null;
    }).length,
    grid: scoreRenderable(render, pairs(), stem),
    renderings,
    singleCharacter: scoreRenderable(render,
      neighborPairs(coreSetSeeds()), stem),
    size: sourceSize(code)
  };
}

async function main(argv) {
  const [code] = argv;

  if (!code) {
    throw new Error('usage: baseline.mjs <code>');
  }

  const captured = await baseline(code);

  mkdirSync(OUTPUT_DIR, {recursive: true});
  writeFileSync(new URL(`${code}.json`, OUTPUT_DIR),
    `${JSON.stringify(captured, null, 2)}\n`);
  console.log(`${code}: ${captured.size.lines} lines, ` +
    `${captured.size.branches} branches; grid median ` +
    `${captured.grid.median.toFixed(3)}, max ${captured.grid.max.toFixed(3)}` +
    `; single-character median ${captured.singleCharacter.median.toFixed(3)}` +
    `, max ${captured.singleCharacter.max.toFixed(3)}; failures ` +
    `${captured.failures}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  await main(process.argv.slice(2));
}

export {baseline, countBranches, sourceSize};
