// The typed rejection for invalid cron input. Every intentional "your
// pattern is bad" throw in the core uses this class, so the lenient path
// (and any caller) can tell input errors apart from genuine defects — a
// renderer or analysis bug must propagate, never masquerade as the
// language's fallback description.

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
  }
}

export {Cronli5InputError};
