import chai from 'chai';
import fc from 'fast-check';
import {denote, describeSet} from '../../src/core/describe-set.js';

const {expect} = chai;
const DATES = {cyclic: true, max: 31, min: 1};
const HOURS = {cyclic: true, max: 23, min: 0};
const MINUTES = {cyclic: true, max: 59, min: 0};

function upTo(max, step, start) {
  const values = [];

  for (let n = start; n <= max; n += step) {
    values.push(n);
  }

  return values;
}

function kinds(candidates) {
  return candidates.map(function kindOf(candidate) {
    return candidate.kind;
  });
}

// `describeSet` proposes every compact way a set of field values can be
// said; a language renders the ones it has a device for and the shortest
// spoken form wins. It is set arithmetic only: no words, and no limit that
// is not itself a fact about the sets.
describe('describeSet:', function() {
  it('describes the whole domain as all, and nothing else', function() {
    expect(describeSet(upTo(59, 1, 0), MINUTES))
      .to.deep.equal([{kind: 'all'}]);
  });

  it('offers a cadence for the odd days', function() {
    expect(describeSet(upTo(31, 2, 1), DATES)).to.deep.include(
      {interval: 2, kind: 'cadence', last: 31, start: 1});
  });

  it('offers the odd days except the 15th', function() {
    const odd = upTo(31, 2, 1).filter(function not15(day) {
      return day !== 15;
    });

    expect(describeSet(odd, DATES)).to.deep.include({
      base: {interval: 2, kind: 'cadence', last: 31, start: 1},
      kind: 'except',
      removed: [15]
    });
    expect(kinds(describeSet(odd, DATES))).to.include('values');
  });

  it('extends a cadence to the domain when few values are missing',
    function() {
      // 3, 5, ... 31: the odd days without the 1st.
      expect(describeSet(upTo(31, 2, 3), DATES)).to.deep.include({
        base: {interval: 2, kind: 'cadence', last: 31, start: 1},
        kind: 'except',
        removed: [1]
      });
    });

  it('offers a range, and a wrap-around range in a cyclic domain',
    function() {
      expect(describeSet(upTo(17, 1, 9), HOURS)).to.deep.include(
        {from: 9, kind: 'range', to: 17});
      expect(describeSet([0, 1, 2, 22, 23], HOURS)).to.deep.include(
        {from: 22, kind: 'range', to: 2});
      expect(kinds(describeSet([0, 1, 2, 22, 23], HOURS)))
        .to.not.include('pieces');
    });

  it('does not wrap a range in a domain that is not cyclic', function() {
    const years = {cyclic: false, max: 2030, min: 2020};

    expect(kinds(describeSet([2020, 2021, 2029, 2030], years)))
      .to.not.include('range');
  });

  it('offers pieces and a range with an exception for a broken run',
    function() {
      const found = describeSet([1, 2, 3, 4, 5, 7], DATES);

      expect(found).to.deep.include({kind: 'pieces', parts: [
        {from: 1, kind: 'range', to: 5}, {kind: 'values', values: [7]}
      ]});
      expect(found).to.deep.include({
        base: {from: 1, kind: 'range', to: 7}, kind: 'except', removed: [6]
      });
    });

  it('offers everything except a few values', function() {
    expect(describeSet(upTo(11, 1, 1), {cyclic: true, max: 12, min: 1}))
      .to.deep.include({base: {kind: 'all'}, kind: 'except', removed: [12]});
  });

  it('offers a two-value cadence only when it tiles a cyclic field',
    function() {
      expect(describeSet([0, 30], MINUTES)).to.deep.include(
        {interval: 30, kind: 'cadence', last: 30, start: 0});
      expect(describeSet([0, 12], HOURS)).to.deep.include(
        {interval: 12, kind: 'cadence', last: 12, start: 0});
      expect(kinds(describeSet([15, 45], MINUTES))).to.include('cadence');
      expect(kinds(describeSet([0, 20], MINUTES))).to.not.include('cadence');
      expect(kinds(describeSet([2020, 2025],
        {cyclic: false, max: 2029, min: 2020}))).to.not.include('cadence');
    });

  it('offers only values for one or two scattered values', function() {
    expect(describeSet([9], HOURS))
      .to.deep.equal([{kind: 'values', values: [9]}]);
    expect(kinds(describeSet([9, 17], HOURS))).to.deep.equal(['values']);
  });

  it('never removes as many values as it keeps', function() {
    describeSet([0, 30], MINUTES).forEach(function bounded(candidate) {
      expect(candidate.kind).to.not.equal('except');
    });
  });

  it('keeps a wrap-around run whole when another value joins it',
    function() {
      expect(describeSet([0, 1, 2, 10, 22, 23], HOURS)).to.deep.include(
        {kind: 'pieces', parts: [
          {from: 22, kind: 'range', to: 2}, {kind: 'values', values: [10]}
        ]});
    });

  it('offers a wrap-around range with an exception', function() {
    expect(describeSet([0, 2, 22, 23], HOURS)).to.deep.include({
      base: {from: 22, kind: 'range', to: 2}, kind: 'except', removed: [1]
    });
  });

  it('never offers an exception that names more than the list would',
    function() {
      const weekdays = {cyclic: true, max: 6, min: 0};

      expect(kinds(describeSet([1, 3, 5], weekdays)))
        .to.deep.equal(['cadence', 'values']);
    });

  it('stays small for a cadence across a very large domain', function() {
    const years = {cyclic: false, max: 9999, min: 1970};

    describeSet(upTo(9999, 2, 2030), years).forEach(function small(found) {
      if (found.kind === 'except') {
        expect(found.removed.length).to.be.below(100);
      }
    });
  });

  it('returns candidates in the fixed order', function() {
    const order = ['all', 'range', 'cadence', 'pieces', 'except', 'values'];
    const found = kinds(describeSet([1, 2, 3, 4, 5, 7], DATES));

    expect(found).to.deep.equal(found.slice().sort(function byOrder(a, b) {
      return order.indexOf(a) - order.indexOf(b);
    }));
  });

  it('denotes exactly the input set, for every candidate', function() {
    fc.assert(fc.property(
      fc.uniqueArray(fc.integer({max: 31, min: 1}), {minLength: 1}),
      function faithful(raw) {
        const values = raw.slice().sort(function ascending(a, b) {
          return a - b;
        });

        describeSet(values, DATES).forEach(function same(candidate) {
          expect(denote(candidate, DATES)).to.deep.equal(values);
        });
      }
    ));
  });

  it('denotes exactly the input set in a domain that starts at zero',
    function() {
      fc.assert(fc.property(
        fc.uniqueArray(fc.integer({max: 23, min: 0}), {minLength: 1}),
        function faithful(raw) {
          const values = raw.slice().sort(function ascending(a, b) {
            return a - b;
          });

          describeSet(values, HOURS).forEach(function same(candidate) {
            expect(denote(candidate, HOURS)).to.deep.equal(values);
          });
        }
      ));
    });
});
