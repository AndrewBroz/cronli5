// The places where neighbouring fields are said together: seconds,
// minutes and hours as one time of day, and the day of the month with a
// day of the week, with its month, and with its year.

import type {
  ClockTime, ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import type {Spoken} from '../../core/select.js';
import type {EnglishOptions} from './options.js';
import type {Choice, Phrase} from './devices.js';
import type {Idiom} from './idioms.js';
import type {Parts} from './frame.js';
import {clockTimes} from '../../core/fusions.js';
import {shortestSpoken} from '../../core/select.js';
import {
  choose, daysOfTheMonth, daysOfTheWeek, hoursAsMoments, hoursAsNouns,
  hoursAsStretches, inTieOrder, minutesOfOneHour, monthsAlone, monthsOfDays,
  opensWithEvery, say, secondsOfOneMinute, withinTheHour, yearsByNumber
} from './devices.js';
import {quartzDateIdioms, quartzWeekdayIdioms} from './idioms.js';
import lexicon from './lexicon.js';
import {extraWords, join, list, timeNames, unit} from './words.js';

// The most clock times a list of them may hold.
const mostClockTimes = 24;

const {words} = lexicon;

// How the seconds or the minutes of a time are said.
interface Tick {
  // A cadence with no gaps to name: every value, or "every 15 minutes".
  continuous: boolean;
  description: SetDescription;
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

// What the seconds contribute to the rest of the time: the words that
// take the place of "every minute", the words that go before a time part
// that does not begin with it, and the words before a stray clock time
// that follows a window.
interface SecondsLead {
  before: string;
  every: string;
  stray: string;
}

// What a description of the hours is said with.
interface TimeContext {
  lead: SecondsLead;
  minute: Tick;
  // The single second that clock times can carry, if there is one.
  riding: {second?: number};
}

// A way of saying the time. `carry` is the same phrase with the single
// second riding on its clock times, or null if it names none.
interface TimePhrase extends Spoken {
  carry: string | null;
  idiom: boolean;
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

// Whether a description is a run from the start of its hour or minute,
// or to the end of it.
function isPortion(description: SetDescription): boolean {
  return description.kind === 'range' &&
    (description.from === 0 || description.to === 59);
}

// Minutes or seconds that are not continuous, up to the word that ties
// them to what follows. A run from the start is "for the first N minutes
// of", a run to the end "for the last N minutes of", and anything else is
// counted "minutes past".
function anchored(chosen: Choice, field: 'minute' | 'second',
  everyOne: string): string {
  const {description} = chosen;

  if (description.kind !== 'range' || !isPortion(description)) {
    return join(chosen.text, unit(field, onlyValue(description) ?? 0),
      words.past.text);
  }

  const which = description.from === 0 ?
    `${lexicon.nthWords[1].text} ${description.to + 1}` :
    `${words.last.text} ${60 - description.from}`;

  return `${everyOne} ${extraWords.for} ${words.the.text} ${which} ` +
    `${unit(field, 0)} ${words.of.text}`;
}

// `everyOne` is what every value of the field is said as: "every second",
// and "every minute" unless finer seconds take its place.
function tick(
  candidates: SetDescription[],
  field: 'minute' | 'second',
  everyOne: string,
  opts: EnglishOptions
): Tick {
  const chosen = choose(candidates, withinTheHour(field, everyOne, opts),
    opts);
  const {description} = chosen;
  const continuous = description.kind === 'all' ||
    description.kind === 'cadence' && chosen.length === 1;

  return {
    continuous,
    description,
    length: chosen.length,
    only: onlyValue(description),
    opens: opensWithEvery(description, field),
    portion: isPortion(description),
    text: continuous ? chosen.text : anchored(chosen, field, everyOne)
  };
}

// Second 0 is silent. A continuous cadence of seconds takes the place of
// "every minute", or else runs "for one minute" at each time. Any other
// seconds are counted past every minute, or past the minute and set off
// by a comma.
function secondsLead(second: Tick): SecondsLead {
  const everyMinute = `${words.every.text} ${unit('minute', 1)}`;

  if (second.only === 0) {
    return {before: '', every: everyMinute, stray: ''};
  }

  if (second.continuous) {
    return {
      before: `${second.text} ${words.forOneMinute.text}`,
      every: second.text,
      stray: words.forOneMinute.text
    };
  }

  const before = `${second.text} ${words.the.text} ${unit('minute', 1)},`;

  return {before, every: `${second.text} ${everyMinute}`, stray: before};
}

// A run of minutes inside one named hour is a window of clock times.
function minuteWindow(
  hours: SetDescription,
  context: TimeContext,
  opts: EnglishOptions
): Phrase | null {
  const hour = onlyValue(hours);
  const {lead, minute} = context;

  return hour === null || minute.description.kind === 'values' ?
    null :
    say(
      minute.description,
      minutesOfOneHour(hour, {
        every: lead.every,
        stray: minute.opens ? lead.stray : lead.before
      }, opts),
      opts);
}

// A single minute rides on each hour as a moment, and a single second
// can ride there with it.
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
  const carrying = say(hours, hoursAsMoments({...at, ...riding}, opts), opts);

  return moments && {
    ...moments,
    carry: carrying && carrying.text,
    text: join(lead.before, moments.text)
  };
}

// The time said with one description of the hours, by the first of these
// that applies. A single minute rides on each hour as a moment.
// Continuous minutes lead and the hours confine them. A run of minutes in
// one hour is a window. Any other minutes are counted past the hours.
function timeWith(
  hours: SetDescription,
  context: TimeContext,
  opts: EnglishOptions
): TimePhrase[] {
  const {lead, minute} = context;
  const moments = momentsWith(hours, context, opts);

  if (moments) {
    return [moments];
  }

  const window = minute.continuous ? null : minuteWindow(hours, context, opts);
  const rest = window || say(hours,
    minute.continuous ?
      hoursAsStretches(opts) :
      hoursAsNouns(minute.portion, opts),
    opts);

  if (window || !rest) {
    return window ? [{...window, carry: null}] : [];
  }

  return [{
    ...rest,
    carry: null,
    length: minute.length + rest.length,
    text: join(minute.opens ? '' : lead.before, minute.text, rest.text)
  }];
}

/**
 * The time of day. Within a single clock time, seconds that are not a
 * plain list are a window of it. Otherwise each description of the hours
 * is said with the minutes, and competes with the plain list of clock
 * times, which wins a tie. A single second does not affect the choice:
 * it rides on the clock times of the chosen phrase if it names any, and
 * is otherwise counted past the minute in front of it.
 */
function timeOfDay(facts: ScheduleFacts, opts: EnglishOptions): string {
  const {candidates} = facts.analyses;
  const everySecond = `${words.every.text} ${unit('second', 1)}`;
  const second = tick(candidates.second!, 'second', everySecond, opts);
  const times = clockTimes(facts, mostClockTimes);

  if (times?.length === 1 && second.description.kind !== 'values') {
    return (say(second.description, secondsOfOneMinute(times[0], opts),
      opts) as Phrase).text;
  }

  const lead = secondsLead(second);
  const context = {
    lead,
    minute: tick(candidates.minute!, 'minute', lead.every, opts),
    riding: second.only ? {second: second.only} : {}
  };
  const listed = clockList(times, lead, opts);
  const others = candidates.hour!.flatMap(function sayWith(hours) {
    return timeWith(hours, context, opts);
  });
  const best = shortestSpoken([...listed, ...inTieOrder(others)]);

  return second.only && best.carry ? best.carry : best.text;
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

  const at = words.at.text;
  const bare = times.map(function withoutSecond(time) {
    return {hour: time.hour, minute: time.minute};
  });

  return [{
    carry: `${at} ${list(timeNames(times, opts), opts)}`,
    idiom: false,
    length: times.length,
    text: join(lead.before, at, list(timeNames(bare, opts), opts)),
    yields: false
  }];
}

function sayForm<Form>(rows: Array<Idiom<Form>>, form: Form,
  opts: EnglishOptions): string {
  return (rows.find(function fits(row) {
    return row.applies(form);
  }) as Idiom<Form>).say(form, opts).text;
}

// A phrase that picks a day out of the month ("on the last Friday") and
// the months it applies to: "of the month", or "of" and the months.
function ofTheMonth(
  phrase: string,
  months: SetDescription[],
  opts: EnglishOptions
): string {
  const theMonth = `${words.of.text} ${words.the.text} ${unit('month', 1)}`;

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
  const {candidates, day} = facts.analyses;
  const months = candidates.month!;

  if (day.date?.kind !== 'quartz') {
    return daysWithMonths(candidates.date!, months, words.on.text, opts);
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
  const months = candidates.month!;

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
  const {candidates} = facts.analyses;
  const date = dateWithMonths(facts, opts);
  const weekday = weekdayWithMonths(facts, opts);
  const days = join(date, date && weekday && extraWords.asWellAs, weekday);
  const months = choose(candidates.month!, monthsAlone(opts), opts);
  const year = choose(candidates.year!, yearsByNumber(opts), opts);
  const closing = isFullDate(facts) ?
    (opts.style.dayFirst ? ' ' : ', ') +
      lexicon.year(onlyValue(year.description) as number).text :
    '';

  return {
    day: days + closing,
    month: days ? '' : unlessEvery(months),
    time: timeOfDay(facts, opts),
    year: closing ? '' : unlessEvery(year)
  };
}

export {partsOf};
