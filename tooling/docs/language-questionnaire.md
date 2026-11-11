# The language questionnaire

A new language starts here, not from another language's renderer or corpus.
Answer every question for the target language in
`src/lang/<code>/answers.md`, repeating each question's number. The answers,
the lexicon and the paradigms are the durable description of the language;
its renderer is built from them and must be rebuildable from them.

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

The patterns in brackets are prompts: say each one aloud in the language.

## 1. Anchors

1.1 Which style authorities does this language answer to?

1.2 Which choices would a copy editor in this language make differently
from house to house? Typical ones: 12-hour or 24-hour clock; full or short
names for weekdays and months; the order of day and month. List each as an
option with its values and its default. An option may change words and the
form of one phrase. It may never change the order or structure of the
sentence.

1.3 Which regional variants differ enough to need their own answers?

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

4.4 **A day and a month.** Are they one date phrase? [`0 0 1 1 *`]
[`0 0 1 1,7 *`]

4.5 Are there other pairs of fields this language says as one phrase?

## 5. Idioms

An idiom is a fixed, shorter way of saying a particular set. For each one
the language has, give the phrase and the exact set of values it stands
for.

5.1 Odd and even. [`0 0 */2 * *`] [`0 0 2/2 * *`]

5.2 Working days and the weekend. [`0 9 * * 1-5`] [`0 9 * * 0,6`]

5.3 Noon and midnight. Are they names for a moment only, or for an hour?
[`0 0 * * *`] [`0 12 * * *`] [`30 0 * * *`]

5.4 On the hour, half past, quarter past and to. [`0 * * * *`]
[`30 * * * *`] [`15,45 * * * *`]

5.5 Every other, every third. [`0 */2 * * *`] [`0 0 * */2 *`]

5.6 Named parts of the day, if the language uses them instead of or beside
a.m. and p.m. Give each one's hours.

5.7 Quartz forms: the last day, the nearest working day, the nth weekday of
the month. [`0 0 L * *`] [`0 0 15W * *`] [`0 0 * * 1#2`] [`0 0 * * 5L`]

5.8 Any other fixed phrase a speaker would reach for.

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

6.5 The function words the answers above use (at, on, in, every, from, to,
through, and, or, except), each with its spoken length.

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

8.8 `sentence-wrapper-punctuation` — When a description becomes a complete
sentence, what lead and closing punctuation does it take, and what happens
when the description already ends in an abbreviation's full stop?

8.9 `cardinality-rendering` — When is a stepped or listed field said as a
cadence and when as an enumeration? Answer by spoken length across the
members of a family, not by a count chosen in advance.
[`0 0 1 */3 *`] [`0 0 1 */6 *`] [`0 */6 * * *`] [`0 */8 * * *`]
