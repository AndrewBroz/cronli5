import {run} from '../../../../runner.js';

// An hour RANGE (or a list whose segments include a range) combined with a
// fixed minute and a meaningful second used to expand into a wall of clock
// times — the whole hour cross-product, restated H:MM:SS for every fire
// ("9:00:30 a.m., 10:00:30 a.m., …", nine times for 9-17). The hours fire at
// the same minute:second every hour across the range, so it now reads as the
// hour-range window: the second/minute lead clause, then "every hour from
// 9 a.m. until 6 p.m." (and any non-contiguous hour appended as "and at Z").
// This is the hour-RANGE analog of the hour-STEP cadence (hour-step-cadence.js).
// Renderer-only; the IR is unchanged. A pure single-value hour list (9,17) has
// no range to form a window and still enumerates.

describe('Hour range under a fixed minute and a second reads as a window:',
  function() {
    // Minute 0 folds into the lead: a single/list/range second is "past the
    // hour" (H:00:SS) followed by the window; a wildcard or sub-minute step
    // second is the leading cadence, with the pinned minute and the hour range
    // as confinements ("during minute :00 from 9 a.m. until 6 p.m.").
    describe('minute 0 (folds into the hour)', function() {
      run([
        ['30 0 9-17 * * *',
          'at 30 seconds past the hour, every hour from 9 a.m. until 6 p.m.'],
        ['5 0 9-17 * * *',
          'at five seconds past the hour, every hour from 9 a.m. until ' +
          '6 p.m.'],
        ['5,30 0 9-17 * * *',
          'at 5 and 30 seconds past the hour, every hour from 9 a.m. ' +
          'until 6 p.m.'],
        ['0-10 0 9-17 * * *',
          'every second from zero through ten past the hour, every hour ' +
          'from 9 a.m. until 6 p.m.'],
        ['* 0 9-17 * * *',
          'every second during minute :00 from 9 a.m. until 6 p.m.'],
        ['*/15 0 9-17 * * *',
          'every 15 seconds during minute :00 from 9 a.m. until 6 p.m.']
      ]);
    });

    // A range inside a list: the contiguous span is a window, the
    // non-contiguous hour is appended as "and at Z".
    describe('a range inside a list (window + single)', function() {
      run([
        ['30 0 9-20,22 * * *',
          'at 30 seconds past the hour, every hour from 9 a.m. until ' +
          '9 p.m. and at 10 p.m.'],
        ['* 0 9-20,22 * * *',
          'every second during minute :00 during the 9 a.m. through 8 p.m. ' +
          'and 10 p.m. hours']
      ]);
    });

    // A non-zero pinned minute is stated in the lead clause ("at five minutes
    // past the hour"), so the window does not fold the minute into its close —
    // the until-window names the top of the hour after the last ("until
    // 6 p.m."), never a closing :05 that would read as a span contradicting the
    // minute clause.
    describe('non-zero pinned minute leads, window names the boundary',
      function() {
        run([
          ['30 5 9-17 * * *',
            'at 30 seconds past the minute, at five minutes past the hour ' +
            'from 9 a.m. until 6 p.m.']
        ]);
      });

    // The window carries the trailing day qualifier.
    describe('with a day qualifier', function() {
      run([
        ['30 0 9-17 * * MON',
          'at 30 seconds past the hour, every hour from 9 a.m. until ' +
          '6 p.m. on Mondays']
      ]);
    });

    // Guard: a pure single-value hour list (no range) has no window to form
    // and still enumerates.
    describe('guard — a pure list still enumerates', function() {
      run([
        ['30 0 9,17 * * *',
          'every day at 9:00:30 a.m. and 5:00:30 p.m.']
      ]);
    });
  });
