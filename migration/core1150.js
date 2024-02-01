import { moveNamedImports } from "./utils.js";

export function react1150(file) {
  ["Scrim", "NavigationItem", "Pagination"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
