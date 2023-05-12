import { moveNamedImports } from "./utils.js";

// Release note: https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.1.0

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
export function react110(file) {
  // Components / Types moved from lab to core
  ["Card", "CardProps", "Panel", "PanelProps"].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );
}
