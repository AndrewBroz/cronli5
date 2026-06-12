import {run} from '../runner.js';

// Behavior spec for wrap-around ranges in cyclic fields (e.g. `22-2` for an
// overnight window, `FRI-MON` for a weekend span, `NOV-FEB` for winter).
// Every cron field except the year is a cycle, so a range whose start is
// greater than its end wraps and must be described, not rejected.

describe('Wrap-around ranges:', function() {
  describe('hours wrap across midnight', function() {
    run([
      ['0 22-2 * * *', 'every hour from 10:00 PM through 2:00 AM'],
      ['* 22-2 * * *', 'every minute from 10:00 PM through 2:59 AM'],
      ['*/15 22-2 * * *', 'every 15 minutes from 10:00 PM through 2:45 AM'],
      ['0-30 22-2 * * *',
        'every minute from zero through 30 past the hour, ' +
        'from 10:00 PM through 2:30 AM']
    ]);
  });

  describe('minutes and seconds wrap within their cycle', function() {
    run([
      ['30-10 * * * *', 'every minute from 30 through ten past the hour'],
      ['50-10 9 * * *',
        'every minute from 50 through ten past the hour, at 9:00 AM'],
      ['50-10 * * * * *', 'every second from 50 through ten past the minute']
    ]);
  });

  describe('day-level fields wrap', function() {
    run([
      ['0 0 20-5 * *', 'on the 20th through 5th at 12:00 AM'],
      ['0 0 * * FRI-MON', 'every Friday through Monday at 12:00 AM'],
      ['0 12 * 11-2 *',
        'every day in November through February at 12:00 PM'],
      ['0 0 1 DEC-JAN *', 'on December through January 1st at 12:00 AM']
    ]);
  });

  describe('hour lists containing a wrapping range', function() {
    run([
      ['0 22-2,12 * * *',
        'every day at 12:00 PM, 10:00 PM, 11:00 PM, ' +
        '12:00 AM, 1:00 AM and 2:00 AM']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['0 17-9 * * *', 'every hour from 17:00 through 09:00', {ampm: false}]
    ]);
  });
});
