// Polish paradigms a renderer's builder may see: one row per grid
// pattern at a visible position.
//
// Written by hand from src/lang/pl/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['* 0 9 * * *', 'codziennie co sekundę od 9:00:00 do 9:00:59'],
  ['*/6 0 9 * * *', 'codziennie co 6 sekund od 9:00:00 do 9:00:54'],
  ['5/10 0 9 * * *', 'codziennie co 10 sekund od 9:00:05 do 9:00:55'],

  // clock / minute — context `0 9 * * *`
  ['* 9 * * *', 'codziennie co minutę od 9:00 do 9:59'],
  ['5,20,45 9 * * *', 'codziennie o 9:05, 9:20 i 9:45'],
  ['*/15 9 * * *', 'codziennie o 9:00, 9:15, 9:30 i 9:45'],
  ['0,15,45 9 * * *', 'codziennie o 9:00, 9:15 i 9:45'],

  // clock / hour — context `0 9 * * *`
  ['0 * * * *', 'co godzinę'],
  ['0 0 * * *', 'codziennie o 0:00'],
  ['0 9,17 * * *', 'codziennie o 9:00 i 17:00'],
  ['0 9-17,22 * * *', 'codziennie co godzinę od 9:00 do 17:00 oraz o 22:00'],
  ['0 1/2 * * *', 'codziennie co 2 godziny od 1:00 do 23:00'],

  // clock / date — context `0 9 * * *`
  ['0 9 1 * *', 'pierwszego dnia każdego miesiąca o 9:00'],
  ['0 9 1,10,20 * *',
    'pierwszego, dziesiątego i dwudziestego dnia każdego miesiąca o 9:00'],
  ['0 9 */2 * *', 'w nieparzyste dni każdego miesiąca o 9:00'],
  ['0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'w nieparzyste dni każdego miesiąca oprócz piętnastego, o 9:00'],

  // clock / month — context `0 9 * * *`
  ['0 9 * 1 *', 'w styczniu codziennie o 9:00'],
  ['0 9 * 3,6,9,12 *',
    'w marcu, czerwcu, wrześniu i grudniu codziennie o 9:00'],
  ['0 9 * */2 *',
    'w styczniu, marcu, maju, lipcu, wrześniu i listopadzie codziennie o ' +
    '9:00'],
  ['0 9 * 11-2 *', 'od listopada do lutego codziennie o 9:00'],

  // clock / weekday — context `0 9 * * *`
  ['0 9 * * 1', 'w poniedziałki o 9:00'],
  ['0 9 * * 1-5', 'od poniedziałku do piątku o 9:00'],
  ['0 9 * * 2,4', 'we wtorki i czwartki o 9:00'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['* */15 9-17 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 9:00 do 17:45, za każdym ' +
    'razem co sekundę przez całą minutę'],
  ['*/6 */15 9-17 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 9:00 do 17:45, za każdym ' +
    'razem co 6 sekund przez całą minutę'],
  ['5/10 */15 9-17 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 9:00 do 17:45, za każdym ' +
    'razem co 10 sekund, zaczynając 5 sekund po pełnej minucie'],

  // window / minute — context `*/15 9-17 * * 1-5`
  ['* 9-17 * * 1-5', 'od poniedziałku do piątku co minutę od 9:00 do 17:59'],
  ['0,30 9-17 * * 1-5',
    'od poniedziałku do piątku co 30 minut od 9:00 do 17:30'],
  ['0-29,45 9-17 * * 1-5',
    'od poniedziałku do piątku co godzinę od 9:00 do 17:00, za każdym ' +
    'razem co minutę do 29 minut po pełnej godzinie oraz 45 minut po niej'],
  ['0,15,45 9-17 * * 1-5',
    'od poniedziałku do piątku o każdej pełnej godzinie oraz 15 i 45 minut ' +
    'później, od 9:00 do 17:45'],

  // window / hour — context `*/15 9-17 * * 1-5`
  ['*/15 * * * 1-5', 'od poniedziałku do piątku co 15 minut'],
  ['*/15 12 * * 1-5',
    'od poniedziałku do piątku o 12:00, 12:15, 12:30 i 12:45'],
  ['*/15 9-17,22 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 9:00 do 17:45 oraz od 22:00 ' +
    'do 22:45'],
  ['*/15 1/2 * * 1-5',
    'od poniedziałku do piątku co 15 minut w godzinach nieparzystych'],

  // window / date — context `*/15 9-17 * * 1-5`
  ['*/15 9-17 1 * 1-5',
    'od poniedziałku do piątku, a także pierwszego dnia każdego miesiąca, ' +
    'co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 1,10,20 * 1-5',
    'od poniedziałku do piątku, a także pierwszego, dziesiątego i ' +
    'dwudziestego dnia każdego miesiąca, co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 */2 * 1-5',
    'od poniedziałku do piątku, ale tylko w nieparzyste dni miesiąca, co ' +
    '15 minut od 9:00 do 17:45'],
  ['*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5',
    'od poniedziałku do piątku, a w soboty i niedziele tylko w nieparzyste ' +
    'dni miesiąca oprócz piętnastego, co 15 minut od 9:00 do 17:45'],

  // window / month — context `*/15 9-17 * * 1-5`
  ['*/15 9-17 * 1 1-5',
    'w styczniu od poniedziałku do piątku co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * 3,6,9,12 1-5',
    'w marcu, czerwcu, wrześniu i grudniu od poniedziałku do piątku co 15 ' +
    'minut od 9:00 do 17:45'],
  ['*/15 9-17 * */2 1-5',
    'w styczniu, marcu, maju, lipcu, wrześniu i listopadzie od ' +
    'poniedziałku do piątku co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * 11-2 1-5',
    'od listopada do lutego, od poniedziałku do piątku co 15 minut od 9:00 ' +
    'do 17:45'],

  // window / weekday — context `*/15 9-17 * * 1-5`
  ['*/15 9-17 * * *', 'codziennie co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 1,3,5',
    'w poniedziałki, środy i piątki co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 2,4', 'we wtorki i czwartki co 15 minut od 9:00 do 17:45'],

  // monthly / second — context `0 0 1 * *`
  ['* 0 0 1 * *',
    'pierwszego dnia każdego miesiąca co sekundę od 0:00:00 do 0:00:59'],
  ['*/6 0 0 1 * *',
    'pierwszego dnia każdego miesiąca co 6 sekund od 0:00:00 do 0:00:54'],
  ['5/10 0 0 1 * *',
    'pierwszego dnia każdego miesiąca co 10 sekund od 0:00:05 do 0:00:55'],

  // monthly / minute — context `0 0 1 * *`
  ['* 0 1 * *', 'pierwszego dnia każdego miesiąca co minutę od 0:00 do 0:59'],
  ['5,20,45 0 1 * *', 'pierwszego dnia każdego miesiąca o 0:05, 0:20 i 0:45'],
  ['*/15 0 1 * *',
    'pierwszego dnia każdego miesiąca o 0:00, 0:15, 0:30 i 0:45'],
  ['0,15,45 0 1 * *', 'pierwszego dnia każdego miesiąca o 0:00, 0:15 i 0:45'],

  // monthly / hour — context `0 0 1 * *`
  ['0 * 1 * *', 'pierwszego dnia każdego miesiąca co godzinę'],
  ['0 9,17 1 * *', 'pierwszego dnia każdego miesiąca o 9:00 i 17:00'],
  ['0 9-17,22 1 * *',
    'pierwszego dnia każdego miesiąca co godzinę od 9:00 do 17:00 oraz o ' +
    '22:00'],
  ['0 1/2 1 * *',
    'pierwszego dnia każdego miesiąca co 2 godziny od 1:00 do 23:00'],

  // monthly / date — context `0 0 1 * *`
  ['0 0 1,10,20 * *',
    'pierwszego, dziesiątego i dwudziestego dnia każdego miesiąca o 0:00'],
  ['0 0 */2 * *', 'w nieparzyste dni każdego miesiąca o 0:00'],
  ['0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'w nieparzyste dni każdego miesiąca oprócz piętnastego, o 0:00'],

  // monthly / month — context `0 0 1 * *`
  ['0 0 1 1 *', 'co roku 1 stycznia o 0:00'],
  ['0 0 1 3,6,9,12 *',
    'w marcu, czerwcu, wrześniu i grudniu pierwszego dnia miesiąca o 0:00'],
  ['0 0 1 */2 *',
    'w styczniu, marcu, maju, lipcu, wrześniu i listopadzie pierwszego ' +
    'dnia miesiąca o 0:00'],
  ['0 0 1 11-2 *', 'od listopada do lutego pierwszego dnia miesiąca o 0:00'],

  // monthly / weekday — context `0 0 1 * *`
  ['0 0 1 * 1',
    'w poniedziałki, a także pierwszego dnia każdego miesiąca, o 0:00'],
  ['0 0 1 * 1-5',
    'od poniedziałku do piątku, a także pierwszego dnia każdego miesiąca, ' +
    'o 0:00'],
  ['0 0 1 * 2,4',
    'we wtorki i czwartki, a także pierwszego dnia każdego miesiąca, o 0:00'],

  // open / second — context `* * * * *`
  ['* * * * * *', 'co sekundę'],
  ['*/6 * * * * *', 'co 6 sekund'],
  ['5/10 * * * * *',
    'co 10 sekund, zaczynając 5 sekund po każdej pełnej minucie'],

  // open / minute — context `* * * * *`
  ['5,20,45 * * * *', '5, 20 i 45 minut po każdej pełnej godzinie'],
  ['*/15 * * * *', 'co 15 minut'],
  ['0,15,45 * * * *', 'o każdej pełnej godzinie oraz 15 i 45 minut później'],

  // open / hour — context `* * * * *`
  ['* 0 * * *', 'codziennie co minutę od 0:00 do 0:59'],
  ['* 9,17 * * *',
    'codziennie co minutę od 9:00 do 9:59 oraz od 17:00 do 17:59'],
  ['* 9-17,22 * * *',
    'codziennie co minutę od 9:00 do 17:59 oraz od 22:00 do 22:59'],
  ['* 1/2 * * *', 'codziennie co minutę w godzinach nieparzystych'],

  // open / date — context `* * * * *`
  ['* * 1 * *', 'pierwszego dnia każdego miesiąca co minutę'],
  ['* * 1,10,20 * *',
    'pierwszego, dziesiątego i dwudziestego dnia każdego miesiąca co minutę'],
  ['* * */2 * *', 'w nieparzyste dni każdego miesiąca co minutę'],
  ['* * 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *',
    'w nieparzyste dni każdego miesiąca oprócz piętnastego, co minutę'],

  // open / month — context `* * * * *`
  ['* * * 1 *', 'w styczniu co minutę'],
  ['* * * 3,6,9,12 *', 'w marcu, czerwcu, wrześniu i grudniu co minutę'],
  ['* * * */2 *',
    'w styczniu, marcu, maju, lipcu, wrześniu i listopadzie co minutę'],
  ['* * * 11-2 *', 'od listopada do lutego co minutę'],

  // open / weekday — context `* * * * *`
  ['* * * * 1', 'w poniedziałki co minutę'],
  ['* * * * 1-5', 'od poniedziałku do piątku co minutę'],
  ['* * * * 2,4', 'we wtorki i czwartki co minutę']
];

export {rows};
