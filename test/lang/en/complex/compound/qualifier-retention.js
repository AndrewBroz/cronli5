import {run} from '../../../../runner.js';

// Behavior spec for day-level qualifiers (weekday, date, month) on second-
// and minute-anchored descriptions. These paths previously dropped the
// qualifier entirely, describing a Monday-only job as if it ran every day.

describe('Day qualifiers on second and minute anchors:', function() {
  describe('minute anchors', function() {
    run([
      ['0 30 * * * MON', '30 minutes past the hour, every hour on Monday'],
      ['0-30 * * * MON',
        'every minute from 0 through 30 past the hour on Monday'],
      ['0,30 * * * MON', 'at 0 and 30 minutes past the hour on Monday']
    ]);
  });

  describe('second anchors', function() {
    run([
      ['15 * * * * MON', '15 seconds past the minute, every minute on Monday'],
      ['*/15 * * * * MON', 'every 15 seconds on Monday'],
      ['0-30 * * * * MON',
        'every second from 0 through 30 past the minute on Monday'],
      ['5,10 * * * * MON',
        'at five and ten seconds past the minute on Monday']
    ]);
  });

  describe('weekday combined with a month', function() {
    run([
      ['0 0 * 6 MON', 'every Monday in June at midnight'],
      ['*/15 * * 6 MON', 'every 15 minutes on Monday in June']
    ]);
  });

  describe('seconds within a minute', function() {
    run([
      ['15 30 * * * MON',
        '30 minutes and 15 seconds past the hour, every hour on Monday'],
      ['5,10 30 * * * MON',
        'at five and ten seconds past the minute, ' +
        '30 minutes past the hour, every hour on Monday']
    ]);
  });
});
