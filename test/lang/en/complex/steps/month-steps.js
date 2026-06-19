import {run} from '../../../../runner.js';

// Behavior spec for step (`/`) patterns in the month field. There are few,
// named months, so a step enumerates them rather than reading as a frequency
// ("every 3rd month" would lose the names and the start phase). The one
// exception is interval 2, which reads as "every odd/even-numbered month" —
// the parity is self-disambiguating and mirrors the "odd/even hours" idiom.

describe('Month step patterns:', function() {
  describe('interval 2 reads as odd/even-numbered months', function() {
    run([
      ['0 0 * */2 *', 'every day in every odd-numbered month at midnight'],
      ['0 0 * 2/2 *', 'every day in every even-numbered month at midnight']
    ]);
  });

  describe('interval 3+ enumerates the month names', function() {
    run([
      ['0 0 * */3 *',
        'every day in January, April, July, and October at midnight'],
      ['0 0 * */4 *', 'every day in January, May, and September at midnight'],
      ['0 0 * */6 *', 'every day in January and July at midnight'],
      ['0 0 * 2/3 *',
        'every day in February, May, August, and November at midnight'],
      // 3/2 is March, May, July, September, November — odd numbers but missing
      // January, so not "odd-numbered"; it enumerates.
      ['0 0 * 3/2 *',
        'every day in March, May, July, September, and November at midnight']
    ]);
  });

  describe('bounded range (enumerated)', function() {
    run([
      ['0 0 * 1-6/2 *', 'every day in January, March, and May at midnight']
    ]);
  });

  describe('with a specific date', function() {
    run([
      ['0 0 13 */3 *',
        'on January, April, July, and October 13 at midnight'],
      ['0 0 13 1-6/2 *', 'on January, March, and May 13 at midnight']
    ]);
  });

  describe('as a trailing qualifier', function() {
    run([
      ['0 * * */3 *', 'every hour in January, April, July, and October']
    ]);
  });

  describe('serial comma in the fold follows the dialect', function() {
    run([
      // gb drops the Oxford comma (and reads day-first); the enumerated step
      // still matches its explicit-list equivalent in both dialects.
      ['0 0 13 */3 *',
        'on 13 January, April, July and October at midnight',
        {dialect: 'gb'}]
    ]);
  });
});
