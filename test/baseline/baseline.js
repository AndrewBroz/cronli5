/* global describe it */
var cronli5 = require('../..');
var expect = require('chai').expect;

describe('Minimum requirements:', function() {
  it('should be a function', function() {
    expect(cronli5).to.be.a('function');
  });
});
