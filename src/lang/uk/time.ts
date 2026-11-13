// The time part: the hours, the minutes inside them and the seconds
// inside those, said as clock times wherever a reader would otherwise
// have to work a moment out.
//
// A finer field is said inside the slots a coarser one gives it: minutes
// inside hours, seconds inside minutes. A moment is a number of seconds
// from the start of the day.

import type {
  CadenceDescription, CadencePieces, Domain, ScheduleFacts, SetDescription,
  ValuesDescription
} from '../../core/schedule.js';
import type {
  Describing, Part, Plain, Said as Described, Stepped, Table, Taste
} from './sets.js';
import {choose, partsOf, runsOf, say, walk, wraps} from './sets.js';
import {list, pieces} from './spelling.js';
import {candidatesAs} from '../../core/set-views.js';
import {denote} from '../../core/describe-set.js';
import lexicon from './lexicon.js';

const {category, dayParts, endings, twoDigits, units, words} = lexicon;

// A description that is said in words about places inside a slot.
type Placed = Plain | CadencePieces;

// How a clock time is written.
interface Face {
  hour12: boolean;
  seconds: boolean;
}

// One level of the time: a finer field inside the slots of a coarser one.
interface Level {
  // What follows counts from each slot named: «після кожної з цих годин».
  afterEach: string;
  // The word for every slot: «щогодини».
  cycle: string;
  // What closes a phrase about a place inside the slot: «кожної години».
  each: string;
  // The word that opens a filled stretch: «щохвилини».
  every: string;
  face: Face;
  // A whole slot, filled: «протягом години».
  forA: string;
  // The seconds a firing of one value runs from and to.
  hi: number;
  lo: number;
  // The seconds one value of the finer field stands for.
  scale: number;
  slots: Domain;
  // The seconds in a slot.
  span: number;
  unit: typeof units.minute;
}

// A finer field as it is said: the description chosen, and its values.
interface Fine {
  description: Described;
  values: number[];
}

// A time phrase in its parts: the words, the clock times in brackets
// that pin them, and what is left out, which follows the brackets.
interface Said {
  // Whether the words themselves name a clock time.
  clocked: boolean;
  exceptions: string[];
  pin: string;
  words: string;
}

// The first and the last moment of an unbroken stretch of firings.
type Extent = [number, number];

const cycle: Domain = {cyclic: false, max: 59, min: 0};
const hourDomain: Domain = {cyclic: true, max: 23, min: 0};
const minutesOfDay: Domain = {cyclic: true, max: 1439, min: 0};

const onTheHour: Fine =
  {description: {kind: 'values', values: [0]}, values: [0]};

function clock(moment: number, face: Face): string {
  const hour = Math.floor(moment / 3600);
  const turn = 24 - 12 * Number(face.hour12);
  const digits = [
    hour % turn || 24 - turn,
    twoDigits(Math.floor(moment / 60) % 60),
    twoDigits(moment % 60)
  ].slice(0, 2 + Number(face.seconds)).join(':');
  const partOfDay = dayParts.filter(function reached(part) {
    return face.hour12 && part.from <= hour;
  }).slice(-1).map(function wordOf(part) {
    return part.word;
  });

  return [digits, ...partOfDay].join(' ');
}

function startOf(slot: number, value: number, level: Level): number {
  return slot * level.span + value * level.scale + level.lo;
}

function endOf(slot: number, value: number, level: Level): number {
  return slot * level.span + value * level.scale + level.hi;
}

function everyN(interval: number, unit: typeof units.hour): string {
  return `${words.every} ${interval} ${unit[category(interval)]}`;
}

// «О 9:05, 9:20 та 9:45».
function at(moments: number[], level: Level): string {
  return `${words.at} ${list(moments.map(function write(moment) {
    return clock(moment, level.face);
  }))}`;
}

// «З 9:00 до 17:45», closed by «включно» where the ends are whole hours.
function window(extent: Extent, level: Level, closing: string[] = []) {
  return [
    words.from, clock(extent[0], level.face),
    words.until, clock(extent[1], level.face),
    ...closing
  ].join(' ');
}

// One firing as a clock time, or a stretch of them as its two ends.
function between(
  extent: Extent,
  level: Level,
  stretch: (from: string, to: string) => string
): string {
  const [from, to] = extent.map(function write(moment) {
    return clock(moment, level.face);
  });

  return extent[0] === extent[1] ? from : stretch(from, to);
}

function dashed(from: string, to: string): string {
  return `${from}–${to}`;
}

// A stretch that is left out says where it ends: nothing fires there to
// show it.
function leftOutStretch(from: string, to: string): string {
  return [
    words.stretch, words.from, from, words.until, to, words.inclusive
  ].join(' ');
}

const extents: Table<Part, Extent[], [number, Level]> = {
  range: (range, slot, level) =>
    [[startOf(slot, range.from, level), endOf(slot, range.to, level)]],
  values: (named, slot, level) => named.values.map(function each(value) {
    return [startOf(slot, value, level), endOf(slot, value, level)];
  })
};

// The clock times that settle words about a place inside the slot: every
// item of the first slot, the next slot's first, and the last of all.
function bracket(slots: number[], fine: Placed, level: Level): string {
  function itemsOf(slot: number): string[] {
    return partsOf(fine, cycle).flatMap(function each(part) {
      return say(extents, part, slot, level);
    }).map(function write(extent) {
      return between(extent, level, dashed);
    });
  }

  const shown = [...itemsOf(slots[0]), itemsOf(slots[1])[0]].join(', ');

  return ` (${shown} … ${itemsOf(slots[slots.length - 1]).pop()})`;
}

// Whether a cadence runs on from one slot into the next.
function continuous(cadence: Describing<'cadence'>): boolean {
  return 60 % cadence.interval === 0 &&
    cadence.last - cadence.start + cadence.interval === 60;
}

type FineClass = 'except' | 'lead' | 'list' | 'shape' | 'single' | 'zero';

function cadenceClass(cadence: Describing<'cadence'>): FineClass {
  return continuous(cadence) ? 'lead' : 'shape';
}

function valuesClass(named: ValuesDescription): FineClass {
  return named.values.length > 1 ?
    'list' :
    (['zero', 'single'] as const)[Math.sign(named.values[0])];
}

const classes: Table<Described, FineClass> = {
  all: () => 'lead',
  cadence: cadenceClass,
  cadencePieces: () => 'shape',
  except: () => 'except',
  pieces: () => 'shape',
  range: () => 'shape',
  values: valuesClass
};

// What a minute or a second field may say where it stands: an
// exception, a cadence from zero of three or four values that fills the
// cycle, and the pair that halves it.
interface FineTaste {
  except: boolean;
  lenient: boolean;
  pair: boolean;
}

// The description a minute or a second field says. A run never wraps
// inside its cycle, and a cadence off the beat is a list up to four.
function fineOf(
  facts: ScheduleFacts,
  field: 'minute' | 'second',
  taste: FineTaste
): Fine {
  const {cadencePieces, candidates} = facts.analyses;
  const own = candidates[field] as SetDescription[];
  const description = choose<Described>([
    ...candidatesAs(facts, field, {linear: true}) as SetDescription[],
    ...own.filter(function isCadence(candidate) {
      return candidate.kind === 'cadence';
    })
  ], cycle, {
    base: (base) => taste.except && say(classes, base) === 'lead',
    cadence: (cadence, count) => count > 4 || taste.lenient &&
      continuous(cadence) && cadence.start === 0 && (count > 2 || taste.pair),
    pieces: () => true
  }, cadencePieces[field]);

  return {description, values: denote(own[0], cycle)};
}

// «Рівно, на 15-й та на 45-й хвилині»: the unit once, and «на» once
// unless the zero is there too.
function onList(named: ValuesDescription, level: Level): string {
  const sharp = named.values.filter(function isZero(value) {
    return value === 0;
  }).map(function word() {
    return words.sharp;
  });
  const on = [words.on];
  const others = named.values.filter(Boolean).map(function ordinal(value) {
    return [...on.slice(0, sharp.length), value + endings.ordinalLocative]
      .join(' ');
  });

  return [
    ...on.slice(sharp.length),
    list([...sharp, ...others]),
    ...others.slice(0, 1).map(function unitWord() {
      return level.unit.locative;
    })
  ].join(' ');
}

// «З 5-ї до 55-ї секунди», «від початку до 56-ї хвилини».
function bounds(from: number, to: number, level: Level): string {
  const start = from === 0 ?
    words.fromStart :
    `${words.from} ${from}${endings.ordinalGenitive}`;

  return [
    start, words.until, to + endings.ordinalGenitive,
    level.unit.genitiveOne
  ].join(' ');
}

function counted(count: number, level: Level): string {
  const {genitiveOne, genitiveRest} = level.unit;
  const forms = {few: genitiveRest, many: genitiveRest, one: genitiveOne};

  return `${count} ${forms[category(count)]}`;
}

// A run inside the slot: its first so many, its last so many, or from
// one place to another.
function stretchOf(range: Describing<'range'>, level: Level): string {
  if (range.from === 0) {
    return [words.throughout, words.first, counted(range.to + 1, level)]
      .join(' ');
  }

  if (range.to === cycle.max) {
    return [
      words.throughout, words.last, counted(cycle.max + 1 - range.from, level)
    ].join(' ');
  }

  return bounds(range.from, range.to, level);
}

const partPositions: Table<Part, string, [Level]> =
  {range: stretchOf, values: onList};

function steps(cadence: CadenceDescription, level: Level): string {
  return [
    everyN(cadence.interval, level.unit),
    continuous(cadence) && cadence.start === 0 ?
      level.forA :
      bounds(cadence.start, cadence.last, level)
  ].join(' ');
}

function filled(range: Describing<'range'>, level: Level): string {
  return `${level.every} ${stretchOf(range, level)}`;
}

// Runs and cadences together: each with its own lead.
const steppedPositions: Table<Stepped, string, [Level]> =
  {cadence: steps, range: filled, values: onList};

// The words for places inside a slot.
const positions: Table<Placed, string, [Level]> = {
  all: (all, level) => `${level.every} ${level.forA}`,
  cadence: steps,
  cadencePieces: (parts, level) =>
    pieces(parts.parts.map(function each(part) {
      return say(steppedPositions, part, level);
    })),
  pieces: (parts, level) =>
    `${level.every} ${pieces(parts.parts.map(function each(part) {
      return say(partPositions, part, level);
    }))}`,
  range: filled,
  values: onList
};

function positionsOf(fine: Fine, level: Level): string {
  return say(positions, fine.description as Placed, level);
}

function said(wordsSaid: string, clocked: boolean, pin = ''): Said {
  return {clocked, exceptions: [], pin, words: wordsSaid};
}

function finish(phrase: Said): string {
  return [
    phrase.words + phrase.pin,
    phrase.exceptions.join(`, ${words.andPiece} `)
  ].filter(Boolean).join(', ');
}

// «Щохвилини», or «кожні 15 хвилин».
function opener(fine: Fine, level: Level): string {
  return fine.description.kind === 'cadence' ?
    everyN(fine.description.interval, level.unit) :
    level.every;
}

const steppedLeads: Table<Stepped, string[], [Level]> = {
  cadence: (cadence, level) => [everyN(cadence.interval, level.unit)],
  range: (range, level) => [level.every],
  values: () => []
};

// The stretches of slots that windows are said for: a cadence is one,
// from its first slot to its last.
function stretches(coarse: Described, level: Level): number[][] {
  return coarse.kind === 'cadence' ?
    [[coarse.start, coarse.last]] :
    runsOf(walk(coarse, level.slots), level.slots);
}

// Each stretch of slots from its first firing to its last.
function windows(coarse: Described, fine: Fine, level: Level): string {
  return pieces(stretches(coarse, level).map(function each(run) {
    return window([
      startOf(run[0], fine.values[0], level),
      endOf(run[run.length - 1], fine.values[fine.values.length - 1], level)
    ], level);
  }));
}

// A filled stretch or a running cadence leads, and the slots follow as
// windows; none are said when it runs round the clock from zero. (One
// second carried in every clock time is said after the phrase, so it
// does not make a window either.)
function led(coarse: SetDescription, fine: Fine, level: Level): Said {
  const whole = coarse.kind === 'all' && fine.values[0] === 0 &&
    [0, level.hi].includes(level.lo);

  return said(
    [opener(fine, level), windows(coarse, fine, level)]
      .slice(0, 2 - Number(whole)).join(' '),
    !whole);
}

function onTheCycle(coarse: SetDescription, fine: Fine, level: Level): Said {
  return said(level.cycle, false);
}

// Every clock time of the finer field's values in each slot, from the
// earliest: «о 9:05, 9:20, 17:05 та 17:20».
function timesIn(slots: number[], fine: Fine, level: Level): Said {
  const ascending = slots.slice().sort(function earlier(a, b) {
    return a - b;
  });

  return said(at(ascending.flatMap(function eachSlot(slot) {
    return fine.values.map(function eachValue(value) {
      return startOf(slot, value, level);
    });
  }), level), true);
}

// Places inside the slot, said in words and pinned: by clock times in
// brackets under every slot, and by a window under the rest. Six clock
// times or fewer are listed instead.
function positioned(coarse: Plain, fine: Fine, level: Level): Said {
  const position = positionsOf(fine, level);
  const slots = walk(coarse, level.slots);
  const lead = coarse.kind === 'cadence' ?
    everyN(coarse.interval, units.hour) :
    level.cycle;
  const head = fine.description.kind === 'values' ?
    `${lead} ${position}` :
    `${position} ${level.each}`;

  if (slots.length * fine.values.length <= 6) {
    return timesIn(slots, fine, level);
  }

  if (coarse.kind === 'all') {
    return said(head, false,
      bracket(slots, fine.description as Placed, level));
  }

  return said(`${head}, ${windows(coarse, fine, level)}`, true);
}

// A long cadence of slots is said first, as it is for a single value,
// and the finer field follows as what happens each time.
function eachTime(coarse: Described, fine: Fine, level: Level): Said {
  const slots = finish(build(onTheHour, coarse, level));

  return said(
    `${slots}, ${words.eachTime} ${positionsOf(fine, level)}`,
    true,
    bracket(walk(coarse, level.slots), fine.description as Placed, level));
}

// Slots that are not every slot.
type Some = Exclude<Plain, {kind: 'all'}>;

const slotOpeners: Table<Some, string[], [Level]> = {
  cadence: (cadence) => [everyN(cadence.interval, units.hour)],
  pieces: (parts, level) => [level.cycle],
  range: (range, level) => [level.cycle],
  values: () => []
};

const slotPieces: Table<Part, string, [number, Level]> = {
  range: (range, value, level) => window([
    startOf(range.from, value, level), endOf(range.to, value, level)
  ], level, [words.inclusive]),
  values: (named, value, level) => at(named.values.map(function each(slot) {
    return startOf(slot, value, level);
  }), level)
};

// One value rides in every clock time the slots name. The word that
// opens a run stands before the first run, after any single clock times
// that come ahead of it.
function points(coarse: Some, fine: Fine, level: Level): Said {
  const parts = partsOf(coarse, level.slots);
  const cycleWord = say(slotOpeners, coarse, level);
  const firstRun = parts.findIndex(function isRun(part) {
    return part.kind === 'range';
  });
  const named = parts.map(function each(part, index) {
    return [
      ...cycleWord.filter(function atFirstRun() {
        return index === firstRun;
      }),
      say(slotPieces, part, fine.values[0], level)
    ].join(' ');
  });

  return said(pieces(named), true);
}

const steppedOpeners: Table<Stepped, string[], [Level]> = {
  cadence: (cadence) => [everyN(cadence.interval, units.hour)],
  range: (range, level) => [level.cycle],
  values: () => []
};

// One value in every clock time of slots that are runs and cadences
// together: each cadence and each run with its own lead.
function steppedPoints(coarse: CadencePieces, fine: Fine, level: Level) {
  return said(pieces(coarse.parts.map(function each(part) {
    const [slots] = partsOf(part, level.slots);

    return [
      ...say(steppedOpeners, part, level),
      say(slotPieces, slots, fine.values[0], level)
    ].join(' ');
  })), true);
}

// A part of the finer field inside one named slot, as clock times.
function piecesAt(part: Part, slot: number, level: Level): string[] {
  const found = say(extents, part, slot, level);

  return part.kind === 'values' && level.lo === level.hi ?
    [at(found.map(function first(extent) {
      return extent[0];
    }), level)] :
    found.map(function each(extent) {
      return window(extent, level);
    });
}

// «Через 5, 20 та 45 хвилин»: the unit follows the last count.
function countsAfter(values: number[], level: Level): string {
  return [
    words.afterCount, list(values),
    level.unit[category(values[values.length - 1])]
  ].join(' ');
}

// A list of counts in named slots: in one slot, or as six clock times or
// fewer, they are listed; more are the counts after the slots, and where
// the list holds the slot's own start, the slots are said first and the
// rest follows after each of them.
function countsInSlots(slots: number[], fine: Fine, level: Level): Said {
  const starts = slots.map(function start(slot) {
    return startOf(slot, 0, level);
  });

  if (slots.length === 1 || fine.values.length * slots.length <= 6) {
    return timesIn(slots, fine, level);
  }

  return said(fine.values[0] === 0 ?
    [
      at(starts, level), words.andPiece,
      countsAfter(fine.values.slice(1), level), level.afterEach
    ].join(' ') :
    [
      countsAfter(fine.values, level), words.after,
      list(starts.map(function write(moment) {
        return clock(moment, level.face);
      }))
    ].join(' '), true);
}

// The lead of each stretch said in named slots: one for them all,
// before the first; runs and cadences together, each its own every time.
function leadsOf(fine: Fine, level: Level) {
  const {description} = fine;
  const own = description.kind === 'cadencePieces' &&
    description.parts.map(function each(part) {
      return say(steppedLeads, part, level);
    });

  return function leadAt(part: number, slot: number): string[] {
    return own ?
      own[part] :
      [opener(fine, level)].slice(Math.sign(part + slot));
  };
}

// Named slots: a list of counts is said with the slots; anything else is
// said slot by slot, as windows.
function inNamedSlots(
  coarse: ValuesDescription,
  fine: Fine,
  level: Level
): Said {
  const slots = coarse.values;

  if (fine.description.kind === 'values') {
    return countsInSlots(slots, fine, level);
  }

  const parts = partsOf(fine.description as Placed, cycle);
  const leads = leadsOf(fine, level);

  return said(pieces(slots.flatMap(function eachSlot(slot, nth) {
    return parts.flatMap(function eachPart(part, index) {
      const [first, ...rest] = piecesAt(part, slot, level);

      return [
        [...leads(index, nth), first].join(' '), ...rest
      ];
    });
  })), true);
}

// Slots left out of a simpler set: the simpler set is said, and then
// what is left out of it, from its first firing to its last.
function leftOut(
  coarse: Describing<'except'>,
  fine: Fine,
  level: Level,
  runs: number[][]
): Said {
  const base = build(fine, coarse.base, level);
  const gaps = runs.map(function each(run) {
    return between([
      startOf(run[0], fine.values[0], level),
      endOf(run[run.length - 1], fine.values[fine.values.length - 1], level)
    ], level, leftOutStretch);
  });

  // The clock times that pin the simpler set are firings of this one.
  return {
    ...base,
    exceptions: [...base.exceptions, `${words.except} ${list(gaps)}`],
    pin: base.pin && bracket(walk(coarse, level.slots),
      fine.description as Placed, level)
  };
}

// Under a single value each slot left out is a clock time of its own.
function slotsLeftOut(
  coarse: Describing<'except'>,
  fine: Fine,
  level: Level
): Said {
  return leftOut(coarse, fine, level, coarse.removed.map(function own(slot) {
    return [slot];
  }));
}

function stretchesLeftOut(
  coarse: Describing<'except'>,
  fine: Fine,
  level: Level
): Said {
  return leftOut(coarse, fine, level, runsOf(coarse.removed, level.slots));
}

// An exception to a long cadence of slots stays with the slots.
function eachTimeOrLeftOut(
  coarse: Describing<'except'>,
  fine: Fine,
  level: Level
): Said {
  return coarse.base.kind === 'cadence' ?
    eachTime(coarse, fine, level) :
    stretchesLeftOut(coarse, fine, level);
}

// Values left out of a filled stretch or a running cadence: clock times
// inside named slots, and a place inside the slot, pinned, elsewhere.
function valuesLeftOut(coarse: SetDescription, fine: Fine, level: Level) {
  const {base, removed} = fine.description as Describing<'except'>;
  const whole = build({description: base, values: denote(base, cycle)},
    coarse, level);
  const gone: ValuesDescription = {kind: 'values', values: removed};
  const slots = walk(coarse, level.slots);
  const gaps = coarse.kind === 'values' ?
    list(slots.flatMap(function each(slot) {
      return say(extents, gone, slot, level);
    }).map(function write(extent) {
      return between(extent, level, leftOutStretch);
    })) :
    [
      list(removed.map(function ordinal(value) {
        return value + endings.ordinalGenitive;
      })),
      level.unit.genitiveOne,
      level.each + bracket(slots, gone, level)
    ].join(' ');

  return {
    ...whole,
    exceptions: [...whole.exceptions, `${words.except} ${gaps}`]
  };
}

// How a finer field of each class is said inside each kind of slots.
const forms: {[fine in FineClass]: Table<Described, Said, [Fine, Level]>} =
{
  except: {
    all: valuesLeftOut,
    cadence: valuesLeftOut,
    cadencePieces: eachTime,
    except: valuesLeftOut,
    pieces: valuesLeftOut,
    range: valuesLeftOut,
    values: valuesLeftOut
  },
  lead: {
    all: led,
    cadence: eachTime,
    cadencePieces: eachTime,
    except: eachTimeOrLeftOut,
    pieces: led,
    range: led,
    values: led
  },
  list: {
    all: positioned,
    cadence: positioned,
    cadencePieces: eachTime,
    except: stretchesLeftOut,
    pieces: positioned,
    range: positioned,
    values: inNamedSlots
  },
  shape: {
    all: positioned,
    cadence: eachTime,
    cadencePieces: eachTime,
    except: eachTimeOrLeftOut,
    pieces: positioned,
    range: positioned,
    values: inNamedSlots
  },
  single: {
    all: positioned,
    cadence: points,
    cadencePieces: steppedPoints,
    except: slotsLeftOut,
    pieces: points,
    range: points,
    values: points
  },
  zero: {
    all: onTheCycle,
    cadence: points,
    cadencePieces: steppedPoints,
    except: slotsLeftOut,
    pieces: points,
    range: points,
    values: points
  }
};

function build(fine: Fine, coarse: Described, level: Level): Said {
  return say(forms[say(classes, fine.description)], coarse, fine, level);
}

// Minutes inside hours. A clock time carries seconds from `lo` to `hi`
// when the seconds are said with the minutes.
function minuteLevel(lo: number, hi: number, every: string, face: Face) {
  return {
    afterEach: words.afterEachHour,
    cycle: words.everyHour,
    each: words.eachHour,
    every,
    face,
    forA: words.forAnHour,
    hi,
    lo,
    scale: 60,
    slots: hourDomain,
    span: 3600,
    unit: units.minute
  };
}

// Seconds inside the minutes of the day.
function secondLevel(face: Face): Level {
  return {
    afterEach: words.afterEachMinute,
    cycle: words.everyMinute,
    each: words.eachMinute,
    every: words.everySecond,
    face,
    forA: words.forAMinute,
    hi: 0,
    lo: 0,
    scale: 1,
    slots: minutesOfDay,
    span: 60,
    unit: units.second
  };
}

// The seconds as what happens each time the rest fires, pinned to the
// second. One second after «щогодини» alone is counted from the hour.
function eachMinute(
  rest: Said,
  seconds: Fine,
  slots: number[],
  level: Level
): string {
  const [second] = seconds.values;
  const counts = seconds.values.length === 1 &&
    rest.words === words.everyHour;
  const phrase = counts ?
    [
      '', words.afterCount, second, units.second[category(second)],
      words.afterHourStart
    ].join(' ') :
    `, ${words.eachTime} ${positionsOf(seconds, level)}`;

  return finish({
    ...rest,
    pin: bracket(slots, seconds.description as Placed, level),
    words: rest.words + phrase
  });
}

// Beside a run across midnight, four hours left out or fewer are an
// exception; more, and the run is said.
const hourTaste: Taste = {
  base: () => true,
  cadence: (cadence, count) => count > 4,
  gap: (count) => count <= 4,
  pieces: () => true
};

/**
 * The hours as they are said. A run across midnight is true only when
 * nothing coarser is restricted; elsewhere the hours it would be said
 * for are described inside one day. Hours said with no such run are
 * said alike under any calendar.
 */
function hoursOf(facts: ScheduleFacts, overnight: boolean): Described {
  const {cadencePieces, candidates} = facts.analyses;
  const round = choose<Described>(candidates.hour as SetDescription[],
    hourDomain, hourTaste, cadencePieces.hour);

  return overnight || !wraps(round) ?
    round :
    choose<Described>(
      candidatesAs(facts, 'hour', {linear: true}) as SetDescription[],
      hourDomain, hourTaste, cadencePieces.hour);
}

// A cadence of hours, or runs and cadences of them together, with or
// without hours left out.
function isBeat(hours: Described): boolean {
  return ['cadence', 'cadencePieces'].includes(hours.kind) ||
    hours.kind === 'except' && hours.base.kind === 'cadence';
}

/** The time part of a description, for hours already chosen. */
function timeOf(
  facts: ScheduleFacts,
  hours: Described,
  hour12: boolean
): string {
  const {candidates} = facts.analyses;
  const [everySeconds] = candidates.second as SetDescription[];
  const everySecond = denote(everySeconds, cycle);
  const [first] = everySecond;
  const last = everySecond[everySecond.length - 1];
  const carried = first * Number(everySecond.length === 1);
  const bySecond = secondLevel({hour12, seconds: last > 0});
  const everyMinute =
    denote((candidates.minute as SetDescription[])[0], cycle);
  const everyHour = walk(hours, hourDomain);
  const slots = everyHour.flatMap(function eachHour(hour) {
    return everyMinute.map(function eachMinuteOf(minute) {
      return hour * 60 + minute;
    });
  });

  if (everySecond.length * slots.length <= 4) {
    return finish(timesIn(slots,
      {description: everySeconds, values: everySecond}, bySecond));
  }

  // After a cadence of hours the minutes take no exception, and two of
  // them are two places.
  const beat = isBeat(hours);
  const minutes = fineOf(facts, 'minute',
    {except: !beat, lenient: true, pair: !beat});
  const byMinute = minuteLevel(carried, carried, words.everyMinute,
    {hour12, seconds: carried > 0});
  // Four clock times or fewer are listed, whatever follows them.
  const rest = slots.length <= 4 ?
    timesIn(everyHour, {...minutes, values: everyMinute}, byMinute) :
    build(minutes, hours, byMinute);

  if (last === 0 || carried > 0 && rest.clocked) {
    return finish(rest);
  }

  const seconds = fineOf(facts, 'second',
    {except: true, lenient: true, pair: true});

  if (slots.length === minutesOfDay.max + 1) {
    return finish(build(seconds, {kind: 'all'}, bySecond));
  }

  // In one clock time the seconds are its times or its windows; in two
  // or three, windows, but a list of seconds follows each time instead.
  if (slots.length === 1 ||
      slots.length <= 3 && seconds.description.kind !== 'values') {
    return finish(build(seconds, {kind: 'values', values: slots}, bySecond));
  }

  const lead = opener(seconds, bySecond);
  const spanned = build(minutes, hours,
    minuteLevel(first, last, lead, bySecond.face));

  if (say(classes, seconds.description) === 'lead' &&
      spanned.words.startsWith(lead)) {
    return finish(spanned);
  }

  // What is left out of the minutes is written to the second too.
  return eachMinute({...rest, exceptions: spanned.exceptions},
    fineOf(facts, 'second', {except: false, lenient: false, pair: false}),
    slots, bySecond);
}

export {hoursOf, timeOf};
