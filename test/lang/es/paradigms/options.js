// Spanish paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/es/answers.md section 1.2.

const defaultParts = {
  '*/15 9-17 * * 1-5': ['lunes', 'viernes', '15 minutos', '9:00', '17:45'],
  '* 22-23 * * *': ['22:00', '23:59'],
  '0 0 * * *': ['0:00'],
  '0 0 1 6 *': ['1 de junio', '0:00'],
  '0 13 * * *': ['13:00'],
  '0 9 * * *': ['9:00'],
  '0 9 * * 1,3,5': ['lunes', 'miércoles', 'viernes', '9:00'],
  '0 9 * * 5L': ['viernes', '9:00'],
  '0 9 * 6 1': ['lunes', 'junio', '9:00'],
  '0 9 * 6-8 *': ['junio', 'agosto', '9:00'],
  '0 9-17 * * *': ['9:00', '17:00'],
  '30 9,17 * * *': ['9:30', '17:30']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'todos los días a las 9:00 a. m.',
        parts: ['9:00 a. m.'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'todos los días a las 9:30 a. m. y 5:30 p. m.',
        parts: ['9:30 a. m.', '5:30 p. m.'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'todos los días, cada hora de 9:00 a. m. a 5:00 p. m.',
        parts: ['9:00 a. m.', '5:00 p. m.'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'todos los días a las 12:00 a. m.',
        parts: ['12:00 a. m.'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'todos los días a la 1:00 p. m.',
        parts: ['1:00 p. m.'],
        pattern: '0 13 * * *'
      },
      {
        expected: 'de lunes a viernes, cada 15 minutos de 9:00 a. m. a ' +
          '5:45 p. m.',
        parts: ['lunes', 'viernes', '15 minutos', '9:00 a. m.', '5:45 p. m.'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'todos los días, cada minuto de 10:00 p. m. a 11:59 p. m.',
        parts: ['10:00 p. m.', '11:59 p. m.'],
        pattern: '* 22-23 * * *'
      }
    ]
  },
  {
    options: {lang: 'es-MX'},
    rows: [
      {
        expected: 'todos los días a las 9:30 a. m. y 5:30 p. m.',
        parts: ['9:30 a. m.', '5:30 p. m.'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'los lunes, miércoles y viernes a las 9:00 a. m.',
        parts: ['lunes', 'miércoles', 'viernes', '9:00 a. m.'],
        pattern: '0 9 * * 1,3,5'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'los lun, mié y vie a las 9:00',
        parts: ['lun', 'mié', 'vie', '9:00'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'los lun de jun a las 9:00',
        parts: ['lun', 'jun', '9:00'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'de jun a ago, todos los días a las 9:00',
        parts: ['jun', 'ago', '9:00'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'el 1 de jun a las 0:00',
        parts: ['1 de jun', '0:00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'el último vie del mes a las 9:00',
        parts: ['vie', '9:00'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'de lun a vie, cada 15 minutos de 9:00 a 17:45',
        parts: ['lun', 'vie', '15 minutos', '9:00', '17:45'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  }
];

export {defaultParts, sets};
