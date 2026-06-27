import {run} from '../../../../runner.js';

// Behavior spec for capping clock-time enumeration. Up to six times the
// description enumerates concretely; beyond that it compacts. A folded
// single minute over a contiguous hour range reads with the hour-range
// frame ("every hour from 9 a.m. through 8 p.m. and at 10 p.m."), and a
// minute list leads with its own clause instead of cross-multiplying into
// a wall of times.

describe('Clock-time enumeration cap:', function() {
  describe('at or under the cap, times enumerate', function() {
    run([
      ['0,30 9,17 * * *',
        'every day at 9 a.m., 9:30 a.m., 5 p.m., and 5:30 p.m.'],
      ['0,30 8-18/4 * * *',
        'every day at 8 a.m., 8:30 a.m., 12 p.m., 12:30 p.m., ' +
        '4 p.m., and 4:30 p.m.']
    ]);
  });

  describe('a single minute folds into segment windows', function() {
    run([
      ['0 9-20,22 * * *',
        'every hour from 9 a.m. through 8 p.m. and at 10 p.m.'],
      ['30 9-20,22 * * *',
        'at 30 minutes past the hour from 9 a.m. through 8 p.m. ' +
        'and at 10:30 p.m.'],
      ['30 12,20-2 * * *',
        'at 30 minutes past the hour from 8 p.m. through 2 a.m. ' +
        'and at 12:30 p.m.']
    ]);
  });

  describe('a minute list leads with its own clause', function() {
    run([
      ['0,30 8-18/2 * * *',
        'at 0 and 30 minutes past the hour, ' +
        'every two hours from 8 a.m. through 6 p.m.'],
      ['0,15,30,45 9,17 * * MON',
        'at 0, 15, 30, and 45 minutes past the hour, ' +
        'at 9 a.m. and 5 p.m. on Mondays']
    ]);
  });

  describe('a folded second survives compaction', function() {
    run([
      ['15 30 9-20,22 * * *',
        'every day at 9:30:15 a.m. through 8:30:15 p.m. and at 10:30:15 p.m.'],
      ['15 0,30 8,10,12,14 * * *',
        'at 15 seconds past the minute, ' +
        'at 0 and 30 minutes past the hour, ' +
        'at 8 a.m., 10 a.m., 12 p.m., and 2 p.m.']
    ]);
  });

  describe('long hour-window phrases compact too', function() {
    run([
      ['*/15 9-20,22 * * *',
        'every 15 minutes during the ' +
        '9 a.m. through 8 p.m. and 10 p.m. hours'],
      ['0-30 9-20,22 * * *',
        'every minute from 0 through 30 past the hour during the ' +
        '9 a.m. through 8 p.m. and 10 p.m. hours']
    ]);
  });
});
