import {run} from '../runner.js';

// Behavior spec for seven-field (Quartz-style) patterns: `second minute
// hour date month weekday year`. Seven fields are unambiguous, so no
// `years` option is needed (the option remains as the six-field
// disambiguator). An explicitly supplied year is always described.

describe('Seven-field patterns:', function() {
  describe('strings', function() {
    run([
      ['0 30 9 * * * 2030', 'every day at 9:30 AM in 2030'],
      ['0 0 12 1 1 * 2030', 'on January 1st, 2030 at 12:00 PM'],
      ['0 0 12 25 12 * 2030-2035',
        'on December 25th at 12:00 PM in 2030-2035'],
      ['0 0 12 1 1 * */2', 'on January 1st at 12:00 PM every two years'],
      ['*/15 30 9 * * * 2030',
        'every 15 seconds, every day at 9:30 AM in 2030'],
      ['0 30 9 * * * *', 'every day at 9:30 AM']
    ]);
  });

  describe('arrays', function() {
    run([
      [['0', '30', '9', '*', '*', '*', '2030'],
        'every day at 9:30 AM in 2030']
    ]);
  });

  describe('objects with a year', function() {
    run([
      [{minute: '30', hour: '9', year: '2030'},
        'every day at 9:30 AM in 2030'],
      [{minute: '30', hour: '9', year: '*'}, 'every day at 9:30 AM']
    ]);
  });

  describe('the years option still disambiguates six fields', function() {
    run([
      ['0 9 * * * 2030', 'every day at 9:00 AM in 2030', {years: true}],
      ['30 9 * * * *', 'nine minutes and 30 seconds past the hour, ' +
        'every hour']
    ]);
  });
});
