// Language-independent numeric formatting primitives shared by the
// language renderers. Languages own their words and conventions (which
// numbers to spell, which separator, whether and where to pad the hour);
// these are the purely mechanical pieces — zero-padding and digit
// assembly — that would otherwise be copied into every module. Keeping
// them here is DRY *without* coupling one language to another: the shared
// dependency is the core, never a sibling language (docs/i18n-design.md).

// Zero-pad a number to two digits.
function pad(n: number | string): string {
  n = '' + n;

  return n.length < 2 ? '0' + n : n;
}

// A number spelled from a words table, or the bare digit when the value
// is outside the table or the `short` option asks for digits. The table
// (the actual words) belongs to the language; only the lookup is shared.
function numeral(
  n: number,
  words: {[index: number]: string | null},
  opts: {short: boolean}
): string | number {
  return opts.short ? n : words[n] || n;
}

// A numeric clock time assembled from a `{hour, minute, second}` time and
// a format: "09:00", "9.30", "9", "9:00:15". The two format axes that vary
// between languages and clock forms:
//   - `pad` zero-pads the hour ("09" vs "9").
//   - `lean` drops the minute entirely when it (and the second) are zero,
//     the "9" in "9 a.m." or the "klo 9" form; otherwise the minute is
//     always shown, two digits.
// The second is shown only when non-zero. Everything *around* the digits
// — articles, am/pm, day periods, "klo", noon/midnight — is the
// language's own and stays in the language module.
function clockDigits(
  time: {hour: number; minute: number; second?: number},
  {sep, pad: padHour, lean}: {sep: string; pad?: boolean; lean?: boolean}
): string {
  const head = padHour ? pad(time.hour) : '' + time.hour;

  if (lean && !time.minute && !time.second) {
    return head;
  }

  return head + sep + pad(time.minute) +
    (time.second ? sep + pad(time.second) : '');
}

export {clockDigits, numeral, pad};
