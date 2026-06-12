import {run} from '../../../../runner.js';

// Behavior spec for a meaningful second combined with a single specific
// minute (hour open). The second must not be dropped: a single second folds
// into the minute anchor, while a list, range, or step leads with its own
// clause. All anchor to "<n> minutes past the hour, every hour".

describe('Seconds combined with a specific minute:', function() {
  describe('a single second folds into the minute', function() {
    run([
      ['15 30 * * * *', '30 minutes and 15 seconds past the hour, every hour'],
      ['1 1 * * * *', 'one minute and one second past the hour, every hour']
    ]);
  });

  describe('a second list, range, or step leads with its own clause', function() {
    run([
      ['5,10 30 * * * *',
        'at five and ten seconds past the minute, ' +
        '30 minutes past the hour, every hour'],
      ['0-30 30 * * * *',
        'every second from zero through 30 past the minute, ' +
        '30 minutes past the hour, every hour'],
      ['*/15 30 * * * *',
        'every 15 seconds, 30 minutes past the hour, every hour']
    ]);
  });
});
