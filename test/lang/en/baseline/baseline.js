import chai from 'chai';
import cronli5 from '../../../../src/cronli5.js';

const {expect} = chai;

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
