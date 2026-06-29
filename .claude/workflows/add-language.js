export const meta = {
  name: 'add-language',
  description: 'The BLIND clean-room pipeline (no language sees another): conventions -> corpus -> renderer (TDD) -> habit-critics -> trap panels -> mechanical verify -> playbook. Every panel is a blind panel of Claude Sonnet instances running distinct personas (never humans). This is the original experiment, retained mainly as the rewrite-test soundness check; the recommended way to ADD a language is sibling-derivation (derive from the nearest sibling, else English + neighbors). Ships beta; stable needs a fluent human.',
  whenToUse: 'Primarily the "rewrite-test" soundness check: rebuild an existing renderer clean-room and adversarially judge it against the original. The blind from-scratch build is the original experiment, NOT the recommended way to add a language — use sibling-derivation (English + neighbors) for that.',
  phases: [
    { title: 'Conventions', detail: 'panel the style + universal traps in this grammar' },
    { title: 'Corpus', detail: 'author/audit the core-set corpus against the conventions' },
    { title: 'Renderer', detail: 'TDD the renderer to the corpus (clean-room for the test)' },
    { title: 'Critique', detail: 'five habit-critics read the output' },
    { title: 'Panel', detail: 'comprehension panels on the playbook traps + new calls' },
    { title: 'Verify', detail: 'fuzz / roundtrip / detectors / coverage' },
    { title: 'Judge', detail: 'adversarial old-vs-new comparison (rewrite-test)' },
    { title: 'Playbook', detail: 'append any new universal lesson' }
  ]
}

const a = (typeof args === 'string' ? JSON.parse(args) : args) || {}
const CODE = a.code
const NAME = a.name || CODE
const MODE = a.mode || 'new' // 'new' | 'rewrite-test'
const STOP = a.stopAfter || null // e.g. 'corpus' — halt for inspection (stage 1)
const ROOT = '/Users/andrewbroz/Code/personal/cronli5'
const PLAYBOOK = `${ROOT}/.claude/skills/add-language/playbook.json`
const CORESET = `${ROOT}/test/core/core-set.json`
const IR = `${ROOT}/src/core/ir.ts`

if (!CODE) {
  throw new Error('add-language workflow needs args.code')
}

// The clean-room rebuild target for the acceptance test.
const isTest = MODE === 'rewrite-test'
const SRC = isTest ? `${ROOT}/tooling/experiments/${CODE}-rebuild` : `${ROOT}/src/lang/${CODE}`
const original = isTest ? `${ROOT}/src/lang/${CODE}` : null

const PERSONAS = [
  'an everyday native speaker (judges natural everyday wording)',
  'a meticulous copy-editor (judges written-register clarity and idiom)',
  'a precise technical communicator (judges scannable, unambiguous precision)'
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
const pickMajority = (arr) => {
  const m = {}
  let best = arr[0]
  let bc = 0
  for (const s of arr) { m[s] = (m[s] || 0) + 1; if (m[s] > bc) { bc = m[s]; best = s } }
  return best
}

// ===================================================== CONVENTIONS + CORPUS
// BOTH modes author conventions + a corpus. rewrite-test is a TRUE clean-room:
// it derives fresh, trap-RESOLVED conventions and a corpus from the playbook +
// the core IR meaning, and must NOT read the original renderer OR the original
// corpus — so the rebuild arrives INDEPENDENTLY at output that fixes the traps,
// which the judge then measures. (Reusing the original corpus, as the first
// cut did, only clones the original's defects — a meaningless test.)
const CORPUS = isTest
  ? `${ROOT}/tooling/experiments/${CODE}-rebuild/corpus.js`
  : `${ROOT}/test/lang/${CODE}/corpus.js`
const NOTES = isTest ? `${SRC}/notes.md` : `${ROOT}/src/lang/${CODE}/notes.md`
const cleanRoom = isTest
  ? ` CLEAN-ROOM: you are STRICTLY FORBIDDEN from reading ${original}/ or ${ROOT}/test/lang/${CODE}/ (the original renderer and corpus). Derive everything fresh from the playbook, the core IR, and the schedule meaning. The goal is to INDEPENDENTLY arrive at output that RESOLVES the traps, never to reproduce the original.`
  : ''

phase('Conventions')
// Draft → blind-panel the contested REGISTER choices → finalize. The panel is
// the missing pressure: without it the clean-room agent silently picks a
// defensible-but-wrong default (e.g. 24-hour clock for English) and the whole
// corpus inherits it. Register conventions (clock, idioms, framing) are
// language-specific and NOT in the playbook — so they must be panelled here.
const draft = await agent(`Draft the ${NAME} (${CODE}) rendering conventions — the style contract the corpus is authored against. Read the playbook ${PLAYBOOK} (universal traps) and core set ${CORESET}. Decide numerals, date/weekday/month forms, list/range connectives, recurrence marking, and how this grammar RESOLVES each universal trap (union-connective, shared-qualifier-scope, confinement-vs-juxtaposition, range-boundary, recurrence-marking, redundancy, numeral-register, sentence-wrapper-punctuation, cardinality-rendering) — traps must be RESOLVED. Write a DRAFT to ${NOTES} (create the dir). CRUCIALLY, surface EVERY genuinely-contested REGISTER choice as a contested decision with 2-4 candidates, each with a concrete example sentence: clock format (12-hour a.m./p.m. vs 24-hour), the midnight/noon idiom vs 0:00/12:00, whether a daily schedule leads with an "every day"-type frame, interval phrasing (every two X vs every other X), the union connective, AND — as a SEPARATE decision from the range connective — the range-BOUNDARY convention: inclusive last-fire ("from 9 a.m. through 5:55 p.m.", names the literal last firing time) vs exclusive window ("from 9 a.m. until 6 p.m.", drops last-fire arithmetic). Return the contested decisions.${cleanRoom}`,
  { label: 'conventions:draft', phase: 'Conventions', model: 'sonnet', schema: CONTESTED })

const decided = await parallel((draft?.contested || []).map((d) => () =>
  parallel(PERSONAS.map((p) => () =>
    agent(`You are ${p} of ${NAME}, judging BLIND — this is a COMPREHENSION test, NOT a beauty contest. CHOICE: ${d.question}\nCandidates:\n${d.candidates.map((c) => `- ${c.label}: "${c.example}"`).join('\n')}\nSTEP 1 (decisive): would an ordinary reader who sees ONLY a candidate conclude the schedule's TRUE meaning with NO misreading? In particular a day-union MUST read as "runs on BOTH sets of days" — any candidate a reader could take as "one or the other" (alternative / pick-one) is ELIMINATED, however natural it sounds. STEP 2: among the survivors only, pick the most natural. Reply: best = the surviving candidate's label, and a one-line reason naming any misreading you eliminated.`,
      { label: `conv:${d.id}`, phase: 'Conventions', model: 'sonnet', schema: CONVVOTE })))
    .then((vs) => ({id: d.id, question: d.question, votes: vs.filter(Boolean).map((v) => v.best)}))))

let conventions = await agent(`Finalize the ${NAME} (${CODE}) conventions in ${NOTES}. For each contested register choice, ADOPT the candidate the blind panel preferred (majority best-vote): ${JSON.stringify(decided.filter(Boolean))}. Rewrite ${NOTES} so every register choice reflects the panel verdict (keep the trap resolutions and everything else). Report the final clock format, idioms, framing, and connectives chosen.`,
  { label: 'conventions:finalize', phase: 'Conventions', model: 'sonnet' })

// CORPUS-DISCOVERY LOOP. The corpus is the spec, so we DISCOVER a good one
// instead of authoring-and-trusting: (1) three INDEPENDENT clean-room authorings;
// (2) mechanical detectors kill objective errors (dropped field values,
// unresolved traps, inconsistent phrasing); (3) cross-version DISAGREEMENTS
// surface the judgment calls nobody thought to panel + the ambiguous entries;
// (4) a blind Claude Sonnet panel judges those; (5) assemble + final-lint.
// (The Sonnet panel is a proxy for a human reviewing the spec — hence beta-only;
// a fluent human is still required to reach stable.)
phase('Corpus')
const dir = `${ROOT}/tooling/experiments/${CODE}-rebuild`
await parallel(['a', 'b', 'c'].map((v) => () =>
  agent(`Author ${NAME} (${CODE}) corpus VARIANT ${v} at ${dir}/corpus-${v}.js, spanning the full core set ${CORESET} (every cell + value class + variant + macro + @reboot + lenient). For each pattern's MEANING, analyze the core IR (run \`node --import tsx -e\` importing src/core) to see which days/times it fires — never lift wording from any existing renderer. STYLE per the PANELLED conventions ${NOTES} and the playbook traps ${PLAYBOOK}: DOM/DOW union → condition-frame "whenever the day is X or Y"; hour-range → the boundary form chosen in ${NOTES}; trailing recurring days marked; shared qualifier fronted; NO cadence redundant under a finer one (no "every minute" under "every second"); a given field phrased identically across every entry that contains it. NEVER drop a field value. Author INDEPENDENTLY — do NOT read the other variants. Mirror test/lang/de/corpus.js structure. Report entry count.${cleanRoom}`,
    { label: `corpus:${v}`, phase: 'Corpus', model: 'sonnet' })))

const reconcile = await agent(`Reconcile the three ${NAME} corpus variants (${dir}/corpus-a.js, -b.js, -c.js). Write and run a node script from ${ROOT} that, keyed by core-set pattern: (1) DIFF — compare the expected string across a/b/c; AGREED = all three identical, CONTESTED = any differ. (2) FIELD-COVERAGE — assert every non-wildcard field value surfaces in the prose (flag MISSING-VALUE). (3) TRAP-LINTS on the strings — every DOM/DOW union uses "whenever the day is … or …"; every hour-range uses the ${NOTES} boundary form; no cadence redundant under a finer one; each field renders identically across the entries containing it. Return agreedCount and the CONTESTED list (cap 40): for each give the pattern, its IR meaning, the three candidate strings, and any detector flags. A detector-flagged-but-agreed entry is ALSO contested (all three made the same mistake).`,
  { label: 'reconcile', phase: 'Corpus', model: 'sonnet', schema: RECONCILE })

const resolved = await parallel((reconcile?.contested || []).slice(0, 40).map((c) => () =>
  parallel(PERSONAS.map((p) => () =>
    agent(`You are ${p} of ${NAME}, judging BLIND — a COMPREHENSION test. The schedule MEANS: ${c.meaning || c.pattern}.\nCandidates:\n${(c.candidates || []).map((s, i) => `${i + 1}. "${s}"`).join('\n')}\nSTEP 1 (decisive): ELIMINATE any candidate an ordinary reader could MISread — conclude a different meaning than the stated one (e.g. read a day-union as "one or the other" when the job fires on BOTH; misjudge a window's span). A misread-able form is out, however natural. STEP 2: among the survivors pick the most natural; if none survive, give an improved rendering that cannot be misread. ${c.flags ? 'Detector flags: ' + c.flags + '\n' : ''}Reply: best = the exact chosen text, plus a one-line reason.`,
      { label: `corpus-panel:${c.pattern}`, phase: 'Corpus', model: 'sonnet', schema: CONVVOTE })))
    .then((vs) => ({pattern: c.pattern, winner: pickMajority(vs.filter(Boolean).map((v) => v.best))}))))

const corpusNote = await agent(`Assemble the canonical ${NAME} corpus at ${CORPUS} from the three variants in ${dir}: for AGREED patterns use the agreed string; for these reconciled patterns use the panel-chosen string: ${JSON.stringify((resolved || []).filter(Boolean))}. Mirror test/lang/de/corpus.js structure. Then RE-RUN the detector suite (field-coverage + trap-lints) on the FINAL ${CORPUS} and fix any residual flag. Delete the variant files corpus-a/b/c.js. Report final entry count and whether detectors are clean.`,
  { label: 'assemble', phase: 'Corpus', model: 'sonnet' })

// Stage gate: halt after the corpus so a human can inspect its quality before
// committing to the expensive pressured renderer build (the corpus is the spec;
// a wrong corpus poisons everything downstream).
if (STOP === 'corpus') {
  return {stoppedAfter: 'corpus', mode: MODE, code: CODE, corpus: CORPUS, conventions, corpusNote}
}

// ===================================================== RENDERER — pressured
// The corpus is split into a TRAIN set the builders TDD against and a HELD-OUT
// set they never see; held-out pass-rate is the Occam pressure — only a
// general/compact renderer passes patterns it never trained on. Each round
// spawns 3 independent variants under the form pressures (zero eslint-disable,
// cognitive-complexity + jscpd-duplication budgets), we Pareto-select
// (held-out-correct, then simplest), and the winner seeds the next round. The
// LLM is a strong variation operator, so a couple of rounds suffice.
phase('Renderer')
const TRAIN = `${ROOT}/tooling/experiments/${CODE}-rebuild/train.js`
const HOLDOUT = `${ROOT}/tooling/experiments/${CODE}-rebuild/holdout.js`
await agent(`Partition the trap-resolved corpus ${CORPUS} into two runnable test files: ${TRAIN} (~85% of entries) and ${HOLDOUT} (~15%), STRATIFIED so the held-out set samples across every cell / value-class / variant / macro (not a contiguous tail) — it is the generalization probe. Copy each entry verbatim (pattern, expected, opts); both files run like the corpus. Report the two counts.`,
  { label: 'split', phase: 'Renderer', model: 'sonnet' })

const priorClause = isTest
  ? `STRICTLY FORBIDDEN to read: ${original}/ (original renderer), ${ROOT}/test/lang/${CODE}/ (original corpus), ${HOLDOUT} (the held-out set), and any other src/lang/* module — this is clean-room.`
  : `Model the architecture on src/lang/en/index.ts (inherit its plan-kind dispatch skeleton and helper decomposition; supply ${NAME}'s own words). Do NOT read ${HOLDOUT}.`
const VARIANTS = ['a', 'b', 'c']
const ROUNDS = 2
let winner = null
let buildSummary = 'no variant'
for (let r = 1; r <= ROUNDS; r++) {
  const seedLine = winner
    ? `Start from the current best variant at ${winner} (copy it into your dir), then IMPROVE it: raise held-out generality and REDUCE cognitive complexity and duplication without regressing TRAIN.`
    : `Build from scratch.`
  const built = await parallel(VARIANTS.map((v) => () => {
    const dir = `${ROOT}/tooling/experiments/${CODE}-rebuild-r${r}${v}`
    return agent(`Pressured ${NAME} (${CODE}) renderer build — round ${r}, variant ${v}. Write a complete renderer at ${dir}/ (index.ts + dialects.ts) implementing the Language interface in ${IR}. ${seedLine} You may read: ${IR}, the core helpers (src/core/format.ts, util.ts, specs.ts), the TRAIN set ${TRAIN}, the conventions ${NOTES}, the playbook ${PLAYBOOK}. ${priorClause} TDD against ${TRAIN} until green. THEN, with TRAIN frozen as the guard (any regression = revert), satisfy these FORM PRESSURES: (1) ZERO \`eslint-disable\` anywhere — reduce cognitive complexity, never suppress it; (2) minimize copy-paste / near-duplicate logic across plan-node kinds (share helpers); (3) keep functions within the eslint complexity rule. You MAY break-then-repass TRAIN to consolidate. Keep typecheck + eslint (no disables) green. Report train pass/total and final line count.`,
      { label: `build:r${r}${v}`, phase: 'Renderer', model: 'sonnet', schema: REPORT })
      .then((rep) => ({ v, dir, rep }))
  }))
  const evals = await parallel(built.filter((b) => b && b.rep).map((b) => () =>
    agent(`Evaluate the ${NAME} renderer variant at ${b.dir}. Via bash from ${ROOT}: (1) run it against the HELD-OUT set ${HOLDOUT} (it never trained on these) — report holdoutPass / holdoutTotal; (2) count \`eslint-disable\` occurrences in the module (disables); (3) total lines of index.ts + dialects.ts; (4) jscpd or AST-clone duplication percent (dupPct); (5) max cognitive complexity across functions (complexity). Numbers only.`,
      { label: `eval:r${r}${b.v}`, phase: 'Renderer', model: 'sonnet', schema: EVALR })
      .then((e) => ({...b, eval: e}))))
  const ranked = evals.filter((e) => e && e.eval && e.eval.disables === 0)
    .sort((x, y) => (y.eval.holdoutPass - x.eval.holdoutPass) ||
      (x.eval.lines - y.eval.lines) || ((x.eval.dupPct || 0) - (y.eval.dupPct || 0)))
  const top = ranked[0] || evals.filter(Boolean)[0]
  if (top) {
    winner = top.dir
    buildSummary = `round ${r}: held-out ${top.eval?.holdoutPass}/${top.eval?.holdoutTotal}, ${top.eval?.lines} lines, ${top.eval?.disables} disables, ${top.eval?.dupPct ?? '?'}% dup`
  }
  log(`Renderer ${buildSummary}`)
}
await agent(`Copy the winning ${NAME} variant module from ${winner} to ${SRC} (replace it), via bash from ${ROOT} (e.g. rm -rf ${SRC} && cp -r ${winner} ${SRC}). Confirm ${SRC}/index.ts exists. Report done.`,
  { label: 'promote-winner', phase: 'Renderer', model: 'sonnet' })
const build = { summary: buildSummary }
log(`renderer build: ${buildSummary}`)

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
  agent(`You are a ${NAME} schedule reviewer applying ONE lens: ${lens}. The renderer module is at ${SRC}/. Render the core set (${CORESET}) with it and read the conventions/playbook (${PLAYBOOK}). Flag ONLY genuine defects; for each give a core-set pattern id (or the pattern), the issue, a concrete corrected fragment, and the rule it implies. Be conservative.`,
    { label: `critic:${tag}`, phase: 'Critique', schema: FLAGS, model: 'sonnet' })))
const allFlags = critiques.filter(Boolean).flatMap((c) => c.flags || [])
log(`critics raised ${allFlags.length} flags`)

// ============================================================ TRAP PANELS
phase('Panel')
const playbook = await agent(`Read ${PLAYBOOK} and return its "traps" array as JSON only: {"traps":[{"id","summary"}]}.`,
  { label: 'load-playbook', phase: 'Panel', schema: TRAPS })
// For each trap, build a comprehension case for THIS language and run a blind
// 3-persona panel; a form ships only if all readers read it as intended.
const trapPanels = await parallel((playbook?.traps || []).map((t) => () =>
  parallel(PERSONAS.map((p) => () =>
    agent(`You are ${p} of ${NAME}, BLIND. The renderer at ${SRC}/ handles cron's "${t.id}" situation: ${t.summary}. Find a core-set pattern that exercises it, state the schedule's true meaning, then judge whether the renderer's output makes an ordinary reader conclude that exact meaning (no misread). Reply per the schema: readsAsIntended, best (the output or a better candidate), misread, reason.`,
      { label: `panel:${t.id}`, phase: 'Panel', schema: VERDICT, model: 'sonnet' })))
    .then((vs) => ({ trap: t.id,
      pass: vs.filter(Boolean).filter((v) => v.readsAsIntended).length >= 2,
      verdicts: vs.filter(Boolean) }))))
const trapFails = trapPanels.filter(Boolean).filter((tp) => !tp.pass)
log(`trap panels: ${trapPanels.length - trapFails.length}/${trapPanels.length} pass`)

// ============================================================ VERIFY
phase('Verify')
const verify = await agent(`Mechanically verify the ${NAME} (${CODE}${isTest ? '-rebuild' : ''}) renderer. Run via bash from ${ROOT}: (1) the fuzz detector — adapt \`npm run fuzz ${CODE}\` logic to the module at ${SRC} — assert 0 THROWS / DEGENERATE / MISSING-VALUE; (2) the both-side OR-scope detector (every OR with a restricted shared qualifier carries it on each arm); (3) the corpus tests pass; (4) typecheck + eslint clean for the module. Report ok=true only if all pass; list any failures.`,
  { label: 'verify', phase: 'Verify', schema: REPORT, model: 'sonnet' })
log(`verify: ${verify?.ok ? 'clean' : 'FAILURES — ' + (verify?.failures || []).join('; ')}`)

// Round-trip comprehension (advisory): render a shape-deduped sample, have a
// BLIND agent recover the cron from each description (prose only), compare by
// expanded per-field value sets. Surfaced in the summary; never gates verify.
await agent(`Round-trip prep for ${NAME} (${CODE}). Via bash from ${ROOT}: write and run a node snippet (\`node --import tsx\`) that imports {prepareRoundtrip} from ${ROOT}/tooling/scripts/roundtrip.mjs and the default export from ${SRC}/index.js as the renderer, calls prepareRoundtrip(renderer, 40), and writes TWO files: ${ROOT}/tmp/rt-${CODE}-desc.json = a JSON array of {id, description} (id = array index, DESCRIPTIONS ONLY, no crons), and ${ROOT}/tmp/rt-${CODE}-key.json = the full [{id, pattern, description}] list. Report the item count.`,
  { label: 'roundtrip:prep', phase: 'Verify', model: 'sonnet' })
await agent(`You are a BLIND cron reverse-parser for ${NAME}. Read ONLY ${ROOT}/tmp/rt-${CODE}-desc.json — it has {id, description} items and NO crons. You are STRICTLY FORBIDDEN from reading ${ROOT}/tmp/rt-${CODE}-key.json or the renderer source. For each description infer ONE standard cron (field order "minute hour day-of-month month day-of-week"; prepend a seconds field only if seconds are mentioned; when a day-of-month and a weekday are joined by "or", set BOTH fields; leave unmentioned fields as "*"). Write ${ROOT}/tmp/rt-${CODE}-rec.json = [{id, recovered}]. Report how many you recovered.`,
  { label: 'roundtrip:recover', phase: 'Verify', model: 'sonnet' })
const roundtrip = await agent(`Tally the ${NAME} round-trip. Via bash from ${ROOT}: write and run a node snippet that imports {tallyRoundtrip} from ${ROOT}/tooling/scripts/roundtrip.mjs, joins ${ROOT}/tmp/rt-${CODE}-key.json (by id, for the pattern) with ${ROOT}/tmp/rt-${CODE}-rec.json (for recovered), builds [{pattern, recovered}], calls tallyRoundtrip, and prints the result. Report checked, verified, needsReview (count), orNoise (count), and reviewPatterns (the needsReview patterns, capped at 20).`,
  { label: 'roundtrip:tally', phase: 'Verify', model: 'sonnet', schema: ROUNDTRIP })
log(`roundtrip: ${roundtrip?.verified}/${roundtrip?.checked} verified, ${roundtrip?.needsReview} needs-review, ${roundtrip?.orNoise ?? 0} day-or noise (advisory)`)

// ============================================================ ADVERSARIAL JUDGE
let judgeResult = null
if (isTest) {
  phase('Judge')
  // Generate patterns designed to break the rebuild, then blind-compare the
  // ORIGINAL vs the REBUILD output on each — neither labelled.
  const adv = await agent(`Generate 40 cron patterns ADVERSARIALLY chosen to expose differences between two ${NAME} renderers — edge cases: DOM/DOW OR unions, quartz L/W/#, ranges crossing boundaries, stepped fields with odd divisors, second-bearing 6/7-field, year fields, ampm/short/dialect options, macros. Return JSON {"patterns":[{"cron","opts"}]}.`,
    { label: 'adversarial:gen', phase: 'Judge', model: 'sonnet', schema: ADVGEN })
  const pats = (adv?.patterns || []).slice(0, 40)
  judgeResult = await parallel(pats.map((pp) => () =>
    agent(`Render the cron pattern "${pp.cron}" (opts: ${pp.opts || 'none'}) with BOTH ${NAME} renderers and judge BLIND. Use bash from ${ROOT}: render with the original (src/lang/${CODE}) as renderer X and the rebuild (${SRC}) as renderer Y (shuffle which you call A vs B in your head — judge on merit, not which is original). Which output (A=original, B=rebuild) is more correct and natural for the schedule, or are they equivalent? Reply JSON {"winner":"original"|"rebuild"|"equivalent","note":"..."}.`,
      { label: `judge:${pp.cron}`, phase: 'Judge', model: 'sonnet', schema: JUDGE })))
    .then((rs) => {
      const r = rs.filter(Boolean)
      const tally = { original: 0, rebuild: 0, equivalent: 0 }
      r.forEach((x) => { tally[x.winner] = (tally[x.winner] || 0) + 1 })
      return tally
    })
  log(`adversarial judge (${pats.length}): ${JSON.stringify(judgeResult)}`)
}

// ============================================================ PLAYBOOK UPDATE
phase('Playbook')
const lesson = await agent(`Review this ${NAME} run for any GENUINELY NEW UNIVERSAL lesson — a trap or method insight that would help the NEXT, unrelated language (not a restatement of ${NAME}'s specific answer). Flags: ${JSON.stringify(allFlags.slice(0, 20))}. Trap failures: ${JSON.stringify(trapFails.map((t) => t.trap))}. If there is one, append a dated bullet (newest-first) to the "Appended lessons" section of ${ROOT}/.claude/skills/add-language/playbook.md, trap-shaped (question + how to resolve), then run \`node --import tsx ${ROOT}/tooling/scripts/playbook.mjs\` to re-derive the json. If nothing is genuinely new, do nothing. Report what you appended (or "nothing new").`,
  { label: 'playbook:update', phase: 'Playbook', model: 'sonnet' })

return {
  mode: MODE, code: CODE,
  rendererBuild: build?.summary,
  critics: allFlags.length,
  trapPanels: { pass: trapPanels.length - trapFails.length, total: trapPanels.length, failed: trapFails.map((t) => t.trap) },
  verify: verify?.ok ? 'clean' : verify?.failures,
  roundtrip: roundtrip ? { checked: roundtrip.checked, verified: roundtrip.verified, needsReview: roundtrip.needsReview, reviewPatterns: roundtrip.reviewPatterns || [] } : null,
  adversarialJudge: judgeResult,
  playbook: lesson,
  conventions, corpusNote
}
