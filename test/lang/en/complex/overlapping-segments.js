import {run} from '../../../runner.js';

// Behavior spec for overlapping list segments. When two arms of a comma list
// cover intersecting values ("1-5,3", "2/4,18-20" — hour 18 in both arms),
// stating both reads as a contradiction or a duplicate ("Monday through
// Friday and Wednesday"). Intersecting arms merge into their coverage union
// before rendering; arms that do not intersect keep their own form, even
// when adjacent.

describe('Overlapping list segments merge into their union:', function() {
  describe('the same value covered by two arms drops the duplicate',
    function() {
      run([
        // Hour 18 is both a step fire (2,6,10,14,18,22) and the range start.
        ['* 2/4,18-20 * * *',
          'every minute during the 2 a.m., 6 a.m., 10 a.m., 2 p.m., ' +
          '6 p.m. through 8 p.m., and 10 p.m. hours'],
        ['0 12 * * 1-5,3', 'every Monday through Friday at noon'],
        ['0 0 1-10,5 * *', 'on the 1st through 10th at midnight'],
        ['0 0 1 1-3,2 *', 'on the 1st in January through March at midnight'],
        // The merged pattern reads exactly like its duplicate-free
        // equivalent ('5-10 * * * *').
        ['5-10,7 * * * *', 'every minute from 5 through 10 past the hour'],
        ['5-10,7 * * * * *', 'every second from 5 through 10 past the minute']
      ]);
    });

  describe('arms that overlap merge into one larger unit', function() {
    run([
      // Weekday step 1/2 fires Mon, Wed, Fri; with Tue-Thu the union is the
      // whole working week.
      ['0 12 * * 1/2,2-4', 'every Monday through Friday at noon']
    ]);
  });

  describe('disjoint arms keep their own form, even adjacent', function() {
    run([
      ['0 12 * * 1-3,5', 'every Monday through Wednesday and Friday at noon'],
      ['0 12 * * 1-3,4', 'every Monday through Wednesday and Thursday at noon'],
      ['0 9,17-19 * * *', 'every day at 9 a.m., 5 p.m., 6 p.m., and 7 p.m.'],
      // A step arm beside a DISJOINT range arm survives the merge intact:
      // the step keeps its per-hour windows/fires, the range its window.
      ['* 1/4,18-20 * * *',
        'every minute during the 1 a.m., 5 a.m., 9 a.m., 1 p.m., 5 p.m., ' +
        '9 p.m., and 6 p.m. through 8 p.m. hours'],
      ['5,30 1/4,18-20 * * *',
        'at 5 and 30 minutes past the hour, at 1 a.m., at 5 a.m., ' +
        'at 9 a.m., at 1 p.m., at 5 p.m., at 9 p.m., and at 6 p.m. ' +
        'through 8 p.m.'],
      ['0 0 1/4,18-20 * * *',
        'every hour from 6 p.m. through 8 p.m. and at 1 a.m., 5 a.m., ' +
        '9 a.m., 1 p.m., 5 p.m., and 9 p.m.']
    ]);
  });
});
