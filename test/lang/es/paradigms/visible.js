// Spanish paradigms a renderer's builder may see: one row per grid
// pattern at a visible position.
//
// Written by hand from src/lang/es/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *',
    'todos los días a las 9:00, una vez por segundo durante todo ese minuto'],
  ['*/6 0 9 * * *',
    'todos los días a las 9:00, una vez cada 6 segundos durante todo ese ' +
    'minuto'],
  ['5/10 0 9 * * *',
    'todos los días a las 9:00, en los segundos 5, 15, 25, 35, 45 y 55'],

  // clock / minute
  ['* 9 * * *', 'todos los días, cada minuto de 9:00 a 9:59'],
  ['5,20,45 9 * * *', 'todos los días a las 9:05, 9:20 y 9:45'],
  ['*/15 9 * * *', 'todos los días, cada 15 minutos de 9:00 a 9:45'],
  ['0,15,45 9 * * *', 'todos los días a las 9:00, 9:15 y 9:45'],

  // clock / hour
  ['0 * * * *', 'cada hora en punto'],
  ['0 9,17 * * *', 'todos los días a las 9:00 y 17:00'],
  ['0 9-17,22 * * *',
    'todos los días, cada hora de 9:00 a 17:00 y a las 22:00'],
  ['0 1/2 * * *', 'todos los días, cada 2 horas de 1:00 a 23:00'],

  // clock / date
  ['0 9 1 * *', 'el día 1 de cada mes a las 9:00'],
  ['0 9 1,10,20 * *', 'los días 1, 10 y 20 de cada mes a las 9:00'],
  ['0 9 */2 * *', 'los días impares de cada mes a las 9:00'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'los días impares de cada mes, excepto el día 15, a las 9:00'],

  // clock / month
  ['0 9 * 1 *', 'en enero, todos los días a las 9:00'],
  ['0 9 * 3,6,9,12 *',
    'en marzo, junio, septiembre y diciembre, todos los días a las 9:00'],
  ['0 9 * */2 *',
    'en enero, marzo, mayo, julio, septiembre y noviembre, todos los días ' +
    'a las 9:00'],
  ['0 9 * 11-2 *', 'de noviembre a febrero, todos los días a las 9:00'],

  // clock / weekday
  ['0 9 * * 1', 'los lunes a las 9:00'],
  ['0 9 * * 1-5', 'de lunes a viernes a las 9:00'],
  ['0 9 * * 2,4', 'los martes y jueves a las 9:00'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y en cada ' +
    'ocasión una vez por segundo durante todo ese minuto'],
  ['*/6 */15 9-17 * * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y en cada ' +
    'ocasión una vez cada 6 segundos durante todo ese minuto'],
  ['5/10 */15 9-17 * * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, en los segundos ' +
    '5, 15, 25, 35, 45 y 55'],

  // window / minute
  ['* 9-17 * * 1-5', 'de lunes a viernes, cada minuto de 9:00 a 17:59'],
  ['0,30 9-17 * * 1-5', 'de lunes a viernes, cada 30 minutos de 9:00 a 17:30'],
  ['0-29,45 9-17 * * 1-5',
    'de lunes a viernes, cada minuto durante los primeros 30 minutos y en ' +
    'el minuto 45 de cada hora, de 9:00 a 17:45'],
  ['0,15,45 9-17 * * 1-5',
    'de lunes a viernes, en los minutos 0, 15 y 45 de cada hora, de 9:00 a ' +
    '17:45'],

  // window / hour
  ['*/15 * * * 1-5', 'de lunes a viernes, cada 15 minutos'],
  ['*/15 12 * * 1-5', 'de lunes a viernes, cada 15 minutos de 12:00 a 12:45'],
  ['*/15 9-17,22 * * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45 y de 22:00 a 22:45'],
  ['*/15 1/2 * * 1-5',
    'de lunes a viernes, cada 15 minutos durante una hora cada 2 horas (de ' +
    '1:00 a 1:45, de 3:00 a 3:45… hasta las 23:45)'],

  // window / date
  ['*/15 9-17 1 * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además el día ' +
    '1 de cada mes'],
  ['*/15 9-17 1,10,20 * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además los ' +
    'días 1, 10 y 20 de cada mes'],
  // Written with the star, the two day fields must both match: the odd
  // days of the month that fall from Monday to Friday. Written without
  // it, `1-31/2`, they are a union (hard-cases.js).
  ['*/15 9-17 */2 * 1-5',
    'los días impares de cada mes, cuando caen de lunes a viernes, cada ' +
    '15 minutos de 9:00 a 17:45'],
  // Changed 2026-11-13: «…, y además los días impares de cada mes,
  // excepto el día 15» was read as excepting the 15th from the weekdays
  // too, and a weekday that falls on the 15th fires. In a union the days
  // take no exception (answers 4.3).
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además los ' +
    'días impares del 1 al 13 y del 17 al 31 de cada mes'],

  // window / month
  ['*/15 9-17 * 1 1-5',
    'en enero, de lunes a viernes, cada 15 minutos de 9:00 a 17:45'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'en marzo, junio, septiembre y diciembre, de lunes a viernes, cada 15 ' +
    'minutos de 9:00 a 17:45'],
  ['*/15 9-17 * */2 1-5',
    'en enero, marzo, mayo, julio, septiembre y noviembre, de lunes a ' +
    'viernes, cada 15 minutos de 9:00 a 17:45'],
  ['*/15 9-17 * 11-2 1-5',
    'de noviembre a febrero, de lunes a viernes, cada 15 minutos de 9:00 a ' +
    '17:45'],

  // window / weekday
  ['*/15 9-17 * * *', 'todos los días, cada 15 minutos de 9:00 a 17:45'],
  ['*/15 9-17 * * 1,3,5',
    'los lunes, miércoles y viernes, cada 15 minutos de 9:00 a 17:45'],
  ['*/15 9-17 * * 2,4', 'los martes y jueves, cada 15 minutos de 9:00 a 17:45'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *',
    'el día 1 de cada mes a las 0:00, una vez por segundo durante todo ese ' +
    'minuto'],
  ['*/6 0 0 1 * *',
    'el día 1 de cada mes a las 0:00, una vez cada 6 segundos durante todo ' +
    'ese minuto'],
  ['5/10 0 0 1 * *',
    'el día 1 de cada mes a las 0:00, en los segundos 5, 15, 25, 35, 45 y ' +
    '55'],

  // monthly / minute
  ['* 0 1 * *', 'el día 1 de cada mes, cada minuto de 0:00 a 0:59'],
  ['5,20,45 0 1 * *', 'el día 1 de cada mes a las 0:05, 0:20 y 0:45'],
  ['*/15 0 1 * *', 'el día 1 de cada mes, cada 15 minutos de 0:00 a 0:45'],
  ['0,15,45 0 1 * *', 'el día 1 de cada mes a las 0:00, 0:15 y 0:45'],

  // monthly / hour
  ['0 * 1 * *', 'el día 1 de cada mes, cada hora en punto'],
  ['0 9,17 1 * *', 'el día 1 de cada mes a las 9:00 y 17:00'],
  ['0 9-17,22 1 * *',
    'el día 1 de cada mes, cada hora de 9:00 a 17:00 y a las 22:00'],
  ['0 1/2 1 * *', 'el día 1 de cada mes, cada 2 horas de 1:00 a 23:00'],

  // monthly / date
  ['0 0 * * *', 'todos los días a las 0:00'],
  ['0 0 1,10,20 * *', 'los días 1, 10 y 20 de cada mes a las 0:00'],
  ['0 0 */2 * *', 'los días impares de cada mes a las 0:00'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'los días impares de cada mes, excepto el día 15, a las 0:00'],

  // monthly / month
  ['0 0 1 1 *', 'el 1 de enero a las 0:00'],
  ['0 0 1 3,6,9,12 *',
    'el día 1 de marzo, junio, septiembre y diciembre a las 0:00'],
  ['0 0 1 */2 *',
    'el día 1 de enero, marzo, mayo, julio, septiembre y noviembre a las ' +
    '0:00'],
  ['0 0 1 11-2 *', 'de noviembre a febrero, el día 1 de cada mes a las 0:00'],

  // monthly / weekday
  ['0 0 1 * 1', 'los lunes a las 0:00, y además el día 1 de cada mes'],
  ['0 0 1 * 1-5',
    'de lunes a viernes a las 0:00, y además el día 1 de cada mes'],
  ['0 0 1 * 2,4',
    'los martes y jueves a las 0:00, y además el día 1 de cada mes'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'cada segundo'],
  ['*/6 * * * * *', 'cada 6 segundos'],
  ['5/10 * * * * *', 'en los segundos 5, 15, 25, 35, 45 y 55 de cada minuto'],

  // open / minute
  ['5,20,45 * * * *', 'en los minutos 5, 20 y 45 de cada hora'],
  ['*/15 * * * *', 'cada 15 minutos'],
  ['0,15,45 * * * *', 'en los minutos 0, 15 y 45 de cada hora'],

  // open / hour
  ['* 0 * * *', 'todos los días, cada minuto de 0:00 a 0:59'],
  ['* 9,17 * * *',
    'todos los días, cada minuto de 9:00 a 9:59 y de 17:00 a 17:59'],
  ['* 9-17,22 * * *',
    'todos los días, cada minuto de 9:00 a 17:59 y de 22:00 a 22:59'],
  ['* 1/2 * * *',
    'todos los días, cada minuto durante una hora cada 2 horas (de 1:00 a ' +
    '1:59, de 3:00 a 3:59… hasta las 23:59)'],

  // open / date
  ['* * 1 * *', 'el día 1 de cada mes, cada minuto'],
  ['* * 1,10,20 * *', 'los días 1, 10 y 20 de cada mes, cada minuto'],
  ['* * */2 * *', 'los días impares de cada mes, cada minuto'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'los días impares de cada mes, excepto el día 15, cada minuto'],

  // open / month
  ['* * * 1 *', 'en enero, cada minuto'],
  ['* * * 3,6,9,12 *', 'en marzo, junio, septiembre y diciembre, cada minuto'],
  ['* * * */2 *',
    'en enero, marzo, mayo, julio, septiembre y noviembre, cada minuto'],
  ['* * * 11-2 *', 'de noviembre a febrero, cada minuto'],

  // open / weekday
  ['* * * * 1', 'los lunes, cada minuto'],
  ['* * * * 1-5', 'de lunes a viernes, cada minuto'],
  ['* * * * 2,4', 'los martes y jueves, cada minuto']
];

export {rows};
