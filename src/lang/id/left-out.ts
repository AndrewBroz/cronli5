// What is left out of a time, said after «kecuali» (answers 3.9): moments
// as clock times, a stretch as a stretch, and a position in every hour
// as a position.

import lexicon from './lexicon.js';
import {list, phrase, runsOf} from './say.js';
import type {Clockwork, Tick} from './ticks.js';
import {
  at, between, firstSecond, lastSecond, moments, perMinute, times
} from './ticks.js';
import {everyHour, leftOutAt, minuteTier} from './within.js';

const {ordinal, units, words} = lexicon;

// Whole minutes left out under seconds, as lengths from a point: «selama
// 1 menit mulai menit ke-29».
function wholeMinutes(removed: number[], closes: boolean): string {
  const later = removed.filter(Boolean);

  return phrase([
    later.length < removed.length &&
      phrase(words.during, units.minute, words.first),
    later.length > 0 && phrase(words.during, '1', units.minute,
      words.startingAt, units.minute, list(later.map(ordinal)))
  ].filter(Boolean).join(` ${words.aswell} `), closes && everyHour);
}

/**
 * The minutes left out, after «kecuali»: one or two moments as clock
 * times; in a single hour, the stretch they make; over several hours, a
 * position in every hour.
 */
function minutesLeftOut(work: Clockwork, tick: Tick, closes: boolean):
  string[] {
  const {removed} = work.minutes;
  const hours = work.hours.values;
  const count = removed.length * hours.length * perMinute(tick);
  const options = [
    removed.length === 0 && [],
    count <= 2 && [times(hours.flatMap(function eachHour(hour) {
      return removed.flatMap(function eachMinute(minute) {
        return moments(work, tick, hour, minute);
      });
    }))],
    hours.length === 1 && [list(runsOf(removed).map(function gap([from, to]) {
      return between(at(work, hours[0], from, firstSecond(tick)),
        at(work, hours[0], to, lastSecond(tick)));
    }))],
    tick.seconds.length > 1 && work.seconds.base.kind === 'all' &&
      [wholeMinutes(removed, closes)],
    [leftOutAt(removed, minuteTier, closes)]
  ];

  return options.find(Boolean) as string[];
}

/**
 * The hours left out, after «kecuali»: one or two moments as clock times,
 * more as the stretch from the first to the last of them.
 */
function hoursLeftOut(work: Clockwork, tick: Tick): string[] {
  const {removed} = work.hours;
  const minutes = work.minutes.values;
  const count = removed.length * minutes.length * perMinute(tick);
  const options = [
    removed.length === 0 && [],
    count <= 2 && [times(removed.flatMap(function eachHour(hour) {
      return minutes.flatMap(function eachMinute(minute) {
        return moments(work, tick, hour, minute);
      });
    }))],
    [list(runsOf(removed).map(function gap([from, to]) {
      return between(at(work, from, minutes[0], firstSecond(tick)),
        at(work, to, minutes[minutes.length - 1], lastSecond(tick)));
    }))]
  ];

  return options.find(Boolean) as string[];
}

export {hoursLeftOut, minutesLeftOut};
