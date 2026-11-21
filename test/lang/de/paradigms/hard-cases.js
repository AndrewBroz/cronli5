// German hard cases: patterns outside the grid that reach rules the
// grid's ladders do not, or where several fields are restricted at once.
// A builder may see these.
//
// Written by hand from src/lang/de/answers.md. Never produced by running a
// renderer.

const rows = [
  // Years.
  ['0 0 1 1 * 2030', 'am 1. Januar 2030 um 0:00 Uhr', {years: true}],
  ['0 0 0 1 1 * 2030,2035',
    'in den Jahren 2030 und 2035 jeweils am 1. Januar um 0:00 Uhr'],
  ['0 0 0 1 1 * 2030-2035',
    'in den Jahren 2030 bis 2035 jeweils am 1. Januar um 0:00 Uhr'],
  ['0 0 1 1 * */2',
    'in geraden Jahren jeweils am 1. Januar um 0:00 Uhr',
    {years: true}],
  ['30 0 9 1 6 * 2030', 'am 1. Juni 2030 um 9:00:30 Uhr'],
  ['0 0 9 * * * 2030', 'im Jahr 2030 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2028-2031', 'in den Jahren 2028 bis 2031 täglich um 9:00 Uhr'],
  ['0 0 9 * 6 * 2030', 'im Juni 2030 täglich um 9:00 Uhr'],
  ['0 0 9 * 6 1 2030', 'im Juni 2030 montags um 9:00 Uhr'],
  ['0 0 9 * * 1 2030', 'im Jahr 2030 montags um 9:00 Uhr'],
  ['0 0 9 1,15 6 * 2030', 'am 1. und 15. Juni 2030 um 9:00 Uhr'],
  ['0 0 9 * 6,7 * 2030', 'im Juni und Juli 2030 täglich um 9:00 Uhr'],
  ['0 0 9 * 6-8 * 2030', 'von Juni bis August 2030 täglich um 9:00 Uhr'],
  ['0 0 9 * 6 * 2030,2031',
    'in den Jahren 2030 und 2031 jeweils im Juni täglich um 9:00 Uhr'],
  ['0 0 9 L 6 * 2030', 'am letzten Tag im Juni 2030 um 9:00 Uhr'],
  ['0 0 9 1 * * 2030', 'im Jahr 2030 am 1. jedes Monats um 9:00 Uhr'],
  ['0 0 9 * * * 2030/2', 'in geraden Jahren ab 2030 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2028/4',
    'in jedem vierten Jahr ab 2028 täglich um 9:00 Uhr'],
  ['0 0 0 1 1 * 2028/4',
    'in jedem vierten Jahr ab 2028 jeweils am 1. Januar um 0:00 Uhr'],
  ['0 */5 * * * * 2028/4',
    'in jedem vierten Jahr ab 2028 alle 5 Minuten'],
  // No series of years is left to continue (2026-11-19): the step is a
  // word with its start, and its end where it has one.
  ['0 */5 * * * * */4', 'in jedem vierten Jahr ab 1970 alle 5 Minuten'],
  ['0 0 9 * * * 2030/25', 'in jedem 25. Jahr ab 2030 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030-2060/3',
    'in jedem dritten Jahr von 2030 bis 2060 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2028/4,2028',
    'in jedem vierten Jahr ab 2028 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030-2040/2',
    'in geraden Jahren von 2030 bis 2040 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2028-2040/4',
    'in den Jahren 2028, 2032, 2036 und 2040 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2028-2060/4',
    'in jedem vierten Jahr von 2028 bis 2060 täglich um 9:00 Uhr'],
  ['0 */5 * * * * */2', 'in geraden Jahren alle 5 Minuten'],
  ['0 0 9 * * * 1971/2', 'in ungeraden Jahren täglich um 9:00 Uhr'],
  ['0 0 0 1 1 * 2030-2032,2035',
    'in den Jahren 2030 bis 2032 und 2035 jeweils am 1. Januar um 0:00 Uhr'],
  ['0 0 9 * * * 2030-2032,2035',
    'in den Jahren 2030 bis 2032 und 2035 täglich um 9:00 Uhr'],

  // A run of years is said with its two ends, however long it is, and a
  // run that reaches the last year a pattern can name is «ab».
  ['0 0 9 * * * 2030-2061', 'in den Jahren 2030 bis 2061 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030-2062', 'in den Jahren 2030 bis 2062 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030-2040,2050-2081',
    'in den Jahren 2030 bis 2040 und 2050 bis 2081 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030-2034,2036-2040',
    'in den Jahren 2030 bis 2034 und 2036 bis 2040 täglich um 9:00 Uhr'],
  // A run with no end is «ab», alone.
  ['0 0 9 * * * 2030/1', 'ab 2030 täglich um 9:00 Uhr'],
  ['0 0 0 1 1 * 2030/1', 'ab 2030 jeweils am 1. Januar um 0:00 Uhr'],
  ['0 0 9 * * 1 2030-9999', 'ab 2030 montags um 9:00 Uhr'],
  ['0 0 9 * * * 2030-2034,2036/1',
    'in den Jahren 2030 bis 2034 und ab 2036 täglich um 9:00 Uhr'],
  // An exception from every year, and from years in step.
  ['0 0 9 * * * 1970-2029,2031/1',
    'in allen Jahren, außer 2030, täglich um 9:00 Uhr'],
  ['0 0 9 * * * 1970-2029,2031-2040,2042-9999',
    'in allen Jahren, außer 2030 und 2041, täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2000-2028/2,2032-2098/2',
    'in geraden Jahren von 2000 bis 2098, außer 2030, täglich um 9:00 Uhr'],
  ['0 0 0 1 1 * 2000-2028/2,2032-2098/2',
    'in geraden Jahren von 2000 bis 2098, außer 2030, jeweils am 1. ' +
    'Januar um 0:00 Uhr'],

  // Years that are neither one run nor one series are the core's runs
  // and cadences together, and each years in step stands apart after
  // «sowie», with its own start, so that it reaches back over nothing.
  ['0 0 9 * * * 2030/2,2031',
    'in geraden Jahren ab 2030 sowie im Jahr 2031 täglich um 9:00 Uhr'],
  ['0 0 0 1 1 * 2030/2,2031',
    'in geraden Jahren ab 2030 sowie im Jahr 2031 jeweils am 1. Januar ' +
    'um 0:00 Uhr'],
  ['0 0 9 * * * 2030/4,2031',
    'in jedem vierten Jahr ab 2030 sowie im Jahr 2031 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030/3,2031/3',
    'in jedem dritten Jahr ab 2030 sowie in jedem dritten Jahr ab 2031 ' +
    'täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030-2060/2,2071',
    'in geraden Jahren von 2030 bis 2060 sowie im Jahr 2071 täglich um ' +
    '9:00 Uhr'],
  ['0 0 9 * * * 2030-2040,2045/5',
    'in den Jahren 2030 bis 2040 sowie in jedem fünften Jahr ab 2045 ' +
    'täglich um 9:00 Uhr'],
  ['0 */5 * * * * 2030-2040,2045/5',
    'in den Jahren 2030 bis 2040 sowie in jedem fünften Jahr ab 2045 alle ' +
    '5 Minuten'],
  ['0 0 9 * * * 2030,2032,2034,2036,2038,2042,2044,2046,2048,2050',
    'in geraden Jahren von 2030 bis 2050, außer 2040, täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030/2,2031/4',
    'in geraden Jahren ab 2030 sowie in jedem vierten Jahr ab 2031 ' +
    'täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030,2040,2050,2045-2060',
    'in den Jahren 2030, 2040 und 2045 bis 2060 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2054,2037,2023,2049,2053,2028,2030,2057',
    'in den Jahren 2023, 2028, 2030, 2037, 2049, 2053, 2054 und 2057 ' +
    'täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030,9999',
    'in den Jahren 2030 und 9999 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030,2032,2034,2038,2040',
    'in geraden Jahren von 2030 bis 2040, außer 2036, täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030-2036/2',
    'in geraden Jahren von 2030 bis 2036 täglich um 9:00 Uhr'],

  // Quartz forms.
  ['0 0 1 * ?', 'am 1. jedes Monats um 0:00 Uhr', {cron: 'quartz'}],
  ['0 0 LW * *',
    'am letzten Wochentag (Montag bis Freitag) jedes Monats um 0:00 Uhr'],
  ['0 0 L-3 * *',
    'am viertletzten Tag jedes Monats (3 Tage vor dem letzten) um 0:00 Uhr'],
  ['0 0 L-2 * *',
    'am drittletzten Tag jedes Monats (2 Tage vor dem letzten) um 0:00 Uhr'],
  ['0 0 L-1 * *', 'am vorletzten Tag jedes Monats um 0:00 Uhr'],
  ['0 0 L 6 *', 'jährlich am letzten Tag im Juni um 0:00 Uhr'],
  ['0 0 L-3 6 *',
    'jährlich am viertletzten Tag im Juni (3 Tage vor dem letzten) um ' +
    '0:00 Uhr'],
  ['0 0 L 1,7 *', 'im Januar und Juli jeweils am letzten Tag um 0:00 Uhr'],
  ['0 0 LW 6 *',
    'jährlich am letzten Wochentag (Montag bis Freitag) im Juni um 0:00 Uhr'],
  ['0 0 15W 6 *',
    'jährlich am Wochentag (Montag bis Freitag), der dem 15. Juni am ' +
    'nächsten liegt, um 0:00 Uhr'],
  ['0 0 1W * *',
    'am ersten Wochentag (Montag bis Freitag) jedes Monats um 0:00 Uhr'],
  ['0 0 1W 6 *',
    'jährlich am ersten Wochentag (Montag bis Freitag) im Juni um 0:00 Uhr'],
  ['0 0 31W * *',
    'in Monaten mit 31 Tagen am Wochentag (Montag bis Freitag), der dem ' +
    '31. im selben Monat am nächsten liegt, um 0:00 Uhr'],
  ['0 0 30W * *',
    'in Monaten mit mindestens 30 Tagen am Wochentag (Montag bis Freitag), ' +
    'der dem 30. im selben Monat am nächsten liegt, um 0:00 Uhr'],
  ['0 0 28W * *',
    'am Wochentag (Montag bis Freitag), der dem 28. jedes Monats im selben ' +
    'Monat am nächsten liegt, um 0:00 Uhr'],
  // A day counted from the end that some months lack.
  ['0 0 L-30 * *',
    'in Monaten mit 31 Tagen 30 Tage vor dem letzten Tag um 0:00 Uhr'],
  ['0 0 L-28 * *',
    'in Monaten mit mindestens 29 Tagen 28 Tage vor dem letzten Tag um ' +
    '0:00 Uhr'],
  ['0 0 L-30 6-8 *',
    'im Juli und August jeweils 30 Tage vor dem letzten Tag um 0:00 Uhr'],
  ['0 0 L-28 2 *',
    '28 Tage vor dem letzten Tag im Februar (nur in Schaltjahren) um 0:00 ' +
    'Uhr'],
  ['0 0 L-10 * *', '10 Tage vor dem letzten Tag jedes Monats um 0:00 Uhr'],
  ['0 0 L-9 * *',
    'am zehntletzten Tag jedes Monats (9 Tage vor dem letzten) um 0:00 Uhr'],
  ['0 0 L-3 1,7 *',
    'im Januar und Juli jeweils am viertletzten Tag (3 Tage vor dem ' +
    'letzten) um 0:00 Uhr'],
  ['0 0 * 6 1#2', 'jährlich am zweiten Montag im Juni um 0:00 Uhr'],
  ['0 0 * 1,7 5L', 'im Januar und Juli jeweils am letzten Freitag um 0:00 Uhr'],
  ['0 9 * * 3#1', 'am ersten Mittwoch jedes Monats um 9:00 Uhr'],
  ['0 9 * * 4#3', 'am dritten Donnerstag jedes Monats um 9:00 Uhr'],
  ['0 9 * * 6L', 'am letzten Samstag jedes Monats um 9:00 Uhr'],
  ['0 9 * * 0#4', 'am vierten Sonntag jedes Monats um 9:00 Uhr'],
  ['0 9 * * 2#5', 'am fünften Dienstag jedes Monats um 9:00 Uhr'],

  // A weekday nearest a date that some of the named months lack: only
  // the months that have it are named.
  ['0 9 31W 1,6 *',
    'jährlich am Wochentag (Montag bis Freitag), der dem 31. Januar im ' +
    'selben Monat am nächsten liegt, um 9:00 Uhr'],
  ['0 9 30W 2,3 *',
    'jährlich am Wochentag (Montag bis Freitag), der dem 30. März im ' +
    'selben Monat am nächsten liegt, um 9:00 Uhr'],
  ['0 9 29W 1,2 *',
    'im Januar und Februar jeweils am Wochentag (Montag bis Freitag), der ' +
    'dem 29. im selben Monat am nächsten liegt (im Februar nur in ' +
    'Schaltjahren), um 9:00 Uhr'],
  ['0 9 31W 1,3 *',
    'im Januar und März jeweils am Wochentag (Montag bis Freitag), der dem ' +
    '31. im selben Monat am nächsten liegt, um 9:00 Uhr'],
  ['0 0 31W 6-8 *',
    'im Juli und August jeweils am Wochentag (Montag bis Freitag), der dem ' +
    '31. im selben Monat am nächsten liegt, um 0:00 Uhr'],
  ['0 0 29W 2 *',
    'am Wochentag (Montag bis Freitag), der dem 29. Februar im selben ' +
    'Monat am nächsten liegt (nur in Schaltjahren), um 0:00 Uhr'],
  ['0 0 31W * 5',
    'freitags und zusätzlich in Monaten mit 31 Tagen am Wochentag (Montag ' +
    'bis Freitag), der dem 31. im selben Monat am nächsten liegt, jeweils ' +
    'um 0:00 Uhr'],
  ['0 0 31W 6-8 1',
    'von Juni bis August montags und zusätzlich im Juli und August am ' +
    'Wochentag (Montag bis Freitag), der dem 31. im selben Monat am ' +
    'nächsten liegt, jeweils um 0:00 Uhr'],

  // A schedule that never runs says only that; beside weekdays the
  // weekdays are left.
  ['0 9 31 6 *', 'nie (einen solchen Tag gibt es nicht)'],
  ['0 0 30 2 *', 'nie (einen solchen Tag gibt es nicht)'],
  ['0 0 31 4,6,9,11 *', 'nie (einen solchen Tag gibt es nicht)'],
  ['0 0 31W 6 *', 'nie (einen solchen Tag gibt es nicht)'],
  ['0 0 L-30 6 *', 'nie (einen solchen Tag gibt es nicht)'],
  ['0 0 0 29 2 * 2031', 'nie (einen solchen Tag gibt es nicht)'],
  ['0 0 31 6 1', 'im Juni montags um 0:00 Uhr'],

  // Leap years, and months that lack the date.
  ['0 0 29 2 *', 'am 29. Februar (nur in Schaltjahren) um 0:00 Uhr'],
  ['0 0 0 29 2 * 2032', 'am 29. Februar 2032 um 0:00 Uhr'],
  ['0 0 29 1-3 *',
    'von Januar bis März jeweils am 29. (im Februar nur in Schaltjahren) ' +
    'um 0:00 Uhr'],
  ['0 0 29 2 1',
    'im Februar montags und zusätzlich am 29. Februar (nur in ' +
    'Schaltjahren), jeweils um 0:00 Uhr'],
  ['0 0 30 2-3 *', 'jährlich am 30. März um 0:00 Uhr'],
  ['0 0 31 1,6 *', 'jährlich am 31. Januar um 0:00 Uhr'],
  ['0 0 1,31 4,6,9,11 *',
    'im April, Juni, September und November jeweils am 1. um 0:00 Uhr'],
  ['0 0 31 * *', 'am 31. jedes Monats um 0:00 Uhr'],
  ['0 0 29 * *', 'am 29. jedes Monats um 0:00 Uhr'],
  ['0 0 31 6-8 1',
    'von Juni bis August montags und zusätzlich im Juli und August am 31., ' +
    'jeweils um 0:00 Uhr'],
  ['0 0 31 1,6 1',
    'im Januar und Juni montags und zusätzlich am 31. Januar, jeweils um ' +
    '0:00 Uhr'],

  // Macros, startup, and the three forms.
  ['@hourly', 'zu jeder vollen Stunde'],
  ['@daily', 'täglich um 0:00 Uhr'],
  ['@weekly', 'sonntags um 0:00 Uhr'],
  ['@monthly', 'am 1. jedes Monats um 0:00 Uhr'],
  ['@yearly', 'jährlich am 1. Januar um 0:00 Uhr'],
  ['@reboot', 'beim Systemstart'],
  ['0 9 * * *', 'Läuft täglich um 9:00 Uhr.', {form: 'sentence'}],
  ['0 0-2,4-23 * * *',
    'Läuft zu jeder vollen Stunde, außer um 3:00 Uhr.',
    {form: 'sentence'}],
  ['0 9 * * *', 'Täglich um 9:00 Uhr', {form: 'label'}],
  ['* * * * *', 'Jede Minute', {form: 'label'}],
  ['0 9 * * 1-5', 'Montags bis freitags um 9:00 Uhr', {form: 'label'}],
  ['30 * * * *', 'Stündlich zur Minute 30', {form: 'label'}],
  ['@reboot', 'Läuft beim Systemstart.', {form: 'sentence'}],
  ['not a pattern', 'ein unbekanntes Cron-Muster', {lenient: true}],

  // A day of the month and a weekday, alone and under a month.
  ['0 0 1 6 5',
    'im Juni freitags und zusätzlich am 1. Juni, jeweils um 0:00 Uhr'],
  ['0 0 1,15 1,7 1-5',
    'im Januar und Juli montags bis freitags und zusätzlich am 1. und 15. ' +
    'dieser Monate, jeweils um 0:00 Uhr'],
  ['52 7-16 1,19,23,28 5-7 3-4',
    'von Mai bis Juli mittwochs und donnerstags und zusätzlich am 1., 19., ' +
    '23. und 28. dieser Monate, jeweils von 7:52 bis 16:52 Uhr stündlich'],
  ['30 4 1-7 * 1',
    'montags und zusätzlich vom 1. bis 7. jedes Monats, jeweils um 4:30 Uhr'],
  ['0 9 15 * 1-6',
    'montags bis samstags und zusätzlich am 15. jedes Monats, jeweils um ' +
    '9:00 Uhr'],
  ['0 9 15 * 0-2,4-6',
    'täglich, außer mittwochs, und zusätzlich am 15. jedes Monats, jeweils ' +
    'um 9:00 Uhr'],
  ['* * 1 * 1',
    'montags und zusätzlich am 1. jedes Monats, jeweils jede Minute'],
  ['30 * 1 * 1',
    'montags und zusätzlich am 1. jedes Monats, jeweils stündlich zur ' +
    'Minute 30'],
  ['0 0 L * 5',
    'freitags und zusätzlich am letzten Tag jedes Monats, jeweils um 0:00 ' +
    'Uhr'],
  ['0 0 1 6 5 2030',
    'im Juni 2030 freitags und zusätzlich am 1. Juni, jeweils um 0:00 Uhr',
    {years: true}],
  ['0 0 L 6 5',
    'im Juni freitags und zusätzlich am letzten Tag im Juni, jeweils um ' +
    '0:00 Uhr'],
  ['0 0 L 1,7 5',
    'im Januar und Juli freitags und zusätzlich am letzten Tag dieser ' +
    'Monate, jeweils um 0:00 Uhr'],
  ['0 0 0 1 * 5 2030',
    'im Jahr 2030 freitags und zusätzlich am 1. jedes Monats, jeweils um ' +
    '0:00 Uhr'],

  // Beside weekdays, every day but a few is said as its stretches: «und
  // zusätzlich täglich, außer am 15.» lets the exception reach the
  // weekdays too.
  ['0 9 1-14,16-31 * 1',
    'montags und zusätzlich vom 1. bis 14. und vom 16. bis zum Ende jedes ' +
    'Monats, jeweils um 9:00 Uhr'],
  ['0 9 1-14,16-31 6 1',
    'im Juni montags und zusätzlich vom 1. bis 14. und vom 16. bis 30. ' +
    'Juni, jeweils um 9:00 Uhr'],
  // Dates that are every day of the named month leave nothing to add.
  ['0 9 1-30 6 1', 'im Juni täglich um 9:00 Uhr'],
  ['0 9 1-30 6 *', 'im Juni täglich um 9:00 Uhr'],
  // A date the named month lacks is left out.
  ['0 9 30,31 6 *', 'jährlich am 30. Juni um 9:00 Uhr'],

  // A month with its dates.
  ['0 0 1,15 6 *', 'jährlich am 1. und 15. Juni um 0:00 Uhr'],
  ['0 0 1,10,20 6 *', 'jährlich am 1., 10. und 20. Juni um 0:00 Uhr'],
  ['0 0 1-7 6 *', 'jährlich vom 1. bis 7. Juni täglich um 0:00 Uhr'],
  ['0 0 1-7,15 6 *',
    'jährlich vom 1. bis 7. und am 15. Juni jeweils um 0:00 Uhr'],
  ['0 0 1-7 6-8 *',
    'von Juni bis August jeweils vom 1. bis 7. täglich um 0:00 Uhr'],
  ['0 0 */2 6 *',
    'jährlich an den ungeraden Tagen im Juni um 0:00 Uhr'],
  // The same days, however the step is spelled: 1-29/2 reaches every odd
  // day June has, as */2 does. (Until 2026-11-19 this row was a series,
  // «am 1., 3., 5. … und 29. Juni», because the field's values stop at
  // 29 while */2's run to 31; the days that occur are the same.)
  ['0 0 1-29/2 6 *', 'jährlich an den ungeraden Tagen im Juni um 0:00 Uhr'],
  ['0 9 1-29/2 6 *', 'jährlich an den ungeraden Tagen im Juni um 9:00 Uhr'],
  ['0 9 */2 6 *', 'jährlich an den ungeraden Tagen im Juni um 9:00 Uhr'],
  ['0 0 2-30/2 4 *', 'jährlich an den geraden Tagen im April um 0:00 Uhr'],
  // February: the odd days reach the 29th in leap years, the even days
  // stop at the 28th in every year.
  ['0 0 1-29/2 2 *', 'jährlich an den ungeraden Tagen im Februar um 0:00 Uhr'],
  ['0 0 2-28/2 2 *', 'jährlich an den geraden Tagen im Februar um 0:00 Uhr'],
  ['0 0 0 1-27/2 2 * 2031',
    'an den ungeraden Tagen im Februar 2031 um 0:00 Uhr'],
  ['0 0 0 2-28/2 2 * 2031',
    'an den geraden Tagen im Februar 2031 um 0:00 Uhr'],
  // A 31-day month has a 31st.
  ['0 0 1-31/2 7 *', 'jährlich an den ungeraden Tagen im Juli um 0:00 Uhr'],
  ['0 0 2-30/2 7 *', 'jährlich an den geraden Tagen im Juli um 0:00 Uhr'],
  // Months of different lengths: the longest decides.
  ['0 0 1-29/2 4,6 *',
    'im April und Juni jeweils an den ungeraden Tagen um 0:00 Uhr'],
  ['0 0 1-29/2 2,4 *',
    'im Februar und April jeweils an den ungeraden Tagen um 0:00 Uhr'],
  ['0 0 1-29/2 */2 *',
    'im Januar, März, Mai, Juli, September und November jeweils vom 1. ' +
    'bis 29. an den ungeraden Tagen um 0:00 Uhr'],
  // Beside weekdays, the same.
  ['0 0 1-29/2 6 1',
    'im Juni montags und zusätzlich an den ungeraden Tagen im Juni, ' +
    'jeweils um 0:00 Uhr'],
  // A step of three: the same days, said alike.
  ['0 0 1-28/3 6 *', 'jährlich vom 1. bis 28. Juni alle 3 Tage um 0:00 Uhr'],
  ['0 0 */3 6 *', 'jährlich vom 1. bis 28. Juni alle 3 Tage um 0:00 Uhr'],
  // A cadence that stops before the month's last odd or even day is other
  // days, and keeps its ends.
  ['0 0 1-29/2 7 *',
    'jährlich vom 1. bis 29. Juli an den ungeraden Tagen um 0:00 Uhr'],
  ['0 0 1-29/2 4,5 *',
    'im April und Mai jeweils vom 1. bis 29. an den ungeraden Tagen um ' +
    '0:00 Uhr'],
  ['0 0 1-27/2 2 *',
    'jährlich vom 1. bis 27. Februar an den ungeraden Tagen um 0:00 Uhr'],
  ['0 0 2-28/2 6 *',
    'jährlich vom 2. bis 28. Juni an den geraden Tagen um 0:00 Uhr'],
  ['0 0 1-15/2 6 *',
    'jährlich vom 1. bis 15. Juni an den ungeraden Tagen um 0:00 Uhr'],
  // Every month: written either way, the odd days.
  ['0 9 1-31/2 * *', 'an den ungeraden Tagen jedes Monats um 9:00 Uhr'],
  ['0 0 */2 1,7 *',
    'im Januar und Juli jeweils an den ungeraden Tagen um 0:00 Uhr'],
  ['0 0 */5 6 *',
    'jährlich am 1., 6., 11., 16., 21. und 26. Juni um 0:00 Uhr'],
  ['0 0 */3 2 *', 'jährlich vom 1. bis 28. Februar alle 3 Tage um 0:00 Uhr'],
  ['0 0 8/2 6 *',
    'jährlich vom 8. bis 30. Juni an den geraden Tagen um 0:00 Uhr'],
  ['0 0 */5 1,7 *',
    'im Januar und Juli jeweils am 1., 6., 11., 16., 21., 26. und 31. um ' +
    '0:00 Uhr'],
  ['0 0 1,15 1,7 *', 'im Januar und Juli jeweils am 1. und 15. um 0:00 Uhr'],
  ['59 23 31 12 *', 'jährlich am 31. Dezember um 23:59 Uhr'],
  ['0 0 1,2 * *', 'am 1. und 2. jedes Monats um 0:00 Uhr'],
  ['0 0 1-14,16-31 * *', 'täglich, außer am 15. jedes Monats, um 0:00 Uhr'],
  // Under named months every day but a few is its stretches.
  ['0 0 1-14,16-31 6 *',
    'jährlich vom 1. bis 14. und vom 16. bis 30. Juni jeweils um 0:00 Uhr'],
  ['0 0 1-14,16-31 6,7 *',
    'im Juni und Juli vom 1. bis 14. und vom 16. bis zum Monatsende, ' +
    'jeweils um 0:00 Uhr'],
  ['0 0 1-14,17-31 * *',
    'täglich, außer am 15. und 16. jedes Monats, um 0:00 Uhr'],
  ['0 0 2-31 * *',
    'vom 2. bis zum Ende jedes Monats täglich um 0:00 Uhr'],
  ['0 12 1-5,10,20-25 * *',
    'vom 1. bis 5., am 10. und vom 20. bis 25. jedes Monats jeweils um ' +
    '12:00 Uhr'],
  ['0 0 28-3 * *',
    'vom 1. bis 3. und vom 28. bis zum Ende jedes Monats jeweils um 0:00 ' +
    'Uhr'],
  ['0 0 5-20/3 * *',
    'am 5., 8., 11., 14., 17. und 20. jedes Monats um 0:00 Uhr'],
  // No series is left to continue (2026-11-19): a cadence of dates too
  // long to list says its stretch, and its step in the place of
  // «täglich»; every second day keeps its word.
  ['0 0 8/2 * *',
    'vom 8. bis zum Ende jedes Monats an den geraden Tagen um 0:00 Uhr'],
  ['0 0 3-31/2 * *',
    'vom 3. bis zum Ende jedes Monats an den ungeraden Tagen um 0:00 Uhr'],
  ['0 0 */3 * *',
    'vom 1. bis zum Ende jedes Monats alle 3 Tage um 0:00 Uhr'],
  ['0 0 2/4 * *',
    'vom 2. bis zum Ende jedes Monats alle 4 Tage um 0:00 Uhr'],
  // No day a month lacks is named (2026-11-19). Where the months that
  // fire have different lengths, a run or a step that goes on to the
  // last day of the longest ends at each month's end.
  ['0 0 */3 4,7 *',
    'im April und Juli jeweils vom 1. bis zum Monatsende alle 3 Tage um ' +
    '0:00 Uhr'],
  ['0 0 1-31/3 4,7 *',
    'im April und Juli jeweils vom 1. bis zum Monatsende alle 3 Tage um ' +
    '0:00 Uhr'],
  ['0 0 20-31 4,5 *',
    'im April und Mai jeweils vom 20. bis zum Monatsende täglich um 0:00 ' +
    'Uhr'],
  ['0 0 20-30 4,5 *',
    'im April und Mai jeweils vom 20. bis 30. täglich um 0:00 Uhr'],
  ['0 0 20-29 2 *', 'jährlich vom 20. bis Ende Februar täglich um 0:00 Uhr'],
  ['0 0 20-28 2 *', 'jährlich vom 20. bis 28. Februar täglich um 0:00 Uhr'],
  ['0 0 0 20-29 2 * 2031', 'vom 20. bis 28. Februar 2031 täglich um 0:00 Uhr'],
  ['0 0 29-31 1-3 *',
    'von Januar bis März jeweils vom 29. bis zum Monatsende (im Februar ' +
    'nur in Schaltjahren) täglich um 0:00 Uhr'],
  ['0 0 15-31 * *', 'vom 15. bis zum Ende jedes Monats täglich um 0:00 Uhr'],
  // A run or a step that ends past the shortest month's last day, but
  // before the longest month's, says where the shorter month stops.
  ['0 0 1-30 * *',
    'vom 1. bis 30. jedes Monats (im Februar bis zum Monatsende) täglich ' +
    'um 0:00 Uhr'],
  ['0 0 1-29 2,3 *',
    'im Februar und März jeweils vom 1. bis 29. (im Februar bis zum ' +
    'Monatsende) täglich um 0:00 Uhr'],
  ['0 0 3-29/2 1-3 *',
    'von Januar bis März jeweils vom 3. bis 29. an den ungeraden Tagen (im ' +
    'Februar bis zum Monatsende) um 0:00 Uhr'],
  ['0 0 1-10,20-30 * *',
    'vom 1. bis 10. und vom 20. bis 30. jedes Monats (im Februar bis zum ' +
    'Monatsende) jeweils um 0:00 Uhr'],
  ['0 0 1-30 4,6 *', 'im April und Juni täglich um 0:00 Uhr'],
  // A step that ends where every month still has the day keeps its end.
  ['0 0 */3 2 4', 'vom 1. bis 28. Februar alle 3 Tage, wenn sie auf ' +
    'einen Donnerstag fallen, jeweils um 0:00 Uhr'],
  // Listed days that only some of the months have are said with them.
  ['0 0 30,31 4,5 *',
    'im April und Mai jeweils am 30. sowie am 31. Mai um 0:00 Uhr'],
  ['0 0 1,31 4,5 *',
    'im April und Mai jeweils am 1. sowie am 31. Mai um 0:00 Uhr'],
  ['0 0 15,31 1,4 *',
    'im Januar und April jeweils am 15. sowie am 31. Januar um 0:00 Uhr'],
  ['0 0 28,29 2 *',
    'jährlich am 28. Februar sowie am 29. Februar (nur in Schaltjahren) um ' +
    '0:00 Uhr'],
  ['0 0 29,30,31 2 *', 'am 29. Februar (nur in Schaltjahren) um 0:00 Uhr'],
  ['0 0 30,31 4 *', 'jährlich am 30. April um 0:00 Uhr'],
  // A whole month, whichever way it is written.
  ['0 0 1-31 6 *', 'im Juni täglich um 0:00 Uhr'],
  ['0 0 1-30 6 *', 'im Juni täglich um 0:00 Uhr'],
  ['0 0 1-14,16-30 6 *',
    'jährlich vom 1. bis 14. und vom 16. bis 30. Juni jeweils um 0:00 Uhr'],
  ['0 0 0 1-28 2 * 2031', 'im Februar 2031 täglich um 0:00 Uhr'],
  ['0 0 1-28 2 *', 'jährlich vom 1. bis 28. Februar täglich um 0:00 Uhr'],
  ['0 0 */3 4,6 *',
    'im April und Juni jeweils vom 1. bis 28. alle 3 Tage um 0:00 Uhr'],
  ['0 9 1-31/3 1,7 1-5',
    'im Januar und Juli montags bis freitags und zusätzlich vom 1. bis 31. ' +
    'dieser Monate alle 3 Tage, jeweils um 9:00 Uhr'],
  ['0 0 */3 6 1',
    'vom 1. bis 28. Juni alle 3 Tage, wenn sie auf einen Montag fallen, ' +
    'jeweils um 0:00 Uhr'],
  ['0 12 1-5,10,20-25 1,7 *',
    'im Januar und Juli vom 1. bis 5., am 10. und vom 20. bis 25., jeweils ' +
    'um 12:00 Uhr'],
  ['0 0 31 * *', 'am 31. jedes Monats um 0:00 Uhr'],
  ['0 0 */21 * *', 'am 1. und 22. jedes Monats um 0:00 Uhr'],
  ['*/15 9-17 1-7 * *',
    'vom 1. bis 7. jedes Monats täglich von 9:00 bis 17:45 Uhr alle 15 ' +
    'Minuten'],
  ['30 * 1-7 * *', 'vom 1. bis 7. jedes Monats stündlich zur Minute 30'],
  ['0 * 1-7 * *', 'vom 1. bis 7. jedes Monats zu jeder vollen Stunde'],

  // Months.
  ['0 9 * 1-3,6,9-11 *',
    'von Januar bis März, im Juni und von September bis November täglich ' +
    'um 9:00 Uhr'],
  ['0 0 * 11-2 * 2030',
    'im Januar, Februar, November und Dezember 2030 täglich um 0:00 Uhr',
    {years: true}],
  ['0 9 * 2/2 *',
    'im Februar, April, Juni, August, Oktober und Dezember täglich um 9:00 ' +
    'Uhr'],
  ['0 0 1 2/2 *',
    'im Februar, April, Juni, August, Oktober und Dezember jeweils am 1. ' +
    'um 0:00 Uhr'],
  ['0 9 * 1-10 *', 'von Januar bis Oktober täglich um 9:00 Uhr'],
  ['0 9 * 12-9 *', 'von Dezember bis September täglich um 9:00 Uhr'],
  ['0 9 * 1-5,7-12 *', 'in allen Monaten, außer im Juni, täglich um 9:00 Uhr'],
  ['0 9 * 1-3,5-8,10-12 *',
    'in allen Monaten, außer im April und September, täglich um 9:00 Uhr'],
  ['0 0 1 1-3,5-8,10-12 *',
    'in allen Monaten, außer im April und September, jeweils am 1. um 0:00 ' +
    'Uhr'],
  ['* * * 1-3,5-8,10-12 *',
    'in allen Monaten, außer im April und September, jede Minute'],
  ['0 9 * 11,12 *', 'im November und Dezember täglich um 9:00 Uhr'],
  ['0 9 * 6-8 1', 'von Juni bis August montags um 9:00 Uhr'],
  ['0 9 * 6 1-6', 'im Juni montags bis samstags um 9:00 Uhr'],
  ['0 9 * 6 0-2,4-6', 'im Juni täglich, außer mittwochs, um 9:00 Uhr'],
  ['0 9 * 6 1', 'im Juni montags um 9:00 Uhr'],

  // One run only by wrapping: the two stretches where each is a run of
  // three or more, and otherwise whatever the field's limits give.
  ['0 9 29-2 * *', 'am 1., 2., 29., 30. und 31. jedes Monats um 9:00 Uhr'],
  ['58-2 * * * *', 'stündlich zu den Minuten 0, 1, 2, 58 und 59'],
  ['57-2 * * * *',
    'stündlich in den Minuten 0 bis 2 und 57 bis 59 jede Minute'],
  // Pieces win a tie with an exception, which has to be subtracted.
  ['0 0-8,13-23 * * *',
    'täglich von 0:00 bis 8:00 und von 13:00 bis 23:00 Uhr stündlich'],
  ['0 0-8,12-23 * * *',
    'zu jeder vollen Stunde, außer um 9:00, 10:00 und 11:00 Uhr'],
  // Two months across the turn of the year, with and without a year.
  ['0 9 1 12-1 *', 'im Dezember und Januar jeweils am 1. um 9:00 Uhr'],
  ['0 0 9 * 12,1 * 2030', 'im Januar und Dezember 2030 täglich um 9:00 Uhr'],
  ['0 0 9 * 1-5,7-12 * 2030',
    'im Jahr 2030 in allen Monaten, außer im Juni, täglich um 9:00 Uhr'],

  // Weekday order, runs and wrap-arounds.
  ['0 9 * * 5-1', 'freitags bis montags um 9:00 Uhr'],
  ['0 9 * * 2-4', 'dienstags bis donnerstags um 9:00 Uhr'],
  ['0 9 * * 0,1', 'sonntags und montags um 9:00 Uhr'],
  ['0 9 * * 6-1', 'samstags bis montags um 9:00 Uhr'],
  ['0 9 * * 0,5', 'freitags und sonntags um 9:00 Uhr'],
  ['0 9 * * 0,2-4', 'dienstags bis donnerstags und sonntags um 9:00 Uhr'],
  ['0 9 * * 0,2-5', 'dienstags bis freitags und sonntags um 9:00 Uhr'],
  ['0 9 * * 1,2,3,5', 'montags bis mittwochs und freitags um 9:00 Uhr'],
  ['0 9 * * 5-2', 'freitags bis dienstags um 9:00 Uhr'],
  ['0 9 * * 0-2,4-6', 'täglich, außer mittwochs, um 9:00 Uhr'],
  ['0 9 * * 0,2-6', 'dienstags bis sonntags um 9:00 Uhr'],
  ['0 0,1,22,23 * * 1', 'montags um 0:00, 1:00, 22:00 und 23:00 Uhr'],

  // Clock times: the list, «Uhr», and what competes with them. Four
  // clock times are listed; more are the hours once and the minutes once
  // (2026-11-20; until then six clock times were listed, the same minutes
  // said once for each hour).
  ['0,30 9,17 * * *', 'täglich um 9:00, 9:30, 17:00 und 17:30 Uhr'],
  ['5,20 9,17 * * *', 'täglich um 9:05, 9:20, 17:05 und 17:20 Uhr'],
  ['5,20,45 9,17 * * *',
    'täglich um 9 und 17 Uhr, jeweils zu den Minuten 5, 20 und 45'],
  ['5,20,35,50 9,17 * * *',
    'täglich um 9 und 17 Uhr, jeweils zu den Minuten 5, 20, 35 und 50'],
  ['5,20,35,50 9,17 * * 1',
    'montags um 9 und 17 Uhr, jeweils zu den Minuten 5, 20, 35 und 50'],
  // Separate hours with listed minutes: the hours once, as hours, then the
  // minutes once, by their number. Hours are listed up to six; a cadence
  // of more than six is its ends as hours and its step, and a cadence
  // that comes round the day is said bare. An hour taken away is named
  // by its number, as the whole hour it is.
  ['5,20,45 9,13,17 * * *',
    'täglich um 9, 13 und 17 Uhr, jeweils zu den Minuten 5, 20 und 45'],
  ['5,20 9,13,17,21 * * *',
    'täglich um 9, 13, 17 und 21 Uhr, jeweils zu den Minuten 5 und 20'],
  ['5,20 9,13,17 * * *',
    'täglich um 9, 13 und 17 Uhr, jeweils zu den Minuten 5 und 20'],
  ['5,20,45 1,3,9,13,17,22 * * *',
    'täglich um 1, 3, 9, 13, 17 und 22 Uhr, jeweils zu den Minuten ' +
    '5, 20 und 45'],
  ['5,20,45 1,3,9,13,17,20,22 * * *',
    'täglich um 1, 3, 9, 13, 17, 20 und 22 Uhr, jeweils zu den Minuten ' +
    '5, 20 und 45'],
  ['5/15 2/6 * * *',
    'täglich um 2, 8, 14 und 20 Uhr, jeweils zu den Minuten ' +
    '5, 20, 35 und 50'],
  ['5,20,45 */5 * * *',
    'täglich um 0, 5, 10, 15 und 20 Uhr, jeweils zu den Minuten 5, 20 und 45'],
  ['5,20,45 */3 * * *', 'alle 3 Stunden zu den Minuten 5, 20 und 45'],
  ['0,20 1,4,7,13,16,19,22 * * *',
    'ab 1:00 Uhr alle 3 Stunden zu den Minuten 0 und 20, außer in der ' +
    'Stunde 10'],
  ['5/15 */2 * * *', 'alle 2 Stunden zu den Minuten 5, 20, 35 und 50'],
  ['5,20,45 1/2 * * *',
    'ab 1:00 Uhr alle 2 Stunden zu den Minuten 5, 20 und 45'],
  ['5,20,45 1,3,5,7,9,11,15,17,19,21,23 * * *',
    'ab 1:00 Uhr alle 2 Stunden zu den Minuten 5, 20 und 45, außer in der ' +
    'Stunde 13'],
  ['0-29,45 9,17 * * *',
    'täglich um 9 und 17 Uhr, jeweils in den Minuten 0 bis 29 und 45 jede ' +
    'Minute'],
  // Where firing goes on through each hour's stretch, two hours keep
  // their two windows; three or more are the hours once and the minutes
  // once (2026-11-20; until then a window for each hour, the same minutes
  // said in every one).
  ['*/7 9,17 * * *',
    'täglich von 9:00 bis 9:56 und von 17:00 bis 17:56 Uhr alle 7 Minuten'],
  ['0-29 9,13,17 * * *',
    'täglich um 9, 13 und 17 Uhr, jeweils in den Minuten 0 bis 29 jede ' +
    'Minute'],
  // Every kind of minutes under five hours that are no cadence, and under
  // a cadence of five: the hours named once, «jeweils» and the minutes
  // once. Minutes that run through the whole hour hold it «eine Stunde
  // lang».
  ['5,35 1,4,9,14,18 * * *',
    'täglich um 1, 4, 9, 14 und 18 Uhr, jeweils zu den Minuten 5 und 35'],
  ['5,20,45 1,4,9,14,18 * * *',
    'täglich um 1, 4, 9, 14 und 18 Uhr, jeweils zu den Minuten 5, 20 und 45'],
  ['*/15 1,4,9,14,18 * * *',
    'täglich um 1, 4, 9, 14 und 18 Uhr, jeweils eine Stunde lang alle 15 ' +
    'Minuten'],
  ['* 1,4,9,14,18 * * *',
    'täglich um 1, 4, 9, 14 und 18 Uhr, jeweils eine Stunde lang jede ' +
    'Minute'],
  ['10-20 1,4,9,14,18 * * *',
    'täglich um 1, 4, 9, 14 und 18 Uhr, jeweils in den Minuten 10 bis 20 ' +
    'jede Minute'],
  ['2-18/2 1,4,9,14,18 * * *',
    'täglich um 1, 4, 9, 14 und 18 Uhr, jeweils in den Minuten 2 bis 18 ' +
    'alle 2 Minuten'],
  ['*/7 1,4,9,14,18 * * *',
    'täglich um 1, 4, 9, 14 und 18 Uhr, jeweils in den Minuten 0 bis 56 ' +
    'alle 7 Minuten'],
  ['0-29,45 1,4,9,14,18 * * *',
    'täglich um 1, 4, 9, 14 und 18 Uhr, jeweils in den Minuten 0 bis 29 ' +
    'und 45 jede Minute'],
  ['5,35 6-18/3 * * *',
    'täglich um 6, 9, 12, 15 und 18 Uhr, jeweils zu den Minuten 5 und 35'],
  ['5,20,45 6-18/3 * * *',
    'täglich um 6, 9, 12, 15 und 18 Uhr, jeweils zu den Minuten 5, 20 und 45'],
  ['*/15 6-18/3 * * *',
    'täglich um 6, 9, 12, 15 und 18 Uhr, jeweils eine Stunde lang alle 15 ' +
    'Minuten'],
  ['* 6-18/3 * * *',
    'täglich um 6, 9, 12, 15 und 18 Uhr, jeweils eine Stunde lang jede ' +
    'Minute'],
  ['10-20 6-18/3 * * *',
    'täglich um 6, 9, 12, 15 und 18 Uhr, jeweils in den Minuten 10 bis 20 ' +
    'jede Minute'],
  ['2-18/2 6-18/3 * * *',
    'täglich um 6, 9, 12, 15 und 18 Uhr, jeweils in den Minuten 2 bis 18 ' +
    'alle 2 Minuten'],
  ['*/7 6-18/3 * * *',
    'täglich um 6, 9, 12, 15 und 18 Uhr, jeweils in den Minuten 0 bis 56 ' +
    'alle 7 Minuten'],
  ['0-29,45 6-18/3 * * *',
    'täglich um 6, 9, 12, 15 und 18 Uhr, jeweils in den Minuten 0 bis 29 ' +
    'und 45 jede Minute'],
  // A cadence of more than six hours that does not come round the day:
  // its ends as hours and its step, then «jeweils» and the minutes once,
  // under every kind of minutes.
  ['5,35 2-20/3 * * *',
    'täglich von 2 bis 20 Uhr alle 3 Stunden, jeweils zu den Minuten 5 und ' +
    '35'],
  ['*/15 2-20/3 * * *',
    'täglich von 2 bis 20 Uhr alle 3 Stunden, jeweils eine Stunde lang ' +
    'alle 15 Minuten'],
  ['* 2-20/3 * * *',
    'täglich von 2 bis 20 Uhr alle 3 Stunden, jeweils eine Stunde lang ' +
    'jede Minute'],
  ['10-20 2-20/3 * * *',
    'täglich von 2 bis 20 Uhr alle 3 Stunden, jeweils in den Minuten 10 ' +
    'bis 20 jede Minute'],
  ['5,35 0-10/2,11-23/3 * * *',
    'täglich von 0 bis 10 Uhr alle 2 Stunden sowie von 11 bis 23 Uhr alle ' +
    '3 Stunden, jeweils zu den Minuten 5 und 35'],
  // Seconds that fill each listed minute make it a stretch.
  ['*/15 5/15 2/6 * * *',
    'täglich um 2, 8, 14 und 20 Uhr, jeweils in den Minuten 5, 20, 35 und ' +
    '50 alle 15 Sekunden'],
  ['*/15 5,20,45 * * * *',
    'stündlich in den Minuten 5, 20 und 45 alle 15 Sekunden'],
  ['0 1 * * *', 'täglich um 1:00 Uhr'],
  ['30 1,13 * * *', 'täglich um 1:30 und 13:30 Uhr'],
  ['0 9,13 * * *', 'täglich um 9:00 und 13:00 Uhr'],
  ['0 9,10 * * *', 'täglich um 9:00 und 10:00 Uhr'],
  ['* 9,10 * * *', 'täglich von 9:00 bis 10:59 Uhr jede Minute'],
  ['30 0 * * *', 'täglich um 0:30 Uhr'],
  ['30 0 0 * * *', 'täglich um 0:00:30 Uhr'],
  ['30 12 * * *', 'täglich um 12:30 Uhr'],
  ['1 * * * *', 'stündlich zur Minute 1'],
  ['* 22-23 * * *', 'täglich von 22:00 bis 23:59 Uhr jede Minute'],
  ['*/30 0-17 * * 2', 'dienstags von 0:00 bis 17:30 Uhr alle 30 Minuten'],
  ['0 0-6,22,23 * * *',
    'täglich von 0:00 bis 6:00 Uhr stündlich sowie um 22:00 und 23:00 Uhr'],
  ['*/15 0-5,22-23 * * *',
    'täglich von 0:00 bis 5:45 und von 22:00 bis 23:45 Uhr alle 15 Minuten'],
  ['*/20 9 * * *', 'täglich um 9:00, 9:20 und 9:40 Uhr'],
  ['5/10 9 * * *', 'täglich von 9:05 bis 9:55 Uhr alle 10 Minuten'],

  // A cadence of hours that comes round the day is said bare from 0:00,
  // and from a later start inside its first step names only the start;
  // neither takes «täglich». A cadence that does not come round keeps
  // both ends. Minutes are said apart from the cadence, as against every
  // hour, and hours as stretches have a short phrase of their own.
  ['0 0-22/2 * * *', 'alle 2 Stunden'],
  ['0 0-18/6 * * *', 'alle 6 Stunden'],
  ['0 */2 * * 1-5', 'montags bis freitags alle 2 Stunden'],
  ['0 1/2 * * *', 'ab 1:00 Uhr morgens alle 2 Stunden',
    {style: {hour12: true}}],
  ['0 1/3 * * *', 'ab 1:00 Uhr alle 3 Stunden'],
  ['0 2/3 * * *', 'ab 2:00 Uhr alle 3 Stunden'],
  ['0 1/6 * * *', 'täglich um 1:00, 7:00, 13:00 und 19:00 Uhr'],
  ['0 5/2 * * *', 'täglich von 5:00 bis 23:00 Uhr alle 2 Stunden'],
  ['* 0-22/2 * * *', 'in den geraden Stunden jede Minute'],
  // Minutes that run through the whole hour, under a step: «jeweils»
  // hands the hour to each time the step comes round, as under listed
  // hours and as seconds under a step of minutes (2026-11-21; until then
  // «alle 3 Stunden eine Stunde lang alle 15 Minuten», three rhythms
  // stacked with nothing to say which hour the duration is).
  ['* 0-18/6 * * *', 'alle 6 Stunden, jeweils eine Stunde lang jede Minute'],
  ['* */3 * * *', 'alle 3 Stunden, jeweils eine Stunde lang jede Minute'],
  ['* 1/3 * * *',
    'ab 1:00 Uhr alle 3 Stunden, jeweils eine Stunde lang jede Minute'],
  ['*/15 */3 * * *', 'alle 3 Stunden, jeweils eine Stunde lang alle 15 Minuten'],
  ['*/15 */6 * * *', 'alle 6 Stunden, jeweils eine Stunde lang alle 15 Minuten'],
  ['*/15 1/3 * * *',
    'ab 1:00 Uhr alle 3 Stunden, jeweils eine Stunde lang alle 15 Minuten'],
  ['*/30 */4 * * *', 'alle 4 Stunden, jeweils eine Stunde lang alle 30 Minuten'],
  ['*/10 2/3 * * *',
    'ab 2:00 Uhr alle 3 Stunden, jeweils eine Stunde lang alle 10 Minuten'],
  ['* */8 * * *', 'alle 8 Stunden, jeweils eine Stunde lang jede Minute'],
  ['*/10 * */3 * * *',
    'alle 3 Stunden, jeweils eine Stunde lang alle 10 Sekunden'],
  ['0-29 */2 * * *', 'alle 2 Stunden in den Minuten 0 bis 29 jede Minute'],
  ['* 10-40 */2 * * *',
    'alle 2 Stunden in den Minuten 10 bis 40 jede Sekunde'],
  ['0-28,30-59 */6 * * *',
    'alle 6 Stunden, jeweils eine Stunde lang jede Minute, außer zur ' +
    'Minute 29'],
  ['15,45 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'alle 2 Stunden zu den Minuten 15 und 45, außer in der Stunde 8'],
  // No bracket of numbers after odd or even days.
  ['0 12 */2 * *', 'an den ungeraden Tagen jedes Monats um 12:00 Uhr'],
  ['0 12 2-30/2 6 *', 'jährlich an den geraden Tagen im Juni um 12:00 Uhr'],

  // Hour cadences, two hours, exceptions.
  ['0 0,6,12,18 * * *', 'alle 6 Stunden'],
  ['0 0,6,18 * * *', 'täglich um 0:00, 6:00 und 18:00 Uhr'],
  ['0 */3 * * *', 'alle 3 Stunden'],
  ['0 */8 * * *', 'alle 8 Stunden'],
  ['0 */5 * * *', 'täglich von 0:00 bis 20:00 Uhr alle 5 Stunden'],
  ['0 2-22/4 * * *', 'ab 2:00 Uhr alle 4 Stunden'],
  ['0 4-22/6 * * *', 'täglich um 4:00, 10:00, 16:00 und 22:00 Uhr'],
  ['30 */2 * * *', 'alle 2 Stunden zur Minute 30'],
  ['30 */3 * * *', 'alle 3 Stunden zur Minute 30'],
  ['30 */5 * * *', 'täglich von 0:30 bis 20:30 Uhr alle 5 Stunden'],
  ['23 */6 * * *', 'alle 6 Stunden zur Minute 23'],
  ['23 1/2 * * *', 'ab 1:00 Uhr alle 2 Stunden zur Minute 23'],
  ['0 1/2 * * 1', 'montags ab 1:00 Uhr alle 2 Stunden'],
  ['15,45 */2 * * *', 'alle 2 Stunden zu den Minuten 15 und 45'],
  ['15,45 */4 * * *', 'alle 4 Stunden zu den Minuten 15 und 45'],
  ['0,15,45 */4 * * *', 'alle 4 Stunden zu den Minuten 0, 15 und 45'],
  ['5/10 */2 * * *', 'alle 2 Stunden zu den Minuten 5, 15, 25, 35, 45 und 55'],
  ['5,20,35,50 8-18/2 * * *',
    'täglich um 8, 10, 12, 14, 16 und 18 Uhr, jeweils zu den Minuten ' +
    '5, 20, 35 und 50'],
  ['15,45 */12 * * *', 'täglich um 0:15, 0:45, 12:15 und 12:45 Uhr'],
  ['23 */12 * * *', 'täglich um 0:23 und 12:23 Uhr'],
  ['0 1/12 * * *', 'täglich um 1:00 und 13:00 Uhr'],
  ['*/15 */12 * * *',
    'täglich von 0:00 bis 0:45 und von 12:00 bis 12:45 Uhr alle 15 Minuten'],
  ['0 */12 * * *', 'täglich um 0:00 und 12:00 Uhr'],
  ['0 0/12 * * *', 'täglich um 0:00 und 12:00 Uhr'],
  ['0 0,12 * * *', 'täglich um 0:00 und 12:00 Uhr'],
  ['0 */12 1 * *', 'am 1. jedes Monats um 0:00 und 12:00 Uhr'],
  ['0 0,12 1 * *', 'am 1. jedes Monats um 0:00 und 12:00 Uhr'],
  ['0 0-2,4-23 * * *', 'zu jeder vollen Stunde, außer um 3:00 Uhr'],
  ['0 0-22 * * *', 'täglich von 0:00 bis 22:00 Uhr stündlich'],
  ['0 1,3,5,7,11,13,15,17,19,21,23 * * *',
    'ab 1:00 Uhr alle 2 Stunden, außer um 9:00 Uhr'],
  ['30 0-2,4-23 * * *', 'stündlich zur Minute 30, außer um 3:30 Uhr'],
  ['5,20,45 0-2,4-23 * * *',
    'stündlich zu den Minuten 5, 20 und 45, außer in der Stunde 3'],
  ['*/10 0-2,4-23 * * *', 'alle 10 Minuten, außer von 3:00 bis 3:50 Uhr'],
  ['0-28,30-59 * * * *', 'jede Minute, außer zur Minute 29'],
  ['0-28,30-59 9,17 * * *',
    'täglich von 9:00 bis 9:59 und von 17:00 bis 17:59 Uhr jede Minute, ' +
    'außer zur Minute 29'],
  ['0,10,20,40,50 9-17 * * *',
    'täglich von 9:00 bis 17:50 Uhr alle 10 Minuten, außer zur Minute 30'],
  ['0,10,20,40,50 9 * * *',
    'täglich von 9:00 bis 9:50 Uhr alle 10 Minuten, außer um 9:30 Uhr'],
  ['0,10,20,40,50 0-2,4-23 * * *',
    'alle 10 Minuten, außer von 3:00 bis 3:50 Uhr und zur Minute 30'],
  ['* 0-28,30-59 * * * *', 'jede Sekunde, außer in der Minute 29'],
  ['* 0-28,30-59 9 * * *',
    'täglich von 9:00:00 bis 9:59:59 Uhr jede Sekunde, außer von 9:29:00 ' +
    'bis 9:29:59 Uhr'],
  ['0-28,30-59 * * * * *',
    'jede Sekunde, außer 29 Sekunden nach jeder vollen Minute'],
  ['0-28,30-59 */15 * * * *',
    'alle 15 Minuten, jeweils eine Minute lang jede Sekunde, außer 29 ' +
    'Sekunden nach der vollen Minute'],
  ['0-28,30-59 0 9 * * *',
    'täglich von 9:00:00 bis 9:00:59 Uhr jede Sekunde, außer um 9:00:29 Uhr'],

  // Hours in step that do not come round the day are named as hours, the
  // minutes once after them, whatever the minutes are (2026-11-20; until
  // then minutes that run through each hour fused into a window from the
  // first moment to the last, «von 8:00 bis 18:45 Uhr in den geraden
  // Stunden alle 15 Minuten», or stacked two rhythms, «alle 5 Stunden
  // eine Stunde lang alle 15 Minuten»; listed minutes under more than six
  // hours fused into the window's ends, «von 2:05 bis 20:45 Uhr»).
  ['*/15 8-18/2 * * *',
    'täglich um 8, 10, 12, 14, 16 und 18 Uhr, jeweils eine Stunde lang ' +
    'alle 15 Minuten'],
  ['*/15 9-17/2 * * *',
    'täglich um 9, 11, 13, 15 und 17 Uhr, jeweils eine Stunde lang alle 15 ' +
    'Minuten'],
  ['*/15 */5 * * *',
    'täglich um 0, 5, 10, 15 und 20 Uhr, jeweils eine Stunde lang alle 15 ' +
    'Minuten'],
  ['0-30 9-17/2 * * *',
    'täglich um 9, 11, 13, 15 und 17 Uhr, jeweils in den Minuten 0 bis 30 ' +
    'jede Minute'],
  ['* 0-30 9-17/2 * * *',
    'täglich um 9, 11, 13, 15 und 17 Uhr, jeweils in den Minuten 0 bis 30 ' +
    'jede Sekunde'],
  ['*/15 8,12-20/2 * * *',
    'täglich von 8 bis 20 Uhr alle 2 Stunden, jeweils eine Stunde lang ' +
    'alle 15 Minuten, außer in der Stunde 10'],
  ['*/15 8-20/4 * * *',
    'täglich um 8, 12, 16 und 20 Uhr, jeweils eine Stunde lang alle 15 ' +
    'Minuten'],
  ['5,20,45 2-20/3 * * *',
    'täglich von 2 bis 20 Uhr alle 3 Stunden, jeweils zu den Minuten 5, 20 ' +
    'und 45'],
  ['15,45 0-20/2 * * *',
    'täglich von 0 bis 20 Uhr alle 2 Stunden, jeweils zu den Minuten 15 und ' +
    '45'],
  ['0 9-17,20,22 * * *',
    'täglich von 9:00 bis 17:00 Uhr stündlich sowie um 20:00 und 22:00 Uhr'],
  ['* 9-17,20,22 * * *',
    'täglich von 9:00 bis 17:59, von 20:00 bis 20:59 und von 22:00 bis ' +
    '22:59 Uhr jede Minute'],
  ['*/10 6-8,17-19 * * 1-5',
    'montags bis freitags von 6:00 bis 8:50 und von 17:00 bis 19:50 Uhr ' +
    'alle 10 Minuten'],
  ['*/20 */2 */2 */3 *',
    'im Januar, April, Juli und Oktober jeweils an den ungeraden Tagen in ' +
    'den geraden Stunden alle 20 Minuten'],
  ['5,20,45 9-17,22 * * *',
    'täglich von 9:05 bis 17:45 und von 22:05 bis 22:45 Uhr stündlich zu ' +
    'den Minuten 5, 20 und 45'],
  ['5,20,45 9-17 * * *',
    'täglich von 9:05 bis 17:45 Uhr stündlich zu den Minuten 5, 20 und 45'],

  // Minutes inside the hour.
  ['50-10 9 * * *',
    'täglich von 9:00 bis 9:10 und von 9:50 bis 9:59 Uhr jede Minute'],
  ['10-40 9 * * *', 'täglich von 9:10 bis 9:40 Uhr jede Minute'],
  ['30-59 9 * * *', 'täglich von 9:30 bis 9:59 Uhr jede Minute'],
  ['5-10,20 * * * *', 'stündlich in den Minuten 5 bis 10 und 20 jede Minute'],
  ['50-10 * * * *',
    'stündlich in den Minuten 0 bis 10 und 50 bis 59 jede Minute'],
  ['50-10 * * * 1',
    'montags stündlich in den Minuten 0 bis 10 und 50 bis 59 jede Minute'],
  ['0-40/5 * * * *', 'stündlich in den Minuten 0 bis 40 alle 5 Minuten'],
  ['5-10,20 9-17 * * *',
    'täglich von 9:05 bis 17:20 Uhr stündlich in den Minuten 5 bis 10 und ' +
    '20 jede Minute'],
  ['45-59 * * * *', 'stündlich in den Minuten 45 bis 59 jede Minute'],
  ['10-40 * * * *', 'stündlich in den Minuten 10 bis 40 jede Minute'],
  ['0-29 9,17 * * *',
    'täglich von 9:00 bis 9:29 und von 17:00 bis 17:29 Uhr jede Minute'],
  ['0-1 * * * *', 'stündlich zu den Minuten 0 und 1'],
  ['*/21 * * * *', 'stündlich zu den Minuten 0, 21 und 42'],
  ['9,14,47,56 * * * *', 'stündlich zu den Minuten 9, 14, 47 und 56'],
  ['5/10 * * * *', 'stündlich zu den Minuten 5, 15, 25, 35, 45 und 55'],
  ['5/5 * * * *', 'stündlich in den Minuten 5 bis 55 alle 5 Minuten'],
  ['30 * * * 1', 'montags stündlich zur Minute 30'],

  // Seconds.
  ['15 30 9 * * *', 'täglich um 9:30:15 Uhr'],
  ['15 30 9,17 * * *', 'täglich um 9:30:15 und 17:30:15 Uhr'],
  ['15,45 30 9 * * *', 'täglich um 9:30:15 und 9:30:45 Uhr'],
  ['* * 9 * * *', 'täglich von 9:00:00 bis 9:59:59 Uhr jede Sekunde'],
  ['* * 9-17 * * *', 'täglich von 9:00:00 bis 17:59:59 Uhr jede Sekunde'],
  ['30 * 9 * * *',
    'täglich von 9:00 bis 9:59 Uhr jeweils 30 Sekunden nach jeder vollen ' +
    'Minute'],
  ['30 0 9-17 * * *', 'täglich von 9:00:30 bis 17:00:30 Uhr stündlich'],
  ['30 0 * * * *', '30 Sekunden nach jeder vollen Stunde'],
  // With minute 0 the seconds are counted from the full hour, never from
  // a full minute, which could be heard as every minute.
  ['15,45 0 * * * *', '15 und 45 Sekunden nach jeder vollen Stunde'],
  ['0,30 0 * * * *', 'zu jeder vollen Stunde sowie 30 Sekunden danach'],
  ['3/7 0 * * * *',
    'zu jeder vollen Stunde, jeweils 9-mal im Abstand von 7 Sekunden, ' +
    'erstmals 3 Sekunden nach der vollen Stunde'],
  ['15 0 1/2 * * *',
    'ab 1:00 Uhr alle 2 Stunden, jeweils 15 Sekunden nach der vollen Stunde'],
  ['0,30 0 */2 * * *',
    'alle 2 Stunden, jeweils zur vollen Stunde sowie 30 Sekunden danach'],
  ['15 0 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'alle 2 Stunden, außer um 8:00 Uhr, jeweils 15 Sekunden nach der ' +
    'vollen Stunde'],
  ['0,30 0 9-17 * * *',
    'täglich von 9:00 bis 17:00 Uhr stündlich, jeweils zur vollen Stunde ' +
    'sowie 30 Sekunden danach'],
  ['30 0 */2 * * *',
    'alle 2 Stunden, jeweils 30 Sekunden nach der vollen Stunde'],
  // One minute and one second under every hour are one count from the
  // full hour, as one second alone is: two readers found one reading in
  // it and called it the most natural; «zur Minute 5 und Sekunde 30» and
  // «zur Minute 5, Sekunde 30» were each read as two moments (2026-11-14).
  ['15 30 * * * *', '30 Minuten und 15 Sekunden nach jeder vollen Stunde'],
  ['30 5 * * * *', '5 Minuten und 30 Sekunden nach jeder vollen Stunde'],
  // After a day part, «jeweils» joins the count, as it does for one
  // second alone («am 1. jedes Monats jeweils 30 Sekunden nach …»).
  ['30 5 * 1 * *',
    'am 1. jedes Monats jeweils 5 Minuten und 30 Sekunden nach jeder ' +
    'vollen Stunde'],
  ['30 1 * * * *', '1 Minute und 30 Sekunden nach jeder vollen Stunde'],
  ['1 5 * * * *', '5 Minuten und 1 Sekunde nach jeder vollen Stunde'],
  // A cadence of hours that comes round the day keeps its minute apart.
  ['30 5 */2 * * *',
    'alle 2 Stunden zur Minute 5, jeweils 30 Sekunden nach der vollen ' +
    'Minute'],
  ['30 5,20 * * * *',
    'stündlich zu den Minuten 5 und 20, jeweils 30 Sekunden nach der vollen ' +
    'Minute'],
  ['0-9 0 * * * *',
    'zu jeder vollen Stunde, jeweils in den Sekunden 0 bis 9'],
  ['* 0 9,17 * * *',
    'täglich von 9:00:00 bis 9:00:59 und von 17:00:00 bis 17:00:59 Uhr ' +
    'jede Sekunde'],
  ['*/15 */15 * * * *',
    'alle 15 Minuten, jeweils zur vollen Minute sowie 15, 30 und 45 ' +
    'Sekunden danach'],
  ['*/6 */15 * * * *',
    'alle 15 Minuten, jeweils 10-mal im Abstand von 6 Sekunden'],
  ['0,15 */15 * * * *',
    'alle 15 Minuten, jeweils zur vollen Minute sowie 15 Sekunden danach'],
  ['30 */15 * * * *',
    'alle 15 Minuten, jeweils 30 Sekunden nach der vollen Minute'],
  ['30 */15 */2 * * *',
    'in den geraden Stunden alle 15 Minuten, jeweils 30 Sekunden nach der ' +
    'vollen Minute'],
  ['15 0 */6 * * *',
    'alle 6 Stunden, jeweils 15 Sekunden nach der vollen Stunde'],
  ['15 0 */3 * * *',
    'alle 3 Stunden, jeweils 15 Sekunden nach der vollen Stunde'],
  ['15,45 30 9,17 * * *',
    'täglich um 9:30:15, 9:30:45, 17:30:15 und 17:30:45 Uhr'],
  ['15,45 */15 9-17 * * *',
    'täglich von 9:00 bis 17:45 Uhr alle 15 Minuten, jeweils 15 und 45 ' +
    'Sekunden nach der vollen Minute'],
  ['8 5,30 */2 * * *',
    'alle 2 Stunden zu den Minuten 5 und 30, jeweils 8 Sekunden nach der ' +
    'vollen Minute'],
  ['* 0-29 * * * *', 'stündlich in den Minuten 0 bis 29 jede Sekunde'],
  ['* 30 * * * *', 'stündlich in der Minute 30 jede Sekunde'],
  // Three hours are named once, not a window each (2026-11-20).
  ['* */15 8,12,18 * * *',
    'täglich um 8, 12 und 18 Uhr, jeweils eine Stunde lang alle 15 ' +
    'Minuten, jeweils eine Minute lang jede Sekunde'],
  ['0,20,40 0 9 * * *', 'täglich um 9:00:00, 9:00:20 und 9:00:40 Uhr'],
  ['10-20 30 9 * * *', 'täglich von 9:30:10 bis 9:30:20 Uhr jede Sekunde'],
  ['5-10/60 0 9 * * *', 'täglich um 9:00:05 Uhr'],
  ['15 0 */12 * * *', 'täglich um 0:00:15 und 12:00:15 Uhr'],
  ['15,45 * * * * *', '15 und 45 Sekunden nach jeder vollen Minute'],
  ['1 * * * * *', '1 Sekunde nach jeder vollen Minute'],
  ['45-59 * * * * *',
    'jede Minute, jeweils in den Sekunden 45 bis 59'],
  ['10-40 * * * * *',
    'jede Minute, jeweils in den Sekunden 10 bis 40'],
  ['1-59 * * * * *', 'jede Minute, jeweils in den Sekunden 1 bis 59'],
  ['3/5 * * * * *',
    'jede Minute, jeweils 12-mal im Abstand von 5 Sekunden, erstmals 3 ' +
    'Sekunden nach der vollen Minute'],
  ['0-9 * 9 * * *',
    'täglich von 9:00 bis 9:59 Uhr jede Minute, jeweils in den Sekunden 0 ' +
    'bis 9'],
  ['*/7 * * * * *', 'jede Minute, jeweils 9-mal im Abstand von 7 Sekunden'],
  ['10-20 */15 * * * *',
    'alle 15 Minuten, jeweils in den Sekunden 10 bis 20'],
  ['* 0 8,12,18 * * *',
    'täglich um 8:00, 12:00 und 18:00 Uhr, jeweils eine Minute lang jede ' +
    'Sekunde'],
  ['0,15 * * * * *', 'zu jeder vollen Minute sowie 15 Sekunden danach'],

  // Seconds in several stretches are named by their number.
  ['0-10,50-59 * * * * *',
    'jede Minute, jeweils in den Sekunden 0 bis 10 und 50 bis 59'],
  ['0-10,30,50-59 */15 9-17 * * *',
    'täglich von 9:00 bis 17:45 Uhr alle 15 Minuten, jeweils in den ' +
    'Sekunden 0 bis 10, 30 und 50 bis 59'],
  ['0-10,30 0 9 * * *',
    'täglich um 9:00 Uhr, jeweils in den Sekunden 0 bis 10 und 30'],
  ['1,2,3,5,8,13,21 * * * * *',
    'jede Minute, jeweils in den Sekunden 1 bis 3, 5, 8, 13 und 21'],
  // Eight times to the second are more than a list holds: the seconds
  // trail.
  ['15,45 0 9,12,15,18 * * *',
    'täglich um 9:00, 12:00, 15:00 und 18:00 Uhr, jeweils 15 und 45 ' +
    'Sekunden nach der vollen Stunde'],
  // Scattered seconds with no run among them are said in full.
  ['1,4,9,16,25,36,49 * * * * *',
    'jede Minute, jeweils 1, 4, 9, 16, 25, 36 und 49 Sekunden nach der ' +
    'vollen Minute'],

  // «Täglich» fills the level a restricted hour would skip, and is
  // not said of a schedule that runs every hour of the day, or in a
  // cadence of hours that comes round the day.
  ['*/5 * * 6 *', 'im Juni alle 5 Minuten'],
  ['0 */6 * 6 *', 'im Juni alle 6 Stunden'],
  ['0 */2 * 6 *', 'im Juni alle 2 Stunden'],
  ['30 * * 6 *', 'im Juni stündlich zur Minute 30'],
  ['0 * * * 1', 'montags zu jeder vollen Stunde'],
  ['*/5 * * * * 2030', 'im Jahr 2030 alle 5 Minuten', {years: true}],
  ['30 * * * * 2030', 'im Jahr 2030 stündlich zur Minute 30', {years: true}],

  // Several fields at once.
  ['*/10 24 */3 23-25 * 1-2',
    'montags und dienstags und zusätzlich vom 23. bis 25. jedes Monats, ' +
    'jeweils alle 3 Stunden in der Minute 24 alle 10 Sekunden'],
  ['*/30 23 */12 * 6-7 6#2 2030/4',
    'in jedem vierten Jahr ab 2030 jeweils im Juni und Juli am ' +
    'zweiten Samstag um 0:23:00, 0:23:30, 12:23:00 und 12:23:30 Uhr'],
  ['0 35 2,15 * * * 2028,2030',
    'in den Jahren 2028 und 2030 täglich um 2:35 und 15:35 Uhr'],
  ['* 30,42 3-10 * 7,9,10,12 1,3,4,5',
    'im Juli, September, Oktober und Dezember montags und mittwochs bis ' +
    'freitags von 3:30:00 bis 10:42:59 Uhr stündlich in den Minuten 30 und ' +
    '42 jede Sekunde'],
  ['0 18 15W 3,6,9,12 *',
    'im März, Juni, September und Dezember jeweils am Wochentag (Montag ' +
    'bis Freitag), der dem 15. am nächsten liegt, um 18:00 Uhr'],
  ['7 4-22/6 1 */2 *',
    'im Januar, März, Mai, Juli, September und November jeweils am 1. um ' +
    '4:07, 10:07, 16:07 und 22:07 Uhr'],

  // Runs and cadences together, field by field.
  ['0-20/2,21-59/3 * * * *',
    'stündlich in den Minuten 0 bis 20 alle 2 Minuten und in den Minuten 21 ' +
    'bis 57 alle 3 Minuten'],
  ['0-20/2,21-59/3 9 * * *',
    'täglich von 9:00 bis 9:20 Uhr alle 2 Minuten und von 9:21 bis 9:57 ' +
    'Uhr alle 3 Minuten'],
  ['0-20/2,21-59/3 9-17 * * *',
    'täglich von 9:00 bis 17:57 Uhr stündlich in den Minuten 0 bis 20 alle ' +
    '2 Minuten und in den Minuten 21 bis 57 alle 3 Minuten'],
  ['0 0-10/2,11-23/3 * * *',
    'täglich von 0:00 bis 10:00 Uhr alle 2 Stunden und von 11:00 bis 23:00 ' +
    'Uhr alle 3 Stunden'],
  // A step of hours beside a run of hours: the run is a stretch, and
  // both stay windows (2026-11-20: not reopened with hours named once,
  // since a run of hours named «von 10 bis 15 Uhr, jeweils …» would end
  // on a clock time).
  ['*/15 0-10/2,11-15 * * *',
    'täglich von 0:00 bis 8:45 Uhr in den geraden Stunden sowie von 10:00 ' +
    'bis 15:45 Uhr, jeweils alle 15 Minuten'],
  // Hours in two steps, under minutes that run through each hour: each
  // step by its ends as hours, then the minutes once, as under places
  // (2026-11-20; until then windows that ran to 10:59 and 23:59 and
  // «eine Stunde lang» between two rhythms).
  ['* 0-10/2,11-23/3 * * *',
    'täglich von 0 bis 10 Uhr alle 2 Stunden sowie von 11 bis 23 Uhr alle ' +
    '3 Stunden, jeweils eine Stunde lang jede Minute'],
  // The 11th begins the every-third-day part, as the pattern writes it:
  // the row once ran the odd days through the 11th, which the core no
  // longer offers.
  ['0 0 1-10/2,11-31/3 * *',
    'vom 1. bis 9. an den ungeraden Tagen sowie vom 11. bis zum Ende ' +
    'jedes Monats alle 3 Tage um 0:00 Uhr'],
  ['0 0 1-20/2,24-30/3 * *',
    'vom 1. bis 19. an den ungeraden Tagen sowie am 24., 27. und 30. ' +
    'jedes Monats um 0:00 Uhr'],
  ['0 0 1-10,12-30/2 * *',
    'vom 1. bis 10. sowie vom 12. bis zum Ende jedes Monats an den geraden ' +
    'Tagen jeweils um 0:00 Uhr'],
  ['0-20/2,21-59/3 * * * * *',
    'jede Minute, jeweils in den Sekunden 0 bis 20 alle 2 Sekunden sowie ' +
    'in den Sekunden 21 bis 57 alle 3 Sekunden'],
  ['0-20/2,30-45/5 * * * * *',
    'jede Minute, jeweils in den Sekunden 0 bis 20 alle 2 Sekunden sowie ' +
    'in den Sekunden 30, 35, 40 und 45'],

  // One year follows one name, one list or one run of months, never
  // pieces.
  ['0 0 9 * 6-8,12 * 2030',
    'im Jahr 2030 von Juni bis August und im Dezember täglich um 9:00 Uhr'],
  ['0 0 9 1 6-8,12 * 2030',
    'im Jahr 2030 von Juni bis August und im Dezember jeweils am 1. um ' +
    '9:00 Uhr'],

  // An exception on one side of a date and a weekday is not taken from
  // both: a Wednesday the 15th and a Friday the 15th run.
  ['0 0 15 * 0-2,4-6',
    'täglich, außer mittwochs, und zusätzlich am 15. jedes Monats, jeweils ' +
    'um 0:00 Uhr'],
  ['0 9 1-14,16-31 * 5',
    'freitags und zusätzlich vom 1. bis 14. und vom 16. bis zum Ende jedes ' +
    'Monats, jeweils um 9:00 Uhr'],
  ['0 9 2,4,6,8,10,12,14,18,20,22,24,26,28,30 * 5',
    'freitags und zusätzlich an den geraden Tagen jedes Monats (ohne den ' +
    '16.), jeweils um 9:00 Uhr'],
  ['0 9 2,4,6,8,10,12,14,18,20,22,24,26,28,30 * *',
    'an den geraden Tagen jedes Monats, außer am 16., um 9:00 Uhr'],

  // What trails covers everything before it, and an excepted hour under
  // seconds is the whole hour.
  ['* 0 0-2,4-23 * * *',
    'zu jeder vollen Stunde, außer um 3:00 Uhr, jeweils eine Minute lang ' +
    'jede Sekunde'],
  ['* * 0-2,4-23 * * *', 'jede Sekunde, außer von 3:00:00 bis 3:59:59 Uhr'],
  ['15,45 0-29,45 9 * * *',
    'täglich von 9:00 bis 9:29 Uhr jede Minute sowie um 9:45 Uhr, jeweils ' +
    '15 und 45 Sekunden nach der vollen Minute'],

  // Runs that wrap are cut at the edge of their unit, and hours beside a
  // named day stay in that day.
  ['0 22-2 * * 1', 'montags um 0:00, 1:00, 2:00, 22:00 und 23:00 Uhr'],
  ['*/15 22-2 * * 1',
    'montags von 0:00 bis 2:45 und von 22:00 bis 23:45 Uhr alle 15 Minuten'],
  ['45-15 * * * * *',
    'jede Minute, jeweils in den Sekunden 0 bis 15 und 45 bis 59'],
  ['0 0 20-10 * *',
    'vom 1. bis 10. und vom 20. bis zum Ende jedes Monats jeweils um 0:00 ' +
    'Uhr'],

  // «Jährlich» with other time parts, and with February's odd days.
  ['*/5 * 1 6 *', 'jährlich am 1. Juni alle 5 Minuten'],
  ['0 0 */2 2 *',
    'jährlich an den ungeraden Tagen im Februar um 0:00 Uhr'],
  ['0 0 31W */2 *',
    'im Januar, März, Mai und Juli jeweils am Wochentag (Montag bis ' +
    'Freitag), der dem 31. im selben Monat am nächsten liegt, um 0:00 Uhr'],

  // Written without the star, a step from the start is a union: the days
  // that match either field, whatever the other says. These are the
  // sentences the starred spellings had before both had to match.
  ['*/15 9-17 1-31/2 * 1-5',
    'montags bis freitags und zusätzlich an den ungeraden Tagen jedes ' +
    'Monats, jeweils von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 1-31/5 * 1-5',
    'montags bis freitags und zusätzlich am 1., 6., 11., 16., 21., 26. und ' +
    '31. jedes Monats, jeweils von 9:00 bis 17:45 Uhr alle 15 Minuten'],

  // A field written from a star beside a restricted one: both must match,
  // so the dates are said first and the weekdays are a condition on them,
  // never an addition. `0 0 */2 * 1` is the Mondays that are odd days of
  // the month; `0 0 15 * */2` is the 15th where it is a Sunday, Tuesday,
  // Thursday or Saturday.
  ['0 0 */2 * 1',
    'an den ungeraden Tagen jedes Monats, wenn sie auf einen Montag fallen, ' +
    'jeweils um 0:00 Uhr'],
  ['0 9 */2 * 1,3,5',
    'an den ungeraden Tagen jedes Monats, wenn sie auf einen Montag, ' +
    'Mittwoch oder Freitag fallen, jeweils um 9:00 Uhr'],
  ['0 0 15 * */2',
    'am 15. jedes Monats, wenn er auf einen Dienstag, Donnerstag, Samstag ' +
    'oder Sonntag fällt, jeweils um 0:00 Uhr'],
  ['0 0 */2 6 1',
    'an den ungeraden Tagen im Juni, wenn sie auf einen Montag fallen, ' +
    'jeweils um 0:00 Uhr'],
  ['0 0 */5 * 1-5',
    'am 1., 6., 11., 16., 21., 26. und 31. jedes Monats, wenn sie auf ' +
    'einen Tag von Montag bis Freitag fallen, jeweils um 0:00 Uhr'],
  // A date that falls on a weekday is not a date that comes round every
  // year, so there is no «jährlich».
  ['0 0 15 6 */2',
    'am 15. Juni, wenn er auf einen Dienstag, Donnerstag, Samstag oder ' +
    'Sonntag fällt, jeweils um 0:00 Uhr'],
  ['0 0 13 * */5',
    'am 13. jedes Monats, wenn er auf einen Freitag oder Sonntag fällt, ' +
    'jeweils um 0:00 Uhr'],
  // All the weekdays but one are the one that is left out; runs and
  // single days stand side by side.
  ['0 0 */2 * 0-2,4-6',
    'an den ungeraden Tagen jedes Monats, wenn sie nicht auf einen Mittwoch ' +
    'fallen, jeweils um 0:00 Uhr'],
  ['0 0 */2 * 2-4,6',
    'an den ungeraden Tagen jedes Monats, wenn sie auf einen Tag von ' +
    'Dienstag bis Donnerstag oder einen Samstag fallen, jeweils um 0:00 Uhr'],
  // A weekday counted in its month is the one the dates must fall on.
  ['0 0 */2 * 5L',
    'an den ungeraden Tagen jedes Monats, wenn sie auf den letzten Freitag ' +
    'fallen, jeweils um 0:00 Uhr'],
  ['0 0 */2 * 1#2',
    'an den ungeraden Tagen jedes Monats, wenn sie auf den zweiten Montag ' +
    'fallen, jeweils um 0:00 Uhr'],
  // The months lead, and a year with them; a date that no month has is no
  // day at all.
  ['0 9 */3 1,7 1-5',
    'im Januar und Juli vom 1. bis 31. alle 3 Tage, wenn sie auf einen Tag ' +
    'von Montag bis Freitag fallen, jeweils um 9:00 Uhr'],
  ['0 0 0 */2 * 1 2030',
    'im Jahr 2030 an den ungeraden Tagen jedes Monats, wenn sie auf einen ' +
    'Montag fallen, jeweils um 0:00 Uhr'],
  ['0 0 31 6 */2', 'nie (einen solchen Tag gibt es nicht)'],
  // A run of dates takes no «täglich» before the time, whatever the hours.
  ['*/15 9-17 1-7 * */2',
    'vom 1. bis 7. jedes Monats, wenn sie auf einen Dienstag, Donnerstag, ' +
    'Samstag oder Sonntag fallen, jeweils von 9:00 bis 17:45 Uhr alle 15 ' +
    'Minuten']
];

export {rows};
