// Italian paradigms a renderer's builder may see: one row per grid
// pattern at a visible position.
//
// Written by hand from src/lang/it/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *', 'tutti i giorni, ogni secondo dalle 9:00:00 alle 9:00:59'],
  ['*/6 0 9 * * *',
    'tutti i giorni, ogni 6 secondi dalle 9:00:00 alle 9:00:54'],
  ['5/10 0 9 * * *',
    'tutti i giorni, ogni 10 secondi dalle 9:00:05 alle 9:00:55'],

  // clock / minute
  ['* 9 * * *', 'tutti i giorni, ogni minuto dalle 9:00 alle 9:59'],
  ['5,20,45 9 * * *', 'tutti i giorni alle 9:05, alle 9:20 e alle 9:45'],
  ['*/15 9 * * *',
    'tutti i giorni alle 9:00, alle 9:15, alle 9:30 e alle 9:45'],
  ['0,15,45 9 * * *', 'tutti i giorni alle 9:00, alle 9:15 e alle 9:45'],

  // clock / hour
  ['0 * * * *', 'a ogni ora in punto'],
  ['0 9,17 * * *', 'tutti i giorni alle 9:00 e alle 17:00'],
  ['0 9-17,22 * * *',
    'tutti i giorni, ogni ora dalle 9:00 alle 17:00 e una volta alle 22:00'],
  ['0 1/2 * * *', 'tutti i giorni, ogni 2 ore dall\'1:00 alle 23:00'],

  // clock / date
  ['0 9 1 * *', 'il 1º di ogni mese alle 9:00'],
  ['0 9 1,10,20 * *', 'il 1º, il 10 e il 20 di ogni mese alle 9:00'],
  ['0 9 */2 * *', 'nei giorni dispari di ogni mese alle 9:00'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'nei giorni dispari di ogni mese tranne il 15, alle 9:00'],

  // clock / month
  ['0 9 * 1 *', 'a gennaio, tutti i giorni alle 9:00'],
  ['0 9 * 3,6,9,12 *',
    'a marzo, giugno, settembre e dicembre, tutti i giorni alle 9:00'],
  ['0 9 * */2 *', 'ogni 2 mesi a partire da gennaio, tutti i giorni alle 9:00'],
  ['0 9 * 11-2 *', 'da novembre a febbraio, tutti i giorni alle 9:00'],

  // clock / weekday
  ['0 9 * * 1', 'il lunedì alle 9:00'],
  ['0 9 * * 1-5', 'dal lunedì al venerdì alle 9:00'],
  ['0 9 * * 2,4', 'il martedì e il giovedì alle 9:00'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45, ogni ' +
    'volta per un minuto intero, secondo per secondo'],
  ['*/6 */15 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45, ogni ' +
    'volta dal secondo 0 al 54, a intervalli di 6 secondi'],
  ['5/10 */15 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45, ogni ' +
    'volta dal secondo 5 al 55, a intervalli di 10 secondi'],

  // window / minute
  ['* 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni minuto dalle 9:00 alle 17:59'],
  ['0,30 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni 30 minuti dalle 9:00 alle 17:30'],
  ['0-29,45 9-17 * * 1-5',
    'dal lunedì al venerdì, ogni minuto dal minuto 0 al 29 e una volta al ' +
    'minuto 45 di ciascuna ora dalle 9 alle 17 (prima volta alle 9:00, ' +
    'ultima alle 17:45)'],
  ['0,15,45 9-17 * * 1-5',
    'dal lunedì al venerdì, ai minuti 0, 15 e 45 di ogni ora, dalle 9:00 ' +
    'alle 17:45'],

  // window / hour
  ['*/15 * * * 1-5', 'dal lunedì al venerdì, ogni 15 minuti'],
  ['*/15 12 * * 1-5',
    'dal lunedì al venerdì alle 12:00, alle 12:15, alle 12:30 e alle 12:45'],
  ['*/15 9-17,22 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45 e dalle ' +
    '22:00 alle 22:45'],
  ['*/15 1/2 * * 1-5',
    'dal lunedì al venerdì, ogni 15 minuti dall\'1:00 all\'1:45, dalle 3:00 ' +
    'alle 3:45 e così via ogni 2 ore fino alle 23:45'],

  // window / date
  ['*/15 9-17 1 * 1-5',
    'dal lunedì al venerdì e in più il 1º di ogni mese, sempre ogni 15 ' +
    'minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 1,10,20 * 1-5',
    'dal lunedì al venerdì e in più il 1º, il 10 e il 20 di ogni mese, ' +
    'sempre ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 */2 * 1-5',
    'dal lunedì al venerdì e in più nei giorni dispari di ogni mese, ' +
    'sempre ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'dal lunedì al venerdì e in più nei giorni dispari di ogni mese tranne ' +
    'il 15, sempre ogni 15 minuti dalle 9:00 alle 17:45'],

  // window / month
  ['*/15 9-17 * 1 1-5',
    'a gennaio, dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'a marzo, giugno, settembre e dicembre, dal lunedì al venerdì, ogni 15 ' +
    'minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 * */2 1-5',
    'ogni 2 mesi a partire da gennaio, dal lunedì al venerdì, ogni 15 ' +
    'minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 * 11-2 1-5',
    'da novembre a febbraio, dal lunedì al venerdì, ogni 15 minuti dalle ' +
    '9:00 alle 17:45'],

  // window / weekday
  ['*/15 9-17 * * *', 'tutti i giorni, ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 * * 1,3,5',
    'il lunedì, il mercoledì e il venerdì, ogni 15 minuti dalle 9:00 alle ' +
    '17:45'],
  ['*/15 9-17 * * 2,4',
    'il martedì e il giovedì, ogni 15 minuti dalle 9:00 alle 17:45'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *',
    'il 1º di ogni mese, ogni secondo dalle 0:00:00 alle 0:00:59'],
  ['*/6 0 0 1 * *',
    'il 1º di ogni mese, ogni 6 secondi dalle 0:00:00 alle 0:00:54'],
  ['5/10 0 0 1 * *',
    'il 1º di ogni mese, ogni 10 secondi dalle 0:00:05 alle 0:00:55'],

  // monthly / minute
  ['* 0 1 * *', 'il 1º di ogni mese, ogni minuto dalle 0:00 alle 0:59'],
  ['5,20,45 0 1 * *', 'il 1º di ogni mese alle 0:05, alle 0:20 e alle 0:45'],
  ['*/15 0 1 * *',
    'il 1º di ogni mese alle 0:00, alle 0:15, alle 0:30 e alle 0:45'],
  ['0,15,45 0 1 * *', 'il 1º di ogni mese alle 0:00, alle 0:15 e alle 0:45'],

  // monthly / hour
  ['0 * 1 * *', 'il 1º di ogni mese, a ogni ora in punto'],
  ['0 9,17 1 * *', 'il 1º di ogni mese alle 9:00 e alle 17:00'],
  ['0 9-17,22 1 * *',
    'il 1º di ogni mese, ogni ora dalle 9:00 alle 17:00 e una volta alle ' +
    '22:00'],
  ['0 1/2 1 * *', 'il 1º di ogni mese, ogni 2 ore dall\'1:00 alle 23:00'],

  // monthly / date
  ['0 0 * * *', 'tutti i giorni alle 0:00'],
  ['0 0 1,10,20 * *', 'il 1º, il 10 e il 20 di ogni mese alle 0:00'],
  ['0 0 */2 * *', 'nei giorni dispari di ogni mese alle 0:00'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'nei giorni dispari di ogni mese tranne il 15, alle 0:00'],

  // monthly / month
  ['0 0 1 1 *', 'il 1º gennaio alle 0:00'],
  ['0 0 1 3,6,9,12 *',
    'a marzo, giugno, settembre e dicembre, il 1º del mese alle 0:00'],
  ['0 0 1 */2 *', 'ogni 2 mesi a partire da gennaio, il 1º del mese alle 0:00'],
  ['0 0 1 11-2 *', 'da novembre a febbraio, il 1º del mese alle 0:00'],

  // monthly / weekday
  ['0 0 1 * 1', 'il lunedì e in più il 1º di ogni mese, sempre alle 0:00'],
  ['0 0 1 * 1-5',
    'dal lunedì al venerdì e in più il 1º di ogni mese, sempre alle 0:00'],
  ['0 0 1 * 2,4',
    'il martedì e il giovedì e in più il 1º di ogni mese, sempre alle 0:00'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'ogni secondo'],
  ['*/6 * * * * *', 'ogni 6 secondi'],
  ['5/10 * * * * *', 'ogni 10 secondi a partire dal secondo 5 di ogni minuto'],

  // open / minute
  ['5,20,45 * * * *', 'ai minuti 5, 20 e 45 di ogni ora'],
  ['*/15 * * * *', 'ogni 15 minuti'],
  ['0,15,45 * * * *', 'ai minuti 0, 15 e 45 di ogni ora'],

  // open / hour
  ['* 0 * * *', 'tutti i giorni, ogni minuto dalle 0:00 alle 0:59'],
  ['* 9,17 * * *',
    'tutti i giorni, ogni minuto dalle 9:00 alle 9:59 e dalle 17:00 alle ' +
    '17:59'],
  ['* 9-17,22 * * *',
    'tutti i giorni, ogni minuto dalle 9:00 alle 17:59 e dalle 22:00 alle ' +
    '22:59'],
  ['* 1/2 * * *',
    'tutti i giorni, ogni minuto dall\'1:00 all\'1:59, dalle 3:00 alle 3:59 ' +
    'e così via ogni 2 ore fino alle 23:59'],

  // open / date
  ['* * 1 * *', 'il 1º di ogni mese, ogni minuto'],
  ['* * 1,10,20 * *', 'il 1º, il 10 e il 20 di ogni mese, ogni minuto'],
  ['* * */2 * *', 'nei giorni dispari di ogni mese, ogni minuto'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'nei giorni dispari di ogni mese tranne il 15, ogni minuto'],

  // open / month
  ['* * * 1 *', 'a gennaio, ogni minuto'],
  ['* * * 3,6,9,12 *', 'a marzo, giugno, settembre e dicembre, ogni minuto'],
  ['* * * */2 *', 'ogni 2 mesi a partire da gennaio, ogni minuto'],
  ['* * * 11-2 *', 'da novembre a febbraio, ogni minuto'],

  // open / weekday
  ['* * * * 1', 'il lunedì, ogni minuto'],
  ['* * * * 1-5', 'dal lunedì al venerdì, ogni minuto'],
  ['* * * * 2,4', 'il martedì e il giovedì, ogni minuto']
];

export {rows};
