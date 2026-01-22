import { moveNamedImports } from "./utils.js";

// Jan 22, 2026
export function react1430(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.43.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.39
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.64

  // SegmentedButtonGroup moved from lab to core
  ["SegmentedButtonGroup", "SegmentedButtonGroupProps"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });

  // DialogHeader and OverlayHeader moved from lab to core (also in v1.42.0)
  [
    "DialogHeader",
    "DialogHeaderProps",
    "OverlayHeader",
    "OverlayHeaderProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
