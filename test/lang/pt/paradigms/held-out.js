// Portuguese paradigms held out from a renderer's builder: one row per grid
// pattern at a held-out position. They judge whether a renderer built from
// the answers, the lexicon and the visible rows says what a speaker would.
//
// Written by hand from src/lang/pt/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['30 0 9 * * *', 'às 09:00:30 todos os dias'],
  ['0,30 0 9 * * *', 'às 09:00:00 e 09:00:30 todos os dias'],
  ['*/15 0 9 * * *',
    'a cada 15 segundos das 09:00:00 às 09:00:45 todos os dias'],
  ['0-9 0 9 * * *', 'a cada segundo das 09:00:00 às 09:00:09 todos os dias'],

  // clock / minute
  ['30 9 * * *', 'às 09:30 todos os dias'],
  ['0,30 9 * * *', 'às 09:00 e 09:30 todos os dias'],
  ['0-29 9 * * *', 'a cada minuto das 09:00 às 09:29 todos os dias'],
  ['0-29,45 9 * * *',
    'a cada minuto das 09:00 às 09:29 e às 09:45 todos os dias'],
  ['*/7 9 * * *', 'a cada 7 minutos das 09:00 às 09:56 todos os dias'],
  ['5/15 9 * * *', 'às 09:05, 09:20, 09:35 e 09:50 todos os dias'],
  ['10-40/10 9 * * *', 'às 09:10, 09:20, 09:30 e 09:40 todos os dias'],

  // clock / hour
  ['0 12 * * *', 'às 12:00 todos os dias'],
  ['0 8,12,18 * * *', 'às 08:00, 12:00 e 18:00 todos os dias'],
  ['0 9-17 * * *', 'a cada hora das 09:00 às 17:00 todos os dias'],
  ['0 */2 * * *', 'a cada 2 horas'],
  ['0 */6 * * *', 'a cada 6 horas'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 * * *', 'a cada 2 horas, exceto às 08:00'],
  ['0 22-2 * * *', 'a cada hora das 22:00 às 02:00 todos os dias'],

  // clock / date
  ['0 9 15 * *', 'às 09:00 no dia 15 de cada mês'],
  ['0 9 1,15 * *', 'às 09:00 nos dias 1º e 15 de cada mês'],
  ['0 9 1-7 * *', 'às 09:00 nos dias 1º a 7 de cada mês'],
  ['0 9 1-7,15 * *', 'às 09:00 nos dias 1º a 7 e no dia 15 de cada mês'],
  ['0 9 2/2 * *', 'às 09:00 nos dias pares de cada mês'],
  ['0 9 */5 * *', 'às 09:00 de 5 em 5 dias a partir do dia 1º de cada mês'],
  ['0 9 L * *', 'às 09:00 no último dia de cada mês'],
  ['0 9 15W * *',
    'às 09:00 no dia de semana (segunda a sexta) mais próximo do dia 15 de ' +
    'cada mês'],

  // clock / month
  ['0 9 * 6 *', 'às 09:00 todos os dias em junho'],
  ['0 9 * 1,7 *', 'às 09:00 todos os dias em janeiro e julho'],
  ['0 9 * 6-8 *', 'às 09:00 todos os dias, de junho a agosto'],
  ['0 9 * 6-8,12 *', 'às 09:00 todos os dias, de junho a agosto e em dezembro'],
  ['0 9 * */3 *', 'às 09:00 todos os dias em janeiro, abril, julho e outubro'],
  ['0 9 * 1-11 *', 'às 09:00 todos os dias, de janeiro a novembro'],

  // clock / weekday
  ['0 9 * * 0', 'às 09:00 todos os domingos'],
  ['0 9 * * 1,3,5', 'às 09:00 todas as segundas, quartas e sextas'],
  ['0 9 * * 0,6', 'às 09:00 todos os sábados e domingos'],
  ['0 9 * * 1-6', 'às 09:00 de segunda a sábado'],
  ['0 9 * * 5L', 'às 09:00 na última sexta-feira de cada mês'],
  ['0 9 * * 1#2', 'às 09:00 na segunda segunda-feira de cada mês'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'a cada 15 minutos das 09:00:30 às 17:45:30 de segunda a sexta'],
  ['0,30 */15 9-17 * * 1-5',
    'nos segundos 0 e 30 a cada 15 minutos das 09:00:00 às 17:45:30 de ' +
    'segunda a sexta'],
  ['*/15 */15 9-17 * * 1-5',
    'a cada 15 segundos durante um minuto a cada 15 minutos das 09:00:00 ' +
    'às 17:45:45 de segunda a sexta'],
  ['0-9 */15 9-17 * * 1-5',
    'a cada segundo durante os primeiros 10 segundos de um minuto a cada ' +
    '15 minutos das 09:00:00 às 17:45:09 de segunda a sexta'],

  // window / minute
  ['0 9-17 * * 1-5', 'a cada hora das 09:00 às 17:00 de segunda a sexta'],
  ['30 9-17 * * 1-5', 'a cada hora das 09:30 às 17:30 de segunda a sexta'],
  ['5,20,45 9-17 * * 1-5',
    'nos minutos 5, 20 e 45 de cada hora das 09:05 às 17:45 de segunda a ' +
    'sexta'],
  ['0-29 9-17 * * 1-5',
    'a cada minuto durante os primeiros 30 minutos de cada hora das 09:00 ' +
    'às 17:29 de segunda a sexta'],
  ['*/7 9-17 * * 1-5',
    'a cada 7 minutos do minuto 0 ao 56 de cada hora das 09:00 às 17:56 de ' +
    'segunda a sexta'],
  ['5/15 9-17 * * 1-5',
    'nos minutos 5, 20, 35 e 50 de cada hora das 09:05 às 17:50 de segunda ' +
    'a sexta'],
  ['10-40/10 9-17 * * 1-5',
    'nos minutos 10, 20, 30 e 40 de cada hora das 09:10 às 17:40 de ' +
    'segunda a sexta'],

  // window / hour
  ['*/15 0 * * 1-5', 'a cada 15 minutos das 00:00 às 00:45 de segunda a sexta'],
  ['*/15 9 * * 1-5', 'a cada 15 minutos das 09:00 às 09:45 de segunda a sexta'],
  ['*/15 9,17 * * 1-5',
    'a cada 15 minutos das 09:00 às 09:45 e das 17:00 às 17:45 de segunda ' +
    'a sexta'],
  ['*/15 8,12,18 * * 1-5',
    'a cada 15 minutos durante as horas que começam às 08:00, 12:00 e ' +
    '18:00 de segunda a sexta'],
  ['*/15 */2 * * 1-5',
    'a cada 15 minutos durante as horas pares de segunda a sexta'],
  ['*/15 */6 * * 1-5',
    'a cada 15 minutos durante as horas que começam às 00:00, 06:00, 12:00 ' +
    'e 18:00 de segunda a sexta'],
  ['*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5',
    'a cada 15 minutos durante as horas pares, exceto das 08:00 às 08:45, ' +
    'de segunda a sexta'],
  ['*/15 22-2 * * 1-5',
    'a cada 15 minutos das 00:00 às 02:45 e das 22:00 às 23:45 de segunda ' +
    'a sexta'],

  // window / date
  ['*/15 9-17 15 * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 no dia 15 de cada mês, e também ' +
    'de segunda a sexta'],
  ['*/15 9-17 1,15 * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 nos dias 1º e 15 de cada mês, e ' +
    'também de segunda a sexta'],
  ['*/15 9-17 1-7 * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 nos dias 1º a 7 de cada mês, e ' +
    'também de segunda a sexta'],
  ['*/15 9-17 1-7,15 * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 nos dias 1º a 7 e no dia 15 de ' +
    'cada mês, e também de segunda a sexta'],
  ['*/15 9-17 2/2 * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 nos dias pares de cada mês, e ' +
    'também de segunda a sexta'],
  ['*/15 9-17 */5 * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 de 5 em 5 dias a partir do dia ' +
    '1º de cada mês, e também de segunda a sexta'],
  ['*/15 9-17 L * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 no último dia de cada mês, e ' +
    'também de segunda a sexta'],
  ['*/15 9-17 15W * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 no dia de semana (segunda a ' +
    'sexta) mais próximo do dia 15 de cada mês, e também de segunda a sexta'],

  // window / month
  ['*/15 9-17 * 6 1-5',
    'a cada 15 minutos das 09:00 às 17:45 de segunda a sexta em junho'],
  ['*/15 9-17 * 1,7 1-5',
    'a cada 15 minutos das 09:00 às 17:45 de segunda a sexta em janeiro e ' +
    'julho'],
  ['*/15 9-17 * 6-8 1-5',
    'a cada 15 minutos das 09:00 às 17:45 de segunda a sexta, de junho a ' +
    'agosto'],
  ['*/15 9-17 * 6-8,12 1-5',
    'a cada 15 minutos das 09:00 às 17:45 de segunda a sexta, de junho a ' +
    'agosto e em dezembro'],
  ['*/15 9-17 * */3 1-5',
    'a cada 15 minutos das 09:00 às 17:45 de segunda a sexta em janeiro, ' +
    'abril, julho e outubro'],
  ['*/15 9-17 * 1-11 1-5',
    'a cada 15 minutos das 09:00 às 17:45 de segunda a sexta, de janeiro a ' +
    'novembro'],

  // window / weekday
  ['*/15 9-17 * * 1', 'a cada 15 minutos das 09:00 às 17:45 todas as segundas'],
  ['*/15 9-17 * * 0', 'a cada 15 minutos das 09:00 às 17:45 todos os domingos'],
  ['*/15 9-17 * * 0,6',
    'a cada 15 minutos das 09:00 às 17:45 todos os sábados e domingos'],
  ['*/15 9-17 * * 1-6',
    'a cada 15 minutos das 09:00 às 17:45 de segunda a sábado'],
  ['*/15 9-17 * * 5L',
    'a cada 15 minutos das 09:00 às 17:45 na última sexta-feira de cada mês'],
  ['*/15 9-17 * * 1#2',
    'a cada 15 minutos das 09:00 às 17:45 na segunda segunda-feira de cada ' +
    'mês'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', 'às 00:00:30 no dia 1º de cada mês'],
  ['0,30 0 0 1 * *', 'às 00:00:00 e 00:00:30 no dia 1º de cada mês'],
  ['*/15 0 0 1 * *',
    'a cada 15 segundos das 00:00:00 às 00:00:45 no dia 1º de cada mês'],
  ['0-9 0 0 1 * *',
    'a cada segundo das 00:00:00 às 00:00:09 no dia 1º de cada mês'],

  // monthly / minute
  ['30 0 1 * *', 'às 00:30 no dia 1º de cada mês'],
  ['0,30 0 1 * *', 'às 00:00 e 00:30 no dia 1º de cada mês'],
  ['0-29 0 1 * *', 'a cada minuto das 00:00 às 00:29 no dia 1º de cada mês'],
  ['0-29,45 0 1 * *',
    'a cada minuto das 00:00 às 00:29 e às 00:45 no dia 1º de cada mês'],
  ['*/7 0 1 * *', 'a cada 7 minutos das 00:00 às 00:56 no dia 1º de cada mês'],
  ['5/15 0 1 * *', 'às 00:05, 00:20, 00:35 e 00:50 no dia 1º de cada mês'],
  ['10-40/10 0 1 * *', 'às 00:10, 00:20, 00:30 e 00:40 no dia 1º de cada mês'],

  // monthly / hour
  ['0 12 1 * *', 'às 12:00 no dia 1º de cada mês'],
  ['0 8,12,18 1 * *', 'às 08:00, 12:00 e 18:00 no dia 1º de cada mês'],
  ['0 9-17 1 * *', 'a cada hora das 09:00 às 17:00 no dia 1º de cada mês'],
  ['0 */2 1 * *', 'a cada 2 horas no dia 1º de cada mês'],
  ['0 */6 1 * *', 'a cada 6 horas no dia 1º de cada mês'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * *',
    'a cada 2 horas, exceto às 08:00, no dia 1º de cada mês'],
  ['0 22-2 1 * *',
    'a cada hora das 00:00 às 02:00 e às 22:00 e 23:00 no dia 1º de cada ' +
    'mês'],

  // monthly / date
  ['0 0 15 * *', 'às 00:00 no dia 15 de cada mês'],
  ['0 0 1,15 * *', 'às 00:00 nos dias 1º e 15 de cada mês'],
  ['0 0 1-7 * *', 'às 00:00 nos dias 1º a 7 de cada mês'],
  ['0 0 1-7,15 * *', 'às 00:00 nos dias 1º a 7 e no dia 15 de cada mês'],
  ['0 0 2/2 * *', 'às 00:00 nos dias pares de cada mês'],
  ['0 0 */5 * *', 'às 00:00 de 5 em 5 dias a partir do dia 1º de cada mês'],
  ['0 0 L * *', 'às 00:00 no último dia de cada mês'],
  ['0 0 15W * *',
    'às 00:00 no dia de semana (segunda a sexta) mais próximo do dia 15 de ' +
    'cada mês'],

  // monthly / month
  ['0 0 1 6 *', 'às 00:00 no dia 1º de junho'],
  ['0 0 1 1,7 *', 'às 00:00 no dia 1º de janeiro e de julho'],
  ['0 0 1 6-8 *', 'às 00:00 no dia 1º de cada mês, de junho a agosto'],
  ['0 0 1 6-8,12 *',
    'às 00:00 no dia 1º de cada mês, de junho a agosto e em dezembro'],
  ['0 0 1 */3 *',
    'às 00:00 no dia 1º de janeiro, de abril, de julho e de outubro'],
  ['0 0 1 1-11 *', 'às 00:00 no dia 1º de cada mês, de janeiro a novembro'],

  // monthly / weekday
  ['0 0 1 * 0', 'às 00:00 no dia 1º de cada mês, e também todos os domingos'],
  ['0 0 1 * 1,3,5',
    'às 00:00 no dia 1º de cada mês, e também todas as segundas, quartas e ' +
    'sextas'],
  ['0 0 1 * 0,6',
    'às 00:00 no dia 1º de cada mês, e também todos os sábados e domingos'],
  ['0 0 1 * 1-6',
    'às 00:00 no dia 1º de cada mês, e também de segunda a sábado'],
  ['0 0 1 * 5L',
    'às 00:00 no dia 1º de cada mês, e também na última sexta-feira de ' +
    'cada mês'],
  ['0 0 1 * 1#2',
    'às 00:00 no dia 1º de cada mês, e também na segunda segunda-feira de ' +
    'cada mês'],

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
  ['*/7 * * * *', 'a cada 7 minutos do minuto 0 ao 56 de cada hora'],
  ['5/15 * * * *', 'nos minutos 5, 20, 35 e 50 de cada hora'],
  ['10-40/10 * * * *', 'nos minutos 10, 20, 30 e 40 de cada hora'],

  // open / hour
  ['* 12 * * *', 'a cada minuto das 12:00 às 12:59 todos os dias'],
  ['* 8,12,18 * * *',
    'a cada minuto durante as horas que começam às 08:00, 12:00 e 18:00 ' +
    'todos os dias'],
  ['* 9-17 * * *', 'a cada minuto das 09:00 às 17:59 todos os dias'],
  ['* */2 * * *', 'a cada minuto durante as horas pares'],
  ['* */6 * * *',
    'a cada minuto durante as horas que começam às 00:00, 06:00, 12:00 e ' +
    '18:00 todos os dias'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'a cada minuto durante as horas pares, exceto das 08:00 às 08:59'],
  ['* 22-2 * * *', 'a cada minuto das 22:00 às 02:59 todos os dias'],

  // open / date
  ['* * 15 * *', 'a cada minuto no dia 15 de cada mês'],
  ['* * 1,15 * *', 'a cada minuto nos dias 1º e 15 de cada mês'],
  ['* * 1-7 * *', 'a cada minuto nos dias 1º a 7 de cada mês'],
  ['* * 1-7,15 * *', 'a cada minuto nos dias 1º a 7 e no dia 15 de cada mês'],
  ['* * 2/2 * *', 'a cada minuto nos dias pares de cada mês'],
  ['* * */5 * *',
    'a cada minuto de 5 em 5 dias a partir do dia 1º de cada mês'],
  ['* * L * *', 'a cada minuto no último dia de cada mês'],
  ['* * 15W * *',
    'a cada minuto no dia de semana (segunda a sexta) mais próximo do dia ' +
    '15 de cada mês'],

  // open / month
  ['* * * 6 *', 'a cada minuto em junho'],
  ['* * * 1,7 *', 'a cada minuto em janeiro e julho'],
  ['* * * 6-8 *', 'a cada minuto de junho a agosto'],
  ['* * * 6-8,12 *', 'a cada minuto de junho a agosto e em dezembro'],
  ['* * * */3 *', 'a cada minuto em janeiro, abril, julho e outubro'],
  ['* * * 1-11 *', 'a cada minuto de janeiro a novembro'],

  // open / weekday
  ['* * * * 0', 'a cada minuto todos os domingos'],
  ['* * * * 1,3,5', 'a cada minuto todas as segundas, quartas e sextas'],
  ['* * * * 0,6', 'a cada minuto todos os sábados e domingos'],
  ['* * * * 1-6', 'a cada minuto de segunda a sábado'],
  ['* * * * 5L', 'a cada minuto na última sexta-feira de cada mês'],
  ['* * * * 1#2', 'a cada minuto na segunda segunda-feira de cada mês']
];

export {rows};
