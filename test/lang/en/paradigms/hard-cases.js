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
  ['0 0 1W * *', 'at midnight on the first weekday of the month'],
  ['0 0 1W 6 *', 'at midnight on the first weekday of June'],
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
  // "Every 5 days from June 1" was a row here: it reads as starting on
  // June 1 and carrying on, when the schedule stops with June. So did
  // "every 5 days from the 1st in June", less badly: a cadence of days
  // says that it starts again each month.
  ['0 0 */5 6 *', 'at midnight every 5 days from the 1st of the month in June'],
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
    'every 30 minutes during every other hour from the 8 a.m. hour ' +
    'through the 6 p.m. hour on the 1st and 15th as well as on weekdays'],
  ['* 8-18/2 * * *',
    'every minute during every other hour from the 8 a.m. hour through ' +
    'the 6 p.m. hour every day'],
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
  // February 29 comes in leap years only, and the sentence says so.
  ['0 2 29 2 *', 'at 2 a.m. on February 29 in leap years'],

  // Sentences that were well formed and said the wrong schedule, found by
  // an independent review.
  ['5-10/60 0 9 * * *', 'at 9:00:05 a.m. every day'],
  ['0 0,1,22,23 * * 1', 'at midnight, 1 a.m., 10 p.m., and 11 p.m. on Mondays'],
  // This row named June 31, a day that does not exist.
  ['0 0 30-2 6 *', 'at midnight on June 1, 2, and 30'],
  ['0 0 * 11-2 * 2030',
    'at midnight every day in January, February, November, and December in ' +
      '2030',
    {years: true}],
  ['0-28,30-59 9,17 * * *',
    'every minute during the 9 a.m. and 5 p.m. hours except at 29 minutes ' +
    'past the hour, every day'],
  ['0-28,30-59 9 * * *',
    'every minute during the 9 a.m. hour except at 29 minutes past the ' +
      'hour, every day'],
  ['0,10,20,40,50 9-17 * * *',
    'every 10 minutes from 9 a.m. through 5:50 p.m. except at 30 minutes ' +
    'past the hour, every day'],
  ['0-28,30-59 * * * *', 'every minute except at 29 minutes past the hour'],
  ['* 0-28,30-59 * * * *',
    'every second except during the minute at 29 minutes past the hour'],
  ['*/15 8-18/2 * * *',
    'every 15 minutes during every other hour from the 8 a.m. hour ' +
    'through the 6 p.m. hour every day'],
  ['*/15 8-20/2 * * *',
    'every 15 minutes during every other hour from the 8 a.m. hour ' +
    'through the 8 p.m. hour every day'],
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
    'second Saturday of June and July of every 4th year from 2030'],
  ['0 35 2,15 * * * 2028,2030',
    'at 2:35 a.m. and 3:35 p.m. every day in 2028 and 2030'],
  ['0 0,6 * * 3-4 6 2033/2',
    'at 0 and 6 minutes past the hour on Saturdays in March and April ' +
    'of every other year from 2033'],
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
    'last day of January and July'],

  // A cadence of years hangs on the day with "of", so it always has a
  // day to hang on; every second year is "every other", and beyond that
  // the interval is an ordinal.
  ['0 0 9 * * * 2030/2', 'at 9 a.m. every day of every other year from 2030'],
  ['0 0 9 * * * 2030/3', 'at 9 a.m. every day of every 3rd year from 2030'],
  ['0 0 9 * * * 2028/4', 'at 9 a.m. every day of every 4th year from 2028'],
  ['0 0 9 * * * 2030-2040/2',
    'at 9 a.m. every day of every other year from 2030 through 2040'],
  ['0 0 0 1 1 * 2028/4',
    'at midnight on January 1 of every 4th year from 2028'],
  ['0 0 9 * 6 * 2030/2',
    'at 9 a.m. every day in June of every other year from 2030'],
  ['0 0 9 * * 1 2030/2', 'at 9 a.m. on Mondays of every other year from 2030'],
  ['0 0 9 L * * 2028/4',
    'at 9 a.m. on the last day of the month of every 4th year from 2028'],
  ['0 */5 * * * * 2028/4',
    'every 5 minutes every day of every 4th year from 2028'],
  ['0 */5 * * 6 * 2028/4',
    'every 5 minutes every day in June of every 4th year from 2028'],
  ['0 0 9 * * * */2', 'at 9 a.m. every day in even-numbered years'],
  ['0 */5 * * * * */2', 'every 5 minutes in even-numbered years'],

  // One month and one year are said together, as a full date is.
  ['0 0 9 * 6 * 2030', 'at 9 a.m. every day in June 2030'],
  ['0 0 9 * 6 1 2030', 'at 9 a.m. on Mondays in June 2030'],
  ['0 0 9 L 6 * 2030', 'at 9 a.m. on the last day of June 2030'],
  ['0 0 9 * 6 1#2 2030', 'at 9 a.m. on the second Monday of June 2030'],
  ['0 */5 * * 6 * 2030', 'every 5 minutes in June 2030'],
  ['0 0 9 * 6,7 * 2030', 'at 9 a.m. every day in June and July in 2030'],
  ['0 0 9 * 6-8 * 2030', 'at 9 a.m. every day in June through August in 2030'],
  ['0 0 9 * 6 * 2030,2031', 'at 9 a.m. every day in June in 2030 and 2031'],
  ['0 0 9 * 6 * 2030-2032', 'at 9 a.m. every day in June in 2030 through 2032'],
  ['0 0 9 1,15 6 * 2030', 'at 9 a.m. on June 1 and 15 in 2030'],
  // An exception is closed with a comma when anything follows it: without
  // one, the day after "except at 8 a.m." is heard as part of the
  // exception (every day, but not at 8 a.m. on the 1st).
  ['0 0-7,9-23 1 * *', 'every hour except at 8 a.m., on the 1st'],
  ['0 0-7,9-23 * * 1', 'every hour except at 8 a.m., on Mondays'],
  ['30 0-7,9-23 * 6 *', 'at 30 minutes past every hour except 8 a.m., in June'],
  ['* 0-7,9-23 1 * *',
    'every minute except during the 8 a.m. hour, on the 1st'],
  ['0-28,30-59 * * * 1',
    'every minute except at 29 minutes past the hour, on Mondays'],
  ['0-28,30-59 * * * * 1',
    'every second except at 29 seconds past the minute, on Mondays'],
  ['0 3-5,7-23 * * *',
    'every hour from 3 a.m. through 11 p.m. except at 6 a.m., every day'],
  // Beside an exception among the days of the month, the weekdays say
  // that they run whatever the date: "every day except the 15th, as well
  // as on Mondays" was read as losing a Monday the 15th.
  ['0 0 1-14,16-31 * 1',
    'at midnight on every day except the 15th, as well as on Mondays ' +
    'whatever the date'],
  ['0 0 1-14,16-31 6 1',
    'at midnight on every day in June except the 15th, as well as on ' +
    'Mondays in June whatever the date'],
  ['0 9 5-9,11-25 * 1',
    'at 9 a.m. on the 5th through the 25th except the 10th, as well as on ' +
    'Mondays whatever the date'],
  ['0 0 * 6 1-3,5-6',
    'at midnight Monday through Saturday except Thursday, in June'],
  ['0 0 1 1-5,7-12 * 2030',
    'at midnight on the 1st of every month except June, in 2030',
    {years: true}],
  ['0 0 * 1-5,7-12 * 2030',
    'at midnight every day in every month except June, in 2030',
    {years: true}],
  ['0 0 1-14,16-31 * * 2030',
    'at midnight on every day except the 15th, in 2030',
    {years: true}],
  ['0 0-7,9-23 1-14,16-31 * *',
    'every hour except at 8 a.m., on every day except the 15th'],
  // Beside a day of the month the weekdays take no exception: "on the
  // 1st as well as Monday through Saturday except Thursday" was read as
  // losing a Thursday the 1st.
  ['0 0 1 * 1-3,5-6',
    'at midnight on the 1st as well as Monday through Wednesday and on ' +
    'Fridays and Saturdays'],
  ['0 0 15 * 0-2,4-6',
    'at midnight on the 15th as well as Thursday through Tuesday'],
  ['0 0 1 1-11 1',
    'at midnight on the 1st as well as on Mondays, in every month except ' +
    'December'],
  // A second exception in the day part is set off as one is in the time.
  ['0 9 1-14,16-31 1-5,7-12 *',
    'at 9 a.m. on every day in every month except June, and except the ' +
    '15th'],

  // An exception yields a tie to every other phrasing, pieces included.
  ['0 0-3,6-9 * * *',
    'every hour from midnight through 3 a.m. and every hour from 6 a.m. ' +
    'through 9 a.m. every day'],

  // Minutes, seconds and days of the month are numbers, and a run of
  // numbers that wraps reads backwards: "from 50 through 10 minutes past
  // the hour from 9 a.m. through 5 p.m." was read as starting at 9:50 and
  // ending at 6:10, and "the 20th through the 10th" as a mistake.
  ['50-10 * * * *',
    'every minute from 0 through 10 and every minute from 50 through 59 ' +
    'minutes past the hour'],
  ['50-10 9-17 * * *',
    'every minute from 0 through 10 and every minute from 50 through 59 ' +
    'minutes past the hour from 9 a.m. through 5 p.m. every day'],
  ['50-10 * * * 1',
    'every minute from 0 through 10 and every minute from 50 through 59 ' +
    'minutes past the hour on Mondays'],
  ['50-10 * * * * *',
    'every second from 0 through 10 and every second from 50 through 59 ' +
    'seconds past the minute'],
  ['0 0 20-10 * *',
    'at midnight on the 1st through the 10th and on the 20th through the ' +
    '31st'],
  ['0 0 29-2 * *',
    'at midnight on the 1st and 2nd and on the 29th through the 31st'],
  ['0 0-5,17-23 * * *', 'every hour from 5 p.m. through 5 a.m. every day'],
  ['50-10 * 9 * * *',
    'every second from 0 through 10 and every second from 50 through 59 ' +
    'seconds past every minute during the 9 a.m. hour every day'],
  ['0 22-2 * * * 2030',
    'every hour from midnight through 2 a.m. and at 10 p.m. and 11 p.m. ' +
    'every day in 2030',
    {years: true}],

  // After "past the hour", an hour beside a range is named as an hour:
  // "…from 9 a.m. through 5 p.m. and at 10 p.m." was read as one more
  // firing at 10:00, and "except at noon" as sparing only 12:00.
  ['5,20,45 9-17,22 * * *',
    'at 5, 20, and 45 minutes past the hour from 9 a.m. through 5 p.m. ' +
    'and during the 10 p.m. hour every day'],
  ['5,20,45 1,9-17 * * *',
    'at 5, 20, and 45 minutes past the hour during the 1 a.m. hour and ' +
    'from 9 a.m. through 5 p.m. every day'],
  ['5,20,45 22-2 * * 1',
    'at 5, 20, and 45 minutes past the hour from midnight through 2 a.m. ' +
    'and during the 10 p.m. and 11 p.m. hours on Mondays'],
  ['5,20,45 9-11,13-17 * * *',
    'at 5, 20, and 45 minutes past the hour from 9 a.m. through 5 p.m. ' +
    'except during the noon hour, every day'],
  ['0-29 9-11,13-17 * * *',
    'every minute for the first 30 minutes of every hour from 9 a.m. ' +
    'through 5 p.m. except during the noon hour, every day'],

  // A cadence of days keeps its own words beside one month, and takes
  // "in": as a date its start was read as the start of a run with no end.
  ['0 0 8/2 6 *',
    'at midnight every 2 days from the 8th of the month in June'],
  ['0 0 5-20/3 6 *',
    'at midnight every 3 days from the 5th through the 20th of the month ' +
    'in June'],
  ['0 0 1,6,11,21,26,31 6 *',
    'at midnight every 5 days from the 1st of the month in June except ' +
    'the 16th'],
  ['0 0 */5 6 * 2030',
    'at midnight every 5 days from the 1st of the month in June 2030',
    {years: true}],
  ['0 0 */5 6 1',
    'at midnight every 5 days from the 1st of the month in June as well ' +
    'as on Mondays in June'],
  ['0 0 */5 6,7 *',
    'at midnight every 5 days from the 1st of the month in June and July'],

  // A cadence of years hangs on the day with "of"; a day of the month
  // with no month would be heard as a day of the year ("the 1st of every
  // other year"), so the month is said.
  ['0 0 1 * * 2030/2',
    'at midnight on the 1st of every month of every other year from 2030',
    {years: true}],
  ['0 0 1,15 * * 2030/4',
    'at midnight on the 1st and 15th of every month of every 4th year ' +
    'from 2030',
    {years: true}],
  ['0 0 */5 * * 2030/2',
    'at midnight every 5 days from the 1st of the month of every other ' +
    'year from 2030',
    {years: true}],
  ['0 0 */2 * * 2030/2',
    'at midnight on odd-numbered days in every month of every other year ' +
    'from 2030',
    {years: true}],
  ['0 0 15W * * 2030/2',
    'at midnight on the weekday nearest the 15th of every month of every ' +
    'other year from 2030',
    {years: true}],
  // Across a comma nothing hangs: the cadence of years takes "in", and
  // the day before it needs no month.
  ['0 0 1 * 1-5 2030/4',
    'at midnight on the 1st as well as on weekdays, in every 4th year ' +
    'from 2030',
    {years: true}],
  ['0 0 1-14,16-31 * * 2030/2',
    'at midnight on every day except the 15th, in every other year from ' +
    '2030',
    {years: true}],
  ['0 0 1 * * 2030,2031', 'at midnight on the 1st in 2030 and 2031',
    {years: true}],

  // The weekday nearest a day never leaves its month. Near a day that can
  // be a month's last, "the weekday nearest the 31st" would be taken for
  // the Monday after a Sunday the 31st, when it is the Friday before.
  ['0 0 31W * *',
    'at midnight on the weekday in the same month nearest the 31st'],
  ['0 0 28W * *',
    'at midnight on the weekday in the same month nearest the 28th'],
  ['0 0 27W * *', 'at midnight on the weekday nearest the 27th'],
  ['0 0 30W 6 *',
    'at midnight on the weekday in the same month nearest June 30'],

  // Under seconds, a stray minute beside a run of minutes says what the
  // seconds do in it: "and at 45 minutes past the hour" was read as one
  // firing at :45:00.
  ['* 0-29,45 * * * *',
    'every second from 0 through 29 and for one minute at 45 minutes past ' +
    'the hour'],
  ['* 5,10-40,50 * * * *',
    'every second for one minute at 5, every second from 10 through 40, ' +
    'and for one minute at 50 minutes past the hour'],
  ['30 0-29,45 * * * *',
    'at 30 seconds past the minute, every minute from 0 through 29 and at ' +
    '45 minutes past the hour'],
  ['15,45 0-29,45 9 * * *',
    'at 15 and 45 seconds past the minute, every minute from 9 a.m. until ' +
    '9:30 a.m. and at 9:45 a.m. every day'],

  // Seconds beside hours named on the hour, with no clock time to ride
  // on, are counted past the hour: "past the minute" names no minute
  // there, and standing alone it means every minute.
  ['30 0 */2 * * *', 'at 30 seconds past the hour, every 2 hours'],
  ['15,45 0 9-17 * * *',
    'at 15 and 45 seconds past the hour, every hour from 9 a.m. through 5 ' +
    'p.m. every day'],
  ['0-9 0 9-17 * * *',
    'every second for the first 10 seconds of the hour, every hour from 9 ' +
    'a.m. through 5 p.m. every day'],
  ['30 0 0-7,9-23 * * *',
    'at 30 seconds past the hour, every hour except at 8 a.m.'],
  ['15,45 30 9-17 * * *',
    'at 15 and 45 seconds past the minute, every hour from 9:30 a.m. ' +
    'through 5:30 p.m. every day'],

  // A schedule that can never run says so, and why. Nothing else is said.
  ['0 0 31 6 *', 'never, because there is no June 31'],
  ['0 0 30,31 2 *', 'never, because there is no February 30 or 31'],
  ['0 0 31 4,6 *', 'never, because there is no April 31 or June 31'],
  ['0 0 31 2,4,6 *',
    'never, because there is no February 31, April 31, or June 31'],
  ['0 0 0 29 2 * 2031', 'never, because there is no February 29 in 2031'],
  ['0 0 31W 6 *', 'never, because there is no June 31', {cron: 'quartz'}],
  ['0 0 L-30 6 *',
    'never, because no day is 30 days before the last day of June',
    {cron: 'quartz'}],
  ['0 0 31 6 *', 'never, because there is no 31 June', {lang: 'en-GB'}],
  ['0 0 31 6 *', 'Runs never, because there is no June 31.',
    {form: 'sentence'}],
  // Beside a weekday, a day of the month that never comes leaves the
  // weekday alone.
  ['0 0 31 6 1', 'at midnight on Mondays in June'],

  // A day that comes in leap years only.
  ['0 0 29 2 *', 'at midnight on February 29 in leap years'],
  ['0 0 29W 2 *',
    'at midnight on the weekday in the same month nearest February 29 in ' +
    'leap years',
    {cron: 'quartz'}],
  ['0 0 L-28 2 *',
    'at midnight 28 days before the last day of February in leap years',
    {cron: 'quartz'}],
  ['0 0 0 29 2 * 2030-2040',
    'at midnight on February 29 in 2030 through 2040, in leap years'],
  ['0 0 0 29 2 * 2032', 'at midnight on February 29, 2032'],

  // Only the months a day can fire in are named, and only the days those
  // months have. Under every month the day alone is enough.
  ['0 0 31W 6-8 *',
    'at midnight on the weekday in the same month nearest July 31 and ' +
    'August 31',
    {cron: 'quartz'}],
  ['0 0 30W 2,4 *',
    'at midnight on the weekday in the same month nearest April 30',
    {cron: 'quartz'}],
  ['0 0 L-30 6-8 *',
    'at midnight 30 days before the last day of July and August',
    {cron: 'quartz'}],
  ['0 0 30 2-3 *', 'at midnight on March 30'],
  ['0 0 1,31 4,6,9,11 *',
    'at midnight on April 1, June 1, September 1, and November 1'],
  ['0 0 25-31 6 *', 'at midnight on June 25 through 30'],
  ['0 0 31 * *', 'at midnight on the 31st'],
  ['0 0 */10 6 *',
    'at midnight every 10 days from the 1st of the month in June'],

  // Days that are every day of their months are no restriction, and no
  // union.
  ['0 9 1-30 6 *', 'at 9 a.m. every day in June'],
  ['0 9 1-30 4 1', 'at 9 a.m. every day in April'],
  ['0 9 1-29 2 *', 'at 9 a.m. every day in February'],
  ['0 9 1-28 2 *', 'at 9 a.m. on February 1 through 28'],
  ['0 9 1-31 * 1', 'at 9 a.m. every day'],

  // An exception is for a hole inside the hour or the minute. A run that
  // only starts late or stops early is a run: "during the 9 a.m. hour
  // except at 0 minutes past the hour" took back the moment it named.
  ['1-59 9 * * *', 'every minute from 9:01 a.m. until 10 a.m. every day'],
  ['1-59 * * * *', 'every minute for the last 59 minutes of every hour'],
  ['0-58 9-17 * * *',
    'every minute for the first 59 minutes of every hour from 9 a.m. ' +
    'through 5 p.m. every day'],
  ['1-59 * * * * *', 'every second for the last 59 seconds of every minute'],
  ['0 1-23 * * *', 'every hour except at midnight'],
  ['0 0 2-31 * *', 'at midnight on every day except the 1st'],

  // Years with no end, and years in several runs and cadences.
  ['0 0 9 * * * 2030/1', 'at 9 a.m. every day from 2030 onward'],
  ['0 0 0 1 1 * 2030/1', 'at midnight on January 1 from 2030 onward'],
  ['*/5 * * * * 2030/1', 'every 5 minutes from 2030 onward', {years: true}],
  ['0 0 9 * * * 2030/2,2031',
    'at 9 a.m. every day in every other year from 2030 and in 2031'],
  ['0 0 9 * * * 2030-2040,2045/5',
    'at 9 a.m. every day in 2030 through 2040 and in every 5th year from ' +
    '2045'],
  ['0 0 9 * * * 2030/4,2031/4',
    'at 9 a.m. every day in every 4th year from 2030 and in every 4th ' +
    'year from 2031'],
  ['0 0 9 * * * 2000-2028/2,2032-2098/2',
    'at 9 a.m. every day of every other year from 2000 through 2098 ' +
    'except 2030'],
  ['0 0 9 * * * 1970-2029,2031/1',
    'at 9 a.m. every day in every year except 2030'],

  // Runs and cadences together, where a list would be too long to hold.
  ['0-20/2,21-59/3 * * * *',
    'every 2 minutes from 0 through 20 and every 3 minutes from 21 ' +
    'through 57 minutes past the hour'],
  ['0 0-12/2,13-23/3 * * *',
    'every 2 hours from midnight through noon and every 3 hours from 1 ' +
    'p.m. through 10 p.m. every day'],
  ['0 0 1-10/2,11-31/3 * *',
    'at midnight every 2 days from the 1st through the 11th of the month ' +
    'and every 3 days from the 14th through the 29th of the month'],

  // A cadence of hours that stops early, under minutes: each end is
  // named as an hour.
  ['* 2/2 * * *',
    'every minute during every other hour from the 2 a.m. hour through ' +
    'the 10 p.m. hour every day'],
  ['* 0-12/3 * * *',
    'every minute during every 3rd hour from the midnight hour through ' +
    'the noon hour every day'],
  ['* 0-9/3 * * *',
    'every minute during every 3rd hour from the midnight hour through ' +
    'the 9 a.m. hour every day'],
  ['* 0,3,6 * * *',
    'every minute during the midnight, 3 a.m., and 6 a.m. hours every day'],

  // What follows several pieces, or a day of the month beside a weekday,
  // is set off by a comma: "in June through August and in December in
  // 2030" was read as December 2030 alone.
  ['0 0 9 * 6-8,12 * 2030',
    'at 9 a.m. every day in June through August and in December, in 2030'],
  ['0 0 0 1-5,10 * * 2030',
    'at midnight on the 1st through the 5th and on the 10th, in 2030'],
  ['0 0 0 1-5,10 6 * 2030',
    'at midnight on June 1 through 5 and on June 10, in 2030'],
  ['0 0 1-5,10 6,7 *',
    'at midnight on the 1st through the 5th and on the 10th, in June and ' +
    'July'],
  ['0 0 0 1 * 5 2030', 'at midnight on the 1st as well as on Fridays, in 2030'],
  ['0 9 * 6 0,2-5', 'at 9 a.m. Tuesday through Friday and on Sundays, in June'],
  ['0 0 9 * 6-8,12 * 2030/2',
    'at 9 a.m. every day in June through August and in December, in every ' +
    'other year from 2030'],

  // Under seconds a minute taken out is a whole minute, whatever the
  // seconds are.
  ['5/10 0-28,30-59 * * * *',
    'every 10 seconds from 5 through 55 seconds past every minute except ' +
    'during the minute at 29 minutes past the hour'],
  ['30 0-28,30-59 * * * *',
    'at 30 seconds past every minute except during the minute at 29 ' +
    'minutes past the hour'],

  // Rules the renderer followed before the answers said them (section 9).
  ['0 0 31 6-8 1',
    'at midnight on the 31st as well as on Mondays, in June through August'],
  ['0 0 29 2 1', 'at midnight on February 29 as well as on Mondays in February'],
  ['*/15,1 * * * *',
    'every 15 minutes from 0 through 45 and at 1 minute past the hour'],
  ['0-20/2,21-59/3 0 9 * * *',
    'every 2 seconds from 9:00:00 a.m. through 9:00:20 a.m. and every 3 ' +
    'seconds from 9:00:21 a.m. through 9:00:57 a.m. every day'],
  ['* 0,2,4,6,10,12,14,16 * * *',
    'every minute during every other hour from the midnight hour through ' +
    'the 4 p.m. hour except the 8 a.m. hour, every day'],
  ['* 0-12/2,13-23/3 * * *',
    'every minute during every other hour from the midnight hour through ' +
    'the noon hour and during every 3rd hour from the 1 p.m. hour through ' +
    'the 10 p.m. hour every day'],
  ['0 0 0 * * * 2030-2040,2045/1',
    'at midnight every day in 2030 through 2040 and from 2045 onward'],
  ['0 0 0 29 2 * 2031/4',
    'never, because there is no February 29 in any of the years named'],
  ['0-29,31-59 0-28,30-59 9,17 * * *',
    'every second during the 9 a.m. and 5 p.m. hours except during the ' +
    'minute at 29 minutes past the hour, and except at 30 seconds past the ' +
    'minute, every day']
];

export {rows};
