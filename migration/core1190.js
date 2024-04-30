import { renameNamedImports, moveNamedImports } from "./utils.js";

export function react1190(file) {
  for (const declaration of file.getImportDeclarations()) {
    // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.34
    renameNamedImports(declaration, {
      moduleSpecifier: "@salt-ds/lab",
      from: "DialogTitle",
      to: "DialogHeader",
    });
  }

  [
    "Drawer",
    "DrawerProps",
    "DrawerCloseButton",
    "LinkCard",
    "LinkCardProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });

  warnRemovedReactAttribute(file, {
    elementName: "DropdownNext",
    allAttributesRemoved: new Set(["defaultValue"]),
  });
}
