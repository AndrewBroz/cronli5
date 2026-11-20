// A stand-in so the default entry point loads in a builder's checkout. It
// is not a renderer and not a model to copy.

import type {Language} from '../../core/schedule.js';
import type {EnglishStyle} from './options.js';
import {regions, style, styles} from './options.js';

const english: Language<EnglishStyle, 'en'> = {
  code: 'en',
  defaultStyle: 'us',
  describe() {
    return 'stand-in';
  },
  fallback() {
    return 'stand-in';
  },
  label(description) {
    return description;
  },
  reboot() {
    return 'stand-in';
  },
  regions,
  sentence(description) {
    return description;
  },
  style,
  styles
};

export type {EnglishStyle};
export {styles};
export default english;
