import {run} from '../runner.js';

// Behavior spec for input normalization. Comma lists are described in
// ascending fire order regardless of how they were written, duplicate
// segments collapse, and a degenerate range (`9-9`) reads as its single
// value. The described schedule is identical either way; normalization only
// makes the English read naturally.

describe('Input normalization:', function() {
  describe('lists sort into fire order', function() {
    run([
      ['0 17,9 * * *', 'every day at 9:00 AM and 5:00 PM'],
      ['45,15,30 * * * *',
        'at 15, 30 and 45 minutes past the hour'],
      ['30-40,10 * * * *',
        'at ten and 30 through 40 minutes past the hour'],
      ['30,15 * * * * *', 'at 15 and 30 seconds past the minute'],
      ['0 0 * * FRI,MON', 'every Monday and Friday at 12:00 AM'],
      ['0 0 * SEP,MAR *', 'every day in March and September at 12:00 AM'],
      ['0 0 15,1 * *', 'on the 1st and 15th at 12:00 AM']
    ]);
  });

  describe('duplicate segments collapse', function() {
    run([
      ['5,5 * * * *', 'five minutes past the hour, every hour'],
      ['0 9,9,17 * * *', 'every day at 9:00 AM and 5:00 PM']
    ]);
  });

  describe('degenerate ranges read as single values', function() {
    run([
      ['0 9-9 * * *', 'every day at 9:00 AM'],
      ['30-30 9 * * *', 'every day at 9:30 AM']
    ]);
  });

  describe('interval-one steps read as their range', function() {
    run([
      // `1/1` fires at minutes 1-59 and skips :00, so "every minute"
      // would overstate it.
      ['1/1 * * * *', 'every minute from one through 59 past the hour'],
      ['1/1 * * * * *', 'every second from one through 59 past the minute'],
      ['0/1 * * * *', 'every minute'],
      ['*/1 * * * *', 'every minute'],
      ['5-30/1 * * * *', 'every minute from five through 30 past the hour'],
      ['0 1/1 * * *', 'every hour from 1:00 AM through 11:00 PM'],
      ['0 0 2/1 * *', 'on the 2nd through 31st at 12:00 AM'],
      ['0 0 * 3/1 *', 'every day in March through December at 12:00 AM'],
      ['0 0 * * 1/1', 'every Monday-Saturday at 12:00 AM']
    ]);
  });

  describe('offset steps qualify their start grammatically', function() {
    run([
      ['1/3 * * * *', 'every three minutes from one minute past the hour'],
      ['2/3 * * * *', 'every three minutes from two minutes past the hour']
    ]);
  });
});
