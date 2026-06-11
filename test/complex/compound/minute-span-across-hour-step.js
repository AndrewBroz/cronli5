import {run} from '../../runner.js';

// Behavior spec for a minute wildcard or plain range combined with an hour
// step. The minute window must not collapse to the bare hour cadence: it
// leads, and the hour step trails as its own clause, mirroring the
// minute-step phrasing ("every 15 minutes, every two hours").

describe('Minute span across an hour step:', function() {
  describe('minute range', function() {
    run([
      ['0-30 */2 * * *',
        'every minute from zero through 30 past the hour, every two hours'],
      ['0-30 9-17/2 * * *',
        'every minute from zero through 30 past the hour, ' +
        'at 9:00 AM, 11:00 AM, 1:00 PM, 3:00 PM and 5:00 PM']
    ]);
  });

  describe('wildcard minute', function() {
    run([
      ['* */2 * * *', 'every minute, every two hours'],
      ['* */10 * * *', 'every minute, at 12:00 AM, 10:00 AM and 8:00 PM']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['0-30 */2 * * MON',
        'every minute from zero through 30 past the hour, ' +
        'every two hours on Monday']
    ]);
  });
});
