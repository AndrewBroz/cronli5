import chai from 'chai';
import {analyze, prepare, shortestSpoken} from '../../src/core/index.js';

const {expect} = chai;

function candidates(pattern, options) {
  const opts = {quartz: false, seconds: false, years: false, ...options};

  return analyze(prepare(pattern, opts)).analyses.candidates;
}

// Every field carries its candidate descriptions on the neutral facts, so
// a renderer chooses among them instead of re-deriving the set from the
// field's text.
describe('analyses.candidates:', function() {
  it('is identical for semantically equal fields', function() {
    const wild = candidates('* 9 * * *').minute;

    expect(wild).to.deep.equal([{kind: 'all'}]);
    expect(candidates('*/1 9 * * *').minute).to.deep.equal(wild);
    expect(candidates('0-59 9 * * *').minute).to.deep.equal(wild);
  });

  it('treats Sunday as 0 or 7 and names as numbers', function() {
    expect(candidates('0 0 * * 7').weekday)
      .to.deep.equal(candidates('0 0 * * 0').weekday);
    expect(candidates('0 0 * JAN MON').month)
      .to.deep.equal(candidates('0 0 * 1 1').month);
    expect(candidates('0 0 * * MON-FRI').weekday).to.deep.include(
      {from: 1, kind: 'range', to: 5});
  });

  it('describes a stepped field by the values it fires on', function() {
    expect(candidates('*/15 * * * *').minute).to.deep.include(
      {interval: 15, kind: 'cadence', last: 45, start: 0});
    expect(candidates('0 22-2 * * *').hour).to.deep.include(
      {from: 22, kind: 'range', to: 2});
  });

  it('is null for a Quartz field', function() {
    const found = candidates('0 0 15W * ?', {quartz: true});

    expect(found.date).to.equal(null);
    expect(found.minute).to.deep.equal([{kind: 'values', values: [0]}]);
  });

  it('does not enumerate the year domain', function() {
    const found = candidates('0 0 0 1 1 * *', {seconds: true, years: true});

    expect(found.year).to.deep.equal([{kind: 'all'}]);
  });

  it('describes a restricted year field', function() {
    const found = candidates('0 0 0 1 1 * 2030-2035',
      {seconds: true, years: true});

    expect(found.year).to.deep.include({from: 2030, kind: 'range', to: 2035});
  });
});

describe('shortestSpoken:', function() {
  it('picks the smallest length and the earliest on a tie', function() {
    const phrases = [
      {length: 5, text: 'a'}, {length: 3, text: 'b'}, {length: 3, text: 'c'}
    ];

    expect(shortestSpoken(phrases).text).to.equal('b');
  });

  it('throws on an empty list', function() {
    expect(function run() {
      shortestSpoken([]);
    }).to.throw();
  });
});
