# Czech rows: adversarial read 2 (schedule)

Rows judged from the patterns before `answers.md`; then `answers.md`, `usage.md`, the core calendar facts, and last `cs-read-1.md`. No file changed except this report.

## 1. Wrong schedule

Ordered by severity. 1.1 and 1.2 are rows; 1.3 to 1.7 are sentences the rule book produces for patterns no row covers.

### 1.1 An exception on the date arm of a union, base not «all»: read as "never on the 15th"

- `*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5` (visible) → «od pondělí do pátku a navíc každý lichý den v měsíci kromě 15. dne, vždy každých 15 minut od 9:00 do 17:45».
- Pattern: a 15th that falls Monday to Friday fires (weekday arm). Sentence: «kromě 15. dne» is the last thing before «, vždy» and is read over the whole day part: nothing on the 15th. This is the trap the brief names first. The rule book cured it only for an arm whose base is «all» (4.3, «denně, 15. dne v měsíci jen v pátek,») and itself records that the added-together form "was read as … never on the 15th"; the same form is still produced for every other base.
- The rule book gives the same for `0 0 1-12,14-20 * 5` → «každý pátek a navíc od 1. do 20. dne v měsíci kromě 13. dne, vždy v 0:00»: Friday the 13th fires, the sentence says it does not.
- Corrected, exact and with nothing to take back (the date arm only adds on the days the weekday arm lacks):
  «od pondělí do pátku a navíc o sobotách a nedělích, které připadnou na lichý den v měsíci kromě 15. dne, vždy každých 15 minut od 9:00 do 17:45» is exact but heavy. Lighter, keeping the frame: put the exception where it cannot close the day part, and say whose it is:
  «každý lichý den v měsíci kromě 15. dne a navíc každý den od pondělí do pátku (i 15.), vždy každých 15 minut od 9:00 do 17:45».
  Minimum repair in the present order: «od pondělí do pátku a navíc každý lichý den v měsíci (z nich ne 15. dne), vždy …» is still weak; I recommend the form with «(i 15.)» or a general rule "removed days of the date arm, «jen» + the weekday arm", as for base «all»: «od pondělí do pátku a navíc každý lichý den v měsíci, 15. dne ovšem jen od pondělí do pátku, vždy každých 15 minut od 9:00 do 17:45».

### 1.2 Seconds said as «pokaždé o N sekund později» after a head that names firings which do not happen

- `5,15,25 */15 * * * *` → «každých 15 minut, pokaždé o 5, 15 a 25 sekund později».
- `30 */15 * * * *` → «každých 15 minut, pokaždé o 30 sekund později».
- `5/10 */15 9-17 * * 1-5` (visible) → «od pondělí do pátku každých 15 minut od 9:00 do 17:45, pokaždé každých 10 sekund od 5 do 55 sekund později».
- `8 5,30 */2 * * *` → «… vždy 5 a 30 minut po celé hodině, pokaždé o 8 sekund později (poprvé v 0:05:08 …)» (saved by its brackets).
- Pattern: nothing fires at second 0. Sentence: the head states a firing every 15 minutes («od 9:00 do 17:45» names 9:00:00 as a firing), then adds "each time N seconds later". Two readings are open: the firing is shifted (right), or it fires on the minute and again 5, 15 and 25 seconds later (four firings, wrong). The sibling rows with second 0 say «pokaždé v celou minutu a znovu o 30 sekund později», so only the absence of «v celou minutu a znovu» carries the difference between 3 and 4 firings. The rule book's own principle ("nothing is said that the rest of the sentence has to take back") is broken: 9:00 is said and taken back. «o 30 sekund později» in the bare row also has nothing to be later than.
- Corrected, with the place-in-the-minute form S4 already uses:
  «každých 15 minut, vždy 30 sekund po celé minutě»;
  «každých 15 minut, vždy 5, 15 a 25 sekund po celé minutě»;
  «od pondělí do pátku každých 15 minut od 9:00 do 17:45, vždy každých 10 sekund od 5 do 55 sekund po celé minutě (poprvé v 9:00:05, naposledy v 17:45:55)»;
  «… vždy 5 a 30 minut a 8 sekund po celé hodině (poprvé v 0:05:08, naposledy ve 22:30:08)».
- Same defect in the rule's range form without second 0, «pokaždé každou sekundu od 10 do 20 sekund později» (no row).

### 1.3 «každou noc» is given to any wrapped run of hours, whatever hours they are (rule 3.5, no row)

3.5 keeps the wrap whenever no day, month or year is restricted and "the run leaves more than two hours out". Nothing ties it to the night. So:

- `0 10-5 * * *` → «každou noc každou hodinu od 10:00 do 5:00». Fires 10:00 through 23:00 and 0:00 through 5:00 (20 firings). Under «každou noc» a reader takes «10:00» for ten in the evening or gives up.
- `0 6-2 * * *` → «každou noc každou hodinu od 6:00 do 2:00»; `*/15 13-9 * * *` → «každou noc každých 15 minut od 13:00 do 9:45».
- «noc» is a word of the calendar that promises more than the pattern knows (the rule book's seventh principle). The rows that exist (22–2, 22–1, 22–6, 22–5) are right. The rule needs a bound stated on the stretch (for example: it starts at 18:00 or later and ends by 9:59; otherwise the linear form). Corrected for the first: «denně každou hodinu od 0:00 do 5:00 a od 10:00 do 23:00».
- `0 17-5 * * *` → «každou noc každou hodinu od 17:00 do 5:00» is the border case: understood, but 17:00 is not night.

### 1.4 `L-n` with February: the bracket states a date that is wrong one year in four (rule 5.7, no row)

- `0 0 L-3 2 *` → by 5.7 «vždy 3 dny před posledním dnem února (25. února) v 0:00» ("for February the day in a common year"). In a leap year it fires on the 26th. The bracket is an identity, not an example, so the sentence says the 25th every year.
- Corrected: «vždy 3 dny před posledním dnem února (25. února, v přestupném roce 26.) v 0:00».
- `0 0 L-28 2 *`: the rule gives «v přestupných letech vždy 28 dní před posledním dnem února (…)» with "the day in a common year", which does not exist (28 − 28 = 0). The bracket must be the leap-year day: «(1. února)». Whole sentence, plainly: «v přestupných letech vždy 1. února v 0:00» is what is true.

### 1.5 S5 puts the second only into an excepted stretch (rule 4.2, no row)

- `30 */10 0-2,4-23 * * *`: D is «denně každých 10 minut, kromě doby od 3:00 do 3:59». S5 ("S is one second, D shows clock times and no places: every clock time in D shows the second, also after «kromě»") gives «denně každých 10 minut, kromě doby od 3:00:30 do 3:59:30». The head carries no clock time, so the half minute appears only in what is removed: the sentence says it fires on the minute, and that 3:00:00 fires. Both wrong.
- Same for `30 * 0-2,4-23 * * *` → «denně každou minutu, kromě doby od 3:00:30 do 3:59:30».
- Corrected: «denně každých 10 minut, vždy 30 sekund po celé minutě, kromě doby od 3:00 do 3:59». S5 must require a clock time in the head or the windows, not merely somewhere in D.

### 1.6 A year cadence from the field's first year is said bare (rule 4.4, no row)

- `0 0 9 * * * */4` → «každý čtvrtý rok denně v 9:00» ("a cadence names its first year unless it is the field's first on that step"). Which years? 1970, 1974 … 2026, 2030. A reader cannot know, and will most naturally take the next leap year (wrong: 2028 does not fire). The rule book's own principle: "a cadence is bare only where the unit above anchors it". Nothing anchors years.
- Corrected: «od roku 1970 každý čtvrtý rok denně v 9:00» (the general rule with no exemption). «v sudých letech» / «v lichých letech» are anchored by parity and stay.

### 1.7 «od 8. dne v měsíci každý druhý den»: the end is left to the reader

- `0 0 8/2 * *` → «od 8. dne v měsíci každý druhý den v 0:00». Fires 8, 10 … 30, then nothing until the 8th. Read: from the 8th every second day; whether the count stops at the end of the month, and that the 2nd, 4th and 6th of the next month do not fire, is inferred from «v měsíci» alone. The trap "a cadence from a start, read as carrying on past the month". The table in 3-date names the end only "if it stops before the last day it could reach".
- Corrected: «od 8. do 30. dne v měsíci každý druhý den v 0:00» (always both ends when the start is not the 1st). «od 1. dne v měsíci každý třetí den» is safe: the 1st restarts it in the reader's mind.
- With one month the rule gives «od 1. června každý třetí den v červnu»: «od 1. června» reads as a start date. Say «v červnu od 1. dne každý třetí den» or «každý třetí den v červnu, počítáno od 1.».

## 2. Wrong Czech

No row breaks grammar, agreement, «v/ve» (checked before every hour 0–23 in every row), numeral government (1 / 2–4 / 5+, compounds), case of months and weekdays, ordinal agreement in the nth weekday, or list punctuation. Points against the named authorities:

1. **T5 «od 9 do 17 hodin» with a last firing at 17:45.** The rule book's own fourth principle and `usage.md` §4.2: „do 17 hodin“ is the moment 17:00. T5 uses the phrase for the hours 9 through 17 inclusive and leans on the brackets. It is said in T5's text but not in the list of departures, and it makes the brackets load-bearing (4.1a claims brackets are "never needed to understand the words"; here they are). Not a wrong schedule while the brackets are there; any consumer who trims a bracket gets one.
2. **«, kromě …» with one comma** (closing the time part): acceptable as a loosely attached adjunct; consistent across rows. Fine.
3. **`short`: «v červnu po v 9:00», «po v 9:00».** «po» is also a preposition; «po v 9:00» is unreadable on first pass, and the rule book itself says abbreviations belong to tables. `usage.md` §8.4 notes tables often capitalise («Po–Pá»). In a running sentence «Po v 9:00», or keep «každé pondělí» when the weekday is the only day item. «po až pá», «po, st a pá» are passable.
4. **Separator `'.'` with seconds stays «9:00:30»** while the same style writes «9.00». Stated and reasoned (IJP gives no dotted form); I could not verify IJP offline. A caller who asked for «.» gets two notations in one product («v 9.00» / «v 9:00:30»). Note only.
5. **hour12 «10:00 v noci»**: CLDR, declared. Against the ear («v deset večer»). Declared; fine as ruled.

## 3. Unclear or unnatural (worst fifteen)

1. **`nW`: «vždy 15. dne v měsíci, o víkendu místo toho v nejbližší všední den téhož měsíce (pondělí až pátek, i když je svátek), v 9:00».** «o víkendu místo toho v … všední den» puts "at the weekend" and "on a working day" side by side with no verb; first read is "at weekends, instead, on the nearest weekday". The condition (the 15th falls on a weekend) is never said. Understood on the second read. Exact and plainer: «vždy 15. dne v měsíci; když je to sobota nebo neděle, tak místo toho v nejbližší všední den téhož měsíce (pondělí až pátek, i když je svátek), v 9:00». («je to» has only one possible subject, which was the objection to «připadne».)
2. **`*/15 9-17 15W * 1-5`** «od pondělí do pátku a navíc 15. dne v měsíci, o víkendu místo toho v nejbližší všední den …, vždy …»: true, but the second arm adds nothing (every `nW`, `1W`, `LW` day is Monday to Friday). Thirty words for «od pondělí do pátku každých 15 minut od 9:00 do 17:45». The rule book drops an arm for `everyDay` and for `fires: false`, not for an arm contained in the other.
3. **`0 0 L-30 * *`** «v měsících, které mají víc než 30 dní, vždy 30 dní před posledním dnem měsíce (např. 1. v měsíci s 31 dny)»: «např.» announces one case among several; it is the only case. «(tedy 1. dne měsíců s 31 dny)». The same for any `L-n` that reaches one month length only.
4. **`0-9 */15 9-17 * * 1-5`** «…, pokaždé každou sekundu až do 9 sekund později», and «pokaždé každých 10 sekund …»: «pokaždé každou» is the stutter the rule book says judge 2 objected to («pokaždé každou drhne») and re-ordered away for one form only. «…, pokaždé prvních 10 sekund každou sekundu» / «vždy každou sekundu od celé minuty do 9 sekund po ní».
5. **«denně vždy 5, 20 a 45 minut po každé celé hodině, kromě doby od 3:00 do 3:59»**, «denně vždy 20 minut po každé celé hodině, kromě 3:20 a 4:20», «denně vždy 30 sekund po každé celé hodině, kromě 3:00:30»: «denně vždy» is two frequency adverbs in a row. «denně 20 minut po každé celé hodině, kromě 3:20 a 4:20».
6. **`50-10 * * * *`** «každou minutu v prvních 11 minutách každé hodiny (:00–:10) a pak v posledních 10 minutách každé hodiny (:50–:59)»: one unbroken stretch of 21 minutes round the hour, said as two with «a pak». Exact but hides the shape. «každou minutu od 10 minut před každou celou hodinou do 10 minut po ní (:50–:10)». The rule "minutes are always linear" forces the split.
7. **`0 0 15 * 0-2,4-6`** «denně, ve středu jen 15. dne v měsíci, v 0:00» and **`0 9 1-14,16-31 * 5`** «denně, 15. dne v měsíci jen v pátek, v 9:00»: right; second read needed because «jen» follows the thing it restricts. «denně, ale ve středu jen tehdy, je-li 15. dne v měsíci, v 0:00»; «denně, ale 15. dne v měsíci jen tehdy, je-li pátek, v 9:00».
8. **`0 9 * * 1,3,5` «každé pondělí, středu a pátek» against `2,4` «každé úterý a každý čtvrtek»**: ruled and reasoned (3-weekday), still two treatments of the same mismatch side by side in one product; «každé úterý a čtvrtek» is what the three-item rule would give, and «každé pondělí, každou středu a každý pátek» what the two-item rule would.
9. **`5/10 * * * * *`** «každou minutu každých 10 sekund od 5 do 55 sekund po celé minutě», `*/7 * * * * *`, `0-9 * * * * *` «každou minutu každou sekundu od celé minuty do 9 sekund po ní», `10-20 * * * * *`: «každou minutu každou sekundu» / «každou minutu každých» with no comma, while the list form has one («každou minutu, vždy 30 sekund po celé minutě»). «v každé minutě vždy prvních 10 sekund, každou sekundu» or at least the comma.
10. **`0 0 31 * *`** «vždy 31. dne v měsíci v 0:00» against **`0 0 31W * *`** «vždy 31. dne v měsíci (jen v měsících, které ho mají), …»: the plain day is ruled to need no note, the `W` day gets one. Either both or neither; `0 9 * * 2#5` «vždy páté úterý v měsíci» (most months have none) has none either.
11. **`*/15 1,2,5,7,11,13,17,19,23 * * *`**: eight windows; exact, cannot be held. A limit, stated in 3.10.
12. **`0 0 9 * * * 2030/2,2031`** «od roku 2030 v sudých letech a v roce 2031, a to denně v 9:00»: right; a reader stops at why 2031 follows "from 2030". Order of time is easier: «v roce 2031 a od roku 2030 v sudých letech, a to …» is no better; «od roku 2030 v sudých letech a navíc v roce 2031, a to denně v 9:00».
13. **`0 0 * 11-2 * 2030`** «v lednu, únoru, listopadu a prosinci 2030 denně v 0:00» (year suffix after a list) against `6-8,12` in 2030 «v roce 2030 od června do srpna a v prosinci, a to …» (year first). After a four-item list «2030» sits on «prosinci»; the leading form is safer for every list of three or more.
14. **`30 * * * *` «každou hodinu v půl» beside `20 * * * *` «vždy 20 minut po každé celé hodině»** and `30 0-2,4-23` «denně každou hodinu v půl, kromě 3:30»: fine alone; in the exception the idiom and «3:30» are two notations for one place. Minor.
15. **`0 0 */2 6 0,6`** «v červnu každou sobotu a neděli a navíc každý lichý den v červnu, vždy v 0:00»: «v červnu» twice; the neighbouring row says «1. června» and the several-month rows «těchto měsíců». «… a navíc každý lichý den toho měsíce».

Regional: none. Parallel rows otherwise consistent (windows, last firings, «a tak dále každé k hodiny až do», «a navíc … , vždy»).

## 4. Rule book problems

Would two builders write the same sentences? Not in these places.

1. **Union, exception with a base other than «all»** (1.1): 4.3 covers only base «all». The other bases fall to plain concatenation, the form 4.3 itself records as misread.
2. **Union, "both arms are exceptions"**: one line («the days of the month are the removed days and the weekdays the condition») and no example. `0 9 1-14,16-31 * 0-2,4-6` fires every day except a Wednesday the 15th. After «jen» the rule gives weekdays as «v» + accusative lists or «od … do …»; a weekday arm that is itself an exception has no stated form. («denně, 15. dne v měsíci jen ne ve středu, v 9:00»? «denně kromě středy 15. dne v měsíci»?) Two builders will differ. Also silent: the weekday arm an nth weekday or `5L` after «jen»; the removed-days form under one month («15. června»?) and under several months («15. dne těchto měsíců»?).
3. **The night** (1.3): no bound on which hours may be «každou noc».
4. **S7 list/range/cadence without second 0** (1.2): contradicts the third principle.
5. **S5** (1.5): "D shows clock times" is satisfied by an exception alone.
6. **S3 with pieces**: `* 0-29,45 9 * * *`. D is «každou minutu od 9:00 do 9:29 a v 9:45». S3 says "the windows are written to the second"; the single minute «v 9:45» must become «od 9:45:00 do 9:45:59» and nothing says so. Likewise S7's exception line («, kromě okamžiku o 29 sekund později») with D that already ends in an exception (`30 0-28,30-59 * * * *` → «každou minutu, kromě okamžiku 29 minut po každé celé hodině (:29), pokaždé o 30 sekund později»: the seconds hang on the exception).
7. **Years: idiom against list.** Generic rule 6 (idiom) comes before rule 7 (cadence, listed at seven or fewer). `2030-2040/2` is six even years: the row lists them («v letech 2030, 2032 … 2040»), `2030-2050/2` says «v sudých letech 2030 až 2050». By the stated order the first should be «v sudých letech 2030 až 2040». The table in 4.4 has both lines and no order between them. Rule 6 says "the set is exactly it"; a bounded run of even years is not exactly "even years", so the idiom-with-ends needs its own threshold in words.
8. **Year cadence from the field's first year is bare** (1.6).
9. **`L-n` bracket for February** (1.4), and `L-n` with several months named (`0 0 L-3 6-8 *`): neither «(např. 28. v měsíci s 31 dny)» (no month named) nor «(27. června)» (one month) is specified.
10. **«(jen v měsících, které ho mají)»** depends on `dateReach.never` being non-empty with the month field unrestricted. For `29W * *` and `L-28 * *` February is in `leapYears`, not `never`: the rule says nothing, and "only in leap years" (4.4) applies only when `everyYear` is empty. Result for `0 0 29W * *`: no note at all, although February fires one year in four. Say what is wanted.
11. **T3 "inside one hour, or a list of single hours"** against "two neighbouring hours are one window": `0-29 9,10 * * *`. As a list of single hours: «každou minutu od 9:00 do 9:29 a od 10:00 do 10:29» (T3). As one window 9–10: T5, «v 9 a 10 hodin každou minutu v prvních 30 minutách každé hodiny (poprvé v 9:00, naposledy v 10:29)». The text allows both.
12. **T4 pieces: a run of two hours.** `0 22-2 * * 5` → «… od 0:00 do 2:00, ve 22:00 a ve 23:00» treats 22, 23 as two single hours; T3 treats two neighbours as one window. T4 does not say which the pieces are; a builder following the core's `pieces` gets whatever the core emits. State it.
13. **T3's entry condition** says "M is an even rhythm"; an M that is an exception on an even rhythm (`0-28,30-59 9-17`, `0,5,…,55` without 30) is sent to T3 only by 4.1a's "not used: T3" and by the paragraph on exceptions. The condition should say it.
14. **4.1a "the illustration is never needed"** against T5 brackets, which are needed (section 2, item 1).
15. **Year suffix in a union with one month**: «after the month part when that is one month … or after a fused date». In `0 0 0 1 6 5 2030` both exist («v červnu … a navíc 1. června»). Which takes «2030»? Presumably the leading month; not said.
16. **«v přestupných letech» only when the year field is unrestricted.** `0 0 0 29 2 * 2030-2040` → «v letech 2030 až 2040 vždy 29. února v 0:00»: fires in 2032, 2036, 2040 only. True in the sense that «31. dne» is true; say whether that is intended (the core knows: `dateReach` takes years into account).
17. **Dependence on which values are named**: the night (should depend on them and does not); «každý» repeated by gender of the two days (grammar, acceptable); `L-n` February bracket. No other found. Thresholds (four, six, seven) are by count throughout and the rows agree with them: checked `*/4`, `*/5`, `*/6`, `*/8`, `0-20/2`, `9-17/2`, `8-18/2`, `*/21`, `0-40/10`, `0-42/6`, `5-55/5`, `5/10`, `5/15`, `*/5` and `*/3` and `8/2` and `5-20/3` in days, all year rows.

## 5. Departures from `usage.md` without a stated reason

- §4.2 „do 17 hodin“ = 17:00, against T5's «od 9 do 17 hodin … (naposledy v 17:45)». Explained inside T5, absent from the list of departures, and against the rule book's own principle 4.
- §7 recommends «a také», «a dále», «a k tomu» for a union; the rows say «a navíc». Reasoned in 4.3 (judge), not listed among the departures.
- §2/§10 «každý den» as the natural daily word; rows say «denně». Reasoned in 2.5, not listed.
- §1.3 / §4.3: the night is said in usage as «od 22.00 do 6.00» (reader understands) or «v noci z … na …». «každou noc» is the rule book's own; reasoned (judge 3) in 2.5, not listed, and unbounded (1.3 above).
- §8.4: table abbreviations often capitalised; `short` writes lower case inside a sentence. No reason given.
- §6 «jen / pouze» and the conditional «připadne-li» for intersection (§7): the `nW` clause avoids both; reasoned in 5.7.
- All listed departures (1–12) have reasons; number 2 (noon) is admitted weak and I agree: «denně ve 12:00» is fine and costs nothing.

## 6. Read 1's wrong-schedule findings: cured?

| Read 1 | Now | Cured | New misreading from the cure |
| --- | --- | --- | --- |
| 1.1 «kromě N minut po celé» as a span | «kromě okamžiku 29 minut po každé celé hodině (:29)» | yes | none; «kromě každé celé hodiny» alone could be "except the whole hour" but the bracket «(:00 a :30)» settles it |
| 1.2 excepted minute under seconds | «každou sekundu od 9:00:00 do 9:59:59, kromě doby od 9:29:00 do 9:29:59»; «kromě minuty, která začíná 29 minut po …(:29:00–:29:59)» | yes | none in rows; S5 gap (1.5 above) |
| 1.3 «po celou tu minutu» with no minute | «pokaždé po dobu jedné minuty každou sekundu» | yes | the list and cadence forms «pokaždé o N sekund později» (1.2 above) |
| 1.4 `nW` as an addition | «o víkendu místo toho v nejbližší všední den téhož měsíce (…)» | yes for addition and for «nebo» | the condition is now unstated (section 3, item 1) |
| 1.5 weekday range before a time | «vždy» after a range; wraps listed in week order | yes | none |
| 1.6 range head later retracted | T5 with brackets; «v prvních 30 minutách každé hodiny» | yes | «od 9 do 17 hodin» for a stretch ending 17:45, held up only by the brackets |
| 1.7 30 February; «o víkendech» | «jen 30. února, tedy nikdy»; «každou sobotu a neděli» | yes | none |
| Rule 4.4 exception on the date arm | «denně, 15. dne v měsíci jen v pátek,» | only for base «all» | 1.1 above |
| Rule 4.3 seconds with excepted hours | S6 «…, kromě 3:00:30» | yes for S6 | S5 (1.5 above) |
| Rule 4.6 `1-31` beside a weekday | «denně v 9:00» | yes | none |

## 7. Traps from the brief, each tested

- Date-side exception in a union: base «all» right (three rows); other bases wrong (1.1).
- Trailing qualifier on the last item: «, vždy» after unions, «, a to» after mixed months and years, repeated prepositions in mixed lists: all rows right. Exception on a stray value: `0 9-11,13-17`, `5,20 9-11,13-17`, M and H exceptions together: right.
- Excepted hour or minute under seconds: rows right; S5 and S7 gaps (1.5, rule problem 6).
- Year or month on part of the calendar phrase: rows right («těchto měsíců», «1. června», leading year). Note section 3, item 13.
- Cadence from a start: years right; days 1.7.
- Wrapped runs: minutes `50-10`, days `28-3`, hours under a day, date, month all split correctly. `0 10-5 * * *` wrong by rule (1.3).
- Hours across midnight beside a named day: `0 22-2 * * 5`, `*/15 22-2 * * 1-5`, `0 0,1,22,23 * * 1`, `0 22-2 1 * *`, `*/15 0-5,22-23 * 6 *` all right.
- Window naming a moment an exception removes: none found; windows end on the set's own last firing (rule states it).
- Group words: «všední den» always glossed; no «pracovní den», no «víkend» for the field. «každou noc»: 1.3.
- Output nobody can hold: one row (eight windows), a stated limit.
- Calendar facts: `31 6`, `31 4,6`, `30 2`, `30 2-3`, `1-30 6`, `25-31 6`, `*/5 6`, `30,31 4,6`, `31 6 1`, `31W 6-8`, `29 2`, `29W 2`, `1-31 * 1`, `15 * 0-6` all say what is true. Gaps: `29W * *`, `L-28`, `L-n` in February (1.4, rule problem 10).

## 8. Checked and fine

639 rows read (87 visible, 153 held-out, 369 hard cases, 30 option rows). About 400 worked by hand from the pattern: every row with a range, step, wrap, exception, seconds, Quartz form, year or union. Every last firing of every window and bracket recomputed (17:45, 17:50, 17:56, 22:45, 23:45, 9:59:54, 10:42:59, 22:30:08 and the rest): all correct. `L-n` arithmetic, `1W`/`LW`/`nW` staying in the month, nth weekdays, year sets (`*/2` even, `1971/2` odd, `2028-2060/4` ends on 2060), weekday sets from cron numbers including `5-1`, `0-3`, `5-2`, `0,2-5`, `3-0`, `5,6,0`: all correct. Five rows carry a reasonable wrong reading (one in 1.1, four in 1.2, one of those saved by its brackets); the rest of section 1 is what the rule book would produce outside the rows.
