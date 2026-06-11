import errors from './error-types.js';
import {error as run} from '../runner.js';

// Wrap-around ranges (e.g. `22-2`) are meaningful in cyclic fields and are
// accepted there (see test/complex/wrap-around.js). They remain invalid
// where the cycle metaphor breaks down: inside step bounds, where the
// enumeration would be empty, and in the year field, which does not wrap.

describe('Reversed ranges:', function() {
  run([
    '5-1/2 * * * *',
    '0 30-10/5 * * *',
    ['0 0 1 1 * 2030-2020', errors.invalidField, {years: true}]
  ], errors.invalidField);
});
