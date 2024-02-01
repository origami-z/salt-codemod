import { warnRemovedReactAttribute, moveNamedImports } from "./utils.js";

export function react1140(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.27
  // Scrim
  warnRemovedReactAttribute(file, {
    elementName: "Scrim",
    allAttributesRemoved: new Set([
      "autoFocusRef",
      "disableAutoFocus",
      "disableReturnFocus",
      "fallbackFocusRef",
      "returnFocusOptions",
      "tabEnabledSelectors",
      "onBackDropClick",
      "closeWithEscape",
      "onClose",
      "enableContainerMode",
      "containerRef",
      "zIndex",
    ]),
  });

  moveNamedImports(file, {
    namedImportText: "PillNext",
    newName: "Pill",
    from: "@salt-ds/lab",
    to: "@salt-ds/core",
  });
}
