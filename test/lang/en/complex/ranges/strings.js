import {run} from '../../../../runner.js';

// Behavior spec for hyphenated range patterns. Conventions:
// - Inclusive numeric ranges read "from <start> through <end>".
// - Second/minute ranges anchor with "past the minute/hour".
// - Hour ranges (at minute 0) expand to "every hour from <time> through
//   <time>".
// - Date ranges read "on the <ordinal> through <ordinal>" using suffixed
//   numeric ordinals (1st, 2nd, ... 31st); month ranges read
//   "in <month> through <month>".
// - Weekday ranges keep their established "Monday through Friday" form.

describe('Valid strings with ranges:', function() {
  describe('second ranges', function() {
    run([
      ['0-30 * * * * *', 'every second from 0 through 30 past the minute'],
      ['10-20 * * * * *', 'every second from 10 through 20 past the minute']
    ]);
  });

  describe('minute ranges', function() {
    run([
      ['0-29 * * * *', 'every minute from 0 through 29 past the hour'],
      ['1-5 * * * *', 'every minute from 1 through 5 past the hour']
    ]);
  });

  describe('hour ranges', function() {
    run([
      ['0 9-17 * * *', 'every hour from 9 a.m. until 6 p.m.'],
      ['0 0-5 * * *', 'every hour from midnight until 6 a.m.']
    ]);
  });

  describe('date ranges', function() {
    run([
      ['0 0 1-15 * *', 'on the 1st through 15th at midnight'],
      ['0 0 10-20 * *', 'on the 10th through 20th at midnight']
    ]);
  });

  describe('month ranges', function() {
    run([
      ['0 12 * 6-8 *', 'every day in June through August at noon'],
      ['0 12 * JAN-MAR *', 'every day in January through March at noon']
    ]);
  });

  describe('weekday ranges', function() {
    run([
      ['0 9 * * MON-FRI', 'every Monday through Friday at 9 a.m.'],
      ['0 9 * * 1-5', 'every Monday through Friday at 9 a.m.']
    ]);
  });
});
