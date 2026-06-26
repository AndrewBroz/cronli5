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
});
