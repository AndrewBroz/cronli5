// German paradigms held out from a renderer's builder: one row per grid
// pattern at a held-out position. They judge whether a renderer built from
// the answers, the lexicon and the visible rows says what a speaker would.
//
// Written by hand from src/lang/de/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['30 0 9 * * *', 'täglich um 9:00:30 Uhr'],
  ['0,30 0 9 * * *', 'täglich um 9:00:00 und 9:00:30 Uhr'],
  ['*/15 0 9 * * *', 'täglich von 9:00:00 bis 9:00:45 Uhr alle 15 Sekunden'],
  ['0-9 0 9 * * *', 'täglich von 9:00:00 bis 9:00:09 Uhr jede Sekunde'],

  // clock / minute
  ['30 9 * * *', 'täglich um 9:30 Uhr'],
  ['0,30 9 * * *', 'täglich um 9:00 und 9:30 Uhr'],
  ['0-29 9 * * *', 'täglich von 9:00 bis 9:29 Uhr jede Minute'],
  ['0-29,45 9 * * *',
    'täglich von 9:00 bis 9:29 Uhr jede Minute und um 9:45 Uhr'],
  ['*/7 9 * * *', 'täglich von 9:00 bis 9:56 Uhr alle 7 Minuten'],
  ['5/15 9 * * *', 'täglich um 9:05, 9:20, 9:35 und 9:50 Uhr'],
  ['10-40/10 9 * * *', 'täglich um 9:10, 9:20, 9:30 und 9:40 Uhr'],

  // clock / hour
  ['0 12 * * *', 'täglich um 12:00 Uhr'],
  ['0 8,12,18 * * *', 'täglich um 8:00, 12:00 und 18:00 Uhr'],
  ['0 9-17 * * *', 'täglich von 9:00 bis 17:00 Uhr stündlich'],
  ['0 */2 * * *', 'täglich von 0:00 bis 22:00 Uhr alle 2 Stunden'],
  ['0 */6 * * *', 'täglich um 0:00, 6:00, 12:00 und 18:00 Uhr'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'täglich von 0:00 bis 22:00 Uhr alle 2 Stunden, außer um 8:00 Uhr'],
  ['0 22-2 * * *',
    'täglich von 0:00 bis 2:00 Uhr stündlich und um 22:00 und 23:00 Uhr'],

  // clock / date
  ['0 9 15 * *', 'am 15. jedes Monats um 9:00 Uhr'],
  ['0 9 1,15 * *', 'am 1. und 15. jedes Monats um 9:00 Uhr'],
  ['0 9 1-7 * *', 'vom 1. bis 7. jedes Monats täglich um 9:00 Uhr'],
  ['0 9 1-7,15 * *',
    'vom 1. bis 7. und am 15. jedes Monats jeweils um 9:00 Uhr'],
  ['0 9 2/2 * *',
    'alle 2 Tage vom 2. bis 30. jedes Monats jeweils um 9:00 Uhr'],
  ['0 9 */5 * *',
    'am 1., 6., 11., 16., 21., 26. und 31. jedes Monats um 9:00 Uhr'],
  ['0 9 L * *', 'am letzten Tag jedes Monats um 9:00 Uhr'],
  ['0 9 15W * *',
    'am Werktag (Montag bis Freitag), der dem 15. jedes Monats am nächsten ' +
    'liegt, um 9:00 Uhr'],

  // clock / month
  ['0 9 * 6 *', 'im Juni täglich um 9:00 Uhr'],
  ['0 9 * 1,7 *', 'im Januar und Juli täglich um 9:00 Uhr'],
  ['0 9 * 6-8 *', 'von Juni bis August täglich um 9:00 Uhr'],
  ['0 9 * 6-8,12 *', 'von Juni bis August und im Dezember täglich um 9:00 Uhr'],
  ['0 9 * */3 *', 'im Januar, April, Juli und Oktober täglich um 9:00 Uhr'],
  ['0 9 * 1-11 *', 'von Januar bis November täglich um 9:00 Uhr'],

  // clock / weekday
  ['0 9 * * 0', 'sonntags um 9:00 Uhr'],
  ['0 9 * * 1,3,5', 'montags, mittwochs und freitags um 9:00 Uhr'],
  ['0 9 * * 0,6', 'samstags und sonntags um 9:00 Uhr'],
  ['0 9 * * 1-6', 'montags bis samstags um 9:00 Uhr'],
  ['0 9 * * 5L', 'am letzten Freitag jedes Monats um 9:00 Uhr'],
  ['0 9 * * 1#2', 'am zweiten Montag jedes Monats um 9:00 Uhr'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:45 Uhr alle 15 Minuten, jeweils ' +
    '30 Sekunden nach der vollen Minute'],
  ['0,30 */15 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:45 Uhr alle 15 Minuten, jeweils ' +
    'eine Minute lang alle 30 Sekunden'],
  ['*/15 */15 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:45 Uhr alle 15 Minuten, jeweils ' +
    'eine Minute lang alle 15 Sekunden'],
  ['0-9 */15 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:45 Uhr alle 15 Minuten, jeweils ' +
    '10 Sekunden lang jede Sekunde'],

  // window / minute
  ['0 9-17 * * 1-5', 'montags bis freitags von 9:00 bis 17:00 Uhr stündlich'],
  ['30 9-17 * * 1-5', 'montags bis freitags von 9:30 bis 17:30 Uhr stündlich'],
  ['5,20,45 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:59 Uhr jeweils 5, 20 und 45 ' +
    'Minuten nach jeder vollen Stunde'],
  ['0-29 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:59 Uhr jede Minute ab jeder ' +
    'vollen Stunde, zuletzt 29 Minuten danach'],
  ['*/7 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:59 Uhr alle 7 Minuten ab jeder ' +
    'vollen Stunde, zuletzt 56 Minuten danach'],
  ['5/15 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:59 Uhr jeweils 5, 20, 35 und 50 ' +
    'Minuten nach jeder vollen Stunde'],
  ['10-40/10 9-17 * * 1-5',
    'montags bis freitags von 9:00 bis 17:59 Uhr jeweils 10, 20, 30 und 40 ' +
    'Minuten nach jeder vollen Stunde'],

  // window / hour
  ['*/15 0 * * 1-5',
    'montags bis freitags von 0:00 bis 0:45 Uhr alle 15 Minuten'],
  ['*/15 9 * * 1-5',
    'montags bis freitags von 9:00 bis 9:45 Uhr alle 15 Minuten'],
  ['*/15 9,17 * * 1-5',
    'montags bis freitags von 9:00 bis 9:45 und von 17:00 bis 17:45 Uhr ' +
    'alle 15 Minuten'],
  ['*/15 8,12,18 * * 1-5',
    'montags bis freitags von 8:00 bis 8:45, von 12:00 bis 12:45 und von ' +
    '18:00 bis 18:45 Uhr alle 15 Minuten'],
  ['*/15 */2 * * 1-5',
    'montags bis freitags von 0:00 bis 0:45, von 2:00 bis 2:45 usw. bis ' +
    '22:45 Uhr alle 15 Minuten'],
  ['*/15 */6 * * 1-5',
    'montags bis freitags von 0:00 bis 0:45, von 6:00 bis 6:45, von 12:00 ' +
    'bis 12:45 und von 18:00 bis 18:45 Uhr alle 15 Minuten'],
  ['*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5',
    'montags bis freitags von 0:00 bis 0:45, von 2:00 bis 2:45 usw. bis ' +
    '22:45 Uhr alle 15 Minuten, außer von 8:00 bis 8:45 Uhr'],
  ['*/15 22-2 * * 1-5',
    'montags bis freitags von 0:00 bis 2:45 und von 22:00 bis 23:45 Uhr ' +
    'alle 15 Minuten'],

  // window / date
  ['*/15 9-17 15 * 1-5',
    'am 15. jedes Monats sowie montags bis freitags, jeweils von 9:00 bis ' +
    '17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 1,15 * 1-5',
    'am 1. und 15. jedes Monats sowie montags bis freitags, jeweils von ' +
    '9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 1-7 * 1-5',
    'vom 1. bis 7. jedes Monats sowie montags bis freitags, jeweils von ' +
    '9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 1-7,15 * 1-5',
    'vom 1. bis 7. und am 15. jedes Monats sowie montags bis freitags, ' +
    'jeweils von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 2/2 * 1-5',
    'alle 2 Tage vom 2. bis 30. jedes Monats sowie montags bis freitags, ' +
    'jeweils von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 */5 * 1-5',
    'am 1., 6., 11., 16., 21., 26. und 31. jedes Monats sowie montags bis ' +
    'freitags, jeweils von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 L * 1-5',
    'am letzten Tag jedes Monats sowie montags bis freitags, jeweils von ' +
    '9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 15W * 1-5',
    'am Werktag (Montag bis Freitag), der dem 15. jedes Monats am nächsten ' +
    'liegt, sowie montags bis freitags, jeweils von 9:00 bis 17:45 Uhr ' +
    'alle 15 Minuten'],

  // window / month
  ['*/15 9-17 * 6 1-5',
    'im Juni montags bis freitags von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * 1,7 1-5',
    'im Januar und Juli montags bis freitags von 9:00 bis 17:45 Uhr alle ' +
    '15 Minuten'],
  ['*/15 9-17 * 6-8 1-5',
    'von Juni bis August montags bis freitags von 9:00 bis 17:45 Uhr alle ' +
    '15 Minuten'],
  ['*/15 9-17 * 6-8,12 1-5',
    'von Juni bis August und im Dezember montags bis freitags von 9:00 bis ' +
    '17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * */3 1-5',
    'im Januar, April, Juli und Oktober montags bis freitags von 9:00 bis ' +
    '17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * 1-11 1-5',
    'von Januar bis November montags bis freitags von 9:00 bis 17:45 Uhr ' +
    'alle 15 Minuten'],

  // window / weekday
  ['*/15 9-17 * * 1', 'montags von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * * 0', 'sonntags von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * * 0,6',
    'samstags und sonntags von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * * 1-6',
    'montags bis samstags von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * * 5L',
    'am letzten Freitag jedes Monats von 9:00 bis 17:45 Uhr alle 15 Minuten'],
  ['*/15 9-17 * * 1#2',
    'am zweiten Montag jedes Monats von 9:00 bis 17:45 Uhr alle 15 Minuten'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', 'am 1. jedes Monats um 0:00:30 Uhr'],
  ['0,30 0 0 1 * *', 'am 1. jedes Monats um 0:00:00 und 0:00:30 Uhr'],
  ['*/15 0 0 1 * *',
    'am 1. jedes Monats von 0:00:00 bis 0:00:45 Uhr alle 15 Sekunden'],
  ['0-9 0 0 1 * *',
    'am 1. jedes Monats von 0:00:00 bis 0:00:09 Uhr jede Sekunde'],

  // monthly / minute
  ['30 0 1 * *', 'am 1. jedes Monats um 0:30 Uhr'],
  ['0,30 0 1 * *', 'am 1. jedes Monats um 0:00 und 0:30 Uhr'],
  ['0-29 0 1 * *', 'am 1. jedes Monats von 0:00 bis 0:29 Uhr jede Minute'],
  ['0-29,45 0 1 * *',
    'am 1. jedes Monats von 0:00 bis 0:29 Uhr jede Minute und um 0:45 Uhr'],
  ['*/7 0 1 * *', 'am 1. jedes Monats von 0:00 bis 0:56 Uhr alle 7 Minuten'],
  ['5/15 0 1 * *', 'am 1. jedes Monats um 0:05, 0:20, 0:35 und 0:50 Uhr'],
  ['10-40/10 0 1 * *', 'am 1. jedes Monats um 0:10, 0:20, 0:30 und 0:40 Uhr'],

  // monthly / hour
  ['0 12 1 * *', 'am 1. jedes Monats um 12:00 Uhr'],
  ['0 8,12,18 1 * *', 'am 1. jedes Monats um 8:00, 12:00 und 18:00 Uhr'],
  ['0 9-17 1 * *', 'am 1. jedes Monats von 9:00 bis 17:00 Uhr stündlich'],
  ['0 */2 1 * *', 'am 1. jedes Monats von 0:00 bis 22:00 Uhr alle 2 Stunden'],
  ['0 */6 1 * *', 'am 1. jedes Monats um 0:00, 6:00, 12:00 und 18:00 Uhr'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * *',
    'am 1. jedes Monats von 0:00 bis 22:00 Uhr alle 2 Stunden, außer um ' +
    '8:00 Uhr'],
  ['0 22-2 1 * *',
    'am 1. jedes Monats von 0:00 bis 2:00 Uhr stündlich und um 22:00 und ' +
    '23:00 Uhr'],

  // monthly / date
  ['0 0 15 * *', 'am 15. jedes Monats um 0:00 Uhr'],
  ['0 0 1,15 * *', 'am 1. und 15. jedes Monats um 0:00 Uhr'],
  ['0 0 1-7 * *', 'vom 1. bis 7. jedes Monats täglich um 0:00 Uhr'],
  ['0 0 1-7,15 * *',
    'vom 1. bis 7. und am 15. jedes Monats jeweils um 0:00 Uhr'],
  ['0 0 2/2 * *',
    'alle 2 Tage vom 2. bis 30. jedes Monats jeweils um 0:00 Uhr'],
  ['0 0 */5 * *',
    'am 1., 6., 11., 16., 21., 26. und 31. jedes Monats um 0:00 Uhr'],
  ['0 0 L * *', 'am letzten Tag jedes Monats um 0:00 Uhr'],
  ['0 0 15W * *',
    'am Werktag (Montag bis Freitag), der dem 15. jedes Monats am nächsten ' +
    'liegt, um 0:00 Uhr'],

  // monthly / month
  ['0 0 1 6 *', 'am 1. Juni um 0:00 Uhr'],
  ['0 0 1 1,7 *', 'im Januar und Juli jeweils am 1. um 0:00 Uhr'],
  ['0 0 1 6-8 *', 'von Juni bis August jeweils am 1. um 0:00 Uhr'],
  ['0 0 1 6-8,12 *',
    'von Juni bis August und im Dezember jeweils am 1. um 0:00 Uhr'],
  ['0 0 1 */3 *',
    'im Januar, April, Juli und Oktober jeweils am 1. um 0:00 Uhr'],
  ['0 0 1 1-11 *', 'von Januar bis November jeweils am 1. um 0:00 Uhr'],

  // monthly / weekday
  ['0 0 1 * 0', 'am 1. jedes Monats sowie sonntags, jeweils um 0:00 Uhr'],
  ['0 0 1 * 1,3,5',
    'am 1. jedes Monats sowie montags, mittwochs und freitags, jeweils um ' +
    '0:00 Uhr'],
  ['0 0 1 * 0,6',
    'am 1. jedes Monats sowie samstags und sonntags, jeweils um 0:00 Uhr'],
  ['0 0 1 * 1-6',
    'am 1. jedes Monats sowie montags bis samstags, jeweils um 0:00 Uhr'],
  ['0 0 1 * 5L',
    'am 1. jedes Monats sowie am letzten Freitag jedes Monats, jeweils um ' +
    '0:00 Uhr'],
  ['0 0 1 * 1#2',
    'am 1. jedes Monats sowie am zweiten Montag jedes Monats, jeweils um ' +
    '0:00 Uhr'],

  // open / second — context `* * * * *`
  ['30 * * * * *', '30 Sekunden nach jeder vollen Minute'],
  ['0,30 * * * * *', 'alle 30 Sekunden'],
  ['*/15 * * * * *', 'alle 15 Sekunden'],
  ['0-9 * * * * *',
    'jede Sekunde ab jeder vollen Minute, zuletzt 9 Sekunden danach'],

  // open / minute
  ['30 * * * *', '30 Minuten nach jeder vollen Stunde'],
  ['0,30 * * * *', 'alle 30 Minuten'],
  ['0-29 * * * *',
    'jede Minute ab jeder vollen Stunde, zuletzt 29 Minuten danach'],
  ['0-29,45 * * * *',
    'jede Minute ab jeder vollen Stunde, zuletzt 29 Minuten danach, sowie ' +
    '45 Minuten nach jeder vollen Stunde'],
  ['*/7 * * * *',
    'alle 7 Minuten ab jeder vollen Stunde, zuletzt 56 Minuten danach'],
  ['5/15 * * * *', '5, 20, 35 und 50 Minuten nach jeder vollen Stunde'],
  ['10-40/10 * * * *', '10, 20, 30 und 40 Minuten nach jeder vollen Stunde'],

  // open / hour
  ['* 12 * * *', 'täglich von 12:00 bis 12:59 Uhr jede Minute'],
  ['* 8,12,18 * * *',
    'täglich von 8:00 bis 8:59, von 12:00 bis 12:59 und von 18:00 bis ' +
    '18:59 Uhr jede Minute'],
  ['* 9-17 * * *', 'täglich von 9:00 bis 17:59 Uhr jede Minute'],
  ['* */2 * * *',
    'täglich von 0:00 bis 0:59, von 2:00 bis 2:59 usw. bis 22:59 Uhr jede ' +
    'Minute'],
  ['* */6 * * *',
    'täglich von 0:00 bis 0:59, von 6:00 bis 6:59, von 12:00 bis 12:59 und ' +
    'von 18:00 bis 18:59 Uhr jede Minute'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'täglich von 0:00 bis 0:59, von 2:00 bis 2:59 usw. bis 22:59 Uhr jede ' +
    'Minute, außer von 8:00 bis 8:59 Uhr'],
  ['* 22-2 * * *',
    'täglich von 0:00 bis 2:59 und von 22:00 bis 23:59 Uhr jede Minute'],

  // open / date
  ['* * 15 * *', 'am 15. jedes Monats jede Minute'],
  ['* * 1,15 * *', 'am 1. und 15. jedes Monats jede Minute'],
  ['* * 1-7 * *', 'vom 1. bis 7. jedes Monats jede Minute'],
  ['* * 1-7,15 * *', 'vom 1. bis 7. und am 15. jedes Monats jede Minute'],
  ['* * 2/2 * *', 'alle 2 Tage vom 2. bis 30. jedes Monats jede Minute'],
  ['* * */5 * *',
    'am 1., 6., 11., 16., 21., 26. und 31. jedes Monats jede Minute'],
  ['* * L * *', 'am letzten Tag jedes Monats jede Minute'],
  ['* * 15W * *',
    'am Werktag (Montag bis Freitag), der dem 15. jedes Monats am nächsten ' +
    'liegt, jede Minute'],

  // open / month
  ['* * * 6 *', 'im Juni jede Minute'],
  ['* * * 1,7 *', 'im Januar und Juli jede Minute'],
  ['* * * 6-8 *', 'von Juni bis August jede Minute'],
  ['* * * 6-8,12 *', 'von Juni bis August und im Dezember jede Minute'],
  ['* * * */3 *', 'im Januar, April, Juli und Oktober jede Minute'],
  ['* * * 1-11 *', 'von Januar bis November jede Minute'],

  // open / weekday
  ['* * * * 0', 'sonntags jede Minute'],
  ['* * * * 1,3,5', 'montags, mittwochs und freitags jede Minute'],
  ['* * * * 0,6', 'samstags und sonntags jede Minute'],
  ['* * * * 1-6', 'montags bis samstags jede Minute'],
  ['* * * * 5L', 'am letzten Freitag jedes Monats jede Minute'],
  ['* * * * 1#2', 'am zweiten Montag jedes Monats jede Minute']
];

export {rows};
