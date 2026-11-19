// A set of hours, minutes or seconds said in clock times: a rate word and
// the first and last firing of each stretch, clock times for values that
// stand alone, and «кроме» before a firing left out.

import lexicon from './lexicon.js';
import type {Unit} from './lexicon.js';
import type {Clock, Piece} from './names.js';
import {
  amount, between, clausal, joined, list, spaced
} from './names.js';
import type {Described, Part} from './sets.js';

const {units, words} = lexicon;

/**
 * The time part before its seconds are settled: a rate word or a label,
 * what follows it, and a clause set off by a comma. The clock times are
 * written last, once it is known whether they carry seconds.
 */
export interface Time {
  // What takes the place of «каждую минуту» when the seconds are said
  // across a leading stretch of every hour: «в первые 30 минут каждого
  // часа».
  asStretch: string;
  // Whether no clock time is named.
  bare: boolean;
  clause(clock: Clock): string;
  // Whether a comma stands between the lead and what follows it.
  comma: boolean;
  // Empty when the part begins with a clock time.
  lead: string;
  // What the lead is: «каждую минуту»; a bare rhythm of minutes or of
  // hours; minutes named inside the hour; or anything else, which is
  // made of clock times.
  mode: 'clocks' | 'everyMinute' | 'hours' | 'label' | 'minutes';
  tail(clock: Clock): string;
  // Whether the only clock times named start or end a stretch.
  windows: boolean;
}

/** Which place of a sentence a clock time stands in. */
export type Place = keyof Clock;

/** The unit a set of clock times steps through. */
export interface Level {
  first: number;
  last: number;
  rate: string;
  stamp(value: number, place: Place, clock: Clock): string;
  unit: Unit;
}

/** A set in clock times: its rate word and the rest. */
export interface Span {
  clause(clock: Clock): string;
  lead: string;
  list: boolean;
  tail(clock: Clock): string;
  windows: boolean;
}

function nothing(): string {
  return '';
}

// A rate word and the first and last firing of one stretch.
function stretchOf(lead: string, ends: number[], level: Level): Span {
  return {
    clause: nothing,
    lead,
    list: false,
    tail(clock) {
      return between(level.stamp(ends[0], 'from', clock),
        level.stamp(ends[1], 'to', clock));
    },
    windows: true
  };
}

const spans: {[kind: string]: (description: never, level: Level) => Span} = {
  all(description: Described, level: Level) {
    return stretchOf(level.rate, [level.first, level.last], level);
  },
  cadence(description: Extract<Described, {kind: 'cadence'}>, level: Level) {
    return stretchOf(
      spaced(words.every, amount(description.interval, level.unit)),
      [description.start, description.last], level);
  },
  cadencePieces(description: Extract<Described, {kind: 'pieces'}>,
    level: Level) {
    return spans.pieces(description as never, level);
  },
  except(description: Extract<Described, {kind: 'except'}>, level: Level) {
    const base = spanOf(description.base, level);

    return {
      ...base,
      clause(clock) {
        return spaced(words.except, list(description.removed.map(
          function left(value) {
            return level.stamp(value, 'but', clock);
          }
        )));
      },
      windows: false
    };
  },
  pieces(description: Extract<Described, {kind: 'pieces'}>, level: Level) {
    const parts = (description.parts as Part[]).map(function say(part) {
      return spanOf(part, level);
    });

    return {
      clause: nothing,
      lead: parts[0].lead,
      list: true,
      tail(clock) {
        return joined(parts.map(function shared(part, at): Piece {
          const again = at === 0 || parts[at - 1].lead === part.lead;

          return {
            list: part.list,
            text: again ? part.tail(clock) : spaced(part.lead, part.tail(clock))
          };
        }));
      },
      windows: parts.every(function isWindow(part) {
        return part.windows;
      })
    };
  },
  range(description: Extract<Described, {kind: 'range'}>, level: Level) {
    return stretchOf(level.rate, [description.from, description.to], level);
  },
  values(description: Extract<Described, {kind: 'values'}>, level: Level) {
    return {
      clause: nothing,
      lead: '',
      list: description.values.length > 1,
      tail(clock) {
        return spaced(words.in, list(description.values.map(
          function named(value) {
            return level.stamp(value, 'at', clock);
          }
        )));
      },
      windows: false
    };
  }
};

/** A set of one unit's values in clock times. */
function spanOf(description: Described, level: Level): Span {
  return spans[description.kind](description as never, level);
}

/** The hours beside one minute. */
function hoursAt(minute: number): Level {
  return {
    first: 0,
    last: 23,
    rate: words.everyHour,
    stamp(value, place, clock) {
      return clock[place](value, minute);
    },
    unit: units.hour
  };
}

/** The minutes of one hour. */
function minutesIn(hour: number): Level {
  return {
    first: 0,
    last: 59,
    rate: words.everyMinute,
    stamp(value, place, clock) {
      return clock[place](hour, value);
    },
    unit: units.minute
  };
}

/** The seconds of one clock minute. */
function secondsIn(hour: number, minute: number): Level {
  return {
    first: 0,
    last: 59,
    rate: words.everySecond,
    stamp(value, place, clock) {
      return clock[place](hour, minute, value);
    },
    unit: units.second
  };
}

/** A time part with nothing after its lead, to build others from. */
function timeOf(lead: string, mode: Time['mode']): Time {
  return {
    asStretch: '',
    bare: true,
    clause: nothing,
    comma: false,
    lead,
    mode,
    tail: nothing,
    windows: true
  };
}

/** A span as a time part made of clock times. */
function spanTime(span: Span): Time {
  return {
    ...timeOf(span.lead,
      span.lead === words.everyMinute ? 'everyMinute' : 'clocks'),
    bare: false,
    clause: span.clause,
    tail: span.tail,
    windows: span.windows
  };
}

/** A time part as text, in the clock times given. */
function timeText(time: Time, clock: Clock): string {
  const tail = time.tail(clock);

  return clausal(
    time.comma ? clausal(time.lead, tail) : spaced(time.lead, tail),
    time.clause(clock));
}

export {
  hoursAt, minutesIn, nothing, secondsIn, spanOf, spanTime, timeOf, timeText
};
