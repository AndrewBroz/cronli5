// Spanish paradigms held out from a renderer's builder: one row per grid
// pattern at a held-out position. They judge whether a renderer built from
// the answers, the lexicon and the visible rows says what a speaker would.
//
// Written by hand from src/lang/es/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['30 0 9 * * *', 'todos los días a las 9:00:30'],
  ['0,30 0 9 * * *', 'todos los días a las 9:00:00 y 9:00:30'],
  ['*/15 0 9 * * *',
    'todos los días a las 9:00:00, 9:00:15, 9:00:30 y 9:00:45'],
  ['0-9 0 9 * * *',
    'todos los días a las 9:00, una vez por segundo durante los primeros ' +
    '10 segundos'],

  // clock / minute
  ['30 9 * * *', 'todos los días a las 9:30'],
  ['0,30 9 * * *', 'todos los días a las 9:00 y 9:30'],
  ['0-29 9 * * *', 'todos los días, cada minuto de 9:00 a 9:29'],
  ['0-29,45 9 * * *',
    'todos los días, cada minuto de 9:00 a 9:29 y a las 9:45'],
  ['*/7 9 * * *', 'todos los días, cada 7 minutos de 9:00 a 9:56'],
  ['5/15 9 * * *', 'todos los días, cada 15 minutos de 9:05 a 9:50'],
  ['10-40/10 9 * * *', 'todos los días, cada 10 minutos de 9:10 a 9:40'],

  // clock / hour
  ['0 12 * * *', 'todos los días a las 12:00'],
  ['0 8,12,18 * * *', 'todos los días a las 8:00, 12:00 y 18:00'],
  ['0 9-17 * * *', 'todos los días, cada hora de 9:00 a 17:00'],
  ['0 */2 * * *', 'todos los días, cada 2 horas de 0:00 a 22:00'],
  ['0 */6 * * *', 'todos los días a las 0:00, 6:00, 12:00 y 18:00'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'todos los días, cada 2 horas de 0:00 a 22:00, excepto a las 8:00'],
  ['0 22-2 * * *', 'todos los días, cada hora de 22:00 a 2:00'],

  // clock / date
  ['0 9 15 * *', 'el día 15 de cada mes a las 9:00'],
  ['0 9 1,15 * *', 'los días 1 y 15 de cada mes a las 9:00'],
  ['0 9 1-7 * *', 'del 1 al 7 de cada mes a las 9:00'],
  ['0 9 1-7,15 * *', 'del 1 al 7 y el día 15 de cada mes a las 9:00'],
  ['0 9 2/2 * *', 'los días pares de cada mes a las 9:00'],
  ['0 9 */5 * *', 'los días 1, 6, 11, 16, 21, 26 y 31 de cada mes a las 9:00'],
  ['0 9 L * *', 'el último día de cada mes a las 9:00'],
  ['0 9 15W * *', 'el día laborable más cercano al 15 de cada mes a las 9:00'],

  // clock / month
  ['0 9 * 6 *', 'en junio, todos los días a las 9:00'],
  ['0 9 * 1,7 *', 'en enero y julio, todos los días a las 9:00'],
  ['0 9 * 6-8 *', 'de junio a agosto, todos los días a las 9:00'],
  ['0 9 * 6-8,12 *',
    'de junio a agosto y en diciembre, todos los días a las 9:00'],
  ['0 9 * */3 *',
    'en enero, abril, julio y octubre, todos los días a las 9:00'],
  ['0 9 * 1-11 *', 'de enero a noviembre, todos los días a las 9:00'],

  // clock / weekday
  ['0 9 * * 0', 'los domingos a las 9:00'],
  ['0 9 * * 1,3,5', 'los lunes, miércoles y viernes a las 9:00'],
  ['0 9 * * 0,6', 'los fines de semana a las 9:00'],
  ['0 9 * * 1-6', 'de lunes a sábado a las 9:00'],
  ['0 9 * * 5L', 'el último viernes de cada mes a las 9:00'],
  ['0 9 * * 1#2', 'el segundo lunes de cada mes a las 9:00'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, en el segundo 30'],
  ['0,30 */15 9-17 * * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, en los segundos ' +
    '0 y 30'],
  ['*/15 */15 9-17 * * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, en los segundos ' +
    '0, 15, 30 y 45'],
  ['0-9 */15 9-17 * * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y en cada ' +
    'ocasión una vez por segundo durante los primeros 10 segundos'],

  // window / minute
  ['0 9-17 * * 1-5', 'de lunes a viernes, cada hora de 9:00 a 17:00'],
  ['30 9-17 * * 1-5', 'de lunes a viernes, cada hora de 9:30 a 17:30'],
  ['5,20,45 9-17 * * 1-5',
    'de lunes a viernes, en los minutos 5, 20 y 45 de cada hora, de 9:05 a ' +
    '17:45'],
  ['0-29 9-17 * * 1-5',
    'de lunes a viernes, cada minuto durante los primeros 30 minutos de ' +
    'cada hora, de 9:00 a 17:29'],
  ['*/7 9-17 * * 1-5',
    'de lunes a viernes, cada 7 minutos del minuto 0 al 56 de cada hora, ' +
    'de 9:00 a 17:56'],
  ['5/15 9-17 * * 1-5',
    'de lunes a viernes, en los minutos 5, 20, 35 y 50 de cada hora, de ' +
    '9:05 a 17:50'],
  ['10-40/10 9-17 * * 1-5',
    'de lunes a viernes, en los minutos 10, 20, 30 y 40 de cada hora, de ' +
    '9:10 a 17:40'],

  // window / hour
  ['*/15 0 * * 1-5', 'de lunes a viernes, cada 15 minutos de 0:00 a 0:45'],
  ['*/15 9 * * 1-5', 'de lunes a viernes, cada 15 minutos de 9:00 a 9:45'],
  ['*/15 9,17 * * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 9:45 y de 17:00 a 17:45'],
  ['*/15 8,12,18 * * 1-5',
    'de lunes a viernes, cada 15 minutos de 8:00 a 8:45, de 12:00 a 12:45 ' +
    'y de 18:00 a 18:45'],
  ['*/15 */2 * * 1-5',
    'de lunes a viernes, cada 15 minutos durante una hora cada 2 horas (de ' +
    '0:00 a 0:45, de 2:00 a 2:45… hasta las 22:45)'],
  ['*/15 */6 * * 1-5',
    'de lunes a viernes, cada 15 minutos de 0:00 a 0:45, de 6:00 a 6:45, ' +
    'de 12:00 a 12:45 y de 18:00 a 18:45'],
  ['*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5',
    'de lunes a viernes, cada 15 minutos durante una hora cada 2 horas (de ' +
    '0:00 a 0:45, de 2:00 a 2:45… hasta las 22:45), excepto de 8:00 a 8:45'],
  ['*/15 22-2 * * 1-5',
    'de lunes a viernes, cada 15 minutos de 0:00 a 2:45 y de 22:00 a 23:45'],

  // window / date
  ['*/15 9-17 15 * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además el día ' +
    '15 de cada mes'],
  ['*/15 9-17 1,15 * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además los ' +
    'días 1 y 15 de cada mes'],
  ['*/15 9-17 1-7 * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además del 1 ' +
    'al 7 de cada mes'],
  ['*/15 9-17 1-7,15 * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además del 1 ' +
    'al 7 y el día 15 de cada mes'],
  ['*/15 9-17 2/2 * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además los ' +
    'días pares de cada mes'],
  ['*/15 9-17 */5 * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además los ' +
    'días 1, 6, 11, 16, 21, 26 y 31 de cada mes'],
  ['*/15 9-17 L * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además el ' +
    'último día de cada mes'],
  ['*/15 9-17 15W * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además el día ' +
    'laborable más cercano al 15 de cada mes'],

  // window / month
  ['*/15 9-17 * 6 1-5',
    'en junio, de lunes a viernes, cada 15 minutos de 9:00 a 17:45'],
  ['*/15 9-17 * 1,7 1-5',
    'en enero y julio, de lunes a viernes, cada 15 minutos de 9:00 a 17:45'],
  ['*/15 9-17 * 6-8 1-5',
    'de junio a agosto, de lunes a viernes, cada 15 minutos de 9:00 a 17:45'],
  ['*/15 9-17 * 6-8,12 1-5',
    'de junio a agosto y en diciembre, de lunes a viernes, cada 15 minutos ' +
    'de 9:00 a 17:45'],
  ['*/15 9-17 * */3 1-5',
    'en enero, abril, julio y octubre, de lunes a viernes, cada 15 minutos ' +
    'de 9:00 a 17:45'],
  ['*/15 9-17 * 1-11 1-5',
    'de enero a noviembre, de lunes a viernes, cada 15 minutos de 9:00 a ' +
    '17:45'],

  // window / weekday
  ['*/15 9-17 * * 1', 'los lunes, cada 15 minutos de 9:00 a 17:45'],
  ['*/15 9-17 * * 0', 'los domingos, cada 15 minutos de 9:00 a 17:45'],
  ['*/15 9-17 * * 0,6', 'los fines de semana, cada 15 minutos de 9:00 a 17:45'],
  ['*/15 9-17 * * 1-6', 'de lunes a sábado, cada 15 minutos de 9:00 a 17:45'],
  ['*/15 9-17 * * 5L',
    'el último viernes de cada mes, cada 15 minutos de 9:00 a 17:45'],
  ['*/15 9-17 * * 1#2',
    'el segundo lunes de cada mes, cada 15 minutos de 9:00 a 17:45'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', 'el día 1 de cada mes a las 0:00:30'],
  ['0,30 0 0 1 * *', 'el día 1 de cada mes a las 0:00:00 y 0:00:30'],
  ['*/15 0 0 1 * *',
    'el día 1 de cada mes a las 0:00:00, 0:00:15, 0:00:30 y 0:00:45'],
  ['0-9 0 0 1 * *',
    'el día 1 de cada mes a las 0:00, una vez por segundo durante los ' +
    'primeros 10 segundos'],

  // monthly / minute
  ['30 0 1 * *', 'el día 1 de cada mes a las 0:30'],
  ['0,30 0 1 * *', 'el día 1 de cada mes a las 0:00 y 0:30'],
  ['0-29 0 1 * *', 'el día 1 de cada mes, cada minuto de 0:00 a 0:29'],
  ['0-29,45 0 1 * *',
    'el día 1 de cada mes, cada minuto de 0:00 a 0:29 y a las 0:45'],
  ['*/7 0 1 * *', 'el día 1 de cada mes, cada 7 minutos de 0:00 a 0:56'],
  ['5/15 0 1 * *', 'el día 1 de cada mes, cada 15 minutos de 0:05 a 0:50'],
  ['10-40/10 0 1 * *', 'el día 1 de cada mes, cada 10 minutos de 0:10 a 0:40'],

  // monthly / hour
  ['0 12 1 * *', 'el día 1 de cada mes a las 12:00'],
  ['0 8,12,18 1 * *', 'el día 1 de cada mes a las 8:00, 12:00 y 18:00'],
  ['0 9-17 1 * *', 'el día 1 de cada mes, cada hora de 9:00 a 17:00'],
  ['0 */2 1 * *', 'el día 1 de cada mes, cada 2 horas de 0:00 a 22:00'],
  ['0 */6 1 * *', 'el día 1 de cada mes a las 0:00, 6:00, 12:00 y 18:00'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * *',
    'el día 1 de cada mes, cada 2 horas de 0:00 a 22:00, excepto a las 8:00'],
  ['0 22-2 1 * *',
    'el día 1 de cada mes, cada hora de 0:00 a 2:00 y a las 22:00 y 23:00'],

  // monthly / date
  ['0 0 15 * *', 'el día 15 de cada mes a las 0:00'],
  ['0 0 1,15 * *', 'los días 1 y 15 de cada mes a las 0:00'],
  ['0 0 1-7 * *', 'del 1 al 7 de cada mes a las 0:00'],
  ['0 0 1-7,15 * *', 'del 1 al 7 y el día 15 de cada mes a las 0:00'],
  ['0 0 2/2 * *', 'los días pares de cada mes a las 0:00'],
  ['0 0 */5 * *', 'los días 1, 6, 11, 16, 21, 26 y 31 de cada mes a las 0:00'],
  ['0 0 L * *', 'el último día de cada mes a las 0:00'],
  ['0 0 15W * *', 'el día laborable más cercano al 15 de cada mes a las 0:00'],

  // monthly / month
  ['0 0 1 6 *', 'el 1 de junio a las 0:00'],
  ['0 0 1 1,7 *', 'el día 1 de enero y julio a las 0:00'],
  ['0 0 1 6-8 *', 'de junio a agosto, el día 1 de cada mes a las 0:00'],
  ['0 0 1 6-8,12 *',
    'de junio a agosto y en diciembre, el día 1 de cada mes a las 0:00'],
  ['0 0 1 */3 *', 'el día 1 de enero, abril, julio y octubre a las 0:00'],
  ['0 0 1 1-11 *', 'de enero a noviembre, el día 1 de cada mes a las 0:00'],

  // monthly / weekday
  ['0 0 1 * 0', 'los domingos a las 0:00, y además el día 1 de cada mes'],
  ['0 0 1 * 1,3,5',
    'los lunes, miércoles y viernes a las 0:00, y además el día 1 de cada ' +
    'mes'],
  ['0 0 1 * 0,6',
    'los fines de semana a las 0:00, y además el día 1 de cada mes'],
  ['0 0 1 * 1-6',
    'de lunes a sábado a las 0:00, y además el día 1 de cada mes'],
  ['0 0 1 * 5L',
    'el último viernes de cada mes a las 0:00, y además el día 1 de cada ' +
    'mes'],
  ['0 0 1 * 1#2',
    'el segundo lunes de cada mes a las 0:00, y además el día 1 de cada mes'],

  // open / second — context `* * * * *`
  ['30 * * * * *', 'en el segundo 30 de cada minuto'],
  ['0,30 * * * * *', 'cada 30 segundos'],
  ['*/15 * * * * *', 'cada 15 segundos'],
  ['0-9 * * * * *',
    'cada segundo durante los primeros 10 segundos de cada minuto'],

  // open / minute
  ['30 * * * *', 'en el minuto 30 de cada hora'],
  ['0,30 * * * *', 'cada 30 minutos'],
  ['0-29 * * * *', 'cada minuto durante los primeros 30 minutos de cada hora'],
  ['0-29,45 * * * *',
    'cada minuto durante los primeros 30 minutos y en el minuto 45 de cada ' +
    'hora'],
  ['*/7 * * * *', 'cada 7 minutos del minuto 0 al 56 de cada hora'],
  ['5/15 * * * *', 'en los minutos 5, 20, 35 y 50 de cada hora'],
  ['10-40/10 * * * *', 'en los minutos 10, 20, 30 y 40 de cada hora'],

  // open / hour
  ['* 12 * * *', 'todos los días, cada minuto de 12:00 a 12:59'],
  ['* 8,12,18 * * *',
    'todos los días, cada minuto de 8:00 a 8:59, de 12:00 a 12:59 y de ' +
    '18:00 a 18:59'],
  ['* 9-17 * * *', 'todos los días, cada minuto de 9:00 a 17:59'],
  ['* */2 * * *',
    'todos los días, cada minuto durante una hora cada 2 horas (de 0:00 a ' +
    '0:59, de 2:00 a 2:59… hasta las 22:59)'],
  ['* */6 * * *',
    'todos los días, cada minuto de 0:00 a 0:59, de 6:00 a 6:59, de 12:00 ' +
    'a 12:59 y de 18:00 a 18:59'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'todos los días, cada minuto durante una hora cada 2 horas (de 0:00 a ' +
    '0:59, de 2:00 a 2:59… hasta las 22:59), excepto de 8:00 a 8:59'],
  ['* 22-2 * * *', 'todos los días, cada minuto de 22:00 a 2:59'],

  // open / date
  ['* * 15 * *', 'el día 15 de cada mes, cada minuto'],
  ['* * 1,15 * *', 'los días 1 y 15 de cada mes, cada minuto'],
  ['* * 1-7 * *', 'del 1 al 7 de cada mes, cada minuto'],
  ['* * 1-7,15 * *', 'del 1 al 7 y el día 15 de cada mes, cada minuto'],
  ['* * 2/2 * *', 'los días pares de cada mes, cada minuto'],
  ['* * */5 * *',
    'los días 1, 6, 11, 16, 21, 26 y 31 de cada mes, cada minuto'],
  ['* * L * *', 'el último día de cada mes, cada minuto'],
  ['* * 15W * *',
    'el día laborable más cercano al 15 de cada mes, cada minuto'],

  // open / month
  ['* * * 6 *', 'en junio, cada minuto'],
  ['* * * 1,7 *', 'en enero y julio, cada minuto'],
  ['* * * 6-8 *', 'de junio a agosto, cada minuto'],
  ['* * * 6-8,12 *', 'de junio a agosto y en diciembre, cada minuto'],
  ['* * * */3 *', 'en enero, abril, julio y octubre, cada minuto'],
  ['* * * 1-11 *', 'de enero a noviembre, cada minuto'],

  // open / weekday
  ['* * * * 0', 'los domingos, cada minuto'],
  ['* * * * 1,3,5', 'los lunes, miércoles y viernes, cada minuto'],
  ['* * * * 0,6', 'los fines de semana, cada minuto'],
  ['* * * * 1-6', 'de lunes a sábado, cada minuto'],
  ['* * * * 5L', 'el último viernes de cada mes, cada minuto'],
  ['* * * * 1#2', 'el segundo lunes de cada mes, cada minuto']
];

export {rows};
