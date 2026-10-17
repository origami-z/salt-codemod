import { moveNamedImports } from "./utils.js";

// May 22, 2026
export function react1620(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.62.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.93

  // SidePanel components moved from lab to core
  [
    "SidePanel",
    "SidePanelProps",
    "SidePanelProvider",
    "SidePanelProviderProps",
    "SidePanelTrigger",
    "SidePanelTriggerProps",
    "SidePanelTriggerExtraProps",
    "SidePanelTriggerPropsResult",
    "SidePanelCloseButton",
    "SidePanelHeader",
    "SidePanelHeaderProps",
    "SidePanelTitle",
    "SidePanelTitleProps",
    "SidePanelContent",
    "SidePanelContentProps",
    "SidePanelValue",
    "useSidePanel",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
