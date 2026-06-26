import {run} from '../../../../runner.js';

describe('Valid arrays with steps:', function() {
  describe('5-part arrays', function() {
    run([
      [['*/2', '*', '*', '*', '*'], 'every two minutes'],
      [['0/2', '*', '*', '*', '*'], 'every two minutes'],
      [['*/3', '*', '*', '*', '*'], 'every three minutes'],
      [['0/3', '*', '*', '*', '*'], 'every three minutes'],
      [
        ['2/3', '*', '*', '*', '*'],
        'every three minutes from two minutes past the hour'
      ],
      [['*/4', '*', '*', '*', '*'], 'every four minutes'],
      [['0/4', '*', '*', '*', '*'], 'every four minutes'],
      [['*/5', '*', '*', '*', '*'], 'every five minutes'],
      [['0/5', '*', '*', '*', '*'], 'every five minutes'],
      [
        ['*/7', '*', '*', '*', '*'],
        'every seven minutes from 0 through 56 minutes past the hour'
      ],
      [
        ['0/7', '*', '*', '*', '*'],
        'every seven minutes from 0 through 56 minutes past the hour'
      ],
      [['*/10', '*', '*', '*', '*'], 'every ten minutes'],
      [['*/17', '*', '*', '*', '*'], 'at 0, 17, 34, and 51 minutes past the hour'],
      [['*/20', '*', '*', '*', '*'], 'every 20 minutes'],
      [['17/20', '*', '*', '*', '*'], 'at 17, 37, and 57 minutes past the hour'],
      [['*/21', '*', '*', '*', '*'], 'at 0, 21, and 42 minutes past the hour'],
      [['*/30', '*', '*', '*', '*'], 'every 30 minutes'],
      [['*/31', '*', '*', '*', '*'], 'at 0 and 31 minutes past the hour'],
      [['0', '*/2', '*', '*', '*'], 'every two hours'],
      [['0', '*/3', '*', '*', '*'], 'every three hours'],
      [['0', '2/3', '*', '*', '*'], 'every three hours from 2 a.m.'],
      [
        ['0', '*/5', '*', '*', '*'],
        'every five hours from midnight through 8 p.m.'
      ],
      [
        ['0', '*/7', '*', '*', '*'],
        'every seven hours from midnight through 9 p.m.'
      ],
      [['0', '*/8', '*', '*', '*'], 'every eight hours'],
      [['0', '*/10', '*', '*', '*'],
        'every ten hours from midnight through 8 p.m.'],
      [['0', '*/12', '*', '*', '*'], 'every 12 hours'],
      [['0', '*/17', '*', '*', '*'],
        'every 17 hours from midnight through 5 p.m.'],
      [['0', '*/20', '*', '*', '*'],
        'every 20 hours from midnight through 8 p.m.']
    ]);
  });

  describe('6-part arrays', function() {
    run([
      [['*', '*', '*', '*', '*', '*'], 'every second'],
      [['*/2', '*', '*', '*', '*', '*'], 'every two seconds'],
      [
        ['*/7', '*', '*', '*', '*', '*'],
        'every seven seconds from 0 through 56 seconds past the minute'
      ],
      [['*/30', '*', '*', '*', '*', '*'], 'every 30 seconds'],
      [['0', '*/2', '*', '*', '*', '*'], 'every two minutes'],
      [['0', '*/4', '*', '*', '*', '*'], 'every four minutes'],
      [['0', '0', '*/3', '*', '*', '*'], 'every three hours'],
      [
        ['0', '0', '*/5', '*', '*', '*'],
        'every five hours from midnight through 8 p.m.'
      ]
    ]);
  });
});
