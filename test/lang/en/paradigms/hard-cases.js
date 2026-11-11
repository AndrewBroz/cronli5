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
    'at midnight on January 1 from 2030 through 2035'],
  ['0 0 1 1 * */2', 'at midnight on January 1 in even-numbered years',
    {years: true}],
  ['30 0 9 1 6 * 2030', 'at 9:00:30 a.m. on June 1, 2030'],

  // Quartz forms.
  ['0 0 1 * ?', 'at midnight on the 1st', {quartz: true}],
  ['0 0 LW * *', 'at midnight on the last weekday of the month'],
  ['0 0 L-3 * *', 'at midnight 3 days before the last day of the month'],
  ['0 0 L 6 *', 'at midnight on the last day of June'],
  ['0 0 15W 6 *', 'at midnight on the weekday nearest June 15'],
  ['0 0 * 6 1#2', 'at midnight on the second Monday of June'],
  ['0 0 * 1,7 5L', 'at midnight on the last Friday of January and July'],

  // Macros and startup.
  ['@hourly', 'every hour'],
  ['@daily', 'at midnight'],
  ['@midnight', 'at midnight'],
  ['@weekly', 'at midnight on Sundays'],
  ['@monthly', 'at midnight on the 1st'],
  ['@yearly', 'at midnight on January 1'],
  ['@annually', 'at midnight on January 1'],
  ['@reboot', 'at system startup'],

  // The sentence wrapper: one full stop, however the description ends.
  ['0 9 * * *', 'Runs at 9 a.m.', {sentence: true}],
  ['0 */2 * * *', 'Runs every 2 hours.', {sentence: true}],
  ['@reboot', 'Runs at system startup.', {sentence: true}],

  // A day of the month and a weekday, under a month.
  ['0 0 1 6 5', 'at midnight on June 1 as well as on Fridays in June'],
  ['0 0 1,15 1,7 1-5',
    'at midnight on the 1st and 15th of January and July as well as on ' +
    'weekdays in January and July'],

  // A single month with its dates.
  ['0 0 1,15 6 *', 'at midnight on June 1 and 15'],
  ['0 0 1,10,20 6 *', 'at midnight on June 1, 10, and 20'],
  ['0 0 1-7 6 *', 'at midnight from June 1 through 7'],
  ['0 0 1-7,15 6 *', 'at midnight from June 1 through 7 and on June 15'],
  ['0 0 */2 6 *', 'at midnight on odd-numbered days in June'],
  ['0 0 */5 6 *', 'at midnight every 5 days from June 1'],
  ['0 0 1 1,3 *', 'at midnight on January 1 and March 1'],

  // Weekday order and wrap-arounds.
  ['0 9 * * 5-1', 'at 9 a.m. Friday through Monday'],
  ['0 9 * * 2-4', 'at 9 a.m. Tuesday through Thursday'],
  ['0 9 * * 0,1', 'at 9 a.m. on Sundays and Mondays'],
  ['0 9 * * 0,5', 'at 9 a.m. on Fridays and Sundays'],
  ['0 9 * * */2', 'at 9 a.m. on Tuesdays, Thursdays, Saturdays, and Sundays'],
  ['0 9 * 11-2 *', 'at 9 a.m. from November through February'],
  ['* 22-23 * * *', 'every minute from 10 p.m. until midnight'],
  ['* 23 * * *', 'every minute during the 11 p.m. hour'],

  // Where a list of clock times competes with another device.
  ['0,30 9,17 * * *', 'every 30 minutes during the 9 a.m. and 5 p.m. hours'],
  ['5,20 9,17 * * *', 'at 9:05 a.m., 9:20 a.m., 5:05 p.m., and 5:20 p.m.'],
  ['5,20,45 9,17 * * *', 'at 5, 20, and 45 minutes past 9 a.m. and 5 p.m.'],
  ['5,20,45 11 * * *', 'at 11:05, 11:20, and 11:45 a.m.'],
  ['0 0,12 * * *', 'every 12 hours'],
  ['0 */8 * * *', 'every 8 hours'],
  ['0 */5 * * *', 'every 5 hours from midnight through 8 p.m.'],
  ['30 */2 * * *', 'every 2 hours from 12:30 a.m.'],
  ['30 */5 * * *', 'every 5 hours from 12:30 a.m. through 8:30 p.m.'],
  ['15,45 * * * *', 'at 15 and 45 minutes past every hour'],
  ['1 * * * *', 'at 1 minute past every hour'],
  ['30 0 * * *', 'at 12:30 a.m.'],
  ['30 12 * * *', 'at 12:30 p.m.'],

  // Seconds joined to a clock time, and anchored.
  ['15 30 9 * * *', 'at 9:30:15 a.m.'],
  ['15 30 9,17 * * *', 'at 9:30:15 a.m. and 5:30:15 p.m.'],
  ['15,45 30 9 * * *', 'at 15 and 45 seconds past the minute, at 9:30 a.m.'],
  ['* * 9 * * *', 'every second during the 9 a.m. hour'],
  ['* * 9-17 * * *', 'every second from 9 a.m. until 6 p.m.']
];

export {rows};
