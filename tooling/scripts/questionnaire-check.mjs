// Check that the language questionnaire asks about every universal trap
// the add-language playbook records. The playbook grows as languages are
// added; this keeps the questionnaire from falling behind it.
//
// Usage: questionnaire-check.mjs  (exits non-zero and lists what is missing)

import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

const QUESTIONNAIRE =
  new URL('../docs/language-questionnaire.md', import.meta.url);
const PLAYBOOK =
  new URL('../../.claude/skills/add-language/playbook.json', import.meta.url);

// The playbook trap identifiers the questionnaire never mentions.
function missingTraps() {
  const questionnaire = readFileSync(QUESTIONNAIRE, 'utf8');
  const {traps} = JSON.parse(readFileSync(PLAYBOOK, 'utf8'));

  return traps.map(function idOf(trap) {
    return trap.id;
  }).filter(function unasked(id) {
    return !questionnaire.includes(`\`${id}\``);
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const missing = missingTraps();

  if (missing.length > 0) {
    console.error(
      `The questionnaire does not ask about: ${missing.join(', ')}`);
    process.exitCode = 1;
  }
}

export {missingTraps};
