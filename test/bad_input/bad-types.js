import errors from './error-types.js';
import {error as run} from '../runner.js';

describe('Invalid types:', function() {
  run([undefined, null], errors.empty); // eslint-disable-line no-undefined

  describe('booleans', function() {
    run([true, false], errors.badType);
  });

  describe('integers', function() {
    run([
      0,
      1,
      -1,
      12345,
      123456,
      -1234,
      -12345,
      NaN,
      Infinity,
      -Infinity
    ], errors.badType);
  });

  describe('Date', function() {
    run([new Date()], errors.missingProps);
  });

  describe('Error', function() {
    run([new Error()], errors.missingProps);
  });
});
