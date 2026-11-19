// The seconds, added to the time the minutes and hours make (answers
// 4.2): shown on every clock time, said in place of «co minutę», or
// confined to each minute after «za każdym razem».

import {asFew} from './forms.js';
import {every, listed, units, upTo, words} from './text.js';
import type {Gap} from './within.js';
import {butNot, eachMinute, except, momentsLacking, theMinute, within}
  from './within.js';
import {inEach} from './spans.js';
import type {Grain, Said, TimeFacts} from './time.js';
import {minutesAndHours, shapes} from './time.js';

type Maybe<T> = T | false | null | undefined;

const listedAtMost = 4;
const clockTimesAtMost = 3;

// Second 0 everywhere: nothing is shown.
function plain(t: TimeFacts): Grain {
  return {
    each: every(1, units.minute, t.short),
    endTail: '',
    first: null,
    gap: except,
    last: null,
    moment: null
  };
}

// One second, shown on every clock time.
function showing(t: TimeFacts): Grain {
  const [second] = t.second.values;

  return {...plain(t), first: second, last: second, moment: second};
}

// Seconds that fill the minute: their rhythm in place of «co minutę»,
// every end closing on the first or last second that fires.
function finer(t: TimeFacts, gap: Gap): Grain {
  const {second} = t;

  return {
    each: every(second.interval, units.second, t.short),
    endTail: ` ${words.and} ${upTo(second.to, units.second, t.short)}`,
    first: second.from,
    gap,
    last: second.to,
    moment: null
  };
}

function onTheMinute(t: TimeFacts, zero: Said): Maybe<Said> {
  return t.second.kind === 'one' && t.second.values[0] === 0 && zero;
}

// Every minute of every hour: the seconds' own form in the open minute.
function openMinute(t: TimeFacts, zero: Said): Maybe<Said> {
  return t.minute.kind === 'all' && t.hour.kind === 'all' &&
    {...zero, text: within(t.second, eachMinute(t.short))};
}

// One second: every clock time shows it, where the time is clock times
// only.
function oneSecond(t: TimeFacts): Maybe<Said> {
  const shown = t.second.kind === 'one' && minutesAndHours(t, showing(t));

  return shown && shown.real && shown;
}

// Up to four moments are listed, the seconds of each clock time in turn.
function listedSeconds(t: TimeFacts, zero: Said): Maybe<Said> {
  const count = zero.times.length * t.second.values.length;

  return count > 0 && count <= listedAtMost &&
    {...zero, text: `${words.at} ${listed(zero.times.flatMap(
      function seconds([hour, minute]) {
        return t.second.values.map(function clock(second) {
          return t.clock(hour, minute, second);
        });
      }))}`};
}

// A stretch or a rhythm of seconds in each of up to three clock times.
function secondStretches(t: TimeFacts, zero: Said): Maybe<Said> {
  const {second} = t;
  const applies = zero.times.length > 0 &&
    zero.times.length <= clockTimesAtMost &&
    second.values.length > listedAtMost && second.kind !== 'list';

  return applies && {...zero, ...inEach(second, zero.times.map(
    function dial([hour, minute]) {
      return {
        clock(value: number) {
          return t.clock(hour, minute, value);
        },
        each: every(1, units.second, t.short),
        short: t.short,
        unit: units.second
      };
    }), eachMinute(t.short))};
}

// Seconds that fill the minute, where the time says «co minutę» between
// named ends: the seconds' rhythm takes its place.
function inPlaceOfMinutes(t: TimeFacts, zero: Said): Maybe<Said> {
  const fills = t.second.steady || t.second.unbroken && zero.real;
  const fine = fills && zero.spans &&
    minutesAndHours(t, finer(t, except));

  return fine && {...fine, text: `${fine.text}` +
    `${momentsLacking(t.second.removed, eachMinute(t.short))}`};
}

// A rhythm of seconds in every minute but one or two: the missing minute
// is a minute that lasts.
function butMinutes(t: TimeFacts): Maybe<Said> {
  const rhythm = t.second.kind === 'all' || t.second.kind === 'tiling';

  return rhythm && t.minute.kind === 'allBut' &&
    shapes[asFew(t.hour).kind] !== 'rhythm' &&
    minutesAndHours(t, finer(t, butNot));
}

// Anything else: the time, and the seconds inside each of its minutes.
function eachTime(t: TimeFacts, zero: Said): Said {
  return {...zero, text: `${zero.text}, ${words.eachTime} ` +
    `${within(asFew(t.second), theMinute(t.short))}`};
}

const ways: Array<(t: TimeFacts, zero: Said) => Maybe<Said>> = [
  onTheMinute, openMinute, oneSecond, listedSeconds, secondStretches,
  inPlaceOfMinutes, butMinutes, eachTime
];

/** The whole time of day: hours, minutes and seconds. */
function timeOf(t: TimeFacts): Said {
  const zero = minutesAndHours(t, plain(t));

  return ways.reduce<Maybe<Said>>(function first(found, way) {
    return found || way(t, zero);
  }, null) as Said;
}

export {timeOf};
