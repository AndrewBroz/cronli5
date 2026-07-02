import {run} from '../../../../runner.js';

describe('Valid strings with steps:', function() {
  describe('5-part strings', function() {
    run([
      ['*/2 * * * *', 'every two minutes'],
      ['0/2 * * * *', 'every two minutes'],
      ['*/3 * * * *', 'every three minutes'],
      ['0/3 * * * *', 'every three minutes'],
      ['2/3 * * * *', 'every three minutes from two minutes past the hour'],
      ['*/4 * * * *', 'every four minutes'],
      ['0/4 * * * *', 'every four minutes'],
      ['*/5 * * * *', 'every five minutes'],
      ['0/5 * * * *', 'every five minutes'],
      ['*/7 * * * *',
        'every seven minutes from 0 through 56 minutes past the hour'],
      ['0/7 * * * *',
        'every seven minutes from 0 through 56 minutes past the hour'],
      ['*/10 * * * *', 'every ten minutes'],
      // An offset step (start >= interval) and an uneven step (interval does
      // not tile the cycle) both fire a non-uniform bounded set; named with
      // its interval and explicit endpoints rather than enumerated.
      ['3/2 * * * *',
        'every two minutes from 3 through 59 minutes past the hour'],
      ['7/9 * * * *',
        'every nine minutes from 7 through 52 minutes past the hour'],
      // Below the compaction threshold (fewer than five fires): still listed.
      ['*/17 * * * *', 'at 0, 17, 34, and 51 minutes past the hour'],
      ['*/20 * * * *', 'every 20 minutes'],
      ['17/20 * * * *', 'at 17, 37, and 57 minutes past the hour'],
      ['*/21 * * * *', 'at 0, 21, and 42 minutes past the hour'],
      ['*/30 * * * *', 'every 30 minutes'],
      ['*/31 * * * *', 'at 0 and 31 minutes past the hour'],
      ['0 */2 * * *', 'every two hours'],
      ['0 */3 * * *', 'every three hours'],
      ['0 2/3 * * *', 'every three hours from 2 a.m.'],
      // An uneven hour step (24 not divisible by the step) reads as a bounded
      // cadence, not a wall of clock times: the cadence names the interval and
      // pins both clock-time endpoints, since the set does not wrap cleanly.
      ['0 */5 * * *',
        'every five hours from midnight through 8 p.m.'],
      ['0 */7 * * *', 'every seven hours from midnight through 9 p.m.'],
      ['0 */8 * * *', 'every eight hours'],
      // A hand-written list that tiles the day from the top (0,8,16 = */8)
      // wraps cleanly with no endpoint, so it stays a short enumeration.
      ['0 0,8,16 * * *', 'every day at 12 a.m., 8 a.m., and 4 p.m.'],
      ['0 */10 * * *', 'every ten hours from midnight through 8 p.m.'],
      ['0 */12 * * *', 'every 12 hours'],
      ['0 */17 * * *', 'every 17 hours from midnight through 5 p.m.'],
      ['0 */20 * * *', 'every 20 hours from midnight through 8 p.m.'],
      // A uniform offset hour stride (interval divides 24, start within the
      // first interval) keeps its cadence form; a short one lists its fires.
      ['0 8/12 * * *', 'at 8 a.m. and 8 p.m.'],
      // An hour step past the clock-time cap is a cadence, not a wall of
      // times: the pinned minute leads, then the hour cadence.
      ['5 */2 * * *', 'five minutes past the hour, every two hours'],
      // A uniform step segment beside a range in a folded clock-time set: the
      // range is a window, the step contributes its fires. The step's 10 a.m.
      // fire falls inside the 8-10 window, so it is not restated in the list.
      ['5 8-10,2/4 * * *',
        'at five minutes past the hour from 8 a.m. through 10 a.m. ' +
        'and at 2:05 a.m., 6:05 a.m., 2:05 p.m., 6:05 p.m., ' +
        'and 10:05 p.m.']
    ]);
  });

  describe('6-part strings', function() {
    run([
      ['* * * * * *', 'every second'],
      ['*/2 * * * * *', 'every two seconds'],
      ['*/7 * * * * *',
        'every seven seconds from 0 through 56 seconds past the minute'],
      ['*/30 * * * * *', 'every 30 seconds'],
      ['0 */2 * * * *', 'every two minutes'],
      ['0 */4 * * * *', 'every four minutes'],
      ['0 0 */3 * * *', 'every three hours'],
      ['0 0 */5 * * *',
        'every five hours from midnight through 8 p.m.']
    ]);
  });

  // A cadence hour (every Nth hour) carrying a pinned minute or a sub-minute
  // second. A minute past the hour names the cadence after itself; a
  // sub-minute second adds the "for one minute" duration on each fired hour.
  describe('cadence hour with a leading minute or second', function() {
    run([
      ['5 */3 * * *', 'five minutes past the hour, every three hours'],
      ['*/15 0 */3 * * *',
        'every 15 seconds for one minute during every third hour'],
      // An offset-form second step (`0/10`) leads the SAME confinement the
      // wildcard / clean-step second does: under `*/2` the dedicated "of every
      // other hour" idiom pins the minute outright ("during minute :00"),
      // matching `* 0 */2` and `*/10 0 */2`, never the juxtaposed duration
      // frame the offset form once used.
      ['0/10 0 */2 * * *',
        'every ten seconds during minute 0 of every other hour'],
      ['0 */11 * * *',
        'every 11 hours from midnight through 10 p.m.'],
      // A sub-minute second at minute 0 over a wide bounded hour stride confines
      // the same way the wildcard second does ("during minute :00 during the
      // … hours"), the hour list naming each fired hour.
      ['0/10 0 */13 * * *',
        'every ten seconds during minute 0 ' +
        'during the 12 a.m. and 1 p.m. hours']
    ]);
  });
});
