import {run} from '../../../runner.js';

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
    ['0 13 * * FRI', 'every Fri at 1 p.m.', options],
    ['0 2 * * MON-FRI', 'every Mon-Fri at 2 a.m.', options],
    ['0 6 * * SAT', 'every Sat at 6 a.m.', options],
    ['0 13 * * 5', 'every Fri at 1 p.m.', options],
    ['0 2 * * 1-5', 'every Mon-Fri at 2 a.m.', options],
    ['0 14 * * 1,3,5', 'every Mon, Wed, and Fri at 2 p.m.', options],
    ['0 23 * * 4', 'every Thu at 11 p.m.', options],
    ['0 6 * * 6', 'every Sat at 6 a.m.', options],
    // The `7`-for-Sunday alias resolves to Sunday, abbreviated under short.
    ['0 9 * * 7', 'every Sun at 9 a.m.', options],
    // A plain weekday list pluralizes per name, abbreviated under short;
    // weekday lists display Monday-first with Sunday last.
    ['0 9 * * 0,2', 'every Tue and Sun at 9 a.m.', options]
  ]);

  // The short flag compacts every "A through B" range to "A-B": weekday,
  // month, and date ranges, value ranges within lists, and clock-time
  // windows.
  describe('ranges compact with hyphens', function() {
    run([
      ['0 0 1 JAN-MAR *', 'on the 1st in Jan-Mar at midnight', options],
      ['0 12 * 11-2 *', 'every day in Nov-Feb at noon', options],
      ['0 0 1-5 * *', 'on the 1st-5th at midnight', options],
      ['0 0 13 * 1-5', 'on the 13th or on Mon-Fri at midnight', options],
      ['0 0 * * FRI-MON', 'every Fri-Mon at midnight', options],
      ['0-29 * * * *', 'every minute from 0-29 past the hour', options],
      ['0-30,45 9 * * *',
        'at 0-30 and 45 minutes past the hour, at 9 a.m.', options],
      ['*/15 9-17 * * *', 'every 15 minutes from 9 a.m.-5:45 p.m.', options],
      ['* 9 * * *', 'every minute of the 9 a.m. hour', options],
      ['30 9-20,22 * * *',
        'at 30 minutes past the hour from 9 a.m.-8:30 p.m. and at 10:30 p.m.', options]
    ]);
  });

  // A recurring weekday (no time anchor) pluralizes to "on Mondays" in full;
  // under short the name is abbreviated and the plural suffix is dropped ("on
  // Mon"). The `7`-for-Sunday alias resolves to Sunday.
  describe('recurring weekday abbreviates without a plural suffix', function() {
    run([
      ['*/5 * * * 1', 'every 5 minutes on Mon', options],
      ['*/5 * * * 1,3', 'every 5 minutes on Mon and Wed', options],
      ['*/5 * * * 7', 'every 5 minutes on Sun', options]
    ]);
  });
});
