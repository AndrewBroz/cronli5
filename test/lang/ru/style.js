import chai from 'chai';
import {Cronli5OptionError} from '../../../src/core/index.js';
import russian, {styles} from '../../../src/lang/ru/index.js';

const {expect} = chai;

const DEFAULT =
  {hour12: false, padHour: false, separator: ':', short: false};

function throwsOption(build, pattern) {
  expect(build).to.throw(Cronli5OptionError, pattern);
}

// What the Russian module declares to the entry point: its code, its one
// named style, and how it presents a description in each form.
describe('Russian styles:', function() {
  it('declares its code, no regions and its one named table', function() {
    expect(russian.code).to.equal('ru');
    expect(russian.defaultStyle).to.equal('ru');
    expect(russian.regions).to.deep.equal({});
    expect(russian.styles).to.equal(styles);
    expect(styles.ru).to.deep.equal(DEFAULT);
    expect(Object.keys(styles)).to.deep.equal(['ru']);
    expect(Object.isFrozen(styles)).to.equal(true);
    expect(Object.isFrozen(styles.ru)).to.equal(true);
  });

  it('applies overrides to the named table', function() {
    expect(russian.style('ru')).to.deep.equal(styles.ru);
    expect(russian.style('ru', {padHour: true, short: true}))
      .to.deep.equal({...DEFAULT, padHour: true, short: true});
    expect(russian.style('ru', {separator: '.'}))
      .to.deep.equal({...DEFAULT, separator: '.'});
  });

  it('rejects a field it does not have, naming the fields', function() {
    throwsOption(function build() {
      russian.style('ru', {workday: 'рабочий день'});
    }, /workday.*hour12/su);
  });

  it('rejects a value of the wrong kind', function() {
    throwsOption(function build() {
      russian.style('ru', {short: 'да'});
    }, /short/u);
    throwsOption(function build() {
      russian.style('ru', {separator: ','});
    }, /separator/u);
    throwsOption(function build() {
      russian.style('ru', {padHour: 2});
    }, /padHour/u);
  });

  it('capitalises a label, wraps a sentence, and has its fixed texts',
    function() {
      const opts = {style: styles.ru};

      expect(russian.label('ежедневно в 9:00', opts))
        .to.equal('Ежедневно в 9:00');
      expect(russian.label('1-го числа каждого месяца в 0:00', opts))
        .to.equal('1-го числа каждого месяца в 0:00');
      expect(russian.sentence('ежедневно в 9:00', opts))
        .to.equal('Выполняется ежедневно в 9:00.');
      expect(russian.sentence('никогда: в июне нет 31-го числа', opts))
        .to.equal('Не выполняется никогда: в июне нет 31-го числа.');
      expect(russian.label('никогда: в июне нет 31-го числа', opts))
        .to.equal('Никогда: в июне нет 31-го числа');
      expect(russian.reboot(opts)).to.equal('при запуске системы');
      expect(russian.fallback(opts))
        .to.equal('нераспознанное выражение cron');
    });
});
