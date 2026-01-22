import { moveNamedImports } from "./utils.js";

// Sep 2, 2024
export function react1480(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.48.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.76

  // Collapsible components moved from lab to core
  [
    "Collapsible",
    "CollapsibleProps",
    "CollapsibleTrigger",
    "CollapsibleTriggerProps",
    "CollapsiblePanel",
    "CollapsiblePanelProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });

  // VerticalNavigation components moved from lab to core
  [
    "VerticalNavigation",
    "VerticalNavigationProps",
    "NavigationGroup",
    "NavigationGroupProps",
    "NavigationItem",
    "NavigationItemProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
