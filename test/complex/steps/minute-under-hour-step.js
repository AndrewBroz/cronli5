import {run} from '../../runner.js';

// Behavior spec for a discrete minute combined with an hour step. The
// minute must fold into the enumerated clock times rather than being
// silently dropped: `5 */6` fires at :05 past each active hour, so it must
// not read "every six hours" (nor display ":00" times).

describe('Discrete minutes under an hour step:', function() {
  describe('single minute', function() {
    run([
      ['5 */6 * * *',
        'every day at 12:05 AM, 6:05 AM, 12:05 PM and 6:05 PM'],
      ['5 0-23/6 * * *',
        'every day at 12:05 AM, 6:05 AM, 12:05 PM and 6:05 PM'],
      ['30 9-17/4 * * *', 'every day at 9:30 AM, 1:30 PM and 5:30 PM']
    ]);
  });

  describe('minute list', function() {
    run([
      ['0,30 8-18/4 * * *',
        'every day at 8:00 AM, 8:30 AM, 12:00 PM, 12:30 PM, ' +
        '4:00 PM and 4:30 PM']
    ]);
  });

  describe('on the hour keeps the cadence phrasing', function() {
    run([
      ['0 */6 * * *', 'every six hours']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['5 */12 * * MON', 'every Monday at 12:05 AM and 12:05 PM']
    ]);
  });
});
