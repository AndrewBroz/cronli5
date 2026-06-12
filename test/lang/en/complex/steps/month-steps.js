import {run} from '../../../../runner.js';

// Behavior spec for step (`/`) patterns in the month field. Open steps read as
// a frequency ("every other month"); bounded ranges enumerate month names. A
// specific date combined with an open month step reads "on the <date> in
// every <n>th month".

describe('Month step patterns:', function() {
  describe('open step (frequency phrasing)', function() {
    run([
      ['0 0 * */3 *', 'every day in every 3rd month at midnight'],
      ['0 0 * */2 *', 'every day in every other month at midnight'],
      ['0 0 * 2/3 *',
        'every day in every 3rd month from February at midnight']
    ]);
  });

  describe('bounded range (enumerated)', function() {
    run([
      ['0 0 * 1-6/2 *', 'every day in January, March, and May at midnight']
    ]);
  });

  describe('with a specific date', function() {
    run([
      ['0 0 13 */3 *', 'on the 13th in every 3rd month at midnight'],
      ['0 0 13 1-6/2 *', 'on January, March, and May 13 at midnight']
    ]);
  });

  describe('as a trailing qualifier', function() {
    run([
      ['0 * * */3 *', 'every hour in every 3rd month']
    ]);
  });
});
