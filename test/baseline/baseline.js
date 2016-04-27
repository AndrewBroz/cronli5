var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Baseline properties:', function() {
  describe('cronli5', function() {
    it('should be an object', function() {
      expect(cronli5).to.be.an('object');
    });

    it('should have an `explain` property', function() {
      expect(cronli5).to.have.property('explain');
    });

    it('should have a `next` property', function() {
      expect(cronli5).to.have.property('next');
    });
  });

  describe('explain', function() {
    it('should be a function', function() {
      expect(cronli5.explain).to.be.a('function');
    });

    it('should have an arity of two', function() {
      expect(cronli5.explain).to.have.lengthOf(2);
    });
  });

  describe('next', function() {
    it('should be a function', function() {
      expect(cronli5.next).to.be.a('function');
    });

    it('should have an arity of two', function() {
      expect(cronli5.next).to.have.lengthOf(2);
    });
  });
});
