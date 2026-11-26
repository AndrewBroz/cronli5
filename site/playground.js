// The playground: one cron pattern, described by cronli5 in every language
// it ships, with cRonstrue's description of the same pattern beneath each
// for comparison. scripts/site.mjs bundles this file with both libraries.

import cronstrue from 'cronstrue/i18n';
import cronli5 from '../src/all.js';
import {shipped} from '../src/languages.js';
import cs from '../src/lang/cs/index.js';
import de from '../src/lang/de/index.js';
import en from '../src/lang/en/index.js';
import es from '../src/lang/es/index.js';
import fr from '../src/lang/fr/index.js';
import id from '../src/lang/id/index.js';
import it from '../src/lang/it/index.js';
import ja from '../src/lang/ja/index.js';
import ko from '../src/lang/ko/index.js';
import pl from '../src/lang/pl/index.js';
import pt from '../src/lang/pt/index.js';
import ru from '../src/lang/ru/index.js';
import uk from '../src/lang/uk/index.js';
import zh from '../src/lang/zh/index.js';
import zhHant from '../src/lang/zh-hant/index.js';

// Each language's module, by code, for its named styles.
const modules = Object.fromEntries([
  cs, de, en, es, fr, id, it, ja, ko, pl, pt, ru, uk, zh, zhHant
].map(function byCode(module) {
  return [module.code, module];
}));

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

// cronli5's zh is written in simplified characters. Naming it by that
// script sets it beside Traditional Chinese, in the list and in its name.
const namedAs = {zh: 'zh-Hans'};

function nameOf(code, inLanguage) {
  return new Intl.DisplayNames([inLanguage], {
    languageDisplay: 'standard',
    type: 'language'
  }).of(namedAs[code] ?? code);
}

// English first, as the default; the rest by their English names, which
// keeps the two Chinese scripts together.
const languages = shipped.map(function named(code) {
  return {code, name: nameOf(code, 'en'), own: nameOf(code, code)};
}).sort(function byName(a, b) {
  return Number(b.code === 'en') - Number(a.code === 'en') ||
    a.name.localeCompare(b.name, 'en');
});

const input = document.querySelector('#pattern');
const ruler = document.querySelector('#ruler');
const problem = document.querySelector('#problem');
const list = document.querySelector('#languages');
const forms = document.querySelectorAll('input[name="form"]');
const styles = document.querySelector('#styles');
const styleLanguage = document.querySelector('#styleLanguage');

function chosenForm() {
  return document.querySelector('input[name="form"]:checked').value;
}

function element(tag, className, text = '') {
  const made = document.createElement(tag);

  made.className = className;
  made.textContent = text;

  return made;
}

function checked(option) {
  return document.querySelector(`#${option}`).checked;
}

function chosen(option) {
  return document.querySelector(`#${option}`).value;
}

// The options every language shares, as set in the advanced fold. An
// option left at its default is left out, as a caller would leave it.
function commonOptions() {
  const cron = document.querySelector('input[name="cron"]:checked').value;

  return {
    ...cron === 'quartz' ? {cron} : {},
    ...checked('seconds') ? {seconds: true} : {},
    ...checked('years') ? {years: true} : {},
    ...checked('lenient') ? {lenient: true} : {},
    ...chosen('weekdaysFrom') ?
      {weekdaysFrom: Number(chosen('weekdaysFrom'))} :
      {},
    ...chosen('questionMark') ? {questionMark: chosen('questionMark')} : {}
  };
}

// cRonstrue's one comparable option: whether 1, not 0, is Sunday.
function theirOptions(common) {
  const sundayIsOne = common.weekdaysFrom === 1 ||
    common.cron === 'quartz' && common.weekdaysFrom !== 0;

  return sundayIsOne ? {dayOfWeekStartIndexZero: false} : {};
}

// What each style field is called on the page. A language's own entry
// wins over the shared one, where the field means something narrower.
const fieldLabels = {
  'am': 'Word for a.m.',
  'closeUp': 'No space before a.m. and p.m.',
  'dayFirst': 'Day before month',
  'en': {short: 'Short day and month names'},
  'era': 'Era before years',
  'eszett': 'Write ß, not ss',
  'feira': 'Weekdays end in -feira',
  'firstOrdinal': 'Write the 1st of the month as 1º',
  'hour12': '12-hour clock',
  'jaenner': 'Jänner for January',
  'ja': {short: 'Weekdays without the last 日'},
  'kanjiTime': 'Times as 9時30分, not 9:30',
  'ko': {short: 'Drop 요일 in lists of weekdays'},
  'midday': 'Word for 12:00',
  'midnight': 'Word for 0:00',
  'minutes': 'Show :00 on the hour',
  'ordinals': 'Ordinal dates, as in June 1st',
  'padHour': 'Two-digit hours',
  'pm': 'Word for p.m.',
  'separator': 'Between hours and minutes',
  'serialComma': 'Comma before the last "and"',
  'short': 'Short day and month names',
  'through': 'Word between the ends of a range',
  'weekWords': 'Say "weekdays" and "weekends"',
  'weekday': 'Word before a weekday',
  'zh': {short: 'Short names (Chinese has none)'},
  'zh-Hant': {short: 'Drop the weekday word at the end of a range'}
};

// What each named style is called on the page.
const styleLabels = {
  at: 'Austria',
  br: 'Brazil',
  ch: 'Switzerland',
  de: 'Germany',
  es: 'Spain',
  gb: 'British',
  hk: 'Hong Kong',
  house: 'US with AM and PM',
  it: 'Italy',
  mx: 'Mexico',
  pt: 'Portugal',
  tw: 'Taiwan',
  us: 'American'
};

function labelled(text, option) {
  return [text, element('code', '', option)];
}

// A control for one field of a style table: a checkbox for a yes or no,
// a short text box for a word.
function styleField(code, field, value) {
  const label = element('label', 'option');
  const control = document.createElement('input');
  const text = fieldLabels[code]?.[field] ?? fieldLabels[field];

  control.type = typeof value === 'boolean' ? 'checkbox' : 'text';
  control.spellcheck = false;
  control.addEventListener('input', describe);
  if (control.type === 'checkbox') {
    label.append(control, ' ', ...labelled(text, field));
  }
  else {
    label.append(text, ' ', control, ...labelled('', field));
  }

  return {control, field, label};
}

function setStyle(controls, table) {
  controls.forEach(function set({control, field}) {
    control[control.type === 'checkbox' ? 'checked' : 'value'] = table[field];
  });
}

// One group of style controls per language: its named styles, then each
// field of its style table, set from the style chosen. One group shows at
// a time, chosen by language.
function styleGroup(language) {
  const module = modules[language.code];
  const group = element('div', 'style');
  const names = Object.keys(module.styles);
  const controls = Object.entries(module.styles[module.defaultStyle])
    .map(function field([name, value]) {
      return styleField(language.code, name, value);
    });

  group.hidden = language.code !== 'en';
  styleLanguage.append(element('option', '', language.name));
  styleLanguage.lastChild.value = language.code;
  if (names.length > 1) {
    const label = element('label', 'option');
    const select = document.createElement('select');

    select.append(...names.map(function option(name) {
      const made = element('option', '', styleLabels[name] ?? name);

      made.value = name;

      made.selected = name === module.defaultStyle;

      return made;
    }));
    select.addEventListener('change', function restyle() {
      setStyle(controls, module.styles[select.value]);
      describe();
    });
    label.append('Regional style ', select, ...labelled('', 'styles'));
    group.append(label);
  }
  group.append(...controls.map(function label({label: made}) {
    return made;
  }));
  setStyle(controls, module.styles[module.defaultStyle]);
  styles.append(group);

  return {controls, group};
}

function chosenStyle(controls) {
  return Object.fromEntries(controls.map(function read({control, field}) {
    const value = control.type === 'checkbox' ? control.checked : control.value;

    return [field, value];
  }));
}

// What cronli5 says, or why it refuses: a style a language cannot honour
// is refused in that language's row alone.
function ourDescription(pattern, options) {
  try {
    return {text: cronli5(pattern, options)};
  }
  catch (error) {
    return {error: true, text: String(error.message ?? error)};
  }
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

  return {...styleGroup(language), language, said, theirs};
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

function theirDescription(pattern, code, options) {
  const locale = cronstrueLocales[code] ?? code;

  // cRonstrue answers an unknown locale in English, so the table of its
  // locales (on its default export) says which it has.
  return cronstrue.default.locales[locale] ?
    {text: cronstrue.toString(pattern, {...options, locale})} :
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
  const common = commonOptions();
  const options = theirOptions(common);
  const ours = pattern ? refusal(function ourWay() {
    cronli5(pattern, common);
  }) : null;
  const their = pattern ? refusal(function theirWay() {
    cronstrue.toString(pattern, options);
  }) : null;

  drawRuler(input.value);
  problem.replaceChildren(
    ...ours ? [element('span', 'reason', `cronli5: ${ours}`)] : [],
    ...their ? [element('span', 'reason', `cRonstrue: ${their}`)] : []
  );
  problem.hidden = !ours && !their;

  rows.forEach(function fill({controls, language, said, theirs}) {
    const description = pattern && !their ?
      theirDescription(pattern, language.code, options) :
      {text: ''};
    const described = ours || !pattern ?
      {text: ''} :
      ourDescription(pattern, {
        ...common,
        form,
        lang: language.code,
        style: chosenStyle(controls)
      });

    said.textContent = described.text;
    said.classList.toggle('error', Boolean(described.error));
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
styleLanguage.addEventListener('change', function showStyle() {
  rows.forEach(function show({group, language}) {
    group.hidden = language.code !== styleLanguage.value;
  });
});
document.querySelectorAll('.common input, .common select')
  .forEach(function listen(control) {
    control.addEventListener('change', describe);
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
