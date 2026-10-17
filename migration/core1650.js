import { moveNamedImports } from "./utils.js";

// Jun 23, 2026
export function react1650(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.65.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.97

  // ToolbarNext and related components moved from lab to core, and renamed
  [
    ["ToolbarNext", "Toolbar"],
    ["ToolbarNextProps", "ToolbarProps"],
    ["ToolbarContentNext", "ToolbarContent"],
    ["ToolbarContentNextProps", "ToolbarContentProps"],
    ["TooltrayNext", "Tooltray"],
    ["TooltrayNextProps", "TooltrayProps"],
  ].forEach(([from, to]) => {
    moveNamedImports(file, {
      namedImportText: from,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
      newName: to,
    });
  });
}
