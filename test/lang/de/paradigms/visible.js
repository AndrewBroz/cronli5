// German paradigms a renderer's builder may see: one row per grid
// pattern at a visible position.
//
// Written by hand from src/lang/de/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *', 'täglich von 9:00:00 bis 9:00:59 Uhr jede Sekunde'],
  ['*/6 0 9 * * *', 'täglich von 9:00:00 bis 9:00:54 Uhr alle 6 Sekunden'],
  ['5/10 0 9 * * *', 'täglich von 9:00:05 bis 9:00:55 Uhr alle 10 Sekunden'],

  // clock / minute
  ['* 9 * * *', 'täglich von 9:00 bis 9:59 Uhr jede Minute'],
  ['5,20,45 9 * * *', 'täglich um 9:05, 9:20 und 9:45 Uhr'],
  ['*/15 9 * * *', 'täglich von 9:00 bis 9:45 Uhr alle 15 Minuten'],
  ['0,15,45 9 * * *', 'täglich um 9:00, 9:15 und 9:45 Uhr'],

  // clock / hour
  ['0 * * * *', 'zu jeder vollen Stunde'],
  ['0 9,17 * * *', 'täglich um 9:00 und 17:00 Uhr'],
  ['0 9-17,22 * * *',
    'täglich von 9:00 bis 17:00 Uhr stündlich sowie um 22:00 Uhr'],
  ['0 1/2 * * *', 'täglich von 1:00 bis 23:00 Uhr alle 2 Stunden'],

  // clock / date
  ['0 9 1 * *', 'am 1. jedes Monats um 9:00 Uhr'],
  ['0 9 1,10,20 * *', 'am 1., 10. und 20. jedes Monats um 9:00 Uhr'],
  ['0 9 */2 * *',
    'an den ungeraden Tagen jedes Monats (1., 3., 5. … 31.) um 9:00 Uhr'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'an den ungeraden Tagen jedes Monats (1., 3., 5. … 31.), außer am 15., ' +
    'um 9:00 Uhr'],

  // clock / month
  ['0 9 * 1 *', 'im Januar täglich um 9:00 Uhr'],
  ['0 9 * 3,6,9,12 *',
    'im März, Juni, September und Dezember täglich um 9:00 Uhr'],
  ['0 9 * */2 *',
    'im Januar, März, Mai, Juli, September und November täglich um 9:00 Uhr'],
  ['0 9 * 11-2 *', 'von November bis Februar täglich um 9:00 Uhr'],

  // clock / weekday
  ['0 9 * * 1', 'montags um 9:00 Uhr'],
  ['0 9 * * 1-5', 'montags bis freitags um 9:00 Uhr'],
  ['0 9 * * 2,4', 'dienstags und donnerstags um 9:00 Uhr'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:45 Uhr alle 15 Minuten, jeweils ' +
    'eine Minute lang jede Sekunde'],
  ['*/6 */15 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:45 Uhr alle 15 Minuten, jeweils ' +
    '10-mal im Abstand von 6 Sekunden'],
  ['5/10 */15 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:45 Uhr alle 15 Minuten, jeweils ' +
    '5, 15, 25, 35, 45 und 55 Sekunden nach der vollen Minute'],

  // window / minute
  ['* 9-17 * * 1-5', 'montags bis freitags von 9:00 bis 17:59 Uhr jede Minute'],
  ['0,30 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:30 Uhr alle 30 Minuten'],
  ['0-29,45 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:45 Uhr stündlich von :00 bis :29 ' +
    'jede Minute sowie um :45'],
  ['0,15,45 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:45 Uhr stündlich um :00, :15 und ' +
    ':45'],

  // window / hour
  ['*/15 * * * 1-5', 'montags bis freitags alle 15 Minuten'],
  ['*/15 12 * * 1-5',
    'montags bis freitags von 12:00 bis 12:45 Uhr alle 15 Minuten'],
  ['*/15 9-17,22 * * 1-5',
    'montags bis freitags von 9:00 bis 17:45 und von 22:00 bis 22:45 Uhr ' +
    'alle 15 Minuten'],
  ['*/15 1/2 * * 1-5',
    'montags bis freitags in den ungeraden Stunden (1:00–1:45, 3:00–3:45 … ' +
    '23:00–23:45 Uhr) alle 15 Minuten'],

  // window / date
  ['*/15 9-17 1 * 1-5',
    'montags bis freitags und zusätzlich am 1. jedes Monats, jeweils von ' +
    '9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 1,10,20 * 1-5',
    'montags bis freitags und zusätzlich am 1., 10. und 20. jedes Monats, ' +
    'jeweils von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 */2 * 1-5',
    'montags bis freitags und zusätzlich an den ungeraden Tagen jedes ' +
    'Monats (1., 3., 5. … 31.), jeweils von 9:00 bis 17:45 Uhr alle 15 ' +
    'Minuten'],
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'montags bis freitags und zusätzlich an den ungeraden Tagen jedes ' +
    'Monats (1., 3., 5. … 31.), außer am 15., jeweils von 9:00 bis 17:45 ' +
    'Uhr alle 15 Minuten'],

  // window / month
  ['*/15 9-17 * 1 1-5',
    'im Januar montags bis freitags von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'im März, Juni, September und Dezember montags bis freitags von 9:00 ' +
    'bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * */2 1-5',
    'im Januar, März, Mai, Juli, September und November montags bis ' +
    'freitags von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * 11-2 1-5',
    'von November bis Februar montags bis freitags von 9:00 bis 17:45 Uhr ' +
    'alle 15 Minuten'],

  // window / weekday
  ['*/15 9-17 * * *', 'täglich von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * * 1,3,5',
    'montags, mittwochs und freitags von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * * 2,4',
    'dienstags und donnerstags von 9:00 bis 17:45 Uhr alle 15 Minuten'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *',
    'am 1. jedes Monats von 0:00:00 bis 0:00:59 Uhr jede Sekunde'],
  ['*/6 0 0 1 * *',
    'am 1. jedes Monats von 0:00:00 bis 0:00:54 Uhr alle 6 Sekunden'],
  ['5/10 0 0 1 * *',
    'am 1. jedes Monats von 0:00:05 bis 0:00:55 Uhr alle 10 Sekunden'],

  // monthly / minute
  ['* 0 1 * *', 'am 1. jedes Monats von 0:00 bis 0:59 Uhr jede Minute'],
  ['5,20,45 0 1 * *', 'am 1. jedes Monats um 0:05, 0:20 und 0:45 Uhr'],
  ['*/15 0 1 * *', 'am 1. jedes Monats von 0:00 bis 0:45 Uhr alle 15 Minuten'],
  ['0,15,45 0 1 * *', 'am 1. jedes Monats um 0:00, 0:15 und 0:45 Uhr'],

  // monthly / hour
  ['0 * 1 * *', 'am 1. jedes Monats zu jeder vollen Stunde'],
  ['0 9,17 1 * *', 'am 1. jedes Monats um 9:00 und 17:00 Uhr'],
  ['0 9-17,22 1 * *',
    'am 1. jedes Monats von 9:00 bis 17:00 Uhr stündlich sowie um 22:00 Uhr'],
  ['0 1/2 1 * *', 'am 1. jedes Monats von 1:00 bis 23:00 Uhr alle 2 Stunden'],

  // monthly / date
  ['0 0 * * *', 'täglich um 0:00 Uhr'],
  ['0 0 1,10,20 * *', 'am 1., 10. und 20. jedes Monats um 0:00 Uhr'],
  ['0 0 */2 * *',
    'an den ungeraden Tagen jedes Monats (1., 3., 5. … 31.) um 0:00 Uhr'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'an den ungeraden Tagen jedes Monats (1., 3., 5. … 31.), außer am 15., ' +
    'um 0:00 Uhr'],

  // monthly / month
  ['0 0 1 1 *', 'am 1. Januar um 0:00 Uhr'],
  ['0 0 1 3,6,9,12 *',
    'im März, Juni, September und Dezember jeweils am 1. um 0:00 Uhr'],
  ['0 0 1 */2 *',
    'im Januar, März, Mai, Juli, September und November jeweils am 1. um ' +
    '0:00 Uhr'],
  ['0 0 1 11-2 *', 'von November bis Februar jeweils am 1. um 0:00 Uhr'],

  // monthly / weekday
  ['0 0 1 * 1',
    'montags und zusätzlich am 1. jedes Monats, jeweils um 0:00 Uhr'],
  ['0 0 1 * 1-5',
    'montags bis freitags und zusätzlich am 1. jedes Monats, jeweils um ' +
    '0:00 Uhr'],
  ['0 0 1 * 2,4',
    'dienstags und donnerstags und zusätzlich am 1. jedes Monats, jeweils ' +
    'um 0:00 Uhr'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'jede Sekunde'],
  ['*/6 * * * * *', 'alle 6 Sekunden'],
  ['5/10 * * * * *',
    '5, 15, 25, 35, 45 und 55 Sekunden nach jeder vollen Minute'],

  // open / minute
  ['5,20,45 * * * *', 'stündlich um :05, :20 und :45'],
  ['*/15 * * * *', 'alle 15 Minuten'],
  ['0,15,45 * * * *', 'stündlich um :00, :15 und :45'],

  // open / hour
  ['* 0 * * *', 'täglich von 0:00 bis 0:59 Uhr jede Minute'],
  ['* 9,17 * * *',
    'täglich von 9:00 bis 9:59 und von 17:00 bis 17:59 Uhr jede Minute'],
  ['* 9-17,22 * * *',
    'täglich von 9:00 bis 17:59 und von 22:00 bis 22:59 Uhr jede Minute'],
  ['* 1/2 * * *',
    'täglich in den ungeraden Stunden (1:00–1:59, 3:00–3:59 … 23:00–23:59 ' +
    'Uhr) jede Minute'],

  // open / date
  ['* * 1 * *', 'am 1. jedes Monats jede Minute'],
  ['* * 1,10,20 * *', 'am 1., 10. und 20. jedes Monats jede Minute'],
  ['* * */2 * *',
    'an den ungeraden Tagen jedes Monats (1., 3., 5. … 31.) jede Minute'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'an den ungeraden Tagen jedes Monats (1., 3., 5. … 31.), außer am 15., ' +
    'jede Minute'],

  // open / month
  ['* * * 1 *', 'im Januar jede Minute'],
  ['* * * 3,6,9,12 *', 'im März, Juni, September und Dezember jede Minute'],
  ['* * * */2 *',
    'im Januar, März, Mai, Juli, September und November jede Minute'],
  ['* * * 11-2 *', 'von November bis Februar jede Minute'],

  // open / weekday
  ['* * * * 1', 'montags jede Minute'],
  ['* * * * 1-5', 'montags bis freitags jede Minute'],
  ['* * * * 2,4', 'dienstags und donnerstags jede Minute']
];

export {rows};
