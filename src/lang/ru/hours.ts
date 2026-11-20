// The hours of a pattern (answers 4.1, case C): beside one minute they are
// said in clock times that carry it, as a bare rhythm, a run, a cadence
// with its ends, pieces or values.

import type {ScheduleFacts} from '../../core/schedule.js';
import {candidatesAs, domainOf} from '../../core/index.js';
import lexicon from './lexicon.js';
import {minutesOf, minutesOfTheHour, scopedInside} from './inside.js';
import {amount, between, clausal, list, spaced} from './names.js';
import type {Choosing, Described, Exception, Rule} from './sets.js';
import {
  choose, choosingOf, firstRule, isAlternate, isBare, valuesOf
} from './sets.js';
import type {Time} from './spans.js';
import {hoursAt, spanOf, spanTime, timeOf} from './spans.js';

const {units, words} = lexicon;

/** The minutes and hours of a pattern, as the time part needs them. */
export interface Hours {
  choosing: Choosing;
  hours: number[];
  // The minutes as they are said inside the hour.
  minuteSet: Described;
  minutes: number[];
  // The minutes as they are said beside one hour, in clock times.
  minuteSpan: Described;
}

const hourOrder = [
  'all', 'tiling', 'exception', 'run', 'wrapped', 'cadence',
  'exceptionInRun', 'pieces', 'values'
];

/** The minutes and hours of a pattern. Hours wrap only when asked. */
function hoursOf(facts: ScheduleFacts, wraps: boolean): Hours {
  const {cadencePieces, candidates} = facts.analyses;
  const hourDomain = domainOf('hour');
  const minuteDomain = domainOf('minute');
  const choosing = choosingOf({
    linear: candidatesAs(facts, 'hour', {linear: true}) as never,
    own: candidates.hour as never
  }, hourDomain, {wraps});
  const minutes = choosingOf({
    linear: candidatesAs(facts, 'minute', {linear: true}) as never
  }, minuteDomain, {guarded: minuteDomain.min, pieces: cadencePieces.minute});

  return {
    choosing,
    hours: valuesOf(choosing.linear, hourDomain),
    minuteSet: choose(['all', 'tiling', 'few', 'exception', 'run', 'cadence',
      'pieces', 'values'], minutes),
    // Beside one hour a run is said before an exception, so that the
    // stretch never names an end that does not fire.
    minuteSpan: choose(['all', 'few', 'run', 'exception', 'cadence',
      'pieces', 'values'], minutes),
    minutes: valuesOf(minutes.linear, minuteDomain)
  };
}

// Every second hour across the whole day that does not start on its
// first hour: all the odd hours.
function isOddHours(description: Described): boolean {
  const domain = domainOf('hour');
  const step = description as Extract<Described, {kind: 'cadence'}>;

  return isAlternate(description) && !isBare(description, domain) &&
    step.start < step.interval && step.last + step.interval > domain.max;
}

// The minute named inside the hour, with its scope.
function minuteLabel(minute: number, scope: string): string {
  return scopedInside({kind: 'values', values: [minute]},
    minutesOf(scope)).text;
}

/** The hours beside one minute, in clock times that carry it. */
function hoursAtMinute(given: Hours, minute: number): Time {
  const found = choose(hourOrder, given.choosing);
  const base = (found as Exception).base || found;
  const level = hoursAt(minute);
  const span = spanOf(found, level);
  const bare = isBare(base, domainOf('hour'));
  const forms: Array<Rule<null, Time>> = [
    [function rhythm() {
      return bare && minute === 0;
    }, function bareHours() {
      return {
        ...timeOf(spanOf(base, level).lead, 'hours'),
        clause: span.clause
      };
    }],
    [function oddHours() {
      return isOddHours(base);
    }, function byParity() {
      return {
        ...timeOf(minuteLabel(minute, words.ofEachOddHour), 'label'),
        bare: found === base,
        clause: span.clause
      };
    }],
    [function everyHour() {
      return base.kind === 'all';
    }, function label() {
      return {
        ...timeOf(minuteLabel(minute, words.ofEachHour), 'label'),
        bare: found.kind === 'all',
        clause: span.clause
      };
    }],
    [Boolean, function clocks() {
      return spanTime(span);
    }]
  ];

  return firstRule(forms, {} as never);
}

// One rhythm of hours for each of a few minutes: «каждые 4 часа с 0:15 до
// 20:15 и с 0:45 до 20:45».
function hoursForEachMinute(step: Described, given: Hours): Time {
  const {interval, last, start} = step as
    Extract<Described, {kind: 'cadence'}>;

  return {
    ...timeOf(spaced(words.every, amount(interval, units.hour)), 'clocks'),
    bare: false,
    tail(clock) {
      return list(given.minutes.map(function say(minute) {
        return between(clock.from(start, minute), clock.to(last, minute));
      }));
    }
  };
}

// Scattered hours under a rhythm of minutes: the hours as they are said on
// the hour, and what happens in each of them, «каждую минуту в течение
// часа», «каждые 15 минут с начала часа по 45-ю минуту»; a step that
// lands twice is its two minutes.
function rhythmInScatteredHours(given: Hours): Time {
  const hours = hoursAtMinute(given, 0);
  const {minuteSet, minutes} = given;
  const twice = minutes.length === 2;
  const inEach = scopedInside(
    twice ? {kind: 'values', values: minutes} : minuteSet,
    minutesOfTheHour).text;

  return {
    ...hours,
    bare: true,
    clause(clock) {
      return clausal(hours.clause(clock), inEach);
    },
    mode: 'minutes',
    windows: false
  };
}

export {hoursAtMinute, hoursForEachMinute, hoursOf, rhythmInScatteredHours};
