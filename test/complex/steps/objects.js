import {run} from '../../runner.js';

describe('Valid objects with steps:', function() {
  var tests = [
    [{second: '*/2'}, 'every two seconds'],
    [{second: '*/7'}, 'every seven seconds past the minute'],
    [{second: '*/30'}, 'every 30 seconds'],
    [{minute: '*/2'}, 'every two minutes'],
    [{minute: '0/2'}, 'every two minutes'],
    [{minute: '*/3'}, 'every three minutes'],
    [{minute: '2/3'}, 'every three minutes from two minutes past the hour'],
    [{minute: '*/4'}, 'every four minutes'],
    [{minute: '0/4'}, 'every four minutes'],
    [{minute: '*/5'}, 'every five minutes'],
    [{minute: '*/7'}, 'every seven minutes past the hour'],
    [{minute: '*/10'}, 'every ten minutes'],
    [{minute: '*/17'}, 'every 17 minutes past the hour'],
    [{minute: '*/20'}, 'every 20 minutes'],
    [{minute: '17/20'}, 'at 17, 37, and 57 minutes past the hour'],
    [{minute: '*/21'}, 'every 21 minutes past the hour'],
    [{minute: '*/30'}, 'every 30 minutes'],
    [{minute: '*/31'}, 'at zero and 31 minutes past the hour'],
    [{hour: '*/2'}, 'every two hours'],
    [{hour: '*/3'}, 'every three hours'],
    [{hour: '2/3'}, 'every three hours from 2 a.m.'],
    [{hour: '*/5'}, 'every five hours from midnight'],
    [{hour: '*/7'}, 'every seven hours from midnight'],
    [{hour: '*/8'}, 'every eight hours'],
    [{hour: '*/10'}, 'at midnight, 10 a.m., and 8 p.m.'],
    [{hour: '*/12'}, 'every 12 hours'],
    [{hour: '*/17'}, 'at midnight and 5 p.m.'],
    [{hour: '*/20'}, 'at midnight and 8 p.m.']
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
