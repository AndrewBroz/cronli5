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
        'in June through August at 0 and 45 minutes, every ' +
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

  // The day-of-month parity idioms in a union. `*/2` and `1/2` are the odd
  // days, `2/2` the even; any other start (`3/2`) enumerates its fires
  // instead, each ordinal joining the flat or-list.
  describe('day-of-month parity in a union', function() {
    run([
      ['0 0 */2 * 5',
        'at midnight whenever the day is an odd-numbered day or a Friday'],
      ['0 0 1/2 * 5',
        'at midnight whenever the day is an odd-numbered day or a Friday'],
      ['0 0 2/2 * 5',
        'at midnight whenever the day is an even-numbered day or a Friday'],
      ['0 0 3/2 * 5',
        'at midnight whenever the day is the 3rd, the 5th, the 7th, the ' +
        '9th, the 11th, the 13th, the 15th, the 17th, the 19th, the 21st, ' +
        'the 23rd, the 25th, the 27th, the 29th, the 31st, or a Friday']
    ]);
  });

  // The day-of-week half of a union spans every weekday form: a single day, a
  // list, a non-Mon-Fri range, an open step, and the `7`-for-Sunday alias.
  // Each weekday joins the flat or-list as "a <day>".
  describe('weekday forms in a union', function() {
    run([
      ['0 0 15 * MON,WED',
        'at midnight whenever the day is the 15th, a Monday, or a Wednesday'],
      ['0 0 15 * 7',
        'at midnight whenever the day is the 15th or a Sunday'],
      ['0 0 15 * 2-4',
        'at midnight whenever the day is the 15th or a Tuesday through a ' +
        'Thursday'],
      ['0 0 15 * */2',
        'at midnight whenever the day is the 15th, a Sunday, a Tuesday, a ' +
        'Thursday, or a Saturday']
    ]);
  });
});
