var run = require('../runner').run;

describe('Years option:', function() {
  var options = {years: true};

  run([
    ['0 0 12 1 1 * 2030', 'on January 1st, 2030 at 12:00 PM', options],
    ['0 12 1 1 * 2030', 'on January 1st, 2030 at 12:00 PM', options],
    ['0 0 12 25 12 * 2030', 'on December 25th, 2030 at 12:00 PM', options],
    ['0 0 1 6 * 2030', 'on June 1st, 2030 at 12:00 AM', options],
    ['0 13 * * FRI 2030', 'every Friday at 1:00 PM in 2030', options],
    ['0 9 * * * 2030', 'every day at 9:00 AM in 2030', options],
    ['*/5 * * * * 2030', 'every five minutes in 2030', options],
    [
      '0 0 12 25 12 * 2030-2035',
      'on December 25th at 12:00 PM in 2030-2035',
      options
    ],
    [
      '0 0 12 1 1 * 2030,2031,2032',
      'on January 1st at 12:00 PM in 2030, 2031 and 2032',
      options
    ]
  ]);

  describe('year steps', function() {
    run([
      [
        '0 0 12 1 1 * */2',
        'on January 1st at 12:00 PM every two years',
        options
      ],
      [
        '0 0 12 1 1 * */5',
        'on January 1st at 12:00 PM every five years',
        options
      ],
      [
        '0 0 12 1 1 * */1',
        'on January 1st at 12:00 PM every year',
        options
      ],
      [
        '0 0 12 1 1 * 2030/2',
        'on January 1st at 12:00 PM every two years from 2030',
        options
      ],
      ['0 13 * * FRI */2', 'every Friday at 1:00 PM every two years', options],
      ['0 9 * * * */10', 'every day at 9:00 AM every ten years', options],
      ['*/5 * * * * */3', 'every five minutes every three years', options]
    ]);
  });
});
