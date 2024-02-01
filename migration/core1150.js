import { moveNamedImports } from "./utils.js";

export function react1150(file) {
  [
    "Scrim",
    "ScrimProps",
    "NavigationItem",
    "NavigationItemProps",
    "Pagination",
    "PaginationProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
