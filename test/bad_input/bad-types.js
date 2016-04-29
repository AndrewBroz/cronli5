var runner = require('./error-runner');
var errors = require('./error-types');

describe('Invalid types:', function() {
  runner.run([undefined, null], errors.empty); // eslint-disable-line no-undefined

  describe('booleans', function() {
    runner.run([true, false]);
  });

  describe('integers', function() {
    runner.run([
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
    runner.run([new Date()]);
  });

  describe('Error', function() {
    runner.run([new Error()]);
  });
});
