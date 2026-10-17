import { moveNamedImports } from "./utils.js";

// May 26, 2026
export function react1630(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.63.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.94

  // Tree components moved from lab to core
  [
    "Tree",
    "TreeProps",
    "TreeNode",
    "TreeNodeProps",
    "TreeNodeTrigger",
    "TreeNodeTriggerProps",
    "TreeNodeLabel",
    "TreeNodeLabelProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
