// Italian paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/it/answers.md section 1.2.

const defaultParts = {
  '0 9 * * *': ['9:00'],
  '0 0 * * *': ['0:00'],
  '0 12 * * *': ['12:00'],
  '0 13 * * *': ['13:00'],
  '0 3,20 * * *': ['3:00', '20:00'],
  '0 0 * * 1': ['lunedì', '0:00'],
  '0 3 * * 1': ['lunedì', '3:00'],
  '30 9,17 * * *': ['9:30', '17:30'],
  '0 9-17 * * *': ['9:00', '17:00'],
  '0 9-17,22 * * *': ['9:00', '17:00', '22:00'],
  '*/15 9-17 * * 1-5': ['lunedì', 'venerdì', '15 minuti', '9:00', '17:45'],
  '* 22-23 * * *': ['22:00', '23:59'],
  '15 30 9 * * *': ['9:30:15'],
  '0 9 * * 1,3,5': ['lunedì', 'mercoledì', 'venerdì', '9:00'],
  '0 9 * * 0': ['domenica', '9:00'],
  '0 9 * 6 1': ['giugno', 'lunedì', '9:00'],
  '0 9 * 6-8 *': ['giugno', 'agosto', '9:00'],
  '0 0 1 6 *': ['1º giugno', '0:00'],
  '0 9 * * 5L': ['venerdì', '9:00'],
  '0 9 15W * *': ['15', 'lunedì', 'venerdì', '9:00'],
  '0 9 * 1-7,9-12 *': ['9:00', 'agosto']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'tutti i giorni alle 9:00 del mattino',
        parts: ['9:00 del mattino'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'tutti i giorni alle 0:00',
        parts: ['0:00'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'tutti i giorni alle 12:00',
        parts: ['12:00'],
        pattern: '0 12 * * *'
      },
      {
        expected: 'tutti i giorni all\'1:00 del pomeriggio',
        parts: ['1:00 del pomeriggio'],
        pattern: '0 13 * * *'
      },
      {
        expected: 'tutti i giorni alle 3:00 del mattino e alle 8:00 di sera',
        parts: ['3:00 del mattino', '8:00 di sera'],
        pattern: '0 3,20 * * *'
      },
      {
        expected: 'il lunedì alle 0:00',
        parts: ['lunedì', '0:00'],
        pattern: '0 0 * * 1'
      },
      {
        expected: 'il lunedì alle 3:00 del mattino',
        parts: ['lunedì', '3:00 del mattino'],
        pattern: '0 3 * * 1'
      },
      {
        expected: 'tutti i giorni alle 9:30 del mattino e alle 5:30 del ' +
          'pomeriggio',
        parts: ['9:30 del mattino', '5:30 del pomeriggio'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'tutti i giorni, ogni ora dalle 9:00 del mattino alle ' +
          '5:00 del pomeriggio',
        parts: ['9:00 del mattino', '5:00 del pomeriggio'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'tutti i giorni, ogni ora dalle 9:00 del mattino alle ' +
          '5:00 del pomeriggio e una volta alle 10:00 di sera',
        parts: ['9:00 del mattino', '5:00 del pomeriggio', '10:00 di sera'],
        pattern: '0 9-17,22 * * *'
      },
      {
        expected: 'dal lunedì al venerdì, ogni 15 minuti dalle 9:00 del ' +
          'mattino alle 5:45 del pomeriggio',
        parts: ['lunedì', 'venerdì', '15 minuti', '9:00 del mattino', '5:45 del pomeriggio'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'tutti i giorni, ogni minuto dalle 10:00 di sera alle ' +
          '11:59 di sera',
        parts: ['10:00 di sera', '11:59 di sera'],
        pattern: '* 22-23 * * *'
      },
      {
        expected: 'tutti i giorni alle 9:30:15 del mattino',
        parts: ['9:30:15 del mattino'],
        pattern: '15 30 9 * * *'
      }
    ]
  },
  {
    options: {style: {separator: '.'}},
    rows: [
      {
        expected: 'tutti i giorni alle 9.00',
        parts: ['9.00'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'tutti i giorni alle 9.30 e alle 17.30',
        parts: ['9.30', '17.30'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'tutti i giorni alle 9.30.15',
        parts: ['9.30.15'],
        pattern: '15 30 9 * * *'
      },
      {
        expected: 'il 1º giugno alle 0.00',
        parts: ['1º giugno', '0.00'],
        pattern: '0 0 1 6 *'
      }
    ]
  },
  {
    options: {lang: 'it-CH'},
    rows: [
      {
        expected: 'tutti i giorni alle 9.30 e alle 17.30',
        parts: ['9.30', '17.30'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'dal lunedì al venerdì, ogni 15 minuti dalle 9.00 alle ' +
          '17.45',
        parts: ['lunedì', 'venerdì', '15 minuti', '9.00', '17.45'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'tutti i giorni, ogni minuto dalle 22.00 alle 23.59',
        parts: ['22.00', '23.59'],
        pattern: '* 22-23 * * *'
      },
      {
        expected: 'il lunedì, il mercoledì e il venerdì alle 9.00',
        parts: ['lunedì', 'mercoledì', 'venerdì', '9.00'],
        pattern: '0 9 * * 1,3,5'
      }
    ]
  },
  {
    options: {lang: 'it-IT'},
    rows: [
      {
        expected: 'tutti i giorni alle 9:30 e alle 17:30',
        parts: ['9:30', '17:30'],
        pattern: '30 9,17 * * *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'il lun, il mer e il ven alle 9:00',
        parts: ['lun', 'mer', 'ven', '9:00'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'la dom alle 9:00',
        parts: ['dom', '9:00'],
        pattern: '0 9 * * 0'
      },
      {
        expected: 'a giu, il lun alle 9:00',
        parts: ['giu', 'lun', '9:00'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'da giu ad ago, tutti i giorni alle 9:00',
        parts: ['giu', 'ago', '9:00'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'il 1º giu alle 0:00',
        parts: ['1º giu', '0:00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'l\'ultimo ven di ogni mese alle 9:00',
        parts: ['ven', '9:00'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'il giorno lavorativo più vicino al 15 di ogni mese (dal ' +
          'lun al ven, festivi compresi) alle 9:00',
        parts: ['15', 'lun', 'ven', '9:00'],
        pattern: '0 9 15W * *'
      },
      {
        expected: 'tutti i giorni alle 9:00, tranne ad ago',
        parts: ['9:00', 'ago'],
        pattern: '0 9 * 1-7,9-12 *'
      },
      {
        expected: 'dal lun al ven, ogni 15 minuti dalle 9:00 alle 17:45',
        parts: ['lun', 'ven', '15 minuti', '9:00', '17:45'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  }
];

export {defaultParts, sets};
