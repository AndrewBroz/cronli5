import {run} from '../../../runner.js';

// Behavior spec for seven-field (Quartz-style) patterns: `second minute
// hour date month weekday year`. Seven fields are unambiguous, so no
// `years` option is needed (the option remains as the six-field
// disambiguator). An explicitly supplied year is always described.

describe('Seven-field patterns:', function() {
  describe('strings', function() {
    run([
      ['0 30 9 * * * 2030', 'every day at 9:30 a.m. in 2030'],
      ['0 0 12 1 1 * 2030', 'on January 1, 2030 at noon'],
      ['0 0 12 25 12 * 2030-2035',
        'on December 25 at noon in 2030-2035'],
      ['0 0 12 1 1 * */2', 'on January 1 at noon every two years'],
      ['*/15 30 9 * * * 2030',
        'every 15 seconds of 9:30 a.m., every day in 2030'],
      ['0 30 9 * * * *', 'every day at 9:30 a.m.']
    ]);
  });

  describe('arrays', function() {
    run([
      [['0', '30', '9', '*', '*', '*', '2030'],
        'every day at 9:30 a.m. in 2030']
    ]);
  });

  describe('objects with a year', function() {
    run([
      [{minute: '30', hour: '9', year: '2030'},
        'every day at 9:30 a.m. in 2030'],
      [{minute: '30', hour: '9', year: '*'}, 'every day at 9:30 a.m.']
    ]);
  });

  describe('the years option still disambiguates six fields', function() {
    run([
      ['0 9 * * * 2030', 'every day at 9 a.m. in 2030', {years: true}],
      ['30 9 * * * *', 'nine minutes and 30 seconds past the hour, ' +
        'every hour']
    ]);
  });

  // A minute of 0 under a sub-minute second is a real restriction: it must be
  // stated, not absorbed into an hourly idiom ("every hour" / "every two
  // hours" / a 9-through-17 range) that silently drops it.
  describe('minute 0 stated under a sub-minute second', function() {
    run([
      ['* 0 * * * *', 'every second, zero minutes past the hour, every hour'],
      ['* 0 * * * * 2013',
        'every second, zero minutes past the hour, every hour in 2013'],
      ['* 0 9-17 * * *',
        'every second for one minute during the 9 a.m. through 5 p.m. hours']
    ]);
  });
});
