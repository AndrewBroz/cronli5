// The edit-diff score: a relational, oracle-free measure of a renderer. A
// reader compares two crontab lines and their two descriptions; a
// one-character edit to the pattern should move only a small part of the
// sentence they hear. This generates every valid one-character neighbor of
// a pattern, renders both sides, and reports how much of the sentence
// changed, as a distribution to drive down rather than a row to make pass.
//
// Semantically equal neighbors (`*` and `*/1`) are kept on purpose: they
// must render identically, and any that do not are reported separately.
//
// Usage: edit-diff.mjs <code> [--json]  (run via node --import tsx)

import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import cronli5 from '../../src/cronli5.js';
import {fieldOrder, prepare} from '../../src/core/index.js';

const PLAIN_ALPHABET = '0123456789*/,-';
const QUARTZ_ALPHABET = 'LW#?';

// How many of the largest distances a report lists.
const WORST_COUNT = 20;

// The parse options a pattern string implies: a trailing four-digit field
// is a year, and `?` only exists under Quartz semantics.
function optionsFor(pattern) {
  const fields = pattern.trim().split(/\s+/u);

  return {
    quartz: pattern.includes('?'),
    years: (/^\d{4}\b/u).test(fields[fields.length - 1])
  };
}

// The canonical form of a pattern: its normalized fields in field order.
// Throws what the core throws on invalid input.
function canonical(pattern, options) {
  const opts = {
    quartz: Boolean(options && options.quartz),
    seconds: false,
    years: Boolean(options && options.years)
  };
  const normalized = prepare(pattern, opts);

  return fieldOrder.map(function fieldOf(field) {
    return normalized[field];
  }).join(' ');
}

// The canonical form, or null when the core rejects the pattern.
function canonicalOrNull(pattern, options) {
  try {
    return canonical(pattern, options);
  }
  catch {
    return null;
  }
}

// Every string one character away from `text`, never touching a space, so
// the field count is preserved.
function singleEdits(text, alphabet) {
  const edits = new Set();

  for (let at = 0; at <= text.length; at += 1) {
    const before = text.slice(0, at);
    const here = text[at];

    for (const char of alphabet) {
      edits.add(before + char + text.slice(at));

      if (at < text.length && here !== ' ') {
        edits.add(before + char + text.slice(at + 1));
      }
    }

    if (at < text.length && here !== ' ') {
      edits.add(before + text.slice(at + 1));
    }
  }

  return edits;
}

// Every valid pattern one character away from `pattern`: substitutions,
// insertions and deletions over the cron alphabet, with the same number of
// fields, sorted, excluding the pattern itself.
function neighbors(pattern, options) {
  const opts = {...optionsFor(pattern), ...options};
  const {quartz} = opts;
  const alphabet = quartz ? PLAIN_ALPHABET + QUARTZ_ALPHABET : PLAIN_ALPHABET;
  const fieldCount = pattern.split(' ').length;
  const found = [];

  singleEdits(pattern, alphabet).forEach(function keepValid(candidate) {
    const fields = candidate.split(' ');

    if (candidate === pattern || fields.length !== fieldCount ||
        fields.includes('')) {
      return;
    }

    try {
      canonical(candidate, opts);
      found.push(candidate);
    }
    catch {
      // Not a valid pattern: not a neighbor.
    }
  });

  return found.sort();
}

// The words a listener hears: lower-cased, with surrounding punctuation
// stripped, optionally normalized (a language's stemmer, so that agreement
// endings do not count as change).
function spokenWords(text, normalize) {
  return text.toLowerCase().split(/\s+/u).map(function strip(word) {
    return word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
  }).filter(Boolean).map(function apply(word) {
    return normalize ? normalize(word) : word;
  });
}

// The length of the longest common subsequence of two word lists.
function commonLength(left, right) {
  let previous = new Array(right.length + 1).fill(0);

  left.forEach(function row(word) {
    const current = [0];

    right.forEach(function cell(other, index) {
      current.push(word === other ?
        previous[index] + 1 :
        Math.max(previous[index + 1], current[index]));
    });
    previous = current;
  });

  return previous[right.length];
}

// The fraction of the longer text's words that changed, from 0 (the same
// words in the same order) to 1 (nothing in common).
function wordDistance(a, b, normalize) {
  const left = spokenWords(a, normalize);
  const right = spokenWords(b, normalize);
  const longer = Math.max(left.length, right.length);

  return longer === 0 ? 0 : (longer - commonLength(left, right)) / longer;
}

// The nearest-rank percentile of an ascending list.
function percentile(sorted, fraction) {
  if (sorted.length === 0) {
    return 0;
  }

  return sorted[Math.max(0, Math.ceil(sorted.length * fraction) - 1)];
}

// Render both sides of every pair and summarize how far apart they read. A
// pair is [a, b] or [a, b, options], the options being the parse options
// both sides share; they are handed to `render` as its second argument.
function score(render, pairs, normalize) {
  const rows = pairs.map(function measure(pair) {
    const [a, b, options] = pair;
    const textA = render(a, options);
    const textB = render(b, options);

    return {
      a,
      b,
      distance: wordDistance(textA, textB, normalize),
      options,
      textA,
      textB
    };
  });
  const distances = rows.map(function distanceOf(row) {
    return row.distance;
  }).sort(function ascending(x, y) {
    return x - y;
  });
  const equivalentViolations = rows.filter(function equalButDifferent(row) {
    const left = canonicalOrNull(row.a, row.options);

    return row.textA !== row.textB && left !== null &&
      left === canonicalOrNull(row.b, row.options);
  }).map(function brief(row) {
    return {a: row.a, b: row.b, distance: row.distance};
  });

  return {
    equivalentViolations,
    max: percentile(distances, 1),
    median: percentile(distances, 0.5),
    p90: percentile(distances, 0.9),
    pairs: rows.length,
    worst: rows.slice().sort(function largestFirst(x, y) {
      return y.distance - x.distance;
    }).slice(0, WORST_COUNT)
  };
}

// Every (pattern, neighbor) pair over a seed set, each carrying the parse
// options the seed implies.
function neighborPairs(seeds) {
  return seeds.flatMap(function expand(seed) {
    const options = optionsFor(seed);

    return neighbors(seed).map(function pairWith(neighbor) {
      return [seed, neighbor, options];
    });
  });
}

// The patterns of the committed core set: the default seeds.
function coreSetSeeds() {
  const url = new URL('../../test/core/core-set.json', import.meta.url);

  return JSON.parse(readFileSync(url, 'utf8')).patterns;
}

// A language's renderer in its default style, and its stemmer when its
// stability extractor exports one.
async function languageBinding(code) {
  const lang = (await import(`../../src/lang/${code}/index.js`)).default;
  let stem = null;

  try {
    ({stem = null} = await import(`./stability/${code}.mjs`));
  }
  catch {
    // No extractor for this language: compare words as they are.
  }

  return {
    render(pattern, options) {
      return cronli5(pattern, {...options, lang});
    },
    stem
  };
}

async function main(argv) {
  const code = argv.find(function isCode(arg) {
    return !arg.startsWith('--');
  });

  if (!code) {
    throw new Error('usage: edit-diff.mjs <code> [--json]');
  }

  const binding = await languageBinding(code);
  const report = score(binding.render, neighborPairs(coreSetSeeds()),
    binding.stem);

  if (argv.includes('--json')) {
    console.log(JSON.stringify(report, null, 2));

    return;
  }

  console.log(`${code}: ${report.pairs} pairs, median ` +
    `${report.median.toFixed(3)}, p90 ${report.p90.toFixed(3)}, max ` +
    `${report.max.toFixed(3)}, equal-but-different ` +
    `${report.equivalentViolations.length}`);
  report.worst.forEach(function show(row) {
    console.log(`\n${row.distance.toFixed(3)}  ${row.a}  ->  ${row.b}`);
    console.log(`  ${row.textA}\n  ${row.textB}`);
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  await main(process.argv.slice(2));
}

export {
  canonical, coreSetSeeds, languageBinding, neighborPairs, neighbors,
  optionsFor, score, wordDistance
};
