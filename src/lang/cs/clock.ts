// The minutes and hours of the time part: clock times, the places of the
// minutes inside the hour, and the hours as windows and stretches. Every
// phrase can be said again with its times written to the second, which is
// how the seconds join it (seconds.ts).

import type {
  CadencePieces, Domain, RangeDescription, SetDescription
} from '../../core/schedule.js';
import {denote, domainOf} from '../../core/index.js';
import type {CzechStyle} from './options.js';
import type {Described} from './sets.js';
import {
  cadenceCount, chosen, comesRound, counted, enoughForARun, everyUnit,
  listed, ofKind, partsJoiner, runsOf, spaced, stretchOf,
  togetherIn
} from './sets.js';
import type {Unit} from './lexicon.js';
import lexicon from './lexicon.js';

const {twoDigits, units, words} = lexicon;

/** An hour and a minute, with a second when the time shows one. */
export type Time = number[];

/** How a phrase is to be said: the style, and what the seconds ask of it. */
export interface Shown {
  style: CzechStyle;
  // The seconds every start and every end shows.
  sec?: number[];
  // The same, for the stretches that follow the places only.
  late?: number[];
  // Whether a single moment is said as the stretch it covers.
  span?: boolean;
  // What replaces the phrase's «každou minutu».
  head?: string;
  // The pattern's one second, when it has one.
  one?: number;
  // Whether there are several seconds in a minute.
  many?: boolean;
}

/** What opens a time part: «vždy», a clock time, or neither. */
export type Opening = '' | 'always' | 'times';

/** A phrase in the pieces the seconds are set between. */
export interface Said {
  opening: Opening;
  head: string;
  main: string;
  after: string;
  except: string[];
}

/** One field of the clock, classified. */
export interface Clock {
  domain: Domain;
  form: Described;
  // The step of an even rhythm, and 0 for a set that is none.
  step: number;
  // Whether the rhythm starts at the bottom of the field.
  tiles: boolean;
  unit: Unit;
  values: number[];
}

/** One level of the clock: seconds in minutes, or minutes in hours. */
export interface Level {
  // The removed values as places, where no window names their moments.
  removed(values: number[], shown: Shown): string;
  style: CzechStyle;
  // A moment in a slot of the outer unit.
  time(slot: number, value: number, end?: boolean): Time;
}

/** The minutes and hours, and what the seconds may do with them. */
export interface Told {
  // Whether its head or windows show clock times, and it has no places.
  clocks: boolean;
  // Whether it is minute 0 of every hour, or of all but a few.
  fullHour: boolean;
  // Whether it leads with «každou minutu», alone or over a run.
  lead: '' | 'minute' | 'run';
  say(shown: Shown): Said;
  // The clock times of a plain list.
  times: Time[] | null;
}

const lastOfUnit = 59;
const halfPast = 30;
const hoursOnADial = 12;
const mostListedTimes = 6;

// The step of a rhythm that needs no start: 1 for the whole field, and
// the interval of a cadence that comes round evenly from the bottom of
// the field.
function tilingStep(found: Described | undefined, domain: Domain): number {
  const cadence = found?.kind === 'cadence' && comesRound(found, domain) &&
    found.start === domain.min && found.interval;

  return Number(found?.kind === 'all') || cadence || 0;
}

// The step of an even rhythm: one that tiles, or a cadence that comes
// round evenly from a later start with enough values to be heard as one.
function rhythmStep(found: Described | undefined, domain: Domain): number {
  const offset = found?.kind === 'cadence' && comesRound(found, domain) &&
    cadenceCount(found) >= enoughForARun && found.interval;

  return tilingStep(found, domain) || offset || 0;
}

/**
 * A field of the clock from its candidates. A long set of runs and
 * cadences is said as its parts unless `listable` says the field keeps to
 * the generic order.
 */
function clockField(
  candidates: SetDescription[],
  field: 'hour' | 'minute' | 'second',
  joined = true
): Clock {
  const domain = domainOf(field);
  const values = denote(candidates[candidates.length - 1], domain);
  const step = rhythmStep(
    ofKind(candidates, 'all') || ofKind(candidates, 'cadence'), domain);

  return {
    domain,
    form: chosen(candidates, {
      domain,
      exceptions: true,
      rounds: true,
      together: joined && togetherIn(candidates, domain) || null
    }),
    step,
    tiles: step > 0 && values[0] === domain.min,
    unit: units[field],
    values
  };
}

// The hour as it is written: from 1 to 12 under the 12-hour style.
function writtenHour(hour: number, style: CzechStyle): number {
  return style.hour12 ? (hour + hoursOnADial - 1) % hoursOnADial + 1 : hour;
}

// The part of the day a time falls in; midnight and noon have their own
// words for the exact moment.
function dayPeriod(time: Time): string {
  const [hour, minute, second] = time;
  const exact: {[at: number]: string} =
    {0: words.atMidnight, [hoursOnADial]: words.atNoon};
  const [period] = lexicon.dayPeriods.filter(function begun(part) {
    return part.from <= hour;
  }).slice(-1);

  return !minute && !second && exact[hour] || period.word;
}

/** A time as the clock shows it: «9:00», «17:45:30», «5:45 odpoledne». */
function clock(time: Time, style: CzechStyle): string {
  const [hour, minute, ...seconds] = time;
  const digits = [
    [writtenHour(hour, style), twoDigits(minute)]
      .join(seconds.length ? ':' : style.separator),
    ...seconds.map(twoDigits)
  ].join(':');

  return spaced(digits, style.hour12 ? dayPeriod(time) : '');
}

/** Times after their preposition, which the first of them decides. */
function at(times: Time[], style: CzechStyle): string {
  const before = lexicon.hoursAfterVe
    .includes(writtenHour(times[0][0], style)) ?
    words.atBeforeCluster :
    words.at;

  return spaced(before, listed(times.map(function show(time) {
    return clock(time, style);
  })));
}

// A stretch from its first moment to its last.
function between(from: Time, to: Time, style: CzechStyle): string {
  return spaced(words.from, clock(from, style), words.to, clock(to, style));
}

// The second a start or an end shows, when the phrase shows seconds.
function secondOf(shown: Shown, end = false): number[] {
  return (shown.sec || []).slice(Number(end), Number(end) + 1);
}

// A place of the minutes as the clock shows it: «:05», and «:05:00» with
// a second.
function mark(minute: number, ...second: number[]): string {
  return [minute, ...second].map(function digits(value) {
    return `:${twoDigits(value)}`;
  }).join('');
}

// A stretch of places in brackets, to the second when the phrase runs to
// it.
function bracket(from: number, to: number, shown: Shown): string {
  const ends = shown.span ? shown.sec || [] : [];

  return `(${mark(from, ...ends.slice(0, 1))}–${mark(to, ...ends.slice(1))})`;
}

// Removed minutes as places in the hour: a moment, a moment with the one
// second, or the minute that starts there.
function removedPlaces(removed: number[], shown: Shown): string {
  const fromZero = removed[0] === 0;
  const later = removed.slice(Number(fromZero));
  const withSecond = removed.some(Boolean) ?
    [counted(removed, units.minute), words.and] :
    [];

  const [first, last] = shown.sec || [0, lastOfUnit];

  if (shown.many) {
    return spaced(words.exceptTheMinuteThatStarts,
      counted(removed, units.minute), words.afterEveryFullHour,
      `(${listed(removed.map(function minuteOf(minute) {
        return `${mark(minute, first)}–${mark(minute, last)}`;
      }))})`);
  }

  if (shown.one) {
    return spaced(words.except, words.theMoment, ...withSecond,
      counted([shown.one], units.second), words.afterEveryFullHour,
      `(${listed(removed.map(function momentOf(minute) {
        return mark(minute, shown.one as number);
      }))})`);
  }

  const moments = later.length ?
    spaced(fromZero ? words.theMoment : spaced(words.except, words.theMoment),
      counted(later, units.minute),
      fromZero ? words.afterIt : words.afterEveryFullHour) :
    '';

  return spaced(
    listed([...fromZero ? [words.exceptEveryFullHour] : [],
      ...later.length ? [moments] : []]),
    `(${listed(removed.map(function momentOf(minute) {
      return mark(minute);
    }))})`);
}

// A run of minutes inside the hour, after its «každou minutu».
function runPlace(run: RangeDescription, shown: Shown): string {
  const length = String(run.to - run.from + 1);
  const where =
    run.from === 0 && spaced(words.inTheFirst, length,
      words.minutesLocative, words.ofEveryHour) ||
    run.to === lastOfUnit && spaced(words.inTheLast, length,
      words.minutesLocative, words.ofEveryHour) ||
    spaced(words.from, String(run.from), words.to, String(run.to),
      units.minute.many, words.afterEveryFullHour);

  return spaced(where, bracket(run.from, run.to, shown));
}

const noPlace: Said =
  {after: '', except: [], head: '', main: '', opening: ''};

// A cadence of minutes from its first place to its last.
function cadenceSpan(form: Extract<Described, {kind: 'cadence'}>): string {
  return form.start === 0 ?
    spaced(words.fromTheFullHour, words.to, String(form.last),
      units.minute.many, words.afterIt) :
    spaced(words.from, String(form.start), words.to, String(form.last),
      units.minute.many, words.afterTheFullHour);
}

// Pieces of the minutes: runs, and single minutes after «ještě». Where
// cadences sit among them (`own`) every part has its own rhythm and the
// whole is said «v každé hodině».
function piecePlaces(form: Extract<Described, {kind: 'pieces'}> |
  CadencePieces, shown: Shown): Said {
  const own = form.kind === 'cadencePieces';
  const firstRun = form.parts.findIndex(function isRun(part) {
    return part.kind === 'range';
  });

  return {
    ...noPlace,
    main: spaced(own && words.inEveryHour || '', form.parts.map(
      function place(part, index) {
        const kinds = {
          cadence: () => spaced(
            everyUnit((part as {interval: number}).interval, units.minute),
            cadenceSpan(part as Extract<Described, {kind: 'cadence'}>),
            bracket((part as {start: number}).start,
              (part as {last: number}).last, shown)),
          range: () => spaced(own || index === firstRun ?
            everyUnit(1, units.minute) : '',
          runPlace(part as RangeDescription, shown)),
          values: () => spaced(index ? words.still : '',
            counted((part as {values: number[]}).values, units.minute),
            words.afterTheFullHour,
            `(${listed((part as {values: number[]}).values.map(
              function momentOf(minute) {
                return mark(minute);
              }))})`)
        };

        return kinds[part.kind]();
      }
    ).join(` ${partsJoiner(form.parts)} `))
  };
}

const places: {[kind: string]: (form: never, shown: Shown) => Said} = {
  cadencePieces: piecePlaces,
  cadence(form: Extract<Described, {kind: 'cadence'}>, shown: Shown) {
    const whole = form.start === 0 && form.last + form.interval > lastOfUnit;
    const where = whole ?
      spaced(words.inEachHourAnew, words.fromTheFullHour) :
      spaced(words.inEveryHour, cadenceSpan(form));

    return {
      ...noPlace,
      head: `${everyUnit(form.interval, units.minute)},`,
      main: spaced(where, bracket(form.start, form.last, shown))
    };
  },
  except(form: Extract<Described, {kind: 'except'}>, shown: Shown) {
    const base = placesOf(form.base, shown);

    return {...base, except: [removedPlaces(form.removed, shown)]};
  },
  pieces: piecePlaces,
  range(form: RangeDescription, shown: Shown) {
    return {
      ...noPlace,
      head: shown.head ?? everyUnit(1, units.minute),
      main: runPlace(form, shown)
    };
  },
  values(form: Extract<Described, {kind: 'values'}>) {
    return form.values[0] === 0 ?
      {
        ...noPlace,
        main: spaced(words.onEveryFullHour, words.and,
          counted(form.values.slice(1), units.minute), words.afterIt)
      } :
      {
        ...noPlace,
        main: spaced(counted(form.values, units.minute),
          words.afterEveryFullHour),
        opening: 'always'
      };
  }
};

function placesOf(form: Described, shown: Shown): Said {
  const rhythm = tilingStep(form, domainOf('minute'));

  return rhythm ?
    {...noPlace, head: everyUnit(rhythm, units.minute)} :
    places[form.kind](form as never, shown);
}

// One minute of every hour: on the hour, at the half, or so many minutes
// after the hour; the one second joins the place.
function onePlace(minute: number, shown: Shown): Said {
  const idiom: {[minute: number]: string} =
    {0: words.everyFullHour, [halfPast]: words.everyHourAtTheHalf};
  const second = shown.one ?
    [...minute ? [counted([minute], units.minute), words.and] : [],
      counted([shown.one], units.second)] :
    [counted([minute], units.minute)];

  return !shown.one && idiom[minute] ?
    {...noPlace, head: idiom[minute]} :
    {
      ...noPlace,
      main: spaced(...second, words.afterEveryFullHour),
      opening: 'always'
    };
}

// The minutes in hours: a moment is an hour, a minute, and the second
// the phrase shows.
function hourLevel(shown: Shown): Level {
  return {
    removed: removedPlaces,
    style: shown.style,
    time(hour, minute, end) {
      return [hour, minute, ...secondOf(shown, end)];
    }
  };
}

// Ranges with their head before the first of them, and single moments
// each with its own preposition, in the order of the day.
// A stretch of a part has its own rhythm where cadences sit among them.
function mixed(
  head: string,
  parts: {items: Time[][]; rhythms: string[]},
  shown: Shown
): string {
  const {items, rhythms} = parts;
  const firstRun = items.findIndex(function isRun(item) {
    return item.length > 1;
  });

  return listed(items.map(function say(item, index) {
    return item.length > 1 ?
      spaced(rhythms[index] ?? (index === firstRun ? head : ''),
        between(item[0], item[1], shown.style)) :
      at(item, shown.style);
  }));
}

// What the parts of runs and cadences are said from, in each slot: the
// times of each stretch and of each single value, and the rhythm of each
// part when it has its own.
function partsOf(
  form: Extract<Described, {kind: 'cadencePieces' | 'pieces'}>,
  unit: Unit,
  slots: number[],
  say: {
    single: (slot: number, value: number) => Time[];
    time: (slot: number, value: number, end?: boolean) => Time;
  }
): {items: Time[][]; rhythms: string[]} {
  const entries = slots.flatMap(function inSlot(slot) {
    return form.parts.flatMap(function entry(part) {
      if (part.kind === 'values') {
        return part.values.map(function one(value) {
          return {rhythm: '', times: say.single(slot, value)};
        });
      }

      const {first, last, step} = stretchOf(part);

      return [{
        rhythm: everyUnit(step, unit),
        times: [say.time(slot, first), say.time(slot, last, true)]
      }];
    });
  });

  return {
    items: entries.map(function timesOf(each) {
      return each.times;
    }),
    rhythms: form.kind === 'pieces' ? [] : entries.map(function own(each) {
      return each.rhythm;
    })
  };
}

// A single moment: itself, or the stretch it covers.
function moment(level: Level, slot: number, value: number, shown: Shown):
  Time[] {
  return shown.span ?
    [level.time(slot, value), level.time(slot, value, true)] :
    [level.time(slot, value)];
}

// The stretches of an outer set after a head: each maximal run of slots
// (a night kept whole is one), a cadence as its first two stretches and
// where it ends, and removed slots as whole units after «kromě doby».
function stretches(
  outer: Clock,
  inner: Clock,
  level: Level,
  say: (run: RangeDescription) => string
): {main: string; except: string[]} {
  const {form} = outer;
  const base = form.kind === 'except' ? form.base : form;
  const runs = base.kind === 'range' ?
    [base] :
    runsOf(denote(base, outer.domain));
  const said = runs.slice(0, Number(base.kind !== 'all') * runs.length)
    .map(say);
  const main = base.kind === 'cadence' ?
    spaced(said.slice(0, 2).join(', '), words.andSoOn,
      everyUnit(base.interval, outer.unit), words.until,
      clock(level.time(base.last, inner.values[inner.values.length - 1],
        true), level.style)) :
    listed(said);
  const removed = form.kind === 'except' ?
    [spaced(words.exceptTheSpan, listed(runsOf(form.removed).map(
      function whole(run) {
        return between(level.time(run.from, inner.domain.min),
          level.time(run.to, inner.domain.max, true), level.style);
      }
    )))] :
    [];

  return {except: removed, main};
}

// Whether no two slots of a set are neighbours: every window is then a
// single unit.
function apart(outer: Clock): boolean {
  return runsOf(outer.values).every(function alone(run) {
    return run.from === run.to;
  });
}

// Removed moments after «kromě»: clock times, or the stretches they
// cover.
function removedMoments(moments: Time[][], shown: Shown): string[] {
  const said = shown.span ?
    spaced(words.exceptTheSpan, listed(moments.map(function whole(pair) {
      return between(pair[0], pair[1], shown.style);
    }))) :
    spaced(words.except, listed(moments.map(function show(pair) {
      return clock(pair[0], shown.style);
    })));

  return moments.length ? [said] : [];
}

/**
 * A rhythm and the windows it runs in, each from the first to the last
 * moment that fires: the minutes in hours, or the seconds in minutes.
 * Where every window is a single unit, a run, a cadence and pieces are
 * said in the same way, and removed values as clock times.
 */
function windowed(inner: Clock, outer: Clock, level: Level, shown: Shown):
  Said {
  const {form} = inner;
  const first = inner.values[0];
  const last = inner.values[inner.values.length - 1];
  const step = inner.step ||
    form.kind === 'except' && rhythmStep(form.base, inner.domain) ||
    form.kind === 'cadence' && form.interval || 1;
  const head = shown.head ?? everyUnit(step, inner.unit);
  const tail = stretches(outer, inner, level, function window(run) {
    return between(level.time(run.from, first),
      level.time(run.to, last, true), level.style);
  });
  const removed = form.kind === 'except' ? form.removed : [];
  const named = outer.form.kind === 'values' && apart(outer);
  const except = named || !removed.length ?
    removedMoments(outer.values.flatMap(function inSlot(slot) {
      return removed.map(function gone(value) {
        return moment(level, slot, value, shown);
      });
    }), shown) :
    [level.removed(removed, shown)];

  return 'parts' in form ?
    {
      ...noPlace,
      except: tail.except,
      main: mixed(head, partsOf(form, inner.unit, outer.values, {
        single: (slot, value) => moment(level, slot, value, shown),
        time: (slot, value, end) => level.time(slot, value, end)
      }), shown)
    } :
    {...noPlace, except: [...except, ...tail.except], head, main: tail.main};
}

// One minute over hours that are no list: every hour or every so many
// hours between two ends, pieces, and removed hours as clock times.
function hourly(minute: number, hours: Clock, shown: Shown): Said {
  const level = hourLevel(shown);
  const {form} = hours;
  const base = form.kind === 'except' ? form.base : form;
  const removed = form.kind === 'except' ? form.removed : [];

  function ends(from: number, to: number): string {
    return between(level.time(from, minute), level.time(to, minute, true),
      shown.style);
  }

  const bodies: {[kind: string]: () => Said} = {
    all: () => onePlace(minute, shown),
    cadence: () => ({
      ...noPlace,
      head: everyUnit((base as {interval: number}).interval, units.hour),
      main: ends((base as {start: number}).start,
        (base as {last: number}).last)
    }),
    pieces: () => ({
      ...noPlace,
      main: mixed(everyUnit(1, units.hour), partsOf(
        base as Extract<Described, {kind: 'cadencePieces' | 'pieces'}>,
        units.hour, [minute], {
          single: (past, hour) => [level.time(hour, past)],
          time: (past, hour, end) => level.time(hour, past, end)
        }), shown)
    }),
    range: () => ({
      ...noPlace,
      head: everyUnit(1, units.hour),
      main: ends((base as RangeDescription).from,
        (base as RangeDescription).to)
    })
  };

  bodies.cadencePieces = bodies.pieces;

  return {
    ...bodies[base.kind](),
    except: removedMoments(removed.map(function gone(hour) {
      return moment(level, hour, minute, shown);
    }), shown)
  };
}

// The places of the minutes, then the hours as stretches, each from its
// first to its last firing. Over a cadence of hours a list of minutes is
// the first hour's clock times and where the cadence ends.
function placed(minutes: Clock, hours: Clock, shown: Shown): Said {
  const tail = {...shown, sec: shown.sec || shown.late};
  const level = hourLevel(tail);
  const {style} = shown;
  const list = minutes.form.kind === 'values';
  const first = minutes.values[0];
  const last = minutes.values[minutes.values.length - 1];

  function timesIn(hour: number, shows: Level = level): string {
    return at(minutes.values.map(function inHour(minute) {
      return shows.time(hour, minute);
    }), style);
  }

  if (list && hours.form.kind === 'cadence') {
    const own = hourLevel(shown);

    return {
      ...noPlace,
      main: spaced(timesIn(hours.form.start, own), words.andSoOn,
        everyUnit(hours.form.interval, units.hour), words.until,
        clock(own.time(hours.form.last, last, true), style)),
      opening: 'times'
    };
  }

  const said = placesOf(minutes.form, shown);
  const found = stretches(hours, minutes, level, function stretch(run) {
    return run.from === run.to && list && !tail.many ?
      timesIn(run.from) :
      between(level.time(run.from, first), level.time(run.to, last, true),
        style);
  });

  return {
    ...said,
    after: found.main ? `, ${found.main}` : '',
    except: [...said.except, ...found.except]
  };
}

// Which way of saying the minutes and hours applies.
interface Ways {
  // A list of clock times: both lists, and few times or hours apart.
  listed: boolean;
  // A rhythm in windows.
  inWindows: boolean;
  // Whether the hours are restricted to windows at all.
  windows: boolean;
  // Whether removed minutes can be named as clock times.
  named: boolean;
}

// Whether the minutes are a rhythm the hours can window: an even rhythm
// or one with a few values removed. Over every hour only a rhythm that
// needs no start is one.
function rhythmic(minutes: Clock, windows: boolean): boolean {
  const {form} = minutes;
  const base = form.kind === 'except' ? form.base : form;
  const even = minutes.step || rhythmStep(base, minutes.domain);
  const bare = minutes.tiles || tilingStep(base, minutes.domain) > 0;

  return even > 0 && (bare || windows);
}

function waysOf(minutes: Clock, hours: Clock): Ways {
  const {form} = minutes;
  const hourBase = hours.form.kind === 'except' ? hours.form.base : hours.form;
  const named = hours.form.kind === 'values' && apart(hours);
  const fewTimes = [minutes, hours].some(function single(field) {
    return field.values.length === 1;
  }) || minutes.values.length * hours.values.length <= mostListedTimes;
  const windows = hourBase.kind !== 'all';
  const stretch = apart(hours) && ['range', 'cadence'].includes(form.kind) ||
    named && ['pieces', 'cadencePieces'].includes(form.kind);

  return {
    inWindows: rhythmic(minutes, windows) || stretch,
    listed: [form, hours.form].every(function isList(found) {
      return found.kind === 'values';
    }) && (fewTimes || !minutes.step && named),
    named,
    windows
  };
}

/**
 * The minutes and hours together: a list of clock times, a rhythm in
 * windows, one minute over the hours, or the places of the minutes and
 * the stretches of the hours; the first that applies.
 */
function minutesAndHours(minutes: Clock, hours: Clock): Told {
  const {form} = minutes;
  const ways = waysOf(minutes, hours);
  const base = form.kind === 'except' ? form.base : form;
  const times = hours.values.flatMap(function inHour(hour) {
    return minutes.values.map(function atMinute(minute) {
      return [hour, minute];
    });
  });
  const plain: Omit<Told, 'say'> = {
    clocks: true, fullHour: false, lead: '', times: null
  };
  const rules: Array<{when: boolean; told: Told}> = [
    {
      told: {
        ...plain,
        say: (shown) => ({
          ...noPlace,
          main: at(times.map(function show(time) {
            return [...time, ...secondOf(shown)];
          }), shown.style),
          opening: 'times'
        }),
        times
      },
      when: ways.listed
    },
    {
      told: {
        ...plain,
        clocks: ways.windows && (form.kind !== 'except' || ways.named),
        lead: ['all', 'range', 'pieces'].includes(base.kind) ? 'minute' : '',
        say: (shown) => windowed(minutes, hours, hourLevel(shown), shown)
      },
      when: ways.inWindows
    },
    {
      told: {
        ...plain,
        fullHour: !ways.windows && minutes.values[0] === 0,
        say: (shown) => hourly(minutes.values[0], hours, shown)
      },
      when: minutes.values.length === 1
    },
    {
      told: {
        ...plain,
        clocks: form.kind === 'values' && hours.form.kind === 'cadence',
        lead: form.kind === 'range' ? 'run' : '',
        say: (shown) => placed(minutes, hours, shown)
      },
      when: true
    }
  ];

  return (rules.find(function applies(rule) {
    return rule.when;
  }) as {told: Told}).told;
}

export {
  apart, at, clock, clockField, minutesAndHours, noPlace, rhythmStep,
  windowed
};
