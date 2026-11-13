// Polish paradigms held out from a renderer's builder: one row per grid
// pattern at a held-out position. They judge whether a renderer built from
// the answers, the lexicon and the visible rows says what a speaker would.
//
// Written by hand from src/lang/pl/answers.md. Never produced by running a
// renderer.

const rows = [
  // clock / second — context `0 9 * * *`
  ['30 0 9 * * *', 'codziennie o 9:00:30'],
  ['0,30 0 9 * * *', 'codziennie o 9:00:00 i 9:00:30'],
  ['*/15 0 9 * * *', 'codziennie o 9:00:00, 9:00:15, 9:00:30 i 9:00:45'],
  ['0-9 0 9 * * *', 'codziennie co sekundę od 9:00:00 do 9:00:09'],

  // clock / minute — context `0 9 * * *`
  ['30 9 * * *', 'codziennie o 9:30'],
  ['0,30 9 * * *', 'codziennie o 9:00 i 9:30'],
  ['0-29 9 * * *', 'codziennie co minutę od 9:00 do 9:29'],
  ['0-29,45 9 * * *', 'codziennie co minutę od 9:00 do 9:29 oraz o 9:45'],
  ['*/7 9 * * *', 'codziennie co 7 minut od 9:00 do 9:56'],
  ['5/15 9 * * *', 'codziennie o 9:05, 9:20, 9:35 i 9:50'],
  ['10-40/10 9 * * *', 'codziennie o 9:10, 9:20, 9:30 i 9:40'],

  // clock / hour — context `0 9 * * *`
  ['0 12 * * *', 'codziennie o 12:00'],
  ['0 8,12,18 * * *', 'codziennie o 8:00, 12:00 i 18:00'],
  ['0 9-17 * * *', 'codziennie co godzinę od 9:00 do 17:00'],
  ['0 */2 * * *', 'codziennie co 2 godziny od 0:00 do 22:00'],
  ['0 */6 * * *', 'codziennie o 0:00, 6:00, 12:00 i 18:00'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'codziennie co 2 godziny od 0:00 do 22:00 oprócz 8:00'],
  ['0 22-2 * * *', 'codziennie co godzinę od 22:00 do 2:00'],

  // clock / date — context `0 9 * * *`
  ['0 9 15 * *', '15. dnia każdego miesiąca o 9:00'],
  ['0 9 1,15 * *', '1. i 15. dnia każdego miesiąca o 9:00'],
  ['0 9 1-7 * *', 'od 1. do 7. dnia każdego miesiąca codziennie o 9:00'],
  ['0 9 1-7,15 * *', 'od 1. do 7. oraz 15. dnia każdego miesiąca o 9:00'],
  ['0 9 2/2 * *', 'w dni parzyste każdego miesiąca o 9:00'],
  ['0 9 */5 * *', 'co 5 dni od 1. do 31. dnia każdego miesiąca o 9:00'],
  ['0 9 L * *', 'ostatniego dnia każdego miesiąca o 9:00'],
  ['0 9 15W * *',
    'w dzień od poniedziałku do piątku najbliższy 15. dnia każdego ' +
    'miesiąca o 9:00'],

  // clock / month — context `0 9 * * *`
  ['0 9 * 6 *', 'w czerwcu codziennie o 9:00'],
  ['0 9 * 1,7 *', 'w styczniu i lipcu codziennie o 9:00'],
  ['0 9 * 6-8 *', 'od czerwca do sierpnia codziennie o 9:00'],
  ['0 9 * 6-8,12 *', 'od czerwca do sierpnia oraz w grudniu codziennie o 9:00'],
  ['0 9 * */3 *',
    'w styczniu, kwietniu, lipcu i październiku codziennie o 9:00'],
  ['0 9 * 1-11 *', 'od stycznia do listopada codziennie o 9:00'],

  // clock / weekday — context `0 9 * * *`
  ['0 9 * * 0', 'w niedziele o 9:00'],
  ['0 9 * * 1,3,5', 'w poniedziałki, środy i piątki o 9:00'],
  ['0 9 * * 0,6', 'w soboty i niedziele o 9:00'],
  ['0 9 * * 1-6', 'codziennie oprócz niedziel o 9:00'],
  ['0 9 * * 5L', 'w ostatni piątek każdego miesiąca o 9:00'],
  ['0 9 * * 1#2', 'w drugi poniedziałek każdego miesiąca o 9:00'],

  // window / second — context `*/15 9-17 * * 1-5`
  ['30 */15 9-17 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 9:00:30 do 17:45:30'],
  ['0,30 */15 9-17 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 9:00 do 17:45, za każdym ' +
    'razem co 30 sekund przez całą minutę'],
  ['*/15 */15 9-17 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 9:00 do 17:45, za każdym ' +
    'razem co 15 sekund przez całą minutę'],
  ['0-9 */15 9-17 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 9:00 do 17:45, za każdym ' +
    'razem co sekundę od 0 do 9 sekund po pełnej minucie'],

  // window / minute — context `*/15 9-17 * * 1-5`
  ['0 9-17 * * 1-5', 'od poniedziałku do piątku co godzinę od 9:00 do 17:00'],
  ['30 9-17 * * 1-5', 'od poniedziałku do piątku co godzinę od 9:30 do 17:30'],
  ['5,20,45 9-17 * * 1-5',
    'od poniedziałku do piątku 5, 20 i 45 minut po każdej pełnej godzinie, ' +
    'od 9:05 do 17:45'],
  ['0-29 9-17 * * 1-5',
    'od poniedziałku do piątku co minutę od 0 do 29 minut po każdej pełnej ' +
    'godzinie, od 9:00 do 17:29'],
  ['*/7 9-17 * * 1-5',
    'od poniedziałku do piątku co 7 minut od 0 do 56 minut po każdej ' +
    'pełnej godzinie, od 9:00 do 17:56'],
  ['5/15 9-17 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 9:05 do 17:50'],
  ['10-40/10 9-17 * * 1-5',
    'od poniedziałku do piątku 10, 20, 30 i 40 minut po każdej pełnej ' +
    'godzinie, od 9:10 do 17:40'],

  // window / hour — context `*/15 9-17 * * 1-5`
  ['*/15 0 * * 1-5', 'od poniedziałku do piątku o 0:00, 0:15, 0:30 i 0:45'],
  ['*/15 9 * * 1-5', 'od poniedziałku do piątku o 9:00, 9:15, 9:30 i 9:45'],
  ['*/15 9,17 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 9:00 do 9:45 oraz od 17:00 ' +
    'do 17:45'],
  ['*/15 8,12,18 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 8:00 do 8:45, od 12:00 do ' +
    '12:45 oraz od 18:00 do 18:45'],
  ['*/15 */2 * * 1-5',
    'od poniedziałku do piątku co 15 minut w co drugiej godzinie, od 0:00 ' +
    'do 22:45'],
  ['*/15 */6 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 0:00 do 0:45, od 6:00 do ' +
    '6:45, od 12:00 do 12:45 oraz od 18:00 do 18:45'],
  ['*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5',
    'od poniedziałku do piątku co 15 minut w co drugiej godzinie, od 0:00 ' +
    'do 22:45, oprócz godziny zaczynającej się o 8:00'],
  ['*/15 22-2 * * 1-5',
    'od poniedziałku do piątku co 15 minut od 0:00 do 2:45 oraz od 22:00 ' +
    'do 23:45'],

  // window / date — context `*/15 9-17 * * 1-5`
  ['*/15 9-17 15 * 1-5',
    'od poniedziałku do piątku, a także 15. dnia każdego miesiąca, co 15 ' +
    'minut od 9:00 do 17:45'],
  ['*/15 9-17 1,15 * 1-5',
    'od poniedziałku do piątku, a także 1. i 15. dnia każdego miesiąca, co ' +
    '15 minut od 9:00 do 17:45'],
  ['*/15 9-17 1-7 * 1-5',
    'od poniedziałku do piątku, a także od 1. do 7. dnia każdego miesiąca, ' +
    'co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 1-7,15 * 1-5',
    'od poniedziałku do piątku, a także od 1. do 7. oraz 15. dnia każdego ' +
    'miesiąca, co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 2/2 * 1-5',
    'od poniedziałku do piątku, a także w dni parzyste każdego miesiąca, ' +
    'co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 */5 * 1-5',
    'od poniedziałku do piątku, a także co 5 dni od 1. do 31. dnia każdego ' +
    'miesiąca, co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 L * 1-5',
    'od poniedziałku do piątku, a także ostatniego dnia każdego miesiąca, ' +
    'co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 15W * 1-5',
    'od poniedziałku do piątku, a także w dzień od poniedziałku do piątku ' +
    'najbliższy 15. dnia każdego miesiąca, co 15 minut od 9:00 do 17:45'],

  // window / month — context `*/15 9-17 * * 1-5`
  ['*/15 9-17 * 6 1-5',
    'w czerwcu od poniedziałku do piątku co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * 1,7 1-5',
    'w styczniu i lipcu od poniedziałku do piątku co 15 minut od 9:00 do ' +
    '17:45'],
  ['*/15 9-17 * 6-8 1-5',
    'od czerwca do sierpnia od poniedziałku do piątku co 15 minut od 9:00 ' +
    'do 17:45'],
  ['*/15 9-17 * 6-8,12 1-5',
    'od czerwca do sierpnia oraz w grudniu od poniedziałku do piątku co 15 ' +
    'minut od 9:00 do 17:45'],
  ['*/15 9-17 * */3 1-5',
    'w styczniu, kwietniu, lipcu i październiku od poniedziałku do piątku ' +
    'co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * 1-11 1-5',
    'od stycznia do listopada od poniedziałku do piątku co 15 minut od ' +
    '9:00 do 17:45'],

  // window / weekday — context `*/15 9-17 * * 1-5`
  ['*/15 9-17 * * 1', 'w poniedziałki co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 0', 'w niedziele co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 0,6', 'w soboty i niedziele co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 1-6',
    'codziennie oprócz niedziel co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 5L',
    'w ostatni piątek każdego miesiąca co 15 minut od 9:00 do 17:45'],
  ['*/15 9-17 * * 1#2',
    'w drugi poniedziałek każdego miesiąca co 15 minut od 9:00 do 17:45'],

  // monthly / second — context `0 0 1 * *`
  ['30 0 0 1 * *', '1. dnia każdego miesiąca o 0:00:30'],
  ['0,30 0 0 1 * *', '1. dnia każdego miesiąca o 0:00:00 i 0:00:30'],
  ['*/15 0 0 1 * *',
    '1. dnia każdego miesiąca o 0:00:00, 0:00:15, 0:00:30 i 0:00:45'],
  ['0-9 0 0 1 * *',
    '1. dnia każdego miesiąca co sekundę od 0:00:00 do 0:00:09'],

  // monthly / minute — context `0 0 1 * *`
  ['30 0 1 * *', '1. dnia każdego miesiąca o 0:30'],
  ['0,30 0 1 * *', '1. dnia każdego miesiąca o 0:00 i 0:30'],
  ['0-29 0 1 * *', '1. dnia każdego miesiąca co minutę od 0:00 do 0:29'],
  ['0-29,45 0 1 * *',
    '1. dnia każdego miesiąca co minutę od 0:00 do 0:29 oraz o 0:45'],
  ['*/7 0 1 * *', '1. dnia każdego miesiąca co 7 minut od 0:00 do 0:56'],
  ['5/15 0 1 * *', '1. dnia każdego miesiąca o 0:05, 0:20, 0:35 i 0:50'],
  ['10-40/10 0 1 * *', '1. dnia każdego miesiąca o 0:10, 0:20, 0:30 i 0:40'],

  // monthly / hour — context `0 0 1 * *`
  ['0 12 1 * *', '1. dnia każdego miesiąca o 12:00'],
  ['0 8,12,18 1 * *', '1. dnia każdego miesiąca o 8:00, 12:00 i 18:00'],
  ['0 9-17 1 * *', '1. dnia każdego miesiąca co godzinę od 9:00 do 17:00'],
  ['0 */2 1 * *', '1. dnia każdego miesiąca co 2 godziny od 0:00 do 22:00'],
  ['0 */6 1 * *', '1. dnia każdego miesiąca o 0:00, 6:00, 12:00 i 18:00'],
  ['0 0,2,4,6,10,12,14,16,18,20,22 1 * *',
    '1. dnia każdego miesiąca co 2 godziny od 0:00 do 22:00 oprócz 8:00'],
  ['0 22-2 1 * *',
    '1. dnia każdego miesiąca co godzinę od 0:00 do 2:00 oraz o 22:00 i ' +
    '23:00'],

  // monthly / date — context `0 0 1 * *`
  ['0 0 15 * *', '15. dnia każdego miesiąca o 0:00'],
  ['0 0 1,15 * *', '1. i 15. dnia każdego miesiąca o 0:00'],
  ['0 0 1-7 * *', 'od 1. do 7. dnia każdego miesiąca codziennie o 0:00'],
  ['0 0 1-7,15 * *', 'od 1. do 7. oraz 15. dnia każdego miesiąca o 0:00'],
  ['0 0 2/2 * *', 'w dni parzyste każdego miesiąca o 0:00'],
  ['0 0 */5 * *', 'co 5 dni od 1. do 31. dnia każdego miesiąca o 0:00'],
  ['0 0 L * *', 'ostatniego dnia każdego miesiąca o 0:00'],
  ['0 0 15W * *',
    'w dzień od poniedziałku do piątku najbliższy 15. dnia każdego ' +
    'miesiąca o 0:00'],

  // monthly / month — context `0 0 1 * *`
  ['0 0 1 6 *', 'co roku 1 czerwca o 0:00'],
  ['0 0 1 1,7 *', 'w styczniu i lipcu 1. dnia miesiąca o 0:00'],
  ['0 0 1 6-8 *', 'od czerwca do sierpnia 1. dnia miesiąca o 0:00'],
  ['0 0 1 6-8,12 *',
    'od czerwca do sierpnia oraz w grudniu 1. dnia miesiąca o 0:00'],
  ['0 0 1 */3 *',
    'w styczniu, kwietniu, lipcu i październiku 1. dnia miesiąca o 0:00'],
  ['0 0 1 1-11 *', 'od stycznia do listopada 1. dnia miesiąca o 0:00'],

  // monthly / weekday — context `0 0 1 * *`
  ['0 0 1 * 0', 'w niedziele, a także 1. dnia każdego miesiąca, o 0:00'],
  ['0 0 1 * 1,3,5',
    'w poniedziałki, środy i piątki, a także 1. dnia każdego miesiąca, o ' +
    '0:00'],
  ['0 0 1 * 0,6',
    'w soboty i niedziele, a także 1. dnia każdego miesiąca, o 0:00'],
  ['0 0 1 * 1-6',
    'od poniedziałku do soboty, a także 1. dnia każdego miesiąca, o 0:00'],
  ['0 0 1 * 5L',
    'w ostatni piątek każdego miesiąca, a także 1. dnia każdego miesiąca, ' +
    'o 0:00'],
  ['0 0 1 * 1#2',
    'w drugi poniedziałek każdego miesiąca, a także 1. dnia każdego ' +
    'miesiąca, o 0:00'],

  // open / second — context `* * * * *`
  ['30 * * * * *', '30 sekund po każdej pełnej minucie'],
  ['0,30 * * * * *', 'co 30 sekund'],
  ['*/15 * * * * *', 'co 15 sekund'],
  ['0-9 * * * * *', 'co sekundę od 0 do 9 sekund po każdej pełnej minucie'],

  // open / minute — context `* * * * *`
  ['30 * * * *', '30 minut po każdej pełnej godzinie'],
  ['0,30 * * * *', 'co 30 minut'],
  ['0-29 * * * *', 'co minutę od 0 do 29 minut po każdej pełnej godzinie'],
  ['0-29,45 * * * *',
    'co minutę od 0 do 29 minut oraz 45 minut po każdej pełnej godzinie'],
  ['*/7 * * * *', 'co 7 minut od 0 do 56 minut po każdej pełnej godzinie'],
  ['5/15 * * * *', '5, 20, 35 i 50 minut po każdej pełnej godzinie'],
  ['10-40/10 * * * *', '10, 20, 30 i 40 minut po każdej pełnej godzinie'],

  // open / hour — context `* * * * *`
  ['* 12 * * *', 'codziennie co minutę od 12:00 do 12:59'],
  ['* 8,12,18 * * *',
    'codziennie co minutę od 8:00 do 8:59, od 12:00 do 12:59 oraz od 18:00 ' +
    'do 18:59'],
  ['* 9-17 * * *', 'codziennie co minutę od 9:00 do 17:59'],
  ['* */2 * * *',
    'codziennie co minutę w co drugiej godzinie, od 0:00 do 22:59'],
  ['* */6 * * *',
    'codziennie co minutę od 0:00 do 0:59, od 6:00 do 6:59, od 12:00 do ' +
    '12:59 oraz od 18:00 do 18:59'],
  ['* 0,2,4,6,10,12,14,16,18,20,22 * * *',
    'codziennie co minutę w co drugiej godzinie, od 0:00 do 22:59, oprócz ' +
    'godziny zaczynającej się o 8:00'],
  ['* 22-2 * * *', 'codziennie co minutę od 22:00 do 2:59'],

  // open / date — context `* * * * *`
  ['* * 15 * *', '15. dnia każdego miesiąca co minutę'],
  ['* * 1,15 * *', '1. i 15. dnia każdego miesiąca co minutę'],
  ['* * 1-7 * *', 'od 1. do 7. dnia każdego miesiąca co minutę'],
  ['* * 1-7,15 * *', 'od 1. do 7. oraz 15. dnia każdego miesiąca co minutę'],
  ['* * 2/2 * *', 'w dni parzyste każdego miesiąca co minutę'],
  ['* * */5 * *', 'co 5 dni od 1. do 31. dnia każdego miesiąca co minutę'],
  ['* * L * *', 'ostatniego dnia każdego miesiąca co minutę'],
  ['* * 15W * *',
    'w dzień od poniedziałku do piątku najbliższy 15. dnia każdego ' +
    'miesiąca co minutę'],

  // open / month — context `* * * * *`
  ['* * * 6 *', 'w czerwcu co minutę'],
  ['* * * 1,7 *', 'w styczniu i lipcu co minutę'],
  ['* * * 6-8 *', 'od czerwca do sierpnia co minutę'],
  ['* * * 6-8,12 *', 'od czerwca do sierpnia oraz w grudniu co minutę'],
  ['* * * */3 *', 'w styczniu, kwietniu, lipcu i październiku co minutę'],
  ['* * * 1-11 *', 'od stycznia do listopada co minutę'],

  // open / weekday — context `* * * * *`
  ['* * * * 0', 'w niedziele co minutę'],
  ['* * * * 1,3,5', 'w poniedziałki, środy i piątki co minutę'],
  ['* * * * 0,6', 'w soboty i niedziele co minutę'],
  ['* * * * 1-6', 'codziennie oprócz niedziel co minutę'],
  ['* * * * 5L', 'w ostatni piątek każdego miesiąca co minutę'],
  ['* * * * 1#2', 'w drugi poniedziałek każdego miesiąca co minutę']
];

export {rows};
