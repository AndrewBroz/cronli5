// French paradigms held out from a renderer's builder: one row per grid
// pattern at a held-out position. They judge whether a renderer built from
// the answers, the lexicon and the visible rows says what a speaker would.
//
// Written by hand from src/lang/fr/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['30 0 9 * * *', 'à 09:00:30 tous les jours'],
  ['0,30 0 9 * * *', 'à 09:00:00 et 09:00:30 tous les jours'],
  ['*/15 0 9 * * *',
    'toutes les 15 secondes de 09:00:00 à 09:00:45 tous les jours'],
  ['0-9 0 9 * * *',
    'toutes les secondes de 09:00:00 à 09:00:09 tous les jours'],

  // clock / minute
  ['30 9 * * *', 'à 9 h 30 tous les jours'],
  ['0,30 9 * * *', 'à 9 h et 9 h 30 tous les jours'],
  ['0-29 9 * * *', 'toutes les minutes de 9 h à 9 h 29 tous les jours'],
  ['0-29,45 9 * * *',
    'toutes les minutes de 9 h à 9 h 29 et à 9 h 45 tous les jours'],
  ['*/7 9 * * *', 'toutes les 7 minutes de 9 h à 9 h 56 tous les jours'],
  ['5/15 9 * * *', 'à 9 h 05, 9 h 20, 9 h 35 et 9 h 50 tous les jours'],
  ['10-40/10 9 * * *', 'à 9 h 10, 9 h 20, 9 h 30 et 9 h 40 tous les jours'],

  // clock / hour
  ['0 12 * * *', 'à 12 h tous les jours'],
  ['0 8,12,18 * * *', 'à 8 h, 12 h et 18 h tous les jours'],
  ['0 9-17 * * *', 'toutes les heures de 9 h à 17 h tous les jours'],
  ['0 */2 * * *', 'toutes les 2 heures'],
  ['0 */6 * * *', 'toutes les 6 heures'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 * * *', 'toutes les 2 heures, sauf à 8 h'],
  ['0 22-2 * * *', 'toutes les heures de 22 h à 2 h tous les jours'],

  // clock / date
  ['0 9 15 * *', 'à 9 h le 15 de chaque mois'],
  ['0 9 1,15 * *', 'à 9 h les 1er et 15 de chaque mois'],
  ['0 9 1-7 * *', 'à 9 h du 1er au 7 de chaque mois'],
  ['0 9 1-7,15 * *', 'à 9 h du 1er au 7 et le 15 de chaque mois'],
  ['0 9 2/2 * *', 'à 9 h les jours pairs de chaque mois'],
  ['0 9 */5 * *', 'à 9 h tous les 5 jours à partir du 1er de chaque mois'],
  ['0 9 L * *', 'à 9 h le dernier jour du mois'],
  ['0 9 15W * *',
    'à 9 h le jour de semaine (du lundi au vendredi) le plus proche du 15 ' +
    'de chaque mois'],

  // clock / month
  ['0 9 * 6 *', 'à 9 h tous les jours en juin'],
  ['0 9 * 1,7 *', 'à 9 h tous les jours en janvier et en juillet'],
  ['0 9 * 6-8 *', 'à 9 h tous les jours de juin à août'],
  ['0 9 * 6-8,12 *', 'à 9 h tous les jours de juin à août et en décembre'],
  ['0 9 * */3 *',
    'à 9 h tous les jours en janvier, en avril, en juillet et en octobre'],
  ['0 9 * 1-11 *', 'à 9 h tous les jours, sauf en décembre'],

  // clock / weekday
  ['0 9 * * 0', 'à 9 h le dimanche'],
  ['0 9 * * 1,3,5', 'à 9 h le lundi, le mercredi et le vendredi'],
  ['0 9 * * 0,6', 'à 9 h le week-end'],
  ['0 9 * * 1-6', 'à 9 h du lundi au samedi'],
  ['0 9 * * 5L', 'à 9 h le dernier vendredi du mois'],
  ['0 9 * * 1#2', 'à 9 h le deuxième lundi du mois'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'toutes les 15 minutes de 09:00:30 à 17:45:30 du lundi au vendredi'],
  ['0,30 */15 9-17 * * 1-5',
    'aux secondes 0 et 30 toutes les 15 minutes de 09:00:00 à 17:45:30 du ' +
    'lundi au vendredi'],
  ['*/15 */15 9-17 * * 1-5',
    'toutes les 15 secondes pendant une minute toutes les 15 minutes de ' +
    '09:00:00 à 17:45:45 du lundi au vendredi'],
  ['0-9 */15 9-17 * * 1-5',
    'toutes les secondes pendant les 10 premières secondes d\'une minute ' +
    'toutes les 15 minutes de 09:00:00 à 17:45:09 du lundi au vendredi'],

  // window / minute
  ['0 9-17 * * 1-5', 'toutes les heures de 9 h à 17 h du lundi au vendredi'],
  ['30 9-17 * * 1-5',
    'toutes les heures de 9 h 30 à 17 h 30 du lundi au vendredi'],
  ['5,20,45 9-17 * * 1-5',
    'aux minutes 5, 20 et 45 de chaque heure de 9 h 05 à 17 h 45 du lundi ' +
    'au vendredi'],
  ['0-29 9-17 * * 1-5',
    'toutes les minutes pendant les 30 premières minutes de chaque heure ' +
    'de 9 h à 17 h 29 du lundi au vendredi'],
  ['*/7 9-17 * * 1-5',
    'toutes les 7 minutes de la minute 0 à la minute 56 de chaque heure de ' +
    '9 h à 17 h 56 du lundi au vendredi'],
  ['5/15 9-17 * * 1-5',
    'aux minutes 5, 20, 35 et 50 de chaque heure de 9 h 05 à 17 h 50 du ' +
    'lundi au vendredi'],
  ['10-40/10 9-17 * * 1-5',
    'aux minutes 10, 20, 30 et 40 de chaque heure de 9 h 10 à 17 h 40 du ' +
    'lundi au vendredi'],

  // window / hour
  ['*/15 0 * * 1-5',
    'toutes les 15 minutes de 0 h à 0 h 45 du lundi au vendredi'],
  ['*/15 9 * * 1-5',
    'toutes les 15 minutes de 9 h à 9 h 45 du lundi au vendredi'],
  ['*/15 9,17 * * 1-5',
    'toutes les 15 minutes de 9 h à 9 h 45 et de 17 h à 17 h 45 du lundi ' +
    'au vendredi'],
  ['*/15 8,12,18 * * 1-5',
    'toutes les 15 minutes pendant les heures commençant à 8 h, 12 h et 18 ' +
    'h du lundi au vendredi'],
  ['*/15 */2 * * 1-5',
    'toutes les 15 minutes pendant les heures paires du lundi au vendredi'],
  ['*/15 */6 * * 1-5',
    'toutes les 15 minutes pendant les heures commençant à 0 h, 6 h, 12 h ' +
    'et 18 h du lundi au vendredi'],
  ['*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5',
    'toutes les 15 minutes pendant les heures paires, sauf de 8 h à 8 h ' +
    '45, du lundi au vendredi'],
  ['*/15 22-2 * * 1-5',
    'toutes les 15 minutes de 0 h à 2 h 45 et de 22 h à 23 h 45 du lundi ' +
    'au vendredi'],

  // window / date
  ['*/15 9-17 15 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 le 15 de chaque mois, et aussi ' +
    'du lundi au vendredi'],
  ['*/15 9-17 1,15 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 les 1er et 15 de chaque mois, ' +
    'et aussi du lundi au vendredi'],
  ['*/15 9-17 1-7 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 du 1er au 7 de chaque mois, et ' +
    'aussi du lundi au vendredi'],
  ['*/15 9-17 1-7,15 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 du 1er au 7 et le 15 de chaque ' +
    'mois, et aussi du lundi au vendredi'],
  ['*/15 9-17 2/2 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 les jours pairs de chaque ' +
    'mois, et aussi du lundi au vendredi'],
  ['*/15 9-17 */5 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 tous les 5 jours à partir du ' +
    '1er de chaque mois, et aussi du lundi au vendredi'],
  ['*/15 9-17 L * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 le dernier jour du mois, et ' +
    'aussi du lundi au vendredi'],
  ['*/15 9-17 15W * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 le jour de semaine (du lundi ' +
    'au vendredi) le plus proche du 15 de chaque mois, et aussi du lundi ' +
    'au vendredi'],

  // window / month
  ['*/15 9-17 * 6 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 du lundi au vendredi en juin'],
  ['*/15 9-17 * 1,7 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 du lundi au vendredi en ' +
    'janvier et en juillet'],
  ['*/15 9-17 * 6-8 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 du lundi au vendredi de juin à ' +
    'août'],
  ['*/15 9-17 * 6-8,12 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 du lundi au vendredi de juin à ' +
    'août et en décembre'],
  ['*/15 9-17 * */3 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 du lundi au vendredi en ' +
    'janvier, en avril, en juillet et en octobre'],
  ['*/15 9-17 * 1-11 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 du lundi au vendredi, sauf en ' +
    'décembre'],

  // window / weekday
  ['*/15 9-17 * * 1', 'toutes les 15 minutes de 9 h à 17 h 45 le lundi'],
  ['*/15 9-17 * * 0', 'toutes les 15 minutes de 9 h à 17 h 45 le dimanche'],
  ['*/15 9-17 * * 0,6', 'toutes les 15 minutes de 9 h à 17 h 45 le week-end'],
  ['*/15 9-17 * * 1-6',
    'toutes les 15 minutes de 9 h à 17 h 45 du lundi au samedi'],
  ['*/15 9-17 * * 5L',
    'toutes les 15 minutes de 9 h à 17 h 45 le dernier vendredi du mois'],
  ['*/15 9-17 * * 1#2',
    'toutes les 15 minutes de 9 h à 17 h 45 le deuxième lundi du mois'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', 'à 00:00:30 le 1er de chaque mois'],
  ['0,30 0 0 1 * *', 'à 00:00:00 et 00:00:30 le 1er de chaque mois'],
  ['*/15 0 0 1 * *',
    'toutes les 15 secondes de 00:00:00 à 00:00:45 le 1er de chaque mois'],
  ['0-9 0 0 1 * *',
    'toutes les secondes de 00:00:00 à 00:00:09 le 1er de chaque mois'],

  // monthly / minute
  ['30 0 1 * *', 'à 0 h 30 le 1er de chaque mois'],
  ['0,30 0 1 * *', 'à 0 h et 0 h 30 le 1er de chaque mois'],
  ['0-29 0 1 * *', 'toutes les minutes de 0 h à 0 h 29 le 1er de chaque mois'],
  ['0-29,45 0 1 * *',
    'toutes les minutes de 0 h à 0 h 29 et à 0 h 45 le 1er de chaque mois'],
  ['*/7 0 1 * *', 'toutes les 7 minutes de 0 h à 0 h 56 le 1er de chaque mois'],
  ['5/15 0 1 * *', 'à 0 h 05, 0 h 20, 0 h 35 et 0 h 50 le 1er de chaque mois'],
  ['10-40/10 0 1 * *',
    'à 0 h 10, 0 h 20, 0 h 30 et 0 h 40 le 1er de chaque mois'],

  // monthly / hour
  ['0 12 1 * *', 'à 12 h le 1er de chaque mois'],
  ['0 8,12,18 1 * *', 'à 8 h, 12 h et 18 h le 1er de chaque mois'],
  ['0 9-17 1 * *', 'toutes les heures de 9 h à 17 h le 1er de chaque mois'],
  ['0 */2 1 * *', 'toutes les 2 heures le 1er de chaque mois'],
  ['0 */6 1 * *', 'toutes les 6 heures le 1er de chaque mois'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * *',
    'toutes les 2 heures, sauf à 8 h, le 1er de chaque mois'],
  ['0 22-2 1 * *',
    'toutes les heures de 0 h à 2 h et à 22 h et 23 h le 1er de chaque mois'],

  // monthly / date
  ['0 0 15 * *', 'à 0 h le 15 de chaque mois'],
  ['0 0 1,15 * *', 'à 0 h les 1er et 15 de chaque mois'],
  ['0 0 1-7 * *', 'à 0 h du 1er au 7 de chaque mois'],
  ['0 0 1-7,15 * *', 'à 0 h du 1er au 7 et le 15 de chaque mois'],
  ['0 0 2/2 * *', 'à 0 h les jours pairs de chaque mois'],
  ['0 0 */5 * *', 'à 0 h tous les 5 jours à partir du 1er de chaque mois'],
  ['0 0 L * *', 'à 0 h le dernier jour du mois'],
  ['0 0 15W * *',
    'à 0 h le jour de semaine (du lundi au vendredi) le plus proche du 15 ' +
    'de chaque mois'],

  // monthly / month
  ['0 0 1 6 *', 'à 0 h le 1er juin'],
  ['0 0 1 1,7 *', 'à 0 h le 1er des mois de janvier et de juillet'],
  ['0 0 1 6-8 *', 'à 0 h le 1er des mois de juin à août'],
  ['0 0 1 6-8,12 *', 'à 0 h le 1er des mois de juin à août et de décembre'],
  ['0 0 1 */3 *',
    'à 0 h le 1er des mois de janvier, d\'avril, de juillet et d\'octobre'],
  ['0 0 1 1-11 *', 'à 0 h le 1er de chaque mois, sauf en décembre'],

  // monthly / weekday
  ['0 0 1 * 0', 'à 0 h le 1er de chaque mois, et aussi le dimanche'],
  ['0 0 1 * 1,3,5',
    'à 0 h le 1er de chaque mois, et aussi le lundi, le mercredi et le ' +
    'vendredi'],
  ['0 0 1 * 0,6', 'à 0 h le 1er de chaque mois, et aussi le week-end'],
  ['0 0 1 * 1-6', 'à 0 h le 1er de chaque mois, et aussi du lundi au samedi'],
  ['0 0 1 * 5L',
    'à 0 h le 1er de chaque mois, et aussi le dernier vendredi du mois'],
  ['0 0 1 * 1#2',
    'à 0 h le 1er de chaque mois, et aussi le deuxième lundi du mois'],

  // open / second — context `* * * * *`
  ['30 * * * * *', 'à la seconde 30 de chaque minute'],
  ['0,30 * * * * *', 'toutes les 30 secondes'],
  ['*/15 * * * * *', 'toutes les 15 secondes'],
  ['0-9 * * * * *',
    'toutes les secondes pendant les 10 premières secondes de chaque minute'],

  // open / minute
  ['30 * * * *', 'à la minute 30 de chaque heure'],
  ['0,30 * * * *', 'toutes les 30 minutes'],
  ['0-29 * * * *',
    'toutes les minutes pendant les 30 premières minutes de chaque heure'],
  ['0-29,45 * * * *',
    'toutes les minutes pendant les 30 premières minutes et à la minute 45 ' +
    'de chaque heure'],
  ['*/7 * * * *',
    'toutes les 7 minutes de la minute 0 à la minute 56 de chaque heure'],
  ['5/15 * * * *', 'aux minutes 5, 20, 35 et 50 de chaque heure'],
  ['10-40/10 * * * *', 'aux minutes 10, 20, 30 et 40 de chaque heure'],

  // open / hour
  ['* 12 * * *', 'toutes les minutes de 12 h à 12 h 59 tous les jours'],
  ['* 8,12,18 * * *',
    'toutes les minutes pendant les heures commençant à 8 h, 12 h et 18 h ' +
    'tous les jours'],
  ['* 9-17 * * *', 'toutes les minutes de 9 h à 17 h 59 tous les jours'],
  ['* */2 * * *', 'toutes les minutes pendant les heures paires'],
  ['* */6 * * *',
    'toutes les minutes pendant les heures commençant à 0 h, 6 h, 12 h et ' +
    '18 h tous les jours'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'toutes les minutes pendant les heures paires, sauf de 8 h à 8 h 59'],
  ['* 22-2 * * *', 'toutes les minutes de 22 h à 2 h 59 tous les jours'],

  // open / date
  ['* * 15 * *', 'toutes les minutes le 15 de chaque mois'],
  ['* * 1,15 * *', 'toutes les minutes les 1er et 15 de chaque mois'],
  ['* * 1-7 * *', 'toutes les minutes du 1er au 7 de chaque mois'],
  ['* * 1-7,15 * *', 'toutes les minutes du 1er au 7 et le 15 de chaque mois'],
  ['* * 2/2 * *', 'toutes les minutes les jours pairs de chaque mois'],
  ['* * */5 * *',
    'toutes les minutes tous les 5 jours à partir du 1er de chaque mois'],
  ['* * L * *', 'toutes les minutes le dernier jour du mois'],
  ['* * 15W * *',
    'toutes les minutes le jour de semaine (du lundi au vendredi) le plus ' +
    'proche du 15 de chaque mois'],

  // open / month
  ['* * * 6 *', 'toutes les minutes en juin'],
  ['* * * 1,7 *', 'toutes les minutes en janvier et en juillet'],
  ['* * * 6-8 *', 'toutes les minutes de juin à août'],
  ['* * * 6-8,12 *', 'toutes les minutes de juin à août et en décembre'],
  ['* * * */3 *',
    'toutes les minutes en janvier, en avril, en juillet et en octobre'],
  ['* * * 1-11 *', 'toutes les minutes, sauf en décembre'],

  // open / weekday
  ['* * * * 0', 'toutes les minutes le dimanche'],
  ['* * * * 1,3,5', 'toutes les minutes le lundi, le mercredi et le vendredi'],
  ['* * * * 0,6', 'toutes les minutes le week-end'],
  ['* * * * 1-6', 'toutes les minutes du lundi au samedi'],
  ['* * * * 5L', 'toutes les minutes le dernier vendredi du mois'],
  ['* * * * 1#2', 'toutes les minutes le deuxième lundi du mois']
];

export {rows};
