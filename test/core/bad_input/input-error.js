import chai from 'chai';
import cronli5, {Cronli5InputError} from '../../../src/cronli5.js';

const {expect} = chai;

// Every intentional input rejection throws the public `Cronli5InputError`,
// so callers (and the lenient path) can tell "your pattern is bad" apart
// from a genuine library defect.

describe('Input rejections are Cronli5InputError:', function() {
  // Pin the export itself: a missing named export arrives as `undefined`,
  // and chai's `.to.throw(undefined)` degrades to "throws anything", which
  // would make every assertion below vacuous.
  it('Cronli5InputError is exported as a constructor', function() {
    expect(Cronli5InputError).to.be.a('function');
  });

  const badInputs = [
    '',
    '   ',
    null,
    '* * * * * * * * * * *',
    '61 * * * *',
    '5-1/2 * * * *',
    '@huh',
    {},
    {minute: 'cat'},
    ['*', '*', 'hamburger', '*', '*'],
    42
  ];

  badInputs.forEach(function each(badInput) {
    it(JSON.stringify(badInput) + ' throws Cronli5InputError', function() {
      expect(cronli5.bind(null, badInput)).to.throw(Cronli5InputError);
    });
  });

  it('a Quartz `?` outside quartz mode throws Cronli5InputError', function() {
    expect(cronli5.bind(null, '0 12 ? * MON')).to.throw(Cronli5InputError);
  });

  it('an invalid Quartz weekday throws Cronli5InputError', function() {
    expect(cronli5.bind(null, '0 0 ? * 8', {quartz: true}))
      .to.throw(Cronli5InputError);
  });
});
