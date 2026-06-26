import {run} from '../../../../runner.js';

// Behavior spec for a plain minute range combined with a discrete hour list.
// The minute range is a cadence, so the hour list confines it with the
// "during the <times> hours" idiom — the same reading the seconds-leading
// sibling uses — rather than a clock-time "at <times>" list (which reads as
// discrete fire points). Any day qualifier trails.

describe('Minute range across an hour list:', function() {
  describe('basic', function() {
    run([
      ['0-30 9,17 * * *',
        'every minute from 0 through 30 past the hour ' +
        'during the 9 a.m. and 5 p.m. hours'],
      ['0-15 0,12 * * *',
        'every minute from 0 through 15 past the hour ' +
        'during the midnight and noon hours']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['0-30 9,17 * * MON',
        'every minute from 0 through 30 past the hour ' +
        'during the 9 a.m. and 5 p.m. hours on Mondays']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['0-30 9,17 * * *',
        'every minute from 0 through 30 past the hour ' +
        'during the 09:00 and 17:00 hours', {ampm: false}]
    ]);
  });
});
