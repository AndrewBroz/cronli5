// Portuguese paradigms held out from a renderer's builder: one row per grid
// pattern at a held-out position. They judge whether a renderer built from
// the answers, the lexicon and the visible rows says what a speaker would.
//
// Written by hand from src/lang/pt/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['30 0 9 * * *', 'todos os dias às 09:00:30'],
  ['0,30 0 9 * * *', 'todos os dias às 09:00:00 e 09:00:30'],
  ['*/15 0 9 * * *',
    'todos os dias às 09:00:00, 09:00:15, 09:00:30 e 09:00:45'],
  ['0-9 0 9 * * *',
    'todos os dias às 09:00, repetindo a cada segundo durante os primeiros ' +
    '10 segundos'],

  // clock / minute
  ['30 9 * * *', 'todos os dias às 09:30'],
  ['0,30 9 * * *', 'todos os dias às 09:00 e 09:30'],
  ['0-29 9 * * *', 'todos os dias, a cada minuto das 09:00 às 09:29'],
  ['0-29,45 9 * * *',
    'todos os dias, a cada minuto das 09:00 às 09:29 e às 09:45'],
  ['*/7 9 * * *', 'todos os dias, a cada 7 minutos das 09:00 às 09:56'],
  ['5/15 9 * * *', 'todos os dias às 09:05, 09:20, 09:35 e 09:50'],
  ['10-40/10 9 * * *', 'todos os dias às 09:10, 09:20, 09:30 e 09:40'],

  // clock / hour
  ['0 12 * * *', 'todos os dias às 12:00'],
  ['0 8,12,18 * * *', 'todos os dias às 08:00, 12:00 e 18:00'],
  ['0 9-17 * * *', 'todos os dias, a cada hora das 09:00 às 17:00'],
  ['0 */2 * * *', 'todos os dias, a cada 2 horas das 00:00 às 22:00'],
  ['0 */6 * * *', 'todos os dias às 00:00, 06:00, 12:00 e 18:00'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'todos os dias, a cada 2 horas das 00:00 às 22:00, exceto às 08:00'],
  ['0 22-2 * * *', 'todos os dias, a cada hora das 22:00 às 02:00'],

  // clock / date
  ['0 9 15 * *', 'no dia 15 de cada mês às 09:00'],
  ['0 9 1,15 * *', 'nos dias 1º e 15 de cada mês às 09:00'],
  ['0 9 1-7 * *', 'do dia 1º ao dia 7 de cada mês às 09:00'],
  ['0 9 1-7,15 * *', 'do dia 1º ao dia 7 e no dia 15 de cada mês às 09:00'],
  ['0 9 2/2 * *', 'nos dias pares de cada mês às 09:00'],
  ['0 9 */5 * *', 'nos dias 1º, 6, 11, 16, 21, 26 e 31 de cada mês às 09:00'],
  ['0 9 L * *', 'no último dia de cada mês às 09:00'],
  ['0 9 15W * *',
    'no dia 15 de cada mês ou, se cair num sábado ou domingo, no dia de ' +
    'semana mais próximo, às 09:00'],

  // clock / month
  ['0 9 * 6 *', 'todos os dias de junho às 09:00'],
  ['0 9 * 1,7 *', 'todos os dias de janeiro e julho às 09:00'],
  ['0 9 * 6-8 *', 'todos os dias de junho a agosto às 09:00'],
  ['0 9 * 6-8,12 *', 'todos os dias de junho a agosto e de dezembro às 09:00'],
  ['0 9 * */3 *', 'todos os dias de janeiro, abril, julho e outubro às 09:00'],
  ['0 9 * 1-11 *', 'todos os dias de janeiro a novembro às 09:00'],

  // clock / weekday
  ['0 9 * * 0', 'todos os domingos às 09:00'],
  ['0 9 * * 1,3,5', 'todas as segundas, quartas e sextas às 09:00'],
  ['0 9 * * 0,6', 'todos os sábados e domingos às 09:00'],
  ['0 9 * * 1-6', 'de segunda a sábado às 09:00'],
  ['0 9 * * 5L', 'na última sexta-feira de cada mês às 09:00'],
  ['0 9 * * 1#2', 'na segunda segunda-feira de cada mês às 09:00'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 09:00:30 às 17:45:30'],
  ['0,30 */15 9-17 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 09:00 às 17:45, 2 vezes: no ' +
    'horário exato e 30 segundos depois'],
  ['*/15 */15 9-17 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 09:00 às 17:45, repetindo a ' +
    'cada 15 segundos durante o minuto inteiro'],
  ['0-9 */15 9-17 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 09:00 às 17:45, repetindo a ' +
    'cada segundo durante os primeiros 10 segundos'],

  // window / minute
  ['0 9-17 * * 1-5', 'de segunda a sexta, a cada hora das 09:00 às 17:00'],
  ['30 9-17 * * 1-5', 'de segunda a sexta, a cada hora das 09:30 às 17:30'],
  ['5,20,45 9-17 * * 1-5',
    'de segunda a sexta, nos minutos 5, 20 e 45 de cada hora, das 09:05 às ' +
    '17:45'],
  ['0-29 9-17 * * 1-5',
    'de segunda a sexta, a cada minuto durante os primeiros 30 minutos de ' +
    'cada hora, das 09:00 às 17:29'],
  ['*/7 9-17 * * 1-5',
    'de segunda a sexta, a cada 7 minutos, do minuto 0 ao 56 de cada hora, ' +
    'das 09:00 às 17:56'],
  ['5/15 9-17 * * 1-5',
    'de segunda a sexta, nos minutos 5, 20, 35 e 50 de cada hora, das ' +
    '09:05 às 17:50'],
  ['10-40/10 9-17 * * 1-5',
    'de segunda a sexta, nos minutos 10, 20, 30 e 40 de cada hora, das ' +
    '09:10 às 17:40'],

  // window / hour
  ['*/15 0 * * 1-5', 'de segunda a sexta às 00:00, 00:15, 00:30 e 00:45'],
  ['*/15 9 * * 1-5', 'de segunda a sexta às 09:00, 09:15, 09:30 e 09:45'],
  ['*/15 9,17 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 09:00 às 09:45 e das 17:00 ' +
    'às 17:45'],
  ['*/15 8,12,18 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 08:00 às 08:45, das 12:00 ' +
    'às 12:45 e das 18:00 às 18:45'],
  ['*/15 */2 * * 1-5',
    'de segunda a sexta, a cada 15 minutos, de 2 em 2 horas (das 00:00 às ' +
    '00:45, das 02:00 às 02:45 … das 22:00 às 22:45)'],
  ['*/15 */6 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 00:00 às 00:45, das 06:00 ' +
    'às 06:45, das 12:00 às 12:45 e das 18:00 às 18:45'],
  ['*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5',
    'de segunda a sexta, a cada 15 minutos, de 2 em 2 horas (das 00:00 às ' +
    '00:45, das 02:00 às 02:45 … das 22:00 às 22:45), exceto das 08:00 às ' +
    '08:59'],
  ['*/15 22-2 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 00:00 às 02:45 e das 22:00 ' +
    'às 23:45'],

  // window / date
  ['*/15 9-17 15 * 1-5',
    'de segunda a sexta e também no dia 15 de cada mês, sempre a cada 15 ' +
    'minutos das 09:00 às 17:45'],
  ['*/15 9-17 1,15 * 1-5',
    'de segunda a sexta e também nos dias 1º e 15 de cada mês, sempre a ' +
    'cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 1-7 * 1-5',
    'de segunda a sexta e também do dia 1º ao dia 7 de cada mês, sempre a ' +
    'cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 1-7,15 * 1-5',
    'de segunda a sexta e também do dia 1º ao dia 7 e no dia 15 de cada ' +
    'mês, sempre a cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 2/2 * 1-5',
    'de segunda a sexta e também nos dias pares de cada mês, sempre a cada ' +
    '15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 */5 * 1-5',
    'de segunda a sexta e também nos dias 1º, 6, 11, 16, 21, 26 e 31 de ' +
    'cada mês, sempre a cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 L * 1-5',
    'de segunda a sexta e também no último dia de cada mês, sempre a cada ' +
    '15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 15W * 1-5',
    'de segunda a sexta e também no dia 15 de cada mês ou, se cair num ' +
    'sábado ou domingo, no dia de semana mais próximo, sempre a cada 15 ' +
    'minutos das 09:00 às 17:45'],

  // window / month
  ['*/15 9-17 * 6 1-5',
    'em junho, de segunda a sexta, a cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 * 1,7 1-5',
    'em janeiro e julho, de segunda a sexta, a cada 15 minutos das 09:00 ' +
    'às 17:45'],
  ['*/15 9-17 * 6-8 1-5',
    'de junho a agosto, de segunda a sexta, a cada 15 minutos das 09:00 às ' +
    '17:45'],
  ['*/15 9-17 * 6-8,12 1-5',
    'de junho a agosto e em dezembro, de segunda a sexta, a cada 15 ' +
    'minutos das 09:00 às 17:45'],
  ['*/15 9-17 * */3 1-5',
    'em janeiro, abril, julho e outubro, de segunda a sexta, a cada 15 ' +
    'minutos das 09:00 às 17:45'],
  ['*/15 9-17 * 1-11 1-5',
    'de janeiro a novembro, de segunda a sexta, a cada 15 minutos das ' +
    '09:00 às 17:45'],

  // window / weekday
  ['*/15 9-17 * * 1',
    'todas as segundas, a cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 * * 0',
    'todos os domingos, a cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 * * 0,6',
    'todos os sábados e domingos, a cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 * * 1-6',
    'de segunda a sábado, a cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 * * 5L',
    'na última sexta-feira de cada mês, a cada 15 minutos das 09:00 às ' +
    '17:45'],
  ['*/15 9-17 * * 1#2',
    'na segunda segunda-feira de cada mês, a cada 15 minutos das 09:00 às ' +
    '17:45'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', 'no dia 1º de cada mês às 00:00:30'],
  ['0,30 0 0 1 * *', 'no dia 1º de cada mês às 00:00:00 e 00:00:30'],
  ['*/15 0 0 1 * *',
    'no dia 1º de cada mês às 00:00:00, 00:00:15, 00:00:30 e 00:00:45'],
  ['0-9 0 0 1 * *',
    'no dia 1º de cada mês às 00:00, repetindo a cada segundo durante os ' +
    'primeiros 10 segundos'],

  // monthly / minute
  ['30 0 1 * *', 'no dia 1º de cada mês às 00:30'],
  ['0,30 0 1 * *', 'no dia 1º de cada mês às 00:00 e 00:30'],
  ['0-29 0 1 * *', 'no dia 1º de cada mês, a cada minuto das 00:00 às 00:29'],
  ['0-29,45 0 1 * *',
    'no dia 1º de cada mês, a cada minuto das 00:00 às 00:29 e às 00:45'],
  ['*/7 0 1 * *', 'no dia 1º de cada mês, a cada 7 minutos das 00:00 às 00:56'],
  ['5/15 0 1 * *', 'no dia 1º de cada mês às 00:05, 00:20, 00:35 e 00:50'],
  ['10-40/10 0 1 * *', 'no dia 1º de cada mês às 00:10, 00:20, 00:30 e 00:40'],

  // monthly / hour
  ['0 12 1 * *', 'no dia 1º de cada mês às 12:00'],
  ['0 8,12,18 1 * *', 'no dia 1º de cada mês às 08:00, 12:00 e 18:00'],
  ['0 9-17 1 * *', 'no dia 1º de cada mês, a cada hora das 09:00 às 17:00'],
  ['0 */2 1 * *', 'no dia 1º de cada mês, a cada 2 horas das 00:00 às 22:00'],
  ['0 */6 1 * *', 'no dia 1º de cada mês às 00:00, 06:00, 12:00 e 18:00'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * *',
    'no dia 1º de cada mês, a cada 2 horas das 00:00 às 22:00, exceto às ' +
    '08:00'],
  ['0 22-2 1 * *',
    'no dia 1º de cada mês, a cada hora das 00:00 às 02:00 e às 22:00 e ' +
    '23:00'],

  // monthly / date
  ['0 0 15 * *', 'no dia 15 de cada mês às 00:00'],
  ['0 0 1,15 * *', 'nos dias 1º e 15 de cada mês às 00:00'],
  ['0 0 1-7 * *', 'do dia 1º ao dia 7 de cada mês às 00:00'],
  ['0 0 1-7,15 * *', 'do dia 1º ao dia 7 e no dia 15 de cada mês às 00:00'],
  ['0 0 2/2 * *', 'nos dias pares de cada mês às 00:00'],
  ['0 0 */5 * *', 'nos dias 1º, 6, 11, 16, 21, 26 e 31 de cada mês às 00:00'],
  ['0 0 L * *', 'no último dia de cada mês às 00:00'],
  ['0 0 15W * *',
    'no dia 15 de cada mês ou, se cair num sábado ou domingo, no dia de ' +
    'semana mais próximo, às 00:00'],

  // monthly / month
  ['0 0 1 6 *', 'no dia 1º de junho às 00:00'],
  ['0 0 1 1,7 *', 'no dia 1º de janeiro e de julho às 00:00'],
  ['0 0 1 6-8 *', 'no dia 1º de junho, julho e agosto às 00:00'],
  ['0 0 1 6-8,12 *', 'no dia 1º de junho, julho, agosto e dezembro às 00:00'],
  ['0 0 1 */3 *', 'no dia 1º de janeiro, abril, julho e outubro às 00:00'],
  ['0 0 1 1-11 *', 'no dia 1º dos meses de janeiro a novembro às 00:00'],

  // monthly / weekday
  ['0 0 1 * 0',
    'todos os domingos e também no dia 1º de cada mês, sempre às 00:00'],
  ['0 0 1 * 1,3,5',
    'todas as segundas, quartas e sextas e também no dia 1º de cada mês, ' +
    'sempre às 00:00'],
  ['0 0 1 * 0,6',
    'todos os sábados e domingos e também no dia 1º de cada mês, sempre às ' +
    '00:00'],
  ['0 0 1 * 1-6',
    'de segunda a sábado e também no dia 1º de cada mês, sempre às 00:00'],
  ['0 0 1 * 5L',
    'na última sexta-feira de cada mês e também no dia 1º de cada mês, ' +
    'sempre às 00:00'],
  ['0 0 1 * 1#2',
    'na segunda segunda-feira de cada mês e também no dia 1º de cada mês, ' +
    'sempre às 00:00'],

  // open / second — context `* * * * *`
  ['30 * * * * *', 'no segundo 30 de cada minuto'],
  ['0,30 * * * * *', 'a cada 30 segundos'],
  ['*/15 * * * * *', 'a cada 15 segundos'],
  ['0-9 * * * * *',
    'a cada segundo durante os primeiros 10 segundos de cada minuto'],

  // open / minute
  ['30 * * * *', 'no minuto 30 de cada hora'],
  ['0,30 * * * *', 'a cada 30 minutos'],
  ['0-29 * * * *',
    'a cada minuto durante os primeiros 30 minutos de cada hora'],
  ['0-29,45 * * * *',
    'a cada minuto durante os primeiros 30 minutos e no minuto 45 de cada ' +
    'hora'],
  ['*/7 * * * *', 'a cada 7 minutos, do minuto 0 ao 56 de cada hora'],
  ['5/15 * * * *', 'nos minutos 5, 20, 35 e 50 de cada hora'],
  ['10-40/10 * * * *', 'nos minutos 10, 20, 30 e 40 de cada hora'],

  // open / hour
  ['* 12 * * *', 'todos os dias, a cada minuto das 12:00 às 12:59'],
  ['* 8,12,18 * * *',
    'todos os dias, a cada minuto das 08:00 às 08:59, das 12:00 às 12:59 e ' +
    'das 18:00 às 18:59'],
  ['* 9-17 * * *', 'todos os dias, a cada minuto das 09:00 às 17:59'],
  ['* */2 * * *',
    'todos os dias, a cada minuto, de 2 em 2 horas (das 00:00 às 00:59, ' +
    'das 02:00 às 02:59 … das 22:00 às 22:59)'],
  ['* */6 * * *',
    'todos os dias, a cada minuto das 00:00 às 00:59, das 06:00 às 06:59, ' +
    'das 12:00 às 12:59 e das 18:00 às 18:59'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'todos os dias, a cada minuto, de 2 em 2 horas (das 00:00 às 00:59, ' +
    'das 02:00 às 02:59 … das 22:00 às 22:59), exceto das 08:00 às 08:59'],
  ['* 22-2 * * *', 'todos os dias, a cada minuto das 22:00 às 02:59'],

  // open / date
  ['* * 15 * *', 'no dia 15 de cada mês, a cada minuto'],
  ['* * 1,15 * *', 'nos dias 1º e 15 de cada mês, a cada minuto'],
  ['* * 1-7 * *', 'do dia 1º ao dia 7 de cada mês, a cada minuto'],
  ['* * 1-7,15 * *',
    'do dia 1º ao dia 7 e no dia 15 de cada mês, a cada minuto'],
  ['* * 2/2 * *', 'nos dias pares de cada mês, a cada minuto'],
  ['* * */5 * *',
    'nos dias 1º, 6, 11, 16, 21, 26 e 31 de cada mês, a cada minuto'],
  ['* * L * *', 'no último dia de cada mês, a cada minuto'],
  ['* * 15W * *',
    'no dia 15 de cada mês ou, se cair num sábado ou domingo, no dia de ' +
    'semana mais próximo, a cada minuto'],

  // open / month
  ['* * * 6 *', 'todos os dias de junho, a cada minuto'],
  ['* * * 1,7 *', 'todos os dias de janeiro e julho, a cada minuto'],
  ['* * * 6-8 *', 'todos os dias de junho a agosto, a cada minuto'],
  ['* * * 6-8,12 *',
    'todos os dias de junho a agosto e de dezembro, a cada minuto'],
  ['* * * */3 *',
    'todos os dias de janeiro, abril, julho e outubro, a cada minuto'],
  ['* * * 1-11 *', 'todos os dias de janeiro a novembro, a cada minuto'],

  // open / weekday
  ['* * * * 0', 'todos os domingos, a cada minuto'],
  ['* * * * 1,3,5', 'todas as segundas, quartas e sextas, a cada minuto'],
  ['* * * * 0,6', 'todos os sábados e domingos, a cada minuto'],
  ['* * * * 1-6', 'de segunda a sábado, a cada minuto'],
  ['* * * * 5L', 'na última sexta-feira de cada mês, a cada minuto'],
  ['* * * * 1#2', 'na segunda segunda-feira de cada mês, a cada minuto']
];

export {rows};
