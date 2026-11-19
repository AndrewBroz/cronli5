// Czech paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/cs/answers.md section 1.2.

const defaultParts = {
  '0 9 * * *': ['9:00'],
  '30 9,17 * * *': ['9:30', '17:30'],
  '0 9-17 * * *': ['9:00', '17:00'],
  '0 0 * * *': ['0:00'],
  '0 12 * * *': ['12:00'],
  '0 13 * * *': ['13:00'],
  '*/15 9-17 * * 1-5': ['pondělí', 'pátku', '15 minut', '9:00', '17:45'],
  '* 22-23 * * *': ['22:00', '23:59'],
  '0 9 * * 1': ['pondělí', '9:00'],
  '0 9 * * 1,3,5': ['pondělí', 'středu', 'pátek', '9:00'],
  '0 9 * * 1-5': ['pondělí', 'pátku', '9:00'],
  '0 9 * * 0-5': ['soboty', '9:00'],
  '0 9 * 6 1': ['červnu', 'pondělí', '9:00'],
  '0 9 * 6-8 *': ['června', 'srpna', '9:00'],
  '0 0 1 6 *': ['1. června', '0:00'],
  '0 0 1-7 6 *': ['1.', '7. června', '0:00'],
  '0 9 * * 5L': ['pátek', '9:00'],
  '* 0 9 * * *': ['sekundu', '9:00:00', '9:00:59'],
  '*/6 * * * * *': ['6 sekund'],
  '30 * * * * *': ['30 sekund'],
  '30 0 9 * * *': ['9:00:30']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'denně v 9:00 dopoledne',
        parts: ['9:00 dopoledne'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'denně v 9:30 dopoledne a 5:30 odpoledne',
        parts: ['9:30 dopoledne', '5:30 odpoledne'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'denně každou hodinu od 9:00 dopoledne do 5:00 odpoledne',
        parts: ['9:00 dopoledne', '5:00 odpoledne'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'denně ve 12:00 o půlnoci',
        parts: ['12:00 o půlnoci'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'denně ve 12:00 v poledne',
        parts: ['12:00 v poledne'],
        pattern: '0 12 * * *'
      },
      {
        expected: 'denně v 1:00 odpoledne',
        parts: ['1:00 odpoledne'],
        pattern: '0 13 * * *'
      },
      {
        expected: 'od pondělí do pátku každých 15 minut od 9:00 dopoledne ' +
          'do 5:45 odpoledne',
        parts: ['pondělí', 'pátku', '15 minut', '9:00 dopoledne', '5:45 odpoledne'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'denně každou minutu od 10:00 v noci do 11:59 v noci',
        parts: ['10:00 v noci', '11:59 v noci'],
        pattern: '* 22-23 * * *'
      },
      {
        expected: 'denně v 9:00:30 dopoledne',
        parts: ['9:00:30 dopoledne'],
        pattern: '30 0 9 * * *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'každé pondělí v 9:00',
        parts: ['pondělí', '9:00'],
        pattern: '0 9 * * 1'
      },
      {
        expected: 'Po, St a Pá v 9:00',
        parts: ['Po', 'St', 'Pá', '9:00'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'Po až Pá vždy v 9:00',
        parts: ['Po', 'Pá', '9:00'],
        pattern: '0 9 * * 1-5'
      },
      {
        expected: 'denně kromě soboty vždy v 9:00',
        parts: ['soboty', '9:00'],
        pattern: '0 9 * * 0-5'
      },
      {
        expected: 'v červnu každé pondělí v 9:00',
        parts: ['červnu', 'pondělí', '9:00'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'od června do srpna denně v 9:00',
        parts: ['června', 'srpna', '9:00'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'vždy 1. 6. v 0:00',
        parts: ['1. 6.', '0:00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'od 1. do 7. 6. vždy v 0:00',
        parts: ['1.', '7. 6.', '0:00'],
        pattern: '0 0 1-7 6 *'
      },
      {
        expected: 'vždy poslední pátek v měsíci v 9:00',
        parts: ['pátek', '9:00'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'Po až Pá každých 15 minut od 9:00 do 17:45',
        parts: ['Po', 'Pá', '15 minut', '9:00', '17:45'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {style: {separator: '.'}},
    rows: [
      {
        expected: 'denně v 9.00',
        parts: ['9.00'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'denně v 9.30 a 17.30',
        parts: ['9.30', '17.30'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'od pondělí do pátku každých 15 minut od 9.00 do 17.45',
        parts: ['pondělí', 'pátku', '15 minut', '9.00', '17.45'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'vždy 1. června v 0.00',
        parts: ['1. června', '0.00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'denně v 9:00:30',
        parts: ['9:00:30'],
        pattern: '30 0 9 * * *'
      }
    ]
  },
  {
    options: {style: {hour12: true, separator: '.', short: true}},
    rows: [
      {
        expected: 'Po až Pá každých 15 minut od 9.00 dopoledne do 5.45 ' +
          'odpoledne',
        parts: ['Po', 'Pá', '15 minut', '9.00 dopoledne', '5.45 odpoledne'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {lang: 'cs-CZ'},
    rows: [
      {
        expected: 'každé pondělí, středu a pátek v 9:00',
        parts: ['pondělí', 'středu', 'pátek', '9:00'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'denně v 9:30 a 17:30',
        parts: ['9:30', '17:30'],
        pattern: '30 9,17 * * *'
      }
    ]
  }
];

export {defaultParts, sets};
