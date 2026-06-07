import {run} from '../../runner.js';

// Behavior spec for a minute step combined with a single specific hour. The
// step previously dropped the hour entirely ("every 15 minutes"); it must
// confine the cadence to that hour's window, e.g. "from 9:00 AM through
// 9:59 AM", mirroring the hour-range phrasing.

describe('Minute step within a specific hour:', function() {
  describe('basic', function() {
    run([
      ['*/15 9 * * *',
        'every 15 minutes from 9:00 AM through 9:59 AM'],
      ['*/30 9 * * *',
        'every 30 minutes from 9:00 AM through 9:59 AM'],
      ['*/15 0 * * *',
        'every 15 minutes from 12:00 AM through 12:59 AM']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['*/15 9 * * MON',
        'every 15 minutes from 9:00 AM through 9:59 AM on Monday']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['*/15 9 * * *',
        'every 15 minutes from 09:00 through 09:59', {ampm: false}]
    ]);
  });
});
