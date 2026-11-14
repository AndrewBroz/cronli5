import chai from 'chai';
import {compare, costOf} from '../../tooling/scripts/reading/cost.mjs';

const {expect} = chai;

function held(code, text) {
  const cost = costOf(code, text);

  return [cost.objects, cost.operations];
}

// The examples that define the model (CLAUDE.md, "The cost of a sentence
// to its reader"): a compound counts its parts, habit costs nothing, and
// work not read off directly is taxed.
describe('the cost model:', function() {
  it('holds a rhythm on the hour as one object', function() {
    expect(held('en', 'every 15 minutes')).to.deep.equal([1, []]);
  });

  it('holds a rhythm with a phase and two ends as four, and taxes it',
    function() {
      expect(held('en', 'every 15 minutes from 9:05 a.m. through 5:50 p.m.'))
        .to.deep.equal([4, ['offset']]);
      expect(held('en', 'every 2 minutes from 3 through 59 minutes past ' +
        'the hour')).to.deep.equal([4, ['offset']]);
    });

  it('calls a step that does not divide its unit a defect when said bare',
    function() {
      expect(costOf('en', 'every 7 minutes').defects)
        .to.deep.equal(['uneven step said bare']);
      expect(costOf('en', 'every 7 minutes from 0 through 56 minutes past ' +
        'the hour').defects).to.deep.equal([]);
      expect(costOf('de', 'stündlich von :00 bis :56 alle 7 Minuten').defects)
        .to.deep.equal([]);
      expect(costOf('en', 'at midnight every 3 days from the 1st of the ' +
        'month').defects).to.deep.equal(['uneven step said bare']);
    });

  it('holds a list of four times as four, untaxed', function() {
    expect(held('en', 'at 5, 20, 35, and 50 minutes past the hour'))
      .to.deep.equal([4, []]);
  });

  it('taxes a series left to inference, unless its rule is said',
    function() {
      expect(held('de', 'täglich von 2:05 bis 2:50, von 7:05 bis 7:50 … und ' +
        'von 22:05 bis 22:50 Uhr')[1]).to.include('inferred series');
      expect(held('de', 'in den ungeraden Stunden (1:00–1:45, 3:00–3:45 … ' +
        '23:00–23:45 Uhr) alle 15 Minuten')[1]).to.not.include(
        'inferred series');
    });

  it('taxes two lists read one inside the other', function() {
    expect(held('en', 'at 5 and 35 minutes past 9 a.m. and 5 p.m.')[1])
      .to.include('product');
    expect(held('de', 'täglich um 2, 8, 14 und 20 Uhr, jeweils um :05 und ' +
      ':35')[1]).to.include('product');
  });

  it('holds names as objects, and a value said again once, counting the ' +
    'repetition as a cost of its own', function() {
    const repeated = costOf('en', 'on January 1, April 1, July 1, and ' +
      'October 1');
    const once = costOf('en', 'on the 1st of January, April, July, and ' +
      'October');

    expect([repeated.objects, repeated.repetitions]).to.deep.equal([5, 3]);
    expect([once.objects, once.repetitions]).to.deep.equal([5, 0]);
    expect(compare(once, repeated)).to.equal('cheaper');
  });

  it('taxes working out the nearest weekday', function() {
    expect(held('en', 'on the weekday nearest the 15th')[1])
      .to.include('nearest weekday');
  });

  it('never ranks across columns: a choice they disagree on is mixed',
    function() {
      const four = costOf('en', 'at 5, 20, 35, and 50 minutes past the hour');
      const six = costOf('en', 'at 5, 15, 25, 35, 45, and 55 minutes past ' +
        'the hour');
      const rhythm = costOf('en', 'every 15 minutes from 5 through 50 ' +
        'minutes past the hour');
      const longer = costOf('en', 'every 10 minutes from 5 through 55 ' +
        'minutes past the hour');

      expect(compare(four, rhythm)).to.equal('cheaper');
      expect(compare(six, longer)).to.equal('mixed');
      expect(compare(costOf('en', 'every 15 minutes'), rhythm))
        .to.equal('cheaper');
      expect(Object.keys(six)).to.not.include('total');
    });

  it('does not hold what a bracket illustrates', function() {
    expect(held('de', 'an den ungeraden Tagen jedes Monats (1., 3., 5. … ' +
      '31.)')[0]).to.equal(1);
  });
});
