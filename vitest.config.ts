import {defineConfig} from 'vitest/config';

// The source uses NodeNext-style explicit `.js` import specifiers that point at
// `.ts` files; extensionAlias makes Vite resolve those `.js` specifiers to the
// real `.ts` sources so coverage is measured against the TypeScript directly.
export default defineConfig({
  resolve: {
    extensionAlias: {
      '.js': ['.ts', '.js']
    }
  },
  test: {
    include: ['test/**/*.js'],
    // These are shared helpers/data imported by the real test files, not test
    // suites themselves; Vitest (unlike mocha) errors on a file with no tests.
    exclude: [
      '**/node_modules/**',
      'test/runner.js',
      'test/paradigms/grid.js',
      'test/paradigms/check.js',
      'test/core/bad_input/error-types.js'
    ],
    setupFiles: ['./test/vitest.setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/browser.ts', 'src/core/schedule.ts', 'src/types.ts'],
      reportsDirectory: './coverage',
      // The floors sit just below what the core and the English renderer
      // achieve. Statements, lines and branches leave a little room because
      // the bad_input suites feed random garbage, so a few defensive
      // statements are covered on some runs and not others.
      thresholds: {
        lines: 99.1,
        branches: 98.3,
        functions: 99.9,
        statements: 99.1
      }
    }
  }
});
