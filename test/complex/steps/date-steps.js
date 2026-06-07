import {run} from '../../runner.js';

// Behavior spec for step (`/`) patterns in the day-of-month field. Open steps
// (wildcard or single start) read as a frequency ("every other day of the
// month"); bounded ranges enumerate the ordinals.

describe('Day-of-month step patterns:', function() {
  describe('open step (frequency phrasing)', function() {
    run([
      ['0 0 */2 * *', 'every other day of the month at 12:00 AM'],
      ['0 0 */3 * *', 'every 3rd day of the month at 12:00 AM'],
      ['0 0 */10 * *', 'every 10th day of the month at 12:00 AM'],
      ['0 0 5/2 * *',
        'every other day of the month from the 5th at 12:00 AM'],
      ['0 0 */2 6 *',
        'every other day of the month in June at 12:00 AM']
    ]);
  });

  describe('bounded range (enumerated)', function() {
    run([
      ['0 0 1-15/3 * *',
        'on the 1st, 4th, 7th, 10th and 13th at 12:00 AM']
    ]);
  });

  describe('with a weekday (OR)', function() {
    run([
      ['0 0 */2 * 5',
        'every other day of the month or on Friday at 12:00 AM']
    ]);
  });

  describe('as a trailing qualifier', function() {
    run([
      ['0 * */2 * *', 'every hour on every other day of the month']
    ]);
  });
});
