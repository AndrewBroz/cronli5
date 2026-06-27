import {run} from '../../../../runner.js';

// Behavior spec for a DENSE multi-cadence pattern: a seconds cadence stacked
// on a minutes cadence under an hours cadence (three independent cadence
// fields), optionally with a calendar/day anchor. The flat fine-to-coarse
// run-on ("every second …, every N minutes …, every N hours … on <day>") reads
// as a robotic list. The dense form instead leads with the calendar anchor (if
// any), states the cadences coarse-to-fine (hour, then minute), and NESTS the
// second under the minute ("…, and within each of those minutes, every second
// …"). The cadence leaf words are unchanged — only the order and the nesting
// move; the result stays a lowercase, period-free fragment like every other
// description. Patterns with fewer than three cadence fields, or without both a
// seconds and a minutes cadence, keep their established order (see
// seconds-compose.js).

describe('Dense multi-cadence patterns:', function() {
  describe('anchor-led, second nested under the minute', function() {
    run([
      // Day anchors: last-weekday, nth-weekday, last-day, single weekday,
      // date range, single date, month list, last-day-in-month.
      ['0-10 */7 */5 LW * *',
        'on the last weekday of the month, ' +
        'every five hours from midnight through 8 p.m., ' +
        'every seven minutes from 0 through 56 minutes past the hour, ' +
        'and within each of those minutes, ' +
        'every second from 0 through 10 past the minute'],
      ['0-10 */7 */5 * * 1#2',
        'on the second Monday of the month, ' +
        'every five hours from midnight through 8 p.m., ' +
        'every seven minutes from 0 through 56 minutes past the hour, ' +
        'and within each of those minutes, ' +
        'every second from 0 through 10 past the minute'],
      ['30-59 */20 */6 L * *',
        'on the last day of the month, every six hours, ' +
        'every 20 minutes, and within each of those minutes, ' +
        'every second from 30 through 59 past the minute'],
      ['0-30 */12 */8 * * 2',
        'on Tuesdays, every eight hours, every 12 minutes, ' +
        'and within each of those minutes, ' +
        'every second from 0 through 30 past the minute'],
      ['5-30 */10 */3 1-5 * *',
        'on the 1st through 5th, every three hours, every ten minutes, ' +
        'and within each of those minutes, ' +
        'every second from 5 through 30 past the minute'],
      ['15-50 */6 */3 15 * *',
        'on the 15th, every three hours, every six minutes, ' +
        'and within each of those minutes, ' +
        'every second from 15 through 50 past the minute'],
      ['10-40 */5 */2 * 1,4,7 *',
        'in January, April, and July, every two hours, ' +
        'every five minutes, and within each of those minutes, ' +
        'every second from 10 through 40 past the minute'],
      ['0-45 */9 */4 L 3 *',
        'on the last day in March, every four hours, ' +
        'every nine minutes from 0 through 54 minutes past the hour, ' +
        'and within each of those minutes, ' +
        'every second from 0 through 45 past the minute']
    ]);
  });

  describe('anchor-led with an hour-range window', function() {
    run([
      ['0-20/2 */15 8-18 1 * *',
        'on the 1st, from 8 a.m. through 6 p.m., every 15 minutes, ' +
        'and within each of those minutes, at 0, 2, 4, 6, 8, 10, 12, 14, 16, ' +
        '18, and 20 seconds past the minute'],
      ['0-30 */10 9-17 1-5 * *',
        'on the 1st through 5th, from 9 a.m. through 5 p.m., ' +
        'every ten minutes, and within each of those minutes, ' +
        'every second from 0 through 30 past the minute']
    ]);
  });

  describe('no anchor: lead with the hour cadence', function() {
    run([
      ['0-10 */7 */5 * * *',
        'every five hours from midnight through 8 p.m., ' +
        'every seven minutes from 0 through 56 minutes past the hour, ' +
        'and within each of those minutes, ' +
        'every second from 0 through 10 past the minute'],
      ['20-40 */8 8-20 * * *',
        'from 8 a.m. through 8 p.m., ' +
        'every eight minutes from 0 through 56 minutes past the hour, ' +
        'and within each of those minutes, ' +
        'every second from 20 through 40 past the minute']
    ]);
  });
});
