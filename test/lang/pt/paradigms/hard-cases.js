// Portuguese hard cases: patterns outside the grid that reach rules the
// grid's ladders do not, or where several fields are restricted at once.
// A builder may see these.
//
// Written by hand from src/lang/pt/answers.md. Never produced by running a
// renderer.

const rows = [
  // Years.
  ['0 0 1 1 * 2030', 'no dia 1º de janeiro de 2030 às 00:00', {years: true}],
  ['0 0 0 1 1 * 2030,2035', 'no dia 1º de janeiro, em 2030 e 2035, às 00:00'],
  ['0 0 0 1 1 * 2030-2035', 'no dia 1º de janeiro, de 2030 a 2035, às 00:00'],
  ['0 0 1 1 * */2',
    'no dia 1º de janeiro dos anos pares às 00:00',
    {years: true}],
  ['30 0 9 1 6 * 2030', 'no dia 1º de junho de 2030 às 09:00:30'],
  ['0 0 9 * * * 2030', 'todos os dias de 2030 às 09:00'],
  ['0 0 9 * * * 2028-2031', 'todos os dias, de 2028 a 2031, às 09:00'],
  ['0 0 9 * 6 * 2030', 'todos os dias de junho de 2030 às 09:00'],
  ['0 0 9 * 6 1 2030', 'todas as segundas de junho de 2030 às 09:00'],
  ['0 0 9 1,15 6 * 2030', 'nos dias 1º e 15 de junho de 2030 às 09:00'],
  ['0 0 9 * 6,7 * 2030', 'todos os dias de junho e julho, em 2030, às 09:00'],
  ['0 0 9 * 6 * 2030,2031', 'todos os dias de junho, em 2030 e 2031, às 09:00'],
  ['0 0 9 * 6-8 * 2030', 'todos os dias de junho a agosto, em 2030, às 09:00'],
  ['0 0 9 * 6 * 2030-2035', 'todos os dias de junho, de 2030 a 2035, às 09:00'],
  ['0 0 9 * */2 * 2030',
    'todos os dias de janeiro, março, maio, julho, setembro e novembro, em ' +
    '2030, às 09:00'],
  ['0 0 9 L 6 * 2030', 'no último dia de junho de 2030 às 09:00'],
  ['0 0 9 1 * * 2030', 'no dia 1º de cada mês de 2030 às 09:00'],
  ['0 0 9 1 * * 2030-2035', 'no dia 1º de cada mês, de 2030 a 2035, às 09:00'],
  ['0 0 9 * * 1 2030', 'todas as segundas de 2030 às 09:00'],
  ['0 0 9 * * 1-5 2030', 'em 2030, de segunda a sexta, às 09:00'],
  ['0 0 9 * 6 1-5 2030', 'em junho de 2030, de segunda a sexta, às 09:00'],
  ['0 0 9 * * 1-5 2030-2035', 'de 2030 a 2035, de segunda a sexta, às 09:00'],
  ['0 0 9 * * * 2030/2',
    'todos os dias, nos anos pares a partir de 2030, às 09:00'],
  ['0 0 9 * * 1-5 2030/2',
    'nos anos pares a partir de 2030, de segunda a sexta, às 09:00'],
  ['0 0 9 * * * 2028/4',
    'todos os dias, de 4 em 4 anos a partir de 2028 (2028, 2032, 2036…), ' +
    'às 09:00'],
  ['0 0 0 1 1 * 2028/4',
    'no dia 1º de janeiro, de 4 em 4 anos a partir de 2028 (2028, 2032, ' +
    '2036…), às 00:00'],
  ['0 */5 * * * * 2028/4',
    'todos os dias, de 4 em 4 anos a partir de 2028 (2028, 2032, 2036…), a ' +
    'cada 5 minutos'],
  ['0 0 9 * * * 2028-2060/4',
    'todos os dias, de 4 em 4 anos de 2028 a 2060 (2028, 2032 … 2060), às ' +
    '09:00'],
  ['0 0 9 * * * 2028-2044/4',
    'todos os dias de 2028, 2032, 2036, 2040 e 2044 às 09:00'],
  ['0 0 9 * * * 2028-2040/4',
    'todos os dias de 2028, 2032, 2036 e 2040 às 09:00'],
  ['0 0 9 * * * 2030-2040/2',
    'todos os dias, nos anos pares de 2030 a 2040, às 09:00'],
  ['0 */5 * * * * */2', 'todos os dias dos anos pares, a cada 5 minutos'],
  ['0 0 9 * * * 1971/2', 'todos os dias dos anos ímpares às 09:00'],
  ['0 0 0 1 1 * 2030-2032,2035',
    'no dia 1º de janeiro, de 2030 a 2032 e em 2035, às 00:00'],
  ['*/5 * * * * 2030',
    'todos os dias de 2030, a cada 5 minutos',
    {years: true}],
  ['0 0 0 1 1,7 * 2030', 'no dia 1º de janeiro e de julho, em 2030, às 00:00'],
  ['0 0 9 * 6 * 2030/2',
    'todos os dias de junho, nos anos pares a partir de 2030, às 09:00'],
  ['0 0 9 * 6,7 * 2030/2',
    'todos os dias de junho e julho, nos anos pares a partir de 2030, às ' +
    '09:00'],
  ['0 0 9 * 6 * 2028/4',
    'todos os dias de junho, de 4 em 4 anos a partir de 2028 (2028, 2032, ' +
    '2036…), às 09:00'],
  ['0 0 9 * * 1-5 2028/4',
    'de 4 em 4 anos a partir de 2028 (2028, 2032, 2036…), de segunda a ' +
    'sexta, às 09:00'],
  ['0 0 9 * 6-8 1-5 2030',
    'em 2030, de junho a agosto, de segunda a sexta, às 09:00'],
  ['0 0 0 1 * 5 2028/4',
    'de 4 em 4 anos a partir de 2028 (2028, 2032, 2036…), todas as sextas ' +
    'e também no dia 1º de cada mês, sempre às 00:00'],

  // Quartz forms.
  ['0 0 1 * ?', 'no dia 1º de cada mês às 00:00', {cron: 'quartz'}],
  ['0 0 LW * *',
    'no último dia de cada mês que não seja sábado nem domingo, às 00:00'],
  ['0 0 LW 6 *',
    'no último dia de junho que não seja sábado nem domingo, às 00:00'],
  ['0 0 0 LW 6 * 2030',
    'no último dia de junho de 2030 que não seja sábado nem domingo, às ' +
    '00:00'],
  ['0 0 LW * 5',
    'todas as sextas e também no último dia de cada mês que não seja ' +
    'sábado nem domingo, sempre às 00:00'],
  ['0 0 L-1 * *', 'no penúltimo dia de cada mês às 00:00'],
  ['0 0 L-2 * *',
    'no dia que fica 2 dias antes do último dia de cada mês às 00:00'],
  ['0 0 L-3 * *',
    'no dia que fica 3 dias antes do último dia de cada mês às 00:00'],
  ['0 0 L-12 * *',
    'no dia que fica 12 dias antes do último dia de cada mês às 00:00'],
  ['0 0 L-3 6 *',
    'no dia que fica 3 dias antes do último dia de junho às 00:00'],
  ['0 0 L 6 *', 'no último dia de junho às 00:00'],
  ['0 0 L 6-8 *', 'no último dia de junho, julho e agosto às 00:00'],
  ['0 0 L */2 *',
    'no último dia de janeiro, março, maio, julho, setembro e novembro às ' +
    '00:00'],
  ['0 0 15W 6 *',
    'no dia 15 de junho ou, se cair num sábado ou domingo, na sexta ou ' +
    'segunda mais próxima, às 00:00'],
  ['0 0 1W * *',
    'no primeiro dia de cada mês que não seja sábado nem domingo, às 00:00'],
  ['0 0 1W 6 *',
    'no primeiro dia de junho que não seja sábado nem domingo, às 00:00'],
  ['0 0 31W * *',
    'no dia 31 de cada mês ou, se cair num sábado ou domingo, na sexta ou ' +
    'segunda mais próxima do mesmo mês, às 00:00'],
  ['0 0 * 6 1#2', 'na segunda segunda-feira de junho às 00:00'],
  ['0 0 * 1,7 5L', 'na última sexta-feira de janeiro e de julho às 00:00'],
  ['0 9 * * 3#1', 'na primeira quarta-feira de cada mês às 09:00'],
  ['0 9 * * 4#3', 'na terceira quinta-feira de cada mês às 09:00'],
  ['0 9 * * 6L', 'no último sábado de cada mês às 09:00'],
  ['0 9 * * 0#4', 'no quarto domingo de cada mês às 09:00'],
  ['0 18 15W 3,6,9,12 *',
    'no dia 15 de março, junho, setembro e dezembro ou, se cair num sábado ' +
    'ou domingo, na sexta ou segunda mais próxima, às 18:00'],
  ['0 0 L-30 * *',
    'no dia que fica 30 dias antes do último dia de cada mês às 00:00'],
  ['0 0 30W 1,7 *',
    'no dia 30 de janeiro e de julho ou, se cair num sábado ou domingo, na ' +
    'sexta ou segunda mais próxima do mesmo mês, às 00:00'],
  ['0 0 28W * *',
    'no dia 28 de cada mês ou, se cair num sábado ou domingo, na sexta ou ' +
    'segunda mais próxima do mesmo mês, às 00:00'],
  ['0 0 27W * *',
    'no dia 27 de cada mês ou, se cair num sábado ou domingo, na sexta ou ' +
    'segunda mais próxima, às 00:00'],

  // An ordinal before a weekday agrees with it, and the weekday keeps
  // «-feira», because the bare names are ordinals themselves.
  ['0 9 * * 3#4', 'na quarta quarta-feira de cada mês às 09:00'],
  ['0 9 * * 4#5', 'na quinta quinta-feira de cada mês às 09:00'],
  ['0 9 * * 5#2', 'na segunda sexta-feira de cada mês às 09:00'],
  ['0 9 * * 6#1', 'no primeiro sábado de cada mês às 09:00'],
  ['0 9 * * 0#2', 'no segundo domingo de cada mês às 09:00'],
  ['0 9 * * 0L', 'no último domingo de cada mês às 09:00'],
  ['0 9 * * 2L', 'na última terça-feira de cada mês às 09:00'],

  // Macros, startup, and the three forms.
  ['@hourly', 'a cada hora, em ponto'],
  ['@daily', 'todos os dias às 00:00'],
  ['@weekly', 'todos os domingos às 00:00'],
  ['@monthly', 'no dia 1º de cada mês às 00:00'],
  ['@yearly', 'no dia 1º de janeiro às 00:00'],
  ['@reboot', 'ao iniciar o sistema'],
  ['0 9 * * *', 'Ocorre todos os dias às 09:00.', {form: 'sentence'}],
  ['0 9 * * *', 'Todos os dias às 09:00', {form: 'label'}],
  ['0 1 1 * *', 'No dia 1º de cada mês à 01:00', {form: 'label'}],
  ['* * * * *', 'A cada minuto', {form: 'label'}],
  ['30 * * * *', 'No minuto 30 de cada hora', {form: 'label'}],
  ['@reboot', 'Ocorre ao iniciar o sistema.', {form: 'sentence'}],
  ['0 9 * * 1,3,5',
    'Ocorre todas as seg., qua. e sex. às 09:00.',
    {form: 'sentence', style: {short: true}}],
  ['not a pattern', 'um padrão cron não reconhecido', {lenient: true}],

  // A day of the month and a weekday: the weekdays first, the dates as the
  // addition, «sempre» before the time; a month or a year leads.
  ['0 0 1 * 5',
    'todas as sextas e também no dia 1º de cada mês, sempre às 00:00'],
  ['0 0 1 6 5',
    'em junho, todas as sextas e também no dia 1º, sempre às 00:00'],
  ['0 0 1,15 1,7 1-5',
    'em janeiro e julho, de segunda a sexta e também nos dias 1º e 15, ' +
    'sempre às 00:00'],
  ['52 7-16 1,19,23,28 5-7 3-4',
    'de maio a julho, todas as quartas e quintas e também nos dias 1º, 19, ' +
    '23 e 28, sempre a cada hora das 07:52 às 16:52'],
  ['30 4 1-7 * 1',
    'todas as segundas e também do dia 1º ao dia 7 de cada mês, sempre às ' +
    '04:30'],
  ['0 0 L * 5',
    'todas as sextas e também no último dia de cada mês, sempre às 00:00'],
  ['0 0 15 * 5L',
    'na última sexta-feira de cada mês e também no dia 15 de cada mês, ' +
    'sempre às 00:00'],
  ['0 0 13 * 0,6',
    'todos os sábados e domingos e também no dia 13 de cada mês, sempre às ' +
    '00:00'],
  ['0 0 1 6-8 5',
    'de junho a agosto, todas as sextas e também no dia 1º, sempre às 00:00'],
  ['0 0 1 */2 5',
    'em janeiro, março, maio, julho, setembro e novembro, todas as sextas ' +
    'e também no dia 1º, sempre às 00:00'],
  ['0 0 L 1,7 5',
    'em janeiro e julho, todas as sextas e também no último dia de cada ' +
    'mês, sempre às 00:00'],
  ['0 0 0 1 * 5 2030',
    'em 2030, todas as sextas e também no dia 1º de cada mês, sempre às ' +
    '00:00'],
  ['0 0 0 1 6 5 2030',
    'em junho de 2030, todas as sextas e também no dia 1º, sempre às 00:00'],
  ['0 */2 1 * 5',
    'todas as sextas e também no dia 1º de cada mês, sempre a cada 2 horas ' +
    'das 00:00 às 22:00'],
  ['0 0 L 6 5',
    'em junho, todas as sextas e também no último dia do mês, sempre às ' +
    '00:00'],
  ['0 0 15 6 5L',
    'em junho, na última sexta-feira do mês e também no dia 15, sempre às ' +
    '00:00'],
  ['0 0 0 1 * 1-5 2030',
    'em 2030, de segunda a sexta e também no dia 1º de cada mês, sempre às ' +
    '00:00'],

  // A month with its dates.
  ['0 0 1,15 6 *', 'nos dias 1º e 15 de junho às 00:00'],
  ['0 0 1,10,20 6 *', 'nos dias 1º, 10 e 20 de junho às 00:00'],
  ['0 0 1-7 6 *', 'do dia 1º ao dia 7 de junho às 00:00'],
  ['0 0 1-7,15 6 *', 'do dia 1º ao dia 7 e no dia 15 de junho às 00:00'],
  ['0 0 1-7 6-8 *', 'do dia 1º ao dia 7 de junho, julho e agosto às 00:00'],
  ['0 0 */2 6 *', 'nos dias ímpares de junho às 00:00'],
  ['0 0 */2 */2 *',
    'nos dias ímpares de janeiro, março, maio, julho, setembro e novembro ' +
    'às 00:00'],
  ['0 0 */5 6 *', 'nos dias 1º, 6, 11, 16, 21 e 26 de junho às 00:00'],
  ['0 0 */5 6-8 *',
    'nos dias 1º, 6, 11, 16, 21, 26 e 31 de junho, julho e agosto às 00:00'],
  ['0 0 */5 1,7 *',
    'nos dias 1º, 6, 11, 16, 21, 26 e 31 de janeiro e de julho às 00:00'],
  ['0 0 1,15 1,7 *', 'nos dias 1º e 15 de janeiro e de julho às 00:00'],
  ['59 23 31 12 *', 'no dia 31 de dezembro às 23:59'],
  ['0 0 1-14,16-31 * *',
    'todos os dias, exceto no dia 15 de cada mês, às 00:00'],
  ['0 0 1-14,16-31 6 *', 'todos os dias de junho, exceto no dia 15, às 00:00'],
  ['0 0 1-14,17-31 * *',
    'todos os dias, exceto nos dias 15 e 16 de cada mês, às 00:00'],
  ['0 0 1 2/2 *',
    'no dia 1º de fevereiro, abril, junho, agosto, outubro e dezembro às ' +
    '00:00'],
  ['0 0 1 1-9/2 *',
    'no dia 1º de janeiro, março, maio, julho e setembro às 00:00'],
  ['0 12 1-5,10,20-25 * *',
    'do dia 1º ao dia 5, no dia 10 e do dia 20 ao dia 25 de cada mês às ' +
    '12:00'],
  ['0 0 5-20/3 * *', 'nos dias 5, 8, 11, 14, 17 e 20 de cada mês às 00:00'],
  ['0 0 8/2 * *', 'nos dias pares do dia 8 ao dia 30 de cada mês às 00:00'],
  ['0 0 */3 * *', 'de 3 em 3 dias do dia 1º ao dia 31 de cada mês às 00:00'],
  ['0 0 */3 6 *', 'de 3 em 3 dias do dia 1º ao dia 28 de junho às 00:00'],
  ['0 0 */4 2 *', 'de 4 em 4 dias do dia 1º ao dia 29 de fevereiro às 00:00'],
  ['0 0 */21 * *', 'nos dias 1º e 22 de cada mês às 00:00'],
  ['0 0 */10 * *', 'nos dias 1º, 11, 21 e 31 de cada mês às 00:00'],

  // Months: named, as a list or as runs, and an exception for a hole.
  ['0 9 * 1-3,6,9-11 *',
    'todos os dias de janeiro a março, de junho e de setembro a novembro ' +
    'às 09:00'],
  ['0 0 * 11-2 * 2030',
    'todos os dias de janeiro, fevereiro, novembro e dezembro, em 2030, às ' +
    '00:00',
    {years: true}],
  ['0 0 * 6-8 1', 'todas as segundas de junho a agosto às 00:00'],
  ['0 9 * */2 1',
    'todas as segundas de janeiro, março, maio, julho, setembro e novembro ' +
    'às 09:00'],
  ['0 9 * 3 0,6', 'todos os sábados e domingos de março às 09:00'],
  ['0 9 * 6 1-5', 'em junho, de segunda a sexta, às 09:00'],
  ['0 9 * 6 0,2-5', 'em junho, de terça a sexta e todos os domingos, às 09:00'],
  ['0 9 * 1-5,7-12 *', 'todos os dias, exceto em junho, às 09:00'],
  ['0 0 9 * 1-5,7-12 * 2030',
    'todos os dias de 2030, exceto em junho, às 09:00'],
  ['0 0 9 * 1-11 * 2030',
    'todos os dias de janeiro a novembro, em 2030, às 09:00'],
  ['0 0 1 1-5,7-12 *', 'no dia 1º de cada mês, exceto em junho, às 00:00'],
  ['*/15 9-17 * 1-5,7-12 1-5',
    'de segunda a sexta, exceto em junho, a cada 15 minutos das 09:00 às ' +
    '17:45'],
  ['0 0 1,15 6 * 2030-2035',
    'nos dias 1º e 15 de junho, de 2030 a 2035, às 00:00', {years: true}],
  ['0 0 * 5 *', 'todos os dias de maio às 00:00'],
  ['*/5 * * 6 *', 'todos os dias de junho, a cada 5 minutos'],
  ['0 */6 * 6 *', 'todos os dias de junho às 00:00, 06:00, 12:00 e 18:00'],
  ['30 * * 6 *', 'todos os dias de junho, no minuto 30 de cada hora'],
  ['0 * * * 1', 'todas as segundas, a cada hora, em ponto'],

  // The first day of a month is «1º»; no other day takes the mark.
  ['0 9 2 * *', 'no dia 2 de cada mês às 09:00'],
  ['0 9 1,2 * *', 'nos dias 1º e 2 de cada mês às 09:00'],
  ['0 0 11,21,31 * *', 'nos dias 11, 21 e 31 de cada mês às 00:00'],
  ['0 0 2-31 * *', 'do dia 2 ao dia 31 de cada mês às 00:00'],
  ['0 0 2-14,16-31 * *',
    'todos os dias, exceto nos dias 1º e 15 de cada mês, às 00:00'],
  ['1 1 1 1 *', 'no dia 1º de janeiro à 01:01'],
  ['0 0 10-20 * *', 'do dia 10 ao dia 20 de cada mês às 00:00'],

  // Weekday order, runs and wrap-arounds, and the lead that agrees.
  ['0 9 * * 5-1', 'de sexta a segunda às 09:00'],
  ['0 9 * * 2-4', 'de terça a quinta às 09:00'],
  ['0 9 * * 6-1', 'de sábado a segunda às 09:00'],
  ['0 9 * * 6', 'todos os sábados às 09:00'],
  ['0 9 * * 0,1', 'todas as segundas e domingos às 09:00'],
  ['0 9 * * 0,5', 'todas as sextas e domingos às 09:00'],
  ['0 9 * * 5,6', 'todas as sextas e sábados às 09:00'],
  ['0 9 * * 0,4,6', 'todas as quintas, sábados e domingos às 09:00'],
  ['0 9 * * 0,2-4',
    'todas as terças, quartas, quintas e domingos às 09:00'],
  ['0 9 * * 0,2-5', 'de terça a sexta e todos os domingos às 09:00'],
  ['0 9 * * 1,2,3,5', 'todas as segundas, terças, quartas e sextas às 09:00'],
  ['0 9 * * 0-2,4-6', 'todos os dias, exceto às quartas, às 09:00'],
  ['0 9 * * 0-5', 'todos os dias, exceto aos sábados, às 09:00'],
  ['0 9 * * 2-0', 'de terça a domingo às 09:00'],
  ['0 9 * 6 0-2,4-6', 'todos os dias de junho, exceto às quartas, às 09:00'],
  ['0 0 9 * * 0-5 2030', 'todos os dias de 2030, exceto aos sábados, às 09:00'],
  ['0 0 1 * 0-2,4-6',
    'de quinta a terça e também no dia 1º de cada mês, sempre às 00:00'],
  ['0 0 1 * 0-5',
    'de domingo a sexta e também no dia 1º de cada mês, sempre às 00:00'],
  ['0 0,1,22,23 * * 1',
    'todas as segundas às 00:00, à 01:00 e às 22:00 e 23:00'],

  // Clock times: up to four moments are always listed, and up to seven
  // clock times that are not a cadence; beyond that, a window or a cadence
  // with both ends.
  ['0,30 9,17 * * *', 'todos os dias às 09:00, 09:30, 17:00 e 17:30'],
  ['5,20 9,17 * * *', 'todos os dias às 09:05, 09:20, 17:05 e 17:20'],
  ['5,20,45 9,17 * * *',
    'todos os dias às 09:05, 09:20, 09:45, 17:05, 17:20 e 17:45'],
  ['0 9,13 * * *', 'todos os dias às 09:00 e 13:00'],
  ['30 0 * * *', 'todos os dias às 00:30'],
  ['30 0 0 * * *', 'todos os dias às 00:00:30'],
  ['30 12 * * *', 'todos os dias às 12:30'],
  ['*/10 9 * * *', 'todos os dias, a cada 10 minutos das 09:00 às 09:50'],
  ['*/20 9 * * *', 'todos os dias às 09:00, 09:20 e 09:40'],
  ['* 22-23 * * *', 'todos os dias, a cada minuto das 22:00 às 23:59'],
  ['*/30 0-17 * * 2', 'todas as terças, a cada 30 minutos das 00:00 às 17:30'],
  ['0 0-6,22,23 * * *', 'todos os dias, a cada hora das 22:00 às 06:00'],
  ['*/15 0-5,22-23 * * *',
    'todos os dias, a cada 15 minutos das 22:00 às 05:45'],
  ['0 0,6,12,18 * * *', 'todos os dias às 00:00, 06:00, 12:00 e 18:00'],
  ['0 0,6,18 * * *', 'todos os dias às 00:00, 06:00 e 18:00'],
  ['0 */12 * * *', 'todos os dias às 00:00 e 12:00'],
  ['0 0/12 * * *', 'todos os dias às 00:00 e 12:00'],
  ['0 0,12 * * *', 'todos os dias às 00:00 e 12:00'],
  ['0 */12 1 * *', 'no dia 1º de cada mês às 00:00 e 12:00'],
  ['23 */12 * * *', 'todos os dias às 00:23 e 12:23'],
  ['0 1/12 * * *', 'todos os dias à 01:00 e às 13:00'],
  ['23 */6 * * *', 'todos os dias às 00:23, 06:23, 12:23 e 18:23'],
  ['7 4-22/6 1 */2 *',
    'no dia 1º de janeiro, março, maio, julho, setembro e novembro às ' +
    '04:07, 10:07, 16:07 e 22:07'],

  // A cadence of hours names both ends and carries the minute; seven
  // times or fewer are listed. Where it selects whole stretches or several
  // minutes it is «de N em N horas», with the first two hours and the last
  // in brackets.
  ['0 */3 * * *', 'todos os dias, a cada 3 horas das 00:00 às 21:00'],
  ['0 */4 * * *', 'todos os dias às 00:00, 04:00, 08:00, 12:00, 16:00 e 20:00'],
  ['0 */5 * * *', 'todos os dias às 00:00, 05:00, 10:00, 15:00 e 20:00'],
  ['30 */2 * * *', 'todos os dias, a cada 2 horas das 00:30 às 22:30'],
  ['30 */3 * * *', 'todos os dias, a cada 3 horas das 00:30 às 21:30'],
  ['30 */5 * * *', 'todos os dias às 00:30, 05:30, 10:30, 15:30 e 20:30'],
  ['23 1/2 * * *', 'todos os dias, a cada 2 horas da 01:23 às 23:23'],
  ['30 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'todos os dias, a cada 2 horas das 00:30 às 22:30, exceto às 08:30'],
  ['15,45 */2 * * *',
    'todos os dias, nos minutos 15 e 45, de 2 em 2 horas (00:15, 00:45, ' +
    '02:15, 02:45 … 22:45)'],
  ['15,45 */4 * * *',
    'todos os dias, nos minutos 15 e 45, de 4 em 4 horas (00:15, 00:45, ' +
    '04:15, 04:45 … 20:45)'],
  ['*/15 */12 * * *',
    'todos os dias, a cada 15 minutos das 00:00 às 00:45 e das 12:00 às ' +
    '12:45'],
  ['*/15 8-18/2 * * *',
    'todos os dias, a cada 15 minutos, de 2 em 2 horas (das 08:00 às ' +
    '08:45, das 10:00 às 10:45 … das 18:00 às 18:45)'],
  ['*/20 */2 */2 */3 *',
    'nos dias ímpares de janeiro, abril, julho e outubro, a cada 20 ' +
    'minutos, de 2 em 2 horas (das 00:00 às 00:40, das 02:00 às 02:40 … ' +
    'das 22:00 às 22:40)'],
  ['0 9-17,20,22 * * *',
    'todos os dias, a cada hora das 09:00 às 17:00 e às 20:00 e 22:00'],
  ['* 9-17,20,22 * * *',
    'todos os dias, a cada minuto das 09:00 às 17:59, das 20:00 às 20:59 e ' +
    'das 22:00 às 22:59'],
  ['*/10 6-8,17-19 * * 1-5',
    'de segunda a sexta, a cada 10 minutos das 06:00 às 08:50 e das 17:00 ' +
    'às 19:50'],
  ['5,20,45 9-17,22 * * *',
    'todos os dias, nos minutos 5, 20 e 45 de cada hora, das 09:05 às ' +
    '17:45 e das 22:05 às 22:45'],
  ['5,20,45 9,17,22 * * *',
    'todos os dias, nos minutos 5, 20 e 45 de cada hora, das 09:05 às ' +
    '09:45, das 17:05 às 17:45 e das 22:05 às 22:45'],
  ['* 8,10,13,15,20 * * *',
    'todos os dias, a cada minuto das 08:00 às 08:59, das 10:00 às 10:59, ' +
    'das 13:00 às 13:59, das 15:00 às 15:59 e das 20:00 às 20:59'],
  ['*/15 */3 * * *',
    'todos os dias, a cada 15 minutos, de 3 em 3 horas (das 00:00 às ' +
    '00:45, das 03:00 às 03:45 … das 21:00 às 21:45)'],

  // The article before a time is singular for hour 1 («à», «da») and plural
  // for every other hour, the zero hour included.
  ['0 1 * * *', 'todos os dias à 01:00'],
  ['30 1 * * *', 'todos os dias à 01:30'],
  ['30 1,13 * * *', 'todos os dias à 01:30 e às 13:30'],
  ['0 0,1 * * *', 'todos os dias às 00:00 e à 01:00'],
  ['0 1,2 * * *', 'todos os dias à 01:00 e às 02:00'],
  ['0 1-5 * * *', 'todos os dias, a cada hora da 01:00 às 05:00'],
  ['0 20-1 * * *', 'todos os dias, a cada hora das 20:00 à 01:00'],
  ['* 1 * * *', 'todos os dias, a cada minuto da 01:00 à 01:59'],
  ['*/15 1,13 * * *',
    'todos os dias, a cada 15 minutos da 01:00 à 01:45 e das 13:00 às 13:45'],
  ['0 0,2-23 * * *', 'todos os dias, a cada hora, em ponto, exceto à 01:00'],
  ['*/10 0,2-23 * * *',
    'todos os dias, a cada 10 minutos, exceto da 01:00 à 01:59'],
  ['0 1 1 * *', 'no dia 1º de cada mês à 01:00'],

  // A run is said as a run; an exception is for a hole.
  ['0 0-2,4-23 * * *', 'todos os dias, a cada hora, em ponto, exceto às 03:00'],
  ['0 0-22 * * *', 'todos os dias, a cada hora das 00:00 às 22:00'],
  ['0 1-23 * * *', 'todos os dias, a cada hora da 01:00 às 23:00'],
  ['* 0-22 * * *', 'todos os dias, a cada minuto das 00:00 às 22:59'],
  ['30 0-2,4-23 * * *',
    'todos os dias, no minuto 30 de cada hora, exceto às 03:30'],
  ['5,20,45 0-2,4-23 * * *',
    'todos os dias, nos minutos 5, 20 e 45 de cada hora, exceto das 03:00 ' +
    'às 03:59'],
  ['*/10 0-2,4-23 * * *',
    'todos os dias, a cada 10 minutos, exceto das 03:00 às 03:59'],
  ['* 0-2,4-23 * * *',
    'todos os dias, a cada minuto, exceto das 03:00 às 03:59'],
  ['0-28,30-59 * * * *', 'a cada minuto, exceto no minuto 29 de cada hora'],
  ['1-59 * * * *', 'a cada minuto durante os últimos 59 minutos de cada hora'],
  ['0-58 * * * *',
    'a cada minuto durante os primeiros 59 minutos de cada hora'],
  ['0-28,30-59 9,17 * * *',
    'todos os dias, a cada minuto das 09:00 às 09:59 e das 17:00 às 17:59, ' +
    'exceto no minuto 29 de cada hora'],
  ['0,10,20,40,50 9-17 * * *',
    'todos os dias, a cada 10 minutos das 09:00 às 17:50, exceto no minuto ' +
    '30 de cada hora'],
  ['0,10,20,40,50 9 * * *',
    'todos os dias, a cada 10 minutos das 09:00 às 09:50, exceto às 09:30'],
  ['0,10,20,40,50 0-2,4-23 * * *',
    'todos os dias, a cada 10 minutos, exceto das 03:00 às 03:59 e no ' +
    'minuto 30 de cada hora'],
  ['* 0-28,30-59 * * * *',
    'a cada segundo, exceto durante o minuto 29 de cada hora'],
  ['* 0-9,11-28,30-59 * * * *',
    'a cada segundo, exceto durante os minutos 10 e 29 de cada hora'],
  ['* 0-28,30-59 9 * * *',
    'todos os dias, a cada segundo das 09:00:00 às 09:59:59, exceto das ' +
    '09:29:00 às 09:29:59'],
  ['0-28,30-59 * * * * *',
    'a cada segundo, exceto no segundo 29 de cada minuto'],
  ['* 0 0-2,4-23 * * *',
    'todos os dias, no minuto 0 de cada hora, repetindo a cada segundo ' +
    'durante o minuto inteiro, exceto das 03:00 às 03:59'],
  ['30 0 0-2,4-23 * * *',
    'todos os dias, 30 segundos depois de cada hora em ponto, exceto às ' +
    '03:00:30'],
  ['30 0 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'todos os dias, a cada 2 horas das 00:00:30 às 22:00:30, exceto às ' +
    '08:00:30'],

  // Minutes inside the hour.
  ['1 * * * *', 'no minuto 1 de cada hora'],
  ['50-10 9 * * *',
    'todos os dias, a cada minuto das 09:00 às 09:10 e das 09:50 às 09:59'],
  ['10-40 9 * * *', 'todos os dias, a cada minuto das 09:10 às 09:40'],
  ['30-59 9 * * *', 'todos os dias, a cada minuto das 09:30 às 09:59'],
  ['5-10,20 * * * *',
    'a cada minuto do minuto 5 ao 10 e no minuto 20 de cada hora'],
  ['45-59 * * * *', 'a cada minuto durante os últimos 15 minutos de cada hora'],
  ['10-40 * * * *', 'a cada minuto do minuto 10 ao 40 de cada hora'],
  ['10-40 9-17 * * *',
    'todos os dias, a cada minuto do minuto 10 ao 40 de cada hora, das ' +
    '09:10 às 17:40'],
  ['0-29 9,17 * * *',
    'todos os dias, a cada minuto das 09:00 às 09:29 e das 17:00 às 17:29'],
  ['0-1 * * * *', 'nos minutos 0 e 1 de cada hora'],
  ['*/21 * * * *', 'nos minutos 0, 21 e 42 de cada hora'],
  ['9,14,47,56 * * * *', 'nos minutos 9, 14, 47 e 56 de cada hora'],
  ['5/10 * * * *', 'nos minutos 5, 15, 25, 35, 45 e 55 de cada hora'],
  ['5/5 * * * *', 'a cada 5 minutos, do minuto 5 ao 55 de cada hora'],
  ['*/5 * * * *', 'a cada 5 minutos'],

  // Seconds: listed to the second up to four moments; one second rides in
  // the times; otherwise a clause after the time: «repetindo …» for a
  // stretch, «… segundos depois» for points.
  ['15 30 9 * * *', 'todos os dias às 09:30:15'],
  ['15 30 9,17 * * *', 'todos os dias às 09:30:15 e 17:30:15'],
  ['15,45 30 9 * * *', 'todos os dias às 09:30:15 e 09:30:45'],
  ['15 30 1 * * *', 'todos os dias à 01:30:15'],
  ['0,20,40 0 9 * * *', 'todos os dias às 09:00:00, 09:00:20 e 09:00:40'],
  ['5-10/60 0 9 * * *', 'todos os dias às 09:00:05'],
  ['15 0 */12 * * *', 'todos os dias às 00:00:15 e 12:00:15'],
  ['30 0 */6 * * *',
    'todos os dias às 00:00:30, 06:00:30, 12:00:30 e 18:00:30'],
  ['30 0 */2 * * *', 'todos os dias, a cada 2 horas das 00:00:30 às 22:00:30'],
  ['30 0 9-17 * * *', 'todos os dias, a cada hora das 09:00:30 às 17:00:30'],
  ['8 5,30 */2 * * *',
    'todos os dias, nos minutos 5 e 30, de 2 em 2 horas (00:05:08, ' +
    '00:30:08, 02:05:08, 02:30:08 … 22:30:08)'],
  ['* * 9 * * *', 'todos os dias, a cada segundo das 09:00:00 às 09:59:59'],
  ['* * 9-17 * * *', 'todos os dias, a cada segundo das 09:00:00 às 17:59:59'],
  ['*/15 * 9 * * *',
    'todos os dias, a cada 15 segundos das 09:00:00 às 09:59:45'],
  ['* 0-29 * * * *',
    'a cada segundo durante os primeiros 30 minutos de cada hora'],
  ['30 0 * * * *', '30 segundos depois de cada hora em ponto'],
  ['1 0 * * * *', '1 segundo depois de cada hora em ponto'],
  ['* 0 * * * *',
    'no minuto 0 de cada hora, repetindo a cada segundo durante o minuto ' +
    'inteiro'],
  ['0-9 0 * * * *',
    'no minuto 0 de cada hora, repetindo a cada segundo durante os ' +
    'primeiros 10 segundos'],
  ['15 30 * * * *', 'no minuto 30 de cada hora, 15 segundos depois'],
  ['* 30 * * * *',
    'no minuto 30 de cada hora, repetindo a cada segundo durante o minuto ' +
    'inteiro'],
  ['0,30 30 * * * *',
    'no minuto 30 de cada hora, 2 vezes: no horário exato e 30 segundos ' +
    'depois'],
  ['* 0 9,17 * * *',
    'todos os dias às 09:00 e 17:00, sempre repetindo a cada segundo ' +
    'durante o minuto inteiro'],
  ['10-20 30 9 * * *',
    'todos os dias às 09:30, repetindo a cada segundo do segundo 10 ao 20'],
  ['5/5 0 9 * * *',
    'todos os dias às 09:00, repetindo a cada 5 segundos do segundo 5 ao 55'],
  ['0-28,30-59 0 9 * * *',
    'todos os dias às 09:00, repetindo a cada segundo durante o minuto ' +
    'inteiro, exceto às 09:00:29'],
  ['*/15 */15 * * * *',
    'a cada 15 minutos, repetindo a cada 15 segundos durante o minuto ' +
    'inteiro'],
  ['30 */15 * * * *', 'a cada 15 minutos, 30 segundos depois'],
  ['0,30 */15 * * * *',
    'a cada 15 minutos, 2 vezes: no horário exato e 30 segundos depois'],
  ['5/10 */15 * * * *',
    'a cada 15 minutos, 6 vezes: 5, 15, 25, 35, 45 e 55 segundos depois'],
  ['0,30 * 9 * * *',
    'todos os dias, a cada 30 segundos das 09:00:00 às 09:59:30'],
  ['15 5,20 9-17 * * *',
    'todos os dias, nos minutos 5 e 20 de cada hora, das 09:05 às 17:20, ' +
    'sempre 15 segundos depois'],
  ['30 * 9 * * *', 'todos os dias, a cada minuto das 09:00:30 às 09:59:30'],
  ['5/10 * 9 * * *',
    'todos os dias, nos segundos 5, 15, 25, 35, 45 e 55 de cada minuto, ' +
    'das 09:00 às 09:59'],
  ['50-59 0 9 * * *',
    'todos os dias às 09:00, repetindo a cada segundo durante os últimos ' +
    '10 segundos'],

  // Several fields at once.
  ['*/10 24 */3 23-25 * 1-2',
    'todas as segundas e terças e também do dia 23 ao dia 25 de cada mês, ' +
    'sempre a cada 3 horas das 00:24 às 21:24, repetindo a cada 10 ' +
    'segundos durante o minuto inteiro'],
  ['*/30 23 */12 * 6-7 6#2 2030/4',
    'no segundo sábado de junho e de julho, de 4 em 4 anos a partir de ' +
    '2030 (2030, 2034, 2038…), às 00:23:00, 00:23:30, 12:23:00 e 12:23:30'],
  ['0 35 2,15 * * * 2028,2030',
    'todos os dias de 2028 e 2030 às 02:35 e 15:35'],
  ['* 30,42 3-10 * 7,9,10,12 1,3,4,5',
    'todas as segundas, quartas, quintas e sextas de julho, setembro, ' +
    'outubro e dezembro, nos minutos 30 e 42 de cada hora, das 03:30 às ' +
    '10:42, sempre repetindo a cada segundo durante o minuto inteiro'],

  // Neither side of a day of the month and a weekday takes an exception,
  // which would be taken for the whole pair: a Friday the 15th fires.
  ['0 9 1-14,16-31 * 5',
    'todas as sextas e também do dia 1º ao dia 14 e do dia 16 ao dia 31 de ' +
    'cada mês, sempre às 09:00'],
  ['0 9 5-9,11-25 * 1',
    'todas as segundas e também do dia 5 ao dia 9 e do dia 11 ao dia 25 de ' +
    'cada mês, sempre às 09:00'],
  ['0 9 1-14,16-31 6 1',
    'em junho, todas as segundas e também do dia 1º ao dia 14 e do dia 16 ' +
    'ao dia 30, sempre às 09:00'],
  ['0 9 15 1-5,7-12 1',
    'todas as segundas e também no dia 15 de cada mês, exceto em junho, ' +
    'sempre às 09:00'],

  // Every day the one named month has, beside weekdays, is every day.
  ['0 9 1-30 4 1', 'todos os dias de abril às 09:00'],
  ['*/15 9-17 1-29 2 1-5',
    'todos os dias de fevereiro, a cada 15 minutos das 09:00 às 17:45'],

  // Minutes and seconds never wrap: a run that passes the top of the hour
  // is its two stretches, whatever the hours and the days are.
  ['50-10 * * * *',
    'a cada minuto durante os primeiros 11 minutos e durante os últimos 10 ' +
    'minutos de cada hora'],
  ['50-10 * * * 1',
    'todas as segundas, a cada minuto durante os primeiros 11 minutos e ' +
    'durante os últimos 10 minutos de cada hora'],
  ['50-10 9-17 * * *',
    'todos os dias, a cada minuto durante os primeiros 11 minutos e ' +
    'durante os últimos 10 minutos de cada hora, das 09:00 às 17:59'],
  ['45-15 * * * * *',
    'a cada segundo durante os primeiros 16 segundos e durante os últimos ' +
    '15 segundos de cada minuto'],
  ['58-1 * * * *', 'nos minutos 0, 1, 58 e 59 de cada hora'],

  // Hours that pass midnight: one run only when every day is meant, where
  // it counts as three things, so that an exception naming two is said in
  // its place; beside a day the hours are in ascending order.
  ['0 12-10 * * *', 'todos os dias, a cada hora, em ponto, exceto às 11:00'],
  ['0 0-9,12-23 * * *',
    'todos os dias, a cada hora, em ponto, exceto às 10:00 e 11:00'],
  ['0 18-5 * * *', 'todos os dias, a cada hora das 18:00 às 05:00'],
  ['0 0-5,17-23 * * *',
    'todos os dias, a cada hora das 00:00 às 05:00 e das 17:00 às 23:00'],
  ['0 22-2,4-9 * * *',
    'todos os dias, a cada hora das 22:00 às 09:00, exceto às 03:00'],
  ['0 0-9,12-23 * * 1',
    'todas as segundas, a cada hora, em ponto, exceto às 10:00 e 11:00'],
  ['0 20-10,12-17 * * *',
    'todos os dias, a cada hora, em ponto, exceto às 11:00, 18:00 e 19:00'],
  ['0 0-2,5,20-23 * * *',
    'todos os dias, a cada hora das 20:00 às 02:00 e às 05:00'],
  ['0 22-2 * * 1',
    'todas as segundas, a cada hora das 00:00 às 02:00 e às 22:00 e 23:00'],
  ['* 22-2 * 6 *',
    'todos os dias de junho, a cada minuto das 00:00 às 02:59 e das 22:00 ' +
    'às 23:59'],

  // The order of pieces: strays before a run are said before it, and a
  // run of weekdays that passes from Sunday into Monday is said first.
  ['0 5,7,9-17 * * *',
    'todos os dias às 05:00 e 07:00 e a cada hora das 09:00 às 17:00'],
  ['0 1,9-17,20-23 * * *',
    'todos os dias à 01:00 e a cada hora das 09:00 às 17:00 e das 20:00 às ' +
    '23:00'],
  ['0 9 * * 0,1,3,5,6',
    'todos os dias, exceto às terças e quintas, às 09:00'],
  ['0 23-1 * * *', 'todos os dias às 00:00, à 01:00 e às 23:00'],

  // A run that wraps counts three things: it gives way to an exception
  // that names two, and is said against one that names three.
  ['0 9 * * 0-4', 'de domingo a quinta às 09:00'],
  ['0 9 * * 1,2,4-6',
    'todos os dias, exceto às quartas e domingos, às 09:00'],
  ['0 9 * 12-10 *', 'todos os dias, exceto em novembro, às 09:00'],
  ['0 9 * 8-5 *', 'todos os dias de agosto a maio às 09:00'],

  // An exception is for a set of more than four values that it says in
  // fewer things than the set's runs.
  ['0 9-12,14-17 * * *',
    'todos os dias, a cada hora das 09:00 às 17:00, exceto às 13:00'],
  ['* 9-11,13-17 * * *',
    'todos os dias, a cada minuto das 09:00 às 17:59, exceto das 12:00 às ' +
    '12:59'],
  ['0 9 5-9,11-25 * *',
    'do dia 5 ao dia 25 de cada mês, exceto no dia 10, às 09:00'],

  // Under one named month the days are those the month has.
  ['0 9 1-30 4 *', 'todos os dias de abril às 09:00'],
  ['0 9 2-31 4 *', 'do dia 2 ao dia 30 de abril às 09:00'],
  ['0 9 29-31 2 *', 'no dia 29 de fevereiro dos anos bissextos às 09:00'],
  ['0 0 1-14,16-30 6 *',
    'do dia 1º ao dia 30 de junho, exceto no dia 15, às 00:00'],
  ['0 0 1-14,16-30 * *',
    'todos os dias, exceto nos dias 15 e 31 de cada mês, às 00:00'],
  ['0 9 31 2 *', 'nunca (fevereiro não tem dia 31)'],
  ['0 9 1-30 4,6 *', 'todos os dias de abril e junho às 09:00'],
  ['0 9 1-30 4,6 1', 'todos os dias de abril e junho às 09:00'],
  ['0 0 1,31 4,6,9,11 *',
    'no dia 1º de abril, junho, setembro e novembro às 00:00'],
  ['0 0 30,31 4,6 1',
    'em abril e junho, todas as segundas e também no dia 30, sempre às ' +
    '00:00'],

  // A day no named month has is not named, and a month that lacks the
  // day is not named either. With every month the day is said as a date
  // is, and read as one.
  ['0 0 31 * *', 'no dia 31 de cada mês às 00:00'],
  ['0 0 30 2-3 *', 'no dia 30 de março às 00:00'],
  ['0 0 31 1-11 *',
    'no dia 31 de janeiro, março, maio, julho, agosto e outubro às 00:00'],
  ['0 0 31W 6-8 *',
    'no dia 31 de julho e de agosto ou, se cair num sábado ou domingo, na ' +
    'sexta ou segunda mais próxima do mesmo mês, às 00:00'],
  ['0 0 30W 2,4 *',
    'no dia 30 de abril ou, se cair num sábado ou domingo, na sexta ou ' +
    'segunda mais próxima do mesmo mês, às 00:00'],
  ['0 0 L-30 6-8 *',
    'no dia que fica 30 dias antes do último dia de julho e de agosto às ' +
    '00:00'],
  ['0 0 31W * 5',
    'todas as sextas e também no dia 31 de cada mês ou, se cair num sábado ' +
    'ou domingo, na sexta ou segunda mais próxima do mesmo mês, sempre às ' +
    '00:00'],

  // A schedule that never fires says so and why, and has no time. Beside
  // weekdays, a date that never comes leaves the weekdays alone.
  ['0 0 31 6 *', 'nunca (junho não tem dia 31)'],
  ['*/15 9-17 31 6 *', 'nunca (junho não tem dia 31)'],
  ['0 0 30 2 *', 'nunca (fevereiro não tem dia 30)'],
  ['0 0 30,31 2 *', 'nunca (fevereiro não tem dias 30 e 31)'],
  ['0 0 31 4,6 *', 'nunca (abril e junho não têm dia 31)'],
  ['0 0 0 29 2 * 2031', 'nunca (fevereiro não tem dia 29 em 2031)'],
  ['0 0 31W 6 *', 'nunca (junho não tem dia 31)'],
  ['0 0 L-30 6 *', 'nunca (junho não tem 31 dias)'],
  ['0 0 31 6 *', 'Nunca (junho não tem dia 31)', {form: 'label'}],
  ['0 0 31 6 *', 'Nunca ocorre (junho não tem dia 31).', {form: 'sentence'}],
  ['0 0 31 6 1', 'todas as segundas de junho às 00:00'],
  ['0 9 31 2 1-5', 'em fevereiro, de segunda a sexta, às 09:00'],

  // A day that only leap years have.
  ['0 0 29 2 *', 'no dia 29 de fevereiro dos anos bissextos às 00:00'],
  ['0 0 0 29 2 * 2032', 'no dia 29 de fevereiro de 2032 às 00:00'],
  ['0 0 0 29 2 * 2030-2040',
    'no dia 29 de fevereiro dos anos bissextos, de 2030 a 2040, às 00:00'],
  ['0 0 0 29 2 * */2',
    'no dia 29 de fevereiro dos anos bissextos, nos anos pares, às 00:00'],
  ['0 0 L-28 2 *',
    'no dia que fica 28 dias antes do último dia de fevereiro dos anos ' +
    'bissextos às 00:00'],
  ['0 0 29W 2 *',
    'no dia 29 de fevereiro dos anos bissextos ou, se cair num sábado ou ' +
    'domingo, na sexta ou segunda mais próxima do mesmo mês, às 00:00'],
  ['0 0 29 2 1',
    'em fevereiro, todas as segundas e também no dia 29 dos anos ' +
    'bissextos, sempre às 00:00'],
  ['0 0 29 2,3 *', 'no dia 29 de fevereiro e de março às 00:00'],
  ['0 0 29 * *', 'no dia 29 de cada mês às 00:00'],

  // Every second day is said by its number being odd or even, with both
  // ends where it does not run the length of the month.
  ['0 0 1-29/2 2 *',
    'nos dias ímpares do dia 1º ao dia 29 de fevereiro às 00:00'],
  ['0 0 3-31/2 6 *', 'nos dias ímpares do dia 3 ao dia 29 de junho às 00:00'],
  ['0 0 2/2 6 *', 'nos dias pares de junho às 00:00'],

  // A long list that is runs and cadences together is said in those.
  // The 11th begins the every-third-day part, as the pattern writes it:
  // the row once ran the odd days through the 11th, which the core no
  // longer offers.
  ['0 0 1-10/2,11-31/3 * *',
    'nos dias ímpares do dia 1º ao dia 9 e de 3 em 3 dias do dia 11 ao ' +
    'dia 29 de cada mês às 00:00'],
  ['0-56/8,3-59/8 * * * *',
    'nos minutos 0, 3, 8, 11, 16, 19, 24, 27, 32, 35, 40, 43, 48, 51, 56 e ' +
    '59 de cada hora'],
  ['0-20/2,21-59/3 * * * *',
    'a cada 2 minutos do minuto 0 ao 20 e a cada 3 minutos do minuto 21 ao ' +
    '57 de cada hora'],
  ['0-20/2,21-59/3 9 * * *',
    'todos os dias, a cada 2 minutos das 09:00 às 09:20 e a cada 3 minutos ' +
    'das 09:21 às 09:57'],
  ['0-20/2,21-59/3 9-17 * * *',
    'todos os dias, a cada 2 minutos do minuto 0 ao 20 e a cada 3 minutos ' +
    'do minuto 21 ao 57 de cada hora, das 09:00 às 17:57'],
  ['0-20/2,21-59/3 * * * * *',
    'a cada 2 segundos do segundo 0 ao 20 e a cada 3 segundos do segundo ' +
    '21 ao 57 de cada minuto'],
  ['0 */2,17 * * *',
    'todos os dias, a cada 2 horas das 00:00 às 22:00 e às 17:00'],
  ['0 0-10/2,11-23/3 * * *',
    'todos os dias, a cada 2 horas das 00:00 às 10:00 e a cada 3 horas das ' +
    '11:00 às 23:00'],
  ['* 0-10/2,11-23/3 * * *',
    'todos os dias, a cada minuto das 00:00 às 00:59, das 02:00 às 02:59, ' +
    'das 04:00 às 04:59, das 06:00 às 06:59, das 08:00 às 08:59, das ' +
    '10:00 às 11:59, das 14:00 às 14:59, das 17:00 às 17:59, das 20:00 às ' +
    '20:59 e das 23:00 às 23:59'],

  // Years with no end, with a hole, and as runs and cadences together.
  ['0 0 9 * * * 2030/1', 'todos os dias, a partir de 2030, às 09:00'],
  ['0 0 9 * * 1-5 2030/1', 'a partir de 2030, de segunda a sexta, às 09:00'],
  ['0 0 9 1 1 * 2030/1', 'no dia 1º de janeiro, a partir de 2030, às 09:00'],
  ['0 0 9 * 6 * 2030/1', 'todos os dias de junho, a partir de 2030, às 09:00'],
  ['0 0 9 * * * 2030/2,2031',
    'todos os dias, nos anos pares a partir de 2030 e em 2031, às 09:00'],
  ['0 0 9 * * * 2000-2028/2,2032-2098/2',
    'todos os dias, nos anos pares de 2000 a 2098, exceto em 2030, às 09:00'],
  ['0 0 9 * * * 1970-2029,2031/1', 'todos os dias, exceto em 2030, às 09:00'],
  ['0 0 9 * * 1-5 1970-2029,2031/1',
    'de segunda a sexta, exceto em 2030, às 09:00'],
  ['0 0 9 * * * 2020-2029,2031/1',
    'todos os dias, a partir de 2020, exceto em 2030, às 09:00'],
  ['0 0 9 * * * 2030-2040,2045/5',
    'todos os dias, de 2030 a 2040 e de 5 em 5 anos a partir de 2045 ' +
    '(2045, 2050, 2055…), às 09:00'],
  ['0 0 9 * * * 2030/4,2031/4',
    'todos os dias, de 4 em 4 anos a partir de 2030 (2030, 2034, 2038…) e ' +
    'de 4 em 4 anos a partir de 2031 (2031, 2035, 2039…), às 09:00'],
  ['0 0 9 * * * 2030,2031', 'todos os dias de 2030 e 2031 às 09:00'],
  ['0 0 9 * * * 2030,2031,2033,2034',
    'todos os dias de 2030, 2031, 2033 e 2034 às 09:00'],
  // Seven years, so an exception may be said, and it names three things
  // where the two runs name four. (The row first written here said the
  // two runs, against the rule.)
  ['0 0 9 * * * 2030-2032,2034-2036',
    'todos os dias, de 2030 a 2036, exceto em 2033, às 09:00'],
  ['0 0 9 * 1-5,7-12 * 1970-2029,2031/1',
    'todos os dias, exceto em junho e em 2030, às 09:00'],
  ['0 0 9 * * * 2039-2040,2077/2',
    'todos os dias, em 2039 e 2040 e nos anos ímpares a partir de 2077, às ' +
    '09:00'],
  ['0 0 9 * * * 2020,2030/2',
    'todos os dias, em 2020 e nos anos pares a partir de 2030, às 09:00'],
  ['0 0 9 * * * 2020,2022,2031/3',
    'todos os dias, em 2020 e 2022 e de 3 em 3 anos a partir de 2031 ' +
    '(2031, 2034, 2037…), às 09:00'],
  ['0 0 0 31 6 * */2', 'nunca (junho não tem dia 31 nos anos pares)'],
  ['0 0 9 * * * 2030-2034/2',
    'todos os dias de 2030, 2032 e 2034 às 09:00'],

  // Seconds after a time said in more than one piece: «sempre» carries
  // them to every piece.
  ['15,45 0-29,45 9 * * *',
    'todos os dias, a cada minuto das 09:00 às 09:29 e às 09:45, sempre 2 ' +
    'vezes: 15 e 45 segundos depois'],
  ['* 0 9-17,22 * * *',
    'todos os dias, a cada hora das 09:00 às 17:00 e às 22:00, sempre ' +
    'repetindo a cada segundo durante o minuto inteiro'],
  ['* 0 9-17 * * *',
    'todos os dias, a cada hora das 09:00 às 17:00, repetindo a cada ' +
    'segundo durante o minuto inteiro'],

  // Runs of minutes and cadences with ends inside one hour or two are
  // windows; with strays and two hours, the minute phrase and a window for
  // each hour.
  ['5/5 9,17 * * *',
    'todos os dias, a cada 5 minutos das 09:05 às 09:55 e das 17:05 às ' +
    '17:55'],
  ['5-10,20 9 * * *',
    'todos os dias, a cada minuto das 09:05 às 09:10 e às 09:20'],
  ['5-10,20 9,17 * * *',
    'todos os dias, a cada minuto do minuto 5 ao 10 e no minuto 20 de cada ' +
    'hora, das 09:05 às 09:20 e das 17:05 às 17:20'],

  // More than four hours on a cadence, under minutes that are not a list:
  // «de N em N horas» with the windows of the first two hours and of the
  // last in brackets, never a window for each hour. Under a run of minutes
  // the lead stands alone before it, as «a cada minuto» does (4.1 case 4):
  // the rows for runs once had «durante os primeiros 30 minutos» before the
  // brackets, which every window says again. A cadence of minutes with an
  // offset keeps its phase in words («do minuto 5 ao 55»).
  ['0-29 */2 * * *',
    'todos os dias, a cada minuto, de 2 em 2 horas (das 00:00 às 00:29, das ' +
    '02:00 às 02:29 … das 22:00 às 22:29)'],
  ['5/5 */2 * * *',
    'todos os dias, a cada 5 minutos, do minuto 5 ao 55, de 2 em 2 horas ' +
    '(das 00:05 às 00:55, das 02:05 às 02:55 … das 22:05 às 22:55)'],
  ['0-29,45 1/2 * * *',
    'todos os dias, a cada minuto durante os primeiros 30 minutos e no ' +
    'minuto 45, de 2 em 2 horas (da 01:00 à 01:45, das 03:00 às 03:45 … ' +
    'das 23:00 às 23:45)'],
  ['0-29 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'todos os dias, a cada minuto, de 2 em 2 horas (das 00:00 às 00:29, das ' +
    '02:00 às 02:29 … das 22:00 às 22:29), exceto das 08:00 às 08:59'],
  // Four separate hours under a run are said hour by hour (4.1 case 4):
  // the minute phrase this row once had said again what the windows say.
  ['0-29 */6 * * *',
    'todos os dias, a cada minuto das 00:00 às 00:29, das 06:00 às 06:29, ' +
    'das 12:00 às 12:29 e das 18:00 às 18:29'],
  // The second is said in words after the brackets, never written into
  // the windows, where «a cada minuto» would leave it to be found.
  ['15 0-29 */2 * * *',
    'todos os dias, a cada minuto, de 2 em 2 horas (das 00:00 às 00:29, das ' +
    '02:00 às 02:29 … das 22:00 às 22:29), 15 segundos depois'],
  ['* 0-29 */2 * * *',
    'todos os dias, a cada segundo, de 2 em 2 horas (das 00:00:00 às ' +
    '00:29:59, das 02:00:00 às 02:29:59 … das 22:00:00 às 22:29:59)'],

  // A list of minutes beside hours on a cadence: clock times in the
  // bracket for up to three minutes, which shows seven; windows for more;
  // and no «de N em N horas» for fewer hours than leave something to omit.
  ['5,20,45 0,8,16 * * *',
    'todos os dias, nos minutos 5, 20 e 45, de 8 em 8 horas (00:05, 00:20, ' +
    '00:45, 08:05, 08:20, 08:45 … 16:45)'],
  ['5,20,35,50 */2 * * *',
    'todos os dias, nos minutos 5, 20, 35 e 50, de 2 em 2 horas (das 00:05 ' +
    'às 00:50, das 02:05 às 02:50 … das 22:05 às 22:50)'],
  ['5,20,35,50 0,8,16 * * *',
    'todos os dias, nos minutos 5, 20, 35 e 50 de cada hora, das 00:05 às ' +
    '00:50, das 08:05 às 08:50 e das 16:05 às 16:50'],
  ['5,20,35,50 0,12 * * *',
    'todos os dias, nos minutos 5, 20, 35 e 50 de cada hora, das 00:05 às ' +
    '00:50 e das 12:05 às 12:50'],

  // Seconds under one run of minutes are said in place of «a cada minuto».
  ['* 0-29 9 * * *', 'todos os dias, a cada segundo das 09:00:00 às 09:29:59'],
  ['* 0-29 9-17 * * *',
    'todos os dias, a cada segundo durante os primeiros 30 minutos de cada ' +
    'hora, das 09:00:00 às 17:29:59'],

  // One month and every second year lead together, as one month and one
  // year do.
  ['0 0 9 * 6 1-5 */2', 'em junho dos anos pares, de segunda a sexta, às 09:00'],

  // Written without the star, the same days are a union (answers 4.3): the
  // sentences the grid's `*/2` and `*/5` rows had before cron's rule was
  // followed. Every second day is `1-31/2`, every fifth `1-31/5`, and
  // every second weekday `0,2,4,6`.
  ['*/15 9-17 1-31/2 * 1-5',
    'de segunda a sexta e também nos dias ímpares de cada mês, sempre a ' +
    'cada 15 minutos das 09:00 às 17:45'],
  ['*/15 9-17 1-31/5 * 1-5',
    'de segunda a sexta e também nos dias 1º, 6, 11, 16, 21, 26 e 31 de ' +
    'cada mês, sempre a cada 15 minutos das 09:00 às 17:45'],
  ['0 0 1-31/2 * 1',
    'todas as segundas e também nos dias ímpares de cada mês, sempre às ' +
    '00:00'],
  ['0 0 15 * 0,2,4,6',
    'todas as terças, quintas, sábados e domingos e também no dia 15 de ' +
    'cada mês, sempre às 00:00'],
  // A step from the star in one day field, beside a restricted other: cron
  // fires only where both match (answers 4.3). The days of the month are
  // said as they are said alone, then the weekdays they fall on. A step
  // that does not start at the star is still a union.
  ['0 0 */2 * 1',
    'nos dias ímpares de cada mês que caem numa segunda, às 00:00'],
  ['0 9 */2 * 1,3,5',
    'nos dias ímpares de cada mês que caem numa segunda, quarta ou sexta, ' +
    'às 09:00'],
  ['0 0 15 * */2',
    'no dia 15 de cada mês, se cair numa terça, quinta, sábado ou domingo, ' +
    'às 00:00'],
  ['0 0 */2 6 1',
    'nos dias ímpares de junho que caem numa segunda, às 00:00'],
  ['0 0 */5 * 1-5',
    'nos dias 1º, 6, 11, 16, 21, 26 e 31 de cada mês que caem de segunda ' +
    'a sexta, às 00:00'],
  // Every day April has, with both fields to match, is only the weekdays.
  ['0 0 1-30 4 */2',
    'todas as terças, quintas, sábados e domingos de abril às 00:00'],
  ['*/15 9-17 2/2 * 1-5',
    'de segunda a sexta e também nos dias pares de cada mês, sempre a ' +
    'cada 15 minutos das 09:00 às 17:45'],

  // The grid's contexts, and the patterns the option rows use, in the
  // default style.
  ['0 9 * * *', 'todos os dias às 09:00'],
  ['*/15 9-17 * * 1-5',
    'de segunda a sexta, a cada 15 minutos das 09:00 às 17:45'],
  ['0 0 1 * *', 'no dia 1º de cada mês às 00:00'],
  ['* * * * *', 'a cada minuto'],
  ['30 9,17 * * *', 'todos os dias às 09:30 e 17:30'],
  ['0 13 * * *', 'todos os dias às 13:00'],
  ['0,30 12 * * *', 'todos os dias às 12:00 e 12:30'],
  ['0 5,6,18,19 * * *', 'todos os dias às 05:00, 06:00, 18:00 e 19:00'],
  ['0 9 * 6 1', 'todas as segundas de junho às 09:00'],
  ['0 9 * 5 *', 'todos os dias de maio às 09:00'],
  // Five hours, so a range: four moments or fewer are always listed
  // (answers 4.1), and the row first written here had four.
  ['0 8-12 * * *', 'todos os dias, a cada hora das 08:00 às 12:00'],
  ['0 9-12 * * *', 'todos os dias às 09:00, 10:00, 11:00 e 12:00'],
  ['0 9,12,18 * * *', 'todos os dias às 09:00, 12:00 e 18:00'],

  // A window «das … às …» is said only where the task fires right through
  // it at the rhythm already said (answers 4.1 case 4). One run of minutes,
  // or a cadence of minutes from the top of the hour, in hours of which no
  // two are adjacent, is then confined as every minute is: the lead alone,
  // and a window for each hour, or, for more than four hours on a cadence,
  // the series in brackets. The minute phrase it once had before the
  // windows («durante os primeiros 31 minutos de cada hora») said the
  // window twice. A second is said in words after the windows.
  ['0-30 2/6 * * *',
    'todos os dias, a cada minuto das 02:00 às 02:30, das 08:00 às 08:30, ' +
    'das 14:00 às 14:30 e das 20:00 às 20:30'],
  ['0-29 9,13,17 * * *',
    'todos os dias, a cada minuto das 09:00 às 09:29, das 13:00 às 13:29 e ' +
    'das 17:00 às 17:29'],
  ['0-29 23,0,12 * * *',
    'todos os dias, a cada minuto das 00:00 às 00:29, das 12:00 às 12:29 e ' +
    'das 23:00 às 23:29'],
  ['0-29 1,5,9,13,20 * * *',
    'todos os dias, a cada minuto da 01:00 à 01:29, das 05:00 às 05:29, das ' +
    '09:00 às 09:29, das 13:00 às 13:29 e das 20:00 às 20:29'],
  ['10-40 3,9,15 * * 1-5',
    'de segunda a sexta, a cada minuto das 03:10 às 03:40, das 09:10 às ' +
    '09:40 e das 15:10 às 15:40'],
  ['*/7 9,12,15,18 * * *',
    'todos os dias, a cada 7 minutos das 09:00 às 09:56, das 12:00 às ' +
    '12:56, das 15:00 às 15:56 e das 18:00 às 18:56'],
  ['30 0-29 9,13,17 * * *',
    'todos os dias, a cada minuto das 09:00 às 09:29, das 13:00 às 13:29 e ' +
    'das 17:00 às 17:29, sempre 30 segundos depois'],
  ['0-10 0-29 9,13,17 * * *',
    'todos os dias, a cada minuto das 09:00 às 09:29, das 13:00 às 13:29 e ' +
    'das 17:00 às 17:29, sempre repetindo a cada segundo durante os ' +
    'primeiros 11 segundos'],
  ['30 0-29 */2 * * *',
    'todos os dias, a cada minuto, de 2 em 2 horas (das 00:00 às 00:29, das ' +
    '02:00 às 02:29 … das 22:00 às 22:29), 30 segundos depois'],
  ['0-29 */4 * * *',
    'todos os dias, a cada minuto, de 4 em 4 horas (das 00:00 às 00:29, das ' +
    '04:00 às 04:29 … das 20:00 às 20:29)'],
  ['0-30 2/6 15W */3 MON#2',
    'em janeiro, abril, julho e outubro, na segunda segunda-feira de cada ' +
    'mês e também no dia 15 ou, se cair num sábado ou domingo, na sexta ou ' +
    'segunda mais próxima, sempre a cada minuto das 02:00 às 02:30, das ' +
    '08:00 às 08:30, das 14:00 às 14:30 e das 20:00 às 20:30'],
  ['0-30 */2 15W */3 MON#2',
    'em janeiro, abril, julho e outubro, na segunda segunda-feira de cada ' +
    'mês e também no dia 15 ou, se cair num sábado ou domingo, na sexta ou ' +
    'segunda mais próxima, sempre a cada minuto, de 2 em 2 horas (das ' +
    '00:00 às 00:30, das 02:00 às 02:30 … das 22:00 às 22:30)'],
  // The nearest forms that keep the minute phrase: a cadence with an
  // offset, whose phase is said in words; hours side by side, whose one
  // window does not say the minutes; and listed minutes, which do not
  // fire through a window.
  ['3/2 2/6 * * *',
    'todos os dias, a cada 2 minutos, do minuto 3 ao 59 de cada hora, das ' +
    '02:03 às 02:59, das 08:03 às 08:59, das 14:03 às 14:59 e das 20:03 às ' +
    '20:59'],
  ['3/2 */2 * * *',
    'todos os dias, a cada 2 minutos, do minuto 3 ao 59, de 2 em 2 horas ' +
    '(das 00:03 às 00:59, das 02:03 às 02:59 … das 22:03 às 22:59)'],
  ['0-29 9,10,17 * * *',
    'todos os dias, a cada minuto durante os primeiros 30 minutos de cada ' +
    'hora, das 09:00 às 10:29 e das 17:00 às 17:29'],
  ['3/2 9-11,17 * * *',
    'todos os dias, a cada 2 minutos, do minuto 3 ao 59 de cada hora, das ' +
    '09:03 às 11:59 e das 17:03 às 17:59'],
  ['5/15 2/6 * * *',
    'todos os dias, nos minutos 5, 20, 35 e 50 de cada hora, das 02:05 às ' +
    '02:50, das 08:05 às 08:50, das 14:05 às 14:50 e das 20:05 às 20:50'],
  ['7,37 */3 * * *',
    'todos os dias, nos minutos 7 e 37, de 3 em 3 horas (00:07, 00:37, ' +
    '03:07, 03:37 … 21:37)'],
  ['*/25 */2 * * *',
    'todos os dias, nos minutos 0, 25 e 50, de 2 em 2 horas (00:00, 00:25, ' +
    '00:50, 02:00, 02:25, 02:50 … 22:50)']
];

export {rows};
