// The months and years everything else is said of, which close the
// sentence (answers 2.1, 3.5, 4.4): «pada bulan Juni sampai Agustus»,
// «pada tahun 2030», «pada bulan Juni 2030».

import {denote, describeSet} from '../../core/describe-set.js';
import type {
  CadenceDescription, RangeDescription, ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import {domainOf} from '../../core/specs.js';
import type {Part, Plain} from './forms.js';
import {habits, isRange, isValues, partOf} from './forms.js';
import lexicon from './lexicon.js';
import type {IndonesianStyle} from './options.js';
import {list, monthName, phrase} from './say.js';

const {ordinal, units, words} = lexicon;

/** How the values of a field are named, each member under its head word. */
interface Naming {
  cadence(found: CadenceDescription): string;
  head: string;
  name(value: number): string;
  range(found: RangeDescription): string;
}

type Members<Kind extends Plain['kind']> =
  (form: Extract<Plain, {kind: Kind}>, say: Naming) => string[];

// Several parts: each run, rhythm and single value is a member of its
// own, with its head word.
function several(
  form: Extract<Plain, {kind: 'pieces' | 'cadencePieces'}>,
  say: Naming
): string[] {
  return form.parts.flatMap(function each(part) {
    return isValues(part) ?
      part.values.map(function single(value) {
        return phrase(say.head, say.name(value));
      }) :
      membersOf(part, say);
  });
}

const members: {[Kind in Plain['kind']]: Members<Kind>} = {
  all() {
    return [];
  },
  cadence(form, say) {
    return [say.cadence(form)];
  },
  cadencePieces: several,
  pieces: several,
  range(form, say) {
    return [say.range(form)];
  },
  values(form, say) {
    return [phrase(say.head, list(form.values.map(say.name)))];
  }
};

/**
 * A set as the members of one list, each a whole phrase with its head
 * word: «bulan Juni sampai Agustus», «bulan Desember».
 */
function membersOf(form: Plain, say: Naming): string[] {
  return (members[form.kind] as Members<Plain['kind']>)(form, say);
}

/** The months a schedule is said of. */
function monthsOf(facts: ScheduleFacts, own: boolean, linear: boolean): Part {
  const {candidates, monthLengths} = facts.analyses;
  const domain = domainOf('month');
  const listed = candidates.month as SetDescription[];
  const reached = denote(listed[listed.length - 1], domain);
  // The months the day of the month fires in: a month that lacks the day
  // is not named.
  const fired = reached.filter(function fires(month) {
    return monthLengths.some(function holds(group) {
      return group.months.includes(month);
    });
  });

  function laidOut(cut: boolean): Part {
    return partOf({
      candidates: describeSet(own ? reached : fired, domain, {linear: cut}),
      domain,
      habits: habits.month,
      mixed: null
    });
  }

  // A run past the end of the year is said as it runs unless a year is
  // named; everything else is said in the order of the year.
  const asItRuns = laidOut(linear);
  const {base} = asItRuns;

  return isRange(base) && base.from > base.to ? asItRuns : laidOut(true);
}

/** The years a schedule is said of. */
function yearsOf(facts: ScheduleFacts): Part {
  const {cadencePieces, candidates} = facts.analyses;

  return partOf({
    candidates: candidates.year as SetDescription[],
    domain: domainOf('year'),
    habits: habits.year,
    mixed: cadencePieces.year
  });
}

/** Month names in a list. */
function monthNames(values: number[], style: IndonesianStyle): string {
  return list(values.map(function named(month) {
    return monthName(month, style);
  }));
}

function monthNaming(style: IndonesianStyle): Naming {
  function name(month: number): string {
    return monthName(month, style);
  }

  return {
    // Months are never said as a rhythm: they are named.
    cadence(found) {
      return phrase(units.month,
        monthNames(denote(found, domainOf('month')), style));
    },
    head: units.month,
    name,
    range(found) {
      return phrase(units.month, name(found.from), words.to,
        name(found.to));
    }
  };
}

const firstYear = domainOf('year').min;

// A run of years: from a year on, up to a year, or between two.
function yearRun(found: RangeDescription): string {
  const options = [
    found.open && phrase(words.startingAt, units.year, String(found.from)),
    found.from === firstYear && phrase(words.throughYear, String(found.to)),
    phrase(units.year, String(found.from), words.to, String(found.to))
  ];

  return options.find(Boolean) as string;
}

// A rhythm of years: every second year of them all is the even or the
// odd years; any other is its first year and «setiap tahun ke-N
// sesudahnya», with its last year when it has one.
function yearRhythm(found: CadenceDescription): string {
  const parity = [words.evenYears, words.oddYears][found.start % 2];
  const everySecond = found.interval === 2 && found.open &&
    found.start - firstYear < 2;

  return everySecond ?
    parity :
    phrase(units.year, String(found.start), words.and, words.every,
      units.year, ordinal(found.interval), words.after,
      !found.open && phrase(words.to, String(found.last)));
}

const yearNaming: Naming = {
  cadence: yearRhythm,
  head: units.year,
  name: String,
  range: yearRun
};

// Whether a phrase of years begins with «tahun», and so takes «pada»:
// «mulai tahun 2030» and «sampai dengan tahun 2030» do not.
function takesAt(years: Plain): boolean {
  return !(isRange(years) && (years.open || years.from === firstYear));
}

/** What the closing part is given to say. */
export interface Scope {
  months: Part;
  // The months said some other way than by name, when they are.
  monthsAs?: string;
  // Whether the day part has already said the months, or the year.
  saidMonths: boolean;
  saidYear: boolean;
  style: IndonesianStyle;
  years: Part;
}

/**
 * The months and years of the closing part. A year follows a month
 * phrase with one head word («pada bulan Juni 2030», «pada bulan Juni
 * tahun 2030 dan 2031»); after months in several pieces it is said of
 * all of them («, semuanya pada tahun 2030»).
 */
function scopeOf(scope: Scope): string {
  const named = scope.saidMonths ?
    [] :
    membersOf(scope.months.base, monthNaming(scope.style));
  const months = scope.monthsAs ||
    named.length > 0 && phrase(words.at, list(named));
  const {base} = scope.years;
  const said = scope.saidYear ? [] : membersOf(base, yearNaming);
  const years = list(said);
  const lone = isValues(base) && base.values.length === 1 &&
    String(base.values[0]);
  const lead = takesAt(base) && words.at;
  const options = [
    said.length === 0 && phrase(months),
    !months && phrase(lead, years),
    named.length === 1 && phrase(months, lone || years),
    `${months}, ${phrase(words.allOfThem, lead, years)}`
  ];

  return options.find(function chosen(option) {
    return option !== false;
  }) as string;
}

/** The months and years left out, each said after «kecuali». */
function scopeLeftOut(scope: Scope): string[] {
  return [
    !scope.saidMonths && scope.months.removed.length > 0 &&
      phrase(units.month,
      monthNames(scope.months.removed, scope.style)),
    scope.years.removed.length > 0 && phrase(units.year,
      list(scope.years.removed.map(String)))
  ].filter(Boolean) as string[];
}

export {monthNames, monthsOf, scopeLeftOut, scopeOf, yearsOf};
