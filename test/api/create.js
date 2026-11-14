import chai from 'chai';
import cronli5, {Cronli5OptionError, create} from '../../src/cronli5.js';
import en from '../../src/lang/en/index.js';

const {expect} = chai;

// A second language to choose between: English under another code, with
// no regions and a sentence of its own.
const xx = {
  ...en,
  code: 'xx',
  regions: {},
  sentence(description) {
    return `XX ${description}`;
  }
};

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

describe('create:', function() {
  it('the default export knows English only', function() {
    expect(cronli5('0 9 * * *', {lang: 'en'})).to.equal('at 9 a.m. every day');
    throwsOption(function unknown() {
      cronli5('0 9 * * *', {lang: 'xx'});
    }, /xx/u);
  });

  it('an instance resolves codes among the languages it was given',
    function() {
      const describeIt = create({languages: [en, xx]});

      expect(describeIt('0 9 * * *', {form: 'sentence', lang: 'xx'}))
        .to.equal('XX at 9 a.m. every day');
      expect(describeIt('0 9 * * *', {form: 'sentence', lang: 'en'}))
        .to.equal('Runs at 9 a.m. every day.');
    });

  it('its first language is the default', function() {
    expect(create({languages: [xx, en]})('0 9 * * *', {form: 'sentence'}))
      .to.equal('XX at 9 a.m. every day');
  });

  it('carries default options, which a call overrides', function() {
    const labels = create({languages: [en], options: {form: 'label'}});

    expect(labels('0 9 * * *')).to.equal('At 9 a.m. every day');
    expect(labels('0 9 * * *', {form: 'fragment'}))
      .to.equal('at 9 a.m. every day');
  });

  it('carries a default style for each language', function() {
    const describeIt = create({
      languages: [en, xx],
      styles: {en: {hour12: false}}
    });

    expect(describeIt('30 17 * * *')).to.equal('at 17:30 every day');
    expect(describeIt('30 17 * * *', {style: {hour12: true}}))
      .to.equal('at 5:30 p.m. every day');
    expect(describeIt('30 17 * * *', {lang: 'en-GB'}))
      .to.equal('at 17.30 every day');
    expect(describeIt('30 17 * * *', {lang: 'xx'}))
      .to.equal('at 5:30 p.m. every day');
  });

  it('accepts a module it was not created with', function() {
    expect(create({languages: [en]})('0 9 * * *', {form: 'sentence', lang: xx}))
      .to.equal('XX at 9 a.m. every day');
  });

  it('rejects a setup it cannot honour, when created', function() {
    throwsOption(function build() {
      create({languages: []});
    }, /languages/u);
    throwsOption(function build() {
      create({languages: [en], styles: {en: {nope: 1}}});
    }, /nope/u);
    throwsOption(function build() {
      create({languages: [en], styles: {uk: {hour12: false}}});
    }, /uk/u);
    throwsOption(function build() {
      create({languages: [en], styles: {en: 'gb'}});
    }, /styles\.en/u);
    throwsOption(function build() {
      create({languages: [en], options: {dialect: 'gb'}});
    }, /en-GB/u);
    throwsOption(function build() {
      create({languages: [en], options: {style: {hour12: false}}});
    }, /styles/u);
    throwsOption(function build() {
      create({languages: [en, en]});
    }, /en/u);
    throwsOption(function build() {
      create({languages: [en], colour: 1});
    }, /colour/u);
  });

  it('has no state shared between instances', function() {
    create({languages: [en, xx], options: {form: 'label'}});

    expect(cronli5('0 9 * * *')).to.equal('at 9 a.m. every day');
  });
});
