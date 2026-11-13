import chai from 'chai';
import {analyze, daysByMonths, daysReached, prepare, readingOf}
  from '../../src/core/index.js';

const {expect} = chai;

function schedule(pattern, options) {
  return analyze(prepare(pattern, readingOf({...options})));
}

function facts(pattern, options) {
  return schedule(pattern, options).analyses;
}

function reach(pattern, options) {
  return facts(pattern, options).dateReach;
}

function kinds(candidates) {
  return candidates.map(function kindOf(candidate) {
    return candidate.kind;
  });
}

const YEARS = {seconds: true, years: true};

// The days from the 2nd up to a day.
function upTo(last) {
  return Array.from({length: last - 1}, function day(unused, index) {
    return index + 2;
  });
}

// Months differ in length, so a day-of-month arm does not fire in every
// month the pattern reaches. That is the same in every language, so the
// core says it; a renderer never needs to know how long a month is.
describe('analyses.dateReach:', function() {
  it('is null when the date arm fires in every reached month as written',
    function() {
      expect(reach('0 0 * * *')).to.equal(null);
      expect(reach('0 0 * 6 1')).to.equal(null);
      expect(reach('0 0 15 * *')).to.equal(null);
      expect(reach('0 0 1-30 * *')).to.equal(null);
      expect(reach('0 0 30 6 *')).to.equal(null);
      expect(reach('0 0 1,31 3,5 *')).to.equal(null);
      expect(reach('0 0 1-28 2 *')).to.equal(null);
      expect(reach('0 0 L 2 *')).to.equal(null);
      expect(reach('0 0 LW 2 *')).to.equal(null);
      expect(reach('0 0 1W 2 *')).to.equal(null);
      expect(reach('0 0 28W 2 *')).to.equal(null);
      expect(reach('0 0 L-27 2 *')).to.equal(null);
    });

  it('says a day no reached month has never fires', function() {
    expect(reach('0 0 31 6 *')).to.deep.equal({
      days: {candidates: [], everyDay: false},
      everyYear: [],
      fires: false,
      firesInOtherYears: false,
      leapYears: [],
      never: [6]
    });
    expect(reach('0 0 30,31 2 *').fires).to.equal(false);
  });

  it('sorts the reached months by when a plain day fires in them',
    function() {
      const found = reach('0 0 31 * *');

      expect(found.everyYear).to.deep.equal([1, 3, 5, 7, 8, 10, 12]);
      expect(found.never).to.deep.equal([2, 4, 6, 9, 11]);
      expect(found.leapYears).to.deep.equal([]);
      expect(found.fires).to.equal(true);
      expect(found.days.candidates)
        .to.deep.equal(facts('0 0 31 * *').candidates.date);
      expect(reach('0 0 30 2-3 *').never).to.deep.equal([2]);
      expect(reach('0 0 30 2-3 *').everyYear).to.deep.equal([3]);
    });

  it('says February has the 29th in leap years only', function() {
    expect(reach('0 0 29 2 *')).to.deep.equal({
      days: {
        candidates: [{kind: 'values', values: [29]}],
        everyDay: false
      },
      everyYear: [],
      fires: true,
      firesInOtherYears: false,
      leapYears: [2],
      never: []
    });
    expect(reach('0 0 29-31 * *').leapYears).to.deep.equal([2]);
    expect(reach('0 0 29-31 * *').never).to.deep.equal([]);
  });

  it('judges February by the years the pattern reaches', function() {
    // 2031 is not a leap year; 2032 is; 2100 is not.
    expect(reach('0 0 0 29 2 * 2031', YEARS).fires).to.equal(false);
    expect(reach('0 0 0 29 2 * 2031', YEARS).never).to.deep.equal([2]);
    expect(reach('0 0 0 29 2 * 2100', YEARS).fires).to.equal(false);
    expect(reach('0 0 0 29 2 * 2032', YEARS)).to.equal(null);
    expect(reach('0 0 0 29 2 * 2000', YEARS)).to.equal(null);
    expect(reach('0 0 0 29 2 * 2031-2032', YEARS).leapYears)
      .to.deep.equal([2]);
  });

  it('says the weekday nearest a day fires only where that day exists',
    function() {
      expect(reach('0 0 31W 6-8 *')).to.deep.equal({
        days: null,
        everyYear: [7, 8],
        fires: true,
        firesInOtherYears: false,
        leapYears: [],
        never: [6]
      });
      expect(reach('0 0 29W 2 *').leapYears).to.deep.equal([2]);
      expect(reach('0 0 30W 2 *').fires).to.equal(false);
    });

  it('says so many days before the last needs a month longer than that',
    function() {
      expect(reach('0 0 L-30 6-8 *').everyYear).to.deep.equal([7, 8]);
      expect(reach('0 0 L-30 6-8 *').never).to.deep.equal([6]);
      expect(reach('0 0 L-28 2 *')).to.deep.equal({
        days: null,
        everyYear: [],
        fires: true,
        firesInOtherYears: false,
        leapYears: [2],
        never: []
      });
      expect(reach('0 0 L-29 2 *').fires).to.equal(false);
    });

  it('offers the days that some reached month has', function() {
    const found = reach('0 0 1,31 4,6,9,11 *');

    expect(found.everyYear).to.deep.equal([4, 6, 9, 11]);
    expect(found.never).to.deep.equal([]);
    expect(found.days).to.deep.equal({
      candidates: [{kind: 'values', values: [1]}],
      everyDay: false
    });
    expect(reach('0 0 28-31 2 *').days.candidates)
      .to.deep.include({from: 28, kind: 'range', to: 29});
    expect(reach('0 0 0 28-31 2 * 2031', YEARS).days.candidates)
      .to.deep.equal([{kind: 'values', values: [28]}]);
  });

  it('says when the days are every day the reached months have',
    function() {
      const june = reach('0 9 1-30 6 1');

      expect(june.days.everyDay).to.equal(true);
      expect(june.days.candidates).to.deep.include(
        {from: 1, kind: 'range', to: 30});
      expect(kinds(june.days.candidates)).to.not.include('all');
      expect(june.everyYear).to.deep.equal([6]);
      expect(reach('0 9 1-30 4,6 *').days.everyDay).to.equal(true);
      expect(reach('0 9 1-29 2 *').days.everyDay).to.equal(true);
      expect(reach('0 9 1-30 2 *').days.everyDay).to.equal(true);
      expect(reach('0 9 1-30 2 *').days.candidates).to.deep.include(
        {from: 1, kind: 'range', to: 29});
      expect(reach('0 0 9 1-28 2 * 2031', YEARS).days.everyDay)
        .to.equal(true);
      expect(reach('0 9 1-30 6-7 *')).to.equal(null);
      expect(reach('0 9 2-30 6 *')).to.equal(null);
    });

  it('leaves the union as written when the date arm covers every day',
    function() {
      // Both fields restrict as written, so cron fires when either
      // matches; `everyDay` says the union is then every day.
      expect(facts('0 9 1-30 6 1').day.union).to.equal(true);
      expect(facts('0 9 31 6 1').day.union).to.equal(true);
    });
});

function lengths(pattern, options) {
  return facts(pattern, options).monthLengths;
}

const LONG = [1, 3, 5, 7, 8, 10, 12];
const SHORT = [4, 6, 9, 11];

// A renderer that names the day a form comes to (three days before the
// last is the 27th of April) needs each month's length. The core gives
// the months the date arm fires in grouped by length, so no renderer
// holds a table of its own.
describe('analyses.monthLengths:', function() {
  it('groups every reached month when the day-of-month is unrestricted',
    function() {
      expect(lengths('0 0 * * *')).to.deep.equal([
        {length: 28, months: [2], years: 'common'},
        {length: 29, months: [2], years: 'leap'},
        {length: 30, months: SHORT, years: 'every'},
        {length: 31, months: LONG, years: 'every'}
      ]);
      expect(lengths('0 0 * 6 1')).to.deep.equal([
        {length: 30, months: [6], years: 'every'}
      ]);
    });

  it('groups the months so many days before the last fires in',
    function() {
      expect(lengths('0 0 L-3 4,6 *')).to.deep.equal([
        {length: 30, months: [4, 6], years: 'every'}
      ]);
      expect(lengths('0 0 L-3 * *')).to.deep.equal([
        {length: 28, months: [2], years: 'common'},
        {length: 29, months: [2], years: 'leap'},
        {length: 30, months: SHORT, years: 'every'},
        {length: 31, months: LONG, years: 'every'}
      ]);
      expect(lengths('0 0 L-3 2 *')).to.deep.equal([
        {length: 28, months: [2], years: 'common'},
        {length: 29, months: [2], years: 'leap'}
      ]);
    });

  it('leaves out a month, or a sort of year, the arm never fires in',
    function() {
      expect(lengths('0 0 L-28 2 *')).to.deep.equal([
        {length: 29, months: [2], years: 'leap'}
      ]);
      expect(lengths('0 0 L-30 6-8 *')).to.deep.equal([
        {length: 31, months: [7, 8], years: 'every'}
      ]);
      expect(lengths('0 0 31 * *')).to.deep.equal([
        {length: 31, months: LONG, years: 'every'}
      ]);
      expect(lengths('0 0 29W 1-2 *')).to.deep.equal([
        {length: 29, months: [2], years: 'leap'},
        {length: 31, months: [1], years: 'every'}
      ]);
      expect(lengths('0 0 31 6 *')).to.deep.equal([]);
      expect(lengths('0 0 31 6 1')).to.deep.equal([]);
    });

  it('judges February by the years the pattern reaches', function() {
    expect(lengths('0 0 0 L-3 2 * 2031', YEARS)).to.deep.equal([
      {length: 28, months: [2], years: 'every'}
    ]);
    expect(lengths('0 0 0 L-3 2 * 2032', YEARS)).to.deep.equal([
      {length: 29, months: [2], years: 'every'}
    ]);
    expect(lengths('0 0 0 L-3 2 * 2031-2032', YEARS)).to.deep.equal([
      {length: 28, months: [2], years: 'common'},
      {length: 29, months: [2], years: 'leap'}
    ]);
    expect(lengths('0 0 0 L-28 2 * 2031', YEARS)).to.deep.equal([]);
  });

  it('is there whether or not dateReach has anything to say', function() {
    expect(reach('0 0 L-3 4,6 *')).to.equal(null);
    expect(reach('0 0 1-29,31 2-3 *')).to.equal(null);
    // The greatest day every firing month has, and the greatest any has.
    expect(lengths('0 0 1-29,31 2-3 *').map(function lengthOf(group) {
      return group.length;
    })).to.deep.equal([28, 29, 31]);
  });
});

// A date that never comes in the years a pattern names may come in other
// years (29 February) or in none (31 June). Only the first is about the
// year field.
describe('dateReach.firesInOtherYears:', function() {
  it('is true when only the years reached keep the date arm from firing',
    function() {
      expect(reach('0 0 0 29 2 * 2031', YEARS).firesInOtherYears)
        .to.equal(true);
      expect(reach('0 0 0 29W 2 * 2031', YEARS).firesInOtherYears)
        .to.equal(true);
      expect(reach('0 0 0 L-28 2 * 2100', YEARS).firesInOtherYears)
        .to.equal(true);
      expect(reach('0 0 0 29,30 2 * 2031', YEARS).firesInOtherYears)
        .to.equal(true);
    });

  it('is false when the date exists in no year', function() {
    expect(reach('0 0 0 31 6 * 2030', YEARS).firesInOtherYears)
      .to.equal(false);
    expect(reach('0 0 0 30 2 * 2031', YEARS).firesInOtherYears)
      .to.equal(false);
    expect(reach('0 0 31 6 *').firesInOtherYears).to.equal(false);
    expect(reach('0 0 30W 2 *').firesInOtherYears).to.equal(false);
  });

  it('is false when the date arm fires', function() {
    expect(reach('0 0 29 2 *').firesInOtherYears).to.equal(false);
    expect(reach('0 0 0 29 2-3 * 2031', YEARS).firesInOtherYears)
      .to.equal(false);
    expect(reach('0 0 31 * *').firesInOtherYears).to.equal(false);
  });
});

const JUNE = {cyclic: true, max: 30, min: 1};

// A set of days written for a short month is clipped to it, and reads
// differently against 31 days than against the days the month has.
describe('daysReached:', function() {
  it('describes the days against the days the months have', function() {
    const clipped = daysReached(schedule('0 9 1-14,16-30 6 *'));

    expect(facts('0 9 1-14,16-30 6 *').candidates.date).to.deep.include(
      {base: {kind: 'all'}, kind: 'except', removed: [15, 31]});
    expect(clipped.domain).to.deep.equal(JUNE);
    expect(clipped.candidates).to.deep.include(
      {base: {kind: 'all'}, kind: 'except', removed: [15]});
    expect(kinds(clipped.candidates)).to.not.include('all');
  });

  it('gives one description to one schedule however it is written',
    function() {
      const stepped = daysReached(schedule('0 0 */2 6 *'));
      const ranged = daysReached(schedule('0 0 1-29/2 6 *'));

      expect(ranged).to.deep.equal(stepped);
      expect(ranged.domain).to.deep.equal(JUNE);
      expect(ranged.candidates).to.deep.include(
        {interval: 2, kind: 'cadence', last: 29, start: 1});
    });

  it('drops a day no firing month has, and says every day', function() {
    expect(daysReached(schedule('0 0 1,31 4,6 *')).candidates)
      .to.deep.equal([{kind: 'values', values: [1]}]);
    expect(daysReached(schedule('0 9 1-30 6 1')).candidates)
      .to.deep.equal([{kind: 'all'}]);
    expect(daysReached(schedule('0 9 * 6 *'))).to.deep.equal(
      {candidates: [{kind: 'all'}], domain: JUNE});
  });

  it('takes the longest of the months the arm fires in', function() {
    expect(daysReached(schedule('0 0 1-29/2 2,6 *')).domain.max).to.equal(30);
    expect(daysReached(schedule('0 0 1-27/2 2 *')).domain.max).to.equal(29);
    expect(daysReached(schedule('0 0 0 1-27/2 2 * 2031', YEARS)).domain.max)
      .to.equal(28);
    expect(daysReached(schedule('0 0 15 * *')).domain.max).to.equal(31);
    expect(daysReached(schedule('0 0 1-14,16-30 4,5 *')).candidates)
      .to.deep.include(
        {base: {kind: 'all'}, kind: 'except', removed: [15, 31]});
  });

  it('lays the days out under a view', function() {
    expect(daysReached(schedule('0 0 28-30,1-2 6 *')).candidates)
      .to.deep.include({from: 28, kind: 'range', to: 2});
    expect(kinds(daysReached(schedule('0 0 28-30,1-2 6 *'), {linear: true})
      .candidates)).to.not.include('range');
  });

  it('is null for a Quartz form and empty when the arm never fires',
    function() {
      expect(daysReached(schedule('0 0 L-3 6 *'))).to.equal(null);
      expect(daysReached(schedule('0 0 31 6 *'))).to.deep.equal(
        {candidates: [], domain: {cyclic: true, max: 31, min: 1}});
    });
});

const APRIL = {length: 30, months: [4], years: 'every'};
const MAY = {length: 31, months: [5], years: 'every'};
const COMMON = {length: 28, months: [2], years: 'common'};
const LEAP = {length: 29, months: [2], years: 'leap'};

// "The 30th and 31st of April and May" names a day April does not have.
// Which of a set's days each reached month has is calendar arithmetic.
describe('daysByMonths:', function() {
  it('groups the days by the reached months that have them', function() {
    expect(daysByMonths(schedule('0 0 30,31 4,5 *'))).to.deep.equal([
      {days: [30], everyMonth: true, months: [APRIL, MAY]},
      {days: [31], everyMonth: false, months: [MAY]}
    ]);
    expect(daysByMonths(schedule('0 0 15,31 1,4 *'))).to.deep.equal([
      {days: [15], everyMonth: true, months: [
        APRIL, {length: 31, months: [1], years: 'every'}
      ]},
      {days: [31], everyMonth: false, months: [
        {length: 31, months: [1], years: 'every'}
      ]}
    ]);
  });

  it('says a day February has in leap years only', function() {
    expect(daysByMonths(schedule('0 0 28,29 2 *'))).to.deep.equal([
      {days: [28], everyMonth: true, months: [COMMON, LEAP]},
      {days: [29], everyMonth: false, months: [LEAP]}
    ]);
    expect(daysByMonths(schedule('0 0 0 28,29 2 * 2032', YEARS)))
      .to.deep.equal([
        {days: [28, 29], everyMonth: true, months: [
          {length: 29, months: [2], years: 'every'}
        ]}
      ]);
  });

  it('judges every reached month, not only those the arm fires in',
    function() {
      const short = {length: 30, months: SHORT, years: 'every'};
      const long = {length: 31, months: LONG, years: 'every'};

      expect(daysByMonths(schedule('0 0 29-31 * *'))).to.deep.equal([
        {days: [29], everyMonth: false, months: [LEAP, short, long]},
        {days: [30], everyMonth: false, months: [short, long]},
        {days: [31], everyMonth: false, months: [long]}
      ]);
    });

  it('is one group when every reached month has every day', function() {
    expect(daysByMonths(schedule('0 0 2-30 6 *'))).to.deep.equal([
      {days: upTo(30), everyMonth: true, months: [
        {length: 30, months: [6], years: 'every'}
      ]}
    ]);
  });

  it('drops a day no reached month has', function() {
    expect(daysByMonths(schedule('0 0 15,31 6 *')).map(function days(group) {
      return group.days;
    })).to.deep.equal([[15]]);
    expect(daysByMonths(schedule('0 0 31 6 *'))).to.deep.equal([]);
  });

  it('is null unless the day-of-month is a plain set', function() {
    expect(daysByMonths(schedule('0 0 * 6 *'))).to.equal(null);
    expect(daysByMonths(schedule('0 0 L 6 *'))).to.equal(null);
    expect(daysByMonths(schedule('0 0 15W 6 *'))).to.equal(null);
  });
});
