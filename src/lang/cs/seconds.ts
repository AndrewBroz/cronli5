// The whole time part: the minutes and hours (clock.ts) and the seconds
// joined to them. Seconds are written into clock times, turn each time
// into a window, take the place of «každou minutu», or follow as a place
// in the minute after «pokaždé».

import type {
  CadencePieces, ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import {candidatesAs} from '../../core/index.js';
import type {CzechStyle} from './options.js';
import type {
  Clock, Level, Opening, Said, Shown, Time, Told
} from './clock.js';
import {
  apart, at, clockField, minutesAndHours, rhythmStep, windowed
} from './clock.js';
import {
  counted, everyUnit, longestListedCadence, ofKind, partsJoiner, spaced,
  stretchOf
} from './sets.js';
import lexicon from './lexicon.js';

const {units, words} = lexicon;

/** The time part, what opens it, and whether its hours are a night. */
export interface TimePart {
  night: boolean;
  opening: Opening;
  text: string;
}

const lastSecond = 59;
const minutesInAnHour = 60;
const mostListedTimes = 6;

// The night as Czech has it: from 22 or later to 6 or earlier.
const nightFalls = 22;
const nightEnds = 6;

// The hours. A run past midnight is kept whole only as a night, and only
// when no day, month or year is restricted; otherwise nothing wraps.
// Hours of runs and cadences together are said as their parts only at
// one minute.
function hoursOf(facts: ScheduleFacts, free: boolean, alone: boolean): Clock {
  const own = facts.analyses.candidates.hour as SetDescription[];
  const run = ofKind(own, 'range');
  const night = free && run && run.from > run.to &&
    run.from >= nightFalls && run.to <= nightEnds;

  return clockField(night ?
    own :
    candidatesAs(facts, 'hour', {linear: true}) as SetDescription[], 'hour',
    alone);
}

// A phrase with the seconds set after its head and before its stretches
// and exceptions.
function composed(said: Said, seconds = ''): {opening: Opening; text: string} {
  const except = said.except.length ?
    `, ${said.except.join(` ${words.and} `)}` :
    '';

  return {
    opening: said.opening,
    text: spaced(said.head, said.main) + seconds + said.after + except
  };
}

// A rhythm and the stretch it runs in: the rhythm first when the phrase
// stands alone, and the stretch first after «pokaždé».
function ordered(rhythm: string, stretch: string, alone: boolean): string {
  return alone ? spaced(rhythm, stretch) : `${stretch}, ${rhythm}`;
}

// Runs and cadences of seconds together, each part with its own rhythm
// and its own stretch from the start; single seconds follow «ještě». Said
// of every minute it opens «v každé minutě», and the stretches then count
// from «začátku» of the minute without naming it again.
function partsInMinute(form: CadencePieces, of: string, alone: boolean):
  string {
  const where = {[words.ofEveryMinute]: words.ofTheMinute}[of] ?? of;
  const start = {[words.ofEveryMinute]: words.fromTheStart}[of] ??
    spaced(words.fromTheStart, of);
  const parts = form.parts.map(function say(part, index) {
    if (part.kind === 'values') {
      return spaced(index ? words.still : '', counted(part.values,
        units.second), words.afterTheStartOf, where);
    }

    const {first, last, step} = stretchOf(part);
    const span = first ?
      spaced(words.from, String(first), words.to, String(last),
        units.second.many, words.afterTheStartOf, where) :
      spaced(start, words.to, String(last), units.second.many,
        words.afterItMasculine);

    return ordered(everyUnit(step, units.second), span, alone);
  });

  return spaced({[words.ofEveryMinute]: words.inEveryMinute}[of] ?? '',
    parts.join(` ${partsJoiner(form.parts)} `));
}

// A run or a cadence of seconds inside the minute, and an exception of a
// second or two; nothing for a set that has no such form.
function stretchInMinute(seconds: Clock, of: string): string {
  const {form, values} = seconds;
  const alone = of !== words.ofTheMinute;
  const step = form.kind === 'cadence' ? form.interval : 1;
  const rhythm = everyUnit(step, units.second);
  const [first] = values;
  const last = values[values.length - 1];
  const span = spaced(words.from, String(first), words.to, String(last),
    units.second.many, words.afterTheStartOf, of, words.inclusive);
  const inFirst = spaced(words.inTheFirst, String(values.length),
    words.secondsLocative, of);
  const anew: {[of: string]: string} = {
    [words.ofEveryHour]:
      spaced(rhythm, words.inTheFirstMinuteOfEveryHour),
    [words.ofEveryMinute]:
      `${rhythm}, ${spaced(words.inEveryMinute, words.anewFromTheStart)}`,
    [words.ofTheMinute]: `${rhythm}, ${words.anewFromTheStartOfTheMinute}`
  };
  const fromStart = first === 0 ? spaced(inFirst, rhythm) : '';
  const kinds: {[kind: string]: string} = {
    cadence: first === 0 && last + step > lastSecond ?
      anew[of] :
      ordered(rhythm, span, alone),
    except: `${rhythm}, ${spaced(words.except, words.theMoment,
      counted(form.kind === 'except' ? form.removed : [], units.second),
      words.afterTheStartOf, of)}`,
    cadencePieces: form.kind === 'cadencePieces' ?
      partsInMinute(form, of, alone) : '',
    range: alone && fromStart ?
      spaced(rhythm, inFirst) :
      fromStart || ordered(rhythm, span, alone)
  };

  return kinds[form.kind] || '';
}

// The place of the seconds inside the minute, counted from its start:
// with «každé minuty» when it stands alone, with «minuty» after
// «pokaždé», and with «každé hodiny» for the first minute of every hour.
// A set of seven values or fewer that is no run is a list, and so is a
// set with no form of its own here.
function minutePlace(seconds: Clock, of: string):
  {opening: Opening; text: string} {
  const {form, values} = seconds;
  const long = values.length > longestListedCadence || form.kind === 'range';
  const whole = form.kind !== 'except' || form.base.kind === 'all';
  const stretch = long && whole ? stretchInMinute(seconds, of) : '';
  const list: {opening: Opening; text: string} = values[0] === 0 ?
    {
      opening: '',
      text: spaced(words.atTheStartOf, of, words.and,
        counted(values.slice(1), units.second), words.afterItMasculine)
    } :
    {
      opening: 'always',
      text: spaced(counted(values, units.second), words.afterTheStartOf, of)
    };

  return stretch ? {opening: '', text: stretch} : list;
}

// The seconds in the minutes of a list of clock times: each minute is a
// slot, and neighbouring minutes make one window.
function secondLevel(style: CzechStyle): Level {
  return {
    removed(values) {
      return spaced(words.except, words.theMoment,
        counted(values, units.second), words.afterTheStartOf,
        words.ofEveryMinute);
    },
    style,
    time(slot, second) {
      return [Math.floor(slot / minutesInAnHour), slot % minutesInAnHour,
        second];
    }
  };
}

// The minutes of a list of clock times as the slots the seconds run in.
function slotsOf(times: Time[]): Clock {
  const values = times.map(function slot([hour, minute]) {
    return hour * minutesInAnHour + minute;
  });

  return {
    domain: {cyclic: false, max: values[values.length - 1], min: 0},
    form: {kind: 'values', values},
    step: 0,
    tiles: false,
    unit: units.minute,
    values
  };
}

// Whether the seconds can run in the minutes of a list of clock times as
// windows: a rhythm, a rhythm with a few values removed, or, where no two
// of the minutes are neighbours, anything that reads as one stretch.
function windowable(seconds: Clock, times: Time[]): boolean {
  const {form} = seconds;

  return seconds.step > 0 ||
    form.kind === 'except' && rhythmStep(form.base, seconds.domain) > 0 ||
    apart(slotsOf(times)) &&
      ['range', 'cadence', 'pieces', 'cadencePieces'].includes(form.kind);
}

// Which way the seconds join the minutes and hours.
function joinsOf(seconds: Clock, told: Told, one: number | undefined) {
  const {form} = seconds;
  const times = told.times || [[0, 0]];
  const many = seconds.values.length > 1;
  const few = !many ||
    times.length * seconds.values.length <= mostListedTimes;

  return {
    // The seconds are written into a list of clock times.
    listed: Boolean(told.times) &&
      (form.kind === 'values' && few || !windowable(seconds, times)),
    // There is nothing to say: the second is zero.
    silent: !many && !one,
    // A whole minute of seconds, said after «po dobu jedné minuty».
    throughout: seconds.tiles &&
      (seconds.step === 1 || form.kind !== 'values')
  };
}

/**
 * The time part of a description. `free` says that no day, month or year
 * is restricted, which is when hours past midnight are a night.
 */
function timePart(facts: ScheduleFacts, free: boolean, style: CzechStyle):
  TimePart {
  const seconds = clockField(
    candidatesAs(facts, 'second', {linear: true}) as SetDescription[],
    'second');
  const minutes = clockField(
    candidatesAs(facts, 'minute', {linear: true}) as SetDescription[],
    'minute');
  const hours = hoursOf(facts, free, minutes.values.length === 1);
  const told = minutesAndHours(minutes, hours);
  const one = facts.analyses.clockSecond;
  const shown: Shown = {many: seconds.values.length > 1, one, style};
  const ends = [seconds.values[0], seconds.values[seconds.values.length - 1]];
  const times = told.times || [];
  const joins = joinsOf(seconds, told, one);
  const rhythm = everyUnit(seconds.step, units.second);
  const rules: Array<{when: unknown; say: () => ReturnType<typeof composed>}> =
  [
    {say: () => composed(told.say({style})), when: joins.silent},
    {
      say: () => ({
        opening: 'times',
        text: at(times.flatMap(function inMinute(time) {
          return seconds.values.map(function atSecond(second) {
            return [...time, second];
          });
        }), style)
      }),
      when: joins.listed
    },
    {
      say: () => composed(
        windowed(seconds, slotsOf(times), secondLevel(style), {style})),
      when: told.times
    },
    {
      say: () => composed(told.say(
        {head: rhythm, many: true, sec: ends, span: true, style})),
      when: told.lead && seconds.tiles
    },
    {
      say: () => composed(told.say(
        {one, sec: [one as number, one as number], style})),
      when: one && told.clocks
    },
    {
      say() {
        const place = seconds.tiles ?
          {
            opening: '' as Opening,
            text: spaced(rhythm, words.inTheFirstMinuteOfEveryHour)
          } :
          minutePlace(seconds, words.ofEveryHour);

        return composed({
          ...told.say({many: true, sec: [0, lastSecond], span: true, style}),
          head: place.text,
          main: '',
          opening: place.opening
        });
      },
      when: told.fullHour
    },
    {
      say() {
        const said = told.say({...shown, head: ''});
        const place = minutePlace(seconds, words.ofEveryMinute);

        return composed({
          ...said,
          after: said.main ? `, ${said.main}` : '',
          head: place.text,
          main: '',
          opening: place.opening
        });
      },
      when: told.lead === 'minute'
    },
    {
      say: () => composed(told.say({...shown, late: ends}),
        `, ${words.eachTime} ${joins.throughout ?
          spaced(words.forOneMinute, rhythm) :
          minutePlace(seconds, words.ofTheMinute).text}`),
      when: true
    }
  ];
  const {say} = rules.find(function applies(rule) {
    return rule.when;
  }) as (typeof rules)[number];

  return {
    ...say(),
    night: hours.form.kind === 'range' && hours.form.from > hours.form.to
  };
}

export {timePart};
