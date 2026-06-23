// A thin client for the cross-family model (gemma4:31b-cloud via Ollama
// Cloud) used by the automated language workflow: the natural-language
// baseline and the cross-family naturalness/correctness review that gates
// beta languages. Cloud-hosted, so it needs no local RAM. See
// docs/i18n-design.md and CONTRIBUTING.md.

const ENDPOINT = 'http://localhost:11434/api/generate';
const MODEL = 'gemma4:31b-cloud';

// Send one prompt; return the model's trimmed text response. `think` keeps
// the reasoning trace (sharper judgment, slower); the default suppresses it
// for a clean, direct answer (the interactive CLI is avoided because it
// pollutes stdout with terminal control codes).
async function ask(prompt, opts) {
  const think = Boolean(opts && opts.think);
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({model: MODEL, prompt, stream: false, think})
  });

  if (!response.ok) {
    throw new Error('cross-family model request failed: ' + response.status);
  }

  const data = await response.json();

  return (data.response || '').trim();
}

// Send a prompt that asks for JSON and parse it, tolerating a model that
// wraps the object in prose or a ```json fence.
async function askJson(prompt, opts) {
  const text = await ask(prompt, opts);
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1) {
    throw new Error('no JSON object in model response: ' + text);
  }

  return JSON.parse(text.slice(start, end + 1));
}

export {ask, askJson, MODEL};
