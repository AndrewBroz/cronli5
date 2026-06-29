import {run} from '../../../../runner.js';

// Behavior spec for a minute wildcard or plain range combined with an hour
// step. A wildcard minute is the leading cadence and must be confined to the
// active hours: the "every other" stride reads "of every other hour", an
// offset-clean step "during every Nth hour starting at …", and a uneven step a
// bounded cadence pinning both endpoints — never juxtaposed with a second
// cadence. A plain range is a per-hour window whose recurrence trails as its
// own clause ("…, every two hours").
//
// Under an hour STEP the minute clause does not assert a generic "past the
// hour" (every-hour) scope: the step is the sole hour authority, so the cadence
// binds to it ("…, every two hours"), matching de/fi. A "past the hour" here
// would conflict with the step's recurrence.

describe('Minute span across an hour step:', function() {
  describe('minute range', function() {
    run([
      ['0-30 */2 * * *',
        'every minute from 0 through 30, every two hours'],
      ['0-30 9-17/2 * * *',
        'every minute from 0 through 30, ' +
        'every two hours from 9 a.m. through 5 p.m.']
    ]);
  });

  // A minute list under a clean hour stride keeps the cadence, exactly as the
  // wildcard and range forms do — the hour reads the same regardless of the
  // minute's shape, never enumerated into a wall of clock times.
  describe('minute list (keeps the cadence)', function() {
    run([
      ['5,30 1/2 * * *',
        'at 5 and 30 minutes, every two hours from 1 a.m.'],
      ['3/2 1/2 * * *',
        'every two minutes from 3 through 59 minutes, ' +
        'every two hours from 1 a.m.'],
      ['5,30 */2 * * *',
        'at 5 and 30 minutes, every two hours'],
      // A bounded stride has a distinct endpoint, so its hours read as a
      // bounded cadence rather than a wall of clock times.
      ['3/2 9-17/2 * * *',
        'every two minutes from 3 through 59 minutes past the hour, ' +
        'every two hours from 9 a.m. through 5 p.m.']
    ]);
  });

  describe('wildcard minute (confined to the active hours)', function() {
    run([
      ['* */2 * * *', 'every minute of every other hour'],
      ['* */3 * * *', 'every minute during every third hour'],
      ['* 1/2 * * *', 'every minute during every other hour starting at 1 a.m.'],
      // A uneven hour step has no clean "every Nth hour" wrap, so it reads as a
      // bounded cadence rather than listing its hours.
      ['* */10 * * *',
        'every minute, every ten hours from midnight through 8 p.m.']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['0-30 */2 * * MON',
        'every minute from 0 through 30, ' +
        'every two hours on Mondays']
    ]);
  });
});
