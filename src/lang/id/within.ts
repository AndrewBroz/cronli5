// Minutes said inside their hour and seconds inside their minute, with no
// clock time (answers 3.2 and the phrase inside the hour of 4.1). A value
// named by number is always a point, «menit ke-30», and there is no
// «ke-0»: the start of the unit has words of its own. What lasts is a
// length, «selama 30 menit pertama», or runs between two points.

import type {
  CadenceDescription, Domain, RangeDescription, ValuesDescription
} from '../../core/schedule.js';
import {domainOf} from '../../core/specs.js';
import type {Plain} from './forms.js';
import {isCadence, isValues, tiles} from './forms.js';
import lexicon from './lexicon.js';
import {list, phrase} from './say.js';

const {ordinal, units, words} = lexicon;

/** A unit and the unit it is counted inside. */
export interface Tier {
  // What says that the phrase holds for every such unit: «setiap jam».
  closer: string;
  domain: Domain;
  // Whether a leading stretch is still called the first after «tiap
  // kali»: «selama 10 detik pertama», but «selama 30 menit».
  leads: boolean;
  // The start of the unit as a point, where the unit is said with it.
  sharp: string;
  // The same point after the unit has been said some other way.
  thatPoint: string;
  unit: string;
  // The whole of the unit it is counted in, as a length.
  whole: string;
}

/** Where a phrase stands, which decides how much it has to say. */
export interface Setting {
  // The phrase itself says what it recurs in («setiap jam»).
  closes: boolean;
  // A rhythm is said with where it stops, even when it fills the unit.
  ends: boolean;
  // The word for the rhythm of one, when it is not the unit's own.
  one?: string;
  // Every value of the unit is said as its whole length («selama 1 jam»).
  whole: boolean;
}

function everyUnit(unit: string, count = 1): string {
  return phrase(words.every, count > 1 && String(count), unit);
}

const everyHour = everyUnit(units.hour);
const everyMinute = everyUnit(units.minute);

const minuteTier: Tier = {
  closer: everyHour,
  domain: domainOf('minute'),
  leads: false,
  sharp: phrase(everyHour, words.sharp),
  thatPoint: words.atThatHour,
  unit: units.minute,
  whole: phrase('1', units.hour)
};

const secondTier: Tier = {
  closer: everyMinute,
  domain: domainOf('second'),
  leads: true,
  sharp: phrase(everyMinute, words.sharp),
  thatPoint: words.atThatMinute,
  unit: units.second,
  whole: phrase('1', units.minute)
};

/** Standing alone: the phrase says its own «setiap jam». */
const alone: Setting = {closes: true, ends: false, whole: false};

/** After words that have already said which hours or minutes. */
const under: Setting = {closes: false, ends: false, whole: false};

/** After «tiap kali»: one occasion, said with where it stops. */
const eachTime: Setting = {closes: false, ends: true, whole: true};

function nth(tier: Tier, value: number): string {
  return phrase(tier.unit, ordinal(value));
}

/**
 * Values as points: «pada menit ke-5, ke-20, dan ke-45». The start of the
 * unit is the given words, joined to the rest by «serta».
 */
function points(values: number[], tier: Tier, start: string): string {
  const later = values.filter(function past(value) {
    return value > tier.domain.min;
  });

  return [
    later.length < values.length && start,
    later.length > 0 && phrase(words.at, tier.unit, list(later.map(ordinal)))
  ].filter(Boolean).join(` ${words.aswell} `);
}

function startOf(tier: Tier, setting: Setting): string {
  return setting.closes ? tier.sharp : tier.thatPoint;
}

// Every value in a row: from the start of the unit a length, later two
// points.
function run(found: RangeDescription, tier: Tier, setting: Setting): string {
  const one = setting.one || everyUnit(tier.unit);

  return found.from === tier.domain.min ?
    phrase(one, words.during, String(found.to - found.from + 1), tier.unit,
      !(setting.whole && !tier.leads) && words.first) :
    phrase(one, words.from, nth(tier, found.from), words.to,
      ordinal(found.to));
}

// A rhythm: bare when it fills the unit from its start, with «mulai» when
// it fills it from later, and otherwise with the points it runs between.
function rhythm(found: CadenceDescription, tier: Tier, setting: Setting):
  string {
  const filling = tiles(found, tier.domain) && !setting.ends;
  const late = found.start > tier.domain.min;

  return phrase(
    everyUnit(tier.unit, found.interval),
    late && phrase([words.from, words.startingAt][Number(filling)],
      nth(tier, found.start)),
    !filling && phrase(words.to, !late && tier.unit, ordinal(found.last))
  );
}

type Body<Kind extends Plain['kind']> =
  (form: Extract<Plain, {kind: Kind}>, tier: Tier, setting: Setting) =>
    string;

// Several parts, each a whole phrase: every stretch says its rhythm again.
function parts(
  form: Extract<Plain, {kind: 'pieces' | 'cadencePieces'}>,
  tier: Tier,
  setting: Setting
): string {
  return list(form.parts.map(function each(part) {
    return body(part, tier, {...setting, ends: true});
  }));
}

const bodies: {[Kind in Plain['kind']]: Body<Kind>} = {
  all(_form, tier, setting) {
    return phrase(setting.one || everyUnit(tier.unit),
      setting.whole && phrase(words.during, tier.whole));
  },
  cadence: rhythm,
  cadencePieces: parts,
  pieces: parts,
  range: run,
  values(form: ValuesDescription, tier, setting) {
    return points(form.values, tier, startOf(tier, setting));
  }
};

function body(form: Plain, tier: Tier, setting: Setting): string {
  return (bodies[form.kind] as Body<Plain['kind']>)(form, tier, setting);
}

// Whether several parts open with the start of the unit as a point,
// which is said «setiap jam tepat» and so has said the unit.
function opensAtTheStart(form: Plain, tier: Tier): boolean {
  const [first] = {parts: [], ...form}.parts;

  return Boolean(first) && isValues(first) &&
    first.values[0] === tier.domain.min;
}

/**
 * Whether a phrase standing alone ends in «setiap jam»: every phrase but
 * the bare ones («setiap menit», «setiap 15 menit») and those that open
 * with points, which begin with it.
 */
function closesAfter(form: Plain, tier: Tier): boolean {
  return !(form.kind === 'all' || isValues(form) ||
    opensAtTheStart(form, tier) ||
    isCadence(form) && tiles(form, tier.domain) &&
    form.start === tier.domain.min);
}

/** A set of minutes inside the hour, or of seconds inside the minute. */
function inside(form: Plain, tier: Tier, setting: Setting): string {
  const named = isValues(form) && form.values[0] > tier.domain.min;

  return phrase(
    setting.closes && named && tier.closer,
    body(form, tier, setting),
    setting.closes && closesAfter(form, tier) && tier.closer
  );
}

/**
 * Values left out of every hour or minute, as points: «pada menit ke-29
 * setiap jam». `closes` says whether the unit still has to be said.
 */
function leftOutAt(removed: number[], tier: Tier, closes: boolean): string {
  return phrase(
    points(removed, tier, closes ? tier.sharp : tier.thatPoint),
    closes && removed[0] > tier.domain.min && tier.closer
  );
}

export {
  alone, closesAfter, eachTime, everyHour, everyUnit, inside, leftOutAt,
  minuteTier, nth, points, secondTier, under
};
