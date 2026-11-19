import chai from 'chai';
import {analyze, prepare, readingOf} from '../../src/core/index.js';

const {expect} = chai;

function day(pattern, options) {
  const opts = readingOf({...options});

  return analyze(prepare(pattern, opts)).analyses.day;
}

function isLast(pattern, options) {
  return day(pattern, options).nearestDayIsLast;
}

function addsNothing(pattern) {
  return day(pattern).dateAddsNothing;
}

const YEARS = {seconds: true, years: true};

// The scheduler never leaves the month for the weekday nearest a day, so
// where that day is the month's last and falls on a Sunday the day used is
// the Friday before. Whether there is a Monday after to speak of depends
// on the months and years reached, which the core knows.
describe('analyses.day.nearestDayIsLast:', function() {
  it('is null unless the date arm is the weekday nearest a day',
    function() {
      expect(isLast('0 0 * * *')).to.equal(null);
      expect(isLast('0 0 31 * *')).to.equal(null);
      expect(isLast('0 0 L * *')).to.equal(null);
      expect(isLast('0 0 LW * *')).to.equal(null);
      expect(isLast('0 0 1W * *')).to.equal(null);
      expect(isLast('0 0 L-3 * *')).to.equal(null);
    });

  it('is always when the day ends every month the form fires in',
    function() {
      expect(isLast('0 0 31W * *')).to.equal('always');
      expect(isLast('0 0 31W 6-8 *')).to.equal('always');
      expect(isLast('0 0 30W 6 *')).to.equal('always');
      expect(isLast('0 0 30W 4,6 *')).to.equal('always');
      expect(isLast('0 0 30W 2,4 *')).to.equal('always');
      expect(isLast('0 0 29W 2 *')).to.equal('always');
      expect(isLast('0 0 0 28W 2 * 2031', YEARS)).to.equal('always');
      expect(isLast('0 0 0 29W 2 * 2032', YEARS)).to.equal('always');
    });

  it('is never when the day ends none of them', function() {
    expect(isLast('0 0 15W * *')).to.equal('never');
    expect(isLast('0 0 2W 2 *')).to.equal('never');
    expect(isLast('0 0 30W 7 *')).to.equal('never');
    expect(isLast('0 0 28W 3 *')).to.equal('never');
    expect(isLast('0 0 0 28W 2 * 2032', YEARS)).to.equal('never');
    expect(isLast('0 0 0 29W * * 2031', YEARS)).to.equal('never');
  });

  it('is never when the form fires in no reached month', function() {
    expect(isLast('0 0 30W 2 *')).to.equal('never');
    expect(isLast('0 0 0 29W 2 * 2031', YEARS)).to.equal('never');
  });

  it('is sometimes when the day ends some of them only', function() {
    expect(isLast('0 0 30W * *')).to.equal('sometimes');
    expect(isLast('0 0 30W 6-7 *')).to.equal('sometimes');
    // February of common years only.
    expect(isLast('0 0 28W * *')).to.equal('sometimes');
    expect(isLast('0 0 28W 2 *')).to.equal('sometimes');
    // February of leap years only.
    expect(isLast('0 0 29W * *')).to.equal('sometimes');
    expect(isLast('0 0 0 28W * * 2031', YEARS)).to.equal('sometimes');
  });

  it('is told beside a weekday arm too', function() {
    expect(isLast('0 0 31W * 1')).to.equal('always');
  });
});

// Both day fields restricted is a union. A date arm that lands only on
// days the weekday arm has anyway leaves the weekday arm alone.
describe('analyses.day.dateAddsNothing:', function() {
  it('is false when the day fields are not a union', function() {
    expect(addsNothing('0 9 * * *')).to.equal(false);
    expect(addsNothing('0 9 15W * *')).to.equal(false);
    expect(addsNothing('0 9 * * 1-5')).to.equal(false);
    expect(addsNothing('0 0 30W 2 *')).to.equal(false);
    expect(addsNothing('0 0 31 6 *')).to.equal(false);
  });

  it('is true for a Monday-to-Friday form beside Monday to Friday',
    function() {
      expect(addsNothing('0 9 15W * 1-5')).to.equal(true);
      expect(addsNothing('0 9 LW * 1-5')).to.equal(true);
      expect(addsNothing('0 9 1W * 1-5')).to.equal(true);
      expect(addsNothing('0 9 31W * 1-6')).to.equal(true);
      expect(addsNothing('0 9 LW 2 0-5')).to.equal(true);
      expect(addsNothing('0 9 15W * 1,2,3,4,5')).to.equal(true);
    });

  it('is false when the weekday arm lacks one of Monday to Friday',
    function() {
      expect(addsNothing('0 9 15W * 1,3,5')).to.equal(false);
      expect(addsNothing('0 9 LW * 2-6')).to.equal(false);
      expect(addsNothing('0 9 1W * 1-4')).to.equal(false);
      expect(addsNothing('0 9 15W * 0,6')).to.equal(false);
    });

  it('is false beside a Quartz weekday form', function() {
    expect(addsNothing('0 9 LW * 5L')).to.equal(false);
    expect(addsNothing('0 9 15W * 1#2')).to.equal(false);
  });

  it('is false for the forms that can land on any weekday', function() {
    expect(addsNothing('0 9 L * 1-5')).to.equal(false);
    expect(addsNothing('0 9 L-3 * 1-5')).to.equal(false);
  });

  it('is not judged for plain dates, which fall on every weekday',
    function() {
      expect(addsNothing('0 9 15 * 1-5')).to.equal(false);
      expect(addsNothing('0 9 1-30 6 1')).to.equal(false);
    });

  it('is true when the date arm never fires, whatever the weekday arm',
    function() {
      expect(addsNothing('0 0 31 6 1')).to.equal(true);
      expect(addsNothing('0 0 30W 2 1')).to.equal(true);
      expect(addsNothing('0 0 L-30 6 5L')).to.equal(true);
    });

  it('leaves the union as written', function() {
    expect(day('0 9 15W * 1-5').union).to.equal(true);
    expect(day('0 0 31 6 1').union).to.equal(true);
  });
});
