import {run} from '../runner.js';

describe('Short option:', function() {
  var options = {short: true};

  run([
    ['* * * * *', 'every minute', options],
    ['*/2 * * * *', 'every 2 minutes', options],
    ['*/5 * * * *', 'every 5 minutes', options],
    ['*/10 * * * *', 'every 10 minutes', options],
    ['*/15 * * * *', 'every 15 minutes', options],
    ['0 * * * *', 'every hour', options],
    ['0 */2 * * *', 'every 2 hours', options],
    ['0 */4 * * *', 'every 4 hours', options],
    ['0 */6 * * *', 'every 6 hours', options],
    ['0 */8 * * *', 'every 8 hours', options],
    ['0 */12 * * *', 'every 12 hours', options],
    ['0 13 * * FRI', 'every Fri at 1:00 PM', options],
    ['0 2 * * MON-FRI', 'every Mon-Fri at 2:00 AM', options],
    ['0 6 * * SAT', 'every Sat at 6:00 AM', options],
    ['0 13 * * 5', 'every Fri at 1:00 PM', options],
    ['0 2 * * 1-5', 'every Mon-Fri at 2:00 AM', options],
    ['0 14 * * 1,3,5', 'every Mon, Wed and Fri at 2:00 PM', options],
    ['0 23 * * 4', 'every Thu at 11:00 PM', options],
    ['0 6 * * 6', 'every Sat at 6:00 AM', options]
  ]);

  // The short flag compacts every "A through B" range to "A-B": weekday,
  // month, and date ranges, value ranges within lists, and clock-time
  // windows.
  describe('ranges compact with hyphens', function() {
    run([
      ['0 0 1 JAN-MAR *', 'on Jan-Mar 1st at 12:00 AM', options],
      ['0 12 * 11-2 *', 'every day in Nov-Feb at 12:00 PM', options],
      ['0 0 1-5 * *', 'on the 1st-5th at 12:00 AM', options],
      ['0 0 13 * 1-5', 'on the 13th or on Mon-Fri at 12:00 AM', options],
      ['0 0 * * FRI-MON', 'every Fri-Mon at 12:00 AM', options],
      ['0-29 * * * *', 'every minute from 0-29 past the hour', options],
      ['0-30,45 9 * * *',
        'at 0-30 and 45 minutes past the hour, at 9:00 AM', options],
      ['*/15 9-17 * * *', 'every 15 minutes from 9:00 AM-5:45 PM', options],
      ['* 9 * * *', 'every minute from 9:00 AM-9:59 AM', options],
      ['30 9-20,22 * * *',
        'every day at 9:30 AM-8:30 PM and 10:30 PM', options]
    ]);
  });
});
