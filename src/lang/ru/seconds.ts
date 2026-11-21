// The seconds (answers 4.2): carried in the clock times where the time
// part is made of them, and ordinals of the minute everywhere else.

import type {ScheduleFacts} from '../../core/schedule.js';
import {candidatesAs, domainOf} from '../../core/index.js';
import lexicon from './lexicon.js';
import type {Inside, Scoped} from './inside.js';
import {
  insideOf, leftOut, scopedInside, secondsEachTime, secondsOfEachMinute,
  secondsOfFirstMinute
} from './inside.js';
import {clausal, clockOf, spaced} from './names.js';
import type {RussianStyle} from './options.js';
import type {Choosing, Described, Exception, Rule} from './sets.js';
import {choose, choosingOf, firstRule, isBare, valuesOf} from './sets.js';
import type {Time} from './spans.js';
import {secondsIn, spanOf, spanTime, timeText} from './spans.js';
import {hoursOf} from './hours.js';
import {timeOfDay} from './time.js';

const {words} = lexicon;

/** The time part, and whether it begins with a clock time. */
export interface TimePart {
  clockStart: boolean;
  text: string;
}

// What the seconds are said beside.
interface Seconds {
  choosing: Choosing;
  several: boolean;
  style: RussianStyle;
  time: Time;
  values: number[];
}

// The seconds as a rhythm or a label of the minute, a rhythm that tiles
// the minute said bare where the place allows it.
function secondsSaid(given: Seconds, mode: Inside): Scoped {
  const order = mode.bareRhythm ?
    ['all', 'tiling', 'few', 'exception', 'run', 'cadence', 'pieces',
      'values'] :
    ['all', 'few', 'run', 'cadence', 'pieces', 'values'];
  const found = choose(order, given.choosing);
  const rhythm = mode.bareRhythm && isBare(found, given.choosing.domain);

  return (rhythm ? insideOf : scopedInside)(found, mode);
}

// The seconds in place of «каждую минуту»: a rhythm less a second or two
// is the rhythm, and what it leaves out of every minute follows whatever
// stretches are said.
function secondsOverMinutes(given: Seconds): {clause: string; lead: Scoped} {
  const found = choose(['all', 'tiling', 'exception'], given.choosing) as
    Exception | null;
  const apart = found?.kind === 'except' &&
    isBare(found.base, given.choosing.domain);

  return apart ?
    {
      clause: leftOut(found.removed, secondsOfEachMinute),
      lead: insideOf(found.base, secondsOfEachMinute)
    } :
    {clause: '', lead: secondsSaid(given, secondsOfEachMinute)};
}

function plainText(given: Seconds): string {
  return timeText(given.time, clockOf(given.style));
}

// A phrase and what follows it, after a comma when the phrase holds its
// own scope.
function followed(lead: Scoped, rest: string): string {
  return lead.holdsScope ? clausal(lead.text, rest) : spaced(lead.text, rest);
}

const forms: Array<Rule<Seconds, string>> = [
  [function none(given) {
    return given.values.length === 1 && given.values[0] === 0;
  }, plainText],
  [function underEveryMinuteInHours({time}) {
    return time.everyMinuteInHours;
  }, function inPlaceOfTheMinute(given) {
    const {time} = given;
    const clock = clockOf(given.style);
    const seconds = secondsOverMinutes(given);

    return clausal(spaced(time.lead, time.tail(clock)), seconds.lead.text,
      seconds.clause);
  }],
  [function underEveryMinute({several, time}) {
    return time.mode === 'everyMinute' &&
      (several ? time.windows : time.bare);
  }, function inPlaceOfTheMinutes(given) {
    const {time, values} = given;
    const clock = clockOf(given.style, values);
    const seconds = secondsOverMinutes(given);

    return clausal(followed(seconds.lead, time.tail(clock)),
      time.clause(clock), seconds.clause);
  }],
  [function acrossALeadingStretch({several, time}) {
    return several && time.asStretch;
  }, function inTheStretch(given) {
    const seconds = secondsOverMinutes(given);

    return clausal(followed(seconds.lead, given.time.asStretch),
      seconds.clause);
  }],
  [function afterBareHours({time}) {
    return time.mode === 'hours';
  }, function ofTheFirstMinute(given) {
    return clausal(plainText(given),
      secondsSaid(given, secondsOfFirstMinute).text);
  }],
  [function oneAfterALabel({several, time}) {
    return !several && time.mode === 'label';
  }, function afterTheLabel(given) {
    const {time} = given;
    const clock = clockOf(given.style, given.values);

    return clausal(time.lead, insideOf(
      {kind: 'values', values: given.values}, secondsEachTime).text,
    time.tail(clock), time.clause(clock));
  }],
  [function oneAmongClockTimes({several, time}) {
    return !several && !(time.mode === 'minutes' && time.bare);
  }, function carried(given) {
    return timeText(given.time, clockOf(given.style, given.values));
  }],
  [Boolean, function eachTime(given) {
    return clausal(plainText(given), spaced(words.eachTime,
      secondsSaid(given, secondsEachTime).text));
  }]
];

/** The time part of a description. Hours wrap only when asked. */
function timePart(facts: ScheduleFacts, wraps: boolean, style: RussianStyle):
  TimePart {
  const domain = domainOf('second');
  const hours = hoursOf(facts, wraps);
  const choosing = choosingOf({
    linear: candidatesAs(facts, 'second', {linear: true}) as never
  }, domain, {
    guarded: domain.min, pieces: facts.analyses.cadencePieces.second
  });
  const values = valuesOf(choosing.linear, domain);
  const several = values.length > 1;
  const oneMinute = several &&
    hours.minutes.length * hours.hours.length === 1;
  const span: Described = choose(['all', 'few', 'run', 'exception', 'cadence',
    'pieces', 'values'], choosing);
  const time = oneMinute ?
    spanTime(spanOf(span, secondsIn(hours.hours[0], hours.minutes[0]))) :
    timeOfDay(hours);

  return {
    clockStart: time.lead === '',
    text: oneMinute ?
      timeText(time, clockOf(style)) :
      firstRule(forms, {choosing, several, style, time, values})
  };
}

export {timePart};
