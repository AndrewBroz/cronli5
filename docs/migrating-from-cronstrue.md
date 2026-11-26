# Migrating from cRonstrue to cronli5

[`cRonstrue`][cronstrue] is the most widely used cron-description library. This
guide is for someone already calling `cronstrue.toString(...)` who is
considering `cronli5`: when it is worth switching, how the API and options map,
and how the output will change so you are not surprised by different strings.

cRonstrue is the right choice for some projects, and this guide says
where. For a side-by-side gallery of the actual output, see the generated
[cronli5 vs. cRonstrue](./cronli5-vs-cronstrue.md) comparison; this guide
links to it rather than duplicating its tables.

## Why migrate (and why not)

**cRonstrue is still a fine choice when:**

* You need a **language `cronli5` doesn't have yet**. cRonstrue carries **39
  locales**, built from per-locale string tables; `cronli5` ships fifteen, each
  a full renderer. If your locale is not on
  [cronli5's list](../README.md#languages), cRonstrue is the pragmatic
  answer.
* Your patterns are **simple English cadences** that divide their unit,
  where the two say the same thing (`*/15 * * * *` is "Every 15 minutes" in
  both), and you don't want to change any output strings.

**`cronli5` is worth switching to when you want:**

* **Descriptions that say when the schedule fires.** cRonstrue describes
  each field on its own, and some of its sentences are false. Each pair
  below is cRonstrue's output, then `cronli5`'s:

  ```js
  // */45 runs at :00 and :45: cRonstrue says "Every 45 minutes"
  cronli5('*/45 * * * *');     // 'at 0 and 45 minutes past the hour'

  // A window under a step: cRonstrue says "between 12:00 AM and 08:59 PM"
  cronli5('23 0-20/2 * * *');
  // 'at 23 minutes past the hour, every 2 hours from 12 a.m. through 8:23 p.m. every day'

  // A day of the month or a weekday: cRonstrue says "on day 1 and 15 of
  // the month, and on Wednesday", which reads as days that are both
  cronli5('0 0 1,15 * 3');     // 'at 12 a.m. on the 1st and 15th of the month as well as on Wednesdays'
  ```

* **One sentence, not one clause per field.** `cronli5` folds fields
  together where cRonstrue joins them with commas ("At 09:30 AM, Monday
  through Friday"):

  ```js
  cronli5('30 9 * * 1-5');     // 'at 9:30 a.m. on weekdays'
  ```

* **Grammatical output in other languages.** cRonstrue translates each
  fragment on its own, so in languages that inflect the fragments often do
  not agree (Czech "Každých 2 minut" for `*/2 * * * *`, and "pouze v Leden"
  for January). Each of `cronli5`'s languages is written as that language
  writes times. The [README](../README.md#why-not-cronstrue) shows both
  libraries side by side, and each [language doc](./lang/) compares every
  pattern with its cRonstrue locale.
* **Control over style.** A style table per language, with every field
  adjustable ([docs/styles.md](./styles.md)). cRonstrue has no style
  switch.

It costs more to ship: ~18&nbsp;KB gzipped with English against
cRonstrue's ~6&nbsp;KB, and ~10&ndash;14&nbsp;KB per further language
([the comparison](./cronli5-vs-cronstrue.md) has the figures).

## The quickest way to switch

`cronli5/compat` takes the same `toString(pattern, options)` call that
cRonstrue does, with the same options:

```js
import cronli5 from "cronli5/compat";

cronli5.toString("0 9 * * 1");                               // 'At 09:00 AM on Mondays'
cronli5.toString("30 17 * * *", { use24HourTimeFormat: true }); // 'At 17:30 every day'
```

It translates the call. The wording is `cronli5`'s, which is the point of
switching; in English it is written in cRonstrue's format, so the change is
in what is said, not in how times look: "09:00 AM" and "02:30 PM", "12:00
PM" and "12:00 AM" rather than "noon" and "midnight", and "Monday through
Friday" rather than "weekdays". Each
cRonstrue option is either mapped onto a
`cronli5` option or, where `cronli5` has no equivalent, **refused with an
error** that says so. It never quietly ignores an option:

<!-- BEGIN GENERATED: cronstrue-options -->
| cRonstrue option | In cronli5 | Notes |
| --- | --- | --- |
| `locale` | `lang` | `pt_BR` becomes `pt-BR`. A language cronli5 does not ship is an error; cRonstrue answers in English. |
| `use24HourTimeFormat` | `style: {hour12: false}` | 24-hour times are zero-padded (`09:00`). |
| `throwExceptionOnParseError` | `lenient: true` when off | cronli5 returns its fallback text, not the parser's message. |
| `dayOfWeekStartIndexZero` | `weekdaysFrom: 1` when off | 1 is Sunday through 7 for Saturday. |
| `trimHoursLeadingZero` | `style: {padHour: false}` | A 12-hour time is written without its leading zero (`9:00 AM`). Refused together with `use24HourTimeFormat`: cronli5's 24-hour times always have one. |
| `verbose` | refused | cronli5 says "every day" where it helps and is otherwise brief. |
| `monthStartIndexZero` | refused | cronli5 always reads 1 as January. |
| `logicalAndDayFields` | refused | cronli5 reads a day of the month and a weekday as "either", as classic cron does. |
| `tzOffset` | refused | cronli5 describes the fields as written and does not shift times. |
<!-- END GENERATED: cronstrue-options -->

`?` in a day field is read as `*` under any settings, as cRonstrue reads
it. A language `cronli5` does not ship is an error; cRonstrue would answer
in English.

When you have time, move to `cronli5`'s own API. `cronli5/compat` bundles
all fifteen languages (~154&nbsp;KB gzipped); the main entry bundles only the
languages you import, and it is what the rest of this guide describes.

## Your own house style

cRonstrue writes every description one way. `cronli5` keeps what is said
fixed, since that is what makes a description exact, and leaves how it is
written to you: each language has a table of copy-editor choices, the
fields a house style guide decides. The adapter sets English's to look like
cRonstrue. Your own style can match your guide instead, in every
description your product shows.

Start from a named table, then change the fields your guide differs on:

```js
import cronli5 from 'cronli5';

const plain = { midday: '', midnight: '', weekWords: false };
const ops = { hour12: false, short: true };

cronli5('0 12 * * 1-5');                             // 'at noon on weekdays'
cronli5('0 12 * * 1-5', { lang: 'en-GB' });          // 'at midday on weekdays'
cronli5('0 12 * * 1-5', { style: plain });           // 'at 12 p.m. Monday through Friday'
cronli5('30 17 * * 1,3', { style: ops });            // 'at 17:30 on Mon and Wed'
cronli5('0 9 1,15 * *', { style: { ordinals: true, am: 'AM', pm: 'PM' } }); // 'at 9 AM on the 1st and 15th of every month'
```

Set it once, on an instance, and every call follows it; a call's own
`style` still overrides a field:

```js
import { create } from 'cronli5';
import en from 'cronli5/lang/en';

const describe = create({
  languages: [en],
  options: { form: 'label' },
  styles: { en: { am: 'AM', pm: 'PM', midday: '', midnight: '' } }
});
```

The fields cover the choices style guides make: 12- or 24-hour times, the
meridiem's spelling and spacing, the time separator, the words for 12:00
and 0:00 (or none), "weekdays" and "weekends" or the days by name, the
range word ("through" or "to"), the serial comma, day-first dates,
ordinals, and short names. A field `cronli5` does not have, or a value of
the wrong kind, is an error, not something quietly ignored. Other languages
have their own tables, with the choices their style guides make. Every
field is in [docs/styles.md](./styles.md).

## API mapping

```js
// cRonstrue
import cronstrue from "cronstrue";
cronstrue.toString("0 9 * * 1");          // "At 09:00 AM, only on Monday"

// cronli5
import cronli5 from "cronli5";
cronli5("0 9 * * 1");                      // 'at 9 a.m. on Mondays'
```

### Three forms, not one

This is the difference most likely to break a snapshot test.
`cronstrue.toString` always returns a capitalised description. `cronli5`
returns a lowercase **fragment** by default, so you can put it inside your
own sentence, and offers two more forms:

```js
cronli5("0 0 * * *");                        // 'at midnight every day'
cronli5("0 0 * * *", { form: "label" });     // 'At midnight every day'
cronli5("0 0 * * *", { form: "sentence" });  // 'Runs at midnight every day.'
```

`form: "label"` is the closest to what cRonstrue returns.

### cronli5 also accepts arrays and objects as the pattern

`cronstrue.toString` takes only a string. `cronli5`'s pattern argument is a
string, an **array of fields**, or an **object of named fields** (one
pattern written three ways, not a list of patterns):

```js
cronli5("0 9 * * 1-5");                     // string
cronli5(["0", "9", "*", "*", "1-5"]);      // array of fields, same result
cronli5({ hour: 9, minute: 30 });          // 'at 9:30 a.m. every day'
```

### Error handling

cRonstrue throws by default and turns the error into a description string
when you pass `{ throwExceptionOnParseError: false }`.

`cronli5` also **throws by default**, with a specific error
(`Cronli5InputError`). The `lenient` option returns the language's fallback
description instead:

```js
cronli5("not a cron");
//=> throws Cronli5InputError
cronli5("not a cron", { lenient: true });
//=> 'an unrecognizable cron pattern'
```

Two differences in strictness. cRonstrue describes whatever parses,
including some malformed input; `cronli5` validates. And `cronli5` treats a
bad *option* as a mistake in your code: it throws `Cronli5OptionError` even
in lenient mode, where cRonstrue ignores options it does not know.

## Options

The table under [The quickest way to switch](#the-quickest-way-to-switch)
lists every cRonstrue option and what it becomes. In `cronli5`'s own API
the mapped ones are `lang`, `style: { hour12: false }`, `lenient: true` and
`weekdaysFrom: 1` (or `cron: "quartz"`, which sets that and accepts `?`).

`cronli5` options with no cRonstrue counterpart: `style` (every field of a
language's style table), `form`, `cron`, `questionMark`, `seconds`, `years`,
and `create` for building an instance from the languages you choose.

## Locale &rarr; language

Both libraries name a language by code:

```js
// cRonstrue (the i18n build must be imported for non-English locales)
import cronstrue from "cronstrue/i18n";
cronstrue.toString("0 9 * * 1", { locale: "en" });

// cronli5
import cronli5 from "cronli5";
cronli5("0 9 * * 1", { lang: "en" });      // 'at 9 a.m. on Mondays'
```

`cronli5` gives you three ways to decide what ships, where cRonstrue has
two:

* `cronli5` knows English. Pass any other language as an imported module
  (`lang: uk`), and only what you import reaches your bundle.
* `create({ languages: [uk, de] })` makes an instance that resolves codes
  among the languages you chose.
* `cronli5/all` knows every language, like `cronstrue/i18n`.

A code that names a language the instance does not have is an error that
tells you which import provides it.

The honest trade: cRonstrue ships **far more locales** (39), built from
per-locale string tables. `cronli5` ships fifteen languages, each a full
renderer that says a schedule the way that language says it, not a table
of translated strings. The [README](../README.md#languages) lists what currently
ships.

## Behavior differences to expect

Even where both libraries are "correct", the strings differ. Expect:

* **Style shift.** Clock-first, zero-padded times with uppercase meridiems
  ("At 09:30 AM, Monday through Friday") become prose: "At 9:30 AM Monday
  through Friday" through `cronli5/compat`, and "at 9:30 a.m. on weekdays",
  with `noon`/`midnight` for the edges, in `cronli5`'s own default style
  ([docs/styles.md](./styles.md) has the fields). If you rely on the exact
  output string anywhere (tests, stored copy), update those expectations.
* **Default capitalization.** `cronli5(...)` is lowercase by default; use
  `{ form: "label" }` for cRonstrue's capitalised form.
* **Precision improvements.** Steps that do not divide their unit,
  day-of-month *or* weekday unions, bounded steps and step-range time
  windows render differently &mdash; and more accurately &mdash; in
  `cronli5`. These are the cases in the
  [comparison doc](./cronli5-vs-cronstrue.md); review them so a changed string
  reads as an intentional improvement, not a regression.

[cronstrue]: https://github.com/bradymholt/cRonstrue
