var run = require('../runner').run;

describe('Simple valid cron-like objects:', function() {
  run([
    [{second: '*'}, 'every second'],
    [{second: '1'}, 'one second past the minute, every minute'],
    [{second: '5'}, 'five seconds past the minute, every minute'],
    [{second: '10'}, 'ten seconds past the minute, every minute'],
    [{second: '15'}, '15 seconds past the minute, every minute'],
    [{second: '30'}, '30 seconds past the minute, every minute'],
    [{minute: '*'}, 'every minute'],
    [{minute: '1'}, 'one minute past the hour, every hour'],
    [{minute: '5'}, 'five minutes past the hour, every hour'],
    [{minute: '10'}, 'ten minutes past the hour, every hour'],
    [{minute: '15'}, '15 minutes past the hour, every hour'],
    [{minute: '30'}, '30 minutes past the hour, every hour'],
    [{hour: '*'}, 'every hour']
  ]);
});
