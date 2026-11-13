// French paradigms a renderer's builder may see: one row per grid
// pattern at a visible position.
//
// Written by hand from src/lang/fr/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *', 'toutes les secondes de 09:00:00 à 09:00:59 tous les jours'],
  ['*/6 0 9 * * *',
    'toutes les 6 secondes de 09:00:00 à 09:00:54 tous les jours'],
  ['5/10 0 9 * * *',
    'toutes les 10 secondes de 09:00:05 à 09:00:55 tous les jours'],

  // clock / minute
  ['* 9 * * *', 'toutes les minutes de 9 h à 9 h 59 tous les jours'],
  ['5,20,45 9 * * *', 'à 9 h 05, 9 h 20 et 9 h 45 tous les jours'],
  ['*/15 9 * * *', 'toutes les 15 minutes de 9 h à 9 h 45 tous les jours'],
  ['0,15,45 9 * * *', 'à 9 h, 9 h 15 et 9 h 45 tous les jours'],

  // clock / hour
  ['0 * * * *', 'toutes les heures'],
  ['0 9,17 * * *', 'à 9 h et 17 h tous les jours'],
  ['0 9-17,22 * * *',
    'toutes les heures de 9 h à 17 h et à 22 h tous les jours'],
  ['0 1/2 * * *', 'toutes les 2 heures de 1 h à 23 h tous les jours'],

  // clock / date
  ['0 9 1 * *', 'à 9 h le 1er de chaque mois'],
  ['0 9 1,10,20 * *', 'à 9 h les 1er, 10 et 20 de chaque mois'],
  ['0 9 */2 * *', 'à 9 h les jours impairs de chaque mois'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'à 9 h les jours impairs de chaque mois, sauf le 15'],

  // clock / month
  ['0 9 * 1 *', 'à 9 h tous les jours en janvier'],
  ['0 9 * 3,6,9,12 *',
    'à 9 h tous les jours en mars, en juin, en septembre et en décembre'],
  ['0 9 * */2 *', 'à 9 h tous les jours un mois sur deux à partir de janvier'],
  ['0 9 * 11-2 *', 'à 9 h tous les jours de novembre à février'],

  // clock / weekday
  ['0 9 * * 1', 'à 9 h le lundi'],
  ['0 9 * * 1-5', 'à 9 h du lundi au vendredi'],
  ['0 9 * * 2,4', 'à 9 h le mardi et le jeudi'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'toutes les secondes pendant une minute toutes les 15 minutes de ' +
    '09:00:00 à 17:45:59 du lundi au vendredi'],
  ['*/6 */15 9-17 * * 1-5',
    'toutes les 6 secondes pendant une minute toutes les 15 minutes de ' +
    '09:00:00 à 17:45:54 du lundi au vendredi'],
  ['5/10 */15 9-17 * * 1-5',
    'toutes les 10 secondes pendant une minute toutes les 15 minutes de ' +
    '09:00:05 à 17:45:55 du lundi au vendredi'],

  // window / minute
  ['* 9-17 * * 1-5',
    'toutes les minutes de 9 h à 17 h 59 du lundi au vendredi'],
  ['0,30 9-17 * * 1-5',
    'toutes les 30 minutes de 9 h à 17 h 30 du lundi au vendredi'],
  ['0-29,45 9-17 * * 1-5',
    'toutes les minutes pendant les 30 premières minutes et à la minute 45 ' +
    'de chaque heure de 9 h à 17 h 45 du lundi au vendredi'],
  ['0,15,45 9-17 * * 1-5',
    'aux minutes 0, 15 et 45 de chaque heure de 9 h à 17 h 45 du lundi au ' +
    'vendredi'],

  // window / hour
  ['*/15 * * * 1-5', 'toutes les 15 minutes du lundi au vendredi'],
  ['*/15 12 * * 1-5',
    'toutes les 15 minutes de 12 h à 12 h 45 du lundi au vendredi'],
  ['*/15 9-17,22 * * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 et de 22 h à 22 h 45 du lundi ' +
    'au vendredi'],
  ['*/15 1/2 * * 1-5',
    'toutes les 15 minutes pendant les heures impaires du lundi au vendredi'],

  // window / date
  ['*/15 9-17 1 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 le 1er de chaque mois, et ' +
    'aussi du lundi au vendredi'],
  ['*/15 9-17 1,10,20 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 les 1er, 10 et 20 de chaque ' +
    'mois, et aussi du lundi au vendredi'],
  ['*/15 9-17 */2 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 les jours impairs de chaque ' +
    'mois, et aussi du lundi au vendredi'],
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 les jours impairs de chaque ' +
    'mois, sauf le 15, et aussi du lundi au vendredi'],

  // window / month
  ['*/15 9-17 * 1 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 du lundi au vendredi en janvier'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 du lundi au vendredi en mars, ' +
    'en juin, en septembre et en décembre'],
  ['*/15 9-17 * */2 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 du lundi au vendredi un mois ' +
    'sur deux à partir de janvier'],
  ['*/15 9-17 * 11-2 1-5',
    'toutes les 15 minutes de 9 h à 17 h 45 du lundi au vendredi de ' +
    'novembre à février'],

  // window / weekday
  ['*/15 9-17 * * *', 'toutes les 15 minutes de 9 h à 17 h 45 tous les jours'],
  ['*/15 9-17 * * 1,3,5',
    'toutes les 15 minutes de 9 h à 17 h 45 le lundi, le mercredi et le ' +
    'vendredi'],
  ['*/15 9-17 * * 2,4',
    'toutes les 15 minutes de 9 h à 17 h 45 le mardi et le jeudi'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *',
    'toutes les secondes de 00:00:00 à 00:00:59 le 1er de chaque mois'],
  ['*/6 0 0 1 * *',
    'toutes les 6 secondes de 00:00:00 à 00:00:54 le 1er de chaque mois'],
  ['5/10 0 0 1 * *',
    'toutes les 10 secondes de 00:00:05 à 00:00:55 le 1er de chaque mois'],

  // monthly / minute
  ['* 0 1 * *', 'toutes les minutes de 0 h à 0 h 59 le 1er de chaque mois'],
  ['5,20,45 0 1 * *', 'à 0 h 05, 0 h 20 et 0 h 45 le 1er de chaque mois'],
  ['*/15 0 1 * *',
    'toutes les 15 minutes de 0 h à 0 h 45 le 1er de chaque mois'],
  ['0,15,45 0 1 * *', 'à 0 h, 0 h 15 et 0 h 45 le 1er de chaque mois'],

  // monthly / hour
  ['0 * 1 * *', 'toutes les heures le 1er de chaque mois'],
  ['0 9,17 1 * *', 'à 9 h et 17 h le 1er de chaque mois'],
  ['0 9-17,22 1 * *',
    'toutes les heures de 9 h à 17 h et à 22 h le 1er de chaque mois'],
  ['0 1/2 1 * *', 'toutes les 2 heures de 1 h à 23 h le 1er de chaque mois'],

  // monthly / date
  ['0 0 * * *', 'à 0 h tous les jours'],
  ['0 0 1,10,20 * *', 'à 0 h les 1er, 10 et 20 de chaque mois'],
  ['0 0 */2 * *', 'à 0 h les jours impairs de chaque mois'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'à 0 h les jours impairs de chaque mois, sauf le 15'],

  // monthly / month
  ['0 0 1 1 *', 'à 0 h le 1er janvier'],
  ['0 0 1 3,6,9,12 *',
    'à 0 h le 1er des mois de mars, de juin, de septembre et de décembre'],
  ['0 0 1 */2 *', 'à 0 h le 1er d\'un mois sur deux à partir de janvier'],
  ['0 0 1 11-2 *', 'à 0 h le 1er des mois de novembre à février'],

  // monthly / weekday
  ['0 0 1 * 1', 'à 0 h le 1er de chaque mois, et aussi le lundi'],
  ['0 0 1 * 1-5', 'à 0 h le 1er de chaque mois, et aussi du lundi au vendredi'],
  ['0 0 1 * 2,4', 'à 0 h le 1er de chaque mois, et aussi le mardi et le jeudi'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'toutes les secondes'],
  ['*/6 * * * * *', 'toutes les 6 secondes'],
  ['5/10 * * * * *',
    'toutes les 10 secondes de la seconde 5 à la seconde 55 de chaque ' +
    'minute'],

  // open / minute
  ['5,20,45 * * * *', 'aux minutes 5, 20 et 45 de chaque heure'],
  ['*/15 * * * *', 'toutes les 15 minutes'],
  ['0,15,45 * * * *', 'aux minutes 0, 15 et 45 de chaque heure'],

  // open / hour
  ['* 0 * * *', 'toutes les minutes de 0 h à 0 h 59 tous les jours'],
  ['* 9,17 * * *',
    'toutes les minutes de 9 h à 9 h 59 et de 17 h à 17 h 59 tous les jours'],
  ['* 9-17,22 * * *',
    'toutes les minutes de 9 h à 17 h 59 et de 22 h à 22 h 59 tous les ' +
    'jours'],
  ['* 1/2 * * *', 'toutes les minutes pendant les heures impaires'],

  // open / date
  ['* * 1 * *', 'toutes les minutes le 1er de chaque mois'],
  ['* * 1,10,20 * *', 'toutes les minutes les 1er, 10 et 20 de chaque mois'],
  ['* * */2 * *', 'toutes les minutes les jours impairs de chaque mois'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'toutes les minutes les jours impairs de chaque mois, sauf le 15'],

  // open / month
  ['* * * 1 *', 'toutes les minutes en janvier'],
  ['* * * 3,6,9,12 *',
    'toutes les minutes en mars, en juin, en septembre et en décembre'],
  ['* * * */2 *', 'toutes les minutes un mois sur deux à partir de janvier'],
  ['* * * 11-2 *', 'toutes les minutes de novembre à février'],

  // open / weekday
  ['* * * * 1', 'toutes les minutes le lundi'],
  ['* * * * 1-5', 'toutes les minutes du lundi au vendredi'],
  ['* * * * 2,4', 'toutes les minutes le mardi et le jeudi']
];

export {rows};
