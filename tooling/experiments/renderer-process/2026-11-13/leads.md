# Leads for the native review of earlier languages (usage notes vs rule book)

Usage notes for earlier languages are at scratchpad/usage/<code>.md (move to src/lang/<code>/usage.md at review time).
Citations in notes are mostly search snippets; RAE etc. unverified.

## es (notes in)
- «laborable» / «día hábil» are ambiguous about Saturday (día hábil defined by each country's law). Current es says «día laborable» (mx «día hábil») for Quartz W = Mon–Fri: likely wrong; name the days.
- Week has 3–4 day types (laborables / sábados / domingos y festivos; víspera de festivo).
- Habit = plural article: «los lunes». Hour takes article and agrees: «a la 1», «a las 2» (check renderer for «a las 1:00»).
- «y» sums occasions («los viernes y el día 13» is the union); intersection = «si el 13 cae en viernes».
- Range of days always includes end; hours end is an instant; cure by naming last departure.
- 12 a. m./p. m. ambiguous; clock default by country (24h Spain/Cono Sur; 12h Mexico, Colombia, Caribbean).
- «h» symbol; «a. m.» with dots and space; «o»→«u» before 11 («10 u 11»).

## uk (notes in; weakly sourced — page fetches were blocked, mostly the writer's own judgment)
- «з … по …» is the inclusive-end preposition for days/dates («з понеділка по п'ятницю», «з 1 по 10 число»); current uk uses «до … включно» everywhere: compare.
- Hours are ordinals («дев'ята година» = 8:00–9:00): any "during the Nth hour" wording is a trap.
- «будні»/«робочі дні»/«вихідні» depend on the institution and holiday calendar: current uk says «у будні» for 1-5 and «будній день» for Quartz W: likely needs naming the days.
- Comma = intersection («у п'ятницю, 13 числа»); union needs «а також» (current uk already does this).
- «об 11:00», 3 noun forms after numbers; «кожні 21 хвилину» awkward → «з інтервалом 21 хв».
- Own devices: «доба/цілодобово», «по парних/непарних числах», «у ніч з п'ятниці на суботу», «щопівгодини».

## ja (fix agent done, branch ja-fix 5bd4bbe; not merged yet)
- 平日（月曜日〜金曜日） used for Quartz W: check against ja notes (平日 excludes 祝日).
- Fix agent reversed pieces order to ascending with past-midnight run last (taste call), left open: two いずれも in one sentence; never-firing Quartz forms; none of the new forms has had a blind fluency read (list in audit/ja.md).

## zh (notes in; GB/T 15835 read in full, good real citations)
- 工作日 is an institutional concept (调休 makes a Sunday a 工作日; 2026-01-04): current zh says 工作日（周一至周五） for Quartz W and maybe 1-5 → should be 周一至周五 only.
- “和” between date and weekday reads as intersection (“13日和周五” → Friday the 13th): CURRENT zh UNION 每月1日和每周五的0:00 IS LIKELY MISREAD. Notes say write “每月13日，以及每周五”. (A blind judge passed it earlier — contested; re-test.)
- 每隔 is unreliable; write 每N天一次. Weekday in hanzi, counts/intervals in Arabic digits (每周一 vs 每周一次 ambiguity).
- 0时 vs 24时 distinct; 次日 for crossing midnight; 上午12点 not sayable.
- Native devices: 整点/半点/一刻; 首班/末班/间隔; 旬/月底/单月/双月; （含）/（不含）; 共N天 after ranges; exceptions stated positively.
- Lists with 、; 周一、三、五; range mark — or ～.

## es fix done (branch es-fix b342e21; not merged). New forms unjudged — list in audit/es.md. «día laborable» still used (see es leads above).

# CORE / CROSS-LANGUAGE ITEMS (mine to decide)
- The core has no fact for a schedule that NEVER fires (`0 0 31 6 *`, `31W` in June, `L-30` in June) or fires only in leap years (`L-28`/`29` in Feb). es and ja both reported it independently. Decide: add a core fact (e.g. analyses.day months that can fire / `never`), so each language can say it natively.
- Which months an `nW`/`L-n`/day-31 form fires in is recomputed per renderer (es, ja each did it). Candidate for a core fact: the months (of those in reach) that have the day.
- Full-suite one-character-edit continuity tests time out at 60 s under load (many agents). Re-run gate on a quiet machine; consider whether those tests are too slow in general.
- git stash is shared across worktrees: briefs must forbid it (ja agent incident).

## pt (notes in; citations via summarizer, CP/SPTrans/EU style guide not opened)
- «dia útil» excludes holidays and in Brazil may include Saturday; «dias de semana» (Mon–Fri) vs «dias da semana» (all seven) — one letter apart. Current pt says «dia de semana (segunda a sexta)» for Quartz W: check; naming days is safer.
- Habit via article: «às segundas» (PT also singular «ao domingo»; BR «nas segundas», «toda segunda») — check pt-PT vs pt-BR region handling.
- Union with «e», juxtaposition reads as intersection («sexta-feira, dia 13»). Current pt union «todas as sextas e também no dia 1º…» consistent.
- «todo dia» (BR every day) vs «todo o dia» (PT all day): trap.
- PT/BR differ: 10h00/10h, 1.º/1º, «1 de maio»/«1º de maio», «até às»/«até as», week start.
- «das 9h às 18h» end ambiguous for a repeating thing; transport cure «primeira… última…».

## de (notes in; only naldo + Swiss Bundeskanzlei read in full)
- Three day types (Mo–Fr / Samstag / Sonn- und Feiertage); «Werktag» legally includes Saturday; «Wochentag» ambiguous → only «Montag bis Freitag» is safe. Current de says «Werktag (Montag bis Freitag)» for Quartz W: contradiction, fix.
- «montags» = every Monday; «jeweils» distributes a time over a list (current de uses it). Union = «sowie», not «oder»; «am Freitag, dem 13.» = intersection.
- «jeden zweiten Montag» ambiguous; «alle 5 Minuten»/«stündlich»; «0 Uhr» start vs «24 Uhr» end; DE «08:30 Uhr» (DIN 5008) vs CH «8.30 Uhr»; AT «Jänner».

## zh fix done (branch zh-fix 961ba4e; not merged). No wrong schedule found. Overnight-stretch fusion now declared. New forms unjudged (list in audit/zh.md). Pieces order reversed to ascending (same call as ja).

# CORE (add)
- HIGH: `restricts()` in src/core/day.ts treats a day field that covers every value (`1-31`, `0-6`) as unrestricted. Vixie cron decides by whether the field is literally `*` (DOM_STAR/DOW_STAR flags; and `*/2` counts as star!). So `0 9 1-31 * 1` fires every day in real cron but we say "Mondays". Verify against cron source (entry.c) and decide; this is a schedule fact, binds all languages.
- Year domain tops at 9999; open year range (`2030/1`) needs an "open-ended" fact so languages can say "from 2030" (zh did 自2030年起 itself).
- A day set covering its whole named month (`1-30` in June) = every day; es/zh/uk each handled or left it; candidate core fact.

## fr (notes in; France/Québec well sourced, CH/BE thinner)
- «jours ouvrables» counts Saturday in French law, «jours ouvrés» does not; «en semaine» vague on Saturday; current fr says «jour ouvré» for Quartz W — defensible in France, but notes say name the days. «fin de semaine» = Sat–Sun in Québec, Thu–Fri in Europe.
- Article makes recurrence: «le lundi», «du lundi au vendredi» (habit) vs «de lundi à vendredi» (this week). Check rows.
- Inclusive count: «huit jours»=a week, «quinze jours»=two weeks → never write «tous les 8/15 jours» for a real 8/15-day interval (check day cadences `*/8`, `*/15`!).
- «de 9 h à 17 h» stops at 17 h 00; «jusqu'à 17 h 59». Union with «ainsi que» (current fr uses it). «un jour sur deux» for every other; no «chaque» + number; no idiom for minute N of each hour (show the times).
- `15 h 30` in text; Québec norm obligatory; «inclus» (EU) / «inclusivement» (QC).

## ja (notes in; 公用文作成の考え方 and 祝日法 read in full, most else snippets/memory)
- 平日 excludes 祝日 → 平日（月曜日〜金曜日） for Quartz W / 1-5 is a meaning error; write 月曜日〜金曜日.
- 「2日おき」 ambiguous (every 2 or 3 days); use ごと / N日に1回 (check current ja cadence wording).
- 午前12時/午後12時 ambiguous → 正午 / 午前0時 or 24h. 25時/翌2時: late night belongs to the previous day (current ja uses 翌日).
- Range ends inclusive (〜, まで); a repeat inside 9時から17時まで is read as ending 17:00 → 17時台まで. 〜時台 and 毎時15分 are native devices.
- 「または」 isn't "either"; restate 毎週/毎月 on each side or add with 〜にも; 「15日の金曜日」 = intersection. Current ja union 毎月1日および毎週金曜日 — check vs notes.
- 1日 reads ついたち or いちにち: disambiguate with 毎月. 3か月/カ月/ヶ月; 〜 vs ～ codepoint: pick one.

## pt fix done (branch pt-fix d9b5d99; not merged). One wrong-schedule class, in a VISIBLE ROW. New forms unjudged (audit/pt.md).

# CROSS-LANGUAGE TRAP PATTERNS (found in one language; run in ALL after merging, read each output myself)
- Exception on the date side of a date-or-weekday union reads against the whole pair (pt): `0 9 1-14,16-31 * 5`, `0 9 5-9,11-25 * 1`, `*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5`, `0 9 1-14,16-31 6 1`.
- nW / L-n beside named months or in a union promising fires in months lacking the day (es, ja): `0 0 31W 6-8 *`, `0 0 30W 2,4 *`, `0 0 L-30 6-8 *`, `0 0 31W * 5`, `0 0 31W */2 *`, `0 0 29W 2 *`.
- Dates no named month has (ja): `0 0 1,31 4,6,9,11 *`, `0 0 31 6 *`; date wrap across month end `0 0 31,1-3 * *`, `0 0 29-2 * *`.
- Trailing seconds/qualifier attaching only to a stray value (ja): `15,45 0-29,45 9 * * *`, `* 0 9-17,22 * * *`; exception attaching to stray only: `0-29,45 0-2,4-23 * * *`; excepted minute under seconds read as one second: `* 0 0-2,4-23 * * *`.
- Wrapped minutes/seconds «from minute 50 to 10» read as 10–50 (pt): `50-10 * * * *`, `58-1 * * * *`, `45-15 * * * * *`.
- Hours crossing midnight beside a named day (zh, pt, ja): `0 22-2 * * 1` must not read as Monday 22:00 → Tuesday 2:00 only.
- Unholdable: `0-29 */2 * * *`, `* 2/2 * * *`, year sets with holes `0 0 9 * * * 2000-2028/2,2032-2098/2`, `1970-2029,2031-9999`, open years `2030/1`.
- Day set = whole named month: `0 9 1-30 4 1`, `0 9 1-30 6 *`.
- Inclusive day counting (fr «huit/quinze jours», es «cada ocho días», pt, it «quindici giorni»): `0 0 */8 * *`, `0 0 */15 * *`, `0 0 */7 * *`.

## uk fix done (branch uk-fix cfa09bf; not merged). Six wrong-schedule forms repaired; 25 changed forms unjudged (audit/uk.md).
- I DOUBT: «щопонеділка та щовівторка й щотижня з четверга до суботи включно о 9:00» (щотижня mid-sentence) and «…і через 15 та 45 секунд після кожної з цих хвилин». Put to blind judge first; native review may replace «у будні», «до … включно» (→ «з … по …»).
- Add to trap list: a single year attaching to only part of a month phrase (`0 0 9 * 1-5,7-12 * 2030`, `0 0 9 * 6-8,12 * 2030`); an "every hour" word in front of a single clock time (`0 0,9-17,23 * * *`); off-beat seconds cadence with exception (`5/10 0-28,30-59 * * * *`).

## en fix done (branch en-fix 23d67a0; not merged). Eight wrong-schedule forms repaired, one was a hard-case row. Forms unjudged (audit/en.md).
- I DOUBT the cure for the exception scope: a closing comma only («every hour except at 8 a.m., on the 1st»). A comma is weak; test with a blind reader who must STATE when it fires (and offer a control without comma). If readers still split, the cure must be structural (e.g. day part first for exception sentences — a declared continuity cost — or «on the 1st, every hour except at 8 a.m.»).
- Also doubt: «on the weekday in the same month nearest the 31st»; «every 5 days from the 1st in June»; «…except the 15th, of every other year from 2030».
- Core suggestion (en agent, 3rd independent report): clamp a day set to the lengths of its named months in the core.
- Check `git stash list` is empty before merging (en agent saw a uk-fix stash entry at one point).
- Add to trap list: `0 0 */5 6 *` (cadence from June 1 read as continuing past June), `0 0 1,15 * * 2030/4` (date + year cadence read as January only), `5,20,45 9-17,22 * * *` (stray hour read as one firing on the hour), `30 0 */2 * * *` (seconds with no minute named).

## fr fix done (branch fr-fix 6bbd411; not merged). ~20 wrong/misleading forms fixed; forms unjudged (audit/fr.md). Agent's own least-sure: « à 0 et toutes les secondes de 10 à 20 secondes après le début de chaque minute », « à 9 h, de nouveau 10 secondes plus tard, toutes les secondes pendant 11 secondes ». Still says «jour ouvré»; did not address `*/8`/`*/15` day cadences vs «huit/quinze jours» (native review).
- Add to trap list: exception removing the very moment a window names (`1-59 9 * * *`, `0-58 9-17 * * *`, `1-59 * * * * *`); wrapped number run read as an error (`0 0 1-10,20-31 * *` «du 20 au 10»; `0 0-5,17-23 * * *` «de 17 h à 5 h» over half the cycle); L-n in one named month giving another month's day (`0 0 L-28 2 *`, `0 0 L-30 6 *`, `0 0 9 L-3 2 * 2030`).

# TRAP RUN AFTER MERGE (2026-11-13, tree 1784d91, gate green 5549 tests) — script: scratchpad/traps.mjs <langs…>
Per-language audits were uneven: a class fixed in one language remains in others. STILL WRONG:
- Union with date-side exception (Fri 15th fires): en «on every day except the 15th, as well as on Fridays»; es «…y además todos los días de cada mes, excepto el día 15». (fr, pt, de fixed.)
- nW / L-n in months lacking the day: en, fr, pt wrong for `31W 6-8`, `30W 2,4`; en, pt, de wrong for `L-30 6-8`; en, pt, de wrong for `L-28 2`. (es, ja fixed nW; fr fixed L-n single month.)
- Dates no named month has: en, fr, pt say «31st of April…»; ALL say «June 31» for `0 0 31 6 *` (never fires).
- Open-ended / holed year sets: en, es, fr, pt emit 24,000–36,000-character sentences for `2030/2,2031`; «2030 through 9999» for `2030/1`. (de, zh fixed.)
- Wrapped date runs: en «on the 20th through the 10th», «on the 29th through the 2nd»; es «del 20 de cada mes al 10 del siguiente».
- es `1-59 9`: «de 9:00 a 9:59, excepto a las 9:00» (names then removes); en «…except at 0 minutes past the hour».
- `0 9 1-31 * 1` → all say Mondays (core `restricts()`; verify Vixie semantics).
- `0 0 1,15 * * 2030/4` is a 6-field pattern here (my trap typo: needs 7 fields) — ignore.
PLAN: fix these as CORE FACTS first (months that have the day / never fires / leap-only; open-ended years; day set = whole month; star semantics), then a second repair round per language given the full trap list and the new facts.
