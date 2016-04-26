/* global describe it */
var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Invalid strings:', function() {
  describe('""', function() {
    it('should throw an error', function() {
      expect(cronli5.bind(null, '')).to.throw(Error);
    });

    it('should throw a "non-empty cron pattern" error', function() {
      expect(cronli5.bind(null, '')).to.throw(
        'cronli5 expects a non-empty cron pattern as the first argument.');
    });
  });
});
