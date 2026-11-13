// Spanish hard cases: patterns outside the grid that reach rules the
// grid's ladders do not, or where several fields are restricted at once.
// A builder may see these.
//
// Written by hand from src/lang/es/answers.md. Never produced by running a
// renderer.

const rows = [
  // Years.
  ['0 0 1 1 * 2030', 'el 1 de enero de 2030 a las 0:00', {years: true}],
  ['0 0 0 1 1 * 2030,2035', 'en 2030 y 2035, el 1 de enero a las 0:00'],
  ['0 0 0 1 1 * 2030-2035', 'de 2030 a 2035, el 1 de enero a las 0:00'],
  ['0 0 1 1 * */2',
    'en los años pares, el 1 de enero a las 0:00',
    {years: true}],
  ['30 0 9 1 6 * 2030', 'el 1 de junio de 2030 a las 9:00:30'],
  ['0 0 9 * * * 2030', 'en 2030, todos los días a las 9:00'],
  ['0 0 9 * * * 2028-2031', 'de 2028 a 2031, todos los días a las 9:00'],
  ['0 0 9 * 6 * 2030', 'en junio de 2030, todos los días a las 9:00'],
  ['0 0 9 * 6 1 2030', 'los lunes de junio de 2030 a las 9:00'],
  ['0 0 9 1,15 6 * 2030', 'los días 1 y 15 de junio de 2030 a las 9:00'],
  ['0 0 9 * 6,7 * 2030', 'en junio y julio de 2030, todos los días a las 9:00'],
  ['0 0 9 * 6 * 2030,2031',
    'en 2030 y 2031, en junio, todos los días a las 9:00'],
  ['0 0 9 L 6 * 2030', 'el último día de junio de 2030 a las 9:00'],
  ['0 0 9 1 * * 2030', 'en 2030, el día 1 de cada mes a las 9:00'],
  ['0 0 9 * * * 2030/2',
    'en los años pares desde 2030, todos los días a las 9:00'],
  ['0 0 9 * * * 2028/4',
    'en 2028, 2032, 2036 y así sucesivamente, todos los días a las 9:00'],
  ['0 0 0 1 1 * 2028/4',
    'en 2028, 2032, 2036 y así sucesivamente, el 1 de enero a las 0:00'],
  ['0 */5 * * * * 2028/4',
    'en 2028, 2032, 2036 y así sucesivamente, cada 5 minutos'],
  ['0 0 9 * * * 2028-2060/4',
    'en 2028, 2032, 2036 y así sucesivamente hasta 2060, todos los días a ' +
    'las 9:00'],
  ['0 0 9 * * * 2028-2048/4',
    'en 2028, 2032, 2036, 2040, 2044 y 2048, todos los días a las 9:00'],
  ['0 0 9 * * * 2030-2040/2',
    'en los años pares de 2030 a 2040, todos los días a las 9:00'],
  ['0 */5 * * * * */2', 'en los años pares, cada 5 minutos'],
  ['0 0 9 * * * 1971/2', 'en los años impares, todos los días a las 9:00'],
  ['0 0 0 1 1 * 2030-2032,2035',
    'de 2030 a 2032 y en 2035, el 1 de enero a las 0:00'],
  ['0 0 0 1 * * 2030-2035', 'de 2030 a 2035, el día 1 de cada mes a las 0:00'],
  ['0 0 0 1 6-8 * 2030',
    'de junio a agosto de 2030, el día 1 de cada mes a las 0:00'],
  ['0 0 9 * 1-11 * 2030',
    'de enero a noviembre de 2030, todos los días a las 9:00'],

  // Quartz forms.
  ['0 0 1 * ?', 'el día 1 de cada mes a las 0:00', {cron: 'quartz'}],
  // The Monday-to-Friday forms name their days (answers 5.7): «día
  // laborable» may count Saturday and skips public holidays, and the
  // pattern does neither.
  ['0 0 LW * *',
    'el último día de cada mes o, si cae en sábado o domingo, el viernes ' +
    'anterior, a las 0:00'],
  ['0 0 1W * *',
    'el día 1 de cada mes o, si cae en sábado o domingo, el lunes ' +
    'siguiente, a las 0:00'],
  ['0 0 1W 6 *',
    'el 1 de junio o, si cae en sábado o domingo, el lunes siguiente, a ' +
    'las 0:00'],
  ['0 0 LW 6 *',
    'el último día de junio o, si cae en sábado o domingo, el viernes ' +
    'anterior, a las 0:00'],
  ['0 0 15W 6 *',
    'el 15 de junio o, si cae en sábado o domingo, el viernes o el lunes ' +
    'más cercano, a las 0:00'],
  ['0 0 31W * *',
    'el día 31 de cada mes o, si cae en sábado o domingo, el viernes o el ' +
    'lunes más cercano del mismo mes, a las 0:00'],
  ['0 0 28W * *',
    'el día 28 de cada mes o, si cae en sábado o domingo, el viernes o el ' +
    'lunes más cercano del mismo mes, a las 0:00'],
  ['0 0 27W * *',
    'el día 27 de cada mes o, si cae en sábado o domingo, el viernes o el ' +
    'lunes más cercano, a las 0:00'],
  ['0 0 30W 6 *',
    'el 30 de junio o, si cae en sábado o domingo, el viernes o el lunes ' +
    'más cercano del mismo mes, a las 0:00'],
  ['0 0 15W * 5',
    'los viernes a las 0:00, y además el día 15 de cada mes o, si cae en ' +
    'sábado o domingo, el viernes o el lunes más cercano'],
  ['0 9 LW * *',
    'el último día de cada mes o, si cae en sáb o dom, el vie anterior, a ' +
    'las 9:00',
    {style: {short: true}}],
  ['0 0 L-3 * *', '3 días antes del último día de cada mes, a las 0:00'],
  ['0 0 L-3 6 *', '3 días antes del último día de junio, a las 0:00'],
  ['0 0 L-1 * *', 'el penúltimo día de cada mes a las 0:00'],
  ['0 0 L-2 * *', 'el antepenúltimo día de cada mes a las 0:00'],
  ['0 0 L-30 * *',
    'en los meses de más de 30 días, 30 días antes del último día del mes, ' +
    'a las 0:00'],
  ['0 0 L 6 *', 'el último día de junio a las 0:00'],
  ['0 0 L 6-8,12 *',
    'de junio a agosto y en diciembre, el último día de cada mes a las 0:00'],
  ['0 0 L 6-8 5',
    'de junio a agosto, los viernes a las 0:00, y además el último día de ' +
    'esos meses'],
  ['0 0 * 6 1#2', 'el segundo lunes de junio a las 0:00'],
  ['0 0 * 1,7 5L', 'el último viernes de enero y julio a las 0:00'],
  ['0 9 * * 3#1', 'el primer miércoles de cada mes a las 9:00'],
  ['0 9 * * 4#3', 'el tercer jueves de cada mes a las 9:00'],
  ['0 9 * * 6L', 'el último sábado de cada mes a las 9:00'],
  ['0 9 * * 0#4', 'el cuarto domingo de cada mes a las 9:00'],

  // A day of the month that a named month lacks: only the months that
  // fire are said (answers 4.4). The rows of the first audit said the
  // months as written and then «en los meses que tienen día 31»; the
  // core now states which months fire.
  ['0 0 31W 6-8 *',
    'el día 31 de julio y agosto o, si cae en sábado o domingo, el viernes ' +
    'o el lunes más cercano del mismo mes, a las 0:00'],
  ['0 0 30W 2,4 *',
    'el 30 de abril o, si cae en sábado o domingo, el viernes o el lunes ' +
    'más cercano del mismo mes, a las 0:00'],
  ['0 0 31W 7 *',
    'el 31 de julio o, si cae en sábado o domingo, el viernes o el lunes ' +
    'más cercano del mismo mes, a las 0:00'],
  ['0 0 0 31W 6-8 * 2030',
    'el día 31 de julio y agosto de 2030 o, si cae en sábado o domingo, el ' +
    'viernes o el lunes más cercano del mismo mes, a las 0:00'],
  ['0 0 L-30 6-8 *',
    '30 días antes del último día de julio y agosto, a las 0:00'],
  ['0 0 L-29 2,4 *', '29 días antes del último día de abril, a las 0:00'],
  ['0 0 L-30 7 *', '30 días antes del último día de julio, a las 0:00'],
  ['0 0 30 2-3 *', 'el 30 de marzo a las 0:00'],
  ['0 0 31 1-6 *', 'el día 31 de enero, marzo y mayo a las 0:00'],
  ['0 0 30 2-6 *', 'de marzo a junio, el día 30 de cada mes a las 0:00'],
  ['0 0 1,31 4,6,9,11 *',
    'el día 1 de abril, junio, septiembre y noviembre a las 0:00'],
  ['0 0 31W * 5',
    'los viernes a las 0:00, y además el día 31 de cada mes o, si cae en ' +
    'sábado o domingo, el viernes o el lunes más cercano del mismo mes'],
  ['0 0 L-30 * 5',
    'los viernes a las 0:00, y además, en los meses de más de 30 días, 30 ' +
    'días antes del último día del mes'],
  ['0 0 L-28 2,3 *',
    'en febrero y marzo, en los meses de más de 28 días, 28 días antes del ' +
    'último día del mes, a las 0:00'],

  // In a union the weekdays keep the months as written, and the date
  // names the months it fires in.
  ['0 0 31W 6,7 5',
    'en junio y julio, los viernes a las 0:00, y además el 31 de julio o, ' +
    'si cae en sábado o domingo, el viernes o el lunes más cercano del ' +
    'mismo mes'],
  ['0 0 31 4,5 1',
    'en abril y mayo, los lunes a las 0:00, y además el 31 de mayo'],
  ['0 0 30 2-12 1',
    'de febrero a diciembre, los lunes a las 0:00, y además, de marzo a ' +
    'diciembre, el día 30 de cada mes'],
  ['0 0 L-30 6-8 5',
    'de junio a agosto, los viernes a las 0:00, y además 30 días antes del ' +
    'último día de julio y agosto'],

  // A day no month in reach has: the schedule never fires, and says so.
  // Beside weekdays, only the weekdays are left.
  ['0 0 31 6 *', 'nunca, porque junio no tiene día 31'],
  ['0 0 30,31 2 *', 'nunca, porque febrero no tiene día 30 ni 31'],
  ['0 0 31 4,6 *', 'nunca, porque abril y junio no tienen día 31'],
  ['0 0 31W 6 *', 'nunca, porque junio no tiene día 31'],
  ['0 0 L-30 6 *', 'nunca, porque junio no tiene más de 30 días'],
  ['0 0 0 29 2 * 2031', 'nunca, porque febrero de 2031 no tiene día 29'],
  ['0 0 0 29 2 * 2031,2033',
    'nunca, porque en 2031 y 2033 febrero no tiene día 29'],
  ['*/5 9-17 31 6 *', 'nunca, porque junio no tiene día 31'],
  ['0 0 31 6 1', 'los lunes de junio a las 0:00'],
  ['0 0 31W 6 5', 'los viernes de junio a las 0:00'],
  ['0 0 31 6 *',
    'No se ejecuta nunca, porque junio no tiene día 31.',
    {form: 'sentence'}],
  ['0 0 31 6 *', 'Nunca, porque junio no tiene día 31', {form: 'label'}],

  // A 29th of February alone fires in leap years only.
  ['0 0 29 2 *', 'en los años bisiestos, el 29 de febrero a las 0:00'],
  ['0 0 29,30 2 *', 'en los años bisiestos, el 29 de febrero a las 0:00'],
  ['0 0 29W 2 *',
    'en los años bisiestos, el 29 de febrero o, si cae en sábado o ' +
    'domingo, el viernes o el lunes más cercano del mismo mes, a las 0:00'],
  ['0 0 L-28 2 *',
    'en los años bisiestos, 28 días antes del último día de febrero, a las ' +
    '0:00'],
  ['0 0 0 29 2 * 2030-2040',
    'de 2030 a 2040, en los años bisiestos, el 29 de febrero a las 0:00'],
  ['0 0 0 29 2 * 2032', 'el 29 de febrero de 2032 a las 0:00'],
  ['0 0 29 2 1',
    'en febrero, los lunes a las 0:00, y además, en los años bisiestos, el ' +
    'día 29 de ese mes'],
  ['0 0 29 2,3 *', 'el día 29 de febrero y marzo a las 0:00'],
  ['0 0 L-3 * 1',
    'los lunes a las 0:00, y además 3 días antes del último día de cada mes'],

  // Days of the month that cover every day of the named months leave the
  // weekdays nothing to add.
  ['0 0 1-30 6 1', 'en junio, todos los días a las 0:00'],
  ['0 0 0 1-28 2 * 2031', 'en febrero de 2031, todos los días a las 0:00'],
  ['0 9 1-30 4 1', 'en abril, todos los días a las 9:00'],

  // In a union the days of the month take no exception: «…, y además
  // todos los días de cada mes, excepto el día 15» was read as excepting
  // the 15th from the Fridays too, and a Friday the 15th fires.
  ['0 0 1-30 * 1', 'los lunes a las 0:00, y además del 1 al 30 de cada mes'],
  ['0 9 1-14,16-31 * 5',
    'los viernes a las 9:00, y además del 1 al 14 y del 16 al 31 de cada ' +
    'mes'],
  ['0 9 1-14,16-31 6 1',
    'en junio, los lunes a las 9:00, y además del 1 al 14 y del 16 al 30 ' +
    'de ese mes'],
  ['0 0 15 * 0-2,4-6',
    'de jueves a martes a las 0:00, y además el día 15 de cada mes'],

  // Minutes in several parts inside more than one hour keep their phrase.
  ['0-29,45 9,17 * * *',
    'todos los días, cada minuto durante los primeros 30 minutos y en el ' +
    'minuto 45 de las horas que empiezan a las 9:00 y 17:00'],
  ['50-10 8,12,18 * * *',
    'todos los días, cada minuto durante los primeros 11 minutos y durante ' +
    'los últimos 10 minutos de las horas que empiezan a las 8:00, 12:00 y ' +
    '18:00'],
  ['* 0-29,45 9,17 * * *',
    'todos los días, cada segundo durante los primeros 30 minutos y ' +
    'durante el minuto 45 de las horas que empiezan a las 9:00 y 17:00'],

  // Excepted minutes inside named hours: clock times or windows while
  // they name four things at most, and minutes of each hour beyond that.
  ['28-24 9 * * *',
    'todos los días, cada minuto de 9:00 a 9:59, excepto a las 9:25, 9:26 ' +
    'y 9:27'],
  ['0-24,28-59 9,17 * * *',
    'todos los días, cada minuto de 9:00 a 9:59 y de 17:00 a 17:59, ' +
    'excepto en los minutos 25, 26 y 27 de cada hora'],
  ['0-28,30-59 */6 * * *',
    'todos los días, cada minuto de 0:00 a 0:59, de 6:00 a 6:59, de 12:00 ' +
    'a 12:59 y de 18:00 a 18:59, excepto a las 0:29, 6:29, 12:29 y 18:29'],
  ['* 28-24 9 * * *',
    'todos los días, cada segundo de 9:00:00 a 9:59:59, excepto de 9:25:00 ' +
    'a 9:27:59'],
  ['* 0-9,11-19,21-59 9 * * *',
    'todos los días, cada segundo de 9:00:00 a 9:59:59, excepto de 9:10:00 ' +
    'a 9:10:59 y de 9:20:00 a 9:20:59'],
  ['* 0-28,30-59 */6 * * *',
    'todos los días, cada segundo de 0:00:00 a 0:59:59, de 6:00:00 a ' +
    '6:59:59, de 12:00:00 a 12:59:59 y de 18:00:00 a 18:59:59, excepto ' +
    'durante el minuto 29 de cada hora'],

  // Years with a hole in a cadence, and every year but one.
  ['0 0 9 * * * 2000-2028/2,2032-2098/2',
    'en los años pares de 2000 a 2098, excepto en 2030, todos los días a ' +
    'las 9:00'],
  ['0 0 9 * * * 2028-2036/4,2044-2060/4',
    'en 2028, 2032, 2036 y así sucesivamente hasta 2060, excepto en 2040, ' +
    'todos los días a las 9:00'],
  ['0 0 9 * * * 1970-2029,2031-9999',
    'todos los años, excepto en 2030, todos los días a las 9:00'],
  ['0 0 0 1 1 * 2030-2034,2036-2040',
    'de 2030 a 2034 y de 2036 a 2040, el 1 de enero a las 0:00'],

  // Weekday pieces with a run across Sunday and Monday: the run leads.
  ['0 9 * * 0,1,2,4', 'de domingo a martes y los jueves a las 9:00'],
  ['0 9 * * 0,1,3,5', 'los lunes, miércoles, viernes y domingos a las 9:00'],

  // Hours that run past midnight beside a day, a month or a year are in
  // ascending order.
  ['0 22-2 * * 1',
    'los lunes, cada hora de 0:00 a 2:00 y a las 22:00 y 23:00'],
  ['* 22-2 * 6 *',
    'en junio, todos los días, cada minuto de 0:00 a 2:59 y de 22:00 a ' +
    '23:59'],
  ['0 20-4,9-12 * * *',
    'todos los días, cada hora de 20:00 a 4:00 y de 9:00 a 12:00'],

  // An exception against a run, a run that wraps, and pieces.
  ['0 0-2,5-23 * * *', 'cada hora en punto, excepto a las 3:00 y 4:00'],
  ['* 0-2,5-23 * * *', 'todos los días, cada minuto de 5:00 a 2:59'],
  ['* 0-2,4-23 * * 1', 'los lunes, cada minuto, excepto de 3:00 a 3:59'],
  ['* 0-2,5-23 * * 1',
    'los lunes, cada minuto de 0:00 a 2:59 y de 5:00 a 23:59'],
  ['0 0 8-6 * *', 'todos los días de cada mes, excepto el día 7, a las 0:00'],
  // Changed 2026-11-13: days of the month no longer wrap into the next
  // month (answers 3.5), so three days short is an exception by the count.
  ['0 0 6-2 * *',
    'todos los días de cada mes, excepto los días 3, 4 y 5, a las 0:00'],

  // Macros, startup, and the three forms.
  ['@hourly', 'cada hora en punto'],
  ['@daily', 'todos los días a las 0:00'],
  ['@weekly', 'los domingos a las 0:00'],
  ['@monthly', 'el día 1 de cada mes a las 0:00'],
  ['@yearly', 'el 1 de enero a las 0:00'],
  ['@reboot', 'al iniciar el sistema'],
  ['0 9 * * *', 'Se ejecuta todos los días a las 9:00.', {form: 'sentence'}],
  ['0 9 * * *', 'Todos los días a las 9:00', {form: 'label'}],
  ['* * * * *', 'Cada minuto', {form: 'label'}],
  ['@reboot', 'Se ejecuta al iniciar el sistema.', {form: 'sentence'}],
  ['not a pattern', 'un patrón cron no reconocido', {lenient: true}],

  // A day of the month and a weekday, under a month.
  ['0 0 1 6 5',
    'en junio, los viernes a las 0:00, y además el día 1 de ese mes'],
  ['0 0 1,15 1,7 1-5',
    'en enero y julio, de lunes a viernes a las 0:00, y además los días 1 ' +
    'y 15 de esos meses'],
  ['0 0 1 1-11 5',
    'de enero a noviembre, los viernes a las 0:00, y además el día 1 de ' +
    'esos meses'],
  ['52 7-16 1,19,23,28 5-7 3-4',
    'de mayo a julio, los miércoles y jueves, cada hora de 7:52 a 16:52, y ' +
    'además los días 1, 19, 23 y 28 de esos meses'],
  ['30 4 1-7 * 1', 'los lunes a las 4:30, y además del 1 al 7 de cada mes'],
  ['0 0 15 * 0-2,4-6',
    'de jueves a martes a las 0:00, y además el día 15 de cada mes'],
  ['0 0 1 6 1#2',
    'en junio, el segundo lunes del mes a las 0:00, y además el día 1 de ' +
    'ese mes'],

  // A month with its dates.
  ['0 0 1,15 6 *', 'los días 1 y 15 de junio a las 0:00'],
  ['0 0 1,10,20 6 *', 'los días 1, 10 y 20 de junio a las 0:00'],
  ['0 0 1-7 6 *', 'del 1 al 7 de junio a las 0:00'],
  ['0 0 1-7,15 6 *', 'del 1 al 7 y el día 15 de junio a las 0:00'],
  ['0 0 */2 6 *', 'los días impares de junio a las 0:00'],
  ['0 0 */5 7 *', 'los días 1, 6, 11, 16, 21, 26 y 31 de julio a las 0:00'],
  ['0 0 */5 6 *', 'los días 1, 6, 11, 16, 21 y 26 de junio a las 0:00'],
  ['0 0 25-31 6 *', 'del 25 al 30 de junio a las 0:00'],
  ['0 0 30,31 4,6 *', 'el día 30 de abril y junio a las 0:00'],
  ['0 0 31 * *', 'el día 31 de cada mes a las 0:00'],
  // Changed 2026-11-13: «del 28 de cada mes al 3 del siguiente» was the
  // rule for a wrap. «Del 29 de cada mes al 2 del siguiente» promises
  // nothing after a February of 28 days, yet the 1st and 2nd of March
  // fire, and «del 20 de cada mes al 10 del siguiente» reads as a
  // mistake. Days of the month are always in ascending order.
  ['0 0 28-3 * *', 'del 1 al 3 y del 28 al 31 de cada mes a las 0:00'],
  ['0 0 29-2 * *', 'los días 1 y 2, y del 29 al 31 de cada mes a las 0:00'],
  ['0 0 31,1-3 * *', 'del 1 al 3 y el día 31 de cada mes a las 0:00'],
  ['0 0 1-10,20-31 * *', 'del 1 al 10 y del 20 al 31 de cada mes a las 0:00'],
  ['0 0 28-3 6 *', 'del 1 al 3 y del 28 al 30 de junio a las 0:00'],
  ['0 0 1,15 1,7 *', 'los días 1 y 15 de enero y julio a las 0:00'],
  ['59 23 31 12 *', 'el 31 de diciembre a las 23:59'],
  ['0 0 1-14,16-31 * *',
    'todos los días de cada mes, excepto el día 15, a las 0:00'],
  ['0 0 1-14,16-31 6 *',
    'todos los días de junio, excepto el día 15, a las 0:00'],
  ['0 0 1-14,17-31 * *',
    'todos los días de cada mes, excepto los días 15 y 16, a las 0:00'],
  ['0 0 1-30 * *', 'todos los días de cada mes, excepto el día 31, a las 0:00'],
  ['0 0 1 2/2 *',
    'el día 1 de febrero, abril, junio, agosto, octubre y diciembre a las ' +
    '0:00'],
  ['0 12 1-5,10,20-25 * *',
    'del 1 al 5, el día 10 y del 20 al 25 de cada mes a las 12:00'],
  ['0 0 */10 * *', 'los días 1, 11, 21 y 31 de cada mes a las 0:00'],
  ['0 0 */21 * *', 'los días 1 y 22 de cada mes a las 0:00'],
  ['0 0 5-20/3 * *', 'los días 5, 8, 11, 14, 17 y 20 de cada mes a las 0:00'],
  ['0 0 */3 * *', 'cada 3 días del 1 al 31 de cada mes a las 0:00'],
  ['0 0 8/2 * *', 'los días pares del 8 al 30 de cada mes a las 0:00'],
  ['0 9 * 1-3,6,9-11 *',
    'de enero a marzo, en junio y de septiembre a noviembre, todos los ' +
    'días a las 9:00'],
  ['0 9 * 12,1 *', 'en enero y diciembre, todos los días a las 9:00'],
  ['0 0 * 11-2 * 2030',
    'en enero, febrero, noviembre y diciembre de 2030, todos los días a ' +
    'las 0:00',
    {years: true}],

  // Weekday order, runs and wrap-arounds; a weekday with its month.
  ['0 9 * * 5-1', 'de viernes a lunes a las 9:00'],
  ['0 9 * * 2-4', 'de martes a jueves a las 9:00'],
  ['0 9 * * 0,1', 'los domingos y lunes a las 9:00'],
  ['0 9 * * 0,5', 'los viernes y domingos a las 9:00'],
  ['0 9 * * 0,2-4', 'de martes a jueves y los domingos a las 9:00'],
  ['0 9 * * 0,2-5', 'de martes a viernes y los domingos a las 9:00'],
  ['0 9 * * 1,2,3,5', 'de lunes a miércoles y los viernes a las 9:00'],
  ['0 9 * * 1,3,4,5', 'los lunes y de miércoles a viernes a las 9:00'],
  ['0 9 * * 0,2-6', 'de martes a domingo a las 9:00'],
  ['0 9 * * 0-2,4-6', 'todos los días, excepto los miércoles, a las 9:00'],
  ['0 9 * 6 0-2,4-6',
    'en junio, todos los días, excepto los miércoles, a las 9:00'],
  ['0 0,1,22,23 * * 1', 'los lunes a las 0:00, 1:00, 22:00 y 23:00'],
  ['0 9 * 6 1', 'los lunes de junio a las 9:00'],
  ['0 9 * 6 1,3,5', 'los lunes, miércoles y viernes de junio a las 9:00'],
  ['0 9 * 6 0,6', 'los fines de semana de junio a las 9:00'],
  ['0 9 * 1,7 1', 'los lunes de enero y julio a las 9:00'],
  ['0 9 * 6-8 1', 'de junio a agosto, los lunes a las 9:00'],
  ['0 9 * 6 1-5', 'en junio, de lunes a viernes a las 9:00'],
  ['0 9 * 6 0,2-5', 'en junio, de martes a viernes y los domingos a las 9:00'],

  // Clock times: the list, the article, and what competes with them.
  ['0,30 9,17 * * *', 'todos los días a las 9:00, 9:30, 17:00 y 17:30'],
  ['5,20 9,17 * * *', 'todos los días a las 9:05, 9:20, 17:05 y 17:20'],
  ['5,20,45 9,17 * * *',
    'todos los días a las 9:05, 9:20, 9:45, 17:05, 17:20 y 17:45'],
  ['0 1 * * *', 'todos los días a la 1:00'],
  ['30 1,13 * * *', 'todos los días a la 1:30 y a las 13:30'],
  ['0 1,5,9 * * *', 'todos los días a la 1:00, a las 5:00 y a las 9:00'],
  ['0 9,13 * * *', 'todos los días a las 9:00 y 13:00'],
  ['0 0,23 * * *', 'todos los días a las 0:00 y 23:00'],
  ['30 0 * * *', 'todos los días a las 0:30'],
  ['30 0 0 * * *', 'todos los días a las 0:00:30'],
  ['30 12 * * *', 'todos los días a las 12:30'],
  ['1 * * * *', 'en el minuto 1 de cada hora'],
  ['* 22-23 * * *', 'todos los días, cada minuto de 22:00 a 23:59'],
  ['*/30 0-17 * * 2', 'los martes, cada 30 minutos de 0:00 a 17:30'],
  ['0 0-6,22,23 * * *', 'todos los días, cada hora de 22:00 a 6:00'],
  ['*/15 0-5,22-23 * * *', 'todos los días, cada 15 minutos de 22:00 a 5:45'],
  ['0 5,9-17 * * *', 'todos los días a las 5:00 y cada hora de 9:00 a 17:00'],
  ['5/10 9,17 * * *',
    'todos los días, cada 10 minutos de 9:05 a 9:55 y de 17:05 a 17:55'],
  ['0,20,40 9 * * *', 'todos los días a las 9:00, 9:20 y 9:40'],
  ['5,20,45 9-10 * * *',
    'todos los días, en los minutos 5, 20 y 45 de cada hora, de 9:05 a ' +
    '10:45'],

  // Cadences of hours are never bare: listed up to seven, then both ends.
  ['0 0,6,12,18 * * *', 'todos los días a las 0:00, 6:00, 12:00 y 18:00'],
  ['0 0,6,18 * * *', 'todos los días a las 0:00, 6:00 y 18:00'],
  ['0 */4 * * *',
    'todos los días a las 0:00, 4:00, 8:00, 12:00, 16:00 y 20:00'],
  ['0 */3 * * *', 'todos los días, cada 3 horas de 0:00 a 21:00'],
  ['0 */5 * * *', 'todos los días a las 0:00, 5:00, 10:00, 15:00 y 20:00'],
  ['0 0-20/2 * * *', 'todos los días, cada 2 horas de 0:00 a 20:00'],
  ['30 */2 * * *', 'todos los días, cada 2 horas de 0:30 a 22:30'],
  ['30 */3 * * *', 'todos los días, cada 3 horas de 0:30 a 21:30'],
  ['30 */5 * * *', 'todos los días a las 0:30, 5:30, 10:30, 15:30 y 20:30'],
  ['23 */6 * * *', 'todos los días a las 0:23, 6:23, 12:23 y 18:23'],
  ['23 1/2 * * *', 'todos los días, cada 2 horas de 1:23 a 23:23'],
  ['15,45 */2 * * *',
    'todos los días, cada 2 horas de 0:15 a 22:15 y de 0:45 a 22:45'],
  ['15,45 */4 * * *',
    'todos los días a las 0:15, 0:45, 4:15, 4:45, 8:15, 8:45, 12:15, ' +
    '12:45, 16:15, 16:45, 20:15 y 20:45'],
  ['15,45 */6 * * *',
    'todos los días a las 0:15, 0:45, 6:15, 6:45, 12:15, 12:45, 18:15 y ' +
    '18:45'],
  ['23 */12 * * *', 'todos los días a las 0:23 y 12:23'],
  ['0 1/12 * * *', 'todos los días a la 1:00 y a las 13:00'],
  ['*/15 */12 * * *',
    'todos los días, cada 15 minutos de 0:00 a 0:45 y de 12:00 a 12:45'],
  ['0 */12 * * *', 'todos los días a las 0:00 y 12:00'],
  ['0 0/12 * * *', 'todos los días a las 0:00 y 12:00'],
  ['0 0,12 * * *', 'todos los días a las 0:00 y 12:00'],
  ['0 */12 1 * *', 'el día 1 de cada mes a las 0:00 y 12:00'],
  ['0 */3 1 * *', 'el día 1 de cada mes, cada 3 horas de 0:00 a 21:00'],

  // Exceptions.
  ['0 0-2,4-23 * * *', 'cada hora en punto, excepto a las 3:00'],
  ['0 0-22 * * *', 'cada hora en punto, excepto a las 23:00'],
  ['0 0-21 * * *', 'todos los días, cada hora de 0:00 a 21:00'],
  ['* 0-22 * * *', 'todos los días, cada minuto de 0:00 a 22:59'],
  ['30 0-2,4-23 * * *', 'en el minuto 30 de cada hora, excepto a las 3:30'],
  ['5,20,45 0-2,4-23 * * *',
    'en los minutos 5, 20 y 45 de cada hora, excepto de 3:05 a 3:45'],
  ['*/10 0-2,4-23 * * *', 'cada 10 minutos, excepto de 3:00 a 3:50'],
  ['0-28,30-59 * * * *', 'cada minuto, excepto en el minuto 29 de cada hora'],
  ['0-58 * * * *', 'cada minuto, excepto en el minuto 59 de cada hora'],
  ['0-28,30-59 9,17 * * *',
    'todos los días, cada minuto de 9:00 a 9:59 y de 17:00 a 17:59, ' +
    'excepto a las 9:29 y 17:29'],
  ['0,5,10,15,20,25,35,40,45,50,55 9-17 * * *',
    'todos los días, cada 5 minutos de 9:00 a 17:55, excepto en el minuto ' +
    '30 de cada hora'],
  ['0,5,10,15,20,25,35,40,45,50,55 9 * * *',
    'todos los días, cada 5 minutos de 9:00 a 9:55, excepto a las 9:30'],
  ['0,5,10,15,20,25,35,40,45,50,55 0-2,4-23 * * *',
    'cada 5 minutos, excepto de 3:00 a 3:55 y en el minuto 30 de cada hora'],
  ['0,10,20,40,50 9-17 * * *',
    'todos los días, en los minutos 0, 10, 20, 40 y 50 de cada hora, de ' +
    '9:00 a 17:50'],
  ['0,10,20,40,50 9 * * *',
    'todos los días a las 9:00, 9:10, 9:20, 9:40 y 9:50'],
  ['* 0-28,30-59 * * * *',
    'cada segundo, excepto durante el minuto 29 de cada hora'],
  ['* 0-28,30-59 9 * * *',
    'todos los días, cada segundo de 9:00:00 a 9:59:59, excepto de 9:29:00 ' +
    'a 9:29:59'],
  ['0-28,30-59 * * * * *',
    'cada segundo, excepto en el segundo 29 de cada minuto'],
  ['0-28,30-59 0 9 * * *',
    'todos los días a las 9:00, una vez por segundo durante todo ese ' +
    'minuto, excepto en el segundo 29'],

  // Hours as a confinement.
  ['*/15 8-18/2 * * *',
    'todos los días, cada 15 minutos durante una hora cada 2 horas (de ' +
    '8:00 a 8:45, de 10:00 a 10:45… hasta las 18:45)'],
  ['0 9-17,20,22 * * *',
    'todos los días, cada hora de 9:00 a 17:00 y a las 20:00 y 22:00'],
  ['* 9-17,20,22 * * *',
    'todos los días, cada minuto de 9:00 a 17:59, de 20:00 a 20:59 y de ' +
    '22:00 a 22:59'],
  ['*/10 6-8,17-19 * * 1-5',
    'de lunes a viernes, cada 10 minutos de 6:00 a 8:50 y de 17:00 a 19:50'],
  ['*/20 */2 */2 */3 *',
    'los días impares de enero, abril, julio y octubre, cada 20 minutos ' +
    'durante una hora cada 2 horas (de 0:00 a 0:40, de 2:00 a 2:40… hasta ' +
    'las 22:40)'],
  ['5,20,45 9-17,22 * * *',
    'todos los días, en los minutos 5, 20 y 45 de cada hora, de 9:05 a ' +
    '17:45 y de 22:05 a 22:45'],
  ['0-29 8,12,18 * * *',
    'todos los días, cada minuto de 8:00 a 8:29, de 12:00 a 12:29 y de ' +
    '18:00 a 18:29'],
  ['* 6,8,12,18,20 * * *',
    'todos los días, cada minuto durante las horas que empiezan a las ' +
    '6:00, 8:00, 12:00, 18:00 y 20:00'],

  // Minutes inside the hour.
  ['50-10 9 * * *',
    'todos los días, cada minuto de 9:00 a 9:10 y de 9:50 a 9:59'],
  ['10-40 9 * * *', 'todos los días, cada minuto de 9:10 a 9:40'],
  ['30-59 9 * * *', 'todos los días, cada minuto de 9:30 a 9:59'],
  ['5-10,20 * * * *',
    'cada minuto del minuto 5 al 10 y en el minuto 20 de cada hora'],
  ['45-59 * * * *', 'cada minuto durante los últimos 15 minutos de cada hora'],
  ['10-40 * * * *', 'cada minuto del minuto 10 al 40 de cada hora'],
  ['0-29 9,17 * * *',
    'todos los días, cada minuto de 9:00 a 9:29 y de 17:00 a 17:29'],
  ['0-1 * * * *', 'en los minutos 0 y 1 de cada hora'],
  ['*/21 * * * *', 'en los minutos 0, 21 y 42 de cada hora'],
  ['9,14,47,56 * * * *', 'en los minutos 9, 14, 47 y 56 de cada hora'],
  ['5/10 * * * *', 'en los minutos 5, 15, 25, 35, 45 y 55 de cada hora'],
  ['0-40/10 * * * *', 'en los minutos 0, 10, 20, 30 y 40 de cada hora'],
  ['0-42/6 * * * *', 'cada 6 minutos del minuto 0 al 42 de cada hora'],
  ['1/2 * * * *', 'en los minutos impares de cada hora'],

  // Seconds.
  ['15 30 9 * * *', 'todos los días a las 9:30:15'],
  ['15 30 9,17 * * *', 'todos los días a las 9:30:15 y 17:30:15'],
  ['15,45 30 9 * * *', 'todos los días a las 9:30:15 y 9:30:45'],
  ['0,20,40 0 9 * * *', 'todos los días a las 9:00:00, 9:00:20 y 9:00:40'],
  ['5-10/60 0 9 * * *', 'todos los días a las 9:00:05'],
  ['15 0 */12 * * *', 'todos los días a las 0:00:15 y 12:00:15'],
  ['15 0 */6 * * *',
    'todos los días a las 0:00:15, 6:00:15, 12:00:15 y 18:00:15'],
  ['15 0 */2 * * *', 'todos los días, cada 2 horas de 0:00:15 a 22:00:15'],
  ['10-20 30 9 * * *',
    'todos los días a las 9:30, una vez por segundo del segundo 10 al 20'],
  ['* 0 9,17 * * *',
    'todos los días a las 9:00 y 17:00, una vez por segundo durante todo ' +
    'ese minuto'],
  ['* * 9 * * *', 'todos los días, cada segundo de 9:00:00 a 9:59:59'],
  ['* * 9-17 * * *', 'todos los días, cada segundo de 9:00:00 a 17:59:59'],
  ['* 0-29 9 * * *', 'todos los días, cada segundo de 9:00:00 a 9:29:59'],
  ['* */3 * * *',
    'todos los días, cada minuto durante una hora cada 3 horas (de 0:00 a ' +
    '0:59, de 3:00 a 3:59… hasta las 21:59)'],
  ['30 0 9-17 * * *', 'todos los días, cada hora de 9:00:30 a 17:00:30'],
  ['* 0 * * * *', 'cada segundo durante el minuto 0 de cada hora'],
  ['30 0 * * * *', 'en el segundo 30 del minuto 0 de cada hora'],
  ['0-9 0 * * * *',
    'cada segundo durante los primeros 10 segundos del minuto 0 de cada ' +
    'hora'],
  ['15 30 * * * *', 'en el segundo 15 del minuto 30 de cada hora'],
  ['* 30 * * * *', 'cada segundo durante el minuto 30 de cada hora'],
  ['0,30 5,20 * * * *',
    'en los segundos 0 y 30 de los minutos 5 y 20 de cada hora'],
  ['*/15 */15 * * * *', 'cada 15 minutos, en los segundos 0, 15, 30 y 45'],
  ['30 */15 * * * *', 'cada 15 minutos, en el segundo 30'],
  ['8 5,30 */2 * * *',
    'todos los días, cada 2 horas de 0:05:08 a 22:05:08 y de 0:30:08 a ' +
    '22:30:08'],
  ['* 0-29 * * * *',
    'cada segundo durante los primeros 30 minutos de cada hora'],
  ['30 * 9-17 * * *',
    'todos los días, en el segundo 30 de cada minuto, de 9:00 a 17:59'],

  // «Todos los días» is said whenever the hours are restricted and no day is
  // named, and never of a schedule that runs every hour.
  ['*/5 * * 6 *', 'en junio, cada 5 minutos'],
  ['0 */6 * 6 *', 'en junio, todos los días a las 0:00, 6:00, 12:00 y 18:00'],
  ['30 * * 6 *', 'en junio, en el minuto 30 de cada hora'],
  ['0 * * * 1', 'los lunes, cada hora en punto'],
  ['*/5 * * * * 2030', 'en 2030, cada 5 minutos', {years: true}],

  // Several fields at once.
  ['*/10 24 */3 23-25 * 1-2',
    'los lunes y martes, cada 3 horas de 0:24 a 21:24, y en cada ocasión ' +
    'una vez cada 10 segundos durante todo ese minuto, y además del 23 al ' +
    '25 de cada mes'],
  ['*/30 23 */12 * 6-7 6#2 2030/4',
    'en 2030, 2034, 2038 y así sucesivamente, el segundo sábado de junio y ' +
    'julio a las 0:23:00, 0:23:30, 12:23:00 y 12:23:30'],
  ['0 35 2,15 * * * 2028,2030',
    'en 2028 y 2030, todos los días a las 2:35 y 15:35'],
  ['* 30,42 3-10 * 7,9,10,12 1,3,4,5',
    'en julio, septiembre, octubre y diciembre, los lunes y de miércoles a ' +
    'viernes, cada segundo durante los minutos 30 y 42 de cada hora, de ' +
    '3:30 a 10:42'],
  ['0 18 15W 3,6,9,12 *',
    'el día 15 de marzo, junio, septiembre y diciembre o, si cae en sábado ' +
    'o domingo, el viernes o el lunes más cercano, a las 18:00'],
  ['7 4-22/6 1 */2 *',
    'el día 1 de enero, marzo, mayo, julio, septiembre y noviembre a las ' +
    '4:07, 10:07, 16:07 y 22:07'],

  // Written without the star, the days of the month and the weekdays are a
  // union: a day fires if either field has it. The same two patterns with
  // a star, `*/2` and `*/5`, are in the grid, and there both must match.
  ['*/15 9-17 1-31/2 * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además los ' +
    'días impares de cada mes'],
  ['*/15 9-17 1-31/5 * 1-5',
    'de lunes a viernes, cada 15 minutos de 9:00 a 17:45, y además los ' +
    'días 1, 6, 11, 16, 21, 26 y 31 de cada mes'],
  ['0 0 1-31/2 * 1',
    'los lunes a las 0:00, y además los días impares de cada mes'],
  ['0 0 15 * 0,2,4,6',
    'los martes, jueves, sábados y domingos a las 0:00, y además el día ' +
    '15 de cada mes'],

  // A star in one day field and the other restricted: both must match, and
  // the sentence says the days of the month that fall on the weekdays.
  // The days are said as they are said alone and the weekdays follow as a
  // condition («cuando cae en…»): «cae» for one date, «caen» for several.
  ['0 0 */2 * 1',
    'los días impares de cada mes, cuando caen en lunes, a las 0:00'],
  ['0 9 */2 * 1,3,5',
    'los días impares de cada mes, cuando caen en lunes, miércoles o ' +
    'viernes, a las 9:00'],
  ['0 0 15 * */2',
    'el día 15 de cada mes, cuando cae en martes, jueves, sábado o ' +
    'domingo, a las 0:00'],
  ['0 0 */2 6 1',
    'los días impares de junio, cuando caen en lunes, a las 0:00'],
  ['0 0 */5 * 1-5',
    'los días 1, 6, 11, 16, 21, 26 y 31 de cada mes, cuando caen de lunes ' +
    'a viernes, a las 0:00'],
  ['0 0 */2 * 6,0',
    'los días impares de cada mes, cuando caen en fin de semana, a las 0:00'],
  ['0 9 */3 1,7 1-5',
    'cada 3 días del 1 al 31 de enero y julio, cuando caen de lunes a ' +
    'viernes, a las 9:00'],
  ['0 0 */2 6-8 1',
    'de junio a agosto, los días impares de cada mes, cuando caen en ' +
    'lunes, a las 0:00'],
  ['0 0 */2 * 1-3,5,6',
    'los días impares de cada mes, cuando caen de lunes a miércoles, ' +
    'viernes o sábado, a las 0:00'],
  ['0 0 0 */2 * 1 2030',
    'en 2030, los días impares de cada mes, cuando caen en lunes, a las ' +
    '0:00', {years: true}],
  ['0 0 */2 * 5L',
    'los días impares de cada mes, cuando coinciden con el último viernes ' +
    'del mes, a las 0:00'],
  ['0 0 L * */2',
    'el último día de cada mes, cuando cae en martes, jueves, sábado o ' +
    'domingo, a las 0:00'],

  // Years with no end, and from the first year there is.
  ['0 0 9 * * * 2030/1', 'desde 2030, todos los días a las 9:00'],
  ['0 0 9 1 1 * 2030/1', 'desde 2030, el 1 de enero a las 9:00'],
  ['0 0 9 * * * 1971/1', 'desde 1971, todos los días a las 9:00'],
  ['0 0 9 * * * 1970-2030', 'hasta 2030, todos los días a las 9:00'],
  ['0 0 9 * * * 1970-2030/2',
    'en los años pares hasta 2030, todos los días a las 9:00'],
  ['0 0 9 * * * 2030,2031,2033/1',
    'en 2030 y 2031, y desde 2033, todos los días a las 9:00'],

  // Years in runs and series together.
  ['0 0 9 * * * 2030/2,2031',
    'en los años pares desde 2030 y en 2031, todos los días a las 9:00'],
  ['0 0 9 * * * 2030-2040,2045/5',
    'de 2030 a 2040 y en 2045, 2050, 2055 y así sucesivamente, todos los ' +
    'días a las 9:00'],
  ['0 0 9 * * * 2030/4,2031/4',
    'en 2030, 2034, 2038 y así sucesivamente, y en 2031, 2035, 2039 y así ' +
    'sucesivamente, todos los días a las 9:00'],
  ['0 0 9 * * * 2028-2060/4,2031',
    'en 2028, 2032, 2036 y así sucesivamente hasta 2060, y en 2031, todos ' +
    'los días a las 9:00'],

  // An exception never removes a year the series shows.
  ['0 0 0 1 1 * 2028,2036-2060/4',
    'en 2028 y en 2036, 2040, 2044 y así sucesivamente hasta 2060, el 1 de ' +
    'enero a las 0:00'],

  ['0 0 0 1 1 * 2028,2036/4',
    'en 2028 y en 2036, 2040, 2044 y así sucesivamente, el 1 de enero a ' +
    'las 0:00'],

  // A single year after months in several pieces would be heard with
  // the last piece only, so it leads.
  ['0 0 9 * 1-5,7-12 * 2030',
    'en 2030, de enero a mayo y de julio a diciembre, todos los días a las ' +
    '9:00'],
  ['0 0 9 * 6-8,12 * 2030',
    'en 2030, de junio a agosto y en diciembre, todos los días a las 9:00'],

  // Minutes, seconds and days in runs and cadences together.
  ['0-20/2,21-59/3 * * * *',
    'cada 2 minutos del minuto 0 al 20 y cada 3 minutos del minuto 21 al ' +
    '57 de cada hora'],
  ['0-20/2,21-59/3 9 * * *',
    'todos los días, cada 2 minutos de 9:00 a 9:20 y cada 3 minutos de ' +
    '9:21 a 9:57'],
  ['0-20/2,21-59/3 * * * * *',
    'cada 2 segundos del segundo 0 al 20 y cada 3 segundos del segundo 21 ' +
    'al 57 de cada minuto'],
  ['*/5,7 * * * *',
    'cada 5 minutos del minuto 0 al 55 y en el minuto 7 de cada hora'],
  ['0 0 1-15/2,16-31/3 * *',
    'los días impares del 1 al 15 y los días 16, 19, 22, 25, 28 y 31 de ' +
    'cada mes a las 0:00'],
  ['0 0 1,2,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31 * *',
    'los días impares y el día 2 de cada mes a las 0:00'],

  // A window never names a moment that an exception then removes: a
  // minute missing at the edge of the hour moves the end of the window.
  ['1-59 9 * * *', 'todos los días, cada minuto de 9:01 a 9:59'],
  ['0-58 9-17 * * *',
    'todos los días, cada minuto durante los primeros 59 minutos de cada ' +
    'hora, de 9:00 a 17:58'],
  ['1-59 * * * * *', 'cada segundo, excepto en el segundo 0 de cada minuto'],
  ['1-59 0 9 * * *',
    'todos los días a las 9:00, una vez por segundo durante los últimos 59 ' +
    'segundos'],

  // A run of minutes inside every Nth hour says how long it is.
  ['0-29 */2 * * *',
    'todos los días, cada minuto durante 30 minutos cada 2 horas (de 0:00 ' +
    'a 0:29, de 2:00 a 2:29… hasta las 22:29)'],
  ['* 10-40 */2 * * *',
    'todos los días, cada segundo durante 31 minutos cada 2 horas (de ' +
    '0:10:00 a 0:40:59, de 2:10:00 a 2:40:59… hasta las 22:40:59)'],

  // Hours named by when they begin: listed up to seven, and a cadence
  // of eight or more names its ends.
  ['0-29,45 */2 * * *',
    'todos los días, cada minuto durante los primeros 30 minutos y en el ' +
    'minuto 45 de las horas que empiezan cada 2 horas de 0:00 a 22:00'],
  ['5,10,20,30,50 */4 * * *',
    'todos los días, en los minutos 5, 10, 20, 30 y 50 de las horas que ' +
    'empiezan a las 0:00, 4:00, 8:00, 12:00, 16:00 y 20:00'],
  ['5,10,20,30,50 0-6/2,10-22/2 * * *',
    'todos los días, en los minutos 5, 10, 20, 30 y 50 de las horas que ' +
    'empiezan cada 2 horas de 0:00 a 22:00, excepto de 8:05 a 8:50'],

  // An excepted hour is never one of the two the bracket shows.
  ['* 0,4-22/2 * * *',
    'todos los días, cada minuto durante las horas que empiezan a las ' +
    '0:00, 4:00, 6:00, 8:00, 10:00, 12:00, 14:00, 16:00, 18:00, 20:00 y ' +
    '22:00'],
  ['* 0-6/2,10-22/2 * * *',
    'todos los días, cada minuto durante una hora cada 2 horas (de 0:00 a ' +
    '0:59, de 2:00 a 2:59… hasta las 22:59), excepto de 8:00 a 8:59'],

  // Named seconds after a time part in several pieces cover all of it.
  ['15,45 0-29,45 9 * * *',
    'todos los días, cada minuto de 9:00 a 9:29 y a las 9:45, siempre en ' +
    'los segundos 15 y 45'],

  // A piece with an «y» of its own is closed by a comma before the «y»
  // that joins the last piece.
  ['0 0 * 1-2,6-8 *',
    'en enero y febrero, y de junio a agosto, todos los días a las 0:00'],
  ['0 0,1,5-9 * * *',
    'todos los días a las 0:00 y 1:00, y cada hora de 5:00 a 9:00'],
  ['0 0 * * 1,2,4-6', 'los lunes y martes, y de jueves a sábado a las 0:00']
];

export {rows};
