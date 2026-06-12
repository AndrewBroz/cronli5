/**
 * Shared declaration for every `cronli5/lang/<code>` subpath: each
 * language module's default export is a `Cronli5Language`, passed to
 * `cronli5` via the `lang` option.
 */
import {Cronli5Language} from './cronli5';

declare const lang: Cronli5Language;
export default lang;
