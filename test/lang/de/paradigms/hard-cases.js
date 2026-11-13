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
    'in den Jahren 2028, 2032, 2036 usw. täglich um 9:00 Uhr'],
  ['0 0 0 1 1 * 2028/4',
    'in den Jahren 2028, 2032, 2036 usw. jeweils am 1. Januar um 0:00 Uhr'],
  ['0 */5 * * * * 2028/4',
    'in den Jahren 2028, 2032, 2036 usw. alle 5 Minuten'],
  ['0 0 9 * * * 2030-2040/2',
    'in geraden Jahren von 2030 bis 2040 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2028-2040/4',
    'in den Jahren 2028, 2032, 2036 und 2040 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2028-2060/4',
    'in den Jahren 2028, 2032, 2036 usw. bis 2060 täglich um 9:00 Uhr'],
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
  // and cadences together, and each series stands apart after «sowie».
  ['0 0 9 * * * 2030/2,2031',
    'in den Jahren 2030, 2032, 2034 usw. sowie 2031 täglich um 9:00 Uhr'],
  ['0 0 0 1 1 * 2030/2,2031',
    'in den Jahren 2030, 2032, 2034 usw. sowie 2031 jeweils am 1. Januar ' +
    'um 0:00 Uhr'],
  ['0 0 9 * * * 2030/4,2031',
    'in den Jahren 2030, 2034, 2038 usw. sowie 2031 täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030/3,2031/3',
    'in den Jahren 2030, 2033, 2036 usw. sowie 2031, 2034, 2037 usw. ' +
    'täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030-2060/2,2071',
    'in den Jahren 2030, 2032, 2034 usw. bis 2060 sowie 2071 täglich um ' +
    '9:00 Uhr'],
  ['0 0 9 * * * 2030-2040,2045/5',
    'in den Jahren 2030 bis 2040 sowie 2045, 2050, 2055 usw. täglich um ' +
    '9:00 Uhr'],
  ['0 0 9 * * * 2030,2032,2034,2036,2038,2042,2044,2046,2048,2050',
    'in geraden Jahren von 2030 bis 2050, außer 2040, täglich um 9:00 Uhr'],
  ['0 0 9 * * * 2030/2,2031/4',
    'in den Jahren 2030, 2032, 2034 usw. sowie 2031, 2035, 2039 usw. ' +
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
  ['30 * * * *', 'Stündlich um :30', {form: 'label'}],
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
    'montags und zusätzlich am 1. jedes Monats, jeweils stündlich um :30'],
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
    'montags und zusätzlich vom 1. bis 14. und vom 16. bis 31. jedes ' +
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
    'jährlich an den ungeraden Tagen im Juni (1., 3., 5. … 29.) um 0:00 ' +
    'Uhr'],
  // A cadence the pattern itself stops early is a series.
  ['0 0 1-29/2 6 *', 'jährlich am 1., 3., 5. … und 29. Juni um 0:00 Uhr'],
  ['0 0 */2 1,7 *',
    'im Januar und Juli jeweils an den ungeraden Tagen (1., 3., 5. … 31.) ' +
    'um 0:00 Uhr'],
  ['0 0 */5 6 *',
    'jährlich am 1., 6., 11., 16., 21. und 26. Juni um 0:00 Uhr'],
  ['0 0 */3 2 *', 'jährlich am 1., 4., 7. … und 28. Februar um 0:00 Uhr'],
  ['0 0 8/2 6 *', 'jährlich am 8., 10., 12. … und 30. Juni um 0:00 Uhr'],
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
    'im Juni und Juli vom 1. bis 14. und vom 16. bis 31., jeweils um 0:00 ' +
    'Uhr'],
  ['0 0 1-14,17-31 * *',
    'täglich, außer am 15. und 16. jedes Monats, um 0:00 Uhr'],
  ['0 0 2-31 * *', 'vom 2. bis 31. jedes Monats täglich um 0:00 Uhr'],
  ['0 12 1-5,10,20-25 * *',
    'vom 1. bis 5., am 10. und vom 20. bis 25. jedes Monats jeweils um ' +
    '12:00 Uhr'],
  ['0 0 28-3 * *',
    'vom 1. bis 3. und vom 28. bis 31. jedes Monats jeweils um 0:00 Uhr'],
  ['0 0 5-20/3 * *',
    'am 5., 8., 11., 14., 17. und 20. jedes Monats um 0:00 Uhr'],
  ['0 0 8/2 * *', 'am 8., 10., 12. … und 30. jedes Monats um 0:00 Uhr'],
  ['0 0 */3 * *', 'am 1., 4., 7. … und 31. jedes Monats um 0:00 Uhr'],
  ['0 0 */3 4,6 *',
    'im April und Juni jeweils am 1., 4., 7. … und 28. um 0:00 Uhr'],
  ['0 12 1-5,10,20-25 1,7 *',
    'im Januar und Juli vom 1. bis 5., am 10. und vom 20. bis 25., jeweils ' +
    'um 12:00 Uhr'],
  ['0 0 31 * *', 'am 31. jedes Monats um 0:00 Uhr'],
  ['0 0 */21 * *', 'am 1. und 22. jedes Monats um 0:00 Uhr'],
  ['*/15 9-17 1-7 * *',
    'vom 1. bis 7. jedes Monats täglich von 9:00 bis 17:45 Uhr alle 15 ' +
    'Minuten'],
  ['30 * 1-7 * *', 'vom 1. bis 7. jedes Monats stündlich um :30'],
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
  ['58-2 * * * *', 'stündlich um :00, :01, :02, :58 und :59'],
  ['57-2 * * * *',
    'stündlich von :00 bis :02 und von :57 bis :59 jede Minute'],
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

  // Clock times: the list, «Uhr», and what competes with them.
  ['0,30 9,17 * * *', 'täglich um 9:00, 9:30, 17:00 und 17:30 Uhr'],
  ['5,20 9,17 * * *', 'täglich um 9:05, 9:20, 17:05 und 17:20 Uhr'],
  ['5,20,45 9,17 * * *',
    'täglich um 9:05, 9:20, 9:45, 17:05, 17:20 und 17:45 Uhr'],
  ['5,20,35,50 9,17 * * *',
    'täglich von 9:05 bis 9:50 und von 17:05 bis 17:50 Uhr jeweils um :05, ' +
    ':20, :35 und :50'],
  ['5,20,35,50 9,17 * * 1',
    'montags von 9:05 bis 9:50 und von 17:05 bis 17:50 Uhr jeweils um :05, ' +
    ':20, :35 und :50'],
  ['0 1 * * *', 'täglich um 1:00 Uhr'],
  ['30 1,13 * * *', 'täglich um 1:30 und 13:30 Uhr'],
  ['0 9,13 * * *', 'täglich um 9:00 und 13:00 Uhr'],
  ['0 9,10 * * *', 'täglich um 9:00 und 10:00 Uhr'],
  ['* 9,10 * * *', 'täglich von 9:00 bis 10:59 Uhr jede Minute'],
  ['30 0 * * *', 'täglich um 0:30 Uhr'],
  ['30 0 0 * * *', 'täglich um 0:00:30 Uhr'],
  ['30 12 * * *', 'täglich um 12:30 Uhr'],
  ['1 * * * *', 'stündlich um :01'],
  ['* 22-23 * * *', 'täglich von 22:00 bis 23:59 Uhr jede Minute'],
  ['*/30 0-17 * * 2', 'dienstags von 0:00 bis 17:30 Uhr alle 30 Minuten'],
  ['0 0-6,22,23 * * *',
    'täglich von 0:00 bis 6:00 Uhr stündlich sowie um 22:00 und 23:00 Uhr'],
  ['*/15 0-5,22-23 * * *',
    'täglich von 0:00 bis 5:45 und von 22:00 bis 23:45 Uhr alle 15 Minuten'],
  ['*/20 9 * * *', 'täglich um 9:00, 9:20 und 9:40 Uhr'],
  ['5/10 9 * * *', 'täglich von 9:05 bis 9:55 Uhr alle 10 Minuten'],

  // Hour cadences, two hours, exceptions.
  ['0 0,6,12,18 * * *', 'täglich um 0:00, 6:00, 12:00 und 18:00 Uhr'],
  ['0 0,6,18 * * *', 'täglich um 0:00, 6:00 und 18:00 Uhr'],
  ['0 */3 * * *', 'täglich von 0:00 bis 21:00 Uhr alle 3 Stunden'],
  ['0 */8 * * *', 'täglich um 0:00, 8:00 und 16:00 Uhr'],
  ['0 */5 * * *', 'täglich von 0:00 bis 20:00 Uhr alle 5 Stunden'],
  ['0 2-22/4 * * *', 'täglich von 2:00 bis 22:00 Uhr alle 4 Stunden'],
  ['0 4-22/6 * * *', 'täglich um 4:00, 10:00, 16:00 und 22:00 Uhr'],
  ['30 */2 * * *', 'täglich von 0:30 bis 22:30 Uhr alle 2 Stunden'],
  ['30 */3 * * *', 'täglich von 0:30 bis 21:30 Uhr alle 3 Stunden'],
  ['30 */5 * * *', 'täglich von 0:30 bis 20:30 Uhr alle 5 Stunden'],
  ['23 */6 * * *', 'täglich um 0:23, 6:23, 12:23 und 18:23 Uhr'],
  ['23 1/2 * * *', 'täglich von 1:23 bis 23:23 Uhr alle 2 Stunden'],
  ['0 1/2 * * 1', 'montags von 1:00 bis 23:00 Uhr alle 2 Stunden'],
  ['15,45 */2 * * *',
    'täglich um 0:15, 0:45, 2:15, 2:45 … 22:15 und 22:45 Uhr'],
  ['15,45 */4 * * *',
    'täglich um 0:15, 0:45, 4:15, 4:45 … 20:15 und 20:45 Uhr'],
  ['0,15,45 */4 * * *',
    'täglich um 0:00, 0:15, 0:45, 4:00, 4:15, 4:45 … 20:00, 20:15 und ' +
    '20:45 Uhr'],
  // A series of clock times holds three minutes to the hour at most;
  // more are said once, after the hours' windows.
  ['5/10 */2 * * *',
    'täglich in den geraden Stunden (0:05–0:55, 2:05–2:55 … 22:05–22:55 ' +
    'Uhr) jeweils um :05, :15, :25, :35, :45 und :55'],
  ['5,20,35,50 8-18/2 * * *',
    'täglich von 8:05 bis 8:50, von 10:05 bis 10:50 … und von 18:05 bis ' +
    '18:50 Uhr jeweils um :05, :20, :35 und :50'],
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
    'täglich von 1:00 bis 23:00 Uhr alle 2 Stunden, außer um 9:00 Uhr'],
  ['30 0-2,4-23 * * *', 'stündlich um :30, außer um 3:30 Uhr'],
  ['5,20,45 0-2,4-23 * * *',
    'stündlich um :05, :20 und :45, außer von 3:05 bis 3:45 Uhr'],
  ['*/10 0-2,4-23 * * *', 'alle 10 Minuten, außer von 3:00 bis 3:50 Uhr'],
  ['0-28,30-59 * * * *', 'jede Minute, außer um :29'],
  ['0-28,30-59 9,17 * * *',
    'täglich von 9:00 bis 9:59 und von 17:00 bis 17:59 Uhr jede Minute, ' +
    'außer um :29'],
  ['0,10,20,40,50 9-17 * * *',
    'täglich von 9:00 bis 17:50 Uhr alle 10 Minuten, außer um :30'],
  ['0,10,20,40,50 9 * * *',
    'täglich von 9:00 bis 9:50 Uhr alle 10 Minuten, außer um 9:30 Uhr'],
  ['0,10,20,40,50 0-2,4-23 * * *',
    'alle 10 Minuten, außer von 3:00 bis 3:50 Uhr und um :30'],
  ['* 0-28,30-59 * * * *', 'jede Sekunde, außer von :29:00 bis :29:59'],
  ['* 0-28,30-59 9 * * *',
    'täglich von 9:00:00 bis 9:59:59 Uhr jede Sekunde, außer von 9:29:00 ' +
    'bis 9:29:59 Uhr'],
  ['0-28,30-59 * * * * *',
    'jede Sekunde, außer 29 Sekunden nach jeder vollen Minute'],
  ['0-28,30-59 0 9 * * *',
    'täglich von 9:00:00 bis 9:00:59 Uhr jede Sekunde, außer um 9:00:29 Uhr'],

  // Hours as a confinement.
  ['*/15 8-18/2 * * *',
    'täglich von 8:00 bis 8:45, von 10:00 bis 10:45 … und von 18:00 bis ' +
    '18:45 Uhr alle 15 Minuten'],
  ['0 9-17,20,22 * * *',
    'täglich von 9:00 bis 17:00 Uhr stündlich sowie um 20:00 und 22:00 Uhr'],
  ['* 9-17,20,22 * * *',
    'täglich von 9:00 bis 17:59, von 20:00 bis 20:59 und von 22:00 bis ' +
    '22:59 Uhr jede Minute'],
  ['*/10 6-8,17-19 * * 1-5',
    'montags bis freitags von 6:00 bis 8:50 und von 17:00 bis 19:50 Uhr ' +
    'alle 10 Minuten'],
  ['*/20 */2 */2 */3 *',
    'im Januar, April, Juli und Oktober jeweils an den ungeraden Tagen ' +
    '(1., 3., 5. … 31.) in den geraden Stunden (0:00–0:40, 2:00–2:40 … ' +
    '22:00–22:40 Uhr) alle 20 Minuten'],
  ['5,20,45 9-17,22 * * *',
    'täglich von 9:05 bis 17:45 und von 22:05 bis 22:45 Uhr stündlich um ' +
    ':05, :20 und :45'],
  ['5,20,45 9-17 * * *',
    'täglich von 9:05 bis 17:45 Uhr stündlich um :05, :20 und :45'],

  // Minutes inside the hour.
  ['50-10 9 * * *',
    'täglich von 9:00 bis 9:10 und von 9:50 bis 9:59 Uhr jede Minute'],
  ['10-40 9 * * *', 'täglich von 9:10 bis 9:40 Uhr jede Minute'],
  ['30-59 9 * * *', 'täglich von 9:30 bis 9:59 Uhr jede Minute'],
  ['5-10,20 * * * *', 'stündlich von :05 bis :10 jede Minute sowie um :20'],
  ['50-10 * * * *',
    'stündlich von :00 bis :10 und von :50 bis :59 jede Minute'],
  ['50-10 * * * 1',
    'montags stündlich von :00 bis :10 und von :50 bis :59 jede Minute'],
  ['0-40/5 * * * *', 'stündlich von :00 bis :40 alle 5 Minuten'],
  ['5-10,20 9-17 * * *',
    'täglich von 9:05 bis 17:20 Uhr stündlich von :05 bis :10 jede Minute ' +
    'sowie um :20'],
  ['45-59 * * * *', 'stündlich von :45 bis :59 jede Minute'],
  ['10-40 * * * *', 'stündlich von :10 bis :40 jede Minute'],
  ['0-29 9,17 * * *',
    'täglich von 9:00 bis 9:29 und von 17:00 bis 17:29 Uhr jede Minute'],
  ['0-1 * * * *', 'stündlich um :00 und :01'],
  ['*/21 * * * *', 'stündlich um :00, :21 und :42'],
  ['9,14,47,56 * * * *', 'stündlich um :09, :14, :47 und :56'],
  ['5/10 * * * *', 'stündlich um :05, :15, :25, :35, :45 und :55'],
  ['5/5 * * * *', 'stündlich von :05 bis :55 alle 5 Minuten'],
  ['30 * * * 1', 'montags stündlich um :30'],

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
  ['30 0 */2 * * *', 'täglich von 0:00:30 bis 22:00:30 Uhr alle 2 Stunden'],
  ['15 30 * * * *', 'stündlich um :30:15'],
  ['30 5,20 * * * *', 'stündlich um :05:30 und :20:30'],
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
    'täglich in den geraden Stunden (0:00–0:45, 2:00–2:45 … 22:00–22:45 ' +
    'Uhr) alle 15 Minuten, jeweils 30 Sekunden nach der vollen Minute'],
  ['15 0 */6 * * *', 'täglich um 0:00:15, 6:00:15, 12:00:15 und 18:00:15 Uhr'],
  ['15 0 */3 * * *', 'täglich von 0:00:15 bis 21:00:15 Uhr alle 3 Stunden'],
  ['15,45 30 9,17 * * *',
    'täglich um 9:30:15, 9:30:45, 17:30:15 und 17:30:45 Uhr'],
  ['15,45 */15 9-17 * * *',
    'täglich von 9:00 bis 17:45 Uhr alle 15 Minuten, jeweils 15 und 45 ' +
    'Sekunden nach der vollen Minute'],
  ['8 5,30 */2 * * *',
    'täglich um 0:05:08, 0:30:08, 2:05:08, 2:30:08 … 22:05:08 und 22:30:08 ' +
    'Uhr'],
  ['* 0-29 * * * *', 'stündlich von :00:00 bis :29:59 jede Sekunde'],
  ['* 30 * * * *', 'stündlich um :30, jeweils eine Minute lang jede Sekunde'],
  ['* */15 8,12,18 * * *',
    'täglich von 8:00 bis 8:45, von 12:00 bis 12:45 und von 18:00 bis ' +
    '18:45 Uhr alle 15 Minuten, jeweils eine Minute lang jede Sekunde'],
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
    'Sekunden nach der vollen Minute'],
  // Scattered seconds with no run among them are said in full.
  ['1,4,9,16,25,36,49 * * * * *',
    'jede Minute, jeweils 1, 4, 9, 16, 25, 36 und 49 Sekunden nach der ' +
    'vollen Minute'],

  // «Täglich» fills the level a restricted hour would skip, and is
  // not said of a schedule that runs every hour of the day.
  ['*/5 * * 6 *', 'im Juni alle 5 Minuten'],
  ['0 */6 * 6 *', 'im Juni täglich um 0:00, 6:00, 12:00 und 18:00 Uhr'],
  ['0 */2 * 6 *', 'im Juni täglich von 0:00 bis 22:00 Uhr alle 2 Stunden'],
  ['30 * * 6 *', 'im Juni stündlich um :30'],
  ['0 * * * 1', 'montags zu jeder vollen Stunde'],
  ['*/5 * * * * 2030', 'im Jahr 2030 alle 5 Minuten', {years: true}],
  ['30 * * * * 2030', 'im Jahr 2030 stündlich um :30', {years: true}],

  // Several fields at once.
  ['*/10 24 */3 23-25 * 1-2',
    'montags und dienstags und zusätzlich vom 23. bis 25. jedes Monats, ' +
    'jeweils von 0:24 bis 21:24 Uhr alle 3 Stunden, jeweils zur vollen ' +
    'Minute sowie 10, 20, 30, 40 und 50 Sekunden danach'],
  ['*/30 23 */12 * 6-7 6#2 2030/4',
    'in den Jahren 2030, 2034, 2038 usw. jeweils im Juni und Juli am ' +
    'zweiten Samstag um 0:23:00, 0:23:30, 12:23:00 und 12:23:30 Uhr'],
  ['0 35 2,15 * * * 2028,2030',
    'in den Jahren 2028 und 2030 täglich um 2:35 und 15:35 Uhr'],
  ['* 30,42 3-10 * 7,9,10,12 1,3,4,5',
    'im Juli, September, Oktober und Dezember montags und mittwochs bis ' +
    'freitags von 3:30 bis 10:42 Uhr stündlich um :30 und :42, jeweils ' +
    'eine Minute lang jede Sekunde'],
  ['0 18 15W 3,6,9,12 *',
    'im März, Juni, September und Dezember jeweils am Wochentag (Montag ' +
    'bis Freitag), der dem 15. am nächsten liegt, um 18:00 Uhr'],
  ['7 4-22/6 1 */2 *',
    'im Januar, März, Mai, Juli, September und November jeweils am 1. um ' +
    '4:07, 10:07, 16:07 und 22:07 Uhr'],

  // Runs and cadences together, field by field.
  ['0-20/2,21-59/3 * * * *',
    'stündlich von :00 bis :20 alle 2 Minuten und von :21 bis :57 alle 3 ' +
    'Minuten'],
  ['0-20/2,21-59/3 9 * * *',
    'täglich von 9:00 bis 9:20 Uhr alle 2 Minuten und von 9:21 bis 9:57 ' +
    'Uhr alle 3 Minuten'],
  ['0-20/2,21-59/3 9-17 * * *',
    'täglich von 9:00 bis 17:57 Uhr stündlich von :00 bis :20 alle 2 ' +
    'Minuten und von :21 bis :57 alle 3 Minuten'],
  ['0 0-10/2,11-23/3 * * *',
    'täglich von 0:00 bis 10:00 Uhr alle 2 Stunden und von 11:00 bis 23:00 ' +
    'Uhr alle 3 Stunden'],
  ['* 0-10/2,11-23/3 * * *',
    'täglich von 0:00 bis 0:59, von 2:00 bis 2:59 … und von 10:00 bis ' +
    '10:59 sowie von 11:00 bis 11:59, von 14:00 bis 14:59 … und von 23:00 ' +
    'bis 23:59 Uhr jede Minute'],
  ['0 0 1-10/2,11-31/3 * *',
    'am 1., 3., 5. … und 11. sowie am 14., 17., 20. … und 29. jedes Monats ' +
    'um 0:00 Uhr'],
  ['0 0 1-20/2,24-30/3 * *',
    'am 1., 3., 5. … und 19. sowie am 24., 27. und 30. jedes Monats um ' +
    '0:00 Uhr'],
  ['0 0 1-10,12-30/2 * *',
    'vom 1. bis 10. sowie am 12., 14., 16. … und 30. jedes Monats jeweils ' +
    'um 0:00 Uhr'],
  ['0-20/2,21-59/3 * * * * *',
    'jede Minute, jeweils in den Sekunden 0, 2, 4 … 20 sowie 21, 24, 27 … ' +
    '57'],
  ['0-20/2,30-45/5 * * * * *',
    'jede Minute, jeweils in den Sekunden 0, 2, 4 … 20 sowie 30, 35, 40 ' +
    'und 45'],

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
    'freitags und zusätzlich vom 1. bis 14. und vom 16. bis 31. jedes ' +
    'Monats, jeweils um 9:00 Uhr'],
  ['0 9 2,4,6,8,10,12,14,18,20,22,24,26,28,30 * 5',
    'freitags und zusätzlich an den geraden Tagen jedes Monats (2., 4., 6. ' +
    '… 30., ohne den 16.), jeweils um 9:00 Uhr'],
  ['0 9 2,4,6,8,10,12,14,18,20,22,24,26,28,30 * *',
    'an den geraden Tagen jedes Monats (2., 4., 6. … 30.), außer am 16., ' +
    'um 9:00 Uhr'],

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
    'vom 1. bis 10. und vom 20. bis 31. jedes Monats jeweils um 0:00 Uhr'],

  // «Jährlich» with other time parts, and with February's odd days.
  ['*/5 * 1 6 *', 'jährlich am 1. Juni alle 5 Minuten'],
  ['0 0 */2 2 *',
    'jährlich an den ungeraden Tagen im Februar (1., 3., 5. … 29.) um 0:00 ' +
    'Uhr'],
  ['0 0 31W */2 *',
    'im Januar, März, Mai und Juli jeweils am Wochentag (Montag bis ' +
    'Freitag), der dem 31. im selben Monat am nächsten liegt, um 0:00 Uhr']
];

export {rows};
