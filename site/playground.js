// The playground: one cron pattern, described by cronli5 in every language
// it ships, with cRonstrue's description of the same pattern beneath each
// for comparison. scripts/site.mjs bundles this file with both libraries.

import cronstrue from 'cronstrue/i18n';
import cronli5 from '../src/all.js';
import {shipped} from '../src/languages.js';

// cRonstrue names a few locales differently: by region where cronli5
// names a script or a default.
const cronstrueLocales = {'pt': 'pt_BR', 'zh': 'zh_CN', 'zh-Hant': 'zh_TW'};

// The field each position names, by how many fields the pattern has:
// five is classic cron, six adds seconds in front, seven adds the year.
const fieldNames = {
  5: ['minute', 'hour', 'day', 'month', 'weekday'],
  6: ['second', 'minute', 'hour', 'day', 'month', 'weekday'],
  7: ['second', 'minute', 'hour', 'day', 'month', 'weekday', 'year']
};

// The space, in pixels, kept between two field names on one line.
const labelGap = 8;

const english = new Intl.DisplayNames(['en'], {type: 'language'});

// English first, as the default; the rest by their English names.
const languages = shipped.map(function named(code) {
  return {
    code,
    name: english.of(code),
    own: new Intl.DisplayNames([code], {type: 'language'}).of(code)
  };
}).sort(function byName(a, b) {
  return Number(b.code === 'en') - Number(a.code === 'en') ||
    a.name.localeCompare(b.name, 'en');
});

const input = document.querySelector('#pattern');
const ruler = document.querySelector('#ruler');
const problem = document.querySelector('#problem');
const list = document.querySelector('#languages');
const forms = document.querySelectorAll('input[name="form"]');

function chosenForm() {
  return document.querySelector('input[name="form"]:checked').value;
}

function element(tag, className, text = '') {
  const made = document.createElement(tag);

  made.className = className;
  made.textContent = text;

  return made;
}

// One row per language, built once; describing fills in its text.
const rows = languages.map(function row(language) {
  const item = element('li', 'language');
  const name = element('div', 'name', language.name);
  const said = element('p', 'said');
  const theirs = element('p', 'theirs');

  item.lang = language.code;
  name.lang = 'en';
  if (language.own !== language.name) {
    name.append(element('span', 'own', language.own));
    name.lastChild.lang = language.code;
  }
  item.append(name, said, theirs);
  list.append(item);

  return {language, said, theirs};
});

// Labels each field under the column where it starts in the pattern.
function drawRuler(pattern) {
  const tokens = [...pattern.matchAll(/\S+/gu)];
  const names = fieldNames[tokens.length] ?? [];

  ruler.replaceChildren(...tokens.map(function label(token, at) {
    const mark = element('span', 'mark');

    mark.style.setProperty('--column', String(token.index));
    mark.append(element('span', 'field', names[at] ?? ''));

    return mark;
  }));

  // Fields one character wide sit closer than their names are long; a
  // name that would touch the one before it drops to a second line.
  let previous = null;

  [...ruler.children].forEach(function stagger(mark) {
    const box = mark.getBoundingClientRect();
    const clash = previous && !previous.lower &&
      box.left < previous.right + labelGap;

    mark.classList.toggle('lower', Boolean(clash));
    previous = {lower: Boolean(clash), right: box.right};
  });
}

function theirDescription(pattern, code) {
  const locale = cronstrueLocales[code] ?? code;

  // cRonstrue answers an unknown locale in English, so the table of its
  // locales (on its default export) says which it has.
  return cronstrue.default.locales[locale] ?
    {text: cronstrue.toString(pattern, {locale})} :
    {missing: true, text: 'No cRonstrue locale for this language.'};
}

// Why a library refuses the pattern, or null. Each refuses in English
// whatever the language, so the reason is shown once, not in every row.
function refusal(describeWith) {
  try {
    describeWith();

    return null;
  }
  catch (error) {
    return String(error.message ?? error).replace(/^Error: /u, '');
  }
}

function describe() {
  const pattern = input.value.trim();
  const form = chosenForm();
  const ours = pattern ? refusal(function ourWay() {
    cronli5(pattern);
  }) : null;
  const their = pattern ? refusal(function theirWay() {
    cronstrue.toString(pattern);
  }) : null;

  drawRuler(input.value);
  problem.replaceChildren(
    ...ours ? [element('span', 'reason', `cronli5: ${ours}`)] : [],
    ...their ? [element('span', 'reason', `cRonstrue: ${their}`)] : []
  );
  problem.hidden = !ours && !their;

  rows.forEach(function fill({language, said, theirs}) {
    const description = pattern && !their ?
      theirDescription(pattern, language.code) :
      {text: ''};

    said.textContent = ours || !pattern ?
      '' :
      cronli5(pattern, {form, lang: language.code});
    theirs.textContent = description.text;
    theirs.hidden = !description.text;
    theirs.classList.toggle('quiet', Boolean(description.missing));
  });

  const hash = `#${encodeURIComponent(pattern)}`;

  if (location.hash !== hash) {
    history.replaceState(null, '', hash);
  }
}

function load(pattern) {
  input.value = pattern;
  describe();
}

input.addEventListener('input', describe);
forms.forEach(function listen(radio) {
  radio.addEventListener('change', describe);
});
document.querySelectorAll('.example').forEach(function listen(button) {
  button.addEventListener('click', function choose() {
    load(button.textContent);
    input.focus();
  });
});
window.addEventListener('hashchange', function followHash() {
  const pattern = decodeURIComponent(location.hash.slice(1));

  if (pattern !== input.value.trim()) {
    load(pattern);
  }
});

// The names are placed by measuring them, so they are placed again once
// the fonts arrive and whenever the width changes.
function redrawRuler() {
  drawRuler(input.value);
}

window.addEventListener('resize', redrawRuler);
document.fonts.ready.then(redrawRuler);

load(decodeURIComponent(location.hash.slice(1)) || '*/45 9-17 * * 1-5');
