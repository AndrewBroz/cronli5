import {run} from '../../../../runner.js';

// Behavior spec for a minute wildcard or plain range combined with an hour
// step. A wildcard minute is a cadence and must be confined to the active
// hours ("during every other hour" for a clean step, else the hour list), never
// juxtaposed with a second cadence. A plain range is a per-hour window whose
// recurrence trails as its own clause ("…, every two hours").

describe('Minute span across an hour step:', function() {
  describe('minute range', function() {
    run([
      ['0-30 */2 * * *',
        'every minute from 0 through 30 past the hour, every two hours'],
      ['0-30 9-17/2 * * *',
        'every minute from 0 through 30 past the hour, ' +
        'at 9 a.m., 11 a.m., 1 p.m., 3 p.m., and 5 p.m.']
    ]);
  });

  // A minute list under a clean hour stride keeps the cadence, exactly as the
  // wildcard and range forms do — the hour reads the same regardless of the
  // minute's shape, never enumerated into a wall of clock times.
  describe('minute list (keeps the cadence)', function() {
    run([
      ['5,30 1/2 * * *',
        'at 5 and 30 minutes past the hour, every two hours from 1 a.m.'],
      ['3/2 1/2 * * *',
        'at 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, ' +
        '35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, and 59 minutes ' +
        'past the hour, every two hours from 1 a.m.'],
      ['5,30 */2 * * *',
        'at 5 and 30 minutes past the hour, every two hours'],
      // An unclean stride still enumerates its hours (compactClockTimes).
      ['3/2 9-17/2 * * *',
        'at 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, ' +
        '35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, and 59 minutes ' +
        'past the hour, at 9 a.m., 11 a.m., 1 p.m., 3 p.m., and 5 p.m.']
    ]);
  });

  describe('wildcard minute (confined to the active hours)', function() {
    run([
      ['* */2 * * *', 'every minute during every other hour'],
      ['* */3 * * *', 'every minute during every third hour'],
      ['* 1/2 * * *', 'every minute during every other hour starting at 1 a.m.'],
      ['* */10 * * *',
        'every minute during the 12 a.m., 10 a.m., and 8 p.m. hours']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['0-30 */2 * * MON',
        'every minute from 0 through 30 past the hour, ' +
        'every two hours on Monday']
    ]);
  });
});
