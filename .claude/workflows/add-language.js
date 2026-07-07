export const meta = {
  name: 'add-language',
  description: 'Add a language by DERIVATION (the default build path): anchor to a donor (validated sibling, else English) — donor-anchored conventions panel, corpus TRANSLATION in panel-reviewed batches (the oracle, finalized before the port), naive renderer port, TDD to green, habit-critics, trap panels, mechanical verify (fuzz/OR-scope/round-trip/stability extractor), playbook, beta status. The old BLIND clean-room build survives only as mode: "rewrite-test" (the pipeline soundness check). Every panel is blind Claude Sonnet personas. Ships beta; stable needs a fluent human.',
  whenToUse: 'Adding a new language module (args: code, name, donor — donor defaults to en, the universal anchor), or running the clean-room rewrite-test soundness check (mode: "rewrite-test").',
  phases: [
    { title: 'Conventions', detail: 'donor-anchored style contract; panel only the divergences' },
    { title: 'Corpus', detail: 'translate the donor corpus in panel-reviewed batches (derive) / blind-author (rewrite-test)' },
    { title: 'Renderer', detail: 'naive donor port + TDD to green (derive) / pressured clean-room build (rewrite-test)' },
    { title: 'Critique', detail: 'five habit-critics read the output' },
    { title: 'Panel', detail: 'comprehension panels on the playbook traps' },
    { title: 'Verify', detail: 'fuzz / OR-scope / conventions render-check / stability / roundtrip / coverage' },
    { title: 'Judge', detail: 'adversarial old-vs-new comparison (rewrite-test only)' },
    { title: 'Wire', detail: 'package exports, docs, beta status (derive only)' },
    { title: 'Playbook', detail: 'append any new universal lesson' }
  ]
}

const a = (typeof args === 'string' ? JSON.parse(args) : args) || {}
const CODE = a.code
const NAME = a.name || CODE
const MODE = a.mode || 'derive' // 'derive' | 'rewrite-test'
const DONOR = a.donor || 'en'
const STOP = a.stopAfter || null // e.g. 'corpus' — halt for inspection
const ROOT = '/Users/andrewbroz/Code/personal/cronli5'
const PLAYBOOK = `${ROOT}/.claude/skills/add-language/playbook.json`
const CORESET = `${ROOT}/test/core/core-set.json`
const IR = `${ROOT}/src/core/schedule.ts`

if (!CODE) {
  throw new Error('add-language workflow needs args.code')
}

const isTest = MODE === 'rewrite-test'
const SRC = isTest ? `${ROOT}/tooling/experiments/${CODE}-rebuild` : `${ROOT}/src/lang/${CODE}`
const original = isTest ? `${ROOT}/src/lang/${CODE}` : null
const DONOR_SRC = `${ROOT}/src/lang/${DONOR}`
const DONOR_TESTS = `${ROOT}/test/lang/${DONOR}`

const PERSONAS = [
  `an everyday native ${NAME} speaker (judges natural everyday wording)`,
  `a meticulous ${NAME} copy-editor (judges written-register clarity and idiom)`,
  `a precise ${NAME}-writing technical communicator (judges scannable, unambiguous precision)`
]

// ---- shared schemas ----
const FLAGS = {
  type: 'object', additionalProperties: false, required: ['flags'],
  properties: { flags: { type: 'array', items: {
    type: 'object', additionalProperties: false,
    required: ['id', 'issue', 'fix'],
    properties: { id: { type: 'string' }, issue: { type: 'string' },
      fix: { type: 'string' }, rule: { type: 'string' } } } } }
}
const VERDICT = {
  type: 'object', additionalProperties: false,
  required: ['readsAsIntended', 'best', 'reason'],
  properties: { readsAsIntended: { type: 'boolean' }, best: { type: 'string' },
    misread: { type: 'string' }, reason: { type: 'string' } }
}
const REPORT = {
  type: 'object', additionalProperties: false, required: ['ok', 'summary'],
  properties: { ok: { type: 'boolean' }, summary: { type: 'string' },
    failures: { type: 'array', items: { type: 'string' } } }
}
const TRAPS = { type: 'object', additionalProperties: false, required: ['traps'], properties: { traps: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['id', 'summary'], properties: { id: { type: 'string' }, summary: { type: 'string' } } } } } }
const ADVGEN = { type: 'object', additionalProperties: false, required: ['patterns'], properties: { patterns: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['cron'], properties: { cron: { type: 'string' }, opts: { type: 'string' } } } } } }
const JUDGE = { type: 'object', additionalProperties: false, required: ['winner'], properties: { winner: { type: 'string' }, note: { type: 'string' } } }
const EVALR = { type: 'object', additionalProperties: false, required: ['holdoutPass', 'holdoutTotal', 'lines', 'disables'], properties: { holdoutPass: { type: 'number' }, holdoutTotal: { type: 'number' }, lines: { type: 'number' }, disables: { type: 'number' }, dupPct: { type: 'number' }, complexity: { type: 'number' } } }
const CONTESTED = { type: 'object', additionalProperties: false, required: ['contested'], properties: { contested: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['id', 'question', 'candidates'], properties: { id: { type: 'string' }, question: { type: 'string' }, candidates: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['label', 'example'], properties: { label: { type: 'string' }, example: { type: 'string' } } } } } } } } }
const CONVVOTE = { type: 'object', additionalProperties: false, required: ['best'], properties: { best: { type: 'string' }, reason: { type: 'string' } } }
const RECONCILE = { type: 'object', additionalProperties: false, required: ['agreedCount', 'contested'], properties: { agreedCount: { type: 'number' }, contested: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['pattern', 'candidates'], properties: { pattern: { type: 'string' }, meaning: { type: 'string' }, candidates: { type: 'array', items: { type: 'string' } }, flags: { type: 'string' } } } } } }
const ROUNDTRIP = { type: 'object', additionalProperties: false, required: ['checked', 'verified', 'needsReview'], properties: { checked: { type: 'number' }, verified: { type: 'number' }, needsReview: { type: 'number' }, orNoise: { type: 'number' }, reviewPatterns: { type: 'array', items: { type: 'string' } } } }
const BATCHES = { type: 'object', additionalProperties: false, required: ['batches'], properties: { batches: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['id', 'source', 'rows'], properties: { id: { type: 'string' }, source: { type: 'string' }, rows: { type: 'number' } } } } } }
const pickMajority = (arr) => {
  const m = {}
  let best = arr[0]
  let bc = 0
  for (const s of arr) { m[s] = (m[s] || 0) + 1; if (m[s] > bc) { bc = m[s]; best = s } }
  return best
}

const CORPUS = isTest
  ? `${ROOT}/tooling/experiments/${CODE}-rebuild/corpus.js`
  : `${ROOT}/test/lang/${CODE}/corpus.js`
const NOTES = isTest ? `${SRC}/notes.md` : `${ROOT}/src/lang/${CODE}/notes.md`
const cleanRoom = isTest
  ? ` CLEAN-ROOM: you are STRICTLY FORBIDDEN from reading ${original}/ or ${ROOT}/test/lang/${CODE}/ (the original renderer and corpus). Derive everything fresh from the playbook, the core IR, and the schedule meaning. The goal is to INDEPENDENTLY arrive at output that RESOLVES the traps, never to reproduce the original.`
  : ''

// ===================================================== CONVENTIONS
phase('Conventions')
let conventions = null

if (isTest) {
  // Blind clean-room conventions: drafted from scratch (the soundness check).
  const draft = await agent(`Draft the ${NAME} (${CODE}) rendering conventions — the style contract the corpus is authored against. Read the playbook ${PLAYBOOK} (universal traps) and core set ${CORESET}. Decide numerals, date/weekday/month forms, list/range connectives, recurrence marking, and how this grammar RESOLVES each universal trap — traps must be RESOLVED. Write a DRAFT to ${NOTES} (create the dir). CRUCIALLY, surface EVERY genuinely-contested REGISTER choice as a contested decision with 2-4 candidates, each with a concrete example sentence: clock format, the midnight/noon idiom, daily framing, interval phrasing, the union connective, and the range-BOUNDARY convention. Return the contested decisions.${cleanRoom}`,
    { label: 'conventions:draft', phase: 'Conventions', model: 'sonnet', schema: CONTESTED })
  const decided = await parallel((draft?.contested || []).map((d) => () =>
    parallel(PERSONAS.map((p) => () =>
      agent(`You are ${p}, judging BLIND — this is a COMPREHENSION test, NOT a beauty contest. CHOICE: ${d.question}\nCandidates:\n${d.candidates.map((c) => `- ${c.label}: "${c.example}"`).join('\n')}\nSTEP 1 (decisive): would an ordinary reader who sees ONLY a candidate conclude the schedule's TRUE meaning with NO misreading? A day-union MUST read as "runs on BOTH sets of days" — any candidate a reader could take as "one or the other" is ELIMINATED, however natural. STEP 2: among the survivors only, pick the most natural. Reply: best = the surviving candidate's label, and a one-line reason.`,
        { label: `conv:${d.id}`, phase: 'Conventions', model: 'sonnet', schema: CONVVOTE })))
      .then((vs) => ({id: d.id, question: d.question, votes: vs.filter(Boolean).map((v) => v.best)}))))
  conventions = await agent(`Finalize the ${NAME} (${CODE}) conventions in ${NOTES}. For each contested register choice, ADOPT the candidate the blind panel preferred (majority): ${JSON.stringify(decided.filter(Boolean))}. Rewrite ${NOTES} so every register choice reflects the panel verdict. Report the final choices.`,
    { label: 'conventions:finalize', phase: 'Conventions', model: 'sonnet' })
} else {
  // DERIVATION: start from the donor's style contract; surface ONLY where the
  // target genuinely diverges (clock, ordinals, day-periods, connectives,
  // case/agreement, numeral government), panel the contested divergences.
  const draft = await agent(`Draft the ${NAME} (${CODE}) rendering conventions ANCHORED TO THE DONOR ${DONOR}. Read the donor's conventions ${DONOR_SRC}/notes.md, the playbook ${PLAYBOOK}, and the core set ${CORESET}. Start from the donor's style contract and surface ONLY where ${NAME} genuinely diverges: clock format and time-of-day words, ordinal forms, list/range connectives, recurrence marking, weekday/month name forms and grammatical case, numeral government and agreement (e.g. paucal/plural classes), the union frame's wording, and how each universal playbook trap resolves in ${NAME}. Write a DRAFT to ${NOTES} (create the dir; RECORD the donor: "${DONOR}"). Surface EVERY genuinely-contested register divergence as a contested decision with 2-4 candidates, each with a concrete example sentence in ${NAME}. Do not contest choices where ${NAME} has one standard form. Return the contested decisions.`,
    { label: 'conventions:draft', phase: 'Conventions', model: 'sonnet', schema: CONTESTED })
  const decided = await parallel((draft?.contested || []).map((d) => () =>
    parallel(PERSONAS.map((p) => () =>
      agent(`You are ${p}, judging BLIND — this is a COMPREHENSION test, NOT a beauty contest. CHOICE: ${d.question}\nCandidates:\n${d.candidates.map((c) => `- ${c.label}: "${c.example}"`).join('\n')}\nSTEP 1 (decisive): would an ordinary reader who sees ONLY a candidate conclude the schedule's TRUE meaning with NO misreading? A day-union MUST read as "runs on BOTH sets of days" — any candidate a reader could take as "one or the other" is ELIMINATED, however natural. STEP 2: among the survivors only, pick the most natural written ${NAME}. Reply: best = the surviving candidate's label, and a one-line reason.`,
        { label: `conv:${d.id}`, phase: 'Conventions', model: 'sonnet', schema: CONVVOTE })))
      .then((vs) => ({id: d.id, question: d.question, votes: vs.filter(Boolean).map((v) => v.best)}))))
  conventions = await agent(`Finalize the ${NAME} (${CODE}) conventions in ${NOTES}. For each contested divergence, ADOPT the candidate the blind panel preferred (majority): ${JSON.stringify(decided.filter(Boolean))}. Rewrite ${NOTES} so every register choice reflects the panel verdict; keep the donor record ("derived from ${DONOR}") and the trap resolutions. Report the final clock format, idioms, connectives, and case/agreement rules chosen.`,
    { label: 'conventions:finalize', phase: 'Conventions', model: 'sonnet' })
}

// ===================================================== CORPUS
phase('Corpus')
let corpusNote = null

if (isTest) {
  // Blind 3-author corpus discovery (the soundness check), unchanged.
  const dir = `${ROOT}/tooling/experiments/${CODE}-rebuild`
  await parallel(['a', 'b', 'c'].map((v) => () =>
    agent(`Author ${NAME} (${CODE}) corpus VARIANT ${v} at ${dir}/corpus-${v}.js, spanning the full core set ${CORESET}. For each pattern's MEANING, analyze the core IR — never lift wording from any existing renderer. STYLE per the PANELLED conventions ${NOTES} and the playbook traps ${PLAYBOOK}. NEVER drop a field value. Author INDEPENDENTLY. Mirror test/lang/de/corpus.js structure. Report entry count.${cleanRoom}`,
      { label: `corpus:${v}`, phase: 'Corpus', model: 'sonnet' })))
  const reconcile = await agent(`Reconcile the three ${NAME} corpus variants (${dir}/corpus-a.js, -b.js, -c.js). Write and run a node script from ${ROOT} that, keyed by core-set pattern: (1) DIFF across a/b/c; (2) FIELD-COVERAGE (every non-wildcard value surfaces); (3) TRAP-LINTS per ${NOTES}. Return agreedCount and the CONTESTED list (cap 40) with pattern, IR meaning, candidates, flags.`,
    { label: 'reconcile', phase: 'Corpus', model: 'sonnet', schema: RECONCILE })
  const resolved = await parallel((reconcile?.contested || []).slice(0, 40).map((c) => () =>
    parallel(PERSONAS.map((p) => () =>
      agent(`You are ${p}, judging BLIND — a COMPREHENSION test. The schedule MEANS: ${c.meaning || c.pattern}.\nCandidates:\n${(c.candidates || []).map((s, i) => `${i + 1}. "${s}"`).join('\n')}\nSTEP 1: ELIMINATE any candidate an ordinary reader could MISread. STEP 2: among survivors pick the most natural; if none survive, give an improved rendering. ${c.flags ? 'Detector flags: ' + c.flags + '\n' : ''}Reply: best = the exact chosen text.`,
        { label: `corpus-panel:${c.pattern}`, phase: 'Corpus', model: 'sonnet', schema: CONVVOTE })))
      .then((vs) => ({pattern: c.pattern, winner: pickMajority(vs.filter(Boolean).map((v) => v.best))}))))
  corpusNote = await agent(`Assemble the canonical ${NAME} corpus at ${CORPUS} from the variants in ${dir}, using panel winners for contested rows: ${JSON.stringify((resolved || []).filter(Boolean))}. Mirror test/lang/de/corpus.js. RE-RUN the detector suite on the FINAL ${CORPUS}; fix residual flags; delete the variant files. Report final entry count.`,
    { label: 'assemble', phase: 'Corpus', model: 'sonnet' })
} else {
  // DERIVATION: TRANSLATE the donor's reviewed corpus, batch by batch, each
  // batch panel-reviewed for faithful meaning + natural target idiom +
  // coverage parity. The translated corpus is the ORACLE, finalized BEFORE
  // the port and never regenerated from the renderer (corpus → review →
  // port → TDD; the order is load-bearing).
  const plan = await agent(`Plan the ${NAME} corpus translation batches from the donor's reviewed test suite at ${DONOR_TESTS}/. List the donor's semantic corpus sources (its corpus/core-set/complex/compound/steps files of [pattern, expected] rows), EXCLUDING donor-specific blocks that do not transfer (donor dialect typography rows, donor-only known-issue probes, stability gates). Partition into 6-10 batches of roughly comparable row counts, each identified by source file (or file slice). Return the batch list with row counts.`,
    { label: 'corpus:plan', phase: 'Corpus', model: 'sonnet', schema: BATCHES })
  const dir = `${ROOT}/tooling/experiments/${CODE}-derive`
  const batches = (plan?.batches || []).slice(0, 12)
  log(`corpus translation: ${batches.length} batches from ${DONOR_TESTS}`)
  const reviewed = await pipeline(batches,
    (b) => agent(`Translate donor corpus batch ${b.id} (${b.source}) into ${NAME}: for each [pattern, expected] row, keep the cron pattern EXACTLY and translate the expected description into natural written ${NAME} per the PANELLED conventions ${NOTES} (pin every convention the panel ratified DIFFERENTLY from the donor — do not let the translation silently inherit the donor's forms) and the playbook traps ${PLAYBOOK}. The MEANING is inherited from the donor (already validated); your job is faithful + natural ${NAME} idiom + coverage parity (translate every transferable row; skip donor-typography-only rows and note skips). Respect ${NAME} morphology precisely: case government, numeral agreement (paucal/plural classes), capitalization, punctuation. Write the batch to ${dir}/batch-${b.id}.js as runnable rows ([pattern, expected, opts?]) mirroring test/lang/de/corpus.js row style. Report rows written and rows skipped.`,
      { label: `translate:${b.id}`, phase: 'Corpus', model: 'sonnet' }),
    (done, b) => parallel(PERSONAS.map((p) => () =>
      agent(`You are ${p}, reviewing translation batch ${b.id} at ${dir}/batch-${b.id}.js BLIND (you may also read the conventions ${NOTES}, and the donor rows in ${b.source} for the intended MEANING only). Judge the batch as a whole for: (1) FAITHFUL meaning (no dropped or altered field values); (2) natural written ${NAME} (case, agreement, numeral government, idiom); (3) conventions applied as ratified (not the donor's forms). readsAsIntended=true only if the batch passes all three; best = up to 8 corrected rows in the form "pattern => corrected expected" for the worst offenders (or "clean").`,
        { label: `review:${b.id}`, phase: 'Corpus', model: 'sonnet', schema: VERDICT })))
      .then((vs) => ({batch: b.id, verdicts: vs.filter(Boolean)})),
    (rev, b) => agent(`Apply the panel review to batch ${b.id} at ${dir}/batch-${b.id}.js: ${JSON.stringify(rev)}. For every corrected row a majority of reviewers agree on, adopt the correction; where reviewers conflict, prefer the correction that preserves meaning exactly. Report rows changed.`,
      { label: `fix:${b.id}`, phase: 'Corpus', model: 'sonnet' }))
  log(`corpus batches reviewed: ${reviewed.filter(Boolean).length}/${batches.length}`)
  corpusNote = await agent(`Assemble the canonical ${NAME} corpus at ${CORPUS} from the reviewed batches ${dir}/batch-*.js: one file mirroring test/lang/de/corpus.js (a local run() helper binding {lang} to the module import, describe blocks per batch source, all rows verbatim from the batches). Then run the mechanical detector pass on the FINAL file: (1) FIELD-COVERAGE — every non-wildcard field value surfaces in its row's prose (numerals may be spelled; check the conventions); (2) TRAP-LINTS per ${NOTES} (union frame present on DOM/DOW rows; range-boundary form as ratified; no redundant cadence under a finer one); (3) per-field phrasing consistency across rows. Fix residual flags in place (meaning-preserving only). Keep the batch files (they are the working record). Report final row count and detector status.`,
    { label: 'assemble', phase: 'Corpus', model: 'sonnet' })
}

if (STOP === 'corpus') {
  return {stoppedAfter: 'corpus', mode: MODE, code: CODE, donor: DONOR, corpus: CORPUS, conventions, corpusNote}
}

// ===================================================== RENDERER
phase('Renderer')
let build = null

if (isTest) {
  // Pressured clean-room 3-Pareto build (the soundness check), unchanged.
  const TRAIN = `${ROOT}/tooling/experiments/${CODE}-rebuild/train.js`
  const HOLDOUT = `${ROOT}/tooling/experiments/${CODE}-rebuild/holdout.js`
  await agent(`Partition ${CORPUS} into ${TRAIN} (~85%) and ${HOLDOUT} (~15%), STRATIFIED across cells/value-classes/variants. Copy entries verbatim; both files run like the corpus. Report the two counts.`,
    { label: 'split', phase: 'Renderer', model: 'sonnet' })
  const priorClause = `STRICTLY FORBIDDEN to read: ${original}/ (original renderer), ${ROOT}/test/lang/${CODE}/ (original corpus), ${HOLDOUT}, and any other src/lang/* module — this is clean-room.`
  const VARIANTS = ['a', 'b', 'c']
  const ROUNDS = 2
  let winner = null
  let buildSummary = 'no variant'
  for (let r = 1; r <= ROUNDS; r++) {
    const seedLine = winner
      ? `Start from the current best variant at ${winner} (copy it into your dir), then IMPROVE it without regressing TRAIN.`
      : `Build from scratch.`
    const built = await parallel(VARIANTS.map((v) => () => {
      const vdir = `${ROOT}/tooling/experiments/${CODE}-rebuild-r${r}${v}`
      return agent(`Pressured ${NAME} (${CODE}) renderer build — round ${r}, variant ${v}. Write a complete renderer at ${vdir}/ (index.ts + dialects.ts) implementing the Language interface in ${IR}. ${seedLine} You may read: ${IR}, the core helpers, the TRAIN set ${TRAIN}, the conventions ${NOTES}, the playbook ${PLAYBOOK}. ${priorClause} TDD against ${TRAIN} until green, then satisfy the form pressures (zero eslint-disable, minimal duplication, complexity within the lint rule). Report train pass/total and line count.`,
        { label: `build:r${r}${v}`, phase: 'Renderer', model: 'sonnet', schema: REPORT })
        .then((rep) => ({ v, dir: vdir, rep }))
    }))
    const evals = await parallel(built.filter((b) => b && b.rep).map((b) => () =>
      agent(`Evaluate the ${NAME} renderer variant at ${b.dir}: held-out pass rate vs ${HOLDOUT}, eslint-disable count, line count, duplication percent, max complexity. Numbers only.`,
        { label: `eval:r${r}${b.v}`, phase: 'Renderer', model: 'sonnet', schema: EVALR })
        .then((e) => ({...b, eval: e}))))
    const ranked = evals.filter((e) => e && e.eval && e.eval.disables === 0)
      .sort((x, y) => (y.eval.holdoutPass - x.eval.holdoutPass) ||
        (x.eval.lines - y.eval.lines) || ((x.eval.dupPct || 0) - (y.eval.dupPct || 0)))
    const top = ranked[0] || evals.filter(Boolean)[0]
    if (top) {
      winner = top.dir
      buildSummary = `round ${r}: held-out ${top.eval?.holdoutPass}/${top.eval?.holdoutTotal}, ${top.eval?.lines} lines`
    }
    log(`Renderer ${buildSummary}`)
  }
  await agent(`Copy the winning ${NAME} variant from ${winner} to ${SRC} (replace it). Confirm ${SRC}/index.ts exists.`,
    { label: 'promote-winner', phase: 'Renderer', model: 'sonnet' })
  build = { summary: buildSummary }
} else {
  // DERIVATION: naive donor port, then TDD to green against the reviewed
  // corpus. ONE renderer; the donor's STRUCTURE ports as-is (plan dispatch,
  // composers, the core day/hour fact consumption, part-composed phrases —
  // no .replace phrase surgery, which the lint forbids); the words,
  // morphology, and tables become ${NAME}'s. RED is expected first; the RED
  // failures ARE the donor→target divergences worth attention.
  const port = await agent(`Naive ${NAME} (${CODE}) renderer port from the donor. Copy ${DONOR_SRC}/index.ts and ${DONOR_SRC}/dialects.ts to ${SRC}/ (create the dir; a language NEVER imports another — port by copying and translating source). Keep the donor's structure intact: the plan dispatch table, composer shape, analyses.day / analyses.hourStride fact consumption, and part-composed phrase builders (NO .replace phrase surgery — eslint forbids it in src/lang/**). Replace the lexicon: month/weekday name tables, number words and ordinal/case forms, unit forms, connectives, quartz nouns, the union frame wording, sentence()/reboot()/fallback() — all per the ratified conventions ${NOTES}. ${NAME} morphology that the donor's helper shapes cannot express (case government, paucal/plural numeral agreement) may add helpers, but keep the donor's decomposition. Reduce the dialect table to ${NAME}'s single default voice unless ${NOTES} ratified dialects. Then run the corpus ${CORPUS} — RED is expected. Report compile status and pass/fail counts.`,
    { label: 'port', phase: 'Renderer', model: 'sonnet', schema: REPORT })
  log(`naive port: ${port?.summary || 'done'}`)
  let tddSummary = ''
  for (let round = 1; round <= 4; round++) {
    const tdd = await agent(`TDD round ${round} for the ${NAME} renderer at ${SRC}/ against the reviewed corpus ${CORPUS} (the ORACLE — fix the renderer, NEVER edit the corpus; if you are convinced a corpus row is wrong, list it in the report instead). Run the corpus, fix the highest-leverage failures (shared helpers first: agreement, case forms, connectives), re-run, repeat within this session. Keep typecheck and eslint (no disables; no .replace in the module) green. Report pass/total and remaining failure classes.`,
      { label: `tdd:r${round}`, phase: 'Renderer', model: 'sonnet', schema: REPORT })
    tddSummary = tdd?.summary || tddSummary
    log(`tdd round ${round}: ${tddSummary}`)
    if (tdd?.ok) { break }
  }
  build = { summary: tddSummary }
}
log(`renderer build: ${build?.summary}`)

// ============================================================ CRITICS
phase('Critique')
const FACETS = [
  ['redundancy', 'flag any word/clause that earns nothing (a juxtaposed cadence under a finer one, a repeated qualifier, a restated scope)'],
  ['misparse', 'flag any garden-path or mis-scope — a trailing qualifier that strands onto one OR/list arm, a connective that reads as the wrong set operation'],
  ['consistency', 'flag any entry that phrases a feature differently from the conventions or its sibling entries'],
  ['naturalness', 'flag phrasings a fluent native would not write'],
  ['fidelity', 'flag any dropped or misstated field value vs the schedule meaning']
]
const critiques = await parallel(FACETS.map(([tag, lens]) => () =>
  agent(`You are a ${NAME} schedule reviewer applying ONE lens: ${lens}. The renderer module is at ${SRC}/. Render the core set (${CORESET}) with it and read the conventions/playbook (${PLAYBOOK}). Flag ONLY genuine defects; for each give the pattern, the issue, a concrete corrected fragment, and the rule it implies. Be conservative.`,
    { label: `critic:${tag}`, phase: 'Critique', schema: FLAGS, model: 'sonnet' })))
const allFlags = critiques.filter(Boolean).flatMap((c) => c.flags || [])
log(`critics raised ${allFlags.length} flags`)

// ============================================================ TRAP PANELS
phase('Panel')
const playbook = await agent(`Read ${PLAYBOOK} and return its "traps" array as JSON only: {"traps":[{"id","summary"}]}.`,
  { label: 'load-playbook', phase: 'Panel', schema: TRAPS })
const trapPanels = await parallel((playbook?.traps || []).map((t) => () =>
  parallel(PERSONAS.map((p) => () =>
    agent(`You are ${p}, BLIND. The renderer at ${SRC}/ handles cron's "${t.id}" situation: ${t.summary}. Find a core-set pattern that exercises it, state the schedule's true meaning, then judge whether the renderer's output makes an ordinary reader conclude that exact meaning (no misread). Reply per the schema.`,
      { label: `panel:${t.id}`, phase: 'Panel', schema: VERDICT, model: 'sonnet' })))
    .then((vs) => ({ trap: t.id,
      pass: vs.filter(Boolean).filter((v) => v.readsAsIntended).length >= 2,
      verdicts: vs.filter(Boolean) }))))
const trapFails = trapPanels.filter(Boolean).filter((tp) => !tp.pass)
log(`trap panels: ${trapPanels.length - trapFails.length}/${trapPanels.length} pass`)

// ============================================================ VERIFY
phase('Verify')
const verify = await agent(`Mechanically verify the ${NAME} (${CODE}${isTest ? '-rebuild' : ''}) renderer at ${SRC}. Run via bash from ${ROOT}: (1) the fuzz detector (\`node --import tsx scripts/fuzz-lang.mjs ${CODE}\`${isTest ? ' adapted to the rebuild path' : ''}) — assert 0 THROWS / DEGENERATE / MISSING-VALUE / DROPPED-YEAR; (2) the both-side OR-scope detector (every OR with a restricted shared qualifier carries it on each arm); (3) RENDER-AND-CHECK the ratified conventions from ${NOTES} in the BUILT renderer (day-period/clock boundaries, ordinals — a port can silently keep the donor's convention, and a persona can misverify it: check actual output strings); (4) the corpus tests pass; (5) typecheck + eslint clean for the module (no disables, no .replace). Report ok=true only if all pass; list failures.`,
  { label: 'verify', phase: 'Verify', schema: REPORT, model: 'sonnet' })
log(`verify: ${verify?.ok ? 'clean' : 'FAILURES — ' + (verify?.failures || []).join('; ')}`)

let stability = null
if (!isTest) {
  // Port the donor's stability extractor: the relational invariants the donor
  // held must hold in the target (arm / frame / weekday-order stability).
  stability = await agent(`Port the ${DONOR} stability extractor to ${NAME}. Read tooling/docs/language-pipeline.md (Relational stability), the engine ${ROOT}/tooling/scripts/stability-engine.mjs, and the donor extractor ${ROOT}/tooling/scripts/stability/${DONOR}.mjs. Write ${ROOT}/tooling/scripts/stability/${CODE}.mjs mapping ${NAME}'s surface forms (probe the renderer at ${SRC} over the engine matrix to discover them) to the engine vocabulary, with declared transformations (parity folds, absorbable start tokens) encoded in the extractor. Write the vitest gate ${ROOT}/test/lang/${CODE}/stability.js mirroring test/lang/es/stability.js. Run the engine; investigate EVERY violation as either an extractor gap or a REAL renderer relation bug — report real bugs, never paper them over. Report cells and violations.`,
    { label: 'stability', phase: 'Verify', schema: REPORT, model: 'sonnet' })
  log(`stability: ${stability?.summary || 'n/a'}`)
}

await agent(`Round-trip prep for ${NAME} (${CODE}). Via bash from ${ROOT}: write and run a node snippet that imports {prepareRoundtrip} from ${ROOT}/tooling/scripts/roundtrip.mjs and the default export from ${SRC}/index.js as the renderer, calls prepareRoundtrip(renderer, 40), and writes ${ROOT}/tmp/rt-${CODE}-desc.json = [{id, description}] (DESCRIPTIONS ONLY) and ${ROOT}/tmp/rt-${CODE}-key.json = the full list. Report the item count.`,
  { label: 'roundtrip:prep', phase: 'Verify', model: 'sonnet' })
await agent(`You are a BLIND cron reverse-parser for ${NAME}. Read ONLY ${ROOT}/tmp/rt-${CODE}-desc.json (no crons in it). You are STRICTLY FORBIDDEN from reading ${ROOT}/tmp/rt-${CODE}-key.json or the renderer source. For each description infer ONE standard cron; when a day-of-month and a weekday are unioned, set BOTH fields. Write ${ROOT}/tmp/rt-${CODE}-rec.json = [{id, recovered}]. Report the count.`,
  { label: 'roundtrip:recover', phase: 'Verify', model: 'sonnet' })
const roundtrip = await agent(`Tally the ${NAME} round-trip: join ${ROOT}/tmp/rt-${CODE}-key.json with ${ROOT}/tmp/rt-${CODE}-rec.json, call tallyRoundtrip from ${ROOT}/tooling/scripts/roundtrip.mjs, and report checked, verified, needsReview, orNoise, reviewPatterns (cap 20).`,
  { label: 'roundtrip:tally', phase: 'Verify', model: 'sonnet', schema: ROUNDTRIP })
log(`roundtrip: ${roundtrip?.verified}/${roundtrip?.checked} verified, ${roundtrip?.needsReview} needs-review (advisory)`)

// ============================================================ ADVERSARIAL JUDGE (rewrite-test)
let judgeResult = null
if (isTest) {
  phase('Judge')
  const adv = await agent(`Generate 40 cron patterns ADVERSARIALLY chosen to expose differences between two ${NAME} renderers — DOM/DOW unions, quartz L/W/#, boundary-crossing ranges, odd-divisor steps, 6/7-field, years, options, macros. Return JSON {"patterns":[{"cron","opts"}]}.`,
    { label: 'adversarial:gen', phase: 'Judge', model: 'sonnet', schema: ADVGEN })
  const pats = (adv?.patterns || []).slice(0, 40)
  judgeResult = await parallel(pats.map((pp) => () =>
    agent(`Render "${pp.cron}" (opts: ${pp.opts || 'none'}) with BOTH ${NAME} renderers (original src/lang/${CODE}, rebuild ${SRC}) and judge BLIND on merit. Reply {"winner":"original"|"rebuild"|"equivalent","note":"..."}.`,
      { label: `judge:${pp.cron}`, phase: 'Judge', model: 'sonnet', schema: JUDGE })))
    .then((rs) => {
      const r = rs.filter(Boolean)
      const tally = { original: 0, rebuild: 0, equivalent: 0 }
      r.forEach((x) => { tally[x.winner] = (tally[x.winner] || 0) + 1 })
      return tally
    })
  log(`adversarial judge (${pats.length}): ${JSON.stringify(judgeResult)}`)
}

// ============================================================ WIRE + STATUS (derive)
let wire = null
if (!isTest) {
  phase('Wire')
  wire = await agent(`Wire the ${NAME} (${CODE}) module into the package, mirroring how es/de/fi are wired. From ${ROOT}: (1) package.json exports + files entries for ./lang/${CODE}; (2) any build/docs registries that enumerate languages (scripts/build.mjs, scripts/docs.mjs, scripts/patterns.mjs, tooling scripts with LANGS maps — grep for a sibling code like 'fi' to find them all); (3) write ${SRC}/status.json with status "beta", humanReview null, and a modelReview line naming this derivation run (donor ${DONOR}, blind Sonnet panels, date 2026-07-03); (4) run \`npm run docs\` to regenerate the language table; (5) run \`npm run verify\` — report ok only if the FULL gate passes (coverage: never lower thresholds; add target corpus rows for reachable new branches instead, and document genuinely-unreachable defensive branches). List anything failing.`,
    { label: 'wire', phase: 'Wire', schema: REPORT, model: 'sonnet' })
  log(`wire: ${wire?.ok ? 'clean' : 'FAILURES — ' + (wire?.failures || []).join('; ')}`)
}

// ============================================================ PLAYBOOK UPDATE
phase('Playbook')
const lesson = await agent(`Review this ${NAME} run for any GENUINELY NEW UNIVERSAL lesson — a trap or method insight that would help the NEXT, unrelated language (not ${NAME}'s specific answer). Flags: ${JSON.stringify(allFlags.slice(0, 20))}. Trap failures: ${JSON.stringify(trapFails.map((t) => t.trap))}. If there is one, append a dated bullet to the lessons in ${ROOT}/.claude/skills/add-language/playbook.md, then run \`node --import tsx ${ROOT}/tooling/scripts/playbook.mjs\`. If nothing is genuinely new, do nothing. Report what you appended (or "nothing new").`,
  { label: 'playbook:update', phase: 'Playbook', model: 'sonnet' })

return {
  mode: MODE, code: CODE, donor: isTest ? null : DONOR,
  rendererBuild: build?.summary,
  critics: allFlags.length,
  trapPanels: { pass: trapPanels.length - trapFails.length, total: trapPanels.length, failed: trapFails.map((t) => t.trap) },
  verify: verify?.ok ? 'clean' : verify?.failures,
  stability: stability ? (stability.ok ? 'clean' : stability.failures) : null,
  roundtrip: roundtrip ? { checked: roundtrip.checked, verified: roundtrip.verified, needsReview: roundtrip.needsReview, reviewPatterns: roundtrip.reviewPatterns || [] } : null,
  adversarialJudge: judgeResult,
  wire: wire ? (wire.ok ? 'clean' : wire.failures) : null,
  playbook: lesson,
  conventions, corpusNote
}
