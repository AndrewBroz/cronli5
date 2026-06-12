import chai from 'chai';
import cronli5 from '../../../../src/cronli5.js';

const {expect} = chai;

describe('Option isolation:', function() {
  it('does not leak options between calls', function() {
    expect(cronli5('0 9 * * MON', {short: true}))
      .to.equal('every Mon at 9 a.m.');

    // A subsequent default call must not inherit `short` from the prior call.
    expect(cronli5('0 9 * * MON')).to.equal('every Monday at 9 a.m.');
  });

  it('applies independent options on interleaved calls', function() {
    const ampm = cronli5('0 15 * * *');
    const military = cronli5('0 15 * * *', {ampm: false});

    expect(ampm).to.equal('every day at 3 p.m.');
    expect(military).to.equal('every day at 15:00');
  });
});
