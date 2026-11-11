// The paradigm grid: language-independent families of cron patterns, each
// varying one field while the rest hold, the way a linguist lays out a
// paradigm. A language says every row aloud; reviewing a family together
// shows whether a one-field edit moves only that field's phrase.
//
// The grid is the product of a few contexts and one ladder of values per
// field. It is data, not a test suite (see grid-structure.js).

const FIELDS = ['second', 'minute', 'hour', 'date', 'month', 'weekday'];

// The surrounding pattern a ladder is tried in, as five fields.
const CONTEXTS = [
  // One clock time, daily.
  {id: 'clock', pattern: '0 9 * * *'},
  // A cadence inside a window, on weekdays.
  {id: 'window', pattern: '*/15 9-17 * * 1-5'},
  // A date-anchored time.
  {id: 'monthly', pattern: '0 0 1 * *'},
  // Everything wildcard.
  {id: 'open', pattern: '* * * * *'}
];

// The values each field steps through: wildcard, single values, lists,
// ranges, a range with a stray value, cadences, a cadence with one value
// missing (the fold that breaks), wrap-arounds, and Quartz forms.
const LADDERS = {
  second: ['*', '30', '0,30', '*/6', '*/15', '0-9', '5/10'],
  minute: ['*', '0', '30', '0,30', '5,20,45', '0-29', '0-29,45', '*/15',
    '*/7', '5/15', '0,15,45', '10-40/10'],
  hour: ['*', '0', '9', '12', '9,17', '8,12,18', '9-17', '9-17,22', '*/2',
    '*/6', '1/2', '0,2,4,6,10,12,14,16,18,20,22', '22-2'],
  date: ['*', '1', '15', '1,15', '1,10,20', '1-7', '1-7,15', '*/2', '2/2',
    '*/5', '1,3,5,7,9,11,13,17,19,21,23,25,27,29,31', 'L', '15W'],
  month: ['*', '1', '6', '1,7', '3,6,9,12', '6-8', '6-8,12', '*/2', '*/3',
    '1-11', '11-2'],
  weekday: ['*', '1', '0', '1,3,5', '1-5', '0,6', '1-6', '2,4', '5L', '1#2']
};

// Rows at these positions in a family are visible to a renderer's builder;
// the rest are held out to judge it. Positional, so the split never
// depends on any renderer.
const VISIBLE_EVERY = 3;

// The context with one field replaced. The second is a sixth, leading
// field; the others replace their own position.
function withField(context, field, value) {
  if (field === 'second') {
    return `${value} ${context}`;
  }

  const parts = context.split(' ');

  parts[FIELDS.indexOf(field) - 1] = value;

  return parts.join(' ');
}

// The context's own value for a field (the implied second is zero).
function contextValue(context, field) {
  return field === 'second' ?
    '0' :
    context.split(' ')[FIELDS.indexOf(field) - 1];
}

function familyOf(context, field) {
  const own = contextValue(context.pattern, field);
  const rows = LADDERS[field].filter(function notOwn(value) {
    return value !== own;
  }).map(function toRow(value, index) {
    return {
      heldOut: index % VISIBLE_EVERY !== 0,
      pattern: withField(context.pattern, field, value),
      quartz: (/[LW#]/u).test(value)
    };
  });

  return {context: context.pattern, field, id: `${context.id}/${field}`, rows};
}

const families = CONTEXTS.flatMap(function perContext(context) {
  return FIELDS.map(function perField(field) {
    return familyOf(context, field);
  });
});

function allRows() {
  return families.flatMap(function rowsOf(family) {
    return family.rows;
  });
}

function visibleRows() {
  return allRows().filter(function isVisible(row) {
    return !row.heldOut;
  });
}

function heldOutRows() {
  return allRows().filter(function isHeldOut(row) {
    return row.heldOut;
  });
}

// The neighbor pairs a relational score runs over: within each family, the
// context against every row, and each row against the next.
function pairs() {
  return families.flatMap(function perFamily(family) {
    const fromContext = family.rows.map(function withContext(row) {
      return [family.context, row.pattern];
    });
    const adjacent = family.rows.slice(1).map(function withPrevious(row, i) {
      return [family.rows[i].pattern, row.pattern];
    });

    return [...fromContext, ...adjacent];
  });
}

export {allRows, families, heldOutRows, pairs, visibleRows};
