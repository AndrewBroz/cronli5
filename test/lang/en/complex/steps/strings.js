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
      ['0 */5 * * *',
        'every day at 12 a.m., 5 a.m., 10 a.m., 3 p.m., and 8 p.m.'],
      ['0 */7 * * *', 'every day at 12 a.m., 7 a.m., 2 p.m., and 9 p.m.'],
      ['0 */8 * * *', 'every eight hours'],
      ['0 */10 * * *', 'every day at 12 a.m., 10 a.m., and 8 p.m.'],
      ['0 */12 * * *', 'every 12 hours'],
      ['0 */17 * * *', 'every day at 12 a.m. and 5 p.m.'],
      ['0 */20 * * *', 'every day at 12 a.m. and 8 p.m.'],
      // A uniform offset hour stride (interval divides 24, start within the
      // first interval) keeps its cadence form; a short one lists its fires.
      ['0 8/12 * * *', 'at 8 a.m. and 8 p.m.'],
      ['5 */2 * * *',
        'every day at 12:05 a.m., 2:05 a.m., 4:05 a.m., 6:05 a.m., ' +
        '8:05 a.m., 10:05 a.m., 12:05 p.m., 2:05 p.m., 4:05 p.m., ' +
        '6:05 p.m., 8:05 p.m., and 10:05 p.m.'],
      // A uniform step segment beside a range in a folded clock-time set: the
      // range is a window, the step contributes its fires.
      ['5 8-10,2/4 * * *',
        'at five minutes past the hour from 8 a.m. through 10:05 a.m. and ' +
        'at 2:05 a.m., 6:05 a.m., 10:05 a.m., 2:05 p.m., 6:05 p.m., and ' +
        '10:05 p.m.']
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
        'every day at 12 a.m., 5 a.m., 10 a.m., 3 p.m., and 8 p.m.']
    ]);
  });
});
