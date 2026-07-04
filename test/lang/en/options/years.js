import {run} from '../../../runner.js';

describe('Years option:', function() {
  var options = {years: true};

  run([
    ['0 0 12 1 1 * 2030', 'on January 1, 2030 at noon', options],
    ['0 12 1 1 * 2030', 'on January 1, 2030 at noon', options],
    ['0 0 12 25 12 * 2030', 'on December 25, 2030 at noon', options],
    ['0 0 1 6 * 2030', 'on June 1, 2030 at midnight', options],
    ['0 13 * * FRI 2030', 'every Friday at 1 p.m. in 2030', options],
    ['0 9 * * * 2030', 'every day at 9 a.m. in 2030', options],
    ['*/5 * * * * 2030', 'every five minutes in 2030', options],
    [
      '0 0 12 25 12 * 2030-2035',
      'on December 25 at noon in 2030 through 2035',
      options
    ],
    [
      '0 0 12 1 1 * 2030,2031,2032',
      'on January 1 at noon in 2030, 2031, and 2032',
      options
    ]
  ]);

  // The single-year fold belongs to the LEADING date phrase ("on January 1,
  // 2030 at noon"). A description whose date rides elsewhere — a trailing
  // qualifier under a confinement frame, a day-union condition — trails the
  // year as " in 2030" like every other year form; it is never spliced
  // mid-sentence ("during minute 30, 2030 at 9 a.m." was a live 0.9.0 bug)
  // and never dropped.
  describe('the year fold is exactly the leading date phrase', function() {
    run([
      ['* 0 9 13 * * 2030',
        'every second during minute 0 at 9 a.m. on the 13th in 2030',
        options],
      ['*/15 30 9 15W * * 2030',
        'every 15 seconds during minute 30 at 9 a.m. on the weekday ' +
        'nearest the 15th in 2030', options],
      ['0 0 13 6 5 2030',
        'in June, at midnight whenever the day is the 13th or a Friday ' +
        'in 2030', options]
    ]);
  });

  describe('year steps', function() {
    run([
      [
        '0 0 12 1 1 * */2',
        'on January 1 at noon, every other year',
        options
      ],
      [
        '0 0 12 1 1 * */5',
        'on January 1 at noon, every five years',
        options
      ],
      [
        '0 0 12 1 1 * */1',
        'on January 1 at noon, every year',
        options
      ],
      [
        '0 0 12 1 1 * 2030/2',
        'on January 1 at noon, every other year from 2030',
        options
      ],
      ['0 13 * * FRI */2', 'every Friday at 1 p.m., every other year', options],
      ['0 9 * * * */10', 'every day at 9 a.m., every ten years', options],
      ['*/5 * * * * */3', 'every five minutes, every three years', options]
    ]);
  });
});
