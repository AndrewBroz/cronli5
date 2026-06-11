import errors from './error-types.js';
import {error as run} from '../runner.js';

describe('Invalid arrays:', function() {
  run([
    [[], errors.empty ],
    [['*', '*', '*', '*', '*', '*', '*', '*'], errors.length]
  ]);

  var invalidFieldArrays = [
    ['*', '*', '*', '*', 8],
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
