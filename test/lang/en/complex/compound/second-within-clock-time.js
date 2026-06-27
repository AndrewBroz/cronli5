import {run} from '../../../../runner.js';

// Behavior spec for a single specific second combined with a specific hour
// (6-field). The second folds into the clock time as "H:MM:SS" rather than
// being dropped. A zero second is omitted, preserving "H:MM".

describe('Second folded into a clock time:', function() {
  describe('basic', function() {
    run([
      ['15 0 9 * * *', 'every day at 9:00:15 a.m.'],
      ['15 30 9 * * *', 'every day at 9:30:15 a.m.'],
      ['5 0 9 * * *', 'every day at 9:00:05 a.m.'],
      ['0 0 9 * * *', 'every day at 9 a.m.'],
      // A nonzero second at midnight blocks the "midnight" word form, so it
      // reads as the full clock time "12:00:30 a.m." rather than "midnight".
      ['30 0 0 * * *', 'every day at 12:00:30 a.m.']
    ]);
  });

  describe('across an hour list', function() {
    run([
      ['30 0 9,17 * * *', 'every day at 9:00:30 a.m. and 5:00:30 p.m.']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['15 0 9 * * MON', 'every Monday at 9:00:15 a.m.']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['15 0 9 * * *', 'every day at 09:00:15', {ampm: false}]
    ]);
  });
});
