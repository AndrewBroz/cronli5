# Adversarial read of the Russian rows (ru-art), 2026-11-19

Read: visible 87, held-out 153, hard cases 337, options 57 = 634 rows. Every
row with a range, step, wrap, exception, seconds, Quartz form or year was
worked by hand (about 430); about 35 of the least obvious were confirmed
against `tooling/scripts/reading/oracle.mjs` (day sets over 2030/2032, times
of day, year sets). No row was found whose literal content contradicts the
pattern. The findings below are sentences whose first or a reasonable second
reading says a different schedule.

## Wrong schedule (a reasonable reading differs from the pattern)

1. `0 0 1 * 1-6` — «ежедневно, кроме воскресенья, а также 1-го числа каждого
   месяца, в 0:00» (held-out), and `0 0 15 * 0-2,4-6` — «ежедневно, кроме
   среды, а также 15-го числа каждого месяца, в 0:00» (hard case).
   «Кроме» governs the genitive and «1-го числа» is genitive, so «кроме
   воскресенья, а также 1-го числа» is heard as one exception with two
   members: every day except Sundays and except the 1st. That is the opposite
   of the pattern for the 1st/15th (which always fires). This is the most
   natural parse, not a stretch. Corrected, with no exception left to attach:
   «с понедельника по субботу, а также 1-го числа каждого месяца, в 0:00»;
   «с четверга по вторник, а также 15-го числа каждого месяца, в 0:00».
   (The safe cases are those where the addition is «по …» dative, as in «по
   нечётным числам, кроме 15-го, а также по будням».)

2. `0 0 1 6-8,12 *` — «1-го числа каждого месяца с июня по август и в декабре
   в 0:00»; `0 0 L 6-8,12 *` — «в последний день каждого месяца с июня по
   август и в декабре в 0:00».
   «и в декабре в 0:00» stands as its own adverbial and is taken as "and in
   December at 0:00", that is every day of December. «1-го числа» is far away
   and bound to «каждого месяца с июня по август». Corrected: «ежегодно 1-го
   числа июня, июля, августа и декабря в 0:00»; «ежегодно в последний день
   июня, июля, августа и декабря в 0:00» (four names, the list form the rule
   book already has).

3. Parity of hours: «каждого чётного часа» / «по чётным часам» —
   `15,45 */2 * * *` «в 15 и 45 минут каждого чётного часа»; `0-29 */2`;
   `*/15 */2 * * 1-5` «по будням каждые 15 минут по чётным часам»;
   `* */2`, `* 1/2`, `*/5 1/2`, `*/15 1/2 * * 1-5`, `* * */2 * * *`,
   `30 * */2 * * *`, `*/20 */2 */2 */3 *`, and the two exception rows.
   Russian counts hours ordinally in everyday speech: «второй час», «во
   втором часу» is 1:00–1:59. A reader who hears «чётный час» as "the 2nd,
   4th … hour" lands on 1:xx, 3:xx — exactly one hour off, the same
   off-by-one the rule book itself cites against «15-я минута». With «по
   чётным часам» there is a further reading "at even o'clock" (2:00, 4:00).
   The rule book admits no corpus use was found. Corrected with the device
   the rows already use for other steps: «ежедневно в 0:15 и 0:45, и так
   каждые 2 часа»; «по будням в 0:00, 0:15, 0:30 и 0:45, и так каждые 2
   часа»; «ежедневно каждую минуту с 1:00 до 1:59, и так каждые 2 часа»;
   «ежедневно каждую минуту с 0:00 до 0:59, и так каждые 2 часа, кроме
   времени с 8:00 до 8:59».

4. `0 0 0 1 1 * 2030-2035` — «с 2030 по 2035 год 1 января в 0:00».
   «по 2035 год 1 января» runs together as an end date ("from 2030 until 1
   January 2035"), which loses the firing of 2035 as a member of a series and
   reads as one span. The open runs already say «ежегодно» («по 2030 год
   ежегодно 1 января»); the bounded run and the list do not. Corrected: «с
   2030 по 2035 год ежегодно 1 января в 0:00»; likewise «в 2030 и 2035 годах
   1 января в 0:00» is safe but inconsistent, and `0 0 0 1 1 * 2030-2032,2035`
   should be «с 2030 по 2032 год и в 2035 году ежегодно 1 января в 0:00».

5. Stretches inside the hour with «до» and a round end: `10-40 * * * *` —
   «каждую минуту с 10 до 40 минут каждого часа»; `0-40/10`, `5-10,20`,
   `50-10`, `0-29 …`. For dates and weekdays the rows use «с … по …», which
   Russian reads as inclusive; here «с … до …» leaves :40 open, and a reader
   who takes «до» as "up to" drops one firing. Clock windows («с 9:00 до
   17:45») carry an odd-looking end that signals a firing; «до 40 минут» does
   not. Corrected: «каждую минуту с 10-й по 40-ю минуту каждого часа», or
   keep the cardinals and say «по»: «с 10 по 40 минуту каждого часа».

## Wrong Russian

6. `0 0 0 29 2 * 2031` — «никогда: в эти годы такой даты нет». One year is
   named. «в этом году такой даты нет», or better «никогда: в 2031 году нет
   29 февраля».
7. `0 0 1-7,15 6 *` — «ежегодно с 1 по 7 и 15 июня в 0:00»: «по 7 и 15»
   reads as two ends of «по». «ежегодно с 1 по 7 июня и 15 июня в 0:00».
   Same in «с 1-го по 7-е и 15-го числа каждого месяца»: the case change
   saves it, barely; «с 1-го по 7-е число и 15-го числа каждого месяца».
8. `{hour12, padHour}` — «в 01:00 дня», «в 09:00 утра»: a padded hour with a
   part of the day is not written in Russian. Either option should win.
9. `0 4,5 * * *` hour12 — «в 4:00 ночи и 5:00 утра»: the border is a taste
   call, but «4 часа утра» is the commoner form; note only.
10. Authority: the 1956 rules, Lopatin, Milchin and Rozental are the right
    ones, and the rows follow them («1-го», «7-е», «2040-й», no ending before
    a month, «ё» written). The rule book says it quotes them from memory;
    nothing in the rows contradicts them. No regional (Ukraine) problem
    found in any row.

## Unclear or unnatural (worst fifteen)

1. `0 9 1-14,16-31 * 5` — «ежедневно, кроме 15-го числа, не выпадающего на
   пятницу, в 9:00». A negated participle inside an exception: two
   negations to resolve at speed. «ежедневно, кроме 15-го числа, если это
   не пятница, в 9:00».
2. `0 9 1-14,16-31 * 1,3` — same; «…кроме 15-го числа, если это не
   понедельник и не среда, в 9:00».
3. `1 * * * *` — «в 01 минуту каждого часа»; `0-1 * * * *` — «в 00 и 01
   минуту каждого часа». Nobody writes «в 01 минуту». «каждый час в 1-ю
   минуту» is worse; «в 0:01 и далее каждый час» is not a rhythm either;
   the least bad is «на 1-й минуте каждого часа» — the rule book's reason
   against ordinals should be retested here.
4. `0-28,30-59 * * * *` — «каждую минуту, но не в 29 минут каждого часа».
   «каждую минуту, кроме 29-й минуты каждого часа».
5. `15 30 * * * *` — «в 30 минут каждого часа, в 15 секунд каждой такой
   минуты». Heavier than «каждый час в 30 минут 15 секунд».
6. `* */6 * * *` — «ежедневно каждую минуту с 0:00 до 0:59, и так каждые 6
   часов». Understood, but «и так» is conversational; «…и далее каждые 6
   часов» reads as a schedule.
7. `0 9 */3 1,7 1-5` — «ежегодно каждые 3 дня с 1-го по 31-е число января и
   июля, если это будний день, в 9:00». Six things held and a step to count.
8. `0-29 9-17,22 * * *` — «ежедневно каждую минуту с 00 до 29 минут каждого
   часа с 9:00 до 17:29 и каждую минуту с 22:00 до 22:29». Two «с … до»
   in a row before a third.
9. `1/2 9-17 * * *` — «каждые 2 минуты с 01 до 59 минут каждого часа с 9:01
   до 17:59». «по нечётным минутам с 9:01 до 17:59» names one thing.
10. `0 0 L-30 * *` — «за 30 дней до последнего дня каждого месяца, в котором
    есть 31-е число, в 0:00». It is the 1st of the 31-day months; the reader
    must subtract to find that out.
11. `0 0 1 * 5L` — «в последнюю пятницу каждого месяца, а также 1-го числа,
    в 0:00» against `0 0 1 * 5` «по пятницам, а также 1-го числа каждого
    месяца»: fine by rule, but «1-го числа» without a scope after a clause
    about a month reads as an afterthought.
12. `0 0 1 6-8 *` «1-го числа каждого месяца с июня по август» beside
    `0 0 1 1,7 *` «ежегодно 1-го числа января и июля»: two devices for the
    same thing, switching on run against list. Three months as a run are
    shorter named: «ежегодно 1-го числа июня, июля и августа».
13. `0 0 9 * * * 2030/2` — «каждый 2-й год начиная с 2030-го» beside `*/2`
    «в чётные годы»: the same set of years from 2030 on, said two ways.
    «в чётные годы начиная с 2030-го».
14. `0 9 * * 0,1` — «по понедельникам и воскресеньям»: the two days are
    adjacent as Sunday–Monday, and Monday-first order hides it. «по
    воскресеньям и понедельникам».
15. `30 * * * * *` — «в 30 секунд каждой минуты»; `30 * */2 * * *` — «в 30
    секунд каждой минуты по чётным часам». «на 30-й секунде каждой минуты»
    is what is written.

## Rule book problems

- **4.3, "a side that carries an exception stands first"** produces finding
  1. It holds only when the addition is not genitive. The rule needs: a
  weekday side that is an exception is said as a run when a date is added
  («с понедельника по субботу», the wrapped run «с четверга по вторник»).
- **4.4 table, "a run or pieces" of months after a date** produces finding 2
  («… с июня по август и в декабре»). A date over pieces of months should
  name the months in the genitive, as the list form does.
- **4.1 C.2 parity of hours and 5.2** rest on a form the book itself calls
  among its least sure, with no corpus use, and it reintroduces the ordinal
  off-by-one the book rejects for minutes. «и так каждые 2 часа» already
  exists and covers it without a second device.
- **3.4**: "the end is always included … by the first convention" for
  minutes and seconds inside their unit. A convention the reader has not
  been told is not a reading; dates get «по» and minutes do not.
- **4.4 years**: «ежегодно» is kept for an open run and a run from the first
  year, dropped for a bounded run, a list, pieces and parity, with no reason
  given; finding 4 follows from it.
- **4.4 Never**: the fixed «в эти годы» ignores how many years are named.
- **2.5** «ежедневно» appears when an exception adds a clock time to a
  parity or bare rhythm («каждые 2 часа» → «ежедневно каждые 2 часа, кроме
  8:00»). Declared, but it means removing one hour changes the day part.
- **"How a form is chosen", rule 3 before rule 6**: `0-58 * * * *` is «каждую
  минуту с 00 до 58 минут каждого часа» while `0-28,30-59` is an exception;
  a set missing its last value is named with two ends where one exception
  («кроме 59-й») holds less. Same for `0 0-22 * * *`.
- **Value-dependent rules**: 29/30/31 said bare without «каждого месяца»
  (by which dates, though the stated condition is "a date some months
  lack", which is a property of the calendar and acceptable); year parity
  "from the field's first or second year" depends on 1970/1971 by value.
- **Silent**: both sides of a union carrying exceptions; a both-condition
  under `hour12`; `hour12` together with `padHour` (finding 8).

## Checked and fine

634 rows read; about 430 worked by hand; about 35 confirmed with the answer
key. All wrap rows (hours beside a day, month or year said ascending; dates
28-3; months 11-2 under a year), all `*/n` day fields beside a weekday
(both must hold), all nW / L-n rows (months skipped, leap years), all year
steps and all last-firing ends agree with the pattern.
