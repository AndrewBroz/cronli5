// German paradigms a renderer's builder may see: one row per grid
// pattern at a visible position.
//
// Written by hand from src/lang/de/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *', 'täglich jede Sekunde von 9:00:00 bis 9:00:59 Uhr'],
  ['*/6 0 9 * * *', 'täglich alle 6 Sekunden von 9:00:00 bis 9:00:54 Uhr'],
  ['5/10 0 9 * * *', 'täglich alle 10 Sekunden von 9:00:05 bis 9:00:55 Uhr'],

  // clock / minute
  ['* 9 * * *', 'täglich jede Minute von 9:00 bis 9:59 Uhr'],
  ['5,20,45 9 * * *', 'täglich um 9:05, 9:20 und 9:45 Uhr'],
  ['*/15 9 * * *', 'täglich alle 15 Minuten von 9:00 bis 9:45 Uhr'],
  ['0,15,45 9 * * *', 'täglich um 9:00, 9:15 und 9:45 Uhr'],

  // clock / hour
  ['0 * * * *', 'zu jeder vollen Stunde'],
  ['0 9,17 * * *', 'täglich um 9:00 und 17:00 Uhr'],
  ['0 9-17,22 * * *',
    'täglich stündlich von 9:00 bis 17:00 Uhr und um 22:00 Uhr'],
  ['0 1/2 * * *', 'täglich alle 2 Stunden von 1:00 bis 23:00 Uhr'],

  // clock / date
  ['0 9 1 * *', 'am 1. jedes Monats um 9:00 Uhr'],
  ['0 9 1,10,20 * *', 'am 1., 10. und 20. jedes Monats um 9:00 Uhr'],
  ['0 9 */2 * *', 'an ungeraden Tagen jedes Monats um 9:00 Uhr'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'an ungeraden Tagen jedes Monats, außer am 15., um 9:00 Uhr'],

  // clock / month
  ['0 9 * 1 *', 'täglich im Januar um 9:00 Uhr'],
  ['0 9 * 3,6,9,12 *',
    'täglich im März, Juni, September und Dezember um 9:00 Uhr'],
  ['0 9 * */2 *',
    'täglich in jedem 2. Monat von Januar bis November jeweils um 9:00 Uhr'],
  ['0 9 * 11-2 *', 'täglich von November bis Februar jeweils um 9:00 Uhr'],

  // clock / weekday
  ['0 9 * * 1', 'montags um 9:00 Uhr'],
  ['0 9 * * 1-5', 'montags bis freitags um 9:00 Uhr'],
  ['0 9 * * 2,4', 'dienstags und donnerstags um 9:00 Uhr'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'montags bis freitags alle 15 Minuten von 9:00 bis 17:45 Uhr, jeweils ' +
    'eine Minute lang jede Sekunde'],
  ['*/6 */15 9-17 * * 1-5',
    'montags bis freitags alle 15 Minuten von 9:00 bis 17:45 Uhr, jeweils ' +
    'eine Minute lang alle 6 Sekunden'],
  ['5/10 */15 9-17 * * 1-5',
    'montags bis freitags alle 15 Minuten von 9:00 bis 17:45 Uhr, jeweils ' +
    'alle 10 Sekunden von 5 bis 55 Sekunden nach der vollen Minute'],

  // window / minute
  ['* 9-17 * * 1-5', 'montags bis freitags jede Minute von 9:00 bis 17:59 Uhr'],
  ['0,30 9-17 * * 1-5',
    'montags bis freitags alle 30 Minuten von 9:00 bis 17:30 Uhr'],
  ['0-29,45 9-17 * * 1-5',
    'montags bis freitags jede Minute in den ersten 30 Minuten nach jeder ' +
    'vollen Stunde von 9:00 bis 17:00 Uhr sowie 45 Minuten nach jeder ' +
    'dieser Stunden'],
  ['0,15,45 9-17 * * 1-5',
    'montags bis freitags zu jeder vollen Stunde von 9:00 bis 17:00 Uhr ' +
    'sowie 15 und 45 Minuten danach'],

  // window / hour
  ['*/15 * * * 1-5', 'montags bis freitags alle 15 Minuten'],
  ['*/15 12 * * 1-5',
    'montags bis freitags alle 15 Minuten von 12:00 bis 12:45 Uhr'],
  ['*/15 9-17,22 * * 1-5',
    'montags bis freitags alle 15 Minuten von 9:00 bis 17:45 Uhr und von ' +
    '22:00 bis 22:45 Uhr'],
  ['*/15 1/2 * * 1-5',
    'montags bis freitags alle 2 Stunden von 1:00 bis 23:00 Uhr, jeweils ' +
    'eine Stunde lang alle 15 Minuten'],

  // window / date
  ['*/15 9-17 1 * 1-5',
    'am 1. jedes Monats sowie montags bis freitags, jeweils alle 15 ' +
    'Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 1,10,20 * 1-5',
    'am 1., 10. und 20. jedes Monats sowie montags bis freitags, jeweils ' +
    'alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 */2 * 1-5',
    'an ungeraden Tagen jedes Monats sowie montags bis freitags, jeweils ' +
    'alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'an ungeraden Tagen jedes Monats, außer am 15., sowie montags bis ' +
    'freitags, jeweils alle 15 Minuten von 9:00 bis 17:45 Uhr'],

  // window / month
  ['*/15 9-17 * 1 1-5',
    'montags bis freitags im Januar alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'montags bis freitags im März, Juni, September und Dezember alle 15 ' +
    'Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * */2 1-5',
    'montags bis freitags in jedem 2. Monat von Januar bis November alle ' +
    '15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * 11-2 1-5',
    'montags bis freitags von November bis Februar alle 15 Minuten von ' +
    '9:00 bis 17:45 Uhr'],

  // window / weekday
  ['*/15 9-17 * * *', 'täglich alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * * 1,3,5',
    'montags, mittwochs und freitags alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * * 2,4',
    'dienstags und donnerstags alle 15 Minuten von 9:00 bis 17:45 Uhr'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *',
    'am 1. jedes Monats jede Sekunde von 0:00:00 bis 0:00:59 Uhr'],
  ['*/6 0 0 1 * *',
    'am 1. jedes Monats alle 6 Sekunden von 0:00:00 bis 0:00:54 Uhr'],
  ['5/10 0 0 1 * *',
    'am 1. jedes Monats alle 10 Sekunden von 0:00:05 bis 0:00:55 Uhr'],

  // monthly / minute
  ['* 0 1 * *', 'am 1. jedes Monats jede Minute von 0:00 bis 0:59 Uhr'],
  ['5,20,45 0 1 * *', 'am 1. jedes Monats um 0:05, 0:20 und 0:45 Uhr'],
  ['*/15 0 1 * *', 'am 1. jedes Monats alle 15 Minuten von 0:00 bis 0:45 Uhr'],
  ['0,15,45 0 1 * *', 'am 1. jedes Monats um 0:00, 0:15 und 0:45 Uhr'],

  // monthly / hour
  ['0 * 1 * *', 'am 1. jedes Monats zu jeder vollen Stunde'],
  ['0 9,17 1 * *', 'am 1. jedes Monats um 9:00 und 17:00 Uhr'],
  ['0 9-17,22 1 * *',
    'am 1. jedes Monats stündlich von 9:00 bis 17:00 Uhr und um 22:00 Uhr'],
  ['0 1/2 1 * *', 'am 1. jedes Monats alle 2 Stunden von 1:00 bis 23:00 Uhr'],

  // monthly / date
  ['0 0 * * *', 'täglich um 0:00 Uhr'],
  ['0 0 1,10,20 * *', 'am 1., 10. und 20. jedes Monats um 0:00 Uhr'],
  ['0 0 */2 * *', 'an ungeraden Tagen jedes Monats um 0:00 Uhr'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'an ungeraden Tagen jedes Monats, außer am 15., um 0:00 Uhr'],

  // monthly / month
  ['0 0 1 1 *', 'am 1. Januar um 0:00 Uhr'],
  ['0 0 1 3,6,9,12 *',
    'am 1. der Monate März, Juni, September und Dezember um 0:00 Uhr'],
  ['0 0 1 */2 *',
    'am 1. jedes 2. Monats von Januar bis November jeweils um 0:00 Uhr'],
  ['0 0 1 11-2 *', 'am 1. der Monate November bis Februar jeweils um 0:00 Uhr'],

  // monthly / weekday
  ['0 0 1 * 1', 'am 1. jedes Monats sowie montags, jeweils um 0:00 Uhr'],
  ['0 0 1 * 1-5',
    'am 1. jedes Monats sowie montags bis freitags, jeweils um 0:00 Uhr'],
  ['0 0 1 * 2,4',
    'am 1. jedes Monats sowie dienstags und donnerstags, jeweils um 0:00 ' +
    'Uhr'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'jede Sekunde'],
  ['*/6 * * * * *', 'alle 6 Sekunden'],
  ['5/10 * * * * *',
    'alle 10 Sekunden von 5 bis 55 Sekunden nach jeder vollen Minute'],

  // open / minute
  ['5,20,45 * * * *', '5, 20 und 45 Minuten nach jeder vollen Stunde'],
  ['*/15 * * * *', 'alle 15 Minuten'],
  ['0,15,45 * * * *', 'zu jeder vollen Stunde sowie 15 und 45 Minuten danach'],

  // open / hour
  ['* 0 * * *', 'täglich jede Minute von 0:00 bis 0:59 Uhr'],
  ['* 9,17 * * *',
    'täglich jede Minute von 9:00 bis 9:59 Uhr und von 17:00 bis 17:59 Uhr'],
  ['* 9-17,22 * * *',
    'täglich jede Minute von 9:00 bis 17:59 Uhr und von 22:00 bis 22:59 Uhr'],
  ['* 1/2 * * *',
    'täglich alle 2 Stunden von 1:00 bis 23:00 Uhr, jeweils eine Stunde ' +
    'lang jede Minute'],

  // open / date
  ['* * 1 * *', 'am 1. jedes Monats jede Minute'],
  ['* * 1,10,20 * *', 'am 1., 10. und 20. jedes Monats jede Minute'],
  ['* * */2 * *', 'an ungeraden Tagen jedes Monats jede Minute'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'an ungeraden Tagen jedes Monats, außer am 15., jede Minute'],

  // open / month
  ['* * * 1 *', 'im Januar jede Minute'],
  ['* * * 3,6,9,12 *', 'im März, Juni, September und Dezember jede Minute'],
  ['* * * */2 *', 'in jedem 2. Monat von Januar bis November jede Minute'],
  ['* * * 11-2 *', 'von November bis Februar jede Minute'],

  // open / weekday
  ['* * * * 1', 'montags jede Minute'],
  ['* * * * 1-5', 'montags bis freitags jede Minute'],
  ['* * * * 2,4', 'dienstags und donnerstags jede Minute']
];

export {rows};
