import chai from 'chai';
import cronli5 from '../../src/cronli5.js';

const {expect} = chai;

// Known core defects, each pinned by an `it.fails` spec: the test asserts
// the CORRECT behavior, `fails` inverts it while the defect stands, and the
// moment a fix lands the inverted spec errors — forcing the `fails` marker
// off and promoting the assertion to a live regression guard.

describe('Core known defects:', function() {
  // Fixed defects stay as live guards. A minute list mixing a range under
  // a bounded hour step was once planned as bare clock times at the top of
  // each hour (`5-10,20 9-17/2` fires 35 times a day, but every language
  // described only the five whole-hour times). This guard pins the
  // core-level invariant; the wording is the paradigms' job.
  it('a minute list survives a bounded hour step', function() {
    expect(cronli5('5-10,20 9-17/2 * * *')).to.match(/minute/u);
  });

  // A weekday stride over a range ending on 7 once lost its values: the 7
  // was folded to 0 before the stride was counted, so `3-7/2` fired on
  // nothing and `1-7/2` was read as `*/2`, a different set of days.
  it('a weekday stride that ends on 7 keeps every day it lands on',
    function() {
      expect(cronli5('0 0 * * 3-7/2'))
        .to.equal('at midnight on Wednesdays, Fridays, and Sundays');
      expect(cronli5('0 0 * * 1-7/2'))
        .to.equal('at midnight on Mondays, Wednesdays, Fridays, and Sundays');
    });
});
