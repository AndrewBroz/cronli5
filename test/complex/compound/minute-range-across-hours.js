import {run} from '../../runner.js';

// Behavior spec for a plain minute range combined with a discrete hour list.
// The minute range must not collapse: it reads "every minute from <a> through
// <b> past the hour, at <times>", trailing any day qualifier.

describe('Minute range across an hour list:', function() {
  describe('basic', function() {
    run([
      ['0-30 9,17 * * *',
        'every minute from zero through 30 past the hour, ' +
        'at 9 a.m. and 5 p.m.'],
      ['0-15 0,12 * * *',
        'every minute from zero through 15 past the hour, ' +
        'at midnight and noon']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['0-30 9,17 * * MON',
        'every minute from zero through 30 past the hour, ' +
        'at 9 a.m. and 5 p.m. on Monday']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['0-30 9,17 * * *',
        'every minute from zero through 30 past the hour, ' +
        'at 09:00 and 17:00', {ampm: false}]
    ]);
  });
});
