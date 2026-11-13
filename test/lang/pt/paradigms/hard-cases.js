// Portuguese hard cases: patterns outside the grid that reach rules the
// grid's ladders do not, or where several fields are restricted at once.
// A builder may see these.
//
// Written by hand from src/lang/pt/answers.md. Never produced by running a
// renderer.

const rows = [
  // Years.
  ['0 0 1 1 * 2030', 'às 00:00 no dia 1º de janeiro de 2030', {years: true}],
  ['0 0 0 1 1 * 2030,2035', 'às 00:00 no dia 1º de janeiro de 2030 e de 2035'],
  ['0 0 0 1 1 * 2030-2035',
    'às 00:00 no dia 1º de janeiro de cada ano, de 2030 a 2035'],
  ['0 0 1 1 * */2',
    'às 00:00 no dia 1º de janeiro nos anos pares',
    {years: true}],
  ['30 0 9 1 6 * 2030', 'às 09:00:30 no dia 1º de junho de 2030'],
  ['0 0 9 * * * 2030', 'às 09:00 todos os dias em 2030'],
  ['0 0 9 * * * 2028-2031', 'às 09:00 todos os dias de 2028 a 2031'],
  ['0 0 9 * 6 * 2030', 'às 09:00 todos os dias em junho de 2030'],
  ['0 0 9 * 6 1 2030', 'às 09:00 todas as segundas em junho de 2030'],
  ['0 0 9 1,15 6 * 2030', 'às 09:00 nos dias 1º e 15 de junho de 2030'],
  ['0 0 9 * 6,7 * 2030', 'às 09:00 todos os dias em junho e julho de 2030'],
  ['0 0 9 * 6 * 2030,2031',
    'às 09:00 todos os dias em junho de 2030 e de 2031'],
  ['0 0 9 * 6-8 * 2030', 'às 09:00 todos os dias de junho a agosto de 2030'],
  ['0 0 9 * 6 * 2030-2035',
    'às 09:00 todos os dias em junho de cada ano, de 2030 a 2035'],
  ['0 0 9 * */2 * 2030', 'às 09:00 todos os dias nos meses ímpares em 2030'],
  ['0 0 9 L 6 * 2030', 'às 09:00 no último dia de junho de 2030'],
  ['0 0 9 1 * * 2030', 'às 09:00 no dia 1º de cada mês em 2030'],
  ['0 0 9 1 * * 2030-2035', 'às 09:00 no dia 1º de cada mês de 2030 a 2035'],
  ['0 0 9 * * 1-5 2030', 'às 09:00 de segunda a sexta em 2030'],
  ['0 0 9 * * * 2030/2',
    'às 09:00 todos os dias nos anos pares a partir de 2030'],
  ['0 0 9 * * * 2028/4',
    'às 09:00 todos os dias, de 4 em 4 anos a partir de 2028'],
  ['0 0 0 1 1 * 2028/4',
    'às 00:00 no dia 1º de janeiro, de 4 em 4 anos a partir de 2028'],
  ['0 */5 * * * * 2028/4', 'a cada 5 minutos, de 4 em 4 anos a partir de 2028'],
  ['0 0 9 * * * 2028-2044/4',
    'às 09:00 todos os dias, de 4 em 4 anos de 2028 a 2044'],
  ['0 0 9 * * * 2028-2040/4',
    'às 09:00 todos os dias em 2028, 2032, 2036 e 2040'],
  ['0 0 9 * * * 2030-2040/2',
    'às 09:00 todos os dias nos anos pares de 2030 a 2040'],
  ['0 */5 * * * * */2', 'a cada 5 minutos nos anos pares'],
  ['0 0 9 * * * 1971/2', 'às 09:00 todos os dias nos anos ímpares'],
  ['0 0 0 1 1 * 2030-2032,2035',
    'às 00:00 no dia 1º de janeiro de cada ano, de 2030 a 2032 e em 2035'],

  // Quartz forms.
  ['0 0 1 * ?', 'às 00:00 no dia 1º de cada mês', {cron: 'quartz'}],
  ['0 0 LW * *', 'às 00:00 no último dia de semana de cada mês'],
  ['0 0 L-3 * *', 'às 00:00 3 dias antes do último dia de cada mês'],
  ['0 0 L-2 * *', 'às 00:00 2 dias antes do último dia de cada mês'],
  ['0 0 L-1 * *', 'às 00:00 no penúltimo dia de cada mês'],
  ['0 0 L 6 *', 'às 00:00 no último dia de junho'],
  ['0 0 L 6-8 *', 'às 00:00 no último dia de cada mês, de junho a agosto'],
  ['0 0 15W 6 *', 'às 00:00 no dia de semana mais próximo do dia 15 de junho'],
  ['0 0 1W * *',
    'às 00:00 no dia de semana mais próximo do dia 1º de cada mês'],
  ['0 0 * 6 1#2', 'às 00:00 na segunda segunda-feira de junho'],
  ['0 0 * 1,7 5L', 'às 00:00 na última sexta-feira de janeiro e julho'],
  ['0 9 * * 3#1', 'às 09:00 na primeira quarta-feira de cada mês'],
  ['0 9 * * 4#3', 'às 09:00 na terceira quinta-feira de cada mês'],
  ['0 9 * * 6L', 'às 09:00 no último sábado de cada mês'],
  ['0 9 * * 0#4', 'às 09:00 no quarto domingo de cada mês'],

  // An ordinal before a weekday agrees with it, and the weekday keeps
  // «-feira», because the bare names are ordinals themselves.
  ['0 9 * * 3#4', 'às 09:00 na quarta quarta-feira de cada mês'],
  ['0 9 * * 4#5', 'às 09:00 na quinta quinta-feira de cada mês'],
  ['0 9 * * 5#2', 'às 09:00 na segunda sexta-feira de cada mês'],
  ['0 9 * * 6#1', 'às 09:00 no primeiro sábado de cada mês'],
  ['0 9 * * 0#2', 'às 09:00 no segundo domingo de cada mês'],
  ['0 9 * * 0L', 'às 09:00 no último domingo de cada mês'],
  ['0 9 * * 2L', 'às 09:00 na última terça-feira de cada mês'],

  // Macros, startup, and the three forms.
  ['@hourly', 'a cada hora'],
  ['@daily', 'às 00:00 todos os dias'],
  ['@weekly', 'às 00:00 todos os domingos'],
  ['@monthly', 'às 00:00 no dia 1º de cada mês'],
  ['@yearly', 'às 00:00 no dia 1º de janeiro'],
  ['@reboot', 'ao iniciar o sistema'],
  ['0 9 * * *', 'Ocorre às 09:00 todos os dias.', {form: 'sentence'}],
  ['0 9 * * *', 'Às 09:00 todos os dias', {form: 'label'}],
  ['0 1 * * *', 'À 01:00 todos os dias', {form: 'label'}],
  ['* * * * *', 'A cada minuto', {form: 'label'}],
  ['@reboot', 'Ocorre ao iniciar o sistema.', {form: 'sentence'}],
  ['not a pattern', 'um padrão cron não reconhecido', {lenient: true}],

  // A day of the month and a weekday, under a month.
  ['0 0 1 6 5',
    'às 00:00 no dia 1º de junho, e também todas as sextas em junho'],
  ['0 0 1,15 1,7 1-5',
    'às 00:00 nos dias 1º e 15, e também de segunda a sexta, em janeiro e ' +
    'julho'],
  ['52 7-16 1,19,23,28 5-7 3-4',
    'a cada hora das 07:52 às 16:52 nos dias 1º, 19, 23 e 28, e também ' +
    'todas as quartas e quintas, de maio a julho'],
  ['30 4 1-7 * 1',
    'às 04:30 nos dias 1º a 7 de cada mês, e também todas as segundas'],
  ['0 0 L * 5', 'às 00:00 no último dia de cada mês, e também todas as sextas'],
  ['0 0 15 * 5L',
    'às 00:00 no dia 15 de cada mês, e também na última sexta-feira de ' +
    'cada mês'],
  ['0 0 13 * 0,6',
    'às 00:00 no dia 13 de cada mês, e também todos os sábados e domingos'],

  // A month with its dates.
  ['0 0 1,15 6 *', 'às 00:00 nos dias 1º e 15 de junho'],
  ['0 0 1,10,20 6 *', 'às 00:00 nos dias 1º, 10 e 20 de junho'],
  ['0 0 1-7 6 *', 'às 00:00 nos dias 1º a 7 de junho'],
  ['0 0 1-7,15 6 *', 'às 00:00 nos dias 1º a 7 e 15 de junho'],
  ['0 0 */2 6 *', 'às 00:00 nos dias ímpares de junho'],
  ['0 0 */5 6 *', 'às 00:00 de 5 em 5 dias a partir do dia 1º em junho'],
  ['0 0 */5 6-8 *',
    'às 00:00 de 5 em 5 dias a partir do dia 1º de cada mês, de junho a ' +
    'agosto'],
  ['0 0 1,15 1,7 *', 'às 00:00 nos dias 1º e 15 de janeiro e julho'],
  ['59 23 31 12 *', 'às 23:59 no dia 31 de dezembro'],
  ['0 0 1-14,16-31 * *', 'às 00:00 todos os dias do mês, exceto no dia 15'],
  ['0 0 1-14,16-31 6 *', 'às 00:00 todos os dias de junho, exceto no dia 15'],
  ['0 0 1-14,17-31 * *',
    'às 00:00 todos os dias do mês, exceto nos dias 15 e 16'],
  ['0 0 1 2/2 *', 'às 00:00 no dia 1º dos meses pares'],
  ['0 12 1-5,10,20-25 * *',
    'às 12:00 nos dias 1º a 5, 10 e 20 a 25 de cada mês'],
  ['0 0 5-20/3 * *', 'às 00:00 de 3 em 3 dias do dia 5 ao dia 20 de cada mês'],
  ['0 0 8/2 * *', 'às 00:00 de 2 em 2 dias a partir do dia 8 de cada mês'],
  ['0 0 */21 * *', 'às 00:00 nos dias 1º e 22 de cada mês'],
  ['0 0 */10 * *', 'às 00:00 nos dias 1º, 11, 21 e 31 de cada mês'],
  ['0 9 * 1-3,6,9-11 *',
    'às 09:00 todos os dias de janeiro a março, em junho e de setembro a ' +
    'novembro'],
  ['0 0 * 11-2 * 2030',
    'às 00:00 todos os dias em janeiro, fevereiro, novembro e dezembro de ' +
    '2030',
    {years: true}],

  // The first day of a month is «1º»; no other day takes the mark.
  ['0 9 2 * *', 'às 09:00 no dia 2 de cada mês'],
  ['0 9 1,2 * *', 'às 09:00 nos dias 1º e 2 de cada mês'],
  ['0 0 11,21,31 * *', 'às 00:00 nos dias 11, 21 e 31 de cada mês'],
  ['0 0 2-31 * *', 'às 00:00 todos os dias do mês, exceto no dia 1º'],
  ['1 1 1 1 *', 'à 01:01 no dia 1º de janeiro'],
  ['0 0 10-20 * *', 'às 00:00 nos dias 10 a 20 de cada mês'],

  // Weekday order, runs and wrap-arounds, and the lead that agrees.
  ['0 9 * * 5-1', 'às 09:00 de sexta a segunda'],
  ['0 9 * * 2-4', 'às 09:00 de terça a quinta'],
  ['0 9 * * 6-1', 'às 09:00 de sábado a segunda'],
  ['0 9 * * 6', 'às 09:00 todos os sábados'],
  ['0 9 * * 0,1', 'às 09:00 todos os domingos e todas as segundas'],
  ['0 9 * * 0,5', 'às 09:00 todas as sextas e todos os domingos'],
  ['0 9 * * 5,6', 'às 09:00 todas as sextas e todos os sábados'],
  ['0 9 * * 0,4,6', 'às 09:00 todas as quintas, todos os sábados e domingos'],
  ['0 9 * * 0,2-4',
    'às 09:00 todas as terças, quartas, quintas e todos os domingos'],
  ['0 9 * * 0,2-5', 'às 09:00 de terça a sexta e todos os domingos'],
  ['0 9 * * 1,2,3,5', 'às 09:00 todas as segundas, terças, quartas e sextas'],
  ['0 9 * * 0-2,4-6', 'às 09:00 todos os dias, exceto às quartas'],
  ['0 9 * * 0-5', 'às 09:00 todos os dias, exceto aos sábados'],
  ['0 9 * * 2-0', 'às 09:00 todos os dias, exceto às segundas'],
  ['0 9 * 3 0,6', 'às 09:00 todos os sábados e domingos em março'],
  ['0 0,1,22,23 * * 1',
    'às 00:00, à 01:00, às 22:00 e 23:00 todas as segundas'],

  // Clock times: the list, and what competes with it.
  ['0,30 9,17 * * *', 'às 09:00, 09:30, 17:00 e 17:30 todos os dias'],
  ['5,20 9,17 * * *', 'às 09:05, 09:20, 17:05 e 17:20 todos os dias'],
  ['5,20,45 9,17 * * *',
    'às 09:05, 09:20, 09:45, 17:05, 17:20 e 17:45 todos os dias'],
  ['0 9,13 * * *', 'às 09:00 e 13:00 todos os dias'],
  ['30 0 * * *', 'às 00:30 todos os dias'],
  ['30 0 0 * * *', 'às 00:00:30 todos os dias'],
  ['30 12 * * *', 'às 12:30 todos os dias'],
  ['1 * * * *', 'no minuto 1 de cada hora'],
  ['* 22-23 * * *', 'a cada minuto das 22:00 às 23:59 todos os dias'],
  ['*/30 0-17 * * 2', 'a cada 30 minutos das 00:00 às 17:30 todas as terças'],
  ['0 0-6,22,23 * * *', 'a cada hora das 22:00 às 06:00 todos os dias'],
  ['*/15 0-5,22-23 * * *',
    'a cada 15 minutos das 22:00 às 05:45 todos os dias'],

  // The article before a time is singular for hour 1 («à», «da») and plural
  // for every other hour, the zero hour included.
  ['0 1 * * *', 'à 01:00 todos os dias'],
  ['30 1 * * *', 'à 01:30 todos os dias'],
  ['30 1,13 * * *', 'à 01:30 e às 13:30 todos os dias'],
  ['0 0,1 * * *', 'às 00:00 e à 01:00 todos os dias'],
  ['0 1,2 * * *', 'à 01:00 e às 02:00 todos os dias'],
  ['0 1-5 * * *', 'a cada hora da 01:00 às 05:00 todos os dias'],
  ['0 20-1 * * *', 'a cada hora das 20:00 à 01:00 todos os dias'],
  ['* 1 * * *', 'a cada minuto da 01:00 à 01:59 todos os dias'],
  ['*/15 1,13 * * *',
    'a cada 15 minutos da 01:00 à 01:45 e das 13:00 às 13:45 todos os dias'],
  ['0 0,2-23 * * *', 'a cada hora, exceto à 01:00'],
  ['*/10 0,2-23 * * *', 'a cada 10 minutos, exceto da 01:00 à 01:50'],
  ['0 1 1 * *', 'à 01:00 no dia 1º de cada mês'],

  // What has to be worked out: hour cadences, two hours, exceptions.
  ['0 0,6,12,18 * * *', 'a cada 6 horas'],
  ['0 0,6,18 * * *', 'às 00:00, 06:00 e 18:00 todos os dias'],
  ['0 */3 * * *', 'a cada 3 horas'],
  ['0 */5 * * *', 'a cada 5 horas das 00:00 às 20:00 todos os dias'],
  ['30 */2 * * *', 'no minuto 30 das horas pares'],
  ['30 */3 * * *',
    'às 00:30, 03:30, 06:30, 09:30, 12:30, 15:30, 18:30 e 21:30 todos os ' +
    'dias'],
  ['30 */5 * * *', 'a cada 5 horas das 00:30 às 20:30 todos os dias'],
  ['23 */6 * * *', 'às 00:23, 06:23, 12:23 e 18:23 todos os dias'],
  ['23 1/2 * * *', 'no minuto 23 das horas ímpares'],
  ['15,45 */2 * * *', 'nos minutos 15 e 45 das horas pares'],
  ['15,45 */4 * * *',
    'nos minutos 15 e 45 das horas que começam às 00:00, 04:00, 08:00, ' +
    '12:00, 16:00 e 20:00 todos os dias'],
  ['23 */12 * * *', 'às 00:23 e 12:23 todos os dias'],
  ['0 1/12 * * *', 'à 01:00 e às 13:00 todos os dias'],
  ['*/15 */12 * * *',
    'a cada 15 minutos das 00:00 às 00:45 e das 12:00 às 12:45 todos os ' +
    'dias'],
  ['0 */12 * * *', 'a cada 12 horas'],
  ['0 0/12 * * *', 'a cada 12 horas'],
  ['0 0,12 * * *', 'às 00:00 e 12:00 todos os dias'],
  ['0 */12 1 * *', 'a cada 12 horas no dia 1º de cada mês'],
  ['0 0,12 1 * *', 'às 00:00 e 12:00 no dia 1º de cada mês'],
  ['0 0-2,4-23 * * *', 'a cada hora, exceto às 03:00'],
  ['0 0-22 * * *', 'a cada hora, exceto às 23:00'],
  ['30 0-2,4-23 * * *', 'no minuto 30 de cada hora, exceto às 03:30'],
  ['5,20,45 0-2,4-23 * * *',
    'nos minutos 5, 20 e 45 de cada hora, exceto das 03:05 às 03:45'],
  ['*/10 0-2,4-23 * * *', 'a cada 10 minutos, exceto das 03:00 às 03:50'],
  ['* 0-2,4-23 * * *', 'a cada minuto, exceto das 03:00 às 03:59'],
  ['0-28,30-59 * * * *', 'a cada minuto, exceto no minuto 29 de cada hora'],
  ['1-59 * * * *', 'a cada minuto, exceto no minuto 0 de cada hora'],
  ['0-28,30-59 9,17 * * *',
    'a cada minuto das 09:00 às 09:59 e das 17:00 às 17:59, exceto no ' +
    'minuto 29 de cada hora, todos os dias'],
  ['0,10,20,40,50 9-17 * * *',
    'a cada 10 minutos das 09:00 às 17:50, exceto no minuto 30 de cada ' +
    'hora, todos os dias'],
  ['0,10,20,40,50 9 * * *',
    'a cada 10 minutos das 09:00 às 09:50, exceto às 09:30, todos os dias'],
  ['0,10,20,40,50 0-2,4-23 * * *',
    'a cada 10 minutos, exceto das 03:00 às 03:50 e no minuto 30 de cada ' +
    'hora'],
  ['* 0-28,30-59 * * * *',
    'a cada segundo, exceto durante o minuto 29 de cada hora'],
  ['* 0-28,30-59 9 * * *',
    'a cada segundo das 09:00:00 às 09:59:59, exceto das 09:29:00 às ' +
    '09:29:59, todos os dias'],
  ['0-28,30-59 * * * * *',
    'a cada segundo, exceto no segundo 29 de cada minuto'],
  ['0-28,30-59 0 9 * * *',
    'a cada segundo das 09:00:00 às 09:00:59, exceto às 09:00:29, todos os ' +
    'dias'],

  // Hours as a confinement.
  ['*/15 8-18/2 * * *',
    'a cada 15 minutos durante as horas que começam às 08:00, 10:00, ' +
    '12:00, 14:00, 16:00 e 18:00 todos os dias'],
  ['0 9-17,20,22 * * *',
    'a cada hora das 09:00 às 17:00 e às 20:00 e 22:00 todos os dias'],
  ['* 9-17,20,22 * * *',
    'a cada minuto das 09:00 às 17:59, das 20:00 às 20:59 e das 22:00 às ' +
    '22:59 todos os dias'],
  ['*/10 6-8,17-19 * * 1-5',
    'a cada 10 minutos das 06:00 às 08:50 e das 17:00 às 19:50 de segunda ' +
    'a sexta'],
  ['*/20 */2 */2 */3 *',
    'a cada 20 minutos durante as horas pares nos dias ímpares de janeiro, ' +
    'abril, julho e outubro'],
  ['5,20,45 9-17,22 * * *',
    'nos minutos 5, 20 e 45 de cada hora das 09:05 às 17:45 e das 22:05 às ' +
    '22:45 todos os dias'],

  // Minutes inside the hour.
  ['50-10 9 * * *',
    'a cada minuto das 09:00 às 09:10 e das 09:50 às 09:59 todos os dias'],
  ['10-40 9 * * *', 'a cada minuto das 09:10 às 09:40 todos os dias'],
  ['30-59 9 * * *', 'a cada minuto das 09:30 às 09:59 todos os dias'],
  ['5-10,20 * * * *',
    'a cada minuto do minuto 5 ao 10 e no minuto 20 de cada hora'],
  ['45-59 * * * *', 'a cada minuto durante os últimos 15 minutos de cada hora'],
  ['10-40 * * * *', 'a cada minuto do minuto 10 ao 40 de cada hora'],
  ['0-29 9,17 * * *',
    'a cada minuto das 09:00 às 09:29 e das 17:00 às 17:29 todos os dias'],
  ['0-1 * * * *', 'nos minutos 0 e 1 de cada hora'],
  ['*/21 * * * *', 'nos minutos 0, 21 e 42 de cada hora'],
  ['9,14,47,56 * * * *', 'nos minutos 9, 14, 47 e 56 de cada hora'],
  ['5/10 * * * *', 'a cada 10 minutos do minuto 5 ao 55 de cada hora'],

  // Seconds.
  ['15 30 9 * * *', 'às 09:30:15 todos os dias'],
  ['15 30 9,17 * * *', 'às 09:30:15 e 17:30:15 todos os dias'],
  ['15,45 30 9 * * *', 'às 09:30:15 e 09:30:45 todos os dias'],
  ['15 30 1 * * *', 'à 01:30:15 todos os dias'],
  ['* * 9 * * *', 'a cada segundo das 09:00:00 às 09:59:59 todos os dias'],
  ['* * 9-17 * * *', 'a cada segundo das 09:00:00 às 17:59:59 todos os dias'],
  ['30 0 * * * *', 'no segundo 30 do minuto 0 de cada hora'],
  ['15 30 * * * *', 'no segundo 15 do minuto 30 de cada hora'],
  ['0-9 0 * * * *',
    'a cada segundo durante os primeiros 10 segundos de cada hora'],
  ['* 0 9,17 * * *',
    'a cada segundo das 09:00:00 às 09:00:59 e das 17:00:00 às 17:00:59 ' +
    'todos os dias'],
  ['*/15 */15 * * * *',
    'a cada 15 segundos durante um minuto a cada 15 minutos'],
  ['30 */15 * * * *', 'no segundo 30 a cada 15 minutos'],
  ['8 5,30 */2 * * *', 'no segundo 8 dos minutos 5 e 30 das horas pares'],
  ['* 30 * * * *', 'a cada segundo durante o minuto 30 de cada hora'],
  ['* 0-29 * * * *',
    'a cada segundo durante os primeiros 30 minutos de cada hora'],
  ['0,20,40 0 9 * * *', 'às 09:00:00, 09:00:20 e 09:00:40 todos os dias'],
  ['10-20 30 9 * * *', 'a cada segundo das 09:30:10 às 09:30:20 todos os dias'],
  ['5-10/60 0 9 * * *', 'às 09:00:05 todos os dias'],
  ['15 0 */12 * * *', 'às 00:00:15 e 12:00:15 todos os dias'],

  // «Todos os dias» fills the level a restricted hour would skip, and is
  // not said of a schedule that runs round the clock.
  ['*/5 * * 6 *', 'a cada 5 minutos em junho'],
  ['0 */6 * 6 *', 'a cada 6 horas em junho'],
  ['30 * * 6 *', 'no minuto 30 de cada hora em junho'],
  ['0 * * * 1', 'a cada hora todas as segundas'],
  ['0 0 * 5 *', 'às 00:00 todos os dias em maio'],
  ['*/5 * * * * 2030', 'a cada 5 minutos em 2030', {years: true}],

  // Several fields at once.
  ['*/10 24 */3 23-25 * 1-2',
    'a cada 10 segundos durante um minuto às 00:24, 03:24, 06:24, 09:24, ' +
    '12:24, 15:24, 18:24 e 21:24 nos dias 23 a 25 de cada mês, e também ' +
    'todas as segundas e terças'],
  ['*/30 23 */12 * 6-7 6#2 2030/4',
    'às 00:23:00, 00:23:30, 12:23:00 e 12:23:30 no segundo sábado de junho ' +
    'e julho, de 4 em 4 anos a partir de 2030'],
  ['0 35 2,15 * * * 2028,2030',
    'às 02:35 e 15:35 todos os dias em 2028 e 2030'],
  ['* 30,42 3-10 * 7,9,10,12 1,3,4,5',
    'a cada segundo durante os minutos 30 e 42 de cada hora das 03:30:00 ' +
    'às 10:42:59 todas as segundas, quartas, quintas e sextas em julho, ' +
    'setembro, outubro e dezembro'],
  ['0 18 15W 3,6,9,12 *',
    'às 18:00 no dia de semana mais próximo do dia 15 de março, junho, ' +
    'setembro e dezembro'],
  ['7 4-22/6 1 */2 *',
    'às 04:07, 10:07, 16:07 e 22:07 no dia 1º dos meses ímpares'],

  // The grid's contexts, and the patterns the option rows use, in the
  // default style.
  ['0 9 * * *', 'às 09:00 todos os dias'],
  ['*/15 9-17 * * 1-5',
    'a cada 15 minutos das 09:00 às 17:45 de segunda a sexta'],
  ['0 0 1 * *', 'às 00:00 no dia 1º de cada mês'],
  ['* * * * *', 'a cada minuto'],
  ['30 9,17 * * *', 'às 09:30 e 17:30 todos os dias'],
  ['0 13 * * *', 'às 13:00 todos os dias'],
  ['0,30 12 * * *', 'às 12:00 e 12:30 todos os dias'],
  ['0 5,6,18,19 * * *', 'às 05:00, 06:00, 18:00 e 19:00 todos os dias'],
  ['0 9 * 6 1', 'às 09:00 todas as segundas em junho'],
  ['0 9 * 5 *', 'às 09:00 todos os dias em maio'],

  // Months after a day part.
  ['0 0 * 6-8 1', 'às 00:00 todas as segundas de junho a agosto'],
  ['0 0 */2 */2 *', 'às 00:00 nos dias ímpares dos meses ímpares'],
  ['0 0 */5 */2 *',
    'às 00:00 de 5 em 5 dias a partir do dia 1º nos meses ímpares'],
  ['0 0 1 6-8 5',
    'às 00:00 no dia 1º, e também todas as sextas, de junho a agosto'],
  ['0 0 1,15 6 * 2030-2035',
    'às 00:00 nos dias 1º e 15 de junho de cada ano, de 2030 a 2035']
];

export {rows};
