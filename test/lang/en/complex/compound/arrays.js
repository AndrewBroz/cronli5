import {run} from '../../../../runner.js';

describe('Valid compound arrays:', function() {
  describe('already-supported combinations', function() {
    run([
      [['30', '9', '*', '*', 'MON-FRI'], 'every Monday through Friday at 9:30 a.m.'],
      [['0', '22', '*', '*', '1-5'], 'every Monday through Friday at 10 p.m.'],
      [['0', '0', '25', '12', '*'], 'on December 25 at midnight']
    ]);
  });

  describe('specific date without month', function() {
    run([
      [['15', '14', '1', '*', '*'], 'on the 1st at 2:15 p.m.'],
      [['0', '0', '15', '*', '*'], 'on the 15th at midnight']
    ]);
  });

  describe('minute list/range with specific hours', function() {
    run([
      [['0,30', '9', '*', '*', '*'], 'every day at 9 a.m. and 9:30 a.m.'],
      [['0,30', '9', '*', '*', 'MON-FRI'],
        'every Monday through Friday at 9 a.m. and 9:30 a.m.'],
      [['0,30', '9,17', '*', '*', '*'],
        'every day at 9 a.m., 9:30 a.m., 5 p.m., and 5:30 p.m.']
    ]);
  });

  describe('frequency within an hour range', function() {
    run([
      [['*/15', '9-17', '*', '*', '*'],
        'every 15 minutes from 9 a.m. through 5:45 p.m.'],
      [['*/15', '9-17', '*', '*', 'MON-FRI'],
        'every 15 minutes from 9 a.m. through 5:45 p.m. on Monday through Friday']
    ]);
  });

  describe('specific minute(s) within an hour range', function() {
    run([
      [['0', '9-17', '*', '*', '*'],
        'every hour from 9 a.m. through 5 p.m.'],
      [['30', '9-17', '*', '*', '*'],
        'at 30 minutes past the hour from 9 a.m. through 5 p.m.'],
      [['0,30', '9-17', '*', '*', '*'],
        'at 0 and 30 minutes past the hour from 9 a.m. through 5 p.m.'],
      [['15', '9-17', '*', '*', 'MON-FRI'],
        'at 15 minutes past the hour from 9 a.m. through 5 p.m. ' +
          'on Monday through Friday']
    ]);
  });

  describe('date and month together', function() {
    run([
      [['0', '12', '1', '1', '*'], 'on January 1 at noon'],
      [['0', '12', '25', '12', '*'], 'on December 25 at noon']
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
      [['0', '*', '13', '1', '*'], 'every hour on January 13'],
      [['0', '*', '1,15', '*', '*'], 'every hour on the 1st and 15th']
    ]);
  });
});
