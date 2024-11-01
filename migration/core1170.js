import {
  moveNamedImports,
  warnRemovedReactAttribute,
  replaceReactAttribute,
} from "./utils.js";

export function react1170(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.31
  warnRemovedReactAttribute(file, {
    elementName: "LinearProgress",
    allAttributesRemoved: new Set(["unit"]),
  });

  replaceReactAttribute(file, {
    elementName: "ParentChildLayout",
    attributeFrom: "stackedAtBreakpoint",
    attributeTo: "collapseAtBreakpoint",
    packageName: "@salt-ds/lab",
  });
  replaceReactAttribute(file, {
    elementName: "ParentChildLayout",
    attributeFrom: "stackedViewElement",
    attributeTo: "collapsedViewElement",
    packageName: "@salt-ds/lab",
  });
  warnRemovedReactAttribute(file, {
    elementName: "ParentChildLayout",
    allAttributesRemoved: new Set(["orientation"]),
  });

  [
    "CircularProgress",
    "CircularProgressProps",
    "LinearProgress",
    "LinearProgressProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
