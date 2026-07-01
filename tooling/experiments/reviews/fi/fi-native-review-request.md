# Finnish review request — cronli5

**What this is:** cronli5 is a small library that turns cron schedule
expressions into plain-language descriptions. It now has a Finnish
renderer. We need a **native Finnish speaker** to check whether the
output below is correct and natural. (It was written and so far only
reviewed by AI in the same model family, which is not a sufficient
check — hence this request.)

**How to read the table:** each row is `cron pattern` | the Finnish the
library produces | the English meaning (so you know what it's *trying*
to say — judge the Finnish, not the English).

**What we need from you:** for any row that is wrong, unnatural, stiff,
or wrong-register for a schedule/timetable description, please quote the
phrase, say what's wrong, and give your preferred Finnish. Style anchors
we're aiming for: Kotus (Kielitoimiston ohjepankki) and SFS 4175. The
24-hour clock with unpadded hours (`klo 9.30`, `klo 9`) is intentional.

## Specific questions we're unsure about

1. **The "at minute N" construction — `kohdalla` vs `yli`.** We render
   "at minute 30 of every hour" as **"joka tunti 30 minuutin kohdalla"**
   (and "joka minuutti 15 sekunnin kohdalla" for seconds). We recently
   changed *to* this from an adessive form ("minuutilla 30") that read as
   an English calque. cRonstrue's Finnish locale instead uses **"30
   minuuttia yli"** / **"5 ja 10 sekunnin jälkeen"**. Which is better —
   our `kohdalla` ("at the mark of") or `yli` ("past")? It must
   generalize to any value (e.g. :17), lists, and ranges.
2. **Month range + a fixed day.** We render "on the 1st, in June through
   September" as **"kuukauden 1. päivänä kesäkuusta syyskuuhun"**. Is the
   case agreement correct here (essive day + elative→illative month
   range), or should it enumerate the months
   ("kesäkuun, heinäkuun, elokuun ja syyskuun 1. päivänä")?
3. **Sub-minute second steps.** For "every 7 seconds" (which resets each
   minute) we render **"seitsemän sekunnin välein joka minuutti"**. Is
   the trailing "joka minuutti" helpful or confusing?
4. **Midnight/noon in lists.** Standalone we say "keskiyöllä" /
   "keskipäivällä", but inside a list of clock times we switch to digits
   ("klo 0, 10 ja 20"). Right call?
5. Please also confirm the inflected forms are all correct — weekday
   distributives (maanantaisin), range pairs (maanantaista perjantaihin,
   keskiviikosta perjantaihin), month cases (kesäkuussa, marraskuusta
   helmikuuhun), essive dates (1. päivänä, viimeisenä perjantaina).

## The output

| cron | Finnish (cronli5) | English meaning |
| --- | --- | --- |
| `* * * * *` | joka minuutti | every minute |
| `*/5 * * * *` | viiden minuutin välein | every five minutes |
| `0 * * * *` | joka tunti | every hour |
| `0 0 * * *` | joka päivä keskiyöllä | every day at midnight |
| `*/15 * * * * *` | 15 sekunnin välein | every 15 seconds |
| `0 9 * * *` | joka päivä klo 9 | every day at 9 a.m. |
| `30 9 * * *` | joka päivä klo 9.30 | every day at 9:30 a.m. |
| `0 12 * * *` | joka päivä keskipäivällä | every day at noon |
| `0 1 * * *` | joka päivä klo 1 | every day at 1 a.m. |
| `0 9,17 * * *` | joka päivä klo 9 ja 17 | every day at 9 a.m. and 5 p.m. |
| `0 9 * * MON` | maanantaisin klo 9 | every Monday at 9 a.m. |
| `0 9 * * MON-FRI` | maanantaista perjantaihin klo 9 | every Monday through Friday at 9 a.m. |
| `0 9 * * WED-FRI` | keskiviikosta perjantaihin klo 9 | every Wednesday through Friday at 9 a.m. |
| `0 12 * * MON,WED,FRI` | maanantaisin, keskiviikkoisin ja perjantaisin keskipäivällä | every Monday, Wednesday, and Friday at noon |
| `0 12 * * SUN` | sunnuntaisin keskipäivällä | every Sunday at noon |
| `0 0 13 * *` | kuukauden 13. päivänä keskiyöllä | on the 13th at midnight |
| `0 12 1 1 *` | tammikuun 1. päivänä keskipäivällä | on January 1 at noon |
| `0 0 1,15 * *` | kuukauden 1. ja 15. päivänä keskiyöllä | on the 1st and 15th at midnight |
| `0 0 1-15 * *` | kuukauden 1.–15. päivänä keskiyöllä | on the 1st through 15th at midnight |
| `0 12 * 6,12 *` | joka päivä kesäkuussa ja joulukuussa keskipäivällä | every day in June and December at noon |
| `0 12 * 11-2 *` | joka päivä marraskuusta helmikuuhun keskipäivällä | every day in November through February at noon |
| `0 0 1 6-9 *` | kuukauden 1. päivänä kesäkuusta syyskuuhun keskiyöllä | on the 1st in June through September at midnight |
| `0 0 L * *` | kuukauden viimeisenä päivänä keskiyöllä | on the last day of the month at midnight |
| `0 0 * * 5L` | kuukauden viimeisenä perjantaina keskiyöllä | on the last Friday of the month at midnight |
| `0 0 * * MON#2` | kuukauden toisena maanantaina keskiyöllä | on the second Monday of the month at midnight |
| `0 0 15W * *` | arkipäivänä lähinnä kuukauden 15. päivää keskiyöllä | on the weekday nearest the 15th at midnight |
| `0 9-17 * * *` | joka tunti klo 9–17 | every hour from 9 a.m. through 5 p.m. |
| `0 22-2 * * *` | joka tunti klo 22–2 | every hour from 10 p.m. through 2 a.m. |
| `*/15 9-17 * * *` | 15 minuutin välein klo 9.00–17.45 | every 15 minutes from 9 a.m. through 5:45 p.m. |
| `* 9 * * *` | joka minuutti klo 9.00–9.59 | every minute from 9 a.m. through 9:59 a.m. |
| `0 */2 * * *` | kahden tunnin välein | every two hours |
| `0 */5 * * *` | viiden tunnin välein keskiyöstä alkaen | every five hours from midnight |
| `0 */10 * * *` | klo 0, 10 ja 20 | at midnight, 10 a.m., and 8 p.m. |
| `30 * * * *` | joka tunti 30 minuutin kohdalla | 30 minutes past the hour, every hour |
| `0,30 * * * *` | joka tunti 0 ja 30 minuutin kohdalla | at zero and 30 minutes past the hour |
| `0-29 * * * *` | joka tunti 0–29 minuutin kohdalla | every minute from zero through 29 past the hour |
| `5,10 30 9 * * MON` | joka minuutti 5 ja 10 sekunnin kohdalla, maanantaisin klo 9.30 | at five and ten seconds past the minute, every Monday at 9:30 a.m. |
| `15 30 9 * * MON` | maanantaisin klo 9.30.15 | every Monday at 9:30:15 a.m. |
| `0,30 9 * * MON-FRI` | maanantaista perjantaihin klo 9 ja 9.30 | every Monday through Friday at 9 a.m. and 9:30 a.m. |
| `0 0 13 * FRI` | kuukauden 13. päivänä tai perjantaisin keskiyöllä | on the 13th or on Friday at midnight |
| `0 0 1 6-9 FRI` | kuukauden 1. päivänä tai perjantaisin kesäkuusta syyskuuhun keskiyöllä | on the 1st or on Friday in June through September at midnight |
| `0 12 1 2/3 *` | joka kolmannen kuukauden 1. päivänä helmikuusta alkaen keskipäivällä | on the 1st in every 3rd month from February at noon |
| `1/3 * * * *` | kolmen minuutin välein jokaisen tunnin minuutista 1 alkaen | every three minutes from one minute past the hour |
| `*/7 * * * * *` | seitsemän sekunnin välein joka minuutti | every seven seconds past the minute |
| `0 0 12 25 12 * 2030` | joulukuun 25. päivänä vuonna 2030 keskipäivällä | on December 25, 2030 at noon |
