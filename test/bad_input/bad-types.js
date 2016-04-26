/* global describe it */
var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Invalid types:', function() {
  describe('undefined', function() {
    it('should throw an error', function() {
      expect(cronli5).to.throw(Error);
    });

    it('should throw a "non-empty cron pattern" error', function() {
      expect(cronli5).to.throw(
        'cronli5 expects a non-empty cron pattern as the first argument.');
    });
  });

  describe('null', function() {
    it('should throw an error', function() {
      expect(cronli5.bind(null, null)).to.throw(Error);
    });

    it('should throw a "non-empty cron pattern" error', function() {
      expect(cronli5.bind(null, null)).to.throw(
        'cronli5 expects a non-empty cron pattern as the first argument.');
    });
  });

  describe('0', function() {
    it('should throw an error', function() {
      expect(cronli5.bind(null, 0)).to.throw(Error);
    });

    it('should throw a "non-empty cron pattern" error', function() {
      expect(cronli5.bind(null, 0)).to.throw(
        'cronli5 expects a non-empty cron pattern as the first argument.');
    });
  });

  describe('false', function() {
    it('should throw an error', function() {
      expect(cronli5.bind(null, false)).to.throw(Error);
    });

    it('should throw a "non-empty cron pattern" error', function() {
      expect(cronli5.bind(null, false)).to.throw(
        'cronli5 expects a non-empty cron pattern as the first argument.');
    });
  });
});
