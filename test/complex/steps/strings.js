var run = require('../../runner').run;

describe('Simple valid strings:', function() {
  describe('5-part strings', function() {
    run([
      ['*/2 * * * *', 'every two minutes'],
      ['0/2 * * * *', 'every two minutes'],
      ['*/3 * * * *', 'every three minutes'],
      ['0/3 * * * *', 'every three minutes'],
      ['2/3 * * * *', 'every three minutes from two minutes past the hour'],
      ['*/4 * * * *', 'every four minutes past the hour'],
      ['0/4 * * * *', 'every four minutes past the hour'],
      ['*/5 * * * *', 'every five minutes'],
      ['0/5 * * * *', 'every five minutes'],
      ['*/7 * * * *', 'every seven minutes past the hour'],
      ['0/7 * * * *', 'every seven minutes past the hour'],
      ['*/10 * * * *', 'every ten minutes'],
      ['*/17 * * * *', 'every 17 minutes past the hour'],
      ['*/20 * * * *', 'every 20 minutes'],
      ['17/20 * * * *', 'at 17, 37 and 57 minutes past the hour'],
      ['*/21 * * * *', 'every 21 minutes past the hour'],
      ['*/30 * * * *', 'every 30 minutes'],
      ['*/31 * * * *', 'at zero and 31 minutes past the hour'],
      ['0 */2 * * *', 'every two hours'],
      ['0 */3 * * *', 'every three hours'],
      ['0 2/3 * * * *', 'every three hours from 2:00 AM'],
      ['0 */5 * * *', 'every five hours from midnight'],
      ['0 */7 * * *', 'every seven hours from midnight'],
      ['0 */8 * * *', 'every eight hours'],
      ['0 */10 * * *', 'at 10:00 AM and 8:00 PM'],
      ['0 */12 * * *', 'every 12 hours'],
      ['0 */17 * * *', 'at 12:00 AM and 5:00 PM'],
      ['0 */20 * * *', 'at 12:00 AM and 8:00 PM']
    ]);
  });

  describe('6-part strings', function() {
    run([
      ['* * * * * *', 'every second']
    ]);
  });
});
