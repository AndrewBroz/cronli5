/**
 * @license MIT, Copyright (c) 2026 Andrew Brož
 */

// The entry point that knows every language, for callers who would sooner
// name a language by code than choose which ones to ship. English is the
// default. A caller who minds the size imports `cronli5` and the languages
// they want instead.

import type {Cronli5, Cronli5AnyStyle} from './types.js';
import {create} from './cronli5.js';
import en from './lang/en/index.js';
import cs from './lang/cs/index.js';
import de from './lang/de/index.js';
import es from './lang/es/index.js';
import fr from './lang/fr/index.js';
import it from './lang/it/index.js';
import ja from './lang/ja/index.js';
import pt from './lang/pt/index.js';
import uk from './lang/uk/index.js';
import zh from './lang/zh/index.js';

const cronli5: Cronli5<Cronli5AnyStyle> = create({
  languages: [en, cs, de, es, fr, it, ja, pt, uk, zh]
});

export default cronli5;
export {create};
export {Cronli5InputError, Cronli5OptionError} from './core/errors.js';
export type {
  Cronli5, Cronli5AnyStyle, Cronli5Language, Cronli5Options, Cronli5Setup,
  CronPattern, CronPatternObject
} from './types.js';
