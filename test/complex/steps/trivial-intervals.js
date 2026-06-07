import {run} from '../../runner.js';

// Behavior spec for step (`/`) patterns whose interval is 1. A "step of one"
// is equivalent to a wildcard for that field and reads as the bare frequency
// rather than "every one <unit>".

describe('Step patterns with a trivial (one) interval:', function() {
  describe('seconds', function() {
    run([
      ['*/1 * * * * *', 'every second']
    ]);
  });

  describe('minutes', function() {
    run([
      ['*/1 * * * *', 'every minute']
    ]);
  });

  describe('hours', function() {
    run([
      ['0 */1 * * *', 'every hour']
    ]);
  });
});
