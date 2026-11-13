// Italian paradigms held out from a renderer's builder: one row per grid
// pattern at a held-out position. They judge whether a renderer built from
// the answers, the lexicon and the visible rows says what a speaker would.
//
// Written by hand from src/lang/it/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['30 0 9 * * *', 'tutti i giorni alle 9:00:30'],
  ['0,30 0 9 * * *', 'tutti i giorni alle 9:00:00 e alle 9:00:30'],
  ['*/15 0 9 * * *',
    'tutti i giorni alle 9:00:00, alle 9:00:15, alle 9:00:30 e alle 9:00:45'],
  ['0-9 0 9 * * *', 'tutti i giorni, ogni secondo dalle 9:00:00 alle 9:00:09'],

  // clock / minute
  ['30 9 * * *', 'tutti i giorni alle 9:30'],
  ['0,30 9 * * *', 'tutti i giorni alle 9:00 e alle 9:30'],
  ['0-29 9 * * *', 'tutti i giorni, ogni minuto dalle 9:00 alle 9:29'],
  ['0-29,45 9 * * *',
    'tutti i giorni, ogni minuto dalle 9:00 alle 9:29 e una volta alle 9:45'],
  ['*/7 9 * * *', 'tutti i giorni, ogni 7 minuti dalle 9:00 alle 9:56'],
  ['5/15 9 * * *',
    'tutti i giorni alle 9:05, alle 9:20, alle 9:35 e alle 9:50'],
  ['10-40/10 9 * * *',
    'tutti i giorni alle 9:10, alle 9:20, alle 9:30 e alle 9:40'],

  // clock / hour
  ['0 12 * * *', 'tutti i giorni alle 12:00'],
  ['0 8,12,18 * * *', 'tutti i giorni alle 8:00, alle 12:00 e alle 18:00'],
  ['0 9-17 * * *', 'tutti i giorni, ogni ora dalle 9:00 alle 17:00'],
  ['0 */2 * * *', 'tutti i giorni, ogni 2 ore dalle 0:00 alle 22:00'],
  ['0 */6 * * *',
    'tutti i giorni alle 0:00, alle 6:00, alle 12:00 e alle 18:00'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'tutti i giorni, ogni 2 ore dalle 0:00 alle 22:00, tranne alle 8:00'],
  ['0 22-2 * * *', 'tutti i giorni, ogni ora dalle 22:00 alle 2:00'],

  // clock / date
  ['0 9 15 * *', 'il 15 di ogni mese alle 9:00'],
  ['0 9 1,15 * *', 'il 1º e il 15 di ogni mese alle 9:00'],
  ['0 9 1-7 * *', 'tutti i giorni dal 1º al 7 di ogni mese alle 9:00'],
  ['0 9 1-7,15 * *',
    'tutti i giorni dal 1º al 7 e il 15 di ogni mese alle 9:00'],
  ['0 9 2/2 * *', 'nei giorni pari di ogni mese alle 9:00'],
  ['0 9 */5 * *',
    'il 1º, il 6, l\'11, il 16, il 21, il 26 e il 31 di ogni mese alle 9:00'],
  ['0 9 L * *', 'l\'ultimo giorno di ogni mese alle 9:00'],
  ['0 9 15W * *',
    'il giorno lavorativo più vicino al 15 di ogni mese (dal lunedì al ' +
    'venerdì, festivi compresi) alle 9:00'],

  // clock / month
  ['0 9 * 6 *', 'a giugno, tutti i giorni alle 9:00'],
  ['0 9 * 1,7 *', 'a gennaio e luglio, tutti i giorni alle 9:00'],
  ['0 9 * 6-8 *', 'da giugno ad agosto, tutti i giorni alle 9:00'],
  ['0 9 * 6-8,12 *',
    'da giugno ad agosto e poi a dicembre, tutti i giorni alle 9:00'],
  ['0 9 * */3 *',
    'a gennaio, aprile, luglio e ottobre, tutti i giorni alle 9:00'],
  ['0 9 * 1-11 *', 'tutti i giorni alle 9:00, tranne a dicembre'],

  // clock / weekday
  ['0 9 * * 0', 'la domenica alle 9:00'],
  ['0 9 * * 1,3,5', 'il lunedì, il mercoledì e il venerdì alle 9:00'],
  ['0 9 * * 0,6', 'il sabato e la domenica alle 9:00'],
  ['0 9 * * 1-6', 'dal lunedì al sabato alle 9:00'],
  ['0 9 * * 5L', 'l\'ultimo venerdì di ogni mese alle 9:00'],
  ['0 9 * * 1#2', 'il secondo lunedì di ogni mese alle 9:00'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 9:00:30 alle 17:45:30'],
  ['0,30 */15 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45, e in ' +
    'quel minuto ai secondi 0 e 30'],
  ['*/15 */15 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45, e in ' +
    'quel minuto ai secondi 0, 15, 30 e 45'],
  ['0-9 */15 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45, ogni ' +
    'volta dal secondo 0 al 9, secondo per secondo'],

  // window / minute
  ['0 9-17 * * 1-5', 'dal lunedì al venerdì, ogni ora dalle 9:00 alle 17:00'],
  ['30 9-17 * * 1-5', 'dal lunedì al venerdì, ogni ora dalle 9:30 alle 17:30'],
  ['5,20,45 9-17 * * 1-5',
    'dal lunedì al venerdì, ai minuti 5, 20 e 45 di ogni ora, dalle 9:05 ' +
    'alle 17:45'],
  ['0-29 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni minuto dal minuto 0 al 29 di ciascuna ora ' +
    'dalle 9 alle 17 (prima volta alle 9:00, ultima alle 17:29)'],
  ['*/7 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni 7 minuti dal minuto 0 al 56 di ciascuna ' +
    'ora dalle 9 alle 17 (prima volta alle 9:00, ultima alle 17:56)'],
  ['5/15 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 9:05 alle 17:50'],
  ['10-40/10 9-17 * * 1-5',
    'dal lunedì al venerdì, ai minuti 10, 20, 30 e 40 di ogni ora, dalle ' +
    '9:10 alle 17:40'],

  // window / hour
  ['*/15 0 * * 1-5',
    'dal lunedì al venerdì alle 0:00, alle 0:15, alle 0:30 e alle 0:45'],
  ['*/15 9 * * 1-5',
    'dal lunedì al venerdì alle 9:00, alle 9:15, alle 9:30 e alle 9:45'],
  ['*/15 9,17 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 9:45 e dalle ' +
    '17:00 alle 17:45'],
  ['*/15 8,12,18 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 8:00 alle 8:45, dalle ' +
    '12:00 alle 12:45 e dalle 18:00 alle 18:45'],
  ['*/15 */2 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 0:00 alle 0:45, dalle ' +
    '2:00 alle 2:45 e così via ogni 2 ore fino alle 22:45'],
  ['*/15 */6 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 0:00 alle 0:45, dalle ' +
    '6:00 alle 6:45, dalle 12:00 alle 12:45 e dalle 18:00 alle 18:45'],
  ['*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 0:00 alle 0:45, dalle ' +
    '2:00 alle 2:45 e così via ogni 2 ore fino alle 22:45, tranne dalle ' +
    '8:00 alle 8:59'],
  ['*/15 22-2 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 0:00 alle 2:45 e dalle ' +
    '22:00 alle 23:45'],

  // window / date
  ['*/15 9-17 15 * 1-5',
    'dal lunedì al venerdì e in più il 15 di ogni mese, sempre ogni 15 ' +
    'minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 1,15 * 1-5',
    'dal lunedì al venerdì e in più il 1º e il 15 di ogni mese, sempre ' +
    'ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 1-7 * 1-5',
    'dal lunedì al venerdì e in più tutti i giorni dal 1º al 7 di ogni ' +
    'mese, sempre ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 1-7,15 * 1-5',
    'dal lunedì al venerdì e in più tutti i giorni dal 1º al 7 e il 15 di ' +
    'ogni mese, sempre ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 2/2 * 1-5',
    'dal lunedì al venerdì e in più nei giorni pari di ogni mese, sempre ' +
    'ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 */5 * 1-5',
    'dal lunedì al venerdì e in più il 1º, il 6, l\'11, il 16, il 21, il 26 ' +
    'e il 31 di ogni mese, sempre ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 L * 1-5',
    'dal lunedì al venerdì e in più l\'ultimo giorno di ogni mese, sempre ' +
    'ogni 15 minuti dalle 9:00 alle 17:45'],
  // The day nearest the 15th is always a Monday-to-Friday day, so beside
  // Monday to Friday it adds nothing (the core's `dateAddsNothing`). The
  // row first said it as a second arm, written before that fact existed;
  // the renderer built from the rule book was right and the row wrong.
  ['*/15 9-17 15W * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45'],

  // window / month
  ['*/15 9-17 * 6 1-5',
    'a giugno, dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 * 1,7 1-5',
    'a gennaio e luglio, dal lunedì al venerdì, ogni 15 minuti dalle 9:00 ' +
    'alle 17:45'],
  ['*/15 9-17 * 6-8 1-5',
    'da giugno ad agosto, dal lunedì al venerdì, ogni 15 minuti dalle 9:00 ' +
    'alle 17:45'],
  ['*/15 9-17 * 6-8,12 1-5',
    'da giugno ad agosto e poi a dicembre, dal lunedì al venerdì, ogni 15 ' +
    'minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 * */3 1-5',
    'a gennaio, aprile, luglio e ottobre, dal lunedì al venerdì, ogni 15 ' +
    'minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 * 1-11 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45, tranne a ' +
    'dicembre'],

  // window / weekday
  ['*/15 9-17 * * 1', 'il lunedì, ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 * * 0', 'la domenica, ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 * * 0,6',
    'il sabato e la domenica, ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 * * 1-6',
    'dal lunedì al sabato, ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 * * 5L',
    'l\'ultimo venerdì di ogni mese, ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 * * 1#2',
    'il secondo lunedì di ogni mese, ogni 15 minuti dalle 9:00 alle 17:45'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', 'il 1º di ogni mese alle 0:00:30'],
  ['0,30 0 0 1 * *', 'il 1º di ogni mese alle 0:00:00 e alle 0:00:30'],
  ['*/15 0 0 1 * *',
    'il 1º di ogni mese alle 0:00:00, alle 0:00:15, alle 0:00:30 e alle ' +
    '0:00:45'],
  ['0-9 0 0 1 * *',
    'il 1º di ogni mese, ogni secondo dalle 0:00:00 alle 0:00:09'],

  // monthly / minute
  ['30 0 1 * *', 'il 1º di ogni mese alle 0:30'],
  ['0,30 0 1 * *', 'il 1º di ogni mese alle 0:00 e alle 0:30'],
  ['0-29 0 1 * *', 'il 1º di ogni mese, ogni minuto dalle 0:00 alle 0:29'],
  ['0-29,45 0 1 * *',
    'il 1º di ogni mese, ogni minuto dalle 0:00 alle 0:29 e una volta alle ' +
    '0:45'],
  ['*/7 0 1 * *', 'il 1º di ogni mese, ogni 7 minuti dalle 0:00 alle 0:56'],
  ['5/15 0 1 * *',
    'il 1º di ogni mese alle 0:05, alle 0:20, alle 0:35 e alle 0:50'],
  ['10-40/10 0 1 * *',
    'il 1º di ogni mese alle 0:10, alle 0:20, alle 0:30 e alle 0:40'],

  // monthly / hour
  ['0 12 1 * *', 'il 1º di ogni mese alle 12:00'],
  ['0 8,12,18 1 * *', 'il 1º di ogni mese alle 8:00, alle 12:00 e alle 18:00'],
  ['0 9-17 1 * *', 'il 1º di ogni mese, ogni ora dalle 9:00 alle 17:00'],
  ['0 */2 1 * *', 'il 1º di ogni mese, ogni 2 ore dalle 0:00 alle 22:00'],
  ['0 */6 1 * *',
    'il 1º di ogni mese alle 0:00, alle 6:00, alle 12:00 e alle 18:00'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * *',
    'il 1º di ogni mese, ogni 2 ore dalle 0:00 alle 22:00, tranne alle 8:00'],
  ['0 22-2 1 * *',
    'il 1º di ogni mese, ogni ora dalle 0:00 alle 2:00, poi alle 22:00 e ' +
    'alle 23:00'],

  // monthly / date
  ['0 0 15 * *', 'il 15 di ogni mese alle 0:00'],
  ['0 0 1,15 * *', 'il 1º e il 15 di ogni mese alle 0:00'],
  ['0 0 1-7 * *', 'tutti i giorni dal 1º al 7 di ogni mese alle 0:00'],
  ['0 0 1-7,15 * *',
    'tutti i giorni dal 1º al 7 e il 15 di ogni mese alle 0:00'],
  ['0 0 2/2 * *', 'nei giorni pari di ogni mese alle 0:00'],
  ['0 0 */5 * *',
    'il 1º, il 6, l\'11, il 16, il 21, il 26 e il 31 di ogni mese alle 0:00'],
  ['0 0 L * *', 'l\'ultimo giorno di ogni mese alle 0:00'],
  ['0 0 15W * *',
    'il giorno lavorativo più vicino al 15 di ogni mese (dal lunedì al ' +
    'venerdì, festivi compresi) alle 0:00'],

  // monthly / month
  ['0 0 1 6 *', 'il 1º giugno alle 0:00'],
  ['0 0 1 1,7 *', 'a gennaio e luglio, il 1º del mese alle 0:00'],
  ['0 0 1 6-8 *', 'da giugno ad agosto, il 1º del mese alle 0:00'],
  ['0 0 1 6-8,12 *',
    'da giugno ad agosto e poi a dicembre, il 1º del mese alle 0:00'],
  ['0 0 1 */3 *',
    'a gennaio, aprile, luglio e ottobre, il 1º del mese alle 0:00'],
  ['0 0 1 1-11 *', 'il 1º di ogni mese alle 0:00, tranne a dicembre'],

  // monthly / weekday
  ['0 0 1 * 0', 'la domenica e in più il 1º di ogni mese, sempre alle 0:00'],
  ['0 0 1 * 1,3,5',
    'il lunedì, il mercoledì e il venerdì e in più il 1º di ogni mese, ' +
    'sempre alle 0:00'],
  ['0 0 1 * 0,6',
    'il sabato e la domenica e in più il 1º di ogni mese, sempre alle 0:00'],
  ['0 0 1 * 1-6',
    'dal lunedì al sabato e in più il 1º di ogni mese, sempre alle 0:00'],
  ['0 0 1 * 5L',
    'l\'ultimo venerdì di ogni mese e in più il 1º di ogni mese, sempre ' +
    'alle 0:00'],
  ['0 0 1 * 1#2',
    'il secondo lunedì di ogni mese e in più il 1º di ogni mese, sempre ' +
    'alle 0:00'],

  // open / second — context `* * * * *`
  ['30 * * * * *', 'al secondo 30 di ogni minuto'],
  ['0,30 * * * * *', 'ogni 30 secondi'],
  ['*/15 * * * * *', 'ogni 15 secondi'],
  ['0-9 * * * * *', 'ogni secondo dal secondo 0 al 9 di ogni minuto'],

  // open / minute
  ['30 * * * *', 'al minuto 30 di ogni ora'],
  ['0,30 * * * *', 'ogni 30 minuti'],
  ['0-29 * * * *', 'ogni minuto dal minuto 0 al 29 di ogni ora'],
  ['0-29,45 * * * *',
    'ogni minuto dal minuto 0 al 29 e una volta al minuto 45 di ogni ora'],
  ['*/7 * * * *', 'ogni 7 minuti dal minuto 0 al 56, ripartendo a ogni ora'],
  ['5/15 * * * *', 'ai minuti 5, 20, 35 e 50 di ogni ora'],
  ['10-40/10 * * * *', 'ai minuti 10, 20, 30 e 40 di ogni ora'],

  // open / hour
  ['* 12 * * *', 'tutti i giorni, ogni minuto dalle 12:00 alle 12:59'],
  ['* 8,12,18 * * *',
    'tutti i giorni, ogni minuto dalle 8:00 alle 8:59, dalle 12:00 alle ' +
    '12:59 e dalle 18:00 alle 18:59'],
  ['* 9-17 * * *', 'tutti i giorni, ogni minuto dalle 9:00 alle 17:59'],
  ['* */2 * * *',
    'tutti i giorni, ogni minuto dalle 0:00 alle 0:59, dalle 2:00 alle ' +
    '2:59 e così via ogni 2 ore fino alle 22:59'],
  ['* */6 * * *',
    'tutti i giorni, ogni minuto dalle 0:00 alle 0:59, dalle 6:00 alle ' +
    '6:59, dalle 12:00 alle 12:59 e dalle 18:00 alle 18:59'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'tutti i giorni, ogni minuto dalle 0:00 alle 0:59, dalle 2:00 alle ' +
    '2:59 e così via ogni 2 ore fino alle 22:59, tranne dalle 8:00 alle ' +
    '8:59'],
  ['* 22-2 * * *', 'tutti i giorni, ogni minuto dalle 22:00 alle 2:59'],

  // open / date
  ['* * 15 * *', 'il 15 di ogni mese, ogni minuto'],
  ['* * 1,15 * *', 'il 1º e il 15 di ogni mese, ogni minuto'],
  ['* * 1-7 * *', 'tutti i giorni dal 1º al 7 di ogni mese, ogni minuto'],
  ['* * 1-7,15 * *',
    'tutti i giorni dal 1º al 7 e il 15 di ogni mese, ogni minuto'],
  ['* * 2/2 * *', 'nei giorni pari di ogni mese, ogni minuto'],
  ['* * */5 * *',
    'il 1º, il 6, l\'11, il 16, il 21, il 26 e il 31 di ogni mese, ogni ' +
    'minuto'],
  ['* * L * *', 'l\'ultimo giorno di ogni mese, ogni minuto'],
  ['* * 15W * *',
    'il giorno lavorativo più vicino al 15 di ogni mese (dal lunedì al ' +
    'venerdì, festivi compresi), ogni minuto'],

  // open / month
  ['* * * 6 *', 'a giugno, ogni minuto'],
  ['* * * 1,7 *', 'a gennaio e luglio, ogni minuto'],
  ['* * * 6-8 *', 'da giugno ad agosto, ogni minuto'],
  ['* * * 6-8,12 *', 'da giugno ad agosto e poi a dicembre, ogni minuto'],
  ['* * * */3 *', 'a gennaio, aprile, luglio e ottobre, ogni minuto'],
  ['* * * 1-11 *', 'ogni minuto, tranne a dicembre'],

  // open / weekday
  ['* * * * 0', 'la domenica, ogni minuto'],
  ['* * * * 1,3,5', 'il lunedì, il mercoledì e il venerdì, ogni minuto'],
  ['* * * * 0,6', 'il sabato e la domenica, ogni minuto'],
  ['* * * * 1-6', 'dal lunedì al sabato, ogni minuto'],
  ['* * * * 5L', 'l\'ultimo venerdì di ogni mese, ogni minuto'],
  ['* * * * 1#2', 'il secondo lunedì di ogni mese, ogni minuto']
];

export {rows};
