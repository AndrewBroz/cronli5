// One unit inside the hour, said of the hours: the times listed, one
// time an hour, a smooth rate with its windows, or the unit named inside
// the hour with the hours beside it. The first case that applies is said.

import type {
  CadencePieces, Domain, SetDescription
} from '../../core/schedule.js';
import {denote} from '../../core/describe-set.js';
import type {Cadence, Exception, Form, Part, Run} from './sets.js';
import {choose, countOf, firstOf, runsIn, runsOf, tiles} from './sets.js';
import type {Speech} from './words.js';
import {every, list, phrase, sayPieces} from './words.js';
import type {Voice} from './voices.js';
import {FIRST, LAST} from './voices.js';
import lexicon from './lexicon.js';

const {units, words} = lexicon;

// The fewest values a cadence has to be said as a cadence.
const LONG_CADENCE = 5;

// At most this many clock times are listed whatever the fields look like,
// and this many when minutes are a list over a list of hours.
const TIMES_AT_A_GLANCE = 4;
const MOST_TIMES_LISTED = 8;

// Pieces inside one hour are clock windows up to this many items.
const MOST_PIECE_WINDOWS = 3;

const SIXTY: Domain = {cyclic: true, max: LAST, min: FIRST};
const HOURS: Domain = {cyclic: true, max: 23, min: 0};

/** A field's candidates under the view it is read in, and its values. */
interface FieldSet {
  candidates: SetDescription[];
  mixed: CadencePieces | null;
  values: number[];
}

/** The hours as the time of day needs them. */
interface Hours {
  // Whether no two hours touch.
  alone: boolean;
  form: Form;
  // Every hour but one or two.
  nearly: boolean;
  // Every hour.
  open: boolean;
  // The hours an exception leaves out, if the hours are one.
  removed: number[];
  // The runs of hours, in the order they are read.
  runs: number[][];
  values: number[];
}

/**
 * What the unit turned out to be said as: clock times listed, values
 * named inside the hour, a run or pieces of them, or a rate.
 */
type TimeKind = 'times' | 'named' | 'ranged' | 'rate';

/** A time of day: what fires, and what is left out of it. */
interface TimeSaid {
  base: string;
  exceptions: string[];
  kind: TimeKind;
}

/** A rate that never breaks, with its first and last value. */
interface Rate {
  first: number;
  interval: number;
  last: number;
}

/** What the time of day is said from. */
interface Clockwork {
  hours: Hours;
  inner: FieldSet;
  speech: Speech;
  voice: Voice;
}

function longCadence(cadence: Cadence): boolean {
  return countOf(cadence) >= LONG_CADENCE;
}

/** The hours, from their candidates under the view they are read in. */
function hoursOf(set: FieldSet): Hours {
  const form = choose(set.candidates, HOURS,
    {cadence: longCadence, mixed: set.mixed});
  const runs = runsOf(set.candidates, HOURS);

  return {
    alone: runs.every(function single(run) {
      return run.length === 1;
    }),
    form,
    nearly: form.kind === 'except' && form.base.kind === 'all',
    open: form.kind === 'all',
    removed: (form as Exception).removed || [],
    runs,
    values: set.values
  };
}

function said(
  base: string,
  exceptions: string[] = [],
  kind: TimeKind = 'rate'
): TimeSaid {
  return {base, exceptions, kind};
}

// What a form of the unit is when it is named inside the hour.
const KIND_OF: {[kind: string]: TimeKind} = {
  pieces: 'ranged',
  range: 'ranged',
  values: 'named'
};

// What the unit is said as when it is named by a form: a list is named
// values, a run or pieces of runs are ranged, and anything with a cadence
// in it is a rate.
function kindOf(form: Form): TimeKind {
  const parts = (form as {parts?: Part[]}).parts || [];
  const cadenced = parts.some(function isCadence(part) {
    return part.kind === 'cadence';
  });

  return !cadenced && KIND_OF[form.kind] || 'rate';
}

// The rate a description is when it never breaks: every value, or a
// cadence that tiles its unit.
function rateOf(found: Form | SetDescription | undefined): Rate | undefined {
  const cadence = found as Cadence;

  return firstOf<Rate | undefined>([
    found?.kind === 'all' && {first: FIRST, interval: 1, last: LAST},
    found?.kind === 'cadence' && tiles(cadence, SIXTY) &&
      {first: cadence.start, interval: cadence.interval, last: cadence.last}
  ]);
}

// Whole hours left out, from the first moment of each stretch to its
// last; hours that touch are one stretch.
function hoursOut(removed: number[], work: Clockwork): string {
  const {speech, voice} = work;
  const [from, to] = voice.outEdges;

  return list(runsIn(removed).map(function stretch(run) {
    return speech.span({hour: run[0], minute: FIRST, second: from},
      {hour: run[run.length - 1], minute: LAST, second: to});
  }));
}

// Every time the unit fires, listed in clock order.
function timesListed(work: Clockwork): TimeSaid {
  const {hours, inner, voice} = work;

  return {
    base: list(hours.values.flatMap(function inHour(hour) {
      return inner.values.map(function time(value) {
        return voice.point(hour, value);
      });
    })),
    exceptions: [],
    kind: 'times'
  };
}

// A rate with one window for each run of hours. A long cadence of hours
// is its first two windows «e così via» to the last time, and never names
// a window an exception removes.
function sayWindows(rateWord: string, rate: Rate, work: Clockwork): TimeSaid {
  const {hours, speech, voice} = work;
  const {form} = hours;
  const {removed} = hours;
  const cadence = firstOf<Cadence | undefined>([
    form.kind === 'cadence' && form,
    form.kind === 'except' && form.base.kind === 'cadence' && form.base
  ]);

  function window(run: number[]): string {
    return speech.span(voice.first(run[0], rate.first),
      voice.last(run[run.length - 1], rate.last));
  }

  if (!cadence) {
    return said(`${rateWord} ${list(hours.runs.map(window))}`);
  }

  const shown = [cadence.start, cadence.start + cadence.interval].filter(
    function fires(hour) {
      return !removed.includes(hour);
    }
  ).map(function alone(hour) {
    return window([hour]);
  });

  return said(
    phrase(rateWord, shown.join(', '), words.andSoOnEvery,
      String(cadence.interval), units.hour.many,
      speech.until(voice.last(cadence.last, rate.last))),
    removed.length > 0 ? [hoursOut(removed, work)] : []
  );
}

// A rate over the hours: alone when every hour fires, with the whole
// hours left out when one or two do not, and with windows otherwise.
function sayRate(rateWord: string, rate: Rate, work: Clockwork): TimeSaid {
  const {hours, voice} = work;
  const {unit} = voice;
  const offZero = rate.first > FIRST && phrase(words.startingFromThe,
    units[unit.key].one, String(rate.first), unit.ofEach);
  const alone = voice.alone(phrase(rateWord, offZero), rate.interval === 1);

  return firstOf<TimeSaid>([
    hours.open && said(alone),
    hours.nearly &&
      said(alone, [hoursOut(hours.removed, work)]),
    sayWindows(rateWord, rate, work)
  ]);
}

// One value of the unit, once in each hour that fires.
function sayHourly(value: number, work: Clockwork): TimeSaid {
  const {hours, speech, voice} = work;
  const {form} = hours;
  const everyHour = every(1, 'hour');

  function span(from: number, to: number): string {
    return speech.span(voice.first(from, value), voice.last(to, value));
  }

  function cadence(found: Cadence): string {
    return `${every(found.interval, 'hour')} ` +
      span(found.start, found.last);
  }

  function points(found: number[]): string[] {
    return found.map(function time(hour) {
      return voice.point(hour, value);
    });
  }

  const eachHour = value === FIRST && voice.onTheHour ||
    `${voice.listed([value])} ${voice.unit.ofEach}`;
  const sayers = {
    all() {
      return said(eachHour, [], 'named');
    },
    cadence() {
      return said(cadence(form as Cadence));
    },
    except() {
      const {base, removed} = form as Exception;

      return said(
        base.kind === 'cadence' && cadence(base) || eachHour,
        [list(removed.map(function left(hour) {
          return voice.out(hour, value);
        }))],
        KIND_OF[String(base.kind === 'all' && 'values')]
      );
    },
    pieces() {
      return said(sayPieces((form as {parts: Part[]}).parts, {
        cadence,
        run(run, first) {
          return phrase(first && everyHour, span(run.from, run.to));
        },
        strays: [words.once, words.then],
        values: points
      }));
    },
    range() {
      const {from, to} = form as Run;

      return said(`${everyHour} ${span(from, to)}`);
    },
    values() {
      return timesListed(work);
    }
  };

  return sayers[form.kind]();
}

// The hours a phrase with a range of its own holds in, named as numbers:
// a run of hours is «di ciascuna ora dalle 9 alle 17», hours alone are
// «delle ore 8, 12 e 18». One run and nothing else is settled by the
// first and last firing in brackets; beside other hours each run says
// that its last hour counts.
function hoursAsNumbers(ends: Rate, work: Clockwork):
  {bracket: string; text: string} {
  const {hours, speech, voice} = work;
  const items: Array<{alone: boolean; hours: number[]}> = [];

  runsIn(hours.values).forEach(function place(run) {
    const previous = items[items.length - 1];

    if (run.length === 1 && previous?.alone) {
      previous.hours.push(run[0]);
    }
    else {
      items.push({alone: run.length === 1, hours: run.slice()});
    }
  });

  const several = items.length > 1;
  const lastHour = hours.values[hours.values.length - 1];
  const bracket = `(${words.firstTime} ` +
    `${speech.at(voice.first(hours.values[0], ends.first))}, ` +
    `${words.lastTime} ${speech.at(voice.last(lastHour, ends.last))})`;

  return {
    bracket: phrase(!several && !items[0].alone && bracket),
    text: list(items.map(function name(item) {
      return item.alone ?
        `${words.ofHours} ${list(item.hours.map(String))}` :
        phrase(words.ofEachHourFrom, words.fromHours, String(item.hours[0]),
          words.toHours, String(item.hours[item.hours.length - 1]),
          several && words.includedHours);
    }))
  };
}

// A single second is said in words with a list, a run, or pieces of
// those; a phrase with a cadence in it says the second after itself.
function tailOf(form: Form, voice: Voice): string {
  return phrase(kindOf(form) === 'rate' && voice.tail);
}

// The unit named inside the hour, and the hours it holds in.
function sayInHour(form: Form, work: Clockwork): TimeSaid {
  const {hours, inner, speech, voice} = work;
  const {unit} = voice;
  const ends = {
    first: inner.values[0],
    interval: 1,
    last: inner.values[inner.values.length - 1]
  };
  const cadenced = form.kind === 'cadence' || form.kind === 'except';
  const tail = tailOf(form, voice);
  const within = voice.within(form);
  const removed = (form as Exception).removed || [];
  const unitOut = removed.length > 0 ? [voice.unitOut(removed)] : [];
  const everyHour = cadenced ?
    `${within}, ${unit.restart}${tail}` :
    `${within} ${unit.ofEach}${tail}`;

  function window(run: number[]): string {
    return speech.span(voice.first(run[0], ends.first),
      voice.last(run[run.length - 1], ends.last));
  }

  function named(): TimeSaid {
    const numbers = hoursAsNumbers(ends, work);

    return said(phrase(within, voice.kept, numbers.text) +
      tail + phrase(numbers.bracket && ' ') +
      numbers.bracket, unitOut);
  }

  const listed = form.kind === 'values' && !voice.ranged;
  const found = firstOf<TimeSaid>([
    hours.open && said(everyHour, unitOut),
    hours.nearly && said(everyHour,
      [hoursOut(hours.removed, work), ...unitOut]),
    listed && hours.alone && said(phrase(within, voice.kept, words.ofHours,
      list(hours.values.map(String)))),
    listed &&
      said(`${within} ${unit.ofEach}, ${list(hours.runs.map(window))}`),
    named()
  ]);

  return {...found, kind: kindOf(form)};
}

// Hours that each stand alone, under a run or one cadence of the unit:
// each hour is a clock window. Pieces do the same in a single hour while
// their items are few.
function sayHourWindows(form: Form, work: Clockwork): TimeSaid | false {
  const {hours, speech, voice} = work;
  const [hour] = hours.values;
  const usable = voice.windows && hours.alone;

  function span(from: number, to: number): string {
    return speech.span(voice.first(hour, from), voice.last(hour, to));
  }

  const sayers: {[kind: string]: () => TimeSaid | false} = {
    cadence() {
      const {interval, last, start} = form as Cadence;

      return sayWindows(every(interval, voice.unit.key),
        {first: start, interval, last}, work);
    },
    pieces() {
      const {parts} = form as {parts: Part[]};
      const items = parts.reduce(function count(sum, part) {
        return sum + (part.kind === 'values' ? part.values.length : 1);
      }, 0);

      return items * hours.values.length <= MOST_PIECE_WINDOWS &&
        said(sayPieces(parts, {
          cadence(found) {
            return `${every(found.interval, voice.unit.key)} ` +
              span(found.start, found.last);
          },
          run(run, first) {
            return phrase(first && voice.each, span(run.from, run.to));
          },
          strays: [words.once, words.then],
          values(values) {
            return values.map(function time(value) {
              return voice.point(hour, value);
            });
          }
        }));
    },
    range() {
      const {from, to} = form as Run;

      return sayWindows(voice.each, {first: from, interval: 1, last: to},
        work);
    }
  };

  const found = usable && (sayers[form.kind] || Boolean)();

  return found && {...found, kind: kindOf(form)};
}

// An exception whose base never breaks: the base as a rate over these
// hours, then what is left out, as clock times while they are few.
function sayRateLess(form: Form, work: Clockwork): TimeSaid | false {
  const {hours, voice} = work;
  const {base, removed} = form as Exception;
  const rate = form.kind === 'except' && rateOf(base);

  if (!rate) {
    return false;
  }

  const rateWord = rate.interval === 1 ?
    voice.each :
    every(rate.interval, voice.unit.key);
  const whole = sayRate(rateWord, rate, work);
  const bounded = !hours.open && !hours.nearly;
  const few = bounded &&
    removed.length * hours.values.length * voice.per <= TIMES_AT_A_GLANCE;
  const left = few ?
    list(hours.values.flatMap(function inHour(hour) {
      return removed.map(function time(value) {
        return voice.out(hour, value);
      });
    })) :
    `${voice.unitOut(removed)} ${voice.unit.ofEach}`;

  return said(whole.base, [...whole.exceptions, left],
    KIND_OF[String(base.kind === 'all' && 'range')]);
}

// The form the unit is said in. An exception that would make a window
// name a time that does not fire is not used: the unit is then pieces or
// a list.
function formOf(work: Clockwork): Form {
  const {hours, inner} = work;
  const limits = {cadence: longCadence, mixed: inner.mixed};
  const form = choose(inner.candidates, SIXTY, limits);
  const {base, removed} = form as Exception;
  const rate = form.kind === 'except' && rateOf(base);
  const refused = rate && !hours.open && !hours.nearly &&
    (removed.includes(rate.first) || removed.includes(rate.last));

  return refused ?
    choose(inner.candidates, SIXTY, {...limits, plain: true}) :
    form;
}

// The smooth rate the unit is over these hours, if it is one. Two or
// three values that tile are a rate only when every hour fires, or all
// but one or two, or the hours are one run; off zero under every hour, a
// rate needs a certain length.
function smoothOf(form: Form, work: Clockwork): Rate | undefined {
  const {hours, inner} = work;
  const count = inner.values.length;
  const tiling = rateOf(inner.candidates.find(function isCadence(candidate) {
    return candidate.kind === 'cadence';
  }));
  const fits = hours.open || hours.nearly ?
    inner.values[0] === FIRST :
    hours.runs.length === 1 || count >= TIMES_AT_A_GLANCE;

  return firstOf<Rate | undefined>([
    rateOf(form),
    (count >= LONG_CADENCE || fits) && tiling
  ]);
}

/** One unit inside the hour, said of the hours. */
function sayWithin(work: Clockwork): TimeSaid {
  const {hours, inner, voice} = work;
  const form = formOf(work);
  const count = inner.values.length;
  const times = count * hours.values.length * voice.per;
  const smooth = smoothOf(form, work);

  function lazily(rules: Array<() => TimeSaid | false | undefined>):
    TimeSaid {
    let found: TimeSaid | false | undefined;

    rules.some(function applies(rule) {
      found = rule();

      return Boolean(found);
    });

    return found as TimeSaid;
  }

  return lazily([
    function fewTimes() {
      return times <= TIMES_AT_A_GLANCE && timesListed(work);
    },
    function oneValue() {
      return count === 1 && sayHourly(inner.values[0], work);
    },
    function smoothRate() {
      return smooth && sayRate(
        every(smooth.interval, voice.unit.key), smooth, work);
    },
    function listedTimes() {
      return form.kind === 'values' && times <= MOST_TIMES_LISTED &&
        timesListed(work);
    },
    function rateWithValuesOut() {
      return sayRateLess(form, work);
    },
    function windowsInEachHour() {
      return sayHourWindows(form, work);
    },
    function insideTheHour() {
      return sayInHour(form, work);
    }
  ]);
}

/** A field's set under a view, with its values in ascending order. */
function fieldSet(
  candidates: SetDescription[],
  domain: Domain,
  mixed: CadencePieces | null
): FieldSet {
  return {
    candidates,
    mixed,
    values: denote(candidates[candidates.length - 1], domain)
  };
}

export type {Clockwork, FieldSet, Hours, Rate, TimeSaid};
export {
  HOURS, MOST_PIECE_WINDOWS, MOST_TIMES_LISTED, SIXTY, TIMES_AT_A_GLANCE,
  fieldSet, hoursOf, longCadence, rateOf, said, sayWithin
};
