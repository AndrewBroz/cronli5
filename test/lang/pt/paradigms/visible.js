// Portuguese paradigms a renderer's builder may see: one row per grid
// pattern at a visible position.
//
// Written by hand from src/lang/pt/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *',
    'todos os dias às 09:00, repetindo a cada segundo durante o minuto ' +
    'inteiro'],
  ['*/6 0 9 * * *',
    'todos os dias às 09:00, repetindo a cada 6 segundos durante o minuto ' +
    'inteiro'],
  ['5/10 0 9 * * *',
    'todos os dias às 09:00, 6 vezes: 5, 15, 25, 35, 45 e 55 segundos ' +
    'depois'],

  // clock / minute
  ['* 9 * * *', 'todos os dias, a cada minuto das 09:00 às 09:59'],
  ['5,20,45 9 * * *', 'todos os dias às 09:05, 09:20 e 09:45'],
  ['*/15 9 * * *', 'todos os dias às 09:00, 09:15, 09:30 e 09:45'],
  ['0,15,45 9 * * *', 'todos os dias às 09:00, 09:15 e 09:45'],

  // clock / hour
  ['0 * * * *', 'a cada hora, em ponto'],
  ['0 9,17 * * *', 'todos os dias às 09:00 e 17:00'],
  ['0 9-17,22 * * *',
    'todos os dias, a cada hora das 09:00 às 17:00 e às 22:00'],
  ['0 1/2 * * *', 'todos os dias, a cada 2 horas da 01:00 às 23:00'],

  // clock / date
  ['0 9 1 * *', 'no dia 1º de cada mês às 09:00'],
  ['0 9 1,10,20 * *', 'nos dias 1º, 10 e 20 de cada mês às 09:00'],
  ['0 9 */2 * *', 'nos dias ímpares de cada mês às 09:00'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'nos dias ímpares de cada mês, exceto no dia 15, às 09:00'],

  // clock / month
  ['0 9 * 1 *', 'todos os dias de janeiro às 09:00'],
  ['0 9 * 3,6,9,12 *',
    'todos os dias de março, junho, setembro e dezembro às 09:00'],
  ['0 9 * */2 *',
    'todos os dias de janeiro, março, maio, julho, setembro e novembro às ' +
    '09:00'],
  ['0 9 * 11-2 *', 'todos os dias de novembro a fevereiro às 09:00'],

  // clock / weekday
  ['0 9 * * 1', 'todas as segundas às 09:00'],
  ['0 9 * * 1-5', 'de segunda a sexta às 09:00'],
  ['0 9 * * 2,4', 'todas as terças e quintas às 09:00'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 09:00 às 17:45, repetindo a ' +
    'cada segundo durante o minuto inteiro'],
  ['*/6 */15 9-17 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 09:00 às 17:45, repetindo a ' +
    'cada 6 segundos durante o minuto inteiro'],
  ['5/10 */15 9-17 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 09:00 às 17:45, 6 vezes: 5, ' +
    '15, 25, 35, 45 e 55 segundos depois'],

  // window / minute
  ['* 9-17 * * 1-5', 'de segunda a sexta, a cada minuto das 09:00 às 17:59'],
  ['0,30 9-17 * * 1-5',
    'de segunda a sexta, a cada 30 minutos das 09:00 às 17:30'],
  ['0-29,45 9-17 * * 1-5',
    'de segunda a sexta, a cada minuto durante os primeiros 30 minutos e ' +
    'no minuto 45 de cada hora, das 09:00 às 17:45'],
  ['0,15,45 9-17 * * 1-5',
    'de segunda a sexta, nos minutos 0, 15 e 45 de cada hora, das 09:00 às ' +
    '17:45'],

  // window / hour
  ['*/15 * * * 1-5', 'de segunda a sexta, a cada 15 minutos'],
  ['*/15 12 * * 1-5', 'de segunda a sexta às 12:00, 12:15, 12:30 e 12:45'],
  ['*/15 9-17,22 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 09:00 às 17:45 e das 22:00 ' +
    'às 22:45'],
  ['*/15 1/2 * * 1-5',
    'de segunda a sexta, a cada 15 minutos, de 2 em 2 horas (da 01:00 à ' +
    '01:45, das 03:00 às 03:45 … das 23:00 às 23:45)'],

  // window / date
  ['*/15 9-17 1 * 1-5',
    'de segunda a sexta e também no dia 1º de cada mês, sempre a cada 15 ' +
    'minutos das 09:00 às 17:45'],
  ['*/15 9-17 1,10,20 * 1-5',
    'de segunda a sexta e também nos dias 1º, 10 e 20 de cada mês, sempre ' +
    'a cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 */2 * 1-5',
    'nos dias ímpares de cada mês que caem de segunda a sexta, a cada 15 ' +
    'minutos das 09:00 às 17:45'],
  // Neither side of a day of the month and a weekday takes an exception
  // (answers 4.3). This row first said «nos dias ímpares de cada mês,
  // exceto no dia 15», which is read as never firing on the 15th; a 15th
  // from Monday to Friday fires. It then listed all fifteen days, which
  // nobody holds; the odd days on each side of the 15th say the same.
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'de segunda a sexta e também nos dias ímpares do dia 1º ao dia 13 e do ' +
    'dia 17 ao dia 31 de cada mês, sempre a cada 15 minutos das 09:00 às ' +
    '17:45'],

  // window / month
  ['*/15 9-17 * 1 1-5',
    'em janeiro, de segunda a sexta, a cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'em março, junho, setembro e dezembro, de segunda a sexta, a cada 15 ' +
    'minutos das 09:00 às 17:45'],
  ['*/15 9-17 * */2 1-5',
    'em janeiro, março, maio, julho, setembro e novembro, de segunda a ' +
    'sexta, a cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 * 11-2 1-5',
    'de novembro a fevereiro, de segunda a sexta, a cada 15 minutos das ' +
    '09:00 às 17:45'],

  // window / weekday
  ['*/15 9-17 * * *', 'todos os dias, a cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 * * 1,3,5',
    'todas as segundas, quartas e sextas, a cada 15 minutos das 09:00 às ' +
    '17:45'],
  ['*/15 9-17 * * 2,4',
    'todas as terças e quintas, a cada 15 minutos das 09:00 às 17:45'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *',
    'no dia 1º de cada mês às 00:00, repetindo a cada segundo durante o ' +
    'minuto inteiro'],
  ['*/6 0 0 1 * *',
    'no dia 1º de cada mês às 00:00, repetindo a cada 6 segundos durante o ' +
    'minuto inteiro'],
  ['5/10 0 0 1 * *',
    'no dia 1º de cada mês às 00:00, 6 vezes: 5, 15, 25, 35, 45 e 55 ' +
    'segundos depois'],

  // monthly / minute
  ['* 0 1 * *', 'no dia 1º de cada mês, a cada minuto das 00:00 às 00:59'],
  ['5,20,45 0 1 * *', 'no dia 1º de cada mês às 00:05, 00:20 e 00:45'],
  ['*/15 0 1 * *', 'no dia 1º de cada mês às 00:00, 00:15, 00:30 e 00:45'],
  ['0,15,45 0 1 * *', 'no dia 1º de cada mês às 00:00, 00:15 e 00:45'],

  // monthly / hour
  ['0 * 1 * *', 'no dia 1º de cada mês, a cada hora, em ponto'],
  ['0 9,17 1 * *', 'no dia 1º de cada mês às 09:00 e 17:00'],
  ['0 9-17,22 1 * *',
    'no dia 1º de cada mês, a cada hora das 09:00 às 17:00 e às 22:00'],
  ['0 1/2 1 * *', 'no dia 1º de cada mês, a cada 2 horas da 01:00 às 23:00'],

  // monthly / date
  ['0 0 * * *', 'todos os dias às 00:00'],
  ['0 0 1,10,20 * *', 'nos dias 1º, 10 e 20 de cada mês às 00:00'],
  ['0 0 */2 * *', 'nos dias ímpares de cada mês às 00:00'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'nos dias ímpares de cada mês, exceto no dia 15, às 00:00'],

  // monthly / month
  ['0 0 1 1 *', 'no dia 1º de janeiro às 00:00'],
  ['0 0 1 3,6,9,12 *',
    'no dia 1º de março, junho, setembro e dezembro às 00:00'],
  ['0 0 1 */2 *',
    'no dia 1º de janeiro, março, maio, julho, setembro e novembro às 00:00'],
  ['0 0 1 11-2 *',
    'no dia 1º de novembro, dezembro, janeiro e fevereiro às 00:00'],

  // monthly / weekday
  ['0 0 1 * 1',
    'todas as segundas e também no dia 1º de cada mês, sempre às 00:00'],
  ['0 0 1 * 1-5',
    'de segunda a sexta e também no dia 1º de cada mês, sempre às 00:00'],
  ['0 0 1 * 2,4',
    'todas as terças e quintas e também no dia 1º de cada mês, sempre às ' +
    '00:00'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'a cada segundo'],
  ['*/6 * * * * *', 'a cada 6 segundos'],
  ['5/10 * * * * *', 'nos segundos 5, 15, 25, 35, 45 e 55 de cada minuto'],

  // open / minute
  ['5,20,45 * * * *', 'nos minutos 5, 20 e 45 de cada hora'],
  ['*/15 * * * *', 'a cada 15 minutos'],
  ['0,15,45 * * * *', 'nos minutos 0, 15 e 45 de cada hora'],

  // open / hour
  ['* 0 * * *', 'todos os dias, a cada minuto das 00:00 às 00:59'],
  ['* 9,17 * * *',
    'todos os dias, a cada minuto das 09:00 às 09:59 e das 17:00 às 17:59'],
  ['* 9-17,22 * * *',
    'todos os dias, a cada minuto das 09:00 às 17:59 e das 22:00 às 22:59'],
  ['* 1/2 * * *',
    'todos os dias, a cada minuto, de 2 em 2 horas (da 01:00 à 01:59, das ' +
    '03:00 às 03:59 … das 23:00 às 23:59)'],

  // open / date
  ['* * 1 * *', 'no dia 1º de cada mês, a cada minuto'],
  ['* * 1,10,20 * *', 'nos dias 1º, 10 e 20 de cada mês, a cada minuto'],
  ['* * */2 * *', 'nos dias ímpares de cada mês, a cada minuto'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'nos dias ímpares de cada mês, exceto no dia 15, a cada minuto'],

  // open / month
  ['* * * 1 *', 'todos os dias de janeiro, a cada minuto'],
  ['* * * 3,6,9,12 *',
    'todos os dias de março, junho, setembro e dezembro, a cada minuto'],
  ['* * * */2 *',
    'todos os dias de janeiro, março, maio, julho, setembro e novembro, a ' +
    'cada minuto'],
  ['* * * 11-2 *', 'todos os dias de novembro a fevereiro, a cada minuto'],

  // open / weekday
  ['* * * * 1', 'todas as segundas, a cada minuto'],
  ['* * * * 1-5', 'de segunda a sexta, a cada minuto'],
  ['* * * * 2,4', 'todas as terças e quintas, a cada minuto']
];

export {rows};
