import { moveNamedImports } from "./utils.js";

// May 12, 2026
export function react1610(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.61.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.91

  // Rating and TabBar moved from lab to core
  ["Rating", "RatingProps", "TabBar", "TabBarProps"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });

  // TabsNext and related components moved from lab to core, and renamed
  [
    ["TabsNext", "Tabs"],
    ["TabsNextProps", "TabsProps"],
    ["TabNext", "Tab"],
    ["TabNextProps", "TabProps"],
    ["TabNextAction", "TabAction"],
    ["TabNextActionProps", "TabActionProps"],
    ["TabNextPanel", "TabPanel"],
    ["TabNextPanelProps", "TabPanelProps"],
    ["TabNextTrigger", "TabTrigger"],
    ["TabNextTriggerProps", "TabTriggerProps"],
    ["TabListNext", "TabList"],
    ["TabListNextProps", "TabListProps"],
  ].forEach(([from, to]) => {
    moveNamedImports(file, {
      namedImportText: from,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
      newName: to,
    });
  });
}
