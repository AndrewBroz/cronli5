// The time of day is said of one unit inside the hour: the minutes, or the
// seconds when every minute fires. A voice is how that is worded: plainly,
// with one second carried by every clock time, with seconds running
// through the minutes, or with the seconds said in front of the minutes.

import type {Cadence, Exception, Form, Part, Run} from './sets.js';
import type {Moment, Speech} from './words.js';
import {every, list, phrase, sayPieces} from './words.js';
import lexicon from './lexicon.js';

const {words} = lexicon;

// The first and last minute of an hour, and second of a minute.
const FIRST = 0;
const LAST = 59;

/** The words of the unit said inside the hour or the minute. */
interface UnitWords {
  at: string[];
  from: string;
  key: 'minute' | 'second';
  ofEach: string;
  restart: string;
}

const MINUTE: UnitWords = {
  at: [words.atMinute, words.atMinutes],
  from: words.fromMinute,
  key: 'minute',
  ofEach: words.ofEachHour,
  restart: words.restartingEachHour
};

const SECOND: UnitWords = {
  at: [words.atSecond, words.atSeconds],
  from: words.fromSecond,
  key: 'second',
  ofEach: words.ofEachMinute,
  restart: words.restartingEachMinute
};

/** How the unit inside the hour is worded. */
interface Voice {
  // A rate said with no window after it.
  alone(rate: string, single: boolean): string;
  // The rate of one unit, before a window.
  each: string;
  // The first and last moment a value of the unit fires in an hour.
  first(hour: number, value: number): Moment;
  // What stands between the phrase and hours named as numbers.
  kept: string;
  last(hour: number, value: number): Moment;
  // Values of the unit named one by one: «ai minuti 5, 20 e 45».
  listed(values: number[]): string;
  // The word for the unit's first value of every hour, when it has one.
  onTheHour: string;
  // One time that is left out.
  out(hour: number, value: number): string;
  // The seconds shown on the ends of whole hours left out.
  outEdges: Array<number | undefined>;
  // How many times one value of the unit fires in an hour.
  per: number;
  // One time that fires.
  point(hour: number, value: number): string;
  // Whether the phrase has a range of its own even as a list.
  ranged: boolean;
  // What follows a cadence when a single second is said after it.
  tail: string;
  unit: UnitWords;
  // Values of the unit left out of every hour.
  unitOut(values: number[]): string;
  // Whether a run of the unit in one hour is one unbroken stretch.
  windows: boolean;
  // The unit described inside the hour, with no hours after it.
  within(form: Form): string;
}

// «al minuto 5», «ai minuti 5, 20 e 45».
function named(unit: UnitWords, values: number[]): string {
  return `${unit.at[Number(values.length > 1)]} ${list(values.map(String))}`;
}

// «dal minuto 0 al 29»: the unit is said once.
function spanIn(unit: UnitWords, from: number, to: number): string {
  return `${unit.from} ${from} ${words.to} ${to}`;
}

// The minutes a second, or seconds, run during or belong to.
function minutesAfter(pair: string[], minutes: number[]): string {
  return `${pair[Number(minutes.length > 1)]} ${list(minutes.map(String))}`;
}

function during(minutes: number[]): string {
  return minutesAfter([words.duringMinute, words.duringMinutes], minutes);
}

// The unit inside the hour: a list, a run after the rate of one, a
// cadence with both ends, or pieces of those.
function withinOf(
  unit: UnitWords,
  say: {eachIn: string; listed(values: number[]): string}
): (form: Form) => string {
  function cadence(found: Cadence): string {
    return `${every(found.interval, unit.key)} ` +
      spanIn(unit, found.start, found.last);
  }

  function within(form: Form): string {
    const sayers = {
      all() {
        return say.eachIn;
      },
      cadence(found: Form) {
        return cadence(found as Cadence);
      },
      except(exception: Form) {
        return within((exception as Exception).base);
      },
      // Beside a cadence, which cannot carry what the rate of one unit
      // carries, a run is said with the plain rate.
      pieces(pieces: Form) {
        const {parts} = pieces as {parts: Part[]};
        const rate = parts.some(function isCadence(part) {
          return part.kind === 'cadence';
        }) ? every(1, unit.key) : say.eachIn;

        return sayPieces(parts, {
          cadence,
          run(run, first) {
            return phrase(first && rate, spanIn(unit, run.from, run.to));
          },
          strays: [words.once, words.then],
          values(values) {
            return [named(unit, values)];
          }
        });
      },
      range(run: Form) {
        const {from, to} = run as Run;

        return phrase(say.eachIn, spanIn(unit, from, to));
      },
      values(found: Form) {
        return say.listed((found as {values: number[]}).values);
      }
    };

    return sayers[form.kind](form);
  }

  return within;
}

/** Minutes said plainly, with clock times of hours and minutes. */
function plainVoice(speech: Speech): Voice {
  function moment(hour: number, minute: number): Moment {
    return {hour, minute};
  }

  function point(hour: number, minute: number): string {
    return speech.at(moment(hour, minute));
  }

  function listed(minutes: number[]): string {
    return named(MINUTE, minutes);
  }

  const each = every(1, 'minute');

  return {
    alone: String,
    each,
    first: moment,
    kept: '',
    last: moment,
    listed,
    onTheHour: words.onTheHour,
    out: point,
    outEdges: [],
    per: 1,
    point,
    ranged: false,
    tail: '',
    unit: MINUTE,
    unitOut: listed,
    windows: true,
    within: withinOf(MINUTE, {eachIn: each, listed})
  };
}

/**
 * Minutes whose clock times name whole minutes, in a sentence that speaks
 * of seconds: what is left out is said to the second.
 */
function wholeMinuteVoice(speech: Speech): Voice {
  return {
    ...plainVoice(speech),
    out(hour, minute) {
      return speech.span({hour, minute, second: FIRST},
        {hour, minute, second: LAST});
    },
    outEdges: [FIRST, LAST],
    unitOut: during
  };
}

/** Minutes with one second, which every clock time carries. */
function secondVoice(speech: Speech, second: number): Voice {
  const atSecond = `${words.atSecond} ${second}`;
  const eachIn = `${atSecond} ${words.ofEachMinute}`;

  function moment(hour: number, minute: number): Moment {
    return {hour, minute, second};
  }

  function point(hour: number, minute: number): string {
    return speech.at(moment(hour, minute));
  }

  function listed(minutes: number[]): string {
    return `${atSecond} ` +
      minutesAfter([words.ofMinute, words.ofMinutes], minutes);
  }

  // Minutes in pieces are said as they are without the second, which
  // follows the whole phrase and so belongs to every piece.
  const plain = plainVoice(speech);

  function within(form: Form): string {
    return form.kind === 'pieces' ? plain.within(form) : inside(form);
  }

  const inside = withinOf(MINUTE, {eachIn, listed});

  return {
    ...wholeMinuteVoice(speech),
    alone(rate, single) {
      return single ? eachIn : `${rate}, ${atSecond}`;
    },
    first: moment,
    last: moment,
    listed,
    onTheHour: '',
    out: point,
    point,
    tail: `, ${atSecond}`,
    within
  };
}

/** The seconds that fire in a minute, and how they are said. */
interface SecondsSaid {
  first: number;
  last: number;
  // Whether the phrase has a range of its own.
  ranged: boolean;
  text: string;
}

// Minutes that seconds run in, each from its first to its last second.
function runningVoice(speech: Speech, seconds: SecondsSaid): Voice {
  function first(hour: number, minute: number): Moment {
    return {hour, minute, second: seconds.first};
  }

  function last(hour: number, minute: number): Moment {
    return {hour, minute, second: seconds.last};
  }

  return {
    ...wholeMinuteVoice(speech),
    first,
    last,
    onTheHour: '',
    point(hour, minute) {
      return speech.span(first(hour, minute), last(hour, minute));
    },
    ranged: seconds.ranged
  };
}

/**
 * A rate of seconds through a run or pieces of minutes: the rate stands
 * where «ogni minuto» would, windows run to the last second, and minutes
 * named inside the hour are what the seconds run during.
 */
function rateVoice(speech: Speech, seconds: SecondsSaid): Voice {
  const running = runningVoice(speech, seconds);

  function minutes(from: number, to: number): string {
    return `${words.rangeFrom} ${from} ${words.rangeTo} ${to}`;
  }

  // Only a run of minutes, or pieces that are runs and single minutes,
  // are said in this voice.
  function within(form: Form): string {
    const {parts} = form as {parts?: Part[]};

    return phrase(seconds.text, sayPieces(parts || [form as Run], {
      cadence: String,
      run(found) {
        return phrase(words.duringMinutes, minutes(found.from, found.to));
      },
      values(values) {
        return [during(values)];
      }
    }));
  }

  return {
    ...running,
    alone() {
      return seconds.text;
    },
    each: seconds.text,
    out: running.point,
    within
  };
}

/**
 * Seconds said in front of the minutes they belong to: every second runs
 * «durante» them, anything else is «del minuto» or «dei minuti».
 */
function frontVoice(speech: Speech, seconds: SecondsSaid, whole: boolean):
  Voice {
  const pair = whole ?
    [words.duringMinute, words.duringMinutes] :
    [words.ofMinute, words.ofMinutes];

  function listed(minutes: number[]): string {
    return `${seconds.text} ${minutesAfter(pair, minutes)}`;
  }

  return {
    ...runningVoice(speech, seconds),
    listed,
    within: withinOf(MINUTE, {eachIn: '', listed})
  };
}

/**
 * The seconds of every minute, said of the hours as minutes are: a value
 * fires in every minute of the hour, from its first to its last.
 */
function secondsVoice(speech: Speech): Voice {
  function listed(seconds: number[]): string {
    return named(SECOND, seconds);
  }

  const each = every(1, 'second');

  return {
    ...plainVoice(speech),
    each,
    first(hour, second) {
      return {hour, minute: FIRST, second};
    },
    kept: words.ofEachMinute,
    last(hour, second) {
      return {hour, minute: LAST, second};
    },
    listed,
    onTheHour: '',
    outEdges: [FIRST, LAST],
    per: LAST + 1,
    unit: SECOND,
    unitOut: listed,
    windows: false,
    within: withinOf(SECOND, {eachIn: each, listed})
  };
}

export type {SecondsSaid, Voice};
export {
  FIRST, LAST, frontVoice, plainVoice, rateVoice, secondVoice, secondsVoice,
  wholeMinuteVoice
};
