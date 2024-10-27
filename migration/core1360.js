import { warnRemovedReactAttribute, replaceReactAttribute } from "./utils.js";

export function react1360(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.36.0
  // Button
  replaceReactAttribute(file, {
    elementName: "Button",
    attributeFrom: "variant",
    valueFrom: `"cta"`,
    attributeTo: "sentiment",
    valueTo: `"accented"`,
  });
  replaceReactAttribute(file, {
    elementName: "Button",
    attributeFrom: "variant",
    valueFrom: `"primary"`,
    attributeTo: "sentiment",
    valueTo: `"neutral"`,
  });
  replaceReactAttribute(file, {
    elementName: "Button",
    attributeFrom: "variant",
    valueFrom: `"secondary"`,
    attributeTo: "appearance",
    valueTo: `"transparent"`,
  });

  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.52
  // Slider
  warnRemovedReactAttribute(file, {
    elementName: "Slider",
    allAttributesRemoved: new Set([
      "pageStep",
      "pushable",
      "pushDistance",
      "disabled",
      "hideMarks",
    ]),
  });
}
