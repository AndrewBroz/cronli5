import {expect} from 'chai';
import fc from 'fast-check';
import cronli5 from '../../src/cronli5.js';

// Property-based tests: rather than enumerating individual cases, generate a
// wide variety of *valid* cron patterns and assert invariants that must hold
// for every one of them.

// An arbitrary that produces a single valid field for the given numeric
// bounds: a wildcard, a single value, a step, an inclusive range, or a list.
function field(min, max) {
  const int = fc.integer({min, max});

  return fc.oneof(
    fc.constant('*'),
    int.map(String),
    fc.integer({min: 1, max}).map(function(n) {
      return '*/' + n;
    }),
    fc.tuple(int, int).map(function(pair) {
      return Math.min(pair[0], pair[1]) + '-' + Math.max(pair[0], pair[1]);
    }),
    fc.array(int, {minLength: 2, maxLength: 4}).map(function(values) {
      return values.join(',');
    })
  );
}

// An arbitrary that produces a single valid field like `field`, but whose
// comma lists may also mix in range and step segments (e.g. `0-30,45` or
// `9,17/2`), which are valid cron and have crashed interpretation before.
function mixedField(min, max) {
  const int = fc.integer({min, max});
  const single = int.map(String);
  const range = fc.tuple(int, int).map(function(pair) {
    return Math.min(pair[0], pair[1]) + '-' + Math.max(pair[0], pair[1]);
  });
  const step = fc.tuple(int, fc.integer({min: 1, max})).map(function(pair) {
    return pair[0] + '/' + pair[1];
  });
  const segment = fc.oneof(single, range, step);

  return fc.array(segment, {minLength: 2, maxLength: 3}).map(
    function(segments) {
      return segments.join(',');
    });
}

// A five-field cron pattern as an array of field strings.
const fields = fc.tuple(
  field(0, 59),
  field(0, 23),
  field(1, 31),
  field(1, 12),
  field(0, 6)
);

// A five-field cron pattern whose fields may all be mixed lists, and whose
// date/weekday fields may be Quartz tokens.
const mixedFields = fc.tuple(
  mixedField(0, 59),
  mixedField(0, 23),
  fc.oneof(
    mixedField(1, 31),
    fc.constantFrom('L', 'LW', 'WL', 'L-1', 'L-30', '1W', '31W', '?')
  ),
  mixedField(1, 12),
  fc.oneof(
    mixedField(0, 6),
    fc.constantFrom('5L', 'FRIL', '0L', '1#2', 'MON#5', 'L', '?')
  )
);

describe('Property: any valid cron pattern', function() {
  it('produces a non-empty string and never throws', function() {
    fc.assert(fc.property(fields, function(parts) {
      const description = cronli5(parts.join(' '));

      expect(description).to.be.a('string');
      expect(description.trim()).to.have.length.above(0);
    }), {numRuns: 500});
  });

  it('handles mixed lists without crashing or leaking NaN', function() {
    fc.assert(fc.property(mixedFields, function(parts) {
      const description = cronli5(parts.join(' '));

      expect(description).to.be.a('string');
      expect(description.trim()).to.have.length.above(0);
      expect(description).to.not.match(/NaN|undefined/);
    }), {numRuns: 500});
  });

  it('is deterministic for a given input', function() {
    fc.assert(fc.property(fields, function(parts) {
      const pattern = parts.join(' ');

      expect(cronli5(pattern)).to.equal(cronli5(pattern));
    }), {numRuns: 250});
  });

  it('treats string and array forms identically', function() {
    fc.assert(fc.property(fields, function(parts) {
      expect(cronli5(parts.join(' '))).to.equal(cronli5(parts));
    }), {numRuns: 250});
  });
});
