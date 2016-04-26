/* global describe it */
var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Simple valid cron-like objects:', function() {
  describe('5-part objects', function() {
    describe('{ "minute": "*" }', function() {
      var cronObject = {
        minute: '*',
      };

      it('should return a string', function() {
        expect(cronli5(cronObject)).to.be.a('string');
      });

      it('should not be an empty string', function() {
        expect(cronli5(cronObject)).to.not.be.empty;
      });
    });

    describe('{ "minute": "0", ... }', function() {
      var cronObject = {
        minute: '0',
      };

      it('should return a string', function() {
        expect(cronli5(cronObject)).to.be.a('string');
      });

      it('should not be an empty string', function() {
        expect(cronli5(cronObject)).to.not.be.empty;
      });
    });
  });

  describe('6-part objects', function() {
    describe('{ "second": "*" }', function() {
      var cronObject = {
        second: '*'
      };

      it('should return a string', function() {
        expect(cronli5(cronObject)).to.be.a('string');
      });

      it('should not be an empty string', function() {
        expect(cronli5(cronObject)).to.not.be.empty;
      });
    });

    describe('{ "second": "0", ... }', function() {
      var cronObject = {
        second: '*'
      };

      it('should return a string', function() {
        expect(cronli5(cronObject)).to.be.a('string');
      });

      it('should not be an empty string', function() {
        expect(cronli5(cronObject)).to.not.be.empty;
      });
    });
  });
});
