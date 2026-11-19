// The day-of-month side of the day part (answers 3, 4.4, 5.3): dates,
// runs and rhythms of dates, and the forms counted inside the month. Days
// a month lacks are not said, and a count back from the month's end that
// comes to one date is that date.

import {
  denote, describeCadencePieces, describeSet
} from '../../core/describe-set.js';
import type {
  CadenceDescription, DaysInMonths, Domain, QuartzDate, ScheduleFacts,
  SetDescription
} from '../../core/schedule.js';
import {daysByMonths, daysReached} from '../../core/set-views.js';
import {domainOf} from '../../core/specs.js';
import {monthNames} from './closing.js';
import type {Part, Plain} from './forms.js';
import {fills, habits, isCadence, isValues, partOf} from './forms.js';
import lexicon from './lexicon.js';
import type {IndonesianStyle} from './options.js';
import {fullWeekday, list, phrase} from './say.js';

const {units, words} = lexicon;

/** What of the months and the year may join the day part. */
export interface Host {
  // The one month, which joins a plain date: «tanggal 1 Juni».
  month: string;
  // The months that stand for «setiap bulan» in a form counted inside the
  // month: «bulan Juni dan Juli».
  months: string;
  // The one year, which joins one day in one month.
  year: string;
}

/** One of the two day fields, as it is said. */
export interface Side {
  // Always followed by a comma, whatever the time begins with.
  comma?: boolean;
  // The phrase as a condition on the other side: «tanggal ganjil», «hari
  // Senin atau Rabu».
  condition: string;
  // Counted inside the month: «Jumat terakhir setiap bulan».
  counted?: boolean;
  // Begins with «setiap tanggal», so that «yang jatuh pada» can follow.
  dated?: boolean;
  // Fires only in leap years, which the date itself does not show.
  leap?: boolean;
  // The days left out, each said after «kecuali».
  left: string[];
  // The dates, when the phrase names them one by one or counts them in
  // days.
  listed?: number[];
  // The months, when they are said by their length.
  monthsAs?: string;
  // Where the date moves to on a Saturday or Sunday.
  moved?: string;
  saidMonths?: boolean;
  saidYear?: boolean;
  // The phrase standing alone; empty when the side is every day.
  text: string;
  // The first and last date a weekday counted inside the month can fall
  // on.
  window?: [number, number];
}

/** What a side is said under. */
export interface Setting {
  facts: ScheduleFacts;
  host: Host;
  // Whether months are named in the closing part.
  monthsNamed: boolean;
  // Whether every month is open.
  monthsOpen: boolean;
  style: IndonesianStyle;
  // Whether the two day fields are said as a union, where each side is
  // said by the days that fire and nothing joins either.
  union: boolean;
}

// A member of a date phrase: a number, a run, or a stretch of a rhythm
// with the rhythm's word.
interface Stretch {
  // A rhythm counted in days, which is said of every month.
  counts?: boolean;
  text: string;
  word?: string;
}

function dated(...values: number[]): string {
  return phrase(words.date, list(values.map(String)));
}

function fromTo(from: number, to: number): string {
  return phrase(dated(from), words.to, String(to));
}

// A rhythm of dates. Every second day is the odd or the even dates, whole
// or between two of them; any other step is counted in days, from its
// start when it runs to the end of the month and else between its ends.
function dayRhythm(found: CadenceDescription, domain: Domain): Stretch {
  const span = phrase(words.from, fromTo(found.start, found.last));
  const whole = fills(found, domain);
  const toTheEnd = found.last + found.interval > domain.max;

  return found.interval === 2 ?
    {
      text: whole ? '' : span,
      word: [words.evenDates, words.oddDates][found.start % 2]
    } :
    {
      counts: true,
      text: toTheEnd ? phrase(words.startingAt, dated(found.start)) : span,
      word: phrase(String(found.interval), units.day)
    };
}

type Stretches<Kind extends Plain['kind']> =
  (form: Extract<Plain, {kind: Kind}>, domain: Domain) => Stretch[];

function severalStretches(
  form: Extract<Plain, {kind: 'pieces' | 'cadencePieces'}>,
  domain: Domain
): Stretch[] {
  return form.parts.flatMap(function each(part) {
    return isValues(part) ?
      part.values.map(function single(value) {
        return {text: dated(value)};
      }) :
      stretchesOf(part, domain);
  });
}

const stretchers: {[Kind in Plain['kind']]: Stretches<Kind>} = {
  all() {
    return [];
  },
  cadence(form, domain) {
    return [dayRhythm(form, domain)];
  },
  cadencePieces: severalStretches,
  pieces: severalStretches,
  range(form) {
    return [{text: fromTo(form.from, form.to)}];
  },
  values(form) {
    return [{text: dated(...form.values)}];
  }
};

function stretchesOf(form: Plain, domain: Domain): Stretch[] {
  return (stretchers[form.kind] as Stretches<Plain['kind']>)(form, domain);
}

// The members of a date phrase in one list. Every member repeats its head
// word; a stretch of a rhythm says the rhythm unless the member before it
// was a stretch of the same.
function datesSaid(stretches: Stretch[]): string {
  let rhythm: string | undefined;

  return list(stretches.map(function each(found, index) {
    const said = phrase(found.word !== rhythm &&
      phrase(index > 0 && words.every, found.word), found.text);

    rhythm = found.word;

    return said;
  }));
}

// A set of days with every description of it, over the days the months
// it fires in have.
function dateSet(candidates: SetDescription[], domain: Domain) {
  return {
    candidates,
    domain,
    habits: habits.date,
    mixed: describeCadencePieces(
      denote(candidates[candidates.length - 1], domain), domain)
  };
}

// Days of the month as a phrase: «setiap tanggal 1 dan 15 Juni».
function datesSide(part: Part, domain: Domain, setting: Setting): Side {
  const {host} = setting;
  const stretches = stretchesOf(part.base, domain);
  const plain = isValues(part.base);
  const counts = stretches.some(function rhythmic(found) {
    return found.counts;
  });
  const month = plain && host.month;
  const year = month && part.values.length === 1 && host.year;
  const body = phrase(datesSaid(stretches), month, year,
    counts && !setting.monthsNamed && words.everyMonth);

  return {
    comma: counts,
    // A rhythm counted in days cannot stand after «jatuh pada»: there the
    // dates are named.
    condition: counts ? dated(...part.values) : body,
    dated: !counts,
    left: [part.removed.length > 0 && dated(...part.removed)]
      .filter(Boolean) as string[],
    listed: counts || plain ? part.values : undefined,
    saidMonths: Boolean(month),
    saidYear: Boolean(year),
    text: phrase(body && !year && words.every, body)
  };
}

function oneDate(day: number, setting: Setting): Side {
  const domain = domainOf('date');

  return datesSide(
    partOf(dateSet(describeSet([day], domain), domain)), domain, setting);
}

// A form counted inside the month: «hari terakhir setiap bulan», with
// the months in place of «setiap bulan» when they are named.
function counted(head: string, setting: Setting): Side {
  const {host} = setting;
  const text = phrase(head, host.months || words.everyMonth, host.year);

  return {
    condition: text,
    counted: true,
    left: [],
    saidMonths: Boolean(host.months),
    saidYear: Boolean(host.year),
    text
  };
}

const [sunday, monday, , , , friday, saturday] = [0, 1, 2, 3, 4, 5, 6]
  .map(fullWeekday);
const onARestDay = phrase(words.ifItFallsOn, words.dayOf, saturday,
  words.or, sunday);
const toFriday = phrase(words.movedTo, words.dayOf, friday, words.before,
  onARestDay);
const toMonday = phrase(words.movedTo, words.dayOf, monday, words.after,
  onARestDay);
const toTheNearest = phrase(words.movedTo, words.dayOf, friday, words.or,
  monday, words.nearest);

// Where the weekday nearest a date is, by whether the date is its
// month's last day: then there is no Monday after it.
const nearest = {
  always: toFriday,
  never: phrase(toTheNearest, onARestDay),
  sometimes: phrase(toTheNearest, words.inTheSameMonth, onARestDay)
};

function monthsOfLength(length: number): string {
  return phrase(words.at, units.month, words.thatHas, String(length),
    units.day);
}

// A count back from the month's end. Where every month it fires in has
// one length the date is fixed and is said; where a month is skipped and
// several lengths are left, each length's date with its months; else the
// count.
function countedBack(
  form: Extract<QuartzDate, {kind: 'beforeLast'}>,
  setting: Setting
): Side {
  const {dateReach, monthLengths} = setting.facts.analyses;
  const skips = dateReach !== null &&
    dateReach.never.length + dateReach.leapYears.length > 0;
  const [only] = monthLengths;
  const count = form.days > 1 ?
    phrase(String(form.days), units.day) :
    words.oneDay;

  function monthsOf(group: typeof only): string {
    return setting.monthsOpen ?
      monthsOfLength(group.length) :
      phrase(words.at, units.month,
        monthNames(group.months, setting.style));
  }

  const options: Array<Side | false> = [
    setting.union && counted(phrase(count, words.beforeLastDay), setting),
    monthLengths.length === 1 && {
      ...oneDate(only.length - form.days, setting),
      leap: only.years === 'leap',
      monthsAs: setting.monthsOpen ? monthsOfLength(only.length) : ''
    },
    skips && {
      comma: true,
      condition: '',
      left: [],
      saidMonths: true,
      text: phrase(words.every, list(monthLengths.map(function each(group) {
        return phrase(dated(group.length - form.days), monthsOf(group));
      })))
    },
    counted(phrase(count, words.beforeLastDay), setting)
  ];

  return options.find(Boolean) as Side;
}

type DateForm<Kind extends QuartzDate['kind']> =
  (form: Extract<QuartzDate, {kind: Kind}>, setting: Setting) => Side;

const dateForms: {[Kind in QuartzDate['kind']]: DateForm<Kind>} = {
  beforeLast: countedBack,
  firstWeekday(_form, setting) {
    return {...oneDate(1, setting), moved: toMonday};
  },
  last(_form, setting) {
    return counted(words.lastDay, setting);
  },
  lastWeekday(_form, setting) {
    return {...counted(words.lastDay, setting), moved: toFriday};
  },
  nearestWeekday(form, setting) {
    return {
      ...oneDate(form.day, setting),
      moved: nearest[
        setting.facts.analyses.day.nearestDayIsLast as keyof typeof nearest]
    };
  }
};

// Whether a date phrase names its last day, which it may then promise
// to a month that lacks it. Every day, the odd or even dates and a rhythm
// to the end of the month name none.
function namesItsEnd(part: Part, domain: Domain): boolean {
  const {base} = part;

  return !(base.kind === 'all' ||
    isCadence(base) && base.last + base.interval > domain.max);
}

// Days that not every reached month has, each group with the months that
// have it: «tanggal 30 pada bulan April dan Mei dan tanggal 31 pada bulan
// Mei».
function byMonths(setting: Setting): Side | false {
  const groups = daysByMonths(setting.facts) as DaysInMonths[];
  const domain = domainOf('date');

  function monthsOf(group: DaysInMonths): number[] {
    return [...new Set(group.months.flatMap(function each(found) {
      return found.months;
    }))];
  }

  const apart = groups.length > 1 && !setting.union &&
    !setting.monthsOpen &&
    monthsOf(groups[0]).length > monthsOf(groups[groups.length - 1]).length;

  return apart && {
    comma: true,
    condition: '',
    left: [],
    saidMonths: true,
    text: phrase(words.every, list(groups.map(function each(group) {
      const days = partOf(dateSet(
        describeSet(group.days, domain, {linear: true}), domain), true);

      return phrase(datesSaid(stretchesOf(days.base, domain)), words.at,
        units.month, monthNames(monthsOf(group), setting.style));
    })))
  };
}

/** The day-of-month side, or nothing when that field is open. */
function dateSide(setting: Setting): Side | undefined {
  const {facts} = setting;
  const arm = facts.analyses.day.date;

  if (!arm) {
    return;
  }

  if (arm.kind === 'quartz') {
    return (dateForms[arm.form.kind] as DateForm<QuartzDate['kind']>)(
      arm.form, setting);
  }

  const reached = daysReached(facts, {linear: true}) as
    {candidates: SetDescription[]; domain: Domain};
  const part = partOf(
    dateSet(reached.candidates, reached.domain), setting.union);

  return namesItsEnd(part, reached.domain) && byMonths(setting) ||
    datesSide(part, reached.domain, setting);
}

export {counted, dateSide};
