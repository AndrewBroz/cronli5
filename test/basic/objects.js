var run = require('../runner').run;

describe('Common objects:', function() {
  var tests = [
    [{second: '*'}, 'every second'],
    [{second: '*/2'}, 'every two seconds'],
    [{second: '*/5'}, 'every five seconds'],
    [{second: '*/10'}, 'every ten seconds'],
    [{second: '*/15'}, 'every 15 seconds'],
    [{second: '*/20'}, 'every 20 seconds'],
    [{second: '*/30'}, 'every 30 seconds'],
    [{minute: '*'}, 'every minute'],
    [{minute: '*/2'}, 'every two minutes'],
    [{minute: '*/5'}, 'every five minutes'],
    [{minute: '*/10'}, 'every ten minutes'],
    [{minute: '*/15'}, 'every 15 minutes'],
    [{minute: '*/20'}, 'every 20 minutes'],
    [{minute: '*/30'}, 'every 30 minutes'],
    [{hour: '*'}, 'every hour'],
    [{hour: '*/2'}, 'every two hours'],
    [{hour: '*/4'}, 'every four hours'],
    [{hour: '*/6'}, 'every six hours'],
    [{hour: '*/8'}, 'every eight hours'],
    [{hour: '*/12'}, 'every 12 hours'],
    [{hour: '12'}, 'every day at 12:00 PM'],
    [{hour: '0'}, 'every day at 12:00 AM'],
    [{hour: '7'}, 'every day at 7:00 AM'],
    [{hour: '13', weekday: 'FRI'}, 'every Friday at 1:00 PM'],
    [{hour: '2', weekday: 'MON-FRI'}, 'every Monday-Friday at 2:00 AM'],
    [{hour: '15', weekday: 'TUE'}, 'every Tuesday at 3:00 PM'],
    [{hour: '14', weekday: 'MON,WED,FRI'}, 'every Monday, Wednesday, and Friday at 2:00 PM'],
    [{hour: '23', weekday: 'THU'}, 'every Thursday at 11:00 PM'],
    [{hour: '6', weekday: 'SAT'}, 'every Saturday at 6:00 AM'],
    [{hour: '13', weekday: '5'}, 'every Friday at 1:00 PM'],
    [{hour: '2', weekday: '1-5'}, 'every Monday-Friday at 2:00 AM'],
    [{hour: '15', weekday: '2'}, 'every Tuesday at 3:00 PM'],
    [{hour: '14', weekday: '1,3,5'}, 'every Monday, Wednesday, and Friday at 2:00 PM'],
    [{hour: '23', weekday: '4'}, 'every Thursday at 11:00 PM'],
    [{hour: '6', weekday: '6'}, 'every Saturday at 6:00 AM'],
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
      values[1],
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
    weekday: obj.weekday || '*',
  };
}

