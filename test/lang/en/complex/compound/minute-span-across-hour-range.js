import {run} from '../../../../runner.js';

// Behavior spec for a minute wildcard or plain range combined with an hour
// range. A wildcard fires every minute across the whole window, which the
// default dialect reads as an up-to-but-not-including window ("until 6 p.m."
// for 9-17); a range fires every minute within that window each hour.

describe('Minute span across an hour range:', function() {
  describe('wildcard minute', function() {
    run([
      ['* 9-17 * * *', 'every minute from 9 a.m. until 6 p.m.'],
      ['* 0-5 * * *', 'every minute from midnight until 6 a.m.']
    ]);
  });

  describe('minute range', function() {
    run([
      ['0-30 9-17 * * *',
        'every minute from 0 through 30 past the hour, ' +
        'from 9 a.m. until 6 p.m.']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['* 9-17 * * MON', 'every minute from 9 a.m. until 6 p.m. on Mondays'],
      ['0-30 9-17 * * MON-FRI',
        'every minute from 0 through 30 past the hour, ' +
        'from 9 a.m. until 6 p.m. on Monday through Friday']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['* 9-17 * * *', 'every minute from 09:00 until 18:00', {ampm: false}]
    ]);
  });
});
