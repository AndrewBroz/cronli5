// The time of day (answers 4.1 and 4.2): clock times where there are few,
// one rhythm where there is one, and otherwise the hours and what happens
// inside each of them. Every end of a stretch is a moment that fires.

import type {
  CadenceDescription, ScheduleFacts
} from '../../core/schedule.js';
import {isCadence, isValues} from './forms.js';
import {hoursLeftOut, minutesLeftOut} from './left-out.js';
import lexicon from './lexicon.js';
import {hoursNamed} from './named-hours.js';
import type {IndonesianStyle} from './options.js';
import {phrase} from './say.js';
import type {Clockwork, Shaped, Tick} from './ticks.js';
import {
  at, between, clockworkOf, firstSecond, isLength, lastSecond,
  minutesInside, moments, secondsLeftOut, series, spans, tickFor, times
} from './ticks.js';
import {
  alone, closesAfter, eachTime, everyHour, everyUnit, inside, minuteTier,
  nth, points, secondTier, under
} from './within.js';

const {units, words} = lexicon;

/** The time part of a description. */
export interface Time {
  // Whether it ends in a clause of its own («tiap kali …», «terakhir …»),
  // after which the months and years take a comma.
  clause: boolean;
  // What is left out of it, each said after «kecuali».
  left: string[];
  // Whether it is a rhythm that runs round the clock, which takes no
  // «setiap hari».
  round: boolean;
  text: string;
}

const everyMinute = everyUnit(units.minute);
const firstMinute = phrase(units.minute, words.first);

// Every minute: the seconds, when there are any to say, as the minutes
// would be said one level up.
function minuteByMinute(work: Clockwork, span: Tick): string {
  return span.seconds.length > 0 ?
    inside(work.seconds.base, secondTier, alone) :
    everyMinute;
}

// Four moments a day or fewer: clock times.
function fewMoments(work: Clockwork): Shaped {
  const tick = tickFor(work, {any: true});

  return {
    text: times(work.hours.values.flatMap(function eachHour(hour) {
      return work.minutes.values.flatMap(function eachMinute(minute) {
        return moments(work, tick, hour, minute);
      });
    })),
    tick
  };
}

// One clock minute: its seconds between their first and last firing.
function oneMinute(work: Clockwork): Shaped {
  const [hour] = work.hours.values;
  const [minute] = work.minutes.values;
  const {base, removed} = work.seconds;

  function time(second: number): string {
    return at(work, hour, minute, second);
  }

  return {
    text: series(spans(base, secondTier, everyUnit(units.second), time)),
    tick: {
      left: [removed.length > 0 && times(removed.map(time))]
        .filter(Boolean) as string[],
      one: everyMinute,
      seconds: [],
      suffix: ''
    }
  };
}

// Seconds in the first minute of every hour: the minute is «menit
// pertama», a whole minute by name.
function inTheFirstMinute(work: Clockwork): string {
  const {base} = work.seconds;
  const options = [
    isValues(base) && phrase(everyHour,
      points(work.seconds.values, secondTier, words.sharp), firstMinute),
    isLength(base, secondTier) && base.kind !== 'all' &&
      inside(base, {...secondTier, closer: everyHour}, alone),
    phrase(inside(base, secondTier, under), words.during, firstMinute,
      everyHour)
  ];

  return options.find(Boolean) as string;
}

// Every hour: the minutes alone carry the sentence.
function everyHourOfTheDay(work: Clockwork): Shaped {
  const {minutes} = work;
  const span = tickFor(work, {any: true});
  const single = minutes.values.length === 1;
  const onTheHour = single && minutes.values[0] === 0;
  const shown = span.seconds.length;
  const options: Array<Shaped | false> = [
    minutes.base.kind === 'all' &&
      {closes: true, text: minuteByMinute(work, span), tick: span},
    onTheHour && shown === 0 && {text: everyHour, tick: span},
    onTheHour && {
      text: inTheFirstMinute(work),
      tick: {...span, left: secondsLeftOut(work, false)}
    },
    single && shown === 1 && {
      text: phrase(inside(minutes.base, minuteTier, alone),
        nth(secondTier, span.seconds[0])),
      tick: span
    },
    {
      ...minutesInside(work, alone),
      closes: !closesAfter(minutes.base, minuteTier)
    }
  ];

  return {...options.find(Boolean) as Shaped, round: true, span};
}

// The first times of a rhythm of hours: every moment of its first hour
// when there are four or fewer, else the minutes, with the seconds after.
function firstTimes(work: Clockwork, hour: number): Shaped {
  const {minutes, seconds} = work;
  const tick = tickFor(work,
    {any: minutes.values.length * seconds.values.length <= 4});

  return {
    text: phrase(words.startingAt, times(minutes.values.flatMap(
      function eachMinute(minute) {
        return moments(work, tick, hour, minute);
      }
    ))),
    tick
  };
}

// «, terakhir pukul 23.45»: the last firing of a rhythm of hours that
// stops before the day does.
function lastTime(work: Clockwork, hour: number, tick: Tick): string {
  const {values} = work.minutes;

  return `, ${phrase(words.lastAt, words.oClock,
    at(work, hour, values[values.length - 1], lastSecond(tick)))}`;
}

// A rhythm of hours and what happens in each of them, after «tiap kali».
function hourByHour(work: Clockwork, beat: CadenceDescription): Shaped {
  const found = minutesInside(work, eachTime);

  return {
    clause: true,
    text: `${phrase(everyUnit(units.hour, beat.interval), words.startingAt,
      words.oClock, at(work, beat.start, 0))}, ${phrase(words.eachTime,
      found.text)}`,
    tick: found.tick
  };
}

// Every second hour: «pada jam genap,» or «pada jam ganjil,» and what
// happens inside each of them.
function evenOrOddHours(work: Clockwork, beat: CadenceDescription): Shaped {
  const parity = [words.evenHours, words.oddHours][beat.start % 2];
  const span = tickFor(work, {any: true});
  const found = work.minutes.base.kind === 'all' ?
    {text: minuteByMinute(work, span), tick: span} :
    minutesInside(work, under);

  return {...found, text: `${parity}, ${found.text}`};
}

// Hours that tile the day.
function hoursRoundTheClock(work: Clockwork): Shaped {
  const {minutes} = work;
  const beat = work.hours.base as CadenceDescription;
  const every = everyUnit(units.hour, beat.interval);
  const count = minutes.values.length;
  const first = firstTimes(work, beat.start);
  // From midnight on the hour, with no seconds to say: the step alone.
  const bare = beat.start + minutes.values[0] === 0 && count === 1 &&
    first.tick.seconds.length === 0 && first.tick.suffix === '';
  const within = minutesInside(work, under);
  const options: Array<Shaped | false> = [
    bare && {text: every, tick: first.tick},
    count <= 4 && (count === 1 || beat.interval > 2) &&
      {...first, text: phrase(every, first.text)},
    beat.interval === 2 && evenOrOddHours(work, beat),
    // Midnight itself does not fire: the hours are bare, and no «tiap
    // kali» names a start.
    beat.start === 0 && minutes.values[0] > 0 &&
      {...within, text: phrase(every, within.text)},
    hourByHour(work, beat)
  ];

  return {
    ...options.find(Boolean) as Shaped,
    round: true,
    span: tickFor(work, {any: true})
  };
}

// Hours at a step that does not tile the day: said with their ends.
function hoursInSteps(work: Clockwork): Shaped {
  const {minutes} = work;
  const beat = work.hours.base as CadenceDescription;
  const every = everyUnit(units.hour, beat.interval);
  const count = minutes.values.length;
  const one = tickFor(work, {one: true});
  const first = firstTimes(work, beat.start);
  const each = hourByHour(work, beat);
  const options: Array<Shaped | false> = [
    count === 1 && {
      text: phrase(every, between(
        at(work, beat.start, minutes.values[0], firstSecond(one)),
        at(work, beat.last, minutes.values[0], lastSecond(one)))),
      tick: one
    },
    count <= 4 && {
      clause: true,
      text: phrase(every, first.text) +
        lastTime(work, beat.last, first.tick),
      tick: first.tick
    },
    {...each, text: each.text + lastTime(work, beat.last, each.tick)}
  ];

  return {...options.find(Boolean) as Shaped, closes: true};
}

// Whether the pattern fires at four moments a day or fewer that are not
// the bare rhythm of hours from midnight («setiap 8 jam»).
function isFew(work: Clockwork): boolean {
  const {hours, minutes, seconds} = work;
  const count =
    hours.values.length * minutes.values.length * seconds.values.length;
  const bare = isCadence(hours.base) &&
    hours.base.start + minutes.values[0] + seconds.values[0] === 0 &&
    count === hours.values.length;

  return count <= 4 && !bare;
}

function isOneMinute(work: Clockwork): boolean {
  return work.hours.values.length * work.minutes.values.length === 1;
}

function isEveryHour(work: Clockwork): boolean {
  return work.hours.base.kind === 'all';
}

function isRoundTheClock(work: Clockwork): boolean {
  return isCadence(work.hours.base) && Boolean(work.hours.tiling);
}

function isInSteps(work: Clockwork): boolean {
  return isCadence(work.hours.base);
}

// The ways of saying the time, in the order they are tried.
const shapes: Array<[(work: Clockwork) => boolean,
  (work: Clockwork) => Shaped]> = [
  [isFew, fewMoments],
  [isOneMinute, oneMinute],
  [isEveryHour, everyHourOfTheDay],
  [isRoundTheClock, hoursRoundTheClock],
  [isInSteps, hoursInSteps],
  [Boolean, hoursNamed]
];

/** The time part of a description, for the three time fields. */
function timeOf(facts: ScheduleFacts, style: IndonesianStyle): Time {
  const work = clockworkOf(facts, style);
  const [, say] = shapes.find(function fits([when]) {
    return when(work);
  }) as [unknown, (work: Clockwork) => Shaped];
  const shaped = say(work);
  const span = shaped.span || shaped.tick;
  const left = [
    ...shaped.tick.left,
    ...minutesLeftOut(work, span, Boolean(shaped.closes)),
    ...hoursLeftOut(work, span)
  ];

  return {
    clause: Boolean(shaped.clause) || shaped.tick.suffix.length > 0,
    left,
    round: Boolean(shaped.round),
    text: shaped.text + shaped.tick.suffix
  };
}

export {timeOf};
