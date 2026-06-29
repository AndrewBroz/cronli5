import {run} from '../../../../runner.js';

// Behavior spec for a discrete minute combined with an hour step. The
// minute must fold into the enumerated clock times rather than being
// silently dropped: `5 */6` fires at :05 past each active hour, so it must
// not read "every six hours" (nor display ":00" times).

describe('Discrete minutes under an hour step:', function() {
  describe('single minute', function() {
    run([
      ['5 */6 * * *',
        'every day at 12:05 a.m., 6:05 a.m., 12:05 p.m., and 6:05 p.m.'],
      ['5 0-23/6 * * *',
        'every day at 12:05 a.m., 6:05 a.m., 12:05 p.m., and 6:05 p.m.'],
      // A bounded hour step has a distinct endpoint, so the minute leads its
      // own clause and the hour reads as a bounded cadence (not clock times).
      ['30 9-17/4 * * *',
        '30 minutes past the hour, every four hours from 9 a.m. through 5 p.m.']
    ]);
  });

  describe('minute list', function() {
    run([
      ['0,30 8-18/4 * * *',
        'every day at 8 a.m., 8:30 a.m., 12 p.m., 12:30 p.m., ' +
        '4 p.m., and 4:30 p.m.']
    ]);
  });

  describe('on the hour keeps the cadence phrasing', function() {
    run([
      ['0 */6 * * *', 'every six hours']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['5 */12 * * MON', 'every Monday at 12:05 a.m. and 12:05 p.m.']
    ]);
  });

  // A minute cadence under an hour STEP must not assert a generic every-hour
  // scope ("past the hour"): the hour step is the sole hour authority, so the
  // cadence binds to it. A "past the hour" alongside a stepped hour reads as
  // "every hour", conflicting with the step ("…past the hour, every four
  // hours"). This matches de/fi, which already bind to the step. The hour=*
  // case keeps "past the hour" (it is the only hour statement there), and an
  // hour WINDOW (9-17) keeps it too — "every hour from 9 a.m. through 5 p.m."
  // recovers the window unambiguously, with no every-hour-of-the-day conflict.
  describe('minute cadence binds to an hour step, no generic scope',
    function() {
      run([
        // Stride across an hour step: bind to the step, no "past the hour".
        ['2/7 0/4 * * *',
          'every seven minutes from 2 through 58 minutes, every four hours'],
        // Bare minute frequency under an hour step keeps its existing
        // "during every fourth hour" confinement (no anchor present).
        ['0/15 0/4 * * *', 'every 15 minutes during every fourth hour'],
        // Offset minute frequency under an hour step: drop the anchor, the
        // step scopes the hours.
        ['5/10 0/4 * * *',
          'every ten minutes from five minutes, during every fourth hour'],
        // An hour WINDOW keeps "past the hour": the window already names the
        // hours, so there is no every-hour-of-the-day conflict (matches de).
        ['2/7 9-17 * * *',
          'every seven minutes from 2 through 58 minutes past the hour ' +
          'from 9 a.m. through 5 p.m.'],
        ['5/10 1-6 * * *',
          'every ten minutes from five minutes past the hour ' +
          'from 1 a.m. through 6 a.m.'],
        ['0/15 9-17 * * *', 'every 15 minutes from 9 a.m. through 5 p.m.']
      ]);
    });
});
