// German paradigms for the options. Each row names the parts of its
// sentence in spoken order (`parts`), and `defaultParts` gives the same
// parts as the default style says them. An option may change the words of
// a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/de/answers.md section 1.2.

const defaultParts = {
  '*/15 9-17 * * 1-5': ['montags', 'freitags', '15 Minuten', '9:00', '17:45 Uhr'],
  '* 22-23 * * *': ['22:00', '23:59 Uhr'],
  '0 0 * * *': ['0:00 Uhr'],
  '30 0 * * *': ['0:30 Uhr'],
  '0 12 * * *': ['12:00 Uhr'],
  '0 0 1 6 *': ['1. Juni', '0:00 Uhr'],
  '0 0 1 1 *': ['1. Januar', '0:00 Uhr'],
  '0 13 * * *': ['13:00 Uhr'],
  '0 9 * * *': ['9:00 Uhr'],
  '0 9 * * 1,3,5': ['montags', 'mittwochs', 'freitags', '9:00 Uhr'],
  '0 9 * * 5L': ['Freitag', '9:00 Uhr'],
  '0 9 * 6 1': ['montags', 'Juni', '9:00 Uhr'],
  '0 9 * 6-8 *': ['Juni', 'August', '9:00 Uhr'],
  '0 9 * 1 *': ['Januar', '9:00 Uhr'],
  '0 9-17 * * *': ['9:00', '17:00 Uhr'],
  '30 9,17 * * *': ['9:30', '17:30 Uhr'],
  '0 8,12,18 * * *': ['8:00', '12:00', '18:00 Uhr'],
  '0 9 * * 1-6': ['außer', 'sonntags', '9:00 Uhr'],
  '0 0-2,4-23 * * *': ['außer', '3:00 Uhr'],
  '0 0 LW * *': ['Montag', 'Freitag', '0:00 Uhr'],
  '0 9 * 1-11 *': ['außer', 'Dezember', '9:00 Uhr']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'täglich um 9:00 Uhr morgens',
        parts: ['9:00 Uhr morgens'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'täglich um 9:30 Uhr morgens und 5:30 Uhr nachmittags',
        parts: ['9:30 Uhr morgens', '5:30 Uhr nachmittags'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'täglich um 8:00 Uhr morgens, 12:00 Uhr mittags und 6:00 ' +
          'Uhr abends',
        parts: ['8:00 Uhr morgens', '12:00 Uhr mittags', '6:00 Uhr abends'],
        pattern: '0 8,12,18 * * *'
      },
      {
        expected: 'täglich jede Stunde von 9:00 Uhr morgens bis 5:00 Uhr ' +
          'nachmittags',
        parts: ['9:00 Uhr morgens', '5:00 Uhr nachmittags'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'täglich um 0:00 Uhr nachts',
        parts: ['0:00 Uhr nachts'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'täglich um 0:30 Uhr nachts',
        parts: ['0:30 Uhr nachts'],
        pattern: '30 0 * * *'
      },
      {
        expected: 'täglich um 12:00 Uhr mittags',
        parts: ['12:00 Uhr mittags'],
        pattern: '0 12 * * *'
      },
      {
        expected: 'täglich um 1:00 Uhr mittags',
        parts: ['1:00 Uhr mittags'],
        pattern: '0 13 * * *'
      },
      {
        expected: 'montags bis freitags alle 15 Minuten von 9:00 Uhr ' +
          'morgens bis 5:45 Uhr nachmittags',
        parts: ['montags', 'freitags', '15 Minuten', '9:00 Uhr morgens', '5:45 Uhr nachmittags'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'täglich jede Minute von 10:00 Uhr abends bis 11:59 Uhr ' +
          'abends',
        parts: ['10:00 Uhr abends', '11:59 Uhr abends'],
        pattern: '* 22-23 * * *'
      },
      {
        expected: 'am 1. Juni um 0:00 Uhr nachts',
        parts: ['1. Juni', '0:00 Uhr nachts'],
        pattern: '0 0 1 6 *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'Mo, Mi und Fr um 9:00 Uhr',
        parts: ['Mo', 'Mi', 'Fr', '9:00 Uhr'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'Mo im Jun um 9:00 Uhr',
        parts: ['Mo', 'Jun', '9:00 Uhr'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'täglich von Jun bis Aug jeweils um 9:00 Uhr',
        parts: ['Jun', 'Aug', '9:00 Uhr'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'am 1. Jun um 0:00 Uhr',
        parts: ['1. Jun', '0:00 Uhr'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'am letzten Fr jedes Monats um 9:00 Uhr',
        parts: ['Fr', '9:00 Uhr'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'täglich, außer So, um 9:00 Uhr',
        parts: ['außer', 'So', '9:00 Uhr'],
        pattern: '0 9 * * 1-6'
      },
      {
        expected: 'am letzten Wochentag (Mo bis Fr) jedes Monats um 0:00 ' +
          'Uhr',
        parts: ['Mo', 'Fr', '0:00 Uhr'],
        pattern: '0 0 LW * *'
      },
      {
        expected: 'Mo bis Fr alle 15 Minuten von 9:00 bis 17:45 Uhr',
        parts: ['Mo', 'Fr', '15 Minuten', '9:00', '17:45 Uhr'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {style: {jaenner: true}},
    rows: [
      {
        expected: 'täglich im Jänner um 9:00 Uhr',
        parts: ['Jänner', '9:00 Uhr'],
        pattern: '0 9 * 1 *'
      },
      {
        expected: 'am 1. Jänner um 0:00 Uhr',
        parts: ['1. Jänner', '0:00 Uhr'],
        pattern: '0 0 1 1 *'
      },
      {
        expected: 'montags im Juni um 9:00 Uhr',
        parts: ['montags', 'Juni', '9:00 Uhr'],
        pattern: '0 9 * 6 1'
      }
    ]
  },
  {
    options: {lang: 'de-AT'},
    rows: [
      {
        expected: 'täglich im Jänner um 9:00 Uhr',
        parts: ['Jänner', '9:00 Uhr'],
        pattern: '0 9 * 1 *'
      },
      {
        expected: 'täglich, außer sonntags, um 9:00 Uhr',
        parts: ['außer', 'sonntags', '9:00 Uhr'],
        pattern: '0 9 * * 1-6'
      }
    ]
  },
  {
    options: {lang: 'de-AT', style: {short: true}},
    rows: [
      {
        expected: 'täglich im Jän um 9:00 Uhr',
        parts: ['Jän', '9:00 Uhr'],
        pattern: '0 9 * 1 *'
      }
    ]
  },
  {
    options: {style: {eszett: false}},
    rows: [
      {
        expected: 'täglich, ausser sonntags, um 9:00 Uhr',
        parts: ['ausser', 'sonntags', '9:00 Uhr'],
        pattern: '0 9 * * 1-6'
      },
      {
        expected: 'zu jeder vollen Stunde, ausser um 3:00 Uhr',
        parts: ['ausser', '3:00 Uhr'],
        pattern: '0 0-2,4-23 * * *'
      }
    ]
  },
  {
    options: {lang: 'de-CH'},
    rows: [
      {
        expected: 'täglich in allen Monaten, ausser im Dezember, um 9:00 ' +
          'Uhr',
        parts: ['ausser', 'Dezember', '9:00 Uhr'],
        pattern: '0 9 * 1-11 *'
      },
      {
        expected: 'täglich im Januar um 9:00 Uhr',
        parts: ['Januar', '9:00 Uhr'],
        pattern: '0 9 * 1 *'
      }
    ]
  }
];

export {defaultParts, sets};
