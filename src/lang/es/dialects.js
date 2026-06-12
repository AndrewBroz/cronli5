// Spanish dialect style tables. Dialect names are language-scoped; the
// default `es` style is anchored to the RAE's Diccionario panhispánico de
// dudas and FundéuRAE recommendations (see notes.md). Custom objects merge
// over the `es` defaults.
const dialects = {
  es: {
    // Separator between hours, minutes, and seconds. FundéuRAE accepts
    // both ":" and "."; the colon is the panhispanic default.
    sep: ':'
  }
};

// Resolve the `dialect` option to a style table.
function resolveDialect(dialect) {
  if (typeof dialect === 'object' && dialect !== null) {
    return {...dialects.es, ...dialect};
  }

  return dialects[dialect] || dialects.es;
}

export {resolveDialect};
