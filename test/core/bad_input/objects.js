import errors from './error-types.js';
import {error as run} from '../../runner.js';

describe('Invalid objects:', function() {
  run([{}], errors.missingProps);

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

      run([cronObject], errors.invalidField);
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
