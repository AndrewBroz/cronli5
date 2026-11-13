// Portuguese paradigms a renderer's builder may see: one row per grid
// pattern at a visible position.
//
// Written by hand from src/lang/pt/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *', 'a cada segundo das 09:00:00 às 09:00:59 todos os dias'],
  ['*/6 0 9 * * *', 'a cada 6 segundos das 09:00:00 às 09:00:54 todos os dias'],
  ['5/10 0 9 * * *',
    'a cada 10 segundos das 09:00:05 às 09:00:55 todos os dias'],

  // clock / minute
  ['* 9 * * *', 'a cada minuto das 09:00 às 09:59 todos os dias'],
  ['5,20,45 9 * * *', 'às 09:05, 09:20 e 09:45 todos os dias'],
  ['*/15 9 * * *', 'a cada 15 minutos das 09:00 às 09:45 todos os dias'],
  ['0,15,45 9 * * *', 'às 09:00, 09:15 e 09:45 todos os dias'],

  // clock / hour
  ['0 * * * *', 'a cada hora'],
  ['0 9,17 * * *', 'às 09:00 e 17:00 todos os dias'],
  ['0 9-17,22 * * *',
    'a cada hora das 09:00 às 17:00 e às 22:00 todos os dias'],
  ['0 1/2 * * *', 'a cada 2 horas da 01:00 às 23:00 todos os dias'],

  // clock / date
  ['0 9 1 * *', 'às 09:00 no dia 1º de cada mês'],
  ['0 9 1,10,20 * *', 'às 09:00 nos dias 1º, 10 e 20 de cada mês'],
  ['0 9 */2 * *', 'às 09:00 nos dias ímpares de cada mês'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'às 09:00 nos dias ímpares de cada mês, exceto no dia 15'],

  // clock / month
  ['0 9 * 1 *', 'às 09:00 todos os dias em janeiro'],
  ['0 9 * 3,6,9,12 *',
    'às 09:00 todos os dias em março, junho, setembro e dezembro'],
  ['0 9 * */2 *', 'às 09:00 todos os dias nos meses ímpares'],
  ['0 9 * 11-2 *', 'às 09:00 todos os dias de novembro a fevereiro'],

  // clock / weekday
  ['0 9 * * 1', 'às 09:00 todas as segundas'],
  ['0 9 * * 1-5', 'às 09:00 de segunda a sexta'],
  ['0 9 * * 2,4', 'às 09:00 todas as terças e quintas'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'a cada segundo durante um minuto a cada 15 minutos das 09:00:00 às ' +
    '17:45:59 de segunda a sexta'],
  ['*/6 */15 9-17 * * 1-5',
    'a cada 6 segundos durante um minuto a cada 15 minutos das 09:00:00 às ' +
    '17:45:54 de segunda a sexta'],
  ['5/10 */15 9-17 * * 1-5',
    'a cada 10 segundos do segundo 5 ao 55 a cada 15 minutos das 09:00 às ' +
    '17:45 de segunda a sexta'],

  // window / minute
  ['* 9-17 * * 1-5', 'a cada minuto das 09:00 às 17:59 de segunda a sexta'],
  ['0,30 9-17 * * 1-5',
    'a cada 30 minutos das 09:00 às 17:30 de segunda a sexta'],
  ['0-29,45 9-17 * * 1-5',
    'a cada minuto durante os primeiros 30 minutos e no minuto 45 de cada ' +
    'hora das 09:00 às 17:45 de segunda a sexta'],
  ['0,15,45 9-17 * * 1-5',
    'nos minutos 0, 15 e 45 de cada hora das 09:00 às 17:45 de segunda a ' +
    'sexta'],

  // window / hour
  ['*/15 * * * 1-5', 'a cada 15 minutos de segunda a sexta'],
  ['*/15 12 * * 1-5',
    'a cada 15 minutos das 12:00 às 12:45 de segunda a sexta'],
  ['*/15 9-17,22 * * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 e das 22:00 às 22:45 de segunda ' +
    'a sexta'],
  ['*/15 1/2 * * 1-5',
    'a cada 15 minutos durante as horas ímpares de segunda a sexta'],

  // window / date
  ['*/15 9-17 1 * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 no dia 1º de cada mês, e também ' +
    'de segunda a sexta'],
  ['*/15 9-17 1,10,20 * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 nos dias 1º, 10 e 20 de cada ' +
    'mês, e também de segunda a sexta'],
  ['*/15 9-17 */2 * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 nos dias ímpares de cada mês, e ' +
    'também de segunda a sexta'],
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 nos dias ímpares de cada mês, ' +
    'exceto no dia 15, e também de segunda a sexta'],

  // window / month
  ['*/15 9-17 * 1 1-5',
    'a cada 15 minutos das 09:00 às 17:45 de segunda a sexta em janeiro'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'a cada 15 minutos das 09:00 às 17:45 de segunda a sexta em março, ' +
    'junho, setembro e dezembro'],
  ['*/15 9-17 * */2 1-5',
    'a cada 15 minutos das 09:00 às 17:45 de segunda a sexta nos meses ' +
    'ímpares'],
  ['*/15 9-17 * 11-2 1-5',
    'a cada 15 minutos das 09:00 às 17:45 de segunda a sexta de novembro a ' +
    'fevereiro'],

  // window / weekday
  ['*/15 9-17 * * *', 'a cada 15 minutos das 09:00 às 17:45 todos os dias'],
  ['*/15 9-17 * * 1,3,5',
    'a cada 15 minutos das 09:00 às 17:45 todas as segundas, quartas e ' +
    'sextas'],
  ['*/15 9-17 * * 2,4',
    'a cada 15 minutos das 09:00 às 17:45 todas as terças e quintas'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *',
    'a cada segundo das 00:00:00 às 00:00:59 no dia 1º de cada mês'],
  ['*/6 0 0 1 * *',
    'a cada 6 segundos das 00:00:00 às 00:00:54 no dia 1º de cada mês'],
  ['5/10 0 0 1 * *',
    'a cada 10 segundos das 00:00:05 às 00:00:55 no dia 1º de cada mês'],

  // monthly / minute
  ['* 0 1 * *', 'a cada minuto das 00:00 às 00:59 no dia 1º de cada mês'],
  ['5,20,45 0 1 * *', 'às 00:05, 00:20 e 00:45 no dia 1º de cada mês'],
  ['*/15 0 1 * *',
    'a cada 15 minutos das 00:00 às 00:45 no dia 1º de cada mês'],
  ['0,15,45 0 1 * *', 'às 00:00, 00:15 e 00:45 no dia 1º de cada mês'],

  // monthly / hour
  ['0 * 1 * *', 'a cada hora no dia 1º de cada mês'],
  ['0 9,17 1 * *', 'às 09:00 e 17:00 no dia 1º de cada mês'],
  ['0 9-17,22 1 * *',
    'a cada hora das 09:00 às 17:00 e às 22:00 no dia 1º de cada mês'],
  ['0 1/2 1 * *', 'a cada 2 horas da 01:00 às 23:00 no dia 1º de cada mês'],

  // monthly / date
  ['0 0 * * *', 'às 00:00 todos os dias'],
  ['0 0 1,10,20 * *', 'às 00:00 nos dias 1º, 10 e 20 de cada mês'],
  ['0 0 */2 * *', 'às 00:00 nos dias ímpares de cada mês'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'às 00:00 nos dias ímpares de cada mês, exceto no dia 15'],

  // monthly / month
  ['0 0 1 1 *', 'às 00:00 no dia 1º de janeiro'],
  ['0 0 1 3,6,9,12 *',
    'às 00:00 no dia 1º de março, junho, setembro e dezembro'],
  ['0 0 1 */2 *', 'às 00:00 no dia 1º dos meses ímpares'],
  ['0 0 1 11-2 *', 'às 00:00 no dia 1º de cada mês, de novembro a fevereiro'],

  // monthly / weekday
  ['0 0 1 * 1', 'às 00:00 no dia 1º de cada mês, e também todas as segundas'],
  ['0 0 1 * 1-5',
    'às 00:00 no dia 1º de cada mês, e também de segunda a sexta'],
  ['0 0 1 * 2,4',
    'às 00:00 no dia 1º de cada mês, e também todas as terças e quintas'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'a cada segundo'],
  ['*/6 * * * * *', 'a cada 6 segundos'],
  ['5/10 * * * * *', 'a cada 10 segundos do segundo 5 ao 55 de cada minuto'],

  // open / minute
  ['5,20,45 * * * *', 'nos minutos 5, 20 e 45 de cada hora'],
  ['*/15 * * * *', 'a cada 15 minutos'],
  ['0,15,45 * * * *', 'nos minutos 0, 15 e 45 de cada hora'],

  // open / hour
  ['* 0 * * *', 'a cada minuto das 00:00 às 00:59 todos os dias'],
  ['* 9,17 * * *',
    'a cada minuto das 09:00 às 09:59 e das 17:00 às 17:59 todos os dias'],
  ['* 9-17,22 * * *',
    'a cada minuto das 09:00 às 17:59 e das 22:00 às 22:59 todos os dias'],
  ['* 1/2 * * *', 'a cada minuto durante as horas ímpares'],

  // open / date
  ['* * 1 * *', 'a cada minuto no dia 1º de cada mês'],
  ['* * 1,10,20 * *', 'a cada minuto nos dias 1º, 10 e 20 de cada mês'],
  ['* * */2 * *', 'a cada minuto nos dias ímpares de cada mês'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'a cada minuto nos dias ímpares de cada mês, exceto no dia 15'],

  // open / month
  ['* * * 1 *', 'a cada minuto em janeiro'],
  ['* * * 3,6,9,12 *', 'a cada minuto em março, junho, setembro e dezembro'],
  ['* * * */2 *', 'a cada minuto nos meses ímpares'],
  ['* * * 11-2 *', 'a cada minuto de novembro a fevereiro'],

  // open / weekday
  ['* * * * 1', 'a cada minuto todas as segundas'],
  ['* * * * 1-5', 'a cada minuto de segunda a sexta'],
  ['* * * * 2,4', 'a cada minuto todas as terças e quintas']
];

export {rows};
