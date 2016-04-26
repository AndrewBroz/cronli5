/* global describe it */
var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Simple valid arrays:', function() {
  describe('5-part arrays', function() {
    describe('["*", "*", "*", "*", "*"]', function() {
      var cronArray = ['*', '*', '*', '*', '*'];

      it('should return a string', function() {
        expect(cronli5(cronArray)).to.be.a('string');
      });

      it('should not be an empty string', function() {
        expect(cronli5(cronArray)).to.not.be.empty;
      });
    });

    describe('["0", "*", "*", "*", "*"]', function() {
      var cronArray = ['0', '*', '*', '*', '*'];

      it('should return a string', function() {
        expect(cronli5(cronArray)).to.be.a('string');
      });

      it('should not be an empty string', function() {
        expect(cronli5(cronArray)).to.not.be.empty;
      });
    });
  });

  describe('6-part arrays', function() {
    describe('["*", "*", "*", "*", "*", "*"]', function() {
      var cronArray = ['*', '*', '*', '*', '*', '*'];

      it('should return a string', function() {
        expect(cronli5(cronArray)).to.be.a('string');
      });

      it('should not be an empty string', function() {
        expect(cronli5(cronArray)).to.not.be.empty;
      });
    });

    describe('["0", "*", "*", "*", "*", "*"]', function() {
      var cronArray = ['0', '*', '*', '*', '*', '*'];

      it('should return a string', function() {
        expect(cronli5(cronArray)).to.be.a('string');
      });

      it('should not be an empty string', function() {
        expect(cronli5(cronArray)).to.not.be.empty;
      });
    });
  });
});