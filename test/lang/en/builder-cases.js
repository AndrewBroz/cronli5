// BUILDER-ADDED AND UNREVIEWED. These rows were written by the builder of
// src/lang/en/next to reach rules of src/lang/en/answers.md that the
// reviewed paradigms do not exercise. Each expected text is the builder's
// reading of the answers, not a reviewed oracle: a fluent reviewer should
// read every row before any of them is trusted. A row's third element is
// the options it is rendered with.

import english from '../../../src/lang/en/next/index.js';
import {checkRows} from '../../paradigms/check.js';

const rows = [
  // An exception to every hour, in each position an hour is said in.
  ['0 0-2,4-23 * * *', 'every hour except at 3 a.m.'],
  ['* 0-2,4-23 * * *', 'every minute except during the 3 a.m. hour'],
  ['5,20,45 0-2,4-23 * * *',
    'at 5, 20, and 45 minutes past every hour except 3 a.m.'],

  // An exception to a cadence of hours.
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'every minute during every other hour except the 8 a.m. hour'],

  // A cadence of hours that stops early, and one off the hour.
  ['0 6-22/4 * * *', 'every 4 hours from 6 a.m. through 10 p.m.'],
  ['30 1/2 * * *', 'every 2 hours from 1:30 a.m.'],

  // Two neighbouring hours are a list as moments and a stretch as a
  // window.
  ['0 9,10 * * *', 'at 9 and 10 a.m.'],
  ['5,20,45 9,10 * * *', 'at 5, 20, and 45 minutes past 9 and 10 a.m.'],

  // Minutes: an exception, and a cadence over fewer hours than times.
  ['0-14,16-59 * * * *', 'every minute except at 15 minutes past every hour'],
  ['*/7 9 * * *', 'every 7 minutes from 0 through 56 minutes past 9 a.m.'],

  // Seconds: a single second with too many times to list, and a second
  // on every minute of a confined hour.
  ['15 0 * * * *', 'at 15 seconds past the minute, every hour'],
  ['5/10 * 9 * * *',
    'every 10 seconds from 5 through 55 seconds past every minute during ' +
    'the 9 a.m. hour'],

  // Days of the month: cadences that name one end or both, an interval
  // past twelfth, and exceptions to every day and to a range.
  ['0 9 1/13 * *', 'at 9 a.m. on every 13th day from the 1st'],
  ['0 9 5-20/3 * *',
    'at 9 a.m. on every third day from the 5th through the 20th'],
  ['0 9 1-14,16-31 * *', 'at 9 a.m. on every day except the 15th'],
  ['0 0 1-14,16-20 6 *', 'at midnight from June 1 through 20 except the 15th'],
  ['0 0 1-14,16-31 6 *', 'at midnight on every day except the 15th in June'],
  ['0 0 */2 3,6 *', 'at midnight on odd-numbered days in March and June'],

  // Months: a cadence is not said without a day, and is after one.
  ['0 9 * 1-9/2 *', 'at 9 a.m. in January, March, May, July, and September'],
  ['0 9 * 6-8,12 *', 'at 9 a.m. from June through August and in December'],
  ['0 9 * 1-11 *', 'at 9 a.m. in every month except December'],
  ['0 0 1 6-8,12 *',
    'at midnight on the 1st of each month from June through August and of ' +
    'December'],
  ['0 0 1 */5 *',
    'at midnight on the 1st of every fifth month from January through ' +
    'November'],

  // Days of the week.
  ['0 9 * * 1-6', 'at 9 a.m. on every day except Sunday'],
  ['0 9 * * 1-3,5', 'at 9 a.m. on weekdays except Thursday'],
  ['0 9 1 * 2-4', 'at 9 a.m. on the 1st as well as Tuesday through Thursday'],

  // Years.
  ['0 0 1 1 * */4', 'at midnight on January 1 in every fourth year from 1970',
    {years: true}],
  ['0 0 1 1 * 2030-2034,2036-2040',
    'at midnight on January 1 from 2030 through 2040 except 2035',
    {years: true}],

  // Styles.
  ['0 9 * * 2-4', 'at 9 a.m. Tue through Thu', {short: true}],
  ['0 9-17 1-7 6 *', 'every hour from 9 AM to 5 PM from 1st to 7th June', {
    dialect: {am: 'AM', dayFirst: true, ordinals: true, pm: 'PM',
      through: ' to '}
  }],
  ['0 9 * * 1', 'at 9 a.m. on Mondays', {dialect: 'unknown'}],

  // The lenient fallback.
  ['not a pattern', 'an unrecognizable cron pattern', {lenient: true}]
];

describe('English builder-added cases (unreviewed):', function() {
  checkRows(english, rows);
});
