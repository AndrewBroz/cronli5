// Ukrainian paradigms for the options: for each style field, and the two
// together, a few rows over the phrases it touches. Each row names the
// parts of its sentence in spoken order (`parts`), and `defaultParts`
// gives the same parts as the default style says them. An option may
// change the words of a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/uk/answers.md section 1.2.

const defaultParts = {
  '*/15 9-17 * * 1-5':
    ['понеділка', 'п\'ятниці', '15 хвилин', '9:00', '17:45'],
  '* 22-23 * * *': ['22:00', '23:59'],
  '0 0 * * *': ['0:00'],
  '0 0 1 6 *': ['1 червня', '0:00'],
  '0 9 * * *': ['9:00'],
  '0 9 * * 1,3,5': ['понеділка', 'середи', 'п\'ятниці', '9:00'],
  '0 9 * * 2-4': ['вівторка', 'четверга', '9:00'],
  '0 9 * * 5L': ['п\'ятницю', '9:00'],
  '0 9 * 6 1': ['червні', 'понеділка', '9:00'],
  '0 9 * 6-8 *': ['червня', 'серпня', '9:00'],
  '0 9-17 * * *': ['9:00', '17:00'],
  '30 9,17 * * *': ['9:30', '17:30']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'щодня о 9:00 ранку',
        parts: ['9:00 ранку'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'щодня о 9:30 ранку та 5:30 вечора',
        parts: ['9:30 ранку', '5:30 вечора'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'щогодини з 9:00 ранку до 5:00 вечора включно',
        parts: ['9:00 ранку', '5:00 вечора'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'щодня о 12:00 ночі',
        parts: ['12:00 ночі'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'щотижня з понеділка до п\'ятниці включно, кожні 15 ' +
          'хвилин з 9:00 ранку до 5:45 вечора',
        parts: [
          'понеділка', 'п\'ятниці', '15 хвилин', '9:00 ранку', '5:45 вечора'
        ],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'щохвилини з 10:00 вечора до 11:59 вечора',
        parts: ['10:00 вечора', '11:59 вечора'],
        pattern: '* 22-23 * * *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'по пн, ср та пт о 9:00',
        parts: ['пн', 'ср', 'пт', '9:00'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'у черв. по пн о 9:00',
        parts: ['черв.', 'пн', '9:00'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'щотижня з вт до чт включно, о 9:00',
        parts: ['вт', 'чт', '9:00'],
        pattern: '0 9 * * 2-4'
      },
      {
        expected: 'із черв. до серп. включно, щодня о 9:00',
        parts: ['черв.', 'серп.', '9:00'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'щороку 1 черв. о 0:00',
        parts: ['1 черв.', '0:00'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'в останню пт місяця о 9:00',
        parts: ['пт', '9:00'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'щотижня з пн до пт включно, кожні 15 хвилин з 9:00 до ' +
          '17:45',
        parts: ['пн', 'пт', '15 хвилин', '9:00', '17:45'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {style: {hour12: true, short: true}},
    rows: [
      {
        expected: 'у черв. по пн о 9:00 ранку',
        parts: ['черв.', 'пн', '9:00 ранку'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'щодня о 9:30 ранку та 5:30 вечора',
        parts: ['9:30 ранку', '5:30 вечора'],
        pattern: '30 9,17 * * *'
      }
    ]
  }
];

export {defaultParts, sets};
