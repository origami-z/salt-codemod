import { moveNamedImports } from "./utils.js";

// https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.25.0
export function react1250(file) {
  ["ParentChildLayout", "ParentChildLayoutProps"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
