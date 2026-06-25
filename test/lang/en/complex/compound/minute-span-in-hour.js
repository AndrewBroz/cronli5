import {run} from '../../../../runner.js';

// Behavior spec for a minute wildcard or plain range combined with a single
// specific hour. A WILDCARD minute is the whole hour, so it reads "every
// minute of the <hour> hour" — naming the hour itself, not a synthesized
// "from H:00 through H:59" range the source never stated. A plain minute
// RANGE is a real window inside the hour and keeps "from H:MM through H:MM".

describe('Minute span within a specific hour:', function() {
  describe('wildcard minute reads as the hour itself', function() {
    run([
      ['* 9 * * *', 'every minute of the 9 a.m. hour'],
      ['* 0 * * *', 'every minute of the midnight hour'],
      ['* 12 * * *', 'every minute of the noon hour'],
      ['* 17 * * *', 'every minute of the 5 p.m. hour']
    ]);
  });

  describe('minute range keeps the window', function() {
    run([
      ['0-29 9 * * *', 'every minute from 9 a.m. through 9:29 a.m.'],
      ['0-30 17 * * *', 'every minute from 5 p.m. through 5:30 p.m.']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['* 9 * * MON', 'every minute of the 9 a.m. hour on Monday']
    ]);
  });

  describe('24-hour option', function() {
    run([
      ['* 9 * * *', 'every minute of the 09:00 hour', {ampm: false}],
      ['0-29 9 * * *',
        'every minute from 09:00 through 09:29', {ampm: false}]
    ]);
  });
});
