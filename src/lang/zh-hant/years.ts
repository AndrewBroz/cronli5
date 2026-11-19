// The years, which lead the sentence (answers 4.4). A year is four digits
// of the common era; parity of years names its era.

import {
  type CadenceForm, type ExceptForm, type Form, type PiecesForm,
  type RangeForm, type Reading, type Sayers, type Span, formOf, sayBy
} from './forms.js';
import type {
  CadenceDescription, CadencePieces, ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import {list, series} from './write.js';
import {domainOf} from '../../core/index.js';
import lexicon from './lexicon.js';

const {units, words} = lexicon;
const year = units.year.position;

/** The years as they lead the sentence. */
export interface YearsSaid {
  // The years left out, for the closing bracket.
  closing: string;
  // The years themselves.
  lead: string;
  // What stands before a month in their place of "every year".
  month: string;
  // The comma that follows some forms, whatever comes next.
  pause: string;
}

const yearReading: Reading = {
  domain: domainOf('year'),
  pieces: true,
  run: 3,
  steps(cadence: CadenceForm) {
    return cadence.values.length > 4;
  }
};

// A run of years: from a year on, up to a year, or between two.
function yearSpan(span: Span): string {
  if (span.open) {
    return span.from + year + words.onward;
  }

  if (span.from === span.to) {
    return span.from + year;
  }

  return span.from === yearReading.domain.min ?
    span.to + year + words.bracketOpen + words.inclusive +
      words.bracketClose + words.before :
    span.from + year + words.to + span.to + year;
}

// Every second year is the even or the odd years, from a start or
// between two years unless they are all of them. Any other step is said
// from its start or between its ends.
function yearCadence(
  cadence: {fills: boolean; interval: number; last: number; open?: boolean;
    start: number}
): string {
  const span = yearSpan({
    from: cadence.start,
    open: cadence.open,
    to: cadence.last
  });
  const parity = [words.evenYears, words.oddYears][cadence.start % 2];
  const bound = cadence.interval === 2 && cadence.fills ? '' : span;

  return cadence.interval === 2 ?
    bound + words.whenever + parity :
    bound + words.every + cadence.interval + units.year.length;
}

function noYears(): YearsSaid {
  return {closing: '', lead: '', month: words.everyYear, pause: ''};
}

function oneYear(form: Form): YearsSaid {
  return {closing: '', lead: form.values[0] + year, month: '', pause: ''};
}

function yearList(form: Form): YearsSaid {
  return {
    closing: '',
    lead: list(form.values.map(String)) + year,
    month: words.of,
    pause: ''
  };
}

function yearRange(form: RangeForm): YearsSaid {
  return {...noYears(), lead: yearSpan(form)};
}

function yearPieces(form: PiecesForm): YearsSaid {
  return {
    closing: '',
    lead: series(form.spans.map(yearSpan), words.and),
    month: words.everyYear,
    pause: words.comma
  };
}

function yearsBut(form: ExceptForm): YearsSaid {
  return {...noYears(), closing: list(form.removed.map(String)) + year};
}

// A cadence of years names years and takes no "once". Parity takes the
// place of "every year"; any other step closes with a comma.
function yearSteps(form: CadenceForm): YearsSaid {
  const pause = form.interval === 2 ? '' : words.comma;

  return {closing: '', lead: yearCadence(form), month: '', pause};
}

const yearSayers: Sayers<null, YearsSaid> = {
  all: noYears,
  cadence: yearSteps,
  except: yearsBut,
  list: yearList,
  one: oneYear,
  pieces: yearPieces,
  range: yearRange
};

function filling(cadence: CadenceDescription): boolean {
  const {min} = yearReading.domain;

  return cadence.start - min < cadence.interval && Boolean(cadence.open);
}

// Runs and cadences together: each run says "every year", the parts are
// joined, and a comma closes them.
const mixedParts = {
  cadence(part: CadenceDescription) {
    return yearCadence({...part, fills: filling(part)});
  },
  range(part: Span) {
    return yearSpan(part) + words.everyYear;
  },
  values(part: {values: number[]}) {
    return list(part.values.map(String)) + year;
  }
};

function mixedYears(pieces: CadencePieces): YearsSaid {
  return {
    closing: '',
    lead: pieces.parts.map(function sayPart(part) {
      const say = mixedParts[part.kind] as (part: unknown) => string;

      return say(part);
    }).join(words.comma + words.andAlso),
    month: '',
    pause: words.comma
  };
}

// The forms that are no single thing to say.
const loose = {list: true, pieces: true};

/** The years of a pattern, as they lead its sentence. */
function sayYears(facts: ScheduleFacts): YearsSaid {
  const {cadencePieces, candidates} = facts.analyses;
  const form = formOf(candidates.year as SetDescription[], yearReading);
  const mixed = cadencePieces.year;

  return mixed && form.kind in loose ?
    mixedYears(mixed) :
    sayBy(yearSayers, form, null);
}

export {sayYears};
