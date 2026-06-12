import {run} from '../../runner.js';

describe('Valid arrays with ranges:', function() {
  describe('second ranges', function() {
    run([
      [['0-30', '*', '*', '*', '*', '*'],
        'every second from zero through 30 past the minute'],
      [['10-20', '*', '*', '*', '*', '*'],
        'every second from ten through 20 past the minute']
    ]);
  });

  describe('minute ranges', function() {
    run([
      [['0-29', '*', '*', '*', '*'],
        'every minute from zero through 29 past the hour'],
      [['1-5', '*', '*', '*', '*'],
        'every minute from one through five past the hour']
    ]);
  });

  describe('hour ranges', function() {
    run([
      [['0', '9-17', '*', '*', '*'],
        'every hour from 9:00 AM through 5:00 PM'],
      [['0', '0-5', '*', '*', '*'],
        'every hour from 12:00 AM through 5:00 AM']
    ]);
  });

  describe('date ranges', function() {
    run([
      [['0', '0', '1-15', '*', '*'], 'on the 1st through 15th at 12:00 AM'],
      [['0', '0', '10-20', '*', '*'], 'on the 10th through 20th at 12:00 AM']
    ]);
  });

  describe('month ranges', function() {
    run([
      [['0', '12', '*', '6-8', '*'],
        'every day in June through August at 12:00 PM'],
      [['0', '12', '*', 'JAN-MAR', '*'],
        'every day in January through March at 12:00 PM']
    ]);
  });

  describe('weekday ranges', function() {
    run([
      [['0', '9', '*', '*', 'MON-FRI'], 'every Monday through Friday at 9:00 AM'],
      [['0', '9', '*', '*', '1-5'], 'every Monday through Friday at 9:00 AM']
    ]);
  });
});
