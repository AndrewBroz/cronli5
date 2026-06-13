import {run} from '../../../runner.js';

// Behavior spec for the `dialect` option. The default, `'us'`, follows the
// Chicago Manual of Style: serial commas, "through" ranges, "9 a.m." times
// (lowercase, periods, no :00 on the hour), cardinal month-day dates
// ("January 1"), and "noon"/"midnight". `'uk'` follows the Guardian style
// guide: no serial comma, "to" ranges, "9am"/"5.30pm" times (closed up,
// full-point separator), day-first cardinal dates ("1 January"), and
// "midday"/"midnight".

describe('Dialect option:', function() {
  describe('us (default): Chicago style', function() {
    run([
      ['0 9,12,17 * * *', 'every day at 9 a.m., noon, and 5 p.m.'],
      ['30 9 * * MON-FRI', 'every Monday through Friday at 9:30 a.m.'],
      ['0 0 * * *', 'every day at midnight'],
      ['0 12 1 1 *', 'on January 1 at noon'],
      ['0 12 1,15 6 *', 'on June 1 and 15 at noon'],
      ['0 0 12 25 12 * 2030', 'on December 25, 2030 at noon'],
      ['15 30 9 * * *', 'every day at 9:30:15 a.m.'],
      ['15 0 9 * * *', 'every day at 9:00:15 a.m.'],
      ['*/15 9-17 * * *', 'every 15 minutes from 9 a.m. through 5:45 p.m.'],
      ['0 9 * * 1,3,5', 'every Monday, Wednesday, and Friday at 9 a.m.'],
      ['0 0 1-15 * *', 'on the 1st through 15th at midnight'],
      ['0 17 * * *', 'every day at 17:00', {ampm: false}]
    ]);
  });

  describe('house: legacy cronli5 voice on a Chicago base', function() {
    var house = {dialect: 'house'};

    run([
      ['0 9,12,17 * * *', 'every day at 9 AM, noon, and 5 PM', house],
      ['30 9 * * MON-FRI', 'every Monday - Friday at 9:30 AM', house],
      ['0 12 1 1 *', 'on January 1st at noon', house],
      ['0 12 1,15 6 *', 'on June 1st and 15th at noon', house],
      ['0 0 * * *', 'every day at midnight', house],
      ['*/15 9-17 * * *', 'every 15 minutes from 9 AM - 5:45 PM', house],
      ['0 0 12 25 12 * 2030', 'on December 25th, 2030 at noon', house],
      ['15 30 9 * * *', 'every day at 9:30:15 AM', house],
      ['0 2 * * 1-5', 'every Mon-Fri at 2 AM', {dialect: 'house', short: true}]
    ]);
  });

  describe('custom dialects merge over the US defaults', function() {
    run([
      // A single overridden connective inherits everything else from
      // Chicago style.
      ['*/15 9-17 * * *',
        'every 15 minutes from 9 a.m. until 5:45 p.m.',
        {dialect: {through: ' until '}}],
      ['0 9,12,17 * * *', 'every day at 9am, noon and 5pm',
        {dialect: {am: 'am', closeUp: true, pm: 'pm', serialComma: false}}],
      ['0 12 1 1 *', 'on 1 January at 12 o\'clock',
        {dialect: {dayFirst: true, midday: '12 o\'clock'}}],
      ['0 12 1 1 *', 'on 1st January at noon',
        {dialect: {dayFirst: true, ordinals: true}}],
      ['0 17 * * *', 'every day at 17h00',
        {ampm: false, dialect: {sep: 'h'}}]
    ]);
  });

  describe('uk: Guardian style', function() {
    var uk = {dialect: 'uk'};

    run([
      ['0 9,12,17 * * *', 'every day at 9am, midday and 5pm', uk],
      ['30 9 * * MON-FRI', 'every Monday to Friday at 9.30am', uk],
      ['0 0 * * *', 'every day at midnight', uk],
      ['0 12 1 1 *', 'on 1 January at midday', uk],
      ['0 12 1,15 6 *', 'on 1 and 15 June at midday', uk],
      ['0 0 12 25 12 * 2030', 'on 25 December 2030 at midday', uk],
      ['15 30 9 * * *', 'every day at 9.30.15am', uk],
      ['*/15 9-17 * * *', 'every 15 minutes from 9am to 5.45pm', uk],
      ['0-29 * * * *', 'every minute from 0 to 29 past the hour', uk],
      ['0 0 1-15 * *', 'on the 1st to 15th at midnight', uk],
      ['0 22-2 * * *', 'every hour from 10pm to 2am', uk],
      ['0 17 * * *', 'every day at 17.00', {ampm: false, dialect: 'uk'}],
      ['0 2 * * 1-5', 'every Mon-Fri at 2am', {dialect: 'uk', short: true}]
    ]);
  });
});
