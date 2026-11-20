// How fast each language describes a broad fixed corpus, and a check that a
// change to make it faster says nothing differently.
//
// The corpus is the fuzz pattern space (scripts/fuzz-lang.mjs: about
// 100,800 five- and six-field patterns) and two sweeps of seven-field
// patterns: one read with `seconds` and `years`, one written for Quartz.
// The library is timed as it ships, one esbuild bundle. Each language, in
// a process of its own, describes the whole corpus once to warm up, then
// several times more; a pattern's time is split into the core's (prepare and
// analyze, which make the facts) and the renderer's (describe, including
// any core helper the renderer calls). The figures are the median run, in
// microseconds a pattern, and the patterns slowest in every run.
//
// Usage (run via node --import tsx, or `npm run speed --`):
//   speed.mjs [--lang=ko,pl] [--part=fuzz,years,quartz] [--runs=5]
//       [--slowest=5]
//     time the languages (all fifteen, the whole corpus, by default)
//   speed.mjs --capture=<dir> [--lang=ko]
//     write every output, under every named style and every boolean style
//     field flipped, to <dir>/<code>.txt
//   speed.mjs --compare=<dir> [--lang=ko]
//     render the same again and count the outputs that differ
//   --source=<dir> bundles the library from another copy of the sources
//     (one exported with `git archive`, say) to time or capture it instead
//
// The numbers are places to look and a record to compare against, never a
// target: see tooling/docs/speed.md.

import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync}
  from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {fileURLToPath, pathToFileURL} from 'node:url';
import * as esbuild from 'esbuild';
import {patterns} from '../../scripts/fuzz-lang.mjs';

const CODES = [
  'en', 'cs', 'de', 'es', 'fr', 'it', 'ja', 'pt', 'uk', 'zh',
  'id', 'ko', 'pl', 'ru', 'zh-Hant'
];

// The Cartesian product of the given lists, each combination joined by a
// space.
function joined(lists) {
  return lists.reduce(function step(combos, list) {
    return combos.flatMap(function combine(combo) {
      return list.map(function add(value) {
        return [...combo, value];
      });
    });
  }, [[]]).map(function join(combo) {
    return combo.filter(Boolean).join(' ');
  });
}

// Seven fields read with a second and a year field.
function yearSweep() {
  return joined([
    ['0', '*/15', '30'], ['0', '*/15', '5,30', '*'],
    ['9', '*/2', '9-17', '*'], ['1', '*', 'L', '15W'], ['1', '*/3', '*'],
    ['*', 'MON-FRI', '5L'],
    ['*', '2030', '2030-2035', '*/2', '2030,2040', '2026/3']
  ]).map(function read(pattern) {
    return {options: {seconds: true, years: true}, pattern};
  });
}

// Quartz patterns, one day field a question mark, the year optional.
function quartzSweep() {
  const days = [
    '? MON', '? MON-FRI', '? 6#3', '? 6L', '1 ?', 'L ?', '15W ?', 'LW ?',
    '* ?', 'L-3 ?'
  ];

  return joined([
    ['0', '*/30'], ['0', '*/15', '5,30'], ['9', '*/2', '9-17'], days,
    ['*', '1', '6-8'], ['', '*', '2030/2']
  ]).map(function read(pattern) {
    // The month sits after both day fields in the pattern.
    const fields = pattern.split(' ');
    const ordered = [...fields.slice(0, 4), fields[5], fields[4],
      ...fields.slice(6)].join(' ');

    return {options: {cron: 'quartz'}, pattern: ordered};
  });
}

// The parts of the corpus, by name.
const PARTS = {
  fuzz() {
    return patterns().map(function plain(pattern) {
      return {options: {}, pattern};
    });
  },
  quartz: quartzSweep,
  years: yearSweep
};

/** The fixed corpus, or the named parts of it. */
function corpus(parts = ['fuzz', 'years', 'quartz']) {
  return parts.flatMap(function part(name) {
    return PARTS[name]();
  });
}

// The library as it ships: one esbuild bundle of the sources, with every
// language. Loaded through tsx instead, each named function expression is
// wrapped to keep its name, which costs more than the core's own work.
let lib = null;

async function shipped(root) {
  const languages = CODES.map(function exported(code) {
    return `export {default as ${code.replace('-', '')}} from ` +
      `'./src/lang/${code.toLowerCase()}/index.ts';`;
  });
  const bundle = await esbuild.build({
    bundle: true,
    format: 'esm',
    stdin: {
      contents: [
        'export {analyze, prepare} from \'./src/core/index.ts\';',
        'export {resolve, setupOf} from \'./src/options.ts\';',
        ...languages
      ].join('\n'),
      loader: 'ts',
      resolveDir: root
    },
    write: false
  });
  const file = `${tmpdir()}/cronli5-speed-${process.pid}.mjs`;

  writeFileSync(file, bundle.outputFiles[0].text);
  lib = await import(pathToFileURL(file).href);
  rmSync(file);
}

function languageOf(code) {
  return lib[code.replace('-', '')];
}

// The options as a describing call resolves them, once per entry.
function resolveAll(language, entries, style) {
  const setup = lib.setupOf({languages: [language]});

  return entries.map(function resolveEntry(entry) {
    return lib.resolve(setup, {...entry.options, style}).opts;
  });
}

// Describe a pattern, or say what it threw.
function described(language, pattern, opts) {
  try {
    return language.describe(lib.analyze(lib.prepare(pattern, opts)), opts);
  }
  catch (error) {
    return `ERROR ${error.message}`;
  }
}

// One timed pass over the corpus: the core's and the renderer's time for
// each pattern, in nanoseconds. A pattern that throws counts nothing.
function timedPass(language, entries, resolved) {
  const core = new Float64Array(entries.length);
  const renderer = new Float64Array(entries.length);

  entries.forEach(function time(entry, index) {
    const opts = resolved[index];
    const start = process.hrtime.bigint();

    try {
      const facts = lib.analyze(lib.prepare(entry.pattern, opts));
      const analysed = process.hrtime.bigint();

      language.describe(facts, opts);
      core[index] = Number(analysed - start);
      renderer[index] = Number(process.hrtime.bigint() - analysed);
    }
    catch {
      core[index] = Number.NaN;
    }
  });

  return {core, renderer};
}

function median(values) {
  const sorted = [...values].sort(function ascending(a, b) {
    return a - b;
  });

  return sorted[Math.floor(sorted.length / 2)];
}

function sum(values) {
  return values.reduce(function add(total, value) {
    return Number.isNaN(value) ? total : total + value;
  }, 0);
}

// Time one language: a warm-up pass, then `runs` passes.
function timeLanguage(language, entries, settings) {
  function perPattern(total) {
    return total / counted / 1000;
  }

  const resolved = resolveAll(language, entries);

  timedPass(language, entries, resolved);

  const passes = Array.from({length: settings.runs}, function pass() {
    return timedPass(language, entries, resolved);
  });
  const counted = passes[0].core.filter(function ok(value) {
    return !Number.isNaN(value);
  }).length;
  // A pattern's least time over the runs, so one pause does not mark it.
  const least = entries.map(function fastest(entry, index) {
    return Math.min(...passes.map(function both(pass) {
      return pass.core[index] + pass.renderer[index];
    }));
  });
  const slowest = entries.map(function pair(entry, index) {
    return {entry, nanos: least[index]};
  }).filter(function ok(item) {
    return !Number.isNaN(item.nanos);
  }).sort(function descending(a, b) {
    return b.nanos - a.nanos;
  }).slice(0, settings.slowest);

  return {
    core: perPattern(median(passes.map(function core(pass) {
      return sum(pass.core);
    }))),
    counted,
    patternMedian: median(least.filter(function ok(value) {
      return !Number.isNaN(value);
    })) / 1000,
    renderer: perPattern(median(passes.map(function renderer(pass) {
      return sum(pass.renderer);
    }))),
    slowest
  };
}

// Every style a language is checked under: each named table, and the
// default table with each boolean field flipped.
function stylesOf(language) {
  const named = Object.keys(language.styles).map(function table(name) {
    return {label: name, style: language.styles[name]};
  });
  const base = language.styles[language.defaultStyle];
  const flipped = Object.keys(base).filter(function flag(field) {
    return typeof base[field] === 'boolean';
  }).map(function flip(field) {
    return {
      label: `${language.defaultStyle}+${field}`,
      style: {...base, [field]: !base[field]}
    };
  });

  return [...named, ...flipped];
}

// Every output of a language over the corpus, one a line.
function outputsOf(language, entries) {
  return stylesOf(language).flatMap(function under(variant) {
    const resolved = resolveAll(language, entries, variant.style);

    return entries.map(function line(entry, index) {
      const text = described(language, entry.pattern, resolved[index]);

      return `${variant.label}\t${JSON.stringify(entry.options)}\t` +
        `${entry.pattern}\t${text.replaceAll('\n', '\\n')}`;
    });
  });
}

function capture(codes, dir, entries) {
  mkdirSync(dir, {recursive: true});

  codes.forEach(function write(code) {
    const lines = outputsOf(languageOf(code), entries);

    writeFileSync(`${dir}/${code}.txt`, `${lines.join('\n')}\n`);
    console.log(`${code}: ${lines.length} outputs captured`);
  });
}

function compare(codes, dir, entries) {
  let pairs = 0;
  let differing = 0;

  for (const code of codes) {
    const file = `${dir}/${code}.txt`;

    if (!existsSync(file)) {
      throw new Error(`no capture for ${code} in ${dir}`);
    }

    const before = readFileSync(file, 'utf8').split('\n').slice(0, -1);
    const now = outputsOf(languageOf(code), entries);
    const changed = now.filter(function differs(line, index) {
      return line !== before[index];
    });

    if (now.length !== before.length) {
      throw new Error(`${code}: ${now.length} outputs, ` +
        `${before.length} captured`);
    }

    pairs += now.length;
    differing += changed.length;
    console.log(`${code}: ${now.length} outputs, ${changed.length} differ`);
    changed.slice(0, 5).forEach(function show(line) {
      console.log(`  ${line}`);
    });
  }

  console.log(`all: ${pairs} outputs compared, ${differing} differ`);

  if (differing) {
    process.exitCode = 1;
  }
}

// Time each language in a process of its own, so that one language's
// garbage is not collected in another's time.
function report(codes, entries, argv) {
  const script = fileURLToPath(import.meta.url);
  const others = argv.filter(function kept(arg) {
    return !arg.startsWith('--lang=');
  });
  const timings = codes.map(function alone(code) {
    return {code, ...JSON.parse(execFileSync(process.execPath,
      [...process.execArgv, script, ...others, `--lang=${code}`, '--json'],
      {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024}))};
  });

  console.log(`${entries.length} patterns, ${timings[0].runs} runs after ` +
    'one warm-up, each language in its own process; microseconds a ' +
    'pattern (median run)\n');
  console.log('| Language | Core | Renderer | Total | Median pattern |');
  console.log('| --- | ---: | ---: | ---: | ---: |');
  timings.forEach(function row(timed) {
    console.log(`| ${timed.code} | ${timed.core.toFixed(1)} | ` +
      `${timed.renderer.toFixed(1)} | ` +
      `${(timed.core + timed.renderer).toFixed(1)} | ` +
      `${timed.patternMedian.toFixed(1)} |`);
  });

  console.log('\nSlowest patterns (least time over the runs, microseconds):');
  timings.forEach(function print(timed) {
    console.log(`${timed.code}:`);
    timed.slowest.forEach(function line(pattern) {
      console.log(`  ${(pattern.nanos / 1000).toFixed(0).padStart(6)}  ` +
        `${pattern.entry.pattern}  ${JSON.stringify(pattern.entry.options)}`);
    });
  });
}

function option(argv, name, fallback) {
  const given = argv.find(function named(arg) {
    return arg.startsWith(`--${name}=`);
  });

  return given ? given.slice(name.length + 3) : fallback;
}

async function main(argv) {
  const codes = option(argv, 'lang', CODES.join(',')).split(',');
  const parts = option(argv, 'part', null);
  const entries = parts ? corpus(parts.split(',')) : corpus();
  const captureDir = option(argv, 'capture', null);
  const compareDir = option(argv, 'compare', null);

  await shipped(option(argv, 'source',
    fileURLToPath(new URL('../../', import.meta.url))));

  if (captureDir) {
    capture(codes, captureDir, entries);
  }
  else if (compareDir) {
    compare(codes, compareDir, entries);
  }
  else if (argv.includes('--json')) {
    const runs = Number(option(argv, 'runs', '5'));

    console.log(JSON.stringify({
      ...timeLanguage(languageOf(codes[0]), entries,
        {runs, slowest: Number(option(argv, 'slowest', '5'))}),
      runs
    }));
  }
  else {
    report(codes, entries, argv);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  await main(process.argv.slice(2));
}

export {corpus, stylesOf};
