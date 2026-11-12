// English paradigms for the options: for each option, and each pair of
// options, a few rows over the phrases it touches. Each row names the
// parts of its sentence in spoken order (`parts`), and `defaultParts`
// gives the same parts as the default style says them. An option may
// change the words of a part. It may not add, drop or reorder parts.
//
// Written by hand from src/lang/en/answers.md §1.2.

const defaultParts = {
  '*/15 9-17 * * 1-5': ['15 minutes', '9 a.m.', '5:45 p.m.', 'weekdays'],
  '0 0 * * *': ['midnight'],
  '0 0 1 6 *': ['midnight', 'June 1'],
  '0 0 1-7 6 *': ['midnight', 'June 1', '7'],
  '0 12 * 6 1': ['noon', 'Mondays', 'June'],
  '0 8,12,18 * * *': ['8 a.m.', 'noon', '6 p.m.'],
  '0 9 * * *': ['9 a.m.'],
  '0 9 * * 1,3,5': ['9 a.m.', 'Mondays', 'Wednesdays', 'Fridays'],
  '0 9 * 6 1': ['9 a.m.', 'Mondays', 'June'],
  '0 9 * 6-8 *': ['9 a.m.', 'June', 'August'],
  '0 9-17 * * *': ['9 a.m.', '5 p.m.'],
  '30 9,17 * * *': ['9:30 a.m.', '5:30 p.m.']
};

const sets = [
  {
    options: {ampm: false},
    rows: [
      {expected: 'at 09:00 every day', parts: ['09:00'], pattern: '0 9 * * *'},
      {expected: 'at 00:00 every day', parts: ['00:00'], pattern: '0 0 * * *'},
      {
        expected: 'at 09:30 and 17:30 every day',
        parts: ['09:30', '17:30'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'at 08:00, 12:00, and 18:00 every day',
        parts: ['08:00', '12:00', '18:00'],
        pattern: '0 8,12,18 * * *'
      },
      {
        expected: 'every hour from 09:00 through 17:00 every day',
        parts: ['09:00', '17:00'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'every 15 minutes from 09:00 through 17:45 on weekdays',
        parts: ['15 minutes', '09:00', '17:45', 'weekdays'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'at 12:00 on Mondays in June',
        parts: ['12:00', 'Mondays', 'June'],
        pattern: '0 12 * 6 1'
      }
    ]
  },
  {
    options: {short: true},
    rows: [
      {
        expected: 'at 9 a.m. on Mon in Jun',
        parts: ['9 a.m.', 'Mon', 'Jun'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'at 9 a.m. on Mon, Wed, and Fri',
        parts: ['9 a.m.', 'Mon', 'Wed', 'Fri'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'at 9 a.m. every day in Jun through Aug',
        parts: ['9 a.m.', 'Jun', 'Aug'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'at midnight on Jun 1',
        parts: ['midnight', 'Jun 1'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays',
        parts: ['15 minutes', '9 a.m.', '5:45 p.m.', 'weekdays'],
        pattern: '*/15 9-17 * * 1-5'
      }
    ]
  },
  {
    options: {dialect: 'gb'},
    rows: [
      {expected: 'at 9am every day', parts: ['9am'], pattern: '0 9 * * *'},
      {
        expected: 'at 9.30am and 5.30pm every day',
        parts: ['9.30am', '5.30pm'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'at 8am, midday and 6pm every day',
        parts: ['8am', 'midday', '6pm'],
        pattern: '0 8,12,18 * * *'
      },
      {
        expected: 'every hour from 9am to 5pm every day',
        parts: ['9am', '5pm'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'every 15 minutes from 9am to 5.45pm on weekdays',
        parts: ['15 minutes', '9am', '5.45pm', 'weekdays'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'at 9am on Mondays, Wednesdays and Fridays',
        parts: ['9am', 'Mondays', 'Wednesdays', 'Fridays'],
        pattern: '0 9 * * 1,3,5'
      },
      {
        expected: 'at 9am every day in June to August',
        parts: ['9am', 'June', 'August'],
        pattern: '0 9 * 6-8 *'
      },
      {
        expected: 'at midnight on 1 June',
        parts: ['midnight', '1 June'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'at midnight on 1 to 7 June',
        parts: ['midnight', '1', '7 June'],
        pattern: '0 0 1-7 6 *'
      }
    ]
  },
  {
    options: {dialect: 'house'},
    rows: [
      {expected: 'at 9 AM every day', parts: ['9 AM'], pattern: '0 9 * * *'},
      {
        expected: 'every hour from 9 AM through 5 PM every day',
        parts: ['9 AM', '5 PM'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'at midnight on June 1st',
        parts: ['midnight', 'June 1st'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'at midnight on June 1st through 7th',
        parts: ['midnight', 'June 1st', '7th'],
        pattern: '0 0 1-7 6 *'
      }
    ]
  },
  {
    options: {ampm: false, dialect: 'gb'},
    rows: [
      {
        expected: 'at 09.30 and 17.30 every day',
        parts: ['09.30', '17.30'],
        pattern: '30 9,17 * * *'
      },
      {
        expected: 'every hour from 09.00 to 17.00 every day',
        parts: ['09.00', '17.00'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'at 12.00 on Mondays in June',
        parts: ['12.00', 'Mondays', 'June'],
        pattern: '0 12 * 6 1'
      }
    ]
  },
  {
    options: {dialect: 'gb', short: true},
    rows: [
      {
        expected: 'at midnight on 1 Jun',
        parts: ['midnight', '1 Jun'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'at 9am on Mon, Wed and Fri',
        parts: ['9am', 'Mon', 'Wed', 'Fri'],
        pattern: '0 9 * * 1,3,5'
      }
    ]
  },
  {
    options: {ampm: false, short: true},
    rows: [
      {
        expected: 'at 09:00 on Mon in Jun',
        parts: ['09:00', 'Mon', 'Jun'],
        pattern: '0 9 * 6 1'
      },
      {
        expected: 'at 12:00 on Mon in Jun',
        parts: ['12:00', 'Mon', 'Jun'],
        pattern: '0 12 * 6 1'
      }
    ]
  }
];

export {defaultParts, sets};
