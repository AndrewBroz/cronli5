import {run} from '../../../../runner.js';

// Behavior spec for fields whose comma lists mix single values with ranges
// or steps (e.g. `0-30,45` or `9,17-19`). These are valid cron fields and
// must neither crash nor garble: range segments read as "<a> through <b>"
// and hour segments expand into their clock times.

describe('Lists mixing values with ranges or steps:', function() {
  describe('minute list containing a range', function() {
    run([
      ['5-10,20 * * * *',
        'at 5 through 10 and 20 minutes past the hour'],
      ['0-30,45 9 * * *',
        'at 0 through 30 and 45 minutes past the hour, at 9 a.m.'],
      ['5-10,20 9,17 * * *',
        'at 5 through 10 and 20 minutes past the hour, ' +
        'at 9 a.m. and 5 p.m.'],
      ['0-10,30 9-17 * * *',
        'at 0 through 10 and 30 minutes past the hour ' +
        'from 9 a.m. through 5 p.m.']
    ]);
  });

  describe('second list containing a range', function() {
    run([
      ['0-30,45 * * * * *',
        'at 0 through 30 and 45 seconds past the minute'],
      ['5-10,20 30 * * * *',
        'at 5 through 10 and 20 seconds past the minute, ' +
        '30 minutes past the hour, every hour']
    ]);
  });

  describe('hour list containing a range or step', function() {
    run([
      ['0 9,17-19 * * *',
        'every day at 9 a.m., 5 p.m., 6 p.m., and 7 p.m.'],
      ['0 9,17/2 * * *',
        'every day at 9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m.'],
      ['0-30 9,17-19 * * *',
        'every minute from 0 through 30 past the hour, ' +
        'at 9 a.m., 5 p.m., 6 p.m., and 7 p.m.'],
      ['*/15 9,17/2 * * *',
        'every 15 minutes during the ' +
        '9 a.m., 5 p.m., 7 p.m., 9 p.m., and 11 p.m. hours']
    ]);
  });

  describe('bounded hour step under a minute step', function() {
    run([
      ['*/15 9-17/2 * * *',
        'every 15 minutes during the ' +
        '9 a.m., 11 a.m., 1 p.m., 3 p.m., and 5 p.m. hours']
    ]);
  });

  describe('day-level lists containing a range or step', function() {
    run([
      ['0 0 1-5,15 * *',
        'on the 1st through 5th and 15th at midnight'],
      ['0 0 * 1-3,6 *',
        'every day in January through March and June at midnight'],
      ['0 0 * 1,6/3 *',
        'every day in January, June, September, and December at midnight'],
      ['0 0 * * 1-5,0',
        'every Sunday and Monday through Friday at midnight']
    ]);
  });

  describe('minute or second list containing a step', function() {
    run([
      ['5,30-40/5 * * * *',
        'at 5, 30, 35, and 40 minutes past the hour'],
      ['0,10-58/12 * * * *',
        'at 0, 10, 22, 34, 46, and 58 minutes past the hour'],
      ['5,30-40/5 * * * * *',
        'at 5, 30, 35, and 40 seconds past the minute']
    ]);
  });

  describe('specific dates under a non-single month', function() {
    run([
      ['0 0 1 6-9 *',
        'on the 1st in June through September at midnight'],
      ['0 0 1,15 6-9 *',
        'on the 1st and 15th in June through September at midnight'],
      ['0 0 1-15 6-9 *',
        'on the 1st through 15th in June through September at midnight'],
      ['0 0 1 1,3-6 *',
        'on the 1st in January and March through June at midnight'],
      ['0 0 1 1-11/3 *',
        'on January, April, July, and October 1 at midnight'],
      ['0 0 1 6-9 FRI',
        'on the 1st or on Friday in June through September at midnight']
    ]);
  });
});
