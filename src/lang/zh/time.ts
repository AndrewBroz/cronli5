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

// How many clock times a reader takes in at a glance. A cadence of hours
// off the start of the day with more than this is said from its first
// time, and a rhythm with a beat or two missing is said as that while
// more than this still fire.
const GLANCED = 4;

// How many separate hours are each a window of clock times; more are
// named once, before their minutes.
const WINDOWED = 2;

// How many beats may be missing from a rhythm said with an exception.
const MISSED = 2;

// How many things clock times or minutes each with their seconds may
// name. A window to the second counts two, for the two times it names.
const MULTIPLIED = 6;

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
// and whether it has a rhythm. `of` is what the strays say again of the
// hours before them.
interface Grid {
  of: string;
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
  // Any cadence of three or more values is one window.
  paced?: boolean;
  // A tiling cadence may have a beat or two excepted from it.
  beats?: boolean;
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
  // The even or the odd hours, every one of them in the day.
  filled: boolean;
  kind: Kind;
  // Every minute of separate hours too many to be a window each.
  hoursWhole: boolean;
  // The hours are a cadence that tiles the day from 0:00 and hold only
  // moments: the step stands where 每小时 would.
  rhythm: boolean;
  // Minute 0 of every hour, or of the even or odd hours, with no second
  // said.
  onTheHour: boolean;
  // The day part says every day.
  daily: boolean;
  // Every second hour, said by its idiom.
  parity: boolean;
}

/**
 * What stands around the time part: whether the day part says every day,
 * and whether a run of hours may cross midnight.
 */
export interface Around {
  daily: boolean;
  wraps: boolean;
}

/** The three sets of the time part, each sorted. */
export interface TimeSets {
  hour: number[];
  minute: number[];
  second: number[];
}

// The hours and the minutes under them, and how the hours are said.
interface Hours {
  H: Level;
  M: Level;
  // Separate hours, too many to be a window each.
  crowded: boolean;
  filled: boolean;
  parity: boolean;
  rhythm: boolean;
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

// Whether a set is a cadence that tiles its field from the first value,
// with one or two beats missing between values that fire and more left
// than a reader takes in at a glance.
function missesBeats(exception: Exception, kept: number[], domain: Domain):
  boolean {
  const {base, removed} = exception;

  return base.kind === 'cadence' && base.start === domain.min &&
    base.last + base.interval === domain.max + 1 &&
    removed.length <= MISSED && kept.length > GLANCED &&
    removed[0] > kept[0] && lastOf(removed) < lastOf(kept);
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
// stretches that each have their own step, where it is such stretches
// (two or more: one cadence with strays is no such set): a stretch names
// its two ends, as a cadence does.
function beatsStretches(exception: Exception, kept: number[], domain: Domain):
  boolean {
  const {strays, windows} = stretchesOf(kept, domain);
  const ends = 2 * Number(exception.base.kind === 'cadence');

  return windows.length < 2 ||
    ends + exception.removed.length < 2 * windows.length + strays.length;
}

function levelOf(values: number[], field: Field, traits: Traits): Level {
  const domain = domainOf(field);
  const picked = chosen(values, domain, function allowed(exception, kept) {
    return traits.beats === true && missesBeats(exception, kept, domain) ||
      traits.allowed(exception, kept) &&
      beatsStretches(exception, kept, domain);
  });
  const base = picked.values;
  const cadence = cadenceOf(base, domain);
  const every = base.length > domain.max - domain.min;
  const flows = every || cadence?.start === domain.min &&
    cadence.last + cadence.interval === domain.max + 1;
  const runs = runsOf(base, domain, traits.wraps === true);
  const stepped = typeof cadence !== 'undefined' &&
    (base.length > LISTED || flows && traits.tiled === true ||
      traits.paced === true && base.length > 2);

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

// Whether the hours are separate and too many to be a window each.
function isCrowded(hours: Run[]): boolean {
  return hours.every((run) => run.length === 1) &&
    hours.length > WINDOWED;
}

// Whether the minutes are one window, minute by minute or with stray
// minutes beside it.
function isOneWindow(shape: Shape): boolean {
  return shape.windows.length === 1 &&
    (shape.step === 1 || shape.strays.length > 0);
}

// Whether restricted hours are each a window of clock times: under
// minutes that flow, any minutes inside one hour, or one window (with or
// without strays) under separate hours. Hours too many to be a window
// each are named instead, where the minutes after them are every minute
// or few enough to list;
// a run or a longer cadence after named hours reads as one stretch, so
// those stay windows however many.
function isClocked(H: Level, M: Level): boolean {
  const lone = H.runs.every((run) => run.length === 1);
  const named = isCrowded(H.runs) && M.flows &&
    (M.every || M.values.length <= LISTED);

  return !named && (M.flows ||
    lone && (H.values.length === 1 || isOneWindow(M.shape)));
}

// Whether a cadence starts again on the next day where it started on
// this one: its first value lies within one step of the field's start
// and its last within one step of the field's end.
function tilesFromStart(cadence: Cadence | undefined, domain: Domain):
  boolean {
  return typeof cadence !== 'undefined' &&
    cadence.start - domain.min < cadence.interval &&
    cadence.last + cadence.interval === domain.max + 1 + cadence.start;
}

// Whether hours at one minute are a cadence that starts again each day
// where it started, with nothing excepted, more than a reader takes in at
// a glance. (One that starts at 0:00 is a rhythm, and never comes here.)
function isAnchored(H: Level): boolean {
  return H.removed.length === 0 && H.base.length > GLANCED &&
    tilesFromStart(H.cadence, domainOf('hour'));
}

// Whether the clock times can be counted: eight or fewer, with no run of
// five hours or minutes, and either one minute or no more hours than are
// each a window (more hours with several minutes are named once).
function isCounted(H: Level, M: Level): boolean {
  const few = H.values.length <= WINDOWED || M.values.length === 1;

  return H.values.length * M.values.length <= LISTED && few &&
    H.shape.windows.length === 0 && !M.runs.some(isWindow);
}

// The first row that applies. A rhythm of hours (a cadence that tiles the
// day from 0:00, over minutes that are moments) names its minutes after
// its step. A cadence of hours off 0:00 too long to take in at a glance is
// paced by the hour. Exact times that can be counted are points.
// One minute under restricted hours is paced by the hour, unless they are
// all the odd hours. Then windows of clock times, where
// the hours are clocked. Under every hour or the even or odd hours a
// flowing minute is its rhythm alone, unless a single second has to be
// carried by a window of minutes. Anything else names its minutes after
// its hours.
function kindOf(levels: Level[], hours: Hours): Kind {
  const [H, M, S] = levels;
  const {filled, parity} = hours;
  const plain = H.every || parity;
  const carried = M.every || !isLone(S);
  const counted = isCounted(H, M);

  return first<Kind>([
    [hours.rhythm, 'named'],
    [M.values.length === 1 && !filled && isAnchored(H), 'hourly'],
    [counted, 'points'],
    [M.values.length === 1 && !H.every && !filled, 'hourly'],
    [!plain && isClocked(H, M), 'clocked'],
    [plain && M.flows && carried, 'bare'],
    [true, 'named']
  ]);
}

// Whether the minutes end in 每分钟一次, which seconds that flow replace.
function endsEveryMinute(M: Level): boolean {
  return M.shape.windows.length > 0 && M.shape.strays.length === 0 &&
    M.shape.step === 1;
}

// How many things the seconds are said as: each window two, for its two
// ends, and each stray second one.
function partsOf(S: Level): number {
  return 2 * S.shape.windows.length + S.shape.strays.length;
}

// Whether so many clock times or minutes can each carry the seconds: one
// always can, and several while that multiplies to no more than six.
function carries(anchors: number, S: Level): boolean {
  return anchors === 1 || anchors * partsOf(S) <= MULTIPLIED;
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

// Under every minute of hours named one by one, the seconds are said as
// positions in each minute, or as every second.
function secondsOf(kind: Kind, levels: Level[], whole: boolean): Seconds {
  const [, M, S] = levels;
  const silent = isSilent(S);
  const replaced = whole ? S.every : S.flows && endsEveryMinute(M);
  const spelled = whole ?
    !silent && !S.every :
    isSpelled(kind, levels);
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

// The hours, the minutes under them, and how the hours are said: every
// hour; a rhythm, where they are a cadence that tiles the day from 0:00
// and the minutes are moments, not stretches; the even or odd hours (all
// of them in the day, or those between two ends); or one by one where
// they are too many to be a window each. `beats` is whether a tiling
// cadence of hours may have a beat or two excepted.
// Under hours named one by one, and under a rhythm of hours longer than
// two, a cadence of minutes is its minutes, as any other minutes there
// are, unless it is more than can be listed. Elsewhere a cadence of
// minutes may have a beat or two excepted, unless the clock times can be
// counted.
function hoursOf(sets: TimeSets, wraps: boolean, beats: boolean): Hours {
  const H = levelOf(sets.hour, 'hour', {
    allowed: [hourException, stretchException][
      Number(sets.minute.length === 1)],
    beats,
    wraps
  });
  const stepped = H.flows && !H.every;
  const even = everySecond(H.base);
  const crowded = !H.every && !even && isCrowded(H.runs);
  const tiled = !(crowded || stepped && !even);
  const counted = H.values.length * sets.minute.length <= LISTED;
  const M = levelOf(sets.minute, 'minute',
    {allowed: stretchException, beats: tiled && !counted, tiled});
  const rhythm = stepped && M.shape.windows.length === 0;
  const parity = even && !rhythm;

  return {
    H,
    M,
    crowded,
    filled: parity && 2 * H.base.length > domainOf('hour').max,
    parity,
    rhythm
  };
}

// A beat or two missing from a cadence of hours is an exception only
// where the hours are then a rhythm; otherwise the hours are as they
// stand. Seconds that step evenly at one clock time, or at one minute of
// every hour, of a rhythm of hours or of the even or odd hours, are a
// window with their step; at one clock time the step may have a beat or
// two excepted.
function sceneOf(sets: TimeSets, around: Around): Scene {
  const single = sets.minute.length === 1;
  const stepped = hoursOf(sets, around.wraps, true);
  const hours = stepped.rhythm ?
    stepped :
    hoursOf(sets, around.wraps, false);
  const {H, M, crowded, filled, parity, rhythm} = hours;
  const round = H.every || filled || rhythm;
  const paced = single && (round || sets.hour.length === 1);
  const S = levelOf(sets.second, 'second', {
    allowed: stretchException,
    beats: single && sets.hour.length === 1,
    paced
  });
  const kind = kindOf([H, M, S], hours);
  const hoursWhole = crowded && kind === 'named' && M.every;

  return {
    ...secondsOf(kind, [H, M, S], hoursWhole),
    H,
    M,
    S,
    daily: around.daily,
    filled,
    hoursWhole,
    kind,
    onTheHour: round && sets.minute.join() === '0' && isSilent(S),
    parity,
    rhythm
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
    of: '',
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

function rhythmOf(beat: Beat, voice: Voice): string {
  return words.every + when(beat.step > 1, String(beat.step)) + beat.unit +
    [words.once, words.oneRound][Number(voice.round)];
}

// Windows, then their rhythm, then the stray moments after 以及; or the
// moments alone as a list. Windows whose steps differ are each followed
// directly by their own rhythm, and parted by commas. Under rounds a
// list ends in 各一轮, and a single moment in 一轮.
function phrase(grid: Grid, beat: Beat, voice: Voice): string {
  const strays = when(grid.strays.length > 0, grid.of) +
    series(grid.strays.map((moment) => say(moment, voice)));
  const each = [words.oneRound, words.eachOneRound][
    Number(grid.strays.length > 1)];
  const mixed = new Set(grid.steps).size > 1;
  const windows = grid.windows.map((span, at) => between(span, voice) +
    when(mixed, rhythmOf({...beat, step: grid.steps[at]}, voice)));

  return [
    windows.join(mixed ? marks.comma : marks.list),
    when(grid.paced && !mixed, rhythmOf(beat, voice)),
    when(strays !== '', when(grid.paced, words.alsoPoints) + strays +
      when(voice.round, each))
  ].filter(Boolean).join(marks.comma);
}

// An hour named whole, as the start or the end of a stretch of hours.
function hourNamed(hour: number, voice: Voice): string {
  return hourOf(hour, voice) + units.hourNamed;
}

// The even or the odd hours, by the first of them.
function parityOf(hours: number[]): string {
  return [words.evenHours, words.oddHours][hours[0] % 2];
}

// The stretch from the first firing in a run of hours to the last.
function firings(run: Run, M: Level, voice: Voice): string {
  return between([
    {h: run[0], m: M.values[0]},
    {h: lastOf(run), m: lastOf(M.values)}
  ], voice);
}

// The even or odd hours, after their first and last firing and a comma
// where they do not fill the day.
function stretchOf(scene: Scene, voice: Voice): string {
  const {H, M} = scene;

  return when(!scene.filled, firings(H.base, M, voice) + marks.comma) +
    parityOf(H.base);
}

// A rhythm of hours, in the place of 每小时.
function stepOf(H: Level): string {
  return words.every + String(H.cadence?.interval) + units.hour;
}

// The hours by name, a stretch of them by its two ends.
function namesOf(H: Level, voice: Voice): string {
  return series(listed(H.runs, 2,
    (hour) => hourNamed(hour, voice), words.nextDay));
}

// What stands before the body: the hours, where they are not clock times
// inside it.
function leadOf(scene: Scene, voice: Voice): string {
  const {H, M} = scene;
  const stretch = stretchOf(scene, voice);
  const names = namesOf(H, voice);
  const stretches = series(H.runs.map((run) => firings(run, M, voice)));

  return first([
    [scene.kind === 'bare',
      when(scene.parity, stretch + words.inside + marks.comma) +
      when(scene.spelled, words.eachMinuteOf)],
    [scene.kind !== 'named', ''],
    [scene.onTheHour && scene.rhythm, stepOf(H) + words.once],
    [scene.rhythm, stepOf(H) + words.of],
    [scene.onTheHour && scene.parity, words.oddOnTheHour],
    [scene.onTheHour, words.everyHourOnTheHour],
    [H.every, words.eachHourOf],
    [scene.parity, stretch + words.of],
    [scene.hoursWhole, names + words.of + when(scene.spelled,
      words.eachMinuteOfThem + words.of)],
    [H.runs.every((run) => run.length === 1), names + words.of],
    [true, stretches + marks.comma + words.eachHourOf]
  ]);
}

// The seconds named after each clock time, each minute of the hour, or
// every minute.
function spelledBody(scene: Scene, voice: Voice): string {
  const {H, M, S} = scene;
  const anchors = first<Span[]>([
    [scene.kind === 'points', H.values.flatMap((h) => M.values.map(
      (m): Span => [{h, m}, {h, m}]))],
    [scene.kind === 'bare' || scene.onTheHour || scene.hoursWhole,
      [[{}, {}]]],
    [true, M.base.map((m): Span => [{m}, {m}])]
  ]);

  return phrase(cross(anchors, S.shape, 's'),
    {step: S.shape.step, unit: units.second}, voice);
}

// What stray minutes after a rhythm say again of the hours, so that none
// is left without its hour after 以及. After the even or odd hours, the
// idiom again, which the ends before it still bound; after hours named one
// by one, the hours again; after a window or windows of hours, 其中每小时
// 的. After windows of clock times the strays are clock times, unless
// those would name more than the hours and the minutes do together, when
// the hours are named. Under every hour, nothing.
function hoursAgain(scene: Scene, voice: Voice): string {
  const {H, M} = scene;
  const lone = H.runs.every((run) => run.length === 1);
  const {length} = M.shape.strays;
  const crossed = H.values.length * length > H.values.length + length;
  const named = scene.kind === 'named' && !H.every && !scene.rhythm;

  return first([
    [scene.kind === 'clocked' && crossed, namesOf(H, voice) + words.of],
    [scene.kind === 'named' && scene.parity, parityOf(H.base) + words.of],
    [named && lone, namesOf(H, voice) + words.of],
    [named, words.within + words.eachHourOf],
    [true, '']
  ]);
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

  const grid = cross(anchors[scene.kind], minutes, 'm');
  const again = hoursAgain(scene, voice);
  const said = again === '' || !grid.paced ?
    grid :
    {...grid, of: again, strays: minutes.strays.map((value) => ({m: value}))};

  const {step} = H.shape;
  // A cadence of hours too long to take in at a glance: from its first
  // time under every day, else between its two ends.
  const anchored = scene.kind === 'hourly' && isAnchored(H);
  const hours: Shape = anchored ?
    {step, steps: [step], strays: [], windows: [H.base]} :
    H.shape;
  const hourly = {step: hours.step, unit: units.hour};

  return first([
    [anchored && scene.daily,
      () => say({h: H.base[0], m}, voice) + words.onwards +
        rhythmOf(hourly, voice)],
    [scene.kind === 'hourly',
      () => phrase(cross(anchors.hourly, hours, 'h'), hourly, voice)],
    [true, () => phrase(said, beat, voice)]
  ])();
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

// What is excepted, in the bracket that closes the time: the hours, then
// the minutes, then the seconds. Excepted minutes and seconds are clock
// times where those can be counted, and positions otherwise. A whole hour
// is written as
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

  return when(said !== '', said + words.excepted);
}

// The bracket that closes the time: what is excepted.
function bracketOf(said: string): string {
  return when(said !== '', marks.open + said + marks.close);
}

/**
 * The time part, and whether it runs round the clock (every hour, or a
 * rhythm of hours, with or without exceptions), which decides what joins
 * it to the day.
 */
function timeOf(sets: TimeSets, around: Around, style: ChineseStyle):
  {allDay: boolean; text: string} {
  const scene = sceneOf(sets, around);
  const voice = voiceOf(scene, scene.shown, style);
  const exact = voiceOf(scene, scene.exact, style);
  const whole = [words.eachMinuteOfThem, words.eachSecondOfThem][
    Number(scene.replaced)];
  const body = first([
    [scene.spelled, () => spelledBody(scene, voice)],
    [scene.hoursWhole, () => whole],
    [true, () => pacedBody(scene, voice)]
  ])();

  return {
    allDay: scene.H.every || scene.rhythm,
    text: leadOf(scene, exact) + body + suffixOf(scene) + bracketOf(
      exceptionsOf(scene, voice, voiceOf(scene, !scene.silent, style)))
  };
}

export {timeOf};
