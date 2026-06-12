import {run} from '../../../../runner.js';

// Behavior spec for comma-separated list patterns. Conventions:
// - Lists join as "A, B, and C" (serial, no Oxford comma), matching the
//   existing numeric-field style; weekday lists keep their established
//   Oxford-comma form.
// - Numeric values follow `getNumber` (words for 0-10, digits above).
// - Second/minute lists read "at <values> seconds/minutes past the
//   minute/hour".
// - Hour lists expand into a list of clock times.
// - Date lists read "on the <ordinals>" using suffixed numeric ordinals
//   (1st, 2nd, ... 31st); month lists read "in <months>".

describe('Valid strings with lists:', function() {
  describe('second lists', function() {
    run([
      ['0,30 * * * * *', 'at zero and 30 seconds past the minute'],
      ['5,10,15 * * * * *', 'at five, ten, and 15 seconds past the minute'],
      ['0,15,30,45 * * * * *', 'at zero, 15, 30, and 45 seconds past the minute']
    ]);
  });

  describe('minute lists', function() {
    run([
      ['0,30 * * * *', 'at zero and 30 minutes past the hour'],
      ['1,2,3 * * * *', 'at one, two, and three minutes past the hour'],
      ['0,15,30,45 * * * *', 'at zero, 15, 30, and 45 minutes past the hour']
    ]);
  });

  describe('hour lists', function() {
    run([
      ['0 9,17 * * *', 'every day at 9 a.m. and 5 p.m.'],
      ['0 0,12 * * *', 'every day at midnight and noon'],
      ['0 9,12,17 * * *', 'every day at 9 a.m., noon, and 5 p.m.']
    ]);
  });

  describe('date lists', function() {
    run([
      ['0 0 1,15 * *', 'on the 1st and 15th at midnight'],
      ['0 0 1,15,31 * *', 'on the 1st, 15th, and 31st at midnight']
    ]);
  });

  describe('month lists', function() {
    run([
      ['0 12 * 6,12 *', 'every day in June and December at noon'],
      [
        '0 12 * 1,4,7,10 *',
        'every day in January, April, July, and October at noon'
      ],
      ['0 12 * JAN,JUL *', 'every day in January and July at noon']
    ]);
  });

  describe('weekday lists', function() {
    run([
      ['0 14 * * MON,WED,FRI',
        'every Monday, Wednesday, and Friday at 2 p.m.'],
      ['0 14 * * 1,3,5', 'every Monday, Wednesday, and Friday at 2 p.m.']
    ]);
  });
});
