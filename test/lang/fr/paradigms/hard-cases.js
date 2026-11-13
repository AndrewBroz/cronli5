// French hard cases: patterns outside the grid that reach rules the
// grid's ladders do not, or where several fields are restricted at once.
// A builder may see these.
//
// Written by hand from src/lang/fr/answers.md. Never produced by running a
// renderer.

const rows = [
  // Years: last in the sentence, unless one year follows one month's name.
  ['0 0 1 1 * 2030', 'le 1er janvier 2030 à 0 h', {years: true}],
  ['0 0 0 1 1 * 2030,2035', 'le 1er janvier à 0 h en 2030 et en 2035'],
  ['0 0 0 1 1 * 2030-2035', 'le 1er janvier à 0 h, de 2030 à 2035'],
  ['0 0 1 1 * */2', 'le 1er janvier à 0 h, les années paires', {years: true}],
  ['30 0 9 1 6 * 2030', 'le 1er juin 2030 à 9 h 00 min 30 s'],
  ['0 0 9 * * * 2030', 'tous les jours à 9 h en 2030'],
  ['0 0 9 * * * 2030,2035', 'tous les jours à 9 h en 2030 et en 2035'],
  ['0 0 9 * * * 2028-2031', 'tous les jours à 9 h, de 2028 à 2031'],
  ['0 0 9 * 6 * 2030', 'tous les jours de juin 2030 à 9 h'],
  ['0 0 9 * 6 1 2030', 'tous les lundis de juin 2030 à 9 h'],
  ['0 0 9 * * 1 2030', 'tous les lundis à 9 h en 2030'],
  ['0 0 9 1,15 6 * 2030', 'le 1er et le 15 juin 2030 à 9 h'],
  ['0 0 9 * 6,7 * 2030', 'tous les jours en juin et en juillet à 9 h en 2030'],
  ['0 0 9 * 6-8 * 2030', 'tous les jours de juin à août à 9 h en 2030'],
  ['0 0 0 1 1,7 * 2030', 'le 1er janvier et le 1er juillet à 0 h en 2030'],
  ['0 0 9 * 1-11 * 2030', 'tous les jours, sauf en décembre, à 9 h en 2030'],
  ['0 0 9 * 6 * 2030,2031', 'tous les jours de juin à 9 h en 2030 et en 2031'],
  ['0 0 9 * 6 * 2030-2032', 'tous les jours de juin à 9 h, de 2030 à 2032'],
  ['0 0 9 L 6 * 2030', 'le dernier jour de juin 2030 à 9 h'],
  ['0 0 9 L * * 2030', 'le dernier jour du mois à 9 h en 2030'],
  ['0 0 9 1 * * 2030', 'le 1er de chaque mois à 9 h en 2030'],
  ['0 0 9 1 * * 2030-2035', 'le 1er de chaque mois à 9 h, de 2030 à 2035'],
  ['0 0 0 1-14,16-31 * * 2030',
    'tous les jours du mois, sauf le 15, à 0 h en 2030'],
  ['0 0 9 * * * 2030/2',
    'tous les jours à 9 h, les années paires à partir de 2030'],
  ['0 0 9 * * * 2028/4',
    'tous les jours à 9 h, une année sur quatre à partir de 2028'],
  ['0 0 9 * * * 2030/40',
    'tous les jours à 9 h, une année sur 40 à partir de 2030'],
  ['0 0 0 1 1 * 2028/4',
    'le 1er janvier à 0 h, une année sur quatre à partir de 2028'],
  ['0 */5 * * * * 2028/4',
    'toutes les 5 minutes, une année sur quatre à partir de 2028'],
  ['0 0 9 * * * 2028-2048/4',
    'tous les jours à 9 h, une année sur quatre de 2028 à 2048'],
  ['0 0 9 * * * 2028-2040/4',
    'tous les jours à 9 h en 2028, 2032, 2036 et 2040'],
  ['0 0 9 * * * 2030-2040/2',
    'tous les jours à 9 h, les années paires de 2030 à 2040'],
  ['0 */5 * * * * */2', 'toutes les 5 minutes, les années paires'],
  ['0 0 9 * * * 1971/2', 'tous les jours à 9 h, les années impaires'],
  ['0 0 9 * * * 2031/2',
    'tous les jours à 9 h, les années impaires à partir de 2031'],
  ['0 0 0 1 1 * 2030-2032,2035',
    'le 1er janvier à 0 h, de 2030 à 2032 et en 2035'],
  ['*/5 * * * * 2030', 'toutes les 5 minutes en 2030', {years: true}],
  ['0 */5 * * 6 * 2030', 'en juin 2030, toutes les 5 minutes'],
  ['0 0 */2 * * * 2030',
    'tous les jours, toutes les 2 heures de 0 h à 22 h en 2030'],
  ['0 0 0,2,4,6,10,12,14,16,18,20,22 * * * 2030',
    'tous les jours, toutes les 2 heures de 0 h à 6 h et de 10 h à 22 h en ' +
    '2030'],

  // Quartz forms.
  ['0 0 1 * ?', 'le 1er de chaque mois à 0 h', {cron: 'quartz'}],
  ['0 0 9 ? * 2-6', 'du lundi au vendredi à 9 h', {cron: 'quartz'}],
  ['0 0 9 ? * 1,7', 'le samedi et le dimanche à 9 h', {cron: 'quartz'}],
  ['0 0 9 ? * 6L', 'le dernier vendredi du mois à 9 h', {cron: 'quartz'}],
  ['0 0 9 ? * 2#1', 'le premier lundi du mois à 9 h', {cron: 'quartz'}],
  // A date moved off a weekend: the date, or the Friday or the Monday it
  // moves to, with no word for a working day (these rows said «jour
  // ouvré», which leaves out public holidays the pattern does not know).
  ['0 0 LW * *',
    'le dernier jour du mois ou, s\'il tombe un samedi ou un dimanche, le ' +
    'vendredi qui précède, à 0 h'],
  ['0 0 LW 6 *',
    'le dernier jour de juin ou, s\'il tombe un samedi ou un dimanche, le ' +
    'vendredi qui précède, à 0 h'],
  ['0 0 LW 1,7 *',
    'le dernier jour de janvier et de juillet ou, s\'il tombe un samedi ' +
    'ou un dimanche, le vendredi qui précède, à 0 h'],
  ['0 0 LW 6-8 *',
    'le dernier jour du mois ou, s\'il tombe un samedi ou un dimanche, le ' +
    'vendredi qui précède, de juin à août, à 0 h'],
  ['0 0 1W * *',
    'le 1er de chaque mois ou, s\'il tombe un samedi ou un dimanche, le ' +
    'lundi qui suit, à 0 h'],
  ['0 0 1W 6 *',
    'le 1er juin ou, s\'il tombe un samedi ou un dimanche, le lundi qui ' +
    'suit, à 0 h'],
  ['0 0 15W 6 *',
    'le 15 juin ou, s\'il tombe un samedi ou un dimanche, le vendredi ou ' +
    'le lundi le plus proche, à 0 h'],
  ['0 0 9 15W 6 * 2030',
    'le 15 juin 2030 ou, s\'il tombe un samedi ou un dimanche, le ' +
    'vendredi ou le lundi le plus proche, à 9 h'],
  ['0 0 9 15W * * 2030',
    'le 15 de chaque mois ou, s\'il tombe un samedi ou un dimanche, le ' +
    'vendredi ou le lundi le plus proche, à 9 h en 2030'],
  ['0 18 15W 3,6,9,12 *',
    'le 15 du mois ou, s\'il tombe un samedi ou un dimanche, le vendredi ' +
    'ou le lundi le plus proche, en mars, juin, septembre et décembre, à ' +
    '18 h'],
  ['0 0 27W * *',
    'le 27 de chaque mois ou, s\'il tombe un samedi ou un dimanche, le ' +
    'vendredi ou le lundi le plus proche, à 0 h'],
  ['0 0 28W * *',
    'le 28 de chaque mois ou, s\'il tombe un samedi ou un dimanche, le ' +
    'vendredi ou le lundi le plus proche, dans le même mois, à 0 h'],
  ['0 0 31W * *',
    'le 31 de chaque mois ou, s\'il tombe un samedi ou un dimanche, le ' +
    'vendredi ou le lundi le plus proche, dans le même mois, à 0 h'],
  ['0 0 30W 6 *',
    'le 30 juin ou, s\'il tombe un samedi ou un dimanche, le vendredi ou ' +
    'le lundi le plus proche, dans le même mois, à 0 h'],
  ['* * 15W * *',
    'le 15 de chaque mois ou, s\'il tombe un samedi ou un dimanche, le ' +
    'vendredi ou le lundi le plus proche, toutes les minutes'],
  ['0 0 15W * 1',
    'à 0 h, tous les lundis ainsi que le 15 de chaque mois ou, s\'il ' +
    'tombe un samedi ou un dimanche, le vendredi ou le lundi le plus ' +
    'proche'],
  ['0 0 LW * *',
    'le dernier jour du mois ou, s\'il tombe un sam. ou un dim., le ven. ' +
    'qui précède, à 0 h', {style: {short: true}}],
  ['0 0 L-3 * *',
    'trois jours avant le dernier jour du mois (le 28 d\'un mois de 31 ' +
    'jours) à 0 h'],
  ['0 0 L-3 2 *',
    'trois jours avant le dernier jour de février (le 25, ou le 26 les ' +
    'années bissextiles) à 0 h'],
  ['0 0 L-3 1,7 *',
    'trois jours avant le dernier jour de janvier et de juillet (le 28 ' +
    'd\'un mois de 31 jours) à 0 h'],
  ['0 9 L-2 * *',
    'deux jours avant le dernier jour du mois (le 29 d\'un mois de 31 ' +
    'jours) à 9 h'],
  ['0 0 L-27 * *',
    'vingt-sept jours avant le dernier jour du mois (le 4 d\'un mois de 31 ' +
    'jours) à 0 h'],
  ['0 0 L-28 * *',
    'vingt-huit jours avant le dernier jour du mois (le 3 d\'un mois de 31 ' +
    'jours), quand le mois compte plus de 28 jours, à 0 h'],
  ['0 0 L-30 * *',
    'trente jours avant le dernier jour du mois (le 1er d\'un mois de 31 ' +
    'jours), quand le mois compte plus de 30 jours, à 0 h'],
  ['0 0 L-1 * *', 'l\'avant-dernier jour du mois à 0 h'],
  ['0 0 L-3 6 *', 'trois jours avant le dernier jour de juin (le 27) à 0 h'],
  ['0 0 L 6 *', 'le dernier jour de juin à 0 h'],
  ['0 0 L 4 *', 'le dernier jour d\'avril à 0 h'],
  ['0 0 L 1,7 *', 'le dernier jour de janvier et de juillet à 0 h'],
  ['0 0 L */2 *',
    'le dernier jour de janvier, mars, mai, juillet, septembre et novembre ' +
    'à 0 h'],
  ['0 0 L 6-8 *', 'le dernier jour du mois, de juin à août, à 0 h'],
  ['0 0 * 6 1#2', 'le deuxième lundi de juin à 0 h'],
  ['0 0 * 10 1#2', 'le deuxième lundi d\'octobre à 0 h'],
  ['0 0 * 6-8 1#2', 'le deuxième lundi du mois, de juin à août, à 0 h'],
  ['0 0 * 1,7 5L', 'le dernier vendredi de janvier et de juillet à 0 h'],
  ['0 9 * * 3#1', 'le premier mercredi du mois à 9 h'],
  ['0 9 * * 4#3', 'le troisième jeudi du mois à 9 h'],
  ['0 9 * * 6L', 'le dernier samedi du mois à 9 h'],
  ['0 9 * * 0#4', 'le quatrième dimanche du mois à 9 h'],
  ['0 9 * * 2#5', 'le cinquième mardi du mois à 9 h'],

  // Macros, startup, and the three forms.
  ['@hourly', 'toutes les heures'],
  ['@daily', 'tous les jours à 0 h'],
  ['@weekly', 'tous les dimanches à 0 h'],
  ['@monthly', 'le 1er de chaque mois à 0 h'],
  ['@yearly', 'le 1er janvier à 0 h'],
  ['@reboot', 'au démarrage du système'],
  ['0 9 * * *', 'S\'exécute tous les jours à 9 h.', {form: 'sentence'}],
  ['0 9 * * *', 'Tous les jours à 9 h', {form: 'label'}],
  ['30 * * * *', 'À 30 de chaque heure', {form: 'label'}],
  ['* * * * *', 'Toutes les minutes', {form: 'label'}],
  ['30 * * * * *',
    '30 secondes après le début de chaque minute',
    {form: 'label'}],
  ['@reboot', 'S\'exécute au démarrage du système.', {form: 'sentence'}],
  ['* * * 12 *',
    'S\'exécute en déc., toutes les minutes.',
    {form: 'sentence', style: {short: true}}],
  ['30 0 17 * * *',
    'S\'exécute tous les jours à 17 h 00 min 30 s.',
    {form: 'sentence'}],
  ['0 17 * * *',
    'S\'exécute tous les jours à 5 h de l\'après-midi.',
    {form: 'sentence', style: {hour12: true}}],
  ['not a pattern', 'une expression cron non reconnue', {lenient: true}],

  // A day of the month and a weekday: months, time, weekdays, then the dates.
  ['0 0 1 * 5', 'à 0 h, tous les vendredis ainsi que le 1er de chaque mois'],
  ['0 0 1 6 5', 'en juin, à 0 h, tous les vendredis ainsi que le 1er'],
  ['0 0 1 6,7 5',
    'en juin et en juillet, à 0 h, tous les vendredis ainsi que le 1er'],
  ['0 0 1,15 1,7 1-5',
    'en janvier et en juillet, à 0 h, du lundi au vendredi ainsi que le ' +
    '1er et le 15'],
  ['52 7-16 1,19,23,28 5-7 3-4',
    'de mai à juillet, toutes les heures de 7 h 52 à 16 h 52, le mercredi ' +
    'et le jeudi ainsi que les 1er, 19, 23 et 28'],
  ['30 4 1-7 * 1',
    'à 4 h 30, tous les lundis ainsi que du 1er au 7 de chaque mois'],
  ['0 0 1 1-11 5',
    'de janvier à novembre, à 0 h, tous les vendredis ainsi que le 1er'],
  ['0 0 L * 5', 'à 0 h, tous les vendredis ainsi que le dernier jour du mois'],
  ['0 0 L 6 5',
    'en juin, à 0 h, tous les vendredis ainsi que le dernier jour du mois'],
  ['0 0 15 * 0-2,4-6',
    'à 0 h, du jeudi au mardi ainsi que le 15 de chaque mois'],
  ['* * 1 * 5',
    'toutes les minutes, tous les vendredis ainsi que le 1er de chaque mois'],
  ['0 0 0 1 * 5 2030',
    'à 0 h, tous les vendredis ainsi que le 1er de chaque mois, en 2030'],
  ['0 0 0 1 6 5 2030',
    'en juin 2030, à 0 h, tous les vendredis ainsi que le 1er'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * 5',
    'toutes les 2 heures de 0 h à 6 h et de 10 h à 22 h, tous les ' +
    'vendredis ainsi que le 1er de chaque mois'],
  ['0 9 * * 5', 'tous les vendredis à 9 h'],

  // A month with its dates.
  ['0 0 1,15 6 *', 'le 1er et le 15 juin à 0 h'],
  ['0 0 1,10,20 6 *', 'les 1er, 10 et 20 juin à 0 h'],
  ['0 0 1-7 6 *', 'du 1er au 7 juin à 0 h'],
  ['0 0 1-7,15 6 *', 'du 1er au 7 et le 15 juin à 0 h'],
  ['0 0 */2 6 *', 'les jours impairs de juin à 0 h'],
  ['0 0 */2 10 *', 'les jours impairs d\'octobre à 0 h'],
  ['0 0 */2 6-8 *', 'les jours impairs du mois, de juin à août, à 0 h'],
  ['0 0 */2 1,7 *', 'les jours impairs de janvier et de juillet à 0 h'],
  ['0 0 */5 6 *', 'les 1er, 6, 11, 16, 21 et 26 juin à 0 h'],
  ['0 0 */5 6-8 *',
    'les 1er, 6, 11, 16, 21, 26 et 31 du mois, de juin à août, à 0 h'],
  ['0 0 */3 * *', 'tous les 3 jours du 1er au 31 de chaque mois à 0 h'],
  ['0 0 */3 6 *', 'tous les 3 jours du 1er au 28 juin à 0 h'],
  ['0 0 */3 2 *', 'tous les 3 jours du 1er au 28 février à 0 h'],
  ['0 0 */3 1,7 *',
    'tous les 3 jours du 1er au 31 du mois, en janvier et en juillet, à 0 h'],
  ['0 0 */3 6-8 *',
    'tous les 3 jours du 1er au 31 du mois, de juin à août, à 0 h'],
  ['0 0 5-20/3 * *', 'les 5, 8, 11, 14, 17 et 20 de chaque mois à 0 h'],
  ['0 0 8/2 * *', 'les jours pairs du 8 au 30 de chaque mois à 0 h'],
  ['0 0 8/2 6 *', 'les jours pairs du 8 au 30 juin à 0 h'],
  ['0 0 9/2 * *', 'les jours impairs du 9 au 31 de chaque mois à 0 h'],
  ['0 0 */21 * *', 'le 1er et le 22 de chaque mois à 0 h'],
  ['0 0 15 1,7 *', 'le 15 janvier et le 15 juillet à 0 h'],
  ['0 0 1 4,10 *', 'le 1er avril et le 1er octobre à 0 h'],
  ['0 0 1 6-8,10 *',
    'le 1er juin, le 1er juillet, le 1er août et le 1er octobre à 0 h'],
  ['0 0 1 2/2 *',
    'le 1er février, le 1er avril, le 1er juin, le 1er août, le 1er ' +
    'octobre et le 1er décembre à 0 h'],
  ['0 0 1 3-9 *', 'le 1er du mois, de mars à septembre, à 0 h'],
  ['0 0 1 1-3,5-8 *',
    'le 1er du mois, de janvier à mars et de mai à août, à 0 h'],
  ['0 0 1,15 1,7 *',
    'le 1er et le 15 du mois, en janvier et en juillet, à 0 h'],
  ['0 0 1-7 6-8 *', 'du 1er au 7 du mois, de juin à août, à 0 h'],
  ['0 0 15 8 *', 'le 15 août à 0 h'],
  ['59 23 31 12 *', 'le 31 décembre à 23 h 59'],
  ['0 0 31 * *', 'le 31 de chaque mois à 0 h'],
  ['0 0 1,2 * *', 'le 1er et le 2 de chaque mois à 0 h'],
  ['0 0 30-2 * *', 'du 30 au 2 de chaque mois à 0 h'],
  ['0 0 28-3 1 *', 'du 1er au 3 et du 28 au 31 janvier à 0 h'],
  ['0 0 1-14,16-31 * *', 'tous les jours du mois, sauf le 15, à 0 h'],
  ['0 0 2-31 * *', 'tous les jours du mois, sauf le 1er, à 0 h'],
  ['0 0 1-14,16-31 6 *', 'tous les jours de juin, sauf le 15, à 0 h'],
  ['0 0 1-14,16-31 8 *', 'tous les jours d\'août, sauf le 15, à 0 h'],
  ['0 0 1-14,17-31 * *', 'tous les jours du mois, sauf le 15 et le 16, à 0 h'],
  ['0 12 1-5,10,20-25 * *',
    'du 1er au 5, le 10 et du 20 au 25 de chaque mois à 12 h'],
  ['0 9 * 1-3,6,9-11 *',
    'tous les jours de janvier à mars, en juin et de septembre à novembre ' +
    'à 9 h'],
  ['0 9 * 4 *', 'tous les jours d\'avril à 9 h'],
  ['0 9 * 4-6 *', 'tous les jours d\'avril à juin à 9 h'],
  ['0 9 * 8-10 *', 'tous les jours d\'août à octobre à 9 h'],
  ['0 9 * 6-8,10 *', 'tous les jours de juin à août et en octobre à 9 h'],
  ['0 9 * 2/2 *',
    'tous les jours en février, avril, juin, août, octobre et décembre à 9 ' +
    'h'],
  ['0 0 * 11-2 * 2030',
    'tous les jours en janvier, février, novembre et décembre à 0 h en 2030',
    {years: true}],

  // Weekday order, runs and wrap-arounds.
  ['0 9 * * 5-1', 'du vendredi au lundi à 9 h'],
  ['0 9 * * 6-1', 'du samedi au lundi à 9 h'],
  ['0 9 * * 2-4', 'du mardi au jeudi à 9 h'],
  ['0 9 * * 0,1', 'le dimanche et le lundi à 9 h'],
  ['0 9 * * 0,5', 'le vendredi et le dimanche à 9 h'],
  ['0 9 * * 0,2-4', 'le mardi, le mercredi, le jeudi et le dimanche à 9 h'],
  ['0 9 * * 0,2-5', 'du mardi au vendredi et le dimanche à 9 h'],
  ['0 9 * * 1,2,3,5', 'le lundi, le mardi, le mercredi et le vendredi à 9 h'],
  ['0 9 * * 0-2,4-6', 'tous les jours, sauf le mercredi, à 9 h'],
  ['0 9 * * 2-0', 'du mardi au dimanche à 9 h'],
  ['0 9 * * 0-5', 'tous les jours, sauf le samedi, à 9 h'],
  ['0 9 * 6 1-6', 'du lundi au samedi en juin à 9 h'],
  ['0 9 * 6 0-2,4-6', 'du jeudi au mardi en juin à 9 h'],
  ['0 9 * 6 1', 'tous les lundis de juin à 9 h'],
  ['0 9 * 6-8 1', 'tous les lundis de juin à août à 9 h'],
  ['0 9 * 1,7 1', 'tous les lundis en janvier et en juillet à 9 h'],
  ['0 9 * 1-11 1', 'tous les lundis, sauf en décembre, à 9 h'],
  ['0 9 * 6 1,4', 'le lundi et le jeudi en juin à 9 h'],
  ['*/15 * * * 0,6', 'le samedi et le dimanche, toutes les 15 minutes'],
  ['* * * * 0-2,4-6', 'tous les jours, sauf le mercredi, toutes les minutes'],
  ['0 0,1,22,23 * * 1', 'tous les lundis à 0 h, 1 h, 22 h et 23 h'],

  // Clock times: the list, and what competes with it.
  ['0,30 9,17 * * *', 'tous les jours à 9 h, 9 h 30, 17 h et 17 h 30'],
  ['5,20 9,17 * * *', 'tous les jours à 9 h 05, 9 h 20, 17 h 05 et 17 h 20'],
  ['5,20,45 9,17 * * *',
    'tous les jours à 9 h 05, 9 h 20, 9 h 45, 17 h 05, 17 h 20 et 17 h 45'],
  ['0 1 * * *', 'tous les jours à 1 h'],
  ['30 1,13 * * *', 'tous les jours à 1 h 30 et à 13 h 30'],
  ['0 9,13 * * *', 'tous les jours à 9 h et à 13 h'],
  ['30 0 * * *', 'tous les jours à 0 h 30'],
  ['5 0 * * *', 'tous les jours à 0 h 05'],
  ['30 12 * * *', 'tous les jours à 12 h 30'],
  ['1 * * * *', 'à 01 de chaque heure'],
  ['* 22-23 * * *', 'tous les jours, toutes les minutes de 22 h à 23 h 59'],
  ['*/30 0-17 * * 2',
    'tous les mardis, toutes les 30 minutes de 0 h à 17 h 30'],
  ['0 0-6,22,23 * * *', 'tous les jours, toutes les heures de 22 h à 6 h'],
  ['*/15 0-5,22-23 * * *',
    'tous les jours, toutes les 15 minutes de 22 h à 5 h 45'],
  ['*/20 9 * * *', 'tous les jours à 9 h, 9 h 20 et 9 h 40'],
  ['0,10,20,40,50 9 * * *',
    'tous les jours, toutes les 10 minutes de 9 h à 9 h 50, sauf à 9 h 30'],

  // Hours on a cadence: the times, or both ends. Exceptions.
  ['0 0,6,12,18 * * *', 'tous les jours à 0 h, 6 h, 12 h et 18 h'],
  ['0 0,6,18 * * *', 'tous les jours à 0 h, 6 h et 18 h'],
  ['0 */8 * * *', 'tous les jours à 0 h, 8 h et 16 h'],
  ['0 */3 * * *', 'tous les jours, toutes les 3 heures de 0 h à 21 h'],
  ['0 */4 * * *', 'tous les jours, toutes les 4 heures de 0 h à 20 h'],
  ['0 */5 * * *', 'tous les jours, toutes les 5 heures de 0 h à 20 h'],
  ['30 */2 * * *', 'tous les jours, toutes les 2 heures de 0 h 30 à 22 h 30'],
  ['30 */3 * * *', 'tous les jours, toutes les 3 heures de 0 h 30 à 21 h 30'],
  ['30 */4 * * 1', 'tous les lundis, toutes les 4 heures de 0 h 30 à 20 h 30'],
  ['30 */5 * * *', 'tous les jours, toutes les 5 heures de 0 h 30 à 20 h 30'],
  ['23 */6 * * *', 'tous les jours à 0 h 23, 6 h 23, 12 h 23 et 18 h 23'],
  ['30 */8 * * *', 'tous les jours à 0 h 30, 8 h 30 et 16 h 30'],
  ['23 1/2 * * *', 'tous les jours, toutes les 2 heures de 1 h 23 à 23 h 23'],
  ['15,45 */2 * * *',
    'tous les jours à 0 h 15 et à 0 h 45, à 2 h 15 et à 2 h 45, et ainsi ' +
    'de suite toutes les 2 heures jusqu\'à 22 h 45'],
  ['15,45 */4 * * *',
    'tous les jours à 0 h 15 et à 0 h 45, à 4 h 15 et à 4 h 45, et ainsi ' +
    'de suite toutes les 4 heures jusqu\'à 20 h 45'],
  ['5,20,45 */3 * * *',
    'tous les jours à 0 h 05, 0 h 20 et 0 h 45, à 3 h 05, 3 h 20 et 3 h ' +
    '45, et ainsi de suite toutes les 3 heures jusqu\'à 21 h 45'],
  ['15,45 1/2 * * 1',
    'tous les lundis à 1 h 15 et à 1 h 45, à 3 h 15 et à 3 h 45, et ainsi ' +
    'de suite toutes les 2 heures jusqu\'à 23 h 45'],
  ['15,45 */6 * * *',
    'tous les jours à 0 h 15, 0 h 45, 6 h 15, 6 h 45, 12 h 15, 12 h 45, 18 ' +
    'h 15 et 18 h 45'],
  ['15,45 */12 * * *', 'tous les jours à 0 h 15, 0 h 45, 12 h 15 et 12 h 45'],
  ['23 */12 * * *', 'tous les jours à 0 h 23 et à 12 h 23'],
  ['0 1/12 * * *', 'tous les jours à 1 h et à 13 h'],
  ['*/15 */12 * * *',
    'tous les jours, toutes les 15 minutes de 0 h à 0 h 45 et de 12 h à 12 ' +
    'h 45'],
  ['0 */12 * * *', 'tous les jours à 0 h et à 12 h'],
  ['0 0/12 * * *', 'tous les jours à 0 h et à 12 h'],
  ['0 0,12 * * *', 'tous les jours à 0 h et à 12 h'],
  ['0 */12 1 * *', 'le 1er de chaque mois à 0 h et à 12 h'],
  ['0 * * * 1', 'tous les lundis, toutes les heures'],
  ['0 0-2,4-23 * * *', 'toutes les heures, sauf à 3 h'],
  ['0 0-2,4-23 * * 1', 'tous les lundis, toutes les heures, sauf à 3 h'],
  ['30 0-2,4-23 * * *', 'à 30 de chaque heure, sauf à 3 h 30'],
  ['30 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'tous les jours, toutes les 2 heures de 0 h 30 à 22 h 30, sauf à 8 h 30'],
  ['5,20,45 0-2,4-23 * * *',
    'à 05, 20 et 45 de chaque heure, sauf de 3 h 05 à 3 h 45'],
  ['*/10 0-2,4-23 * * *', 'toutes les 10 minutes, sauf de 3 h à 3 h 50'],
  ['* 0-2,4-23 * * *', 'toutes les minutes, sauf de 3 h à 3 h 59'],
  ['0-28,30-59 * * * *', 'toutes les minutes, sauf à 29 de chaque heure'],
  ['0-28,30-59 * * * 1',
    'tous les lundis, toutes les minutes, sauf à 29 de chaque heure'],
  ['0-28,30-59 9,17 * * *',
    'tous les jours, toutes les minutes de 9 h à 9 h 59 et de 17 h à 17 h ' +
    '59, sauf à 29 de chaque heure'],
  ['0,10,20,40,50 9-17 * * *',
    'tous les jours, toutes les 10 minutes de 9 h à 17 h 50, sauf à 30 de ' +
    'chaque heure'],
  ['0,10,20,40,50 0-2,4-23 * * *',
    'toutes les 10 minutes, sauf de 3 h à 3 h 50, et sauf à 30 de chaque ' +
    'heure'],

  // Hours as a confinement.
  ['*/15 8-18/2 * * *',
    'tous les jours, toutes les 15 minutes de 8 h à 8 h 45, de 10 h à 10 h ' +
    '45, et ainsi de suite toutes les 2 heures jusqu\'à 18 h 45'],
  ['*/15 1/3 * * *',
    'tous les jours, toutes les 15 minutes de 1 h à 1 h 45, de 4 h à 4 h ' +
    '45, et ainsi de suite toutes les 3 heures jusqu\'à 22 h 45'],
  ['*/15 */3 * * *',
    'tous les jours, toutes les 15 minutes de 0 h à 0 h 45, de 3 h à 3 h ' +
    '45, et ainsi de suite toutes les 3 heures jusqu\'à 21 h 45'],
  ['* */2 * 6 *',
    'tous les jours de juin, toutes les minutes de 0 h à 0 h 59, de 2 h à ' +
    '2 h 59, et ainsi de suite toutes les 2 heures jusqu\'à 22 h 59'],
  ['*/30 */8 * * *',
    'tous les jours à 0 h, 0 h 30, 8 h, 8 h 30, 16 h et 16 h 30'],
  ['0 9-17,20,22 * * *',
    'tous les jours, toutes les heures de 9 h à 17 h, à 20 h et à 22 h'],
  ['30 9-17,22 * * *',
    'tous les jours, toutes les heures de 9 h 30 à 17 h 30 et à 22 h 30'],
  ['* 9-17,20,22 * * *',
    'tous les jours, toutes les minutes de 9 h à 17 h 59, de 20 h à 20 h ' +
    '59 et de 22 h à 22 h 59'],
  ['* 8,10,13,16,19 * * *',
    'tous les jours, toutes les minutes de 8 h à 8 h 59, de 10 h à 10 h ' +
    '59, de 13 h à 13 h 59, de 16 h à 16 h 59 et de 19 h à 19 h 59'],
  ['*/10 6-8,17-19 * * 1-5',
    'du lundi au vendredi, toutes les 10 minutes de 6 h à 8 h 50 et de 17 ' +
    'h à 19 h 50'],
  ['*/20 */2 */2 */3 *',
    'les jours impairs de janvier, avril, juillet et octobre, toutes les ' +
    '20 minutes de 0 h à 0 h 40, de 2 h à 2 h 40, et ainsi de suite toutes ' +
    'les 2 heures jusqu\'à 22 h 40'],
  ['5,20,45 9-17,22 * * *',
    'tous les jours, à 05, 20 et 45 de chaque heure, de 9 h 05 à 17 h 45 ' +
    'et de 22 h 05 à 22 h 45'],
  ['5,20,45 8,10,13,16,19 * * *',
    'tous les jours, à 05, 20 et 45 de chaque heure, de 8 h 05 à 8 h 45, ' +
    'de 10 h 05 à 10 h 45, de 13 h 05 à 13 h 45, de 16 h 05 à 16 h 45 et ' +
    'de 19 h 05 à 19 h 45'],
  ['0-29 */2 * * *',
    'tous les jours, toutes les minutes de 0 h à 0 h 29, de 2 h à 2 h 29, ' +
    'et ainsi de suite toutes les 2 heures jusqu\'à 22 h 29'],

  // Minutes inside the hour.
  ['50-10 9 * * *',
    'tous les jours, toutes les minutes de 9 h à 9 h 10 et de 9 h 50 à 9 h ' +
    '59'],
  ['10-40 9 * * *', 'tous les jours, toutes les minutes de 9 h 10 à 9 h 40'],
  ['30-59 9 * * *', 'tous les jours, toutes les minutes de 9 h 30 à 9 h 59'],
  ['5-10,20 * * * *',
    'toutes les minutes de 05 à 10 de chaque heure, puis à 20'],
  ['45-59 * * * *',
    'toutes les minutes pendant les 15 dernières minutes de chaque heure'],
  ['10-40 * * * *', 'toutes les minutes de 10 à 40 de chaque heure'],
  ['0-29 9,17 * * *',
    'tous les jours, toutes les minutes de 9 h à 9 h 29 et de 17 h à 17 h ' +
    '29'],
  ['0-1 * * * *', 'à 00 et à 01 de chaque heure'],
  ['15,45 * * * *', 'à 15 et à 45 de chaque heure'],
  ['*/21 * * * *', 'à 00, 21 et 42 de chaque heure'],
  ['9,14,47,56 * * * *', 'à 09, 14, 47 et 56 de chaque heure'],
  ['5/10 * * * *', 'à 05, 15, 25, 35, 45 et 55 de chaque heure'],
  ['3/7 * * * *', 'toutes les 7 minutes de 03 à 59 de chaque heure'],
  ['50-10 * * * *',
    'toutes les minutes pendant les 11 premières et les 10 dernières ' +
    'minutes de chaque heure'],
  ['30 * * * 1', 'tous les lundis, à 30 de chaque heure'],
  ['30 * * 6 *', 'en juin, à 30 de chaque heure'],

  // Seconds: the first one in the times, the rest in a clause.
  ['15 30 9 * * *', 'tous les jours à 9 h 30 min 15 s'],
  ['15 30 9,17 * * *',
    'tous les jours à 9 h 30 min 15 s et à 17 h 30 min 15 s'],
  ['15,45 30 9 * * *', 'tous les jours à 9 h 30 min 15 s et à 9 h 30 min 45 s'],
  ['30 0 0 * * *', 'tous les jours à 0 h 00 min 30 s'],
  ['30 0 13 * * *', 'tous les jours à 13 h 00 min 30 s'],
  ['5-10/60 0 9 * * *', 'tous les jours à 9 h 00 min 05 s'],
  ['15 0 */12 * * *', 'tous les jours à 0 h 00 min 15 s et à 12 h 00 min 15 s'],
  ['0,20,40 0 9 * * *',
    'tous les jours à 9 h, toutes les 20 secondes pendant une minute'],
  ['0,20 0 9 * * *', 'tous les jours à 9 h et à 9 h 00 min 20 s'],
  ['10-20 30 9 * * *',
    'tous les jours, toutes les secondes de 9 h 30 min 10 s à 9 h 30 min ' +
    '20 s'],
  ['10-20 */15 * * * *',
    'toutes les 15 minutes, avec 10 secondes de décalage, et à chaque fois ' +
    'toutes les secondes pendant 11 secondes'],
  ['0,10,45 0 9 * * *',
    'tous les jours à 9 h, 9 h 00 min 10 s et 9 h 00 min 45 s'],
  ['* * 9 * * *',
    'tous les jours, toutes les secondes de 9 h à 9 h 59 min 59 s'],
  ['* * 9-17 * * *',
    'tous les jours, toutes les secondes de 9 h à 17 h 59 min 59 s'],
  ['*/6 * 9-17 * * *',
    'tous les jours, toutes les 6 secondes de 9 h à 17 h 59 min 54 s'],
  ['0,30 * 9 * * *',
    'tous les jours, toutes les 30 secondes de 9 h à 9 h 59 min 30 s'],
  ['30 * 9 * * *',
    'tous les jours, toutes les minutes de 9 h 00 min 30 s à 9 h 59 min 30 ' +
    's'],
  ['* 0-29 * * * *',
    'toutes les secondes pendant les 30 premières minutes de chaque heure'],
  ['* 0 9,17 * * *',
    'tous les jours à 9 h et à 17 h, et à chaque fois toutes les secondes ' +
    'pendant une minute'],
  ['30 0 * * * *', 'toutes les heures, avec 30 secondes de décalage'],
  ['15 30 * * * *', 'à 30 de chaque heure, avec 15 secondes de décalage'],
  ['15 5,30 * * * *',
    'à 05 et à 30 de chaque heure, avec 15 secondes de décalage'],
  ['1 30 * * * *', 'à 30 de chaque heure, avec 1 seconde de décalage'],
  ['0-9 0 * * * *',
    'toutes les heures, et à chaque fois toutes les secondes pendant 10 ' +
    'secondes'],
  ['* 30 * * * *',
    'à 30 de chaque heure, et à chaque fois toutes les secondes pendant ' +
    'une minute'],
  ['* 30,42 * * * *',
    'à 30 et à 42 de chaque heure, et à chaque fois toutes les secondes ' +
    'pendant une minute'],
  ['*/15 */15 * * * *',
    'toutes les 15 minutes, et à chaque fois toutes les 15 secondes ' +
    'pendant une minute'],
  ['30 */15 * * * *', 'toutes les 15 minutes, avec 30 secondes de décalage'],
  ['0,30 */15 * * * *',
    'toutes les 15 minutes, et à chaque fois de nouveau 30 secondes plus ' +
    'tard'],
  ['0,10,45 */15 * * * *',
    'toutes les 15 minutes, et à chaque fois de nouveau 10 et 45 secondes ' +
    'plus tard'],
  ['0-9 */15 * * * *',
    'toutes les 15 minutes, et à chaque fois toutes les secondes pendant ' +
    '10 secondes'],
  ['0-28,30-59 */15 * * * *',
    'toutes les 15 minutes, et à chaque fois toutes les secondes pendant ' +
    '29 secondes, puis de nouveau 30 secondes après le début pendant 30 ' +
    'secondes'],
  ['0,10,45 30 9,17 * * *',
    'tous les jours à 9 h 30 et à 17 h 30, et à chaque fois de nouveau 10 ' +
    'et 45 secondes plus tard'],
  ['5/10 */15 * * * *',
    'toutes les 15 minutes, avec 5 secondes de décalage, et à chaque fois ' +
    'toutes les 10 secondes pendant une minute'],
  ['8 5,30 */2 * * *',
    'tous les jours à 0 h 05 min 08 s et à 0 h 30 min 08 s, à 2 h 05 min ' +
    '08 s et à 2 h 30 min 08 s, et ainsi de suite toutes les 2 heures ' +
    'jusqu\'à 22 h 30 min 08 s'],
  ['30 5,20 9-17 * * *',
    'tous les jours, à 05 et à 20 de chaque heure, de 9 h 05 min 30 s à 17 ' +
    'h 20 min 30 s'],
  ['*/10 24 */8 * * *',
    'tous les jours à 0 h 24, 8 h 24 et 16 h 24, et à chaque fois toutes ' +
    'les 10 secondes pendant une minute'],
  ['15,45 * * * * *', '15 et 45 secondes après le début de chaque minute'],
  ['10-40 * * * * *',
    'toutes les secondes de 10 à 40 secondes après le début de chaque ' +
    'minute'],
  ['0-28,30-59 * * * * *',
    'toutes les secondes, sauf 29 secondes après le début de chaque minute'],
  ['* 0-28,30-59 * * * *',
    'toutes les secondes, sauf pendant une minute à 29 de chaque heure'],
  ['* 0-28,30-59 9 * * *',
    'tous les jours, toutes les secondes de 9 h à 9 h 59 min 59 s, sauf ' +
    'pendant une minute à 9 h 29'],
  ['0-28,30-59 0 9 * * *',
    'tous les jours, toutes les secondes de 9 h à 9 h 00 min 28 s et de 9 ' +
    'h 00 min 30 s à 9 h 00 min 59 s'],

  // « Tous les jours » fills the level a restricted hour would skip, and is
  // not said of a schedule that runs every hour.
  ['*/5 * * 6 *', 'en juin, toutes les 5 minutes'],
  ['0 */6 * 6 *', 'tous les jours de juin à 0 h, 6 h, 12 h et 18 h'],
  ['0 */3 * 6 *', 'tous les jours de juin, toutes les 3 heures de 0 h à 21 h'],
  ['0 * * 4 *', 'en avril, toutes les heures'],

  // Several fields at once.
  ['*/10 24 */3 23-25 * 1-2',
    'toutes les 3 heures de 0 h 24 à 21 h 24, et à chaque fois toutes les ' +
    '10 secondes pendant une minute, le lundi et le mardi ainsi que du 23 ' +
    'au 25 de chaque mois'],
  ['*/30 23 */12 * 6-7 6#2 2030/4',
    'le deuxième samedi de juin et de juillet à 0 h 23 et à 12 h 23, et à ' +
    'chaque fois de nouveau 30 secondes plus tard, une année sur quatre à ' +
    'partir de 2030'],
  ['0 35 2,15 * * * 2028,2030',
    'tous les jours à 2 h 35 et à 15 h 35 en 2028 et en 2030'],
  ['* 30,42 3-10 * 7,9,10,12 1,3,4,5',
    'le lundi, le mercredi, le jeudi et le vendredi en juillet, septembre, ' +
    'octobre et décembre, à 30 et à 42 de chaque heure, de 3 h 30 à 10 h ' +
    '42, et à chaque fois toutes les secondes pendant une minute'],
  ['7 4-22/6 1 */2 *',
    'le 1er janvier, le 1er mars, le 1er mai, le 1er juillet, le 1er ' +
    'septembre et le 1er novembre à 4 h 07, 10 h 07, 16 h 07 et 22 h 07'],
  // Seconds that are neither a tiling cadence nor one run (3.4).
  ['1/7 * * * * *',
    'toutes les 7 secondes de 1 à 57 secondes après le début de chaque ' +
    'minute'],
  ['0-9,30-39 * * * * *',
    'toutes les secondes de 0 à 9 et de 30 à 39 secondes après le début ' +
    'de chaque minute'],

  // A day counted from the end of one named month is that month's own
  // day. February has two lengths: twenty-eight days before its last day
  // is the 1st of a leap year and no day of any other year, which is said
  // as every pattern that fires only in leap years is. A month that is
  // always too short never fires. (These three rows gave the leap years
  // in the bracket and, for a month too short, the condition it fails.)
  ['0 0 L-28 2 *',
    'vingt-huit jours avant le dernier jour de février (le 1er) à 0 h, ' +
    'les années bissextiles'],
  ['0 0 L-29 2 *', 'jamais : aucune date ne correspond'],
  ['0 0 L-30 6 *', 'jamais : aucune date ne correspond'],
  ['0 0 L-30 1 *', 'trente jours avant le dernier jour de janvier (le 1er) à 0 h'],
  ['0 0 L-28 6 *', 'vingt-huit jours avant le dernier jour de juin (le 2) à 0 h'],
  // Both months are long enough, so no condition is said. (This row
  // said «quand le mois compte plus de 30 jours» of two months that do.)
  ['0 0 L-30 1,7 *',
    'trente jours avant le dernier jour de janvier et de juillet (le 1er ' +
    'd\'un mois de 31 jours) à 0 h'],
  ['0 0 L-30 6-8 *',
    'trente jours avant le dernier jour de juillet et d\'août (le 1er ' +
    'd\'un mois de 31 jours) à 0 h'],
  ['0 0 L-28 2,3 *',
    'vingt-huit jours avant le dernier jour de février et de mars (le 3 ' +
    'd\'un mois de 31 jours), quand le mois compte plus de 28 jours, à 0 h'],
  // 2030 has no 29 February and 2032 has one.
  ['0 0 9 L-3 2 * 2030',
    'trois jours avant le dernier jour de février 2030 (le 25) à 9 h'],
  ['0 0 9 L-3 2 * 2032',
    'trois jours avant le dernier jour de février 2032 (le 26) à 9 h'],
  ['0 0 9 L-28 2 * 2032',
    'vingt-huit jours avant le dernier jour de février 2032 (le 1er) à 9 h'],

  // An exception never takes away a moment a window names. Minutes 1 to
  // 59 of hour 9 run from 9 h 01, not « de 9 h à 9 h 59, sauf à 9 h ».
  ['1-59 9 * * *', 'tous les jours, toutes les minutes de 9 h 01 à 9 h 59'],
  ['0-58 9 * * *', 'tous les jours, toutes les minutes de 9 h à 9 h 58'],
  ['1-59 9-17 * * *',
    'tous les jours, toutes les minutes pendant les 59 dernières minutes ' +
    'de chaque heure, de 9 h 01 à 17 h 59'],
  ['0-58 9-17 * * *',
    'tous les jours, toutes les minutes pendant les 59 premières minutes ' +
    'de chaque heure, de 9 h à 17 h 58'],
  ['* 1-59 9 * * *',
    'tous les jours, toutes les minutes de 9 h 01 à 9 h 59, et à chaque ' +
    'fois toutes les secondes pendant une minute'],
  // With no window there is no end to take away.
  ['1-59 * * * *', 'toutes les minutes, sauf à 00 de chaque heure'],
  ['0-58 * * * *', 'toutes les minutes, sauf à 59 de chaque heure'],
  // Seconds are placed from the start of the minute, which is no place
  // for an exception: the run says the same with its two ends.
  ['1-59 * * * * *',
    'toutes les secondes de 1 à 59 secondes après le début de chaque minute'],
  ['0-58 * * * * *',
    'toutes les secondes pendant les 59 premières secondes de chaque minute'],

  // A run that wraps is said only the shorter way round. Every day but
  // the 15th, where no exception may be said, is two runs.
  ['0 0 1-14,16-31 * 5',
    'à 0 h, tous les vendredis ainsi que du 1er au 14 et du 16 au 31 de ' +
    'chaque mois'],
  ['0 0 1-10,20-31 * *', 'du 1er au 10 et du 20 au 31 de chaque mois à 0 h'],
  ['0 0 20-4 * *', 'du 1er au 4 et du 20 au 31 de chaque mois à 0 h'],
  ['0 0 20-3 * *', 'du 20 au 3 de chaque mois à 0 h'],
  // Months have names, as weekdays do, and wrap whatever the length.
  ['*/5 * * 1-4,6-12 *', 'de juin à avril, toutes les 5 minutes'],
  ['0 9 * 9-6 *', 'tous les jours de septembre à juin à 9 h'],
  ['* 0 0-2,4-23 * * *',
    'toutes les heures de 0 h à 2 h et de 4 h à 23 h, et à chaque fois ' +
    'toutes les secondes pendant une minute'],
  ['30 0 0-2,4-23 * * *',
    'toutes les heures de 0 h 00 min 30 s à 2 h 00 min 30 s et de 4 h 00 ' +
    'min 30 s à 23 h 00 min 30 s'],
  ['0 0-3,7-23 * * *', 'toutes les heures, sauf à 4 h, 5 h et 6 h'],
  ['0 0-3,9-23 * * *',
    'tous les jours, toutes les heures de 0 h à 3 h et de 9 h à 23 h'],
  ['0 0-5,18-23 * * *', 'tous les jours, toutes les heures de 18 h à 5 h'],
  ['0 0-5,17-23 * * *',
    'tous les jours, toutes les heures de 0 h à 5 h et de 17 h à 23 h'],
  // Weekdays too.
  ['0 9 * * 4-1', 'du jeudi au lundi à 9 h'],

  // Two hours in a row: two times, or one window.
  ['* 0 9,10 * * *',
    'tous les jours à 9 h et à 10 h, et à chaque fois toutes les secondes ' +
    'pendant une minute'],
  ['* 30 9,10 * * *',
    'tous les jours à 9 h 30 et à 10 h 30, et à chaque fois toutes les ' +
    'secondes pendant une minute'],
  ['5,20 22-2 1 * *',
    'le 1er de chaque mois, à 05 et à 20 de chaque heure, de 0 h 05 à 2 h ' +
    '20 et de 22 h 05 à 23 h 20'],
  ['5,20,45 9,10,13,16,19 * * *',
    'tous les jours, à 05, 20 et 45 de chaque heure, de 9 h 05 à 10 h 45, ' +
    'de 13 h 05 à 13 h 45, de 16 h 05 à 16 h 45 et de 19 h 05 à 19 h 45'],

  // Four years or fewer are listed, every second year included.
  ['0 0 0 * * * 2030-2034/2', 'tous les jours à 0 h en 2030, 2032 et 2034'],
  ['0 0 0 * * * 2030-2036/2',
    'tous les jours à 0 h en 2030, 2032, 2034 et 2036'],
  ['0 0 0 * * * 2030-2038/2',
    'tous les jours à 0 h, les années paires de 2030 à 2038'],

  // Seconds in runs with single seconds among them.
  ['10-20,30,40-50 * * * * *',
    'toutes les secondes de 10 à 20, à 30 et toutes les secondes de 40 à ' +
    '50 secondes après le début de chaque minute'],
  ['0-9,20 * * * * *',
    'toutes les secondes de 0 à 9 et à 20 secondes après le début de ' +
    'chaque minute'],
  // After a run, what follows is counted from the start: «20 secondes
  // plus tard» could be counted from the end of the run. (These rows,
  // and the one for seconds 0 to 28 and 30 to 59 above, said «plus
  // tard».)
  ['0-9,20 0 * * * *',
    'toutes les heures, et à chaque fois toutes les secondes pendant 10 ' +
    'secondes, puis de nouveau 20 secondes après le début'],
  ['0-9,20 0 9 * * *',
    'tous les jours à 9 h, toutes les secondes pendant 10 secondes, puis ' +
    'de nouveau 20 secondes après le début'],
  ['10-20,30,40-50 0 9 * * *',
    'tous les jours à 9 h 00 min 10 s, toutes les secondes pendant 11 ' +
    'secondes, puis de nouveau 20 secondes après le début, puis de ' +
    'nouveau 30 secondes après le début pendant 11 secondes'],

  // A single second before the first run: the run is said where it comes.
  ['4,20-52 0 * * * *',
    'toutes les heures, avec 4 secondes de décalage, et à chaque fois de ' +
    'nouveau 16 secondes plus tard, cette fois toutes les secondes pendant ' +
    '33 secondes'],
  ['0,10-20 0 9 * * *',
    'tous les jours à 9 h, de nouveau 10 secondes plus tard, cette fois ' +
    'toutes les ' +
    'secondes pendant 11 secondes'],
  ['0,10-20 * * * * *',
    'à 0 et toutes les secondes de 10 à 20 secondes après le début de ' +
    'chaque minute'],

  // Several stretches of minutes under several hours: a window for each
  // stretch in each hour while that names no more than the minute phrase
  // and one window an hour.
  ['50-10 9,17 * * *',
    'tous les jours, toutes les minutes de 9 h à 9 h 10, de 9 h 50 à 9 h ' +
    '59, de 17 h à 17 h 10 et de 17 h 50 à 17 h 59'],
  ['50-10 */6 * * *',
    'tous les jours, toutes les minutes pendant les 11 premières et les ' +
    '10 dernières minutes de chaque heure, de 0 h à 0 h 59, de 6 h à 6 h ' +
    '59, de 12 h à 12 h 59 et de 18 h à 18 h 59'],
  ['0-4,10-14,20-24 9,17 * * *',
    'tous les jours, toutes les minutes de 00 à 04, toutes les minutes de ' +
    '10 à 14 et toutes les minutes de 20 à 24 de chaque heure, de 9 h à 9 ' +
    'h 24 et de 17 h à 17 h 24'],
  ['0-4,10-14,20-24 9 * * *',
    'tous les jours, toutes les minutes de 9 h à 9 h 04, de 9 h 10 à 9 h ' +
    '14 et de 9 h 20 à 9 h 24'],
  // Minutes in pieces with a single minute among them keep their phrase.
  ['1-5,10,20-25 9-17 * * *',
    'tous les jours, toutes les minutes de 01 à 05, à 10 et toutes les ' +
    'minutes de 20 à 25 de chaque heure, de 9 h 01 à 17 h 25'],

  // A day the named months lack is not said, and a month that lacks the
  // day is not named.
  ['0 0 15,31 6 *', 'le 15 juin à 0 h'],
  ['0 0 1-30 6 *', 'tous les jours de juin à 0 h'],
  ['0 0 30 2-3 *', 'le 30 mars à 0 h'],
  ['0 0 31 1-6 *', 'le 31 janvier, le 31 mars et le 31 mai à 0 h'],
  ['0 0 1,31 4,6,9,11 *',
    'le 1er avril, le 1er juin, le 1er septembre et le 1er novembre à 0 h'],
  ['0 0 31W 6-8 *',
    'le 31 du mois ou, s\'il tombe un samedi ou un dimanche, le vendredi ' +
    'ou le lundi le plus proche, en juillet et en août, dans le même ' +
    'mois, à 0 h'],
  ['0 0 31W */2 *',
    'le 31 du mois ou, s\'il tombe un samedi ou un dimanche, le vendredi ' +
    'ou le lundi le plus proche, en janvier, mars, mai et juillet, dans ' +
    'le même mois, à 0 h'],
  // With every month nothing changes: the reader knows which months have
  // a 31st.
  ['0 0 30 * *', 'le 30 de chaque mois à 0 h'],
  ['0 0 29 * *', 'le 29 de chaque mois à 0 h'],
  ['0 0 29 2,3 *', 'le 29 février et le 29 mars à 0 h'],

  // A pattern that never fires says so and nothing else. (The second row
  // was «le 31 juin à 0 h».)
  ['0 0 30 2 *', 'jamais : aucune date ne correspond'],
  ['0 0 31 6 *', 'jamais : aucune date ne correspond'],
  ['0 0 31 4,6 *', 'jamais : aucune date ne correspond'],
  ['0 0 30,31 2 *', 'jamais : aucune date ne correspond'],
  ['0 0 31W 6 *', 'jamais : aucune date ne correspond'],
  ['0 0 0 29 2 * 2031', 'jamais : aucune date ne correspond'],
  ['*/15 9-17 31 6 * 2030', 'jamais : aucune date ne correspond',
    {years: true}],

  // A pattern that fires only in leap years says so, last.
  ['0 0 29 2 *', 'le 29 février à 0 h, les années bissextiles'],
  ['0 0 29-31 2 *', 'le 29 février à 0 h, les années bissextiles'],
  ['0 0 0 29 2 * 2030-2040',
    'le 29 février à 0 h, de 2030 à 2040, les années bissextiles'],
  ['0 0 0 29 2 * 2032', 'le 29 février 2032 à 0 h'],
  ['0 0 29W 2 *',
    'le 29 février ou, s\'il tombe un samedi ou un dimanche, le vendredi ' +
    'ou le lundi le plus proche, dans le même mois, à 0 h, les années ' +
    'bissextiles'],

  // Days that are every day the months have are no set of days, and
  // beside a weekday no union.
  ['0 9 1-29 2 *', 'tous les jours de février à 9 h'],
  ['0 9 1-30 4 1', 'tous les jours d\'avril à 9 h'],
  ['0 9 1-30 4,6 5', 'tous les jours en avril et en juin à 9 h'],
  // Days that never fire leave the weekdays alone, in the frame's order.
  ['0 0 31 6 1', 'tous les lundis de juin à 0 h'],
  ['0 0 31 2,4,6 1', 'tous les lundis en février, avril et juin à 0 h'],
  // Days that fire in some of a union's months take those months.
  ['0 0 31 6-8 1',
    'de juin à août, à 0 h, tous les lundis ainsi que le 31 juillet et le ' +
    '31 août'],

  // How long a named month is, the facts do not say: an exception there
  // never names the 29th, 30th or 31st. (The first row was «tous les
  // jours de février, sauf le 29», from a table of month lengths.)
  ['0 0 1-28 2 *', 'du 1er au 28 février à 0 h'],
  ['0 0 1-14,16-30 6 *', 'du 1er au 30 juin, sauf le 15, à 0 h'],
  ['0 0 2-30 6 *', 'du 2 au 30 juin à 0 h'],
  ['0 0 1-29/2 6 *', 'les jours impairs du 1er au 29 juin à 0 h'],
  ['0 0 */2 6 *', 'les jours impairs de juin à 0 h'],

  // Neither side of a union takes an exception, which would be read as
  // covering the whole: a Friday the 15th fires.
  ['0 9 1-14,16-31 * 5',
    'à 9 h, tous les vendredis ainsi que du 1er au 14 et du 16 au 31 de ' +
    'chaque mois'],
  ['0 0 15 * 0-2,4-6',
    'à 0 h, du jeudi au mardi ainsi que le 15 de chaque mois'],

  // Years with no end never name the last year of the field.
  ['0 0 9 * * * 2030/1', 'tous les jours à 9 h, à partir de 2030'],
  ['0 0 9 1 1 * 2030/1', 'le 1er janvier à 9 h, à partir de 2030'],
  ['0 0 9 * * * 2030/3',
    'tous les jours à 9 h, une année sur trois à partir de 2030'],
  ['0 0 9 * * * 1970-2029,2031/1', 'tous les jours à 9 h, sauf en 2030'],
  ['0 0 9 * * * 2000-2028/2,2032-2098/2',
    'tous les jours à 9 h, les années paires de 2000 à 2098, sauf en 2030'],
  ['0 0 9 * * * 2030-2035,2037-2040',
    'tous les jours à 9 h, de 2030 à 2040, sauf en 2036'],
  ['0 0 9 * * * 2030/2,2031',
    'tous les jours à 9 h, les années paires à partir de 2030 et en 2031'],
  ['0 0 9 * * * 2030-2040,2045/5',
    'tous les jours à 9 h, de 2030 à 2040 et une année sur cinq à partir ' +
    'de 2045'],
  ['0 0 9 * * * 2030/4,2031/4',
    'tous les jours à 9 h, une année sur quatre à partir de 2030 et une ' +
    'année sur quatre à partir de 2031'],

  // Runs and cadences together, each part whole.
  ['0-20/2,21-59/3 * * * *',
    'toutes les 2 minutes de 00 à 20 et toutes les 3 minutes de 21 à 57 ' +
    'de chaque heure'],
  ['0-20/2,21-59/3 9-17 * * *',
    'tous les jours, toutes les 2 minutes de 00 à 20 et toutes les 3 ' +
    'minutes de 21 à 57 de chaque heure, de 9 h à 17 h 57'],
  ['0 0-10/2,11-23/3 * * *',
    'tous les jours, toutes les 2 heures de 0 h à 10 h et toutes les 3 ' +
    'heures de 11 h à 23 h'],
  ['0 0 1-10/2,11-31/3 * *',
    'les jours impairs du 1er au 11 et tous les 3 jours du 14 au 29 de ' +
    'chaque mois à 0 h'],
  ['0-20/2,21-59/3 * * * * *',
    'toutes les 2 secondes de 0 à 20 et toutes les 3 secondes de 21 à 57 ' +
    'secondes après le début de chaque minute'],

  // Several minutes under hours that are more than one cadence: each
  // cadence shows its first two hours and says how the rest go on, and
  // the next follows «puis». The hour is said in the way that names the
  // fewest things over the hours shown.
  ['*/15 0-10/2,11-23/3 * * *',
    'tous les jours, toutes les 15 minutes de 0 h à 0 h 45, de 2 h à 2 h ' +
    '45, et ainsi de suite toutes les 2 heures jusqu\'à 10 h 45, puis de ' +
    '11 h à 11 h 45, de 14 h à 14 h 45, et ainsi de suite toutes les 3 ' +
    'heures jusqu\'à 23 h 45'],
  ['15,45 0-10/2,11-23/3 * * *',
    'tous les jours à 0 h 15 et à 0 h 45, à 2 h 15 et à 2 h 45, et ainsi ' +
    'de suite toutes les 2 heures jusqu\'à 10 h 45, puis à 11 h 15 et à ' +
    '11 h 45, à 14 h 15 et à 14 h 45, et ainsi de suite toutes les 3 ' +
    'heures jusqu\'à 23 h 45'],
  ['5,20,45 0-10/2,11-23/3 * * *',
    'tous les jours, à 05, 20 et 45 de chaque heure, de 0 h 05 à 0 h 45, ' +
    'de 2 h 05 à 2 h 45, et ainsi de suite toutes les 2 heures jusqu\'à ' +
    '10 h 45, puis de 11 h 05 à 11 h 45, de 14 h 05 à 14 h 45, et ainsi ' +
    'de suite toutes les 3 heures jusqu\'à 23 h 45'],
  // A run of hours beside a cadence of them.
  ['*/15 0-4,6-22/4 * * *',
    'tous les jours, toutes les 15 minutes de 0 h à 4 h 45, puis de 6 h à ' +
    '6 h 45, de 10 h à 10 h 45, et ainsi de suite toutes les 4 heures ' +
    'jusqu\'à 22 h 45'],
  ['15,45 0-4,6-22/4 * * *',
    'tous les jours, à 15 et à 45 de chaque heure, de 0 h 15 à 4 h 45, ' +
    'puis de 6 h 15 à 6 h 45, de 10 h 15 à 10 h 45, et ainsi de suite ' +
    'toutes les 4 heures jusqu\'à 22 h 45'],
  ['0 0-4,6-22/4 * * *',
    'tous les jours, toutes les heures de 0 h à 4 h et toutes les 4 ' +
    'heures de 6 h à 22 h'],
  // A cadence of hours with a hole, where no exception may be said.
  ['0 */15 0,2,4,6,10,12,14,16,18,20,22 * * * 2030',
    'tous les jours, toutes les 15 minutes de 0 h à 0 h 45, de 2 h à 2 h ' +
    '45, et ainsi de suite toutes les 2 heures jusqu\'à 6 h 45, puis de ' +
    '10 h à 10 h 45, de 12 h à 12 h 45, et ainsi de suite toutes les 2 ' +
    'heures jusqu\'à 22 h 45 en 2030'],
  // Three runs of minutes under a cadence of hours keep their phrase.
  ['0-4,10-14,20-24 */2 * * *',
    'tous les jours, toutes les minutes de 00 à 04, toutes les minutes de ' +
    '10 à 14 et toutes les minutes de 20 à 24 de chaque heure, de 0 h à 0 ' +
    'h 24, de 2 h à 2 h 24, et ainsi de suite toutes les 2 heures ' +
    'jusqu\'à 22 h 24'],
  // A cadence of four hours or fewer among other hours is no cadence.
  ['0 8,10,13,16,19 * * *', 'tous les jours à 8 h, 10 h, 13 h, 16 h et 19 h'],
  // Seconds as two cadences, after a clock time.
  ['0-20/2,21-59/3 0 9 * * *',
    'tous les jours à 9 h, toutes les 2 secondes pendant 22 secondes, ' +
    'puis de nouveau 21 secondes après le début, cette fois toutes les 3 ' +
    'secondes pendant 39 secondes'],
  // Months a day skips, where an exception may be said.
  ['0 0 30 1-11 *',
    'le 30 de chaque mois, sauf en février et en décembre, à 0 h'],
  ['0 0 0 31 6-7 1 2030',
    'en juin et en juillet, à 0 h, tous les lundis ainsi que le 31 ' +
    'juillet, en 2030'],
  ['0 0 0 1 1 * 2031,2032/2',
    'le 1er janvier à 0 h en 2031 et les années paires à partir de 2032'],

  // Two values in a row across the turn of the cycle are each said where
  // they come.
  ['0 0,9-17,23 * * *',
    'tous les jours à 0 h, toutes les heures de 9 h à 17 h et à 23 h'],
  ['0 0 31,1,10-15 * *', 'le 1er, du 10 au 15 et le 31 de chaque mois à 0 h'],
  ['0 9 * * 0,1,3,4,5',
    'le lundi, du mercredi au vendredi et le dimanche à 9 h'],

  // A cadence of seconds that does not divide the minute.
  ['*/7 0 9 * * *',
    'tous les jours à 9 h, toutes les 7 secondes jusqu\'à la fin de la ' +
    'minute'],
  ['1/7 0 9 * * *',
    'tous les jours à 9 h 00 min 01 s, toutes les 7 secondes jusqu\'à la ' +
    'fin de la minute'],

  // Every eighth and every fifteenth day are their dates: «tous les 8
  // jours» is a week to a French reader, «tous les 15 jours» two.
  ['0 0 */8 * *', 'les 1er, 9, 17 et 25 de chaque mois à 0 h'],
  ['0 0 */15 * *', 'les 1er, 16 et 31 de chaque mois à 0 h'],
  ['0 0 */5 6 *', 'les 1er, 6, 11, 16, 21 et 26 juin à 0 h'],

  // A cadence of days with a hole, where no exception may be said: what
  // is left each side, a stretch of one or two days named day by day.
  ['0 0 1,3,7-31/2 * 5',
    'à 0 h, tous les vendredis ainsi que le 1er, le 3 et les jours ' +
    'impairs du 7 au 31 de chaque mois'],

  // An exception among the minutes beside hours that are not every hour.
  ['0,12,24,48 9-17 * * *',
    'tous les jours, toutes les 12 minutes de 9 h à 17 h 48, sauf à 36 de ' +
    'chaque heure'],
  ['30 0-28,30-59 * * * *',
    'toutes les minutes pendant les 29 premières et les 30 dernières ' +
    'minutes de chaque heure, avec 30 secondes de décalage']
];

export {rows};
