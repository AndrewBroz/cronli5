// French paradigms held out from a renderer's builder: one row per grid
// pattern at a held-out position. They judge whether a renderer built from
// the answers, the lexicon and the visible rows says what a speaker would.
//
// Written by hand from src/lang/fr/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['30 0 9 * * *', 'tous les jours à 9 h 00 min 30 s'],
  ['0,30 0 9 * * *', 'tous les jours à 9 h et à 9 h 00 min 30 s'],
  ['*/15 0 9 * * *',
    'tous les jours à 9 h, toutes les 15 secondes pendant une minute'],
  ['0-9 0 9 * * *',
    'tous les jours à 9 h, toutes les secondes pendant 10 secondes'],

  // clock / minute
  ['30 9 * * *', 'tous les jours à 9 h 30'],
  ['0,30 9 * * *', 'tous les jours à 9 h et à 9 h 30'],
  ['0-29 9 * * *', 'tous les jours, toutes les minutes de 9 h à 9 h 29'],
  ['0-29,45 9 * * *',
    'tous les jours, toutes les minutes de 9 h à 9 h 29, puis à 9 h 45'],
  ['*/7 9 * * *', 'tous les jours, toutes les 7 minutes de 9 h à 9 h 56'],
  ['5/15 9 * * *', 'tous les jours à 9 h 05, 9 h 20, 9 h 35 et 9 h 50'],
  ['10-40/10 9 * * *', 'tous les jours à 9 h 10, 9 h 20, 9 h 30 et 9 h 40'],

  // clock / hour
  ['0 12 * * *', 'tous les jours à 12 h'],
  ['0 8,12,18 * * *', 'tous les jours à 8 h, 12 h et 18 h'],
  ['0 9-17 * * *', 'tous les jours, toutes les heures de 9 h à 17 h'],
  ['0 */2 * * *', 'tous les jours, toutes les 2 heures de 0 h à 22 h'],
  ['0 */6 * * *', 'tous les jours à 0 h, 6 h, 12 h et 18 h'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'tous les jours, toutes les 2 heures de 0 h à 22 h, sauf à 8 h'],
  ['0 22-2 * * *', 'tous les jours, toutes les heures de 22 h à 2 h'],

  // clock / date
  ['0 9 15 * *', 'le 15 de chaque mois à 9 h'],
  ['0 9 1,15 * *', 'le 1er et le 15 de chaque mois à 9 h'],
  ['0 9 1-7 * *', 'du 1er au 7 de chaque mois à 9 h'],
  ['0 9 1-7,15 * *', 'du 1er au 7 et le 15 de chaque mois à 9 h'],
  ['0 9 2/2 * *', 'les jours pairs de chaque mois à 9 h'],
  ['0 9 */5 * *', 'les 1er, 6, 11, 16, 21, 26 et 31 de chaque mois à 9 h'],
  ['0 9 L * *', 'le dernier jour du mois à 9 h'],
  ['0 9 15W * *',
    'le 15 de chaque mois ou, s\'il tombe un samedi ou un dimanche, le ' +
    'vendredi ou le lundi le plus proche, à 9 h'],

  // clock / month
  ['0 9 * 6 *', 'tous les jours de juin à 9 h'],
  ['0 9 * 1,7 *', 'tous les jours en janvier et en juillet à 9 h'],
  ['0 9 * 6-8 *', 'tous les jours de juin à août à 9 h'],
  ['0 9 * 6-8,12 *', 'tous les jours de juin à août et en décembre à 9 h'],
  ['0 9 * */3 *', 'tous les jours en janvier, avril, juillet et octobre à 9 h'],
  ['0 9 * 1-11 *', 'tous les jours, sauf en décembre, à 9 h'],

  // clock / weekday
  ['0 9 * * 0', 'tous les dimanches à 9 h'],
  ['0 9 * * 1,3,5', 'le lundi, le mercredi et le vendredi à 9 h'],
  ['0 9 * * 0,6', 'le samedi et le dimanche à 9 h'],
  ['0 9 * * 1-6', 'du lundi au samedi à 9 h'],
  ['0 9 * * 5L', 'le dernier vendredi du mois à 9 h'],
  ['0 9 * * 1#2', 'le deuxième lundi du mois à 9 h'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 9 h 00 min 30 s à 17 h ' +
    '45 min 30 s'],
  ['0,30 */15 9-17 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 9 h à 17 h 45, et à ' +
    'chaque fois de nouveau 30 secondes plus tard'],
  ['*/15 */15 9-17 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 9 h à 17 h 45, et à ' +
    'chaque fois toutes les 15 secondes pendant une minute'],
  ['0-9 */15 9-17 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 9 h à 17 h 45, et à ' +
    'chaque fois toutes les secondes pendant 10 secondes'],

  // window / minute
  ['0 9-17 * * 1-5', 'du lundi au vendredi, toutes les heures de 9 h à 17 h'],
  ['30 9-17 * * 1-5',
    'du lundi au vendredi, toutes les heures de 9 h 30 à 17 h 30'],
  ['5,20,45 9-17 * * 1-5',
    'du lundi au vendredi, à 05, 20 et 45 de chaque heure, de 9 h 05 à 17 ' +
    'h 45'],
  ['0-29 9-17 * * 1-5',
    'du lundi au vendredi, toutes les minutes pendant les 30 premières ' +
    'minutes de chaque heure, de 9 h à 17 h 29'],
  ['*/7 9-17 * * 1-5',
    'du lundi au vendredi, toutes les 7 minutes de 00 à 56 de chaque ' +
    'heure, de 9 h à 17 h 56'],
  ['5/15 9-17 * * 1-5',
    'du lundi au vendredi, à 05, 20, 35 et 50 de chaque heure, de 9 h 05 à ' +
    '17 h 50'],
  ['10-40/10 9-17 * * 1-5',
    'du lundi au vendredi, à 10, 20, 30 et 40 de chaque heure, de 9 h 10 à ' +
    '17 h 40'],

  // window / hour
  ['*/15 0 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 0 h à 0 h 45'],
  ['*/15 9 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 9 h à 9 h 45'],
  ['*/15 9,17 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 9 h à 9 h 45 et de 17 ' +
    'h à 17 h 45'],
  ['*/15 8,12,18 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 8 h à 8 h 45, de 12 h ' +
    'à 12 h 45 et de 18 h à 18 h 45'],
  ['*/15 */2 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 0 h à 0 h 45, de 2 h à ' +
    '2 h 45, et ainsi de suite toutes les 2 heures jusqu\'à 22 h 45'],
  ['*/15 */6 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 0 h à 0 h 45, de 6 h à ' +
    '6 h 45, de 12 h à 12 h 45 et de 18 h à 18 h 45'],
  ['*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 0 h à 0 h 45, de 2 h à ' +
    '2 h 45, et ainsi de suite toutes les 2 heures jusqu\'à 22 h 45, sauf ' +
    'de 8 h à 8 h 45'],
  ['*/15 22-2 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 0 h à 2 h 45 et de 22 ' +
    'h à 23 h 45'],

  // window / date
  ['*/15 9-17 15 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45, du lundi au vendredi ainsi ' +
    'que le 15 de chaque mois'],
  ['*/15 9-17 1,15 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45, du lundi au vendredi ainsi ' +
    'que le 1er et le 15 de chaque mois'],
  ['*/15 9-17 1-7 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45, du lundi au vendredi ainsi ' +
    'que du 1er au 7 de chaque mois'],
  ['*/15 9-17 1-7,15 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45, du lundi au vendredi ainsi ' +
    'que du 1er au 7 et le 15 de chaque mois'],
  ['*/15 9-17 2/2 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45, du lundi au vendredi ainsi ' +
    'que les jours pairs de chaque mois'],
  ['*/15 9-17 */5 * 1-5',
    'les 1er, 6, 11, 16, 21, 26 et 31 de chaque mois quand ils tombent un ' +
    'jour du lundi au vendredi, toutes les 15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 L * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45, du lundi au vendredi ainsi ' +
    'que le dernier jour du mois'],
  ['*/15 9-17 15W * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45, du lundi au vendredi ainsi ' +
    'que le 15 de chaque mois ou, s\'il tombe un samedi ou un dimanche, ' +
    'le vendredi ou le lundi le plus proche'],

  // window / month
  ['*/15 9-17 * 6 1-5',
    'du lundi au vendredi en juin, toutes les 15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 * 1,7 1-5',
    'du lundi au vendredi en janvier et en juillet, toutes les 15 minutes ' +
    'de 9 h à 17 h 45'],
  ['*/15 9-17 * 6-8 1-5',
    'du lundi au vendredi de juin à août, toutes les 15 minutes de 9 h à ' +
    '17 h 45'],
  ['*/15 9-17 * 6-8,12 1-5',
    'du lundi au vendredi de juin à août et en décembre, toutes les 15 ' +
    'minutes de 9 h à 17 h 45'],
  ['*/15 9-17 * */3 1-5',
    'du lundi au vendredi en janvier, avril, juillet et octobre, toutes ' +
    'les 15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 * 1-11 1-5',
    'du lundi au vendredi, sauf en décembre, toutes les 15 minutes de 9 h ' +
    'à 17 h 45'],

  // window / weekday
  ['*/15 9-17 * * 1',
    'tous les lundis, toutes les 15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 * * 0',
    'tous les dimanches, toutes les 15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 * * 0,6',
    'le samedi et le dimanche, toutes les 15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 * * 1-6',
    'du lundi au samedi, toutes les 15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 * * 5L',
    'le dernier vendredi du mois, toutes les 15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 * * 1#2',
    'le deuxième lundi du mois, toutes les 15 minutes de 9 h à 17 h 45'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', 'le 1er de chaque mois à 0 h 00 min 30 s'],
  ['0,30 0 0 1 * *', 'le 1er de chaque mois à 0 h et à 0 h 00 min 30 s'],
  ['*/15 0 0 1 * *',
    'le 1er de chaque mois à 0 h, toutes les 15 secondes pendant une minute'],
  ['0-9 0 0 1 * *',
    'le 1er de chaque mois à 0 h, toutes les secondes pendant 10 secondes'],

  // monthly / minute
  ['30 0 1 * *', 'le 1er de chaque mois à 0 h 30'],
  ['0,30 0 1 * *', 'le 1er de chaque mois à 0 h et à 0 h 30'],
  ['0-29 0 1 * *', 'le 1er de chaque mois, toutes les minutes de 0 h à 0 h 29'],
  ['0-29,45 0 1 * *',
    'le 1er de chaque mois, toutes les minutes de 0 h à 0 h 29, puis à 0 h ' +
    '45'],
  ['*/7 0 1 * *',
    'le 1er de chaque mois, toutes les 7 minutes de 0 h à 0 h 56'],
  ['5/15 0 1 * *', 'le 1er de chaque mois à 0 h 05, 0 h 20, 0 h 35 et 0 h 50'],
  ['10-40/10 0 1 * *',
    'le 1er de chaque mois à 0 h 10, 0 h 20, 0 h 30 et 0 h 40'],

  // monthly / hour
  ['0 12 1 * *', 'le 1er de chaque mois à 12 h'],
  ['0 8,12,18 1 * *', 'le 1er de chaque mois à 8 h, 12 h et 18 h'],
  ['0 9-17 1 * *', 'le 1er de chaque mois, toutes les heures de 9 h à 17 h'],
  ['0 */2 1 * *', 'le 1er de chaque mois, toutes les 2 heures de 0 h à 22 h'],
  ['0 */6 1 * *', 'le 1er de chaque mois à 0 h, 6 h, 12 h et 18 h'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * *',
    'le 1er de chaque mois, toutes les 2 heures de 0 h à 22 h, sauf à 8 h'],
  ['0 22-2 1 * *',
    'le 1er de chaque mois, toutes les heures de 0 h à 2 h, à 22 h et à 23 ' +
    'h'],

  // monthly / date
  ['0 0 15 * *', 'le 15 de chaque mois à 0 h'],
  ['0 0 1,15 * *', 'le 1er et le 15 de chaque mois à 0 h'],
  ['0 0 1-7 * *', 'du 1er au 7 de chaque mois à 0 h'],
  ['0 0 1-7,15 * *', 'du 1er au 7 et le 15 de chaque mois à 0 h'],
  ['0 0 2/2 * *', 'les jours pairs de chaque mois à 0 h'],
  ['0 0 */5 * *', 'les 1er, 6, 11, 16, 21, 26 et 31 de chaque mois à 0 h'],
  ['0 0 L * *', 'le dernier jour du mois à 0 h'],
  ['0 0 15W * *',
    'le 15 de chaque mois ou, s\'il tombe un samedi ou un dimanche, le ' +
    'vendredi ou le lundi le plus proche, à 0 h'],

  // monthly / month
  ['0 0 1 6 *', 'le 1er juin à 0 h'],
  ['0 0 1 1,7 *', 'le 1er janvier et le 1er juillet à 0 h'],
  ['0 0 1 6-8 *', 'le 1er juin, le 1er juillet et le 1er août à 0 h'],
  ['0 0 1 6-8,12 *',
    'le 1er juin, le 1er juillet, le 1er août et le 1er décembre à 0 h'],
  ['0 0 1 */3 *',
    'le 1er janvier, le 1er avril, le 1er juillet et le 1er octobre à 0 h'],
  ['0 0 1 1-11 *', 'le 1er de chaque mois, sauf en décembre, à 0 h'],

  // monthly / weekday
  ['0 0 1 * 0', 'à 0 h, tous les dimanches ainsi que le 1er de chaque mois'],
  ['0 0 1 * 1,3,5',
    'à 0 h, le lundi, le mercredi et le vendredi ainsi que le 1er de ' +
    'chaque mois'],
  ['0 0 1 * 0,6',
    'à 0 h, le samedi et le dimanche ainsi que le 1er de chaque mois'],
  ['0 0 1 * 1-6', 'à 0 h, du lundi au samedi ainsi que le 1er de chaque mois'],
  ['0 0 1 * 5L',
    'à 0 h, le dernier vendredi du mois ainsi que le 1er de chaque mois'],
  ['0 0 1 * 1#2',
    'à 0 h, le deuxième lundi du mois ainsi que le 1er de chaque mois'],

  // open / second — context `* * * * *`
  ['30 * * * * *', '30 secondes après le début de chaque minute'],
  ['0,30 * * * * *', 'toutes les 30 secondes'],
  ['*/15 * * * * *', 'toutes les 15 secondes'],
  ['0-9 * * * * *',
    'toutes les secondes pendant les 10 premières secondes de chaque minute'],

  // open / minute
  ['30 * * * *', 'à 30 de chaque heure'],
  ['0,30 * * * *', 'toutes les 30 minutes'],
  ['0-29 * * * *',
    'toutes les minutes pendant les 30 premières minutes de chaque heure'],
  ['0-29,45 * * * *',
    'toutes les minutes pendant les 30 premières minutes de chaque heure, ' +
    'puis à 45'],
  ['*/7 * * * *', 'toutes les 7 minutes de 00 à 56 de chaque heure'],
  ['5/15 * * * *', 'à 05, 20, 35 et 50 de chaque heure'],
  ['10-40/10 * * * *', 'à 10, 20, 30 et 40 de chaque heure'],

  // open / hour
  ['* 12 * * *', 'tous les jours, toutes les minutes de 12 h à 12 h 59'],
  ['* 8,12,18 * * *',
    'tous les jours, toutes les minutes de 8 h à 8 h 59, de 12 h à 12 h 59 ' +
    'et de 18 h à 18 h 59'],
  ['* 9-17 * * *', 'tous les jours, toutes les minutes de 9 h à 17 h 59'],
  ['* */2 * * *',
    'tous les jours, toutes les minutes de 0 h à 0 h 59, de 2 h à 2 h 59, ' +
    'et ainsi de suite toutes les 2 heures jusqu\'à 22 h 59'],
  ['* */6 * * *',
    'tous les jours, toutes les minutes de 0 h à 0 h 59, de 6 h à 6 h 59, ' +
    'de 12 h à 12 h 59 et de 18 h à 18 h 59'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'tous les jours, toutes les minutes de 0 h à 0 h 59, de 2 h à 2 h 59, ' +
    'et ainsi de suite toutes les 2 heures jusqu\'à 22 h 59, sauf de 8 h à ' +
    '8 h 59'],
  ['* 22-2 * * *', 'tous les jours, toutes les minutes de 22 h à 2 h 59'],

  // open / date
  ['* * 15 * *', 'le 15 de chaque mois, toutes les minutes'],
  ['* * 1,15 * *', 'le 1er et le 15 de chaque mois, toutes les minutes'],
  ['* * 1-7 * *', 'du 1er au 7 de chaque mois, toutes les minutes'],
  ['* * 1-7,15 * *', 'du 1er au 7 et le 15 de chaque mois, toutes les minutes'],
  ['* * 2/2 * *', 'les jours pairs de chaque mois, toutes les minutes'],
  ['* * */5 * *',
    'les 1er, 6, 11, 16, 21, 26 et 31 de chaque mois, toutes les minutes'],
  ['* * L * *', 'le dernier jour du mois, toutes les minutes'],
  ['* * 15W * *',
    'le 15 de chaque mois ou, s\'il tombe un samedi ou un dimanche, le ' +
    'vendredi ou le lundi le plus proche, toutes les minutes'],

  // open / month
  ['* * * 6 *', 'en juin, toutes les minutes'],
  ['* * * 1,7 *', 'en janvier et en juillet, toutes les minutes'],
  ['* * * 6-8 *', 'de juin à août, toutes les minutes'],
  ['* * * 6-8,12 *', 'de juin à août et en décembre, toutes les minutes'],
  ['* * * */3 *', 'en janvier, avril, juillet et octobre, toutes les minutes'],
  ['* * * 1-11 *', 'de janvier à novembre, toutes les minutes'],

  // open / weekday
  ['* * * * 0', 'tous les dimanches, toutes les minutes'],
  ['* * * * 1,3,5', 'le lundi, le mercredi et le vendredi, toutes les minutes'],
  ['* * * * 0,6', 'le samedi et le dimanche, toutes les minutes'],
  ['* * * * 1-6', 'du lundi au samedi, toutes les minutes'],
  ['* * * * 5L', 'le dernier vendredi du mois, toutes les minutes'],
  ['* * * * 1#2', 'le deuxième lundi du mois, toutes les minutes']
];

export {rows};
