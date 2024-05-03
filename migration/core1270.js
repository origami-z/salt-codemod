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
