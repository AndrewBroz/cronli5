/* global describe it */
var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Invalid objects:', function() {
  describe('{}', function() {
    it('should throw on the empty object', function() {
      expect(cronli5.bind(null, {})).to.throw(Error);
    });

    it('should throw an "expects a five or six-part cron" error', function() {
      expect(cronli5.bind(null, {})).to.throw(
        'cronli5 expects a five or six-part cron pattern.');
    });
  });
});