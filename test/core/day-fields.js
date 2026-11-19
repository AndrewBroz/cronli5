import chai from 'chai';
import {analyze, prepare, readingOf} from '../../src/core/index.js';

const {expect} = chai;

function schedule(pattern, options) {
  const opts = readingOf({...options});

  return analyze(prepare(pattern, opts));
}

function days(pattern, options) {
  const {pattern: fields} = schedule(pattern, options);

  return [fields.date, fields.weekday];
}

// Cron reads a day field as unrestricted only when it is written with a
// leading `*`. When neither is, the job runs when either matches, so a
// field that names every value (`1-31`, `0-6`) makes every day match.
describe('a day field that names every value without `*`:', function() {
  it('makes every day match when the other field is restricted too',
    function() {
      expect(days('0 9 1-31 * 1')).to.deep.equal(['*', '*']);
      expect(days('0 9 15 * 0-6')).to.deep.equal(['*', '*']);
      expect(days('0 9 15 * SUN-SAT')).to.deep.equal(['*', '*']);
      expect(days('0 9 15 * 1-7')).to.deep.equal(['*', '*']);
      expect(days('0 9 1-15,16-31 * 1')).to.deep.equal(['*', '*']);
      expect(days('0 9 1 * 0-3,4-6')).to.deep.equal(['*', '*']);
      expect(days('0 9 1/1 * 1')).to.deep.equal(['*', '*']);
      expect(days('0 9 L * 0-6')).to.deep.equal(['*', '*']);
      expect(days('0 9 1-31 * 5L')).to.deep.equal(['*', '*']);
      expect(days('0 9 1-31 * 0-6')).to.deep.equal(['*', '*']);
    });

  it('says so in every fact', function() {
    const {analyses, shapes} = schedule('0 9 1-31 * 1');

    expect(analyses.day).to.deep.equal({
      date: null,
      both: false,
      dateAddsNothing: false,
      nearestDayIsLast: null,
      union: false,
      weekday: null
    });
    expect(analyses.candidates.weekday).to.deep.equal([{kind: 'all'}]);
    expect(analyses.candidates.date).to.deep.equal([{kind: 'all'}]);
    expect(analyses.written.weekday).to.equal('all');
    expect(shapes.weekday).to.equal('wildcard');
    expect(schedule('0 9 1-31 * 1')).to.deep.equal(schedule('0 9 * * *'));
  });

  it('restricts nothing beside a field written with `*`', function() {
    expect(days('0 9 * * 0-6')).to.deep.equal(['*', '*']);
    expect(days('0 9 1-31 * *')).to.deep.equal(['*', '*']);
    expect(days('0 9 1-31 * ?', {cron: 'quartz'}))
      .to.deep.equal(['*', '*']);
  });

  it('leaves the other field alone when the full one starts with `*`',
    function() {
      expect(days('0 9 */1 * 1')).to.deep.equal(['*', '1']);
      expect(days('0 9 15 * */1')).to.deep.equal(['15', '*']);
      expect(days('0 9 ? * 2', {cron: 'quartz'})).to.deep.equal(['*', '1']);
    });

  it('reads an object pattern the same way', function() {
    const fields = schedule({date: '1-31', hour: 9, minute: 0, weekday: 1})
      .pattern;

    expect([fields.date, fields.weekday]).to.deep.equal(['*', '*']);
  });

  it('leaves other fields that name every value as they were', function() {
    expect(schedule('0-59 0-23 1 1-12 1').pattern).to.include(
      {date: '1', hour: '*', minute: '*', month: '*', weekday: '1'});
  });
});

// A day field written with a leading `*` that is not every day (`*/2`)
// counts as a star to cron: the job then runs only when both day fields
// match. Written without the star (`1-31/2`), the same days are a union.
describe('a day field that starts with `*` beside a restricted one:',
  function() {
    function both(pattern) {
      const {day} = schedule(pattern).analyses;

      return [day.both, day.union];
    }

    it('makes both fields have to match', function() {
      expect(both('0 0 */2 * 1')).to.deep.equal([true, false]);
      expect(both('0 0 15 * */2')).to.deep.equal([true, false]);
      expect(both('0 0 */2 * */2')).to.deep.equal([true, false]);
      expect(both('0 0 0 */5 6 1-5 2030')).to.deep.equal([true, false]);
    });

    it('leaves the same days a union when no star is written', function() {
      expect(both('0 0 1-31/2 * 1')).to.deep.equal([false, true]);
      expect(both('0 0 1,3,5 * 1')).to.deep.equal([false, true]);
      expect(both('0 0 15 * 0,2,4,6')).to.deep.equal([false, true]);
    });

    it('is neither when only one day field narrows the days', function() {
      expect(both('0 0 */2 * *')).to.deep.equal([false, false]);
      expect(both('0 0 * * 1')).to.deep.equal([false, false]);
      expect(both('0 0 */1 * 1')).to.deep.equal([false, false]);
      expect(both('0 0 */2 * 0-6')).to.deep.equal([false, false]);
    });

    it('keeps both arms and what each holds', function() {
      const {analyses} = schedule('0 0 */2 * 1');

      expect(analyses.day.date).to.deep.equal({kind: 'values'});
      expect(analyses.day.weekday).to.deep.equal({kind: 'values'});
      expect(analyses.day.dateAddsNothing).to.equal(false);
    });
  });
