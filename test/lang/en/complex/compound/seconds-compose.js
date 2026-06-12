import {run} from '../../../../runner.js';

// Behavior spec for a meaningful second under minute/hour shapes that anchor
// the description (a restricted hour, or a non-single minute). The second
// must not be silently dropped: it leads with its own clause and the rest of
// the pattern follows, e.g. "every 15 seconds, every day at 9:30 a.m.".
// (A single second under discrete minutes and hours still folds into the
// clock time instead; see second-within-clock-time.js.)

describe('Seconds composed with the rest of the pattern:', function() {
  describe('second step', function() {
    run([
      ['*/15 30 9 * * *', 'every 15 seconds, every day at 9:30 a.m.'],
      ['*/15 0,30 * * * *',
        'every 15 seconds, at zero and 30 minutes past the hour'],
      ['*/15 30 9-17 * * *',
        'every 15 seconds, at 30 minutes past the hour ' +
        'from 9 a.m. through 5:30 p.m.']
    ]);
  });

  describe('second list and range', function() {
    run([
      ['5,10 30 9 * * *',
        'at five and ten seconds past the minute, every day at 9:30 a.m.'],
      ['0-30 30 9 * * *',
        'every second from zero through 30 past the minute, ' +
        'every day at 9:30 a.m.']
    ]);
  });

  describe('wildcard second', function() {
    run([
      ['* 30 9 * * *', 'every second, every day at 9:30 a.m.'],
      ['* 30 * * * *', 'every second, 30 minutes past the hour, every hour']
    ]);
  });

  describe('single second under a non-single minute', function() {
    run([
      ['15 0,30 * * * *',
        'at 15 seconds past the minute, ' +
        'at zero and 30 minutes past the hour'],
      ['15 0-30 * * * *',
        'at 15 seconds past the minute, ' +
        'every minute from zero through 30 past the hour']
    ]);
  });

  describe('with a day qualifier', function() {
    run([
      ['*/15 30 9 * * MON', 'every 15 seconds, every Monday at 9:30 a.m.']
    ]);
  });
});
