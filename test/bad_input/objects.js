var explain = require('../..').explain;
var expect = require('chai').expect;
var errors = require('../error-types');

describe('Invalid objects:', function() {
  describe('{}', function() {
    it('should throw an error', function() {
      expect(explain.bind(null, {})).to.throw(Error);
    });

    it('should throw an "expects a five or six-part cron" error', function() {
      expect(explain.bind(null, {})).to.throw(errors.length);
    });
  });
});