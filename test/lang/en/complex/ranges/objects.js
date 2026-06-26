import {run} from '../../../../runner.js';

describe('Valid objects with ranges:', function() {
  var tests = [
    [{second: '0-30'}, 'every second from 0 through 30 past the minute'],
    [{second: '10-20'}, 'every second from 10 through 20 past the minute'],
    [{minute: '0-29'}, 'every minute from 0 through 29 past the hour'],
    [{minute: '1-5'}, 'every minute from 1 through 5 past the hour'],
    [{hour: '9-17'}, 'every hour from 9 a.m. until 6 p.m.'],
    [{hour: '0-5'}, 'every hour from midnight until 6 a.m.'],
    [{hour: '0', date: '1-15'}, 'on the 1st through 15th at midnight'],
    [{hour: '0', date: '10-20'}, 'on the 10th through 20th at midnight'],
    [
      {hour: '12', month: '6-8'},
      'every day in June through August at noon'
    ],
    [
      {hour: '12', month: 'JAN-MAR'},
      'every day in January through March at noon'
    ],
    [{hour: '9', weekday: 'MON-FRI'}, 'every Monday through Friday at 9 a.m.'],
    [{hour: '9', weekday: '1-5'}, 'every Monday through Friday at 9 a.m.']
  ];

  describe('Partial cron objects', function() {
    run(tests);
  });

  describe('Populated cron objects', function() {
    run(populateCronObjects(tests));
  });
});

function populateCronObjects(tests) {
  return tests.map(function(values) {
    return [
      populateCron(values[0]),
      values[1]
    ];
  });
}

function populateCron(obj) {
  return {
    second: obj.second || '0',
    minute: obj.minute || (obj.second ? '*' : '0'),
    hour: obj.hour || (obj.minute || obj.second ? '*' : '0'),
    date: obj.date || '*',
    month: obj.month || '*',
    weekday: obj.weekday || '*'
  };
}
