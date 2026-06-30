import {run} from '../../../../runner.js';

// An hour STEP (or an arithmetic-progression hour list) combined with a fixed
// minute and a meaningful second used to expand into a wall of clock times —
// the whole hour cross-product, restated H:MM:SS for every fire ("12:00:30
// a.m., 2:00:30 a.m., …", twelve times for */2). The hour is a cadence, so it
// now reads as one: the second/minute lead clause, then the hour cadence
// ("every two hours", "every six hours from 2 a.m.", "every two hours from
// 9 a.m. through 5 p.m."). Renderer-only; the IR is unchanged. Irregular hour
// lists (9,17) are not a stride and still enumerate (see clock-time-cap and
// seconds-compose); a single hour, an hour range, and the bare hour-step
// confinement (0 0 */2) are unchanged.

describe('Hour step under a fixed minute and a second reads as a cadence:',
  function() {
    // Minute 0 folds into the lead: a single/list/range second is "past the
    // hour" (H:00:SS) followed by the hour cadence; a wildcard or sub-minute
    // step second is the leading cadence, with the pinned minute and clean hour
    // stride as confinements ("during minute :00 of every other hour").
    describe('minute 0 (folds into the hour)', function() {
      run([
        ['30 0 */2 * * *',
          'at 30 seconds past the hour, every two hours'],
        ['5 0 */2 * * *',
          'at five seconds past the hour, every two hours'],
        ['* 0 */2 * * *',
          'every second during minute 0 of every other hour'],
        ['*/15 0 */2 * * *',
          'every 15 seconds during minute 0 of every other hour'],
        ['5,30 0 */2 * * *',
          'at 5 and 30 seconds past the hour, every two hours'],
        ['0-10 0 */2 * * *',
          'every second from 0 through 10 past the hour, every two hours']
      ]);
    });

    // An offset clean stride names its start; a bounded or non-tiling stride
    // pins both clock-time endpoints so the bounded set reads unambiguously.
    describe('offset, bounded, and non-tiling hour strides', function() {
      run([
        ['30 0 2/6 * * *',
          'at 30 seconds past the hour, every six hours from 2 a.m.'],
        ['30 0 */5 * * *',
          'at 30 seconds past the hour, ' +
          'every five hours from midnight through 8 p.m.'],
        ['30 0 9-17/2 * * *',
          'at 30 seconds past the hour, ' +
          'every two hours from 9 a.m. through 5 p.m.']
      ]);
    });

    // A bounded step that starts at midnight (start 0) but stops short of the
    // day's last tile is still a bounded set, not the open `*/n`: it pins both
    // endpoints, the same as a `9-17/2`. (0-20/2 fires 0,2,…,20 — never 22, so
    // it must not read as the all-day "every two hours", which would recover as
    // `*/2`. 0-22/2 ≡ `*/2` and stays bare; see the guards below.)
    describe('bounded step from midnight (start 0, stops short)', function() {
      run([
        ['23 0-20/2 * * *',
          '23 minutes past the hour, ' +
          'every two hours from midnight through 8 p.m.'],
        ['30 0-20/3 * * *',
          '30 minutes past the hour, ' +
          'every three hours from midnight through 6 p.m.']
      ]);
    });

    // A non-zero pinned minute under a seconds-cadence lead is the minute
    // confinement ("during minute :05"); under a clock-point second it is "M
    // minutes past the hour" after the second's own clause, then the hour
    // cadence.
    describe('non-zero pinned minute', function() {
      run([
        ['* 5 */2 * * *',
          'every second during minute 5 of every other hour'],
        ['5,30 5 */2 * * *',
          'at 5 and 30 seconds past the minute, ' +
          'five minutes past the hour, every two hours'],
        ['30 5 */2 * * *',
          'at 30 seconds past the minute, ' +
          'five minutes past the hour, every two hours']
      ]);
    });

    // The hour cadence carries the trailing day qualifier, like the bare
    // hour-step form ("every two hours on the 1st").
    describe('with a day qualifier', function() {
      run([
        ['30 0 */2 1 * *',
          'at 30 seconds past the hour, every two hours on the 1st'],
        ['30 0 */2 * * MON',
          'at 30 seconds past the hour, every two hours on Mondays']
      ]);
    });

    // Guards: an irregular hour list is not a stride and still enumerates;
    // the bare hour-step confinement (no second, minute 0) is unchanged. An
    // open `*/n` and a full-field-equivalent bounded step (0-22/2 ≡ `*/2`)
    // ARE the all-day set, so they stay bare — pinning a bound would be wrong.
    describe('guards — not a stride, or no second', function() {
      run([
        ['30 0 9,17 * * *',
          'every day at 9:00:30 a.m. and 5:00:30 p.m.'],
        ['0 0 */2 * * *', 'every two hours'],
        ['23 */2 * * *', '23 minutes past the hour, every two hours'],
        ['23 0-22/2 * * *', '23 minutes past the hour, every two hours'],
        ['23 0-23/2 * * *', '23 minutes past the hour, every two hours']
      ]);
    });
  });
