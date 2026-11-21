// Hours that are runs and single hours (answers 4.1 E): one rhythm
// through each run where the minutes allow it, single hours once with
// what happens in each of them, and otherwise what happens in each hour
// with the first and last firing of every run.

import type {CadenceDescription} from '../../core/schedule.js';
import type {Member} from './forms.js';
import {isCadence, isRange, isValues} from './forms.js';
import lexicon from './lexicon.js';
import {list, phrase, runsOf} from './say.js';
import type {Clockwork, Item, Shaped} from './ticks.js';
import {
  at, between, firstSecond, lastSecond, minutesInside, moment, series,
  spans, stretch, tickFor, times
} from './ticks.js';
import {
  alone, eachTime, everyHour, everyUnit, minuteTier
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

// Hours said once, and what happens in each of them after «tiap kali»,
// the same for every kind of minutes. A rhythm of two minutes is named
// («tepat pada jam itu serta pada menit ke-30»), not said as a rhythm
// with its end.
function hourByHour(work: Clockwork, hours: string): Shaped {
  const {minutes} = work;
  const found = minutesInside(minutes.values.length > 2 ? work : {
    ...work,
    minutes: {...minutes, base: {kind: 'values', values: minutes.values}}
  }, eachTime);

  return {
    clause: true,
    // Under «tiap kali» a position left out needs no «setiap jam».
    closes: false,
    each: true,
    text: `${hours}, ${phrase(words.eachTime, found.text)}`,
    tick: found.tick
  };
}

// Single hours, each the start of what happens in it: «mulai pukul
// 01.00, 04.00, dan 09.00, tiap kali …».
function eachNamedHour(work: Clockwork): Shaped {
  return hourByHour(work, phrase(words.startingAt, times(
    work.hours.values.map(function sharp(hour) {
      return at(work, hour, 0);
    }))));
}

// The minutes of one hour, with clock times.
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

// Hours that are runs and rhythms together, on one minute: each a
// stretch with its own rhythm, from its first to its last firing.
function runsAndRhythms(work: Clockwork, parts: Member[]): Shaped {
  const tick = tickFor(work, {one: true});
  const [minute] = work.minutes.values;

  function time(hour: number): string {
    return at(work, hour, minute, firstSecond(tick));
  }

  return {
    text: series(parts.flatMap(function each(part): Item[] {
      const ends = {from: NaN, interval: 1, last: NaN, start: NaN, to: NaN,
        values: [], ...part};

      return isValues(part) ?
        part.values.map(function single(hour) {
          return moment(time(hour));
        }) :
        [stretch(everyUnit(units.hour, ends.interval),
          time([ends.from, ends.start].find(isFinite) as number),
          time([ends.to, ends.last].find(isFinite) as number))];
    })),
    tick
  };
}

// Whether several single hours are said once, with what happens in each:
// always where the minutes are more than one moment, except two
// stretches of one rhythm, four ends a reader holds.
function saidOnce(work: Clockwork, runs: Array<[number, number]>,
  lone: boolean, oneRhythm: boolean): boolean {
  return lone && runs.length > 1 && work.minutes.values.length > 1 &&
    !(runs.length === 2 && oneRhythm);
}

// Whether the minutes run through hours in a row as one unbroken rhythm:
// every minute, one minute, or a rhythm that tiles the hour.
function isSteady(work: Clockwork): boolean {
  const {base, tiling, values} = work.minutes;

  return base.kind === 'all' || values.length === 1 || Boolean(tiling);
}

// Hours that are runs and single hours.
function hoursNamed(work: Clockwork): Shaped {
  const {base, values} = work.minutes;
  const runs = hourRuns(work);
  const lone = runs.every(function single([from, to]) {
    return from === to;
  });
  const steady = isSteady(work);
  const oneStretch = isRange(base) || isCadence(base);
  const mixed = work.hours.base.kind === 'cadencePieces' &&
    values.length === 1 && work.hours.base.parts;
  const options: Array<Shaped | false> = [
    mixed && runsAndRhythms(work, mixed),
    saidOnce(work, runs, lone, steady || oneStretch) && eachNamedHour(work),
    (steady || lone && oneStretch) && stretches(work, runs),
    !lone && insideThenRuns(work, runs),
    hourAfterHour(work)
  ];

  return {closes: true, ...options.find(Boolean) as Shaped};
}

export {hourByHour, hoursNamed};
