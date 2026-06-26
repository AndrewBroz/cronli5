import {run} from '../../../../runner.js';

// Behavior spec for the day-of-month / day-of-week OR rule. Per the crontab
// spec, when BOTH the date, and weekday fields are restricted (not `*`), the
// schedule fires when EITHER matches. cronli5 must render this as an explicit
// "or" rather than silently dropping the weekday. A restricted month scopes
// both halves.

describe('Day-of-month or day-of-week (both restricted):', function() {
  describe('time-anchored', function() {
    run([
      ['0 0 13 * 5', 'on the 13th or on Friday at midnight'],
      ['0 0 13 * FRI', 'on the 13th or on Friday at midnight'],
      ['0 0 13 * MON-FRI', 'on the 13th or on Monday through Friday at midnight'],
      ['0 0 1,15 * 5', 'on the 1st and 15th or on Friday at midnight'],
      ['0 0 13 6 5', 'on June 13 or on Friday in June at midnight']
    ]);
  });

  describe('bare frequency', function() {
    run([
      ['* * 13 * 5', 'every minute on the 13th or on Friday'],
      ['0 * 13 * 5', 'every hour on the 13th or on Friday']
    ]);
  });

  // A restricted month must scope the WHOLE or, not just the day-of-month
  // half: a month attached only to the date branch falsely implies the
  // weekday branch fires every month. When the month cannot fold into a
  // calendar date (a Quartz date, an open day step, a month range, or the
  // odd/even frequency), it trails the whole or as ", in <month>".
  describe('month scopes the whole or', function() {
    run([
      // Quartz date (nearest-weekday) — the month had scoped only the date.
      ['0 0 15W 6 MON#2',
        'on the weekday nearest the 15th or on the second Monday of the ' +
        'month, in June at midnight'],
      ['*/45 9-17/2 15W 6-8 MON#2',
        'at 0 and 45 minutes past the hour, every two hours from 9 a.m. ' +
        'through 5 p.m. on the weekday nearest the 15th or on the second ' +
        'Monday of the month, in June through August'],
      // Quartz date (last day) — likewise scoped only the date.
      ['0 0 L 6 5',
        'on the last day of the month or on Friday, in June at midnight'],
      // Open day-of-month step — the month had scoped only the step.
      ['0 0 1/2 6 5',
        'every other day of the month or on Friday, in June at midnight'],
      // Plain date with a month RANGE (cannot fold) — the month had scoped
      // only the weekday, leaving the date unqualified.
      ['0 0 13 6-8 5',
        'on the 13th or on Friday, in June through August at midnight'],
      // Plain date with the every-odd-month frequency (cannot fold).
      ['0 0 13 */2 5',
        'on the 13th or on Friday, in every odd-numbered month at midnight']
    ]);
  });
});
