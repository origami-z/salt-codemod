import { moveNamedImports } from "./utils.js";

// Apr 11, 2025
export function react1440(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.44.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.65

  // Slider and RangeSlider moved from lab to core
  [
    "Slider",
    "SliderProps",
    "RangeSlider",
    "RangeSliderProps",
    "SliderMark",
    "SliderMarkProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
