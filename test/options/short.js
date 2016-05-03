var run = require('../runner').run;

describe('Short option:', function() {
  var options = {short: true};

  run([
    ['* * * * *', 'every minute', options],
    ['*/2 * * * *', 'every 2 minutes', options],
    ['*/5 * * * *', 'every 5 minutes', options],
    ['*/10 * * * *', 'every 10 minutes', options],
    ['*/15 * * * *', 'every 15 minutes', options],
    ['0 * * * *', 'every hour', options],
    ['0 */2 * * *', 'every 2 hours', options],
    ['0 */4 * * *', 'every 4 hours', options],
    ['0 */6 * * *', 'every 6 hours', options],
    ['0 */8 * * *', 'every 8 hours', options],
    ['0 */12 * * *', 'every 12 hours', options],
    ['0 13 * * FRI', 'every Fri at 1:00 PM', options],
    ['0 2 * * MON-FRI', 'every Mon-Fri at 2:00 AM', options],
    ['0 6 * * SAT', 'every Sat at 6:00 AM', options],
    ['0 13 * * 5', 'every Fri at 1:00 PM', options],
    ['0 2 * * 1-5', 'every Mon-Fri at 2:00 AM', options],
    ['0 14 * * 1,3,5', 'every Mon, Wed, and Fri at 2:00 PM', options],
    ['0 23 * * 4', 'every Thu at 11:00 PM', options],
    ['0 6 * * 6', 'every Sat at 6:00 AM', options],
  ]);
});
