export const meta = {
  name: 'uk-finish-3',
  description: 'Ukrainian convergence round 4: classify the 117 residual corpus failures by evidence (renderer bug vs corpus self-contradiction), panel only the contested conventions with full-sentence candidates, normalize the oracle, TDD to green, stability + full gate.',
  phases: [
    { title: 'Classify', detail: 'evidence-based split: renderer bug vs corpus contradiction' },
    { title: 'Panels', detail: 'blind 3-persona, full-sentence candidates, contested classes only' },
    { title: 'Normalize', detail: 'apply verdicts + majority forms corpus-wide; record in notes.md' },
    { title: 'Renderer', detail: 'TDD to green against the consistent oracle' },
    { title: 'Verify', detail: 'stability extractor, fuzz, docs, full npm gate' }
  ]
}

const ROOT = '/Users/andrewbroz/Code/personal/cronli5'
const CORPUS = `${ROOT}/test/lang/uk/corpus.js`
const NOTES = `${ROOT}/src/lang/uk/notes.md`
const SRC = `${ROOT}/src/lang/uk`
const FAILS = args.failList
const DATE = args.date

const PERSONAS = [
  'an everyday native Ukrainian speaker (judges natural everyday wording)',
  'a meticulous Ukrainian copy-editor (judges written-register clarity and idiom)',
  'a precise Ukrainian-writing technical communicator (judges scannable, unambiguous precision)'
]

const CLASSIFY = { type: 'object', additionalProperties: false, required: ['classes'], properties: {
  classes: { type: 'array', items: { type: 'object', additionalProperties: false,
    required: ['id', 'description', 'verdict', 'failingRows'], properties: {
      id: { type: 'string' },
      description: { type: 'string' },
      verdict: { type: 'string', enum: ['renderer-bug', 'corpus-majority', 'needs-panel'] },
      failingRows: { type: 'number' },
      evidence: { type: 'string' },
      majorityForm: { type: 'string' },
      panelQuestion: { type: 'string' },
      candidates: { type: 'array', items: { type: 'object', additionalProperties: false,
        required: ['label', 'sentence'], properties: {
          label: { type: 'string' }, sentence: { type: 'string' } } } }
    } } },
  notes: { type: 'string' }
} }
const CONVVOTE = { type: 'object', additionalProperties: false, required: ['best', 'reason'], properties: { best: { type: 'string' }, reason: { type: 'string' } } }
const REPORT = { type: 'object', additionalProperties: false, required: ['ok', 'summary'], properties: { ok: { type: 'boolean' }, summary: { type: 'string' }, failures: { type: 'array', items: { type: 'string' } } } }

phase('Classify')
// The round-3 lesson formalized: a failing row is only a renderer bug if the
// corpus's own passing rows agree with it. Every class must carry evidence —
// counts of each competing form across the WHOLE corpus (passing rows
// included), so arbitration is reserved for real self-contradictions and the
// oracle is never rewritten to match the renderer.
const classify = await agent(`Classify the 117 residual Ukrainian corpus failures in ${FAILS} (fields: pattern, expected = corpus oracle, actual = current renderer output). Work from ${ROOT}; read ${CORPUS} and ${NOTES} (the ratified conventions), and write/run node scripts to COUNT competing surface forms across the whole corpus for each construction involved. Partition ALL 117 failures into convention classes. For each class decide by evidence:
- verdict "renderer-bug": the corpus is internally consistent for this construction (cite counts) and the renderer diverges — includes degenerate outputs (e.g. the "о з 9:30:15" double preposition) and the fallback-word mismatch. The corpus must not change.
- verdict "corpus-majority": the corpus itself splits, but one form has a clear whole-corpus majority (cite counts, e.g. 41 vs 6) AND notes.md does not contradict it — the minority rows normalize to the majority, no panel needed.
- verdict "needs-panel": the corpus splits with no clear majority, or the majority conflicts with notes.md, or the two forms differ in MEANING (e.g. the hour-range end named "до 17:00 включно" vs "до 18:00" vs "до 17:59 включно" — a semantics choice, not typography). Supply panelQuestion and 2-4 candidates, each candidate a FULL example sentence copied verbatim from a real corpus row or renderer output (never a fragment).
Every one of the 117 failures must land in exactly one class. Be precise about the і/й euphonic alternation: if a deterministic phonetic rule explains the corpus's passing rows, a renderer that misapplies it is a renderer-bug class, not a split. Your final text is raw data for orchestration; return via the schema.`,
  { label: 'classify', phase: 'Classify', effort: 'high', schema: CLASSIFY })

const classes = (classify?.classes || [])
log(`classify: ${classes.length} classes — ${classes.filter((c) => c.verdict === 'renderer-bug').length} renderer-bug, ${classes.filter((c) => c.verdict === 'corpus-majority').length} corpus-majority, ${classes.filter((c) => c.verdict === 'needs-panel').length} need panels`)

phase('Panels')
const contested = classes.filter((c) => c.verdict === 'needs-panel' && (c.candidates || []).length >= 2).slice(0, 8)
if (classes.filter((c) => c.verdict === 'needs-panel').length > contested.length) {
  log(`panel cap: ${classes.filter((c) => c.verdict === 'needs-panel').length - contested.length} contested classes deferred (reported for a follow-up round)`)
}
const verdicts = await parallel(contested.map((d) => () =>
  parallel(PERSONAS.map((p) => () =>
    agent(`You are ${p}, judging BLIND — a COMPREHENSION test, not a beauty contest. You do not know which candidate any tool currently produces. QUESTION: ${d.panelQuestion}\nCandidates (each a complete sentence as a scheduling tool would print it):\n${d.candidates.map((c) => `- ${c.label}: "${c.sentence}"`).join('\n')}\nSTEP 1 (decisive): eliminate any candidate an ordinary reader could misread — wrong set of fire times, a discrete list read as a continuous span, a recurring schedule read as one-time, or vice versa. STEP 2: among survivors pick the most natural written Ukrainian. Reply: best = the surviving candidate's LABEL, one-line reason.`,
      { label: `panel:${d.id}`, phase: 'Panels', model: 'sonnet', schema: CONVVOTE })))
    .then((votes) => {
      const counts = {}
      votes.filter(Boolean).forEach((v) => { counts[v.best] = (counts[v.best] || 0) + 1 })
      const best = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]
      return { id: d.id, best, tally: counts, unanimous: counts[best] === votes.filter(Boolean).length, reasons: votes.filter(Boolean).map((v) => v.best + ': ' + v.reason) }
    })))
verdicts.filter(Boolean).forEach((v) => log(`panel ${v.id}: ${v.best} (${JSON.stringify(v.tally)})`))

phase('Normalize')
// One file-editing agent at a time; the corpus edit is scoped to the
// arbitrated classes only — renderer-bug rows are untouchable.
const normalizePlan = {
  majority: classes.filter((c) => c.verdict === 'corpus-majority').map((c) => ({ id: c.id, description: c.description, majorityForm: c.majorityForm, evidence: c.evidence })),
  panelled: verdicts.filter(Boolean).map((v) => ({ id: v.id, winner: v.best, tally: v.tally, question: contested.find((d) => d.id === v.id)?.panelQuestion, winnerSentence: contested.find((d) => d.id === v.id)?.candidates.find((c) => c.label === v.best)?.sentence }))
}
const normalized = await agent(`Normalize the Ukrainian corpus ${CORPUS} so the oracle is self-consistent, applying exactly this plan and nothing else: ${JSON.stringify(normalizePlan)}. For each majority class: rewrite the minority rows to the majority form (meaning-preserving — never change which fire times a row states). For each panelled class: rewrite every affected row to the winning form corpus-wide. Do NOT touch rows belonging to renderer-bug classes: ${JSON.stringify(classes.filter((c) => c.verdict === 'renderer-bug').map((c) => c.id + ': ' + c.description))}. Record each decision in ${NOTES} under a "Reconciled round 4 (${DATE})" section (convention, winner, tally or majority counts). Then lint: grep ${CORPUS} for each losing form and assert zero survivors; run \`node --check\` on the file and eslint. Report rows changed per class.`,
  { label: 'normalize', phase: 'Normalize', schema: REPORT })
log(`normalize: ${normalized?.summary || 'no report'}`)

phase('Renderer')
const bugBrief = classes.filter((c) => c.verdict === 'renderer-bug').map((c) => `- ${c.id}: ${c.description} (${c.evidence || ''})`).join('\n')
let green = false
for (let round = 1; round <= 3 && !green; round += 1) {
  const tdd = await agent(`TDD round (convergence-4.${round}) for the Ukrainian renderer at ${SRC}/ against the arbitrated oracle ${CORPUS}. Fix the renderer, NEVER edit the corpus; if you believe a specific row is still wrong, report it and leave it red. Known renderer-bug classes from the evidence pass:\n${bugBrief}\nRun \`npx vitest run test/lang/uk/corpus.js\` from ${ROOT}, group remaining failures by class, fix shared helpers before leaf cases, re-run, repeat within your session. Keep typecheck and eslint green (no rule disables, no output .replace patching). Comments and names must self-explain — no round/class labels in shipped code. Report pass/total; ok=true only when fully green.`,
    { label: `tdd-${round}`, phase: 'Renderer', effort: 'high', schema: REPORT })
  green = !!tdd?.ok
  log(`tdd round ${round}: ${tdd?.summary || 'no report'}`)
  if (!green && (tdd?.failures || []).some((f) => f.includes('corpus'))) {
    log('tdd reports suspected corpus rows — surfacing for review instead of looping')
    break
  }
}

phase('Verify')
const stability = await agent(`Refresh the Ukrainian stability extractor ${ROOT}/tooling/scripts/stability/uk.mjs against the renderer's CURRENT surface forms (probe ${SRC} over the stability engine matrix). Encode declared transformations per tooling/scripts/stability-engine.mjs's contract for the round-4 arbitrated forms. Then run \`npx vitest run test/lang/uk/stability.js\`: investigate every violation as extractor gap vs REAL relation bug — fix extractor gaps, report real bugs, never paper over. Report cells green/total.`,
  { label: 'stability', phase: 'Verify', schema: REPORT })
const gate = await agent(`Run the full repo gate from ${ROOT}: \`npm run verify\`, plus \`node --import tsx scripts/fuzz-lang.mjs uk\` and \`npm run docs\` (regenerate if stale — never hand-edit generated docs). If coverage fails on uk branches, add uk corpus rows for reachable branches (never lower thresholds). Report ok=true only if everything passes; list failures precisely.`,
  { label: 'gate', phase: 'Verify', schema: REPORT })

return {
  green,
  classes: classes.map((c) => ({ id: c.id, verdict: c.verdict, failingRows: c.failingRows, description: c.description })),
  panelVerdicts: verdicts.filter(Boolean),
  normalized: normalized?.summary,
  stability: stability?.summary,
  gate: { ok: gate?.ok, summary: gate?.summary, failures: gate?.failures }
}
