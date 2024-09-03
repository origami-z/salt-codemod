import { moveNamedImports } from "./utils.js";

// https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.27.0
export function react1270(file) {
  [
    "Menu",
    "MenuProps",
    "MenuItem",
    "MenuItemProps",
    "MenuTrigger",
    "MenuTriggerProps",
    "MenuPanel",
    "MenuPanelProps",
    "MenuGroup",
    "MenuGroupProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}

/**
 * @salt-ds/theme@1.15.0
 *
 * https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ftheme%401.15.0
 */
export const css1270RenameMap = [
  ["--salt-typography-fontFamily", "--salt-typography-fontFamily-openSans"],
  ["--salt-typography-fontFamily-code", "--salt-typography-fontFamily-ptMono"],
];
