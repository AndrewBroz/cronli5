import chai from 'chai';
import {analyze, prepare} from '../../src/core/index.js';

const {expect} = chai;

// Behavior spec for the semantic IR (docs/i18n-design.md §2.2). `analyze`
// classifies field shapes and attaches the neutral facts a renderer needs.
// The facts are descriptive — numbers, sets, forms — never phrasing.

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

  describe('canonical fields', function() {
    it('a step arm in a list reads as its fires', function() {
      // Normalization expands the `6/3` arm: a step is a cadence only when
      // it is the whole field, so in a list its fires join the singles.
      const {pattern} = ir('0 0 * 1,6/3 MON-FRI');

      expect(pattern.month).to.equal('1,6,9,12');
      expect(pattern.weekday).to.equal('1-5');
    });

    it('keeps a whole-field step as a step', function() {
      const {pattern, shapes} = ir('0 0 * 6/3 *');

      expect(pattern.month).to.equal('6/3');
      expect(shapes.month).to.equal('step');
    });

    it('canonicalizes name tokens to their numbers in every position',
      function() {
        const {pattern} = ir('0 0 * JAN,MAR-MAY SUN');

        expect(pattern.month).to.equal('1,3-5');
        expect(pattern.weekday).to.equal('0');
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
  });

  describe('day facts', function() {
    it('classifies the DOM-or-DOW union and both arms', function() {
      const {analyses} = ir('0 0 2/3 * 5');

      expect(analyses.day).to.deep.equal({
        date: {kind: 'values'},
        union: true,
        weekday: {kind: 'values'}
      });
    });

    it('classifies Quartz arms and wildcards', function() {
      const {analyses} = ir('0 0 L * 5L');

      expect(analyses.day).to.deep.equal({
        date: {form: {kind: 'last'}, kind: 'quartz'},
        union: true,
        weekday: {form: {kind: 'last', weekday: 5}, kind: 'quartz'}
      });
      expect(ir('0 0 * * *').analyses.day).to.deep.equal({
        date: null,
        union: false,
        weekday: null
      });
    });

    it('classifies list and step dates as plain values', function() {
      expect(ir('0 0 1,15 * *').analyses.day.date)
        .to.deep.equal({kind: 'values'});
      expect(ir('0 0 5-20/3 * *').analyses.day.date)
        .to.deep.equal({kind: 'values'});
    });
  });

  describe('analyses', function() {
    it('carries a single non-zero second for a clock time', function() {
      expect(ir('15 30 9 * * *', {seconds: true}).analyses.clockSecond)
        .to.equal(15);
      expect(ir('0 30 9 * * *', {seconds: true}).analyses.clockSecond)
        .to.be.an('undefined');
      expect(ir('*/15 30 9 * * *', {seconds: true}).analyses.clockSecond)
        .to.be.an('undefined');
    });

    it('says which description each field was written as', function() {
      expect(ir('0 */12 * * *').analyses.written.hour).to.equal('cadence');
      expect(ir('0 0,12 * * *').analyses.written.hour).to.equal('values');
      expect(ir('0 9 * * *').analyses.written.hour).to.equal('values');
      expect(ir('0 9-17 * * *').analyses.written.hour).to.equal('range');
      expect(ir('0 9-12,15 * * *').analyses.written.hour).to.equal('pieces');
      expect(ir('0 * * * *').analyses.written.hour).to.equal('all');
      expect(ir('0 0 L * *').analyses.written.date).to.equal(null);
    });

    it('differs between equal schedules only in what was written',
      function() {
        const step = ir('0 */12 * * *').analyses;
        const list = ir('0 0,12 * * *').analyses;

        expect(step.candidates).to.deep.equal(list.candidates);
        expect(step.written).to.not.deep.equal(list.written);
      });
  });
});
