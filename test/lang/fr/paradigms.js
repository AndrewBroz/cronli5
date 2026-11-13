import chai from 'chai';
import {existsSync} from 'node:fs';
import cronli5 from '../../../src/cronli5.js';
import french from '../../../src/lang/fr/index.js';
import {checkRows, oracleProblems} from '../../paradigms/check.js';
import {heldOutPatterns, visiblePatterns} from '../../paradigms/grid.js';
import {defaultParts, sets} from './paradigms/options.js';
import {rows as hardCases} from './paradigms/hard-cases.js';
import {rows as visible} from './paradigms/visible.js';

const {expect} = chai;

// Held-out rows judge a renderer its builder never showed them to, so the
// file is absent from a builder's checkout; everything else still runs.
const HELD_OUT = new URL('./paradigms/held-out.js', import.meta.url);
const heldOut = existsSync(HELD_OUT) ?
  (await import('./paradigms/held-out.js')).rows :
  null;

function asPatterns(patterns) {
  return patterns.map(function toRow(pattern) {
    return {pattern};
  });
}

// Each substring must be found after the one before it.
function inOrder(text, parts) {
  let from = 0;

  return parts.every(function found(part) {
    const at = text.indexOf(part, from);

    from = at + part.length;

    return at >= 0;
  });
}

describe('French paradigms:', function() {
  describe('the rows themselves, before any renderer', function() {
    it('visible rows cover the visible grid, consistently', function() {
      expect(oracleProblems(visible, asPatterns(visiblePatterns())))
        .to.deep.equal([]);
    });

    it('held-out rows cover the held-out grid, consistently', function() {
      if (heldOut) {
        expect(oracleProblems(heldOut, asPatterns(heldOutPatterns())))
          .to.deep.equal([]);
      }
    });

    it('no pattern is both visible and held out', function() {
      const shown = new Set(visible.map(function patternOf(row) {
        return row[0];
      }));

      (heldOut || []).forEach(function unseen(row) {
        expect(shown.has(row[0]), row[0]).to.equal(false);
      });
    });

    it('an option never adds, drops or reorders a part of the sentence',
      function() {
        sets.forEach(function eachSet(set) {
          set.rows.forEach(function eachRow(row) {
            const label = `${row.pattern} ${JSON.stringify(set.options)}`;

            expect(defaultParts[row.pattern], label).to.be.an('array');
            expect(row.parts, label)
              .to.have.length(defaultParts[row.pattern].length);
            expect(inOrder(row.expected, row.parts), label).to.equal(true);
          });
        });
      });
  });

  describe('visible', function() {
    checkRows(french, visible);
  });

  describe('hard cases', function() {
    checkRows(french, hardCases);
  });

  sets.forEach(function eachSet(set) {
    describe(`options ${JSON.stringify(set.options)}`, function() {
      checkRows(french, set.rows.map(function toRow(row) {
        return [row.pattern, row.expected];
      }), set.options);

      it('says the default parts in the same order', function() {
        set.rows.forEach(function eachRow(row) {
          const plain = cronli5(row.pattern, {lang: french});

          expect(inOrder(plain, defaultParts[row.pattern]), row.pattern)
            .to.equal(true);
        });
      });
    });
  });

  if (heldOut) {
    describe('held out', function() {
      checkRows(french, heldOut);
    });
  }
});
