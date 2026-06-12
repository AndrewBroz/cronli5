import {run} from '../../runner.js';

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
});
