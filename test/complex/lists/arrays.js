var run = require('../../runner').run;

describe('Valid arrays with lists:', function() {
  describe('second lists', function() {
    run([
      [['0,30', '*', '*', '*', '*', '*'],
        'at zero and 30 seconds past the minute'],
      [['5,10,15', '*', '*', '*', '*', '*'],
        'at five, ten and 15 seconds past the minute'],
      [['0,15,30,45', '*', '*', '*', '*', '*'],
        'at zero, 15, 30 and 45 seconds past the minute']
    ]);
  });

  describe('minute lists', function() {
    run([
      [['0,30', '*', '*', '*', '*'], 'at zero and 30 minutes past the hour'],
      [['1,2,3', '*', '*', '*', '*'],
        'at one, two and three minutes past the hour'],
      [['0,15,30,45', '*', '*', '*', '*'],
        'at zero, 15, 30 and 45 minutes past the hour']
    ]);
  });

  describe('hour lists', function() {
    run([
      [['0', '9,17', '*', '*', '*'], 'every day at 9:00 AM and 5:00 PM'],
      [['0', '0,12', '*', '*', '*'], 'every day at 12:00 AM and 12:00 PM'],
      [['0', '9,12,17', '*', '*', '*'],
        'every day at 9:00 AM, 12:00 PM and 5:00 PM']
    ]);
  });

  describe('date lists', function() {
    run([
      [['0', '0', '1,15', '*', '*'], 'on the 1st and 15th at 12:00 AM'],
      [['0', '0', '1,15,31', '*', '*'],
        'on the 1st, 15th and 31st at 12:00 AM']
    ]);
  });

  describe('month lists', function() {
    run([
      [['0', '12', '*', '6,12', '*'],
        'every day in June and December at 12:00 PM'],
      [['0', '12', '*', '1,4,7,10', '*'],
        'every day in January, April, July and October at 12:00 PM'],
      [['0', '12', '*', 'JAN,JUL', '*'],
        'every day in January and July at 12:00 PM']
    ]);
  });

  describe('weekday lists', function() {
    run([
      [['0', '14', '*', '*', 'MON,WED,FRI'],
        'every Monday, Wednesday, and Friday at 2:00 PM'],
      [['0', '14', '*', '*', '1,3,5'],
        'every Monday, Wednesday, and Friday at 2:00 PM']
    ]);
  });
});
