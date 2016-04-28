var cronli5 = require('../..');
var expect = require('chai').expect;
var errors = require('../error-types');

describe('Invalid objects:', function() {
  throws({}, errors.missingProps);

  invalidFields('second');

  invalidFields('minute');

  invalidFields('hour');

  invalidFields('date');

  invalidFields('month');

  invalidFields('weekday');
});

function invalidFields(fieldName) {
  var invalidFieldValues = [
    ':(', '&', '/', '//', ',', ',,', '-', '--', '60', 60, '-1', -1, NaN, 'cat',
    'BOB', '^', true, new Date(), new Error()
  ];

  describe('Invalid ' + fieldName + ' field', function() {
    invalidFieldValues.forEach(function(value) {
      var cronObject = cronFactory(fieldName, value);

      throws(cronObject, errors.invalidField);
    });
  });
}

function throws(badObject, errorText) {
  describe(JSON.stringify(badObject), function() {
    it('should throw an error', function() {
      expect(cronli5.bind(null, badObject)).to.throw(Error);
    });

    it('should throw "' + errorText + '".', function() {
      expect(cronli5.bind(null, badObject)).to.throw(errorText);
    });
  });
}

function cronFactory(fieldName, value) {
  var cronObject = {
    second: '*',
    minute: '*',
    hour: '*',
    date: '*',
    month: '*',
    weekday: '*'
  };

  cronObject[fieldName] = value;

  return cronObject;
}
