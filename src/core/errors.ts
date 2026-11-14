// The typed rejection for invalid cron input. Every intentional "your
// pattern is bad" throw in the core uses this class, so the lenient path
// (and any caller) can tell input errors apart from genuine defects — a
// renderer or analysis bug must propagate, never masquerade as the
// language's fallback description.

// Each entry point is bundled on its own, so a caller can hold one copy
// of an error class while another copy throws. The classes therefore
// recognize their instances by a registered symbol, not by identity:
// `instanceof` is true for an error from any build of cronli5.
function branded(name: string): symbol {
  return Symbol.for('cronli5.' + name);
}

function carries(value: unknown, brand: symbol): boolean {
  return typeof value === 'object' && value !== null && brand in value;
}

const inputBrand = branded('Cronli5InputError');
const optionBrand = branded('Cronli5OptionError');

/**
 * The error `cronli5` throws when the cron pattern itself is invalid: an
 * empty or malformed pattern, an out-of-range or unrecognized field value,
 * an unknown macro, or a misused Quartz token. With `{lenient: true}`,
 * exactly these are converted into the language's fallback description;
 * any other exception is a bug and propagates.
 */
class Cronli5InputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Cronli5InputError';
    Reflect.defineProperty(this, inputBrand, {value: true});
  }

  static [Symbol.hasInstance](value: unknown): boolean {
    return carries(value, inputBrand);
  }
}

/**
 * The error `cronli5` throws when an option cannot be honoured: an unknown
 * option or language, a style field the language does not have, a value
 * outside what an option accepts. It is the caller's code that is wrong,
 * not the pattern, so `{lenient: true}` never converts it.
 */
class Cronli5OptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Cronli5OptionError';
    Reflect.defineProperty(this, optionBrand, {value: true});
  }

  static [Symbol.hasInstance](value: unknown): boolean {
    return carries(value, optionBrand);
  }
}

export {Cronli5InputError, Cronli5OptionError};
