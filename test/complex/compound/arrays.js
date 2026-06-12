import {run} from '../../runner.js';

describe('Valid compound arrays:', function() {
  describe('already-supported combinations', function() {
    run([
      [['30', '9', '*', '*', 'MON-FRI'], 'every Monday through Friday at 9:30 AM'],
      [['0', '22', '*', '*', '1-5'], 'every Monday through Friday at 10:00 PM'],
      [['0', '0', '25', '12', '*'], 'on December 25th at 12:00 AM']
    ]);
  });

  describe('specific date without month', function() {
    run([
      [['15', '14', '1', '*', '*'], 'on the 1st at 2:15 PM'],
      [['0', '0', '15', '*', '*'], 'on the 15th at 12:00 AM']
    ]);
  });

  describe('minute list/range with specific hours', function() {
    run([
      [['0,30', '9', '*', '*', '*'], 'every day at 9:00 AM and 9:30 AM'],
      [['0,30', '9', '*', '*', 'MON-FRI'],
        'every Monday through Friday at 9:00 AM and 9:30 AM'],
      [['0,30', '9,17', '*', '*', '*'],
        'every day at 9:00 AM, 9:30 AM, 5:00 PM and 5:30 PM']
    ]);
  });

  describe('frequency within an hour range', function() {
    run([
      [['*/15', '9-17', '*', '*', '*'],
        'every 15 minutes from 9:00 AM through 5:45 PM'],
      [['*/15', '9-17', '*', '*', 'MON-FRI'],
        'every 15 minutes from 9:00 AM through 5:45 PM on Monday through Friday']
    ]);
  });

  describe('specific minute(s) within an hour range', function() {
    run([
      [['0', '9-17', '*', '*', '*'],
        'every hour from 9:00 AM through 5:00 PM'],
      [['30', '9-17', '*', '*', '*'],
        'at 30 minutes past the hour from 9:00 AM through 5:30 PM'],
      [['0,30', '9-17', '*', '*', '*'],
        'at zero and 30 minutes past the hour from 9:00 AM through 5:30 PM'],
      [['15', '9-17', '*', '*', 'MON-FRI'],
        'at 15 minutes past the hour from 9:00 AM through 5:15 PM ' +
          'on Monday through Friday']
    ]);
  });

  describe('date and month together', function() {
    run([
      [['0', '12', '1', '1', '*'], 'on January 1st at 12:00 PM'],
      [['0', '12', '25', '12', '*'], 'on December 25th at 12:00 PM']
    ]);
  });

  describe('frequency with a day qualifier', function() {
    run([
      [['*', '*', '*', '*', 'MON'], 'every minute on Monday'],
      [['0', '*', '*', '*', 'MON'], 'every hour on Monday'],
      [['*', '*', '*', '*', 'MON-FRI'], 'every minute on Monday through Friday'],
      [['*', '*', '13', '*', '*'], 'every minute on the 13th'],
      [['0', '*', '13', '*', '*'], 'every hour on the 13th'],
      [['0', '*', '*', '1', '*'], 'every hour in January'],
      [['0', '*', '13', '1', '*'], 'every hour on January 13th'],
      [['0', '*', '1,15', '*', '*'], 'every hour on the 1st and 15th']
    ]);
  });
});
