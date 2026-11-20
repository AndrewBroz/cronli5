// The time of day (answers 4.1): minute and hour decided together, as a
// rate word or a label, the stretches of hours it holds in, and what is
// left out.

import {domainOf} from '../../core/index.js';
import type {Hours} from './hours.js';
import {
  fillsTheDay, hoursAtMinute, hoursForEachMinute, rhythmInScatteredHours
} from './hours.js';
import lexicon from './lexicon.js';
import type {Scoped} from './inside.js';
import {insideOf, leftOut, minutesOf, scopedInside} from './inside.js';
import type {Clock, Piece} from './names.js';
import {between, clausal, joined, list, spaced, when} from './names.js';
import type {Described, Exception, Rule} from './sets.js';
import {choose, firstRule, isAlternate, isBare, runsOf} from './sets.js';
import type {Time} from './spans.js';
import {minutesIn, spanOf, spanTime, timeOf} from './spans.js';

const {words} = lexicon;

// The hours a rate word or a label holds in: by parity or not, the
// stretches of hours named by their first and last firing, and the
// stretches left out.
interface Shape {
  gaps: number[][];
  parity: '' | 'even' | 'odd';
  stretches: number[][];
}

// One or more stretches said together: the label they follow or the rate
// word they share, and their clock times.
interface Group {
  comma: boolean;
  lead: string;
  list: boolean;
  mode: Time['mode'];
  text(clock: Clock): string;
  windows: boolean;
}

const parityWords = {
  '': '', even: words.inEvenHours, odd: words.inOddHours
};
const hourScopes = {
  '': words.ofEachHour, even: words.ofEachEvenHour, odd: words.ofEachOddHour
};

// The first and last hour of each run of consecutive hours.
function endsOf(hours: number[]): number[][] {
  return runsOf(hours).map(function ends(run) {
    return [run[0], run[run.length - 1]];
  });
}

// «С 9:00 до 17:45»: a stretch of hours by its first and last firing.
function windowOf(ends: number[], given: Hours, clock: Clock): string {
  const {minutes} = given;

  return between(clock.from(ends[0], minutes[0]),
    clock.to(ends[1], minutes[minutes.length - 1]));
}

function windowsOf(stretches: number[][], given: Hours, clock: Clock): string {
  return list(stretches.map(function say(ends) {
    return windowOf(ends, given, clock);
  }));
}

// The minutes a rate word or a label is said by: where stretches of hours
// follow, an exception of minutes is its base, and what it leaves out of
// every hour follows the stretches.
function minutesSaid(shape: Shape, given: Hours): Described {
  const {minuteSet} = given;
  const base = (minuteSet as Exception).base || minuteSet;
  const apart = shape.gaps.length + shape.stretches.length > 0 ||
    isBare(base, domainOf('minute'));

  return apart ? base : minuteSet;
}

// «Кроме промежутка с 3:00 до 3:50», and what the minutes leave out of
// every hour.
function clauseOf(shape: Shape, given: Hours): Time['clause'] {
  const {removed} = given.minuteSet as Exception;
  const apart = minutesSaid(shape, given) !== given.minuteSet;
  const minutesLeftOut = apart ?
    leftOut(removed, minutesOf(words.ofEachHour)) :
    '';

  return function clause(clock) {
    return clausal(
      when(shape.gaps.length, spaced(words.exceptTheStretch,
        windowsOf(shape.gaps, given, clock))),
      minutesLeftOut);
  };
}

// The hours as stretches, when nothing shorter says them.
function stretchesOf(given: Hours): Shape {
  const found = choose(['wrapped', 'exceptionInRun'], given.choosing) as
    Exception | Extract<Described, {kind: 'range'}> | null;
  const shapes: Array<Rule<null, Shape>> = [
    [function wraps() {
      return found?.kind === 'range';
    }, function wrapped() {
      const run = found as Extract<Described, {kind: 'range'}>;

      return {gaps: [], parity: '', stretches: [[run.from, run.to]]};
    }],
    [function lacks() {
      return found;
    }, function lacking() {
      const {base, removed} = found as Exception;
      const run = base as Extract<Described, {kind: 'range'}>;

      return {
        gaps: endsOf(removed), parity: '', stretches: [[run.from, run.to]]
      };
    }],
    [Boolean, function runs() {
      return {gaps: [], parity: '', stretches: endsOf(given.hours)};
    }]
  ];

  return firstRule(shapes, {} as never);
}

// Every second hour, or every second hour less one or two: parity, the
// first and last firing when the hours do not tile the day, and the hours
// left out as stretches.
function parityOf(found: Described): Shape {
  const exception = found as Exception;
  const step = (exception.base || found) as
    Extract<Described, {kind: 'cadence'}>;
  const tiles = step.start <= 1 && step.last >= 22;

  return {
    gaps: (exception.removed || []).map(function alone(hour) {
      return [hour, hour];
    }),
    parity: step.start % 2 ? 'odd' : 'even',
    stretches: tiles ? [] : [[step.start, step.last]]
  };
}

// A rate word of minutes over the hours of a shape.
function rhythmTime(shape: Shape, given: Hours): Time {
  const base = minutesSaid(shape, given);

  return {
    ...timeOf(insideOf(base, minutesOf('')).text,
      base.kind === 'all' ? 'everyMinute' : 'minutes'),
    bare: shape.gaps.length + shape.stretches.length === 0,
    clause: clauseOf(shape, given),
    tail(clock) {
      return spaced(parityWords[shape.parity],
        windowsOf(shape.stretches, given, clock));
    }
  };
}

// Hours that stand alone under a label: clock times when the minutes are
// named, otherwise each hour as its rate word and clock times, the rate
// word said once.
function aloneGroup(hours: number[], given: Hours): Group {
  const {minuteSet, minutes} = given;
  const named = minuteSet.kind === 'values';
  const said = (minuteSet as Exception).base || given.minuteSpan;
  const spans = hours.map(function say(hour) {
    return spanOf(said, minutesIn(hour));
  });
  const [{lead}] = spans;

  return {
    comma: false,
    lead: when(!named, lead),
    list: named || hours.length > 1 || spans[0].list,
    mode: lead === words.everyMinute && !named ? 'everyMinute' : 'clocks',
    text(clock) {
      return named ?
        spaced(words.in, list(hours.flatMap(function eachHour(hour) {
          return minutes.map(function eachMinute(minute) {
            return clock.at(hour, minute);
          });
        }))) :
        joined(spans.map(function say(span): Piece {
          return {
            list: span.list,
            text: clausal(span.tail(clock), span.clause(clock))
          };
        }));
    },
    windows: !named && spans[0].windows
  };
}

// Stretches of two or more hours under a label: the label, its scope and
// the first and last firing of each.
function labelGroup(stretches: number[][], label: string, given: Hours):
  Group {
  return {
    comma: false,
    lead: label,
    list: stretches.length > 1,
    mode: 'label',
    text(clock) {
      return windowsOf(stretches, given, clock);
    },
    windows: true
  };
}

// The stretches of a shape in order, those of several hours and the
// hours that stand alone gathered with their like.
function groupsOf(shape: Shape, label: string, given: Hours): Group[] {
  const gathered: Array<{alone: boolean; stretches: number[][]}> = [];

  shape.stretches.forEach(function place(ends) {
    const alone = ends[0] === ends[1];
    const current = gathered[gathered.length - 1];

    if (current && current.alone === alone) {
      current.stretches.push(ends);
    }
    else {
      gathered.push({alone, stretches: [ends]});
    }
  });

  return gathered.map(function say(group) {
    return group.alone ?
      aloneGroup(group.stretches.map(function hourOf(ends) {
        return ends[0];
      }), given) :
      labelGroup(group.stretches, label, given);
  });
}

// A label over stretches of hours: the first group leads, and the others
// follow as pieces.
function labelOverStretches(shape: Shape, label: Scoped, given: Hours): Time {
  const [first, ...rest] = groupsOf(shape, label.text, given);

  function after(group: Group, clock: Clock): string {
    return label.holdsScope && group.mode === 'label' ?
      clausal(group.lead, group.text(clock)) :
      spaced(group.lead, group.text(clock));
  }

  return {
    ...timeOf(first.lead,
      rest.length && first.mode !== 'label' ? 'clocks' : first.mode),
    bare: false,
    clause: clauseOf(shape, given),
    comma: label.holdsScope && first.mode === 'label',
    tail(clock) {
      return joined([
        {list: first.list, text: first.text(clock)},
        ...rest.map(function say(group): Piece {
          return {list: group.list, text: after(group, clock)};
        })
      ]);
    },
    windows: first.windows && rest.length === 0
  };
}

// Minutes named inside the hour over the hours of a shape.
function labelTime(shape: Shape, given: Hours): Time {
  const minuteSet = minutesSaid(shape, given);
  const label = scopedInside(minuteSet, minutesOf(hourScopes[shape.parity]));
  const whole = shape.gaps.length === 0 && !shape.parity;
  const leading = minuteSet.kind === 'range' &&
    minuteSet.from === domainOf('minute').min;

  return shape.stretches.length ?
    labelOverStretches(shape, label, given) :
    {
      ...timeOf(label.text, 'label'),
      asStretch: when(whole && leading, label.afterRate),
      bare: shape.gaps.length === 0,
      clause: clauseOf(shape, given)
    };
}

/** Several minutes over several hours. */
function minutesOverHours(given: Hours): Time {
  const {choosing, hours, minuteSet} = given;
  const found = choose(['all', 'exception', 'cadence'], choosing) ||
    {kind: 'values', values: hours};
  const base = (found as Exception).base || found;
  const rhythm = isBare((minuteSet as Exception).base || minuteSet,
    domainOf('minute'));
  const wholeRhythm = isBare(minuteSet, domainOf('minute'));
  const scattered = runsOf(hours).length === hours.length;

  function over(shape: Shape): Time {
    return (rhythm ? rhythmTime : labelTime)(shape, given);
  }

  const forms: Array<Rule<null, Time>> = [
    [function everyHour() {
      return base.kind === 'all';
    }, function whole() {
      return over({
        gaps: endsOf((found as Exception).removed || []),
        parity: '',
        stretches: []
      });
    }],
    [function everySecondHour() {
      return isAlternate(base) && hours.length >= 3;
    }, function parity() {
      return over(parityOf(found));
    }],
    [function stepFillsTheDay() {
      return fillsTheDay(given);
    }, function inEachHour() {
      return rhythmInScatteredHours(given);
    }],
    [function fewMinutesOnAStep() {
      return found.kind === 'cadence' && hours.length >= 3 &&
        minuteSet.kind === 'values';
    }, function eachMinute() {
      return hoursForEachMinute(found, given);
    }],
    [function rhythmOfScatteredHours() {
      return wholeRhythm && hours.length > 4 && scattered;
    }, function inEachHour() {
      return rhythmInScatteredHours(given);
    }],
    [Boolean, function stretches() {
      return over(stretchesOf(given));
    }]
  ];

  return firstRule(forms, {} as never);
}

/**
 * The time part for minutes and hours, before the seconds: four clock
 * times or fewer named; one minute; one hour; or several of both.
 */
function timeOfDay(given: Hours): Time {
  const {hours, minuteSpan, minutes} = given;
  const forms: Array<Rule<null, Time>> = [
    [function bareHours() {
      return minutes.join() === '0' && hours.length >= 3 &&
        choose(['tiling'], given.choosing);
    }, function rhythm() {
      return hoursAtMinute(given, 0);
    }],
    [function few() {
      return minutes.length * hours.length <= 4;
    }, function named() {
      return {
        ...timeOf('', 'clocks'),
        bare: false,
        tail(clock) {
          return spaced(words.in, list(hours.flatMap(function eachHour(hour) {
            return minutes.map(function eachMinute(minute) {
              return clock.at(hour, minute);
            });
          })));
        },
        windows: false
      };
    }],
    [function oneMinute() {
      return minutes.length === 1;
    }, function carried() {
      return hoursAtMinute(given, minutes[0]);
    }],
    [function oneHour() {
      return hours.length === 1;
    }, function inTheHour() {
      return spanTime(spanOf(minuteSpan, minutesIn(hours[0])));
    }],
    [Boolean, function both() {
      return minutesOverHours(given);
    }]
  ];

  return firstRule(forms, {} as never);
}

export {timeOfDay};
