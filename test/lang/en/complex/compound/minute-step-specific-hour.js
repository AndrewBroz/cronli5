import {run} from '../../../../runner.js';

// Behavior spec for a minute step combined with a single specific hour. The
// step previously dropped the hour entirely ("every 15 minutes"); it must
// confine the cadence to that hour's window, e.g. "from 9 a.m. through
// 9:59 a.m.", mirroring the hour-range phrasing.

describe('Minute step within a specific hour:', function() {
  describe('basic', function() {
    run([
      ['*/15 9 * * *',
        'every 15 minutes from 9 a.m. through 9:45 a.m.'],
      ['*/30 9 * * *',
        'every 30 minutes from 9 a.m. through 9:30 a.m.'],
      ['*/15 0 * * *',
        'every 15 minutes from midnight through 12:45 a.m.']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['*/15 9 * * MON',
        'every 15 minutes from 9 a.m. through 9:45 a.m. on Monday']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['*/15 9 * * *',
        'every 15 minutes from 09:00 through 09:45', {ampm: false}]
    ]);
  });
});
