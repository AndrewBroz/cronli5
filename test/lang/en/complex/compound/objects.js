import {run} from '../../../../runner.js';

describe('Valid compound objects:', function() {
  var tests = [
    [
      {minute: '30', hour: '9', weekday: 'MON-FRI'},
      'every Monday through Friday at 9:30 a.m.'
    ],
    [{hour: '22', weekday: '1-5'}, 'every Monday through Friday at 10 p.m.'],
    [{hour: '0', date: '25', month: '12'}, 'on December 25 at midnight'],
    [{minute: '15', hour: '14', date: '1'}, 'on the 1st at 2:15 p.m.'],
    [{hour: '0', date: '15'}, 'on the 15th at midnight'],
    [{minute: '0,30', hour: '9'}, 'every day at 9 a.m. and 9:30 a.m.'],
    [
      {minute: '0,30', hour: '9', weekday: 'MON-FRI'},
      'every Monday through Friday at 9 a.m. and 9:30 a.m.'
    ],
    [
      {minute: '0,30', hour: '9,17'},
      'every day at 9 a.m., 9:30 a.m., 5 p.m., and 5:30 p.m.'
    ],
    [
      {minute: '*/15', hour: '9-17'},
      'every 15 minutes from 9 a.m. through 5:45 p.m.'
    ],
    [
      {minute: '*/15', hour: '9-17', weekday: 'MON-FRI'},
      'every 15 minutes from 9 a.m. through 5:45 p.m. on Monday through Friday'
    ],
    [{hour: '9-17'}, 'every hour from 9 a.m. through 5 p.m.'],
    [
      {minute: '30', hour: '9-17'},
      'at 30 minutes past the hour from 9 a.m. through 5:30 p.m.'
    ],
    [
      {minute: '0,30', hour: '9-17'},
      'at 0 and 30 minutes past the hour from 9 a.m. through 5 p.m.'
    ],
    [
      {minute: '15', hour: '9-17', weekday: 'MON-FRI'},
      'at 15 minutes past the hour from 9 a.m. through 5:15 p.m. ' +
        'on Monday through Friday'
    ],
    [{hour: '12', date: '1', month: '1'}, 'on January 1 at noon'],
    [{hour: '12', date: '25', month: '12'}, 'on December 25 at noon'],
    [{minute: '*', weekday: 'MON'}, 'every minute on Monday'],
    [{minute: '0', weekday: 'MON'}, 'every hour on Monday'],
    [{minute: '*', weekday: 'MON-FRI'}, 'every minute on Monday through Friday'],
    [{minute: '*', date: '13'}, 'every minute on the 13th'],
    [{minute: '0', date: '13'}, 'every hour on the 13th'],
    [{minute: '0', month: '1'}, 'every hour in January'],
    [{minute: '0', date: '13', month: '1'}, 'every hour on January 13'],
    [{minute: '0', date: '1,15'}, 'every hour on the 1st and 15th']
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
