// English paradigms the grid does not reach: years, Quartz forms, macros,
// the sentence wrapper, a union under a month, wrap-arounds, and the
// places where two devices compete. A row's third element is the options
// it is rendered with.
//
// Written by hand from src/lang/en/answers.md. Never produced by running a
// renderer.

const rows = [
  // Years.
  ['0 0 1 1 * 2030',
    'at midnight on January 1, 2030',
    {years: true}],
  ['0 0 0 1 1 * 2030,2035', 'at midnight on January 1 in 2030 and 2035'],
  ['0 0 0 1 1 * 2030-2035',
    'at midnight on January 1 in 2030 through 2035'],
  ['0 0 1 1 * */2', 'at midnight on January 1 in even-numbered years',
    {years: true}],
  ['30 0 9 1 6 * 2030', 'at 9:00:30 a.m. on June 1, 2030'],

  // Quartz forms.
  ['0 0 1 * ?', 'at midnight on the 1st', {cron: 'quartz'}],
  ['0 0 LW * *', 'at midnight on the last weekday of the month'],
  ['0 0 L-3 * *', 'at midnight 3 days before the last day of the month'],
  ['0 0 L 6 *', 'at midnight on the last day of June'],
  ['0 0 15W 6 *', 'at midnight on the weekday nearest June 15'],
  ['0 0 * 6 1#2', 'at midnight on the second Monday of June'],
  ['0 0 * 1,7 5L', 'at midnight on the last Friday of January and July'],

  // Macros and startup.
  ['@hourly', 'every hour'],
  ['@daily', 'at midnight every day'],
  ['@midnight', 'at midnight every day'],
  ['@weekly', 'at midnight on Sundays'],
  ['@monthly', 'at midnight on the 1st'],
  ['@yearly', 'at midnight on January 1'],
  ['@annually', 'at midnight on January 1'],
  ['@reboot', 'at system startup'],

  // The sentence wrapper: one full stop, however the description ends.
  ['0 9 * * *', 'Runs at 9 a.m. every day.', {form: 'sentence'}],
  ['0 1/2 * * *', 'Runs every 2 hours from 1 a.m.', {form: 'sentence'}],
  ['0 */2 * * *', 'Runs every 2 hours.', {form: 'sentence'}],
  ['@reboot', 'Runs at system startup.', {form: 'sentence'}],

  // A day of the month and a weekday, under a month.
  ['0 0 1 6 5', 'at midnight on June 1 as well as on Fridays in June'],
  ['0 0 1,15 1,7 1-5',
    'at midnight on the 1st and 15th as well as on weekdays, in January ' +
    'and July'],
  ['52 7-16 1,19,23,28 5-7 3-4',
    'every hour from 7:52 a.m. through 4:52 p.m. on the 1st, 19th, 23rd, ' +
    'and 28th as well as on Wednesdays and Thursdays, in May through July'],
  ['*/30 0-17 * * 2',
    'every 30 minutes from midnight through 5:30 p.m. on Tuesdays'],
  ['5,29,39 3-5 * 5 *',
    'at 5, 29, and 39 minutes past the hour from 3 a.m. through 5 a.m. ' +
    'every day in May'],
  ['* 4,7 * * *', 'every minute during the 4 a.m. and 7 a.m. hours every ' +
    'day'],
  ['9,14,47,56 * * * *', 'at 9, 14, 47, and 56 minutes past the hour'],

  // A single month with its dates.
  ['0 0 1,15 6 *', 'at midnight on June 1 and 15'],
  ['0 0 1,10,20 6 *', 'at midnight on June 1, 10, and 20'],
  ['0 0 1-7 6 *', 'at midnight on June 1 through 7'],
  ['0 0 1-7,15 6 *', 'at midnight on June 1 through 7 and on June 15'],
  ['0 0 */2 6 *', 'at midnight on odd-numbered days in June'],
  ['0 0 */5 6 *', 'at midnight every 5 days from June 1'],
  ['0 0 1 1,3 *', 'at midnight on January 1 and March 1'],

  // Weekday order and wrap-arounds.
  ['0 9 * * 5-1', 'at 9 a.m. Friday through Monday'],
  ['0 9 * * 2-4', 'at 9 a.m. Tuesday through Thursday'],
  ['0 9 * * 0,1', 'at 9 a.m. on Sundays and Mondays'],
  ['0 9 * * 0,5', 'at 9 a.m. on Fridays and Sundays'],
  ['0 9 * * */2', 'at 9 a.m. on Tuesdays, Thursdays, Saturdays, and Sundays'],
  ['0 9 * 11-2 *', 'at 9 a.m. every day in November through February'],
  ['* 22-23 * * *', 'every minute from 10 p.m. until midnight every day'],
  ['* 23 * * *', 'every minute during the 11 p.m. hour every day'],

  // Where a list of clock times competes with another device.
  ['0,30 9,17 * * *', 'every 30 minutes during the 9 a.m. and 5 p.m. hours ' +
    'every day'],
  ['5,20 9,17 * * *', 'at 9:05 a.m., 9:20 a.m., 5:05 p.m., and 5:20 p.m. ' +
    'every day'],
  ['5,20,45 9,17 * * *', 'at 5, 20, and 45 minutes past 9 a.m. and 5 p.m. ' +
    'every day'],
  ['5,20,45 11 * * *', 'at 11:05 a.m., 11:20 a.m., and 11:45 a.m. every day'],
  ['0 0,6,12,18 * * *', 'every 6 hours'],
  ['0 */8 * * *', 'every 8 hours'],
  ['0 */5 * * *', 'every 5 hours from midnight through 8 p.m. every day'],
  ['30 */2 * * *', 'at 30 minutes past the hour, every 2 hours'],
  ['30 */5 * * *',
    'at 30 minutes past the hour, every 5 hours from midnight through 8 ' +
    'p.m. every day'],
  ['15,45 * * * *',
    'at 15 and 45 minutes past the hour'],
  ['1 * * * *',
    'at 1 minute past the hour'],
  ['30 0 * * *', 'at 12:30 a.m. every day'],
  ['30 12 * * *', 'at 12:30 p.m. every day'],

  // Seconds joined to a clock time, and anchored.
  ['15 30 9 * * *', 'at 9:30:15 a.m. every day'],
  ['15 30 9,17 * * *', 'at 9:30:15 a.m. and 5:30:15 p.m. every day'],
  ['15,45 30 9 * * *', 'at 9:30:15 a.m. and 9:30:45 a.m. every day'],
  ['* * 9 * * *', 'every second during the 9 a.m. hour every day'],
  ['* * 9-17 * * *', 'every second from 9 a.m. until 6 p.m. every day'],

  // Complex patterns, where several fields are restricted at once. Each
  // was read against the most widely used library's wording and the
  // renderer this one replaced, and is the easiest of the three to parse.
  ['23 0-20/2 * * *',
    'at 23 minutes past the hour, every 2 hours from midnight through 8 ' +
    'p.m. every day'],
  ['15,45 */4 * * *', 'at 15 and 45 minutes past the hour, every 4 hours'],
  ['5,20 */2 * * *', 'at 5 and 20 minutes past the hour, every 2 hours'],
  ['5-10,20 9-17/2 * * *',
    'every minute from 5 through 10 and at 20 minutes past the hour, every ' +
    '2 hours from 9 a.m. through 5 p.m. every day'],
  ['*/10 6-8,17-19 * * 1-5',
    'every 10 minutes from 6 a.m. through 8:50 a.m. and from 5 p.m. ' +
    'through 7:50 p.m. on weekdays'],
  ['0 0-6,22,23 * * *', 'every hour from 10 p.m. through 6 a.m. every day'],
  ['*/15 0-5,22-23 * * *',
    'every 15 minutes from 10 p.m. through 5:45 a.m. every day'],
  ['*/20 */2 */2 */3 *',
    'every 20 minutes during every other hour on odd-numbered days in ' +
    'January, April, July, and October'],
  ['7 4-22/6 1 */2 *',
    'at 7 minutes past the hour, every 6 hours from 4 a.m. on the 1st of ' +
    'every other month'],
  ['0 12 1-5,10,20-25 * *',
    'at noon on the 1st through the 5th, on the 10th, and on the 20th ' +
    'through the 25th'],
  ['0 6,18 1-7,15-21 * *',
    'at 6 a.m. and 6 p.m. on the 1st through the 7th and on the 15th ' +
    'through the 21st'],
  ['0 9-17/2 * 1-6 1-5',
    'every 2 hours from 9 a.m. through 5 p.m. on weekdays in January ' +
    'through June'],
  ['0 18 15W 3,6,9,12 *',
    'at 6 p.m. on the weekday nearest March 15, June 15, September 15, ' +
    'and December 15'],
  ['0,30 8-18/2 1,15 * 1-5',
    'every 30 minutes during the 8 a.m., 10 a.m., noon, 2 p.m., 4 ' +
    'p.m., and 6 p.m. hours on the 1st and 15th as well as on ' +
    'weekdays'],
  ['* 8-18/2 * * *',
    'every minute during the 8 a.m., 10 a.m., noon, 2 p.m., 4 p.m., and 6 ' +
    'p.m. hours every day'],
  ['15,45 */4 1-10 1,4,7,10 *',
    'at 15 and 45 minutes past the hour, every 4 hours on the 1st through ' +
    'the 10th of January, April, July, and October'],
  ['0 0 * * 1-7/2', 'at midnight on Mondays, Wednesdays, Fridays, and Sundays'],
  ['0 9 * * 0,2-4',
    'at 9 a.m. on Tuesdays, Wednesdays, Thursdays, and Sundays'],
  ['0 9 * * 0,2-5', 'at 9 a.m. Tuesday through Friday and on Sundays'],
  ['30 4 1-7 * 1',
    'at 4:30 a.m. on the 1st through the 7th as well as on Mondays'],
  ['59 23 31 12 *', 'at 11:59 p.m. on December 31'],
  ['0 2 29 2 *', 'at 2 a.m. on February 29'],

  // Sentences that were well formed and said the wrong schedule, found by
  // an independent review.
  ['5-10/60 0 9 * * *', 'at 9:00:05 a.m. every day'],
  ['0 0,1,22,23 * * 1', 'at midnight, 1 a.m., 10 p.m., and 11 p.m. on Mondays'],
  ['0 0 30-2 6 *', 'at midnight on June 1, 2, 30, and 31'],
  ['0 0 * 11-2 * 2030',
    'at midnight every day in January, February, November, and December in ' +
      '2030',
    {years: true}],
  ['0-28,30-59 9,17 * * *',
    'every minute during the 9 a.m. and 5 p.m. hours except at 29 minutes ' +
    'past the hour every day'],
  ['0-28,30-59 9 * * *',
    'every minute during the 9 a.m. hour except at 29 minutes past the ' +
      'hour every day'],
  ['0,10,20,40,50 9-17 * * *',
    'every 10 minutes from 9 a.m. through 5:50 p.m. except at 30 minutes ' +
    'past the hour every day'],
  ['0-28,30-59 * * * *', 'every minute except at 29 minutes past the hour'],
  ['* 0-28,30-59 * * * *',
    'every second except during the minute at 29 minutes past the hour'],
  ['*/15 8-18/2 * * *',
    'every 15 minutes during the 8 a.m., 10 a.m., noon, 2 p.m., 4 p.m., ' +
    'and 6 p.m. hours every day'],
  ['*/15 8-20/2 * * *',
    'every 15 minutes during the 8 a.m., 10 a.m., noon, 2 p.m., 4 p.m., 6 ' +
    'p.m., and 8 p.m. hours every day'],
  ['0 0-2,4-23 * * *', 'every hour except at 3 a.m.'],
  ['30 0-2,4-23 * * *', 'at 30 minutes past every hour except 3 a.m.'],
  ['30 0 * * * *', 'at 30 seconds past every hour'],
  ['0-9 0 * * * *', 'every second for the first 10 seconds of every hour'],
  ['0,2-59 * * * *', 'every minute except at 1 minute past the hour'],

  // A few seconds inside named minutes are clock times, as a few minutes
  // inside named hours are.
  ['0,30 30 9 * * *', 'at 9:30 a.m. and 9:30:30 a.m. every day'],
  ['0,20,40 0 9 * * *', 'every 20 seconds from 9:00 a.m. until 9:01 a.m. ' +
    'every day'],
  ['*/15 0 9 * * *', 'every 15 seconds from 9:00 a.m. until 9:01 a.m. ' +
    'every day'],

  // A run of seconds names its last second: a blind reader took "until
  // 9:00:10" to include it.
  ['10-20 30 9 * * *', 'every second from 9:30:10 a.m. through 9:30:20 ' +
    'a.m. every day'],

  // What has to be worked out, not only what has to be held. An hour
  // cadence stays round and the minute is said apart from it; two hours
  // are two exact times; an exception must replace more than four items.
  ['23 */6 * * *', 'at 23 minutes past the hour, every 6 hours'],
  ['23 1/2 * * *', 'at 23 minutes past the hour, every 2 hours from 1 a.m.'],
  ['23 */12 * * *', 'at 12:23 a.m. and 12:23 p.m. every day'],
  ['23 0,12 * * *', 'at 12:23 a.m. and 12:23 p.m. every day'],
  ['0 1/12 * * *', 'at 1 a.m. and 1 p.m. every day'],
  ['*/15 */12 * * *',
    'every 15 minutes during the midnight and noon hours every day'],
  ['0 0,6,18 * * *', 'at midnight, 6 a.m., and 6 p.m. every day'],
  ['0 9 * * 1,2,3,5',
    'at 9 a.m. on Mondays, Tuesdays, Wednesdays, and Fridays'],

  // The one declared tie: hours 0 and 12 on the hour follow the spelling.
  ['0 */12 * * *', 'every 12 hours'],
  ['0 0/12 * * *', 'every 12 hours'],
  ['0 0,12 * * *', 'at midnight and noon every day'],
  ['0 */12 1 * *', 'every 12 hours on the 1st'],
  ['15 0 */12 * * *', 'at 12:00:15 a.m. and 12:00:15 p.m. every day'],
  ['0 0,12 1 * *', 'at midnight and noon on the 1st'],

  // "Every day" fills the level a restricted hour would otherwise skip,
  // and is not said of a schedule that runs round the clock.
  ['0 0 9 * * * 2030', 'at 9 a.m. every day in 2030'],
  ['0 0 9 * * * 2028-2031', 'at 9 a.m. every day in 2028 through 2031'],
  ['0 9 * 1-11 *', 'at 9 a.m. every day in every month except December'],
  ['*/5 * * 6 *', 'every 5 minutes in June'],
  ['*/5 * * * * 2030', 'every 5 minutes in 2030', {years: true}],
  ['0 */6 * 6 *', 'every 6 hours in June'],
  ['0 1/2 * * *', 'every 2 hours from 1 a.m.'],
  ['30 * * 6 *', 'at 30 minutes past the hour in June'],
  ['0 9 L * *', 'at 9 a.m. on the last day of the month'],

  // From the second blind ranking: patterns with seconds, years and
  // Quartz forms, as the rules above now say them.
  ['*/10 24 */3 23-25 * 1-2',
    'every 10 seconds for one minute at 24 minutes past the hour, every 3 ' +
    'hours on the 23rd through the 25th as well as on Mondays and Tuesdays'],
  ['*/30 23 */12 * 6-7 6#2 2030/4',
    'every 30 seconds for one minute at 12:23 a.m. and 12:23 p.m. on the ' +
    'second Saturday of June and July every 4 years from 2030'],
  ['0 35 2,15 * * * 2028,2030',
    'at 2:35 a.m. and 3:35 p.m. every day in 2028 and 2030'],
  ['0 0,6 * * 3-4 6 2033/2',
    'at 0 and 6 minutes past the hour on Saturdays in March and April ' +
    'every other year from 2033'],
  ['* 30,42 3-10 * 7,9,10,12 1,3,4,5',
    'every second for one minute at 30 and 42 minutes past the hour from 3 ' +
    'a.m. through 10 a.m. on Mondays, Wednesdays, Thursdays, and Fridays ' +
    'in July, September, October, and December'],
  ['*/30 */5 * * 1-6 *',
    'every 30 seconds for one minute every 5 minutes in January through ' +
    'June'],
  ['0 */5 * 25-29 10 * 2030',
    'every 5 minutes on October 25 through 29 in 2030'],
  ['*/10 6-11 L-7 */6 *',
    'every 10 minutes from 6 a.m. through 11:50 a.m. 7 days before the ' +
    'last day of January and July']
];

export {rows};
