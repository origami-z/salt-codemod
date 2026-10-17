import { moveNamedImports } from "./utils.js";

// Feb 9, 2026
export function react1560(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.56.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.85

  // Table components moved from lab to core
  [
    "Table",
    "TableProps",
    "TableContainer",
    "TableContainerProps",
    "THead",
    "THeadProps",
    "TBody",
    "TBodyProps",
    "TFoot",
    "TFootProps",
    "TR",
    "TRProps",
    "TH",
    "THProps",
    "TD",
    "TDProps",
    "withTableBaseName",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
