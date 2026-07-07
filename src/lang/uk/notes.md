# Українська (uk) — Language Notes (Stage 1: Conventions — RATIFIED)

**donor: en.** No validated same-family (Slavic) sibling exists yet in
cronli5, so per the pipeline's donor rule (`tooling/docs/language-pipeline.md`
§Donor selection) the primary donor is **English, the universal anchor**: its
`Schedule`/plan structure, the OR-union frame, confinement, and
cadence-vs-enumeration transfer as *structure*; Ukrainian's own words,
morphology, and case system are authored fresh against that structure. This
doc starts from [`../en/notes.md`](../en/notes.md)'s style contract and
records **only where Ukrainian genuinely diverges**.

Every item that was marked **CONTESTED** in the Stage-1 draft went to the
blind 3-persona uk-native Sonnet panel; this revision replaces each contested
item with the panel's **majority verdict**. Stage 1 is now closed — Stage 2
(corpus translation) proceeds against the decisions below, not against the
candidate lists that produced them.

## Anchors

en anchors dialect to a style guide per axis (`us` → CMOS, `gb` → Guardian,
`house` → cronli5's own voice). Ukrainian has **no comparable register split**
for schedule prose — there is one standard modern literary Ukrainian
(sometimes called *літературна норма*), governed loosely by the current
orthography (Ukrainian National Commission on Spelling, 2019) and by
established technical/official-document convention for dates and time. **No
`us`/`gb`/`house`-style dialect axis is proposed for `uk` at first release.**
A future diaspora or regional register could become a dialect axis later, the
same way `gb`/`house` sit beside en's `us` default, but nothing here motivates
one yet.

## 1. Clock format and time-of-day words — RATIFIED

en: lowercase "9 a.m." (us), closed-up "9am"/"5.30pm" (gb), "9:30 AM" (house);
on-the-hour drops minutes; "noon"/"midnight" (us) vs "midday"/"midnight" (gb).

Ukrainian has no AM/PM tradition to inherit — the 24-hour clock is the norm in
official, technical, and transit registers, with the preposition **о** (or
**об** before a vowel-initial number word, e.g. "об одинадцятій") governing
the fixed time expression.

**Decision: digital colon, unpadded hour** — `о 9:30`, `о 14:00`, seconds
`о 9:30:15`. This matches transit boards and software UIs and is the closest
structural mirror of en's compact clock; it was the panel's unanimous choice
over the spelled-units formal/legal register (`о 9 годині 30 хвилин`) and
over padded digital (`о 09:30`).

**On-the-hour keeps the minutes** (`о 14:00`, not a bare `о 14`) — it does
**not** drop them the way en drops "a.m." minutes. The panel's own worked
examples kept the trailing `:00`; the colon notation has no idiomatic
bare-hour shorthand for Ukrainian to drop to the way "9 a.m." does.

**Exact midnight/noon — decision: asymmetric wording.** **опівночі** ("at
midnight") for exact 00:00, but the numeric **о 12:00 дня** for exact noon.
Midnight's adverb is unambiguous and universally used in speech, so it is
kept; noon's counterpart **полудень** is comparatively bookish/rare, and
**південь** is a false-friend trap — it is the compass direction "south," not
"noon," and must never be used here even though a naive translation
temptation exists. The numeric fallback sidesteps both problems for noon
while keeping the idiomatic adverb where it is unambiguous.

## 2. Ordinal forms — RATIFIED

en: bare day-of-month always keeps an ordinal ("on the 1st and 15th") in every
dialect; month-day dates follow the dialect's cardinal/ordinal rule
("January 1" us vs "1 January" gb vs "January 1st" house).

Ukrainian dates are *read* as a genitive ordinal regardless of how they are
written ("1 січня" is spoken "першого січня" — first-GEN of.January-GEN), so
the "cardinal vs ordinal" axis en has doesn't exist the same way; the real
question was how a **bare day-of-month** (no month attached, e.g. cron's "on
the 1st and the 15th" reading of `0 0 1,15 * *`) is written.

**Decision: the fully spelled ordinal word** — `першого`, `п'ятнадцятого
числа`, list `першого, п'ятнадцятого і двадцять першого числа`. This is the
most natural spoken register and was the panel's majority pick over the
digit + hyphenated genitive ending (`1-го`, `15-го`, `21-го числа` —
official-document convention, but reads mechanically once cadence and clock
phrases in the same sentence are already spelled out in words) and over the
digit + hyphenated nominative ending (`1-ше`, `15-те` — wrong case for a
governed phrase like "on the 1st").

**Not contested — forced by grammar:** when a day number is paired with a
month, the month name is genitive, no exceptions: `1 січня` ("January 1"),
`15 квітня` ("April 15"), `29 лютого` ("February 29"). There is exactly one
correct case here.

## 3. List/range connectives — RATIFIED (range)

en: serial commas (us) vs none (gb); "through" (us, inclusive-leaning) vs
"to" (gb, exclusive) vs a hyphen (house) for ranges.

**"And" is not contested** — Ukrainian's і/й/та alternation is a mechanical
euphony rule, not a style choice: **і** is the default, it softens to **й**
after a preceding vowel sound, and **та** is a register-neutral substitute
used mainly to avoid repeating **і** twice in one clause. A renderer applies
this rule uniformly.

**Range connective — decision: `з … до … включно`** ("from … to … inclusive").
This is Candidate A's connective (the one modern style guides recommend)
plus an explicit inclusiveness tag, **включно**, appended whenever the
boundary fire is meant to count — e.g. "з 1-го до 15-го числа включно",
"з 9:30 до 18:00 включно". It resolves cron's `range-boundary` trap by
construction: rather than picking one silently-inclusive or
silently-exclusive connective the way en does, Ukrainian makes
inclusiveness lexically explicit on every range. The panel majority favored
this over the bare `з … до …` (ambiguous without the tag) and over the
traditional `з … по …` idiom — still common in everyday speech, but flagged
by modern style guides as a calque under Russian influence, which tipped the
panel away from it despite its inclusive-by-default reading.

Applied everywhere: clock ranges, weekday ranges, and date ranges all use
`з … до … включно` when the closing boundary counts as a fire.

## 4. Recurrence marking — RATIFIED

en's playbook trap `recurrence-marking`: a trailing recurring day is
plural/marked ("on Mondays"), a range or leading form stays singular ("Monday
through Friday", "every Monday").

**Decision: `по` + locative plural** — `по понеділках` ("on Mondays"),
extending to a list by repeating the case: `по понеділках і середах` ("on
Mondays and Wednesdays"). The panel was unanimous on this device: it is the
structural mirror of en's plural marking, it is the form transit/class
schedules already use, and it generalizes cleanly to lists and to the
DOM-or-DOW union frame (§7).

**Amended round 3 (2026-07-04):** a weekday RANGE fires every week too, and
the originally-proposed unmarked genitive range partner (`з понеділка до
п'ятниці включно`) turned out to have the same misreading the trailing
position was fixed to avoid — it reads as one closed interval, not a weekly
recurrence. A blind panel re-litigated this and replaced it: `по` + locative
plural now covers **every** recurring weekday qualifier — solo, list, *and*
range — with a Mon–Fri range using the lexicalized `по буднях` ("on
weekdays") and any other weekday range enumerating its covered days as a
по+locative-plural list (`по вівторках, середах і четвергах` for Tue–Thu).
Only the forced accusative single dated occurrence (`у понеділок`, §5) and
the union-predicate frame's nominative arm (already recurrence-marked by
its enclosing `щоразу`, §7/§8) keep an unmarked partner form now — see
"Reconciled round 3" below for the full verdict and row count.

Rejected: `що` + weekday genitive singular (`щопонеділка`) — idiomatic for
some weekdays but uneven across all seven (`щонеділі` risks misreading as
"every week" rather than "every Sunday," since неділя historically/dialectally
means "week"), and it composes awkwardly in a list, repeating the що- prefix
per item. `кожного` + weekday genitive singular (`кожного понеділка`) —
unambiguous but reads more formal/legalistic than the winning form for the
common trailing/marked case.

## 5. Weekday/month name forms and grammatical case — mostly forced, one ratified list-case rule

**Not contested — forced by declension**, the citation (nominative) forms
are: weekdays понеділок, вівторок, середа, четвер, п'ятниця, субота, неділя;
months січень, лютий, березень, квітень, травень, червень, липень, серпень,
вересень, жовтень, листопад, грудень. Case then depends mechanically on
syntactic role, exactly one correct form per role:

- A month attached to a day number is **genitive** (`1 січня`, `15 квітня`
  — §2).
- A single dated weekday occurrence is **accusative** with **у/в**
  (`у понеділок` — "on [that] Monday").
- A weekday or month **range** takes **genitive on both ends** with
  `з … до … включно` (`з понеділка до п'ятниці включно`, `з січня до
  березня включно` — §3).
- Standalone reference to a month (no day number attached) is **locative**
  with **у/в** (`у січні`, `у лютому`, `у травні` — note the locative stem
  can differ from the genitive stem, e.g. genitive `лютого` vs locative
  `лютому`; this is ordinary declension, not a rendering choice).

**Bare MONTH LIST — decision: repeated locative preposition per item.**
`у січні, квітні, липні й жовтні` ("in January, April, July and October").
The panel favored this unanimously: it matches fr/pt's per-item repetition
of an article/preposition, keeps every item self-standing, and preserves the
mid-sentence "in" reading that a bare nominative citation-form list (`січень,
квітень, липень, жовтень`, no preposition) would drop.

## 6. Numeral government and agreement (paucal/plural classes) — forced by grammar, not contested

Ukrainian cardinal numerals govern the case *and* number of the noun that
follows them, with no stylistic freedom — exactly one correct surface form
per value, so this is **not** a panel question, but the renderer must
implement the full paradigm faithfully:

| numeral | governs | example (хвилина, fem.) | example (день, masc.) |
|---|---|---|---|
| 1 | nominative singular, numeral agrees in gender | одна хвилина | один день |
| 2–4 (and any number ending 2–4, except 12–14) | genitive singular | дві хвилини, три дні, двадцять чотири хвилини | два дні, двадцять два дні |
| 5–20, 0, and any number ending 5–9 or 0, and always 11–14 | genitive plural | п'ять хвилин, одинадцять хвилин, двадцять п'ять хвилин | десять днів, дванадцять днів |
| 21, 31, … (ends in 1, not 11) | nominative singular | двадцять одна хвилина | тридцять один день |

Gender matters only for the "1" and "2" forms: **хвилина** (minute),
**секунда** (second), **година** (hour) are feminine → одна/дві; **день**
(day), **тиждень** (week), **місяць** (month), **рік** (year) are masculine →
один/два. This must be threaded through every cadence count ("every N
minutes/hours/days") and every duration phrase (the digits-everywhere
decision in §8 governs *whether* these counts are spelled or digitized —
the underlying case/number agreement is unaffected either way). The
adverbial "every-unit" forms (щохвилини, щогодини, щодня, щотижня,
щомісяця, щороку, щосекунди) bypass the numeral-agreement table entirely —
they are fixed genitive-singular adverbs used only for the *unmarked* N=1
cadence ("every minute," not "every one minute"); a stepped cadence with N>1
switches to the кожні+numeral+governed-noun construction (`кожні 5 хвилин`,
`кожні 2 години`, per §8). This N=1-vs-N>1 fork is the direct Ukrainian
analog of en's own minimal pair `1/3 * * * *` ("singular in step offsets");
see the minimal-pairs list below.

## 7. The union frame's wording (playbook trap `union-connective`) — RATIFIED

en resolved cron's DOM∨DOW inclusive union with a **predicate over one
variable**: "whenever the day **is** the 13th or a Friday" — `or` reads as a
logical disjunction because both arms are values of one noun ("the day"),
not two competing actions.

**Decision: the event-framed clause** — `щоразу, коли настає 13-те число
місяця або п'ятниця` ("each time the 13th of the month or Friday occurs"),
worked against en's own example pattern (`0 0 13 * FRI`). The panel majority
found this the safest comprehension result: framing both arms as things that
*occur* keeps the inclusive-union reading unambiguous without leaning on a
connective whose logical force a reader has to infer.

Rejected: the copula-predicate calque (`щоразу, коли число місяця — 13 або
п'ятниця`) — a direct structural mirror of en's frame, but it reads stiffer
in native Ukrainian idiom than the event-framed clause. The `або … або`
bracket correlative (`або 13-го числа, або в п'ятницю`) — Ukrainian's natural
either/or correlative, but it can carry an *exclusive*-or flavor in strict
logical registers, risking a pick-one misread of exactly the kind en's
`union-connective` trap warns against.

The **shared-qualifier-scope** trap's fix carries over unchanged: a
restricted month shared across both arms is fronted once, before the union,
never left trailing on one arm only — e.g. "у січні, щоразу коли настає
13-те число місяця або п'ятниця," never a form that strands "у січні" onto
only the Friday arm.

## 8. How each playbook trap resolves in Ukrainian

| trap | resolution |
|---|---|
| `union-connective` | §7 — event-framed clause, ratified |
| `shared-qualifier-scope` | front the shared qualifier (month, restricted weekday) once before the union, same rule as en/fr/pt; Ukrainian's free word order makes fronting easy and unambiguous |
| `confinement-vs-juxtaposition` | Ukrainian's genitive case is itself a subordination marker: `щосекунди кожної години` ("every second, **of** every hour" — кожної is genitive) reads as confinement, not two independent cadences, with no extra word needed beyond choosing genitive over a second bare nominative adverb (`щосекунди, щогодини` would wrongly juxtapose) — one correct case, not a style choice |
| `redundancy` | same hunt-and-drop discipline as en: no repeated locative scope, no cadence implied twice, no restated qualifier |
| `range-boundary` | §3 — `з … до … включно`, applied to every range (clock, weekday, date) uniformly, ratified |
| `recurrence-marking` | §4 — `по` + locative plural for the trailing/marked position, ratified |
| `numeral-register` | below — digits everywhere, ratified |
| `sentence-wrapper-punctuation` | moot — the ratified clock (§1, digital colon) has no trailing abbreviation period to double up against wrapper punctuation |
| `cardinality-rendering` | inherits en's per-field cadence-vs-enumeration split (a stepped field with few, named values enumerates; an open step reads as cadence); the concrete Ukrainian list case is §5's ratified month-list rule |

**Numeral-register (playbook trap `numeral-register`) — RATIFIED.** en spells
small cadence counts ("every five minutes") but uses digits for a list
position ("at 5 and 10 minutes past"). **Decision: digits everywhere** —
`кожні 5 хвилин`, `о 5-й та 10-й хвилині`. The panel majority favored
scannability and consistency with a technical/precision register — cron
output is inherently a technical artifact — over mirroring en's
spelled-small-number cadence. This governs cadence counts and non-DOM list
positions (e.g. minute-of-hour positions); it does **not** override §2's
separately-ratified bare-day-of-month rule, which stays the fully spelled
ordinal regardless of how small the number is — §2 and this rule cover
different syntactic roles and were decided independently.

## Minimal pairs (ratified forms for pairs.js, translating en's own set)

* `1 1 * * * *` — singular agreement: `одна хвилина й одна секунда`
  ("one minute and one second") — both feminine, both nominative singular
  (§6).
* `1/3 * * * *` — singular in step offsets: `починаючи з першої хвилини`
  ("from the first minute") — mirrors en's own N=1 minimal pair; tests
  whether the renderer correctly special-cases N=1 against the кожні+plural
  cadence machinery (§6, §8).
* `0 12 * * *` vs `0 0 * * *` — noon/midnight word pair: `о 12:00 дня` vs
  `опівночі` (§1, ratified asymmetric decision).
* `30 9 * * MON-FRI` — range connective: `з 9:30 до 18:00 включно` (§3,
  ratified).

## Reconciled (2026-07-04)

`test/lang/uk/corpus.js` had drifted into four internally-contested forms as
its ten translation batches accumulated (each batch made its own local call
on an axis notes.md left implicit or only illustrated by a loose inline
example). A 3-persona uk-native Sonnet panel reviewed each contested class
and the corpus was normalized to the majority verdict, applied mechanically
to every row of that class — no row's *meaning* changed, only which
already-legal Ukrainian surface form expresses it. Recorded here so a future
translation batch does not reintroduce the losing form.

* **Hour-range bounds — winner: digital (`з 9:00 до 17:00 включно`).**
  Votes: digital, digital, genitive-ordinal (2–1). A handful of early rows
  rendered an hour-field RANGE as a genitive-ordinal window
  (`з 9-ї до 17-ї години включно`) instead of §1's ratified digital clock.
  The hour-field LIST enumeration (`9-ї, 11-ї, 13-ї, 15-ї й 17-ї години`,
  §8) is a different construct and is untouched — this verdict is scoped to
  RANGE boundaries only. 18 rows changed.
* **Final-list connective — winner: i-with-euphonic-j (mechanical §3
  everywhere).** Votes: ta-everywhere, i-with-euphonic-j, i-with-euphonic-j
  (2–1). The minute/second/hour digit+ordinal-suffix list device (e.g.
  `о 5-й та 10-й хвилині`) had pinned its connective to `та`, reasoning that
  it matched a ratified inline example literally rather than applying §3's
  mechanical і/й alternation the way every other list in the corpus does.
  The panel majority preferred one uniform mechanical rule with no
  construct-specific carve-out. Every `та` used as a list connective was
  replaced by the mechanical form: `і` by default, softening to `й` only
  when the immediately preceding token ends in a vowel sound (a `-ї`
  ordinal-suffix token, `хвилини`, `дня`, `опівночі`, `включно`); a `-й`
  ordinal-suffix token or a digital clock value (ends in a digit) keeps `і`,
  per the same rule already applied to every other list in the corpus. This
  does **not** touch the separately-documented, still-open bare
  day-of-month ordinal list exception (`і` invariantly, per §2's own inline
  example) — that was never one of the four reconciled classes. 88
  occurrences of `та` changed to `і`/`й` (79 same-line, 9 split across a
  string-concatenation line break); the bare day-of-month list's `і`
  exception and the pre-existing (non-`та`) `включно і`/`включно й` split
  elsewhere in the corpus are unrelated to this verdict and were left as
  found.
* **Midnight range start — winner: digital-zero (`з 0:00 до … включно`).**
  Votes: digital-zero, genitive-pivnochi, digital-zero (2–1). Several rows
  (mostly in later, denser batches) used the genitive adverb-derived
  `з півночі до …` for an hour-range's *start* boundary at 00:00, which is
  exactly the false-friend homonym risk (`північ` = "north") this batch's
  own header comment already flags and resolves the other way — the digital
  numeral fallback `0:00` was already the documented intent
  (`test/lang/uk/corpus.js`'s own inline note above `hourRanges`), just not
  applied consistently downstream. The unrelated exact-midnight (non-range)
  adverb `опівночі` is untouched — this verdict is scoped to range-boundary
  positions only. 18 rows changed.
* **Union-predicate date-ordinal register — winner: digit-ordinal
  (`1-ше число місяця`, `13-те число місяця`).** Unanimous, 3–0. Inside the
  event-framed union clause (§7, `щоразу, коли настає <day predicate>`),
  some rows spelled the day-of-month predicate as a full genitive-style
  ordinal word (`перше число місяця`, `тринадцяте число місяця`) instead of
  the digit-ordinal form §7's own ratified worked example already uses
  (`13-те число місяця`). This is scoped to the union predicate only: a
  bare (non-union) day-of-month reference keeps §2's fully spelled genitive
  ordinal (`першого числа`) unchanged — the two rules govern different
  syntactic roles and are not in tension. 23 rows changed (17 `перше` →
  `1-ше`, 6 `тринадцяте` → `13-те`).

A grep-based consistency lint (`грep` for `перше число`, `тринадцяте число`,
`з півночі до`, ` та ` as a list connective, and the literal genitive-ordinal
hour-range substring `-ї до …-ї години`) against `test/lang/uk/corpus.js`
returns zero matches outside of prose comments after this reconciliation.

## Reconciled round 3 (2026-07-04)

A whole-corpus consistency audit surfaced six further self-contradictions —
two genuine DESIGN questions the trap-retry panel exposed (a weekday
range/set's recurrence marking; a discrete hour list's surface form), plus
four more batch-local drafting splits the audit found by grouping every row
by construction. Each went to the same blind 3-persona uk-native Sonnet
panel as round 2; the corpus was normalized to each verdict, applied
mechanically to every affected row — no row's *meaning* changed, only which
already-legal Ukrainian surface form expresses it.

* **Weekday recurrence marking — winner: `по` + locative plural
  (unanimous, 3–0).** A weekday RANGE or SET fires every week, but the
  round-1/round-2 form for a range (`з понеділка до п'ятниці включно`,
  §4's original text) reads as one closed interval, not a weekly
  recurrence — the same misreading §4 already fixed for a solo or listed
  weekday. The panel's winning device generalizes §4 to ranges too: the
  lexicalized `по буднях` ("on weekdays") for a Mon–Fri range specifically,
  and a по+locative-plural enumeration of the covered days for any other
  weekday range (`по вівторках, середах і четвергах` for Tue–Thu, etc.).
  This does **not** touch the union-predicate frame's nominative range arm
  (`будь-який день з вівторка до четверга включно`, §8) — that clause is
  already recurrence-marked by its enclosing `щоразу`, so it keeps the
  genitive range reading; the two rejected candidates (a `що`-prefix
  device, and `кожного` + genitive singular) were rejected for the same
  reasons §4 already gives for the solo/list case. §4 is amended
  accordingly. **28 rows changed**: 23 plain Mon–Fri ranges → `по буднях`;
  1 Fri–Sun range → `по п'ятницях, суботах і неділях`; 1 Mon–Sat range
  (`1/1`) → `по понеділках, вівторках, середах, четвергах, п'ятницях і
  суботах`; 1 Fri–Mon wraparound range → `по п'ятницях, суботах, неділях і
  понеділках`; 2 Mon–Wed partial-range rows (each paired with a separate
  trailing single day, kept as an independent segment per the corpus's own
  "independent branches keep their own form" convention) → `по
  понеділках, вівторках і середах`.
* **Hour-list vs range surface — winner: `o-hodyni-ordinal`, i.e.
  `о X-й і Y-й годині` (unanimous, 3–0).** A discrete hour LIST confining a
  finer minute/second cadence (`кожні 15 хвилин ...`) had been drafted in
  four different surface forms across batches — bare genitive-ordinal
  (`9-ї й 17-ї години`), `протягом` + genitive (`протягом 9-ї й 17-ї
  години`), and `протягом годин` + digital clock (`протягом годин 9:00 і
  17:00`), the last of which reuses the RANGE window's own digital-clock
  surface and so can misread as continuous coverage rather than discrete
  points. The panel's winning device treats the confining hour list as a
  clock ANCHOR the same way a single hour already is (`о 9-й годині`),
  extended to a list: `о 9-й і 17-й годині`. An hour RANGE is untouched —
  it keeps `з … до … включно` (§3) exactly as before; only the discrete
  LIST surface changes. Special-value hours (0 → `опівночі`, 12 → `о 12:00
  дня`, §1) keep their own adverb/numeral inside the list instead of an
  ordinal, exactly as a bare hourList already does. **13 rows changed**
  across the minute-cadence-confined-by-hour-list constructs (batch-1's
  seconds/minute confinements, batch-6's minute-step-across-hours,
  batch-8's minute-range/minute-wildcard-under-hour-list groups, and one
  compound-cadence row).
* **`протягом` vs bare minute confinement — winner: majority (unanimous,
  3–0).** A single or listed MINUTE value confining a finer seconds
  cadence is `протягом`-marked everywhere in the corpus except a handful
  of rows drafted early (batch-1's `seconds cadence — confinement &
  redundancy` and `batch 2` groups, and two `secunds-compose`/year-fold
  rows), which used the bare genitive with no `протягом` at all. The
  majority `протягом X-ї хвилини` form is now applied uniformly; an HOUR
  confinement is a separate, unaffected construct and keeps its own bare
  genitive-ordinal + "години" (per the hour-list verdict above, an hour
  LIST additionally gets the `о`+ordinal anchor treatment — but that is a
  distinct axis from whether `протягом` marks a MINUTE confinement).
  **9 rows changed.**
* **Quartz last-of-month adverbial — winner: minority
  (`останнього числа`, votes 2 minority – 1 majority).** A plain,
  unqualified quartz `L` (last day of the month, no month attached, no
  `L-N` offset) had been drafted two ways: `останнього дня місяця` (the
  majority, by row count) and the bare `останнього числа` (the minority,
  drafted once in a later batch). The minority form actually matches §2's
  own established bare-day-of-month convention (`першого числа` never
  says `місяця`), so the panel preferred consistency with that existing
  rule over the more literal, but redundant, `дня місяця` phrasing. Scope
  is exactly the bare, unqualified `L`: once a month is attached
  (`останнього дня червня`) or an `L-N`/"N days before" offset landmark is
  named (`за п'ять днів до останнього дня місяця`), `дня <referent>` stays
  — those need to name what the landmark is, which `числа` alone cannot
  do. **3 rows changed.**
* **Day-of-month step: nominative vs genitive — winner: majority
  (unanimous, 3–0).** One row (`0 0 */2 1 *`) had been drafted with the
  DOM step in the nominative (`кожен другий день у січні`) while every
  other DOM-step row in the corpus uses the genitive-subordinated form
  (`кожного другого дня ...`, matching §8's genitive-confinement
  principle). Not a real design question — a single drafting slip,
  corrected to the corpus's own overwhelming majority. **1 row changed.**
* **Minute/second-list trailing scope adverb — winner: majority
  (unanimous, 3–0).** A bare second list under an otherwise-wildcard
  minute field (or a bare minute list under an otherwise-wildcard hour
  field) takes a trailing scope adverb (`щохвилини`/`щогодини`) in the
  established majority (see `secondLists`/`minuteLists` below) — three
  rows in the input-normalization batch (list sorting, duplicate-branch
  merging, step-branch-in-list) had been drafted with no adverb at all,
  reading as an untethered list with no stated recurrence scope.
  **3 rows changed.**

A grep-based consistency lint of `test/lang/uk/corpus.js` for the six
losing forms — the data-row substring `з понеділка до п'ятниці включно`
(the JS-escaped apostrophe form), a bare `протягом годин \d` digital hour
list not part of a `з … до … включно` range, a bare single/list minute
confinement with no `протягом` (excluding hour confinement and cadence-step
`кожної N-ї хвилини` forms), `останнього дня місяця` on an unqualified,
month-free, offset-free `L` row, the nominative `кожен другий день`, and a
bare trailing-adverb-free minute/second list under a wildcard containing
field — returns zero matches outside of prose comments (which quote the
superseded forms only to explain what changed) after this reconciliation.

## Reconciled round 4 (2026-07-06)

A whole-corpus self-consistency audit split every remaining oracle
contradiction into (a) majority classes — a handful of rows carrying a
minority surface form against an overwhelming, already-passing corpus
majority, normalized mechanically to the majority — and (b) genuinely open
design questions, each put to the blind 3-persona uk-native Sonnet panel and
normalized corpus-wide to the winner. Rows whose failures are RENDERER
defects (the ten renderer-bug classes tracked for the TDD round: short
option, folded-clock double preposition, dense-union hour-list genitive,
renderer-side cardinal-plural lists, і/й-before-digit softening, quartz-W
phrase case, sec+min duration degenerate, hour-window-outlier degenerate,
опівночі-vs-опівнічної-години confinement, починаючи-clause commas) were NOT
touched — the corpus stays the spec and the renderer chases it. No row's
*meaning* changed anywhere below; only which already-legal Ukrainian surface
form expresses it.

### Majority-normalized classes

* **Fallback wording — `нерозпізнаний шаблон cron`.** Corpus count 6:1 (all
  six dedicated fallback rows pass); the one lenient-quartz row
  (`0 0 ? * 2` `{lenient}`) said `нерозпізнаваний` and normalizes. 1 row.
* **Hour-list anchor stragglers — `о 9-й і 17-й годині`.** Round 3 ratified
  the о+ordinal anchor (3–0) for a minute-level cadence/range confined by a
  discrete hour list; four rows still carried the LOSER bare-genitive /
  `протягом` forms (`9-ї й 17-ї години`). 10 winner rows vs 4 leftovers;
  the 4 normalize. Seconds-cadence hour confinements (`щосекунди протягом
  9-ї й 17-ї години`, `* 0-30 9,17`) are the round-3-scoped separate
  construct and are untouched. 4 rows.
* **Minute/second list device — ordinal singular, zero as `0-й`.** Corpus
  counts 68+54 ordinal-singular vs 6+4 cardinal-plural; `о 0-й` 13 vs bare
  `о 0` 8. The cardinal-plural / bare-zero rows normalize (`о 0-й, 15-й,
  30-й і 45-й хвилині`), including five previously-passing cardinal-plural
  rows that now flip red for the renderer TDD (`0,30 9-17`, `0,30 8-18/2`,
  `5,30 0 9-17`, `5,30 0 */2`, `5,30 5 */2`). The `*/45 … 15W` row keeps
  its cardinal list for now — it is a quartz-W renderer-bug row. 8 rows.
* **Euphonic й in month lists.** `й <vowel-final month-locative>` 16:1;
  `у березні і вересні` → `у березні й вересні`. 1 row.
* **Bare-DOM ordinal list keeps invariant `і`.** The documented §2
  exception (5:1); `десятого й тринадцятого числа` → `десятого і
  тринадцятого числа`. 1 row.
* **`числа` presence on bare DOM anchors/ranges.** Solo anchors with
  `числа` 21+ vs 3 bare; tagged ranges 4 vs 2 bare. Six rows gain `числа`
  (and the two month-range rows the renderer's comma: `першого числа,
  з січня …`). 6 rows.
* **Union parity arm names the referent — `непарний/парний день місяця`.**
  16:4; the four bare `день` arms normalize. 4 rows.
* **Union date-ordinal register — `13-те число місяця`.** Round-2 verdict
  (unanimous) whose 23-row normalization missed two batch-5 rows spelling
  `тринадцяте число`; counts 15+32 digit-ordinal vs 2. 2 rows.
* **Dated DOM is a digit — `13 січня`.** Digit+genitive-month 27 vs
  spelled-ordinal 2; `тринадцятого січня, …` → `13 січня, …`. 2 rows
  (these two also picked up the day-repetition winner below).
* **Single `о` heads a clock list.** Mid-list `, <H:MM>` 24 vs `, о <H:MM>`
  7; `і <H:MM>` 37 vs `і о <H:MM>` 13; two of the four offending rows were
  contradictory duplicates of the passing `0 9,17 * * *` key. 4 rows.
* **No comma before a trailing recurring-weekday qualifier.** 41:6;
  `включно, по буднях` → `включно по буднях` on the `*/15 9-17 * * MON-FRI`
  row (its direct twin already passes). 1 row.
* **No comma before the `щоразу` union frame.** 91:4; `опівночі, щоразу` /
  `включно, щоразу` normalize (three rows plus the stray comma on the
  quartz-W `*/45 …` row, whose other defects stay with its renderer-bug
  class). 4 rows.
* **No comma before sentence-final (or pre-year) `опівночі`.** ~80:10 for
  the position; seven failing rows plus two previously-passing comma'd rows
  (`0 0 1-5,15 * *`, `0 0 * 1-3,6 *`) normalize and flip red for TDD. The
  `0 0 1 1-11/3 *` row keeps its comma per the day-repetition panel
  winner's exact sentence. 9 rows.
* **Digit-cadence + clock offset takes no comma — `кожні 3 години
  починаючи з 2:00`.** Conditioned 2:1 (both no-comma rows pass); the
  comma belongs only to the ordinal frame (`кожної N-ї години,
  починаючи`). 1 row.
* **Leading last-weekday anchor is genitive — `останньої п'ятниці січня
  опівночі`.** Role-conditioned 7:1 (the accusative `в останню п'ятницю`
  form is the trailing-qualifier role only). 1 row.
* **`по понеділках`, never `кожного понеділка`.** 52:1 and §4's explicit
  rejection of the `кожного` device. 1 row.
* **Fixed second under a fixed minute: the combined-anchor form (`о 9-й
  хвилині і 30-й секунді, щогодини`) loses everywhere; the replacement
  splits by what follows.** The 6:1 device count that killed it mixes two
  shapes: with a day qualifier (or a second LIST) the second-anchor +
  `протягом` confinement wins (`о 15-й секунді протягом 30-ї хвилини,
  щогодини по понеділках`), but for the BARE single-second row the corpus's
  own register is §6's ratified nominative duration (`30 хвилин і 15
  секунд кожної години`, the `одна хвилина й одна секунда` minimal pair),
  2:1 over the anchor form — so the one rewritten row reverts to it. Worth
  a look in the re-panel round: the classifier flagged the nominative as
  reading like an amount of time rather than a schedule point, but no
  panel has judged it. 1 row.
* **Year-range comma — `о 12:00 дня, з 2030 до 2035 року включно`.**
  Contradictory duplicate keys: the batch-10 copy of
  `0 0 12 25 12 * 2030-2035` lacked the comma its passing batch-2 twin
  has (2:1). 1 row.
* **Merged single minute leads with the adverb — `щогодини о 5-й
  хвилині`.** The `5,5 * * * *` duplicate-merge row must render
  byte-identically to its merged twin `5 * * * *` (2:1). 1 row.

### Panel-decided classes (blind 3-persona uk-native Sonnet panel)

* **Hour-window end under a filling cadence — winner: exclusive next
  boundary (`щохвилини з 9:00 до 18:00`), 3–0.** A wildcard minute (or
  wildcard second+minute) cadence that fills an hour window names the end
  as the exclusive next hour, no `включно` — absence of the tag reads
  exclusive by construction (§3). Losers: inclusive hour-field value
  (`до 17:00 включно`) and last-actual-fire (`до 10:59 включно`). A single
  filled hour keeps the genitive confinement (`щохвилини 9-ї години`,
  `опівнічної години`) — unchanged, and reasserted by the
  midnight-confinement renderer-bug class. 5 rows changed
  (`* * 9-17 * * *` ×2, `0 * 9-17 * * *`, `* 9-10 * * *`,
  `*/15 * 9-17 * * *`).
* **Bounded cadence-range under a wildcard container — winner: noun +
  `включно` + genitive scope (`щосекунди з 0-ї до 30-ї хвилини включно
  кожної години`), 2–1** over noun+включно with the scope unstated. The
  range end always carries its noun (`хвилини`/`секунди`), `включно` sits
  before the scope, and the containing wildcard scope is always named, as
  the genitive confinement (`кожної години`/`кожної хвилини`), never the
  adverb. 20 rows changed (noun-dropped `з 0-ї до 30-ї включно щохвилини`
  forms, scope-unstated `1/1`/`5-30/1`/wrap-range/merged-range rows,
  `кожної години включно` orderings, and the one adverb-scoped
  `включно, щохвилини 9-ї години` row).
* **List anchor's trailing scope — winner: genitive confinement
  (`о 0-й, 17-й, 34-й і 51-й хвилині кожної години`), 2–1** over the bare
  adverb; the comma-delimited `, щогодини` drew no votes. Zero in such a
  list is `0-й`, never bare `0`. This supersedes the round-3 preference
  for the trailing adverb on bare lists: every minute/second LIST under a
  wildcard container now names its scope as `кожної години`/`кожної
  хвилини`. Single-value anchors are untouched (they keep their ratified
  adverb forms, e.g. `щогодини о 5-й хвилині`, `о 15-й секунді щохвилини
  по понеділках`). 13 rows changed.
* **Bare month list preposition — winner: single `у` heads the list
  (`щодня у січні, квітні, липні й жовтні о 12:00 дня`), 3–0.** §5's
  decision *text* ("repeated per item") loses to §5's own worked example
  and the corpus majority; the four repeated-`у` rows normalize. §5's
  wording should be read accordingly. 4 rows.
* **Trailing month/DOM qualifier after a `з … до … включно` hour window —
  winner: comma attachment, bare DOM reads `числа місяця`
  (`щогодини з 9:00 до 17:00 включно, тринадцятого числа місяця`), 1–1–1
  split resolved for the batch-2 majority form.** Every trailing month,
  dated-day, or day-of-month qualifier directly after an hour window now
  attaches with a comma; a bare numbered DOM in that position carries
  `місяця`. The bare quartz-`L` keeps round 3's `останнього числа`
  (comma only). 11 rows changed. PROVISIONAL: the panel gave each
  candidate one vote, so this stands on the batch-2 corpus majority alone —
  re-panel it (fresh personas, full sentences) before beta sign-off.

### Deferred (no verdict this round)

* **Comma before a `протягом` minute confinement after a preceding
  range/anchor clause.** The corpus ties 2–2 (`включно, протягом` vs
  `включно протягом`) and 3–3 (`секунді, протягом` vs `секунді протягом`),
  split cleanly along batch lines, and the round-4 panel cap deferred it.
  Until re-panelled, rows drop the comma: after this round's other
  normalizations the corpus majority is 6:3 for the bare join, and the
  round-4-ratified second-anchor device (`о 30-й секунді протягом 9-ї
  хвилини кожної години`) itself joins bare. Provisional — flip corpus-wide
  if the re-panel disagrees.
* **Hour list containing 0 under a finer cadence — winner: adverb midnight
  + digital partner (`кожні 10 секунд о 0-й хвилині, опівночі й о 13:00`),
  2–1** over an all-ordinal list including `0-й`. Matches §1's
  special-value rule the bare hour lists already follow. 1 row.
* **Step-enumeration cap — split winner, 1–1–1 resolved as: cadence +
  bounded range for the 11-value second range (`кожні 2 секунди з 0-ї до
  20-ї секунди включно`), enumeration for the 4-value minute offset
  (`о 5-й, 20-й, 35-й і 50-й хвилині`).** Below the collapse threshold a
  stepped field enumerates; a long bounded step reads as a bounded
  cadence. 2 rows changed (`0-20/2 …` dense row; `0-10 5/15 9-20,22 LW`
  dense row).
* **Fixed day + month list — winner: repeat the day per month
  (`1 січня, 1 квітня, 1 липня й 1 жовтня, опівночі`), 2–1** over stating
  the day once and distributing. Applied to the two dated month-step rows
  (which simultaneously moved to the digit register above:
  `13 січня, 13 квітня, 13 липня й 13 жовтня опівночі`). 2 rows.

A grep lint for the losing forms above (`нерозпізнаваний`, the straggler
`хвилин 9-ї й 17-ї години` / `включно, протягом 9-ї й 17-ї`, `хвилинах`/
`секундах` cardinal-plural lists, bare `о 0 `/`о 0,` list zeros,
`у березні і вересні`, `десятого й тринадцятого`, bare `першого о`,
`(не)парний день або`, `тринадцяте число`, `тринадцятого січня`,
repeated `о` in the four clock-list rows, `включно, щоразу`/`опівночі,
щоразу`, the seven+two final `, опівночі` commas, `години, починаючи з
2:00`, `в останню п'ятницю січня`, `кожного понеділка`, `о 9-й хвилині і
30-й секунді`, the comma-free `дня з 2030`, `о 5-й хвилині, щогодини`,
`до 10:59`, noun-dropped `-ї включно що…`, `кожної години/хвилини
включно`, `включно щохвилини/щогодини`, list `…і N-й (хвилині|секунді)
що(години|хвилини)`, repeated `у` month lists, `о 0-й і 13-й годині`,
`20 секундах`, `кожні 15 хвилин починаючи з 5-ї`, and the un-comma'd
`включно у/першого/тринадцятого/1/13/останнього/кожного другого`
window-qualifier joins) returns zero data-row matches, with exactly these
expected survivors: prose comments; the quartz-W renderer-bug row's
`о 0 і 45 хвилинах` (its fix belongs to that class's TDD); the two
seconds-cadence hour-confinement rows (`* 0-30 9,17`, `* * 9,17`) that
round 3 scoped as a separate construct; single-value anchors and
hour-range-scoped lists (out of the list-scope class); the ordinal-frame
`кожної N-ї години, починаючи` comma; the P8-endorsed `1 січня, 1 квітня,
1 липня й 1 жовтня, опівночі`; the `починаючи з …, опівночі` closing
comma; and the untouched short-option block.
