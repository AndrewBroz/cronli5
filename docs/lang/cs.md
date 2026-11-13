# cronli5 in Czech (`cs`)

```js
import cronli5 from 'cronli5';
import cs from 'cronli5/lang/cs';

cronli5('30 9 * * MON-FRI', {lang: cs});
// 'od pondělí do pátku vždy v 9:30'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'cs'}); // 'od pondělí do pátku vždy v 9:30'
```

## Status

Built from a written rule book
([answers.md](../../src/lang/cs/answers.md)) and hand-written expected
descriptions. Independent readers (models) checked every expected
description against its schedule, and fluent judges briefed in the
language itself graded samples for naturalness with no knowledge of how
they were made, before the renderer was built. **No fluent human has
reviewed it yet.**

## Conventions worth knowing

* **Days and months first, then the time**: «denně v 9:00»; «od pondělí do
  pátku každých 15 minut od 9:00 do 17:45»; «vždy 1. ledna ve 12:00». A
  year leads: «v roce 2030 denně v 9:00».
* **24-hour times with a colon** («v 9:30», «ve 12:00», «v 0:00»).
  `style: {separator: '.'}` gives the form of the *Pravidla* and of print
  («v 9.30»); `style: {hour12: true}` gives the 12-hour clock with the
  part of the day.
* **Every window names its first and last firing**: «každou minutu od 9:00
  do 17:59». Places in the hour are counted from the full hour: «vždy 5, 20
  a 45 minut po každé celé hodině, od 9:05 do 17:45».
* **A day of the month together with a weekday** is an addition: «každý
  pátek a navíc 1. dne v měsíci, vždy v 0:00». Where one side is nearly
  every day it is said from that side: «denně, ale 15. dne v měsíci jen
  tehdy, připadne-li na pátek, v 9:00».
* **Only dates that exist are said.** A schedule that can never run is
  «jen 31. června, tedy nikdy»; 29 February says «v přestupných letech»; a
  form that comes to one date is that date.
* **Quartz `W` names the days, with no word for a working day**: «vždy 15.
  dne v měsíci, a připadne-li na sobotu nebo neděli, místo toho v nejbližší
  pátek nebo pondělí, v 9:00». The pattern knows no public holidays, and
  «všední den» would promise that it does.
* **The short style writes table forms with capitals**: «Po až Pá vždy v
  9:00».

## cronli5 vs. cRonstrue (cs locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (cs) | cRonstrue 3.14.0 (cs locale) |
| --- | --- | --- |
| `*/5 * * * *` | každých 5 minut | Každých 5 minut |
| `0 0 * * *` | denně v 0:00 | V 00:00 |
| `30 9 * * MON-FRI` | od pondělí do pátku vždy v 9:30 | V 09:30, od Pondělí do Pátek |
| `0 9,17 * * *` | denně v 9:00 a 17:00 | V 09:00 a 17:00 |
| `0 22-2 * * *` | každou noc každou hodinu od 22:00 do 2:00 | Každou hodinu, mezi 22:00 a 02:00 |
| `*/15 9-17 * * *` | denně každých 15 minut od 9:00 do 17:45 | Každých 15 minut, mezi 09:00 a 17:59 |
| `0 0 1,15 * *` | vždy 1. a 15. dne v měsíci v 0:00 | V 00:00, 1 a 15. den v měsíci |
| `0 12 1 1 *` | vždy 1. ledna ve 12:00 | V 12:00, 1. den v měsíci, pouze v Leden |
| `0 12 * 11-2 *` | od listopadu do února denně ve 12:00 | V 12:00, od Listopad do Únor |
| `0 0 * * 5L` | vždy poslední pátek v měsíci v 0:00 | V 00:00, poslední Pátek v měsíci |
| `5,10 30 9 * * MON` | každé pondělí v 9:30:05 a 9:30:10 | V 5 a 10 sekund, v 30 minut, v 09:00, pouze v Pondělí |
| `1/1 * * * *` | každou minutu, kromě každé celé hodiny (:00) | Každých 1 minut, začínající v 1 minut |
<!-- END GENERATED: comparison -->
