import {run} from '../../../../runner.js';

// Behavior spec for step (`/`) patterns in the weekday field. Weekday steps
// are always enumerated (the set is small). The start may be a wildcard, a
// single value, or a range, and range bounds may be names (e.g. MON-FRI).

describe('Weekday step patterns:', function() {
  describe('wildcard start', function() {
    run([
      ['0 0 * * */2',
        'every Tuesday, Thursday, Saturday, and Sunday at midnight']
    ]);
  });

  describe('range start (numeric and named)', function() {
    run([
      ['0 0 * * 1-5/2', 'every Monday, Wednesday, and Friday at midnight'],
      ['0 0 * * MON-FRI/2',
        'every Monday, Wednesday, and Friday at midnight']
    ]);
  });

  describe('single start', function() {
    run([
      ['0 0 * * 1/2', 'every Monday, Wednesday, and Friday at midnight']
    ]);
  });

  describe('as a trailing qualifier', function() {
    // A trailing single/list weekday under a wildcard day-of-month reads
    // plural ("on Mondays"); a weekday RANGE keeps the singular idiom ("on
    // Monday through Friday"), so the through-connective stays unmistakable.
    run([
      ['0 * * * */2',
        'every hour on Tuesdays, Thursdays, Saturdays, and Sundays'],
      ['0 * * * MON,WED,FRI',
        'every hour on Mondays, Wednesdays, and Fridays'],
      ['0 * * * MON-FRI', 'every hour on Monday through Friday']
    ]);
  });
});
