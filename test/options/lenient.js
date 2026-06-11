import {run} from '../runner.js';

// Behavior spec for the `lenient` option. By default invalid input throws;
// with `lenient: true` interpretation never throws and unparseable input
// yields a fixed fallback description, making `cronli5` safe to embed in
// UIs that render arbitrary user crontabs.

const FALLBACK = 'an unrecognizable cron pattern';

describe('Lenient option:', function() {
  describe('valid input is unaffected', function() {
    run([
      ['30 9 * * *', 'every day at 9:30 AM', {lenient: true}],
      ['*/15 * * * *', 'every 15 minutes', {lenient: true}]
    ]);
  });

  describe('invalid input returns the fallback description', function() {
    run([
      ['30-10 * * * *', FALLBACK, {lenient: true}],
      ['61 * * * *', FALLBACK, {lenient: true}],
      ['not cron', FALLBACK, {lenient: true}],
      ['', FALLBACK, {lenient: true}],
      [null, FALLBACK, {lenient: true}],
      ['@huh', FALLBACK, {lenient: true}]
    ]);
  });
});
