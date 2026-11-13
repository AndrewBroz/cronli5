// Polish paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/pl/answers.md section 1.2.

const defaultParts = {
  '0 9 * * *': ['9:00'],
  '30 9,17 * * *': ['9:30', '17:30'],
  '0 9-17 * * *': ['9:00', '17:00'],
  '0 0 * * *': ['0:00'],
  '30 0 * * *': ['0:30'],
  '0 3 * * *': ['3:00'],
  '0 4 * * *': ['4:00'],
  '0 12 * * *': ['12:00'],
  '30 12 * * *': ['12:30'],
  '0 13 * * *': ['13:00'],
  '0 18,23 * * *': ['18:00', '23:00'],
  '*/15 9-17 * * 1-5': ['poniedziałku', 'piątku', '15 minut', '9:00', '17:45'],
  '* 22-23 * * *': ['22:00', '23:59'],
  '30 0 9 * * *': ['9:00:30'],
  '0 9 * * 1,3,5': ['poniedziałki', 'środy', 'piątki', '9:00'],
  '0 9 * * 2,4': ['wtorki', 'czwartki', '9:00'],
  '0 9 * * 1-6': ['niedziel', '9:00'],
  '0 9 * 6 1': ['czerwcu', 'poniedziałki', '9:00'],
  '0 9 * 6-8 *': ['czerwca', 'sierpnia', '9:00'],
  '0 0 1 6 *': ['1 czerwca', '0:00'],
  '0 0 1,15 9 *': ['1 i 15 września', '0:00'],
  '0 9 * * 5L': ['ostatni piątek', '9:00'],
  '0 9 * * 3#1': ['pierwszą środę', '9:00'],
  '0 0 1 * 0': ['niedziele', 'pierwszego dnia', '0:00'],
  '0 0 LW * *': ['dzień powszedni', 'od poniedziałku do piątku', '0:00'],
  '0 */2 * * *': ['2 godziny', '0:00', '22:00'],
  '5,20,45 * * * *': ['45 minut', 'pełnej godzinie'],
  '*/6 * * * * *': ['6 sekund'],
  '* * * * *': ['minutę'],
  '* */2 * * *': ['0:00–0:59', '2:00–2:59', '22:00–22:59']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'codziennie o 9:00 rano',
        parts: ['9:00 rano'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'codziennie o 9:30 rano i 5:30 po południu',
        parts: ['9:30 rano', '5:30 po południu'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'codziennie co godzinę od 9:00 rano do 5:00 po południu',
        parts: ['9:00 rano', '5:00 po południu'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'codziennie o 0:00 w nocy',
        parts: ['0:00 w nocy'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'codziennie o 0:30 w nocy',
        parts: ['0:30 w nocy'],
        pattern: '30 0 * * *'
      },
      {
        expected: 'codziennie o 3:00 w nocy',
        parts: ['3:00 w nocy'],
        pattern: '0 3 * * *'
      },
      {
        expected: 'codziennie o 4:00 rano',
        parts: ['4:00 rano'],
        pattern: '0 4 * * *'
      },
      {
        expected: 'codziennie o 12:00 w południe',
        parts: ['12:00 w południe'],
        pattern: '0 12 * * *'
      },
      {
        expected: 'codziennie o 12:30 po południu',
        parts: ['12:30 po południu'],
        pattern: '30 12 * * *'
      },
      {
        expected: 'codziennie o 1:00 po południu',
        parts: ['1:00 po południu'],
        pattern: '0 13 * * *'
      },
      {
        expected: 'codziennie o 6:00 wieczorem i 11:00 wieczorem',
        parts: ['6:00 wieczorem', '11:00 wieczorem'],
        pattern: '0 18,23 * * *'
      },
      {
        expected: 'od poniedziałku do piątku co 15 minut od 9:00 rano do ' +
          '5:45 po południu',
        parts: ['poniedziałku', 'piątku', '15 minut', '9:00 rano', '5:45 po południu'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'codziennie co minutę od 10:00 wieczorem do 11:59 ' +
          'wieczorem',
        parts: ['10:00 wieczorem', '11:59 wieczorem'],
        pattern: '* 22-23 * * *'
      },
      {
        expected: 'codziennie o 9:00:30 rano',
        parts: ['9:00:30 rano'],
        pattern: '30 0 9 * * *'
      },
      {
        expected: 'codziennie co minutę w co drugiej godzinie: 0:00–0:59 w ' +
          'nocy, 2:00–2:59 w nocy … 10:00–10:59 wieczorem',
        parts: ['0:00–0:59 w nocy', '2:00–2:59 w nocy', '10:00–10:59 wieczorem'],
        pattern: '* */2 * * *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'w pon., śr. i pt. o 9:00',
        parts: ['pon.', 'śr.', 'pt.', '9:00'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'we wt. i czw. o 9:00',
        parts: ['wt.', 'czw.', '9:00'],
        pattern: '0 9 * * 2,4'
      },
      {
        expected: 'codziennie oprócz niedz., o 9:00',
        parts: ['niedz.', '9:00'],
        pattern: '0 9 * * 1-6'
      },
      {
        expected: 'w czerwcu w pon. o 9:00',
        parts: ['czerwcu', 'pon.', '9:00'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'od czerwca do sierpnia codziennie o 9:00',
        parts: ['czerwca', 'sierpnia', '9:00'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'co roku 1 VI o 0:00',
        parts: ['1 VI', '0:00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'co roku 1 i 15 IX o 0:00',
        parts: ['1 i 15 IX', '0:00'],
        pattern: '0 0 1,15 9 *'
      },
      {
        expected: 'w ostatni pt. każdego miesiąca o 9:00',
        parts: ['ostatni pt.', '9:00'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'w pierwszą śr. każdego miesiąca o 9:00',
        parts: ['pierwszą śr.', '9:00'],
        pattern: '0 9 * * 3#1'
      },
      {
        expected: 'w niedz., a także pierwszego dnia każdego miesiąca, o ' +
          '0:00',
        parts: ['niedz.', 'pierwszego dnia', '0:00'],
        pattern: '0 0 1 * 0'
      },
      {
        expected: 'w ostatni dzień powszedni (od pon. do pt.) każdego ' +
          'miesiąca o 0:00',
        parts: ['dzień powszedni', 'od pon. do pt.', '0:00'],
        pattern: '0 0 LW * *'
      },
      {
        expected: 'od pon. do pt. co 15 min od 9:00 do 17:45',
        parts: ['pon.', 'pt.', '15 min', '9:00', '17:45'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'codziennie co 2 godz. od 0:00 do 22:00',
        parts: ['2 godz.', '0:00', '22:00'],
        pattern: '0 */2 * * *'
      },
      {
        expected: '5, 20 i 45 min po każdej pełnej godzinie',
        parts: ['45 min', 'pełnej godzinie'],
        pattern: '5,20,45 * * * *'
      },
      {
        expected: 'co 6 s',
        parts: ['6 s'],
        pattern: '*/6 * * * * *'
      },
      {
        expected: 'co minutę',
        parts: ['minutę'],
        pattern: '* * * * *'
      }
    ]
  },
  {
    options: {style: {separator: '.'}},
    rows: [
      {
        expected: 'codziennie o 9.00',
        parts: ['9.00'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'codziennie o 9.30 i 17.30',
        parts: ['9.30', '17.30'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'codziennie co godzinę od 9.00 do 17.00',
        parts: ['9.00', '17.00'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'od poniedziałku do piątku co 15 minut od 9.00 do 17.45',
        parts: ['poniedziałku', 'piątku', '15 minut', '9.00', '17.45'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'co roku 1 czerwca o 0.00',
        parts: ['1 czerwca', '0.00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'w niedziele, a także pierwszego dnia każdego miesiąca, ' +
          'o 0.00',
        parts: ['niedziele', 'pierwszego dnia', '0.00'],
        pattern: '0 0 1 * 0'
      },
      {
        expected: 'codziennie o 9:00:30',
        parts: ['9:00:30'],
        pattern: '30 0 9 * * *'
      },
      {
        expected: 'codziennie co minutę w co drugiej godzinie: 0.00–0.59, ' +
          '2.00–2.59 … 22.00–22.59',
        parts: ['0.00–0.59', '2.00–2.59', '22.00–22.59'],
        pattern: '* */2 * * *'
      }
    ]
  },
  {
    options: {style: {hour12: true, separator: '.', short: true}},
    rows: [
      {
        expected: 'codziennie o 9.30 rano i 5.30 po południu',
        parts: ['9.30 rano', '5.30 po południu'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'od pon. do pt. co 15 min od 9.00 rano do 5.45 po ' +
          'południu',
        parts: ['pon.', 'pt.', '15 min', '9.00 rano', '5.45 po południu'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {lang: 'pl-PL'},
    rows: [
      {
        expected: 'codziennie o 9:00',
        parts: ['9:00'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'codziennie o 9:30 i 17:30',
        parts: ['9:30', '17:30'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'w poniedziałki, środy i piątki o 9:00',
        parts: ['poniedziałki', 'środy', 'piątki', '9:00'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'co roku 1 czerwca o 0:00',
        parts: ['1 czerwca', '0:00'],
        pattern: '0 0 1 6 *'
      }
    ]
  }
];

export {defaultParts, sets};
