var run = require('../runner').run;

describe('Simple valid arrays:', function() {
  describe('5-part arrays', function() {
    run([
      [['*', '*', '*', '*', '*'], 'every minute' ],
      [['0', '*', '*', '*', '*'], 'every hour' ],
      [['1', '*', '*', '*', '*'], 'one minute past the hour, every hour' ],
      [['5', '*', '*', '*', '*'], 'five minutes past the hour, every hour'],
      [['10', '*', '*', '*', '*'], 'ten minutes past the hour, every hour' ],
      [['15', '*', '*', '*', '*'], '15 minutes past the hour, every hour' ],
      [['30', '*', '*', '*', '*'], '30 minutes past the hour, every hour' ],
    ]);
  });

  describe('6-part arrays', function() {
    run([
      [['*', '*', '*', '*', '*', '*'], 'every second' ],
      [['0', '*', '*', '*', '*', '*'], 'every minute' ],
      [['1', '*', '*', '*', '*', '*'], 'one second past the minute, every minute' ],
      [['5', '*', '*', '*', '*', '*'], 'five seconds past the minute, every minute'],
      [['10', '*', '*', '*', '*', '*'], 'ten seconds past the minute, every minute' ],
      [['15', '*', '*', '*', '*', '*'], '15 seconds past the minute, every minute' ],
      [['30', '*', '*', '*', '*', '*'], '30 seconds past the minute, every minute' ],
      [['0', '0', '*', '*', '*', '*'], 'every hour' ],
      [['0', '1', '*', '*', '*', '*'], 'one minute past the hour, every hour' ],
      [['0', '5', '*', '*', '*', '*'], 'five minutes past the hour, every hour' ],
      [['0', '10', '*', '*', '*', '*'], 'ten minutes past the hour, every hour' ],
      [['0', '15', '*', '*', '*', '*'], '15 minutes past the hour, every hour' ],
      [['0', '30', '*', '*', '*', '*'], '30 minutes past the hour, every hour' ],
    ]);
  });
});
