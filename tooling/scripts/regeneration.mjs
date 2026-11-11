// The regeneration test: are a language's artifacts (its questionnaire
// answers, lexicon and visible paradigms) enough to rebuild its renderer?
// A second renderer is built from them by an agent that never saw the
// first. This compares what the two say over rows neither builder was
// shown. Every difference points at something the artifacts failed to pin
// down, to be fixed in the artifacts, not by accepting either wording.
//
// Usage: regeneration.mjs <first-index.js> <second-index.js> <rows.js>...
// (run via node --import tsx). Prints the comparison as JSON.

import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import cronli5 from '../../src/cronli5.js';

// What a renderer says for a row, or a note that it threw.
function saying(render, pattern, options) {
  try {
    return render(pattern, options);
  }
  catch (error) {
    return `threw: ${error && error.message}`;
  }
}

// Compare two renderers over rows of [pattern, expected?, options?]. Only
// the pattern and the options are used; the expected text is not consulted,
// because the question here is whether the two agree with each other.
function compareRenderers(first, second, rows) {
  const different = [];

  rows.forEach(function compare(row) {
    const [pattern, , options] = row;
    const fromFirst = saying(first, pattern, options);
    const fromSecond = saying(second, pattern, options);

    if (fromFirst !== fromSecond) {
      different.push({first: fromFirst, pattern, second: fromSecond});
    }
  });

  return {different, same: rows.length - different.length, total: rows.length};
}

// A renderer bound to a language module on disk.
async function rendererAt(path) {
  const lang = (await import(pathToFileURL(resolve(path)).href)).default;

  return function render(pattern, options) {
    return cronli5(pattern, {...options, lang});
  };
}

async function main(argv) {
  const [firstPath, secondPath, ...rowPaths] = argv;

  if (!firstPath || !secondPath || rowPaths.length === 0) {
    throw new Error(
      'usage: regeneration.mjs <first-index> <second-index> <rows.js>...');
  }

  const rowSets = await Promise.all(rowPaths.map(async function load(path) {
    return (await import(pathToFileURL(resolve(path)).href)).rows;
  }));
  const result = compareRenderers(await rendererAt(firstPath),
    await rendererAt(secondPath), rowSets.flat());

  console.log(JSON.stringify(result, null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  await main(process.argv.slice(2));
}

export {compareRenderers};
