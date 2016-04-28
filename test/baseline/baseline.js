var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Baseline properties:', function() {
  describe('cronli5', function() {
    it('should be a function', function() {
      expect(cronli5).to.be.a('function');
    });

    it('should have an arity of two', function() {
      expect(cronli5).to.have.lengthOf(2);
    });
  });
});
