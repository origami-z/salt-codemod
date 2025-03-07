import {
  moveNamedImports,
  warnRemovedReactAttribute,
  replaceReactAttribute,
} from "./utils.js";

//   Jan 22 2025
export function react1390(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.39.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.59
  ["SkipLinkProps", "SkipLink"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
