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
  ['*/15 0 9 * * *', 'täglich alle 15 Sekunden von 9:00:00 bis 9:00:45 Uhr'],
  ['0-9 0 9 * * *', 'täglich jede Sekunde von 9:00:00 bis 9:00:09 Uhr'],

  // clock / minute
  ['30 9 * * *', 'täglich um 9:30 Uhr'],
  ['0,30 9 * * *', 'täglich um 9:00 und 9:30 Uhr'],
  ['0-29 9 * * *', 'täglich jede Minute von 9:00 bis 9:29 Uhr'],
  ['0-29,45 9 * * *',
    'täglich jede Minute von 9:00 bis 9:29 Uhr und um 9:45 Uhr'],
  ['*/7 9 * * *', 'täglich alle 7 Minuten von 9:00 bis 9:56 Uhr'],
  ['5/15 9 * * *', 'täglich um 9:05, 9:20, 9:35 und 9:50 Uhr'],
  ['10-40/10 9 * * *', 'täglich um 9:10, 9:20, 9:30 und 9:40 Uhr'],

  // clock / hour
  ['0 12 * * *', 'täglich um 12:00 Uhr'],
  ['0 8,12,18 * * *', 'täglich um 8:00, 12:00 und 18:00 Uhr'],
  ['0 9-17 * * *', 'täglich jede Stunde von 9:00 bis 17:00 Uhr'],
  ['0 */2 * * *', 'alle 2 Stunden'],
  ['0 */6 * * *', 'alle 6 Stunden'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 * * *', 'alle 2 Stunden, außer um 8:00 Uhr'],
  ['0 22-2 * * *', 'täglich jede Stunde von 22:00 bis 2:00 Uhr'],

  // clock / date
  ['0 9 15 * *', 'am 15. jedes Monats um 9:00 Uhr'],
  ['0 9 1,15 * *', 'am 1. und 15. jedes Monats um 9:00 Uhr'],
  ['0 9 1-7 * *', 'vom 1. bis 7. jedes Monats jeweils um 9:00 Uhr'],
  ['0 9 1-7,15 * *',
    'vom 1. bis 7. und am 15. jedes Monats jeweils um 9:00 Uhr'],
  ['0 9 2/2 * *', 'an geraden Tagen jedes Monats um 9:00 Uhr'],
  ['0 9 */5 * *', 'alle 5 Tage ab dem 1. des Monats jeweils um 9:00 Uhr'],
  ['0 9 L * *', 'am letzten Tag jedes Monats um 9:00 Uhr'],
  ['0 9 15W * *',
    'am Wochentag (Montag bis Freitag), der dem 15. jedes Monats am ' +
    'nächsten liegt, um 9:00 Uhr'],

  // clock / month
  ['0 9 * 6 *', 'täglich im Juni um 9:00 Uhr'],
  ['0 9 * 1,7 *', 'täglich im Januar und Juli um 9:00 Uhr'],
  ['0 9 * 6-8 *', 'täglich von Juni bis August jeweils um 9:00 Uhr'],
  ['0 9 * 6-8,12 *',
    'täglich von Juni bis August und im Dezember jeweils um 9:00 Uhr'],
  ['0 9 * */3 *', 'täglich im Januar, April, Juli und Oktober um 9:00 Uhr'],
  ['0 9 * 1-11 *', 'täglich in allen Monaten, außer im Dezember, um 9:00 Uhr'],

  // clock / weekday
  ['0 9 * * 0', 'sonntags um 9:00 Uhr'],
  ['0 9 * * 1,3,5', 'montags, mittwochs und freitags um 9:00 Uhr'],
  ['0 9 * * 0,6', 'samstags und sonntags um 9:00 Uhr'],
  ['0 9 * * 1-6', 'täglich, außer sonntags, um 9:00 Uhr'],
  ['0 9 * * 5L', 'am letzten Freitag jedes Monats um 9:00 Uhr'],
  ['0 9 * * 1#2', 'am zweiten Montag jedes Monats um 9:00 Uhr'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'montags bis freitags alle 15 Minuten von 9:00:30 bis 17:45:30 Uhr'],
  ['0,30 */15 9-17 * * 1-5',
    'montags bis freitags alle 15 Minuten eine Minute lang alle 30 ' +
    'Sekunden von 9:00:00 bis 17:45:30 Uhr'],
  ['*/15 */15 9-17 * * 1-5',
    'montags bis freitags alle 15 Minuten eine Minute lang alle 15 ' +
    'Sekunden von 9:00:00 bis 17:45:45 Uhr'],
  ['0-9 */15 9-17 * * 1-5',
    'montags bis freitags alle 15 Minuten 10 Sekunden lang jede Sekunde ' +
    'von 9:00:00 bis 17:45:09 Uhr'],

  // window / minute
  ['0 9-17 * * 1-5', 'montags bis freitags jede Stunde von 9:00 bis 17:00 Uhr'],
  ['30 9-17 * * 1-5',
    'montags bis freitags jede Stunde von 9:30 bis 17:30 Uhr'],
  ['5,20,45 9-17 * * 1-5',
    'montags bis freitags jeweils 5, 20 und 45 Minuten nach jeder vollen ' +
    'Stunde von 9:05 bis 17:45 Uhr'],
  ['0-29 9-17 * * 1-5',
    'montags bis freitags jede Minute in den ersten 30 Minuten jeder ' +
    'Stunde von 9:00 bis 17:29 Uhr'],
  ['*/7 9-17 * * 1-5',
    'montags bis freitags alle 7 Minuten von 0 bis 56 Minuten nach jeder ' +
    'vollen Stunde von 9:00 bis 17:56 Uhr'],
  ['5/15 9-17 * * 1-5',
    'montags bis freitags jeweils 5, 20, 35 und 50 Minuten nach jeder ' +
    'vollen Stunde von 9:05 bis 17:50 Uhr'],
  ['10-40/10 9-17 * * 1-5',
    'montags bis freitags jeweils 10, 20, 30 und 40 Minuten nach jeder ' +
    'vollen Stunde von 9:10 bis 17:40 Uhr'],

  // window / hour
  ['*/15 0 * * 1-5',
    'montags bis freitags alle 15 Minuten von 0:00 bis 0:45 Uhr'],
  ['*/15 9 * * 1-5',
    'montags bis freitags alle 15 Minuten von 9:00 bis 9:45 Uhr'],
  ['*/15 9,17 * * 1-5',
    'montags bis freitags alle 15 Minuten von 9:00 bis 9:45 Uhr und von ' +
    '17:00 bis 17:45 Uhr'],
  ['*/15 8,12,18 * * 1-5',
    'montags bis freitags alle 15 Minuten in den Stunden, die um 8:00, ' +
    '12:00 und 18:00 Uhr beginnen'],
  ['*/15 */2 * * 1-5',
    'montags bis freitags alle 15 Minuten in den geraden Stunden'],
  ['*/15 */6 * * 1-5',
    'montags bis freitags alle 15 Minuten in den Stunden, die um 0:00, ' +
    '6:00, 12:00 und 18:00 Uhr beginnen'],
  ['*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5',
    'montags bis freitags alle 15 Minuten in den geraden Stunden, außer ' +
    'von 8:00 bis 8:45 Uhr'],
  ['*/15 22-2 * * 1-5',
    'montags bis freitags alle 15 Minuten von 0:00 bis 2:45 Uhr und von ' +
    '22:00 bis 23:45 Uhr'],

  // window / date
  ['*/15 9-17 15 * 1-5',
    'am 15. jedes Monats sowie montags bis freitags, jeweils alle 15 ' +
    'Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 1,15 * 1-5',
    'am 1. und 15. jedes Monats sowie montags bis freitags, jeweils alle ' +
    '15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 1-7 * 1-5',
    'vom 1. bis 7. jedes Monats sowie montags bis freitags, jeweils alle ' +
    '15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 1-7,15 * 1-5',
    'vom 1. bis 7. und am 15. jedes Monats sowie montags bis freitags, ' +
    'jeweils alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 2/2 * 1-5',
    'an geraden Tagen jedes Monats sowie montags bis freitags, jeweils ' +
    'alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 */5 * 1-5',
    'alle 5 Tage ab dem 1. des Monats sowie montags bis freitags, jeweils ' +
    'alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 L * 1-5',
    'am letzten Tag jedes Monats sowie montags bis freitags, jeweils alle ' +
    '15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 15W * 1-5',
    'am Wochentag (Montag bis Freitag), der dem 15. jedes Monats am ' +
    'nächsten liegt, sowie montags bis freitags, jeweils alle 15 Minuten ' +
    'von 9:00 bis 17:45 Uhr'],

  // window / month
  ['*/15 9-17 * 6 1-5',
    'montags bis freitags im Juni alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * 1,7 1-5',
    'montags bis freitags im Januar und Juli alle 15 Minuten von 9:00 bis ' +
    '17:45 Uhr'],
  ['*/15 9-17 * 6-8 1-5',
    'montags bis freitags von Juni bis August alle 15 Minuten von 9:00 bis ' +
    '17:45 Uhr'],
  ['*/15 9-17 * 6-8,12 1-5',
    'montags bis freitags von Juni bis August und im Dezember alle 15 ' +
    'Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * */3 1-5',
    'montags bis freitags im Januar, April, Juli und Oktober alle 15 ' +
    'Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * 1-11 1-5',
    'montags bis freitags in allen Monaten, außer im Dezember, alle 15 ' +
    'Minuten von 9:00 bis 17:45 Uhr'],

  // window / weekday
  ['*/15 9-17 * * 1', 'montags alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * * 0', 'sonntags alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * * 0,6',
    'samstags und sonntags alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * * 1-6',
    'täglich, außer sonntags, alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * * 5L',
    'am letzten Freitag jedes Monats alle 15 Minuten von 9:00 bis 17:45 Uhr'],
  ['*/15 9-17 * * 1#2',
    'am zweiten Montag jedes Monats alle 15 Minuten von 9:00 bis 17:45 Uhr'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', 'am 1. jedes Monats um 0:00:30 Uhr'],
  ['0,30 0 0 1 * *', 'am 1. jedes Monats um 0:00:00 und 0:00:30 Uhr'],
  ['*/15 0 0 1 * *',
    'am 1. jedes Monats alle 15 Sekunden von 0:00:00 bis 0:00:45 Uhr'],
  ['0-9 0 0 1 * *',
    'am 1. jedes Monats jede Sekunde von 0:00:00 bis 0:00:09 Uhr'],

  // monthly / minute
  ['30 0 1 * *', 'am 1. jedes Monats um 0:30 Uhr'],
  ['0,30 0 1 * *', 'am 1. jedes Monats um 0:00 und 0:30 Uhr'],
  ['0-29 0 1 * *', 'am 1. jedes Monats jede Minute von 0:00 bis 0:29 Uhr'],
  ['0-29,45 0 1 * *',
    'am 1. jedes Monats jede Minute von 0:00 bis 0:29 Uhr und um 0:45 Uhr'],
  ['*/7 0 1 * *', 'am 1. jedes Monats alle 7 Minuten von 0:00 bis 0:56 Uhr'],
  ['5/15 0 1 * *', 'am 1. jedes Monats um 0:05, 0:20, 0:35 und 0:50 Uhr'],
  ['10-40/10 0 1 * *', 'am 1. jedes Monats um 0:10, 0:20, 0:30 und 0:40 Uhr'],

  // monthly / hour
  ['0 12 1 * *', 'am 1. jedes Monats um 12:00 Uhr'],
  ['0 8,12,18 1 * *', 'am 1. jedes Monats um 8:00, 12:00 und 18:00 Uhr'],
  ['0 9-17 1 * *', 'am 1. jedes Monats jede Stunde von 9:00 bis 17:00 Uhr'],
  ['0 */2 1 * *', 'am 1. jedes Monats alle 2 Stunden'],
  ['0 */6 1 * *', 'am 1. jedes Monats alle 6 Stunden'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * *',
    'am 1. jedes Monats alle 2 Stunden, außer um 8:00 Uhr'],
  ['0 22-2 1 * *',
    'am 1. jedes Monats jede Stunde von 0:00 bis 2:00 Uhr und um 22:00 und ' +
    '23:00 Uhr'],

  // monthly / date
  ['0 0 15 * *', 'am 15. jedes Monats um 0:00 Uhr'],
  ['0 0 1,15 * *', 'am 1. und 15. jedes Monats um 0:00 Uhr'],
  ['0 0 1-7 * *', 'vom 1. bis 7. jedes Monats jeweils um 0:00 Uhr'],
  ['0 0 1-7,15 * *',
    'vom 1. bis 7. und am 15. jedes Monats jeweils um 0:00 Uhr'],
  ['0 0 2/2 * *', 'an geraden Tagen jedes Monats um 0:00 Uhr'],
  ['0 0 */5 * *', 'alle 5 Tage ab dem 1. des Monats jeweils um 0:00 Uhr'],
  ['0 0 L * *', 'am letzten Tag jedes Monats um 0:00 Uhr'],
  ['0 0 15W * *',
    'am Wochentag (Montag bis Freitag), der dem 15. jedes Monats am ' +
    'nächsten liegt, um 0:00 Uhr'],

  // monthly / month
  ['0 0 1 6 *', 'am 1. Juni um 0:00 Uhr'],
  ['0 0 1 1,7 *', 'am 1. der Monate Januar und Juli um 0:00 Uhr'],
  ['0 0 1 6-8 *', 'am 1. der Monate Juni bis August jeweils um 0:00 Uhr'],
  ['0 0 1 6-8,12 *',
    'am 1. der Monate Juni bis August und Dezember jeweils um 0:00 Uhr'],
  ['0 0 1 */3 *',
    'am 1. der Monate Januar, April, Juli und Oktober um 0:00 Uhr'],
  ['0 0 1 1-11 *', 'am 1. jedes Monats, außer im Dezember, um 0:00 Uhr'],

  // monthly / weekday
  ['0 0 1 * 0', 'am 1. jedes Monats sowie sonntags, jeweils um 0:00 Uhr'],
  ['0 0 1 * 1,3,5',
    'am 1. jedes Monats sowie montags, mittwochs und freitags, jeweils um ' +
    '0:00 Uhr'],
  ['0 0 1 * 0,6',
    'am 1. jedes Monats sowie samstags und sonntags, jeweils um 0:00 Uhr'],
  ['0 0 1 * 1-6',
    'am 1. jedes Monats sowie täglich, außer sonntags, jeweils um 0:00 Uhr'],
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
  ['0-9 * * * * *', 'jede Sekunde in den ersten 10 Sekunden jeder Minute'],

  // open / minute
  ['30 * * * *', '30 Minuten nach jeder vollen Stunde'],
  ['0,30 * * * *', 'alle 30 Minuten'],
  ['0-29 * * * *', 'jede Minute in den ersten 30 Minuten jeder Stunde'],
  ['0-29,45 * * * *',
    'jede Minute in den ersten 30 Minuten jeder Stunde und 45 Minuten nach ' +
    'jeder vollen Stunde'],
  ['*/7 * * * *',
    'alle 7 Minuten von 0 bis 56 Minuten nach jeder vollen Stunde'],
  ['5/15 * * * *', '5, 20, 35 und 50 Minuten nach jeder vollen Stunde'],
  ['10-40/10 * * * *', '10, 20, 30 und 40 Minuten nach jeder vollen Stunde'],

  // open / hour
  ['* 12 * * *', 'täglich jede Minute von 12:00 bis 12:59 Uhr'],
  ['* 8,12,18 * * *',
    'täglich jede Minute in den Stunden, die um 8:00, 12:00 und 18:00 Uhr ' +
    'beginnen'],
  ['* 9-17 * * *', 'täglich jede Minute von 9:00 bis 17:59 Uhr'],
  ['* */2 * * *', 'jede Minute in den geraden Stunden'],
  ['* */6 * * *',
    'täglich jede Minute in den Stunden, die um 0:00, 6:00, 12:00 und ' +
    '18:00 Uhr beginnen'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'jede Minute in den geraden Stunden, außer von 8:00 bis 8:59 Uhr'],
  ['* 22-2 * * *', 'täglich jede Minute von 22:00 bis 2:59 Uhr'],

  // open / date
  ['* * 15 * *', 'am 15. jedes Monats jede Minute'],
  ['* * 1,15 * *', 'am 1. und 15. jedes Monats jede Minute'],
  ['* * 1-7 * *', 'vom 1. bis 7. jedes Monats jede Minute'],
  ['* * 1-7,15 * *', 'vom 1. bis 7. und am 15. jedes Monats jede Minute'],
  ['* * 2/2 * *', 'an geraden Tagen jedes Monats jede Minute'],
  ['* * */5 * *', 'alle 5 Tage ab dem 1. des Monats jede Minute'],
  ['* * L * *', 'am letzten Tag jedes Monats jede Minute'],
  ['* * 15W * *',
    'am Wochentag (Montag bis Freitag), der dem 15. jedes Monats am ' +
    'nächsten liegt, jede Minute'],

  // open / month
  ['* * * 6 *', 'im Juni jede Minute'],
  ['* * * 1,7 *', 'im Januar und Juli jede Minute'],
  ['* * * 6-8 *', 'von Juni bis August jede Minute'],
  ['* * * 6-8,12 *', 'von Juni bis August und im Dezember jede Minute'],
  ['* * * */3 *', 'im Januar, April, Juli und Oktober jede Minute'],
  ['* * * 1-11 *', 'in allen Monaten, außer im Dezember, jede Minute'],

  // open / weekday
  ['* * * * 0', 'sonntags jede Minute'],
  ['* * * * 1,3,5', 'montags, mittwochs und freitags jede Minute'],
  ['* * * * 0,6', 'samstags und sonntags jede Minute'],
  ['* * * * 1-6', 'täglich, außer sonntags, jede Minute'],
  ['* * * * 5L', 'am letzten Freitag jedes Monats jede Minute'],
  ['* * * * 1#2', 'am zweiten Montag jedes Monats jede Minute']
];

export {rows};
