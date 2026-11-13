// The time part of a Chinese description: what the hours, the minutes and
// the seconds say together. It depends on nothing but those three sets
// and on whether a run of hours may cross midnight.

import type {Domain, Field} from '../../core/schedule.js';
import {denote, describeCadencePieces} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import type {ChineseStyle} from './options.js';
import type {Allowed, Cadence, Exception, Run} from './sets.js';
import {
  LISTED, cadenceOf, chosen, everySecond, first, lastOf, linearRuns, listed,
  never, runsOf, series, when
} from './sets.js';

const {marks, units, words} = lexicon;

// How many consecutive clock times, minutes or seconds make a window.
const WINDOW = 5;

// A moment by the parts that are named: an hour makes it a clock time
// (9:05, 9:05:30), and without one it is a position in the hour or the
// minute (5分, 5分30秒, 30秒).
interface Moment {
  h?: number;
  m?: number;
  s?: number;
}

// A stretch from its first firing to its last.
type Span = [Moment, Moment];

// A set as the time part says it: windows, each with its step, and the
// stray values listed beside them. `step` is the one step the windows
// share, or 0 where they differ.
interface Shape {
  step: number;
  steps: number[];
  strays: number[];
  windows: Run[];
}

// The windows and stray moments of a phrase, each window with its step,
// and whether it has a rhythm.
interface Grid {
  paced: boolean;
  steps: number[];
  strays: Moment[];
  windows: Span[];
}

// The rhythm of a phrase: one firing every so many units.
interface Beat {
  step: number;
  unit: string;
}

// One of the hours, minutes or seconds: the values that fire, the set
// they are said as (`base`, with `removed` excepted from it), and that
// set's arrangement.
interface Level {
  base: number[];
  cadence: Cadence | undefined;
  every: boolean;
  // Whether the set runs without a break: every value, or a cadence that
  // tiles the field from its first value.
  flows: boolean;
  removed: number[];
  runs: Run[];
  shape: Shape;
  values: number[];
}

// What decides a set's arrangement: its cadence if it has one, whether
// that is said as one window, and whether nothing is excepted from it.
interface Pace {
  cadence: Cadence | undefined;
  domain: Domain;
  stepped: boolean;
  whole: boolean;
}

interface Traits {
  allowed: Allowed;
  // A tiling cadence is one window however few values it has.
  tiled?: boolean;
  wraps?: boolean;
}

// How moments are written: the clock, the seconds every window opens and
// closes on (none when the seconds are told another way), and whether
// each firing is a round of several.
interface Voice {
  first: number | undefined;
  hour12: boolean;
  last: number | undefined;
  round: boolean;
  timed: boolean;
}

// What the hours and minutes are, taken together.
type Kind = 'points' | 'hourly' | 'clocked' | 'bare' | 'named';

// How the seconds join them.
interface Seconds {
  // Every time shown is exact to the second.
  exact: boolean;
  // The seconds take the place of 每分钟一次.
  replaced: boolean;
  rounds: boolean;
  // Windows and listed times carry the seconds.
  shown: boolean;
  silent: boolean;
  // The seconds are named after each minute or clock time.
  spelled: boolean;
}

interface Scene extends Seconds {
  H: Level;
  M: Level;
  S: Level;
  kind: Kind;
  // Minute 0 of every hour, with no second said.
  onTheHour: boolean;
  // Every second hour, said by its idiom.
  parity: boolean;
  // One stretch of hours before named minutes.
  ranged: boolean;
}

/** The three sets of the time part, each sorted. */
export interface TimeSets {
  hour: number[];
  minute: number[];
  second: number[];
}

function isWindow(run: Run): boolean {
  return run.length >= WINDOW;
}

// Whether an exception is worth saying of a list of more than eight: its
// holes lie between values that fire, so that no end of a window is
// excepted again, and it names fewer things than the set does as it
// stands, where a run names its two ends at most and a cadence its two.
function isShorter(exception: Exception, kept: number[]): boolean {
  const {removed} = exception;
  const named = linearRuns(kept).reduce(
    (total, run) => total + Math.min(run.length, 2), 0);
  const ends = 2 * Number(exception.base.kind === 'cadence');

  return kept.length > LISTED && removed[0] > kept[0] &&
    lastOf(removed) < lastOf(kept) && ends + removed.length < named;
}

// An exception among minutes or seconds, or among hours at one minute:
// from every value or from a cadence, never from a mere range.
function stretchException(exception: Exception, kept: number[]): boolean {
  return exception.base.kind !== 'range' && isShorter(exception, kept);
}

// An exception among whole hours: from every hour, or from every second
// hour where those have their idiom.
function hourException(exception: Exception, kept: number[]): boolean {
  return isShorter(exception, kept) && (exception.base.kind === 'all' ||
    everySecond(denote(exception.base, domainOf('hour'))));
}

// How many things a shape names: each window and each stray value is one.
function thingsIn(shape: Shape): number {
  return shape.windows.length + shape.strays.length;
}

// A set as the runs and cadences the core finds in it together, each a
// window with its own step; or, where the core finds none, as nothing
// that could be said.
function stretchesOf(values: number[], domain: Domain): Shape {
  const parts = describeCadencePieces(values, domain)?.parts ?? [];
  const stretches = parts.filter((part) => part.kind !== 'values');
  const steps = stretches.map(
    (part) => (part as {interval?: number}).interval ?? 1);

  return {
    step: new Set(steps).size === 1 ? steps[0] : 0,
    steps,
    strays: parts.length > 0 ?
      values.filter((value) => !stretches.some(
        (part) => denote(part, domain).includes(value))) :
      values,
    windows: stretches.map((part) => denote(part, domain))
  };
}

// The arrangement a set is said in. A cadence of more than can be listed,
// or one that tiles where that counts, is one window. Otherwise the runs
// long enough are windows and the rest strays, unless the set is more
// than can be listed and its stretches, each with its own step, name
// fewer things.
function shapeOf(base: number[], runs: Run[], pace: Pace): Shape {
  const {cadence} = pace;
  const windows = pace.stepped ? [base] : runs.filter(isWindow);
  const step = cadence?.interval ?? 1;
  const plain: Shape = {
    step,
    steps: windows.map(() => step),
    strays: base.filter((value) => !windows.some(
      (run) => run.includes(value))),
    windows
  };
  const pieced = pace.stepped || !pace.whole ?
    plain :
    stretchesOf(base, pace.domain);

  return base.length > LISTED && thingsIn(pieced) < thingsIn(plain) ?
    pieced :
    plain;
}

// Whether an exception names fewer things than the set would as
// stretches that each have their own step, where it is such stretches: a
// stretch names its two ends, as a cadence does.
function beatsStretches(exception: Exception, kept: number[], domain: Domain):
  boolean {
  const {strays, windows} = stretchesOf(kept, domain);
  const ends = 2 * Number(exception.base.kind === 'cadence');

  return windows.length === 0 ||
    ends + exception.removed.length < 2 * windows.length + strays.length;
}

function levelOf(values: number[], field: Field, traits: Traits): Level {
  const domain = domainOf(field);
  const picked = chosen(values, domain, function allowed(exception, kept) {
    return traits.allowed(exception, kept) &&
      beatsStretches(exception, kept, domain);
  });
  const base = picked.values;
  const cadence = cadenceOf(base, domain);
  const every = base.length > domain.max - domain.min;
  const flows = every || cadence?.start === domain.min &&
    cadence.last + cadence.interval === domain.max + 1;
  const runs = runsOf(base, domain, traits.wraps === true);
  const stepped = typeof cadence !== 'undefined' &&
    (base.length > LISTED || flows && traits.tiled === true);

  return {
    base,
    cadence,
    every,
    flows,
    removed: picked.removed,
    runs,
    shape: shapeOf(base, runs,
      {cadence, domain, stepped, whole: picked.removed.length === 0}),
    values
  };
}

// Whether the minutes are one unbroken run, said minute by minute.
function isSteady(shape: Shape): boolean {
  return shape.windows.length === 1 && shape.strays.length === 0 &&
    shape.step === 1;
}

// Second 0 alone is not said.
function isSilent(S: Level): boolean {
  return S.values.join() === '0';
}

// One second that is said, which a window or a clock time carries.
function isLone(S: Level): boolean {
  return S.values.length === 1 && !isSilent(S);
}

// The first row that applies. Exact times that can be counted are points.
// One minute under restricted hours is a rhythm of hours. Minutes that
// flow, or any minutes inside one hour, or one run under separate hours,
// are windows of clock times. Under every hour or every second hour a
// flowing minute is its rhythm alone, unless a single second has to be
// carried by a window of minutes. Anything else names its minutes after
// its hours.
function kindOf(levels: Level[], parity: boolean): Kind {
  const [H, M, S] = levels;
  const plain = H.every || parity;
  const carried = M.every || !isLone(S);
  const lone = H.runs.every((run) => run.length === 1);
  const counted = H.values.length * M.values.length <= LISTED &&
    H.shape.windows.length === 0 && !M.runs.some(isWindow);

  return first<Kind>([
    [counted, 'points'],
    [M.values.length === 1 && !H.every, 'hourly'],
    [!plain && (M.flows ||
      lone && (H.values.length === 1 || isSteady(M.shape))), 'clocked'],
    [plain && M.flows && carried, 'bare'],
    [true, 'named']
  ]);
}

// Whether the minutes end in 每分钟一次, which seconds that flow replace.
function endsEveryMinute(M: Level): boolean {
  return M.shape.windows.length > 0 && M.shape.strays.length === 0 &&
    M.shape.step === 1;
}

// How many things the seconds are said as: each window and each stray
// second is one.
function partsOf(S: Level): number {
  return S.shape.windows.length + S.shape.strays.length;
}

// Whether so many clock times or minutes can each carry the seconds: one
// always can, and several while that names no more than can be listed.
function carries(anchors: number, S: Level): boolean {
  return anchors === 1 || anchors * partsOf(S) <= LISTED;
}

// Whether the minutes are a plain list after their hours, whose seconds
// join each minute: always for one minute, and for several when the
// seconds are a list too and every pairing can be counted.
function isMinuteList(kind: Kind, M: Level, S: Level): boolean {
  const {length} = M.values;

  return kind === 'named' && M.shape.windows.length === 0 &&
    (length === 1 || S.shape.windows.length === 0 && carries(length, S));
}

// Whether the seconds are named after each clock time, each listed
// minute, or (where they are said and do not flow) every minute.
function isSpelled(kind: Kind, levels: Level[]): boolean {
  const [H, M, S] = levels;
  const everyMinute = kind === 'bare' && M.every && !isSilent(S) &&
    !(S.flows && endsEveryMinute(M));

  return kind === 'points' && carries(M.values.length * H.values.length, S) ||
    isMinuteList(kind, M, S) || everyMinute;
}

function secondsOf(kind: Kind, levels: Level[]): Seconds {
  const [, M, S] = levels;
  const silent = isSilent(S);
  const replaced = S.flows && endsEveryMinute(M);
  const spelled = isSpelled(kind, levels);
  const shown = replaced || isLone(S) && kind !== 'bare';

  return {
    exact: shown || spelled && !silent,
    replaced,
    rounds: !(silent || spelled || shown),
    shown,
    silent,
    spelled
  };
}

function sceneOf(sets: TimeSets, wraps: boolean): Scene {
  const single = sets.minute.length === 1;
  const M = levelOf(sets.minute, 'minute',
    {allowed: stretchException, tiled: true});
  const H = levelOf(sets.hour, 'hour',
    {allowed: single ? stretchException : hourException, wraps});
  const S = levelOf(sets.second, 'second', {allowed: stretchException});
  const parity = everySecond(H.base);
  const kind = kindOf([H, M, S], parity);

  return {
    ...secondsOf(kind, [H, M, S]),
    H,
    M,
    S,
    kind,
    onTheHour: H.every && sets.minute.join() === '0' && isSilent(S),
    parity,
    ranged: kind === 'named' && !H.every && !parity && H.runs.length === 1
  };
}

function voiceOf(scene: Scene, seconds: boolean, style: ChineseStyle): Voice {
  const carried = scene.S.values.filter(() => seconds);

  return {
    first: carried[0],
    hour12: style.hour12,
    last: lastOf(carried),
    round: scene.rounds,
    timed: !scene.silent
  };
}

// An hour's number, after its part of the day on the 12-hour clock, where
// 0 and 12 keep their number and 13 to 23 count again from 1.
function hourOf(hour: number, voice: Voice): string {
  const part = lexicon.dayParts.filter((entry) => entry.from <= hour)
    .slice(-1)[0];

  return voice.hour12 ?
    part.word + String(hour % 12 || hour) :
    String(hour);
}

// A moment as it is written. A moment that names no second takes the one
// its window opens on, or closes on.
function say(moment: Moment, voice: Voice, closing = false): string {
  const second = moment.s ?? [voice.first, voice.last][Number(closing)];
  const parts: Array<[number | undefined, string]> = [
    [moment.m, units.minuteOfHour],
    [second, units.second]
  ];
  const told = parts.slice(0, 1 + Number(voice.timed)).filter(
    (part) => typeof part[0] !== 'undefined') as Array<[number, string]>;

  if (typeof moment.h === 'undefined') {
    return told.map((part) => String(part[0]) + part[1]).join('');
  }

  return hourOf(moment.h, voice) + told.map(
    (part) => marks.colon + lexicon.twoDigits(part[0])).join('');
}

// The two ends of a stretch. An end on an earlier hour than the start is
// on the next day.
function endsOf(span: Span, voice: Voice): [string, string] {
  const [from, to] = span;

  return [
    say(from, voice),
    when((to.h ?? 0) < (from.h ?? 0), words.nextDay) + say(to, voice, true)
  ];
}

function between(span: Span, voice: Voice): string {
  return endsOf(span, voice).join(words.to);
}

// A moment that is excepted: where windows run to the second, the whole
// of it from its first second to its last.
function point(moment: Moment, voice: Voice): string {
  return voice.first === voice.last ?
    say(moment, voice) :
    between([moment, moment], voice);
}

// Every anchor with every window and every stray value of a set, the
// value written into the named part of the moment.
function cross(anchors: Span[], shape: Shape, part: keyof Moment): Grid {
  return {
    paced: shape.windows.length > 0,
    steps: anchors.flatMap(() => shape.steps),
    strays: anchors.flatMap((anchor) => shape.strays.map(
      (value) => ({...anchor[0], [part]: value}))),
    windows: anchors.flatMap((anchor) => shape.windows.map(
      (run): Span => [
        {...anchor[0], [part]: run[0]},
        {...anchor[1], [part]: lastOf(run)}
      ]))
  };
}

function rhythm(beat: Beat, voice: Voice): string {
  return words.every + when(beat.step > 1, String(beat.step)) + beat.unit +
    [words.once, words.oneRound][Number(voice.round)];
}

// Windows, then their rhythm, then the stray moments after 以及; or the
// moments alone as a list. Windows whose steps differ are each followed
// directly by their own rhythm, and parted by commas. Under rounds a
// list ends in 各一轮, and a single moment in 一轮.
function phrase(grid: Grid, beat: Beat, voice: Voice): string {
  const strays = series(grid.strays.map((moment) => say(moment, voice)));
  const each = [words.oneRound, words.eachOneRound][
    Number(grid.strays.length > 1)];
  const mixed = new Set(grid.steps).size > 1;
  const windows = grid.windows.map((span, at) => between(span, voice) +
    when(mixed, rhythm({...beat, step: grid.steps[at]}, voice)));

  return [
    windows.join(mixed ? marks.comma : marks.list),
    when(grid.paced && !mixed, rhythm(beat, voice)),
    when(strays !== '', when(grid.paced, words.alsoPoints) + strays +
      when(voice.round, each))
  ].filter(Boolean).join(marks.comma);
}

// Every second hour by its idiom, with the hours of it that fire.
function glossOf(hours: number[], voice: Voice): string {
  const shown = hours.slice(0, 3).map(
    (hour) => hourOf(hour, voice) + units.hourNamed);

  return [words.evenHours, words.oddHours][hours[0] % 2] + marks.open +
    series(shown) + marks.ellipsis + hourOf(lastOf(hours), voice) +
    units.hourNamed + marks.close;
}

// What stands before the body: the hours, where they are not clock times
// inside it.
function leadOf(scene: Scene, voice: Voice): string {
  const {H, M} = scene;
  const gloss = glossOf(H.values, voice);
  const names = series(listed(H.runs, 2,
    (hour) => hourOf(hour, voice) + units.hourNamed, words.nextDay));
  const firings = series(H.runs.map((run) => between([
    {h: run[0], m: M.values[0]},
    {h: lastOf(run), m: lastOf(M.values)}
  ], voice)));

  return first([
    [scene.kind === 'bare',
      when(scene.parity, gloss + words.inside + marks.comma) +
      when(scene.spelled, words.eachMinuteOf)],
    [scene.kind !== 'named', ''],
    [scene.onTheHour, words.everyHourOnTheHour],
    [H.every, words.eachHourOf],
    [scene.parity, gloss + words.of],
    [scene.ranged, names + marks.comma + words.eachHourOf],
    [H.runs.every((run) => run.length === 1), names + words.of],
    [true, firings + marks.comma + words.eachHourOf]
  ]);
}

// The seconds named after each clock time, each minute of the hour, or
// every minute.
function spelledBody(scene: Scene, voice: Voice): string {
  const {H, M, S} = scene;
  const anchors = first<Span[]>([
    [scene.kind === 'points', H.values.flatMap((h) => M.values.map(
      (m): Span => [{h, m}, {h, m}]))],
    [scene.kind === 'bare' || scene.onTheHour, [[{}, {}]]],
    [true, M.base.map((m): Span => [{m}, {m}])]
  ]);

  return phrase(cross(anchors, S.shape, 's'),
    {step: S.shape.step, unit: units.second}, voice);
}

// A rhythm of hours at one minute, or of minutes: in windows of clock
// times, after the hours, or alone. Clock times too many to carry their
// seconds are each a moment, with no rhythm.
function pacedBody(scene: Scene, voice: Voice): string {
  const {H, M, S} = scene;
  const [m] = M.values;
  const anchors: Record<Kind, Span[]> = {
    bare: [],
    clocked: H.runs.map((run): Span => [{h: run[0]}, {h: lastOf(run)}]),
    hourly: [[{m}, {m}]],
    named: [[{}, {}]],
    points: H.values.map((h): Span => [{h}, {h}])
  };
  const minutes: Shape = scene.kind === 'points' ?
    {step: 1, steps: [], strays: M.values, windows: []} :
    M.shape;
  const beat = scene.replaced ?
    {step: S.shape.step, unit: units.second} :
    {step: M.shape.step, unit: units.minute};

  return scene.kind === 'hourly' ?
    phrase(cross(anchors.hourly, H.shape, 'h'),
      {step: H.shape.step, unit: units.hour}, voice) :
    phrase(cross(anchors[scene.kind], minutes, 'm'), beat, voice);
}

// What each round holds: how many firings, and either their rhythm from
// the whole minute or the seconds themselves.
function roundOf(seconds: number[]): string {
  const level = levelOf(seconds, 'second', {allowed: never});
  const {shape} = level;
  const [start] = seconds;
  const regular = isSteady({...shape, step: 1}) || start === 0 &&
    (level.runs.length === 1 || typeof level.cadence !== 'undefined');
  const pace = shape.step > 1 ?
    words.interval + String(shape.step) + units.second :
    words.everySecondOnce;
  const told = regular ?
    [
      when(start > 0, words.firstAt + words.inItsMinute + String(start) +
        units.second),
      pace
    ].filter(Boolean).join(marks.comma) :
    words.at + words.inItsMinute + series(listed(level.runs, WINDOW,
      (second) => String(second) + units.second));

  return marks.comma + words.eachRound + String(seconds.length) +
    words.times + marks.comma + told;
}

// What the seconds add after the body, where they are neither silent nor
// written into it. A round is that of the set the seconds are said as,
// and what is excepted from it closes the time.
function suffixOf(scene: Scene): string {
  return when(scene.rounds, roundOf(scene.S.base));
}

// What is excepted, closing the time: the hours, then the minutes, then
// the seconds. Excepted minutes and seconds are clock times where those
// can be counted, and positions otherwise. A whole hour is written as
// the windows of the sentence are. An excepted clock time or minute is
// written in the `whole` voice: where several seconds fire in a minute,
// it is the stretch from the first of them to the last.
function exceptionsOf(scene: Scene, windowed: Voice, voice: Voice): string {
  const {H, M, S} = scene;
  const [minute] = M.values;
  const hours = M.values.length === 1 ?
    H.removed.map((h) => point({h, m: minute}, voice)) :
    linearRuns(H.removed).map((run) => between(
      [{h: run[0], m: 0}, {h: lastOf(run), m: 59}], windowed));
  const minutes = H.values.length * M.removed.length <= LISTED ?
    series(H.values.flatMap((h) => M.removed.map(
      (m) => point({h, m}, voice)))) :
    words.eachHourOf + series(M.removed.map((m) => point({m}, voice)));
  const dropped = S.removed;
  const times = H.values.length * M.values.length;
  const seconds = times * dropped.length <= LISTED ?
    series(H.values.flatMap((h) => M.values.flatMap((m) => dropped.map(
      (s) => say({h, m, s}, voice))))) :
    words.eachMinuteOf + series(dropped.map((s) => say({s}, voice)));
  const said = [
    series(hours),
    when(M.removed.length > 0, minutes),
    when(dropped.length > 0, seconds)
  ].filter(Boolean).join(words.andExceptions);

  return when(said !== '', marks.open + said + words.excepted + marks.close);
}

// The first and last firing of named minutes over one stretch of hours,
// which the hour names alone leave open.
function bracketOf(scene: Scene, voice: Voice): string {
  const {H, M} = scene;
  const firing = [words.times, units.round][Number(scene.rounds)];
  const ends = endsOf([
    {h: H.runs[0][0], m: M.values[0]},
    {h: lastOf(H.runs[0]), m: lastOf(M.values)}
  ], voice);

  return when(scene.ranged, marks.open + words.first + firing + ends[0] +
    marks.comma + words.last + firing + ends[1] + marks.close);
}

/**
 * The time part, and whether it runs round the clock (every hour, with or
 * without exceptions), which decides what joins it to the day.
 */
function timeOf(sets: TimeSets, wraps: boolean, style: ChineseStyle):
  {allDay: boolean; text: string} {
  const scene = sceneOf(sets, wraps);
  const voice = voiceOf(scene, scene.shown, style);
  const exact = voiceOf(scene, scene.exact, style);
  const body = scene.spelled ?
    spelledBody(scene, voice) :
    pacedBody(scene, voice);

  return {
    allDay: scene.H.every,
    text: leadOf(scene, exact) + body + suffixOf(scene) +
      exceptionsOf(scene, voice, voiceOf(scene, !scene.silent, style)) +
      bracketOf(scene, exact)
  };
}

export {timeOf};
