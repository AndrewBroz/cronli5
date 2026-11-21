// The time part of the sentence: the minutes and hours said together as
// clock times, windows and cadences, then the seconds, then whatever is
// excepted, which always comes last.

import type {Analyses, Field} from '../../core/schedule.js';
import type {Cadence, Chosen, Plain, Rules} from './sets.js';
import type {Led} from './phrases.js';
import type {PortugueseStyle} from './options.js';
import {at, fromTo, hourName, hourNumbers, timeOf} from './clock.js';
import {choose, firesOn, partsOf, steps, stretchesOf, withEnds}
  from './sets.js';
import {continuous, numbered, stretch, tiles} from './stretch.js';
import {counted, led, list, spaced} from './phrases.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';

const {articles, contractions, units, words} = lexicon;

// Up to this many moments in a day are always listed.
const fewMoments = 4;

// The longest list said in place of a cadence that needs its ends named.
const longestList = 7;

// More runs of hours than this, under minutes that fill them, are not a
// window each: the hours are named once.
const mostRunsWindowed = 2;

// The hours of a day.
const dayLength = 24;

// A cadence of hours that tiles the day from midnight is said as its step
// from this many hours.
const fewestTiling = 3;

// A run of hours through midnight is one run only when it is no longer
// than this: a longer one reads backwards.
const halfDay = 12;

// No seconds, for a time written to the minute.
const noSeconds: number[] = [];

// The last minute of an hour, and the last second of a minute.
const lastOfSixty = 59;

const eachHour = `${words.each} ${units.hour.one}`;
const eachMinute = `${words.each} ${units.minute.one}`;
const eachSecond = `${words.each} ${units.second.one}`;
const ofEachHour = `${words.ofEach} ${units.hour.one}`;
const ofEachMinute = `${words.ofEach} ${units.minute.one}`;

// What the time part is built from, and how its times are to be written.
interface Moments {
  // Whether the hours are a cadence that tiles the day, said as its step.
  bare: boolean;
  // Whether minute 0 of every hour may be said as «em ponto», which
  // promises second 0.
  dot: boolean;
  // The seconds written into the first and the last time of a window;
  // none when times are written to the minute.
  ends: Array<number | undefined>;
  // What leads a stretch of minutes: «a cada minuto», or the seconds said
  // in its place.
  every: string;
  hours: Chosen;
  minutes: Chosen;
  // The one second that is not zero, when the seconds are that.
  second: number | undefined;
  seconds: Chosen;
  style: PortugueseStyle;
}

// A time part as said so far.
interface Said {
  // Whether it begins with a clock time.
  clock: boolean;
  ends: Array<number | undefined>;
  // Whether every moment is a named clock time or a step between two, so
  // that one second can ride in the times.
  rides: boolean;
  text: string;
}

// One way of saying the time, and when it is the one to use.
interface Form {
  say(c: Moments): Said;
  when(c: Moments): boolean;
}

type ByHours<Result> = {[Kind in Plain['kind']]: Result};

function saying(c: Moments, text: string, rides: boolean, clock = false): Said {
  return {clock, ends: c.ends, rides, text};
}

function firstMatch(forms: Form[], c: Moments): Said {
  const form = forms.find((candidate) => candidate.when(c)) as Form;

  return form.say(c);
}

function moment(c: Moments, hour: number, minute: number): Led {
  return at(timeOf(hour, minute, c.ends[0], c.style));
}

// A window between two moments, each an hour and a minute.
function window(c: Moments, start: number[], finish: number[]): string {
  return fromTo(
    timeOf(start[0], start[1], c.ends[0], c.style),
    timeOf(finish[0], finish[1], c.ends[1], c.style));
}

// A window over a run of hours, from its first moment to its last.
function across(c: Moments, run: number[]): string {
  return window(c, [run[0], c.minutes.first], [run[1], c.minutes.last]);
}

function few(c: Moments): boolean {
  return !c.bare &&
    c.hours.values.length * c.minutes.values.length <= fewMoments;
}

function momentCount(c: Moments): number {
  return c.hours.values.length * c.minutes.values.length *
    c.seconds.values.length;
}

// Every clock time, listed.
function listed(c: Moments): Said {
  return saying(c, led(c.hours.values.flatMap(
    (hour) => c.minutes.values.map((minute) => moment(c, hour, minute)))),
  true, true);
}

// One window for each run of hours.
function windows(c: Moments): string {
  return list(stretchesOf(c.hours.said, domainOf('hour'))
    .map((run) => across(c, run)));
}

// Whether a cadence of hours tiles the day: its step divides the day and
// its first hour lies inside the first step, so the gap across midnight is
// the step too.
function tilesTheDay(cadence: Cadence): boolean {
  return cadence.start < cadence.interval &&
    steps(cadence) * cadence.interval === dayLength;
}

// The step of a cadence of hours, «de 2 em 2 horas», and where it starts
// when that is not midnight, written to the hour: «a partir da 01:00».
function hourStep(c: Moments, start: boolean): string {
  const said = c.hours.said as Cadence;
  const time = timeOf(said.start, 0, noSeconds[0], c.style);
  const from = `${words.startingFrom} ` +
    `${contractions.de[time.number][time.gender]} ${time.text}`;

  return spaced([
    `${words.from} ${said.interval} ${words.in} ` +
      counted(said.interval, units.hour),
    start && said.start > 0 && from
  ]);
}

// «Nas horas pares» or «nas horas ímpares», by the first hour.
function parityHours(start: number): string {
  return `${contractions.em.plural.feminine} ${units.hour.many} ` +
    (start % 2 === 1 ? words.theOdd : words.theEven);
}

// Stretches on a cadence of hours that tiles the day: every second hour by
// its number being even or odd, any other step as the whole of each hour
// it names.
function stretchHours(c: Moments): string {
  const said = c.hours.said as Cadence;

  return said.interval === 2 ?
    parityHours(said.start) :
    `${words.during} ${words.wholeHour}, ${hourStep(c, true)}`;
}

// Whether the hours are named once, as the hours the minutes fall in:
// separate hours, or a cadence that does not tile the day, with no hole,
// and no more than could be listed, unless they are all separate or every
// second hour.
function namesHours(c: Moments): boolean {
  const {said, removed, values} = c.hours;

  return !c.bare && removed.length === 0 &&
    ['cadence', 'pieces', 'values'].includes(said.kind) &&
    (values.length <= longestList || said.kind === 'values' ||
      said.kind === 'cadence' && said.interval === 2);
}

// The hours the minutes fall in, named once: «nas horas 1, 4, 9, 14 e 18»;
// every second hour, too many to list, by parity and its first and last
// hour, «nas horas ímpares de 5 a 23».
function hourFrame(c: Moments): string {
  const {said, values} = c.hours;

  return values.length > longestList && said.kind === 'cadence' ?
    `${parityHours(said.start)} ${words.from} ` +
      `${hourName(said.start, c.style)} ${words.to} ` +
      hourName(said.last, c.style) :
    `${contractions.em.plural.feminine} ${units.hour.many} ` +
      hourNumbers(values, c.style);
}

// Whether a stretch of minutes in each hour is said as the hours named
// once, rather than a window for each run of hours.
function framed(c: Moments): boolean {
  return namesHours(c) &&
    stretchesOf(c.hours.said, domainOf('hour')).length > mostRunsWindowed;
}

// Hours that are not one run, confining a stretch of minutes: the step
// where it tiles the day, and otherwise the hours named once, or a window
// for each run of them.
function separateHours(c: Moments): string {
  if (c.bare) {
    return stretchHours(c);
  }

  return framed(c) ? hourFrame(c) : windows(c);
}

// What confines a stretch of minutes to the hours it runs in.
const confinements: ByHours<(c: Moments) => string> = {
  all: () => '',
  cadence: separateHours,
  pieces: separateHours,
  range: windows,
  values: separateHours
};

function confinement(c: Moments): string {
  return confinements[c.hours.said.kind](c);
}

// One minute of every hour.
function everyHour(c: Moments): Said {
  const [minute] = c.minutes.values;

  return saying(c, minute === 0 && c.dot ?
    `${eachHour}, ${words.onTheDot}` :
    `${numbered([minute], units.minute)} ${ofEachHour}`, false);
}

// One minute of a piece of the hours: a run, a cadence with its two ends,
// or stray hours as clock times.
const hourPiece = {
  cadence: (c: Moments, part: Cadence) => [{
    lead: `${words.each} ${counted(part.interval, units.hour)}`,
    text: across(c, [part.start, part.last])
  }],
  range: (c: Moments, part: {from: number; to: number}) =>
    [{lead: eachHour, text: across(c, [part.from, part.to])}],
  values: (c: Moments, part: {values: number[]}) =>
    part.values.map((hour) => moment(c, hour, c.minutes.values[0]))
};

// One minute of runs of hours and of stray hours, each with its own lead.
function hourPieces(c: Moments): Said {
  const parts = partsOf(c.hours.said);

  return saying(c, led(parts.flatMap(
    (part) => hourPiece[part.kind as 'range'](c, part as never))),
  true, parts[0].kind === 'values');
}

// One minute of hours that tile the day: the minute apart, then the step.
function tiledHours(c: Moments): Said {
  const [minute] = c.minutes.values;

  return saying(c, spaced([
    minute > 0 && `${numbered([minute], units.minute)},`,
    hourStep(c, true)
  ]), false);
}

const onTheMinute: ByHours<(c: Moments) => Said> = {
  all: everyHour,
  cadence: (c) => [hourPieces, tiledHours][Number(c.bare)](c),
  pieces: hourPieces,
  range: hourPieces,
  values: hourPieces
};

// Every minute, or a cadence of minutes that needs no ends, confined to
// the hours.
function confined(c: Moments): Said {
  const lead = stretch(c.minutes.said, units.minute, ', ', c.every);

  return saying(c, spaced([lead, confinement(c)]),
    c.hours.said.kind !== 'all' && !c.bare && !framed(c));
}

// Runs and strays of minutes inside one or two named hours: windows of
// clock times and clock times.
const insideAnHour = {
  cadence: (c: Moments, part: Cadence, hour: number) => [{
    lead: `${words.each} ${counted(part.interval, units.minute)}`,
    text: window(c, [hour, part.start], [hour, part.last])
  }],
  range: (c: Moments, part: {from: number; to: number}, hour: number) => [{
    lead: c.every,
    text: window(c, [hour, part.from], [hour, part.to])
  }],
  values: (c: Moments, part: {values: number[]}, hour: number) =>
    part.values.map((minute) => moment(c, hour, minute))
};

// Whether the minutes are said hour by hour: a run or a cadence with ends
// in one hour or two, and runs with stray minutes in one hour only.
function hourByHour(c: Moments): boolean {
  const {kind} = c.minutes.said;

  return kind !== 'values' &&
    c.hours.values.length <= (kind === 'pieces' ? 1 : 2);
}

function insideHours(c: Moments): Said {
  const parts = partsOf(c.minutes.said);

  return saying(c, led(c.hours.values.flatMap((hour) => parts.flatMap(
    (part) => insideAnHour[part.kind as 'range'](c, part as never, hour)))),
  true, parts[0].kind === 'values');
}

// The minute phrase, then one window for each run of hours.
function windowed(c: Moments, phrase: string): Said {
  return saying(c, `${phrase} ${ofEachHour}, ${windows(c)}`, false);
}

// The minute phrase, then the hours: their step where it tiles the day,
// and otherwise the hours named once, or a window for each run of them.
function hoursAfter(c: Moments, phrase: string): Said {
  if (c.bare) {
    return saying(c, `${phrase}, ${hourStep(c, true)}`, false);
  }

  return namesHours(c) ?
    saying(c, `${phrase}, ${hourFrame(c)}`, false) :
    windowed(c, phrase);
}

const anchorings: ByHours<(c: Moments, phrase: string) => Said> = {
  all: (c, phrase) => saying(c, `${phrase} ${ofEachHour}`, false),
  cadence: hoursAfter,
  pieces: hoursAfter,
  range: windowed,
  values: hoursAfter
};

// Minutes anchored inside the hour: a list, a run, pieces or a cadence
// with its ends, and then the hours.
function anchored(c: Moments): Said {
  return anchorings[c.hours.said.kind](c,
    stretch(c.minutes.said, units.minute, ', ', c.every));
}

// The time to the minute, by the first form that applies.
const minuteForms: Form[] = [
  {say: listed, when: few},
  {
    say: (c) => onTheMinute[c.hours.said.kind](c),
    when: (c) => c.minutes.values.length === 1
  },
  {say: confined, when: (c) => continuous(c.minutes.said)},
  {say: insideHours, when: hourByHour},
  {say: anchored, when: () => true}
];

function toTheMinute(c: Moments): Said {
  return firstMatch(minuteForms, c);
}

// Every moment, listed to the second.
function toTheSecond(c: Moments): Said {
  return saying(c, led(c.hours.values.flatMap(
    (hour) => c.minutes.values.flatMap((minute) => c.seconds.values.map(
      (second) => at(timeOf(hour, minute, second, c.style)))))), true, true);
}

// Seconds named as so many after each moment, second 0 as the moment
// itself; several are counted first, then each is named.
function secondsAfter(values: number[]): string {
  const later = values.filter(Boolean);
  const unit = later.join() === '1' ? units.second.one : units.second.many;
  const each = list([
    ...values[0] === 0 ? [words.exactTime] : [],
    ...later.map(String)
  ]);
  const said = `${each} ${unit} ${words.after}`;

  return values.length > 1 ?
    `${values.length} ${words.times}: ${said}` :
    said;
}

// The seconds as a clause after the time: a stretch or a cadence happens
// inside each moment already named, and named seconds are counted from it.
function clause(seconds: Chosen): string {
  const {said, values} = seconds;

  if (said.kind === 'values' || values.length < 3) {
    return secondsAfter(values);
  }

  return `${words.repeating} ` +
    stretch(said, units.second, ' ', eachSecond) +
    (continuous(said) ? ` ${words.during} ${words.wholeMinute}` : '');
}

// Whether the seconds step through a stretch of the minute: every second,
// a run or a cadence, and not seconds named one by one.
function stepping(seconds: Chosen): boolean {
  return seconds.said.kind !== 'values' && seconds.said.kind !== 'pieces' &&
    seconds.values.length >= 3;
}

// The step of the seconds: «a cada segundo», «a cada 10 segundos».
function secondStep(seconds: Chosen): string {
  const {said} = seconds;

  return said.kind === 'cadence' ?
    `${words.each} ${counted(said.interval, units.second)}` :
    eachSecond;
}

// Seconds stepping inside a few clock times: the step, and for each clock
// time a window from its first second to its last.
function secondWindows(c: Moments): Said {
  const {first, last} = c.seconds;

  return saying(c, `${secondStep(c.seconds)} ` + list(c.hours.values.flatMap(
    (hour) => c.minutes.values.map((minute) => fromTo(
      timeOf(hour, minute, first, c.style),
      timeOf(hour, minute, last, c.style))))), false);
}

// Every second, or a cadence of seconds that needs no ends, during one
// minute of every hour or of hours on a step.
function duringMinute(c: Moments): Said {
  const [minute] = c.minutes.values;
  const hours = c.bare ? `, ${hourStep(c, true)}` : ` ${ofEachHour}`;

  return saying(c, `${secondStep(c.seconds)} ${words.during} ` +
    `${articles.singular.masculine} ${units.minute.one} ${minute}${hours}`,
  false);
}

// The time with its seconds, by the first form that applies.
const secondForms: Form[] = [
  {say: toTheMinute, when: (c) => c.seconds.values.join() === '0'},
  {
    say: toTheSecond,
    when: (c) => !c.bare && momentCount(c) <= fewMoments
  },
  {
    // One second rides in every time named.
    say: (c) => toTheMinute({...c, ends: [c.second, c.second]}),
    when: (c) => typeof c.second === 'number' && toTheMinute(c).rides
  },
  {
    // One second of minute 0 of every hour.
    say: (c) => saying(c, `${counted(c.second as number, units.second)} ` +
      `${words.after} ${ofEachHour} ${words.onTheDot}`, false),
    when: (c) => typeof c.second === 'number' &&
      c.minutes.values.join() === '0' && c.hours.said.kind === 'all'
  },
  {
    // Every second, or a cadence of seconds that needs no ends, said in
    // place of «a cada minuto», with every window written to the second.
    say: (c) => toTheMinute({
      ...c,
      ends: [c.seconds.first, c.seconds.last],
      every: stretch(c.seconds.said, units.second, '', eachSecond)
    }),
    when: (c) => continuous(c.seconds.said) && !few(c) &&
      ['all', 'range'].includes(c.minutes.said.kind)
  },
  {
    // Any other seconds of every minute, then the hours as they were.
    say: (c) => saying(c, [
      `${stretch(c.seconds.said, units.second, ', ', eachSecond)} ` +
      ofEachMinute,
      confinement(c)
    ].filter(Boolean).join(', '), false),
    when: (c) => c.minutes.said.kind === 'all'
  },
  {
    say: secondWindows,
    when: (c) => stepping(c.seconds) && few(c)
  },
  {
    say: duringMinute,
    when: (c) => continuous(c.seconds.said) && stepping(c.seconds) &&
      c.minutes.values.length === 1 &&
      (c.bare || c.hours.said.kind === 'all')
  },
  {
    // A time said in more than one piece carries the seconds to every
    // piece with «sempre».
    say(c) {
      const time = toTheMinute({...c, dot: false});
      const every = time.text.includes(` ${words.and} `) && words.always;

      return {
        ...time,
        text: `${time.text}, ${spaced([every, clause(c.seconds)])}`
      };
    },
    when: () => true
  }
];

// The hours excepted: the clock time of the one moment each has, or the
// whole of each where it has more, whatever its minutes and seconds are,
// written to the second where the times of the time part are.
function hourHoles(c: Moments): string {
  const [minute] = c.minutes.values;
  const {removed} = c.hours;
  const whole = {...c, ends: c.ends.length > 0 ? [0, lastOfSixty] : []};

  return c.minutes.values.length * c.seconds.values.length === 1 ?
    led(removed.map((hour) => at(timeOf(hour, minute, c.second, c.style)))) :
    list(stretchesOf({kind: 'values', values: removed}, domainOf('hour')).map(
      (run) => window(whole, [run[0], 0], [run[1], lastOfSixty])));
}

// Minutes excepted where each has one moment: that moment, a clock time
// inside one named hour.
function minuteMoments(c: Moments): string {
  const {removed} = c.minutes;
  const [hour] = c.hours.values;

  return c.hours.values.length === 1 ?
    led(removed.map(
      (minute) => at(timeOf(hour, minute, c.second, c.style)))) :
    `${numbered(removed, units.minute)} ${ofEachHour}`;
}

// Minutes excepted where each has several moments: the whole minute, a
// window to the second inside one named hour.
function wholeMinutes(c: Moments): string {
  const {removed} = c.minutes;
  const [hour] = c.hours.values;
  const [article, unit] = removed.length === 1 ?
    [articles.singular.masculine, units.minute.one] :
    [articles.plural.masculine, units.minute.many];

  return c.hours.values.length === 1 ?
    list(removed.map((minute) => fromTo(
      timeOf(hour, minute, 0, c.style),
      timeOf(hour, minute, lastOfSixty, c.style)))) :
    `${words.during} ${article} ${unit} ${list(removed.map(String))} ` +
      ofEachHour;
}

function minuteHoles(c: Moments): string {
  return c.seconds.values.length === 1 ? minuteMoments(c) : wholeMinutes(c);
}

// The seconds excepted: clock times inside one named minute.
function secondHoles(c: Moments): string {
  const {removed} = c.seconds;
  const [hour] = c.hours.values;
  const [minute] = c.minutes.values;

  return c.hours.values.length * c.minutes.values.length === 1 ?
    led(removed.map((second) => at(timeOf(hour, minute, second, c.style)))) :
    `${numbered(removed, units.second)} ${ofEachMinute}`;
}

// «Exceto» is said once, and the coarser field comes first.
const holes: Array<{of: 'hours' | 'minutes' | 'seconds';
  say(c: Moments): string;}> = [
  {of: 'hours', say: hourHoles},
  {of: 'minutes', say: minuteHoles},
  {of: 'seconds', say: secondHoles}
];

function excepted(c: Moments): string {
  const items = holes.filter((hole) => c[hole.of].removed.length > 0)
    .map((hole) => hole.say(c));

  return items.length > 0 ? `, ${words.except} ${list(items)}` : '';
}

// Minutes and seconds: a cadence that fills the cycle from zero is one
// thing and needs no ends; any other needs both, and is listed while short.
// A run never passes the turn of the hour or the minute.
const sixtieths: Rules = {
  cadence: (cadence) => Number(tiles(cadence)) ||
    withEnds(longestList)(cadence),
  domain: domainOf('minute'),
  excepts: () => true,
  longestWrap: 0,
  piecesOver: 0,
  steps: true,
  wrap: false
};

// The most hours on a cadence that are still said one by one, by what the
// minutes beside them are: under a single minute each is a clock time;
// under more, the hours are named once, as many as a few moments.
function mostHoursListed(minutes: Chosen): number {
  return minutes.values.length === 1 ? longestList : fewMoments;
}

// How many things a cadence of hours names: a step that tiles the day
// from midnight is one, from a later start two where it has more hours
// than could be listed, and any other cadence names its two ends.
function hourCadence(minutes: Chosen): (cadence: Cadence) => number {
  const most = mostHoursListed(minutes);

  return function named(cadence) {
    const count = steps(cadence);

    if (!tilesTheDay(cadence)) {
      return withEnds(most)(cadence);
    }

    return cadence.start === 0 ?
      Number(count >= fewestTiling) :
      2 * Number(count > Math.min(fewMoments, most));
  };
}

function hourRules(minutes: Chosen, wrap: boolean): Rules {
  return {
    cadence: hourCadence(minutes),
    domain: domainOf('hour'),
    excepts: () => true,
    longestWrap: halfDay,
    piecesOver: 0,
    steps: true,
    wrap
  };
}

function valuesOf(analyses: Analyses, field: Field): number[] {
  return firesOn(analyses.candidates[field], domainOf(field));
}

// Whether the hours run round the clock on a step: a cadence that tiles
// the day, three hours or more from midnight, more than four from a later
// start, with or without hours excepted from it. Then the days need no
// «todos os dias».
function roundTheClock(chosen: Chosen): boolean {
  const hours = [...chosen.values, ...chosen.removed].sort((a, b) => a - b);
  const [start] = hours;
  const interval = dayLength / hours.length;

  return Number.isInteger(interval) && interval > 1 && start < interval &&
    hours.every((hour, index) => hour === start + index * interval) &&
    hours.length >= fewestTiling && (start === 0 || hours.length > fewMoments);
}

/**
 * The time part, whether it begins with a clock time, and whether its
 * hours run round the clock. `open` is whether every day of every month
 * and year is meant: only then may a run of hours pass midnight.
 */
function timePart(
  analyses: Analyses,
  open: boolean,
  style: PortugueseStyle
): {clock: boolean; round: boolean; text: string} {
  const minutes = choose(valuesOf(analyses, 'minute'), sixtieths);
  const hours = choose(valuesOf(analyses, 'hour'), hourRules(minutes, open));
  const c: Moments = {
    bare: hours.said.kind === 'cadence' && tilesTheDay(hours.said),
    dot: true,
    ends: [],
    every: eachMinute,
    hours,
    minutes,
    second: analyses.clockSecond,
    seconds: choose(valuesOf(analyses, 'second'), sixtieths),
    style
  };
  const said = firstMatch(secondForms, c);

  return {
    clock: said.clock,
    round: roundTheClock(hours),
    text: said.text + excepted({...c, ends: said.ends})
  };
}

export {timePart};
