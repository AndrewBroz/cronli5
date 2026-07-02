# The reconciled English voice

One voice across all tiers. The shipped conventions are blessed and kept; the
new rules govern only **dense** crons (3+ cadence fields) and the number policy.

A "cadence field" = a field that fires more than once per cycle: a step
(`*/n`, `a/n`), a range (`a-b`), or a list (`a,b`). A field pinned to a single
value (e.g. `hour = 9`) is an **anchor**, not a cadence.

---

## 1. Number policy (uniform)

**Spell out the *frequency word*; numeralize every *clock/calendar value*.**

- The "how often" quantity is spelled: "every **seven** minutes", "every
  **five** hours", "every **second**", "every **other** hour", "every
  **15** minutes" — except keep the existing rule that step counts of 10 or
  more stay in digits ("every 15 minutes"). So: spell 2–9 ("two", "seven",
  "five"), digits for 10+ ("15", "20").
- Every *value* a field takes — minutes-past, seconds-past, clock times, day
  numbers — is **always a digit**: ":00", ":10", "5 minutes past the hour",
  "the 15th", "9 a.m.".

This kills the shipped inconsistency where seconds read "from **zero** through
**ten** past the minute" but minutes read "from **0** through **30** past the
hour". Both now use digits for the values: seconds "from **:00** through
**:10**", minutes "from **0** through **30** minutes past the hour".

The boundary value of a range is a *value*, so it is a digit. The multiplier in
"every N …" is a *frequency*, so it follows the spell-2-9 rule.

---

## 2. Sub-minute / sub-hour notation (kept, made consistent)

- Seconds within a minute use the **colon-value** form: ":00", ":10". A seconds
  *range* reads "from :00 through :10"; this is the KEPT seconds notation, not a
  bare global `:MM` substitution.
- Minutes-past keep "past the hour": "5 minutes past the hour", "from 0 through
  30 minutes past the hour".
- Confinement words are kept verbatim: "during minute :00", "of the midnight
  hour", "of every other hour", "during the 9 a.m. and 5 p.m. hours".

---

## 3. Hour phrasing (kept)

- **Range** = until-window, end exclusive +1: `9-17` -> "from 9 a.m. until 6
  p.m." Never "to".
- **Step** keeps "through K" at the last fire: `*/5` -> "every five hours from
  midnight through 8 p.m."; `9-17/2` -> "every two hours from 9 a.m. through 5
  p.m."
- **List with an outlier** = run + "plus": `9-20,22` -> "from 9 a.m. until 9
  p.m. plus 10 p.m." The leading contiguous run becomes the until-window
  (end+1: 9-20 -> "until 9 p.m."), and the stray value is appended with "plus".
  This replaces the shipped "… through 8 p.m. and at 10 p.m." / "at 9 a.m.
  through 8 p.m. and at 10 p.m." mixtures.

### Confinement vs. leading frame (the until-window+plus form is for leading frames only)

The until-window + "plus" form above is reserved for when the hour is a
**leading frame** — the coarsest cadence, stated as its own clause at the head
of the time cadences (n5, n7, n22). When the hour is instead a **confinement**
(it does *not* fire on its own cadence but merely restricts a finer cadence —
the minute cadence is the driver), it reads as "during the … hours" and does
**not** use until-window+plus:

- Confinement range -> "through": `9-20` confining a minute cadence reads
  "during the 9 a.m. through 8 p.m. … hours" (last fired hour, like a step).
- Confinement outlier -> joined with "and", not "plus": `9-20,22` ->
  "during the 9 a.m. through 8 p.m. and 10 p.m. hours" (n6).

So the same hour field `9-20,22` renders two ways depending on its role:
leading frame "from 9 a.m. until 9 p.m. plus 10 p.m." (n5/n7) vs. confinement
"during the 9 a.m. through 8 p.m. and 10 p.m. hours" (n6). The until-window
("until", end+1) and "plus" are leading-frame-only signals; "during the …
hours" never borrows them.

---

## 4. Cadence order: coarse-to-fine; nesting (dense only)

### Coarse-to-fine ordering

The time cadences are ordered **coarsest first**: hour cadence, then minute
cadence, then the nested second cadence. The hour frame **leads** the cadences
(right after the anchor); it must **not** trail behind the sub-hour detail.

> "On the weekday nearest the 15th, every five hours from midnight through 8
> p.m., every seven minutes from 0 through 56 minutes past the hour, and within
> each of those minutes, every second from :00 through :10."

This applies to every dense case (n1–n12). The earlier draft trailed the hour
cadence after the nested seconds ("… every second from :00 through :10, every
five hours from midnight through 8 p.m."); that is now wrong — the hour leads.

### Nesting of seconds under minutes

Trigger: **two or more sub-hour cadence fields stacked** (a seconds cadence
*and* a minutes cadence, the classic `0-10 */7 …` shape). When both fire, do
not flat-comma the seconds clause as a co-equal cadence. Instead express
containment: state the minutes cadence, then nest the seconds inside it.

> "every seven minutes from 0 through 56 minutes past the hour, and within each
> of those minutes, every second from :00 through :10"

- The hour cadence comes first (coarse-to-fine), as its own leading clause
  joined with a comma.
- The outer sub-hour cadence (minutes) is stated next with its KEPT "minutes
  past the hour" form.
- The inner cadence (seconds) is introduced with "and within each of those
  minutes," then the KEPT seconds form "every second from :00 through :10". The
  nested second clause is the LAST clause (finest).
- Single-field sub-hour cadences (only seconds, or only minutes) do **not**
  nest — there is nothing to nest inside (e.g. n10 has only a minute cadence).

---

## 5. Anchor-lead (dense only)

Trigger: a **dense** cron (3+ cadence fields) that also has a **calendar/day
anchor** — a restricted day-of-month, day-of-week, or month (`15W`, `LW`, `5L`,
`1,15`, a restricted month, etc.).

Lead with the calendar anchor (and month if restricted), then "," then the time
cadences. This surfaces *which days* before burying it under sub-second detail.

> "On the weekday nearest the 15th, every seven minutes …"
> "On the last weekday of the month, every two hours from 9 a.m. through 5 p.m. …"
> "In January, April, July, and October, on the weekday nearest the 15th, …"

Order inside the lead: **month, then day-anchor** ("In January, … on the last
Friday, …"), matching how the shipped trailing form orders them, just hoisted.

Capitalize the leading word ("On", "In") since it now starts the sentence.

SIMPLE and MEDIUM crons keep the shipped order (trailing anchor): "every Monday
at 9 a.m.", "every five minutes from 9 a.m. until 6 p.m. on Mondays". Anchor-lead
does **not** apply below the dense tier.

---

## 6. Kept conventions (unchanged across all tiers)

- Trailing weekday pluralizes ("on Mondays"); weekday range "on Monday through
  Friday".
- "of the month" drops under an explicit month ("on the last Friday in
  January").
- Minute lists numeralize ("at 5, 10, and 30 minutes past the hour"); clock-time
  list forms ("9:05 a.m., 9:10 a.m., and 9:30 a.m.") unaffected.
- Confinement and redundant-field-drop rules unchanged.

---

## 7. What changes, by tier

- **SIMPLE** (n13, n14): unchanged.
- **MEDIUM** (n15–n22): mostly unchanged. Only n22 changes — the `9-20,22`
  outlier now reads "plus 10 p.m." instead of "and at 10 p.m." (rule 3).
- **DENSE** (n1–n12): all change. They gain (a) anchor-lead, (b) coarse-to-fine
  cadence order with the hour frame leading (rule 4), (c) nesting of the seconds
  cadence under the minutes cadence, (d) the "plus" outlier hour for a *leading*
  hour frame and "during the … hours" (range "through", outlier "and") for a
  *confinement* hour — n6 (rule 3), and (e) digit values for the
  seconds/minutes range bounds.
