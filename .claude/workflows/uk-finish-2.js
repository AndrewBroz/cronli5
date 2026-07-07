export const meta = {
  name: 'uk-finish-2',
  description: 'Ukrainian convergence round 3: whole-corpus consistency audit (dedupe the ≥15 contradictory duplicate keys, enumerate remaining batch-convention splits), panel the two design questions the trap retries exposed (weekday recurrence marking; hour-list vs range surface forms), normalize, TDD to green, fix the two degenerate outputs, refresh the stability extractor, full gate.',
  phases: [
    { title: 'Audit', detail: 'whole-corpus consistency audit + duplicate-key dedupe' },
    { title: 'Panels', detail: 'recurrence marking + hour-list surface, blind 3-persona' },
    { title: 'Normalize', detail: 'apply verdicts corpus-wide; record in notes.md' },
    { title: 'Renderer', detail: 'TDD to green + degenerate fixes' },
    { title: 'Verify', detail: 'extractor refresh, traps re-run, full npm gate' }
  ]
}

const ROOT = '/Users/andrewbroz/Code/personal/cronli5'
const CORPUS = `${ROOT}/test/lang/uk/corpus.js`
const NOTES = `${ROOT}/src/lang/uk/notes.md`
const SRC = `${ROOT}/src/lang/uk`

const PERSONAS = [
  'an everyday native Ukrainian speaker (judges natural everyday wording)',
  'a meticulous Ukrainian copy-editor (judges written-register clarity and idiom)',
  'a precise Ukrainian-writing technical communicator (judges scannable, unambiguous precision)'
]
const CONVVOTE = { type: 'object', additionalProperties: false, required: ['best'], properties: { best: { type: 'string' }, reason: { type: 'string' } } }
const REPORT = { type: 'object', additionalProperties: false, required: ['ok', 'summary'], properties: { ok: { type: 'boolean' }, summary: { type: 'string' }, failures: { type: 'array', items: { type: 'string' } } } }
const VERDICT = { type: 'object', additionalProperties: false, required: ['readsAsIntended', 'best', 'reason'], properties: { readsAsIntended: { type: 'boolean' }, best: { type: 'string' }, misread: { type: 'string' }, reason: { type: 'string' } } }
const AUDIT = { type: 'object', additionalProperties: false, required: ['duplicatesResolved', 'classes'], properties: { duplicatesResolved: { type: 'number' }, classes: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['id', 'description', 'rows'], properties: { id: { type: 'string' }, description: { type: 'string' }, rows: { type: 'number' }, majority: { type: 'string' } } } } } }

phase('Audit')
// Whole-corpus view — the structural fix for the batch-local reviews that
// let contradictions through twice. Exact-duplicate keys are resolved
// mechanically (majority form across the corpus's own siblings); genuine
// convention SPLITS are enumerated as classes for panelling or majority
// normalization, never silently picked.
const audit = await agent(`Whole-corpus consistency audit of ${CORPUS}. Write and run a node script from ${ROOT} that: (1) finds EXACT duplicate keys (same cron pattern + same options) with differing expected strings — for each, resolve to the variant consistent with the corpus-wide majority convention for its construction (delete the conflicting duplicate row; keep one), and count them; (2) groups all remaining rows by CONSTRUCTION (union predicate, hour window, minute confinement under seconds, weekday qualifier, month scope, clock lists, cadence forms) and flags any construction rendered in two systematically different surface forms across batches (e.g. the "протягом" vs bare-confinement split the TDD round documented); report each as a class with row counts and the majority form. Do NOT change non-duplicate rows. Report duplicatesResolved and the classes.`,
  { label: 'audit', phase: 'Audit', model: 'sonnet', schema: AUDIT })
log(`audit: ${audit?.duplicatesResolved ?? '?'} duplicates resolved; ${(audit?.classes || []).length} convention classes`)

phase('Panels')
// The two DESIGN questions the trap retries exposed, plus every convention
// class the audit found (capped), each a blind 3-persona comprehension test.
const DESIGN = [
  { id: 'weekday-recurrence-marking',
    question: 'A weekday range or set fires EVERY week. How must Ukrainian mark that recurrence so the sentence cannot read as a one-time span? (The current "з понеділка до п’ятниці включно опівночі" reads as a single closed interval.)',
    candidates: [
      { label: 'shcho-prefix', example: 'щодня з понеділка до п’ятниці опівночі' },
      { label: 'po-locative-plural', example: 'по буднях опівночі (list: по понеділках, середах і п’ятницях)' },
      { label: 'kozhen-genitive', example: 'кожного дня з понеділка до п’ятниці опівночі' }
    ] },
  { id: 'hour-list-vs-range-surface',
    question: 'A discrete hour LIST ("протягом годин 9:00 і 17:00") currently reuses the digital-clock surface of the RANGE window ("з 9:00 до 17:00 включно"), so a list can be misread as continuous coverage. How should a discrete hour list read so it can never be mistaken for a range?',
    candidates: [
      { label: 'o-hodyni-ordinal', example: 'кожні 5 хвилин о 9-й і 17-й годині' },
      { label: 'protyahom-digital', example: 'кожні 5 хвилин протягом годин 9:00 і 17:00' },
      { label: 'o-digital', example: 'кожні 5 хвилин о 9:00 і о 17:00' }
    ] }
]
const auditClasses = (audit?.classes || []).slice(0, 4).map((c) => ({
  id: c.id,
  question: `The corpus renders the "${c.id}" construction two ways across batches (${c.description}). Which single form should every row use?`,
  candidates: [
    { label: 'majority', example: c.majority || c.description },
    { label: 'minority', example: 'the competing batch form described above' }
  ]
}))
const verdicts = await parallel([...DESIGN, ...auditClasses].map((d) => () =>
  parallel(PERSONAS.map((p) => () =>
    agent(`You are ${p}, judging BLIND — a COMPREHENSION test, not a beauty contest. CHOICE: ${d.question}\nCandidates:\n${d.candidates.map((c) => `- ${c.label}: "${c.example}"`).join('\n')}\nSTEP 1 (decisive): eliminate any candidate an ordinary reader could misread — a recurring schedule that can be read as one-time, a discrete list that can be read as a continuous span, or vice versa. STEP 2: among survivors pick the most natural written Ukrainian for a scheduling tool. Reply: best = the surviving candidate's LABEL, one-line reason.`,
      { label: `panel:${d.id}`, phase: 'Panels', model: 'sonnet', schema: CONVVOTE })))
    .then((vs) => {
      const votes = vs.filter(Boolean).map((v) => v.best)
      const tally = {}
      let best = votes[0]
      let bc = 0
      for (const v of votes) { tally[v] = (tally[v] || 0) + 1; if (tally[v] > bc) { bc = tally[v]; best = v } }
      return { id: d.id, winner: best, votes }
    })))
log(`panel verdicts: ${JSON.stringify(verdicts.filter(Boolean).map((v) => v.id + '=' + v.winner))}`)

phase('Normalize')
const normalized = await agent(`Apply these panel verdicts to the Ukrainian corpus ${CORPUS}, mechanically and corpus-wide, so the oracle is self-consistent: ${JSON.stringify(verdicts.filter(Boolean))}. For weekday-recurrence-marking: every weekday qualifier (single, list, range) must carry the winning recurrence form — rewrite every affected row's weekday phrase (meaning-preserving; never change which values a row states). For hour-list-vs-range-surface: every discrete hour list takes the winning form; ranges keep "з X до Y включно". For each audit class: normalize to the winning form. Record every verdict in ${NOTES} (a "Reconciled round 3 (2026-07-04)" section). Then run a consistency lint (grep the losing forms; assert zero) and \`node --check\` + eslint on the file. Report rows changed per class.`,
  { label: 'normalize', phase: 'Normalize', model: 'sonnet', schema: REPORT })
log(`normalized: ${normalized?.summary}`)

phase('Renderer')
const BUGLIST = `Also fix, from the last verify: (a) two DEGENERATE outputs found by \`node --import tsx scripts/fuzz-lang.mjs uk\` — a NaN and a stray-whitespace output — reproduce via the fuzz report and fix at the source; (b) the one non-exempt MISSING-VALUE case it lists; (c) notes.md §6's own minimal pair ('1 1 * * * *') must render as documented.`
let tddSummary = ''
let green = false
for (let round = 1; round <= 5; round++) {
  const tdd = await agent(`TDD round (convergence-3.${round}) for the Ukrainian renderer at ${SRC}/ against the audited, panel-normalized oracle ${CORPUS} (fix the renderer, NEVER edit the corpus; report any row you still believe wrong). ${BUGLIST} Group the failures by class, fix shared helpers first, re-run, repeat within your session. Keep typecheck and eslint green (no disables, no .replace). Report pass/total; ok=true only when the corpus is fully green.`,
    { label: `tdd:c3-${round}`, phase: 'Renderer', model: 'sonnet', schema: REPORT })
  tddSummary = tdd?.summary || tddSummary
  log(`tdd 3.${round}: ${tddSummary}`)
  if (tdd?.ok) { green = true; break }
}

phase('Verify')
const stability = await agent(`Refresh the Ukrainian stability extractor ${ROOT}/tooling/scripts/stability/uk.mjs against the renderer's CURRENT surface forms (probe ${SRC} over the engine matrix; the last run found its declared transformations stale — three gaps — and 64/144 cells failing for extractor reasons). Encode declared transformations (parity folds, absorbable tokens, the recurrence-marked weekday forms) per tooling/scripts/stability-engine.mjs's contract. Then run test/lang/uk/stability.js: investigate every remaining violation as extractor gap vs REAL relation bug — report real bugs, never paper over. Report cells green/total.`,
  { label: 'stability', phase: 'Verify', schema: REPORT, model: 'sonnet' })
log(`stability: ${stability?.summary}`)

const RETRY_TRAPS = [
  ['shared-qualifier-scope', 'a qualifier shared by both arms of an OR/list must scope over each arm, never strand on one'],
  ['confinement-vs-juxtaposition', 'a finer cadence confined to a coarser field must read as confinement, not juxtaposed independent cadences'],
  ['recurrence-marking', 'recurring days/dates must be marked as recurring, not readable as a single occurrence']
]
const traps = await parallel(RETRY_TRAPS.map(([id, summary]) => () =>
  parallel(PERSONAS.map((p) => () =>
    agent(`You are ${p}, BLIND. The Ukrainian renderer at ${SRC}/ handles cron's "${id}" situation: ${summary}. Render 2-3 core-set patterns (${ROOT}/test/core/core-set.json) that exercise it and judge whether an ordinary reader concludes exactly the intended meaning. Reply per the schema.`,
      { label: `trap:${id}`, phase: 'Verify', schema: VERDICT, model: 'sonnet' })))
    .then((vs) => ({ trap: id, pass: vs.filter(Boolean).filter((v) => v.readsAsIntended).length >= 2 }))))
log(`traps: ${traps.filter(Boolean).filter((t) => t.pass).length}/${RETRY_TRAPS.length} pass`)

const gate = await agent(`Run the FULL repo gate from ${ROOT}: \`npm run verify\`. If coverage fails on uk branches, add uk corpus rows for reachable branches (never lower thresholds; document genuinely-unreachable defensive branches per the honest-floor convention). Also run \`node --import tsx scripts/fuzz-lang.mjs uk\` and \`npm run docs\` (regenerate if stale). Report ok=true only if the whole gate passes; list failures precisely.`,
  { label: 'gate', phase: 'Verify', schema: REPORT, model: 'sonnet' })
log(`gate: ${gate?.ok ? 'clean' : 'FAILURES — ' + (gate?.failures || []).join('; ')}`)

return {
  audit: { duplicates: audit?.duplicatesResolved, classes: (audit?.classes || []).map((c) => c.id) },
  verdicts: verdicts.filter(Boolean),
  normalized: normalized?.summary,
  tdd: tddSummary,
  corpusGreen: green,
  stability: stability?.ok ? 'clean' : stability?.failures,
  traps: traps.filter(Boolean),
  gate: gate?.ok ? 'clean' : gate?.failures
}
