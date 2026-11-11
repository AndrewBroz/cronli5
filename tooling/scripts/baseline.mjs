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

// A rough count of decision points: `if`, ternaries and `case` labels.
const BRANCH = /\bif \(|\? .*:|\bcase /gu;

// Lines and rough branch count across a language's TypeScript sources.
function sourceSize(code) {
  const dir = new URL(`../../src/lang/${code}/`, import.meta.url);
  const sources = readdirSync(dir).filter(function isSource(name) {
    return name.endsWith('.ts');
  }).map(function read(name) {
    return readFileSync(new URL(name, dir), 'utf8');
  });

  return {
    branches: sources.reduce(function count(total, source) {
      return total + (source.match(BRANCH) || []).length;
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

// The pairs both of whose sides render, so one throw does not hide the
// rest of the distribution.
function renderable(render, candidates) {
  return candidates.filter(function bothRender(pair) {
    return attempt(render, pair[0], pair[2]).text !== null &&
      attempt(render, pair[1], pair[2]).text !== null;
  });
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
    grid: score(render, renderable(render, pairs()), stem),
    renderings,
    singleCharacter: score(render,
      renderable(render, neighborPairs(coreSetSeeds())), stem),
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

export {baseline};
