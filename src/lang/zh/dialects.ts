// Chinese dialect style. Simplified Han (`zh-Hans`) is the default; Traditional
// (`zh-Hant`) would override character forms. Schedule prose surfaces little
// regional variation, so the style is minimal for now — a scaffold home for
// the Simplified/Traditional split to grow into.
import type {Cronli5Options} from '../../types.js';

// Chinese's resolved style shape.
export interface ChineseStyle {
  // Han variant; reserved for Traditional overrides of the vocab tables.
  variant: 'Hans' | 'Hant';
}

const zh: ChineseStyle = {variant: 'Hans'};

const dialects: {[name: string]: ChineseStyle} = {
  zh,
  'zh-Hans': zh,
  'zh-Hant': {variant: 'Hant'}
};

// Resolve the `dialect` option to a style table. Custom objects are not yet
// supported for Chinese, so they fall back to the default.
function resolveDialect(dialect: Cronli5Options['dialect']): ChineseStyle {
  return dialects[dialect as string] || dialects.zh;
}

export {resolveDialect};
