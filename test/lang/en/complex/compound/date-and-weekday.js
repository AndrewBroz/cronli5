import {run} from '../../../../runner.js';

// Behavior spec for the day-of-month / day-of-week OR rule. Per the crontab
// spec, when BOTH the date, and weekday fields are restricted (not `*`), the
// schedule fires on the UNION of the two day sets. The default dialect renders
// this as a condition over the day — "whenever the day is <dom> or <dow>" — so
// the union is unmistakable (the older "on <dom> or on <dow>" read as
// alternatives). A restricted month scopes the whole union and leads the clause
// ("in June …").

describe('Day-of-month or day-of-week (both restricted):', function() {
  describe('time-anchored', function() {
    run([
      ['0 0 13 * 5', 'at midnight whenever the day is the 13th or a Friday'],
      ['0 0 13 * FRI', 'at midnight whenever the day is the 13th or a Friday'],
      ['0 0 13 * MON-FRI',
        'at midnight whenever the day is the 13th or a weekday'],
      ['0 0 1,15 * 5',
        'at midnight whenever the day is the 1st, the 15th, or a Friday'],
      ['0 0 13 6 5',
        'in June at midnight whenever the day is the 13th or a Friday']
    ]);
  });

  describe('bare frequency', function() {
    run([
      ['* * 13 * 5',
        'every minute whenever the day is the 13th or a Friday'],
      ['0 * 13 * 5', 'every hour whenever the day is the 13th or a Friday']
    ]);
  });

  // A restricted month scopes the WHOLE union, leading the clause ("in June
  // …"); it never attaches to one day half (which would imply the other half
  // fires every month). This holds whatever the day forms — a Quartz date or
  // weekday, an open day step, a plain date — and whatever the month shape.
  describe('month scopes the whole union', function() {
    run([
      // Quartz date (nearest-weekday) and Quartz weekday (nth occurrence).
      ['0 0 15W 6 MON#2',
        'in June at midnight whenever the day is the weekday nearest the ' +
        '15th or the second Monday of the month'],
      ['*/45 9-17/2 15W 6-8 MON#2',
        'in June through August at 0 and 45 minutes past the hour, every ' +
        'two hours from 9 a.m. through 5 p.m. whenever the day is the ' +
        'weekday nearest the 15th or the second Monday of the month'],
      // Quartz date (last day) with a plain weekday.
      ['0 0 L 6 5',
        'in June at midnight whenever the day is the last day of the month ' +
        'or a Friday'],
      // Open day-of-month step (the parity idiom) with a plain weekday.
      ['0 0 1/2 6 5',
        'in June at midnight whenever the day is an odd-numbered day or a ' +
        'Friday'],
      // Plain date with a month RANGE.
      ['0 0 13 6-8 5',
        'in June through August at midnight whenever the day is the 13th or ' +
        'a Friday'],
      // Plain date with the every-odd-month frequency.
      ['0 0 13 */2 5',
        'in every odd-numbered month at midnight whenever the day is the ' +
        '13th or a Friday']
    ]);
  });
});
