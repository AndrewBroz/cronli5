var explain = require('../..').explain;
var expect = require('chai').expect;
var errors = require('../error-types');

describe('Invalid strings:', function() {
  describe('""', function() {
    it('should throw an error', function() {
      expect(explain.bind(null, '')).to.throw(Error);
    });

    it('should throw a "non-empty cron pattern" error', function() {
      expect(explain.bind(null, '')).to.throw(errors.empty);
    });
  });
});
