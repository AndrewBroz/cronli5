// The time part of the sentence: hours, minutes and seconds said as one
// phrase. The hours come first, as exact times, as a stretch that is
// filled, or as the owner of the minutes named after them; what happens
// in them follows, and the seconds close it.

import type {
  NormalizedOptions, RangeDescription, ScheduleFacts
} from '../../core/schedule.js';
import {
  type Sayable, type Shape, andLast, around, choose, excepted, parity,
  ranges, scales, setsOf, span, strays, unrestricted, valuesOf
} from './shape.js';
import type {ChineseStyle} from './options.js';
import lexicon from './lexicon.js';

const {marks, twoDigits, units, words} = lexicon;

type Options = NormalizedOptions<ChineseStyle>;

// A second written on a clock time, or none.
type Second = number | null;

/** The time part, and whether it says the schedule runs round the clock. */
export interface TimeSaid {
  allDay: boolean;
  text: string;
}

// How the minutes place the hours: as points on the hour, as points off
// it, or as stretches of time.
type HourForm = 'offset' | 'points' | 'spans';

// The words for one division of time inside the next: minutes of the
// hour, seconds of the minute.
interface Division {
  each: string;
  point: string;
  span: string;
}

const minuteOfHour: Division = {
  each: words.everyMinute,
  point: units.minuteOfHour,
  span: units.minute
};

const secondOfMinute: Division = {
  each: words.everySecond,
  point: units.second,
  span: units.second
};

// Everything the time part is decided from.
interface Moment {
  // Whether the seconds take the place of every minute as what happens.
  filled: boolean;
  // The seconds written on the first and the last time of a stretch.
  from: Second;
  hour: Shape;
  hours: number[];
  // The unbroken stretches of hours.
  hourRuns: RangeDescription[];
  // What happens in a stretch: every minute, every N minutes, every second.
  lead: string;
  minute: Shape;
  minutes: number[];
  // What joins every hour to a minute taken out of it.
  ofHour: string;
  opts: Options;
  second: Shape;
  seconds: number[];
  // The seconds shown on listed times: none when the second is zero.
  shown: Second[];
  // Whether there is one second, and it is not zero.
  single: boolean;
  // Whether the hours are evenly spaced, however they are named.
  spaced: boolean;
  to: Second;
  // What a minute taken out is called when seconds fill the stretch.
  wholeMinute: string;
}

const noon = 12;

// Every minute of an hour, as a run.
const wholeHour: RangeDescription = {
  from: scales.minute.domain.min,
  kind: 'range',
  to: scales.minute.domain.max
};

// This many exact times or fewer are always listed.
const alwaysListed = 4;

// A list of times to the second may be this long.
const listedToTheSecond = 24;

// Separate hours with several minutes each are listed as times up to here.
const separatelyListed = 12;

// Up to this many hours, or times, each get a window of their own.
const windowedEach = 2;

function hourLabel(hour: number, opts: Options): string {
  const half = opts.style.hour12;
  const part = lexicon.dayParts.filter(function begun(entry) {
    return half && entry.from <= hour;
  }).pop();

  return (part?.word ?? '') + (half && hour > noon ? hour - noon : hour);
}

function clock(
  hour: number,
  minute: number,
  second: Second,
  opts: Options
): string {
  const digits = [minute, second].filter(function isShown(value) {
    return value !== null;
  }) as number[];

  return [hourLabel(hour, opts), ...digits.map(twoDigits)].join(marks.colon);
}

// Every time the hours, minutes and seconds make, in order.
function times(
  t: Moment,
  hours: number[],
  minutes: number[],
  seconds: Second[]
): string {
  return hours.flatMap(function eachHour(hour) {
    return minutes.flatMap(function eachMinute(minute) {
      return seconds.map(function eachSecond(second) {
        return clock(hour, minute, second, t.opts);
      });
    });
  }).join(marks.list);
}

function instant(value: number): RangeDescription {
  return {from: value, kind: 'range', to: value};
}

// A closed window of time: its first moment and its last, both of which
// fire.
function window(
  hours: RangeDescription,
  minutes: RangeDescription,
  t: Moment
): string {
  return clock(hours.from, minutes.from, t.from, t.opts) + words.to +
    (hours.from > hours.to ? words.nextDay : '') +
    clock(hours.to, minutes.to, t.to, t.opts);
}

// Stretches with what happens in them said once, then stray values.
function spread(stretches: string[], lead: string, others: string[]): string {
  const filled = around('', stretches.join(marks.list), lead);

  return andLast([filled, others.join(marks.list)].filter(Boolean));
}

function leadOf(shape: Shape, each: string, unit: string): string {
  return shape.interval === 1 ? each : words.every + shape.interval + unit;
}

function secondLead(t: Moment): string {
  return leadOf(t.second, words.everySecond, units.second);
}

// A minute of the hour, with its second where one is carried.
function minutePoint(minute: number, second: Second): string {
  return twoDigits(minute) + units.minuteOfHour +
    (second === null ? '' : twoDigits(second) + units.second);
}

// Minutes inside the hour, or seconds inside the minute: runs, with what
// happens in them, and stray values. Positions are two digits, or ordinal
// after a phrase that counts occasions.
function within(
  shape: Shape,
  division: Division,
  ordinal: boolean,
  lead: string
): string {
  const {max} = scales.minute.domain;

  function name(value: number): string {
    return (ordinal ? words.nth + value : twoDigits(value)) + division.point;
  }

  function stretch(run: RangeDescription): string {
    if (shape.interval === 1 && run.from === 0) {
      return words.first + (run.to + 1) + division.span + words.within;
    }

    if (shape.interval === 1 && run.to === max) {
      return words.last + (max + 1 - run.from) + division.span + words.within;
    }

    return span(run, name, '');
  }

  return spread(ranges(shape).map(stretch), lead, strays(shape).map(name));
}

// Seconds taken out of every second: clock times inside one named
// minute, and otherwise seconds of every minute.
function secondGaps(t: Moment): string {
  const {removed} = t.second;
  const names = removed.map(function name(second) {
    return twoDigits(second) + units.second;
  }).join(marks.list);

  return t.hours.length * t.minutes.length === 1 ?
    times(t, t.hours, t.minutes, removed) :
    around(words.eachMinuteOf, names, '');
}

// The seconds after a time part that could not carry them: what happens
// on each occasion.
function eachTime(t: Moment): string {
  return marks.comma + (t.second.round ?
    words.eachTimeLasting + marks.comma + words.meanwhile + secondLead(t) +
      excepted([secondGaps(t)]) :
    words.eachTimeOf + within(t.second, secondOfMinute, true, secondLead(t)));
}

// The unbroken stretches of hours, ascending; a stretch that crosses
// midnight is one, and comes first, where it may be said to.
function runsOf(hours: number[], mayWrap: boolean): RangeDescription[] {
  const runs: RangeDescription[] = [];

  hours.forEach(function place(hour) {
    const current = runs[runs.length - 1];

    if (current && current.to === hour - 1) {
      current.to = hour;
    }
    else {
      runs.push(instant(hour));
    }
  });

  const [first] = runs;
  const last = runs[runs.length - 1];
  const {max, min} = scales.hour.domain;
  const joins = mayWrap && runs.length > 1 && first.from === min &&
    last.to === max;

  return joins ?
    [{from: last.from, kind: 'range', to: first.to}, ...runs.slice(1, -1)] :
    runs;
}

// Which cadences of hours can be said. On the hour, any; two hours only
// for the declared tie. Off the hour, only one with both ends named. Over
// a stretch, none. The odd and the even hours always have their names.
function sayableHours(form: HourForm, tie: boolean): Sayable {
  return function sayable(shape) {
    const [run] = ranges(shape);
    const spaced = shape.interval > 1 && !shape.alternate;
    const pair = spaced && run.to - run.from === shape.interval;

    return !spaced || form === 'points' && (!pair || tie) ||
      form === 'offset' && !shape.round;
  };
}

function hourFormOf(minutes: number[], single: boolean): HourForm {
  if (minutes.length > 1) {
    return 'spans';
  }

  return minutes[0] === 0 && !single ? 'points' : 'offset';
}

function anyShape(): boolean {
  return true;
}

function momentOf(facts: ScheduleFacts, opts: Options): Moment {
  const mayWrap = unrestricted(facts, ['date', 'weekday', 'month', 'year']);
  const hourSets = setsOf(facts, 'hour', mayWrap);
  const second = choose(setsOf(facts, 'second', false), scales.second,
    anyShape);
  const minute = choose(setsOf(facts, 'minute', false), scales.minute,
    anyShape);
  const seconds = valuesOf(setsOf(facts, 'second', false),
    scales.second.domain);
  const minutes = valuesOf(setsOf(facts, 'minute', false),
    scales.minute.domain);
  const hours = valuesOf(hourSets, scales.hour.domain);
  const quiet = seconds.length === 1 && seconds[0] === 0;
  const single = seconds.length === 1 && !quiet;
  const tie = quiet && facts.analyses.written.hour === 'cadence';
  const filled = second.round && minute.interval === 1 &&
    strays(minute).length === 0;
  const carried: Second = single ? seconds[0] : null;
  const fine = filled ?
    {
      from: 0,
      lead: leadOf(second, words.everySecond, units.second),
      ofHour: '',
      to: ranges(second)[0].to,
      wholeMinute: words.thisMinute
    } :
    {
      from: carried,
      lead: leadOf(minute, words.everyMinute, units.minute),
      ofHour: words.of,
      to: carried,
      wholeMinute: ''
    };

  return {
    ...fine,
    filled,
    hour: choose(hourSets, scales.hour,
      sayableHours(hourFormOf(minutes, single), tie)),
    hourRuns: runsOf(hours, mayWrap),
    hours,
    minute,
    minutes,
    opts,
    second,
    seconds,
    shown: quiet ? [null] : seconds,
    single,
    spaced: choose(hourSets, scales.hour, sayableHours('points', false))
      .interval > 1
  };
}

function hourName(t: Moment) {
  return function name(hour: number): string {
    return hourLabel(hour, t.opts) + units.hourNamed;
  };
}

function everyHour(): string {
  return words.every + units.hour;
}

// Hours taken out of the odd or the even hours, named beside them.
function namedGaps(t: Moment): string {
  return t.hour.alternate ?
    excepted([t.hour.removed.map(hourName(t)).join(marks.list)]) :
    '';
}

// Hours taken out of every hour, each as the window it would have filled.
function windowGaps(t: Moment): string {
  const hours = t.hour.alternate ? [] : t.hour.removed;

  return hours.map(function gap(hour) {
    return window(instant(hour), wholeHour, t);
  }).join(marks.list);
}

// Minutes taken out of every minute: clock times inside one named hour,
// and otherwise minutes of every hour. Under every second a missing
// minute is a whole minute, and is called one.
function minuteGaps(t: Moment): string {
  const {removed} = t.minute;
  const names = removed.map(function name(minute) {
    return minutePoint(minute, null);
  }).join(marks.list);

  return t.hours.length === 1 ?
    around('', times(t, t.hours, removed, [null]), t.wholeMinute) :
    around(everyHour() + t.ofHour, names, t.wholeMinute);
}

// Everything taken out of a filled stretch: hours, then minutes, then
// seconds where the seconds are what fills it.
function gaps(t: Moment): string {
  return excepted(
    [windowGaps(t), minuteGaps(t), t.filled ? secondGaps(t) : '']);
}

// The hours as the owner of the minutes named after them. Stretches of
// hours are windows from the first time that fires to the last; separate
// hours are named.
function owningHours(t: Moment): string {
  const firing: RangeDescription = {
    from: t.minutes[0],
    kind: 'range',
    to: t.minutes[t.minutes.length - 1]
  };
  const windows = t.hourRuns.map(function eachRun(run) {
    return window(run, firing, t);
  }).join(marks.list);

  if (t.hour.alternate) {
    return parity(t.hour, words.evenHours, words.oddHours) + namedGaps(t) +
      words.of;
  }

  if (ranges(t.hour).length > 0) {
    return (t.hour.round ? '' : windows) + everyHour() + words.of;
  }

  return t.hours.map(hourName(t)).join(marks.list) + words.slot + words.of;
}

// The hours as a confinement that is not a window: nothing for every
// hour, the odd or even hours, or separate hours by name.
function confiningHours(t: Moment): string {
  if (t.hour.round && !t.hour.alternate) {
    return '';
  }

  const names = t.hour.alternate ?
    parity(t.hour, words.evenHours, words.oddHours) :
    t.hours.map(hourName(t)).join(marks.list);

  return names + words.slot + words.within + namedGaps(t);
}

function roundTheClock(t: Moment): boolean {
  return t.hour.round || t.hour.alternate;
}

// One minute of the hour. Hours with ends to name are stretches of exact
// times; otherwise the hours go round the clock, as a cadence on the hour
// or as the owner of the minute.
function pointHours(t: Moment): TimeSaid {
  const [minute] = t.minutes;
  const onTheHour = minute === 0 && t.from === null;
  const idiom = t.hour.alternate && !onTheHour;
  const owner = idiom ?
    parity(t.hour, words.evenHours, words.oddHours) :
    everyHour();
  const whole = onTheHour ? words.everyHourOnTheHour : everyHour();
  const lead = leadOf(t.hour, whole, units.hour);
  const out = excepted([times(t, t.hour.removed, t.minutes, [t.from])]);

  if (!t.hour.round && !idiom) {
    return {
      allDay: false,
      text: spread(
        ranges(t.hour).map(function exact(run) {
          return window(run, instant(minute), t);
        }),
        lead,
        [times(t, strays(t.hour), t.minutes, [t.from])].filter(Boolean)
      ) + out
    };
  }

  return {
    allDay: true,
    text: (onTheHour ?
      lead :
      owner + words.of + minutePoint(minute, t.from)) + out
  };
}

// Several minutes of the hour named after the hours that own them.
function ownedMinutes(t: Moment, minutes: string): TimeSaid {
  return {
    allDay: roundTheClock(t),
    text: owningHours(t) + minutes + gaps(t)
  };
}

// Minutes that fill stretches of time. Minutes that go round the hour
// fill whole stretches of hours; a run inside the hour fills a window in
// each of one or two hours, and is otherwise owned by the hours.
function filledHours(t: Moment): TimeSaid {
  const whole = t.minute.round;
  const runs = whole ? t.hourRuns : t.hours.map(instant);
  const windowed = whole ?
    !roundTheClock(t) && (runs.length <= windowedEach ||
      runs.some(function long(run) {
        return run.from !== run.to;
      })) :
    t.hours.length <= windowedEach;
  const ofSecond = t.single ?
    words.of + within(t.second, secondOfMinute, true, '') :
    '';

  if (windowed) {
    return {
      allDay: false,
      text: spread(
        runs.flatMap(function eachRun(run) {
          return ranges(t.minute).map(function eachStretch(stretch) {
            return window(run, stretch, t);
          });
        }),
        t.lead,
        [times(t, t.hours, strays(t.minute), [t.from])].filter(Boolean)
      ) + gaps(t)
    };
  }

  if (!whole) {
    const owned =
      ownedMinutes(t, within(t.minute, minuteOfHour, false, t.lead));

    return {...owned, text: owned.text + (t.single ? eachTime(t) : '')};
  }

  return {
    allDay: roundTheClock(t),
    text: confiningHours(t) + t.lead + ofSecond + gaps(t)
  };
}

// Exact times, listed. Seconds are listed with them while the list stays
// short; a run of seconds is a window on each of one or two times; and
// otherwise the seconds follow as what happens each time.
function listedTimes(t: Moment): string {
  const count = t.hours.length * t.minutes.length;
  const stretches = ranges(t.second);

  if (stretches.length > 0 && count <= windowedEach) {
    return spread(
      t.hours.flatMap(function eachHour(hour) {
        return t.minutes.flatMap(function eachMinute(minute) {
          return stretches.map(function eachStretch(stretch) {
            return clock(hour, minute, stretch.from, t.opts) + words.to +
              clock(hour, minute, stretch.to, t.opts);
          });
        });
      }),
      secondLead(t),
      [times(t, t.hours, t.minutes, strays(t.second))].filter(Boolean)
    ) + excepted([secondGaps(t)]);
  }

  if (stretches.length === 0 &&
      count * t.seconds.length <= listedToTheSecond) {
    return times(t, t.hours, t.minutes, t.shown);
  }

  return times(t, t.hours, t.minutes, [null]) + eachTime(t);
}

// Whether the minutes and hours are said as a list of exact times: one
// minute of separate hours, or several minutes of a few separate hours
// that are not evenly spaced.
function isListed(t: Moment): boolean {
  const count = t.hours.length * t.minutes.length;

  return ranges(t.minute).length === 0 && ranges(t.hour).length === 0 &&
    (t.minutes.length === 1 || count <= separatelyListed && !t.spaced);
}

function hoursAndMinutes(t: Moment): TimeSaid {
  if (t.minutes.length === 1) {
    return pointHours(t);
  }

  if (ranges(t.minute).length > 0) {
    return filledHours(t);
  }

  return ownedMinutes(t, t.minutes.map(function point(minute) {
    return minutePoint(minute, t.from);
  }).join(marks.list));
}

// Whether the time is a few exact times, which are always listed. Hours
// said as a cadence with no ends are not times to list.
function isFew(t: Moment): boolean {
  const count = t.seconds.length * t.minutes.length * t.hours.length;

  return t.minutes.length <= scales.minute.domain.max &&
    t.hours.length <= scales.hour.domain.max && count <= alwaysListed &&
    !t.hour.round;
}

// Seconds that are neither zero nor continuous, where no time of day is
// named for them to follow: they are said of every minute, or, as a run
// inside minute 0, of every hour. Empty when that is not so.
function secondsAlone(t: Moment): string {
  const anchored = t.shown[0] !== null && !t.second.round;
  const everyMinute = t.minutes.length > scales.minute.domain.max;
  const hourly = t.minutes.length === 1 && t.minutes[0] === 0 &&
    ranges(t.second).length > 0;
  const said = within(t.second, secondOfMinute, false, secondLead(t));

  if (!anchored || t.hours.length <= scales.hour.domain.max ||
      !everyMinute && !hourly) {
    return '';
  }

  return (everyMinute ? words.eachMinuteOf : everyHour() + words.of) + said;
}

/** The time part of a description. */
function describeTime(facts: ScheduleFacts, opts: Options): TimeSaid {
  const t = momentOf(facts, opts);
  const alone = secondsAlone(t);

  if (isFew(t)) {
    return {allDay: false, text: times(t, t.hours, t.minutes, t.shown)};
  }

  if (alone) {
    return {allDay: true, text: alone};
  }

  if (isListed(t)) {
    return {allDay: false, text: listedTimes(t)};
  }

  const said = hoursAndMinutes(t);
  const carried = t.shown[0] === null || t.filled || t.single;

  return {...said, text: said.text + (carried ? '' : eachTime(t))};
}

export {describeTime};
