import {run} from '../../../../runner.js';

// Behavior spec for a minute wildcard combined with a discrete hour list.
// The pattern fires every minute of each listed hour, so it must read
// "every minute during the <times> hours" (mirroring the minute-step
// phrasing) rather than collapsing to bare clock times.

describe('Minute wildcard across an hour list:', function() {
  describe('basic', function() {
    run([
      ['* 9,17 * * *',
        'every minute during the 9 a.m. and 5 p.m. hours'],
      ['* 0,12 * * *',
        'every minute during the midnight and noon hours']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['* 9,17 * * MON',
        'every minute during the 9 a.m. and 5 p.m. hours on Mondays']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['* 9,17 * * *',
        'every minute during the 09:00 and 17:00 hours', {ampm: false}]
    ]);
  });
});
