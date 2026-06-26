import chai from 'chai';
import {arithmeticStep} from '../../src/core/util.js';

const {expect} = chai;

// Behavior spec for the pure `arithmeticStep` helper: it recognizes a sorted,
// distinct numeric set that is an arithmetic progression of length >= 5 with a
// constant gap >= 2, returning {start, interval, last}; everything else is
// null. It is output-neutral (no IR change) and language-agnostic; renderers
// use it to speak a bounded/offset step cadence instead of enumerating fires.

describe('arithmeticStep:', function() {
  describe('recognizes an arithmetic progression (length >= 5, gap >= 2)',
    function() {
      it('a uniform stride from zero (every 2 over 60)', function() {
        // 0, 2, 4, ... 58
        const values = [];

        for (let n = 0; n < 60; n += 2) {
          values.push(n);
        }

        expect(arithmeticStep(values))
          .to.deep.equal({start: 0, interval: 2, last: 58});
      });

      it('an offset stride (3/2: 3, 5, ... 59)', function() {
        const values = [];

        for (let n = 3; n < 60; n += 2) {
          values.push(n);
        }

        expect(arithmeticStep(values))
          .to.deep.equal({start: 3, interval: 2, last: 59});
      });

      it('an uneven stride (*/7: 0, 7, 14, ... 56)', function() {
        expect(arithmeticStep([0, 7, 14, 21, 28, 35, 42, 49, 56]))
          .to.deep.equal({start: 0, interval: 7, last: 56});
      });

      it('exactly five values', function() {
        expect(arithmeticStep([0, 5, 10, 15, 20]))
          .to.deep.equal({start: 0, interval: 5, last: 20});
      });
    });

  describe('returns null for non-progressions', function() {
    it('a set shorter than five', function() {
      expect(arithmeticStep([0, 7, 14, 21])).to.equal(null);
    });

    it('a gap of one (consecutive integers)', function() {
      expect(arithmeticStep([1, 2, 3, 4, 5, 6])).to.equal(null);
    });

    it('an irregular set', function() {
      expect(arithmeticStep([5, 10, 30, 40, 55])).to.equal(null);
    });

    it('an empty set', function() {
      expect(arithmeticStep([])).to.equal(null);
    });
  });
});
