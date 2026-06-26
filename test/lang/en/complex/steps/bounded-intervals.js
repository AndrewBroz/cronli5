import {run} from '../../../../runner.js';

// Behavior spec for step (`/`) patterns whose start is a range, e.g.
// `1-5/2`. These are valid cron (the interval is applied within the bounded
// range) and must be enumerated, not silently mangled.

describe('Step patterns with a bounded (range) start:', function() {
  describe('minutes', function() {
    run([
      ['1-5/2 * * * *', 'at 1, 3, and 5 minutes past the hour'],
      ['0-10/5 * * * *', 'at 0, 5, and 10 minutes past the hour'],
      ['1-5/1 * * * *',
        'every minute from one through five past the hour']
    ]);
  });

  describe('seconds', function() {
    run([
      ['1-5/2 * * * * *', 'at 1, 3, and 5 seconds past the minute']
    ]);
  });

  describe('hours', function() {
    run([
      // A bounded hour step starts at or past its interval, so it has a
      // distinct endpoint: it reads as a bounded cadence pinning both ends
      // (which recovers the same {9,11,13,15,17}), not a wall of clock times.
      ['0 9-17/2 * * *',
        'every two hours from 9 a.m. through 5 p.m.'],
      // A bounded step that wraps cleanly from within its first interval (start
      // < interval, dividing the day) keeps its enumerated fires — there is no
      // distinct endpoint to pin.
      ['0 1-23/2 * * *',
        'at 1 a.m., 3 a.m., 5 a.m., 7 a.m., 9 a.m., 11 a.m., 1 p.m., 3 p.m., ' +
        '5 p.m., 7 p.m., 9 p.m., and 11 p.m.'],
      // A bounded step that fires only once is a single value, not a cadence.
      ['0 9-10/5 * * *', 'at 9 a.m.']
    ]);
  });
});
