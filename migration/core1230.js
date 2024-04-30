import { moveNamedImports, warnRemovedReactAttribute } from "./utils.js";

// https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.23.0

export function react1230(file) {
  ["SegmentedButtonGroup", "SegmentedButtonGroupProps"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });

  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.39
  warnRemovedReactAttribute(file, {
    elementName: "Overlay",
    allAttributesRemoved: new Set(["onClose"]),
  });
}
