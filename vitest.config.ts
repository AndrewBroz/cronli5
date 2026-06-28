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
      //
      // lines/statements/functions are restored to their pre-pt level after
      // covering the pt contraction/gender/nth/recurrence branches with verified
      // corpus rows (the pt port had temporarily lowered them to absorb its dark
      // branches; that backslide is undone — the rows exercise the branches
      // instead).
      //
      // branches sits at 96.7 (just below the 96.75 achieved), the honest floor
      // pt can reach — NOT the pre-pt 97. pt's contraction layer (notes.md: the
      // principal es->pt divergence) is written as COMPLETE gender/number-driven
      // formation: each of withDe/withA/withEm carries all four article arms
      // (da/do/das/dos, à/ao/às/aos, na/no/nas/nos). But the cron domain only
      // ever feeds them feminine clock phrases (de+a/as) and the masculine
      // plural weekday recurrence (a+os=aos) plus SINGULAR Quartz phrases
      // (em+a/o); the masculine-singular date arms (a+o, de+o) and the plural-em
      // arms (em+as, em+os) have no caller a valid cron pattern can produce.
      // Those ~11 defensive arms are unreachable-by-construction, the same class
      // of beta-renderer residual the other languages already carry (es's dead
      // degenitive/meridiem scaffolding); contriving invalid input to "cover"
      // them would be dishonest, so the branch floor honestly records what valid
      // input reaches.
      thresholds: {
        lines: 98.5,
        branches: 96.7,
        functions: 99.2,
        statements: 98.5
      }
    }
  }
});
