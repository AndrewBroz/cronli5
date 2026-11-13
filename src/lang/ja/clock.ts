// The time part: seconds, minutes and hours said together. The rest of the
// time is chosen from the minutes and the hours first, by the way the
// minutes are arranged; the seconds then ride on it, fill it, or follow it.

import type {Domain} from '../../core/schedule.js';
import {denote} from '../../core/describe-set.js';
import lexicon from './lexicon.js';
import type {JapaneseStyle} from './options.js';
import {bracketed, leftOut, listOf, saySpread, when} from './phrases.js';
import type {
  Cadence, Core, Described, Piece, Plain, Say, Spread
} from './sets.js';
import {
  cost, gather, inOrder, lift, match, paced, pick, spreadOf, stepsOf, tiling,
  trails, wraps
} from './sets.js';

const {marks, twoDigits, units, words} = lexicon;

/**
 * How a time begins, which decides what joins it to the day before it: a
 * clock time or a named hour, 毎時 or 毎分, the even or odd hours, or a
 * cadence that runs through every hour.
 */
export type TimeKind = 'allDay' | 'clock' | 'hourly' | 'rule';

/** The time part, and whether it runs through every hour. */
export interface TimePart {
  everyHour: boolean;
  kind: TimeKind;
  text: string;
}

/** The values the time fields fire on, and whether the hours may wrap. */
export interface TimeFacts {
  hours: number[];
  minutes: number[];
  seconds: number[];
  wrap: boolean;
}

// A field of the time as it is said: the description it is taken from,
// the values left out of that, and the interval it tiles its cycle by.
interface Facet {
  core: Core;
  count: number;
  domain: Domain;
  dropped: number[];
  picked: ReturnType<typeof pick>;
  tile: number;
  values: number[];
}

interface Clock {
  hours: Facet;
  listed: boolean;
  minutes: Facet;
  seconds: Facet;
  // The hours as stretches, whatever the minutes are.
  stretches: Facet;
  style: JapaneseStyle;
}

// How the seconds bear on the rest: one second rides on every time named,
// a cadence of seconds fills every run to its last second, and seconds as
// positions need the minutes named as positions too. Wherever seconds are
// said inside the minute, a minute named is a stretch and not a moment.
interface Mode {
  fill: number;
  positions: boolean;
  second: number | null;
  stretch: boolean;
}

// A way of saying the time, before its exceptions are gathered.
interface Rest {
  body: string;
  dropped: string[];
  kind: TimeKind;
  // What joins it to seconds said as positions after it.
  link: string;
  // Whether it ends in stray values after 、および.
  trails: boolean;
}

// The hours a time is confined to, and what joins each kind of minute
// phrase to them.
interface Confinement {
  bare: string;
  dropped: number[];
  each: string;
  every: boolean;
  kind: TimeKind;
  named: string;
  text: string;
}

interface Way<Given extends unknown[], Said> {
  fits: (...given: Given) => boolean;
  say: (...given: Given) => Said;
}

const plainly: Mode = {
  fill: 0, positions: false, second: null, stretch: false
};

// What several times before it share, each of them.
const shared = marks.comma + words.eachOne;

const hourSeconds = 3600;
const noon = 43200;
const minuteSeconds = 60;

// The most minutes or seconds named one by one, and the most hours named
// as stretches.
const mostPositions = 7;
const mostStretches = 8;

// The most clock times listed whatever else could be said.
const mostTimes = 4;

const lastOfSixty = 59;

// Minutes and seconds. The first and the last of them are never named as
// left out: a window would name the moment and then take it away.
const fine: Say = {
  cadence: () => 2,
  domain: {cyclic: false, max: lastOfSixty, min: 0},
  exceptions: true,
  mixed: 'apart',
  removable: (value) => value > 0 && value < lastOfSixty,
  shortestRange: 3
};

function sizeOf(domain: Domain): number {
  return domain.max - domain.min + 1;
}

// Every second hour, too many of them to name: said by its rule.
function isRule(cadence: Cadence): boolean {
  return cadence.interval === 2 && stepsOf(cadence) > mostStretches;
}

// A cadence of hours as stretches names each hour, unless it is a rule.
function stretchCost(cadence: Cadence): number {
  return [stepsOf(cadence), 2][Number(isRule(cadence))];
}

// The hours as points on the clock (where runs and cadences may be said
// together), as stretches filled by the minutes (where a run of two is
// one window), and as stretches minutes are named inside.
function hourSays(wrap: boolean): {[use: string]: Say} {
  const domain = {cyclic: wrap, max: 23, min: 0};
  const stretches = {
    cadence: stretchCost, domain, exceptions: true, mixed: 'never' as const,
    shortestRange: 3
  };

  return {
    filled: {...stretches, shortestRange: 2},
    points: {...stretches, cadence: () => 2, mixed: 'apart' as const},
    stretches
  };
}

function facetOf(values: number[], say: Say): Facet {
  const picked = pick(values, say);
  const exception = picked as Partial<Described<'except'>>;
  const core = (exception.base ?? picked) as Core;

  return {
    core,
    count: values.length,
    domain: say.domain,
    dropped: exception.removed ?? [],
    picked,
    tile: tiling(denote(core, say.domain), sizeOf(say.domain)),
    values
  };
}

// A field with one value is part of every clock time and names nothing
// more.
function named(facet: Facet, say: Say): number {
  return Number(facet.count > 1) * cost(facet.picked, say);
}

function clockOf(facts: TimeFacts, style: JapaneseStyle): Clock {
  const says = hourSays(facts.wrap);
  const minutes = facetOf(facts.minutes, fine);
  const use = minutes.count === 1 && 'points' ||
    minutes.tile > 0 && 'filled' || 'stretches';
  const hours = facetOf(facts.hours, says[use]);
  const times = minutes.count * hours.count;

  return {
    hours,
    // A list of clock times wins a tie with any other way of saying them.
    listed: minutes.count < sizeOf(fine.domain) &&
      hours.count < sizeOf(says[use].domain) && (times <= mostTimes ||
      times <= named(minutes, fine) + named(hours, says[use])),
    minutes,
    seconds: facetOf(facts.seconds, fine),
    stretches: facetOf(facts.hours, says.stretches),
    style
  };
}

// 午前 or 午後 and the hour as that half of the day counts it.
function hourOf(hour: number, style: JapaneseStyle): string {
  const half = [words.am, words.pm][Math.floor(hour / 12)];

  return style.hour12 ? half + hour % 12 : String(hour);
}

// A moment of the day, counted in seconds, as a time. With a colon the
// minutes always show; with units a minute of zero shows only beside
// seconds. On the 12-hour clock twelve in the day is 正午, unless seconds
// show.
function sayClock(
  moment: number,
  precise: boolean,
  style: JapaneseStyle
): string {
  if (style.hour12 && !precise && moment === noon) {
    return words.noon;
  }

  const hour = hourOf(Math.floor(moment / hourSeconds), style);
  const minute = Math.floor(moment / minuteSeconds) % minuteSeconds;
  const second = moment % minuteSeconds;
  const colon = hour + marks.colon + twoDigits(minute) +
    when(precise, marks.colon + twoDigits(second));
  const kanji = hour + units.hour +
    when(precise || minute > 0, minute + units.minute) +
    when(precise, second + units.second);

  return style.kanjiTime ? kanji : colon;
}

// An hour as a stretch: 9時台.
function sayStretch(hour: number, style: JapaneseStyle): string {
  return hourOf(hour, style) + units.hourStretch;
}

// A position in the hour, counted in seconds: 5分, or 5分8秒.
function sayMinute(position: number, precise: boolean): string {
  return Math.floor(position / minuteSeconds) + units.minute +
    when(precise, position % minuteSeconds + units.second);
}

function isPrecise(mode: Mode): boolean {
  return mode.fill > 0 || mode.second !== null;
}

// The seconds a run of minutes starts and stops on.
function edgesOf(mode: Mode): [number, number] {
  const first = mode.second ?? 0;

  return [first, mode.fill > 0 ? minuteSeconds - mode.fill : first];
}

function unitOf(mode: Mode): string {
  return mode.fill > 0 ? units.second : units.minute;
}

function clockSayer(clock: Clock, mode: Mode): (moment: number) => string {
  return (moment) => sayClock(moment, isPrecise(mode), clock.style);
}

// A minute left out is a whole minute where seconds are said inside it,
// and is called one.
function wholeMinute(mode: Mode): string {
  return when(mode.stretch, words.of + words.forOneMinute);
}

// The minutes left out, as clock times where every window is one hour and
// as minutes of every hour otherwise.
function minuteDrops(clock: Clock, mode: Mode, asTimes: boolean): string {
  const {dropped} = clock.minutes;
  const whole = wholeMinute(mode);
  const times = clock.hours.values.flatMap((hour) => dropped.map(
    (minute) => sayClock(hour * hourSeconds + minute * minuteSeconds, false,
      clock.style)));
  const minutes = dropped.map(
    (minute) => words.everyHour + minute + units.minute);

  return listOf((asTimes ? times : minutes).map((item) => item + whole));
}

function stretchDrops(hours: number[], clock: Clock): string {
  return listOf(hours.map((hour) => sayStretch(hour, clock.style)));
}

// The clock times themselves.
function listForm(clock: Clock, mode: Mode): Rest {
  const say = clockSayer(clock, mode);
  const times = clock.hours.values.flatMap((hour) => clock.minutes.values.map(
    (minute) => hour * hourSeconds + minute * minuteSeconds +
      (mode.second ?? 0)));

  return {
    body: listOf(times.map(say)),
    dropped: [],
    kind: 'clock',
    link: words.of,
    trails: false
  };
}

// One minute at several hours: the hours are points on the clock.
function pointsForm(clock: Clock, mode: Mode): Rest {
  const say = clockSayer(clock, mode);
  const at = clock.minutes.values[0] * minuteSeconds + (mode.second ?? 0);
  const spread = lift(spreadOf(clock.hours.core, clock.hours.domain, 0),
    hourSeconds, [at, at], false);

  return {
    body: saySpread(spread, say, units.hourLength, words.nextDay),
    dropped: [listOf(clock.hours.dropped.map(
      (hour) => say(hour * hourSeconds + at) + wholeMinute(mode)))],
    kind: 'clock',
    link: words.of,
    trails: trails(spread)
  };
}

function spans(hours: Facet): boolean {
  return hours.core.kind === 'range' || hours.core.kind === 'pieces';
}

// A cadence of minutes filling stretches of hours: each stretch is a
// window from its first moment to its last.
function windowForm(clock: Clock, mode: Mode): Rest {
  const [first, last] = edgesOf(mode);
  const end = (minuteSeconds - clock.minutes.tile) * minuteSeconds + last;
  const spread = lift(
    spreadOf(clock.hours.core, clock.hours.domain, Infinity),
    hourSeconds, [first, end], true);

  return {
    body: saySpread(paced(spread, mode.fill || clock.minutes.tile),
      clockSayer(clock, mode), unitOf(mode), words.nextDay),
    dropped: [
      stretchDrops(clock.hours.dropped, clock),
      minuteDrops(clock, mode, !spans(clock.hours))
    ],
    kind: 'clock',
    link: words.of,
    trails: trails(spread)
  };
}

// Minutes arranged inside one hour or two: windows and times on the clock.
function hourForm(clock: Clock, mode: Mode): Rest {
  const within = lift(spreadOf(clock.minutes.core, fine.domain, 0),
    minuteSeconds, edgesOf(mode), mode.fill > 0);
  const spread = gather(within,
    clock.hours.values.map((hour) => hour * hourSeconds));

  return {
    body: saySpread(paced(spread, mode.fill), clockSayer(clock, mode),
      unitOf(mode)),
    dropped: [minuteDrops(clock, mode, true)],
    kind: 'clock',
    link: words.of,
    trails: trails(spread)
  };
}

function everyHour(hours: Facet): Confinement {
  return {
    bare: '',
    dropped: hours.dropped,
    each: '',
    every: true,
    kind: 'hourly',
    named: words.everyHour,
    text: ''
  };
}

// Separate hours, each named once as a stretch.
function namedHours(hours: number[], clock: Clock): Confinement {
  return {
    bare: marks.comma,
    dropped: [],
    each: words.of,
    every: false,
    kind: 'clock',
    named: words.of,
    text: stretchDrops(hours, clock)
  };
}

// Runs of hours, each from its first stretch to its last.
function spanOf(parts: Piece[], hours: Facet, clock: Clock): Confinement {
  function say(hour: number): string {
    return sayStretch(hour, clock.style);
  }

  return {
    ...namedHours([], clock),
    dropped: hours.dropped,
    named: marks.comma + words.everyHour,
    text: parts.map((part) => match(part, {
      range: (range) => say(range.from) + words.from +
        when(wraps(range), words.nextDay) + say(range.to) + words.to,
      values: (list) => listOf(list.values.map(say))
    })).join(words.and)
  };
}

// Every second hour by its rule, with its first hours and its last in
// brackets, its ends first where it does not cover the day, and an hour
// taken out of it in front.
function ruleOf(cadence: Cadence, hours: Facet, clock: Clock): Confinement {
  function say(hour: number): string {
    return sayStretch(hour, clock.style);
  }
  const whole = cadence.start < cadence.interval &&
    cadence.last + cadence.interval > hours.domain.max;
  const ends = say(cadence.start) + words.from + say(cadence.last) +
    words.to + words.of;

  return {
    ...namedHours([], clock),
    bare: words.runsAt,
    kind: 'rule',
    text: leftOut([stretchDrops(hours.dropped, clock)]) + when(!whole, ends) +
      [words.evenHours, words.oddHours][cadence.start % 2] + marks.open +
      listOf([say(cadence.start), say(cadence.start + cadence.interval)]) +
      marks.ellipsis + say(cadence.last) + marks.close
  };
}

// Hours as stretches are never said as runs and cadences together.
function confinementOf(hours: Facet, clock: Clock): Confinement {
  return match<Plain, Confinement>(hours.core as Plain, {
    all: () => everyHour(hours),
    cadence(cadence) {
      return isRule(cadence) ?
        ruleOf(cadence, hours, clock) :
        namedHours(hours.values, clock);
    },
    pieces: (pieces) => spanOf(inOrder(pieces.parts), hours, clock),
    range: (range) => spanOf([range], hours, clock),
    values: () => namedHours(hours.values, clock)
  });
}

function isBare(mode: Mode): boolean {
  return !mode.positions && mode.second === null;
}

// The minutes after the hours they are confined to: the interval alone,
// 毎分 where every minute fires and seconds follow, or the minutes named
// as positions in the hour.
const minuteWays: Array<Way<[Clock, Mode, Confinement], Rest>> = [
  {
    fits: (clock, mode, hours) => clock.minutes.tile > 0 && isBare(mode) &&
      (hours.every || clock.minutes.count > mostPositions),
    say: (clock, mode, hours) => ({
      body: hours.text + hours.bare + (mode.fill || clock.minutes.tile) +
        unitOf(mode) + words.each,
      dropped: [minuteDrops(clock, mode, false)],
      kind: hours.every && 'allDay' || hours.kind,
      link: words.of,
      trails: false
    })
  },
  {
    fits: (clock) => clock.minutes.core.kind === 'all',
    say: (clock, mode, hours) => ({
      body: hours.text + hours.each + words.everyMinute +
        when(mode.second !== null, mode.second + units.second),
      dropped: [minuteDrops(clock, mode, false)],
      kind: hours.kind,
      link: '',
      trails: false
    })
  },
  {
    fits: () => true,
    say(clock, mode, hours) {
      // A cadence of few minutes is named minute by minute, as it fires.
      const listing = clock.minutes.tile > 0 && isBare(mode);
      const spread = listing ?
        spreadOf({kind: 'values', values: clock.minutes.values},
          fine.domain, 0) :
        spreadOf(clock.minutes.core, fine.domain, mostPositions);
      const lifted = lift(spread, minuteSeconds, edgesOf(mode),
        mode.fill > 0);

      return {
        body: hours.text + hours.named + saySpread(
          paced(lifted, mode.fill),
          (position) => sayMinute(position, isPrecise(mode)), unitOf(mode)),
        dropped: [when(!listing, minuteDrops(clock, mode, false))],
        kind: hours.kind,
        // After a stray minute, what follows is shared by all of them.
        link: trails(lifted) ? shared : words.of,
        trails: trails(lifted)
      };
    }
  }
];

// The hours as stretches, or every hour, and the minutes after them.
function stretchForm(clock: Clock, mode: Mode): Rest {
  const hours = mode.positions ? clock.stretches : clock.hours;
  const confinement = confinementOf(hours, clock);
  const said = minuteWays.find(
    (way) => way.fits(clock, mode, confinement)) as (typeof minuteWays)[0];
  const rest = said.say(clock, mode, confinement);
  const at = clock.minutes.values[0] * minuteSeconds + (mode.second ?? 0);
  // An hour left out is a moment where one minute fires in each hour, and
  // a stretch where the hours are filled.
  const hoursOut = clock.minutes.count === 1 ?
    listOf(confinement.dropped.map((hour) => clockSayer(clock, mode)(
      hour * hourSeconds + at) + wholeMinute(mode))) :
    stretchDrops(confinement.dropped, clock);

  return {...rest, dropped: [hoursOut, ...rest.dropped]};
}

// The rest of the time, without regard to the seconds but for the mode
// they put it in.
const restWays: Array<Way<[Clock, Mode], Rest>> = [
  {
    fits: (clock, mode) => clock.listed && !mode.positions,
    say: listForm
  },
  {
    fits: (clock, mode) => mode.positions ||
      clock.hours.core.kind === 'all',
    say: stretchForm
  },
  {
    fits: (clock) => clock.minutes.count === 1,
    say: pointsForm
  },
  {
    fits: (clock) => clock.minutes.tile > 0 &&
      (clock.hours.count <= 2 || spans(clock.hours)),
    say: windowForm
  },
  {
    // Minutes with intervals of their own are said once, not hour by hour.
    fits: (clock) => clock.minutes.tile === 0 && clock.hours.count <= 2 &&
      clock.minutes.core.kind !== 'values' && (clock.hours.count === 1 ||
      clock.minutes.core.kind !== 'cadencePieces'),
    say: hourForm
  },
  {
    fits: () => true,
    say: stretchForm
  }
];

function restOf(clock: Clock, mode: Mode): Rest {
  const way = restWays.find(
    (candidate) => candidate.fits(clock, mode)) as (typeof restWays)[0];

  return way.say(clock, mode);
}

// The seconds as positions in the minute: listed, or with both ends.
function secondSpread(clock: Clock): Spread {
  return spreadOf(clock.seconds.core, fine.domain, mostPositions);
}

function secondPositions(clock: Clock): string {
  return saySpread(secondSpread(clock), (second) => second + units.second,
    units.second);
}

function secondDrops(clock: Clock): string {
  return listOf(clock.seconds.dropped.map(
    (second) => words.everyMinute + second + units.second));
}

// The interval a cadence of seconds with nothing left out tiles by.
function evenSeconds(clock: Clock): number {
  return Number(clock.seconds.dropped.length === 0) * clock.seconds.tile;
}

// For one minute after a single occasion; a minute for each of several,
// which after a stray time is said of them all.
function forOneMinute(clock: Clock, rest: Rest): string {
  const once = clock.minutes.count === 1 &&
    (clock.hours.count === 1 || clock.hours.core.kind === 'all');

  return once ?
    words.fromThen + words.forOneMinute + marks.comma :
    (rest.trails ? shared : words.runsAt) + words.forOneMinute +
      words.eachGets + marks.comma + words.allTheWhile;
}

// Seconds arranged inside one clock time: windows and times to the second.
function insideOneMinute(clock: Clock): Rest {
  const at = clock.hours.values[0] * hourSeconds +
    clock.minutes.values[0] * minuteSeconds;
  const say = clockSayer(clock, {...plainly, fill: 1});
  const spread = gather(spreadOf(clock.seconds.core, fine.domain, 0), [at]);

  return {
    body: saySpread(spread, say, units.second),
    dropped: [listOf(clock.seconds.dropped.map((second) => say(at + second)))],
    kind: 'clock',
    link: words.of,
    trails: trails(spread)
  };
}

// The rest in a mode, and seconds as positions after it.
function withPositions(clock: Clock, mode: Mode): Rest {
  const rest = restOf(clock, mode);

  return {
    ...rest,
    body: rest.body + rest.link + secondPositions(clock),
    dropped: [...rest.dropped, secondDrops(clock)],
    trails: trails(secondSpread(clock))
  };
}

// How the seconds are said with the rest, by cases in this order.
const secondWays: Array<Way<[Clock], Rest>> = [
  {
    // Second zero is silent.
    fits: (clock) => clock.seconds.count === 1 &&
      clock.seconds.values[0] === 0,
    say: (clock) => restOf(clock, plainly)
  },
  {
    // Every minute of every hour: the seconds are all there is to say.
    fits: (clock) => clock.minutes.count === sizeOf(fine.domain) &&
      clock.hours.picked.kind === 'all',
    say: (clock) => ({
      body: clock.seconds.tile > 0 ?
        clock.seconds.tile + units.second + words.each :
        words.everyMinute + secondPositions(clock),
      dropped: [secondDrops(clock)],
      kind: clock.seconds.tile > 0 && 'allDay' || 'hourly',
      link: words.of,
      trails: clock.seconds.tile === 0 && trails(secondSpread(clock))
    })
  },
  {
    // One second rides on whatever names the minute.
    fits: (clock) => clock.seconds.count === 1,
    say: (clock) => restOf(clock, {
      ...plainly, second: clock.seconds.values[0]
    })
  },
  {
    // A few clock times to the second are listed.
    fits: (clock) => clock.seconds.count * clock.minutes.count *
      clock.hours.count <= mostTimes,
    say: (clock) => ({
      body: listOf(clock.hours.values.flatMap(
        (hour) => clock.minutes.values.flatMap(
          (minute) => clock.seconds.values.map((second) => sayClock(
            hour * hourSeconds + minute * minuteSeconds + second, true,
            clock.style))))),
      dropped: [],
      kind: 'clock',
      link: words.of,
      trails: false
    })
  },
  {
    // A cadence of seconds takes the place of every minute in a run.
    fits: (clock) => evenSeconds(clock) > 0 && !clock.listed &&
      ['all', 'range', 'pieces'].includes(clock.minutes.core.kind),
    say: (clock) => restOf(clock, {
      ...plainly, fill: evenSeconds(clock), stretch: true
    })
  },
  {
    // A longer cadence of seconds runs for one minute after the rest.
    fits: (clock) => evenSeconds(clock) > 0 &&
      clock.seconds.count > mostTimes,
    say(clock) {
      const rest = restOf(clock, {...plainly, stretch: true});

      return {
        ...rest,
        body: rest.body + forOneMinute(clock, rest) + evenSeconds(clock) +
          units.second + words.each,
        trails: false
      };
    }
  },
  {
    fits: (clock) => clock.minutes.count === 1 && clock.hours.count === 1,
    say: insideOneMinute
  },
  {
    // Three clock times or more: the times, then the seconds.
    fits: (clock) => clock.listed &&
      clock.minutes.count * clock.hours.count > 2,
    say: (clock) => withPositions(clock, {...plainly, stretch: true})
  },
  {
    fits: () => true,
    say: (clock) => withPositions(clock, {
      ...plainly, positions: true, stretch: true
    })
  }
];

/** The time part of the sentence. */
function timePart(facts: TimeFacts, style: JapaneseStyle): TimePart {
  const clock = clockOf(facts, style);
  const way = secondWays.find(
    (candidate) => candidate.fits(clock)) as (typeof secondWays)[0];
  const said = way.say(clock);

  // What is left out follows in brackets, but stands in front where the
  // time ends in a stray value the brackets would be read with alone.
  return {
    everyHour: clock.hours.core.kind === 'all',
    kind: said.kind,
    text: said.trails ?
      leftOut(said.dropped) + said.body :
      said.body + bracketed(said.dropped)
  };
}

export {timePart};
