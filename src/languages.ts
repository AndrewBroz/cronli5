// The codes of the languages cronli5 ships, so an error can tell a
// language this instance was not given from one that does not exist. Only
// the codes: importing the languages here would bundle them all.
const shipped = [
  'en', 'cs', 'de', 'es', 'fr', 'it', 'ja', 'pt', 'uk', 'zh', 'zh-Hant'
];

// The scripts a shipped language is written in, each with the code of the
// language that writes it: the language itself for the script it is
// written in by default, a language of its own for another.
const scripts = {
  zh: {Hans: 'zh', Hant: 'zh-Hant'}
} as const;

// The regions that write a language in a script other than its default,
// each with the code of the language that writes that script. The language
// declares the same regions itself; they are repeated here so that a
// region is not described in the wrong script when its language is absent.
const claimed = {
  zh: {HK: 'zh-Hant', MO: 'zh-Hant', TW: 'zh-Hant'}
} as const;

export {claimed, scripts, shipped};
