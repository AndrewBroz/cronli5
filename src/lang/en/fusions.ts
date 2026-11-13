// The places where neighbouring fields are said together: seconds,
// minutes and hours as one time of day, and the day of the month with a
// day of the week, with its month, and with its year.

import type {
  DateArm, DateReach, Field, ScheduleFacts, SetDescription, WeekdayArm
} from '../../core/schedule.js';
import type {Spoken} from '../../core/select.js';
import type {EnglishOptions} from './options.js';
import type {Choice, Described, Phrase} from './devices.js';
import type {Idiom, Moment} from './idioms.js';
import type {Parts} from './frame.js';
import {
  denote, describeCadencePieces, describeSet
} from '../../core/describe-set.js';
import {clockTimes} from '../../core/fusions.js';
import {shortestSpoken} from '../../core/select.js';
import {candidatesAs} from '../../core/set-views.js';
import {domainOf} from '../../core/specs.js';
import {
  choose, daysOfTheMonth, daysOfTheWeek, hoursAsMoments, hoursAsNouns,
  hoursAsStretches, inTieOrder, minutesOfOneHour, monthsAlone, monthsOfDays,
  opensWithEvery, say, secondsOfOneMinute, withinTheHour, yearsByNumber
} from './devices.js';
import {quartzDateIdioms, quartzWeekdayIdioms} from './idioms.js';
import lexicon from './lexicon.js';
import {unit} from './forms.js';
import {
  dayNames, either, join, list, monthNames, timeNames
} from './words.js';

// The most clock times a list of them may hold.
const mostClockTimes = 24;

const {words} = lexicon;

// The fields whose restriction makes a wrap-around in a field untrue:
// hours from 10 p.m. through 2 a.m. run through the night, but "on
// Mondays" they are Monday's first hours and Monday's last.
const coarser: {[field in Field]?: Field[]} = {
  hour: ['date', 'weekday', 'month', 'year'],
  month: ['year']
};

// The fields whose values are numbers counted from the start of their
// unit. A run of numbers that passed the end and began again would read
// backwards or as a mistake ("from 50 through 10 minutes", "the 29th
// through the 2nd"), so these are always laid out in ascending order.
const numbered: Field[] = ['second', 'minute', 'date'];

// The unit each of these fields is counted within.
const within = {minute: 'hour', second: 'minute'} as const;

// How the seconds or the minutes of a time are said.
interface Tick {
  // A cadence with no gaps to name: every value, or "every 15 minutes".
  continuous: boolean;
  // The set that is said first: the whole set, or the base of an
  // exception, whose missing values are `excepted` and said last.
  description: Described;
  excepted: number[];
  length: number;
  // The value, when there is just one.
  only: number | null;
  // Whether the phrase begins "every minute" (or "every second").
  opens: boolean;
  // Whether the phrase is a part of the hour or minute ("for the first
  // 30 minutes of") and not a count past it.
  portion: boolean;
  text: string;
  // The last run of a cadence that needs no bounds, for a window around
  // it to close on.
  close: {minute: number} | null;
  // The phrase when nothing coarser is restricted: "at 30 minutes past
  // the hour", "for the first 30 minutes of every hour".
  whole: string;
}

// What the seconds contribute to the rest of the time.
interface SecondsLead {
  // The words that go before a time part that does not begin "every
  // minute", and before hours named on the hour, which give the seconds
  // no minute to be counted past.
  before: string;
  beforeHours: string;
  // The words that take the place of "every minute", of "every minute"
  // when nothing else is said of the time, and of "every hour".
  every: string;
  everyAlone: string;
  everyHour: string;
  // The words that introduce so many minutes taken out by an exception.
  exceptAt(count: number): string;
  // The words before a stray clock time: after a window, and when it
  // comes first.
  stray: string;
  strayFirst: string;
  // The words before stray minutes counted past the hour, after a run of
  // minutes.
  within: string;
}

// What a description of the hours is said with. `riding` is the single
// second that clock times carry, if there is one.
interface TimeContext {
  // Whether two hours that halve the day may be said as a cadence.
  halves: boolean;
  lead: SecondsLead;
  minute: Tick;
  riding?: number;
}

// A stretch of the sentence, and whether it ends in an exception.
interface Said {
  excepts: boolean;
  text: string;
}

// A way of saying the time. `carry` is the same phrase with the single
// second riding on its clock times, or null if it names none. `excepts`
// marks a phrase that already ends in an exception.
interface TimePhrase extends Spoken {
  carry: string | null;
  excepts: boolean;
  // Whether the hours run round the clock, so that no daily rhythm is
  // there to name.
  fills: boolean;
  yields: boolean;
}

function onlyValue(description: Described): number | null {
  return description.kind === 'values' && description.values.length === 1 ?
    description.values[0] :
    null;
}

// A description as the set that is said first and the values an
// exception then takes out of it, if it is one.
function apart(description: Described):
  {base: Described; removed: number[]} {
  return description.kind === 'except' ?
    description :
    {base: description, removed: []};
}

// A field that takes every value has nothing to say.
function unlessEvery(choice: Choice): string {
  return choice.description.kind === 'all' ? '' : choice.text;
}

// Whether a field's set is laid out with nothing wrapping: always for a
// numbered field, and for hours or months under something coarser that
// is restricted.
function isLinear(facts: ScheduleFacts, field: Field): boolean {
  const {candidates} = facts.analyses;

  return numbered.includes(field) ||
    (coarser[field] || []).some(function restricts(other) {
      const set = candidates[other];

      return set === null || set[0].kind !== 'all';
    });
}

// Every way to describe a field's set: the core's candidates, laid out
// as the field is said, and its runs and cadences together when the core
// offers them.
function candidatesOf(facts: ScheduleFacts, field: Field): Described[] {
  const {cadencePieces, candidates} = facts.analyses;
  const mixed = cadencePieces[field];
  const said = isLinear(facts, field) ?
    candidatesAs(facts, field, {linear: true}) :
    candidates[field];

  return [...said || [], ...mixed ? [mixed] : []];
}

// The same for a set that is not the field's own: the days the reached
// months really have, the months a day can fire in.
function waysToSay(values: number[], field: Field, facts: ScheduleFacts):
  Described[] {
  const domain = domainOf(field);
  const mixed = describeCadencePieces(values, domain);

  return [
    ...describeSet(values, domain, {linear: isLinear(facts, field)}),
    ...mixed ? [mixed] : []
  ];
}

// Whether a description is a run from the start of its hour or minute,
// or to the end of it.
function isPortion(description: Described, field: Field): boolean {
  const {max, min} = domainOf(field);

  return description.kind === 'range' &&
    (description.from === min || description.to === max);
}

// Minutes or seconds that are not continuous, up to the word that ties
// them to what follows, and the article the next unit takes when every
// one of them is meant. A run from the start is "for the first N minutes
// of every hour", a run to the end "for the last N minutes of", and
// anything else is counted "minutes past the hour", the unit agreeing
// with the `last` number said.
function anchored(
  said: string,
  about: {description: Described; everyOne: string; last: number},
  field: 'minute' | 'second'
): [string, string] {
  const {description} = about;
  const {max, min} = domainOf(field);

  if (description.kind !== 'range' || !isPortion(description, field)) {
    return [join(said, unit(field, about.last), words.past), words.the];
  }

  const which = description.from === min ?
    `${words.first} ${description.to - min + 1}` :
    `${words.last} ${max - description.from + 1}`;

  return [
    `${about.everyOne} ${words.for} ${words.the} ${which} ` +
      `${unit(field, 0)} ${words.of}`,
    words.every
  ];
}

// How the seconds or the minutes are said: the phrase naming the fewest
// things, settled before anything coarser is considered. `every.one` is
// what every value of the field is said as, and `every.alone` what it is
// said as when nothing coarser is restricted: "every second", and "every
// minute" unless finer seconds take its place. An exception is split
// into its base, said here, and the values it takes out, said last.
// `every.anyLength` is whether a cadence with both ends named is said
// however few values it has.
function tick(
  candidates: Described[],
  field: 'minute' | 'second',
  every: {alone: string; anyLength?: boolean; one: string; stray: string},
  opts: EnglishOptions
): Tick {
  const {anyLength, one: everyOne, stray} = every;
  const chosen = choose(candidates,
    withinTheHour(field, {anyLength, everyOne, heard: [], stray}, opts),
    opts);
  const {base, removed} = apart(chosen.description);
  const heard: number[] = [];
  const said = say(base,
    withinTheHour(field, {anyLength, everyOne, heard, stray}, opts),
    opts) as Phrase;
  const continuous = base.kind === 'all' ||
    base.kind === 'cadence' && said.length === 1;
  const only = onlyValue(base);
  const last = heard[heard.length - 1];
  const [text, article] = continuous ?
    [said.text, ''] :
    anchored(said.text, {description: base, everyOne, last}, field);

  return {
    close: continuous && base.kind === 'cadence' ?
      {minute: base.last} :
      null,
    continuous,
    description: base,
    excepted: removed,
    // A single minute or second is carried by what it is said with, and
    // adds nothing to what is named.
    length: only === null ? chosen.length : 0,
    only,
    opens: opensWithEvery(base, field),
    portion: isPortion(base, field),
    text,
    whole: chosen.description.kind === 'all' ?
      every.alone :
      join(text, article, article && unit(within[field], 1))
  };
}

// The values an exception takes out of the minutes or seconds, said
// against the hour or the minute they fall in: "except at 29 minutes
// past the hour".
function exceptions(
  excepted: number[],
  field: 'minute' | 'second',
  exceptAt: string,
  opts: EnglishOptions
): string[] {
  const clause = join(exceptAt, list(excepted.map(String), opts),
    unit(field, excepted[excepted.length - 1]), words.past, words.the,
    unit(within[field], 1));

  return excepted.length === 0 ? [] : [clause];
}

// A phrase with the exceptions that close it. The first follows
// directly, unless the phrase already ends in an exception; any other is
// set off: "…, and except at 30 minutes past the hour".
function closedBy(text: string, excepts: boolean, clauses: string[]): string {
  return clauses.reduce(function close(phrase, clause, index) {
    return phrase + (excepts || index > 0 ? `, ${words.and} ` : ' ') + clause;
  }, text);
}

const everyMinute = `${words.every} ${unit('minute', 1)}`;
const everyHour = `${words.every} ${unit('hour', 1)}`;

// What is said of the time when the seconds say nothing.
const noSeconds: SecondsLead = {
  before: '',
  beforeHours: '',
  every: everyMinute,
  everyAlone: everyMinute,
  everyHour,
  exceptAt() {
    return `${words.except} ${words.at}`;
  },
  stray: '',
  strayFirst: '',
  within: ''
};

// Under any seconds a minute taken out is a whole minute, and is called
// one: "except at 29 minutes past the hour" would spare a single moment.
function exceptTheMinutes(count: number): string {
  return `${words.except} ${words.during} ${words.the} ` +
    `${unit('minute', count)} ${words.at}`;
}

// Second 0 is silent. A continuous cadence of seconds takes the place of
// "every minute", or else runs "for one minute" at each time. Any other
// seconds are counted past every minute, or past the minute and set off
// by a comma. A single second rides on a stray clock time, which then
// needs no words before it.
function secondsLead(second: Tick, rides: boolean): SecondsLead {
  if (second.only === 0) {
    return noSeconds;
  }

  if (second.continuous) {
    const before = `${second.text} ${words.forOneMinute}`;

    return {
      before,
      beforeHours: before,
      every: second.text,
      everyAlone: second.whole,
      everyHour: `${before} ${everyHour}`,
      exceptAt: exceptTheMinutes,
      stray: words.forOneMinute,
      strayFirst: before,
      within: words.forOneMinute
    };
  }

  const before = `${second.text} ${words.the} ${unit('minute', 1)},`;
  const stray = rides ? '' : before;

  return {
    before,
    beforeHours: `${second.text} ${words.the} ${unit('hour', 1)},`,
    every: `${second.text} ${everyMinute}`,
    everyAlone: second.whole,
    everyHour: `${second.text} ${everyHour}`,
    exceptAt: exceptTheMinutes,
    stray,
    strayFirst: stray,
    within: before
  };
}

// A run of minutes inside one named hour is a window of clock times.
// Continuous minutes and a plain list of them are not runs.
function minuteWindow(
  hours: Described,
  context: TimeContext,
  opts: EnglishOptions
): Phrase | null {
  const hour = onlyValue(hours);
  const {lead, minute} = context;
  const listed = minute.description.kind === 'values';

  if (hour === null || minute.continuous || listed) {
    return null;
  }

  const window = say(minute.description, minutesOfOneHour(hour, {
    every: lead.every,
    second: context.riding,
    stray: minute.opens ? lead.stray : lead.strayFirst
  }, opts), opts);

  return window && {...window, fills: false, length: minute.length};
}

// Continuous minutes lead and the hours confine them; any other minutes
// are counted past the hours.
function minutesWith(
  hours: Described,
  context: TimeContext,
  opts: EnglishOptions
): Phrase | null {
  const {lead, minute} = context;
  const rest = say(hours,
    minute.continuous ?
      hoursAsStretches(minute.close, opts) :
      hoursAsNouns(minute.portion, opts),
    opts);

  return rest && {
    ...rest,
    length: minute.length + rest.length,
    text: join(minute.opens ? '' : lead.before,
      hours.kind === 'all' ? minute.whole : join(minute.text, rest.text))
  };
}

// A single minute rides on each hour as a moment, and a single second
// can ride there with it. "Every hour" has no moment for a second to
// ride on, so the seconds are said against the hour, as they are before
// any hours named on the hour that do not carry them.
function momentsWith(
  hours: Described,
  context: TimeContext,
  opts: EnglishOptions
): TimePhrase | null {
  const {lead, minute, riding} = context;

  if (minute.only === null) {
    return null;
  }

  const at = {minute: minute.only, pair: context.halves};
  const moments = say(hours, hoursAsMoments(at, opts), opts);
  const carrying = say(hours, hoursAsMoments({...at, second: riding}, opts),
    opts);

  return moments && {
    ...moments,
    carry: carrying && carrying.text,
    excepts: hours.kind === 'except',
    text: hours.kind === 'all' ?
      lead.everyHour :
      join(minute.only === 0 ? lead.beforeHours : lead.before, moments.text)
  };
}

// The time said with one description of the hours, by the first of these
// that applies. A single minute rides on each hour as a moment. A run of
// minutes in one hour is a window. Otherwise the minutes are said with
// the hours, and any exception to the minutes closes the phrase.
function timeWith(
  hours: Described,
  context: TimeContext,
  opts: EnglishOptions
): TimePhrase[] {
  const {lead, minute} = context;
  const moments = momentsWith(hours, context, opts);
  const phrase = minuteWindow(hours, context, opts) ||
    minutesWith(hours, context, opts);
  const clauses = exceptions(minute.excepted, 'minute',
    lead.exceptAt(minute.excepted.length), opts);
  const excepts = hours.kind === 'except';
  const said = phrase && {
    ...phrase,
    carry: null,
    excepts: excepts || clauses.length > 0,
    text: closedBy(phrase.text, excepts, clauses)
  };

  return [moments || said].filter(function present(found) {
    return found !== null;
  }) as TimePhrase[];
}

// A list of clock times, when there are any and few enough to list.
// `before` is what the seconds say in front of it.
function clockList(moments: Moment[], before: string, opts: EnglishOptions):
  TimePhrase[] {
  const text = join(before, words.at,
    list(timeNames(moments, opts), opts));

  return moments.length === 0 || moments.length > mostClockTimes ?
    [] :
    [{carry: null, excepts: false, fills: false, length: moments.length,
      text, yields: false}];
}

// A single minute and a single second, counted together past hours that
// have no moment to carry them: "at 30 minutes and 15 seconds past".
function withSecond(minute: Tick, riding: number | undefined): Tick {
  const both = join(words.at, String(minute.only),
    unit('minute', minute.only ?? 0), words.and, String(riding),
    unit('second', riding ?? 0), words.past);

  return typeof riding === 'number' && minute.only !== null ?
    {...minute, opens: true, text: both, whole: `${both} ${everyHour}`} :
    minute;
}

// The ways of saying the time that are built on the seconds: a window
// of one clock time when the seconds are not a plain list, and otherwise
// the minutes, already settled, with each description of the hours, and
// the list of clock times to the minute.
function timesWith(
  facts: ScheduleFacts,
  second: Tick,
  times: Moment[],
  opts: EnglishOptions
): TimePhrase[] {
  const {clockSecond: riding, written} = facts.analyses;
  // Hours 0 and 12 on the hour, to the second, are as easy to take in as
  // "every 12 hours" as they are as two times, so they are said the way
  // they were written. Nothing else is decided by how a field was written.
  const halves = written.hour === 'cadence' && second.only === 0;

  if (times.length === 1 && second.description.kind !== 'values') {
    const window = say(second.description, secondsOfOneMinute(times[0], opts),
      opts) as Phrase;

    return [{...window, carry: null, excepts: false, fills: false,
      length: 1}];
  }

  const spoken = secondsLead(second, typeof riding === 'number');
  const minutes = candidatesOf(facts, 'minute');
  // Seconds counted past the minute take the place of "every minute" in
  // what follows. Where the minutes are a run with strays beside it, that
  // would say the seconds once for the run and again for each stray, so
  // they are said once in front, set off by a comma, and the minutes
  // follow as they are said without seconds.
  const fronted = !second.continuous && second.only !== 0 &&
    choose(minutes, withinTheHour('minute',
      {everyOne: '', heard: [], stray: ''}, opts), opts)
      .description.kind === 'pieces';
  const lead = fronted ? {...noSeconds, exceptAt: spoken.exceptAt} : spoken;
  const minute = withSecond(tick(minutes, 'minute',
    {alone: lead.everyAlone, one: lead.every, stray: lead.within}, opts),
  riding);
  const context = {halves, lead, minute, ...!fronted && {riding}};

  return [
    ...clockList(times, spoken.before, opts),
    ...inTieOrder(candidatesOf(facts, 'hour').flatMap(function sayWith(hours) {
      return timeWith(hours, context, opts).map(function inFront(phrase) {
        return {
          ...phrase,
          text: join(fronted ? spoken.before : '', phrase.text)
        };
      });
    }))
  ];
}

/**
 * The time of day. The seconds, already settled, are said with the
 * minutes and hours in each way those can be said, a single second
 * riding on the clock times of a phrase that names any; an exception to
 * the seconds closes the phrase. These compete, on the things the
 * seconds name and the rest names, with the plain list of clock times to
 * the second, which wins a tie.
 */
function timeOfDay(facts: ScheduleFacts, opts: EnglishOptions): TimePhrase {
  const {candidates, clockSecond} = facts.analyses;
  const everySecond = `${words.every} ${unit('second', 1)}`;
  const times = (clockTimes(facts, mostClockTimes) || [])
    .map(function toTheMinute(time) {
      return {hour: time.hour, minute: time.minute};
    });
  // Inside one clock time the seconds are a window of it, where a list
  // would be of clock times to the second, so a cadence with both ends
  // named is kept for any number of them.
  const second = tick(candidatesOf(facts, 'second'), 'second', {
    alone: everySecond,
    anyLength: times.length === 1,
    one: everySecond,
    stray: ''
  }, opts);
  const tail = exceptions(second.excepted, 'second',
    `${words.except} ${words.at}`, opts);
  const seconds = denote(candidates.second![0], domainOf('second'));
  const toTheSecond = times.flatMap(function eachSecond(time) {
    // A time that falls on the minute is written without its seconds.
    return seconds.map(function at(value) {
      return {...time, ...value > 0 && {second: value}};
    });
  });
  const others = timesWith(facts, second, times, opts).map(function whole(
    said
  ) {
    const carried = typeof clockSecond === 'number' && said.carry;

    return {
      ...said,
      excepts: said.excepts || tail.length > 0,
      length: second.length + said.length,
      text: closedBy(carried || said.text, said.excepts, tail)
    };
  });

  return shortestSpoken([...clockList(toTheSecond, '', opts), ...others]);
}

function sayForm<Form>(rows: Array<Idiom<Form>>, form: Form,
  opts: EnglishOptions): string {
  return (rows.find(function fits(row) {
    return row.applies(form);
  }) as Idiom<Form>).say(form, opts);
}

// Stretches said one after another, each as it will stand in the
// sentence. Whatever follows an exception is heard as part of it ("except
// at 8 a.m. on the 1st"), so a stretch that ends in one is closed with a
// comma when anything follows it.
function closed(stretches: Said[]): string[] {
  return stretches.map(function close(stretch, index) {
    const followed = stretches.slice(index + 1).some(function said(later) {
      return later.text !== '';
    });
    const closes = stretch.text !== '' && stretch.excepts && followed;

    return stretch.text + (closes ? ',' : '');
  });
}

// Stretches joined into one, which ends in an exception if its last does.
function inARow(stretches: Said[]): Said {
  const said = stretches.filter(function present(stretch) {
    return stretch.text !== '';
  });

  return {
    excepts: said.length > 0 && said[said.length - 1].excepts,
    text: closed(said).join(' ')
  };
}

// A phrase as it stands before whatever follows it. One that ends in an
// exception, or is several pieces each with its own lead, is closed with
// a comma there: what came next would be heard with its last piece only
// ("in June through August and in December in 2030").
function setOff(choice: Choice): Said {
  return {
    excepts: ['except', 'pieces'].includes(choice.description.kind),
    text: choice.text
  };
}

// A phrase that picks a day out of the month ("on the last Friday") and
// the months it applies to: "of the month", or "of" and the months.
function ofTheMonth(
  phrase: string,
  months: Described[],
  opts: EnglishOptions
): Said {
  const theMonth = `${words.of} ${words.the} ${unit('month', 1)}`;

  return months[0].kind === 'all' ?
    {excepts: false, text: `${phrase} ${theMonth}`} :
    setOff(choose(months,
      monthsOfDays({day: null, lead: '', phrase}, opts), opts));
}

// The kinds of description that name days of the month outright. They
// are said as dates in a single month ("on June 1 and 15"). An exception
// or a cadence keeps its own words and takes the months after "in": "on
// every day in June except the 15th".
const namesDays = ['pieces', 'range', 'values'];

// Those that several months can follow after "of": "on the 1st and 15th
// of January and July". After several pieces "of" would be heard with the
// last piece alone, so the months follow a comma and "in".
const takesOf = ['range', 'values'];

// The kinds whose phrase says that it starts again each month.
const startsAgain = ['cadence', 'cadencePieces'];

// The day-of-month part with its months. `dated` is how many days were
// said as dates in one month (two standing for any more, and for a phrase
// that no longer ends in the month's name).
// `takesOut` marks days said with an exception.
interface DatePhrase extends Said {
  dated: number;
  takesOut: boolean;
}

// The two day fields as they are to be said, once the calendar has had
// its say: a day-of-month arm that never fires is left out, a set of days
// that is every day of its months is no restriction, the days are those
// the months really have, and the months are those the day can fire in.
interface DayFields {
  date: DateArm | null;
  dates: Described[];
  // What is said after the years when the day part fires only in leap
  // years.
  leap: string;
  months: Described[];
  union: boolean;
  weekday: WeekdayArm | null;
  weekdays: Described[];
}

const whole: Described[] = [{kind: 'all'}];

// In a date-or-weekday pair an exception on one side is heard as taking
// its days from the other side too ("on the 15th as well as Monday
// through Saturday except Thursday" loses a Thursday the 15th). A week is
// short enough to name without one.
function weekdaysBeside(candidates: Described[], union: boolean): Described[] {
  return candidates.filter(function sayable(description) {
    return !union || description.kind !== 'except';
  });
}

// The days of the month as they can be described. The days the months
// really have come first, so that on a tie nothing names a day that does
// not exist. The field's own set is still on offer: "odd-numbered days
// in June" names no 31st.
function datesOf(facts: ScheduleFacts, date: DateArm | null): Described[] {
  const own = candidatesOf(facts, 'date');
  const real = facts.analyses.dateReach?.days?.candidates[0];

  if (date === null) {
    return whole;
  }

  return real ?
    [...waysToSay(denote(real, domainOf('date')), 'date', facts), ...own] :
    own;
}

// The months as they can be described: where they are named and the day
// of the month never comes in some of them, only those it can fire in.
function monthsOf(facts: ScheduleFacts, reach: DateReach | null):
  Described[] {
  const named = facts.analyses.candidates.month![0].kind !== 'all';

  return reach && named && reach.never.length > 0 ?
    waysToSay([...reach.everyYear, ...reach.leapYears].sort(
      function ascending(a, b) {
        return a - b;
      }
    ), 'month', facts) :
    candidatesOf(facts, 'month');
}

// What follows the years when the day part comes in leap years alone.
function leapWords(reach: DateReach | null): string {
  return reach && reach.everyYear.length === 0 ? words.leapYears : '';
}

function dayFields(facts: ScheduleFacts): DayFields {
  const {candidates, dateReach, day} = facts.analyses;
  const everyDay = dateReach?.days?.everyDay === true;
  const date = everyDay || dateReach?.fires === false ? null : day.date;
  const weekday = everyDay ? null : day.weekday;
  const union = date !== null && weekday !== null;
  // What the calendar says of the day of the month counts where that
  // arm is said and stands alone.
  const reach = date === null || union ? null : dateReach;

  return {
    date,
    dates: datesOf(facts, date),
    leap: leapWords(reach),
    months: monthsOf(facts, reach),
    union,
    weekday,
    weekdays: weekday ?
      weekdaysBeside(candidates.weekday || whole, union) :
      whole
  };
}

// Days of the month with the months they fall in. One month makes dates
// of numbered days ("on June 1 and 15"); several months follow them after
// "of" ("on the 1st and 15th of January and July"). Any other phrase for
// the days takes the months after "in", and they belong to the base of an
// exception: "on every day in June except the 15th". `spelled` asks for
// every month to be said too ("on the 1st of every month"), where the
// days alone would be taken for days of something longer.
function daysWithMonths(
  days: Described[],
  months: Described[],
  how: {lead: string; spelled: boolean},
  opts: EnglishOptions
): DatePhrase {
  if (days[0].kind === 'all') {
    return {dated: 0, excepts: false, takesOut: false, text: ''};
  }

  const alone = choose(months, monthsAlone(opts), opts);
  const month = onlyValue(alone.description);
  const {description} =
    choose(days, daysOfTheMonth(null, how.lead, opts), opts);
  const {base, removed} = apart(description);
  const outright = namesDays.includes(base.kind);
  const voice = daysOfTheMonth(outright ? month : null, how.lead, opts);
  const date = say(description, voice, opts) as Phrase;
  const count = denote(description, domainOf('date')).length;
  const takesOut = removed.length > 0;
  // An exception is closed with a comma, and nothing hangs on it; a
  // cadence of days has said "of the month" already.
  const unsaid = alone.description.kind === 'all' && (!how.spelled ||
    takesOut || date.named && startsAgain.includes(description.kind));

  if (unsaid || outright && month !== null) {
    return {dated: Math.min(count, 2), takesOut,
      ...setOff({...date, description})};
  }

  if (takesOf.includes(description.kind)) {
    return {dated: 0, takesOut, ...setOff(choose(months, monthsOfDays(
      {day: onlyValue(description), lead: how.lead, phrase: date.text},
      opts), opts))};
  }

  const inMonths = setOff(alone);

  return takesOut ?
    {
      dated: 2,
      excepts: true,
      takesOut,
      text: closedBy(
        join((say(base, voice, opts) as Phrase).text, inMonths.text),
        inMonths.excepts, [voice.exception(removed, base as SetDescription)])
    } :
    {dated: 0, takesOut, ...inARow([setOff({...date, description}), inMonths])};
}

// The day-of-month part with its months. A Quartz form is an idiom
// followed by its months, except the weekday nearest a day, which is
// followed by that day said as any day of the month is; the day it names
// is not the day it fires, so it is never a full date.
function dateWithMonths(
  fields: DayFields,
  months: Described[],
  spelled: boolean,
  opts: EnglishOptions
): DatePhrase {
  const {date} = fields;

  if (date?.kind !== 'quartz') {
    return daysWithMonths(fields.dates, months, {lead: words.on, spelled},
      opts);
  }

  const {form} = date;
  const lead = sayForm(quartzDateIdioms, form, opts);

  return form.kind === 'nearestWeekday' ?
    {
      ...daysWithMonths([{kind: 'values', values: [form.day]}], months,
        {lead, spelled}, opts),
      dated: 2
    } :
    {dated: 0, takesOut: false, ...ofTheMonth(lead, months, opts)};
}

// The day-of-week part with its months: "on Fridays in June", "on the
// last Friday of June".
function weekdayWithMonths(
  fields: DayFields,
  months: Described[],
  opts: EnglishOptions
): Said {
  const {weekday, weekdays} = fields;

  if (weekday?.kind === 'quartz') {
    return ofTheMonth(sayForm(quartzWeekdayIdioms, weekday.form, opts),
      months, opts);
  }

  const inMonths = choose(months, monthsAlone(opts), opts);

  return weekdays[0].kind === 'all' ?
    {excepts: false, text: ''} :
    inARow([
      setOff(choose(weekdays, daysOfTheWeek(opts), opts)),
      {...setOff(inMonths), text: unlessEvery(inMonths)}
    ]);
}

// The day part: a day of the month and a day of the week, each with its
// months, joined by "as well as" when both are restricted. An exception
// among the days of the month would be heard as taking its days from the
// weekdays too ("every day except the 15th, as well as on Fridays" loses
// a Friday the 15th), so the weekdays then say that they run whatever the
// date. The pair is closed with a comma before anything that follows,
// which would be heard with its second side alone.
function daysOf(
  fields: DayFields,
  months: Described[],
  spelled: boolean,
  opts: EnglishOptions
): DatePhrase {
  const date = dateWithMonths(fields, months, spelled, opts);
  const weekday = weekdayWithMonths(fields, months, opts);
  const both = inARow([{...date, excepts: date.takesOut}, {
    ...weekday,
    text: join(date.text && weekday.text && words.asWellAs, weekday.text,
      date.takesOut && weekday.text ? words.whateverTheDate : '')
  }]);

  return {
    ...date,
    excepts: fields.union || both.excepts || date.excepts,
    text: both.text
  };
}

// Whether the years are said as a cadence by its interval, with or
// without exceptions. Such a cadence hangs on the day with "of", so it
// needs a day to be said; the even and odd years have their own words
// and hang on nothing.
function hangsOnTheDay(year: Choice): boolean {
  return apart(year.description).base.kind === 'cadence' && year.named;
}

// The year part. One month and one year are said together, the year
// directly after the month's name or after the one date in it ("in June
// 2030", "on January 1, 2030", where the date closes with a comma). Any
// other years follow "in", or "of" for a cadence. `dated` is how many
// days were said as dates in one month.
function yearOf(
  year: Choice,
  beside: {dated: number; oneMonth: boolean; union: boolean},
  opts: EnglishOptions
): {comma: boolean; text: string} {
  const oneYear = onlyValue(year.description);
  const together = !beside.union && beside.oneMonth && oneYear !== null &&
    beside.dated < 2;

  return {
    comma: together && beside.dated === 1 && !opts.style.dayFirst,
    text: together ? String(oneYear) : unlessEvery(year)
  };
}

// A schedule whose day of the month no reached month has never runs, and
// the reason is the whole description: "never, because there is no June
// 31". A Quartz count back from the last day names no date, so it is said
// as the count: "because no day is 30 days before the last day of June".
function neverFires(
  facts: ScheduleFacts,
  reach: DateReach,
  opts: EnglishOptions
): string {
  const {candidates, day} = facts.analyses;
  const form = day.date?.kind === 'quartz' ? day.date.form : null;
  const days = form?.kind === 'nearestWeekday' ?
    [form.day] :
    denote((candidates.date || [{kind: 'all'}])[0], domainOf('date'));
  const years =
    choose(candidatesOf(facts, 'year'), yearsByNumber(false, opts), opts);
  // One year is named; "there is no February 29 in every 4th year from
  // 2031" is not English, so any other years are only pointed to.
  const year = onlyValue(years.description) === null ?
    words.anyYearNamed :
    years.text;
  const reason = form?.kind === 'beforeLast' ?
    join(words.noDayIs, sayForm(quartzDateIdioms, form, opts), words.of,
      either(monthNames(reach.never, opts), opts)) :
    join(words.thereIsNo, either(reach.never.flatMap(function inMonth(month) {
      return dayNames(days, month, false, opts);
    }), opts));

  return join(`${words.never},`, words.because, reason,
    unlessEvery({...years, text: year}));
}

// The years after a part that is closed with a comma. A cadence of years
// cannot hang on a day across the comma, and takes "in" there.
function acrossComma(hung: Choice, closes: boolean, opts: EnglishOptions):
  Choice {
  return closes && hangsOnTheDay(hung) ?
    {...hung, ...say(hung.description, yearsByNumber(false, opts), opts)} :
    hung;
}

// The time, the day, the month and the year of a schedule that runs. A
// day of the month and a day of the week are joined by "as well as". Each
// takes the months into its phrase, so the month has its own part only
// when neither kind of day is restricted, or when both are and the month
// phrase is longer than one month: then it is said once after the two.
// A part that ends in an exception, or is several pieces, or is such a
// pair of days, is closed with a comma when anything follows it.
function partsThatRun(facts: ScheduleFacts, opts: EnglishOptions): Parts {
  const fields = dayFields(facts);
  const {months, union} = fields;
  const alone = choose(months, monthsAlone(opts), opts);
  const oneMonth = onlyValue(alone.description) !== null;
  const after = union && !oneMonth ? unlessEvery(alone) : '';
  const hung =
    choose(candidatesOf(facts, 'year'), yearsByNumber(true, opts), opts);
  const hangs = hangsOnTheDay(hung);
  // A day of the month before "of every other year" says its month.
  const days = daysOf(fields, after ? whole : months, hangs && !union, opts);
  const time = timeOfDay(facts, opts);
  // A time of day with no day named skips a level, unless it runs round
  // the clock; and a cadence of years needs a day to hang on.
  const everyDay = time.fills && !hangs ?
    '' :
    `${words.every} ${unit('day', 1)}`;
  const month = {
    excepts: setOff(alone).excepts,
    text: days.text ? after : unlessEvery(alone)
  };
  const year = yearOf(
    acrossComma(hung, month.text ? month.excepts : days.excepts, opts),
    {dated: days.dated, oneMonth, union}, opts);
  const [timePart, dayPart, monthPart, yearPart] = closed([
    time,
    {excepts: days.excepts || year.comma, text: days.text || everyDay},
    month,
    {excepts: true, text: year.text},
    {excepts: false, text: fields.leap}
  ]);

  return {
    day: dayPart,
    month: monthPart,
    time: timePart,
    year: join(yearPart, fields.leap)
  };
}

/**
 * The four parts of a description, each as it is said. A schedule that
 * can never run says only that, in the place of the time.
 */
function partsOf(facts: ScheduleFacts, opts: EnglishOptions): Parts {
  const {dateReach: reach, day} = facts.analyses;

  return reach && !reach.fires && !day.union ?
    {day: '', month: '', time: neverFires(facts, reach, opts), year: ''} :
    partsThatRun(facts, opts);
}

export {partsOf};
