// The time part of the sentence: the hours, minutes and seconds said
// together (answers 4.1 and 4.2). The minutes and hours choose one form;
// the seconds then lead it, join its minute phrase, ride on its clock
// times, or follow it as a clause.

import type {Clock, Moment, Piece, Unit} from './wording.js';
import type {Part, Policy, Said} from './sets.js';
import {byCount, every, led, list, pick, spaced} from './wording.js';
import {isRange, isValues, mapParts, say, thingsNamed} from './sets.js';
import lexicon from './lexicon.js';

const {units, words} = lexicon;

/** The values the three time fields fire on. */
export interface TimeFacts {
  hour: number[];
  minute: number[];
  second: number[];
  // Whether a run of hours may cross midnight (answers 3.5).
  hoursWrap: boolean;
}

/** The time part, and whether it runs every hour of the day. */
export interface TimePart {
  text: string;
  everyHour: boolean;
}

type Form = 'bracket' | 'clocks' | 'hourly' | 'phrase' | 'phraseHours' |
  'phraseWindows' | 'points' | 'windows';

type Mode = 'carried' | 'clause' | 'joined' | 'lead' | 'plain';

type HourKind = 'all' | 'cadence' | 'few' | 'many' | 'runs';

// How the minutes are worded: what leads a stretch and what leads named
// minutes, the preposition before named minutes, and the seconds a window
// opens and closes on when it is written to the second.
interface Voice {
  each(interval: number): string;
  named: string;
  on: 'during' | 'in' | 'of';
  edge: [number[], number[]];
}

// Everything the time part is built from.
interface Scene {
  facts: TimeFacts;
  clock: Clock;
  hours: Said;
  hourKind: HourKind;
  minutes: Said;
  seconds: Said;
  // The hours as stretches: each run, and each hour standing alone.
  spans: Array<[number, number]>;
  form: Form;
  mode: Mode;
  voice: Voice;
  // The tail of each clock time said at one hour and minute: none, or
  // one for each second the times carry.
  carry: number[][];
}

// The length of an hour in minutes and of a minute in seconds.
const SIXTY = 60;

// Inside up to this many separate hours, minutes are clock times.
const FEW_HOURS = 4;

// A list of clock times goes up to this many.
const MOST_TIMES = 12;

// With the seconds, a list of clock times goes up to this many.
const MOST_TIMES_TO_THE_SECOND = 4;

const EACH: [string, string] = [words.each, words.each];
const ONCE: [string, string] = [words.oncePer, words.onceEach];
const TO_THE_MINUTE: Voice['edge'] = [[], []];

// The preposition and article before one named minute and before several.
const NAMED: {[on in Voice['on']]: [string, string]} = {
  during: [`${words.during} ${words.the}`,
    `${words.during} ${words.thePlural}`],
  in: [`${words.in} ${words.the}`, `${words.in} ${words.thePlural}`],
  of: [words.fromThe, `${words.of} ${words.thePlural}`]
};

// Whether minutes or seconds fill their cycle evenly from its start:
// every one of them, or a cadence that needs no anchor (answers 3.7).
function tiles(said: Said): boolean {
  return said.kind !== 'parts' && said.start === 0 &&
    said.last + said.interval === SIXTY;
}

// Whether minutes or seconds are every second one from 1.
function oddOnes(said: {interval: number; start: number; last: number}):
  boolean {
  return said.interval === 2 && said.start === 1 &&
    said.last === SIXTY - 1;
}

// Minutes and seconds never wrap. A cadence is said as one when it tiles
// (from `bareLeast` values), when it is the odd ones, or from `least`
// values with both its ends.
function subHourPolicy(least: number, bareLeast: number): Policy {
  return {
    cadence(cadence, count) {
      const bare = cadence.start === 0 &&
        cadence.last + cadence.interval === SIXTY;

      return bare && count >= bareLeast || oddOnes(cadence) ||
        !bare && count >= least;
    },
    domain: {cyclic: true, max: SIXTY - 1, min: 0},
    holeCost: 1,
    minRun: 3,
    pairWraps: false,
    wraps: false
  };
}

// Hours under a single minute are points: a run has three hours, a
// cadence eight, and an excepted hour is one clock time. Hours filled by
// more than one minute are stretches: two hours make a window, a cadence
// has five hours, and an excepted hour is a window of two times.
function hourPolicy(single: boolean, wraps: boolean): Policy {
  const judged = pick([
    [{holeCost: 1, least: 8, minRun: 3}, single],
    [{holeCost: 2, least: 5, minRun: 2}, true]
  ]);

  return {
    cadence(cadence, count) {
      return count >= judged.least;
    },
    domain: {cyclic: true, max: 23, min: 0},
    holeCost: judged.holeCost,
    minRun: judged.minRun,
    pairWraps: false,
    wraps
  };
}

function hourKindOf(hours: Said, count: number): HourKind {
  return pick<HourKind>([
    [hours.kind as HourKind, hours.kind !== 'parts'],
    ['runs', hours.parts.some(isRange)],
    ['few', count <= FEW_HOURS],
    ['many', true]
  ]);
}

// A set as stretches: every value and a cadence are one stretch from the
// first value to the last.
function stretchesOf(said: Said): Part[] {
  return said.kind === 'parts' ?
    said.parts :
    [{from: said.start, kind: 'range', to: said.last}];
}

// «del minuto 10 al 40».
function reach(unit: Unit, from: number, to: number): string {
  return `${words.fromThe} ${unit.one} ${from} ${words.toThe} ${to}`;
}

// A run inside the hour or the minute: «durante los primeros 30 minutos»,
// «durante los últimos 15 minutos», «del minuto 10 al 40».
function stretch(unit: Unit, from: number, to: number): string {
  const lead = `${words.during} ${words.thePlural}`;

  return pick([
    [`${lead} ${words.first} ${to + 1} ${unit.many}`, from === 0],
    [`${lead} ${words.last} ${SIXTY - from} ${unit.many}`,
      to === SIXTY - 1],
    [reach(unit, from, to), true]
  ]);
}

// «en el minuto 30», «durante los minutos 30 y 42», «del minuto 0».
function named(unit: Unit, values: number[], on: Voice['on']): string {
  return `${byCount(NAMED[on], values.length)} ` +
    `${byCount([unit.one, unit.many], values.length)} ${list(values)}`;
}

// The phrase for a set of minutes or of seconds, by how it is said.
const phrasers = {
  all(said: Said, unit: Unit, voice: Voice): string {
    return voice.each(1);
  },
  cadence(said: Said, unit: Unit, voice: Voice): string {
    const odd = spaced([
      voice.named, NAMED[voice.on][1], unit.many, words.theOdd
    ]);

    return pick([
      [voice.each(said.interval), tiles(said)],
      [odd, oddOnes(said)],
      [spaced([voice.each(said.interval),
        reach(unit, said.start, said.last)]), true]
    ]);
  },
  parts(said: Said, unit: Unit, voice: Voice): string {
    return list(led(mapParts(said.parts, function run(from, to): Piece {
      return {body: stretch(unit, from, to), lead: voice.each(1)};
    }, function strays(values) {
      return {body: named(unit, values, voice.on), lead: voice.named};
    })));
  }
};

function unitPhrase(said: Said, unit: Unit, voice: Voice): string {
  return phrasers[said.kind](said, unit, voice);
}

// The minutes on their own terms: «cada minuto», «en el minuto 30».
const minuteVoice: Voice = {
  each(interval) {
    return every(units.minute, interval, EACH);
  },
  edge: TO_THE_MINUTE,
  named: '',
  on: 'in'
};

// The seconds as a lead of their own, and as a clause after the time.
const secondVoice: Voice = {
  ...minuteVoice,
  each(interval) {
    return every(units.second, interval, EACH);
  }
};

const clauseVoice: Voice = {
  ...minuteVoice,
  each(interval) {
    return every(units.second, interval, ONCE);
  }
};

// Whether the minutes are values named one by one.
function listed(minutes: Said): boolean {
  return minutes.kind === 'parts' && minutes.parts.every(isValues);
}

// How many things the form that rivals a list of clock times names: a
// lead for a cadence and a window for each stretch of hours, or the
// minute phrase and a window for each stretch.
function rivalCost(scene: Scene): number {
  const {hourKind, minutes, spans} = scene;
  const things = thingsNamed(stretchesOf(minutes));

  return tiles(minutes) || hourKind === 'few' ?
    Number(minutes.kind === 'cadence') + spans.length * things :
    things + 2 * spans.length;
}

// Whether the clock times are listed (answers 4.1): at most twelve, and
// either the hours stand apart with no window to offer, or the list names
// no more than its rival.
function timesListed(scene: Scene): boolean {
  const {facts, hourKind, minutes} = scene;
  const times = facts.minute.length * facts.hour.length;
  const apart = hourKind === 'many' || hourKind === 'cadence' ||
    hourKind === 'few' && listed(minutes);

  return times <= MOST_TIMES && (apart || times <= rivalCost(scene));
}

function formOf(scene: Scene, silent: boolean): Form {
  const {facts, hourKind, minutes} = scene;
  const single = facts.minute.length === 1;
  const everyHour = hourKind === 'all';
  const onCadence = hourKind === 'cadence';
  const apart = hourKind === 'few' || hourKind === 'many';

  return pick<Form>([
    ['hourly', everyHour && silent && facts.minute[0] === 0 && single],
    ['phrase', everyHour],
    ['clocks', single && apart],
    ['points', single],
    ['clocks', timesListed(scene)],
    ['bracket', onCadence && tiles(minutes)],
    ['points', onCadence && facts.minute.length <= FEW_HOURS],
    ['phraseHours', onCadence || apart && (hourKind === 'many' ||
      listed(minutes))],
    ['windows', tiles(minutes) || hourKind === 'few'],
    ['phraseWindows', true]
  ]);
}

// The forms whose minutes a seconds phrase can lead or join.
const LEADABLE: Form[] =
  ['bracket', 'phrase', 'phraseHours', 'phraseWindows', 'windows'];

// How the seconds meet the time part (answers 4.2), first that applies.
function modeOf(scene: Scene, silent: boolean): Mode {
  const {facts, form, minutes, seconds} = scene;
  const leadable = LEADABLE.includes(form);
  const steady = tiles(seconds);
  const times = facts.minute.length * facts.hour.length *
    facts.second.length;

  return pick<Mode>([
    ['plain', silent],
    ['lead', leadable && steady && minutes.kind !== 'cadence'],
    ['joined', leadable && !steady &&
      (minutes.kind === 'all' || listed(minutes))],
    ['carried', form === 'clocks' && times <= MOST_TIMES_TO_THE_SECOND],
    ['carried', form === 'points' && facts.second.length === 1],
    ['clause', true]
  ]);
}

// Under a seconds lead the minutes are stretches of seconds: «cada
// segundo durante el minuto 30». Joined to named seconds they are named
// after them: «en el segundo 15 del minuto 30».
function voiceOf(scene: Scene): Voice {
  const lead = unitPhrase(scene.seconds, units.second, secondVoice);

  return pick<Voice>([
    [{
      each() {
        return lead;
      },
      edge: [[0], [SIXTY - 1]],
      named: lead,
      on: 'during'
    }, scene.mode === 'lead'],
    [{
      each() {
        return '';
      },
      edge: TO_THE_MINUTE,
      named: '',
      on: pick<Voice['on']>([
        ['in', scene.minutes.kind === 'all'],
        ['of', true]
      ])
    }, scene.mode === 'joined'],
    [minuteVoice, true]
  ]);
}

// A window over a stretch of hours, from one minute to another.
function windowOf(
  scene: Scene,
  span: [number, number],
  minutes: [number, number],
  edge: Voice['edge']
): string {
  return scene.clock.span(
    {hour: span[0], minute: minutes[0], tail: edge[0]},
    {hour: span[1], minute: minutes[1], tail: edge[1]});
}

// The first and the last minute that fire in an hour.
function minuteEnds(scene: Scene): [number, number] {
  const {minute} = scene.facts;

  return [minute[0], minute[minute.length - 1]];
}

// The minutes as the stretches a window is drawn over. Under a seconds
// lead a named minute is a stretch too: every second of it.
function minuteStretches(scene: Scene): Part[] {
  const stretches = stretchesOf(scene.minutes);
  const whole: Part[] = mapParts(stretches, function run(from, to): Part[] {
    return [{from, kind: 'range', to}];
  }, function eachOne(values) {
    return values.map(function alone(value): Part {
      return {from: value, kind: 'range', to: value};
    });
  }).flat();

  return pick([[whole, scene.mode === 'lead'], [stretches, true]]);
}

// The minutes inside each stretch of hours, as windows and clock times.
function windowPieces(scene: Scene, stretches: Part[]): Piece[] {
  const {clock, minutes, voice} = scene;

  return scene.spans.flatMap(function inSpan(span) {
    return mapParts(stretches, function run(from, to): Piece {
      return {
        body: windowOf(scene, span, [from, to], voice.edge),
        lead: voice.each(minutes.interval)
      };
    }, function strays(values) {
      return {
        body: clock.at(values.map(function time(minute) {
          return {hour: span[0], minute, tail: []};
        })),
        lead: ''
      };
    });
  });
}

// Every clock time, by hour, then minute, then the second it carries.
function momentsOf(scene: Scene, hours: number[], minutes: number[]):
  Moment[] {
  return hours.flatMap(function eachHour(hour) {
    return minutes.flatMap(function eachMinute(minute) {
      return scene.carry.map(function eachTail(tail) {
        return {hour, minute, tail};
      });
    });
  });
}

const HOURS_THAT_BEGIN = spaced([
  words.theHours, units.hour.many, words.thatBegin
]);

// The time part in each form, before exceptions and a seconds clause.
const forms: {[form in Form]: (scene: Scene) => string} = {
  // «cada minuto durante una hora cada 2 horas (de 0:00 a 0:59, de 2:00
  // a 2:59… hasta las 22:59)».
  bracket(scene) {
    const {clock, hours, minutes, voice} = scene;
    const ends = minuteEnds(scene);
    const shown = [0, 1].map(function nth(index) {
      const hour = hours.start + index * hours.interval;

      return windowOf(scene, [hour, hour], ends, voice.edge);
    });
    const last = clock.until(
      {hour: hours.last, minute: ends[1], tail: voice.edge[1]});

    return spaced([
      unitPhrase(minutes, units.minute, voice),
      words.during,
      words.oneHour,
      every(units.hour, hours.interval, EACH),
      `(${shown.join(', ')}… ${last})`
    ]);
  },
  clocks(scene) {
    const {facts} = scene;

    return scene.clock.at(momentsOf(scene, facts.hour, facts.minute));
  },
  hourly() {
    return every(units.hour, 1, EACH);
  },
  // «cada 15 minutos»; «en los minutos 5, 20 y 45 de cada hora».
  phrase(scene) {
    return spaced([
      unitPhrase(scene.minutes, units.minute, scene.voice),
      pick([['', tiles(scene.minutes)], [words.ofEachHour, true]])
    ]);
  },
  // «cada minuto durante las horas que empiezan a las 6:00, 8:00, …».
  phraseHours(scene) {
    const {clock, facts, minutes, voice} = scene;

    return spaced([
      unitPhrase(minutes, units.minute, voice),
      pick([[words.during, tiles(minutes)], [words.of, true]]),
      HOURS_THAT_BEGIN,
      clock.at(facts.hour.map(function onTheHour(hour) {
        return {hour, minute: 0, tail: []};
      }))
    ]);
  },
  // «en los minutos 5, 20 y 45 de cada hora, de 9:05 a 17:45».
  phraseWindows(scene) {
    const ends = minuteEnds(scene);

    return `${forms.phrase(scene)}, ` +
      list(scene.spans.map(function over(span) {
        return windowOf(scene, span, ends, TO_THE_MINUTE);
      }));
  },
  // Hours as points, each minute carried: «cada hora de 9:30 a 17:30 y a
  // las 22:30»; «cada 2 horas de 0:15 a 22:15 y de 0:45 a 22:45».
  points(scene) {
    const {clock, facts, hours} = scene;
    const [tail] = scene.carry;

    return list(led(mapParts(stretchesOf(hours),
      function run(from, to): Piece {
        return {
          body: list(facts.minute.map(function carried(minute) {
            return clock.span({hour: from, minute, tail},
              {hour: to, minute, tail});
          })),
          lead: every(units.hour, hours.interval, EACH)
        };
      },
      function strays(values) {
        return {
          body: clock.at(momentsOf(scene, values, facts.minute)),
          lead: ''
        };
      })));
  },
  // «cada 15 minutos de 9:00 a 17:45 y de 22:00 a 22:45».
  windows(scene) {
    return list(led(windowPieces(scene, minuteStretches(scene))));
  }
};

// What each excepted set says, when it has anything to say.
function holes(removed: number[], build: (removed: number[]) => string[]):
  string[] {
  return removed.length > 0 ? build(removed) : [];
}

// The excepted hours: clock times under a single minute, and otherwise a
// window from the first time that would have fired in each to the last.
function hourHoles(scene: Scene): string[] {
  const {clock, facts, mode, voice} = scene;
  const ends = minuteEnds(scene);

  return holes(scene.hours.removed, function said(removed) {
    return pick([
      [[clock.at(momentsOf(scene, removed, facts.minute))],
        facts.minute.length === 1 && mode !== 'lead'],
      [removed.map(function whole(hour) {
        return windowOf(scene, [hour, hour], ends, voice.edge);
      }), true]
    ]);
  });
}

// The excepted minutes: inside a few separate hours they are clock times
// (whole minutes, under a seconds lead), and otherwise minutes of every
// hour.
function minuteHoles(scene: Scene): string[] {
  const {clock, facts, hourKind, mode, voice} = scene;

  return holes(scene.minutes.removed, function said(removed) {
    const few = hourKind === 'few';

    return pick([
      [scene.spans.flatMap(function inSpan(span) {
        return removed.map(function whole(minute) {
          return windowOf(scene, span, [minute, minute], voice.edge);
        });
      }), few && mode === 'lead'],
      [[clock.at(momentsOf(scene, facts.hour, removed))], few],
      [[`${named(units.minute, removed, voice.on)} ${words.ofEachHour}`],
        true]
    ]);
  });
}

// The excepted seconds, where the seconds lead or join the time part.
function secondHoles(scene: Scene): string[] {
  return holes(scene.seconds.removed, function said(removed) {
    return pick([
      [[], scene.mode === 'clause'],
      [[`${named(units.second, removed, 'in')} ${words.ofEachMinute}`],
        true]
    ]);
  });
}

function exceptions(items: string[]): string {
  return items.length > 0 ? `, ${words.except} ${list(items)}` : '';
}

// Whether the seconds fill a stretch, and so say for how long.
function fillsStretch(seconds: Said): boolean {
  return seconds.kind === 'all' || seconds.parts.some(isRange) ||
    seconds.kind === 'cadence' && !oddOnes(seconds);
}

// The seconds as a clause after the time part (answers 4.2, rule 4).
// Named seconds follow a comma; a stretch of seconds does so only after
// clock times, and otherwise says «y en cada ocasión».
function clause(scene: Scene): string {
  const {form, seconds} = scene;
  const burst = spaced([
    pick([
      [words.atEachTime, fillsStretch(seconds) && form !== 'clocks'],
      ['', true]
    ]),
    unitPhrase(seconds, units.second, clauseVoice),
    pick([
      [`${words.during} ${words.thatMinute}`, tiles(seconds)],
      ['', true]
    ])
  ]);

  return `, ${burst}` + exceptions(holes(seconds.removed,
    function said(removed) {
      return [named(units.second, removed, 'in')];
    }));
}

// The seconds phrase the time part follows, where the seconds are named
// and join it: «en el segundo 30 de cada minuto», then a comma; «en el
// segundo 15», then the minute it belongs to.
function head(scene: Scene): {text: string; join: string} {
  const phrase = unitPhrase(scene.seconds, units.second, secondVoice);

  return pick([
    [{join: '', text: ''}, scene.mode !== 'joined'],
    [{join: ', ', text: `${phrase} ${words.ofEachMinute}`},
      scene.minutes.kind === 'all'],
    [{join: ' ', text: phrase}, true]
  ]);
}

function sceneOf(facts: TimeFacts, clock: Clock): Scene {
  const single = facts.minute.length === 1;
  const hours = say(facts.hour, hourPolicy(single, facts.hoursWrap));
  const hourKind = hourKindOf(hours, facts.hour.length);
  const minutes = say(facts.minute, subHourPolicy(
    pick([[FEW_HOURS, hourKind === 'few'], [8, true]]), 0));

  // Beside minutes that are not every minute, a cadence of four seconds
  // or fewer is named.
  const seconds = say(facts.second, subHourPolicy(
    8, pick([[0, minutes.kind === 'all'], [5, true]])));
  const silent = facts.second.length === 1 && facts.second[0] === 0;
  const scene: Scene = {
    carry: [[]],
    clock,
    facts,
    form: 'phrase',
    hourKind,
    hours,
    minutes,
    mode: 'plain',
    seconds,
    spans: mapParts(hours.parts, function run(from, to) {
      return [[from, to] as [number, number]];
    }, function alone(values) {
      return values.map(function each(hour): [number, number] {
        return [hour, hour];
      });
    }).flat(),
    voice: minuteVoice
  };

  scene.form = formOf(scene, silent);
  scene.mode = modeOf(scene, silent);
  scene.voice = voiceOf(scene);
  scene.carry = pick([
    [facts.second.map(function alone(second) {
      return [second];
    }), scene.mode === 'carried'],
    [scene.carry, true]
  ]);

  return scene;
}

/** The time part of the sentence. */
function timePart(facts: TimeFacts, clock: Clock): TimePart {
  const scene = sceneOf(facts, clock);
  const lead = head(scene);
  const body = [lead.text, forms[scene.form](scene)]
    .filter(Boolean).join(lead.join);
  const excepted = exceptions([
    ...hourHoles(scene), ...minuteHoles(scene), ...secondHoles(scene)
  ]);

  return {
    everyHour: scene.hourKind === 'all',
    text: body + excepted +
      pick([[clause(scene), scene.mode === 'clause'], ['', true]])
  };
}

export {timePart};
