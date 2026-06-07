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

// A five-field cron pattern as an array of field strings.
const fields = fc.tuple(
  field(0, 59),
  field(0, 23),
  field(1, 31),
  field(1, 12),
  field(0, 6)
);

describe('Property: any valid cron pattern', function() {
  it('produces a non-empty string and never throws', function() {
    fc.assert(fc.property(fields, function(parts) {
      const description = cronli5(parts.join(' '));

      expect(description).to.be.a('string');
      expect(description.trim()).to.have.length.above(0);
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
