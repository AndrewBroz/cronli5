# cronli5 in Portuguese (`pt`)

```js
import cronli5 from 'cronli5';
import pt from 'cronli5/lang/pt';

cronli5('30 9 * * MON-FRI', {lang: pt});
// 'de segunda a sexta às 09:30'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'pt'}); // 'de segunda a sexta às 09:30'
```

## Status

Built from a written rule book
([answers.md](../../src/lang/pt/answers.md)) and hand-written expected
descriptions. Independent readers (models) checked every expected
description against its schedule, and fluent judges briefed in the
language itself graded samples for naturalness with no knowledge of how
they were made, before the renderer was built. **No fluent human has
reviewed it yet.**

## Conventions worth knowing

* **Days first, then the time**: «todos os dias às 09:00»; «de segunda a
  sexta, a cada 15 minutos das 09:00 às 17:45».
* **24-hour times with two digits** by default: «às 09:00», «às 17:30».
  `style: {hour12: true}` gives «às 9:00 da manhã», «às 5:30 da tarde».
* **Brazilian by default**; `'pt-PT'` writes «dia 1» for «dia 1º» and
  «segundas-feiras» for «segundas».
* **Every stretch of time names its first and last moment**, and both
  fire: «a cada minuto das 09:00 às 17:59».
* **Hours are never a bare cadence**: a few are listed («às 00:00 e
  12:00»), more name both ends («a cada 2 horas das 00:00 às 22:00»).
* **The article agrees with the hour**: «à 01:30 e às 13:30».
* **A day of the month together with a weekday** says the weekdays first
  and «sempre» before the time, so the time covers both: «todas as sextas
  e também no dia 1º de cada mês, sempre às 00:00».
* **Quartz `W` is «dia de semana (segunda a sexta)»**; «dia útil» leaves
  out public holidays, which the pattern does not know.

## cronli5 vs. cRonstrue (pt_BR locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (pt) | cRonstrue 3.14.0 (pt_BR locale) |
| --- | --- | --- |
| `*/5 * * * *` | a cada 5 minutos | A cada 5 minutos |
| `0 0 * * *` | todos os dias às 00:00 | Às 00:00 |
| `30 9 * * MON-FRI` | de segunda a sexta às 09:30 | Às 09:30, de segunda-feira a sexta-feira |
| `0 9,17 * * *` | todos os dias às 09:00 e 17:00 | Às 09:00 e 17:00 |
| `0 22-2 * * *` | todos os dias, a cada hora das 22:00 às 02:00 | A cada hora, entre 22:00 e 02:00 |
| `*/15 9-17 * * *` | todos os dias, a cada 15 minutos das 09:00 às 17:45 | A cada 15 minutos, entre 09:00 e 17:59 |
| `0 0 1,15 * *` | nos dias 1º e 15 de cada mês às 00:00 | Às 00:00, no dia 1 e 15 do mês |
| `0 12 1 1 *` | no dia 1º de janeiro às 12:00 | Às 12:00, no dia 1 do mês, somente em janeiro |
| `0 12 * 11-2 *` | todos os dias de novembro a fevereiro às 12:00 | Às 12:00, de novembro a fevereiro |
| `0 0 * * 5L` | na última sexta-feira de cada mês às 00:00 | Às 00:00, na última sexta-feira do mês |
| `5,10 30 9 * * MON` | todas as segundas às 09:30:05 e 09:30:10 | Aos 5 e 10 segundos do minuto, aos 30 minutos da hora, Às 09:00, somente de segunda-feira |
| `1/1 * * * *` | a cada minuto durante os últimos 59 minutos de cada hora | A cada 1 minutos, iniciando aos 1 minutos da hora |
<!-- END GENERATED: comparison -->
