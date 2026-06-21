export const meta = {
  name: 'add-language',
  description: 'Develop a cronli5 language module to beta via the self-improving pipeline: conventions panel -> corpus -> renderer (TDD) -> habit-critics -> trap panels -> mechanical verify -> playbook update. Sonnet personas only; no cross-family panels.',
  whenToUse: 'Invoked by the add-language skill to build a new language, or with mode "rewrite-test" to rebuild an existing renderer clean-room and judge it against the original.',
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
const ROOT = '/Users/andrewbroz/Code/personal/cronli5'
const PLAYBOOK = `${ROOT}/.claude/skills/add-language/playbook.json`
const CORESET = `${ROOT}/test/core/core-set.json`
const IR = `${ROOT}/src/core/ir.ts`

if (!CODE) {
  throw new Error('add-language workflow needs args.code')
}

// The clean-room rebuild target for the acceptance test.
const isTest = MODE === 'rewrite-test'
const SRC = isTest ? `${ROOT}/src/lang/${CODE}-rebuild` : `${ROOT}/src/lang/${CODE}`
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

// ===================================================== CONVENTIONS + CORPUS
// BOTH modes author conventions + a corpus. rewrite-test is a TRUE clean-room:
// it derives fresh, trap-RESOLVED conventions and a corpus from the playbook +
// the core IR meaning, and must NOT read the original renderer OR the original
// corpus — so the rebuild arrives INDEPENDENTLY at output that fixes the traps,
// which the judge then measures. (Reusing the original corpus, as the first
// cut did, only clones the original's defects — a meaningless test.)
const CORPUS = isTest
  ? `${ROOT}/test/lang/${CODE}-rebuild/corpus.js`
  : `${ROOT}/test/lang/${CODE}/corpus.js`
const NOTES = isTest ? `${SRC}/notes.md` : `${ROOT}/src/lang/${CODE}/notes.md`
const cleanRoom = isTest
  ? ` CLEAN-ROOM: you are STRICTLY FORBIDDEN from reading ${original}/ or ${ROOT}/test/lang/${CODE}/ (the original renderer and corpus). Derive everything fresh from the playbook, the core IR, and the schedule meaning. The goal is to INDEPENDENTLY arrive at output that RESOLVES the traps, never to reproduce the original.`
  : ''

phase('Conventions')
let conventions = await agent(`Design the ${NAME} (${CODE}) rendering conventions — the style contract the corpus is authored against. Read the playbook ${PLAYBOOK} (universal traps) and core set ${CORESET}. Decide numerals, clock (12/24h, day periods), date/weekday/month forms, list/range connectives, recurrence marking, and — critically — how this grammar RESOLVES each universal trap (union-connective, shared-qualifier-scope, confinement-vs-juxtaposition, range-boundary, recurrence-marking, redundancy, numeral-register, sentence-wrapper-punctuation, cardinality-rendering). Traps must be RESOLVED, not inherited. Mark genuinely-contested judgments with 2-3 candidate phrasings. Write the decided conventions to ${NOTES} (create the dir). Return the contested decisions.${cleanRoom}`,
  { label: 'conventions', phase: 'Conventions', model: 'sonnet' })

phase('Corpus')
let corpusNote = await agent(`Author the ${NAME} (${CODE}) corpus at ${CORPUS}, spanning the full core set ${CORESET} (every cell + value class + variant + macro + @reboot + lenient). For each pattern's SCHEDULE MEANING (which days/times it fires) analyze the core IR — run \`node --import tsx -e\` importing src/core to inspect the parsed schedule — do NOT lift wording from any existing renderer. STYLE each entry per the conventions in ${NOTES} and the playbook traps, so every entry is trap-RESOLVED (the DOM/DOW union uses the resolved predicate-frame; boundary ranges use the resolved window; trailing recurring days are marked; no stranded shared qualifier). NEVER drop a field value. Mirror the structure of test/lang/de/corpus.js. Self-audit against every playbook trap and fix. Report entry count.${cleanRoom}`,
  { label: 'corpus', phase: 'Corpus', model: 'sonnet' })

// ============================================================ RENDERER (TDD)
phase('Renderer')
const buildPrompt = isTest
  ? `CLEAN-ROOM RENDERER REBUILD — acceptance test. Write a complete cronli5 ${NAME} renderer at ${SRC}/ (index.ts + dialects.ts) implementing the Language interface in ${IR}. You may read ONLY: ${IR}, the core helpers it imports (src/core/format.ts, util.ts, specs.ts), the FRESH trap-resolved corpus ${CORPUS}, the conventions ${NOTES}, and the playbook ${PLAYBOOK}. You are STRICTLY FORBIDDEN from reading ${original}/ (the original renderer) or ${ROOT}/test/lang/${CODE}/ (the original corpus) or any other src/lang/* module — this is a from-scratch test of the pipeline. Wire a temporary test importing your ${CODE}-rebuild module against ${CORPUS}, and iterate test-first until every row passes (the corpus is trap-resolved, so green means your renderer resolves the traps). Keep \`npm run typecheck\` and eslint green for your module. Report pass/total and any rows you could not satisfy.`
  : `Build the ${NAME} (${CODE}) renderer at ${SRC}/index.ts implementing the Language interface in ${IR}, modelled on src/lang/en/index.ts. TDD it against ${CORPUS} until every row passes; keep typecheck + eslint green. Report pass/total.`
const build = await agent(buildPrompt,
  { label: `renderer:${CODE}`, phase: 'Renderer', model: 'sonnet', schema: REPORT })
log(`renderer build: ${build?.summary || 'no report'}`)

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
const lesson = await agent(`Review this ${NAME} run for any GENUINELY NEW UNIVERSAL lesson — a trap or method insight that would help the NEXT, unrelated language (not a restatement of ${NAME}'s specific answer). Flags: ${JSON.stringify(allFlags.slice(0, 20))}. Trap failures: ${JSON.stringify(trapFails.map((t) => t.trap))}. If there is one, append a dated bullet (newest-first) to the "Appended lessons" section of ${ROOT}/.claude/skills/add-language/playbook.md, trap-shaped (question + how to resolve), then run \`node --import tsx ${ROOT}/scripts/playbook.mjs\` to re-derive the json. If nothing is genuinely new, do nothing. Report what you appended (or "nothing new").`,
  { label: 'playbook:update', phase: 'Playbook', model: 'sonnet' })

return {
  mode: MODE, code: CODE,
  rendererBuild: build?.summary,
  critics: allFlags.length,
  trapPanels: { pass: trapPanels.length - trapFails.length, total: trapPanels.length, failed: trapFails.map((t) => t.trap) },
  verify: verify?.ok ? 'clean' : verify?.failures,
  adversarialJudge: judgeResult,
  playbook: lesson,
  conventions, corpusNote
}
