import chai from 'chai';
import {analyze, prepare} from '../../src/core/index.js';

const {expect} = chai;

// Behavior spec for the semantic IR (docs/i18n-design.md §2.2). `analyze`
// classifies field shapes, precomputes the analyses renderers need, and
// selects a description plan (the `plan`). The plan is descriptive —
// numbers, enumerations, windows — never phrasing.

function ir(pattern, opts) {
  return analyze(prepare(pattern, opts || {seconds: false, years: false}));
}

describe('Core analyze:', function() {
  describe('shapes', function() {
    it('classifies canonical field shapes', function() {
      const {shapes} = ir('*/15 0-30 9,17 L 6 MON');

      expect(shapes.second).to.equal('step');
      expect(shapes.minute).to.equal('range');
      expect(shapes.hour).to.equal('list');
      expect(shapes.date).to.equal('quartz');
      expect(shapes.month).to.equal('single');
      expect(shapes.weekday).to.equal('single');
      expect(shapes.year).to.equal('wildcard');
    });
  });

  describe('segments', function() {
    it('classifies list segments; a step arm in a list reads as its fires',
      function() {
        const {analyses} = ir('0 0 * 1,6/3 MON-FRI');

        // Normalization expands the `6/3` arm: a step is a cadence only when
        // it is the whole field, so in a list its fires join the singles.
        expect(analyses.segments.month).to.deep.equal([
          {kind: 'single', value: '1'},
          {kind: 'single', value: '6'},
          {kind: 'single', value: '9'},
          {kind: 'single', value: '12'}
        ]);
        expect(analyses.segments.weekday).to.deep.equal([
          {bounds: ['1', '5'], kind: 'range'}
        ]);
      });

    it('keeps a whole-field step as a step segment', function() {
      const {analyses} = ir('0 0 * 6/3 *');

      expect(analyses.segments.month).to.deep.equal([
        {fires: [6, 9, 12], interval: 3, kind: 'step', startToken: '6'}
      ]);
    });

    it('canonicalizes name tokens to their numbers in every position',
      function() {
        const {analyses, pattern} = ir('0 0 * JAN,MAR-MAY SUN');

        expect(pattern.month).to.equal('1,3-5');
        expect(pattern.weekday).to.equal('0');
        expect(analyses.segments.month).to.deep.equal([
          {kind: 'single', value: '1'},
          {bounds: ['3', '5'], kind: 'range'}
        ]);
        expect(analyses.segments.weekday).to.deep.equal([
          {kind: 'single', value: '0'}
        ]);
      });

    it('folds the Sunday alias 7 to 0', function() {
      expect(ir('0 0 * * 7').pattern.weekday).to.equal('0');
    });

    it('a name and its number analyze to a deep-equal IR', function() {
      expect(ir('0 0 * * MON')).to.deep.equal(ir('0 0 * * 1'));
      expect(ir('0 0 * * SUN')).to.deep.equal(ir('0 0 * * 7'));
      expect(ir('0 0 * JAN *')).to.deep.equal(ir('0 0 * 1 *'));
      expect(ir('0 0 * * MON-FRI')).to.deep.equal(ir('0 0 * * 1-5'));
    });

    it('leaves wildcard and Quartz fields unsegmented', function() {
      const {analyses} = ir('0 0 L * *');

      expect(analyses.segments.date).to.equal(null);
      expect(analyses.segments.month).to.equal(null);
    });
  });

  describe('day facts', function() {
    it('classifies the DOM-or-DOW union and both arms', function() {
      const {analyses} = ir('0 0 2/3 * 5');

      expect(analyses.day).to.deep.equal({
        date: {interval: 3, kind: 'cadenceStep', parity: null, start: 2},
        union: true,
        weekday: {kind: 'segments'}
      });
    });

    it('classifies parity steps: */2 and 1/2 odd, 2/2 even, 3/2 none',
      function() {
        expect(ir('0 0 */2 * *').analyses.day.date.parity).to.equal('odd');
        expect(ir('0 0 1/2 * *').analyses.day.date.parity).to.equal('odd');
        expect(ir('0 0 2/2 * *').analyses.day.date.parity).to.equal('even');
        expect(ir('0 0 3/2 * *').analyses.day.date.parity).to.equal(null);
      });

    it('classifies Quartz arms and wildcards', function() {
      const {analyses} = ir('0 0 L * 5L');

      expect(analyses.day).to.deep.equal({
        date: {kind: 'quartz'},
        union: true,
        weekday: {kind: 'quartz'}
      });
      expect(ir('0 0 * * *').analyses.day).to.deep.equal({
        date: null,
        union: false,
        weekday: null
      });
    });

    it('classifies plain and bounded-step dates as segments', function() {
      expect(ir('0 0 1,15 * *').analyses.day.date)
        .to.deep.equal({kind: 'segments'});
      // A bounded step (5-20/3) is a windowed set, not an open cadence.
      expect(ir('0 0 5-20/3 * *').analyses.day.date)
        .to.deep.equal({kind: 'segments'});
    });
  });

  describe('hour stride', function() {
    it('reads a step segment as a stride with its offset-clean flag',
      function() {
        expect(ir('0 0 */2 * * *', {seconds: true}).analyses.hourStride)
          .to.deep.equal(
            {interval: 2, last: 22, offsetClean: true, start: 0});
        // 24 % 5 !== 0: an uneven stride pins endpoints.
        expect(ir('0 0 */5 * * *', {seconds: true}).analyses.hourStride)
          .to.deep.equal(
            {interval: 5, last: 20, offsetClean: false, start: 0});
      });

    it('recovers a stride from an arithmetic hour list', function() {
      expect(ir('0 0,7,14,21 * * *').analyses.hourStride).to.deep.equal(
        {interval: 7, last: 21, offsetClean: false, start: 0});
    });

    it('is null for irregular, range, and wildcard hours', function() {
      expect(ir('0 9,17 * * *').analyses.hourStride).to.equal(null);
      expect(ir('0 9-17 * * *').analyses.hourStride).to.equal(null);
      expect(ir('0 * * * *').analyses.hourStride).to.equal(null);
    });
  });

  describe('plans: seconds', function() {
    it('standalone second shapes lead on their own', function() {
      expect(ir('*/15 * * * * *', {seconds: true}).plan.kind)
        .to.equal('standaloneSeconds');
    });

    it('a wildcard second over a wildcard minute is everySecond', function() {
      expect(ir('* * * * * *', {seconds: true}).plan.kind)
        .to.equal('everySecond');
    });

    it('a meaningful second under an anchor composes', function() {
      const plan = ir('*/15 30 9 * * *', {seconds: true}).plan;

      expect(plan.kind).to.equal('composeSeconds');
      expect(plan.rest.kind).to.equal('clockTimes');
    });

    it('a foldable single second reaches the clock times', function() {
      const plan = ir('15 30 9 * * *', {seconds: true}).plan;

      expect(plan.kind).to.equal('clockTimes');
      expect(plan.times).to.deep.equal([{hour: 9, minute: 30, second: 15}]);
    });
  });

  describe('plans: minutes and hours', function() {
    it('selects plans mirroring the interpreter chain', function() {
      expect(ir('*/15 9-17 * * *').plan).to.deep.equal({
        hours: {from: 9, kind: 'window', last: 45, to: 17},
        kind: 'minuteFrequency'
      });
      expect(ir('* 9 * * *').plan).to.deep.equal(
        {hour: 9, kind: 'minuteSpanInHour', span: [0, 59]});
      expect(ir('0-30 9,17 * * *').plan).to.deep.equal({
        form: 'range',
        kind: 'minutesAcrossHours',
        times: {fires: [9, 17], kind: 'fires'}
      });
      expect(ir('0-30 */2 * * *').plan).to.deep.equal(
        {form: 'range', kind: 'minuteSpanAcrossHourStep'});
      expect(ir('0-29 * * * *').plan.kind).to.equal('rangeOfMinutes');
      expect(ir('0,30 * * * *').plan.kind).to.equal('multipleMinutes');
      expect(ir('* * * * *').plan.kind).to.equal('everyMinute');
      expect(ir('30 * * * *').plan.kind).to.equal('singleMinute');
      expect(ir('0 * * * *').plan.kind).to.equal('everyHour');
      expect(ir('30 9-17 * * *').plan).to.deep.equal(
        {boundMinute: 30, from: 9, kind: 'hourRange', last: 30,
          minuteForm: 'lead', to: 17});
      expect(ir('0 */6 * * *').plan.kind).to.equal('hourStep');
    });

    it('enumerates clock times up to the cap', function() {
      const plan = ir('0,30 9 * * *').plan;

      expect(plan.kind).to.equal('clockTimes');
      expect(plan.times.map(function flat(t) {
        return [t.hour, t.minute];
      })).to.deep.equal([[9, 0], [9, 30]]);
    });

    it('compacts past the cap', function() {
      expect(ir('30 9-20,22 * * *').plan).to.deep.equal(
        {fold: true, kind: 'compactClockTimes', minute: 30});
      expect(ir('0,30 8-18/2 * * *').plan).to.deep.equal(
        {fold: false, kind: 'compactClockTimes', minute: 0});
    });

    it('caps hour-window enumerations into segment rendering', function() {
      expect(ir('0-30 9-20,22 * * *').plan.times).to.deep.equal(
        {kind: 'segments'});
    });
  });

  describe('analyses', function() {
    it('carries windows, spans, and folded seconds', function() {
      const {analyses} = ir('15 30 9 * * *', {seconds: true});

      expect(analyses.clockSecond).to.equal(15);

      const stepIr = ir('*/15 9-17 * * *');

      expect(stepIr.analyses.lastMinuteFire).to.equal(45);
      expect(stepIr.analyses.minuteSpan).to.equal(null);
      expect(ir('0-30 9 * * *').analyses.minuteSpan).to.deep.equal([0, 30]);
    });
  });
});
