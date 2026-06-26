import {run} from '../../../../runner.js';

// Behavior spec for a meaningful second under minute/hour shapes that anchor
// the description (a restricted hour, or a non-single minute). The second
// must not be silently dropped: it leads with its own clause and the rest of
// the pattern follows, e.g. "every 15 seconds, at 30 minutes past the hour
// from 9 a.m. through 5:30 p.m.". A wildcard or stepped second under a single
// pinned minute and specific hours instead reads the clock time compactly
// ("every 15 seconds of 9:30 a.m., every day"), and a pinned minute-0 takes a
// duration frame ("for one minute at 9 a.m.") so it is not heard as the hour.
// (A single second under discrete minutes and hours still folds into the
// clock time instead; see second-within-clock-time.js.)

describe('Seconds composed with the rest of the pattern:', function() {
  describe('second step', function() {
    run([
      ['*/15 30 9 * * *', 'every 15 seconds of 9:30 a.m., every day'],
      ['*/15 0,30 * * * *',
        'every 15 seconds, at 0 and 30 minutes past the hour'],
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
        'every second from 0 through 30 past the minute, ' +
        'every day at 9:30 a.m.']
    ]);
  });

  describe('wildcard second', function() {
    run([
      ['* 30 9 * * *', 'every second of 9:30 a.m., every day'],
      ['* 30 * * * *', 'every second, 30 minutes past the hour, every hour']
    ]);
  });

  // A wildcard second under a */2 minute step with a wildcard hour binds as
  // "every second of every other minute" — "every other" is the idiomatic
  // English for an interval of 2, and "of" joins the cadence and its
  // confinement without the ambiguity of a comma (which reads as two
  // independent cadences). Other step sizes keep the comma form ("every
  // second, every three minutes").
  describe('wildcard second under */2 minute step (of-binding)', function() {
    run([
      ['* */2 * * * *', 'every second of every other minute'],
      ['* */3 * * * *', 'every second, every three minutes'],
      ['* */15 * * * *', 'every second, every 15 minutes']
    ]);
  });

  // A sub-minute second with the minute pinned to 0 and a specific hour: the
  // minute-0 is a real one-minute confinement (60 fires in :00, not 3,600
  // across the hour). On the clock a pinned minute-0 reads aloud as the whole
  // hour ("9 a.m." == "9:00 a.m." spoken), so the confinement is stated
  // outright with a duration frame ("for one minute at 9 a.m.") and the hour
  // as its word, then the day qualifier trails.
  describe('minute pinned to 0 under a specific hour', function() {
    run([
      ['* 0 0 * * *', 'every second for one minute at midnight, every day'],
      ['* 0 9 * * *', 'every second for one minute at 9 a.m., every day'],
      ['* 0 12 * * *', 'every second for one minute at noon, every day'],
      ['* 0 9,11 * * *',
        'every second for one minute at 9 a.m. and 11 a.m., every day'],
      // An hour RANGE is a window, not a discrete hour list: confined to
      // minute 0 it reads "every hour from 9 a.m. through 5 p.m." — the same
      // window the bare 0 0 9-17 forms (see hour-range-cadence.js).
      ['* 0 9-17 * * *',
        'every second for one minute during the 9 a.m. through 5 p.m. hours'],
      // An hour STEP is a cadence, not a discrete hour list: confined to
      // minute 0 it reads "during every other hour" — the same confinement
      // idiom as "every minute during every other hour", kept distinct from
      // the bare hour-step form "every two hours" (see hour-step-cadence.js).
      // A short discrete hour list still enumerates.
      ['* 0 */2 * * *',
        'every second for one minute during every other hour'],
      ['* 0 9 * * MON',
        'every second for one minute at 9 a.m., every Monday'],
      ['*/15 0 9 * * *',
        'every 15 seconds for one minute at 9 a.m., every day']
    ]);
  });

  // A non-zero pinned minute is an unambiguous clock time: the compact "of
  // 9:05 a.m." form reads as the minute, never the hour, so it generalizes the
  // confinement without the duration frame the minute-0 case needs.
  describe('non-zero minute pinned under a specific hour', function() {
    run([
      ['* 5 0 * * *', 'every second of 12:05 a.m., every day'],
      ['* 5 9 * * *', 'every second of 9:05 a.m., every day'],
      ['* 5 9,11 * * *',
        'every second of 9:05 a.m. and 11:05 a.m., every day'],
      ['* 5 9 * * MON', 'every second of 9:05 a.m., every Monday']
    ]);
  });

  describe('single second under a non-single minute', function() {
    run([
      ['15 0,30 * * * *',
        'at 15 seconds past the minute, ' +
        'at 0 and 30 minutes past the hour'],
      ['15 0-30 * * * *',
        'at 15 seconds past the minute, ' +
        'every minute from 0 through 30 past the hour']
    ]);
  });

  // A single second under a multi-valued minute and a bounded hour step
  // composes the minute list with the hour cadence; the second leads with its
  // own clause exactly once (the compact clock-time rest owns that lead, so the
  // composer must not prepend it again, which once doubled it).
  describe('single second under a minute step and a bounded hour step',
    function() {
      run([
        ['30 */25 9-17/2 * * *',
          'at 30 seconds past the minute, ' +
          'at 0, 25, and 50 minutes past the hour, ' +
          'at 9 a.m., 11 a.m., 1 p.m., 3 p.m., and 5 p.m.']
      ]);
    });

  // A wildcard or stepped second under a MINUTE LIST across specific hours is a
  // wall of distinct clock times, not a one-minute confinement: each minute is
  // named ("9:25 a.m."), never collapsed to the bare hour (which once repeated
  // the hour once per minute, "9 a.m., 9 a.m., 9 a.m., ...").
  describe('sub-minute second under a minute list across specific hours',
    function() {
      run([
        ['* */25 9,17 * * *',
          'every second of 9:00 a.m., 9:25 a.m., 9:50 a.m., ' +
          '5:00 p.m., 5:25 p.m., and 5:50 p.m., every day'],
        ['*/15 */25 9,17 * * *',
          'every 15 seconds of 9:00 a.m., 9:25 a.m., 9:50 a.m., ' +
          '5:00 p.m., 5:25 p.m., and 5:50 p.m., every day']
      ]);
    });

  describe('with a day qualifier', function() {
    run([
      ['*/15 30 9 * * MON', 'every 15 seconds of 9:30 a.m., every Monday']
    ]);
  });

  // A wildcard minute under a restricted hour: the second leads and the hour
  // window follows, so the hour is never dropped (it once collapsed to a bare
  // "every second"). The wildcard-minute window reads "every minute ...".
  describe('wildcard minute under a restricted hour', function() {
    run([
      ['* * 9 * * *',
        'every second, every minute of the 9 a.m. hour'],
      ['* * 9 1 * *',
        'every second, every minute of the 9 a.m. hour ' +
        'on the 1st'],
      ['* * 9-17 * * *',
        'every second, every minute from 9 a.m. through 5:59 p.m.'],
      ['* * 9,17 * * *',
        'every second, every minute during the 9 a.m. and 5 p.m. hours'],
      ['* * */2 * * *', 'every second, every minute during every other hour'],
      ['5 * 9 * * *',
        'at five seconds past the minute, ' +
        'every minute of the 9 a.m. hour'],
      ['0-30 * 9 * * *',
        'every second from 0 through 30 past the minute, ' +
        'every minute of the 9 a.m. hour'],
      ['*/15 * 9-17 * * *',
        'every 15 seconds, every minute from 9 a.m. through 5:59 p.m.']
    ]);
  });
});
