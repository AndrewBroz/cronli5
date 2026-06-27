import chai from 'chai';
import {
  arithmeticStep, hourListStride, offsetCleanStride, singleValues
} from '../../src/core/cadence.js';

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

// Behavior spec for `singleValues`: the sorted numeric values a field's
// segments cover, or null if any segment is not a discrete single (a range or
// sub-step is not a plain fire list). Language-neutral; renderers use it to
// recover a fire list before recognizing a stride.

describe('singleValues:', function() {
  it('reads an all-single segment list as its values', function() {
    expect(singleValues([
      {kind: 'single', value: '5'},
      {kind: 'single', value: '17'}
    ])).to.deep.equal([5, 17]);
  });

  it('is null when a segment is a range', function() {
    expect(singleValues([
      {kind: 'single', value: '5'},
      {kind: 'range', bounds: ['9', '17']}
    ])).to.equal(null);
  });

  it('is null when a segment is a step', function() {
    expect(singleValues([
      {kind: 'step', fires: [0, 15, 30, 45], interval: 15, startToken: '*'}
    ])).to.equal(null);
  });

  it('is an empty list for no segments', function() {
    expect(singleValues([])).to.deep.equal([]);
  });
});

// Behavior spec for `offsetCleanStride`: whether an hour stride wraps the day
// cleanly from within its first interval (start < interval and the interval
// divides 24) — such a stride has no distinct endpoint. Every other stride is a
// bounded set the cadence pins both ends of.

describe('offsetCleanStride:', function() {
  it('is true for a clean offset that divides 24 (1/2)', function() {
    expect(offsetCleanStride({start: 1, interval: 2})).to.equal(true);
  });

  it('is true for a top-of-day stride (*/6)', function() {
    expect(offsetCleanStride({start: 0, interval: 6})).to.equal(true);
  });

  it('is false when the interval does not divide 24 (*/5)', function() {
    expect(offsetCleanStride({start: 0, interval: 5})).to.equal(false);
  });

  it('is false when the start reaches its interval (a bounded step)',
    function() {
      expect(offsetCleanStride({start: 9, interval: 2})).to.equal(false);
    });
});

// Behavior spec for `hourListStride`: an hour list's arithmetic progression, or
// null when its values are not a step the renderer should speak as a cadence. A
// progression from zero is a step however short; a non-zero one is only a step
// when it is too long to be a deliberate clock-time list (length >= 5). Interval
// one is a plain range, never a step.

describe('hourListStride:', function() {
  it('recognizes a zero-based progression however short (*/7-style)',
    function() {
      expect(hourListStride([0, 7, 14]))
        .to.deep.equal({start: 0, interval: 7, last: 14});
    });

  it('recognizes a long non-zero progression (length >= 5)', function() {
    expect(hourListStride([1, 3, 5, 7, 9]))
      .to.deep.equal({start: 1, interval: 2, last: 9});
  });

  it('is null for a short non-zero progression (a clock-time list)',
    function() {
      expect(hourListStride([9, 17])).to.equal(null);
    });

  it('is null for fewer than two values', function() {
    expect(hourListStride([5])).to.equal(null);
  });

  it('is null for an interval of one (a plain range)', function() {
    expect(hourListStride([1, 2, 3, 4, 5])).to.equal(null);
  });

  it('is null for an irregular set', function() {
    expect(hourListStride([0, 2, 5, 9])).to.equal(null);
  });
});
