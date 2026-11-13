# Portuguese (`pt`), second repair, 2026-11-13

Worktree `.superpowers/worktrees/pt-fix2`, branch `pt-fix2`, commit **be05e3f** (four WIP commits under it, the first being the hand-written rows, failing). Only `src/lang/pt/` and `test/lang/pt/` changed. Scratch: `scratchpad/pt-fix2/` (`traps.mjs`, `traps-before.txt`, `traps-after.txt`, `sweep.mjs`, `sweep-*.txt`, `forms.txt`).

## A. Traps (pattern → before → after)

**Fixed**

| Class | Pattern | Before | After |
| --- | --- | --- | --- |
| Never fires | `0 0 31 6 *` | no dia 31 de junho às 00:00 | nunca (junho não tem dia 31) |
| | `0 0 30 2 *` | no dia 30 de fevereiro às 00:00 | nunca (fevereiro não tem dia 30) |
| | `0 0 31W 6 *` | no dia 31 de junho ou, se cair … | nunca (junho não tem dia 31) |
| | `0 0 L-30 6 *` | no dia que fica 30 dias antes do último dia de junho | nunca (junho não tem 31 dias) |
| | `0 0 0 29 2 * 2031` | no dia 29 de fevereiro de 2031 | nunca (fevereiro não tem dia 29 em 2031) |
| | sentence form | Ocorre no dia 31 de junho às 00:00. | Nunca ocorre (junho não tem dia 31). |
| Leap years only | `0 0 29 2 *` | no dia 29 de fevereiro às 00:00 | no dia 29 de fevereiro dos anos bissextos às 00:00 |
| | `0 0 L-28 2 *` | no dia que fica 28 dias antes do último dia de fevereiro | … de fevereiro dos anos bissextos às 00:00 |
| | `0 0 29W 2 *` | no dia 29 de fevereiro ou, se cair … | no dia 29 de fevereiro dos anos bissextos ou, se cair … |
| Months lacking the day | `0 0 31W 6-8 *` | no dia 31 de junho, julho e agosto ou … | no dia 31 de julho e de agosto ou … |
| | `0 0 30W 2,4 *` | no dia 30 de fevereiro e de abril ou … | no dia 30 de abril ou … |
| | `0 0 L-30 6-8 *` | … de junho, julho e agosto | … de julho e de agosto |
| | `0 0 1,31 4,6,9,11 *` | nos dias 1º e 31 de abril, junho, … | no dia 1º de abril, junho, setembro e novembro |
| | `0 0 30 2-3 *` | no dia 30 de fevereiro e de março | no dia 30 de março |
| Date arm dead in a union | `0 0 31 6 1` | em junho, todas as segundas e também no dia 31, sempre às 00:00 | todas as segundas de junho às 00:00 |
| Whole months | `0 9 1-30 4,6 *` | do dia 1º ao dia 30 de abril e de junho | todos os dias de abril e junho |
| | `0 9 1-30 4,6 1` | em abril e junho, todas as segundas e também do dia 1º ao dia 30, sempre | todos os dias de abril e junho às 09:00 |
| Open years | `… 2030/1` | todos os dias, de 2030 a 9999, às 09:00 | todos os dias, a partir de 2030, às 09:00 |
| Holed years | `… 2030/2,2031` | 23,942 characters | todos os dias, nos anos pares a partir de 2030 e em 2031, às 09:00 |
| | `… 2000-2028/2,2032-2098/2` | 49 years listed | todos os dias, nos anos pares de 2000 a 2098, exceto em 2030, às 09:00 |
| | `… 1970-2029,2031/1` | de 1970 a 2029 e de 2031 a 9999 | todos os dias, exceto em 2030, às 09:00 |
| | `… 2030-2040,2045/5` | 9,590 characters | de 2030 a 2040 e de 5 em 5 anos a partir de 2045 (2045, 2050, 2055…) |
| | `… 2030/4,2031/4` | 23,941 characters | de 4 em 4 anos a partir de 2030 (…) e de 4 em 4 anos a partir de 2031 (…) |
| Long lists | `0-20/2,21-59/3 * * * *` | nos minutos 0, 2, 4 … 57 (24 values) | a cada 2 minutos do minuto 0 ao 20 e a cada 3 minutos do minuto 21 ao 57 de cada hora |
| | `0 0-10/2,11-23/3 * * *` | eleven clock times | a cada 2 horas das 00:00 às 10:00 e a cada 3 horas das 11:00 às 23:00 |
| | `0 0 1-10/2,11-31/3 * *` | twelve days | nos dias ímpares do dia 1º ao dia 11 e de 3 em 3 dias do dia 14 ao dia 29 de cada mês |
| | visible row `*/15 9-17 1,3,…,13,17,…,31 * 1-5` | fifteen days listed | … e também nos dias ímpares do dia 1º ao dia 13 e do dia 17 ao dia 31 de cada mês, sempre … |
| Trailing seconds | `15,45 0-29,45 9 * * *` | … das 09:00 às 09:29 e às 09:45, 2 vezes: 15 e 45 segundos depois | … e às 09:45, **sempre** 2 vezes: 15 e 45 segundos depois |
| | `* 0 9-17,22 * * *` | … e às 22:00, repetindo a cada segundo … | … e às 22:00, **sempre** repetindo a cada segundo durante o minuto inteiro |
| Run read backwards | `0 0-5,17-23 * * *` | a cada hora das 17:00 às 05:00 | a cada hora das 00:00 às 05:00 e das 17:00 às 23:00 |
| | `0 0-9,12-23 * * *` (first-audit row) | a cada hora das 12:00 às 09:00 | a cada hora, em ponto, exceto às 10:00 e 11:00 |
| | `0 20-10,12-17 * * *` (first-audit row) | das 20:00 às 17:00, exceto às 11:00 | a cada hora, em ponto, exceto às 11:00, 18:00 e 19:00 |
| Exceptions too long to hold (found in the sweep) | 20 whole minutes after «exceto» | 816 characters | no exception excepts more than seven values |

**Already right** (first audit, re-read cold): exception on either side of a union (`0 9 1-14,16-31 * 5`, `0 0 15 * 0-2,4-6` → «de quinta a terça e também no dia 15 de cada mês, sempre às 00:00»); excepted hour or minute under seconds is the whole hour or minute; windows never name a removed moment (`1-59 9`, `0-58 9-17`, `1-59 * * * * *`); wrapped minutes and seconds (`50-10`, `58-1`, `45-15`); hours through midnight beside a day (`0 22-2 * * 1`); wrapped dates (`29-2`, `31,1-3`, `1-10,20-31`); `0-29 */2`, `* 2/2`; `0 0 */5 6 *` (listed); `0 0 0 1,15 * * 2030/4`; `0 0 9 * 1-5,7-12 * 2030`; `0 0,9-17,23`; `30 0 */2 * * *`; `5,20,45 9-17,22`; `0 9 1-31 * 1` (core: every day). Inclusive day counting cannot arise: `*/7`, `*/8`, `*/15` are lists of five days or fewer, and no day cadence longer than seven days has a step above four (now stated in 3.7).

**Left, by decision**

- With every month the date is said as written («no dia 31 de cada mês», «no dia que fica 30 dias antes do último dia de cada mês», `31W * *`): read as a date is.
- In a union the month leads both sides, so a month lacking the day is still named («de junho a agosto, todas as segundas e também no dia 31, sempre …»).
- February beside other months is not marked: `0 0 29 2,3 *` → «no dia 29 de fevereiro e de março». For `L-28 2,3` this leans on the reader skipping February in common years (doubt, below).

## B. Rules added to `answers.md`

2.6 a schedule that never fires has no time part (declared; measured in `continuity.js`). 3.3 a weekday list says its lead once. 3.5 a run of hours through midnight is one run only up to twelve hours; a wrapped run counts three wherever it stands (alone, in pieces, as an exception's base); ties between exceptions go to the whole-cycle base. 3.6 weekday pieces. 3.7 every second day is always odd/even, with ends where it does not span the month; under named months the days are those the months have, with the two statements that hold in any month kept as written, and «todos os dias, exceto» said of nothing else there. 3.8 "runs and cadences together": when (more than seven things), the count (a cadence is three), no two runs or cadences woven together, strays anywhere, a cadence cut at its holes. 3.9 at most seven values excepted; one «exceto» in the order days, months, years; years take exceptions. 4.2 «sempre» before the seconds clause wherever the time has an «e». 4.3 whole months and dead date arms in a pair; leap in a pair. 4.4 months a date comes in, «dos anos bissextos», «nunca (…)» with its reason forms. 5.1, 5.7 (new `LW`, `1W`, `nW` wording), 5.8 years rewritten (fewest things, a list wins a tie, open runs, exceptions, parts, strays before a cadence). 8.10, 8.11. New last section "Where this rule book departs from the usage notes".

## C. Usage notes

**Changed because of the notes**

- «dia de semana (segunda a sexta)» is gone (notes 1.1, 8, 11): `LW` → «no último dia de cada mês que não seja sábado nem domingo»; `1W` → «no primeiro dia de cada mês que não seja …»; `nW` → «… ou, se cair num sábado ou domingo, na sexta ou segunda mais próxima».
- Weekday lists say the lead once, gender of the first (notes 5): «todas as sextas e sábados», «todas as terças, quartas, quintas e domingos», «exceto às quartas e domingos» (was «todas as sextas e todos os sábados»).
- Every second day is always «dias ímpares/pares» (notes 3.3, 8): «nos dias pares do dia 8 ao dia 30 de cada mês» (was «de 2 em 2 dias do dia 8 ao dia 30»).
- Dates a month lacks are not named (notes 8).

**Kept against the notes, with reasons in the rule book**: days before time (the notes' frequency-first rule is judgment; all their sources lead with days); «no minuto 30 de cada hora» against the notes' «aos 30 minutos de cada hora» (cannot say minute 1; runs and whole-minute exceptions number the minutes anyway; one blind reader misread it as a cadence) — flagged as the first thing for a fluent reviewer; «todas as segundas» over «às segundas»; «a cada 15 minutos»; «09:00»; no «incluindo feriados»; closed windows over «primeira … última …»; ascending hours beside a day over «de sexta para sábado»; «e também … sempre»; one boundary for the parts of the day; «Ocorre». Region gaps noted in 1.3 («se calhar a», «à hora exata»).

## D. Forms

Every form changed or introduced in both rounds, 149 lines of `pattern → sentence`: `/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/pt-fix2/forms.txt`. None has had a blind fluency read.

First-audit forms changed on re-reading: the two long runs through midnight above; «de sexta a segunda e todas as quartas» → «todos os dias, exceto às terças e quintas»; «no dia 31 de fevereiro» → «nunca (…)»; the fifteen-day list; gendered leads.

**Still doubted, with the alternative**

1. «no último dia de cada mês que não seja sábado nem domingo»: exact, but a reader could take the clause as a condition on the last day. Alternative: the old «no último dia de semana (segunda a sexta) de cada mês».
2. «na sexta ou segunda mais próxima»: alternative «no dia mais próximo que não seja sábado nem domingo».
3. «nunca (junho não tem dia 31)» / «Nunca ocorre (…)»: alternative a bare «nunca».
4. «no dia 29 de fevereiro dos anos bissextos»; worse in a pair with a Quartz form: «… antes do último dia do mês dos anos bissextos». Alternative: «…, apenas nos anos bissextos,» set off.
5. February beside other months unmarked (`29 2,3`, `L-28 2,3`).
6. «sempre» before the seconds clause, twice in a pair: «…, sempre às 15:00, 15:18 …, sempre repetindo …». Alternative: «em cada um desses minutos».
7. «no minuto 30 de cada hora» (notes call it a calque).
8. «todas as segundas e domingos» (feminine lead over a masculine last item; the notes' rule, their source uses «às»).
9. «em 2039 e 2040 e nos anos ímpares a partir de 2077» («e … e»); two woven year cadences (`2030/4,2031/4`).
10. «todos os dias, exceto nos dias 15 e 31 de cada mês» for `1-14,16-30 * *`.
11. From the first audit, unchanged: «nos minutos 5, 20 e 45, de 8 em 8 horas (00:05 … 08:45 … 16:45)» (the « … » hides two times); «a cada minuto do minuto 5 ao 10 e no minuto 20 de cada hora, das 09:05 às 09:20 e das 17:05 às 17:20»; «a cada 5 minutos, 30 segundos depois».

## Core

- **`describeCadencePieces` / `analyses.cadencePieces.year` (fault).** `longestProgression` prefers the longest progression, and in the open year field every progression is thousands long, so a year before a cadence that shares its residue takes a giant stride and shreds the cadence: `2039-2040,2077/2` → every 38th year from 2039, then hundreds of parts (7,122-character sentence); likewise `2020,2030/2`, `2078-2079,2135/4`. For days `1,3,…,13,17,…,31` it returns three interleaved step-4 cadences where two step-2 stretches exist. Worked around in `years.ts` (first years tried as a list, the rest re-described with the core's own functions) and `sets.ts` (a cadence cut at its holes; woven parts refused). Suggested: prefer the smallest interval, or score whole layouts.
- **No fact for a day set relative to its months' lengths (gap).** `dateReach` is `null` for `1-14,16-30` in June and for `1-29/2` in February, and `dateReach.days.candidates` are described in the 1–31 field (an `all` base excepts the 31st of June). A renderer cannot say «todos os dias de junho, exceto no dia 15» or «nos dias ímpares de fevereiro» for those without month lengths; pt now says «do dia 1º ao dia 30 de junho, exceto no dia 15» and «nos dias ímpares do dia 1º ao dia 29 de fevereiro» (true, less neat).
- Nothing else found; the first audit's cosmetic note (`2#1,2#3` error text) stands.

## Checks

- `npx tsc -p tsconfig.json`: clean. `npx eslint src/lang/pt test/lang/pt`: clean.
- `npx vitest run test/lang/pt test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js`: 900 of 900. Scoped coverage of `src/lang/pt/*.ts`: 100% statements, branches, functions, lines.
- `npx vitest run --coverage` (whole suite): 5,661 of 5,668. Two failures are `test/core/conformance.js > pt` (the generated `conformance/pt.json` is stale, not mine to regenerate). Five are the one-character-edit continuity tests timing out at 60 s (74–96 s) with the machine at load average 35–59; `npx vitest run test/lang` alone passes 5,040 of 5,040, and pt's continuity file runs in 9 s.
- Branches 92 of a budget of 110 (was 72).
- Sweep: 20,000 random patterns (5-, 6-, 7-field, Quartz, every style and form), four seeds: no throw, nothing malformed. **43 over 400 characters (0.2%), longest 572**; before the repair the longest was 23,942. All have five or more restricted fields. 25 are in the 12-hour style, where every window end carries its part of the day. The rest are a union of weekdays and dates with a year phrase, over seven or more irregular hour windows or an irregular set of minutes or seconds with no run, cadence or exception that describes it (e.g. `* 50-5 17,0-23/2,22 ? 2-11 … `, 442). They are true; the rule book has no shorter form for irregular sets.
- Not run, as instructed: `npm run docs`, `conformance`, `verify`.
