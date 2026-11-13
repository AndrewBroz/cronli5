// The time part: seconds, minutes and hours said as one thing. With every
// second at zero it is the minutes over the hours; one other second is
// carried by every clock time; several seconds are said by what the
// minutes and hours turned out to be.

import type {ScheduleFacts} from '../../core/schedule.js';
import {candidatesAs} from '../../core/set-views.js';
import type {Cadence, Exception, Form, Part, Run} from './sets.js';
import {choose, firstOf, readAs} from './sets.js';
import type {Clockwork, Rate, TimeSaid} from './clock.js';
import {
  HOURS, MOST_PIECE_WINDOWS, MOST_TIMES_LISTED, SIXTY, TIMES_AT_A_GLANCE,
  fieldSet, hoursOf, longCadence, rateOf, said, sayWithin
} from './clock.js';
import type {Moment, Speech} from './words.js';
import {every, list, phrase, sayPieces} from './words.js';
import {
  FIRST, LAST, frontVoice, plainVoice, rateVoice, secondVoice, secondsVoice,
  wholeMinuteVoice
} from './voices.js';
import lexicon from './lexicon.js';

const {units, words} = lexicon;

/** The seconds of a pattern, and the form they are said in. */
interface Seconds {
  // The form with no exception in it.
  bare: Form;
  form: Form;
  // The rate the seconds are when they never break.
  rate: Rate | undefined;
  values: number[];
}

// The ends and interval of a form that runs: every second, a run, a
// cadence, or one of those less a second or two.
function runOf(form: Form): Rate | undefined {
  const {from, to} = form as Run;
  const {interval, last, start} = form as Cadence;
  const runs: {[kind: string]: () => Rate | undefined} = {
    all() {
      return {first: FIRST, interval: 1, last: LAST};
    },
    cadence() {
      return {first: start, interval, last};
    },
    except() {
      return runOf((form as Exception).base);
    },
    range() {
      return {first: from, interval: 1, last: to};
    }
  };

  const found = runs[form.kind];

  return found && found();
}

// The seconds after a list of clock times, each of which is a minute:
// what runs is a window in each, while the windows are few; a short list
// of seconds makes more clock times. Nothing otherwise.
function sayInMinutes(seconds: Seconds, work: Clockwork): TimeSaid | false {
  const {hours, inner, speech} = work;
  const second = secondsVoice(speech);
  const minutes: Moment[] = hours.values.flatMap(function inHour(hour) {
    return inner.values.map(function time(minute) {
      return {hour, minute};
    });
  });
  const whole = runOf(seconds.form);
  const less = (seconds.form as Exception).removed || [];
  const edged = whole &&
    (less.includes(whole.first) || less.includes(whole.last));
  const form = edged ? seconds.bare : seconds.form;
  const {removed} = form as Exception;
  const run = runOf(form) || seconds.rate;
  const left = (removed || []).flatMap(function inMinute(value) {
    return minutes.map(function time(minute) {
      return speech.at({...minute, second: value});
    });
  });
  const out = left.length > TIMES_AT_A_GLANCE ?
    [`${second.unitOut(removed)} ${words.ofEachMinute}`] :
    [list(left)].filter(Boolean);

  function span(minute: Moment, from: number, to: number): string {
    return speech.span({...minute, second: from}, {...minute, second: to});
  }

  function windows(found: Rate): TimeSaid {
    return said(phrase(every(found.interval, 'second'),
      list(minutes.map(function window(minute) {
        return span(minute, found.first, found.last);
      }))), out);
  }

  function pieces(): TimeSaid | false {
    const {parts} = form as {parts: Part[]};
    const items = (parts || []).reduce(function count(sum, part) {
      return sum + (part.kind === 'values' ? part.values.length : 1);
    }, 0);

    return items > 0 && items * minutes.length <= MOST_PIECE_WINDOWS &&
      said(sayPieces(parts, {
        cadence(found) {
          return `${every(found.interval, 'second')} ` +
            span(minutes[0], found.start, found.last);
        },
        run(found, first) {
          return phrase(first && second.each,
            span(minutes[0], found.from, found.to));
        },
        strays: [words.once, words.then],
        values(values) {
          return values.map(function time(value) {
            return speech.at({...minutes[0], second: value});
          });
        }
      }));
  }

  function listed(): TimeSaid {
    return said(list(minutes.flatMap(function inMinute(minute) {
      return seconds.values.map(function time(value) {
        return speech.at({...minute, second: value});
      });
    })));
  }

  return firstOf<TimeSaid | false>([
    run && minutes.length <= MOST_PIECE_WINDOWS && windows(run),
    pieces(),
    seconds.values.length * minutes.length <= MOST_TIMES_LISTED &&
      form.kind === 'values' && listed()
  ]);
}

// What the seconds do in each minute that fires, after a description of
// the minutes: an extent and then a manner, or a bare list.
function secondsClause(seconds: Seconds): string {
  const form = seconds.bare;
  const {from, to} = form as Run;
  const {interval, last, start} = form as Cadence;

  function extent(first: number, final: number): string {
    return `${words.eachTime} ${words.fromSecond} ${first} ${words.to} ` +
      String(final);
  }

  const clauses: {[kind: string]: () => string} = {
    all() {
      return `${words.eachTime} ${words.forAWholeMinute}, ` +
        words.secondBySecond;
    },
    cadence() {
      return `${extent(start, last)}, ${words.atIntervalsOf} ${interval} ` +
        units.second.many;
    },
    range() {
      return `${extent(from, to)}, ${words.secondBySecond}`;
    }
  };

  function listed(): string {
    return `${words.inThatMinute} ${words.atSeconds} ` +
      list(seconds.values.map(String));
  }

  return (clauses[form.kind] || listed)();
}

// Several seconds, by what the minutes and hours are said as.
function saySeveral(seconds: Seconds, plain: Clockwork): TimeSaid {
  const {speech} = plain;
  const second = secondsVoice(speech);
  const minutes = sayWithin(plain);
  const {values} = seconds;
  const ends = {first: values[0], last: values[values.length - 1]};
  const whole = seconds.form.kind === 'all';
  const removed = (seconds.form as Exception).removed || [];

  function running(): TimeSaid {
    const {interval} = seconds.rate as Rate;

    return sayWithin({...plain, voice: rateVoice(speech,
      {...ends, ranged: true, text: every(interval, 'second')})});
  }

  function inFront(): TimeSaid {
    const text = whole ? second.each : second.within(seconds.form);
    const found = sayWithin({...plain, voice: frontVoice(speech,
      {...ends, ranged: seconds.form.kind !== 'values', text}, whole)});

    return {
      ...found,
      exceptions: [
        ...found.exceptions,
        ...removed.length > 0 ? [second.unitOut(removed)] : []
      ]
    };
  }

  function afterwards(): TimeSaid {
    const found = sayWithin({...plain, voice: wholeMinuteVoice(speech)});

    return {...found, base: `${found.base}, ${secondsClause(seconds)}`};
  }

  return firstOf<TimeSaid>([
    seconds.rate && minutes.kind === 'ranged' && running(),
    minutes.kind === 'times' && sayInMinutes(seconds, plain),
    minutes.kind === 'named' && inFront(),
    afterwards()
  ]);
}

// Every moment of a short schedule, to the second.
function momentsListed(seconds: number[], work: Clockwork): TimeSaid {
  const {hours, inner, speech} = work;

  return said(list(hours.values.flatMap(function inHour(hour) {
    return inner.values.flatMap(function inMinute(minute) {
      return seconds.map(function time(second) {
        return speech.at({hour, minute, second});
      });
    });
  })));
}

/**
 * The time of day. `free` says that no date, weekday, month or year is
 * restricted, so that hours past midnight may be said as one run.
 */
function sayTime(facts: ScheduleFacts, speech: Speech, free: boolean):
  {excepted: boolean; text: string} {
  const {cadencePieces, clockSecond} = facts.analyses;
  const linear = {linear: true};
  const hours = hoursOf(fieldSet(readAs(facts, 'hour', free), HOURS,
    cadencePieces.hour));
  const minutes = fieldSet(candidatesAs(facts, 'minute', linear) as [],
    SIXTY, cadencePieces.minute);
  const second = fieldSet(candidatesAs(facts, 'second', linear) as [],
    SIXTY, cadencePieces.second);
  const plain = {hours, inner: minutes, speech, voice: plainVoice(speech)};
  const limits = {cadence: longCadence, mixed: second.mixed};
  const form = choose(second.candidates, SIXTY, limits);
  const seconds = {
    bare: choose(second.candidates, SIXTY, {...limits, plain: true}),
    form,
    rate: rateOf(form) || rateOf(second.candidates.find(
      function isCadence(candidate) {
        return candidate.kind === 'cadence';
      }
    )),
    values: second.values
  };
  const count = second.values.length;
  const moments = count * minutes.values.length * hours.values.length;
  const found = firstOf<() => TimeSaid>([
    count === 1 && second.values[0] === FIRST && function atZero() {
      return sayWithin(plain);
    },
    moments <= TIMES_AT_A_GLANCE && function fewMoments() {
      return momentsListed(second.values, plain);
    },
    count === 1 && function oneSecond() {
      return sayWithin(
        {...plain, voice: secondVoice(speech, clockSecond as number)});
    },
    minutes.values.length > LAST && function everyMinute() {
      return sayWithin(
        {hours, inner: second, speech, voice: secondsVoice(speech)});
    },
    function severalSeconds() {
      return saySeveral(seconds, plain);
    }
  ])();

  const excepted = found.exceptions.length > 0;

  return {
    excepted,
    text: [
      found.base,
      ...excepted ?
        [`${words.except} ${found.exceptions.join(` ${words.andExcept} `)}`] :
        []
    ].join(', ')
  };
}

export {sayTime};
