import {run} from '../../runner.js';

// Behavior spec for fields whose comma lists mix single values with ranges
// or steps (e.g. `0-30,45` or `9,17-19`). These are valid cron fields and
// must neither crash nor garble: range segments read as "<a> through <b>"
// and hour segments expand into their clock times.

describe('Lists mixing values with ranges or steps:', function() {
  describe('minute list containing a range', function() {
    run([
      ['5-10,20 * * * *',
        'at five through ten and 20 minutes past the hour'],
      ['0-30,45 9 * * *',
        'at zero through 30 and 45 minutes past the hour, at 9:00 AM'],
      ['5-10,20 9,17 * * *',
        'at five through ten and 20 minutes past the hour, ' +
        'at 9:00 AM and 5:00 PM'],
      ['0-10,30 9-17 * * *',
        'at zero through ten and 30 minutes past the hour ' +
        'from 9:00 AM through 5:30 PM']
    ]);
  });

  describe('second list containing a range', function() {
    run([
      ['0-30,45 * * * * *',
        'at zero through 30 and 45 seconds past the minute'],
      ['5-10,20 30 * * * *',
        'at five through ten and 20 seconds past the minute, ' +
        '30 minutes past the hour, every hour']
    ]);
  });

  describe('hour list containing a range or step', function() {
    run([
      ['0 9,17-19 * * *',
        'every day at 9:00 AM, 5:00 PM, 6:00 PM and 7:00 PM'],
      ['0 9,17/2 * * *',
        'every day at 9:00 AM, 5:00 PM, 7:00 PM, 9:00 PM and 11:00 PM'],
      ['0-30 9,17-19 * * *',
        'every minute from zero through 30 past the hour, ' +
        'at 9:00 AM, 5:00 PM, 6:00 PM and 7:00 PM'],
      ['*/15 9,17/2 * * *',
        'every 15 minutes during the ' +
        '9:00 AM, 5:00 PM, 7:00 PM, 9:00 PM and 11:00 PM hours']
    ]);
  });

  describe('bounded hour step under a minute step', function() {
    run([
      ['*/15 9-17/2 * * *',
        'every 15 minutes, ' +
        'at 9:00 AM, 11:00 AM, 1:00 PM, 3:00 PM and 5:00 PM']
    ]);
  });

  describe('day-level lists containing a range or step', function() {
    run([
      ['0 0 1-5,15 * *',
        'on the 1st through 5th and 15th at 12:00 AM'],
      ['0 0 * 1-3,6 *',
        'every day in January through March and June at 12:00 AM'],
      ['0 0 * 1,6/3 *',
        'every day in January, June, September and December at 12:00 AM'],
      ['0 0 * * 1-5,0',
        'every Sunday and Monday-Friday at 12:00 AM']
    ]);
  });
});
