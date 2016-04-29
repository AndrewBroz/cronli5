var run = require('../runner').error;
var errors = require('./error-types');

describe('Invalid types:', function() {
  run([undefined, null], errors.empty); // eslint-disable-line no-undefined

  describe('booleans', function() {
    run([true, false]);
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
    ]);
  });

  describe('Date', function() {
    run([new Date()]);
  });

  describe('Error', function() {
    run([new Error()]);
  });
});
