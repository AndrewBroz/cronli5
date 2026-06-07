import {run} from '../../runner.js';

// Behavior spec for step (`/`) patterns whose start is a range, e.g.
// `1-5/2`. These are valid cron (the interval is applied within the bounded
// range) and must be enumerated, not silently mangled.

describe('Step patterns with a bounded (range) start:', function() {
  describe('minutes', function() {
    run([
      ['1-5/2 * * * *', 'at one, three and five minutes past the hour'],
      ['0-10/5 * * * *', 'at zero, five and ten minutes past the hour'],
      ['1-5/1 * * * *',
        'every minute from one through five past the hour']
    ]);
  });

  describe('seconds', function() {
    run([
      ['1-5/2 * * * * *', 'at one, three and five seconds past the minute']
    ]);
  });

  describe('hours', function() {
    run([
      ['0 9-17/2 * * *',
        'at 9:00 AM, 11:00 AM, 1:00 PM, 3:00 PM and 5:00 PM']
    ]);
  });
});
