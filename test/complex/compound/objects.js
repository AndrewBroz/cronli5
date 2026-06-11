import {run} from '../../runner.js';

describe('Valid compound objects:', function() {
  var tests = [
    [
      {minute: '30', hour: '9', weekday: 'MON-FRI'},
      'every Monday-Friday at 9:30 AM'
    ],
    [{hour: '22', weekday: '1-5'}, 'every Monday-Friday at 10:00 PM'],
    [{hour: '0', date: '25', month: '12'}, 'on December 25th at 12:00 AM'],
    [{minute: '15', hour: '14', date: '1'}, 'on the 1st at 2:15 PM'],
    [{hour: '0', date: '15'}, 'on the 15th at 12:00 AM'],
    [{minute: '0,30', hour: '9'}, 'every day at 9:00 AM and 9:30 AM'],
    [
      {minute: '0,30', hour: '9', weekday: 'MON-FRI'},
      'every Monday-Friday at 9:00 AM and 9:30 AM'
    ],
    [
      {minute: '0,30', hour: '9,17'},
      'every day at 9:00 AM, 9:30 AM, 5:00 PM and 5:30 PM'
    ],
    [
      {minute: '*/15', hour: '9-17'},
      'every 15 minutes from 9:00 AM through 5:45 PM'
    ],
    [
      {minute: '*/15', hour: '9-17', weekday: 'MON-FRI'},
      'every 15 minutes from 9:00 AM through 5:45 PM on Monday-Friday'
    ],
    [{hour: '9-17'}, 'every hour from 9:00 AM through 5:00 PM'],
    [
      {minute: '30', hour: '9-17'},
      'at 30 minutes past the hour from 9:00 AM through 5:30 PM'
    ],
    [
      {minute: '0,30', hour: '9-17'},
      'at zero and 30 minutes past the hour from 9:00 AM through 5:30 PM'
    ],
    [
      {minute: '15', hour: '9-17', weekday: 'MON-FRI'},
      'at 15 minutes past the hour from 9:00 AM through 5:15 PM ' +
        'on Monday-Friday'
    ],
    [{hour: '12', date: '1', month: '1'}, 'on January 1st at 12:00 PM'],
    [{hour: '12', date: '25', month: '12'}, 'on December 25th at 12:00 PM'],
    [{minute: '*', weekday: 'MON'}, 'every minute on Monday'],
    [{minute: '0', weekday: 'MON'}, 'every hour on Monday'],
    [{minute: '*', weekday: 'MON-FRI'}, 'every minute on Monday-Friday'],
    [{minute: '*', date: '13'}, 'every minute on the 13th'],
    [{minute: '0', date: '13'}, 'every hour on the 13th'],
    [{minute: '0', month: '1'}, 'every hour in January'],
    [{minute: '0', date: '13', month: '1'}, 'every hour on January 13th'],
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
