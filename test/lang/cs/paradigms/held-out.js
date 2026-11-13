// Czech paradigms held out from a renderer's builder: one row per grid
// pattern at a held-out position. They judge whether a renderer built from
// the answers, the lexicon and the visible rows says what a speaker would.
//
// Written by hand from src/lang/cs/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['30 0 9 * * *', 'denně v 9:00:30'],
  ['0,30 0 9 * * *', 'denně v 9:00:00 a 9:00:30'],
  ['*/15 0 9 * * *', 'denně v 9:00:00, 9:00:15, 9:00:30 a 9:00:45'],
  ['0-9 0 9 * * *', 'denně každou sekundu od 9:00:00 do 9:00:09'],

  // clock / minute
  ['30 9 * * *', 'denně v 9:30'],
  ['0,30 9 * * *', 'denně v 9:00 a 9:30'],
  ['0-29 9 * * *', 'denně každou minutu od 9:00 do 9:29'],
  ['0-29,45 9 * * *', 'denně každou minutu od 9:00 do 9:29 a v 9:45'],
  ['*/7 9 * * *', 'denně každých 7 minut od 9:00 do 9:56'],
  ['5/15 9 * * *', 'denně v 9:05, 9:20, 9:35 a 9:50'],
  ['10-40/10 9 * * *', 'denně v 9:10, 9:20, 9:30 a 9:40'],

  // clock / hour
  ['0 12 * * *', 'denně ve 12:00'],
  ['0 8,12,18 * * *', 'denně v 8:00, 12:00 a 18:00'],
  ['0 9-17 * * *', 'denně každou hodinu od 9:00 do 17:00'],
  ['0 */2 * * *', 'denně každé 2 hodiny od 0:00 do 22:00'],
  ['0 */6 * * *', 'denně v 0:00, 6:00, 12:00 a 18:00'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'denně každé 2 hodiny od 0:00 do 22:00, kromě 8:00'],
  ['0 22-2 * * *', 'každou noc každou hodinu od 22:00 do 2:00'],

  // clock / date
  ['0 9 15 * *', 'vždy 15. dne v měsíci v 9:00'],
  ['0 9 1,15 * *', 'vždy 1. a 15. dne v měsíci v 9:00'],
  ['0 9 1-7 * *', 'od 1. do 7. dne v měsíci vždy v 9:00'],
  ['0 9 1-7,15 * *', 'vždy 1. až 7. a 15. dne v měsíci v 9:00'],
  ['0 9 2/2 * *', 'každý sudý den v měsíci v 9:00'],
  ['0 9 */5 * *', 'vždy 1., 6., 11., 16., 21., 26. a 31. dne v měsíci v 9:00'],
  ['0 9 L * *', 'vždy poslední den v měsíci v 9:00'],
  ['0 9 15W * *',
    'vždy 15. dne v měsíci, a připadne-li na sobotu nebo neděli, místo ' +
    'toho v nejbližší pátek nebo pondělí, v 9:00'],

  // clock / month
  ['0 9 * 6 *', 'v červnu denně v 9:00'],
  ['0 9 * 1,7 *', 'v lednu a červenci denně v 9:00'],
  ['0 9 * 6-8 *', 'od června do srpna denně v 9:00'],
  ['0 9 * 6-8,12 *', 'od června do srpna a v prosinci, a to denně v 9:00'],
  ['0 9 * */3 *', 'v lednu, dubnu, červenci a říjnu denně v 9:00'],
  ['0 9 * 1-11 *', 'od ledna do listopadu denně v 9:00'],

  // clock / weekday
  ['0 9 * * 0', 'každou neděli v 9:00'],
  ['0 9 * * 1,3,5', 'každé pondělí, středu a pátek v 9:00'],
  ['0 9 * * 0,6', 'každou sobotu a neděli v 9:00'],
  ['0 9 * * 1-6', 'od pondělí do soboty vždy v 9:00'],
  ['0 9 * * 5L', 'vždy poslední pátek v měsíci v 9:00'],
  ['0 9 * * 1#2', 'vždy druhé pondělí v měsíci v 9:00'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'od pondělí do pátku každých 15 minut od 9:00:30 do 17:45:30'],
  ['0,30 */15 9-17 * * 1-5',
    'od pondělí do pátku každých 15 minut od 9:00 do 17:45, pokaždé na ' +
    'začátku minuty a 30 sekund po něm'],
  ['*/15 */15 9-17 * * 1-5',
    'od pondělí do pátku každých 15 minut od 9:00 do 17:45, pokaždé na ' +
    'začátku minuty a 15, 30 a 45 sekund po něm'],
  ['0-9 */15 9-17 * * 1-5',
    'od pondělí do pátku každých 15 minut od 9:00 do 17:45, pokaždé v ' +
    'prvních 10 sekundách minuty každou sekundu'],

  // window / minute
  ['0 9-17 * * 1-5', 'od pondělí do pátku každou hodinu od 9:00 do 17:00'],
  ['30 9-17 * * 1-5', 'od pondělí do pátku každou hodinu od 9:30 do 17:30'],
  ['5,20,45 9-17 * * 1-5',
    'od pondělí do pátku vždy 5, 20 a 45 minut po každé celé hodině, od ' +
    '9:05 do 17:45'],
  ['0-29 9-17 * * 1-5',
    'od pondělí do pátku každou minutu v prvních 30 minutách každé hodiny ' +
    '(:00–:29), od 9:00 do 17:29'],
  ['*/7 9-17 * * 1-5',
    'od pondělí do pátku každých 7 minut, v každé hodině znovu od celé ' +
    'hodiny (:00–:56), od 9:00 do 17:56'],
  ['5/15 9-17 * * 1-5',
    'od pondělí do pátku každých 15 minut od 9:05 do 17:50'],
  ['10-40/10 9-17 * * 1-5',
    'od pondělí do pátku vždy 10, 20, 30 a 40 minut po každé celé hodině, ' +
    'od 9:10 do 17:40'],

  // window / hour
  ['*/15 0 * * 1-5', 'od pondělí do pátku vždy v 0:00, 0:15, 0:30 a 0:45'],
  ['*/15 9 * * 1-5', 'od pondělí do pátku vždy v 9:00, 9:15, 9:30 a 9:45'],
  ['*/15 9,17 * * 1-5',
    'od pondělí do pátku každých 15 minut od 9:00 do 9:45 a od 17:00 do ' +
    '17:45'],
  ['*/15 8,12,18 * * 1-5',
    'od pondělí do pátku každých 15 minut od 8:00 do 8:45, od 12:00 do ' +
    '12:45 a od 18:00 do 18:45'],
  ['*/15 */2 * * 1-5',
    'od pondělí do pátku každých 15 minut od 0:00 do 0:45, od 2:00 do 2:45 ' +
    'a tak dále každé 2 hodiny až do 22:45'],
  ['*/15 */6 * * 1-5',
    'od pondělí do pátku každých 15 minut od 0:00 do 0:45, od 6:00 do ' +
    '6:45, od 12:00 do 12:45 a od 18:00 do 18:45'],
  ['*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5',
    'od pondělí do pátku každých 15 minut od 0:00 do 0:45, od 2:00 do 2:45 ' +
    'a tak dále každé 2 hodiny až do 22:45, kromě doby od 8:00 do 8:59'],
  ['*/15 22-2 * * 1-5',
    'od pondělí do pátku každých 15 minut od 0:00 do 2:45 a od 22:00 do ' +
    '23:45'],

  // window / date
  ['*/15 9-17 15 * 1-5',
    'od pondělí do pátku a navíc 15. dne v měsíci, vždy každých 15 minut ' +
    'od 9:00 do 17:45'],
  ['*/15 9-17 1,15 * 1-5',
    'od pondělí do pátku a navíc 1. a 15. dne v měsíci, vždy každých 15 ' +
    'minut od 9:00 do 17:45'],
  ['*/15 9-17 1-7 * 1-5',
    'od pondělí do pátku a navíc od 1. do 7. dne v měsíci, vždy každých 15 ' +
    'minut od 9:00 do 17:45'],
  ['*/15 9-17 1-7,15 * 1-5',
    'od pondělí do pátku a navíc 1. až 7. a 15. dne v měsíci, vždy každých ' +
    '15 minut od 9:00 do 17:45'],
  ['*/15 9-17 2/2 * 1-5',
    'od pondělí do pátku a navíc každý sudý den v měsíci, vždy každých 15 ' +
    'minut od 9:00 do 17:45'],
  ['*/15 9-17 */5 * 1-5',
    '1., 6., 11., 16., 21., 26. a 31. dne v měsíci jen tehdy, připadne-li ' +
    'na pondělí až pátek, každých 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 L * 1-5',
    'od pondělí do pátku a navíc poslední den v měsíci, vždy každých 15 ' +
    'minut od 9:00 do 17:45'],
  ['*/15 9-17 15W * 1-5',
    'od pondělí do pátku každých 15 minut od 9:00 do 17:45'],

  // window / month
  ['*/15 9-17 * 6 1-5',
    'v červnu od pondělí do pátku každých 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * 1,7 1-5',
    'v lednu a červenci od pondělí do pátku každých 15 minut od 9:00 do ' +
    '17:45'],
  ['*/15 9-17 * 6-8 1-5',
    'od června do srpna od pondělí do pátku každých 15 minut od 9:00 do ' +
    '17:45'],
  ['*/15 9-17 * 6-8,12 1-5',
    'od června do srpna a v prosinci, a to od pondělí do pátku každých 15 ' +
    'minut od 9:00 do 17:45'],
  ['*/15 9-17 * */3 1-5',
    'v lednu, dubnu, červenci a říjnu od pondělí do pátku každých 15 minut ' +
    'od 9:00 do 17:45'],
  ['*/15 9-17 * 1-11 1-5',
    'od ledna do listopadu od pondělí do pátku každých 15 minut od 9:00 do ' +
    '17:45'],

  // window / weekday
  ['*/15 9-17 * * 1', 'každé pondělí každých 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 0', 'každou neděli každých 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 0,6',
    'každou sobotu a neděli každých 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 1-6',
    'od pondělí do soboty každých 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 5L',
    'vždy poslední pátek v měsíci každých 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 1#2',
    'vždy druhé pondělí v měsíci každých 15 minut od 9:00 do 17:45'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', 'vždy 1. dne v měsíci v 0:00:30'],
  ['0,30 0 0 1 * *', 'vždy 1. dne v měsíci v 0:00:00 a 0:00:30'],
  ['*/15 0 0 1 * *',
    'vždy 1. dne v měsíci v 0:00:00, 0:00:15, 0:00:30 a 0:00:45'],
  ['0-9 0 0 1 * *',
    'vždy 1. dne v měsíci každou sekundu od 0:00:00 do 0:00:09'],

  // monthly / minute
  ['30 0 1 * *', 'vždy 1. dne v měsíci v 0:30'],
  ['0,30 0 1 * *', 'vždy 1. dne v měsíci v 0:00 a 0:30'],
  ['0-29 0 1 * *', 'vždy 1. dne v měsíci každou minutu od 0:00 do 0:29'],
  ['0-29,45 0 1 * *',
    'vždy 1. dne v měsíci každou minutu od 0:00 do 0:29 a v 0:45'],
  ['*/7 0 1 * *', 'vždy 1. dne v měsíci každých 7 minut od 0:00 do 0:56'],
  ['5/15 0 1 * *', 'vždy 1. dne v měsíci v 0:05, 0:20, 0:35 a 0:50'],
  ['10-40/10 0 1 * *', 'vždy 1. dne v měsíci v 0:10, 0:20, 0:30 a 0:40'],

  // monthly / hour
  ['0 12 1 * *', 'vždy 1. dne v měsíci ve 12:00'],
  ['0 8,12,18 1 * *', 'vždy 1. dne v měsíci v 8:00, 12:00 a 18:00'],
  ['0 9-17 1 * *', 'vždy 1. dne v měsíci každou hodinu od 9:00 do 17:00'],
  ['0 */2 1 * *', 'vždy 1. dne v měsíci každé 2 hodiny od 0:00 do 22:00'],
  ['0 */6 1 * *', 'vždy 1. dne v měsíci v 0:00, 6:00, 12:00 a 18:00'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * *',
    'vždy 1. dne v měsíci každé 2 hodiny od 0:00 do 22:00, kromě 8:00'],
  ['0 22-2 1 * *',
    'vždy 1. dne v měsíci každou hodinu od 0:00 do 2:00, ve 22:00 a ve ' +
    '23:00'],

  // monthly / date
  ['0 0 15 * *', 'vždy 15. dne v měsíci v 0:00'],
  ['0 0 1,15 * *', 'vždy 1. a 15. dne v měsíci v 0:00'],
  ['0 0 1-7 * *', 'od 1. do 7. dne v měsíci vždy v 0:00'],
  ['0 0 1-7,15 * *', 'vždy 1. až 7. a 15. dne v měsíci v 0:00'],
  ['0 0 2/2 * *', 'každý sudý den v měsíci v 0:00'],
  ['0 0 */5 * *', 'vždy 1., 6., 11., 16., 21., 26. a 31. dne v měsíci v 0:00'],
  ['0 0 L * *', 'vždy poslední den v měsíci v 0:00'],
  ['0 0 15W * *',
    'vždy 15. dne v měsíci, a připadne-li na sobotu nebo neděli, místo ' +
    'toho v nejbližší pátek nebo pondělí, v 0:00'],

  // monthly / month
  ['0 0 1 6 *', 'vždy 1. června v 0:00'],
  ['0 0 1 1,7 *', 'v lednu a červenci vždy 1. dne v měsíci v 0:00'],
  ['0 0 1 6-8 *', 'od června do srpna vždy 1. dne v měsíci v 0:00'],
  ['0 0 1 6-8,12 *',
    'od června do srpna a v prosinci, a to vždy 1. dne v měsíci v 0:00'],
  ['0 0 1 */3 *',
    'v lednu, dubnu, červenci a říjnu vždy 1. dne v měsíci v 0:00'],
  ['0 0 1 1-11 *', 'od ledna do listopadu vždy 1. dne v měsíci v 0:00'],

  // monthly / weekday
  ['0 0 1 * 0', 'každou neděli a navíc 1. dne v měsíci, vždy v 0:00'],
  ['0 0 1 * 1,3,5',
    'každé pondělí, středu a pátek a navíc 1. dne v měsíci, vždy v 0:00'],
  ['0 0 1 * 0,6',
    'každou sobotu a neděli a navíc 1. dne v měsíci, vždy v 0:00'],
  ['0 0 1 * 1-6', 'od pondělí do soboty a navíc 1. dne v měsíci, vždy v 0:00'],
  ['0 0 1 * 5L',
    'poslední pátek v měsíci a navíc 1. dne v měsíci, vždy v 0:00'],
  ['0 0 1 * 1#2',
    'druhé pondělí v měsíci a navíc 1. dne v měsíci, vždy v 0:00'],

  // open / second — context `* * * * *`
  ['30 * * * * *', 'vždy 30 sekund po začátku každé minuty'],
  ['0,30 * * * * *', 'každých 30 sekund'],
  ['*/15 * * * * *', 'každých 15 sekund'],
  ['0-9 * * * * *', 'každou sekundu v prvních 10 sekundách každé minuty'],

  // open / minute
  ['30 * * * *', 'každou hodinu v půl'],
  ['0,30 * * * *', 'každých 30 minut'],
  ['0-29 * * * *',
    'každou minutu v prvních 30 minutách každé hodiny (:00–:29)'],
  ['0-29,45 * * * *',
    'každou minutu v prvních 30 minutách každé hodiny (:00–:29) a pak ' +
    'ještě 45 minut po celé hodině (:45)'],
  ['*/7 * * * *',
    'každých 7 minut, v každé hodině znovu od celé hodiny (:00–:56)'],
  ['5/15 * * * *', 'vždy 5, 20, 35 a 50 minut po každé celé hodině'],
  ['10-40/10 * * * *', 'vždy 10, 20, 30 a 40 minut po každé celé hodině'],

  // open / hour
  ['* 12 * * *', 'denně každou minutu od 12:00 do 12:59'],
  ['* 8,12,18 * * *',
    'denně každou minutu od 8:00 do 8:59, od 12:00 do 12:59 a od 18:00 do ' +
    '18:59'],
  ['* 9-17 * * *', 'denně každou minutu od 9:00 do 17:59'],
  ['* */2 * * *',
    'denně každou minutu od 0:00 do 0:59, od 2:00 do 2:59 a tak dále každé ' +
    '2 hodiny až do 22:59'],
  ['* */6 * * *',
    'denně každou minutu od 0:00 do 0:59, od 6:00 do 6:59, od 12:00 do ' +
    '12:59 a od 18:00 do 18:59'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'denně každou minutu od 0:00 do 0:59, od 2:00 do 2:59 a tak dále každé ' +
    '2 hodiny až do 22:59, kromě doby od 8:00 do 8:59'],
  ['* 22-2 * * *', 'každou noc každou minutu od 22:00 do 2:59'],

  // open / date
  ['* * 15 * *', 'vždy 15. dne v měsíci každou minutu'],
  ['* * 1,15 * *', 'vždy 1. a 15. dne v měsíci každou minutu'],
  ['* * 1-7 * *', 'od 1. do 7. dne v měsíci každou minutu'],
  ['* * 1-7,15 * *', 'vždy 1. až 7. a 15. dne v měsíci každou minutu'],
  ['* * 2/2 * *', 'každý sudý den v měsíci každou minutu'],
  ['* * */5 * *',
    'vždy 1., 6., 11., 16., 21., 26. a 31. dne v měsíci každou minutu'],
  ['* * L * *', 'vždy poslední den v měsíci každou minutu'],
  ['* * 15W * *',
    'vždy 15. dne v měsíci, a připadne-li na sobotu nebo neděli, místo ' +
    'toho v nejbližší pátek nebo pondělí, každou minutu'],

  // open / month
  ['* * * 6 *', 'v červnu každou minutu'],
  ['* * * 1,7 *', 'v lednu a červenci každou minutu'],
  ['* * * 6-8 *', 'od června do srpna každou minutu'],
  ['* * * 6-8,12 *', 'od června do srpna a v prosinci, a to každou minutu'],
  ['* * * */3 *', 'v lednu, dubnu, červenci a říjnu každou minutu'],
  ['* * * 1-11 *', 'od ledna do listopadu každou minutu'],

  // open / weekday
  ['* * * * 0', 'každou neděli každou minutu'],
  ['* * * * 1,3,5', 'každé pondělí, středu a pátek každou minutu'],
  ['* * * * 0,6', 'každou sobotu a neděli každou minutu'],
  ['* * * * 1-6', 'od pondělí do soboty každou minutu'],
  ['* * * * 5L', 'vždy poslední pátek v měsíci každou minutu'],
  ['* * * * 1#2', 'vždy druhé pondělí v měsíci každou minutu']
];

export {rows};
