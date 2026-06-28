# cronli5 in Portuguese (`pt`)

Import the language module from the `cronli5/lang/pt` subpath and pass
it via the `lang` option:

```js
import cronli5 from 'cronli5';
import pt from 'cronli5/lang/pt';

cronli5('30 9 * * MON-FRI', {lang: pt});
// 'de segunda a sexta-feira às 09:30'   (24-hour clock, the default)

cronli5('30 9 * * MON-FRI', {lang: pt, ampm: true});
// 'de segunda a sexta-feira às 9:30 da manhã'   (12-hour clock)
```

Portuguese (target **pt-BR**) is sibling-derived from Spanish: it ports
the Spanish renderer's structure over the language-independent core and
translates the lexicon to Brazilian idiom, then diverges where Portuguese
grammar genuinely differs (contractions, gender agreement, the weekday
recurrence). English-only users pay zero bytes for it — the module is
only in your bundle if you import it.

## Style anchors

Anchored to the **Brazilian norm** (VOLP / Academia Brasileira de Letras,
plus cRonstrue's `pt_BR`): lowercase day and month names, no comma before
`e` in enumerations, and the **24-hour clock by default** with
zero-padded hours (`às 09:30`, `às 17:00`). Pass `{ampm: true}` for the
12-hour clock with day periods (`da madrugada` 1–5, `da manhã` 6–11,
`da tarde` 12–19, `da noite` 20–24).

## Conventions worth knowing

* Preposition + article contraction is formed throughout: `de` + `o/a` →
  `do/da` (`do mês`, `da manhã`), `em` + `o/a` → `no/na` (`no dia 1º`),
  `a` + `a/as` → `à/às` (`às 09:00`, `às segundas-feiras`), `a` + `o/os`
  → `ao/aos` (`ao dia 15`, `aos domingos`).
* Article agreement: `à 1` but `às 2` — one o'clock takes the singular
  (grave-accent) article on both clocks (`à 01:00`, `à 1 da madrugada`).
* On the 12-hour clock, exact 12:00 reads as words (`ao meio-dia`,
  `à meia-noite`); on the default 24-hour clock the same times are
  `às 12:00` and `às 00:00`.
* Weekday recurrence: a single feminine weekday before a time reads
  `toda segunda-feira às 9 da manhã` (avoiding the double-`às`); lists
  carry the `-feira` suffix on the last `-feira` day only
  (`às segundas, quartas e sextas-feiras`); ranges carry it on the last
  term (`de segunda a sexta-feira`); Sunday recurs as `aos domingos`.
* Dates use the noun `dia` with the cardinal, except the 1st of the
  month, which is the ordinal `1º` (`no dia 1º de junho`, `no dia 13`).
* Quartz nth-weekday ordinals agree in gender (`a primeira segunda-feira`,
  `o último domingo`); when the ordinal word would collide with the
  weekday name it uses the ordinal digit (`na 2ª segunda-feira do mês`).
* A month **range** never folds into a date — `0 0 1 6-9 *` reads
  "no dia 1º de cada mês, de junho a setembro". Mixed month lists repeat
  the preposition (`em janeiro e de março a junho`).
* Where English says "during the 9 a.m. and 5 p.m. hours", Portuguese
  re-strategizes into per-hour windows: `das 09:00 às 09:59 e das 17:00
  às 17:59` (or with day periods under `{ampm: true}`).

## Dialects

The default `pt` style uses the colon separator (`09:30`) and targets
pt-BR. A custom style object merges over it: `{dialect: {sep: '.'}}`
gives `09.30`. pt-PT is a future dialect axis; no regional dialect ships
yet.

## cronli5 vs. cRonstrue (pt_BR locale)

Generated from live output by
[`scripts/docs.mjs`](../../scripts/docs.mjs)
(`npm run docs`). The first twelve rows are the shared cross-language
set, identical in every language doc; the last two exercise
Portuguese-specific grammar (the singular `toda segunda-feira` recurrence
and the ordinal `dia 1º`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (pt) | cRonstrue 3.14.0 (pt_BR locale) |
| --- | --- | --- |
| `*/5 * * * *` | a cada cinco minutos | A cada 5 minutos |
| `0 0 * * *` | todos os dias às 00:00 | Às 00:00 |
| `30 9 * * MON-FRI` | de segunda a sexta-feira às 09:30 | Às 09:30, de segunda-feira a sexta-feira |
| `0 9,17 * * *` | todos os dias às 09:00 e 17:00 | Às 09:00 e 17:00 |
| `0 22-2 * * *` | a cada hora das 22:00 às 02:00 | A cada hora, entre 22:00 e 02:00 |
| `*/15 9-17 * * *` | a cada 15 minutos das 09:00 às 17:45 | A cada 15 minutos, entre 09:00 e 17:59 |
| `0 0 1,15 * *` | nos dias 1º e 15 de cada mês às 00:00 | Às 00:00, no dia 1 e 15 do mês |
| `0 12 1 1 *` | no dia 1º de janeiro às 12:00 | Às 12:00, no dia 1 do mês, somente em janeiro |
| `0 12 * 11-2 *` | todos os dias de novembro a fevereiro às 12:00 | Às 12:00, de novembro a fevereiro |
| `0 0 * * 5L` | na última sexta-feira do mês às 00:00 | Às 00:00, na última sexta-feira do mês |
| `5,10 30 9 * * MON` | às segundas-feiras, nos segundos 5 e 10 das 09:30 | Aos 5 e 10 segundos do minuto, aos 30 minutos da hora, Às 09:00, somente de segunda-feira |
| `1/1 * * * *` | a cada minuto do 1 ao 59 de cada hora | A cada 1 minutos, iniciando aos 1 minutos da hora |
| `0 9 * * MON` | toda segunda-feira às 09:00 | Às 09:00, somente de segunda-feira |
| `0 0 1 1 *` | no dia 1º de janeiro às 00:00 | Às 00:00, no dia 1 do mês, somente em janeiro |
<!-- END GENERATED: comparison -->

## Internals

The renderer lives in [`src/lang/pt/`](../../src/lang/pt/); design
decisions and re-strategies are recorded in
[`src/lang/pt/notes.md`](../../src/lang/pt/notes.md), and the reviewed
corpus lives under [`test/lang/pt/`](../../test/lang/pt/). The
architecture is described in [i18n-design.md](../i18n-design.md).
