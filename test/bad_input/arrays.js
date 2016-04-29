var run = require('../runner').error;
var errors = require('./error-types');

describe('Invalid arrays:', function() {
  run([
    [[], errors.empty ],
    [['*', '*', '*', '*', '*', '*', '*'], errors.length]
  ]);

  var invalidFieldArrays = [
    ['*', '*', '*', '*', 7],
    [-33, '*', '*', '*', '*'],
    ['*', 'a', '*', '*', '*'],
    ['CAT', '*', '*', '*', '*', '*'],
    ['*', '*', 'hamburger', '*', '*'],
    ['*', '*', '*', '/', '*'],
    ['//', '*', '*', '*', '*'],
    ['*', '-', '*', '*', '*'],
    ['*', '*', '*', '*', '--'],
    [',', '*', '*', '*', '*'],
    ['*', '*', '*', '*', '*', ',,'],
    ['*', '*', '*', '*', {}],
    ['*', new Date(), '*', '*', '*', '*'],
    ['*', '*', '*', new Error('*'), '*', '*']
  ];

  run(wrap(invalidFieldArrays), errors.invalidField);
});

function wrap(arr) {
  return arr.map(function(el) {
    return [el];
  });
}
