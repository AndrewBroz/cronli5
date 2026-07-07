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
  // described only the five whole-hour times): enumerateValues collapsed
  // any non-discrete minute field to [0]. Each language's corpus pins the
  // full phrasing; this guard pins the core-level invariant.
  it('a minute list survives a bounded hour step', function() {
    expect(cronli5('5-10,20 9-17/2 * * *')).to.match(/minute/u);
  });
});
