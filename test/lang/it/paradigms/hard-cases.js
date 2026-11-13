// Italian hard cases: patterns outside the grid that reach rules the
// grid's ladders do not, or where several fields are restricted at once.
// A builder may see these.
//
// Written by hand from src/lang/it/answers.md. Never produced by running a
// renderer.

const rows = [
  // Years: always the leading part, never fused into a date.
  ['0 0 1 1 * 2030', 'nel 2030, il 1º gennaio alle 0:00', {years: true}],
  ['0 0 0 1 1 * 2030,2035', 'nel 2030 e nel 2035, il 1º gennaio alle 0:00'],
  ['0 0 0 1 1 * 2030-2035', 'dal 2030 al 2035, il 1º gennaio alle 0:00'],
  ['0 0 1 1 * */2', 'negli anni pari, il 1º gennaio alle 0:00', {years: true}],
  ['30 0 9 1 6 * 2030', 'nel 2030, il 1º giugno alle 9:00:30'],
  ['0 0 9 * * * 2030', 'nel 2030, tutti i giorni alle 9:00'],
  ['0 0 9 * * * 2028-2031', 'dal 2028 al 2031, tutti i giorni alle 9:00'],
  ['0 0 9 * 6 * 2030', 'nel 2030, a giugno, tutti i giorni alle 9:00'],
  ['0 0 9 * 6 1 2030', 'nel 2030, a giugno, il lunedì alle 9:00'],
  ['0 0 9 1,15 6 * 2030', 'nel 2030, il 1º e il 15 giugno alle 9:00'],
  ['0 0 9 * 6,7 * 2030',
    'nel 2030, a giugno e luglio, tutti i giorni alle 9:00'],
  ['0 0 9 * 6 * 2030,2031',
    'nel 2030 e nel 2031, a giugno, tutti i giorni alle 9:00'],
  ['0 0 9 L 6 * 2030', 'nel 2030, l\'ultimo giorno di giugno alle 9:00'],
  ['0 0 9 1 * * 2030', 'nel 2030, il 1º di ogni mese alle 9:00'],
  ['0 0 9 * * * 2030/2',
    'negli anni pari dal 2030 in poi, tutti i giorni alle 9:00'],
  ['0 0 9 * * * 2028/4',
    'un anno su 4 a partire dal 2028, tutti i giorni alle 9:00'],
  ['0 0 0 1 1 * 2028/4',
    'un anno su 4 a partire dal 2028, il 1º gennaio alle 0:00'],
  ['0 */5 * * * * 2028/4', 'un anno su 4 a partire dal 2028, ogni 5 minuti'],
  ['0 0 9 * * * 2028-2060/4',
    'un anno su 4 dal 2028 al 2060, tutti i giorni alle 9:00'],
  ['0 0 9 * * * 2028-2048/4',
    'un anno su 4 dal 2028 al 2048, tutti i giorni alle 9:00'],
  ['0 0 9 * * * 2030-2040/2',
    'negli anni pari dal 2030 al 2040, tutti i giorni alle 9:00'],
  ['0 0 9 * * * 2028-2036/4',
    'nel 2028, nel 2032 e nel 2036, tutti i giorni alle 9:00'],
  ['0 */5 * * * * */2', 'negli anni pari, ogni 5 minuti'],
  ['0 0 9 * * * 1971/2', 'negli anni dispari, tutti i giorni alle 9:00'],
  ['0 0 0 1 1 * 2030-2032,2035',
    'dal 2030 al 2032 e nel 2035, il 1º gennaio alle 0:00'],
  ['0 0 0 1 * * 2030-2035', 'dal 2030 al 2035, il 1º di ogni mese alle 0:00'],
  ['0 0 0 1 6-8 * 2030',
    'nel 2030, da giugno ad agosto, il 1º del mese alle 0:00'],
  ['0 0 9 * 1-11 * 2030',
    'nel 2030, tutti i giorni alle 9:00, tranne a dicembre'],
  ['0 0 0 1 1 * 2030-9999', 'dal 2030 in poi, il 1º gennaio alle 0:00'],
  ['0 0 0 1 1 * 1970-2030', 'fino al 2030 compreso, il 1º gennaio alle 0:00'],
  ['0 0 9 * * * 1970-2029,2031-9999',
    'tutti i giorni alle 9:00, tranne nel 2030'],
  ['0 0 9 * 1-5,7-12 * 1970-2029,2031-9999',
    'tutti i giorni alle 9:00, tranne a giugno e tranne nel 2030'],
  ['0 0 0 1 1 * 2030-2040,2045/5',
    'dal 2030 al 2040 e un anno su 5 a partire dal 2045, il 1º gennaio ' +
    'alle 0:00'],
  ['0 0 0 29 2 * 2031', 'mai: la data indicata non esiste'],

  // Quartz forms: no word for a Monday-to-Friday day, and no month promised that is skipped.
  ['0 0 1 * ?', 'il 1º di ogni mese alle 0:00', {cron: 'quartz'}],
  ['0 0 LW * *',
    'l\'ultimo giorno lavorativo di ogni mese (dal lunedì al venerdì, ' +
    'festivi compresi) alle 0:00'],
  ['0 0 1W * *',
    'il primo giorno lavorativo di ogni mese (dal lunedì al venerdì, ' +
    'festivi compresi) alle 0:00'],
  ['0 0 1W 6 *',
    'il primo giorno lavorativo di giugno (dal lunedì al venerdì, festivi ' +
    'compresi) alle 0:00'],
  ['0 0 15W 6 *',
    'il giorno lavorativo più vicino al 15 giugno (dal lunedì al venerdì, ' +
    'festivi compresi) alle 0:00'],
  ['0 0 8W * *',
    'il giorno lavorativo più vicino all\'8 di ogni mese (dal lunedì al ' +
    'venerdì, festivi compresi) alle 0:00'],
  ['0 0 31W * *',
    'l\'ultimo giorno lavorativo dei mesi di 31 giorni (dal lunedì al ' +
    'venerdì, festivi compresi) alle 0:00'],
  ['0 0 28W * *',
    'il giorno lavorativo più vicino al 28 di ogni mese, senza uscire dal ' +
    'mese (dal lunedì al venerdì, festivi compresi) alle 0:00'],
  ['0 0 30W * *',
    'il giorno lavorativo più vicino al 30 di ogni mese, senza uscire dal ' +
    'mese (dal lunedì al venerdì, festivi compresi) alle 0:00, tranne a ' +
    'febbraio'],
  ['0 0 30W 6 *',
    'il giorno lavorativo più vicino al 30 giugno, senza uscire dal mese ' +
    '(dal lunedì al venerdì, festivi compresi) alle 0:00'],
  ['0 0 L-3 * *',
    '3 giorni prima dell\'ultimo giorno di ogni mese (il 28 nei mesi di 31 ' +
    'giorni, il 27 in quelli di 30, il 25 o il 26 a febbraio) alle 0:00'],
  ['0 0 L-3 6 *', 'il 27 giugno alle 0:00'],
  ['0 0 L-1 * *', 'il penultimo giorno di ogni mese alle 0:00'],
  ['0 0 L-2 * *', 'il terzultimo giorno di ogni mese alle 0:00'],
  ['0 0 L-30 * *', 'il 1º dei mesi di 31 giorni alle 0:00'],
  ['0 0 L 6 *', 'l\'ultimo giorno di giugno alle 0:00'],
  ['0 0 L 6-8,12 *',
    'da giugno ad agosto e poi a dicembre, l\'ultimo giorno del mese alle ' +
    '0:00'],
  ['0 0 L 6-8 5',
    'da giugno ad agosto, il venerdì e in più l\'ultimo giorno del mese, ' +
    'sempre alle 0:00'],
  ['0 0 * 6 1#2', 'il secondo lunedì di giugno alle 0:00'],
  ['0 0 * 1,7 5L', 'a gennaio e luglio, l\'ultimo venerdì del mese alle 0:00'],
  ['0 9 * * 3#1', 'il primo mercoledì di ogni mese alle 9:00'],
  ['0 9 * * 4#3', 'il terzo giovedì di ogni mese alle 9:00'],
  ['0 9 * * 6L', 'l\'ultimo sabato di ogni mese alle 9:00'],
  ['0 9 * * 0#4', 'la quarta domenica di ogni mese alle 9:00'],
  ['0 9 * * 0#1', 'la prima domenica di ogni mese alle 9:00'],
  ['0 9 * * 0L', 'l\'ultima domenica di ogni mese alle 9:00'],
  ['0 9 * * 1#5', 'il quinto lunedì dei mesi che ne hanno cinque, alle 9:00'],
  ['0 0 31W 6-8 *',
    'a luglio e agosto, l\'ultimo giorno lavorativo del mese (dal lunedì al ' +
    'venerdì, festivi compresi) alle 0:00'],
  ['0 0 29W * *',
    'il giorno lavorativo più vicino al 29 di ogni mese, senza uscire dal ' +
    'mese (dal lunedì al venerdì, festivi compresi), a febbraio solo negli ' +
    'anni bisestili, alle 0:00'],
  ['0 0 L-29 * *',
    '29 giorni prima dell\'ultimo giorno di ogni mese (il 2 nei mesi di 31 ' +
    'giorni, il 1º in quelli di 30) alle 0:00, tranne a febbraio'],
  ['0 0 L-30 6 *', 'mai: la data indicata non esiste'],
  ['0 0 9 ? * 2', 'il lunedì alle 9:00', {cron: 'quartz'}],
  ['0 0 9 ? * 2-6', 'dal lunedì al venerdì alle 9:00', {cron: 'quartz'}],
  ['0 0 L-3 2 *', 'il 25 febbraio (il 26 negli anni bisestili) alle 0:00'],
  ['0 0 L-3 4,6 *', 'ad aprile e giugno, il 27 del mese alle 0:00'],
  ['0 0 L-3 6,7 *', 'il 27 giugno e il 28 luglio alle 0:00'],
  ['0 0 L-28 2 *', 'il 1º febbraio, solo negli anni bisestili, alle 0:00'],
  ['0 0 L-3 1,2 *',
    'il 28 gennaio e il 25 febbraio (il 26 negli anni bisestili) alle 0:00'],
  ['0 0 L-3 6-9 *',
    'da giugno a settembre, 3 giorni prima dell\'ultimo giorno del mese (il ' +
    '28 nei mesi di 31 giorni, il 27 in quelli di 30) alle 0:00'],

  // Macros, startup, and the three forms.
  ['@hourly', 'a ogni ora in punto'],
  ['@daily', 'tutti i giorni alle 0:00'],
  ['@weekly', 'la domenica alle 0:00'],
  ['@monthly', 'il 1º di ogni mese alle 0:00'],
  ['@yearly', 'il 1º gennaio alle 0:00'],
  ['@reboot', 'all\'avvio del sistema'],
  ['0 9 * * *', 'Viene eseguito tutti i giorni alle 9:00.', {form: 'sentence'}],
  ['0 9 * * *', 'Tutti i giorni alle 9:00', {form: 'label'}],
  ['* * * * *', 'Ogni minuto', {form: 'label'}],
  ['0 0 1 * *', 'Il 1º di ogni mese alle 0:00', {form: 'label'}],
  ['0 0 L * *', 'L\'ultimo giorno di ogni mese alle 0:00', {form: 'label'}],
  ['@reboot', 'Viene eseguito all\'avvio del sistema.', {form: 'sentence'}],
  ['not a pattern', 'un\'espressione cron non riconosciuta', {lenient: true}],

  // A day of the month and a weekday (either one), alone and under a month.
  ['0 0 13 * 5', 'il venerdì e in più il 13 di ogni mese, sempre alle 0:00'],
  ['0 0 1 6 5',
    'a giugno, il venerdì e in più il 1º del mese, sempre alle 0:00'],
  ['0 0 1,15 1,7 1-5',
    'a gennaio e luglio, dal lunedì al venerdì e in più il 1º e il 15 del ' +
    'mese, sempre alle 0:00'],
  ['0 0 1 1-11 5',
    'da gennaio a novembre, il venerdì e in più il 1º del mese, sempre ' +
    'alle 0:00'],
  ['52 7-16 1,19,23,28 5-7 3-4',
    'da maggio a luglio, il mercoledì e il giovedì e in più il 1º, il 19, ' +
    'il 23 e il 28 del mese, sempre ogni ora dalle 7:52 alle 16:52'],
  ['30 4 1-7 * 1',
    'il lunedì e in più tutti i giorni dal 1º al 7 di ogni mese, sempre ' +
    'alle 4:30'],
  ['0 0 15 * 0-2,4-6',
    'tutti i giorni tranne il mercoledì, e in più il 15 di ogni mese, ' +
    'sempre alle 0:00'],
  ['0 0 1 6 1#2',
    'a giugno, il secondo lunedì del mese e in più il 1º del mese, sempre ' +
    'alle 0:00'],
  ['0 0 1 1-5,7-12 5',
    'da gennaio a maggio e da luglio a dicembre, il venerdì e in più il 1º ' +
    'del mese, sempre alle 0:00'],
  ['0 9 1-14,16-31 * 5',
    'tutti i giorni (ma il 15 di ogni mese solo se cade di venerdì) alle ' +
    '9:00'],
  ['0 0 30 * 1', 'il lunedì e in più il 30 di ogni mese, sempre alle 0:00'],
  ['0 0 31 6 1', 'a giugno, il lunedì alle 0:00'],
  ['0 9 1-30 6 1', 'a giugno, tutti i giorni alle 9:00'],
  ['0 9 1-31 * 1', 'tutti i giorni alle 9:00'],
  ['0 0 29 2 1',
    'a febbraio, il lunedì e in più il 29 del mese, che c\'è solo negli ' +
    'anni bisestili, sempre alle 0:00'],
  ['0 9 1-14,17-31 6 1-5',
    'a giugno, tutti i giorni (ma il 15 e il 16 solo se cadono tra il ' +
    'lunedì e il venerdì) alle 9:00'],
  ['0 9 1-14,16-31 * 1,3',
    'tutti i giorni (ma il 15 di ogni mese solo se cade di lunedì o di ' +
    'mercoledì) alle 9:00'],
  ['*/15 9-17 1-14,16-31 * 0-2,4-6',
    'tutti i giorni (ma il 15 di ogni mese solo se non cade di mercoledì), ' +
    'ogni 15 minuti dalle 9:00 alle 17:45'],

  // A month with its dates: the date phrase, days a month lacks, runs that pass the end of the month.
  ['0 0 1,15 6 *', 'il 1º e il 15 giugno alle 0:00'],
  ['0 0 1,10,20 6 *', 'il 1º, il 10 e il 20 giugno alle 0:00'],
  ['0 0 1-7 6 *', 'tutti i giorni dal 1º al 7 giugno alle 0:00'],
  ['0 0 1-7,15 6 *', 'tutti i giorni dal 1º al 7 e il 15 giugno alle 0:00'],
  ['0 0 */2 6 *', 'nei giorni dispari di giugno alle 0:00'],
  ['0 0 */5 7 *',
    'il 1º, il 6, l\'11, il 16, il 21, il 26 e il 31 luglio alle 0:00'],
  ['0 0 */5 6 *', 'il 1º, il 6, l\'11, il 16, il 21 e il 26 giugno alle 0:00'],
  ['0 0 25-31 6 *', 'tutti i giorni dal 25 al 30 giugno alle 0:00'],
  ['0 0 30,31 4,6 *', 'ad aprile e giugno, il 30 del mese alle 0:00'],
  ['0 0 31 * *', 'il 31 dei mesi di 31 giorni alle 0:00'],
  ['0 0 30 * *', 'il 30 di ogni mese alle 0:00, tranne a febbraio'],
  ['0 0 30,31 * *', 'il 30 e il 31 di ogni mese alle 0:00, tranne a febbraio'],
  ['0 0 29 * *',
    'il 29 di ogni mese, a febbraio solo negli anni bisestili, alle 0:00'],
  ['0 0 29 2 *', 'il 29 febbraio, solo negli anni bisestili, alle 0:00'],
  ['0 0 28-3 * *',
    'tutti i giorni dal 1º al 3 e dal 28 al 31 di ogni mese alle 0:00'],
  ['0 0 28-3 6 *',
    'tutti i giorni dal 1º al 3 e dal 28 al 30 giugno alle 0:00'],
  ['0 0 1,15 1,7 *', 'a gennaio e luglio, il 1º e il 15 del mese alle 0:00'],
  ['59 23 31 12 *', 'il 31 dicembre alle 23:59'],
  ['0 0 1-14,16-31 * *', 'tutti i giorni tranne il 15 di ogni mese, alle 0:00'],
  ['0 0 1-14,16-31 6 *', 'a giugno, tutti i giorni tranne il 15, alle 0:00'],
  ['0 0 1-14,17-31 * *',
    'tutti i giorni tranne il 15 e il 16 di ogni mese, alle 0:00'],
  ['0 0 1-30 * *', 'tutti i giorni tranne il 31 di ogni mese, alle 0:00'],
  ['0 0 1 2/2 *',
    'ogni 2 mesi a partire da febbraio, il 1º del mese alle 0:00'],
  ['0 12 1-5,10,20-25 * *',
    'tutti i giorni dal 1º al 5, il 10 e dal 20 al 25 di ogni mese alle ' +
    '12:00'],
  ['0 0 */10 * *', 'il 1º, l\'11, il 21 e il 31 di ogni mese alle 0:00'],
  ['0 0 */21 * *', 'il 1º e il 22 di ogni mese alle 0:00'],
  ['0 0 5-20/3 * *',
    'il 5, l\'8, l\'11, il 14, il 17 e il 20 di ogni mese alle 0:00'],
  ['0 0 */3 * *', 'ogni 3 giorni a partire dal 1º di ogni mese alle 0:00'],
  ['0 0 8/2 * *', 'nei giorni pari dall\'8 al 30 di ogni mese alle 0:00'],
  ['0 0 1,10-15 * *',
    'il 1º e tutti i giorni dal 10 al 15 di ogni mese alle 0:00'],
  ['0 0 8 * *', 'l\'8 di ogni mese alle 0:00'],
  ['0 0 11 * *', 'l\'11 di ogni mese alle 0:00'],
  ['0 0 1,8,11 * *', 'il 1º, l\'8 e l\'11 di ogni mese alle 0:00'],
  ['0 0 8-11 * *', 'tutti i giorni dall\'8 all\'11 di ogni mese alle 0:00'],
  ['0 0 8 8 *', 'l\'8 agosto alle 0:00'],
  ['0 0 1 10 *', 'il 1º ottobre alle 0:00'],
  ['0 0 31 6 *', 'mai: la data indicata non esiste'],
  ['0 0 31 6 *',
    'Non viene mai eseguito: la data indicata non esiste.',
    {form: 'sentence'}],
  ['0 0 31 1-6 *', 'a gennaio, marzo e maggio, il 31 del mese alle 0:00'],
  ['0 0 30 1-3 *', 'a gennaio e marzo, il 30 del mese alle 0:00'],
  ['0 0 30 1-5,7-12 *',
    'il 30 di ogni mese alle 0:00, tranne a febbraio e giugno'],
  ['0 0 1,31 4,6,9,11 *',
    'ad aprile, giugno, settembre e novembre, il 1º del mese alle 0:00'],
  ['0 0 */3 6 *', 'ogni 3 giorni dal 1º al 28 giugno alle 0:00'],
  ['0 0 */4 * *', 'ogni 4 giorni a partire dal 1º di ogni mese alle 0:00'],
  ['0 0 31 6 *', 'Mai: la data indicata non esiste', {form: 'label'}],

  // Months: the preposition, runs, pieces, a run past the end of the year, and the exception that closes the sentence.
  ['0 9 * 1-3,6,9-11 *',
    'da gennaio a marzo, poi a giugno e da settembre a novembre, tutti i ' +
    'giorni alle 9:00'],
  ['0 9 * 12,1 *', 'a dicembre e gennaio, tutti i giorni alle 9:00'],
  ['0 0 * 11-2 * 2030',
    'nel 2030, a gennaio, febbraio, novembre e dicembre, tutti i giorni ' +
    'alle 0:00',
    {years: true}],
  ['0 0 * 8 *', 'ad agosto, tutti i giorni alle 0:00'],
  ['0 0 * 4,8 *', 'ad aprile e agosto, tutti i giorni alle 0:00'],
  ['0 0 * 4-8 *', 'da aprile ad agosto, tutti i giorni alle 0:00'],
  ['0 0 * 6-10 *', 'da giugno a ottobre, tutti i giorni alle 0:00'],
  ['0 9 * 1-5,7-12 *', 'tutti i giorni alle 9:00, tranne a giugno'],
  ['0 9 * 3-1 *', 'tutti i giorni alle 9:00, tranne a febbraio'],
  ['0 9 * 1-7,9-12 1', 'il lunedì alle 9:00, tranne ad agosto'],
  ['0 0 1 1-5,7-11 *',
    'il 1º di ogni mese alle 0:00, tranne a giugno e dicembre'],
  ['*/5 * * 1-7,9-12 *', 'ogni 5 minuti, tranne ad agosto'],
  ['0 9 * 12,1 * 2030',
    'nel 2030, a gennaio e dicembre, tutti i giorni alle 9:00',
    {years: true}],

  // Weekdays: the week runs from Monday to Sunday; runs, runs past Sunday, pieces and exceptions.
  ['0 9 * * 5-1', 'dal venerdì al lunedì alle 9:00'],
  ['0 9 * * 6-1', 'dal sabato al lunedì alle 9:00'],
  ['0 9 * * 2-4', 'dal martedì al giovedì alle 9:00'],
  ['0 9 * * 0,1', 'la domenica e il lunedì alle 9:00'],
  ['0 9 * * 5,6', 'il venerdì e il sabato alle 9:00'],
  ['0 9 * * 0,5', 'il venerdì e la domenica alle 9:00'],
  ['0 9 * * 0,2-4', 'dal martedì al giovedì e la domenica alle 9:00'],
  ['0 9 * * 1,2,3,6', 'dal lunedì al mercoledì e il sabato alle 9:00'],
  ['0 9 * * 0,1,2,4',
    'il lunedì, il martedì, il giovedì e la domenica alle 9:00'],
  ['0 9 * * 0,2-5', 'tutti i giorni tranne il lunedì e il sabato, alle 9:00'],
  ['0 9 * * 1,2,4,5,6',
    'tutti i giorni tranne il mercoledì e la domenica, alle 9:00'],
  ['0 9 * * 1,2,3,5', 'dal lunedì al venerdì tranne il giovedì, alle 9:00'],
  ['0 9 * * 1,3,4,5', 'dal lunedì al venerdì tranne il martedì, alle 9:00'],
  ['0 9 * * 0,2-6', 'dal martedì alla domenica alle 9:00'],
  ['0 9 * * 0-5', 'tutti i giorni tranne il sabato, alle 9:00'],
  ['0 9 * * 0-4', 'tutti i giorni tranne il venerdì e il sabato, alle 9:00'],
  ['0 9 * * 0-2,4-6', 'tutti i giorni tranne il mercoledì, alle 9:00'],
  ['0 9 * 6 0-2,4-6',
    'a giugno, tutti i giorni tranne il mercoledì, alle 9:00'],
  ['* * * * 0-2,4-6', 'tutti i giorni tranne il mercoledì, ogni minuto'],
  ['0 0,1,22,23 * * 1',
    'il lunedì alle 0:00, all\'1:00, alle 22:00 e alle 23:00'],
  ['0 9 * 6 1', 'a giugno, il lunedì alle 9:00'],
  ['0 9 * 6 1,3,5', 'a giugno, il lunedì, il mercoledì e il venerdì alle 9:00'],
  ['0 9 * 6 0,6', 'a giugno, il sabato e la domenica alle 9:00'],
  ['0 9 * 1,7 1', 'a gennaio e luglio, il lunedì alle 9:00'],
  ['0 9 * 6-8 1', 'da giugno ad agosto, il lunedì alle 9:00'],
  ['0 9 * 6 1-5', 'a giugno, dal lunedì al venerdì alle 9:00'],
  ['0 9 * 6 0,2-5',
    'a giugno, tutti i giorni tranne il lunedì e il sabato, alle 9:00'],

  // Clock times: up to four are listed whatever the fields look like; «all'1» makes every time take its own preposition.
  ['0 9 * * *', 'tutti i giorni alle 9:00'],
  ['0,30 9,17 * * *',
    'tutti i giorni alle 9:00, alle 9:30, alle 17:00 e alle 17:30'],
  ['5,20 9,17 * * *',
    'tutti i giorni alle 9:05, alle 9:20, alle 17:05 e alle 17:20'],
  ['5,20,45 9,17 * * *',
    'tutti i giorni alle 9:05, alle 9:20, alle 9:45, alle 17:05, alle ' +
    '17:20 e alle 17:45'],
  ['5,20,45 8,12,18 * * *',
    'tutti i giorni, ai minuti 5, 20 e 45 delle ore 8, 12 e 18'],
  ['0 1 * * *', 'tutti i giorni all\'1:00'],
  ['0 13 * * *', 'tutti i giorni alle 13:00'],
  ['30 1,13 * * *', 'tutti i giorni all\'1:30 e alle 13:30'],
  ['0 1,5,9 * * *', 'tutti i giorni all\'1:00, alle 5:00 e alle 9:00'],
  ['0 9,13 * * *', 'tutti i giorni alle 9:00 e alle 13:00'],
  ['0 0,23 * * *', 'tutti i giorni alle 0:00 e alle 23:00'],
  ['30 0 * * *', 'tutti i giorni alle 0:30'],
  ['30 0 0 * * *', 'tutti i giorni alle 0:00:30'],
  ['30 12 * * *', 'tutti i giorni alle 12:30'],
  ['1 * * * *', 'al minuto 1 di ogni ora'],
  ['0 9-12 * * *',
    'tutti i giorni alle 9:00, alle 10:00, alle 11:00 e alle 12:00'],
  ['0 9-13 * * *', 'tutti i giorni, ogni ora dalle 9:00 alle 13:00'],
  ['0 1-5 * * *', 'tutti i giorni, ogni ora dall\'1:00 alle 5:00'],
  ['0 1,5,9,14,20 * * *',
    'tutti i giorni all\'1:00, alle 5:00, alle 9:00, alle 14:00 e alle 20:00'],
  ['* 22-23 * * *', 'tutti i giorni, ogni minuto dalle 22:00 alle 23:59'],
  ['*/30 0-17 * * 2', 'il martedì, ogni 30 minuti dalle 0:00 alle 17:30'],
  ['0 5,9-17 * * *',
    'tutti i giorni alle 5:00 e ogni ora dalle 9:00 alle 17:00'],
  ['5/10 9,17 * * *',
    'tutti i giorni, ogni 10 minuti dalle 9:05 alle 9:55 e dalle 17:05 ' +
    'alle 17:55'],
  ['0,20,40 9 * * *', 'tutti i giorni alle 9:00, alle 9:20 e alle 9:40'],
  ['0,30 8,12,18 * * *',
    'tutti i giorni alle 8:00, alle 8:30, alle 12:00, alle 12:30, alle ' +
    '18:00 e alle 18:30'],
  ['*/20 9,17 * * *',
    'tutti i giorni alle 9:00, alle 9:20, alle 9:40, alle 17:00, alle ' +
    '17:20 e alle 17:40'],
  ['0,30 9-11 * * *', 'tutti i giorni, ogni 30 minuti dalle 9:00 alle 11:30'],
  ['0,30 8,12,16,20 * * *',
    'tutti i giorni alle 8:00, alle 8:30, alle 12:00, alle 12:30, alle ' +
    '16:00, alle 16:30, alle 20:00 e alle 20:30'],
  ['5,20,45 9-10 * * *',
    'tutti i giorni alle 9:05, alle 9:20, alle 9:45, alle 10:05, alle ' +
    '10:20 e alle 10:45'],

  // Hours that run past midnight are one run only when every day fires; beside any day, month or year they are said in clock order.
  ['0 0-6,22,23 * * *', 'tutti i giorni, ogni ora dalle 22:00 alle 6:00'],
  ['*/15 0-5,22-23 * * *',
    'tutti i giorni, ogni 15 minuti dalle 22:00 alle 5:45'],
  ['0 0-6,22,23 * * 1',
    'il lunedì, ogni ora dalle 0:00 alle 6:00, poi alle 22:00 e alle 23:00'],
  ['0 21-1 * * 5',
    'il venerdì alle 0:00, all\'1:00 e ogni ora dalle 21:00 alle 23:00'],
  ['* 22-2 * * 5',
    'il venerdì, ogni minuto dalle 0:00 alle 2:59 e dalle 22:00 alle 23:59'],
  ['0 22-2 * 6 *',
    'a giugno, tutti i giorni, ogni ora dalle 0:00 alle 2:00, poi alle ' +
    '22:00 e alle 23:00'],
  ['0 0 22-2 * * * 2030',
    'nel 2030, tutti i giorni, ogni ora dalle 0:00 alle 2:00, poi alle ' +
    '22:00 e alle 23:00'],

  // A cadence of hours always names its first and last time; four or fewer times are listed.
  ['0 0,6,18 * * *', 'tutti i giorni alle 0:00, alle 6:00 e alle 18:00'],
  ['0 */4 * * *', 'tutti i giorni, ogni 4 ore dalle 0:00 alle 20:00'],
  ['0 */3 * * *', 'tutti i giorni, ogni 3 ore dalle 0:00 alle 21:00'],
  ['0 */5 * * *', 'tutti i giorni, ogni 5 ore dalle 0:00 alle 20:00'],
  ['0 0-20/2 * * *', 'tutti i giorni, ogni 2 ore dalle 0:00 alle 20:00'],
  ['30 */2 * * *', 'tutti i giorni, ogni 2 ore dalle 0:30 alle 22:30'],
  ['30 */3 * * *', 'tutti i giorni, ogni 3 ore dalle 0:30 alle 21:30'],
  ['30 */5 * * *', 'tutti i giorni, ogni 5 ore dalle 0:30 alle 20:30'],
  ['23 */6 * * *',
    'tutti i giorni alle 0:23, alle 6:23, alle 12:23 e alle 18:23'],
  ['23 1/2 * * *', 'tutti i giorni, ogni 2 ore dall\'1:23 alle 23:23'],
  // Twelve hours named one by one were more than a reader holds; a
  // cadence of more than eight hours named as numbers is its first three
  // «e così via fino a» the last (answers 4.1 D.6).
  ['15,45 */2 * * *',
    'tutti i giorni, ai minuti 15 e 45 delle ore 0, 2, 4 e così via fino ' +
    'a 22'],
  ['15,45 */4 * * *',
    'tutti i giorni, ai minuti 15 e 45 delle ore 0, 4, 8, 12, 16 e 20'],
  ['15,45 */6 * * *',
    'tutti i giorni alle 0:15, alle 0:45, alle 6:15, alle 6:45, alle ' +
    '12:15, alle 12:45, alle 18:15 e alle 18:45'],
  ['15,45 9-17 * * *', 'tutti i giorni, ogni 30 minuti dalle 9:15 alle 17:45'],
  ['15,45 * * * *', 'ai minuti 15 e 45 di ogni ora'],
  ['23 */12 * * *', 'tutti i giorni alle 0:23 e alle 12:23'],
  ['0 1/12 * * *', 'tutti i giorni all\'1:00 e alle 13:00'],
  ['*/15 */12 * * *',
    'tutti i giorni, ogni 15 minuti dalle 0:00 alle 0:45 e dalle 12:00 ' +
    'alle 12:45'],
  ['0 */12 * * *', 'tutti i giorni alle 0:00 e alle 12:00'],
  ['0 0/12 * * *', 'tutti i giorni alle 0:00 e alle 12:00'],
  ['0 0,12 * * *', 'tutti i giorni alle 0:00 e alle 12:00'],
  ['0 */12 1 * *', 'il 1º di ogni mese alle 0:00 e alle 12:00'],
  ['0 */3 1 * *', 'il 1º di ogni mese, ogni 3 ore dalle 0:00 alle 21:00'],

  // Exceptions: what is left out is said as the times that do not fire.
  ['0 0-2,4-23 * * *', 'tutti i giorni, a ogni ora in punto, tranne alle 3:00'],
  ['0 4-2 * * *', 'tutti i giorni, a ogni ora in punto, tranne alle 3:00'],
  ['0 0-22 * * *', 'tutti i giorni, a ogni ora in punto, tranne alle 23:00'],
  ['0 0-21 * * *',
    'tutti i giorni, a ogni ora in punto, tranne alle 22:00 e alle 23:00'],
  ['* 0-22 * * *',
    'tutti i giorni, ogni minuto, tranne dalle 23:00 alle 23:59'],
  ['30 0-2,4-23 * * *',
    'tutti i giorni, al minuto 30 di ogni ora, tranne alle 3:30'],
  ['5,20,45 0-2,4-23 * * *',
    'tutti i giorni, ai minuti 5, 20 e 45 di ogni ora, tranne dalle 3:00 ' +
    'alle 3:59'],
  ['*/10 0-2,4-23 * * *',
    'tutti i giorni, ogni 10 minuti, tranne dalle 3:00 alle 3:59'],
  ['* 0-2,5-23 * * *',
    'tutti i giorni, ogni minuto, tranne dalle 3:00 alle 4:59'],
  ['0-28,30-59 * * * *', 'ogni minuto, tranne al minuto 29 di ogni ora'],
  ['0-58 * * * *', 'ogni minuto, tranne al minuto 59 di ogni ora'],
  ['0-28,30-59 9,17 * * *',
    'tutti i giorni, ogni minuto dalle 9:00 alle 9:59 e dalle 17:00 alle ' +
    '17:59, tranne alle 9:29 e alle 17:29'],
  ['0,5,10,15,20,25,35,40,45,50,55 9-17 * * *',
    'tutti i giorni, ogni 5 minuti dalle 9:00 alle 17:55, tranne al minuto ' +
    '30 di ogni ora'],
  ['0,5,10,15,20,25,35,40,45,50,55 9 * * *',
    'tutti i giorni, ogni 5 minuti dalle 9:00 alle 9:55, tranne alle 9:30'],
  ['0,5,10,15,20,25,35,40,45,50,55 0-2,4-23 * * *',
    'tutti i giorni, ogni 5 minuti, tranne dalle 3:00 alle 3:59 e tranne ' +
    'al minuto 30 di ogni ora'],
  ['0,10,20,40,50 9-17 * * *',
    'tutti i giorni, ogni 10 minuti dalle 9:00 alle 17:50, tranne al ' +
    'minuto 30 di ogni ora'],
  ['0,10,20,40,50 9 * * *',
    'tutti i giorni, ogni 10 minuti dalle 9:00 alle 9:50, tranne alle 9:30'],
  ['0,10,20,40,50 * * * *', 'ogni 10 minuti, tranne al minuto 30 di ogni ora'],
  ['0,7,14,21,35,42,49,56 * * * *',
    'ogni 7 minuti dal minuto 0 al 56, ripartendo a ogni ora, tranne al ' +
    'minuto 28'],
  ['* 0-28,30-59 * * * *',
    'ogni secondo, tranne durante il minuto 29 di ogni ora'],
  ['* 0-28,30-59 9 * * *',
    'tutti i giorni, ogni secondo dalle 9:00:00 alle 9:59:59, tranne dalle ' +
    '9:29:00 alle 9:29:59'],
  ['0-28,30-59 * * * * *', 'ogni secondo, tranne al secondo 29 di ogni minuto'],
  ['0-28,30-59 0 9 * * *',
    'tutti i giorni, ogni secondo dalle 9:00:00 alle 9:00:59, tranne alle ' +
    '9:00:29'],
  ['1-29,31-59 * * * *', 'ogni minuto, tranne ai minuti 0 e 30 di ogni ora'],
  ['1-29,31-59 9-17 * * *',
    'tutti i giorni, ogni minuto dal minuto 1 al 29 e dal minuto 31 al 59 ' +
    'di ciascuna ora dalle 9 alle 17 (prima volta alle 9:01, ultima alle ' +
    '17:59)'],
  ['* * 0-2,4-23 * * *',
    'tutti i giorni, ogni secondo, tranne dalle 3:00:00 alle 3:59:59'],
  ['0,7,14,21,35,42,49,56 9-17 * * *',
    'tutti i giorni, ogni 7 minuti dal minuto 0 al 56 di ciascuna ora ' +
    'dalle 9 alle 17 (prima volta alle 9:00, ultima alle 17:56), tranne al ' +
    'minuto 28'],
  ['*/15 0,4,6,8,10,12,14,16,18,20,22 * * *',
    'tutti i giorni, ogni 15 minuti dalle 0:00 alle 0:45 e così via ogni 2 ' +
    'ore fino alle 22:45, tranne dalle 2:00 alle 2:59'],

  // Hours as what confines a cadence or anchored minutes: windows up to three, then the hours named.
  ['*/15 8-18/2 * * *',
    'tutti i giorni, ogni 15 minuti dalle 8:00 alle 8:45, dalle 10:00 alle ' +
    '10:45 e così via ogni 2 ore fino alle 18:45'],
  ['0 9-17,20,22 * * *',
    'tutti i giorni, ogni ora dalle 9:00 alle 17:00, poi alle 20:00 e alle ' +
    '22:00'],
  ['* 9-17,20,22 * * *',
    'tutti i giorni, ogni minuto dalle 9:00 alle 17:59, dalle 20:00 alle ' +
    '20:59 e dalle 22:00 alle 22:59'],
  ['*/10 6-8,17-19 * * 1-5',
    'dal lunedì al venerdì, ogni 10 minuti dalle 6:00 alle 8:50 e dalle ' +
    '17:00 alle 19:50'],
  // Twelve hours named one by one: now the first three and the last
  // (answers 4.1 D.6).
  ['*/20 */2 */2 */3 *',
    'a gennaio, aprile, luglio e ottobre, nei giorni dispari del mese, ai ' +
    'minuti 0, 20 e 40 delle ore 0, 2, 4 e così via fino a 22'],
  ['5,20,45 9-17,22 * * *',
    'tutti i giorni, ai minuti 5, 20 e 45 di ogni ora, dalle 9:05 alle ' +
    '17:45 e dalle 22:05 alle 22:45'],
  ['0-29 8,12,18 * * *',
    'tutti i giorni, ogni minuto dalle 8:00 alle 8:29, dalle 12:00 alle ' +
    '12:29 e dalle 18:00 alle 18:29'],
  ['* 6,8,12,18,20 * * *',
    'tutti i giorni, ogni minuto dalle 6:00 alle 6:59, dalle 8:00 alle ' +
    '8:59, dalle 12:00 alle 12:59, dalle 18:00 alle 18:59 e dalle 20:00 ' +
    'alle 20:59'],
  ['* */3 * * *',
    'tutti i giorni, ogni minuto dalle 0:00 alle 0:59, dalle 3:00 alle ' +
    '3:59 e così via ogni 3 ore fino alle 21:59'],
  ['*/15 0-20/2 * * *',
    'tutti i giorni, ogni 15 minuti dalle 0:00 alle 0:45, dalle 2:00 alle ' +
    '2:45 e così via ogni 2 ore fino alle 20:45'],
  ['5/10 */2 * * *',
    'tutti i giorni, ogni 10 minuti dalle 0:05 alle 0:55, dalle 2:05 alle ' +
    '2:55 e così via ogni 2 ore fino alle 22:55'],
  ['5,20,45 8-10,14,20 * * *',
    'tutti i giorni, ai minuti 5, 20 e 45 di ogni ora, dalle 8:05 alle ' +
    '10:45, dalle 14:05 alle 14:45 e dalle 20:05 alle 20:45'],
  ['0-29 9-17 1 * *',
    'il 1º di ogni mese, ogni minuto dal minuto 0 al 29 di ciascuna ora ' +
    'dalle 9 alle 17 (prima volta alle 9:00, ultima alle 17:29)'],
  ['0-29 9-17,22 * * *',
    'tutti i giorni, ogni minuto dal minuto 0 al 29 di ciascuna ora dalle ' +
    '9 alle 17 comprese e delle ore 22'],

  // Minutes inside the hour.
  ['50-10 9 * * *',
    'tutti i giorni, ogni minuto dalle 9:00 alle 9:10 e dalle 9:50 alle ' +
    '9:59'],
  ['50-10 * * * *',
    'ogni minuto dal minuto 0 al 10 e dal minuto 50 al 59 di ogni ora'],
  ['10-40 9 * * *', 'tutti i giorni, ogni minuto dalle 9:10 alle 9:40'],
  ['30-59 9 * * *', 'tutti i giorni, ogni minuto dalle 9:30 alle 9:59'],
  ['5-10,20 * * * *',
    'ogni minuto dal minuto 5 al 10 e una volta al minuto 20 di ogni ora'],
  ['45-59 * * * *', 'ogni minuto dal minuto 45 al 59 di ogni ora'],
  ['10-40 * * * *', 'ogni minuto dal minuto 10 al 40 di ogni ora'],
  ['0-29 9,17 * * *',
    'tutti i giorni, ogni minuto dalle 9:00 alle 9:29 e dalle 17:00 alle ' +
    '17:29'],
  ['0-1 * * * *', 'ai minuti 0 e 1 di ogni ora'],
  ['*/21 * * * *', 'ai minuti 0, 21 e 42 di ogni ora'],
  ['9,14,47,56 * * * *', 'ai minuti 9, 14, 47 e 56 di ogni ora'],
  ['5/10 * * * *', 'ogni 10 minuti a partire dal minuto 5 di ogni ora'],
  ['0-40/10 * * * *',
    'ogni 10 minuti dal minuto 0 al 40, ripartendo a ogni ora'],
  ['0-42/6 * * * *', 'ogni 6 minuti dal minuto 0 al 42, ripartendo a ogni ora'],
  ['1/2 * * * *', 'ogni 2 minuti a partire dal minuto 1 di ogni ora'],
  ['1/2 9-17 * * *', 'tutti i giorni, ogni 2 minuti dalle 9:01 alle 17:59'],
  ['0-29 */2 * * *',
    'tutti i giorni, ogni minuto dalle 0:00 alle 0:29, dalle 2:00 alle ' +
    '2:29 e così via ogni 2 ore fino alle 22:29'],

  // Seconds.
  ['15 30 9 * * *', 'tutti i giorni alle 9:30:15'],
  ['15 30 9,17 * * *', 'tutti i giorni alle 9:30:15 e alle 17:30:15'],
  ['15,45 30 9 * * *', 'tutti i giorni alle 9:30:15 e alle 9:30:45'],
  ['0,20,40 0 9 * * *',
    'tutti i giorni alle 9:00:00, alle 9:00:20 e alle 9:00:40'],
  ['5-10/60 0 9 * * *', 'tutti i giorni alle 9:00:05'],
  ['15 0 */12 * * *', 'tutti i giorni alle 0:00:15 e alle 12:00:15'],
  ['15 0 */6 * * *',
    'tutti i giorni alle 0:00:15, alle 6:00:15, alle 12:00:15 e alle ' +
    '18:00:15'],
  ['15 0 */2 * * *', 'tutti i giorni, ogni 2 ore dalle 0:00:15 alle 22:00:15'],
  ['10-20 30 9 * * *',
    'tutti i giorni, ogni secondo dalle 9:30:10 alle 9:30:20'],
  ['* 0 9,17 * * *',
    'tutti i giorni, ogni secondo dalle 9:00:00 alle 9:00:59 e dalle ' +
    '17:00:00 alle 17:00:59'],
  ['* 0 8,12,16,20 * * *',
    'tutti i giorni alle 8:00, alle 12:00, alle 16:00 e alle 20:00, ogni ' +
    'volta per un minuto intero, secondo per secondo'],
  ['* * 9 * * *', 'tutti i giorni, ogni secondo dalle 9:00:00 alle 9:59:59'],
  ['* * 9-17 * * *',
    'tutti i giorni, ogni secondo dalle 9:00:00 alle 17:59:59'],
  ['* 0-29 9 * * *', 'tutti i giorni, ogni secondo dalle 9:00:00 alle 9:29:59'],
  ['30 0 9-17 * * *', 'tutti i giorni, ogni ora dalle 9:00:30 alle 17:00:30'],
  ['* 0 * * * *', 'ogni secondo durante il minuto 0 di ogni ora'],
  ['30 0 * * * *', 'al secondo 30 del minuto 0 di ogni ora'],
  ['0-9 0 * * * *', 'ogni secondo dal secondo 0 al 9 del minuto 0 di ogni ora'],
  ['15 30 * * * *', 'al secondo 15 del minuto 30 di ogni ora'],
  ['* 30 * * * *', 'ogni secondo durante il minuto 30 di ogni ora'],
  ['0,30 5,20 * * * *', 'ai secondi 0 e 30 dei minuti 5 e 20 di ogni ora'],
  ['*/15 */15 * * * *',
    'ogni 15 minuti, e in quel minuto ai secondi 0, 15, 30 e 45'],
  ['30 */15 * * * *', 'ogni 15 minuti, al secondo 30'],
  // Twelve hours named one by one: now the first three and the last
  // (answers 4.1 D.6).
  ['8 5,30 */2 * * *',
    'tutti i giorni, al secondo 8 dei minuti 5 e 30 delle ore 0, 2, 4 e ' +
    'così via fino a 22'],
  ['* 0-29 * * * *', 'ogni secondo durante i minuti da 0 a 29 di ogni ora'],
  ['30 * 9-17 * * *',
    'tutti i giorni, ogni minuto dalle 9:00:30 alle 17:59:30'],
  ['5,15,25 */15 9-17 * * *',
    'tutti i giorni, ogni 15 minuti dalle 9:00 alle 17:45, e in quel ' +
    'minuto ai secondi 5, 15 e 25'],
  ['30 * 0-2,4-23 * * *',
    'tutti i giorni, al secondo 30 di ogni minuto, tranne dalle 3:00:00 ' +
    'alle 3:59:59'],
  ['30 0-28,30-59 * * * *',
    'al secondo 30 di ogni minuto, tranne durante il minuto 29 di ogni ora'],
  ['30 0 0-2,4-23 * * *',
    'tutti i giorni, al secondo 30 del minuto 0 di ogni ora, tranne alle ' +
    '3:00:30'],
  ['30 0-29 9-17 * * *',
    'tutti i giorni, al secondo 30 di ogni minuto dal minuto 0 al 29 di ' +
    'ciascuna ora dalle 9 alle 17 (prima volta alle 9:00:30, ultima alle ' +
    '17:29:30)'],
  ['30 0,5,10,15,20,25,35,40,45,50,55 9 * * *',
    'tutti i giorni, ogni 5 minuti dalle 9:00:30 alle 9:55:30, tranne alle ' +
    '9:30:30'],
  ['*/15 */10 0-2,4-23 * * *',
    'tutti i giorni, ogni 10 minuti, e in quel minuto ai secondi 0, 15, 30 ' +
    'e 45, tranne dalle 3:00:00 alle 3:59:59'],
  ['30 5,20,45 9-17 * * *',
    'tutti i giorni, al secondo 30 dei minuti 5, 20 e 45 di ogni ora, ' +
    'dalle 9:05:30 alle 17:45:30'],
  ['30 */7 9-17 * * *',
    'tutti i giorni, ogni 7 minuti dal minuto 0 al 56 di ciascuna ora ' +
    'dalle 9 alle 17, al secondo 30 (prima volta alle 9:00:30, ultima alle ' +
    '17:56:30)'],

  // «Tutti i giorni» is said whenever the hours are restricted and no day is named, and never of a schedule that runs every hour.
  ['*/5 * * 6 *', 'a giugno, ogni 5 minuti'],
  ['0 */6 * 6 *',
    'a giugno, tutti i giorni alle 0:00, alle 6:00, alle 12:00 e alle 18:00'],
  ['30 * * 6 *', 'a giugno, al minuto 30 di ogni ora'],
  ['0 * * * 1', 'il lunedì, a ogni ora in punto'],
  ['*/5 * * * * 2030', 'nel 2030, ogni 5 minuti', {years: true}],

  // Several fields at once.
  ['*/10 24 */3 23-25 * 1-2',
    'il lunedì e il martedì e in più tutti i giorni dal 23 al 25 di ogni ' +
    'mese, sempre ogni 3 ore dalle 0:24 alle 21:24, ogni volta dal secondo ' +
    '0 al 50, a intervalli di 10 secondi'],
  ['*/30 23 */12 * 6-7 6#2 2030/4',
    'un anno su 4 a partire dal 2030, a giugno e luglio, il secondo sabato ' +
    'del mese alle 0:23:00, alle 0:23:30, alle 12:23:00 e alle 12:23:30'],
  ['0 35 2,15 * * * 2028,2030',
    'nel 2028 e nel 2030, tutti i giorni alle 2:35 e alle 15:35'],
  ['* 30,42 3-10 * 7,9,10,12 1,3,4,5',
    'a luglio, settembre, ottobre e dicembre, dal lunedì al venerdì tranne ' +
    'il martedì, ogni secondo durante i minuti 30 e 42 di ciascuna ora ' +
    'dalle 3 alle 10 (prima volta alle 3:30:00, ultima alle 10:42:59)'],
  ['0 18 15W 3,6,9,12 *',
    'a marzo, giugno, settembre e dicembre, il giorno lavorativo più ' +
    'vicino al 15 del mese (dal lunedì al venerdì, festivi compresi) alle ' +
    '18:00'],
  ['7 4-22/6 1 */2 *',
    'ogni 2 mesi a partire da gennaio, il 1º del mese alle 4:07, alle ' +
    '10:07, alle 16:07 e alle 22:07'],
  // Every second through minutes that are two cadences together: the
  // minutes are said as they are without seconds, and the whole minute
  // follows each. Found after the build: the first of these printed an
  // object and the second said «ogni 2 minuti dalle 9:00:00 alle
  // 9:20:59», which is every 2 minutes, not every second of those minutes.
  ['* 0-20/2,21-59/3 * * * *',
    'ogni 2 minuti dal minuto 0 al 20 e ogni 3 minuti dal minuto 21 al 57 ' +
    'di ogni ora, ogni volta per un minuto intero, secondo per secondo'],
  ['* 0-20/2,21-59/3 9 * * *',
    'tutti i giorni, ogni 2 minuti dalle 9:00 alle 9:20 e ogni 3 minuti ' +
    'dalle 9:21 alle 9:57, ogni volta per un minuto intero, secondo per ' +
    'secondo'],

  // Sets in runs and cadences together, field by field, and a cadence of
  // years less one.
  ['0 0 9 * * * 2030-2036/2,2040',
    'negli anni pari dal 2030 al 2040 tranne nel 2038, tutti i giorni alle ' +
    '9:00'],
  ['0-20/2,21-59/3 9 * * *',
    'tutti i giorni, ogni 2 minuti dalle 9:00 alle 9:20 e ogni 3 minuti ' +
    'dalle 9:21 alle 9:57'],
  ['0-20/2,21-59/3 0 9 * * *',
    'tutti i giorni, ogni 2 secondi dalle 9:00:00 alle 9:00:20 e ogni 3 ' +
    'secondi dalle 9:00:21 alle 9:00:57'],
  ['*/10 5,20 9 * * *',
    'tutti i giorni, ogni 10 secondi dalle 9:05:00 alle 9:05:50 e dalle ' +
    '9:20:00 alle 9:20:50'],

  // Seconds in one minute as a run and a stray; a short list of seconds
  // at two times; a rate of seconds through runs of minutes and a stray
  // minute; two exceptions closing a sentence; a few odd days; odd days
  // beside a run.
  ['0-9,30 0 9 * * *',
    'tutti i giorni, ogni secondo dalle 9:00:00 alle 9:00:09 e una volta ' +
    'alle 9:00:30'],
  ['5,15,25 0 9,17 * * *',
    'tutti i giorni alle 9:00:05, alle 9:00:15, alle 9:00:25, alle ' +
    '17:00:05, alle 17:00:15 e alle 17:00:25'],
  ['* 50-10 * * * *',
    'ogni secondo durante i minuti da 0 a 10 e durante i minuti da 50 a 59 ' +
    'di ogni ora'],
  ['* 0-29,45 * * * *',
    'ogni secondo durante i minuti da 0 a 29 e durante il minuto 45 di ' +
    'ogni ora'],
  ['*/5 0-2,4-23 * 1-11 *',
    'tutti i giorni, ogni 5 minuti, tranne dalle 3:00 alle 3:59 e tranne a ' +
    'dicembre'],
  ['0 0 1-7/2 * *', 'il 1º, il 3, il 5 e il 7 di ogni mese alle 0:00'],
  ['0 0 1-9/2,12-14 * *',
    'nei giorni dispari dal 1º al 9 e tutti i giorni dal 12 al 14 di ogni ' +
    'mese alle 0:00'],

  // A run after a cadence takes its own rate word, or it reads as the
  // cadence going on.
  ['1-9/2,30-40 * * * *',
    'ogni 2 minuti dal minuto 1 al 9 e ogni minuto dal minuto 30 al 40 di ' +
    'ogni ora'],
  ['30 0-20/2,21-59/3 * * * *',
    'ogni 2 minuti dal minuto 0 al 20 e ogni 3 minuti dal minuto 21 al 57 ' +
    'di ogni ora, al secondo 30'],
  ['0 0 9 * * * 2030-2040/2,2041-2045',
    'negli anni pari dal 2030 al 2038 e in tutti gli anni dal 2040 al ' +
    '2045, tutti i giorni alle 9:00'],

  // Written without the star, a day of the month and a weekday are a union
  // (either fires): `1-31/2` is the odd days of the month, as `*/2` is,
  // but the two fields are added, not both required.
  ['*/15 9-17 1-31/2 * 1-5',
    'dal lunedì al venerdì e in più nei giorni dispari di ogni mese, ' +
    'sempre ogni 15 minuti dalle 9:00 alle 17:45'],
  ['*/15 9-17 1-31/5 * 1-5',
    'dal lunedì al venerdì e in più il 1º, il 6, l\'11, il 16, il 21, il 26 ' +
    'e il 31 di ogni mese, sempre ogni 15 minuti dalle 9:00 alle 17:45'],

  // A day field written from a star (`*/2`, `*/5`) and a restricted
  // weekday: both must match. The days of the month, said as they are
  // alone, and the condition that they fall on the weekdays. «Solo se»
  // never joins two sides, so it cannot be heard as the union's «e in più».
  ['0 0 */2 * 1',
    'nei giorni dispari di ogni mese solo se cadono di lunedì, alle 0:00'],
  ['0 9 */2 * 1,3,5',
    'nei giorni dispari di ogni mese solo se cadono di lunedì, di ' +
    'mercoledì o di venerdì, alle 9:00'],
  ['0 0 */5 * 1-5',
    'il 1º, il 6, l\'11, il 16, il 21, il 26 e il 31 di ogni mese solo se ' +
    'cadono tra il lunedì e il venerdì, alle 0:00'],
  ['0 0 15 * */2',
    'il 15 di ogni mese solo se cade di martedì, di giovedì, di sabato o ' +
    'di domenica, alle 0:00'],
  ['0 0 */2 6 1',
    'a giugno, nei giorni dispari del mese solo se cadono di lunedì, ' +
    'alle 0:00'],
  ['0 9 */3 1,7 1-5',
    'a gennaio e luglio, ogni 3 giorni a partire dal 1º del mese solo se ' +
    'cadono tra il lunedì e il venerdì, alle 9:00'],
  ['0 0 */2 * 0-2,4-6',
    'nei giorni dispari di ogni mese solo se non cadono di mercoledì, ' +
    'alle 0:00'],
  ['0 0 0 */2 * 1 2030',
    'nel 2030, nei giorni dispari di ogni mese solo se cadono di lunedì, ' +
    'alle 0:00'],
  ['0 0 */2 * 5L',
    'nei giorni dispari di ogni mese solo se coincidono con l\'ultimo ' +
    'venerdì di ogni mese, alle 0:00'],
  ['0 0 L * */2',
    'l\'ultimo giorno di ogni mese solo se cade di martedì, di giovedì, ' +
    'di sabato o di domenica, alle 0:00'],
  ['0 0 29 * */2',
    'il 29 di ogni mese, che a febbraio c\'è solo negli anni bisestili, ' +
    'solo se cade di martedì, di giovedì, di sabato o di domenica, ' +
    'alle 0:00'],
  // A date side that is every day less a date is said the other way: the
  // weekdays, less that date.
  ['0 0 1-14,16-31 * */2',
    'il martedì, il giovedì, il sabato e la domenica tranne il 15 di ogni ' +
    'mese, alle 0:00'],
  // A date that no reached month has never fires, whatever the weekday.
  ['0 0 31 6 */2', 'mai: la data indicata non esiste'],

  // One second with minutes that are several pieces: the second follows
  // the whole phrase, so it belongs to every piece. Said inside the run
  // («al minuto 5 e al secondo 30 di ogni minuto dal minuto 10 al 20»),
  // the single minutes read as firing on the minute. The builder
  // reported it and it was registered unfixed.
  ['30 5,10-20 * * * *',
    'al minuto 5 e ogni minuto dal minuto 10 al 20 di ogni ora, al secondo ' +
    '30'],
  ['30 10-20,45 * * * *',
    'ogni minuto dal minuto 10 al 20 e una volta al minuto 45 di ogni ora, ' +
    'al secondo 30'],
  ['30 */10,5-9 9 * * *',
    'tutti i giorni, al minuto 0, ogni minuto dal minuto 5 al 10 e poi ai ' +
    'minuti 20, 30, 40 e 50 delle ore 9, al secondo 30'],
  ['30 0-29,45 9-17 * * *',
    'tutti i giorni, ogni minuto dal minuto 0 al 29 e una volta al minuto ' +
    '45 di ciascuna ora dalle 9 alle 17, al secondo 30 (prima volta alle ' +
    '9:00:30, ultima alle 17:45:30)'],
  // A cadence of more than eight hours, where hours are named as numbers
  // after a phrase inside the hour, is not named hour by hour: eight is
  // the most this rule book lists. Its first three hours show the step
  // and «e così via fino a» the last says where it ends; the hours stay
  // numbers, so nothing reads as a stretch of time. A window around a few
  // listed minutes was read as a continuous stretch by a blind reader
  // (answers 4.1 D.6, 4.2).
  ['*/25 */2 31 * *',
    'il 31 dei mesi di 31 giorni, ai minuti 0, 25 e 50 delle ore 0, 2, 4 e ' +
    'così via fino a 22'],
  ['0,25,50 1-23/2 * * *',
    'tutti i giorni, ai minuti 0, 25 e 50 delle ore 1, 3, 5 e così via ' +
    'fino a 23'],
  ['15,45 0-16/2 * * *',
    'tutti i giorni, ai minuti 15 e 45 delle ore 0, 2, 4 e così via fino ' +
    'a 16'],
  ['5,30 */25 */2 31 * *',
    'il 31 dei mesi di 31 giorni, ai secondi 5 e 30 dei minuti 0, 25 e 50 ' +
    'delle ore 0, 2, 4 e così via fino a 22'],
  ['5,30 * */2 * * *',
    'tutti i giorni, ai secondi 5 e 30 di ogni minuto delle ore 0, 2, 4 e ' +
    'così via fino a 22'],
  ['* */25 */2 * * *',
    'tutti i giorni, ogni secondo durante i minuti 0, 25 e 50 delle ore 0, ' +
    '2, 4 e così via fino a 22'],
  ['0-10 */25 */2 * * *',
    'tutti i giorni, ogni secondo dal secondo 0 al 10 dei minuti 0, 25 e ' +
    '50 delle ore 0, 2, 4 e così via fino a 22'],
  ['*/10 */25 */2 * * *',
    'tutti i giorni, ogni 10 secondi dal secondo 0 al 50 dei minuti 0, 25 ' +
    'e 50 delle ore 0, 2, 4 e così via fino a 22'],
  ['0-10 * */2 * * *',
    'tutti i giorni, ogni secondo dal secondo 0 al 10 di ogni minuto delle ' +
    'ore 0, 2, 4 e così via fino a 22'],
  ['0-29,45 */2 * * *',
    'tutti i giorni, ogni minuto dal minuto 0 al 29 e una volta al minuto ' +
    '45 delle ore 0, 2, 4 e così via fino a 22'],
  // A cadence less an hour has no step to show in its first three: it
  // stays listed.
  ['15,45 0,4,6,8,10,12,14,16,18,20,22 * * *',
    'tutti i giorni, ai minuti 15 e 45 delle ore 0, 4, 6, 8, 10, 12, 14, ' +
    '16, 18, 20 e 22'],
  // Eight hours or fewer stay named as numbers.
  ['0,25,50 */3 * * *',
    'tutti i giorni, ai minuti 0, 25 e 50 delle ore 0, 3, 6, 9, 12, 15, 18 ' +
    'e 21'],
  ['15,45 0-14/2 * * *',
    'tutti i giorni, ai minuti 15 e 45 delle ore 0, 2, 4, 6, 8, 10, 12 e ' +
    '14'],
  ['0-10 */25 */4 * * *',
    'tutti i giorni, ogni secondo dal secondo 0 al 10 dei minuti 0, 25 e ' +
    '50 delle ore 0, 4, 8, 12, 16 e 20'],
  ['0-10 * */4 * * *',
    'tutti i giorni, ogni secondo dal secondo 0 al 10 di ogni minuto delle ' +
    'ore 0, 4, 8, 12, 16 e 20']
];

export {rows};
