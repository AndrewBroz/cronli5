export const meta = {
  name: 'uk-finish',
  description: 'Finish the Ukrainian derivation: panel-reconcile the four corpus self-contradiction classes (the oracle must be consistent before TDD can converge), normalize the corpus per verdicts, TDD to green with the verify-found bug list, then re-run traps/verify/stability and the full gate.',
  phases: [
    { title: 'Reconcile', detail: 'panel the four corpus contradiction classes; normalize rows' },
    { title: 'Renderer', detail: 'TDD rounds against the consistent oracle + verify bug list' },
    { title: 'Panel', detail: 're-run the three failed traps' },
    { title: 'Verify', detail: 'fuzz / OR-scope / conventions / stability / full npm gate' }
  ]
}

const ROOT = '/Users/andrewbroz/Code/personal/cronli5'
const CORPUS = `${ROOT}/test/lang/uk/corpus.js`
const NOTES = `${ROOT}/src/lang/uk/notes.md`
const SRC = `${ROOT}/src/lang/uk`
const PLAYBOOK = `${ROOT}/.claude/skills/add-language/playbook.json`

const PERSONAS = [
  'an everyday native Ukrainian speaker (judges natural everyday wording)',
  'a meticulous Ukrainian copy-editor (judges written-register clarity and idiom)',
  'a precise Ukrainian-writing technical communicator (judges scannable, unambiguous precision)'
]
const CONVVOTE = { type: 'object', additionalProperties: false, required: ['best'], properties: { best: { type: 'string' }, reason: { type: 'string' } } }
const REPORT = { type: 'object', additionalProperties: false, required: ['ok', 'summary'], properties: { ok: { type: 'boolean' }, summary: { type: 'string' }, failures: { type: 'array', items: { type: 'string' } } } }
const VERDICT = { type: 'object', additionalProperties: false, required: ['readsAsIntended', 'best', 'reason'], properties: { readsAsIntended: { type: 'boolean' }, best: { type: 'string' }, misread: { type: 'string' }, reason: { type: 'string' } } }

// The four contradiction classes the first run documented inside the
// translated oracle. Each is ONE register decision the panel settles; the
// normalizer then applies the verdict corpus-wide so the oracle is
// self-consistent (the corpus is still a beta CANDIDATE at this stage — this
// is translation-review completion, not renderer-driven regeneration).
const CONTRADICTIONS = [
  { id: 'hour-range-bounds',
    question: 'How should an hour-range window read its bounds in a schedule sentence (the same construction everywhere)?',
    candidates: [
      { label: 'genitive-ordinal', example: 'кожні 15 хвилин з 9-ї до 17-ї години включно' },
      { label: 'digital', example: 'кожні 15 хвилин з 9:00 до 17:00 включно' }
    ] },
  { id: 'list-connective',
    question: 'Which final-list connective rule should schedule lists use, applied mechanically everywhere?',
    candidates: [
      { label: 'i-with-euphonic-j', example: 'о 4, 6 і 9 хвилині (та «й» після голосного: два й чотири)' },
      { label: 'ta-everywhere', example: 'о 4, 6 та 9 хвилині' }
    ] },
  { id: 'midnight-range-start',
    question: 'How should a range that starts at hour 0 name its start (given «північ»’s "north" homonym)?',
    candidates: [
      { label: 'digital-zero', example: 'щогодини з 0:00 до 5:00 включно' },
      { label: 'genitive-pivnochi', example: 'щогодини з півночі до 5-ї години включно' }
    ] },
  { id: 'union-date-ordinal-register',
    question: 'In the day-union predicate («щоразу, коли день — …»), should the date ordinal be spelled or a digit-ordinal?',
    candidates: [
      { label: 'digit-ordinal', example: 'щоразу, коли день — 13-те число або п’ятниця' },
      { label: 'spelled', example: 'щоразу, коли день — тринадцяте число або п’ятниця' }
    ] }
]

phase('Reconcile')
const verdicts = await parallel(CONTRADICTIONS.map((d) => () =>
  parallel(PERSONAS.map((p) => () =>
    agent(`You are ${p}, judging BLIND — a COMPREHENSION test, not a beauty contest. CHOICE: ${d.question}\nCandidates:\n${d.candidates.map((c) => `- ${c.label}: "${c.example}"`).join('\n')}\nSTEP 1 (decisive): would an ordinary reader of ONLY that candidate conclude the schedule's true meaning with no misreading (including any homonym hazard)? Eliminate misread-able candidates however natural. STEP 2: among survivors pick the most natural written Ukrainian for a scheduling tool. Reply: best = the surviving candidate's LABEL, one-line reason.`,
      { label: `reconcile:${d.id}`, phase: 'Reconcile', model: 'sonnet', schema: CONVVOTE })))
    .then((vs) => {
      const votes = vs.filter(Boolean).map((v) => v.best)
      const tally = {}
      let best = votes[0]
      let bc = 0
      for (const v of votes) { tally[v] = (tally[v] || 0) + 1; if (tally[v] > bc) { bc = tally[v]; best = v } }
      return { id: d.id, winner: best, votes }
    })))
log(`reconciliation verdicts: ${JSON.stringify(verdicts.filter(Boolean).map((v) => v.id + '=' + v.winner))}`)

const normalized = await agent(`Normalize the Ukrainian corpus ${CORPUS} per these panel verdicts, applied MECHANICALLY corpus-wide so the oracle is self-consistent: ${JSON.stringify(verdicts.filter(Boolean))}. The four classes (details in the first run's report): (1) hour-range bounds — every hour-range window uses the winning form; (2) final-list connective — apply the winning rule everywhere (if i-with-euphonic-j: default «і», «й» only after a vowel sound per notes.md §3; if ta-everywhere: «та» in every list); (3) hour-0 range starts per the winner; (4) union-predicate date ordinals per the winner. Meaning-preserving edits ONLY — never change which values a row states. Also record each verdict in ${NOTES} (a "Reconciled (2026-07-04)" section). Then run a consistency lint (grep the losing forms; assert zero). Report rows changed per class.`,
  { label: 'normalize', phase: 'Reconcile', model: 'sonnet', schema: REPORT })
log(`corpus normalized: ${normalized?.summary}`)

phase('Renderer')
const BUGLIST = `Known renderer bugs from the first run's verify (fix these explicitly): (a) minuteConfinement hand-rolls its bare/offset/bounded decision and silently DROPS a non-uniform stride's bound (e.g. '* 3/2 * 1 * *' must state the 59 endpoint) — route it through the shared chooseStride/renderStride machinery; (b) monthScope always emits locative with a bare «у» regardless of month shape — a month RANGE needs genitive «з червня до серпня включно» and no double preposition («у з» is malformed); (c) monthScopeForRecurrence's range branch doubles the preposition («з з січня») — compose from parts; (d) quartz L should read «останнього дня місяця» (not «останнього числа місяця») with correct month-scope composition (no doubled «місяця»); (e) the union-predicate quartz/weekday nominative forms vs qualifier genitive forms must stay distinct.`
let tddSummary = ''
let green = false
for (let round = 1; round <= 5; round++) {
  const tdd = await agent(`TDD round (continuation ${round}) for the Ukrainian renderer at ${SRC}/ against the RECONCILED oracle ${CORPUS} (fix the renderer, NEVER edit the corpus; report any row you believe is still wrong instead). ${BUGLIST} Strategy: run the corpus, group failures by class, fix the highest-leverage shared helpers first (case government, ordinal/dative/genitive forms, connective rule, window bounds per the reconciled convention), re-run, repeat within your session. Keep typecheck and eslint green (no disables, no .replace anywhere in the module). Report pass/total, ok=true only when the corpus is fully green.`,
    { label: `tdd:c${round}`, phase: 'Renderer', model: 'sonnet', schema: REPORT })
  tddSummary = tdd?.summary || tddSummary
  log(`tdd continuation ${round}: ${tddSummary}`)
  if (tdd?.ok) { green = true; break }
}

phase('Panel')
const RETRY_TRAPS = [
  ['shared-qualifier-scope', 'a qualifier shared by both arms of an OR/list must be carried by (or unambiguously scope over) each arm, never strand on one'],
  ['confinement-vs-juxtaposition', 'a finer cadence confined to a coarser field must read as confinement, not as two independent juxtaposed cadences'],
  ['recurrence-marking', 'recurring days/dates must be marked as recurring, not readable as a single occurrence']
]
const trapRetries = await parallel(RETRY_TRAPS.map(([id, summary]) => () =>
  parallel(PERSONAS.map((p) => () =>
    agent(`You are ${p}, BLIND. The Ukrainian renderer at ${SRC}/ handles cron's "${id}" situation: ${summary}. Render 2-3 core-set patterns (${ROOT}/test/core/core-set.json) that exercise it, state each schedule's true meaning, and judge whether an ordinary reader concludes exactly that meaning. Reply per the schema.`,
      { label: `trap:${id}`, phase: 'Panel', schema: VERDICT, model: 'sonnet' })))
    .then((vs) => ({ trap: id, pass: vs.filter(Boolean).filter((v) => v.readsAsIntended).length >= 2 }))))
log(`trap retries: ${trapRetries.filter(Boolean).filter((t) => t.pass).length}/${RETRY_TRAPS.length} pass`)

phase('Verify')
const verify = await agent(`Final mechanical verification of the Ukrainian module. From ${ROOT}: (1) \`node --import tsx scripts/fuzz-lang.mjs uk\` — 0 THROWS/DEGENERATE/DROPPED-YEAR/DROPPED-MINUTE-0; MISSING-VALUE only the documented spelled-numeral exemptions; (2) both-side OR-scope spot-check on month-scoped unions (the monthScope fixes); (3) render-and-check the reconciled conventions from ${NOTES} in the BUILT renderer (actual output strings); (4) the uk stability gate (test/lang/uk/stability.js) and the extractor tooling/scripts/stability/uk.mjs — update the extractor's declared transformations if the reconciliation changed surface forms, then all cells green; (5) \`npm run verify\` — the FULL repo gate (coverage: never lower thresholds; add uk corpus rows for reachable new branches instead). Report ok=true only if ALL pass; list failures precisely.`,
  { label: 'final-verify', phase: 'Verify', schema: REPORT, model: 'sonnet' })
log(`final verify: ${verify?.ok ? 'clean' : 'FAILURES — ' + (verify?.failures || []).join('; ')}`)

return {
  reconciled: verdicts.filter(Boolean),
  corpusNormalized: normalized?.summary,
  tdd: tddSummary,
  corpusGreen: green,
  trapRetries: trapRetries.filter(Boolean),
  finalVerify: verify?.ok ? 'clean' : verify?.failures
}
