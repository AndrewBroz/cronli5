// Ukrainian paradigms for the options: for each style field, and the two
// together, a few rows over the phrases it touches. Each row names the
// parts of its sentence in spoken order (`parts`), and `defaultParts`
// gives the same parts as the default style says them. An option may
// change the words of a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/uk/answers.md section 1.2.

const defaultParts = {
  '*/15 9-17 * * 1-5': ['15 хвилин', '9:00', '17:45', 'буднях'],
  '* 22-23 * * *': ['22:00', '24:00'],
  '0 0 * * *': ['опівночі'],
  '0 0 1 6 *': ['опівночі', '1 червня'],
  '0 9 * * *': ['9:00'],
  '0 9 * * 1,3,5': ['9:00', 'понеділках', 'середах', 'п\'ятницях'],
  '0 9 * * 5L': ['9:00', 'п\'ятницю'],
  '0 9 * 6 1': ['9:00', 'понеділках', 'червні'],
  '0 9 * 6-8 *': ['9:00', 'червня', 'серпня'],
  '0 9-17 * * *': ['9:00', '17:00'],
  '30 9,17 * * *': ['9:30', '17:30']
};

const sets = [
  {
    options: {style: {hour12: true}},
    rows: [
      {
        expected: 'о 9:00 ранку щодня',
        parts: ['9:00 ранку'],
        pattern: '0 9 * * *'
      },
      {
        expected: 'о 9:30 ранку та 5:30 вечора щодня',
        parts: ['9:30 ранку', '5:30 вечора'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'щогодини з 9:00 ранку до 5:00 вечора включно щодня',
        parts: ['9:00 ранку', '5:00 вечора'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'опівночі щодня',
        parts: ['опівночі'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'кожні 15 хвилин з 9:00 ранку до 5:45 вечора включно по ' +
          'буднях',
        parts: ['15 хвилин', '9:00 ранку', '5:45 вечора', 'буднях'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'щохвилини з 10:00 вечора до 12:00 ночі щодня',
        parts: ['10:00 вечора', '12:00 ночі'],
        pattern: '* 22-23 * * *'
      }
    ]
  },
  {
    options: {style: {short: true}},
    rows: [
      {
        expected: 'о 9:00 по пн, ср та пт',
        parts: ['9:00', 'пн', 'ср', 'пт'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'о 9:00 по пн у черв.',
        parts: ['9:00', 'пн', 'черв.'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'о 9:00 щодня від черв. до серп. включно',
        parts: ['9:00', 'черв.', 'серп.'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'опівночі 1 черв.',
        parts: ['опівночі', '1 черв.'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'о 9:00 в останню пт місяця',
        parts: ['9:00', 'пт'],
        pattern: '0 9 * * 5L'
      },
      {
        expected: 'кожні 15 хвилин з 9:00 до 17:45 включно по буднях',
        parts: ['15 хвилин', '9:00', '17:45', 'буднях'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {style: {hour12: true, short: true}},
    rows: [
      {
        expected: 'о 9:00 ранку по пн у черв.',
        parts: ['9:00 ранку', 'пн', 'черв.'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'о 9:30 ранку та 5:30 вечора щодня',
        parts: ['9:30 ранку', '5:30 вечора'],
        pattern: '30 9,17 * * *'
      }
    ]
  }
];

export {defaultParts, sets};
