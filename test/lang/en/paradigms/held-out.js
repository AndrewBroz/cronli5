// English paradigms held out from a renderer's builder: one row per grid
// pattern no family shows (test/paradigms/grid.js), grouped by family.
// They judge whether a renderer built from the answers, the lexicon and
// the visible rows says what a speaker would for patterns it never saw.
//
// Written by hand from src/lang/en/answers.md. Never produced by running a
// renderer.

const EVEN_HOURS_BUT_8 = '0,2,4,6,10,12,14,16,18,20,22';

const rows = [
  // clock / second — context `0 9 * * *`
  ['30 0 9 * * *', 'at 9:00:30 a.m. every day'],
  ['0,30 0 9 * * *', 'at 9 a.m. and 9:00:30 a.m. every day'],
  ['*/15 0 9 * * *', 'every 15 seconds from 9:00 a.m. until 9:01 a.m. ' +
    'every day'],
  ['0-9 0 9 * * *', 'every second from 9:00:00 a.m. through 9:00:09 a.m. ' +
    'every day'],

  // clock / minute
  ['30 9 * * *', 'at 9:30 a.m. every day'],
  ['0,30 9 * * *', 'at 9 a.m. and 9:30 a.m. every day'],
  ['0-29 9 * * *', 'every minute from 9 a.m. until 9:30 a.m. every day'],
  ['0-29,45 9 * * *',
    'every minute from 9 a.m. until 9:30 a.m. and at 9:45 a.m. every day'],
  ['*/7 9 * * *', 'every 7 minutes from 0 through 56 minutes past 9 a.m. ' +
    'every day'],
  ['5/15 9 * * *', 'at 9:05 a.m., 9:20 a.m., 9:35 a.m., and 9:50 a.m. ' +
    'every day'],
  ['10-40/10 9 * * *', 'at 9:10 a.m., 9:20 a.m., 9:30 a.m., and 9:40 a.m. ' +
    'every day'],

  // clock / hour
  ['0 12 * * *', 'at noon every day'],
  ['0 8,12,18 * * *', 'at 8 a.m., noon, and 6 p.m. every day'],
  ['0 9-17 * * *', 'every hour from 9 a.m. through 5 p.m. every day'],
  ['0 */2 * * *', 'every 2 hours'],
  ['0 */6 * * *', 'every 6 hours'],
  [`0 ${EVEN_HOURS_BUT_8} * * *`, 'every 2 hours except at 8 a.m.'],
  ['0 22-2 * * *', 'every hour from 10 p.m. through 2 a.m. every day'],

  // clock / date
  ['0 9 15 * *', 'at 9 a.m. on the 15th'],
  ['0 9 1,15 * *', 'at 9 a.m. on the 1st and 15th'],
  ['0 9 1-7 * *', 'at 9 a.m. on the 1st through the 7th'],
  ['0 9 1-7,15 * *', 'at 9 a.m. on the 1st through the 7th and on the 15th'],
  ['0 9 2/2 * *', 'at 9 a.m. on even-numbered days'],
  ['0 9 */5 * *', 'at 9 a.m. every 5 days from the 1st'],
  ['0 9 L * *', 'at 9 a.m. on the last day of the month'],
  ['0 9 15W * *', 'at 9 a.m. on the weekday nearest the 15th'],

  // clock / month
  ['0 9 * 6 *', 'at 9 a.m. every day in June'],
  ['0 9 * 1,7 *', 'at 9 a.m. every day in January and July'],
  ['0 9 * 6-8 *', 'at 9 a.m. every day in June through August'],
  ['0 9 * 6-8,12 *', 'at 9 a.m. every day in June through August and in ' +
    'December'],
  ['0 9 * */3 *', 'at 9 a.m. every day in January, April, July, and October'],
  ['0 9 * 1-11 *', 'at 9 a.m. every day in every month except December'],

  // clock / weekday
  ['0 9 * * 0', 'at 9 a.m. on Sundays'],
  ['0 9 * * 1,3,5', 'at 9 a.m. on Mondays, Wednesdays, and Fridays'],
  ['0 9 * * 0,6', 'at 9 a.m. on weekends'],
  ['0 9 * * 1-6', 'at 9 a.m. Monday through Saturday'],
  ['0 9 * * 5L', 'at 9 a.m. on the last Friday of the month'],
  ['0 9 * * 1#2', 'at 9 a.m. on the second Monday of the month'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'at 30 seconds past the minute, every 15 minutes from 9 a.m. ' +
    'through 5:45 p.m. on weekdays'],
  ['0,30 */15 9-17 * * 1-5',
    'every 30 seconds for one minute every 15 minutes from 9 a.m. ' +
    'through 5:45 p.m. on weekdays'],
  ['*/15 */15 9-17 * * 1-5',
    'every 15 seconds for one minute every 15 minutes from 9 a.m. ' +
    'through 5:45 p.m. on weekdays'],
  ['0-9 */15 9-17 * * 1-5',
    'every second for the first 10 seconds of the minute, every 15 ' +
    'minutes from 9 a.m. through 5:45 p.m. on weekdays'],

  // window / minute
  ['0 9-17 * * 1-5', 'every hour from 9 a.m. through 5 p.m. on weekdays'],
  ['30 9-17 * * 1-5',
    'every hour from 9:30 a.m. through 5:30 p.m. on weekdays'],
  ['5,20,45 9-17 * * 1-5',
    'at 5, 20, and 45 minutes past the hour from 9 a.m. through 5 p.m. ' +
    'on weekdays'],
  ['0-29 9-17 * * 1-5',
    'every minute for the first 30 minutes of every hour from 9 a.m. ' +
    'through 5 p.m. on weekdays'],
  ['*/7 9-17 * * 1-5',
    'every 7 minutes from 0 through 56 minutes past the hour from 9 ' +
    'a.m. through 5 p.m. on weekdays'],
  ['5/15 9-17 * * 1-5',
    'every 15 minutes from 5 through 50 minutes past the hour from 9 ' +
    'a.m. through 5 p.m. on weekdays'],
  ['10-40/10 9-17 * * 1-5',
    'every 10 minutes from 10 through 40 minutes past the hour from 9 ' +
    'a.m. through 5 p.m. on weekdays'],

  // window / hour
  ['*/15 0 * * 1-5', 'every 15 minutes during the midnight hour on weekdays'],
  ['*/15 9 * * 1-5', 'every 15 minutes during the 9 a.m. hour on weekdays'],
  ['*/15 9,17 * * 1-5',
    'every 15 minutes during the 9 a.m. and 5 p.m. hours on weekdays'],
  ['*/15 8,12,18 * * 1-5',
    'every 15 minutes during the 8 a.m., noon, and 6 p.m. hours on weekdays'],
  ['*/15 */2 * * 1-5', 'every 15 minutes during every other hour on weekdays'],
  ['*/15 */6 * * 1-5', 'every 15 minutes for one hour every 6 hours on weekdays'],
  [`*/15 ${EVEN_HOURS_BUT_8} * * 1-5`,
    'every 15 minutes during every other hour except the 8 a.m. hour, on ' +
    'weekdays'],
  ['*/15 22-2 * * 1-5',
    'every 15 minutes from midnight through 2:45 a.m. and from 10 p.m. ' +
    'through 11:45 p.m. on weekdays'],

  // window / date
  ['*/15 9-17 15 * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on the 15th as well ' +
    'as on weekdays'],
  ['*/15 9-17 1,15 * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on the 1st and 15th ' +
    'as well as on weekdays'],
  ['*/15 9-17 1-7 * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on the 1st through the ' +
    '7th as well as on weekdays'],
  ['*/15 9-17 1-7,15 * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on the 1st through the ' +
    '7th and on the 15th as well as on weekdays'],
  ['*/15 9-17 2/2 * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on even-numbered ' +
    'days as well as on weekdays'],
  ['*/15 9-17 */5 * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. every 5 days from ' +
    'the 1st as well as on weekdays'],
  ['*/15 9-17 L * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on the last day of ' +
    'the month as well as on weekdays'],
  ['*/15 9-17 15W * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on the weekday ' +
    'nearest the 15th as well as on weekdays'],

  // window / month
  ['*/15 9-17 * 6 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays in June'],
  ['*/15 9-17 * 1,7 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays in ' +
    'January and July'],
  ['*/15 9-17 * 6-8 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays in June ' +
    'through August'],
  ['*/15 9-17 * 6-8,12 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays in June ' +
    'through August and in December'],
  ['*/15 9-17 * */3 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays in ' +
    'January, April, July, and October'],
  ['*/15 9-17 * 1-11 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays in ' +
    'every month except December'],

  // window / weekday
  ['*/15 9-17 * * 1',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on Mondays'],
  ['*/15 9-17 * * 0',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on Sundays'],
  ['*/15 9-17 * * 0,6',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on weekends'],
  ['*/15 9-17 * * 1-6',
    'every 15 minutes from 9 a.m. through 5:45 p.m. Monday through ' +
    'Saturday'],
  ['*/15 9-17 * * 5L',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on the last Friday ' +
    'of the month'],
  ['*/15 9-17 * * 1#2',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on the second ' +
    'Monday of the month'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', 'at 12:00:30 a.m. on the 1st'],
  ['0,30 0 0 1 * *', 'at midnight and 12:00:30 a.m. on the 1st'],
  ['*/15 0 0 1 * *',
    'every 15 seconds from midnight until 12:01 a.m. on the 1st'],
  ['0-9 0 0 1 * *',
    'every second from midnight through 12:00:09 a.m. on the 1st'],

  // monthly / minute
  ['30 0 1 * *', 'at 12:30 a.m. on the 1st'],
  ['0,30 0 1 * *', 'at midnight and 12:30 a.m. on the 1st'],
  ['0-29 0 1 * *', 'every minute from midnight until 12:30 a.m. on the 1st'],
  ['0-29,45 0 1 * *',
    'every minute from midnight until 12:30 a.m. and at 12:45 a.m. on ' +
    'the 1st'],
  ['*/7 0 1 * *',
    'every 7 minutes from 0 through 56 minutes past midnight on the 1st'],
  ['5/15 0 1 * *',
    'at 12:05 a.m., 12:20 a.m., 12:35 a.m., and 12:50 a.m. on the 1st'],
  ['10-40/10 0 1 * *',
    'at 12:10 a.m., 12:20 a.m., 12:30 a.m., and 12:40 a.m. on the 1st'],

  // monthly / hour
  ['0 12 1 * *', 'at noon on the 1st'],
  ['0 8,12,18 1 * *', 'at 8 a.m., noon, and 6 p.m. on the 1st'],
  ['0 9-17 1 * *', 'every hour from 9 a.m. through 5 p.m. on the 1st'],
  ['0 */2 1 * *', 'every 2 hours on the 1st'],
  ['0 */6 1 * *', 'every 6 hours on the 1st'],
  [`0 ${EVEN_HOURS_BUT_8} 1 * *`, 'every 2 hours except at 8 a.m., on the 1st'],
  ['0 22-2 1 * *',
    'every hour from midnight through 2 a.m. and at 10 p.m. and 11 p.m. ' +
    'on the 1st'],

  // monthly / date
  ['0 0 15 * *', 'at midnight on the 15th'],
  ['0 0 1,15 * *', 'at midnight on the 1st and 15th'],
  ['0 0 1-7 * *', 'at midnight on the 1st through the 7th'],
  ['0 0 1-7,15 * *',
    'at midnight on the 1st through the 7th and on the 15th'],
  ['0 0 2/2 * *', 'at midnight on even-numbered days'],
  ['0 0 */5 * *', 'at midnight every 5 days from the 1st'],
  ['0 0 L * *', 'at midnight on the last day of the month'],
  ['0 0 15W * *', 'at midnight on the weekday nearest the 15th'],

  // monthly / month
  ['0 0 1 6 *', 'at midnight on June 1'],
  ['0 0 1 1,7 *', 'at midnight on January 1 and July 1'],
  ['0 0 1 6-8 *',
    'at midnight on the 1st of each month from June through August'],
  ['0 0 1 6-8,12 *',
    'at midnight on the 1st of each month from June through August and ' +
    'on December 1'],
  ['0 0 1 */3 *', 'at midnight on January 1, April 1, July 1, and October 1'],
  ['0 0 1 1-11 *', 'at midnight on the 1st of every month except December'],

  // monthly / weekday
  ['0 0 1 * 0', 'at midnight on the 1st as well as on Sundays'],
  ['0 0 1 * 1,3,5',
    'at midnight on the 1st as well as on Mondays, Wednesdays, and Fridays'],
  ['0 0 1 * 0,6', 'at midnight on the 1st as well as on weekends'],
  ['0 0 1 * 1-6', 'at midnight on the 1st as well as Monday through Saturday'],
  ['0 0 1 * 5L',
    'at midnight on the 1st as well as on the last Friday of the month'],
  ['0 0 1 * 1#2',
    'at midnight on the 1st as well as on the second Monday of the month'],

  // open / second — context `* * * * *`
  ['30 * * * * *',
    'at 30 seconds past the minute'],
  ['0,30 * * * * *', 'every 30 seconds'],
  ['*/15 * * * * *', 'every 15 seconds'],
  ['0-9 * * * * *', 'every second for the first 10 seconds of every minute'],

  // open / minute
  ['30 * * * *',
    'at 30 minutes past the hour'],
  ['0,30 * * * *', 'every 30 minutes'],
  ['0-29 * * * *', 'every minute for the first 30 minutes of every hour'],
  ['0-29,45 * * * *',
    'every minute from 0 through 29 and at 45 minutes past the hour'],
  ['*/7 * * * *',
    'every 7 minutes from 0 through 56 minutes past the hour'],
  ['5/15 * * * *',
    'every 15 minutes from 5 through 50 minutes past the hour'],
  ['10-40/10 * * * *',
    'every 10 minutes from 10 through 40 minutes past the hour'],

  // open / hour
  ['* 12 * * *', 'every minute during the noon hour every day'],
  ['* 8,12,18 * * *',
    'every minute during the 8 a.m., noon, and 6 p.m. hours every day'],
  ['* 9-17 * * *', 'every minute from 9 a.m. until 6 p.m. every day'],
  ['* */2 * * *', 'every minute during every other hour'],
  ['* */6 * * *', 'every minute for one hour every 6 hours'],
  [`* ${EVEN_HOURS_BUT_8} * * *`,
    'every minute during every other hour except the 8 a.m. hour'],
  ['* 22-2 * * *', 'every minute from 10 p.m. until 3 a.m. every day'],

  // open / date
  ['* * 15 * *', 'every minute on the 15th'],
  ['* * 1,15 * *', 'every minute on the 1st and 15th'],
  ['* * 1-7 * *', 'every minute on the 1st through the 7th'],
  ['* * 1-7,15 * *',
    'every minute on the 1st through the 7th and on the 15th'],
  ['* * 2/2 * *', 'every minute on even-numbered days'],
  ['* * */5 * *', 'every minute every 5 days from the 1st'],
  ['* * L * *', 'every minute on the last day of the month'],
  ['* * 15W * *', 'every minute on the weekday nearest the 15th'],

  // open / month
  ['* * * 6 *', 'every minute in June'],
  ['* * * 1,7 *', 'every minute in January and July'],
  ['* * * 6-8 *', 'every minute in June through August'],
  ['* * * 6-8,12 *', 'every minute in June through August and in December'],
  ['* * * */3 *', 'every minute in January, April, July, and October'],
  ['* * * 1-11 *', 'every minute in every month except December'],

  // open / weekday
  ['* * * * 0', 'every minute on Sundays'],
  ['* * * * 1,3,5', 'every minute on Mondays, Wednesdays, and Fridays'],
  ['* * * * 0,6', 'every minute on weekends'],
  ['* * * * 1-6', 'every minute Monday through Saturday'],
  ['* * * * 5L', 'every minute on the last Friday of the month'],
  ['* * * * 1#2', 'every minute on the second Monday of the month']
];

export {rows};
