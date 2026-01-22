import { moveNamedImports } from "./utils.js";

// Jan 22, 2026
export function react1420(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.42.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.35
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.37

  // Dialog components moved from lab to core
  [
    "Dialog",
    "DialogProps",
    "DialogContent",
    "DialogContentProps",
    "DialogActions",
    "DialogActionsProps",
    "DialogCloseButton",
    "DialogCloseButtonProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });

  // DropdownNext renamed to Dropdown, ComboBoxNext renamed to ComboBox
  // Option and OptionGroup moved from lab to core
  ["Option", "OptionProps", "OptionGroup", "OptionGroupProps"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
