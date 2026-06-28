import {error, run} from '../../../runner.js';

// Behavior spec for Quartz-style tokens: `L` (last day / last weekday-of
// suffix), `W` (nearest weekday), `#` (nth weekday of the month), and `?`
// ("no specific value", equivalent to `*`). These appear in Quartz, AWS
// EventBridge, and similar schedulers.

describe('Quartz tokens:', function() {
  describe('L: the last day of the month', function() {
    run([
      ['0 0 L * *', 'on the last day of the month at midnight'],
      ['0 0 L 6 *', 'on the last day in June at midnight'],
      ['0 0 L 1-3 *',
        'on the last day of each month from January through March at ' +
        'midnight'],
      ['*/15 * L * *', 'every 15 minutes on the last day of the month'],
      ['0 0 L-5 * *',
        'five days before the last day of the month at midnight'],
      ['0 0 L-1 * *', 'one day before the last day of the month at midnight']
    ]);
  });

  describe('LW: the last weekday of the month', function() {
    run([
      ['0 0 LW * *', 'on the last weekday of the month at midnight'],
      ['0 0 WL * *', 'on the last weekday of the month at midnight']
    ]);
  });

  describe('W: the weekday nearest a date', function() {
    run([
      ['0 0 15W * *', 'on the weekday nearest the 15th at midnight'],
      ['0 0 1W * *', 'on the weekday nearest the 1st at midnight'],
      // The `Wn` spelling (W before the day) is accepted alongside `nW`.
      ['0 0 W15 * *', 'on the weekday nearest the 15th at midnight']
    ]);
  });

  describe('nL: the last weekday of the month', function() {
    run([
      ['0 0 * * 5L', 'on the last Friday of the month at midnight'],
      ['0 0 * * FRIL', 'on the last Friday of the month at midnight'],
      ['*/15 * * * 5L', 'every 15 minutes on the last Friday of the month'],
      ['0 0 * 6 5L',
        'on the last Friday in June at midnight'],
      ['0 0 * 1-3 5L',
        'on the last Friday of each month from January through March at ' +
        'midnight'],
      ['0 0 * */2 5L',
        'on the last Friday in every odd-numbered month at midnight'],
      ['0 0 * * L', 'every Saturday at midnight'],
      // The `7`-for-Sunday alias inside a Quartz weekday resolves to Sunday.
      ['0 0 * * 7L', 'on the last Sunday of the month at midnight']
    ]);
  });

  describe('n#m: the nth weekday of the month', function() {
    run([
      ['0 0 * * 1#2', 'on the second Monday of the month at midnight'],
      ['0 9 * * MON#2', 'on the second Monday of the month at 9 a.m.'],
      ['0 0 * * 0#1', 'on the first Sunday of the month at midnight'],
      ['0 0 * * 4#5', 'on the fifth Thursday of the month at midnight'],
      // The `7`-for-Sunday alias inside an nth-weekday form resolves to Sunday.
      ['0 0 * * 7#2', 'on the second Sunday of the month at midnight']
    ]);
  });

  describe('?: no specific value (Quartz mode)', function() {
    run([
      ['0 12 ? * MON', 'every Monday at noon', {quartz: true}],
      ['0 12 15 * ?', 'on the 15th at noon', {quartz: true}]
    ]);
  });

  // Without `{quartz: true}`, `?` is rejected: it is a Quartz token, and any
  // standard cron that carries it would be silently mis-read.
  describe('?: rejected by default', function() {
    error([
      ['0 0 ? * 2', 'Quartz token'],
      ['0 0 1 * ?', 'Quartz token']
    ]);
    run([
      // Lenient mode returns the fallback rather than throwing.
      ['0 0 ? * 2',
        'an unrecognizable cron pattern', {lenient: true}]
    ]);
  });

  // Quartz day-of-week numbering: 1=Sunday, 2=Monday, ... 7=Saturday. In the
  // default (Unix) mode these same numbers mean 0/7=Sun, 1=Mon, etc.
  describe('Quartz weekday numbering (1=Sun..7=Sat)', function() {
    run([
      ['0 0 ? * 1', 'every Sunday at midnight', {quartz: true}],
      ['0 0 ? * 2', 'every Monday at midnight', {quartz: true}],
      ['0 0 ? * 7', 'every Saturday at midnight', {quartz: true}],
      // A weekday NAME is unambiguous and reads the same in either mode.
      ['0 0 ? * MON', 'every Monday at midnight', {quartz: true}],
      // The day-of-month side is never reindexed.
      ['0 0 1 * ?', 'on the 1st at midnight', {quartz: true}]
    ]);
    // Quartz has no weekday 0.
    error([
      ['0 0 ? * 0', 'invalid Quartz day-of-week value "0"', {quartz: true}]
    ]);
  });

  // The DOW-indexed operators reindex too: `6L` is Quartz Friday (Unix 5),
  // `2#2` is the 2nd Quartz Monday (Unix 1).
  describe('Quartz weekday operators (nL, n#k)', function() {
    run([
      ['0 0 ? * 6L',
        'on the last Friday of the month at midnight', {quartz: true}],
      ['0 0 ? * 2#2',
        'on the second Monday of the month at midnight', {quartz: true}],
      // Quartz weekday `L` alias is Saturday, same as Unix.
      ['0 0 ? * L', 'every Saturday at midnight', {quartz: true}],
      // A weekday step reindexes its start too: Quartz `1/2` (from Sunday,
      // every other day) is Unix `0/2` = Sun, Tue, Thu, Sat.
      ['0 0 ? * 1/2',
        'every Tuesday, Thursday, Saturday, and Sunday at midnight',
        {quartz: true}]
    ]);
  });

  describe('date or weekday', function() {
    run([
      ['0 0 L * MON',
        'at midnight whenever the day is the last day of the month or a ' +
        'Monday'],
      ['0 0 13 * 5L',
        'at midnight whenever the day is the 13th or the last Friday of the ' +
        'month']
    ]);
  });

  describe('short option', function() {
    run([
      ['0 0 * * 5L',
        'on the last Fri of the month at midnight', {short: true}]
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
