import { moveNamedImports } from "./utils.js";

// Release note: https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.5.0

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
export function react150(file) {
  // Components / Types moved from lab to core
  [
    "Checkbox",
    "CheckboxProps",
    "RadioButton",
    "RadioButtonProps",
    "RadioButtonGroup",
    "RadioButtonGroupProps",
    "RadioButtonIcon",
    "RadioButtonIconProps",
    "capitalize",
  ].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );

  // TODO: <Card interactable> => <InteractableCard>
}
