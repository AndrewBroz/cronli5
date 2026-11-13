# The language questionnaire

A new language starts from itself: not from another language's renderer,
corpus or rule book, and not from this questionnaire either.

## First, the usage notes

Before any question here is answered, `src/lang/<code>/usage.md` is
written, in the language, by a writer briefed in the language who is told
nothing of cron, of this project or of any other language. It describes
how the language already writes times that recur, in text made to be read
(timetables, opening hours, programme listings, notices, reminders), and
it is organised the way the language itself thinks about time: what units
and groupings its readers have, in what order information comes, what is
ambiguous and how careful writers cure it, what sounds natural and what
sounds official or translated, and which authority sets the norms.

The notes exist because every question below was written in English, and
a question carries its author's categories with it. "Weekdays and the
weekend", "noon and midnight", "half past", even "a long list is hard to
hold" are how one language cuts time and judges effort. An author who
only answers questions fills another language's categories with native
words, and the result has an accent. Only two things are the same for
every language: the facts of the pattern (which moments fire) and the
reader's task (say the description, work out when it fires, keep its
parts in mind). How easy each of those is depends on how the language
says a thing, so it is observed in the language, never assumed.

## Then, the questions

Answer every question for the target language in
`src/lang/<code>/answers.md`, repeating each question's number. The
questions exist for coverage: a pattern can hold every kind of set they
name, so the rule book must say what the language does with each. They
are not a list of concepts the language is expected to have. The usage
notes, the answers, the lexicon and the paradigms are the durable
description of the language; its renderer is built from the last three
and must be rebuildable from them.

Rule books written before 2026-11-13 keep the earlier numbering of
section 5 and have no usage notes, until their native review.

## How to answer

* **Answer in the speaking voice.** Every example is what a native speaker
  would *say aloud* to a colleague, not what reads compactly on a page. A
  list of day numbers is short in characters and long in speech.
* **Answer for families, not rows.** Where a question gives several
  patterns, say them one after another and check that only the part that
  changed in the pattern changed in the sentence.
* **Conditions are about meaning, never spelling.** `*`, `*/1` and `0-59`
  are the same minutes and must be said the same way. If an answer depends
  on something, name the fact about the *set of times* it depends on.
* **Record the reason for each taste call**, so a fluent reviewer can
  overturn it later.
* **Say "cannot be said naturally" when that is the answer.** A device the
  language lacks is information, not a gap to paper over.
* **Start from the usage notes, and answer what the language has.** Where
  a question presupposes a notion the language does not have, say so and
  describe what its readers have instead. Where the language has a
  grouping, an order or a way of counting that no question asks about, add
  it: the rule book is not limited to the questions.

The patterns in brackets are prompts: say each one aloud in the language.

## 1. Anchors

1.1 Which style authorities does this language answer to?

1.2 Which choices would a copy editor in this language make differently
from house to house? Typical ones: 12-hour or 24-hour clock; full or short
names for weekdays and months; the order of day and month. List each as an
option with its values and its default. An option may change words and the
form of one phrase. It may never change the order or structure of the
sentence.

These choices become the fields of the language's style table, which a
caller overrides field by field. Name each field, the kind of value it
takes, and its default. Every language states two: `hour12` (12-hour times
or 24-hour, and which is the default here) and `short` (short names for
weekdays and months, and what, if anything, else abbreviates with them).

1.3 Which regional variants differ enough to need their own answers? Give
each its region code (`GB` in `en-GB`) and the fields of the style table it
sets differently. A caller selects one with the language code.

## 2. Frame

The frame is the one order and nesting in which the time, the day, the month
and the year are said. A language has one.

2.1 Say these four aloud and give the order of the parts.
[`0 9 * * *`] [`*/15 9-17 * * 1-5`] [`0 0 1 * *`] [`* * * * *`]

2.2 Add a month, then a weekday, then both, to the first of them. Where
does each new part go? Did anything already there move?
[`0 9 * 6 *`] [`0 9 * * 1`] [`0 9 * 6 1`]

2.3 Add a seconds field. Where does it attach, and does the rest of the
sentence stay as it was?
[`30 0 9 * * *`] [`*/6 0 9 * * *`] [`* 0 9 * * *`]

2.4 Is there any family where the natural order of parts differs from 2.1?
Give the family, both orderings said aloud for every member, and why the
single order of 2.1 fails. A second order is adopted only on this evidence.

2.5 A time of day followed directly by a month or a year skips the days.
Does a listener need them said ("every day")? Say each aloud with and
without, and state the condition on the set of hours, so that a schedule
running round the clock is not given a daily rhythm it does not have.
[`0 9 * * *`] [`0 9 * 6 *`] [`0 0 9 * * * 2030`] [`0 9-17 * * *`]
[`*/5 * * 6 *`] [`0 */6 * * *`]

## 3. Devices, field by field

For each of second, minute, hour, day of month, month and weekday, say how
the language expresses each of the following, and mark any it cannot say
naturally. Every condition is about the set of values, never about how the
pattern was written.

3.1 **Every value.** [`* * * * *`] [`0 * * * *`]

3.2 **One value.** [`30 * * * *`] [`0 9 * * *`] [`0 0 15 * *`]
[`0 0 * 6 *`] [`0 0 * * 1`]

3.3 **A list of values.** Two, then three or more. How are they joined?
[`0,30 * * * *`] [`0 8,12,18 * * *`] [`0 0 1,10,20 * *`] [`0 0 * * 1,3,5`]

3.4 **A range.** Is the end included in the wording? [`0-29 * * * *`]
[`0 9-17 * * *`] [`0 0 1-7 * *`] [`0 0 * 6-8 *`] [`0 0 * * 1-5`]

3.5 **A range that wraps around.** [`0 22-2 * * *`] [`0 0 * 11-2 *`]

3.6 **A range and a stray value.** [`0-29,45 * * * *`] [`0 9-17,22 * * *`]

3.7 **An even cadence.** [`*/15 * * * *`] [`0 */2 * * *`] [`0 0 */5 * *`]
[`0 0 1 */3 *`]

3.8 **A cadence that does not divide evenly, or starts off the beat.**
[`*/7 * * * *`] [`5/15 * * * *`] [`0 1/2 * * *`]

3.9 **A set with one value missing.** Would a speaker name what is missing,
or list what is there? Try two missing, then three. Where does naming the
exceptions stop being what a person would say?
[`0,15,45 * * * *`] [`0 0,2,4,6,10,12,14,16,18,20,22 * * *`]
[`0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *`] [`0 0 1 1-11 *`]
[`0 0 * * 1-6`]

3.10 For each device above, how many items can a listener hold before a
speaker would switch to another device? Answer from how it sounds, and say
how you checked.

What is held is half the measure. For each device also say what a listener
has to work out: exact times need nothing, a cadence needs arithmetic, an
exception needs subtraction. Compare these directly, changing nothing else:
[`0 */6 * * *` against its four times] [`23 */6 * * *` as a cadence with a
start, as four times, and with the minute said apart from the hours]

3.11 Which pairs of phrasings are equally easy, if any? A language may
have none: a pair is a tie only if a reader of this language gets the
schedule as surely and as quickly from either. List them by the form of
the set, not by its values. For these pairs only, the phrasing that mirrors
how the field was written is said (the core reports which kind of
description each field was written as). Everywhere else the easier
phrasing is said however the pattern was written.
[`0 */12 * * *` against `0 0,12 * * *`]

## 4. Fusions

A fusion is where two fields are said as one phrase.

4.1 **Clock times.** When do a minute and an hour become a time of day?
How many times of day would a speaker list before switching to something
else? [`30 9 * * *`] [`0,30 9 * * *`] [`0 9,17 * * *`] [`0,30 9,17 * * *`]
[`*/15 9-17 * * *`]

4.2 **Seconds on a clock time.** [`15 30 9 * * *`]

4.3 **A day of the month and a weekday together.** Cron fires when *either*
matches. How does the language say that so it is heard as "either", not as
"both" and not as a choice? [`0 0 1 * 5`] [`0 0 1,15 * 1-5`]

Some schedulers fire only when *both* match. No renderer says this yet,
but answer it now, so the answer exists when the option does: how does the
language say a weekday that falls on a date? [`0 0 13 * 5`, both: Friday
the 13th] [`0 0 1-7 * 1`, both: the first Monday]

4.4 **A day and a month.** Are they one date phrase? [`0 0 1 1 *`]
[`0 0 1 1,7 *`] And a year: a full date, a month with a year, a year
alone, several years, a cadence of years.
[`0 0 0 1 1 * 2030`] [`0 0 9 * 6 * 2030`] [`0 0 9 * * * 2030`]
[`0 0 9 * * * 2030,2035`] [`0 0 9 * * * 2030/2`] [`0 0 9 * * * 2028/4`]

4.5 Are there other pairs of fields this language says as one phrase?

## 5. Groupings and fixed phrases

An idiom is a fixed, shorter way of saying a particular set of moments. A
set earns one only if the phrase means exactly that set to the language's
readers, wherever the language is written.

5.1 From the usage notes, list every grouping and fixed phrase the
language's readers have for a set of moments: of days in the week (which
day the week starts on, the order days are listed in, any word for the
days people work or rest), of hours in the day (named parts of the day,
names for particular moments), of minutes in the hour, of days in the
month, of months in the year, and anything else. For each give the
phrase; the exact set it means; whether that set is the same in every
region where the language is written; and anything it carries that a
pattern does not know (public holidays, a Saturday that counts, a day
that begins at sunset). A phrase that differs by region is either left
unused or made a regional style.

5.2 Patterns often hold the sets below. For each, say whether the language
has a phrase for exactly that set, or a phrase for a different set that
would mislead, or nothing. "Nothing" is a full answer.

* Every second value of a field, from its first or from its second.
  [`0 0 */2 * *`] [`0 0 2/2 * *`] [`0 */2 * * *`] [`0 1/2 * * *`]
  [`0 0 1 */2 *`]
* Runs and pairs of days of the week. Which of these, if any, is a unit
  to the language's readers depends on their week. [`0 9 * * 1-5`]
  [`0 9 * * 0-4`] [`0 9 * * 1-6`] [`0 9 * * 0,6`] [`0 9 * * 5,6`]
  [`0 9 * * 6-1`]
* The first moment of the day and its middle. Is there a name, is it a
  moment or a stretch, and which day does the first moment belong to when
  it stands beside a date? [`0 0 * * *`] [`0 12 * * *`] [`30 0 * * *`]
  [`0 0 1 * *`]
* The start of each hour and fixed points inside it. [`0 * * * *`]
  [`30 * * * *`] [`15,45 * * * *`]

5.3 Forms some schedulers add. These are facts about days, fixed by the
scheduler whatever the local week or calendar: the last day of the month;
so many days before the last; the day from Monday to Friday nearest a
date, never leaving the month (so, from the 1st, the month's first such
day), firing only in months that have that date; the last such day of the
month; the nth of a weekday in the month; the last of a weekday in the
month. Say each exactly. A word for "working day" is right here only if
it means Monday to Friday, and nothing more, to every reader.
[`0 0 L * *`] [`0 0 L-3 * *`] [`0 0 15W * *`] [`0 0 1W * *`]
[`0 0 31W * *`] [`0 0 LW * *`] [`0 0 * * 1#2`] [`0 0 * * 5L`]

## 6. Words

6.1 What is the unit of spoken length in this language: syllables, morae,
or characters of a syllabic script?

6.2 The numbers 0 to 59 as cardinals, and 1 to 31 in the form dates use,
each with its spoken length. Note where a number is read differently in a
time, a date or a count.

6.3 Names of months and weekdays, full and short, each with its spoken
length. Is the short form ever spoken, or only written?

6.4 Units (second, minute, hour, day, month, year) in every form the
answers above use.

6.5 The function words, particles or endings the answers above use, each
with its spoken length.

## 7. Agreement

7.1 Plural categories, and which numbers take which.

7.2 Case, gender and number: what does each device in section 3 require of
the unit and of the numeral? What does each preposition in 6.5 govern?

7.3 Contraction and fusion of prepositions with articles.

7.4 How a list is joined: the separator, the final connective, and whether
a comma comes before it.

7.5 Anything attached to a numeral: suffixes, ordinal marks, hyphenation.

7.6 Script matters: direction, numeral system, spacing, and how embedded
digits behave in right-to-left text.

## 8. Traps

Each of these has cost an earlier language. The full statement of each is in
`.claude/skills/add-language/playbook.md` under the same identifier.

8.1 `union-connective` — With a day of the month and a weekday both set,
which connective or construction is heard as "either one", and which
obvious choices are misheard? (See 4.3.)

8.2 `shared-qualifier-scope` — When a time or a month applies to both sides
of an "either", where must it sit so it is heard as applying to both?
[`0 0 1 6 5`]

8.3 `confinement-vs-juxtaposition` — Under "every second" or "every
minute", a coarser restriction *confines* the fine cadence. How is that
said so it is not heard as two separate schedules?
[`* 0 9 * * *`] [`* 9 * * *`]

8.4 `redundancy` — Which words in the answers so far earn nothing and
should be dropped: a repeated "of the month", a cadence implied by a finer
one, a restated scope?

8.5 `range-boundary` — For a cadence inside a window of hours, is the close
of the window said as the last firing or as the moment the window ends?
Choose one convention and use it everywhere. [`*/15 9-17 * * *`]

8.6 `recurrence-marking` — How does the language mark that a weekday
recurs: a plural, a particle, a distributive form? Does the marking differ
between a single day, a list and a range? [`0 9 * * 1`] [`0 9 * * 1,3`]
[`0 9 * * 1-5`]

8.7 `numeral-register` — Are counts and positions said in different forms
("every five minutes" against "at 5 past")? Decide for each role.

8.8 `sentence-wrapper-punctuation` — A description is presented in three
forms: a fragment to embed in another sentence, a label standing alone,
and a complete sentence. How is a label capitalised, if the script has
capitals? When a description becomes a complete sentence, what lead and
closing punctuation does it take, and what happens when the description
already ends in an abbreviation's full stop?

8.9 `cardinality-rendering` — When is a stepped or listed field said as a
cadence and when as an enumeration? Answer by spoken length across the
members of a family, not by a count chosen in advance.
[`0 0 1 */3 *`] [`0 0 1 */6 *`] [`0 */6 * * *`] [`0 */8 * * *`]
