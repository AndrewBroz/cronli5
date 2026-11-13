// Spanish hard cases: patterns outside the grid that reach rules the
// grid's ladders do not, or where several fields are restricted at once.
// A builder may see these.
//
// Written by hand from src/lang/es/answers.md. Never produced by running a
// renderer.

const rows = [
  // Years.
  ['0 0 1 1 * 2030', 'a medianoche el 1 de enero de 2030', {years: true}],
  ['0 0 0 1 1 * 2030,2035', 'a medianoche el 1 de enero en 2030 y 2035'],
  ['0 0 0 1 1 * 2030-2035', 'a medianoche el 1 de enero de 2030 a 2035'],
  ['0 0 1 1 * */2',
    'a medianoche el 1 de enero en los años pares',
    {years: true}],
  ['30 0 9 1 6 * 2030', 'a las 9:00:30 el 1 de junio de 2030'],
  ['0 0 9 * * * 2030', 'a las 9:00 todos los días en 2030'],
  ['0 0 9 * * * 2028-2031', 'a las 9:00 todos los días de 2028 a 2031'],
  ['0 0 9 * 6 * 2030', 'a las 9:00 todos los días en junio de 2030'],
  ['0 0 9 * 6 1 2030', 'a las 9:00 los lunes en junio de 2030'],
  ['0 0 9 1,15 6 * 2030', 'a las 9:00 los días 1 y 15 de junio de 2030'],
  ['0 0 9 * 6,7 * 2030', 'a las 9:00 todos los días en junio y julio de 2030'],
  ['0 0 9 * 6 * 2030,2031',
    'a las 9:00 todos los días en junio en 2030 y 2031'],
  ['0 0 9 L 6 * 2030', 'a las 9:00 el último día de junio de 2030'],
  ['0 0 9 1 * * 2030', 'a las 9:00 el día 1 de cada mes en 2030'],
  ['0 0 9 * * * 2030/2', 'a las 9:00 todos los días, cada 2 años desde 2030'],
  ['0 0 9 * * * 2028/4', 'a las 9:00 todos los días, cada 4 años desde 2028'],
  ['0 0 0 1 1 * 2028/4', 'a medianoche el 1 de enero, cada 4 años desde 2028'],
  ['0 */5 * * * * 2028/4', 'cada 5 minutos, cada 4 años desde 2028'],
  ['0 0 9 * * * 2030-2040/2',
    'a las 9:00 todos los días, cada 2 años de 2030 a 2040'],
  ['0 */5 * * * * */2', 'cada 5 minutos en los años pares'],
  ['0 0 9 * * * 1971/2', 'a las 9:00 todos los días en los años impares'],
  ['0 0 0 1 1 * 2030-2032,2035',
    'a medianoche el 1 de enero de 2030 a 2032 y en 2035'],

  // Quartz forms.
  ['0 0 1 * ?', 'a medianoche el día 1 de cada mes', {cron: 'quartz'}],
  ['0 0 LW * *', 'a medianoche el último día hábil del mes'],
  ['0 0 L-3 * *', 'a medianoche 3 días antes del último día del mes'],
  ['0 0 L-1 * *', 'a medianoche el penúltimo día del mes'],
  ['0 0 L 6 *', 'a medianoche el último día de junio'],
  ['0 0 15W 6 *', 'a medianoche el día hábil más cercano al 15 de junio'],
  ['0 0 * 6 1#2', 'a medianoche el segundo lunes de junio'],
  ['0 0 * 1,7 5L', 'a medianoche el último viernes de enero y julio'],
  ['0 9 * * 3#1', 'a las 9:00 el primer miércoles del mes'],
  ['0 9 * * 4#3', 'a las 9:00 el tercer jueves del mes'],
  ['0 9 * * 6L', 'a las 9:00 el último sábado del mes'],
  ['0 9 * * 0#4', 'a las 9:00 el cuarto domingo del mes'],

  // Macros, startup, and the three forms.
  ['@hourly', 'cada hora'],
  ['@daily', 'a medianoche todos los días'],
  ['@weekly', 'a medianoche los domingos'],
  ['@monthly', 'a medianoche el día 1 de cada mes'],
  ['@yearly', 'a medianoche el 1 de enero'],
  ['@reboot', 'al iniciar el sistema'],
  ['0 9 * * *', 'Se ejecuta a las 9:00 todos los días.', {form: 'sentence'}],
  ['0 9 * * *', 'A las 9:00 todos los días', {form: 'label'}],
  ['* * * * *', 'Cada minuto', {form: 'label'}],
  ['@reboot', 'Se ejecuta al iniciar el sistema.', {form: 'sentence'}],
  ['not a pattern', 'un patrón cron no reconocido', {lenient: true}],

  // A day of the month and a weekday, under a month.
  ['0 0 1 6 5', 'a medianoche el 1 de junio, y también los viernes en junio'],
  ['0 0 1,15 1,7 1-5',
    'a medianoche los días 1 y 15 de cada mes, y también de lunes a ' +
    'viernes, en enero y julio'],
  ['52 7-16 1,19,23,28 5-7 3-4',
    'cada hora de 7:52 a 16:52 los días 1, 19, 23 y 28 de cada mes, y ' +
    'también los miércoles y jueves, de mayo a julio'],
  ['30 4 1-7 * 1', 'a las 4:30 del 1 al 7 de cada mes, y también los lunes'],

  // A month with its dates.
  ['0 0 1,15 6 *', 'a medianoche los días 1 y 15 de junio'],
  ['0 0 1,10,20 6 *', 'a medianoche los días 1, 10 y 20 de junio'],
  ['0 0 1-7 6 *', 'a medianoche del 1 al 7 de junio'],
  ['0 0 1-7,15 6 *', 'a medianoche del 1 al 7 y el 15 de junio'],
  ['0 0 */2 6 *', 'a medianoche los días impares de junio'],
  ['0 0 */5 6 *', 'a medianoche cada 5 días desde el día 1 en junio'],
  ['0 0 1,15 1,7 *', 'a medianoche los días 1 y 15 de enero y julio'],
  ['59 23 31 12 *', 'a las 23:59 el 31 de diciembre'],
  ['0 0 1-14,16-31 * *', 'a medianoche todos los días del mes excepto el 15'],
  ['0 0 1-14,16-31 6 *', 'a medianoche todos los días de junio excepto el 15'],
  ['0 0 1-14,17-31 * *',
    'a medianoche todos los días del mes excepto el 15 y el 16'],
  ['0 0 1 2/2 *', 'a medianoche el día 1 de los meses pares'],
  ['0 12 1-5,10,20-25 * *',
    'a mediodía del 1 al 5, el día 10 y del 20 al 25 de cada mes'],
  ['0 0 5-20/3 * *', 'a medianoche cada 3 días del 5 al 20 de cada mes'],
  ['0 0 8/2 * *', 'a medianoche cada 2 días desde el día 8 de cada mes'],
  ['0 0 */21 * *', 'a medianoche los días 1 y 22 de cada mes'],
  ['0 9 * 1-3,6,9-11 *',
    'a las 9:00 todos los días de enero a marzo, en junio y de septiembre ' +
    'a noviembre'],
  ['0 0 * 11-2 * 2030',
    'a medianoche todos los días en enero, febrero, noviembre y diciembre ' +
    'de 2030',
    {years: true}],

  // Weekday order, runs and wrap-arounds.
  ['0 9 * * 5-1', 'a las 9:00 de viernes a lunes'],
  ['0 9 * * 2-4', 'a las 9:00 de martes a jueves'],
  ['0 9 * * 0,1', 'a las 9:00 los domingos y lunes'],
  ['0 9 * * 0,5', 'a las 9:00 los viernes y domingos'],
  ['0 9 * * 0,2-4', 'a las 9:00 los martes, miércoles, jueves y domingos'],
  ['0 9 * * 0,2-5', 'a las 9:00 de martes a viernes y los domingos'],
  ['0 9 * * 1,2,3,5', 'a las 9:00 los lunes, martes, miércoles y viernes'],
  ['0 9 * * 0-2,4-6', 'a las 9:00 todos los días excepto los miércoles'],
  ['0 0,1,22,23 * * 1', 'a las 0:00, 1:00, 22:00 y 23:00 los lunes'],

  // Clock times: the list, the article, and what competes with them.
  ['0,30 9,17 * * *', 'a las 9:00, 9:30, 17:00 y 17:30 todos los días'],
  ['5,20 9,17 * * *', 'a las 9:05, 9:20, 17:05 y 17:20 todos los días'],
  ['5,20,45 9,17 * * *',
    'a las 9:05, 9:20, 9:45, 17:05, 17:20 y 17:45 todos los días'],
  ['0 1 * * *', 'a la 1:00 todos los días'],
  ['30 1,13 * * *', 'a la 1:30 y 13:30 todos los días'],
  ['0 9,13 * * *', 'a las 9:00 y 13:00 todos los días'],
  ['30 0 * * *', 'a las 0:30 todos los días'],
  ['30 0 0 * * *', 'a las 0:00:30 todos los días'],
  ['30 12 * * *', 'a las 12:30 todos los días'],
  ['1 * * * *', 'en el minuto 1 de cada hora'],
  ['* 22-23 * * *', 'cada minuto de 22:00 a 23:59 todos los días'],
  ['*/30 0-17 * * 2', 'cada 30 minutos de 0:00 a 17:30 los martes'],
  ['0 0-6,22,23 * * *', 'cada hora de 22:00 a 6:00 todos los días'],
  ['*/15 0-5,22-23 * * *', 'cada 15 minutos de 22:00 a 5:45 todos los días'],

  // What has to be worked out: hour cadences, two hours, exceptions.
  ['0 0,6,12,18 * * *', 'cada 6 horas'],
  ['0 0,6,18 * * *', 'a las 0:00, 6:00 y 18:00 todos los días'],
  ['0 */3 * * *', 'cada 3 horas'],
  ['0 */5 * * *', 'cada 5 horas de 0:00 a 20:00 todos los días'],
  ['30 */2 * * *', 'en el minuto 30 de las horas pares'],
  ['30 */3 * * *', 'en el minuto 30 de las horas 0, 3, 6, 9, 12, 15, 18 y 21'],
  ['30 */5 * * *', 'cada 5 horas de 0:30 a 20:30 todos los días'],
  ['23 */6 * * *', 'a las 0:23, 6:23, 12:23 y 18:23 todos los días'],
  ['23 1/2 * * *', 'en el minuto 23 de las horas impares'],
  ['15,45 */2 * * *', 'en los minutos 15 y 45 de las horas pares'],
  ['15,45 */4 * * *',
    'en los minutos 15 y 45 de las horas 0, 4, 8, 12, 16 y 20'],
  ['23 */12 * * *', 'a las 0:23 y 12:23 todos los días'],
  ['0 1/12 * * *', 'a la 1:00 y 13:00 todos los días'],
  ['*/15 */12 * * *',
    'cada 15 minutos de 0:00 a 0:45 y de 12:00 a 12:45 todos los días'],
  ['0 */12 * * *', 'cada 12 horas'],
  ['0 0/12 * * *', 'cada 12 horas'],
  ['0 0,12 * * *', 'a las 0:00 y 12:00 todos los días'],
  ['0 */12 1 * *', 'cada 12 horas el día 1 de cada mes'],
  ['0 0,12 1 * *', 'a las 0:00 y 12:00 el día 1 de cada mes'],
  ['0 0-2,4-23 * * *', 'cada hora excepto a las 3:00'],
  ['30 0-2,4-23 * * *', 'en el minuto 30 de cada hora excepto a las 3:30'],
  ['5,20,45 0-2,4-23 * * *',
    'en los minutos 5, 20 y 45 de cada hora excepto la hora 3'],
  ['*/10 0-2,4-23 * * *', 'cada 10 minutos excepto durante la hora 3'],
  ['0-28,30-59 * * * *', 'cada minuto excepto en el minuto 29 de cada hora'],
  ['0-28,30-59 9,17 * * *',
    'cada minuto de 9:00 a 9:59 y de 17:00 a 17:59 excepto en el minuto 29 ' +
    'de cada hora todos los días'],
  ['0,10,20,40,50 9-17 * * *',
    'cada 10 minutos de 9:00 a 17:50 excepto en el minuto 30 de cada hora ' +
    'todos los días'],
  ['0,10,20,40,50 9 * * *',
    'cada 10 minutos de 9:00 a 9:50 excepto a las 9:30 todos los días'],
  ['0,10,20,40,50 0-2,4-23 * * *',
    'cada 10 minutos excepto durante la hora 3 y excepto en el minuto 30 ' +
    'de cada hora'],
  ['* 0-28,30-59 * * * *',
    'cada segundo excepto durante el minuto 29 de cada hora'],
  ['* 0-28,30-59 9 * * *',
    'cada segundo de 9:00:00 a 9:59:59 excepto durante el minuto 9:29 ' +
    'todos los días'],
  ['0-28,30-59 * * * * *',
    'cada segundo excepto en el segundo 29 de cada minuto'],
  ['0-28,30-59 0 9 * * *',
    'cada segundo de 9:00:00 a 9:00:59 excepto a las 9:00:29 todos los días'],

  // Hours as a confinement.
  ['*/15 8-18/2 * * *',
    'cada 15 minutos durante las horas 8, 10, 12, 14, 16 y 18 todos los ' +
    'días'],
  ['0 9-17,20,22 * * *',
    'cada hora de 9:00 a 17:00 y a las 20:00 y 22:00 todos los días'],
  ['* 9-17,20,22 * * *',
    'cada minuto de 9:00 a 17:59, de 20:00 a 20:59 y de 22:00 a 22:59 ' +
    'todos los días'],
  ['*/10 6-8,17-19 * * 1-5',
    'cada 10 minutos de 6:00 a 8:50 y de 17:00 a 19:50 de lunes a viernes'],
  ['*/20 */2 */2 */3 *',
    'cada 20 minutos durante las horas pares los días impares de enero, ' +
    'abril, julio y octubre'],
  ['5,20,45 9-17,22 * * *',
    'en los minutos 5, 20 y 45 de cada hora de 9:05 a 17:45 y de 22:05 a ' +
    '22:45 todos los días'],

  // Minutes inside the hour.
  ['50-10 9 * * *',
    'cada minuto de 9:00 a 9:10 y de 9:50 a 9:59 todos los días'],
  ['10-40 9 * * *', 'cada minuto de 9:10 a 9:40 todos los días'],
  ['30-59 9 * * *', 'cada minuto de 9:30 a 9:59 todos los días'],
  ['5-10,20 * * * *',
    'cada minuto del minuto 5 al 10 y en el minuto 20 de cada hora'],
  ['45-59 * * * *', 'cada minuto durante los últimos 15 minutos de cada hora'],
  ['10-40 * * * *', 'cada minuto del minuto 10 al 40 de cada hora'],
  ['0-29 9,17 * * *',
    'cada minuto de 9:00 a 9:29 y de 17:00 a 17:29 todos los días'],
  ['0-1 * * * *', 'en los minutos 0 y 1 de cada hora'],
  ['*/21 * * * *', 'en los minutos 0, 21 y 42 de cada hora'],
  ['9,14,47,56 * * * *', 'en los minutos 9, 14, 47 y 56 de cada hora'],
  ['5/10 * * * *', 'cada 10 minutos del minuto 5 al 55 de cada hora'],

  // Seconds.
  ['15 30 9 * * *', 'a las 9:30:15 todos los días'],
  ['15 30 9,17 * * *', 'a las 9:30:15 y 17:30:15 todos los días'],
  ['15,45 30 9 * * *', 'a las 9:30:15 y 9:30:45 todos los días'],
  ['* * 9 * * *', 'cada segundo de 9:00:00 a 9:59:59 todos los días'],
  ['* * 9-17 * * *', 'cada segundo de 9:00:00 a 17:59:59 todos los días'],
  ['30 0 * * * *', 'en el minuto 0 y segundo 30 de cada hora'],
  ['15 30 * * * *', 'en el minuto 30 y segundo 15 de cada hora'],
  ['0-9 0 * * * *',
    'cada segundo durante los primeros 10 segundos de cada hora'],
  ['* 0 9,17 * * *',
    'cada segundo de 9:00:00 a 9:00:59 y de 17:00:00 a 17:00:59 todos los ' +
    'días'],
  ['*/15 */15 * * * *', 'cada 15 segundos durante un minuto cada 15 minutos'],
  ['30 */15 * * * *', 'en el segundo 30 cada 15 minutos'],
  ['8 5,30 */2 * * *',
    'en el segundo 8 de los minutos 5 y 30 de las horas pares'],
  ['* 0-29 * * * *',
    'cada segundo durante los primeros 30 minutos de cada hora'],
  ['0,20,40 0 9 * * *', 'a las 9:00:00, 9:00:20 y 9:00:40 todos los días'],
  ['10-20 30 9 * * *', 'cada segundo de 9:30:10 a 9:30:20 todos los días'],
  ['5-10/60 0 9 * * *', 'a las 9:00:05 todos los días'],
  ['15 0 */12 * * *', 'a las 0:00:15 y 12:00:15 todos los días'],

  // «Todos los días» fills the level a restricted hour would skip, and is
  // not said of a schedule that runs round the clock.
  ['*/5 * * 6 *', 'cada 5 minutos en junio'],
  ['0 */6 * 6 *', 'cada 6 horas en junio'],
  ['30 * * 6 *', 'en el minuto 30 de cada hora en junio'],
  ['0 * * * 1', 'cada hora los lunes'],
  ['*/5 * * * * 2030', 'cada 5 minutos en 2030', {years: true}],

  // Several fields at once.
  ['*/10 24 */3 23-25 * 1-2',
    'cada 10 segundos durante un minuto en el minuto 24 de las horas 0, 3, ' +
    '6, 9, 12, 15, 18 y 21 del 23 al 25 de cada mes, y también los lunes y ' +
    'martes'],
  ['*/30 23 */12 * 6-7 6#2 2030/4',
    'a las 0:23:00, 0:23:30, 12:23:00 y 12:23:30 el segundo sábado de ' +
    'junio y julio, cada 4 años desde 2030'],
  ['0 35 2,15 * * * 2028,2030',
    'a las 2:35 y 15:35 todos los días en 2028 y 2030'],
  ['* 30,42 3-10 * 7,9,10,12 1,3,4,5',
    'cada segundo durante un minuto en los minutos 30 y 42 de cada hora de ' +
    '3:30 a 10:42 los lunes, miércoles, jueves y viernes en julio, ' +
    'septiembre, octubre y diciembre'],
  ['0 18 15W 3,6,9,12 *',
    'a las 18:00 el día hábil más cercano al 15 de marzo, junio, ' +
    'septiembre y diciembre'],
  ['7 4-22/6 1 */2 *',
    'a las 4:07, 10:07, 16:07 y 22:07 el día 1 de los meses impares']
];

export {rows};
