import {run} from '../../runner.js';

// Behavior spec for patterns where a lower-order field would describe itself
// in isolation, but a more significant field is also set and takes over the
// description. The lower field "defers" rather than producing a fragment.
// Conventions:
// - A second range/list/value with a specific minute defers to the minute,
//   which anchors as "<n> minutes past the hour, every hour".
// - A minute range or wildcard with a specific hour defers to the hour,
//   which anchors the clock time.
// - A minute range combined with an hour list still expands to clock times,
//   anchoring each at the top of the minute.

describe('Compound patterns that defer to a higher field:', function() {
  describe('seconds deferring to a specific minute', function() {
    run([
      ['0-30 30 * * * *', '30 minutes past the hour, every hour'],
      ['5,10 30 * * * *', '30 minutes past the hour, every hour'],
      ['15 30 * * * *', '30 minutes past the hour, every hour']
    ]);
  });

  describe('minutes deferring to a specific hour', function() {
    run([
      ['0-29 9 * * *', 'every day at 9:00 AM'],
      ['* 9 * * *', 'every day at 9:00 AM'],
      ['* 0 * * *', 'every day at 12:00 AM']
    ]);
  });

  describe('minute range expanded across an hour list', function() {
    run([
      ['0-30 9,17 * * *', 'every day at 9:00 AM and 5:00 PM']
    ]);
  });
});
