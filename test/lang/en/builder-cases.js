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
    'every hour from 9 a.m. through 5 p.m. and at 8 p.m. and 10 p.m. every day'],
  ['0 22-2,10 * * *',
    'every hour from 10 p.m. through 2 a.m. and at 10 a.m. every day'],
  ['0-29 9 * * *',
    'every minute from 9 a.m. until 9:30 a.m. every day'],
  ['30-59 9 * * *',
    'every minute from 9:30 a.m. until 10 a.m. every day'],
  ['0-14,16-29 9 * * *',
    'every minute from 9 a.m. until 9:30 a.m. except at 15 minutes past the hour every day'],
  ['50-10 9 * * *',
    'every minute from 9 a.m. until 9:11 a.m. and every minute from 9:50 a.m. until 10 a.m. every day'],
  ['0 0 1 1-11 *',
    'at midnight on the 1st of every month except December'],
  ['0 0 L-1 * *',
    'at midnight 1 day before the last day of the month'],
  ['0 0 1 1 * */4',
    'at midnight on January 1 of every 4th year from 1970',
    {years: true}],
  ['0 0 1 1 * 2030-2034,2036-2040',
    'at midnight on January 1 in 2030 through 2040 except 2035',
    {years: true}],
  ['0 0 1 6 * 2030',
    'at midnight on 1 June 2030',
    {lang: 'en-GB', years: true}],
  ['0 0 * * 5L',
    'at midnight on the last Fri of the month',
    {style: {short: true}}],
  ['0 9-17 1-7 6 *',
    'every hour from 9 AM to 5 PM on 1st to 7th June',
    {style: {am: 'AM', dayFirst: true, ordinals: true, pm: 'PM', through: ' to '}}],
  ['not a pattern',
    'an unrecognizable cron pattern',
    {lenient: true}],
  ['15 30 * * * *',
    'at 30 minutes and 15 seconds past every hour'],
  ['8 0-29,45 9 * * *',
    'at 8 seconds past every minute from 9 a.m. until 9:30 a.m. and at 9:45:08 a.m. every day'],
  ['0 22-2 1 * *',
    'every hour from midnight through 2 a.m. and at 10 p.m. and 11 p.m. on the 1st'],
  ['*/15 22-2 * * 1-5',
    'every 15 minutes from midnight through 2:45 a.m. and from 10 p.m. through 11:45 p.m. on weekdays'],
  ['0 0,12 1 * *',
    'at midnight and noon on the 1st'],
  ['0,10,20,40,50 0-2,4-23 * * *',
    'every 10 minutes except during the 3 a.m. hour, and except at 30 minutes past the hour'],
  ['0-29,31-59 * 9 * * *',
    'every second during the 9 a.m. hour except at 30 seconds past the minute every day'],
  ['58-1 * * * *',
    'every minute from 58 through 1 minute past the hour'],
  ['* 5,10-40 9 * * *',
    'every second for one minute at 9:05 a.m. and every second from 9:10 a.m. until 9:41 a.m. every day'],
  ['0 0 1-14,16-31 6 *',
    'at midnight on every day in June except the 15th'],
  ['*/15 */6 * * *',
    'every 15 minutes for one hour every 6 hours'],
  ['5,20,45 */6 * * *',
    'at 5, 20, and 45 minutes past the hour, every 6 hours']
];

describe('English builder-added cases (unreviewed):', function() {
  checkRows(english, rows);
});
