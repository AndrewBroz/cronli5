/* global describe it */
var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Baseline properties:', function() {
  it('should be a function', function() {
    expect(cronli5).to.be.a('function');
  });

  it('should have an arity of one', function() {
    expect(cronli5.length).to.equal(1);
  });
});
