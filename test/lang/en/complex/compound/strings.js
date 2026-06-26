import {run} from '../../../../runner.js';

// Behavior spec for when several fields are non-trivial at once. Conventions:
// - A list/range of minutes combined with specific hour(s) expands into the
//   full set of clock times, e.g. "every day at 9 a.m., and 9:30 a.m.".
// - A frequency (step) combined with an hour range trails with the active
//   window, e.g. "every 15 minutes from 9 a.m. through 5:45 p.m.".
// - Time-anchored descriptions lead with the weekday ("every Monday through Friday
//   at ..."); frequency descriptions trail with it ("... on Monday through Friday").
// - A specific date with a month reads "on <Month> <ordinal> at <time>".

describe('Valid compound strings:', function() {
  describe('already-supported combinations', function() {
    run([
      ['30 9 * * MON-FRI', 'every Monday through Friday at 9:30 a.m.'],
      ['0 22 * * 1-5', 'every Monday through Friday at 10 p.m.'],
      ['0 0 25 12 *', 'on December 25 at midnight']
    ]);
  });

  describe('specific date without month', function() {
    run([
      ['15 14 1 * *', 'on the 1st at 2:15 p.m.'],
      ['0 0 15 * *', 'on the 15th at midnight']
    ]);
  });

  describe('minute list/range with specific hours', function() {
    run([
      ['0,30 9 * * *', 'every day at 9 a.m. and 9:30 a.m.'],
      ['0,30 9 * * MON-FRI', 'every Monday through Friday at 9 a.m. and 9:30 a.m.'],
      [
        '0,30 9,17 * * *',
        'every day at 9 a.m., 9:30 a.m., 5 p.m., and 5:30 p.m.'
      ]
    ]);
  });

  describe('frequency within an hour range', function() {
    run([
      ['*/15 9-17 * * *', 'every 15 minutes from 9 a.m. through 5:45 p.m.'],
      [
        '*/15 9-17 * * MON-FRI',
        'every 15 minutes from 9 a.m. through 5:45 p.m. on Monday through Friday'
      ]
    ]);
  });

  describe('specific minute(s) within an hour range', function() {
    run([
      ['0 9-17 * * *', 'every hour from 9 a.m. through 5 p.m.'],
      [
        '5 9-17 * * *',
        'at five minutes past the hour from 9 a.m. through 5 p.m.'
      ],
      [
        '5 9-17 * 1 *',
        'at five minutes past the hour from 9 a.m. through 5 p.m. in January'
      ],
      [
        '30 9-17 * * *',
        'at 30 minutes past the hour from 9 a.m. through 5 p.m.'
      ],
      [
        '0,30 9-17 * * *',
        'at 0 and 30 minutes past the hour from 9 a.m. through 5 p.m.'
      ],
      [
        '15 9-17 * * MON-FRI',
        'at 15 minutes past the hour from 9 a.m. through 5 p.m. ' +
          'on Monday through Friday'
      ]
    ]);
  });

  describe('date and month together', function() {
    run([
      ['0 12 1 1 *', 'on January 1 at noon'],
      ['0 12 25 12 *', 'on December 25 at noon']
    ]);
  });

  // A bare frequency ("every minute"/"every hour") that nonetheless has a
  // day-level qualifier should trail with that qualifier, mirroring the
  // "frequency descriptions trail with the weekday" convention.
  describe('frequency with a day qualifier', function() {
    run([
      ['* * * * MON', 'every minute on Monday'],
      ['0 * * * MON', 'every hour on Monday'],
      ['* * * * MON-FRI', 'every minute on Monday through Friday'],
      ['* * 13 * *', 'every minute on the 13th'],
      ['0 * 13 * *', 'every hour on the 13th'],
      ['0 * * 1 *', 'every hour in January'],
      ['0 * 13 1 *', 'every hour on January 13'],
      ['0 * 1,15 * *', 'every hour on the 1st and 15th']
    ]);
  });
});
