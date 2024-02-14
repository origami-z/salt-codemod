import { moveNamedImports, warnRemovedReactAttribute } from "./utils.js";

export function react1170(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.31
  warnRemovedReactAttribute(file, {
    elementName: "LinearProgress",
    allAttributesRemoved: new Set(["unit"]),
  });

  // TODO: ParentChildLayout prop rename `stackedAtBreakpoint` => `collapseAtBreakpoint` & `stackedViewElement` => `collapsedViewElement`

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
