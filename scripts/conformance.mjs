// Export a language's paradigm rows as its conformance suite: plain JSON
// that an implementation in any programming language can run. Each row is
// a pattern, the options to describe it under, and the description
// expected. The rows are hand-written (test/lang/<code>/paradigms/); this
// script only gathers them, so the file it writes is never edited by hand.
//
//   node --import tsx scripts/conformance.mjs           write the files
//   node --import tsx scripts/conformance.mjs --check   fail if one is stale

import {existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync}
  from 'node:fs';
import {pathToFileURL} from 'node:url';

const ROOT = new URL('../', import.meta.url);

// A row's options as plain data with its keys in order, so the file is
// stable. A value that JSON cannot carry would be lost in a port, so it
// stops the export instead.
function plain(value, where) {
  if (Array.isArray(value)) {
    return value.map(function each(item) {
      return plain(item, where);
    });
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(
      function entry(key) {
        return [key, plain(value[key], where)];
      }
    ));
  }

  if (!['string', 'number', 'boolean'].includes(typeof value)) {
    throw new Error(`A conformance row cannot carry ${String(value)} ` +
      `(${where}); its options must be plain data.`);
  }

  return value;
}

function rowOf(code, pattern, expected, options) {
  return {
    expected,
    options: plain({lang: code, ...options}, pattern),
    pattern
  };
}

// The rows of one paradigm file, or none where a checkout has no such file
// (a renderer's builder never sees the held-out rows).
async function rowsIn(code, file) {
  const url = new URL(`test/lang/${code}/paradigms/${file}.js`, ROOT);

  return existsSync(url) ? (await import(url.href)).rows : [];
}

/** The conformance suite for one language, as the value written to disk. */
async function conformance(code) {
  const sources = await Promise.all(
    ['visible', 'held-out', 'hard-cases'].map(function load(file) {
      return rowsIn(code, file);
    })
  );
  const optionSets = (await import(
    new URL(`test/lang/${code}/paradigms/options.js`, ROOT).href)).sets;
  const rows = sources.flat().map(function plainRow(row) {
    return rowOf(code, row[0], row[1], row[2]);
  }).concat(optionSets.flatMap(function eachSet(set) {
    return set.rows.map(function optionRow(row) {
      return rowOf(code, row.pattern, row.expected, set.options);
    });
  })).filter(function portable(row) {
    return typeof row.pattern === 'string';
  });

  return {language: code, rows};
}

function languages() {
  return readdirSync(new URL('src/lang/', ROOT)).filter(function shipped(code) {
    return existsSync(new URL(`src/lang/${code}/status.json`, ROOT));
  });
}

async function main() {
  const check = process.argv.includes('--check');
  const stale = [];

  mkdirSync(new URL('conformance/', ROOT), {recursive: true});

  for (const code of languages()) {
    const url = new URL(`conformance/${code}.json`, ROOT);
    const text = JSON.stringify(await conformance(code), null, 1) + '\n';
    const current = existsSync(url) ? readFileSync(url, 'utf8') : '';

    if (text !== current && check) {
      stale.push(`conformance/${code}.json`);
    }
    else if (text !== current) {
      writeFileSync(url, text);
      console.log(`Wrote conformance/${code}.json.`);
    }
  }

  if (stale.length) {
    console.error('Stale conformance suites: ' + stale.join(', ') +
      '; run `npm run conformance` to regenerate.');
    process.exitCode = 1;
  }
}

if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}

export {conformance};
