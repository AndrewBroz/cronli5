import {run} from '../../../../runner.js';

// Behavior spec for step (`/`) patterns in the day-of-month field. Open steps
// (wildcard or single start) read as a frequency ("every other day of the
// month"); bounded ranges enumerate the ordinals.

describe('Day-of-month step patterns:', function() {
  describe('open step (frequency phrasing)', function() {
    run([
      ['0 0 */2 * *', 'every other day of the month at midnight'],
      ['0 0 */3 * *', 'every 3rd day of the month at midnight'],
      ['0 0 */10 * *', 'every 10th day of the month at midnight'],
      ['0 0 5/2 * *',
        'every other day of the month from the 5th at midnight'],
      ['0 0 */2 6 *',
        'every other day in June at midnight'],
      ['0 0 */2 */2 *',
        'every other day in every odd-numbered month at midnight'],
      ['0 0 */2 1-3 *',
        'every other day of each month from January through March at ' +
        'midnight']
    ]);
  });

  describe('bounded range (enumerated)', function() {
    run([
      ['0 0 1-15/3 * *',
        'on the 1st, 4th, 7th, 10th, and 13th at midnight']
    ]);
  });

  describe('with a weekday (OR)', function() {
    run([
      ['0 0 */2 * 5',
        'at midnight whenever the day is an odd-numbered day or a Friday']
    ]);
  });

  describe('as a trailing qualifier', function() {
    run([
      ['0 * */2 * *', 'every hour on every other day of the month']
    ]);
  });
});
