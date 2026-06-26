import {run} from '../../../../runner.js';

// Behavior spec for a minute step combined with an hour list or hour step.
// The step previously dropped the hour entirely ("every 15 minutes"); it must
// confine the cadence so it never reads as a second, conflicting frequency.
// An hour list reads "during the <times> hours"; a clean hour step (dividing
// the day) reads "during every <Nth> hour"; an uneven or bounded step lists
// its active hours the same way as a list.

describe('Minute step across multiple hours:', function() {
  describe('hour list', function() {
    run([
      ['*/15 9,17 * * *',
        'every 15 minutes during the 9 a.m. and 5 p.m. hours'],
      ['*/30 0,12 * * *',
        'every 30 minutes during the midnight and noon hours']
    ]);
  });

  describe('clean hour step (confined to every Nth hour)', function() {
    run([
      ['*/15 */2 * * *', 'every 15 minutes during every other hour'],
      ['*/15 */3 * * *', 'every 15 minutes during every third hour'],
      ['*/15 */4 * * *', 'every 15 minutes during every fourth hour']
    ]);
  });

  describe('offset clean stride (confined, with a start anchor)', function() {
    run([
      ['*/15 1/2 * * *',
        'every 15 minutes during every other hour starting at 1 a.m.'],
      ['*/15 1/3 * * *',
        'every 15 minutes during every third hour starting at 1 a.m.'],
      ['*/15 2/4 * * *',
        'every 15 minutes during every fourth hour starting at 2 a.m.']
    ]);
  });

  describe('uneven hour step (reads as a bounded cadence)', function() {
    run([
      ['*/15 */10 * * *',
        'every 15 minutes, every ten hours from midnight through 8 p.m.']
    ]);
  });

  describe('bounded hour step (reads as a bounded cadence)', function() {
    run([
      ['*/20 9-17/2 * * *',
        'every 20 minutes, every two hours from 9 a.m. through 5 p.m.']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['*/15 9,17 * * MON-FRI',
        'every 15 minutes during the 9 a.m. and 5 p.m. hours ' +
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
