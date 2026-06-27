import {beforeAll, afterAll} from 'vitest';

// The suite was authored for mocha, which exposes `before`/`after` suite hooks
// and a `this.timeout(ms)` setter inside them. Vitest's globals provide
// `beforeAll`/`afterAll` and take the timeout as a second argument instead of a
// `this` context. This shim maps the mocha spelling onto Vitest so the existing
// test files run unchanged; `this.timeout` becomes a no-op because the real
// timeout is supplied here. The generous value covers the package smoke test,
// which rebuilds `dist/` inside its `before` hook.
const HOOK_TIMEOUT_MS = 60000;

const mochaContext = {
  timeout(): void {
    // no-op: timeout is governed by HOOK_TIMEOUT_MS below
  }
};

type MochaHook = (this: typeof mochaContext) => unknown;

declare global {
  interface GlobalThis {
    before: (fn: MochaHook) => void;
    after: (fn: MochaHook) => void;
  }
}

const globals = globalThis as unknown as {
  before: (fn: MochaHook) => void;
  after: (fn: MochaHook) => void;
};

globals.before = (fn: MochaHook): void => {
  beforeAll(() => Reflect.apply(fn, mochaContext, []), HOOK_TIMEOUT_MS);
};

globals.after = (fn: MochaHook): void => {
  afterAll(() => Reflect.apply(fn, mochaContext, []), HOOK_TIMEOUT_MS);
};
