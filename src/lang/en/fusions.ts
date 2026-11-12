// The places where neighbouring fields are said together: seconds,
// minutes and hours as one time of day, and the day of the month with a
// day of the week, with its month, and with its year.

import type {
  ClockTime, Field, ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import type {Spoken} from '../../core/select.js';
import type {EnglishOptions} from './options.js';
import type {Choice, Phrase} from './devices.js';
import type {Idiom} from './idioms.js';
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
import {join, list, timeNames, unit} from './words.js';

// The most clock times a list of them may hold.
const mostClockTimes = 24;

const {words} = lexicon;

// The fields whose restriction makes a wrap-around in a field untrue:
// hours from 10 p.m. through 2 a.m. run through the night, but "on
// Mondays" they are Monday's first hours and Monday's last.
const coarser: {[field in Field]?: Field[]} = {
  date: ['month', 'year'],
  hour: ['date', 'weekday', 'month', 'year'],
  month: ['year']
};

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
}

// What the seconds contribute to the rest of the time.
interface SecondsLead {
  // The words that go before a time part that does not begin "every
  // minute".
  before: string;
  // The words that take the place of "every minute", and of "every hour".
  every: string;
  everyHour: string;
  // The words that introduce so many minutes taken out by an exception.
  exceptAt(count: number): string;
  // The words before a stray clock time: after a window, and when it
  // comes first.
  stray: string;
  strayFirst: string;
}

// What a description of the hours is said with. `riding` is the single
// second that clock times carry, if there is one.
interface TimeContext {
  lead: SecondsLead;
  minute: Tick;
  riding: number | undefined;
}

// A way of saying the time. `carry` is the same phrase with the single
// second riding on its clock times, or null if it names none. `excepts`
// marks a phrase that already ends in an exception.
interface TimePhrase extends Spoken {
  carry: string | null;
  excepts: boolean;
  yields: boolean;
}

function onlyValue(description: SetDescription): number | null {
  return description.kind === 'values' && description.values.length === 1 ?
    description.values[0] :
    null;
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
// them to what follows. A run from the start is "for the first N minutes
// of", a run to the end "for the last N minutes of", and anything else is
// counted "minutes past", the unit agreeing with the `last` number said.
function anchored(
  said: string,
  about: {description: SetDescription; everyOne: string; last: number},
  field: 'minute' | 'second'
): string {
  const {description} = about;
  const {max, min} = domainOf(field);

  if (description.kind !== 'range' || !isPortion(description, field)) {
    return join(said, unit(field, about.last), words.past);
  }

  const which = description.from === min ?
    `${words.first} ${description.to - min + 1}` :
    `${words.last} ${max - description.from + 1}`;

  return `${about.everyOne} ${words.for} ${words.the} ${which} ` +
    `${unit(field, 0)} ${words.of}`;
}

// How the seconds or the minutes are said: the phrase naming the fewest
// things, settled before anything coarser is considered. `everyOne` is
// what every value of the field is said as: "every second", and "every
// minute" unless finer seconds take its place. An exception is split
// into its base, said here, and the values it takes out, said last.
function tick(
  candidates: SetDescription[],
  field: 'minute' | 'second',
  everyOne: string,
  opts: EnglishOptions
): Tick {
  const chosen = choose(candidates,
    withinTheHour(field, {everyOne, heard: []}, opts), opts);
  const {base, removed} = chosen.description.kind === 'except' ?
    chosen.description :
    {base: chosen.description, removed: []};
  const heard: number[] = [];
  const said = say(base, withinTheHour(field, {everyOne, heard}, opts),
    opts) as Phrase;
  const continuous = base.kind === 'all' ||
    base.kind === 'cadence' && said.length === 1;
  const only = onlyValue(base);
  const last = heard[heard.length - 1];

  return {
    continuous,
    description: base,
    excepted: removed,
    // A single minute or second is carried by what it is said with, and
    // adds nothing to what is named.
    length: only === null ? chosen.length : 0,
    only,
    opens: opensWithEvery(base, field),
    portion: isPortion(base, field),
    text: continuous ?
      said.text :
      anchored(said.text, {description: base, everyOne, last}, field)
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
  const within = field === 'minute' ? 'hour' : 'minute';
  const clause = join(exceptAt, list(excepted.map(String), opts),
    unit(field, excepted[excepted.length - 1]), words.past, words.the,
    unit(within, 1));

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
      every: everyMinute,
      everyHour,
      exceptAt,
      stray: '',
      strayFirst: ''
    };
  }

  if (second.continuous) {
    const before = `${second.text} ${words.forOneMinute}`;

    return {
      before,
      every: second.text,
      everyHour: `${before} ${everyHour}`,
      // Under "every second" a minute taken out is a whole minute.
      exceptAt(count) {
        return `${words.except} ${words.during} ${words.the} ` +
          `${unit('minute', count)} ${words.at}`;
      },
      stray: words.forOneMinute,
      strayFirst: before
    };
  }

  const before = `${second.text} ${words.the} ${unit('minute', 1)},`;
  const stray = rides ? '' : before;

  return {
    before,
    every: `${second.text} ${everyMinute}`,
    everyHour: `${second.text} ${everyHour}`,
    exceptAt,
    stray,
    strayFirst: stray
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

  return window && {...window, length: minute.length};
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
      hoursAsStretches(opts) :
      hoursAsNouns(minute.portion, opts),
    opts);

  return rest && {
    ...rest,
    length: minute.length + rest.length,
    text: join(minute.opens ? '' : lead.before, minute.text, rest.text)
  };
}

// A single minute rides on each hour as a moment, and a single second
// can ride there with it. "Every hour" has no moment for a second to
// ride on, so the seconds are said against the hour.
function momentsWith(
  hours: SetDescription,
  context: TimeContext,
  opts: EnglishOptions
): TimePhrase | null {
  const {lead, minute, riding} = context;

  if (minute.only === null) {
    return null;
  }

  const at = {minute: minute.only};
  const moments = say(hours, hoursAsMoments(at, opts), opts);
  const carrying = say(hours, hoursAsMoments({...at, second: riding}, opts),
    opts);

  return moments && {
    ...moments,
    carry: carrying && carrying.text,
    excepts: hours.kind === 'except',
    text: hours.kind === 'all' ?
      lead.everyHour :
      join(lead.before, moments.text)
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

  return [moments || said].flatMap(function present(found) {
    return found ? [found] : [];
  });
}

// The plain list of clock times, when there are few enough to list.
function clockList(
  times: ClockTime[] | null,
  lead: SecondsLead,
  opts: EnglishOptions
): TimePhrase[] {
  if (!times) {
    return [];
  }

  const bare = times.map(function withoutSecond(time) {
    return {hour: time.hour, minute: time.minute};
  });

  return [{
    carry: `${words.at} ${list(timeNames(times, opts), opts)}`,
    excepts: false,
    length: times.length,
    text: join(lead.before, words.at, list(timeNames(bare, opts), opts)),
    yields: false
  }];
}

// A single minute and a single second, counted together past hours that
// have no moment to carry them: "at 30 minutes and 15 seconds past".
function withSecond(minute: Tick, riding: number | undefined): Tick {
  return typeof riding === 'number' && minute.only !== null ?
    {
      ...minute,
      opens: true,
      text: `${words.at} ${minute.only} ${unit('minute', minute.only)} ` +
        `${words.and} ${riding} ${unit('second', riding)} ${words.past}`
    } :
    minute;
}

/**
 * The time of day. Within a single clock time, seconds that are not a
 * plain list are a window of it. Otherwise the minutes, already settled,
 * are said with each description of the hours, and the results compete
 * with the plain list of clock times, which wins a tie. A single second
 * does not affect the choice: it rides on the clock times of the chosen
 * phrase if it names any, and is otherwise said in front of it. An
 * exception to the seconds closes the whole.
 */
function timeOfDay(facts: ScheduleFacts, opts: EnglishOptions): string {
  const {candidates, clockSecond: riding} = facts.analyses;
  const rides = typeof riding === 'number';
  const everySecond = `${words.every} ${unit('second', 1)}`;
  const second = tick(candidates.second!, 'second', everySecond, opts);
  const tail = exceptions(second.excepted, 'second',
    `${words.except} ${words.at}`, opts);
  const times = clockTimes(facts, mostClockTimes);

  if (times?.length === 1 && second.description.kind !== 'values') {
    return closedBy((say(second.description,
      secondsOfOneMinute(times[0], opts), opts) as Phrase).text, false, tail);
  }

  const lead = secondsLead(second, rides);
  const minute = withSecond(
    tick(candidates.minute!, 'minute', lead.every, opts), riding);
  const others = candidatesOf(facts, 'hour').flatMap(function sayWith(hours) {
    return timeWith(hours, {lead, minute, riding}, opts);
  });
  const best = shortestSpoken(
    [...clockList(times, lead, opts), ...inTieOrder(others)]);

  return closedBy(rides && best.carry ? best.carry : best.text, best.excepts,
    tail);
}

function sayForm<Form>(rows: Array<Idiom<Form>>, form: Form,
  opts: EnglishOptions): string {
  return (rows.find(function fits(row) {
    return row.applies(form);
  }) as Idiom<Form>).say(form, opts);
}

// A phrase that picks a day out of the month ("on the last Friday") and
// the months it applies to: "of the month", or "of" and the months.
function ofTheMonth(
  phrase: string,
  months: SetDescription[],
  opts: EnglishOptions
): string {
  const theMonth = `${words.of} ${words.the} ${unit('month', 1)}`;

  return months[0].kind === 'all' ?
    `${phrase} ${theMonth}` :
    choose(months, monthsOfDays({day: null, lead: '', phrase}, opts), opts)
      .text;
}

// The kinds of description that name days of the month outright, and so
// can be followed by "of" and several months. An exception or a cadence
// before "of" would be misheard ("except the 15th of March").
const namesDays = ['pieces', 'range', 'values'];

// Days of the month with the months they fall in. One month makes dates
// of numbered days ("on June 1 and 15"); several months follow them after
// "of" ("on the 1st and 15th of January and July"). Any other phrase for
// the days takes the months after "in", and they belong to the base of
// an exception: "on every day in June except the 15th".
function daysWithMonths(
  days: SetDescription[],
  months: SetDescription[],
  lead: string,
  opts: EnglishOptions
): string {
  if (days[0].kind === 'all') {
    return '';
  }

  const alone = choose(months, monthsAlone(opts), opts);
  const month = onlyValue(alone.description);
  const voice = daysOfTheMonth(month, lead, opts);
  const date = choose(days, voice, opts);
  const {description} = date;

  if (alone.description.kind === 'all' || date.named && month !== null) {
    return date.text;
  }

  if (namesDays.includes(description.kind)) {
    return choose(months, monthsOfDays(
      {day: onlyValue(description), lead, phrase: date.text}, opts), opts)
      .text;
  }

  return description.kind === 'except' ?
    join((say(description.base, voice, opts) as Phrase).text, alone.text,
      voice.exception(description.removed, description.base)) :
    `${date.text} ${alone.text}`;
}

// The day-of-month part with its months. A Quartz form is an idiom
// followed by its months, except the weekday nearest a day, which is
// followed by that day said as any day of the month is.
function dateWithMonths(facts: ScheduleFacts, opts: EnglishOptions): string {
  const {day} = facts.analyses;
  const months = candidatesOf(facts, 'month');

  if (day.date?.kind !== 'quartz') {
    return daysWithMonths(candidatesOf(facts, 'date'), months, words.on,
      opts);
  }

  const {form} = day.date;
  const phrase = sayForm(quartzDateIdioms, form, opts);

  return form.kind === 'nearestWeekday' ?
    daysWithMonths([{kind: 'values', values: [form.day]}], months, phrase,
      opts) :
    ofTheMonth(phrase, months, opts);
}

// The day-of-week part with its months: "on Fridays in June", "on the
// last Friday of June".
function weekdayWithMonths(facts: ScheduleFacts, opts: EnglishOptions):
  string {
  const {candidates, day} = facts.analyses;
  const months = candidatesOf(facts, 'month');

  if (day.weekday?.kind === 'quartz') {
    return ofTheMonth(sayForm(quartzWeekdayIdioms, day.weekday.form, opts),
      months, opts);
  }

  const days = candidates.weekday!;

  return days[0].kind === 'all' ?
    '' :
    join(choose(days, daysOfTheWeek(opts), opts).text,
      unlessEvery(choose(months, monthsAlone(opts), opts)));
}

// Whether the schedule is one day of one month of one year, which is
// said as a full date.
function isFullDate(facts: ScheduleFacts): boolean {
  const {candidates, day} = facts.analyses;

  return !day.union &&
    [candidates.date, candidates.month, candidates.year]
      .every(function isOne(field) {
        return field !== null && onlyValue(field[0]) !== null;
      });
}

/**
 * The time, the day, the month and the year, each as it is said. A day
 * of the month and a day of the week are joined by "as well as", and
 * each carries the months, so the month has its own part only when
 * neither kind of day is restricted. The year of a full date closes the
 * day part ("on January 1, 2030"); any other years follow "in".
 */
function partsOf(facts: ScheduleFacts, opts: EnglishOptions): Parts {
  const date = dateWithMonths(facts, opts);
  const weekday = weekdayWithMonths(facts, opts);
  const days = join(date, date && weekday && words.asWellAs, weekday);
  const months = choose(candidatesOf(facts, 'month'), monthsAlone(opts),
    opts);
  const year = choose(candidatesOf(facts, 'year'), yearsByNumber(opts), opts);
  const closing = isFullDate(facts) ?
    (opts.style.dayFirst ? ' ' : ', ') + onlyValue(year.description) :
    '';

  return {
    day: days + closing,
    month: days ? '' : unlessEvery(months),
    time: timeOfDay(facts, opts),
    year: closing ? '' : unlessEvery(year)
  };
}

export {partsOf};
