import { moveNamedImports } from "./utils.js";

// Jan 22, 2026
export function react1460(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.46.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.40

  // Overlay components moved from lab to core
  [
    "Overlay",
    "OverlayProps",
    "OverlayTrigger",
    "OverlayTriggerProps",
    "OverlayPanel",
    "OverlayPanelProps",
    "OverlayPanelCloseButton",
    "OverlayPanelCloseButtonProps",
    "OverlayPanelContent",
    "OverlayPanelContentProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
