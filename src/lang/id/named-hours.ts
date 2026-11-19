// Hours that are runs and single hours (answers 4.1 E): one rhythm
// through each run where the minutes allow it, and otherwise what happens
// in each hour with the first and last firing of every run.

import type {CadenceDescription} from '../../core/schedule.js';
import {isCadence, isRange, isValues} from './forms.js';
import lexicon from './lexicon.js';
import {list, phrase, runsOf} from './say.js';
import type {Clockwork, Item, Shaped} from './ticks.js';
import {
  at, between, firstSecond, lastSecond, minutesInside, moment, series,
  spans, stretch, tickFor, times
} from './ticks.js';
import {
  alone, everyHour, everyUnit, minuteTier, points
} from './within.js';

const {units, words} = lexicon;

// The runs of hours, each by its first and last hour.
function hourRuns(work: Clockwork): Array<[number, number]> {
  const {base, values} = work.hours;

  return isRange(base) ? [[base.from, base.to]] : runsOf(values);
}

// One rhythm through each run of hours, from its first to its last
// firing: «setiap 15 menit dari pukul 09.00 sampai 17.45 dan dari pukul
// 22.00 sampai 22.45». A single minute in a single hour is a bare time.
function stretches(work: Clockwork, runs: Array<[number, number]>): Shaped {
  const {base, tiling, values} = work.minutes;
  const single = values.length === 1;
  const beat = [tiling, base].find(function steps(form) {
    return form && isCadence(form);
  }) as CadenceDescription | undefined;
  const tick = tickFor(work, {fine: !single && !beat, one: true});
  const word = single && everyHour ||
    beat && everyUnit(units.minute, beat.interval) || tick.one;

  return {
    text: series(runs.map(function each([from, to]): Item {
      return single && from === to ?
        moment(at(work, from, values[0], firstSecond(tick))) :
        stretch(word, at(work, from, values[0], firstSecond(tick)),
          at(work, to, values[values.length - 1], lastSecond(tick)));
    })),
    tick
  };
}

// What happens in every hour, and then each run of hours from its first
// to its last firing.
function insideThenRuns(work: Clockwork, runs: Array<[number, number]>):
  Shaped {
  const found = minutesInside(work, alone);
  const {values} = work.minutes;

  return {
    text: `${found.text}, ${list(runs.map(function each([from, to]) {
      return between(at(work, from, values[0], firstSecond(found.tick)),
        at(work, to, values[values.length - 1], lastSecond(found.tick)));
    }))}`,
    tick: found.tick
  };
}

// Positions counted after the hours named: «pada menit ke-5 dan ke-20
// setelah pukul 08.00 dan 12.00».
function afterTheHours(work: Clockwork): Shaped {
  const {values} = work.minutes;
  const named = times(work.hours.values.map(function sharp(hour) {
    return at(work, hour, 0);
  }));
  const later = points(values.filter(Boolean), minuteTier, '');

  return {
    text: values[0] === 0 ?
      phrase(named, words.aswell, later, words.afterThem) :
      phrase(later, words.afterTime, named),
    tick: tickFor(work, {})
  };
}

// The minutes of each hour named, hour after hour, with clock times.
function hourAfterHour(work: Clockwork): Shaped {
  const tick = tickFor(work, {one: true});

  return {
    text: series(work.hours.values.flatMap(function eachHour(hour) {
      return spans(work.minutes.base, minuteTier, tick.one,
        function time(minute, last) {
          return at(work, hour, minute,
            last ? lastSecond(tick) : firstSecond(tick));
        });
    })),
    tick
  };
}

// Hours that are runs and single hours.
function hoursNamed(work: Clockwork): Shaped {
  const {base, tiling, values} = work.minutes;
  const runs = hourRuns(work);
  const lone = runs.every(function single([from, to]) {
    return from === to;
  });
  const steady = base.kind === 'all' || values.length === 1 ||
    Boolean(tiling);
  const oneStretch = isRange(base) || isCadence(base);
  const options: Array<Shaped | false> = [
    (steady || lone && oneStretch) && stretches(work, runs),
    !lone && insideThenRuns(work, runs),
    isValues(base) && afterTheHours(work),
    hourAfterHour(work)
  ];

  return {...options.find(Boolean) as Shaped, closes: true};
}

export {hoursNamed};
