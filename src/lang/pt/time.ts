// The time part of the sentence: the minutes and hours said together as
// clock times, windows and cadences, then the seconds, then whatever is
// excepted, which always comes last.

import type {Analyses, Field} from '../../core/schedule.js';
import type {Cadence, Chosen, Plain, Rules} from './sets.js';
import type {Led} from './phrases.js';
import type {PortugueseStyle} from './options.js';
import {at, fromTo, timeOf} from './clock.js';
import {choose, firesOn, partsOf, steps, stretchesOf, withEnds}
  from './sets.js';
import {continuous, numbered, stretch, tiles} from './stretch.js';
import {counted, led, list, spaced} from './phrases.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';

const {articles, units, words} = lexicon;

// Up to this many moments in a day are always listed.
const fewMoments = 4;

// The longest list said in place of a cadence that needs its ends named.
const longestList = 7;

// More windows than this, of one hour each on a cadence, are a series.
const mostWindows = 4;

// A run of hours through midnight is one run only when it is no longer
// than this: a longer one reads backwards.
const halfDay = 12;

// The last minute of an hour, and the last second of a minute.
const lastOfSixty = 59;

const eachHour = `${words.each} ${units.hour.one}`;
const eachMinute = `${words.each} ${units.minute.one}`;
const eachSecond = `${words.each} ${units.second.one}`;
const ofEachHour = `${words.ofEach} ${units.hour.one}`;
const ofEachMinute = `${words.ofEach} ${units.minute.one}`;

// What the time part is built from, and how its times are to be written.
interface Moments {
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
  return c.hours.values.length * c.minutes.values.length <= fewMoments;
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

// The hours a cadence lands on.
function landings(c: Moments): number[] {
  const said = c.hours.said as Cadence;

  return Array.from({length: steps(said)},
    (_, index) => said.start + index * said.interval);
}

// A cadence that chooses among the hours, with what it lands on in
// brackets: the first of them, a gap, and the last.
function series(c: Moments, shown: string[]): string {
  const {interval} = c.hours.said as Cadence;
  const step = `${words.from} ${interval} ${words.in} ` +
    counted(interval, units.hour);

  return `${step} (${shown.slice(0, -1).join(', ')} … ` +
    `${shown[shown.length - 1]})`;
}

// One window for each run of hours.
function windows(c: Moments): string {
  return list(stretchesOf(c.hours.said, domainOf('hour'))
    .map((run) => across(c, run)));
}

// The windows of a series: those of its first two hours and of its last.
function windowSeries(c: Moments): string {
  const hours = landings(c);

  return series(c, [...hours.slice(0, 2), ...hours.slice(-1)]
    .map((hour) => across(c, [hour, hour])));
}

// What confines a stretch of minutes to the hours it runs in.
const confinements: ByHours<(c: Moments) => string> = {
  all: () => '',
  cadence: windowSeries,
  pieces: windows,
  range: windows,
  values: windows
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

const onTheMinute: ByHours<(c: Moments) => Said> = {
  all: everyHour,
  cadence: hourPieces,
  pieces: hourPieces,
  range: hourPieces,
  values: hourPieces
};

// Every minute, or a cadence of minutes that needs no ends, confined to
// the hours.
function confined(c: Moments): Said {
  const {kind} = c.hours.said;
  const lead = stretch(c.minutes.said, units.minute, ', ', c.every);

  return saying(c, [lead, confinement(c)].filter(Boolean)
    .join(kind === 'cadence' ? ', ' : ' '), kind !== 'all');
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

// Whether no two of the hours are adjacent, so that every window is one
// hour's stretch.
function apart(c: Moments): boolean {
  return c.hours.said.kind !== 'all' &&
    stretchesOf(c.hours.said, domainOf('hour'))
      .every((run) => run[0] === run[1]);
}

// Whether the minutes fire right through each window at the rhythm the
// lead says: a run, or a cadence from the top of the hour, whose phase
// «a cada N minutos» already states.
function throughTheWindow(c: Moments): boolean {
  const said = c.minutes.said;

  return said.kind === 'range' ||
    said.kind === 'cadence' && said.start === 0;
}

// Such minutes in hours apart, confined as every minute is: the lead
// alone, since each window is where they fire. The second is said after,
// in words, never written into the windows.
function stretchConfined(c: Moments): Said {
  const said = c.minutes.said as Cadence;
  const lead = said.kind === 'cadence' ?
    `${words.each} ${counted(said.interval, units.minute)}` :
    c.every;
  const gap = c.hours.said.kind === 'cadence' ? ', ' : ' ';

  return saying(c, `${lead}${gap}${confinement(c)}`, false);
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

// Separate hours: the clock times while they are few enough to list.
function separate(c: Moments, phrase: string): Said {
  return c.minutes.said.kind === 'values' &&
    c.minutes.values.length * c.hours.values.length <= longestList ?
    listed(c) :
    windowed(c, phrase);
}

// Whether the minutes are a list short enough for the clock times of two
// hours and one more to make a list that can be held.
function shortList(minutes: Chosen): boolean {
  return minutes.said.kind === 'values' &&
    2 * minutes.values.length < longestList;
}

// The minute phrase, then the hours on a cadence with what they hold in
// brackets: for a short list of minutes the clock times of the first two
// hours and the last of all, for any other minutes a window for each of
// the first two hours and for the last.
function timeSeries(c: Moments, phrase: string): Said {
  if (!shortList(c.minutes)) {
    return saying(c, `${phrase}, ${windowSeries(c)}`, false);
  }

  const hours = landings(c);
  const times = hours.slice(0, 2).flatMap(
    (hour) => c.minutes.values.map((minute) => [hour, minute]));
  const last = [hours[hours.length - 1], ...c.minutes.values.slice(-1)];

  return saying(c, `${phrase}, ` + series(c, [...times, last].map(
    ([hour, minute]) => moment(c, hour, minute).text)), true);
}

const anchorings: ByHours<(c: Moments, phrase: string) => Said> = {
  all: (c, phrase) => saying(c, `${phrase} ${ofEachHour}`, false),
  cadence: timeSeries,
  pieces: windowed,
  range: windowed,
  values: separate
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
  {say: stretchConfined, when: (c) => throughTheWindow(c) && apart(c)},
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

// The time with its seconds, by the first form that applies.
const secondForms: Form[] = [
  {say: toTheMinute, when: (c) => c.seconds.values.join() === '0'},
  {say: toTheSecond, when: (c) => momentCount(c) <= fewMoments},
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
// minutes beside them are: a single minute is a clock time and a short
// list of minutes that many clock times, and anything else is a window
// for each hour.
function mostHoursListed(minutes: Chosen): number {
  return shortList(minutes) ?
    Math.floor(longestList / minutes.values.length) :
    mostWindows;
}

function hourRules(minutes: Chosen, wrap: boolean): Rules {
  return {
    cadence: withEnds(mostHoursListed(minutes)),
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

/**
 * The time part, and whether it begins with a clock time. `open` is
 * whether every day of every month and year is meant: only then may a run
 * of hours pass midnight.
 */
function timePart(
  analyses: Analyses,
  open: boolean,
  style: PortugueseStyle
): {clock: boolean; text: string} {
  const minutes = choose(valuesOf(analyses, 'minute'), sixtieths);
  const c: Moments = {
    dot: true,
    ends: [],
    every: eachMinute,
    hours: choose(valuesOf(analyses, 'hour'), hourRules(minutes, open)),
    minutes,
    second: analyses.clockSecond,
    seconds: choose(valuesOf(analyses, 'second'), sixtieths),
    style
  };
  const said = firstMatch(secondForms, c);

  return {
    clock: said.clock,
    text: said.text + excepted({...c, ends: said.ends})
  };
}

export {timePart};
