import chai from 'chai';
import fc from 'fast-check';
import {analyze, candidatesAs, denote, describeCadencePieces, describeSet,
  domainOf, prepare, readingOf} from '../../src/core/index.js';

const {expect} = chai;
const HOURS = {cyclic: true, max: 23, min: 0};
const MINUTES = {cyclic: true, max: 59, min: 0};
const WEEKDAYS = {cyclic: true, max: 6, min: 0};
const YEARS = {cyclic: false, max: 9999, min: 1970};

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

function ascending(a, b) {
  return a - b;
}

function facts(pattern, options) {
  return analyze(prepare(pattern, readingOf({...options})));
}

const SEVEN = {seconds: true, years: true};

describe('a set with no end:', function() {
  it('marks a range that runs to the end of a field that does not cycle',
    function() {
      expect(describeSet(upTo(9999, 1, 2030), YEARS)).to.deep.include(
        {from: 2030, kind: 'range', open: true, to: 9999});
      expect(describeSet(upTo(2040, 1, 2030), YEARS)).to.deep.include(
        {from: 2030, kind: 'range', to: 2040});
    });

  it('marks a cadence with no further value before the end', function() {
    expect(describeSet(upTo(9999, 2, 2030), YEARS)).to.deep.include(
      {interval: 2, kind: 'cadence', last: 9998, open: true, start: 2030});
    expect(describeSet(upTo(2040, 2, 2030), YEARS)).to.deep.include(
      {interval: 2, kind: 'cadence', last: 2040, start: 2030});
  });

  it('never marks a cyclic field, which has no end', function() {
    describeSet(upTo(59, 1, 30), MINUTES).concat(
      describeSet(upTo(59, 5, 0), MINUTES),
      describeSet([0, 1, 2, 40, 45, 50, 55], MINUTES)
    ).forEach(function closed(candidate) {
      expect(JSON.stringify(candidate)).to.not.include('open');
    });
  });

  it('marks the base of an exception too', function() {
    const values = upTo(9999, 1, 2030).filter(function not2040(year) {
      return year !== 2040;
    });

    expect(describeSet(values, YEARS)).to.deep.include({
      base: {from: 2030, kind: 'range', open: true, to: 9999},
      kind: 'except',
      removed: [2040]
    });
  });

  it('reaches a renderer on the year field', function() {
    const {year} = facts('0 0 9 * * * 2030/1', SEVEN).analyses.candidates;

    expect(year[0]).to.deep.equal(
      {from: 2030, kind: 'range', open: true, to: 9999});
  });
});

// Some sets are several runs and cadences at once, and no single
// description fits them. They are offered beside a field's candidates,
// never among them, so a renderer that predates them is unaffected.
describe('runs and cadences together:', function() {
  it('offers a cadence with the values beside it', function() {
    const values = upTo(9999, 2, 2030).concat(2031).sort(ascending);

    expect(describeCadencePieces(values, YEARS)).to.deep.equal(
      {kind: 'cadencePieces', parts: [
        {interval: 2, kind: 'cadence', last: 9998, open: true, start: 2030},
        {kind: 'values', values: [2031]}
      ]});
    expect(kinds(describeSet(values, YEARS)))
      .to.not.include('cadencePieces');
  });

  it('offers a run and then a cadence', function() {
    const values = upTo(2040, 1, 2030).concat(upTo(9999, 5, 2045));

    expect(describeCadencePieces(values, YEARS).parts).to.deep.equal([
      {from: 2030, kind: 'range', to: 2040},
      {interval: 5, kind: 'cadence', last: 9995, open: true, start: 2045}
    ]);
  });

  it('marks a run to the end of the years as open', function() {
    const values = upTo(2040, 5, 2020).concat(upTo(9999, 1, 2050));

    expect(describeCadencePieces(values, YEARS).parts).to.deep.equal([
      {interval: 5, kind: 'cadence', last: 2040, start: 2020},
      {from: 2050, kind: 'range', open: true, to: 9999}
    ]);
  });

  it('offers two cadences in one field', function() {
    const values = upTo(20, 2, 0).concat(upTo(59, 3, 21));

    expect(describeCadencePieces(values, MINUTES).parts).to.deep.equal([
      {interval: 2, kind: 'cadence', last: 20, start: 0},
      {interval: 3, kind: 'cadence', last: 57, start: 21}
    ]);
  });

  it('finds cadences that interleave', function() {
    const values = upTo(9999, 4, 2030).concat(upTo(9999, 4, 2031))
      .sort(ascending);

    expect(describeCadencePieces(values, YEARS).parts).to.deep.equal([
      {interval: 4, kind: 'cadence', last: 9998, open: true, start: 2030},
      {interval: 4, kind: 'cadence', last: 9999, open: true, start: 2031}
    ]);
  });

  it('gathers loose values into one part', function() {
    const values = [0, 7, 10, 20, 30, 40, 50, 53];

    expect(describeCadencePieces(values, MINUTES).parts).to.deep.equal([
      {interval: 10, kind: 'cadence', last: 50, start: 0},
      {kind: 'values', values: [7, 53]}
    ]);
  });

  it('never wraps, and no cadence crosses the top of the field',
    function() {
      expect(describeCadencePieces(
        [0, 1, 2, 6, 9, 12, 15, 22, 23], HOURS).parts).to.deep.equal([
        {from: 0, kind: 'range', to: 2},
        {interval: 3, kind: 'cadence', last: 15, start: 6},
        {kind: 'values', values: [22, 23]}
      ]);
      // 50, 5, 20 would be a cadence of 15 across the top of the hour.
      expect(describeCadencePieces([5, 20, 50], MINUTES)).to.equal(null);
    });

  it('is not offered where there is no cadence, or only one part',
    function() {
      expect(describeCadencePieces([1, 2, 3, 4, 5, 7], MINUTES))
        .to.equal(null);
      expect(describeCadencePieces(upTo(59, 5, 0), MINUTES)).to.equal(null);
      expect(describeCadencePieces([9], HOURS)).to.equal(null);
    });

  it('takes long runs first unless a cadence through them names less',
    function() {
      // Runs first names four things; so does the cadence from 0, and the
      // runs win the tie.
      expect(describeCadencePieces(
        [0, 1, 2, 3, 10, 20, 30, 40, 50], MINUTES).parts).to.deep.equal([
        {from: 0, kind: 'range', to: 3},
        {interval: 10, kind: 'cadence', last: 50, start: 10}
      ]);
      // 2030 through 2032 and every 2nd year from 2034 is every 2nd year
      // from 2030, and 2031: three things named in place of four.
      expect(describeCadencePieces(
        [2030, 2031, 2032].concat(upTo(9999, 2, 2034)), YEARS).parts)
        .to.deep.equal([
          {interval: 2, kind: 'cadence', last: 9998, open: true,
            start: 2030},
          {kind: 'values', values: [2031]}
        ]);
    });

  it('walks a cyclic field from the value a view names', function() {
    // Monday, Wednesday, Friday, Sunday and Saturday, in a week from
    // Monday: every second day from Monday through Sunday, and Saturday.
    expect(describeCadencePieces([0, 1, 3, 5, 6], WEEKDAYS, {first: 1}))
      .to.deep.equal({kind: 'cadencePieces', parts: [
        {interval: 2, kind: 'cadence', last: 0, start: 1},
        {kind: 'values', values: [6]}
      ]});
  });

  it('reaches a renderer beside the candidates', function() {
    const {analyses} = facts('0-20/2,21-59/3 * * * *');

    expect(analyses.cadencePieces.minute.parts).to.deep.equal([
      {interval: 2, kind: 'cadence', last: 20, start: 0},
      {interval: 3, kind: 'cadence', last: 57, start: 21}
    ]);
    expect(analyses.cadencePieces.hour).to.equal(null);
    expect(facts('0 0 L * *').analyses.cadencePieces.date).to.equal(null);
    expect(facts('*/5 * * * *').analyses.cadencePieces.minute)
      .to.equal(null);
  });

  it('keeps every year description small', function() {
    ['2030/2,2031', '2030/1', '2030-2032,2034/2', '2030/4,2031',
      '2030/4,2031/4', '2030/3,2031-2040'].forEach(function small(years) {
      const {analyses} = facts(`0 0 9 * * * ${years}`, SEVEN);
      const offered = analyses.candidates.year
        .concat(analyses.cadencePieces.year || []);
      const smallest = Math.min(...offered.map(function size(candidate) {
        return JSON.stringify(candidate).length;
      }));

      expect(smallest, years).to.be.below(300);
    });
  });

  it('denotes exactly the input set', function() {
    fc.assert(fc.property(
      fc.uniqueArray(fc.integer({max: 59, min: 0}), {minLength: 1}),
      fc.integer({max: 59, min: 0}),
      function faithful(raw, first) {
        const values = raw.slice().sort(ascending);

        [describeCadencePieces(values, MINUTES),
          describeCadencePieces(values, MINUTES, {first})
        ].forEach(function same(found) {
          expect(found === null || denote(found, MINUTES).join() ===
            values.join()).to.equal(true);
        });
      }
    ));
  });
});

describe('candidatesAs:', function() {
  function weekdays(pattern, opts) {
    return candidatesAs(facts(pattern), 'weekday', opts);
  }

  it('gives the field\'s own candidates when nothing is asked', function() {
    const found = facts('0 22-2 * * 6,0');

    expect(candidatesAs(found, 'hour', {}))
      .to.deep.equal(found.analyses.candidates.hour);
    expect(candidatesAs(found, 'weekday', {first: 0}))
      .to.deep.equal(found.analyses.candidates.weekday);
  });

  it('is null for a Quartz field and all for a whole one', function() {
    const found = facts('0 0 L * *');

    expect(candidatesAs(found, 'date', {linear: true})).to.equal(null);
    expect(candidatesAs(found, 'weekday', {first: 1}))
      .to.deep.equal([{kind: 'all'}]);
  });

  it('walks the week from the day a language starts it on', function() {
    // Saturday and Sunday: a wrapped pair from Sunday, the week's last
    // two days from Monday.
    expect(weekdays('0 0 * * 6,0', {first: 0}).pop())
      .to.deep.equal({kind: 'values', values: [0, 6]});
    expect(weekdays('0 0 * * 6,0', {first: 1}).pop())
      .to.deep.equal({kind: 'values', values: [6, 0]});
    expect(weekdays('0 0 * * 5-7', {first: 1}))
      .to.deep.include({from: 5, kind: 'range', to: 0});
    expect(weekdays('0 0 * * 1,3,5,0', {first: 1})).to.deep.include(
      {interval: 2, kind: 'cadence', last: 0, start: 1});
  });

  it('breaks a tie between gaps at the start of the readers\' week',
    function() {
      // Sunday to Tuesday and Thursday: from Sunday the run comes first;
      // from Monday the walk still starts after the widest gap.
      expect(weekdays('0 0 * * 0-2,4', {first: 0})).to.deep.include(
        {kind: 'pieces', parts: [
          {from: 0, kind: 'range', to: 2}, {kind: 'values', values: [4]}
        ]});
      expect(weekdays('0 0 * * 0,1,3,4', {first: 1}).pop())
        .to.deep.equal({kind: 'values', values: [1, 3, 4, 0]});
      expect(weekdays('0 0 * * 0,1,3,4', {first: 0}).pop())
        .to.deep.equal({kind: 'values', values: [0, 1, 3, 4]});
    });

  it('lists exceptions from the start of the week too', function() {
    expect(weekdays('0 0 * * 2-5', {first: 1})).to.deep.include(
      {base: {kind: 'all'}, kind: 'except', removed: [1, 6, 0]});
  });

  it('cuts a wrapped run at the edge of the unit when asked', function() {
    const hours = candidatesAs(facts('0 22-2 * * *'), 'hour',
      {linear: true});

    expect(kinds(hours)).to.not.include('range');
    expect(hours).to.deep.include({kind: 'pieces', parts: [
      {from: 0, kind: 'range', to: 2}, {kind: 'values', values: [22, 23]}
    ]});
    expect(candidatesAs(facts('0 0 20-10 * *'), 'date', {linear: true}))
      .to.deep.include({kind: 'pieces', parts: [
        {from: 1, kind: 'range', to: 10}, {from: 20, kind: 'range', to: 31}
      ]});
    expect(JSON.stringify(hours)).to.not.include('open');
  });

  it('cuts at the end of the readers\' week', function() {
    // Friday to Monday, in a week from Monday: Monday, then Friday to
    // Sunday.
    expect(weekdays('0 0 * * 5-1', {first: 1, linear: true}))
      .to.deep.include({kind: 'pieces', parts: [
        {kind: 'values', values: [1]}, {from: 5, kind: 'range', to: 0}
      ]});
  });

  it('denotes the same set however it is viewed', function() {
    fc.assert(fc.property(
      fc.uniqueArray(fc.integer({max: 6, min: 0}),
        {maxLength: 6, minLength: 1}),
      fc.integer({max: 6, min: 0}),
      fc.boolean(),
      function faithful(raw, first, linear) {
        const values = raw.slice().sort(ascending);
        const found = facts(`0 0 * * ${values.join(',')}`);

        candidatesAs(found, 'weekday', {first, linear})
          .forEach(function same(candidate) {
            expect(denote(candidate, WEEKDAYS).slice().sort(ascending))
              .to.deep.equal(values);
          });
      }
    ));
  });

  it('has each field\'s domain to hand', function() {
    expect(domainOf('hour')).to.deep.equal(HOURS);
    expect(domainOf('weekday')).to.deep.equal(WEEKDAYS);
    expect(domainOf('year')).to.deep.equal(YEARS);
  });
});
