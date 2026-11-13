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
