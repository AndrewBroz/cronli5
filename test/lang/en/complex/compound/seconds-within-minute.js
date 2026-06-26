import {run} from '../../../../runner.js';

// Behavior spec for a meaningful second combined with a single specific
// minute (hour open). The second must not be dropped: a single second folds
// into the minute anchor, and a list or range leads with its own clause,
// anchored to "<n> minutes past the hour, every hour". A STEP second is the
// leading cadence, so the minute reads as its confinement ("every 15 seconds
// during minute :30 of every hour").

describe('Seconds combined with a specific minute:', function() {
  describe('a single second folds into the minute', function() {
    run([
      ['15 30 * * * *', '30 minutes and 15 seconds past the hour, every hour'],
      ['1 1 * * * *', 'one minute and one second past the hour, every hour']
    ]);
  });

  describe('a second list or range leads with its own clause', function() {
    run([
      ['5,10 30 * * * *',
        'at 5 and 10 seconds past the minute, ' +
        '30 minutes past the hour, every hour'],
      ['0-30 30 * * * *',
        'every second from 0 through 30 past the minute, ' +
        '30 minutes past the hour, every hour']
    ]);
  });

  describe('a step second confines the minute as a cadence', function() {
    run([
      ['*/15 30 * * * *',
        'every 15 seconds during minute :30 of every hour']
    ]);
  });
});
