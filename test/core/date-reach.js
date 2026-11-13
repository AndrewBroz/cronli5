import chai from 'chai';
import {analyze, prepare, readingOf} from '../../src/core/index.js';

const {expect} = chai;

function facts(pattern, options) {
  const opts = readingOf({...options});

  return analyze(prepare(pattern, opts)).analyses;
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
