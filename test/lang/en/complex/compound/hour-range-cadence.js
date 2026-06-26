import {run} from '../../../../runner.js';

// An hour RANGE (or a list whose segments include a range) combined with a
// fixed minute and a meaningful second used to expand into a wall of clock
// times — the whole hour cross-product, restated H:MM:SS for every fire
// ("9:00:30 a.m., 10:00:30 a.m., …", nine times for 9-17). The hours fire at
// the same minute:second every hour across the range, so it now reads as the
// hour-range window: the second/minute lead clause, then "every hour from
// 9 a.m. through 5 p.m." (and any non-contiguous hour appended as "and at Z").
// This is the hour-RANGE analog of the hour-STEP cadence (hour-step-cadence.js).
// Renderer-only; the IR is unchanged. A pure single-value hour list (9,17) has
// no range to form a window and still enumerates.

describe('Hour range under a fixed minute and a second reads as a window:',
  function() {
    // Minute 0 folds into the lead: a single/list/range second is "past the
    // hour" (H:00:SS) followed by the window; a wildcard or sub-minute step
    // second is the whole minute-0 window ("for one minute").
    describe('minute 0 (folds into the hour)', function() {
      run([
        ['30 0 9-17 * * *',
          'at 30 seconds past the hour, every hour from 9 a.m. through 5 p.m.'],
        ['5 0 9-17 * * *',
          'at five seconds past the hour, every hour from 9 a.m. through ' +
          '5 p.m.'],
        ['5,30 0 9-17 * * *',
          'at 5 and 30 seconds past the hour, every hour from 9 a.m. ' +
          'through 5 p.m.'],
        ['0-10 0 9-17 * * *',
          'every second from zero through ten past the hour, every hour ' +
          'from 9 a.m. through 5 p.m.'],
        ['* 0 9-17 * * *',
          'every second for one minute during the 9 a.m. through 5 p.m. ' +
          'hours'],
        ['*/15 0 9-17 * * *',
          'every 15 seconds for one minute during the 9 a.m. through 5 p.m. ' +
          'hours']
      ]);
    });

    // A range inside a list: the contiguous span is a window, the
    // non-contiguous hour is appended as "and at Z".
    describe('a range inside a list (window + single)', function() {
      run([
        ['30 0 9-20,22 * * *',
          'at 30 seconds past the hour, every hour from 9 a.m. through ' +
          '8 p.m. and at 10 p.m.'],
        ['* 0 9-20,22 * * *',
          'every second for one minute during the 9 a.m. through 8 p.m. and ' +
          '10 p.m. hours']
      ]);
    });

    // A non-zero pinned minute is a real clock minute the existing window
    // form already speaks; only the minute-0 fold is reshaped here.
    describe('non-zero pinned minute is unchanged', function() {
      run([
        ['30 5 9-17 * * *',
          'at 30 seconds past the minute, at five minutes past the hour ' +
          'from 9 a.m. through 5:05 p.m.']
      ]);
    });

    // The window carries the trailing day qualifier.
    describe('with a day qualifier', function() {
      run([
        ['30 0 9-17 * * MON',
          'at 30 seconds past the hour, every hour from 9 a.m. through ' +
          '5 p.m. on Monday']
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
