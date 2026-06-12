// Finnish dialect style tables. Dialect names are language-scoped; the
// default `fi` style follows Kielitoimiston ohjepankki and SFS 4175 (see
// notes.md). Custom objects merge over the `fi` defaults.
const dialects = {
  fi: {
    // Separator between hours, minutes, and seconds. The period is the
    // Finnish standard ("klo 9.30"); the colon is common on digital
    // displays.
    sep: '.'
  }
};

// Resolve the `dialect` option to a style table.
function resolveDialect(dialect) {
  if (typeof dialect === 'object' && dialect !== null) {
    return {...dialects.fi, ...dialect};
  }

  return dialects[dialect] || dialects.fi;
}

export {resolveDialect};
