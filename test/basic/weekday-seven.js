import {run} from '../runner.js';

// Standard cron accepts `0-7` for the weekday field, where both `0`, and `7`
// mean Sunday. `cronli5` should treat `7` as Sunday, matching `0`.

describe('Weekday seven (Sunday):', function() {
  describe('single value', function() {
    run([
      ['0 0 * * 7', 'every Sunday at midnight'],
      ['0 0 * * 0', 'every Sunday at midnight']
    ]);
  });

  describe('within a range', function() {
    run([
      ['0 0 * * 5-7', 'every Friday through Sunday at midnight']
    ]);
  });
});
