import {error, run} from '../runner.js';

// Behavior spec for Quartz-style tokens: `L` (last day / last weekday-of
// suffix), `W` (nearest weekday), `#` (nth weekday of the month), and `?`
// ("no specific value", equivalent to `*`). These appear in Quartz, AWS
// EventBridge, and similar schedulers.

describe('Quartz tokens:', function() {
  describe('L: the last day of the month', function() {
    run([
      ['0 0 L * *', 'on the last day of the month at 12:00 AM'],
      ['0 0 L 6 *', 'on the last day of the month in June at 12:00 AM'],
      ['*/15 * L * *', 'every 15 minutes on the last day of the month'],
      ['0 0 L-5 * *',
        'five days before the last day of the month at 12:00 AM'],
      ['0 0 L-1 * *', 'one day before the last day of the month at 12:00 AM']
    ]);
  });

  describe('LW: the last weekday of the month', function() {
    run([
      ['0 0 LW * *', 'on the last weekday of the month at 12:00 AM'],
      ['0 0 WL * *', 'on the last weekday of the month at 12:00 AM']
    ]);
  });

  describe('W: the weekday nearest a date', function() {
    run([
      ['0 0 15W * *', 'on the weekday nearest the 15th at 12:00 AM'],
      ['0 0 1W * *', 'on the weekday nearest the 1st at 12:00 AM']
    ]);
  });

  describe('nL: the last weekday of the month', function() {
    run([
      ['0 0 * * 5L', 'on the last Friday of the month at 12:00 AM'],
      ['0 0 * * FRIL', 'on the last Friday of the month at 12:00 AM'],
      ['*/15 * * * 5L', 'every 15 minutes on the last Friday of the month'],
      ['0 0 * 6 5L',
        'on the last Friday of the month in June at 12:00 AM'],
      ['0 0 * * L', 'every Saturday at 12:00 AM']
    ]);
  });

  describe('n#m: the nth weekday of the month', function() {
    run([
      ['0 0 * * 1#2', 'on the second Monday of the month at 12:00 AM'],
      ['0 9 * * MON#2', 'on the second Monday of the month at 9:00 AM'],
      ['0 0 * * 0#1', 'on the first Sunday of the month at 12:00 AM'],
      ['0 0 * * 4#5', 'on the fifth Thursday of the month at 12:00 AM']
    ]);
  });

  describe('?: no specific value', function() {
    run([
      ['0 12 ? * MON', 'every Monday at 12:00 PM'],
      ['0 12 15 * ?', 'on the 15th at 12:00 PM']
    ]);
  });

  describe('date or weekday', function() {
    run([
      ['0 0 L * MON',
        'on the last day of the month or on Monday at 12:00 AM'],
      ['0 0 13 * 5L',
        'on the 13th or on the last Friday of the month at 12:00 AM']
    ]);
  });

  describe('short option', function() {
    run([
      ['0 0 * * 5L',
        'on the last Fri of the month at 12:00 AM', {short: true}]
    ]);
  });

  describe('invalid Quartz forms', function() {
    error([
      'L * * * *',
      '0 0 L,15 * *',
      '0 0 15W,3 * *',
      '0 0 32W * *',
      '0 0 L-31 * *',
      '0 0 W * *',
      '0 0 * * 1#6',
      '0 0 * * 8L',
      '0 0 * * 1#'
    ]);
  });
});
