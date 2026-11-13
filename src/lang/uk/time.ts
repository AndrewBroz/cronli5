// The time part of a Ukrainian description: seconds, minutes and hours
// said as one phrase. The minutes settle their own phrase first; the hours
// are then said as points on the clock, or as what confines the minutes;
// a plain list of clock times competes with the result; and seconds, where
// they are not silent, lead it.

import type {
  RangeDescription, ScheduleFacts, SetDescription, ValuesDescription
} from '../../core/schedule.js';
import type {Cadence, Moment, Phrase, Piece} from './words.js';
import {
  at, choose, clock, combined, counted, countedGenitive, dispatch,
  excepting, identity, isPair, join, laboured, listed, ordered, phrase,
  pieced, present, runsOf, through, tiles, upTo, withIn
} from './words.js';
import {clockTimes} from '../../core/fusions.js';
import {denote} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import {shortestSpoken} from '../../core/select.js';
import type {UkrainianStyle} from './options.js';

const {endings, units, words} = lexicon;

// A list of clock times is sayable up to this many of them.
const MOST_TIMES = 24;

// Under a list of minutes, separate hours are written out as clock times
// up to this many of them.
const MOST_TIMES_UNDER_MINUTES = 12;

// The most separate hours whose stretches are each given as a window.
const MOST_WINDOWS = 2;

// Up to this many times are listed before an even cadence of hours is
// said under their minutes.
const EASY_TIMES = 4;

const HOURS = 24;
const SIXTIETHS = 60;

// The words that open a time said every hour or every minute. Seconds
// that lead the time take their place.
interface Leads {
  everyHour: string;
  everyMinute: string;
}

interface TimeContext {
  // The hours' candidate descriptions.
  hours: SetDescription[];
  leads: Leads;
  // How many minutes of the hour the set holds.
  minutes: number;
  // A single second that each clock time or minute carries.
  second?: number | undefined;
  style: UkrainianStyle;
  // Whether two hours that tile the day were written as a cadence.
  pairWrittenAsCadence: boolean;
  // Whether seconds fill the minutes, so an excepted minute is a stretch.
  wholeMinutes: boolean;
}

/** The time part, with what the other parts need to know about it. */
export interface TimePhrase extends Phrase {
  // Whether the phrase begins with the words for every hour or minute.
  led: boolean;
  // Whether it already says the schedule runs round the clock.
  round: boolean;
  // The clock times, when the phrase is a plain list of them.
  times: Moment[] | null;
  // Whether every minute in it is written out, so a second can join it.
  spelledOut: boolean;
}

// A description that is not itself a set with values taken out.
type Unexcepted = Exclude<SetDescription, {kind: 'except'}>;

// A phrase for the minutes of the hour, or the seconds of the minute.
interface FinePhrase extends Phrase {
  // Whether it fills its cycle evenly, so that hours confine it.
  continuous: boolean;
  // What the phrase describes, apart from the values excepted from it.
  description: Unexcepted;
  excepted: number[];
  led: boolean;
}

// The words of minutes or of seconds.
interface FineUnit {
  every: string;
  forms: typeof units.minute;
  // The values as moments inside every cycle: «о :05 та :20».
  list(values: number[]): string;
  // One value as the end of a stretch: «:05», «5-ї».
  point(value: number): string;
  // What follows the end of a stretch: « секунди».
  stretchNoun: string;
}

// A stretch of the clock that minutes or seconds are said inside.
interface Frame {
  // The moment a value falls on, at the start and at the end.
  first(value: number): Moment;
  last(value: number): Moment;
  // Its bounds as round times.
  start: Moment;
  end: Moment;
  // Whether an even cadence inside it closes on the boundary.
  open: boolean;
}

function timePhrase(spoken: Phrase, round: boolean): TimePhrase {
  return {...spoken, led: false, round, times: null, spelledOut: false};
}

function minuteUnit(context: TimeContext): FineUnit {
  function point(value: number): string {
    return `:${[value, context.second].filter(function given(part) {
      return typeof part === 'number';
    }).map(function write(part) {
      return lexicon.twoDigits(part as number);
    }).join(':')}`;
  }

  return {
    every: context.leads.everyMinute,
    forms: units.minute,
    list: function list(values) {
      return `${words.at} ${listed(values.map(point))}`;
    },
    point,
    stretchNoun: ''
  };
}

const secondUnit: FineUnit = {
  every: words.everySecond,
  forms: units.second,
  list: function list(values) {
    const noun = values.length > 1 ?
      units.second.locativePlural :
      units.second.locative;

    return `${words.on} ${listed(values.map(function ordinal(value) {
      return `${value}${endings.secondLocative}`;
    }))} ${noun}`;
  },
  point: function point(value) {
    return `${value}${endings.secondGenitive}`;
  },
  stretchNoun: ` ${units.second.genitiveOne}`
};

// How the minutes of the hour, or the seconds of the minute, are said on
// their own, whatever confines them.
function fineSayer(unit: FineUnit) {
  function fine(
    text: string,
    length: number,
    description: Unexcepted
  ): FinePhrase {
    return {
      ...phrase(text, length),
      continuous: false,
      description,
      excepted: [],
      led: false
    };
  }

  function span(from: number, to: number): string {
    return through(unit.point(from), `${unit.point(to)}${unit.stretchNoun}`);
  }

  function stretch(run: RangeDescription): string {
    if (run.from === 0) {
      return `${words.throughout} ${words.first} ` +
        `${countedGenitive(run.to + 1, unit.forms)}`;
    }

    if (run.to === SIXTIETHS - 1) {
      return `${words.throughout} ${words.last} ` +
        `${countedGenitive(SIXTIETHS - run.from, unit.forms)}`;
    }

    return span(run.from, run.to);
  }

  function all(description: {kind: 'all'}): FinePhrase {
    return {...fine(unit.every, 0, description), continuous: true, led: true};
  }

  function values(description: ValuesDescription): FinePhrase {
    return fine(unit.list(description.values), description.values.length,
      description);
  }

  function range(description: RangeDescription): FinePhrase | null {
    return isPair(description, SIXTIETHS) ?
      null :
      {...fine(`${unit.every} ${stretch(description)}`, 2, description),
        led: true};
  }

  function cadence(description: Cadence): FinePhrase {
    const every = `${words.every} ${counted(description.interval, unit.forms)}`;

    return tiles(description, SIXTIETHS) ?
      {...fine(every, 1, description), continuous: true} :
      {...fine(`${every} ${span(description.start, description.last)}`, 3,
        description), laboured: true};
  }

  function pieces(description: {parts: Piece[]}): FinePhrase {
    const parts = ordered(description.parts, identity).map(say)
      .filter(present);

    return {
      ...fine('', 0, description as Unexcepted),
      ...combined(parts),
      led: parts[0].led
    };
  }

  function except(
    description: {base: SetDescription; removed: number[]}
  ): FinePhrase | null {
    const base = say(description.base);

    return base && {
      ...base,
      excepted: description.removed,
      laboured: true,
      length: base.length + description.removed.length
    };
  }

  function say(description: SetDescription): FinePhrase | null {
    return dispatch(description, {all, cadence, except, pieces, range, values});
  }

  return say;
}

// An evenly spaced set of hours. On the hour it is a cadence of its own
// («кожні 6 годин»); under minutes every second hour is «кожної парної
// години»; and a stretch of minutes takes only that form. Two hours are
// a cadence only where they were written as one, and under minutes a
// cadence that tiles the day gives way to the times while they are few.
// `end` is the time a named end of the cadence falls on.
function hourCadence(
  description: Cadence,
  mode: 'confining' | 'onTheHour' | 'underMinutes',
  end: (hour: number) => Moment,
  context: TimeContext
): TimePhrase | null {
  const count = (description.last - description.start) /
    description.interval + 1;
  const full = description.start < description.interval &&
    description.last + description.interval >= HOURS;
  const tiling = tiles(description, HOURS);

  if (mode !== 'onTheHour' && full && description.interval === 2) {
    return timePhrase(
      phrase(tiling ? words.eachEvenHour : words.eachOddHour, 1), true);
  }

  if (mode === 'confining') {
    return null;
  }

  const every = `${words.every} ${counted(description.interval, units.hour)}`;
  const easy = mode === 'onTheHour' ?
    count > 2 || context.pairWrittenAsCadence :
    count * context.minutes > EASY_TIMES;
  const bounds = through(
    clock(end(description.start), context.style),
    clock(end(description.last), context.style));

  if (tiling && !easy) {
    return null;
  }

  return tiling ?
    timePhrase(phrase(every, 1), true) :
    timePhrase(laboured(`${every} ${bounds}`, 3), false);
}

// The hours as points on the clock, each carrying the one minute.
function pointHours(minute: number, context: TimeContext) {
  const onTheHour = minute === 0 && typeof context.second !== 'number';
  // On the hour nothing is carried and every hour has its own word; any
  // other minute is said before the hours it belongs to.
  const sayings: {
    carried: string[];
    each: string;
    mode: 'onTheHour' | 'underMinutes';
  } = onTheHour ?
    {carried: [], each: context.leads.everyHour, mode: 'onTheHour'} :
    {
      carried: [`${words.at} ${minuteUnit(context).point(minute)}`],
      each: words.eachHour,
      mode: 'underMinutes'
    };
  const {carried, each, mode} = sayings;

  function moment(hour: number): Moment {
    return {hour, minute, second: context.second};
  }

  function time(hour: number): string {
    return clock(moment(hour), context.style);
  }

  function all(): TimePhrase {
    return {
      ...timePhrase(phrase(join([...carried, each]), 0), true),
      led: onTheHour
    };
  }

  function values(description: ValuesDescription): TimePhrase {
    return timePhrase(phrase(at(description.values.map(moment),
      context.style), description.values.length), false);
  }

  function range(description: RangeDescription): TimePhrase | null {
    const text = `${context.leads.everyHour} ` +
      `${through(time(description.from), time(description.to))}`;

    return isPair(description, HOURS) ?
      null :
      {...timePhrase(phrase(text, 2), false), led: true};
  }

  function cadence(description: Cadence): TimePhrase | null {
    const spoken = hourCadence(description, mode, moment, context);

    // Named ends carry the minute themselves, as a range's do.
    return spoken && {
      ...spoken,
      text: join([spoken.round && carried.join(''), spoken.text])
    };
  }

  function pieces(description: {parts: Piece[]}): TimePhrase {
    const parts = ordered(description.parts, identity).map(say)
      .filter(present);

    return {...timePhrase(combined(parts), false), led: parts[0].led};
  }

  function except(
    description: {base: SetDescription; removed: number[]}
  ): TimePhrase | null {
    return excepting(say(description.base),
      listed(description.removed.map(time)), description.removed.length);
  }

  function say(description: SetDescription): TimePhrase | null {
    return dispatch(description, {all, cadence, except, pieces, range, values});
  }

  return say;
}

// The hours a run covers, as the frame its minutes are said inside.
function hourFrame(run: RangeDescription): Frame {
  return {
    end: {hour: run.to + 1, minute: 0},
    first: function first(minute) {
      return {hour: run.from, minute};
    },
    last: function last(minute) {
      return {hour: run.to, minute};
    },
    open: false,
    start: {hour: run.from, minute: 0}
  };
}

// The minute a clock time opens, as the frame its seconds are said inside.
function minuteFrame(time: Moment): Frame {
  const next = time.hour * SIXTIETHS + time.minute + 1;

  function within(second: number): Moment {
    return {hour: time.hour, minute: time.minute, second};
  }

  return {
    end: {hour: Math.floor(next / SIXTIETHS), minute: next % SIXTIETHS},
    first: within,
    last: within,
    open: true,
    start: {hour: time.hour, minute: time.minute}
  };
}

// Minutes or seconds said as stretches of the clock: «щохвилини з 9:00 до
// 9:29 включно і з 17:00 до 17:29 включно». A stretch that runs to the
// end of its frame closes on the boundary; any other names its last
// moment.
function windowed(
  fine: Unexcepted,
  frames: Frame[],
  unit: FineUnit,
  style: UkrainianStyle
): string {
  function write(moment: Moment): string {
    return clock(moment, style);
  }

  function whole(frame: Frame): string {
    return upTo(write(frame.start), write(frame.end));
  }

  function led(lead: string, stretches: string[]): string {
    return `${lead} ${pieced(stretches)}`;
  }

  function all(): string {
    return led(unit.every, frames.map(whole));
  }

  function range(run: RangeDescription): string {
    const halves = run.from > run.to ?
      [[0, run.to], [run.from, SIXTIETHS - 1]] :
      [[run.from, run.to]];

    return led(unit.every, frames.flatMap(function inFrame(frame) {
      return halves.map(function stretch([from, to]) {
        return to === SIXTIETHS - 1 ?
          upTo(write(frame.first(from)), write(frame.end)) :
          through(write(frame.first(from)), write(frame.last(to)));
      });
    }));
  }

  function cadence(description: Cadence): string {
    const every = `${words.every} ${counted(description.interval, unit.forms)}`;

    return led(every, frames.map(function inFrame(frame) {
      return frame.open && tiles(description, SIXTIETHS) ?
        whole(frame) :
        through(write(frame.first(description.start)),
          write(frame.last(description.last)));
    }));
  }

  function pieces(description: {parts: Piece[]}): string {
    return pieced(ordered(description.parts, identity).map(
      function each(part) {
        return windowed(part, frames, unit, style);
      }
    ));
  }

  function values(description: ValuesDescription): string {
    return at(frames.flatMap(function inFrame(frame) {
      return description.values.map(frame.first);
    }), style);
  }

  return dispatch(fine, {all, cadence, pieces, range, values});
}

// The hours as what confines a phrase of minutes: windows, «у години з
// початком о …», «кожної парної години», or nothing at all. Each phrase
// here is the whole time: the minutes with their hours.
function confiningHours(minute: FinePhrase, context: TimeContext) {
  const mode = minute.continuous ? 'confining' : 'underMinutes';
  const listable = minute.description.kind === 'values';

  function onTheHour(hour: number): Moment {
    return {hour, minute: 0};
  }

  function time(hour: number): string {
    return clock(onTheHour(hour), context.style);
  }

  // The minutes are counted once, after the hours are chosen.
  function confined(hours: string | false, length: number): Phrase {
    return phrase(join([minute.text, hours]), length);
  }

  function hourWindow(run: RangeDescription): string {
    return upTo(time(run.from), time(run.to + 1));
  }

  function all(): TimePhrase {
    const each = !minute.continuous && words.eachHour;

    return {...timePhrase(confined(each, 0), true), led: minute.led};
  }

  function cadence(description: Cadence): TimePhrase | null {
    const spoken = hourCadence(description, mode, onTheHour, context);

    return spoken && {
      ...spoken,
      ...confined(spoken.text, spoken.length),
      laboured: spoken.laboured
    };
  }

  function except(
    description: {base: SetDescription; removed: number[]}
  ): TimePhrase | null {
    const [gap, ...others] = runsOf(description.removed);

    return others.length > 0 ?
      null :
      excepting(say(description.base),
        `${words.stretch} ${hourWindow(gap)}`, description.removed.length);
  }

  function windows(runs: RangeDescription[]): TimePhrase | null {
    const separate = runs.every(function oneHour(run) {
      return run.from === run.to;
    });
    const few = runs.length <= MOST_WINDOWS;
    const starts = at(runs.map(function startOf(run) {
      return {hour: run.from, minute: 0};
    }), context.style);

    if (minute.continuous ? !separate || few : separate && few && !listable) {
      return {
        ...timePhrase(phrase(
          windowed(minute.description, runs.map(hourFrame),
            minuteUnit(context), context.style),
          minute.continuous ?
            2 * runs.length :
            minute.length * (runs.length - 1)), false),
        led: minute.led
      };
    }

    if (!separate) {
      return timePhrase(confined(
        `${words.eachHour} ${pieced(runs.map(hourWindow))}`,
        2 * runs.length), false);
    }

    if (listable &&
        minute.length * runs.length <= MOST_TIMES_UNDER_MINUTES) {
      return null;
    }

    return timePhrase(confined(
      withIn(minute.text, `${words.hoursBeginning} ${starts}`),
      runs.length), false);
  }

  function range(description: RangeDescription): TimePhrase | null {
    return windows([description]);
  }

  function values(description: ValuesDescription): TimePhrase | null {
    return windows(runsOf(description.values));
  }

  function pieces(description: {parts: Piece[]}): TimePhrase | null {
    return windows(ordered(description.parts, identity).flatMap(
      function runs(part) {
        return part.kind === 'range' ? [part] : runsOf(part.values);
      }
    ));
  }

  function say(description: SetDescription): TimePhrase | null {
    return dispatch(description, {all, cadence, except, pieces, range, values});
  }

  return say;
}

// A time with values excepted from it, said last: «…, крім :29 кожної
// години». After another exception it is joined by «і».
function exceptingLast(
  time: TimePhrase,
  count: number,
  excepted: Array<string | false>
): TimePhrase {
  if (count === 0) {
    return time;
  }

  const clause = join(
    [time.exception && words.andPiece, words.except, ...excepted]);

  return {...time, exception: true, text: `${time.text}, ${clause}`};
}

// The minutes excepted from every hour. Inside one named hour they are
// clock times («крім 9:30»), and «кожної години» is not said twice
// running.
function exceptingMinutes(
  time: TimePhrase,
  minute: FinePhrase,
  context: TimeContext
): TimePhrase {
  const [hour, ...otherHours] = denote(context.hours[0], domainOf('hour'));
  const oneHour = otherHours.length === 0;
  const excepted = oneHour ?
    minute.excepted.map(function inTheHour(value) {
      return clock({hour, minute: value}, context.style);
    }) :
    minute.excepted.map(minuteUnit(context).point);

  return exceptingLast(time, excepted.length, [
    context.wholeMinutes && words.minuteOf,
    listed(excepted),
    !oneHour && !time.text.endsWith(words.eachHour) && words.eachHour
  ]);
}

// The seconds excepted from every minute, as ordinals («крім 29-ї секунди
// кожної хвилини»). Inside one named minute they are clock times («крім
// 9:00:29»).
function exceptingSeconds(
  time: TimePhrase,
  second: FinePhrase,
  style: UkrainianStyle
): TimePhrase {
  const [minute, ...otherMinutes] = time.times ?? [];
  const noun = second.excepted.length > 1 ?
    units.second.genitiveRest :
    units.second.genitiveOne;
  const ordinals = listed(second.excepted.map(secondUnit.point));

  return exceptingLast(time, second.excepted.length,
    minute && otherMinutes.length === 0 ?
      [listed(second.excepted.map(function inTheMinute(value) {
        return clock({...minute, second: value}, style);
      }))] :
      [`${ordinals} ${noun}`, words.eachMinute]);
}

function isMidnight(times: Moment[]): boolean {
  return times.every(function atMidnight(time) {
    return time.hour === 0 && time.minute === 0 &&
      typeof time.second !== 'number';
  });
}

// A plain list of clock times, or the one word for midnight alone.
function timesPhrase(times: Moment[], style: UkrainianStyle): TimePhrase {
  const text = times.length === 1 && isMidnight(times) ?
    words.midnight :
    at(times, style);

  return {
    ...timePhrase(phrase(text, times.length), false),
    times,
    spelledOut: true
  };
}

// Minutes and hours together: the minutes' own phrase with the hours
// about it, or the list of clock times where that names no more things.
function minutesAndHours(
  facts: ScheduleFacts,
  context: TimeContext
): TimePhrase {
  const candidates = facts.analyses.candidates.minute as SetDescription[];
  const minutes = denote(candidates[0], domainOf('minute'));
  const minute = choose(
    candidates, fineSayer(minuteUnit(context))) as FinePhrase;
  const single = minutes.length === 1;
  const counting = {...context, minutes: minutes.length};
  const hours = choose(context.hours, single ?
    pointHours(minutes[0], counting) :
    confiningHours(minute, counting));
  const times = clockTimes(facts, MOST_TIMES);

  return shortestSpoken([
    times && timesPhrase(times, context.style),
    hours && {
      ...exceptingMinutes(hours, minute, context),
      length: hours.length + (single ? 0 : minute.length),
      spelledOut: minute.description.kind === 'values'
    }
  ].filter(present));
}

// Seconds that are not silent and do not simply join the clock times:
// they lead the time, as windows of one minute, or before the minutes
// and hours; a list of clock times to the second competes.
function withSeconds(
  facts: ScheduleFacts,
  context: TimeContext,
  seconds: number[]
): TimePhrase {
  const second = choose(facts.analyses.candidates.second as SetDescription[],
    fineSayer(secondUnit)) as FinePhrase;
  const prefix = join(
    [second.text, second.continuous && words.forAMinute]);
  const leads = second.continuous ?
    {everyHour: `${prefix} ${words.everyHour}`, everyMinute: second.text} :
    {
      everyHour: `${second.text} ${words.eachHour}`,
      everyMinute: `${second.text} ${words.eachMinute}`
    };
  const rest = minutesAndHours(
    facts, {...context, leads, wholeMinutes: second.continuous});
  const times = clockTimes(facts,
    seconds.length > 1 ? Math.floor(MOST_TIMES / seconds.length) : 0);
  const toTheSecond = times && times.flatMap(function eachTime(time) {
    return seconds.map(function eachSecond(value): Moment {
      return value === 0 ?
        {hour: time.hour, minute: time.minute} :
        {hour: time.hour, minute: time.minute, second: value};
    });
  });

  // A window names its two ends; any other rest keeps its own count.
  function led(): Phrase {
    if (rest.times && rest.times.length <= MOST_WINDOWS) {
      return phrase(
        windowed(second.description, rest.times.map(minuteFrame),
          secondUnit, context.style),
        second.length + 2 * rest.times.length);
    }

    return phrase(rest.led ? rest.text : `${prefix} ${rest.text}`,
      second.length + rest.length);
  }

  return shortestSpoken([
    toTheSecond && timesPhrase(toTheSecond, context.style),
    {
      ...exceptingSeconds({...rest, ...led(), exception: rest.exception},
        second, context.style),
      times: null
    }
  ].filter(present));
}

/**
 * The time part of the sentence. `hours` are the hours' candidate
 * descriptions, already unwrapped where a coarser field forbids a run
 * through midnight.
 */
function timePart(
  facts: ScheduleFacts,
  hours: SetDescription[],
  style: UkrainianStyle
): TimePhrase {
  const {candidates, clockSecond, written} = facts.analyses;
  const context: TimeContext = {
    hours,
    leads: {everyHour: words.everyHour, everyMinute: words.everyMinute},
    minutes: 0,
    pairWrittenAsCadence: written.hour === 'cadence',
    style,
    wholeMinutes: false
  };
  const seconds = denote(
    (candidates.second as SetDescription[])[0], domainOf('second'));
  const plain = minutesAndHours(facts, {...context, second: clockSecond});

  return seconds.length === 1 && (seconds[0] === 0 || plain.spelledOut) ?
    plain :
    withSeconds(facts, context, seconds);
}

export {timePart};
