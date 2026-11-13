// Spanish paradigms held out from a renderer's builder: one row per grid
// pattern at a held-out position. They judge whether a renderer built from
// the answers, the lexicon and the visible rows says what a speaker would.
//
// Written by hand from src/lang/es/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['30 0 9 * * *', 'a las 9:00:30 todos los días'],
  ['0,30 0 9 * * *', 'a las 9:00:00 y 9:00:30 todos los días'],
  ['*/15 0 9 * * *', 'cada 15 segundos de 9:00:00 a 9:00:45 todos los días'],
  ['0-9 0 9 * * *', 'cada segundo de 9:00:00 a 9:00:09 todos los días'],

  // clock / minute
  ['30 9 * * *', 'a las 9:30 todos los días'],
  ['0,30 9 * * *', 'a las 9:00 y 9:30 todos los días'],
  ['0-29 9 * * *', 'cada minuto de 9:00 a 9:29 todos los días'],
  ['0-29,45 9 * * *', 'cada minuto de 9:00 a 9:29 y a las 9:45 todos los días'],
  ['*/7 9 * * *', 'cada 7 minutos de 9:00 a 9:56 todos los días'],
  ['5/15 9 * * *', 'a las 9:05, 9:20, 9:35 y 9:50 todos los días'],
  ['10-40/10 9 * * *', 'a las 9:10, 9:20, 9:30 y 9:40 todos los días'],

  // clock / hour
  ['0 12 * * *', 'a mediodía todos los días'],
  ['0 8,12,18 * * *', 'a las 8:00, 12:00 y 18:00 todos los días'],
  ['0 9-17 * * *', 'cada hora de 9:00 a 17:00 todos los días'],
  ['0 */2 * * *', 'cada 2 horas'],
  ['0 */6 * * *', 'cada 6 horas'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 * * *', 'cada 2 horas excepto a las 8:00'],
  ['0 22-2 * * *', 'cada hora de 22:00 a 2:00 todos los días'],

  // clock / date
  ['0 9 15 * *', 'a las 9:00 el día 15 de cada mes'],
  ['0 9 1,15 * *', 'a las 9:00 los días 1 y 15 de cada mes'],
  ['0 9 1-7 * *', 'a las 9:00 del 1 al 7 de cada mes'],
  ['0 9 1-7,15 * *', 'a las 9:00 del 1 al 7 y el día 15 de cada mes'],
  ['0 9 2/2 * *', 'a las 9:00 los días pares de cada mes'],
  ['0 9 */5 * *', 'a las 9:00 cada 5 días desde el día 1 de cada mes'],
  ['0 9 L * *', 'a las 9:00 el último día del mes'],
  ['0 9 15W * *', 'a las 9:00 el día hábil más cercano al 15 de cada mes'],

  // clock / month
  ['0 9 * 6 *', 'a las 9:00 todos los días en junio'],
  ['0 9 * 1,7 *', 'a las 9:00 todos los días en enero y julio'],
  ['0 9 * 6-8 *', 'a las 9:00 todos los días de junio a agosto'],
  ['0 9 * 6-8,12 *',
    'a las 9:00 todos los días de junio a agosto y en diciembre'],
  ['0 9 * */3 *', 'a las 9:00 todos los días en enero, abril, julio y octubre'],
  ['0 9 * 1-11 *', 'a las 9:00 todos los días excepto en diciembre'],

  // clock / weekday
  ['0 9 * * 0', 'a las 9:00 los domingos'],
  ['0 9 * * 1,3,5', 'a las 9:00 los lunes, miércoles y viernes'],
  ['0 9 * * 0,6', 'a las 9:00 los fines de semana'],
  ['0 9 * * 1-6', 'a las 9:00 todos los días excepto los domingos'],
  ['0 9 * * 5L', 'a las 9:00 el último viernes del mes'],
  ['0 9 * * 1#2', 'a las 9:00 el segundo lunes del mes'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'cada 15 minutos de 9:00:30 a 17:45:30 de lunes a viernes'],
  ['0,30 */15 9-17 * * 1-5',
    'cada 30 segundos durante un minuto cada 15 minutos de 9:00 a 17:45 de ' +
    'lunes a viernes'],
  ['*/15 */15 9-17 * * 1-5',
    'cada 15 segundos durante un minuto cada 15 minutos de 9:00 a 17:45 de ' +
    'lunes a viernes'],
  ['0-9 */15 9-17 * * 1-5',
    'cada segundo durante los primeros 10 segundos cada 15 minutos de 9:00 ' +
    'a 17:45 de lunes a viernes'],

  // window / minute
  ['0 9-17 * * 1-5', 'cada hora de 9:00 a 17:00 de lunes a viernes'],
  ['30 9-17 * * 1-5', 'cada hora de 9:30 a 17:30 de lunes a viernes'],
  ['5,20,45 9-17 * * 1-5',
    'en los minutos 5, 20 y 45 de cada hora de 9:05 a 17:45 de lunes a ' +
    'viernes'],
  ['0-29 9-17 * * 1-5',
    'cada minuto durante los primeros 30 minutos de cada hora de 9:00 a ' +
    '17:29 de lunes a viernes'],
  ['*/7 9-17 * * 1-5',
    'cada 7 minutos del minuto 0 al 56 de cada hora de 9:00 a 17:56 de ' +
    'lunes a viernes'],
  ['5/15 9-17 * * 1-5',
    'en los minutos 5, 20, 35 y 50 de cada hora de 9:05 a 17:50 de lunes a ' +
    'viernes'],
  ['10-40/10 9-17 * * 1-5',
    'en los minutos 10, 20, 30 y 40 de cada hora de 9:10 a 17:40 de lunes ' +
    'a viernes'],

  // window / hour
  ['*/15 0 * * 1-5', 'cada 15 minutos de 0:00 a 0:45 de lunes a viernes'],
  ['*/15 9 * * 1-5', 'cada 15 minutos de 9:00 a 9:45 de lunes a viernes'],
  ['*/15 9,17 * * 1-5',
    'cada 15 minutos de 9:00 a 9:45 y de 17:00 a 17:45 de lunes a viernes'],
  ['*/15 8,12,18 * * 1-5',
    'cada 15 minutos durante las horas 8, 12 y 18 de lunes a viernes'],
  ['*/15 */2 * * 1-5',
    'cada 15 minutos durante las horas pares de lunes a viernes'],
  ['*/15 */6 * * 1-5',
    'cada 15 minutos durante las horas 0, 6, 12 y 18 de lunes a viernes'],
  ['*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5',
    'cada 15 minutos durante las horas pares excepto la hora 8 de lunes a ' +
    'viernes'],
  ['*/15 22-2 * * 1-5',
    'cada 15 minutos de 0:00 a 2:45 y de 22:00 a 23:45 de lunes a viernes'],

  // window / date
  ['*/15 9-17 15 * 1-5',
    'cada 15 minutos de 9:00 a 17:45 el día 15 de cada mes, y también de ' +
    'lunes a viernes'],
  ['*/15 9-17 1,15 * 1-5',
    'cada 15 minutos de 9:00 a 17:45 los días 1 y 15 de cada mes, y ' +
    'también de lunes a viernes'],
  ['*/15 9-17 1-7 * 1-5',
    'cada 15 minutos de 9:00 a 17:45 del 1 al 7 de cada mes, y también de ' +
    'lunes a viernes'],
  ['*/15 9-17 1-7,15 * 1-5',
    'cada 15 minutos de 9:00 a 17:45 del 1 al 7 y el día 15 de cada mes, y ' +
    'también de lunes a viernes'],
  ['*/15 9-17 2/2 * 1-5',
    'cada 15 minutos de 9:00 a 17:45 los días pares de cada mes, y también ' +
    'de lunes a viernes'],
  ['*/15 9-17 */5 * 1-5',
    'cada 15 minutos de 9:00 a 17:45 cada 5 días desde el día 1 de cada ' +
    'mes, y también de lunes a viernes'],
  ['*/15 9-17 L * 1-5',
    'cada 15 minutos de 9:00 a 17:45 el último día del mes, y también de ' +
    'lunes a viernes'],
  ['*/15 9-17 15W * 1-5',
    'cada 15 minutos de 9:00 a 17:45 el día hábil más cercano al 15 de ' +
    'cada mes, y también de lunes a viernes'],

  // window / month
  ['*/15 9-17 * 6 1-5',
    'cada 15 minutos de 9:00 a 17:45 de lunes a viernes en junio'],
  ['*/15 9-17 * 1,7 1-5',
    'cada 15 minutos de 9:00 a 17:45 de lunes a viernes en enero y julio'],
  ['*/15 9-17 * 6-8 1-5',
    'cada 15 minutos de 9:00 a 17:45 de lunes a viernes de junio a agosto'],
  ['*/15 9-17 * 6-8,12 1-5',
    'cada 15 minutos de 9:00 a 17:45 de lunes a viernes de junio a agosto ' +
    'y en diciembre'],
  ['*/15 9-17 * */3 1-5',
    'cada 15 minutos de 9:00 a 17:45 de lunes a viernes en enero, abril, ' +
    'julio y octubre'],
  ['*/15 9-17 * 1-11 1-5',
    'cada 15 minutos de 9:00 a 17:45 de lunes a viernes excepto en ' +
    'diciembre'],

  // window / weekday
  ['*/15 9-17 * * 1', 'cada 15 minutos de 9:00 a 17:45 los lunes'],
  ['*/15 9-17 * * 0', 'cada 15 minutos de 9:00 a 17:45 los domingos'],
  ['*/15 9-17 * * 0,6', 'cada 15 minutos de 9:00 a 17:45 los fines de semana'],
  ['*/15 9-17 * * 1-6',
    'cada 15 minutos de 9:00 a 17:45 todos los días excepto los domingos'],
  ['*/15 9-17 * * 5L',
    'cada 15 minutos de 9:00 a 17:45 el último viernes del mes'],
  ['*/15 9-17 * * 1#2',
    'cada 15 minutos de 9:00 a 17:45 el segundo lunes del mes'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', 'a las 0:00:30 el día 1 de cada mes'],
  ['0,30 0 0 1 * *', 'a las 0:00:00 y 0:00:30 el día 1 de cada mes'],
  ['*/15 0 0 1 * *',
    'cada 15 segundos de 0:00:00 a 0:00:45 el día 1 de cada mes'],
  ['0-9 0 0 1 * *', 'cada segundo de 0:00:00 a 0:00:09 el día 1 de cada mes'],

  // monthly / minute
  ['30 0 1 * *', 'a las 0:30 el día 1 de cada mes'],
  ['0,30 0 1 * *', 'a las 0:00 y 0:30 el día 1 de cada mes'],
  ['0-29 0 1 * *', 'cada minuto de 0:00 a 0:29 el día 1 de cada mes'],
  ['0-29,45 0 1 * *',
    'cada minuto de 0:00 a 0:29 y a las 0:45 el día 1 de cada mes'],
  ['*/7 0 1 * *', 'cada 7 minutos de 0:00 a 0:56 el día 1 de cada mes'],
  ['5/15 0 1 * *', 'a las 0:05, 0:20, 0:35 y 0:50 el día 1 de cada mes'],
  ['10-40/10 0 1 * *', 'a las 0:10, 0:20, 0:30 y 0:40 el día 1 de cada mes'],

  // monthly / hour
  ['0 12 1 * *', 'a mediodía el día 1 de cada mes'],
  ['0 8,12,18 1 * *', 'a las 8:00, 12:00 y 18:00 el día 1 de cada mes'],
  ['0 9-17 1 * *', 'cada hora de 9:00 a 17:00 el día 1 de cada mes'],
  ['0 */2 1 * *', 'cada 2 horas el día 1 de cada mes'],
  ['0 */6 1 * *', 'cada 6 horas el día 1 de cada mes'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * *',
    'cada 2 horas excepto a las 8:00 el día 1 de cada mes'],
  ['0 22-2 1 * *',
    'cada hora de 0:00 a 2:00 y a las 22:00 y 23:00 el día 1 de cada mes'],

  // monthly / date
  ['0 0 15 * *', 'a medianoche el día 15 de cada mes'],
  ['0 0 1,15 * *', 'a medianoche los días 1 y 15 de cada mes'],
  ['0 0 1-7 * *', 'a medianoche del 1 al 7 de cada mes'],
  ['0 0 1-7,15 * *', 'a medianoche del 1 al 7 y el día 15 de cada mes'],
  ['0 0 2/2 * *', 'a medianoche los días pares de cada mes'],
  ['0 0 */5 * *', 'a medianoche cada 5 días desde el día 1 de cada mes'],
  ['0 0 L * *', 'a medianoche el último día del mes'],
  ['0 0 15W * *', 'a medianoche el día hábil más cercano al 15 de cada mes'],

  // monthly / month
  ['0 0 1 6 *', 'a medianoche el 1 de junio'],
  ['0 0 1 1,7 *', 'a medianoche el día 1 de enero y julio'],
  ['0 0 1 6-8 *', 'a medianoche el día 1 de cada mes de junio a agosto'],
  ['0 0 1 6-8,12 *',
    'a medianoche el día 1 de cada mes de junio a agosto y el 1 de ' +
    'diciembre'],
  ['0 0 1 */3 *', 'a medianoche el día 1 de enero, abril, julio y octubre'],
  ['0 0 1 1-11 *', 'a medianoche el día 1 de cada mes excepto en diciembre'],

  // monthly / weekday
  ['0 0 1 * 0', 'a medianoche el día 1 de cada mes, y también los domingos'],
  ['0 0 1 * 1,3,5',
    'a medianoche el día 1 de cada mes, y también los lunes, miércoles y ' +
    'viernes'],
  ['0 0 1 * 0,6',
    'a medianoche el día 1 de cada mes, y también los fines de semana'],
  ['0 0 1 * 1-6',
    'a medianoche el día 1 de cada mes, y también todos los días excepto ' +
    'los domingos'],
  ['0 0 1 * 5L',
    'a medianoche el día 1 de cada mes, y también el último viernes del mes'],
  ['0 0 1 * 1#2',
    'a medianoche el día 1 de cada mes, y también el segundo lunes del mes'],

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
  ['* 12 * * *', 'cada minuto de 12:00 a 12:59 todos los días'],
  ['* 8,12,18 * * *',
    'cada minuto durante las horas 8, 12 y 18 todos los días'],
  ['* 9-17 * * *', 'cada minuto de 9:00 a 17:59 todos los días'],
  ['* */2 * * *', 'cada minuto durante las horas pares'],
  ['* */6 * * *', 'cada minuto durante las horas 0, 6, 12 y 18 todos los días'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'cada minuto durante las horas pares excepto la hora 8'],
  ['* 22-2 * * *', 'cada minuto de 22:00 a 2:59 todos los días'],

  // open / date
  ['* * 15 * *', 'cada minuto el día 15 de cada mes'],
  ['* * 1,15 * *', 'cada minuto los días 1 y 15 de cada mes'],
  ['* * 1-7 * *', 'cada minuto del 1 al 7 de cada mes'],
  ['* * 1-7,15 * *', 'cada minuto del 1 al 7 y el día 15 de cada mes'],
  ['* * 2/2 * *', 'cada minuto los días pares de cada mes'],
  ['* * */5 * *', 'cada minuto cada 5 días desde el día 1 de cada mes'],
  ['* * L * *', 'cada minuto el último día del mes'],
  ['* * 15W * *', 'cada minuto el día hábil más cercano al 15 de cada mes'],

  // open / month
  ['* * * 6 *', 'cada minuto en junio'],
  ['* * * 1,7 *', 'cada minuto en enero y julio'],
  ['* * * 6-8 *', 'cada minuto de junio a agosto'],
  ['* * * 6-8,12 *', 'cada minuto de junio a agosto y en diciembre'],
  ['* * * */3 *', 'cada minuto en enero, abril, julio y octubre'],
  ['* * * 1-11 *', 'cada minuto excepto en diciembre'],

  // open / weekday
  ['* * * * 0', 'cada minuto los domingos'],
  ['* * * * 1,3,5', 'cada minuto los lunes, miércoles y viernes'],
  ['* * * * 0,6', 'cada minuto los fines de semana'],
  ['* * * * 1-6', 'cada minuto todos los días excepto los domingos'],
  ['* * * * 5L', 'cada minuto el último viernes del mes'],
  ['* * * * 1#2', 'cada minuto el segundo lunes del mes']
];

export {rows};
