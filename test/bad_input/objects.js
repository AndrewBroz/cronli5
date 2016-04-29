var runner = require('./error-runner');
var errors = require('./error-types');

describe('Invalid objects:', function() {
  runner.run([{}], errors.missingProps);

  var fieldNames = [
    'second',
    'minute',
    'hour',
    'date',
    'month',
    'weekday'
  ];

  fieldNames.forEach(checkInvalidFields);
});

function checkInvalidFields(fieldName) {
  var invalidFieldValues = [
    ':(', '&', '/', '//', ',', ',,', '-', '--', '60', 60, '-1', -1, NaN, 'cat',
    'BOB', '^', true, new Date(), new Error()
  ];

  describe('Invalid ' + fieldName + ' field', function() {
    invalidFieldValues.forEach(function(value) {
      var cronObject = cronFactory(fieldName, value);

      runner.run([cronObject], errors.invalidField);
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
