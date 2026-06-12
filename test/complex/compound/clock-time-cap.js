import {run} from '../../runner.js';

// Behavior spec for capping clock-time enumeration. Up to six times the
// description enumerates concretely; beyond that it compacts — a single
// minute folds into per-segment windows ("9:30 AM through 8:30 PM"), and a
// minute list leads with its own clause instead of cross-multiplying into
// a wall of times.

describe('Clock-time enumeration cap:', function() {
  describe('at or under the cap, times enumerate', function() {
    run([
      ['0,30 9,17 * * *',
        'every day at 9:00 AM, 9:30 AM, 5:00 PM and 5:30 PM'],
      ['0,30 8-18/4 * * *',
        'every day at 8:00 AM, 8:30 AM, 12:00 PM, 12:30 PM, ' +
        '4:00 PM and 4:30 PM']
    ]);
  });

  describe('a single minute folds into segment windows', function() {
    run([
      ['0 9-20,22 * * *',
        'every day at 9:00 AM through 8:00 PM and 10:00 PM'],
      ['30 9-20,22 * * *',
        'every day at 9:30 AM through 8:30 PM and 10:30 PM'],
      ['30 12,20-2 * * *',
        'every day at 12:30 PM and 8:30 PM through 2:30 AM']
    ]);
  });

  describe('a minute list leads with its own clause', function() {
    run([
      ['0,30 8-18/2 * * *',
        'at zero and 30 minutes past the hour, at 8:00 AM, 10:00 AM, ' +
        '12:00 PM, 2:00 PM, 4:00 PM and 6:00 PM'],
      ['0,15,30,45 9,17 * * MON',
        'at zero, 15, 30 and 45 minutes past the hour, ' +
        'at 9:00 AM and 5:00 PM on Monday']
    ]);
  });

  describe('a folded second survives compaction', function() {
    run([
      ['15 30 9-20,22 * * *',
        'every day at 9:30:15 AM through 8:30:15 PM and 10:30:15 PM'],
      ['15 0,30 8,10,12,14 * * *',
        'at 15 seconds past the minute, ' +
        'at zero and 30 minutes past the hour, ' +
        'at 8:00 AM, 10:00 AM, 12:00 PM and 2:00 PM']
    ]);
  });

  describe('long hour-window phrases compact too', function() {
    run([
      ['*/15 9-20,22 * * *',
        'every 15 minutes during the ' +
        '9:00 AM through 8:00 PM and 10:00 PM hours'],
      ['0-30 9-20,22 * * *',
        'every minute from zero through 30 past the hour, ' +
        'at 9:00 AM through 8:00 PM and 10:00 PM']
    ]);
  });
});
