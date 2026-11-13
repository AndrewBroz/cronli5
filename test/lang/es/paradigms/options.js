// Spanish paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/es/answers.md section 1.2.

const defaultParts = {
  '*/15 9-17 * * 1-5': ['15 minutos', '9:00', '17:45', 'lunes', 'viernes'],
  '* 22-23 * * *': ['22:00', '23:59'],
  '0 0 * * *': ['medianoche'],
  '0 0 1 6 *': ['medianoche', '1 de junio'],
  '0 13 * * *': ['13:00'],
  '0 9 * * *': ['9:00'],
  '0 9 * * 1,3,5': ['9:00', 'lunes', 'miércoles', 'viernes'],
  '0 9 * * 5L': ['9:00', 'viernes'],
  '0 9 * 6 1': ['9:00', 'lunes', 'junio'],
  '0 9 * 6-8 *': ['9:00', 'junio', 'agosto'],
  '0 9-17 * * *': ['9:00', '17:00'],
  '30 9,17 * * *': ['9:30', '17:30']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'a las 9:00 a. m. todos los días',
        parts: ['9:00 a. m.'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'a las 9:30 a. m. y 5:30 p. m. todos los días',
        parts: ['9:30 a. m.', '5:30 p. m.'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'cada hora de 9:00 a. m. a 5:00 p. m. todos los días',
        parts: ['9:00 a. m.', '5:00 p. m.'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'a medianoche todos los días',
        parts: ['medianoche'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'a la 1:00 p. m. todos los días',
        parts: ['1:00 p. m.'],
        pattern: '0 13 * * *'
      },
      {
        expected: 'cada 15 minutos de 9:00 a. m. a 5:45 p. m. de lunes a ' +
          'viernes',
        parts: ['15 minutos', '9:00 a. m.', '5:45 p. m.', 'lunes', 'viernes'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'cada minuto de 10:00 p. m. a 11:59 p. m. todos los días',
        parts: ['10:00 p. m.', '11:59 p. m.'],
        pattern: '* 22-23 * * *'
      }
    ]
  },
  {
    options: {lang: 'es-MX'},
    rows: [
      {
        expected: 'a las 9:30 a. m. y 5:30 p. m. todos los días',
        parts: ['9:30 a. m.', '5:30 p. m.'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'a las 9:00 a. m. los lunes, miércoles y viernes',
        parts: ['9:00 a. m.', 'lunes', 'miércoles', 'viernes'],
        pattern: '0 9 * * 1,3,5'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'a las 9:00 los lun, mié y vie',
        parts: ['9:00', 'lun', 'mié', 'vie'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'a las 9:00 los lun en jun',
        parts: ['9:00', 'lun', 'jun'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'a las 9:00 todos los días de jun a ago',
        parts: ['9:00', 'jun', 'ago'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'a medianoche el 1 de jun',
        parts: ['medianoche', '1 de jun'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'a las 9:00 el último vie del mes',
        parts: ['9:00', 'vie'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'cada 15 minutos de 9:00 a 17:45 de lun a vie',
        parts: ['15 minutos', '9:00', '17:45', 'lun', 'vie'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  }
];

export {defaultParts, sets};
