import {run} from '../../runner.js';

// Behavior spec for a minute wildcard or plain range combined with an hour
// range. A wildcard fires every minute across the whole window (ending at :59
// of the final hour); a range fires every minute within that window each hour.

describe('Minute span across an hour range:', function() {
  describe('wildcard minute', function() {
    run([
      ['* 9-17 * * *', 'every minute from 9:00 AM through 5:59 PM'],
      ['* 0-5 * * *', 'every minute from 12:00 AM through 5:59 AM']
    ]);
  });

  describe('minute range', function() {
    run([
      ['0-30 9-17 * * *',
        'every minute from zero through 30 past the hour, ' +
        'from 9:00 AM through 5:00 PM']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['* 9-17 * * MON', 'every minute from 9:00 AM through 5:59 PM on Monday'],
      ['0-30 9-17 * * MON-FRI',
        'every minute from zero through 30 past the hour, ' +
        'from 9:00 AM through 5:00 PM on Monday-Friday']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['* 9-17 * * *', 'every minute from 09:00 through 17:59', {ampm: false}]
    ]);
  });
});
