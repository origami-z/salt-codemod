import { renameNamedImports } from "./utils.js";

// Jun 18, 2026
export function react1641(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.96

  // MegaMenu API changes in lab
  for (const declaration of file.getImportDeclarations()) {
    [
      ["MegaMenuHeader", "MegaMenuGroupHeading"],
      ["MegaMenuHeaderProps", "MegaMenuGroupHeadingProps"],
      ["MegaMenuItem", "MegaMenuListItem"],
      ["MegaMenuItemProps", "MegaMenuListItemProps"],
      ["MegaMenuSupportingContent", "MegaMenuAside"],
      ["MegaMenuSupportingContentProps", "MegaMenuAsideProps"],
      ["MegaMenuSupportingActions", "MegaMenuActions"],
      ["MegaMenuSupportingActionsProps", "MegaMenuActionsProps"],
    ].forEach(([from, to]) => {
      renameNamedImports(declaration, {
        moduleSpecifier: "@salt-ds/lab",
        from,
        to,
      });
    });
  }
}
