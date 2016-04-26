/* global describe it */
var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Simple valid cron-like objects:', function() {
  describe('{ "second": "*" }', function() {
    var cronObject = {second: '*'};

    it('should return a string', function() {
      expect(cronli5(cronObject)).to.be.a('string');
    });

    it('should not be an empty string', function() {
      expect(cronli5(cronObject)).to.not.be.empty;
    });

    it('should be "every second"', function() {
      expect(cronli5(cronObject)).to.equal('every second');
    });
  });

  describe('{ "minute": "*" }', function() {
    var cronObject = {minute: '*'};

    it('should return a string', function() {
      expect(cronli5(cronObject)).to.be.a('string');
    });

    it('should not be an empty string', function() {
      expect(cronli5(cronObject)).to.not.be.empty;
    });

    it('should be "every minute"', function() {
      expect(cronli5(cronObject)).to.equal('every minute');
    });
  });

  describe('{ "hour": "*" }', function() {
    var cronObject = {hour: '*'};

    it('should return a string', function() {
      expect(cronli5(cronObject)).to.be.a('string');
    });

    it('should not be an empty string', function() {
      expect(cronli5(cronObject)).to.not.be.empty;
    });

    it('should be "every hour"', function() {
      expect(cronli5(cronObject)).to.equal('every hour');
    });
  });
});
