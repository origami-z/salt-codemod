import { moveNamedImports } from "./utils.js";

// https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.21.0

export function react1210(file) {
  [
    "DropdownNext",
    "DropdownNextProps",
    "ComboBoxNext",
    "ComboBoxNextProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      newName: x.replace("Next", ""),
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });

  ["Option", "OptionProps", "OptionGroup", "OptionGroupProps"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
