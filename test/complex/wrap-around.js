import {run} from '../runner.js';

// Behavior spec for wrap-around ranges in cyclic fields (e.g. `22-2` for an
// overnight window, `FRI-MON` for a weekend span, `NOV-FEB` for winter).
// Every cron field except the year is a cycle, so a range whose start is
// greater than its end wraps and must be described, not rejected.

describe('Wrap-around ranges:', function() {
  describe('hours wrap across midnight', function() {
    run([
      ['0 22-2 * * *', 'every hour from 10 p.m. through 2 a.m.'],
      ['* 22-2 * * *', 'every minute from 10 p.m. through 2:59 a.m.'],
      ['*/15 22-2 * * *', 'every 15 minutes from 10 p.m. through 2:45 a.m.'],
      ['0-30 22-2 * * *',
        'every minute from zero through 30 past the hour, ' +
        'from 10 p.m. through 2:30 a.m.']
    ]);
  });

  describe('minutes and seconds wrap within their cycle', function() {
    run([
      ['30-10 * * * *', 'every minute from 30 through ten past the hour'],
      ['50-10 9 * * *',
        'every minute from 50 through ten past the hour, at 9 a.m.'],
      ['50-10 * * * * *', 'every second from 50 through ten past the minute']
    ]);
  });

  describe('day-level fields wrap', function() {
    run([
      ['0 0 20-5 * *', 'on the 20th through 5th at midnight'],
      ['0 0 * * FRI-MON', 'every Friday through Monday at midnight'],
      ['0 12 * 11-2 *',
        'every day in November through February at noon'],
      ['0 0 1 DEC-JAN *', 'on December through January 1 at midnight']
    ]);
  });

  describe('hour lists containing a wrapping range', function() {
    run([
      ['0 22-2,12 * * *',
        'every day at noon, 10 p.m., 11 p.m., ' +
        'midnight, 1 a.m., and 2 a.m.']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['0 17-9 * * *', 'every hour from 17:00 through 09:00', {ampm: false}]
    ]);
  });
});
