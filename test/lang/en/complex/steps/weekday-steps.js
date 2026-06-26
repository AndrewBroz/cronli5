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
    run([
      ['0 * * * */2',
        'every hour on Tuesday, Thursday, Saturday, and Sunday']
    ]);
  });
});
