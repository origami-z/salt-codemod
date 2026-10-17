import { moveNamedImports } from "./utils.js";

// Mar 3, 2026
export function react1580(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.58.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.87

  // Kbd moved from lab to core
  ["Kbd", "KbdProps"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}

/**
 * https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ftheme%401.41.0
 */
export const css1580RenameMap = [
  ["--salt-editable-primary-background-readonly", "--salt-editable-background-readonly"],
  ["--salt-editable-secondary-background-readonly", "--salt-editable-background-readonly"],
  ["--salt-editable-primary-background-hover", "--salt-editable-primary-background"],
  ["--salt-editable-primary-background-active", "--salt-editable-primary-background"],
  ["--salt-editable-secondary-background-hover", "--salt-editable-secondary-background"],
  ["--salt-editable-secondary-background-active", "--salt-editable-secondary-background"],
];
