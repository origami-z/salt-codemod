import { moveNamedImports } from "./utils.js";

// Jun 26, 2026
export function react1660(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.66.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.98

  // MegaMenu components moved from lab to core
  [
    "MegaMenu",
    "MegaMenuProps",
    "MegaMenuPlacement",
    "MegaMenuTrigger",
    "MegaMenuTriggerProps",
    "MegaMenuPanel",
    "MegaMenuPanelProps",
    "MegaMenuContent",
    "MegaMenuContentProps",
    "MegaMenuAside",
    "MegaMenuAsideProps",
    "MegaMenuActions",
    "MegaMenuActionsProps",
    "MegaMenuGroups",
    "MegaMenuGroupsProps",
    "MegaMenuGroup",
    "MegaMenuGroupProps",
    "MegaMenuGroupHeading",
    "MegaMenuGroupHeadingProps",
    "MegaMenuList",
    "MegaMenuListProps",
    "MegaMenuListItem",
    "MegaMenuListItemProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
