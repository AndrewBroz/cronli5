import {run} from '../../runner.js';

describe('Valid objects with lists:', function() {
  var tests = [
    [{second: '0,30'}, 'at zero and 30 seconds past the minute'],
    [{second: '5,10,15'}, 'at five, ten and 15 seconds past the minute'],
    [
      {second: '0,15,30,45'},
      'at zero, 15, 30 and 45 seconds past the minute'
    ],
    [{minute: '0,30'}, 'at zero and 30 minutes past the hour'],
    [{minute: '1,2,3'}, 'at one, two and three minutes past the hour'],
    [{minute: '0,15,30,45'}, 'at zero, 15, 30 and 45 minutes past the hour'],
    [{hour: '9,17'}, 'every day at 9:00 AM and 5:00 PM'],
    [{hour: '0,12'}, 'every day at 12:00 AM and 12:00 PM'],
    [{hour: '9,12,17'}, 'every day at 9:00 AM, 12:00 PM and 5:00 PM'],
    [{hour: '0', date: '1,15'}, 'on the 1st and 15th at 12:00 AM'],
    [{hour: '0', date: '1,15,31'}, 'on the 1st, 15th and 31st at 12:00 AM'],
    [
      {hour: '12', month: '6,12'},
      'every day in June and December at 12:00 PM'
    ],
    [
      {hour: '12', month: '1,4,7,10'},
      'every day in January, April, July and October at 12:00 PM'
    ],
    [
      {hour: '12', month: 'JAN,JUL'},
      'every day in January and July at 12:00 PM'
    ],
    [
      {hour: '14', weekday: 'MON,WED,FRI'},
      'every Monday, Wednesday and Friday at 2:00 PM'
    ],
    [
      {hour: '14', weekday: '1,3,5'},
      'every Monday, Wednesday and Friday at 2:00 PM'
    ]
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
