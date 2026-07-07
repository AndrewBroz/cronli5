import chai from 'chai';
import cronli5 from '../../src/cronli5.js';

const {expect} = chai;

// Known core defects, each pinned by an `it.fails` spec: the test asserts
// the CORRECT behavior, `fails` inverts it while the defect stands, and the
// moment a fix lands the inverted spec errors — forcing the `fails` marker
// off and promoting the assertion to a live regression guard.

describe('Core known defects:', function() {
  // A minute list (or list/range mix) under a bounded hour step is planned
  // as bare clock times at the top of each hour: `5-10,20 9-17/2 * * *`
  // fires 35 times a day (minutes 5-10 and 20 of hours 9, 11, 13, 15, 17),
  // but every language describes only the five whole-hour times — the
  // minute field vanishes from the description entirely. Reproduces in all
  // renderers, so the defect is in the core's plan selection, not any
  // language.
  it.fails('a minute list survives a bounded hour step', function() {
    expect(cronli5('5-10,20 9-17/2 * * *')).to.match(/minute/u);
  });
});
