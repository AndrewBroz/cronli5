// The day part: the days of the month, the weekdays, or both, with the
// month a date belongs to. What the calendar lacks comes from the core's
// facts; no month length is worked out here.

import type {
  DateReach, Domain, MonthLengths, QuartzDate, QuartzWeekday, ScheduleFacts,
  SetDescription
} from '../../core/schedule.js';
import {candidatesAs, daysReached} from '../../core/set-views.js';
import {denote, describeCadencePieces} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import type {Cadence, Exception, Form, Part, Run} from './sets.js';
import {choose, chooseWeekdays, countOf, firstOf} from './sets.js';
import type {Speech} from './words.js';
import {
  daySpan, every, list, phrase, sayPieces, startingDay, theDay, toDay
} from './words.js';
import lexicon from './lexicon.js';

const {nthWords, weekdays, words} = lexicon;

const DATES = domainOf('date');

// The fewest days a cadence has to be said as one, and the fewest when it
// is every second day, which has a name.
const LONG_CADENCE = 8;
const LONG_ALTERNATION = 5;

// How far from the end of the month a day still has a name of its own:
// «il penultimo giorno», «il terzultimo giorno».
const NAMED_BEFORE_LAST = [words.penultimateDay, words.antepenultimateDay];

// At most this many months are each given their own full date.
const MOST_FULL_DATES = 3;

// How the months of one length are called inside a bracket, when they
// come first and after another group.
const BY_LENGTH: {[length: number]: string[]} = {
  30: [words.inMonthsOf30Days, words.inThoseOf30],
  31: [words.inMonthsOf31Days, words.inMonthsOf31Days]
};

/**
 * Where the months stand for a day of the month: every month, the months
 * of 31 days, one named month that joins the date, or several that lead.
 */
interface MonthPlace {
  kind: 'every' | 'long' | 'one' | 'several';
  month: number;
}

/** What the day part is made from. */
interface DayAsked {
  // The date arm, when it restricts the days and adds any.
  date: ScheduleFacts['analyses']['day']['date'];
  // Whether the hours are restricted, so that the days have a rhythm.
  hoursNamed: boolean;
  place: MonthPlace;
  speech: Speech;
  weekday: ScheduleFacts['analyses']['day']['weekday'];
}

/** A day phrase. */
interface DaySaid {
  // Whether the named month is said inside the phrase.
  fused: boolean;
  // Whether the phrase ends with an exception or a gloss.
  glossed: boolean;
  text: string;
}

// The month suffix of a day phrase: after a day number, and after
// anything else.
interface Suffix {
  afterNumber: string;
  afterWords: string;
}

function suffixOf(place: MonthPlace, speech: Speech): Suffix {
  const name = speech.month(place.month);
  const fixed = {
    every: words.ofEachMonth,
    long: words.ofMonthsOf31Days,
    one: '',
    several: words.ofTheMonth
  }[place.kind];

  return {
    afterNumber: fixed || name,
    afterWords: fixed || `${words.of} ${name}`
  };
}

function longCadence(cadence: Cadence): boolean {
  return countOf(cadence) >= LONG_CADENCE ||
    cadence.interval === 2 && countOf(cadence) >= LONG_ALTERNATION;
}

function theDays(days: number[]): string[] {
  return days.map(theDay);
}

// The words for weekdays in the caller's style.
function weekdayWords(speech: Speech) {
  function gender(weekday: number): number {
    return Number(weekdays[weekday].feminine);
  }

  function the(weekday: number): string {
    return [words.the, words.theFeminine][gender(weekday)] +
      ` ${speech.weekday(weekday)}`;
  }

  function span(run: Run): string {
    return [words.from, words.fromFeminine][gender(run.from)] +
      ` ${speech.weekday(run.from)} ` +
      [words.to, words.toFeminine][gender(run.to)] +
      ` ${speech.weekday(run.to)}`;
  }

  // The weekdays a date may fall on: «di lunedì o di mercoledì».
  function falling(days: number[]): string {
    return list(days.map(function onDay(weekday) {
      return `${words.of} ${speech.weekday(weekday)}`;
    }), words.or);
  }

  return {falling, gender, span, the};
}

type WeekdayWords = ReturnType<typeof weekdayWords>;

// A plain set of weekdays, read from Monday.
function sayWeekdays(form: Form, say: WeekdayWords): DaySaid {
  function days(named: number[]): string[] {
    return named.map(say.the);
  }

  const removed = list(days((form as Exception).removed || []));
  const sayers = {
    all: String,
    cadence: String,
    except(exception: Form) {
      const {base} = exception as Exception;

      return phrase(base.kind === 'range' && say.span(base) ||
        words.everyDay, words.except, removed);
    },
    pieces(pieces: Form) {
      return sayPieces((pieces as {parts: Part[]}).parts,
        {cadence: String, run: say.span, values: days});
    },
    range(run: Form) {
      return say.span(run as Run);
    },
    values(named: Form) {
      return list(days((named as {values: number[]}).values));
    }
  };

  return {
    fused: false,
    glossed: form.kind === 'except',
    text: sayers[form.kind](form)
  };
}

// The nth or the last such weekday of the month. A fifth one is not in
// every month, which is said of every month and of nothing narrower.
function sayQuartzWeekday(form: QuartzWeekday, asked: DayAsked): DaySaid {
  const say = weekdayWords(asked.speech);
  const gender = (['masculine', 'feminine'] as const)[say.gender(form.weekday)];
  const name = asked.speech.weekday(form.weekday);
  const suffix = suffixOf(asked.place, asked.speech).afterWords;
  const fifth = form.kind === 'nth' && form.nth === nthWords.length &&
    asked.place.kind === 'every';
  const sayers = {
    last() {
      return `${words.theElided}${words.last[gender]} ${name}`;
    },
    nth(nth: QuartzWeekday) {
      const ordinal = nthWords[(nth as {nth: number}).nth - 1][gender];

      return `${[words.the, words.theFeminine][say.gender(form.weekday)]} ` +
        `${ordinal} ${name}`;
    }
  };

  return {
    fused: asked.place.kind === 'one',
    glossed: fifth,
    text: phrase(sayers[form.kind](form),
      fifth && words.ofMonthsWithFive || suffix)
  };
}

// A cadence of days. Every second day is the odd or the even days, with
// their ends when they are not all of them. Any other cadence that runs
// to the end of the month says only where it starts, unless one named
// month would turn that into a start date.
function sayDayCadence(cadence: Cadence, domain: Domain, asked: DayAsked):
  string {
  const {interval, last, start} = cadence;
  const suffix = suffixOf(asked.place, asked.speech);
  const toTheEnd = last + interval > domain.max;
  const whole = toTheEnd && start - domain.min < interval;
  const fromStart = interval > 2 && toTheEnd && asked.place.kind !== 'one';

  return firstOf<string>([
    interval === 2 && whole && `${dayRhythm(cadence)} ${suffix.afterWords}`,
    fromStart && phrase(dayRhythm(cadence), startingDay(start),
      suffix.afterNumber),
    `${dayCadenceSpan(cadence)} ${suffix.afterNumber}`
  ]);
}

// The rhythm of a cadence of days: the odd or the even days, or every so
// many days.
function dayRhythm(cadence: Cadence): string {
  return cadence.interval === 2 ?
    [words.evenDays, words.oddDays][cadence.start % 2] :
    every(cadence.interval, 'day');
}

// A cadence of days with both its ends.
function dayCadenceSpan(cadence: Cadence): string {
  return `${dayRhythm(cadence)} ${daySpan(cadence.start, cadence.last)}`;
}

// A plain set of days of the month, in the form chosen for it.
function sayDates(form: Form, domain: Domain, asked: DayAsked): DaySaid {
  const suffix = suffixOf(asked.place, asked.speech);
  const removed = phrase(words.except,
    list(theDays((form as Exception).removed || [])));

  function cadence(found: Cadence): string {
    return sayDayCadence(found, domain, asked);
  }

  const everyDayBut = form.kind === 'except' && form.base.kind === 'all';
  const sayers = {
    all: String,
    cadence(found: Form) {
      return cadence(found as Cadence);
    },
    except(exception: Form) {
      const {base} = exception as Exception;

      return everyDayBut ?
        phrase(words.everyDay, removed,
          asked.place.kind === 'every' && words.ofEachMonth) :
        phrase(cadence(base as Cadence), removed);
    },
    pieces(pieces: Form) {
      return phrase(sayPieces((pieces as {parts: Part[]}).parts, {
        cadence: dayCadenceSpan,
        run(run, first) {
          return phrase(first && words.everyDay, daySpan(run.from, run.to));
        },
        values: theDays
      }), suffix.afterNumber);
    },
    range(run: Form) {
      const {from, to} = run as Run;

      return phrase(words.everyDay, daySpan(from, to), suffix.afterNumber);
    },
    values(named: Form) {
      return phrase(list(theDays((named as {values: number[]}).values)),
        suffix.afterNumber);
    }
  };

  return {
    fused: asked.place.kind === 'one' && !everyDayBut,
    glossed: form.kind === 'except',
    text: sayers[form.kind](form)
  };
}

// The form of a plain set of days, from the candidates given.
function chooseDates(candidates: SetDescription[], domain: Domain): Form {
  return choose(candidates, domain, {
    cadence: longCadence,
    mixed: describeCadencePieces(
      denote(candidates[candidates.length - 1], domain), domain)
  });
}

// The Monday-to-Friday day is a working day, with the days and the
// holidays said beside it in brackets.
function workdayBracket(speech: Speech): string {
  const mondayToFriday = weekdayWords(speech).span(
    {from: 1, kind: 'range', to: 5});

  return `(${mondayToFriday}, ${words.workdayGloss})`;
}

// So many days before the last, for a distance with no name of its own:
// the day it comes to. One day in every month is that date; a few months
// are each given their date; otherwise the distance is said, with the day
// it comes to in the months of each length.
function sayBeforeLast(days: number, asked: DayAsked, fired: MonthLengths[]):
  DaySaid {
  const {speech} = asked;
  const suffix = suffixOf(asked.place, speech);
  const reached = [...new Set(fired.flatMap(function monthsOf(group) {
    return group.months;
  }))].sort(function ascending(a, b) {
    return a - b;
  });

  function dayIn(group: MonthLengths): number {
    return group.length - days;
  }

  function fullDate(month: number): string {
    const [usual, leap] = fired.filter(function holds(group) {
      return group.months.includes(month);
    }).map(dayIn);

    return phrase(theDay(usual), speech.month(month),
      typeof leap === 'number' &&
        `(${theDay(leap)} ${words.inLeapYears})`);
  }

  function bracket(): string {
    const named = fired.filter(function hasName(group) {
      return BY_LENGTH[group.length];
    }).reverse().map(function inGroup(group, at) {
      return `${theDay(dayIn(group))} ${BY_LENGTH[group.length][at]}`;
    });
    const rest = fired.filter(function unnamed(group) {
      return !BY_LENGTH[group.length];
    });
    const others = rest.length > 0 && phrase(
      list(theDays(rest.map(dayIn)), words.or), words.inMonth,
      speech.month(rest[0].months[0]));

    return `(${[...named, others].filter(Boolean).join(', ')})`;
  }

  if (new Set(fired.map(dayIn)).size === 1) {
    return sayDates({kind: 'values', values: [dayIn(fired[0])]}, DATES,
      asked);
  }

  return reached.length <= MOST_FULL_DATES && asked.weekday === null ?
    {fused: true, glossed: false, text: list(reached.map(fullDate))} :
    {
      fused: asked.place.kind === 'one',
      glossed: false,
      text: phrase(String(days), words.daysBeforeLast, suffix.afterWords,
        bracket())
    };
}

// A Quartz form of the day of the month.
function sayQuartzDate(form: QuartzDate, asked: DayAsked, facts: ScheduleFacts):
  DaySaid {
  const {day, monthLengths} = facts.analyses;
  const suffix = suffixOf(asked.place, asked.speech);
  const bracket = workdayBracket(asked.speech);
  const fused = asked.place.kind === 'one';

  function said(...parts: Array<string | false>): DaySaid {
    return {fused, glossed: false, text: phrase(...parts)};
  }

  function lastWeekday(): DaySaid {
    return said(`${words.theElided}${words.last.masculine}`, words.workday,
      suffix.afterWords, bracket);
  }

  const sayers = {
    beforeLast(found: QuartzDate) {
      const {days} = found as {days: number};
      const name = NAMED_BEFORE_LAST[days - 1];

      return name ?
        said(name, suffix.afterWords) :
        sayBeforeLast(days, asked, monthLengths);
    },
    firstWeekday() {
      return said(words.the, nthWords[0].masculine, words.workday,
        suffix.afterWords, bracket);
    },
    last() {
      return said(words.lastDay, suffix.afterWords);
    },
    lastWeekday,
    // The last day the field has is always its month's last, so the
    // working day nearest it is the month's last one.
    nearestWeekday(found: QuartzDate) {
      const nearest = (found as {day: number}).day;

      return nearest === DATES.max ?
        lastWeekday() :
        said(words.the, words.workday, words.nearest, toDay(nearest),
          suffix.afterNumber + phrase(day.nearestDayIsLast !== 'never' &&
            `, ${words.withinMonth}`), bracket);
    }
  };

  return sayers[form.kind](form);
}

// The date arm alone, as its phrase.
function sayDateArm(asked: DayAsked, facts: ScheduleFacts): DaySaid {
  const {date} = asked;
  const plain = daysReached(facts, {linear: true});

  return date?.kind === 'quartz' ?
    sayQuartzDate(date.form, asked, facts) :
    sayDates(chooseDates(plain?.candidates as [], plain?.domain as Domain),
      plain?.domain as Domain, asked);
}

// What a date that February has only in leap years adds to the phrase.
function leapGloss(reach: DateReach | null, speech: Speech, union: boolean):
  string {
  const leap = reach?.leapYears || [];
  const others = (reach?.everyYear || []).length > 0;
  const inFebruary = others &&
    `${words.inMonth} ${speech.month(leap[0] || 0)}`;
  const clause = union ?
    others && words.whichInFebruaryExists || words.whichExists :
    inFebruary;

  return phrase(leap.length > 0 &&
    `, ${phrase(clause, words.leapYearsOnly)}`);
}

// The weekday arm alone, as its phrase.
function sayWeekdayArm(asked: DayAsked, facts: ScheduleFacts): DaySaid {
  const {weekday} = asked;

  return weekday?.kind === 'quartz' ?
    sayQuartzWeekday(weekday.form, asked) :
    sayWeekdays(chooseWeekdays(facts), weekdayWords(asked.speech));
}

// Every day but one or two dates, beside plain weekdays: every day, and
// those dates only when they fall on the weekdays.
function saySwallowed(dates: number[], asked: DayAsked, facts: ScheduleFacts):
  DaySaid {
  const say = weekdayWords(asked.speech);
  const candidates = candidatesAs(facts, 'weekday',
    {first: 1, linear: true}) as [];
  const form = chooseWeekdays(facts);
  const named = denote(candidates[candidates.length - 1],
    domainOf('weekday'));
  const less = form.kind === 'except' && form.base.kind === 'all';
  const several = Number(dates.length > 1);
  const falls = [
    [words.ifItFalls, words.ifTheyFall],
    [words.ifItFallsNot, words.ifTheyFallNot]
  ][Number(less)][several];
  const where = firstOf<string>([
    form.kind === 'range' &&
      `${words.between} ${say.the(form.from)} ${words.and} ` +
      say.the(form.to),
    less && say.falling((form as Exception).removed),
    say.falling(named)
  ]);
  const those = phrase(list(theDays(dates)),
    asked.place.kind === 'every' && words.ofEachMonth);

  return {
    fused: false,
    glossed: false,
    text: `${words.everyDay} (${words.but} ${those} ${words.only} ` +
      `${falls} ${where})`
  };
}

// A weekday and a day of the month, either of which fires: the weekdays,
// «e in più» the dates, and «sempre» to carry the time to both.
function sayUnion(asked: DayAsked, facts: ScheduleFacts): DaySaid {
  const reached = daysReached(facts, {linear: true});
  const dateForm = reached &&
    chooseDates(reached.candidates, reached.domain);
  const swallows = dateForm?.kind === 'except' &&
    dateForm.base.kind === 'all' && asked.weekday?.kind === 'values';

  if (swallows) {
    return saySwallowed((dateForm as Exception).removed, asked, facts);
  }

  const weekday = sayWeekdayArm(asked, facts);
  const date = sayDateArm(asked, facts);
  const gloss = leapGloss(facts.analyses.dateReach, asked.speech, true);

  return {
    fused: false,
    glossed: false,
    text: weekday.text + phrase(weekday.glossed && ',') +
      ` ${words.plus} ${date.text}${gloss}, ${words.always}`
  };
}

/** The day part of a description. */
function sayDay(asked: DayAsked, facts: ScheduleFacts): DaySaid {
  if (asked.date && asked.weekday) {
    return sayUnion(asked, facts);
  }

  if (asked.weekday) {
    return sayWeekdayArm(asked, facts);
  }

  if (!asked.date) {
    return {
      fused: false,
      glossed: false,
      text: phrase(asked.hoursNamed && words.everyDay)
    };
  }

  const date = sayDateArm(asked, facts);
  const gloss = leapGloss(facts.analyses.dateReach, asked.speech, false);

  return {
    ...date,
    glossed: date.glossed || gloss !== '',
    text: date.text + gloss
  };
}

export type {DayAsked, DaySaid, MonthPlace};
export {sayDay};
