import {expect} from 'chai';
import cronli5 from '../../src/cronli5.js';
import en from '../../src/lang/en/index.js';

// The orchestrator (src/cronli5.ts) lets a language override the core's
// suggested plan via `lang.plan(content, base)`: the core selects a
// default plan, and a language may remap it to its own kind while inheriting
// the core's choice for any plan it does not customize. These probes
// assert the seam without depending on any language's phrasing — a probe
// language simply reports which `plan.kind` reached `describe`.

// Borrow English's options/normalization, but expose the selected plan kind.
const probe = {
  ...en,
  describe(rendered) {
    return rendered.plan.kind;
  }
};

// The same probe, overriding exactly one plan with a language-specific
// kind and deferring to the core for everything else.
const probeOverride = {
  ...probe,
  plan(content, base) {
    return base.kind === 'minutesAcrossHours'
      ? {kind: 'custom:everyMinuteWindow'}
      : base;
  }
};

describe('Plan override (lang.plan):', function() {
  it('uses the core plan when a language has no override', function() {
    // `* 9,17 * * *` is a minute wildcard over discrete hours.
    expect(cronli5('* 9,17 * * *', {lang: probe}))
      .to.equal('minutesAcrossHours');
  });

  it('lets a language override that plan with its own kind', function() {
    expect(cronli5('* 9,17 * * *', {lang: probeOverride}))
      .to.equal('custom:everyMinuteWindow');
  });

  it('falls through to the core plan for kinds it does not override',
    function() {
      expect(cronli5('* * * * *', {lang: probeOverride}))
        .to.equal('everyMinute');
      expect(cronli5('0 9,17 * * *', {lang: probeOverride}))
        .to.equal('clockTimes');
    });
});
