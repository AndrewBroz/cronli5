import {run} from '../../../../runner.js';

// Behavior spec for the day-of-month / day-of-week OR rule. Per the crontab
// spec, when BOTH the date, and weekday fields are restricted (not `*`), the
// schedule fires on the UNION of the two day sets. Every dialect renders
// this as a condition over the day — "whenever the day is <dom> or <dow>" — so
// the union is unmistakable (the older "on <dom> or on <dow>", kept only by
// the compact `short` form, read as alternatives). A cadence-shaped date
// arm is not a noun the predicate frame can hold, so that union reads as a
// clause with "any" carrying the union
// ("on every 3rd day of the month from the 2nd or on any Sunday"). A
// restricted month scopes the whole union and leads the clause ("in June …").

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
        'in June, at midnight whenever the day is the 13th or a Friday']
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
        'in June, at midnight whenever the day is the weekday nearest the ' +
        '15th or the second Monday of the month'],
      ['*/45 9-17/2 15W 6-8 MON#2',
        'in June through August, at 0 and 45 minutes, every ' +
        'two hours from 9 a.m. through 5 p.m. whenever the day is the ' +
        'weekday nearest the 15th or the second Monday of the month'],
      // Quartz date (last day) with a plain weekday.
      ['0 0 L 6 5',
        'in June, at midnight whenever the day is the last day of the month ' +
        'or a Friday'],
      // Open day-of-month step (the parity idiom) with a plain weekday.
      ['0 0 1/2 6 5',
        'in June, at midnight whenever the day is an odd-numbered day or a ' +
        'Friday'],
      // Plain date with a month RANGE.
      ['0 0 13 6-8 5',
        'in June through August, at midnight whenever the day is the 13th or ' +
        'a Friday'],
      // Plain date with the every-odd-month frequency.
      ['0 0 13 */2 5',
        'in every odd-numbered month, at midnight whenever the day is the ' +
        '13th or a Friday']
    ]);
  });

  // The day-of-month parity idioms in a union. `*/2` and `1/2` are the odd
  // days, `2/2` the even; any other start (`3/2`) is a cadence with no parity
  // idiom, so its union takes the clause form (next block).
  describe('day-of-month parity in a union', function() {
    run([
      ['0 0 */2 * 5',
        'at midnight whenever the day is an odd-numbered day or a Friday'],
      ['0 0 1/2 * 5',
        'at midnight whenever the day is an odd-numbered day or a Friday'],
      ['0 0 2/2 * 5',
        'at midnight whenever the day is an even-numbered day or a Friday']
    ]);
  });

  // A cadence-shaped date arm — an open step with no parity idiom — keeps its
  // cadence phrase inside the union rather than exploding into its fires;
  // "any" on the weekday half carries the union reading. The sentence
  // architecture (month lead, time body, trailing day clause) matches the
  // predicate-frame union's, and a leading month absorbs " of the month"
  // exactly as the non-union month scope does.
  describe('cadence date arms in a union', function() {
    run([
      ['0 0 3/2 * 5',
        'at midnight on every other day of the month from the 3rd or on ' +
        'any Friday'],
      ['0 9 2/3 * 0',
        'at 9 a.m. on every 3rd day of the month from the 2nd or on any ' +
        'Sunday'],
      ['0 0 3/2 6 5',
        'in June, at midnight on every other day from the 3rd or on any ' +
        'Friday'],
      ['0 0 2/3 * 1-5',
        'at midnight on every 3rd day of the month from the 2nd or on any ' +
        'weekday'],
      ['0 0 2/3 * MON,WED',
        'at midnight on every 3rd day of the month from the 2nd or on any ' +
        'Monday or Wednesday'],
      ['0 0 2/3 * 5L',
        'at midnight on every 3rd day of the month from the 2nd or on the ' +
        'last Friday of the month'],
      ['* 0 */5 2/3 */4 */4',
        'in January, May, and September, every second during minute 0 ' +
        'during the 12 a.m., 5 a.m., 10 a.m., 3 p.m., and 8 p.m. hours on ' +
        'every 3rd day from the 2nd or on any Thursday or Sunday']
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
        'at midnight whenever the day is the 15th, a Tuesday, a Thursday, a ' +
        'Saturday, or a Sunday']
    ]);
  });
});
