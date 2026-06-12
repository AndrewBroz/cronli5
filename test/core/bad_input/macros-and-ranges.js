import errors from './error-types.js';
import {error as run} from '../../runner.js';

describe('Unrecognized nickname macros:', function() {
  // Recognized macros are handled in test/basic/macros.js. Anything else
  // beginning with `@` is rejected outright.
  run([
    ['@frequently', 'does not recognize'],
    ['@', 'does not recognize']
  ]);
});

describe('Invalid ranges with wildcard bounds:', function() {
  run([
    '5-* * * * *',
    '*-5 * * * *'
  ], errors.invalidField);
});
