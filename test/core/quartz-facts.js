import chai from 'chai';
import {analyze, prepare} from '../../src/core/index.js';

const {expect} = chai;

function day(pattern) {
  const opts = {quartz: false, seconds: false, years: false};

  return analyze(prepare(pattern, opts)).analyses.day;
}

// A Quartz day form is not a set of values, so it has no candidates. The
// core says which form it is and the numbers in it, so a renderer never
// has to read the pattern to find out.
describe('Quartz day facts:', function() {
  it('names each day-of-month form', function() {
    expect(day('0 0 L * *').date)
      .to.deep.equal({form: {kind: 'last'}, kind: 'quartz'});
    expect(day('0 0 LW * *').date.form).to.deep.equal({kind: 'lastWeekday'});
    expect(day('0 0 WL * *').date.form).to.deep.equal({kind: 'lastWeekday'});
    expect(day('0 0 L-3 * *').date.form)
      .to.deep.equal({days: 3, kind: 'beforeLast'});
    expect(day('0 0 15W * *').date.form)
      .to.deep.equal({day: 15, kind: 'nearestWeekday'});
    expect(day('0 0 W15 * *').date.form)
      .to.deep.equal({day: 15, kind: 'nearestWeekday'});
  });

  it('names each day-of-week form, with the weekday as a number', function() {
    expect(day('0 0 * * 5L').weekday)
      .to.deep.equal({form: {kind: 'last', weekday: 5}, kind: 'quartz'});
    expect(day('0 0 * * 1#2').weekday.form)
      .to.deep.equal({kind: 'nth', nth: 2, weekday: 1});
    expect(day('0 0 * * MON#2').weekday.form)
      .to.deep.equal({kind: 'nth', nth: 2, weekday: 1});
    expect(day('0 0 * * 7L').weekday.form)
      .to.deep.equal({kind: 'last', weekday: 0});
  });

  it('leaves plain day fields as they were', function() {
    expect(day('0 0 1 * 1').date).to.deep.equal({kind: 'values'});
    expect(day('0 0 1 * 1').weekday).to.deep.equal({kind: 'values'});
    expect(day('0 0 * * *').date).to.equal(null);
  });
});
