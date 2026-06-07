var run = require('../runner').run;

describe('Seconds option:', function() {
  var options = {seconds: true};

  run([
    ['* * * * *', 'every second', options],
    ['*/2 * * * *', 'every two seconds', options],
    ['*/5 * * * *', 'every five seconds', options],
    ['*/15 * * * *', 'every 15 seconds', options],
    ['*/30 * * * *', 'every 30 seconds', options],
    ['*/7 * * * *', 'every seven seconds past the minute', options],
    ['30 * * * *', '30 seconds past the minute, every minute', options],
    ['0 * * * *', 'every minute', options],
    ['0 30 * * *', '30 minutes past the hour, every hour', options],
    ['0 0 * * *', 'every hour', options],
    ['0 0 12 * *', 'every day at 12:00 PM', options]
  ]);
});
