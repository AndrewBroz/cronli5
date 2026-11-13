// French. One frame: the calendar part (the day, then the month), the
// time part, the year part. A union of a day of the month and a weekday
// has its own declared order: the month, the time, the weekdays, «ainsi
// que», the days of the month, the year. The rule book is answers.md.

import type {Language, Schedule} from '../../core/schedule.js';
import type {Joined, Months} from './calendar.js';
import {
  datePhrase, datesOnWeekdays, dayPhrase, join, monthsOf, weekdayPhrase,
  yearPart
} from './calendar.js';
import type {Context} from './context.js';
import {contextOf} from './context.js';
import lexicon from './lexicon.js';
import type {FrenchOptions, FrenchStyle} from './options.js';
import {regions, style, styles} from './options.js';
import {given, phrase} from './say.js';
import type {Said} from './time.js';
import {roundTheClock, timePart} from './time.js';

const {words: w} = lexicon;

type PartName = 'day' | 'month' | 'time' | 'year';

/** The four parts of a description, each with the comma that closes it. */
type Parts = Record<PartName, string>;

/** A stretch of the sentence, and the commas it asks for. */
interface Chunk {
  // Whether a comma follows it when anything does.
  close?: boolean;
  // Whether a comma comes before it when anything does.
  open?: boolean;
  part: PartName;
  text: string;
}

// Phrases set off between commas, at the end of a part.
function setOff(part: PartName, texts: string[]): Chunk[] {
  return texts.map((text) => ({close: true, open: true, part, text}));
}

// The year part. One year after one month's name is already written into
// the name. Otherwise it follows a space when it begins with «en» and a
// comma when it does not; in a union, always a comma.
//
// The union's own order, below, has the days of the month name the
// months they can fire in when those are not all the months at its head.
function yearChunk(c: Context, months: Months): Chunk {
  const text = given(!months.fused, yearPart(c));

  return {
    open: c.union || !text.startsWith(`${w.in} `),
    part: 'year',
    text
  };
}

// The frame: the day, the month, the time, the year. A comma comes
// before the time unless it begins with a clock time.
function framed(c: Context, time: Said): Chunk[] {
  const months = monthsOf(c, c.dateMonths,
    {excepting: !c.both && (c.dated || c.weekdayed || c.daily)});
  const days: Joined = c.both ?
    datesOnWeekdays(c, months) :
    join(dayPhrase(c, months), months, months.shape);

  return [
    {part: 'day', text: days.head},
    {close: days.closes, part: 'month', text: days.tail},
    ...setOff('month', days.setOff),
    {open: !time.clock, part: 'time', text: time.text},
    yearChunk(c, months),
    {open: true, part: 'year', text: given(c.leap, w.leapYears)}
  ];
}

// The union's own order. The month and the time lead, so that each covers
// both sets of days; the weekdays are said as with every month, and the
// days of the month without a month that has already been said.
function united(c: Context, time: Said): Chunk[] {
  const months = monthsOf(c, c.months, {excepting: false});
  const weekdays = join(weekdayPhrase(c, false), months, 'all');
  const shared = c.dateMonths === c.months;
  const theirs = monthsOf(c, c.dateMonths, {apart: true, excepting: false});
  const led = months.shape === 'all' ? 'all' : 'led';
  const dates = join(datePhrase(c, shared ? months : theirs, false),
    theirs, shared ? led : theirs.shape);

  return [
    {close: true, part: 'month', text: months.alone},
    {close: true, part: 'time', text: time.text},
    {
      part: 'day',
      text: phrase(weekdays.head, weekdays.tail, w.also, dates.head,
        dates.tail)
    },
    ...setOff('day', dates.setOff),
    yearChunk(c, months)
  ];
}

// The sentence and its four parts. A comma between two chunks belongs to
// the join, and is written at the end of the first.
function compose(schedule: Schedule, opts: FrenchOptions):
  {parts: Parts; text: string} {
  const read = contextOf(schedule, opts.style);
  const c = {
    ...read,
    daily: !read.dated && !read.weekdayed && !roundTheClock(read)
  };
  const time = timePart(c);
  const never: Chunk[] =
    [{part: 'day', text: `${w.never} : ${w.noDate}`}];
  const said = c.union ? united(c, time) : framed(c, time);
  const chunks = (c.never ? never : said)
    .filter((chunk) => chunk.text !== '');
  const texts = chunks.map(function closed(chunk, index) {
    const next: Chunk | undefined = chunks[index + 1];
    const comma = chunk.close === true || next?.open === true;

    return chunk.text + given(Boolean(next) && comma, ',');
  });

  function part(name: PartName): string {
    return texts.filter((_, index) => chunks[index].part === name).join(' ');
  }

  return {
    parts: {
      day: part('day'),
      month: part('month'),
      time: part('time'),
      year: part('year')
    },
    text: texts.join(' ')
  };
}

/**
 * The parts of a description. Joined with spaces in the order of the
 * frame (day, month, time, year; for a union month, time, day, year),
 * those that are not empty are the description.
 */
function describeParts(schedule: Schedule, opts: FrenchOptions): Parts {
  return compose(schedule, opts).parts;
}

function describe(schedule: Schedule, opts: FrenchOptions): string {
  return compose(schedule, opts).text;
}

/**
 * Whether a description is in the union's order: both a day of the month
 * and a weekday narrow the days, and both fire.
 */
function unites(schedule: Schedule, opts: FrenchOptions): boolean {
  return contextOf(schedule, opts.style).union;
}

// A label starts with a capital letter, which keeps its accent.
function label(description: string): string {
  return description.charAt(0).toUpperCase() + description.slice(1);
}

// A sentence leads with its verb and ends in one full stop. What never
// fires takes the negative verb: «Ne s'exécute jamais».
function sentence(description: string): string {
  const verb = description.startsWith(w.never) ? w.neverRuns : w.runs;

  return `${verb} ${description}` + given(!description.endsWith('.'), '.');
}

function reboot(): string {
  return w.startup;
}

function fallback(): string {
  return w.unrecognizable;
}

const french: Language<FrenchStyle> = {
  code: 'fr',
  defaultStyle: 'fr',
  describe,
  fallback,
  label,
  reboot,
  regions,
  sentence,
  style,
  styles
};

export type {FrenchStyle};
export {describeParts, styles, unites};
export default french;
