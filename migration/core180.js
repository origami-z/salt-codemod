import { moveNamedImports, renameNamedImports } from "./utils.js";

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
export function react180(file) {
  // Components / Types moved from lab to core
  ["MultilineInput", "MultilineInputProps"].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );

  for (const declaration of file.getImportDeclarations()) {
    // @salt-ds/lab@1.0.0-alpha.16
    renameNamedImports(declaration, {
      moduleSpecifier: "@salt-ds/lab",
      from: "NavItem",
      to: "NavigationItem",
    });

    renameNamedImports(declaration, {
      moduleSpecifier: "@salt-ds/lab",
      from: "NavItemProps",
      to: "NavigationItemProps",
    });
  }
}
