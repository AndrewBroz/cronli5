// The time part of the sentence: hours, minutes and seconds said as one
// thing (answers 4.1 and 4.2). Six clock times or fewer are listed; past
// that the hours are stretches, or every hour, or every second hour, or
// are named, and what they hold follows.

import {
  type CadenceForm, type ExceptForm, type Form, type Reading, type Sayers,
  type Span, coreOf, formOf, removedOf, runsIn, sayBy, spansOf
} from './forms.js';
import {type Held, held, named, nothingCarried, told} from './hold.js';
import {
  type Place, type Said, type Seconds, gaps, hourLevel, hourReading, minuteHow,
  minuteLevel, sayableStep, secondsOf, stretched
} from './stretches.js';
import {
  clock, clockThenWord, excepting, hoursNamed, list, rate, stretch
} from './write.js';
import type {SetDescription} from '../../core/schedule.js';
import type {ZhHantStyle} from './options.js';
import {domainOf} from '../../core/index.js';
import lexicon from './lexicon.js';

const {words} = lexicon;

/** The candidates of the three fields of the clock. */
export interface ClockSets {
  hour: SetDescription[];
  minute: SetDescription[];
  second: SetDescription[];
}

// The fields of the clock as the forms chosen for them.
interface Clockwork {
  hourSets: SetDescription[];
  hours: Form;
  minutes: Form;
  sec: Seconds;
  style: ZhHantStyle;
}

// How the hours stand before what they hold.
type Anchor =
  | {kind: 'all'}
  | {kind: 'allBut'; removed: number[]}
  | {kind: 'everyOther'; removed: number[]; start: number}
  | {kind: 'named'}
  | {kind: 'stretches'; spans: Span[]};

// What the minutes say under an anchor, and whether they are named so
// that seconds can follow them.
interface Placing {
  named: boolean;
  saying: Held;
  work: Clockwork;
}

const withinTheUnit: Reading = {
  domain: domainOf('minute'),
  exceptCadence: true,
  pieces: true,
  run: 3,
  steps: sayableStep
};

// Every second hour, with or without an hour or two missing, read from
// the same candidates.
const everyOtherReading: Reading = {
  ...hourReading,
  steps(cadence: CadenceForm) {
    return cadence.tiles && cadence.interval === 2;
  }
};

const everyHourOf = words.everyHour + words.of;
const inTheWholeHour = words.comma + words.withinWholeHour;

function at(hour: number, work: Clockwork): string {
  return clock({
    hour,
    minute: work.minutes.values[0],
    second: work.sec.first
  }, work.style);
}

// One minute, every hour: on the hour, or the minute's position.
function hourlyAll(form: Form, work: Clockwork): Said {
  const [minute] = work.minutes.values;
  const position = named(minuteHow(work.sec, 'hours').namer, [minute]);

  return {
    anchored: false,
    clock: false,
    text: minute === 0 && !work.sec.shown ?
      words.everyHour + words.onTheHour :
      everyHourOf + position
  };
}

function hourlyList(form: Form, work: Clockwork): Said {
  return {
    anchored: true,
    clock: true,
    text: list(form.values.map(function time(hour) {
      return at(hour, work);
    }))
  };
}

// Hours that tile the day from its first hour, on the hour, are a bare
// rate. Tiling from a later start or off the hour they are the first
// time and the rate; a cadence that does not tile keeps both ends.
function hourlyCadence(form: CadenceForm, work: Clockwork): Said {
  const every = rate('hour', form.interval);
  const [minute] = work.minutes.values;
  const from = at(form.start, work);

  if (form.tiles && form.fromFirst && minute === 0 && !work.sec.shown) {
    return {anchored: false, clock: false, text: every, whole: true};
  }

  return {
    anchored: true,
    clock: true,
    text: form.tiles ?
      clockThenWord(from, words.onward + every) :
      stretch(from, at(form.last, work), work.style) + words.comma + every,
    whole: true
  };
}

function hourlyRuns(form: Form, work: Clockwork): Said {
  return stretched(spansOf(form), work.minutes,
    hourLevel(work.sec, work.style), work.style);
}

function hourlyExcept(form: ExceptForm, work: Clockwork): Said {
  const base = sayBy(hourly, form.base, work);
  const gone = gaps(form.removed, work.minutes, work.sec, work.style);

  return {...base, text: base.text + excepting(gone)};
}

// One minute and one second: the hours are all there is to say.
const hourly: Sayers<Clockwork, Said> = {
  all: hourlyAll,
  cadence: hourlyCadence,
  except: hourlyExcept,
  list: hourlyList,
  one: hourlyList,
  pieces: hourlyRuns,
  range: hourlyRuns
};

// The forms of minutes that are said with a rate.
const rated = {all: true, cadence: true, range: true};

// The forms of minutes that are not every minute of a stretch: with
// several seconds they are named, and the seconds follow them.
const steps = {cadence: true, list: true, one: true};

function asStretches(form: Form): Anchor {
  return {kind: 'stretches', spans: spansOf(form)};
}

// Hours that are no single run. Where two of them are neighbours they
// are stretches; two or three separate hours are stretches when their
// minutes are said with a rate; otherwise the hours are named.
function separate(form: Form, minutes: Form): Anchor {
  const spans = runsIn(form.values, hourReading);
  const joined = spans.some(function isRun(span) {
    return span.from !== span.to;
  });
  const few = spans.length <= 3 && coreOf(minutes).kind in rated;

  return joined || few ? {kind: 'stretches', spans} : {kind: 'named'};
}

function allBut(form: ExceptForm, minutes: Form): Anchor {
  return form.base.kind === 'all' ?
    {kind: 'allBut', removed: form.removed} :
    separate(form, minutes);
}

function everyHour(): Anchor {
  return {kind: 'all'};
}

const anchorings: Sayers<Form, Anchor> = {
  all: everyHour,
  cadence: separate,
  except: allBut,
  list: separate,
  one: asStretches,
  pieces: asStretches,
  range: asStretches
};

function anchorOf(work: Clockwork): Anchor {
  const alternate = formOf(work.hourSets, everyOtherReading);
  const beat = coreOf(alternate);

  return beat.kind === 'cadence' ?
    {kind: 'everyOther', removed: removedOf(alternate), start: beat.start} :
    sayBy(anchorings, work.hours, work.minutes);
}

function placeAll(anchor: Anchor, placing: Placing): Said {
  return {
    anchored: false,
    clock: false,
    text: told(placing.saying, '', everyHourOf)
  };
}

// Every hour but one or two. Where the sentence is a rate the moments
// that do not fire are left out; where it says what an hour holds, the
// hour is.
function placeAllBut(
  anchor: Extract<Anchor, {kind: 'allBut'}>,
  placing: Placing
): Said {
  const {minutes, sec, style} = placing.work;
  const gone = placing.saying.rate && !placing.named ?
    gaps(anchor.removed, minutes, sec, style) :
    hoursNamed(anchor.removed, style);

  return {
    anchored: false,
    clock: false,
    text: placeAll(anchor, placing).text + excepting(gone)
  };
}

function placeEveryOther(
  anchor: Extract<Anchor, {kind: 'everyOther'}>,
  placing: Placing
): Said {
  const parity = [words.evenHours, words.oddHours][anchor.start];
  const gone = anchor.removed.length > 0 ?
    hoursNamed(anchor.removed, placing.work.style) :
    '';

  return {
    anchored: false,
    clock: false,
    text: words.whenever + parity +
      told(placing.saying, inTheWholeHour, words.of) + excepting(gone)
  };
}

// Hours named one by one. Each 12-hour hour carries its part of the day,
// so what they hold is set off from the last of them.
function placeNamed(anchor: Anchor, placing: Placing): Said {
  const {hours, style} = placing.work;
  const join = style.hour12 ? words.comma + words.eachAt : words.of;

  return {
    anchored: true,
    clock: false,
    text: hoursNamed(hours.values, style) +
      told(placing.saying, inTheWholeHour, join)
  };
}

// Stretches of hours. Where the minutes are named for the seconds that
// follow, the stretches run from the first second to the last and the
// named minutes come after them.
function placeStretches(
  anchor: Extract<Anchor, {kind: 'stretches'}>,
  placing: Placing
): Said {
  const {minutes, sec, style} = placing.work;
  const level = hourLevel(sec, style);

  if (!placing.named) {
    return stretched(anchor.spans, minutes, level, style);
  }

  return {
    anchored: true,
    clock: true,
    text: list(anchor.spans.map(function ends(span) {
      return stretch(
        level.moment(span.from, minutes.values[0], 'first'),
        level.moment(span.to, minutes.values[minutes.values.length - 1],
          'last'),
        style,
        span.from > span.to
      );
    })) + words.comma + placeAll(anchor, placing).text
  };
}

const placings = {
  all: placeAll,
  allBut: placeAllBut,
  everyOther: placeEveryOther,
  named: placeNamed,
  stretches: placeStretches
};

// Where the minutes are said under each anchor.
const placeUnder: Record<Anchor['kind'], Place> = {
  all: 'open',
  allBut: 'open',
  everyOther: 'hours',
  named: 'hours',
  stretches: 'open'
};

// Minutes named so that seconds can follow them: six or fewer by where
// they land in the hour, each followed by what it holds; a rate of more,
// without its "once", followed by what each such minute holds.
function namedMinutes(work: Clockwork, place: Place): Held {
  const {minutes, sec} = work;
  const how = {...minuteHow(sec, place, nothingCarried), once: ''};

  if (minutes.values.length <= 6 || coreOf(minutes).kind !== 'cadence') {
    const text = named(how.namer, minutes.values) + sec.afterNamed;

    return place === 'hours' ?
      {rate: false, text} :
      {rate: true, text: words.whenever + text};
  }

  const loose = held(minutes, how);

  return {...loose, text: loose.text + words.comma + sec.afterThat};
}

function minutely(work: Clockwork): Said {
  const {minutes, sec} = work;
  const anchor = anchorOf(work);
  const place = placeUnder[anchor.kind];
  const usual = held(minutes, minuteHow(sec, place));
  const core = coreOf(minutes);
  // With several seconds, minutes that step are named. With one second
  // shown, so is a bare rate of minutes, which names no moment to carry it.
  const byName = sec.live ?
    core.kind in steps :
    sec.shown && anchor.kind !== 'stretches' && core.kind === 'cadence' &&
      usual.rate;
  const saying = byName ? namedMinutes(work, place) : usual;
  const say = placings[anchor.kind] as
    (anchor: Anchor, placing: Placing) => Said;

  return say(anchor, {named: byName, saying, work});
}

// Every clock time, listed.
function everyMoment(work: Clockwork): Said {
  const {hours, minutes, sec, style} = work;
  const seconds = sec.shown ? sec.form.values : [null];

  return {
    anchored: true,
    clock: true,
    text: list(hours.values.flatMap(function eachHour(hour) {
      return minutes.values.flatMap(function eachMinute(minute) {
        return seconds.map(function eachSecond(second) {
          return clock({hour, minute, second}, style);
        });
      });
    }))
  };
}

// The sentence for any number of moments.
function general(work: Clockwork): Said {
  const {hours, minutes, sec, style} = work;
  const times = hours.values.flatMap(function eachHour(hour) {
    return minutes.values.map(function eachMinute(minute) {
      return {hour, minute, second: null};
    });
  });

  if (!sec.live && minutes.kind === 'one') {
    return sayBy(hourly, hours, work);
  }

  // Three clock times or fewer with several seconds: each is a stretch
  // of its seconds.
  if (sec.live && times.length <= 3) {
    return stretched(times.map(function unit(time, index) {
      return {from: index, to: index};
    }), sec.form, minuteLevel(times, style), style);
  }

  return minutely(work);
}

/**
 * The time part. Six moments or fewer are listed, unless they are a bare
 * rate, or more than four that one stretch with a plain rate says.
 */
function sayTime(sets: ClockSets, style: ZhHantStyle): Said {
  const sec = secondsOf(formOf(sets.second, withinTheUnit));
  const work = {
    hourSets: sets.hour,
    hours: formOf(sets.hour, hourReading),
    minutes: formOf(sets.minute, withinTheUnit),
    sec,
    style
  };
  const moments = work.hours.values.length * work.minutes.values.length *
    sec.form.values.length;
  const said = general(work);
  const kept = moments > 6 || said.whole && (moments > 4 || !said.anchored);

  return kept ? said : everyMoment(work);
}

export {sayTime};
