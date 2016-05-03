var run = require('../runner').run;

describe('24-hour option:', function() {
  var options = {hh: true};

  run([
    ['0 12 * * *', 'every day at 12:00', options],
    ['0 0 * * *', 'every day at 00:00', options],
    ['0 7 * * *', 'every day at 07:00', options],
    ['0 13 * * FRI', 'every Friday at 13:00', options],
    ['0 2 * * MON-FRI', 'every Monday-Friday at 02:00', options],
    ['0 15 * * TUE', 'every Tuesday at 15:00', options],
    ['0 14 * * MON,WED,FRI', 'every Monday, Wednesday, and Friday at 14:00', options],
    ['0 23 * * THU', 'every Thursday at 23:00', options],
    ['0 6 * * SAT', 'every Saturday at 06:00', options],
  ]);
});