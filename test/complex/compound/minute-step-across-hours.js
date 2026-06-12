import {run} from '../../runner.js';

// Behavior spec for a minute step combined with an hour list or hour step.
// The step previously dropped the hour entirely ("every 15 minutes"); it must
// confine the cadence: an hour list reads "during the <times> hours" and an
// hour step trails alongside as its own clause.

describe('Minute step across multiple hours:', function() {
  describe('hour list', function() {
    run([
      ['*/15 9,17 * * *',
        'every 15 minutes during the 9:00 AM and 5:00 PM hours'],
      ['*/30 0,12 * * *',
        'every 30 minutes during the 12:00 AM and 12:00 PM hours']
    ]);
  });

  describe('hour step', function() {
    run([
      ['*/15 */2 * * *', 'every 15 minutes, every two hours'],
      ['*/15 */10 * * *',
        'every 15 minutes, at 12:00 AM, 10:00 AM and 8:00 PM']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['*/15 9,17 * * MON-FRI',
        'every 15 minutes during the 9:00 AM and 5:00 PM hours ' +
        'on Monday through Friday']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['*/15 9,17 * * *',
        'every 15 minutes during the 09:00 and 17:00 hours', {ampm: false}]
    ]);
  });
});
