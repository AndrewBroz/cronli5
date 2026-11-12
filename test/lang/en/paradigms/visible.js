// English paradigms a renderer's builder may see: one row per visible
// pattern of the grid (test/paradigms/grid.js), grouped by family. Each
// family holds a context steady and varies one field, so reading a family
// top to bottom should show only that field's phrase changing.
//
// Written by hand from src/lang/en/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *', 'every second from 9:00 a.m. until 9:01 a.m.'],
  ['*/6 0 9 * * *',
    'every 6 seconds from 9:00 a.m. until 9:01 a.m.'],
  ['5/10 0 9 * * *',
    'every 10 seconds from 9:00:05 a.m. through 9:00:55 a.m.'],

  // clock / minute
  ['* 9 * * *', 'every minute during the 9 a.m. hour'],
  ['5,20,45 9 * * *', 'at 9:05 a.m., 9:20 a.m., and 9:45 a.m.'],
  ['*/15 9 * * *', 'every 15 minutes during the 9 a.m. hour'],
  ['0,15,45 9 * * *', 'at 9 a.m., 9:15 a.m., and 9:45 a.m.'],

  // clock / hour
  ['0 * * * *', 'every hour'],
  ['0 9,17 * * *', 'at 9 a.m. and 5 p.m.'],
  ['0 9-17,22 * * *', 'every hour from 9 a.m. through 5 p.m. and at 10 p.m.'],
  ['0 1/2 * * *', 'every 2 hours from 1 a.m.'],

  // clock / date
  ['0 9 1 * *', 'at 9 a.m. on the 1st'],
  ['0 9 1,10,20 * *', 'at 9 a.m. on the 1st, 10th, and 20th'],
  ['0 9 */2 * *', 'at 9 a.m. on odd-numbered days'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'at 9 a.m. on odd-numbered days except the 15th'],

  // clock / month
  ['0 9 * 1 *', 'at 9 a.m. in January'],
  ['0 9 * 3,6,9,12 *', 'at 9 a.m. in March, June, September, and December'],
  ['0 9 * */2 *',
    'at 9 a.m. in January, March, May, July, September, and November'],
  ['0 9 * 11-2 *', 'at 9 a.m. from November through February'],

  // clock / weekday
  ['0 9 * * 1', 'at 9 a.m. on Mondays'],
  ['0 9 * * 1-5', 'at 9 a.m. on weekdays'],
  ['0 9 * * 2,4', 'at 9 a.m. on Tuesdays and Thursdays'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'every second for one minute every 15 minutes from 9 a.m. through ' +
    '5:45 p.m. on weekdays'],
  ['*/6 */15 9-17 * * 1-5',
    'every 6 seconds for one minute every 15 minutes from 9 a.m. ' +
    'through 5:45 p.m. on weekdays'],
  ['5/10 */15 9-17 * * 1-5',
    'every 10 seconds from 5 through 55 seconds past the minute, every ' +
    '15 minutes from 9 a.m. through 5:45 p.m. on weekdays'],

  // window / minute
  ['* 9-17 * * 1-5', 'every minute from 9 a.m. until 6 p.m. on weekdays'],
  ['0,30 9-17 * * 1-5',
    'every 30 minutes from 9 a.m. through 5:30 p.m. on weekdays'],
  ['0-29,45 9-17 * * 1-5',
    'every minute from 0 through 29 and at 45 minutes past the hour ' +
    'from 9 a.m. through 5 p.m. on weekdays'],
  ['0,15,45 9-17 * * 1-5',
    'at 0, 15, and 45 minutes past the hour from 9 a.m. through 5 p.m. ' +
    'on weekdays'],

  // window / hour
  ['*/15 * * * 1-5', 'every 15 minutes on weekdays'],
  ['*/15 12 * * 1-5', 'every 15 minutes during the noon hour on weekdays'],
  ['*/15 9-17,22 * * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. and during the 10 ' +
    'p.m. hour on weekdays'],
  ['*/15 1/2 * * 1-5',
    'every 15 minutes during every other hour from 1 a.m. on weekdays'],

  // window / date
  ['*/15 9-17 1 * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on the 1st as well ' +
    'as on weekdays'],
  ['*/15 9-17 1,10,20 * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on the 1st, 10th, ' +
    'and 20th as well as on weekdays'],
  ['*/15 9-17 */2 * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on odd-numbered ' +
    'days as well as on weekdays'],
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on odd-numbered ' +
    'days except the 15th as well as on weekdays'],

  // window / month
  ['*/15 9-17 * 1 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays in ' +
    'January'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays in ' +
    'March, June, September, and December'],
  ['*/15 9-17 * */2 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays in ' +
    'January, March, May, July, September, and November'],
  ['*/15 9-17 * 11-2 1-5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays from ' +
    'November through February'],

  // window / weekday
  ['*/15 9-17 * * *',
    'every 15 minutes from 9 a.m. through 5:45 p.m.'],
  ['*/15 9-17 * * 1,3,5',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on Mondays, ' +
    'Wednesdays, and Fridays'],
  ['*/15 9-17 * * 2,4',
    'every 15 minutes from 9 a.m. through 5:45 p.m. on Tuesdays and ' +
    'Thursdays'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *', 'every second from midnight until 12:01 a.m. on the 1st'],
  ['*/6 0 0 1 * *',
    'every 6 seconds from midnight until 12:01 a.m. on the 1st'],
  ['5/10 0 0 1 * *',
    'every 10 seconds from 12:00:05 a.m. through 12:00:55 a.m. on the ' +
    '1st'],

  // monthly / minute
  ['* 0 1 * *', 'every minute during the midnight hour on the 1st'],
  ['5,20,45 0 1 * *', 'at 12:05 a.m., 12:20 a.m., and 12:45 a.m. on the 1st'],
  ['*/15 0 1 * *', 'every 15 minutes during the midnight hour on the 1st'],
  ['0,15,45 0 1 * *', 'at midnight, 12:15 a.m., and 12:45 a.m. on the 1st'],

  // monthly / hour
  ['0 * 1 * *', 'every hour on the 1st'],
  ['0 9,17 1 * *', 'at 9 a.m. and 5 p.m. on the 1st'],
  ['0 9-17,22 1 * *',
    'every hour from 9 a.m. through 5 p.m. and at 10 p.m. on the 1st'],
  ['0 1/2 1 * *', 'every 2 hours from 1 a.m. on the 1st'],

  // monthly / date
  ['0 0 * * *', 'at midnight'],
  ['0 0 1,10,20 * *', 'at midnight on the 1st, 10th, and 20th'],
  ['0 0 */2 * *', 'at midnight on odd-numbered days'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'at midnight on odd-numbered days except the 15th'],

  // monthly / month
  ['0 0 1 1 *', 'at midnight on January 1'],
  ['0 0 1 3,6,9,12 *',
    'at midnight on March 1, June 1, September 1, and December 1'],
  ['0 0 1 */2 *', 'at midnight on the 1st of every other month'],
  ['0 0 1 11-2 *',
    'at midnight on the 1st of each month from November through February'],

  // monthly / weekday
  ['0 0 1 * 1', 'at midnight on the 1st as well as on Mondays'],
  ['0 0 1 * 1-5', 'at midnight on the 1st as well as on weekdays'],
  ['0 0 1 * 2,4',
    'at midnight on the 1st as well as on Tuesdays and Thursdays'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'every second'],
  ['*/6 * * * * *', 'every 6 seconds'],
  ['5/10 * * * * *',
    'every 10 seconds from 5 through 55 seconds past the minute'],

  // open / minute
  ['5,20,45 * * * *',
    'at 5, 20, and 45 minutes past the hour'],
  ['*/15 * * * *', 'every 15 minutes'],
  ['0,15,45 * * * *',
    'at 0, 15, and 45 minutes past the hour'],

  // open / hour
  ['* 0 * * *', 'every minute during the midnight hour'],
  ['* 9,17 * * *', 'every minute during the 9 a.m. and 5 p.m. hours'],
  ['* 9-17,22 * * *',
    'every minute from 9 a.m. until 6 p.m. and during the 10 p.m. hour'],
  ['* 1/2 * * *', 'every minute during every other hour from 1 a.m.'],

  // open / date
  ['* * 1 * *', 'every minute on the 1st'],
  ['* * 1,10,20 * *', 'every minute on the 1st, 10th, and 20th'],
  ['* * */2 * *', 'every minute on odd-numbered days'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'every minute on odd-numbered days except the 15th'],

  // open / month
  ['* * * 1 *', 'every minute in January'],
  ['* * * 3,6,9,12 *', 'every minute in March, June, September, and December'],
  ['* * * */2 *',
    'every minute in January, March, May, July, September, and November'],
  ['* * * 11-2 *', 'every minute from November through February'],

  // open / weekday
  ['* * * * 1', 'every minute on Mondays'],
  ['* * * * 1-5', 'every minute on weekdays'],
  ['* * * * 2,4', 'every minute on Tuesdays and Thursdays']
];

export {rows};
