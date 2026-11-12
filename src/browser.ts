// Browser entry: attach the default export to the global so a plain
// `<script>` include exposes a callable `cronli5`. A script tag has no
// named imports, so what the module exports by name rides on the
// function: `cronli5.create`, the error classes, and the built-in
// languages with their named styles (`cronli5.languages.en.styles.house`).
import cronli5, {Cronli5InputError, Cronli5OptionError, create}
  from './cronli5.js';
import en from './lang/en/index.js';

const global = Object.assign(cronli5, {
  Cronli5InputError,
  Cronli5OptionError,
  create,
  languages: {en}
});

if (typeof globalThis !== 'undefined') {
  Object.assign(globalThis, {cronli5: global});
}

export default global;
