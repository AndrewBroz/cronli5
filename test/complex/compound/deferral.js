import {run} from '../../runner.js';

// Behavior spec for patterns where a lower-order field folds into a more
// significant field rather than producing its own fragment. A single specific
// minute under a single specific hour folds into that hour's clock time
// instead of standing alone as "<n> minutes past the hour".
// (Seconds under a specific minute compose rather than defer; see
// seconds-within-minute.js. A minute span or range under specific hours
// composes too; see minute-span-in-hour.js and minute-range-across-hours.js.)

describe('Compound patterns that fold into a higher field:', function() {
  describe('a single minute folds into a specific hour', function() {
    run([
      ['30 9 * * *', 'every day at 9:30 a.m.'],
      ['15 14 * * *', 'every day at 2:15 p.m.']
    ]);
  });
});
