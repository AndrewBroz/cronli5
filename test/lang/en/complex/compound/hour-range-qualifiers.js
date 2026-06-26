import {run} from '../../../../runner.js';

// Behavior spec for day-level qualifiers (date, month, weekday, and the
// day-of-month/day-of-week OR) on the hour-range and step-frequency code
// paths. These paths previously appended only the weekday and silently
// dropped the date and month.

describe('Hour-range and frequency day qualifiers:', function() {
  describe('hour range with a date and/or month', function() {
    run([
      ['0 9-17 13 * *',
        'every hour from 9 a.m. until 6 p.m. on the 13th'],
      ['0 9-17 * 6 *',
        'every hour from 9 a.m. until 6 p.m. in June'],
      ['0 9-17 13 6 *',
        'every hour from 9 a.m. until 6 p.m. on June 13'],
      ['0 9-17 13 * 5',
        'every hour from 9 a.m. until 6 p.m. on the 13th or on Friday']
    ]);
  });

  describe('step frequency with a date or weekday (no hour range)', function() {
    run([
      ['*/15 * * * MON', 'every 15 minutes on Mondays'],
      ['*/15 * 13 * *', 'every 15 minutes on the 13th'],
      ['*/15 9-17 13 * *',
        'every 15 minutes from 9 a.m. until 6 p.m. on the 13th']
    ]);
  });
});
