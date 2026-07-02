import chai from 'chai';
import cronli5 from '../../../../src/cronli5.js';
import en from '../../../../src/lang/en/index.js';
import {run} from '../../../runner.js';

const {expect} = chai;

// Behavior spec for the `lenient` option. By default invalid input throws;
// with `lenient: true` interpretation never throws on bad INPUT and
// unparseable input yields a fixed fallback description, making `cronli5`
// safe to embed in UIs that render arbitrary user crontabs.

const FALLBACK = 'an unrecognizable cron pattern';

describe('Lenient option:', function() {
  describe('valid input is unaffected', function() {
    run([
      ['30 9 * * *', 'every day at 9:30 a.m.', {lenient: true}],
      ['*/15 * * * *', 'every 15 minutes', {lenient: true}]
    ]);
  });

  describe('invalid input returns the fallback description', function() {
    run([
      ['5-1/2 * * * *', FALLBACK, {lenient: true}],
      ['61 * * * *', FALLBACK, {lenient: true}],
      ['not cron', FALLBACK, {lenient: true}],
      ['', FALLBACK, {lenient: true}],
      [null, FALLBACK, {lenient: true}],
      ['@huh', FALLBACK, {lenient: true}]
    ]);
  });

  // Lenient means "invalid input returns the fallback" — it must not also
  // hide defects. A language module that throws on a VALID pattern is a bug,
  // and masking it as the fallback string would let renderer regressions
  // ship dark in exactly the mode production UIs use.
  describe('a failing renderer is not masked', function() {
    const broken = {
      ...en,
      describe: function describeBroken() {
        throw new Error('renderer defect');
      }
    };

    it('propagates a renderer error on valid input', function() {
      expect(cronli5.bind(null, '30 9 * * *', {lang: broken, lenient: true}))
        .to.throw('renderer defect');
    });

    it('still falls back for invalid input', function() {
      expect(cronli5('not cron', {lang: broken, lenient: true}))
        .to.equal(FALLBACK);
    });
  });
});
