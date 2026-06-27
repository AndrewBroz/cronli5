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
      // Gated at Vitest's accurate V8 measurements. The previous c8-over-tsx
      // setup mis-mapped the transpiled output: it deflated function coverage
      // (the analyze.ts phantom that forced functions down to 97) while
      // *inflating* statement/branch/line coverage by false-covering real gaps.
      // These floors reflect what the TypeScript source actually exercises.
      // Raised after closing the reachable gaps the migration exposed: core
      // and the English renderer are now fully covered (100% lines/functions),
      // and verified rows were added across de/es/fi/zh. The residual uncovered
      // branches are either core-defensive guards or beta-renderer code paths
      // the core normalizes away before they can fire; the floors sit just at
      // the achieved coverage so any regression below it fails CI.
      thresholds: {
        lines: 98.5,
        branches: 97,
        functions: 99.2,
        statements: 98.5
      }
    }
  }
});
