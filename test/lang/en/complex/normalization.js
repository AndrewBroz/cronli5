import {run} from '../../../runner.js';

// Behavior spec for input normalization. Comma lists are described in
// ascending fire order regardless of how they were written, duplicate
// segments collapse, and a degenerate range (`9-9`) reads as its single
// value. The described schedule is identical either way; normalization only
// makes the English read naturally.

describe('Input normalization:', function() {
  describe('lists sort into fire order', function() {
    run([
      ['0 17,9 * * *', 'every day at 9 a.m. and 5 p.m.'],
      ['45,15,30 * * * *',
        'at 15, 30, and 45 minutes past the hour'],
      ['30-40,10 * * * *',
        'at 10 and 30 through 40 minutes past the hour'],
      ['30,15 * * * * *', 'at 15 and 30 seconds past the minute'],
      ['0 0 * * FRI,MON', 'every Monday and Friday at midnight'],
      ['0 0 * SEP,MAR *', 'every day in March and September at midnight'],
      ['0 0 15,1 * *', 'on the 1st and 15th at midnight']
    ]);
  });

  describe('duplicate segments collapse', function() {
    run([
      ['5,5 * * * *', 'five minutes past the hour, every hour'],
      ['0 9,9,17 * * *', 'every day at 9 a.m. and 5 p.m.']
    ]);
  });

  describe('degenerate ranges read as single values', function() {
    run([
      ['0 9-9 * * *', 'every day at 9 a.m.'],
      ['30-30 9 * * *', 'every day at 9:30 a.m.']
    ]);
  });

  describe('interval-one steps read as their range', function() {
    run([
      // `1/1` fires at minutes 1-59 and skips :00, so "every minute"
      // would overstate it.
      ['1/1 * * * *', 'every minute from 1 through 59 past the hour'],
      ['1/1 * * * * *', 'every second from 1 through 59 past the minute'],
      ['0/1 * * * *', 'every minute'],
      ['*/1 * * * *', 'every minute'],
      ['5-30/1 * * * *', 'every minute from 5 through 30 past the hour'],
      ['0 1/1 * * *', 'every hour from 1 a.m. through 11 p.m.'],
      ['0 0 2/1 * *', 'on the 2nd through 31st at midnight'],
      ['0 0 * 3/1 *', 'every day in March through December at midnight'],
      ['0 0 * * 1/1', 'every Monday through Saturday at midnight']
    ]);
  });

  describe('offset steps qualify their start grammatically', function() {
    run([
      ['1/3 * * * *', 'every three minutes from one minute past the hour'],
      ['2/3 * * * *', 'every three minutes from two minutes past the hour']
    ]);
  });

  describe('a range over the whole field reads as a wildcard', function() {
    run([
      // A plain range that enumerates every value in the field imposes no
      // restriction, so it reads identically to `*`.
      ['0-59 * * * *', 'every minute'],
      ['0 0-23 * * *', 'every hour'],
      ['0 0 1-31 * *', 'every day at midnight'],
      ['0 0 * 1-12 *', 'every day at midnight'],
      ['0 0 * * 0-6', 'every day at midnight'],
      ['0 0 * * 1-7', 'every day at midnight'],
      ['0 0 * * 0-7', 'every day at midnight'],
      ['0 0 * * SUN-SAT', 'every day at midnight'],
      ['0-59 * * * * *', 'every second'],
      // A step whose range covers the whole field reads as the unbounded `*/N`.
      ['0-59/2 * * * *', 'every two minutes'],
      ['0 0-23/2 * * *', 'every two hours'],
      ['0-59/7 * * * *',
        'every seven minutes from 0 through 56 minutes past the hour'],
      ['0 9-17/2 * * *', 'at 9 a.m., 11 a.m., 1 p.m., 3 p.m., and 5 p.m.']
    ]);
  });

  describe('steps that fire once read as their single value', function() {
    run([
      // A step whose interval overshoots the field before a second fire
      // enumerates only its start, so `1/24` is `1` and `*/24` is `0`.
      ['*/15 1/24 * * *', 'every 15 minutes from 1 a.m. through 1:45 a.m.'],
      ['* */24 * * *', 'every minute of the midnight hour'],
      ['0 */24 * * *', 'every day at midnight'],
      ['0 1/24 * * *', 'every day at 1 a.m.'],
      ['*/60 * * * *', 'every hour'],
      ['0 0 1/31 * *', 'on the 1st at midnight'],
      ['0 0 1 1/12 *', 'on January 1 at midnight'],
      ['0 0 * * */7', 'every Sunday at midnight']
    ]);
  });
});
