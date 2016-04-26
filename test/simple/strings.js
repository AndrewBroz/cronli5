/* global describe it */
var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Simple valid strings:', function() {
  describe('5-part strings', function() {
    describe('"* * * * *"', function() {
      var cronString = '* * * * *';

      it('should return a string', function() {
        expect(cronli5(cronString)).to.be.a('string');
      });

      it('should not be an empty string', function() {
        expect(cronli5(cronString)).to.not.be.empty;
      });

      it('should be "every minute"', function() {
        expect(cronli5(cronString)).to.equal('every minute');
      });
    });

    describe('"0 * * * *"', function() {
      var cronString = '0 * * * *';

      it('should return a string', function() {
        expect(cronli5(cronString)).to.be.a('string');
      });

      it('should not be an empty string', function() {
        expect(cronli5(cronString)).to.not.be.empty;
      });

      it('should be "every hour"', function() {
        expect(cronli5(cronString)).to.equal('every hour');
      });
    });
  });

  describe('6-part strings', function() {
    describe('"* * * * * *"', function() {
      var cronString = '* * * * * *';

      it('should return a string', function() {
        expect(cronli5(cronString)).to.be.a('string');
      });

      it('should not be an empty string', function() {
        expect(cronli5(cronString)).to.not.be.empty;
      });
    });

    describe('"0 * * * * *"', function() {
      var cronString = '0 * * * * *';

      it('should return a string', function() {
        expect(cronli5(cronString)).to.be.a('string');
      });

      it('should not be an empty string', function() {
        expect(cronli5(cronString)).to.not.be.empty;
      });
    });
  });
});