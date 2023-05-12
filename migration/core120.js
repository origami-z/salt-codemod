import { moveNamedImports } from "./utils.js";

// Release note: https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.2.0

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
export function react120(file) {
  // Components / Types moved from lab to core
  [
    "Tooltip",
    "TooltipProps",
    "useFloatingUI",
    "Spinner",
    "SplitLayout",
    "SplitLayoutProps",
  ].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );
}
