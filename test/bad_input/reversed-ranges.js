import errors from './error-types.js';
import {error as run} from '../runner.js';

// Standard cron requires a range's start to be <= its end. Reversed ranges
// (e.g. `30-10`) are not valid cron and must be rejected rather than producing
// a nonsensical "from 30 through ten" description.

describe('Reversed ranges:', function() {
  run([
    '30-10 * * * *',
    '0 17-9 * * *',
    '0 0 20-5 * *',
    '0 0 1 12-3 *',
    '0 0 * * FRI-MON',
    '0 0 1 DEC-JAN *',
    '5-1/2 * * * *'
  ], errors.invalidField);
});
