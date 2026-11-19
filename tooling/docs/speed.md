# Speed

How fast each language describes a pattern, how that is measured, and
what has been found. The numbers are a list of places to look and a
record to compare against, not a target: a renderer is never made to say
something different, or harder to read, for speed.

## Why it is measured

The test suite renders millions of descriptions, so a slow path slows
every gate. And a slow path usually marks a fault in an implementation,
not an expensive sentence: a whole field listed (the year field is 8,030
values), a set described again for the same arguments, wordings built
and thrown away, a product of fields built before it is counted.

## Method

`npm run speed` (`tooling/scripts/speed.mjs`; usage in its header).

- **Corpus**, 112,788 patterns: the fuzz pattern space of
  `scripts/fuzz-lang.mjs` (100,800 five- and six-field patterns), 10,368
  seven-field patterns read with `seconds` and `years` (year fields `*`,
  `2030`, `2030-2035`, `*/2`, `2030,2040`, `2026/3`), and 1,620 Quartz
  patterns with `?` and an optional year (`*`, `2030/2`).
- **As shipped**: the sources are bundled with esbuild, as
  `scripts/build.mjs` builds them, and the bundle is timed. Loaded through
  tsx instead, every named function expression is wrapped to keep its
  name, which costs more than the core's own work and doubles the
  figures.
- **Each language in its own process**, so that one language's garbage
  is not collected in another's time. One warm-up pass over the corpus,
  then seven; the figure is the median pass, in microseconds a pattern.
- **Core and renderer apart**: each pattern's time is split at the facts.
  Core is `prepare` and `analyze`; renderer is `describe`, including any
  core helper it calls (`candidatesAs`, `daysReached`, `describeSet`).
  A pattern's own time is its least over the passes, and the slowest
  patterns are listed per language.
- **Byte-identity**: `npm run speed -- --capture=<dir>` writes every
  output of every language under every named style and every boolean
  style field flipped (7,444,008 pattern-language-style outputs);
  `--compare=<dir>` renders them again and counts the differences. Capture
  before a change, compare after it: any difference means the change is
  wrong. `--source=<dir>` bundles another copy of the sources (for
  example `git archive <commit> src | tar -x -C <dir>`), to time an
  earlier commit beside the current one on the same machine.

## Measurements, 2026-11-19

Apple M2 Pro, Node 26.5. Before is `ba2b263` (fifteen languages, the
first measurement of id, ko, pl, ru and zh-Hant); after is this audit's
commits. Microseconds a pattern.

| Language | Core | Renderer | Total |
| --- | ---: | ---: | ---: |
| en | 28.2 → 21.8 | 22.4 → 21.2 | 50.6 → 43.1 |
| cs | 27.6 → 21.7 | 10.8 → 10.5 | 38.4 → 32.2 |
| de | 27.5 → 21.6 | 8.5 → 8.3 | 36.0 → 30.0 |
| es | 27.7 → 22.0 | 22.2 → 20.9 | 49.8 → 42.9 |
| fr | 27.3 → 21.9 | 15.1 → 15.0 | 42.3 → 36.9 |
| it | 27.5 → 22.0 | 8.0 → 7.9 | 35.5 → 29.9 |
| ja | 30.6 → 25.1 | 18.6 → 18.1 | 49.2 → 43.2 |
| pt | 27.4 → 21.8 | 9.9 → 9.8 | 37.3 → 31.6 |
| uk | 27.8 → 22.0 | 16.0 → 15.8 | 43.8 → 37.8 |
| zh | 27.7 → 21.8 | 16.1 → 15.7 | 43.7 → 37.6 |
| id | 27.3 → 21.6 | 14.0 → 13.9 | 41.3 → 35.5 |
| ko | 27.7 → 22.0 | 10.1 → 8.8 | 37.8 → 30.8 |
| pl | 27.7 → 21.5 | 6.4 → 6.1 | 34.1 → 27.6 |
| ru | 27.3 → 21.3 | 12.2 → 9.8 | 39.6 → 31.1 |
| zh-Hant | 27.7 → 21.1 | 9.5 → 9.0 | 37.2 → 30.1 |

The five languages added on 2026-11-19 sit inside the range of the first
ten (renderer 6 to 14 us against 8 to 22). The core's time is spread
thinly over the fuzz part (about 16 us a pattern) and heavily over the
year sweeps (100 to 170 us before), which carry much of it. The slowest
pattern in every language but English, Spanish and Japanese is a Quartz
pattern with the year `2030/2`: about 430 us before, about 195 after.

## Hot spots found on 2026-11-19

- **A year field such as `2030/2`** (3,985 years) took about 420 us to
  analyse, in every language: about 95 us making the values distinct
  through a Set though one step cannot repeat a value, and about 85 us
  building a Set of 3,985 years to take them out of a cadence of 4,015.
  Now distinct only for a list, and removed values are marked in a byte
  array: about 220 us. The rest is describing that many values, which
  they are.
- **Korean** built every moment (hour by minute by second) before
  checking whether there were few enough to write out: 22,620 for
  `* 3/2 9-20,22 * * *`, to write none. Now counted first; 590 to 12 us
  for that pattern.
- **Russian** counted each set by listing it, so the unrestricted year
  field (8,030 years) was copied in every description. Now counted from
  its bounds.
- **Traditional Chinese** lists the whole year field to carry it,
  unread, on the form of an unrestricted year field (`formOf` in
  `sayYears`). Answering an unrestricted year field before `formOf`
  takes its renderer from 9.2 to 7.2 us a pattern, byte-identical; not
  applied, while its wording was being changed elsewhere.
- **Indonesian** lists the whole year field for `partOf` in `yearsOf`
  (about 1.3 us a pattern, read only when the years are a list). A
  memoised getter made it slower (object literals with accessors are
  slow to build); left as it is.
- **English, Spanish and Japanese** spend 140 to 280 us in the renderer
  on a year cadence such as `2030/2`: English renders every candidate,
  the list of 3,985 years among them, before choosing; Spanish describes
  the year set again; Japanese builds its year words for the whole list.
  Not changed in this audit.

## For a new language

1. Measure it beside the others: `npm run speed -- --lang=en,<code>`.
2. Read its slowest patterns against the others'. A pattern far slower
   than the language's median, or than the same pattern in other
   languages, is a place to look: profile it (`node --cpu-prof`) and look
   for the faults above.
3. Before any change, capture; after it, compare. Every output must be
   byte-identical, and the branch budget must hold.
