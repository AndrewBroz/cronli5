import errors from './error-types.js';
import {error as run} from '../runner.js';

describe('Unsupported nickname macros:', function() {
  // Documents the current contract: shorthand "@" macros are not expanded and
  // are rejected as invalid field values. See README "Limitations".
  run([
    '@yearly',
    '@annually',
    '@monthly',
    '@weekly',
    '@daily',
    '@midnight',
    '@hourly',
    '@reboot'
  ], errors.invalidField);
});

describe('Invalid ranges with wildcard bounds:', function() {
  run([
    '5-* * * * *',
    '*-5 * * * *'
  ], errors.invalidField);
});
