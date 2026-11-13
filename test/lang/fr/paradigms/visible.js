// French paradigms a renderer's builder may see: one row per grid
// pattern at a visible position.
//
// Written by hand from src/lang/fr/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *',
    'tous les jours à 9 h, chaque fois toutes les secondes pendant une ' +
    'minute'],
  ['*/6 0 9 * * *',
    'tous les jours à 9 h, chaque fois toutes les 6 secondes pendant une ' +
    'minute'],
  ['5/10 0 9 * * *',
    'tous les jours à 9 h, chaque fois 5, 15, 25, 35, 45 et 55 secondes ' +
    'après le début de la minute'],

  // clock / minute
  ['* 9 * * *', 'tous les jours, toutes les minutes de 9 h à 9 h 59'],
  ['5,20,45 9 * * *', 'tous les jours à 9 h 05, 9 h 20 et 9 h 45'],
  ['*/15 9 * * *', 'tous les jours, toutes les 15 minutes de 9 h à 9 h 45'],
  ['0,15,45 9 * * *', 'tous les jours à 9 h, 9 h 15 et 9 h 45'],

  // clock / hour
  ['0 * * * *', 'toutes les heures'],
  ['0 9,17 * * *', 'tous les jours à 9 h et à 17 h'],
  ['0 9-17,22 * * *',
    'tous les jours, toutes les heures de 9 h à 17 h et à 22 h'],
  ['0 1/2 * * *', 'tous les jours, toutes les 2 heures de 1 h à 23 h'],

  // clock / date
  ['0 9 1 * *', 'le 1er de chaque mois à 9 h'],
  ['0 9 1,10,20 * *', 'les 1er, 10 et 20 de chaque mois à 9 h'],
  ['0 9 */2 * *', 'les jours impairs de chaque mois à 9 h'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'les jours impairs de chaque mois, sauf le 15, à 9 h'],

  // clock / month
  ['0 9 * 1 *', 'tous les jours en janvier à 9 h'],
  ['0 9 * 3,6,9,12 *',
    'tous les jours en mars, juin, septembre et décembre à 9 h'],
  ['0 9 * */2 *',
    'tous les jours en janvier, mars, mai, juillet, septembre et novembre ' +
    'à 9 h'],
  ['0 9 * 11-2 *', 'tous les jours de novembre à février à 9 h'],

  // clock / weekday
  ['0 9 * * 1', 'tous les lundis à 9 h'],
  ['0 9 * * 1-5', 'du lundi au vendredi à 9 h'],
  ['0 9 * * 2,4', 'le mardi et le jeudi à 9 h'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 9 h à 17 h 45, chaque ' +
    'fois toutes les secondes pendant une minute'],
  ['*/6 */15 9-17 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 9 h à 17 h 45, chaque ' +
    'fois toutes les 6 secondes pendant une minute'],
  ['5/10 */15 9-17 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 9 h à 17 h 45, chaque ' +
    'fois 5, 15, 25, 35, 45 et 55 secondes après le début de la minute'],

  // window / minute
  ['* 9-17 * * 1-5',
    'du lundi au vendredi, toutes les minutes de 9 h à 17 h 59'],
  ['0,30 9-17 * * 1-5',
    'du lundi au vendredi, toutes les 30 minutes de 9 h à 17 h 30'],
  ['0-29,45 9-17 * * 1-5',
    'du lundi au vendredi, toutes les minutes pendant les 30 premières ' +
    'minutes de chaque heure, puis à 45, de 9 h à 17 h 45'],
  ['0,15,45 9-17 * * 1-5',
    'du lundi au vendredi, à 00, 15 et 45 de chaque heure, de 9 h à 17 h 45'],

  // window / hour
  ['*/15 * * * 1-5', 'du lundi au vendredi, toutes les 15 minutes'],
  ['*/15 12 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 12 h à 12 h 45'],
  ['*/15 9-17,22 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes de 9 h à 17 h 45 et de 22 ' +
    'h à 22 h 45'],
  ['*/15 1/2 * * 1-5',
    'du lundi au vendredi, toutes les 15 minutes, une heure sur deux à ' +
    'partir de 1 h'],

  // window / date
  ['*/15 9-17 1 * 1-5',
    'le 1er de chaque mois, ainsi que du lundi au vendredi, toutes les 15 ' +
    'minutes de 9 h à 17 h 45'],
  ['*/15 9-17 1,10,20 * 1-5',
    'les 1er, 10 et 20 de chaque mois, ainsi que du lundi au vendredi, ' +
    'toutes les 15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 */2 * 1-5',
    'les jours impairs de chaque mois, ainsi que du lundi au vendredi, ' +
    'toutes les 15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'les jours impairs du 1er au 13 et du 17 au 31 de chaque mois, ainsi ' +
    'que du lundi au vendredi, toutes les 15 minutes de 9 h à 17 h 45'],

  // window / month
  ['*/15 9-17 * 1 1-5',
    'du lundi au vendredi en janvier, toutes les 15 minutes de 9 h à 17 h ' +
    '45'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'du lundi au vendredi en mars, juin, septembre et décembre, toutes les ' +
    '15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 * */2 1-5',
    'du lundi au vendredi en janvier, mars, mai, juillet, septembre et ' +
    'novembre, toutes les 15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 * 11-2 1-5',
    'du lundi au vendredi de novembre à février, toutes les 15 minutes de ' +
    '9 h à 17 h 45'],

  // window / weekday
  ['*/15 9-17 * * *', 'tous les jours, toutes les 15 minutes de 9 h à 17 h 45'],
  ['*/15 9-17 * * 1,3,5',
    'le lundi, le mercredi et le vendredi, toutes les 15 minutes de 9 h à ' +
    '17 h 45'],
  ['*/15 9-17 * * 2,4',
    'le mardi et le jeudi, toutes les 15 minutes de 9 h à 17 h 45'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *',
    'le 1er de chaque mois à 0 h, chaque fois toutes les secondes pendant ' +
    'une minute'],
  ['*/6 0 0 1 * *',
    'le 1er de chaque mois à 0 h, chaque fois toutes les 6 secondes ' +
    'pendant une minute'],
  ['5/10 0 0 1 * *',
    'le 1er de chaque mois à 0 h, chaque fois 5, 15, 25, 35, 45 et 55 ' +
    'secondes après le début de la minute'],

  // monthly / minute
  ['* 0 1 * *', 'le 1er de chaque mois, toutes les minutes de 0 h à 0 h 59'],
  ['5,20,45 0 1 * *', 'le 1er de chaque mois à 0 h 05, 0 h 20 et 0 h 45'],
  ['*/15 0 1 * *',
    'le 1er de chaque mois, toutes les 15 minutes de 0 h à 0 h 45'],
  ['0,15,45 0 1 * *', 'le 1er de chaque mois à 0 h, 0 h 15 et 0 h 45'],

  // monthly / hour
  ['0 * 1 * *', 'le 1er de chaque mois, toutes les heures'],
  ['0 9,17 1 * *', 'le 1er de chaque mois à 9 h et à 17 h'],
  ['0 9-17,22 1 * *',
    'le 1er de chaque mois, toutes les heures de 9 h à 17 h et à 22 h'],
  ['0 1/2 1 * *', 'le 1er de chaque mois, toutes les 2 heures de 1 h à 23 h'],

  // monthly / date
  ['0 0 * * *', 'tous les jours à 0 h'],
  ['0 0 1,10,20 * *', 'les 1er, 10 et 20 de chaque mois à 0 h'],
  ['0 0 */2 * *', 'les jours impairs de chaque mois à 0 h'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'les jours impairs de chaque mois, sauf le 15, à 0 h'],

  // monthly / month
  ['0 0 1 1 *', 'le 1er janvier à 0 h'],
  ['0 0 1 3,6,9,12 *', 'le 1er mars, juin, septembre et décembre à 0 h'],
  ['0 0 1 */2 *',
    'le 1er janvier, mars, mai, juillet, septembre et novembre à 0 h'],
  ['0 0 1 11-2 *', 'le 1er du mois, de novembre à février, à 0 h'],

  // monthly / weekday
  ['0 0 1 * 1', 'le 1er de chaque mois, ainsi que tous les lundis, à 0 h'],
  ['0 0 1 * 1-5',
    'le 1er de chaque mois, ainsi que du lundi au vendredi, à 0 h'],
  ['0 0 1 * 2,4',
    'le 1er de chaque mois, ainsi que le mardi et le jeudi, à 0 h'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'toutes les secondes'],
  ['*/6 * * * * *', 'toutes les 6 secondes'],
  ['5/10 * * * * *',
    '5, 15, 25, 35, 45 et 55 secondes après le début de chaque minute'],

  // open / minute
  ['5,20,45 * * * *', 'à 05, 20 et 45 de chaque heure'],
  ['*/15 * * * *', 'toutes les 15 minutes'],
  ['0,15,45 * * * *', 'à 00, 15 et 45 de chaque heure'],

  // open / hour
  ['* 0 * * *', 'tous les jours, toutes les minutes de 0 h à 0 h 59'],
  ['* 9,17 * * *',
    'tous les jours, toutes les minutes de 9 h à 9 h 59 et de 17 h à 17 h ' +
    '59'],
  ['* 9-17,22 * * *',
    'tous les jours, toutes les minutes de 9 h à 17 h 59 et de 22 h à 22 h ' +
    '59'],
  ['* 1/2 * * *', 'toutes les minutes, une heure sur deux à partir de 1 h'],

  // open / date
  ['* * 1 * *', 'le 1er de chaque mois, toutes les minutes'],
  ['* * 1,10,20 * *', 'les 1er, 10 et 20 de chaque mois, toutes les minutes'],
  ['* * */2 * *', 'les jours impairs de chaque mois, toutes les minutes'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'les jours impairs de chaque mois, sauf le 15, toutes les minutes'],

  // open / month
  ['* * * 1 *', 'en janvier, toutes les minutes'],
  ['* * * 3,6,9,12 *',
    'en mars, juin, septembre et décembre, toutes les minutes'],
  ['* * * */2 *',
    'en janvier, mars, mai, juillet, septembre et novembre, toutes les ' +
    'minutes'],
  ['* * * 11-2 *', 'de novembre à février, toutes les minutes'],

  // open / weekday
  ['* * * * 1', 'tous les lundis, toutes les minutes'],
  ['* * * * 1-5', 'du lundi au vendredi, toutes les minutes'],
  ['* * * * 2,4', 'le mardi et le jeudi, toutes les minutes']
];

export {rows};
