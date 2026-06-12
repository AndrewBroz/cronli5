import {run} from '../../../../runner.js';

// Behavior spec for a minute wildcard or plain range combined with a single
// specific hour. The pattern fires every minute within a window inside that
// hour, so it must read "every minute from H:MM through H:MM" rather than
// collapsing to a single clock time. Mirrors the minute-step phrasing.

describe('Minute span within a specific hour:', function() {
  describe('wildcard minute', function() {
    run([
      ['* 9 * * *', 'every minute from 9 a.m. through 9:59 a.m.'],
      ['* 0 * * *', 'every minute from midnight through 12:59 a.m.']
    ]);
  });

  describe('minute range', function() {
    run([
      ['0-29 9 * * *', 'every minute from 9 a.m. through 9:29 a.m.'],
      ['0-30 17 * * *', 'every minute from 5 p.m. through 5:30 p.m.']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['* 9 * * MON', 'every minute from 9 a.m. through 9:59 a.m. on Monday']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['* 9 * * *', 'every minute from 09:00 through 09:59', {ampm: false}],
      ['0-29 9 * * *',
        'every minute from 09:00 through 09:29', {ampm: false}]
    ]);
  });
});
