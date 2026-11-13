// Czech paradigms a renderer's builder may see: one row per grid
// pattern at a visible position.
//
// Written by hand from src/lang/cs/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *', 'denně každou sekundu od 9:00:00 do 9:00:59'],
  ['*/6 0 9 * * *', 'denně každých 6 sekund od 9:00:00 do 9:00:54'],
  ['5/10 0 9 * * *', 'denně každých 10 sekund od 9:00:05 do 9:00:55'],

  // clock / minute
  ['* 9 * * *', 'denně každou minutu od 9:00 do 9:59'],
  ['5,20,45 9 * * *', 'denně v 9:05, 9:20 a 9:45'],
  ['*/15 9 * * *', 'denně v 9:00, 9:15, 9:30 a 9:45'],
  ['0,15,45 9 * * *', 'denně v 9:00, 9:15 a 9:45'],

  // clock / hour
  ['0 * * * *', 'každou celou hodinu'],
  ['0 0 * * *', 'denně v 0:00'],
  ['0 9,17 * * *', 'denně v 9:00 a 17:00'],
  ['0 9-17,22 * * *', 'denně každou hodinu od 9:00 do 17:00 a ve 22:00'],
  ['0 1/2 * * *', 'denně každé 2 hodiny od 1:00 do 23:00'],

  // clock / date
  ['0 9 1 * *', 'vždy 1. dne v měsíci v 9:00'],
  ['0 9 1,10,20 * *', 'vždy 1., 10. a 20. dne v měsíci v 9:00'],
  ['0 9 */2 * *', 'každý lichý den v měsíci v 9:00'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'každý lichý den v měsíci kromě 15. dne vždy v 9:00'],

  // clock / month
  ['0 9 * 1 *', 'v lednu denně v 9:00'],
  ['0 9 * 3,6,9,12 *', 'v březnu, červnu, září a prosinci denně v 9:00'],
  ['0 9 * */2 *',
    'v lednu, březnu, květnu, červenci, září a listopadu denně v 9:00'],
  ['0 9 * 11-2 *', 'od listopadu do února denně v 9:00'],

  // clock / weekday
  ['0 9 * * 1', 'každé pondělí v 9:00'],
  ['0 9 * * 1-5', 'od pondělí do pátku vždy v 9:00'],
  ['0 9 * * 2,4', 'každé úterý a každý čtvrtek v 9:00'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'od pondělí do pátku každých 15 minut od 9:00 do 17:45, pokaždé po ' +
    'dobu jedné minuty každou sekundu'],
  ['*/6 */15 9-17 * * 1-5',
    'od pondělí do pátku každých 15 minut od 9:00 do 17:45, pokaždé po ' +
    'dobu jedné minuty každých 6 sekund'],
  ['5/10 */15 9-17 * * 1-5',
    'od pondělí do pátku každých 15 minut od 9:00 do 17:45, pokaždé 5, 15, ' +
    '25, 35, 45 a 55 sekund po začátku minuty'],

  // window / minute
  ['* 9-17 * * 1-5', 'od pondělí do pátku každou minutu od 9:00 do 17:59'],
  ['0,30 9-17 * * 1-5',
    'od pondělí do pátku každých 30 minut od 9:00 do 17:30'],
  ['0-29,45 9-17 * * 1-5',
    'od pondělí do pátku každou minutu v prvních 30 minutách každé hodiny ' +
    '(:00–:29) a pak ještě 45 minut po celé hodině (:45), od 9:00 do 17:45'],
  ['0,15,45 9-17 * * 1-5',
    'od pondělí do pátku v každou celou hodinu a 15 a 45 minut po ní, od ' +
    '9:00 do 17:45'],

  // window / hour
  ['*/15 * * * 1-5', 'od pondělí do pátku každých 15 minut'],
  ['*/15 12 * * 1-5',
    'od pondělí do pátku vždy ve 12:00, 12:15, 12:30 a 12:45'],
  ['*/15 9-17,22 * * 1-5',
    'od pondělí do pátku každých 15 minut od 9:00 do 17:45 a od 22:00 do ' +
    '22:45'],
  ['*/15 1/2 * * 1-5',
    'od pondělí do pátku každých 15 minut od 1:00 do 1:45, od 3:00 do 3:45 ' +
    'a tak dále každé 2 hodiny až do 23:45'],

  // window / date
  ['*/15 9-17 1 * 1-5',
    'od pondělí do pátku a navíc 1. dne v měsíci, vždy každých 15 minut od ' +
    '9:00 do 17:45'],
  ['*/15 9-17 1,10,20 * 1-5',
    'od pondělí do pátku a navíc 1., 10. a 20. dne v měsíci, vždy každých ' +
    '15 minut od 9:00 do 17:45'],
  ['*/15 9-17 */2 * 1-5',
    'každý lichý den v měsíci jen tehdy, připadne-li na pondělí až pátek, ' +
    'každých 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'každý lichý den v měsíci kromě 15. dne a navíc od pondělí do pátku (i ' +
    '15.), vždy každých 15 minut od 9:00 do 17:45'],

  // window / month
  ['*/15 9-17 * 1 1-5',
    'v lednu od pondělí do pátku každých 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'v březnu, červnu, září a prosinci od pondělí do pátku každých 15 ' +
    'minut od 9:00 do 17:45'],
  ['*/15 9-17 * */2 1-5',
    'v lednu, březnu, květnu, červenci, září a listopadu od pondělí do ' +
    'pátku každých 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * 11-2 1-5',
    'od listopadu do února od pondělí do pátku každých 15 minut od 9:00 do ' +
    '17:45'],

  // window / weekday
  ['*/15 9-17 * * *', 'denně každých 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 1,3,5',
    'každé pondělí, středu a pátek každých 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 2,4',
    'každé úterý a každý čtvrtek každých 15 minut od 9:00 do 17:45'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *', 'vždy 1. dne v měsíci každou sekundu od 0:00:00 do 0:00:59'],
  ['*/6 0 0 1 * *',
    'vždy 1. dne v měsíci každých 6 sekund od 0:00:00 do 0:00:54'],
  ['5/10 0 0 1 * *',
    'vždy 1. dne v měsíci každých 10 sekund od 0:00:05 do 0:00:55'],

  // monthly / minute
  ['* 0 1 * *', 'vždy 1. dne v měsíci každou minutu od 0:00 do 0:59'],
  ['5,20,45 0 1 * *', 'vždy 1. dne v měsíci v 0:05, 0:20 a 0:45'],
  ['*/15 0 1 * *', 'vždy 1. dne v měsíci v 0:00, 0:15, 0:30 a 0:45'],
  ['0,15,45 0 1 * *', 'vždy 1. dne v měsíci v 0:00, 0:15 a 0:45'],

  // monthly / hour
  ['0 * 1 * *', 'vždy 1. dne v měsíci každou celou hodinu'],
  ['0 9,17 1 * *', 'vždy 1. dne v měsíci v 9:00 a 17:00'],
  ['0 9-17,22 1 * *',
    'vždy 1. dne v měsíci každou hodinu od 9:00 do 17:00 a ve 22:00'],
  ['0 1/2 1 * *', 'vždy 1. dne v měsíci každé 2 hodiny od 1:00 do 23:00'],

  // monthly / date
  ['0 0 1,10,20 * *', 'vždy 1., 10. a 20. dne v měsíci v 0:00'],
  ['0 0 */2 * *', 'každý lichý den v měsíci v 0:00'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'každý lichý den v měsíci kromě 15. dne vždy v 0:00'],

  // monthly / month
  ['0 0 1 1 *', 'vždy 1. ledna v 0:00'],
  ['0 0 1 3,6,9,12 *',
    'v březnu, červnu, září a prosinci vždy 1. dne v měsíci v 0:00'],
  ['0 0 1 */2 *',
    'v lednu, březnu, květnu, červenci, září a listopadu vždy 1. dne v ' +
    'měsíci v 0:00'],
  ['0 0 1 11-2 *', 'od listopadu do února vždy 1. dne v měsíci v 0:00'],

  // monthly / weekday
  ['0 0 1 * 1', 'každé pondělí a navíc 1. dne v měsíci, vždy v 0:00'],
  ['0 0 1 * 1-5', 'od pondělí do pátku a navíc 1. dne v měsíci, vždy v 0:00'],
  ['0 0 1 * 2,4',
    'každé úterý a každý čtvrtek a navíc 1. dne v měsíci, vždy v 0:00'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'každou sekundu'],
  ['*/6 * * * * *', 'každých 6 sekund'],
  ['5/10 * * * * *',
    'vždy 5, 15, 25, 35, 45 a 55 sekund po začátku každé minuty'],

  // open / minute
  ['5,20,45 * * * *', 'vždy 5, 20 a 45 minut po každé celé hodině'],
  ['*/15 * * * *', 'každých 15 minut'],
  ['0,15,45 * * * *', 'v každou celou hodinu a 15 a 45 minut po ní'],

  // open / hour
  ['* 0 * * *', 'denně každou minutu od 0:00 do 0:59'],
  ['* 9,17 * * *', 'denně každou minutu od 9:00 do 9:59 a od 17:00 do 17:59'],
  ['* 9-17,22 * * *',
    'denně každou minutu od 9:00 do 17:59 a od 22:00 do 22:59'],
  ['* 1/2 * * *',
    'denně každou minutu od 1:00 do 1:59, od 3:00 do 3:59 a tak dále každé ' +
    '2 hodiny až do 23:59'],

  // open / date
  ['* * 1 * *', 'vždy 1. dne v měsíci každou minutu'],
  ['* * 1,10,20 * *', 'vždy 1., 10. a 20. dne v měsíci každou minutu'],
  ['* * */2 * *', 'každý lichý den v měsíci každou minutu'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'každý lichý den v měsíci kromě 15. dne každou minutu'],

  // open / month
  ['* * * 1 *', 'v lednu každou minutu'],
  ['* * * 3,6,9,12 *', 'v březnu, červnu, září a prosinci každou minutu'],
  ['* * * */2 *',
    'v lednu, březnu, květnu, červenci, září a listopadu každou minutu'],
  ['* * * 11-2 *', 'od listopadu do února každou minutu'],

  // open / weekday
  ['* * * * 1', 'každé pondělí každou minutu'],
  ['* * * * 1-5', 'od pondělí do pátku každou minutu'],
  ['* * * * 2,4', 'každé úterý a každý čtvrtek každou minutu']
];

export {rows};
