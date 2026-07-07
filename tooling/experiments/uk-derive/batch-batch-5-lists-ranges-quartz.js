// uk-derive batch: batch-5-lists-ranges-quartz
//
// Stage-2 (corpus translation) candidate rows, translated from the donor
// (en) corpus:
//   test/lang/en/complex/lists/strings.js
//   test/lang/en/complex/ranges/strings.js
//   test/lang/en/complex/quartz.js
//
// MEANING is inherited unchanged from the (already-validated) donor rows.
// This file's job is faithful + natural Ukrainian idiom + coverage parity.
// Not yet panel-reviewed — a candidate for the blind 3-persona uk-anchored
// corpus-translation panel (tooling/docs/language-pipeline.md Stage 2).
//
// Row shape: [pattern, expected, opts?] — same triple as
// test/lang/de/corpus.js, one array per donor `describe` group. No mocha/
// chai/cronli5 import: src/lang/uk has no renderer yet (Stage 4 hasn't
// run), so this is plain translated data, not a wired-up test file.
//
// ---------------------------------------------------------------------
// Conventions pinned from src/lang/uk/notes.md (so this translation does
// NOT silently inherit the donor's en forms):
//
// 1. Clock — §1: digital colon, unpadded hour, `о`/`об`. On-the-hour KEEPS
//    the minutes (`о 17:00`, never a bare `о 17`). Exact midnight →
//    `опівночі` (adverb, no preposition). Exact noon → `о 12:00 дня`
//    (asymmetric: `опівночі` unambiguous adverb kept, but `південь` is a
//    false-friend for "south" so noon falls back to the numeral + `дня`).
// 2. Bare day-of-month → fully spelled genitive ordinal + `числа`
//    (`першого числа`, `п'ятнадцятого числа`), per §2 — NOT the digit +
//    hyphenated-genitive shorthand (`1-го`, `15-го`) that §2 explicitly
//    rejected for this field. This spelled form is used for EVERY bare-DOM
//    reference in this batch, including inside ranges and quartz L/W
//    constructions, so the "digit + hyphenated genitive" forms that
//    appear as loose illustrative shorthand elsewhere in notes.md (§3's
//    inline example, §7's inline example) are NOT propagated into the
//    corpus — see the two flagged notes.md inconsistencies below.
// 3. List connective — `і` default, `й` after a preceding vowel sound,
//    mechanically applied per §3, EXCEPT: (a) the minute/second/hour
//    ordinal-position list device (see #6) pins `та` per its own ratified
//    example, and (b) the bare day-of-month ordinal list pins `і`
//    invariantly, per §2's own ratified list example (see flagged
//    inconsistency #1 below — that example keeps `і` even though the
//    preceding word ends in a vowel).
// 4. Range connective — §3: `з … до … включно` everywhere (clock,
//    weekday, date, month ranges), genitive on both ends.
// 5. Recurrence marking — §4: `по` + locative plural for a *trailing/
//    marked* recurring weekday — solo ("по суботах") or a list ("по
//    понеділках, середах і п'ятницях") — never the donor's leading
//    "every Monday, Wednesday, and Friday" frame. A weekday RANGE stays
//    the unmarked forced genitive (`з понеділка до п'ятниці включно`,
//    §5), no `по`.
// 6. Numeral register — §8: digits everywhere. A minute-of-hour /
//    second-of-minute LIST position uses the ratified digit + short
//    ordinal-suffix + locative-noun device (`о 5-й та 10-й хвилині`),
//    connective pinned to `та` (matches the ratified example literally,
//    not the mechanical і/й rule). A cadence count uses `кожні N
//    <genitive-plural-or-singular per §6's paucal table>`.
// 7. Month reference — §5: a month attached to a day number is genitive
//    (`1 січня`); a bare month RANGE is genitive both ends (`з червня до
//    серпня включно`); a bare month LIST repeats the locative preposition
//    per item (`у січні, у квітні, у липні й у жовтні`, decision text of
//    §5 — see flagged inconsistency #2 below, since §5's own inline
//    example does not actually repeat `у`).
// 8. Union frame (DOM-or-DOW, playbook `union-connective`) — §7:
//    event-framed clause `щоразу, коли настає X або Y`, both arms
//    NOMINATIVE (grammatical subjects of "настає"), never genitive (the
//    genitive is reserved for the *adverbial* "on the last Friday of the
//    month" reading used outside a union). `shared-qualifier-scope`: a
//    restricted month fronts once, set off by a comma before the union
//    clause, on both a single month, a range, a list, and the parity
//    idiom — matching the donor's own comma placement exactly.
// 9. Confinement — §8: a coarser restricting field under a finer cadence
//    is genitive-subordinated / stated as an explicit range, never a
//    second bare juxtaposed cadence word.
//
// Two notes.md-internal inconsistencies pinned here rather than silently
// resolved one way or the other — flagging for the language owner:
//   (1) §2's own ratified list example (`першого, п'ятнадцятого і
//       двадцять першого числа`) keeps `і` even though `п'ятнадцятого`
//       ends in a vowel, which by §3's stated mechanical і/й rule should
//       soften to `й`. This batch follows the literal ratified example
//       (`і`) for bare-DOM ordinal lists specifically, not the mechanical
//       rule.
//   (2) §5's "Bare MONTH LIST" decision is *worded* as "repeated locative
//       preposition per item," but its own inline example
//       (`у січні, квітні, липні й жовтні`) shows the preposition only
//       once. This batch follows the *worded* decision (repeats `у` on
//       every item: `у січні, у квітні, у липні й у жовтні`) since the
//       decision text's reasoning (explicitly likened to fr/pt's per-item
//       repetition) reads as the intended rule and the inline example
//       looks like a stale/unedited leftover.
//
// One judgment call not dictated by notes.md, made for internal
// consistency and flagged here:
//   - A minute-of-hour or second-of-minute LIST/RANGE, when its
//     containing field (hour, or minute) is otherwise a bare wildcard,
//     gets one trailing scope adverb (`щогодини`, `щохвилини`) — the
//     Ukrainian functional equivalent of the donor's "past the hour" /
//     "past the minute" tail (exactly one recurring-scope word per
//     description, at the level immediately above the constrained
//     field — the same slot the donor's "every day" fills for an
//     hour-of-day list). When the containing field is instead an
//     explicit range (e.g. an hour range under a minute list), the range
//     itself supplies that scope and no adverb is added (would be
//     redundant — playbook `redundancy`).
//   - A midnight RANGE BOUNDARY (start of an hour range at 00:00) uses
//     the numeral fallback (`0:00`), not a genitive `півночі`: bare
//     `північ` is a genuine homonym with "north" (the same false-friend
//     risk §1 flags for `південь`/noon, one case-form removed), so this
//     batch sidesteps it exactly the way §1 already sidesteps noon.
//     `опівночі` (the fixed adverb, unambiguous) is kept for every
//     EXACT-midnight, non-range occurrence.
//
// ---------------------------------------------------------------------

// == from complex/lists/strings.js ==

export const secondLists = [
  ['0,30 * * * * *', 'о 0-й та 30-й секунді щохвилини'],
  ['5,10,15 * * * * *', 'о 5-й, 10-й та 15-й секунді щохвилини'],
  ['0,15,30,45 * * * * *', 'о 0-й, 15-й, 30-й та 45-й секунді щохвилини']
];

export const minuteLists = [
  ['0,30 * * * *', 'о 0-й та 30-й хвилині щогодини'],
  ['1,2,3 * * * *', 'о 1-й, 2-й та 3-й хвилині щогодини'],
  ['4,6,9 * * * *', 'о 4-й, 6-й та 9-й хвилині щогодини'],
  ['0,15,30,45 * * * *', 'о 0-й, 15-й, 30-й та 45-й хвилині щогодини']
];

export const hourLists = [
  ['0 9,17 * * *', 'щодня о 9:00 та 17:00'],
  ['0 0,12 * * *', 'щодня опівночі та о 12:00 дня'],
  ['0 9,12,17 * * *', 'щодня о 9:00, 12:00 дня та 17:00']
];

export const dateLists = [
  ['0 0 1,15 * *', 'першого і п\'ятнадцятого числа опівночі'],
  ['0 0 1,15,31 * *',
    'першого, п\'ятнадцятого і тридцять першого числа опівночі']
];

export const monthLists = [
  ['0 12 * 6,12 *', 'щодня у червні й у грудні о 12:00 дня'],
  ['0 12 * 1,4,7,10 *',
    'щодня у січні, у квітні, у липні й у жовтні о 12:00 дня'],
  ['0 12 * JAN,JUL *', 'щодня у січні й у липні о 12:00 дня']
];

export const weekdayLists = [
  ['0 14 * * MON,WED,FRI', 'по понеділках, середах і п\'ятницях о 14:00'],
  ['0 14 * * 1,3,5', 'по понеділках, середах і п\'ятницях о 14:00']
];

export const minuteListWithinHourRange = [
  ['1,2,5 9-17 * * *', 'о 1-й, 2-й та 5-й хвилині з 9:00 до 17:00 включно']
];

// == from complex/ranges/strings.js ==

export const secondRanges = [
  ['0-30 * * * * *', 'щосекунди з 0-ї до 30-ї включно щохвилини'],
  ['10-20 * * * * *', 'щосекунди з 10-ї до 20-ї включно щохвилини']
];

export const minuteRanges = [
  ['0-29 * * * *', 'щохвилини з 0-ї до 29-ї включно щогодини'],
  ['1-5 * * * *', 'щохвилини з 1-ї до 5-ї включно щогодини']
];

export const hourRanges = [
  ['0 9-17 * * *', 'щогодини з 9:00 до 17:00 включно'],
  // Range-start midnight: numeral fallback, not genitive «півночі» —
  // see the north/midnight-homonym note above.
  ['0 0-5 * * *', 'щогодини з 0:00 до 5:00 включно']
];

export const dateRanges = [
  ['0 0 1-15 * *', 'з першого до п\'ятнадцятого числа включно опівночі'],
  ['0 0 10-20 * *', 'з десятого до двадцятого числа включно опівночі']
];

export const monthRanges = [
  ['0 12 * 6-8 *', 'щодня з червня до серпня включно о 12:00 дня'],
  ['0 12 * JAN-MAR *', 'щодня з січня до березня включно о 12:00 дня']
];

export const weekdayRanges = [
  ['0 9 * * MON-FRI', 'з понеділка до п\'ятниці включно о 9:00'],
  ['0 9 * * 1-5', 'з понеділка до п\'ятниці включно о 9:00']
];

// == from complex/quartz.js ==

// L: the last day of the month.
export const quartzL = [
  ['0 0 L * *', 'останнього дня місяця опівночі'],
  ['0 0 L 6 *', 'останнього дня червня опівночі'],
  ['0 0 L 1-3 *',
    'останнього дня кожного місяця з січня до березня включно опівночі'],
  ['*/15 * L * *', 'кожні 15 хвилин останнього дня місяця'],
  ['0 0 L-5 * *', 'за п\'ять днів до останнього дня місяця опівночі'],
  ['0 0 L-1 * *', 'за один день до останнього дня місяця опівночі']
];

// LW: the last weekday (business day) of the month.
export const quartzLW = [
  ['0 0 LW * *', 'останнього робочого дня місяця опівночі'],
  ['0 0 WL * *', 'останнього робочого дня місяця опівночі']
];

// W: the weekday (business day) nearest a date.
export const quartzW = [
  ['0 0 15W * *', 'найближчого робочого дня до п\'ятнадцятого числа опівночі'],
  ['0 0 1W * *', 'найближчого робочого дня до першого числа опівночі'],
  // The `Wn` spelling (W before the day) is accepted alongside `nW`.
  ['0 0 W15 * *', 'найближчого робочого дня до п\'ятнадцятого числа опівночі']
];

// nL: the last <weekday> of the month.
export const quartzNL = [
  ['0 0 * * 5L', 'останньої п\'ятниці місяця опівночі'],
  ['0 0 * * FRIL', 'останньої п\'ятниці місяця опівночі'],
  ['*/15 * * * 5L', 'кожні 15 хвилин останньої п\'ятниці місяця'],
  ['0 0 * 6 5L', 'останньої п\'ятниці червня опівночі'],
  ['0 0 * 1-3 5L',
    'останньої п\'ятниці кожного місяця з січня до березня включно опівночі'],
  ['0 0 * */2 5L', 'останньої п\'ятниці кожного непарного місяця опівночі'],
  // Bare quartz weekday `L` alias (no leading n#) is Saturday — a plain
  // solo recurring weekday, so it takes §4's по+locative marking like any
  // other trailing recurring weekday, not the genitive "last X" frame.
  ['0 0 * * L', 'по суботах опівночі'],
  // The `7`-for-Sunday alias inside a Quartz weekday resolves to Sunday.
  ['0 0 * * 7L', 'останньої неділі місяця опівночі']
];

// n#m: the nth <weekday> of the month.
export const quartzNthWeekday = [
  ['0 0 * * 1#2', 'другого понеділка місяця опівночі'],
  ['0 9 * * MON#2', 'другого понеділка місяця о 9:00'],
  ['0 0 * * 0#1', 'першої неділі місяця опівночі'],
  ['0 0 * * 4#5', 'п\'ятого четверга місяця опівночі'],
  // The `7`-for-Sunday alias inside an nth-weekday form resolves to Sunday.
  ['0 0 * * 7#2', 'другої неділі місяця опівночі']
];

// ?: no specific value (Quartz mode).
export const quartzNoSpecificValue = [
  ['0 12 ? * MON', 'по понеділках о 12:00 дня', {quartz: true}],
  ['0 12 15 * ?', 'п\'ятнадцятого числа о 12:00 дня', {quartz: true}]
];

// ?: rejected by default — only the lenient-mode fallback row is a
// description (a run() row); the two error() assertions ('Quartz token'
// for '0 0 ? * 2' and '0 0 1 * ?') are error-message checks, not schedule
// descriptions, and are skipped — see the report for why.
export const quartzLenientFallback = [
  ['0 0 ? * 2', 'нерозпізнаваний шаблон cron', {lenient: true}]
];

// Quartz day-of-week numbering (1=Sun..7=Sat in quartz mode). The three
// error() rows checking out-of-range values (0, 8, 10) are skipped — see
// the report.
export const quartzWeekdayNumbering = [
  ['0 0 ? * 1', 'по неділях опівночі', {quartz: true}],
  ['0 0 ? * 2', 'по понеділках опівночі', {quartz: true}],
  ['0 0 ? * 7', 'по суботах опівночі', {quartz: true}],
  ['0 0 ? * MON', 'по понеділках опівночі', {quartz: true}],
  ['0 0 1 * ?', 'першого числа опівночі', {quartz: true}]
];

// Quartz weekday operators reindex too (nL, n#k).
export const quartzWeekdayOperators = [
  ['0 0 ? * 6L', 'останньої п\'ятниці місяця опівночі', {quartz: true}],
  ['0 0 ? * 2#2', 'другого понеділка місяця опівночі', {quartz: true}],
  ['0 0 ? * L', 'по суботах опівночі', {quartz: true}],
  ['0 0 ? * 1/2',
    'по вівторках, четвергах, суботах і неділях опівночі', {quartz: true}]
];

// date-or-weekday union (playbook `union-connective` +
// `shared-qualifier-scope`) — §7's event-framed clause, both arms
// nominative (subjects of "настає"); a restricted month fronts once,
// comma-set-off, before the union clause, on every shape (single, range,
// list, parity idiom) — never stranded onto one arm only.
export const dateOrWeekday = [
  ['0 0 L * MON',
    'опівночі щоразу, коли настає останній день місяця або понеділок'],
  ['0 0 13 * 5L',
    'опівночі щоразу, коли настає тринадцяте число місяця або остання ' +
    'п\'ятниця місяця'],
  ['0 0 13 6 5L',
    'у червні, опівночі щоразу, коли настає тринадцяте число місяця або ' +
    'остання п\'ятниця місяця'],
  ['0 0 13 1-3 5L',
    'з січня до березня включно, опівночі щоразу, коли настає тринадцяте ' +
    'число місяця або остання п\'ятниця місяця'],
  ['0 0 13 1,7 5L',
    'у січні й у липні, опівночі щоразу, коли настає тринадцяте число ' +
    'місяця або остання п\'ятниця місяця'],
  ['0 0 13 */2 5L',
    'у кожному непарному місяці, опівночі щоразу, коли настає тринадцяте ' +
    'число місяця або остання п\'ятниця місяця']
];

// Skipped rows, with reasons — for coverage-parity accounting.
export const skipped = [
  {
    section: 'short option',
    pattern: '0 0 * * 5L',
    donorExpected: 'on the last Fri of the month at midnight',
    opts: {short: true},
    reason: 'notes.md has no ratified abbreviated weekday/month form for ' +
      'uk (ratified sections cover clock, ordinals, connectives, ' +
      'recurrence marking, numerals, union frame — none address a ' +
      '`short` abbreviation register). Inventing one here would be an ' +
      'unratified addition, not a translation of a ratified convention.'
  },
  {
    section: '?: rejected by default (error assertions)',
    patterns: ['0 0 ? * 2', '0 0 1 * ?'],
    reason: 'error() rows check a thrown error-message substring ' +
      '("Quartz token"), not a rendered schedule description — out of ' +
      'scope for a descriptive-prose corpus translation.'
  },
  {
    section: 'Quartz weekday numbering (error assertions)',
    patterns: ['0 0 ? * 0', '0 0 ? * 8', '0 0 ? * 10'],
    reason: 'error() rows for out-of-range quartz weekday values — error ' +
      'validation text, not a schedule description.'
  },
  {
    section: 'invalid Quartz forms (error assertions)',
    patterns: [
      'L * * * *', '0 0 L,15 * *', '0 0 15W,3 * *', '0 0 32W * *',
      '0 0 L-31 * *', '0 0 W * *', '0 0 * * 1#6', '0 0 * * 8L',
      '0 0 * * 1#'
    ],
    reason: 'bare error() pattern list with no expected value at all — ' +
      'not description rows.'
  }
];
