// The moments to ask a reader about, for one pattern: a few at which it
// fires, and near-misses chosen where a reader who took the description
// the wrong way would answer wrongly. The answer to each comes from the
// oracle, never from the description.
//
// The near-misses, each named for the reading it tests:
// - `gap`: the middle of the longest gap between two firings in a day
//   (a stretch read as continuous, or a list read as a range);
// - `step`: one unit before or after a firing (an ordinal read off by one,
//   a rhythm counted from the wrong place);
// - `after`: one unit after the last firing of the day, and the first
//   value of the next cycle (an end read as inclusive or exclusive);
// - `day`: a day near a firing day that does not fire (a day part read too
//   widely);
// - `either`: a day that fires through only one of two day fields (a time
//   read as belonging to one of them only).

import {daysIn, fieldsOf, firesAt, firesOnDay, hasSeconds, timesOfDay,
  weekdayOf} from './oracle.mjs';

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const SEARCH_DAYS = 4000;
const NEAR_DAYS = 14;
const MOST = 10;

function secondsOf(time) {
  return time[0] * HOUR + time[1] * MINUTE + time[2];
}

function timeOf(seconds) {
  const inDay = (seconds % DAY + DAY) % DAY;

  return [Math.floor(inDay / HOUR), Math.floor(inDay % HOUR / MINUTE),
    inDay % MINUTE];
}

// The day `offset` days after a day.
function dayAfter(day, offset) {
  const moved = new Date(Date.UTC(day.year, day.month - 1, day.date + offset));

  return {
    date: moved.getUTCDate(),
    month: moved.getUTCMonth() + 1,
    year: moved.getUTCFullYear()
  };
}

function momentOf(day, time) {
  return {...day, hour: time[0], minute: time[1], second: time[2]};
}

// The first year the pattern can fire in, to start looking from.
function firstYear(fields, start) {
  const years = fields.year.split(/[,/-]/u).map(Number)
    .filter((year) => year > 0);

  return years.length ? Math.max(Math.min(...years), start) : start;
}

// The days, from a start, on which the pattern fires (month, year and day
// fields), up to a count.
function firingDays(pattern, options, start, count) {
  const fields = fieldsOf(pattern, options);
  const [time] = timesOfDay(pattern, options);
  const days = [];

  for (let offset = 0; offset < SEARCH_DAYS && days.length < count;
    offset += 1) {
    const day = dayAfter(start, offset);

    if (firesAt(pattern, momentOf(day, time), options) &&
        firesOnDay(fields, day.year, day.month, day.date)) {
      days.push(day);
    }
  }

  return days;
}

// The middle of the longest gap between two firings in a day, if any gap
// is wider than one unit.
function gapMiddle(times, unit) {
  let best = null;

  times.forEach(function gapTo(time, index) {
    const next = times[index + 1];

    if (next) {
      const width = secondsOf(next) - secondsOf(time);

      if (width > 2 * unit && (!best || width > best.width)) {
        best = {middle: secondsOf(time) + Math.floor(width / 2 / unit) * unit,
          width};
      }
    }
  });

  return best ? timeOf(best.middle) : null;
}

// Near-misses inside one firing day.
function timeMisses(times, unit) {
  const first = times[0];
  const middle = times[Math.floor(times.length / 2)];
  const last = times[times.length - 1];
  const gap = gapMiddle(times, unit);
  const misses = [
    {kind: 'step', time: timeOf(secondsOf(middle) + unit)},
    {kind: 'step', time: timeOf(secondsOf(first) - unit)},
    {kind: 'after', time: timeOf(secondsOf(last) + unit)},
    {kind: 'after', time: [(last[0] + 1) % 24, first[1], first[2]]},
    {kind: 'step', time: timeOf(secondsOf(last) - unit)}
  ];

  return gap ? [{kind: 'gap', time: gap}, ...misses] : misses;
}

// A day within two weeks of a firing day, on which only one of the two day
// fields matches, when the pattern fires on either.
function eitherDays(pattern, options, around) {
  const fields = fieldsOf(pattern, options);
  const both = fields.date !== '*' && fields.weekday !== '*' &&
    !fields.date.startsWith('*') && !fields.weekday.startsWith('*');
  const found = [];

  if (!both) {
    return found;
  }

  const onlyDate = {...fields, weekday: '*'};
  const onlyWeekday = {...fields, date: '*'};

  [onlyDate, onlyWeekday].forEach(function side(one, index) {
    const other = index ? onlyDate : onlyWeekday;

    for (let offset = 1; offset < NEAR_DAYS * 4; offset += 1) {
      const day = dayAfter(around, offset);

      if (firesOnDay(one, day.year, day.month, day.date) &&
          !firesOnDay(other, day.year, day.month, day.date)) {
        found.push(day);
        break;
      }
    }
  });

  return found;
}

// A day near a firing day on which the pattern does not fire.
function quietDay(pattern, options, around, time) {
  for (let offset = 1; offset < NEAR_DAYS; offset += 1) {
    const day = dayAfter(around, offset);

    if (!firesAt(pattern, momentOf(day, time), options)) {
      return day;
    }
  }

  return null;
}

/**
 * The probes for one pattern: [{moment, fires, kind}], firings and
 * near-misses mixed, at most ten. `seed` varies the day chosen, so that a
 * batch does not ask every question about the same date.
 */
function probesFor(pattern, options = {}, seed = 0) {
  const fields = fieldsOf(pattern, options);
  const times = timesOfDay(pattern, options);
  const unit = hasSeconds(pattern, options) ? 1 : MINUTE;
  const year = firstYear(fields, 2030);
  const start = dayAfter({date: 1, month: 1, year}, seed * 37 % 300);
  const days = firingDays(pattern, options, start, 2);
  const probes = [];

  function ask(day, time, kind) {
    const moment = momentOf(day, time);

    probes.push({fires: firesAt(pattern, moment, options), kind, moment});
  }

  if (!days.length) {
    // It never fires: ask about the end of the first month it names and
    // the start of the next, where a reader who did not see that the date
    // never comes would place it.
    const month = Number(fields.month.split(/[,/-]/u)[0]) || 1;
    const day = {date: daysIn(year, month), month, year};

    ask(day, times[0], 'never');
    ask(dayAfter(day, 1), times[0], 'never');

    return probes;
  }

  const [day, nextDay] = days;
  const first = times[0];
  const middle = times[Math.floor(times.length / 2)];
  const last = times[times.length - 1];

  ask(day, first, 'fires');
  ask(day, last, 'fires');
  ask(nextDay || day, middle, 'fires');
  timeMisses(times, unit).forEach(function miss(entry) {
    ask(day, entry.time, entry.kind);
  });

  const quiet = quietDay(pattern, options, day, middle);

  if (quiet) {
    ask(quiet, middle, 'day');
  }

  eitherDays(pattern, options, day).forEach(function either(side) {
    ask(side, first, 'either');
  });

  return choose(probes);
}

// At most ten probes, no moment twice, keeping every firing probe, every
// day-part probe and the gap, and as many of the rest as fit; then in a
// fixed shuffled order, so the firings are not always first.
function choose(probes) {
  const seen = new Set();
  const unique = probes.filter(function fresh(probe) {
    const key = JSON.stringify(probe.moment);
    const isNew = !seen.has(key);

    seen.add(key);

    return isNew;
  });
  const keep = ['fires', 'either', 'day', 'gap', 'never'];
  const kept = unique.filter((probe) => keep.includes(probe.kind));
  const rest = unique.filter((probe) => !keep.includes(probe.kind));
  const chosen = [...kept, ...rest].slice(0, MOST);

  return chosen.map((probe, index) => ({probe, sort: index * 7 % 11}))
    .sort((a, b) => a.sort - b.sort)
    .map((entry) => entry.probe);
}

export {probesFor, weekdayOf};
