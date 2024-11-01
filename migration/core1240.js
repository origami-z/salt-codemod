import {
  moveNamedImports,
  warnRemovedReactAttribute,
  replaceReactAttribute,
} from "./utils.js";

// https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.24.0

export function react1240(file) {
  [
    "Overlay",
    "OverlayProps",
    "OverlayTrigger",
    "OverlayTriggerProps",
    "OverlayPanel",
    "OverlayPanelProps",
    "OverlayPanelCloseButton",
    "OverlayPanelContent",
    "OverlayPanelContentProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });

  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.40
  warnRemovedReactAttribute(file, {
    elementName: "ParentChildLayout",
    allAttributesRemoved: new Set(["parentPosition", "disableAnimation"]),
  });

  replaceReactAttribute(file, {
    elementName: "ParentChildLayout",
    attributeFrom: "collapsedViewElement",
    attributeTo: "visibleView",
    packageName: "@salt-ds/lab",
  });
}
