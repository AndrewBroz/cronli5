import {run} from '../../../../runner.js';

// Behavior spec for a meaningful second under minute/hour shapes. A wildcard or
// stepped second is the LEADING CADENCE ("every second", "every 15 seconds"),
// and each coarser restricted field reads as a CONFINEMENT of that cadence, not
// a juxtaposed clause: "every second during minute :30 at 9 a.m.", "every
// second of every other hour". A redundant unrestricted finer field drops
// (a wildcard minute under "every second" is implied). A single, range, or list
// SECOND is a clock-point form instead ("at 30 seconds past the minute"), so it
// leads with its own clause and the rest of the pattern follows; a single
// second under discrete minutes and hours folds into the clock time (see
// second-within-clock-time.js).

describe('Seconds composed with the rest of the pattern:', function() {
  describe('second step', function() {
    run([
      ['*/15 30 9 * * *', 'every 15 seconds during minute :30 at 9 a.m.'],
      ['*/15 0,30 * * * *',
        'every 15 seconds during minutes :00 and :30 of every hour'],
      ['*/15 30 9-17 * * *',
        'every 15 seconds during minute :30 from 9 a.m. through 5 p.m.']
    ]);
  });

  // An OFFSET-form clean second step (`0/6`, `0/30`) is a clean cadence from
  // the top of the minute, identical in meaning to `*/6` / `*/30`, so it leads
  // the SAME confinement the wildcard / clean-step second does — "every six
  // seconds during minute :30 of every hour", never the juxtaposed "every six
  // seconds, 30 minutes past the hour, every hour". The seconds count is
  // whatever the cadence is.
  describe('offset-form second step leads the confinement', function() {
    run([
      ['0/6 30 * * * *',
        'every six seconds during minute :30 of every hour'],
      ['0/6 0,15,30 * * * *',
        'every six seconds during minutes :00, :15, and :30 of every hour'],
      ['0/6 4/6 * * * *',
        'every six seconds during every sixth minute ' +
        'from four minutes past the hour'],
      ['0/6 7,8,4/7 * * 5,8 *',
        'every six seconds during minutes :04, :07, :08, :11, :18, :25, ' +
        ':32, :39, :46, and :53 of every hour in May and August'],
      // The seconds count generalizes to whatever the cadence is.
      ['0/30 30 * * * *',
        'every 30 seconds during minute :30 of every hour'],
      ['0/30 4/6 * * * *',
        'every 30 seconds during every sixth minute ' +
        'from four minutes past the hour']
    ]);
  });

  describe('second list and range', function() {
    run([
      ['5,10 30 9 * * *',
        'at 5 and 10 seconds past the minute, every day at 9:30 a.m.'],
      ['0-30 30 9 * * *',
        'every second from 0 through 30 past the minute, ' +
        'every day at 9:30 a.m.']
    ]);
  });

  describe('wildcard second', function() {
    run([
      ['* 30 9 * * *', 'every second during minute :30 at 9 a.m.'],
      ['* 30 * * * *', 'every second during minute :30 of every hour'],
      // A minute range or short list confines as ":NN through :MM" / ":NN and
      // :MM"; the redundant wildcard hour reads "of every hour".
      ['* 0-30 * * * *',
        'every second during minutes :00 through :30 of every hour'],
      ['* 5,30 * * * *',
        'every second during minutes :05 and :30 of every hour']
    ]);
  });

  // A clean minute step under a seconds lead confines the cadence rather than
  // juxtaposing it behind a comma (which reads as two independent cadences).
  // The */2 step keeps the idiomatic "of every other minute"; every other clean
  // step reads as the ordinal "during every Nth minute".
  describe('clean minute step under a seconds lead (confinement)', function() {
    run([
      ['* */2 * * * *', 'every second of every other minute'],
      ['* */3 * * * *', 'every second during every third minute'],
      ['* */15 * * * *', 'every second during every fifteenth minute']
    ]);
  });

  // A STEPPED minute under a seconds lead is a CONFINEMENT of the cadence, not
  // a juxtaposed cadence (a comma there reads as two independent cadences) nor a
  // wall of enumerated minutes (":04, :10, …"): "during every Nth minute" + the
  // step's offset/bound. The cadence is ORDINAL ("every sixth minute"), since
  // the cardinal ("every six minutes") is the form that fuels the misread. The
  // offset-clean stride (`4/6` tiles 60) names only its start; the uneven one
  // (`2/7`) pins both endpoints ("from 2 through 58"), matching the seconds-less
  // cadence's bound behavior.
  describe('stepped minute under a seconds lead (confinement + cadence)',
    function() {
      run([
        ['* 4/6 * * * *',
          'every second during every sixth minute ' +
          'from four minutes past the hour'],
        ['* 2/7 * * * *',
          'every second during every seventh minute ' +
          'from 2 through 58 minutes past the hour'],
        // A clean step from the top of the hour names no offset.
        ['* */6 * * * *', 'every second during every sixth minute'],
        // A stepped second leads as its own cadence over the same confinement.
        ['*/15 4/6 * * * *',
          'every 15 seconds during every sixth minute ' +
          'from four minutes past the hour']
      ]);
    });

  // A pinned minute under a seconds lead is a CONFINEMENT of the cadence:
  // "during minute :NN", then the hour confinement. A single hour reads "at
  // <clock>" (the minute is already named, so the hour is a plain clock point);
  // an hour list reads "during the … hours"; an hour range reuses the
  // until-window; a clean hour step reads "of every other hour". The day
  // qualifier trails.
  describe('minute pinned under a specific hour', function() {
    run([
      ['* 0 0 * * *', 'every second during minute :00 at midnight'],
      ['* 0 9 * * *', 'every second during minute :00 at 9 a.m.'],
      ['* 0 12 * * *', 'every second during minute :00 at noon'],
      ['* 0 9,11 * * *',
        'every second during minute :00 during the 9 a.m. and 11 a.m. hours'],
      ['* 0 9-17 * * *',
        'every second during minute :00 from 9 a.m. through 5 p.m.'],
      ['* 0 */2 * * *',
        'every second during minute :00 of every other hour'],
      ['* 0 9 * * MON',
        'every second during minute :00 at 9 a.m. on Mondays'],
      ['*/15 0 9 * * *',
        'every 15 seconds during minute :00 at 9 a.m.'],
      // A non-zero pinned minute reads the same way, with its own ":NN".
      ['* 5 0 * * *', 'every second during minute :05 at midnight'],
      ['* 5 9 * * *', 'every second during minute :05 at 9 a.m.'],
      ['* 5 9,11 * * *',
        'every second during minute :05 during the 9 a.m. and 11 a.m. hours'],
      ['* 5 9 * * MON', 'every second during minute :05 at 9 a.m. on Mondays']
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
          'at 0, 25, and 50 minutes, ' +
          'every two hours from 9 a.m. through 5 p.m.']
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
      ['*/15 30 9 * * MON',
        'every 15 seconds during minute :30 at 9 a.m. on Mondays']
    ]);
  });

  // A wildcard minute under a restricted hour and a seconds-cadence lead drops:
  // "every second" already spans every minute, so the redundant minute is not
  // stated, and the hour reads as the confinement ("of the 9 a.m. hour", "from
  // 9 a.m. until 6 p.m."). A single, range, or list SECOND is a clock-point
  // lead instead, so it keeps its own clause and the wildcard-minute window
  // follows ("every minute of the 9 a.m. hour").
  describe('wildcard minute under a restricted hour', function() {
    run([
      ['* * 9 * * *', 'every second of the 9 a.m. hour'],
      ['* * 9 1 * *', 'every second of the 9 a.m. hour on the 1st'],
      ['* * 9-17 * * *', 'every second from 9 a.m. until 6 p.m.'],
      ['* * 9,17 * * *',
        'every second during the 9 a.m. and 5 p.m. hours'],
      ['* * */2 * * *', 'every second of every other hour'],
      ['5 * 9 * * *',
        'at five seconds past the minute, ' +
        'every minute of the 9 a.m. hour'],
      ['0-30 * 9 * * *',
        'every second from 0 through 30 past the minute, ' +
        'every minute of the 9 a.m. hour'],
      ['*/15 * 9-17 * * *',
        'every 15 seconds from 9 a.m. until 6 p.m.']
    ]);
  });
});
