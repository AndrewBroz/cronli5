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
  '0 0 1 6 *': ['12 a.m.', 'June 1'],
  '0 0 1-7 6 *': ['12 a.m.', 'June 1', '7'],
  '0 0,12 * * 1-5': ['12 a.m.', 'noon', 'weekdays'],
  '0-29 9 * * *': ['9 a.m.', '9:29 a.m.'],
  '0 12 * 6 1': ['noon', 'Mondays', 'June'],
  '0 8,12,18 * * *': ['8 a.m.', 'noon', '6 p.m.'],
  '0 18 * * *': ['6 p.m.'],
  '0 9 * * *': ['9 a.m.'],
  '0 9 * * 1,3,5': ['9 a.m.', 'Mondays', 'Wednesdays', 'Fridays'],
  '0 9 * * 1-5': ['9 a.m.', 'weekdays'],
  '0 9 * * 6,0': ['9 a.m.', 'weekends'],
  '0 9 1 * 1-5': ['9 a.m.', 'the 1st', 'weekdays'],
  '0 9 * 6 1': ['9 a.m.', 'Mondays', 'June'],
  '0 9 * 6-8 *': ['9 a.m.', 'June', 'August'],
  '0 9-17 * * *': ['9 a.m.', '5 p.m.'],
  '30 9,17 * * *': ['9:30 a.m.', '5:30 p.m.']
};

const sets = [
  {
    options: {style: {hour12: false}},
    rows: [
      {expected: 'at 09:00 every day', parts: ['09:00'], pattern: '0 9 * * *'},
      {expected: 'at 00:00 every day', parts: ['00:00'], pattern: '0 0 * * *'},
      {
        expected: 'at 00:00 on June 1',
        parts: ['00:00', 'June 1'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'every minute from 09:00 through 09:29 every day',
        parts: ['09:00', '09:29'],
        pattern: '0-29 9 * * *'
      },
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
    options: {style: {short: true}},
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
        expected: 'at 12 a.m. on Jun 1',
        parts: ['12 a.m.', 'Jun 1'],
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
    options: {lang: 'en-GB'},
    rows: [
      {expected: 'at 9am every day', parts: ['9am'], pattern: '0 9 * * *'},
      {
        expected: 'at midnight every day',
        parts: ['midnight'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'every minute from 9am to 9.29am every day',
        parts: ['9am', '9.29am'],
        pattern: '0-29 9 * * *'
      },
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
        expected: 'at 12am on 1 June',
        parts: ['12am', '1 June'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'at 12am on 1 to 7 June',
        parts: ['12am', '1', '7 June'],
        pattern: '0 0 1-7 6 *'
      }
    ]
  },
  {
    options: {style: {am: 'AM', ordinals: true, pm: 'PM'}},
    rows: [
      {expected: 'at 9 AM every day', parts: ['9 AM'], pattern: '0 9 * * *'},
      {
        expected: 'every hour from 9 AM through 5 PM every day',
        parts: ['9 AM', '5 PM'],
        pattern: '0 9-17 * * *'
      },
      {
        expected: 'at 12 AM on June 1st',
        parts: ['12 AM', 'June 1st'],
        pattern: '0 0 1 6 *'
      },
      {
        expected: 'at 12 AM on June 1st through 7th',
        parts: ['12 AM', 'June 1st', '7th'],
        pattern: '0 0 1-7 6 *'
      }
    ]
  },
  {
    options: {lang: 'en-GB', style: {hour12: false}},
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
    options: {lang: 'en-GB', style: {short: true}},
    rows: [
      {
        expected: 'at 12am on 1 Jun',
        parts: ['12am', '1 Jun'],
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
    options: {style: {midnight: ''}},
    rows: [
      {
        expected: 'at 12 a.m. every day',
        parts: ['12 a.m.'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'at 12 a.m. on June 1',
        parts: ['12 a.m.', 'June 1'],
        pattern: '0 0 1 6 *'
      }
    ]
  },
  {
    options: {style: {midnight: '12 midnight'}},
    rows: [
      {
        expected: 'at 12 midnight every day',
        parts: ['12 midnight'],
        pattern: '0 0 * * *'
      },
      {
        expected: 'at 12 a.m. on June 1',
        parts: ['12 a.m.', 'June 1'],
        pattern: '0 0 1 6 *'
      }
    ]
  },
  {
    // A house that names the days instead.
    options: {style: {weekWords: false}},
    rows: [
      {
        expected: 'at 9 a.m. Monday through Friday',
        parts: ['9 a.m.', 'Monday through Friday'],
        pattern: '0 9 * * 1-5'
      },
      {
        expected: 'at 9 a.m. on Saturdays and Sundays',
        parts: ['9 a.m.', 'Saturdays and Sundays'],
        pattern: '0 9 * * 6,0'
      },
      {
        expected: 'every 15 minutes from 9 a.m. through 5:45 p.m. ' +
          'Monday through Friday',
        parts: ['15 minutes', '9 a.m.', '5:45 p.m.', 'Monday through Friday'],
        pattern: '*/15 9-17 * * 1-5'
      },
      {
        expected: 'at 9 a.m. on the 1st of the month as well as Monday through Friday',
        parts: ['9 a.m.', 'the 1st', 'Monday through Friday'],
        pattern: '0 9 1 * 1-5'
      }
    ]
  },
  {
    // A house that says every clock time and every day as such.
    options: {style: {midday: '', midnight: '', weekWords: false}},
    rows: [
      {
        expected: 'at 12 a.m. and 12 p.m. Monday through Friday',
        parts: ['12 a.m.', '12 p.m.', 'Monday through Friday'],
        pattern: '0 0,12 * * 1-5'
      },
      {
        expected: 'at 8 a.m., 12 p.m., and 6 p.m. every day',
        parts: ['8 a.m.', '12 p.m.', '6 p.m.'],
        pattern: '0 8,12,18 * * *'
      }
    ]
  },
  {
    options: {lang: 'en-GB', style: {weekWords: false}},
    rows: [
      {
        expected: 'at 9am Monday to Friday',
        parts: ['9am', 'Monday to Friday'],
        pattern: '0 9 * * 1-5'
      },
      {
        expected: 'at 9am on Saturdays and Sundays',
        parts: ['9am', 'Saturdays and Sundays'],
        pattern: '0 9 * * 6,0'
      }
    ]
  },
  {
    // A house that always writes the minutes.
    options: {style: {minutes: true}},
    rows: [
      {expected: 'at 6:00 p.m. every day', parts: ['6:00 p.m.'],
        pattern: '0 18 * * *'},
      {
        expected: 'every hour from 9:00 a.m. through 5:00 p.m. every day',
        parts: ['9:00 a.m.', '5:00 p.m.'],
        pattern: '0 9-17 * * *'
      },
      {expected: 'at 8:00 a.m., noon, and 6:00 p.m. every day',
        parts: ['8:00 a.m.', 'noon', '6:00 p.m.'],
        pattern: '0 8,12,18 * * *'}
    ]
  },
  {
    // A house that writes the hour in two digits.
    options: {style: {padHour: true}},
    rows: [
      {expected: 'at 09:30 a.m. and 05:30 p.m. every day',
        parts: ['09:30 a.m.', '05:30 p.m.'], pattern: '30 9,17 * * *'},
      {expected: 'at 06 p.m. every day', parts: ['06 p.m.'],
        pattern: '0 18 * * *'}
    ]
  },
  {
    // cRonstrue's clock, as cronli5/compat writes English.
    options: {
      style: {am: 'AM', midday: '', midnight: '', minutes: true,
        padHour: true, pm: 'PM'}
    },
    rows: [
      {expected: 'at 06:00 PM every day', parts: ['06:00 PM'],
        pattern: '0 18 * * *'},
      {expected: 'at 12:00 AM every day', parts: ['12:00 AM'],
        pattern: '0 0 * * *'},
      {
        expected: 'every hour from 09:00 AM through 05:00 PM every day',
        parts: ['09:00 AM', '05:00 PM'],
        pattern: '0 9-17 * * *'
      },
      {expected: 'at 08:00 AM, 12:00 PM, and 06:00 PM every day',
        parts: ['08:00 AM', '12:00 PM', '06:00 PM'],
        pattern: '0 8,12,18 * * *'}
    ]
  },
  {
    // The 24-hour clock always writes both digits and the minutes.
    options: {style: {hour12: false, minutes: true, padHour: false}},
    rows: [
      {expected: 'at 09:00 every day', parts: ['09:00'],
        pattern: '0 9 * * *'},
      {expected: 'at 18:00 every day', parts: ['18:00'],
        pattern: '0 18 * * *'}
    ]
  },
  {
    options: {style: {hour12: false, short: true}},
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
