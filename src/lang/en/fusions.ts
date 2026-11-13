// The places where neighbouring fields are said together: seconds,
// minutes and hours as one time of day, and the day of the month with a
// day of the week, with its month, and with its year.

import type {
  Field, ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import type {Spoken} from '../../core/select.js';
import type {EnglishOptions} from './options.js';
import type {Choice, Phrase} from './devices.js';
import type {Idiom, Moment} from './idioms.js';
import type {Parts} from './frame.js';
import {denote, describeSet} from '../../core/describe-set.js';
import {clockTimes} from '../../core/fusions.js';
import {shortestSpoken} from '../../core/select.js';
import {domainOf} from '../../core/specs.js';
import {
  choose, daysOfTheMonth, daysOfTheWeek, hoursAsMoments, hoursAsNouns,
  hoursAsStretches, inTieOrder, minutesOfOneHour, monthsAlone, monthsOfDays,
  opensWithEvery, say, secondsOfOneMinute, withinTheHour, yearsByNumber
} from './devices.js';
import {quartzDateIdioms, quartzWeekdayIdioms} from './idioms.js';
import lexicon from './lexicon.js';
import {unit} from './forms.js';
import {join, list, timeNames} from './words.js';

// The most clock times a list of them may hold.
const mostClockTimes = 24;

const {words} = lexicon;

// The fields whose restriction makes a wrap-around in a field untrue:
// hours from 10 p.m. through 2 a.m. run through the night, but "on
// Mondays" they are Monday's first hours and Monday's last. Minutes and
// seconds are held to the same: "from 50 through 10 minutes past the
// hour from 9 a.m. through 5 p.m." would start at 9:50 and end at 6:10.
const coarser: {[field in Field]?: Field[]} = {
  date: ['month', 'year'],
  hour: ['date', 'weekday', 'month', 'year'],
  minute: ['hour', 'date', 'weekday', 'month', 'year'],
  month: ['year'],
  second: ['minute', 'hour', 'date', 'weekday', 'month', 'year']
};

// The unit each of these fields is counted within.
const within = {minute: 'hour', second: 'minute'} as const;

// How the seconds or the minutes of a time are said.
interface Tick {
  // A cadence with no gaps to name: every value, or "every 15 minutes".
  continuous: boolean;
  // The set that is said first: the whole set, or the base of an
  // exception, whose missing values are `excepted` and said last.
  description: SetDescription;
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
  riding: number | undefined;
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

function onlyValue(description: SetDescription): number | null {
  return description.kind === 'values' && description.values.length === 1 ?
    description.values[0] :
    null;
}

// A description as the set that is said first and the values an
// exception then takes out of it, if it is one.
function apart(description: SetDescription):
  {base: SetDescription; removed: number[]} {
  return description.kind === 'except' ?
    description :
    {base: description, removed: []};
}

// A field that takes every value has nothing to say.
function unlessEvery(choice: Choice): string {
  return choice.description.kind === 'all' ? '' : choice.text;
}

// A field's candidate descriptions. A set that runs across the end of
// its cycle into the start, under something coarser that is restricted,
// is described as if the field did not wrap round.
function candidatesOf(facts: ScheduleFacts, field: Field): SetDescription[] {
  const {candidates} = facts.analyses;
  const own = candidates[field] as SetDescription[];
  const domain = domainOf(field);
  const values = denote(own[0], domain);
  const wraps = values.includes(domain.min) && values.includes(domain.max);
  const confined = (coarser[field] || []).some(function restricts(other) {
    const set = candidates[other];

    return set === null || set[0].kind !== 'all';
  });

  return wraps && confined ?
    describeSet(values, {...domain, cyclic: false}) :
    own;
}

// Whether a description is a run from the start of its hour or minute,
// or to the end of it.
function isPortion(description: SetDescription, field: Field): boolean {
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
  about: {description: SetDescription; everyOne: string; last: number},
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
function tick(
  candidates: SetDescription[],
  field: 'minute' | 'second',
  every: {alone: string; one: string; stray: string},
  opts: EnglishOptions
): Tick {
  const {one: everyOne, stray} = every;
  const chosen = choose(candidates,
    withinTheHour(field, {everyOne, heard: [], stray}, opts), opts);
  const {base, removed} = apart(chosen.description);
  const heard: number[] = [];
  const said = say(base,
    withinTheHour(field, {everyOne, heard, stray}, opts), opts) as Phrase;
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

// Second 0 is silent. A continuous cadence of seconds takes the place of
// "every minute", or else runs "for one minute" at each time. Any other
// seconds are counted past every minute, or past the minute and set off
// by a comma. A single second rides on a stray clock time, which then
// needs no words before it.
function secondsLead(second: Tick, rides: boolean): SecondsLead {
  const everyMinute = `${words.every} ${unit('minute', 1)}`;
  const everyHour = `${words.every} ${unit('hour', 1)}`;

  function exceptAt(): string {
    return `${words.except} ${words.at}`;
  }

  if (second.only === 0) {
    return {
      before: '',
      beforeHours: '',
      every: everyMinute,
      everyAlone: everyMinute,
      everyHour,
      exceptAt,
      stray: '',
      strayFirst: '',
      within: ''
    };
  }

  if (second.continuous) {
    const before = `${second.text} ${words.forOneMinute}`;

    return {
      before,
      beforeHours: before,
      every: second.text,
      everyAlone: second.whole,
      everyHour: `${before} ${everyHour}`,
      // Under "every second" a minute taken out is a whole minute.
      exceptAt(count) {
        return `${words.except} ${words.during} ${words.the} ` +
          `${unit('minute', count)} ${words.at}`;
      },
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
    exceptAt,
    stray,
    strayFirst: stray,
    within: before
  };
}

// A run of minutes inside one named hour is a window of clock times.
// Continuous minutes and a plain list of them are not runs.
function minuteWindow(
  hours: SetDescription,
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
  hours: SetDescription,
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
  hours: SetDescription,
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
  hours: SetDescription,
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
  const everyHour = `${words.every} ${unit('hour', 1)}`;

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

  const lead = secondsLead(second, typeof riding === 'number');
  const minute = withSecond(tick(candidatesOf(facts, 'minute'), 'minute',
    {alone: lead.everyAlone, one: lead.every, stray: lead.within}, opts),
  riding);

  return [
    ...clockList(times, lead.before, opts),
    ...inTieOrder(candidatesOf(facts, 'hour').flatMap(function sayWith(hours) {
      return timeWith(hours, {halves, lead, minute, riding}, opts);
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
  const second = tick(candidatesOf(facts, 'second'), 'second',
    {alone: everySecond, one: everySecond, stray: ''}, opts);
  const tail = exceptions(second.excepted, 'second',
    `${words.except} ${words.at}`, opts);
  const seconds = denote(candidates.second![0], domainOf('second'));
  const times = (clockTimes(facts, mostClockTimes) || [])
    .map(function toTheMinute(time) {
      return {hour: time.hour, minute: time.minute};
    });
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

// A phrase with the months said in it, and whether those months end it
// in an exception.
function withMonths(choice: Choice): Said {
  return {excepts: choice.description.kind === 'except', text: choice.text};
}

// A phrase that picks a day out of the month ("on the last Friday") and
// the months it applies to: "of the month", or "of" and the months.
function ofTheMonth(
  phrase: string,
  months: SetDescription[],
  opts: EnglishOptions
): Said {
  const theMonth = `${words.of} ${words.the} ${unit('month', 1)}`;

  return months[0].kind === 'all' ?
    {excepts: false, text: `${phrase} ${theMonth}`} :
    withMonths(choose(months,
      monthsOfDays({day: null, lead: '', phrase}, opts), opts));
}

// The kinds of description that name days of the month outright. They
// are said as dates in a single month ("on June 1 and 15"), and can be
// followed by "of" and several months. An exception or a cadence before
// "of" would be misheard ("except the 15th of March"), and a cadence
// said from a date reads as a run with no end ("every 5 days from June
// 1"), so those keep their own words and take the months after "in".
const namesDays = ['pieces', 'range', 'values'];

// The day-of-month part with its months. `dated` is how many days were
// said as dates in one month (two standing for any more, and for a phrase
// that no longer ends in the month's name).
interface DatePhrase extends Said {
  dated: number;
}

// Days of the month with the months they fall in. One month makes dates
// of numbered days ("on June 1 and 15"); several months follow them after
// "of" ("on the 1st and 15th of January and July"). Any other phrase for
// the days takes the months after "in", and they belong to the base of an
// exception: "on every day in June except the 15th". `spelled` asks for
// every month to be said too ("on the 1st of every month"), where the
// days alone would be taken for days of something longer.
function daysWithMonths(
  days: SetDescription[],
  months: SetDescription[],
  how: {lead: string; spelled: boolean},
  opts: EnglishOptions
): DatePhrase {
  if (days[0].kind === 'all') {
    return {dated: 0, excepts: false, text: ''};
  }

  const alone = choose(months, monthsAlone(opts), opts);
  const month = onlyValue(alone.description);
  const {description} =
    choose(days, daysOfTheMonth(null, how.lead, opts), opts);
  const {base, removed} = apart(description);
  const outright = namesDays.includes(base.kind);
  const voice = daysOfTheMonth(outright ? month : null, how.lead, opts);
  const date = say(description, voice, opts) as Phrase;
  const excepts = removed.length > 0;
  const count = denote(description, domainOf('date')).length;
  const unsaid = alone.description.kind === 'all' && !how.spelled;

  if (unsaid || outright && month !== null) {
    return {dated: Math.min(count, 2), excepts, text: date.text};
  }

  if (namesDays.includes(description.kind)) {
    return {dated: 0, ...withMonths(choose(months, monthsOfDays(
      {day: onlyValue(description), lead: how.lead, phrase: date.text},
      opts), opts))};
  }

  const inMonths = withMonths(alone);

  return excepts ?
    {
      dated: 2,
      excepts,
      text: closedBy(
        join((say(base, voice, opts) as Phrase).text, inMonths.text),
        inMonths.excepts, [voice.exception(removed, base)])
    } :
    {dated: 0, ...inMonths, text: `${date.text} ${inMonths.text}`};
}

// The day-of-month part with its months. A Quartz form is an idiom
// followed by its months, except the weekday nearest a day, which is
// followed by that day said as any day of the month is; the day it names
// is not the day it fires, so it is never a full date.
function dateWithMonths(
  facts: ScheduleFacts,
  months: SetDescription[],
  spelled: boolean,
  opts: EnglishOptions
): DatePhrase {
  const {day} = facts.analyses;

  if (day.date?.kind !== 'quartz') {
    return daysWithMonths(candidatesOf(facts, 'date'), months,
      {lead: words.on, spelled}, opts);
  }

  const {form} = day.date;
  const lead = sayForm(quartzDateIdioms, form, opts);

  return form.kind === 'nearestWeekday' ?
    {
      ...daysWithMonths([{kind: 'values', values: [form.day]}], months,
        {lead, spelled}, opts),
      dated: 2
    } :
    {dated: 0, ...ofTheMonth(lead, months, opts)};
}

// The day-of-week part with its months: "on Fridays in June", "on the
// last Friday of June".
function weekdayWithMonths(
  facts: ScheduleFacts,
  months: SetDescription[],
  opts: EnglishOptions
): Said {
  const {candidates, day} = facts.analyses;

  if (day.weekday?.kind === 'quartz') {
    return ofTheMonth(sayForm(quartzWeekdayIdioms, day.weekday.form, opts),
      months, opts);
  }

  const days = candidates.weekday!;
  const inMonths = choose(months, monthsAlone(opts), opts);

  return days[0].kind === 'all' ?
    {excepts: false, text: ''} :
    inARow([
      withMonths(choose(days, daysOfTheWeek(opts), opts)),
      {...withMonths(inMonths), text: unlessEvery(inMonths)}
    ]);
}

// The day part: a day of the month and a day of the week, each with its
// months, joined by "as well as" when both are restricted.
function daysOf(
  facts: ScheduleFacts,
  months: SetDescription[],
  spelled: boolean,
  opts: EnglishOptions
): DatePhrase {
  const date = dateWithMonths(facts, months, spelled, opts);
  const weekday = weekdayWithMonths(facts, months, opts);

  return {
    dated: date.dated,
    ...inARow([date, {
      ...weekday,
      text: join(date.text && weekday.text && words.asWellAs, weekday.text)
    }])
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

/**
 * The time, the day, the month and the year, each as it is said. A day
 * of the month and a day of the week are joined by "as well as". Each
 * takes the months into its phrase, so the month has its own part only
 * when neither kind of day is restricted, or when both are and the month
 * phrase is longer than one month: then it is said once after the two,
 * set off by a comma that closes the day part. A part that ends in an
 * exception is closed with a comma too, when anything follows it.
 */
function partsOf(facts: ScheduleFacts, opts: EnglishOptions): Parts {
  const {union} = facts.analyses.day;
  const months = candidatesOf(facts, 'month');
  const alone = choose(months, monthsAlone(opts), opts);
  const oneMonth = onlyValue(alone.description) !== null;
  const after = union && !oneMonth ? unlessEvery(alone) : '';
  const beside: SetDescription[] = after ? [{kind: 'all'}] : months;
  const years = choose(candidatesOf(facts, 'year'), yearsByNumber(opts), opts);
  const hangs = hangsOnTheDay(years);
  // A day of the month before "of every other year" says its month.
  const days = daysOf(facts, beside, hangs && !after, opts);
  const year = yearOf(years, {dated: days.dated, oneMonth, union}, opts);
  const time = timeOfDay(facts, opts);
  // A time of day with no day named skips a level, unless it runs round
  // the clock; and a cadence of years needs a day to hang on.
  const everyDay = time.fills && !hangs ?
    '' :
    `${words.every} ${unit('day', 1)}`;
  const month = days.text ? after : unlessEvery(alone);
  const [timePart, dayPart, monthPart, yearPart] = closed([
    time,
    {
      excepts: days.excepts || after !== '' || year.comma,
      text: days.text || everyDay
    },
    {excepts: withMonths(alone).excepts, text: month},
    {excepts: false, text: year.text}
  ]);

  return {day: dayPart, month: monthPart, time: timePart, year: yearPart};
}

export {partsOf};
