// BUILDER-ADDED AND UNREVIEWED. These rows were written by the builder of
// src/lang/en to reach rules of src/lang/en/answers.md that the
// reviewed paradigms do not exercise. Each expected text is the builder's
// reading of the answers, not a reviewed oracle: a fluent reviewer should
// read every row before any of them is trusted. Every row reaches code
// that no paradigm row does. A row's third element is the options it is
// rendered with.

import english from '../../../src/lang/en/index.js';
import {checkRows} from '../../paradigms/check.js';

const rows = [
  ['5,20,45 0-2,4-23 * * *',
    'at 5, 20, and 45 minutes past every hour except 3 a.m.'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'every minute during every other hour except the 8 a.m. hour'],
  ['0 9-17,20,22 * * *',
    'every hour from 9 a.m. through 5 p.m. and at 8 and 10 p.m.'],
  ['0 22-2,10 * * *',
    'every hour from 10 p.m. through 2 a.m. and at 10 a.m.'],
  ['0-29 9 * * *',
    'every minute from 9 until 9:30 a.m.'],
  ['30-59 9 * * *',
    'every minute from 9:30 until 10 a.m.'],
  ['0-14,16-29 9 * * *',
    'every minute from 9 until 9:30 a.m. except at 9:15 a.m.'],
  ['50-10 9 * * *',
    'every minute from 9 until 9:11 a.m. and every minute from 9:50 until 10 a.m.'],
  ['0 0 1 1-11 *',
    'at midnight on the 1st of every month except December'],
  ['0 9 * * 1-3,5',
    'at 9 a.m. on weekdays except Thursday'],
  ['0 0 L-1 * *',
    'at midnight 1 day before the last day of the month'],
  ['0 0 1 1 * */4',
    'at midnight on January 1 every 4 years from 1970',
    {years: true}],
  ['0 0 1 1 * 2030-2034,2036-2040',
    'at midnight on January 1 from 2030 through 2040 except 2035',
    {years: true}],
  ['0 0 1 6 * 2030',
    'at midnight on 1 June 2030',
    {dialect: 'gb', years: true}],
  ['0 0 * * 5L',
    'at midnight on the last Fri of the month',
    {short: true}],
  ['0 9-17 1-7 6 *',
    'every hour from 9 AM to 5 PM from 1st to 7th June',
    {dialect: {am: 'AM', dayFirst: true, ordinals: true, pm: 'PM', through: ' to '}}],
  ['not a pattern',
    'an unrecognizable cron pattern',
    {lenient: true}],
  ['* 5,10-40 9 * * *',
    'every second for one minute at 9:05 a.m. and every second from 9:10 until 9:41 a.m.'],
  ['0 0 1-14,16-31 6 *',
    'at midnight on every day in June except the 15th'],
  ['*/15 */6 * * *',
    'every 15 minutes for one hour every 6 hours'],
  ['5,20,45 */6 * * *',
    'at 5, 20, and 45 minutes past midnight, 6 a.m., noon, and 6 p.m.']
];

describe('English builder-added cases (unreviewed):', function() {
  checkRows(english, rows);
});
