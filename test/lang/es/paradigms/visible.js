// Spanish paradigms a renderer's builder may see: one row per grid
// pattern at a visible position.
//
// Written by hand from src/lang/es/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *', 'cada segundo de 9:00:00 a 9:00:59 todos los días'],
  ['*/6 0 9 * * *', 'cada 6 segundos de 9:00:00 a 9:00:54 todos los días'],
  ['5/10 0 9 * * *', 'cada 10 segundos de 9:00:05 a 9:00:55 todos los días'],

  // clock / minute
  ['* 9 * * *', 'cada minuto de 9:00 a 9:59 todos los días'],
  ['5,20,45 9 * * *', 'a las 9:05, 9:20 y 9:45 todos los días'],
  ['*/15 9 * * *', 'cada 15 minutos de 9:00 a 9:45 todos los días'],
  ['0,15,45 9 * * *', 'a las 9:00, 9:15 y 9:45 todos los días'],

  // clock / hour
  ['0 * * * *', 'cada hora'],
  ['0 9,17 * * *', 'a las 9:00 y 17:00 todos los días'],
  ['0 9-17,22 * * *', 'cada hora de 9:00 a 17:00 y a las 22:00 todos los días'],
  ['0 1/2 * * *', 'cada 2 horas de 1:00 a 23:00 todos los días'],

  // clock / date
  ['0 9 1 * *', 'a las 9:00 el día 1 de cada mes'],
  ['0 9 1,10,20 * *', 'a las 9:00 los días 1, 10 y 20 de cada mes'],
  ['0 9 */2 * *', 'a las 9:00 los días impares de cada mes'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'a las 9:00 los días impares de cada mes, excepto el 15'],

  // clock / month
  ['0 9 * 1 *', 'a las 9:00 todos los días en enero'],
  ['0 9 * 3,6,9,12 *',
    'a las 9:00 todos los días en marzo, junio, septiembre y diciembre'],
  ['0 9 * */2 *', 'a las 9:00 todos los días en los meses impares'],
  ['0 9 * 11-2 *', 'a las 9:00 todos los días de noviembre a febrero'],

  // clock / weekday
  ['0 9 * * 1', 'a las 9:00 los lunes'],
  ['0 9 * * 1-5', 'a las 9:00 de lunes a viernes'],
  ['0 9 * * 2,4', 'a las 9:00 los martes y jueves'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'cada segundo durante un minuto cada 15 minutos de 9:00:00 a 17:45:59 ' +
    'de lunes a viernes'],
  ['*/6 */15 9-17 * * 1-5',
    'cada 6 segundos durante un minuto cada 15 minutos de 9:00:00 a ' +
    '17:45:54 de lunes a viernes'],
  ['5/10 */15 9-17 * * 1-5',
    'cada 10 segundos del segundo 5 al 55 cada 15 minutos de 9:00 a 17:45 ' +
    'de lunes a viernes'],

  // window / minute
  ['* 9-17 * * 1-5', 'cada minuto de 9:00 a 17:59 de lunes a viernes'],
  ['0,30 9-17 * * 1-5', 'cada 30 minutos de 9:00 a 17:30 de lunes a viernes'],
  ['0-29,45 9-17 * * 1-5',
    'cada minuto durante los primeros 30 minutos y en el minuto 45 de cada ' +
    'hora de 9:00 a 17:45 de lunes a viernes'],
  ['0,15,45 9-17 * * 1-5',
    'en los minutos 0, 15 y 45 de cada hora de 9:00 a 17:45 de lunes a ' +
    'viernes'],

  // window / hour
  ['*/15 * * * 1-5', 'cada 15 minutos de lunes a viernes'],
  ['*/15 12 * * 1-5', 'cada 15 minutos de 12:00 a 12:45 de lunes a viernes'],
  ['*/15 9-17,22 * * 1-5',
    'cada 15 minutos de 9:00 a 17:45 y de 22:00 a 22:45 de lunes a viernes'],
  ['*/15 1/2 * * 1-5',
    'cada 15 minutos durante las horas impares de lunes a viernes'],

  // window / date
  ['*/15 9-17 1 * 1-5',
    'cada 15 minutos de 9:00 a 17:45 el día 1 de cada mes, y también de ' +
    'lunes a viernes'],
  ['*/15 9-17 1,10,20 * 1-5',
    'cada 15 minutos de 9:00 a 17:45 los días 1, 10 y 20 de cada mes, y ' +
    'también de lunes a viernes'],
  ['*/15 9-17 */2 * 1-5',
    'cada 15 minutos de 9:00 a 17:45 los días impares de cada mes, y ' +
    'también de lunes a viernes'],
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'cada 15 minutos de 9:00 a 17:45 los días impares de cada mes, excepto ' +
    'el 15, y también de lunes a viernes'],

  // window / month
  ['*/15 9-17 * 1 1-5',
    'cada 15 minutos de 9:00 a 17:45 de lunes a viernes en enero'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'cada 15 minutos de 9:00 a 17:45 de lunes a viernes en marzo, junio, ' +
    'septiembre y diciembre'],
  ['*/15 9-17 * */2 1-5',
    'cada 15 minutos de 9:00 a 17:45 de lunes a viernes en los meses ' +
    'impares'],
  ['*/15 9-17 * 11-2 1-5',
    'cada 15 minutos de 9:00 a 17:45 de lunes a viernes de noviembre a ' +
    'febrero'],

  // window / weekday
  ['*/15 9-17 * * *', 'cada 15 minutos de 9:00 a 17:45 todos los días'],
  ['*/15 9-17 * * 1,3,5',
    'cada 15 minutos de 9:00 a 17:45 los lunes, miércoles y viernes'],
  ['*/15 9-17 * * 2,4', 'cada 15 minutos de 9:00 a 17:45 los martes y jueves'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *', 'cada segundo de 0:00:00 a 0:00:59 el día 1 de cada mes'],
  ['*/6 0 0 1 * *',
    'cada 6 segundos de 0:00:00 a 0:00:54 el día 1 de cada mes'],
  ['5/10 0 0 1 * *',
    'cada 10 segundos de 0:00:05 a 0:00:55 el día 1 de cada mes'],

  // monthly / minute
  ['* 0 1 * *', 'cada minuto de 0:00 a 0:59 el día 1 de cada mes'],
  ['5,20,45 0 1 * *', 'a las 0:05, 0:20 y 0:45 el día 1 de cada mes'],
  ['*/15 0 1 * *', 'cada 15 minutos de 0:00 a 0:45 el día 1 de cada mes'],
  ['0,15,45 0 1 * *', 'a las 0:00, 0:15 y 0:45 el día 1 de cada mes'],

  // monthly / hour
  ['0 * 1 * *', 'cada hora el día 1 de cada mes'],
  ['0 9,17 1 * *', 'a las 9:00 y 17:00 el día 1 de cada mes'],
  ['0 9-17,22 1 * *',
    'cada hora de 9:00 a 17:00 y a las 22:00 el día 1 de cada mes'],
  ['0 1/2 1 * *', 'cada 2 horas de 1:00 a 23:00 el día 1 de cada mes'],

  // monthly / date
  ['0 0 * * *', 'a las 0:00 todos los días'],
  ['0 0 1,10,20 * *', 'a las 0:00 los días 1, 10 y 20 de cada mes'],
  ['0 0 */2 * *', 'a las 0:00 los días impares de cada mes'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'a las 0:00 los días impares de cada mes, excepto el 15'],

  // monthly / month
  ['0 0 1 1 *', 'a las 0:00 el 1 de enero'],
  ['0 0 1 3,6,9,12 *',
    'a las 0:00 el día 1 de marzo, junio, septiembre y diciembre'],
  ['0 0 1 */2 *', 'a las 0:00 el día 1 de los meses impares'],
  ['0 0 1 11-2 *', 'a las 0:00 el día 1 de cada mes de noviembre a febrero'],

  // monthly / weekday
  ['0 0 1 * 1', 'a las 0:00 el día 1 de cada mes, y también los lunes'],
  ['0 0 1 * 1-5',
    'a las 0:00 el día 1 de cada mes, y también de lunes a viernes'],
  ['0 0 1 * 2,4',
    'a las 0:00 el día 1 de cada mes, y también los martes y jueves'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'cada segundo'],
  ['*/6 * * * * *', 'cada 6 segundos'],
  ['5/10 * * * * *', 'cada 10 segundos del segundo 5 al 55 de cada minuto'],

  // open / minute
  ['5,20,45 * * * *', 'en los minutos 5, 20 y 45 de cada hora'],
  ['*/15 * * * *', 'cada 15 minutos'],
  ['0,15,45 * * * *', 'en los minutos 0, 15 y 45 de cada hora'],

  // open / hour
  ['* 0 * * *', 'cada minuto de 0:00 a 0:59 todos los días'],
  ['* 9,17 * * *',
    'cada minuto de 9:00 a 9:59 y de 17:00 a 17:59 todos los días'],
  ['* 9-17,22 * * *',
    'cada minuto de 9:00 a 17:59 y de 22:00 a 22:59 todos los días'],
  ['* 1/2 * * *', 'cada minuto durante las horas impares'],

  // open / date
  ['* * 1 * *', 'cada minuto el día 1 de cada mes'],
  ['* * 1,10,20 * *', 'cada minuto los días 1, 10 y 20 de cada mes'],
  ['* * */2 * *', 'cada minuto los días impares de cada mes'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'cada minuto los días impares de cada mes, excepto el 15'],

  // open / month
  ['* * * 1 *', 'cada minuto en enero'],
  ['* * * 3,6,9,12 *', 'cada minuto en marzo, junio, septiembre y diciembre'],
  ['* * * */2 *', 'cada minuto en los meses impares'],
  ['* * * 11-2 *', 'cada minuto de noviembre a febrero'],

  // open / weekday
  ['* * * * 1', 'cada minuto los lunes'],
  ['* * * * 1-5', 'cada minuto de lunes a viernes'],
  ['* * * * 2,4', 'cada minuto los martes y jueves']
];

export {rows};
