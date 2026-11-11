// The paradigm harness. A language's paradigms are rows of
// [pattern, expected text] (optionally with the options to render under).
// `checkRows` holds a renderer to them; `oracleProblems` checks the rows
// themselves, with no renderer involved, so an oracle that contradicts
// itself is caught before any code is written to satisfy it.

import chai from 'chai';
import cronli5 from '../../src/cronli5.js';
import {firesOn, optionsFor} from '../../tooling/scripts/edit-diff.mjs';

const {expect} = chai;

// Register one test per row: the language must say exactly the expected
// text. A row's third element, and then `options`, are passed to cronli5.
function checkRows(language, rows, options) {
  rows.forEach(function each(row) {
    const [pattern, expected, rowOptions] = row;

    it(`${pattern} — ${expected}`, function() {
      expect(cronli5(pattern, {...rowOptions, ...options, lang: language}))
        .to.equal(expected);
    });
  });
}

// What is wrong with a set of rows measured against the grid rows it is
// meant to cover: a pattern listed twice, a grid pattern with no row, a
// row for a pattern not in the grid, and two patterns that fire at the
// same times but are worded differently.
function oracleProblems(rows, gridRows) {
  const problems = [];
  const wanted = new Set(gridRows.map(function patternOf(row) {
    return row.pattern;
  }));
  const seen = new Set();
  const wording = new Map();

  rows.forEach(function inspect(row) {
    const [pattern, expected] = row;

    if (seen.has(pattern)) {
      problems.push(`listed twice: ${pattern}`);

      return;
    }

    seen.add(pattern);

    if (!wanted.has(pattern)) {
      problems.push(`not in the grid: ${pattern}`);
    }

    const fires = firesOn(pattern, optionsFor(pattern));
    const earlier = wording.get(fires);

    if (fires !== null && earlier && earlier.expected !== expected) {
      problems.push(`same schedule, different words: ${earlier.pattern} ` +
        `and ${pattern}`);
    }
    else if (fires !== null) {
      wording.set(fires, {expected, pattern});
    }
  });

  wanted.forEach(function covered(pattern) {
    if (!seen.has(pattern)) {
      problems.push(`no row for: ${pattern}`);
    }
  });

  return problems;
}

export {checkRows, oracleProblems};
