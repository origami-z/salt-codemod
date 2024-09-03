import { renameNamedImports } from "./utils.js";

// https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.32.0
export function react1320(file) {
  for (const declaration of file.getImportDeclarations()) {
    [
      ["UNSTABLE_SaltProviderNext", "SaltProviderNext"],
      ["UNSTABLE_SaltProviderNextProps", "SaltProviderNextProps"],
      ["UNSTABLE_Corner", "Corner"],
      ["UNSTABLE_CornerValues", "CornerValues"],
      ["UNSTABLE_HeadingFont", "HeadingFont"],
      ["UNSTABLE_HeadingFontValues", "HeadingFontValues"],
      ["UNSTABLE_Accent", "Accent"],
      ["UNSTABLE_AccentValues", "AccentValues"],
      ["UNSTABLE_ActionFont", "ActionFont"],
      ["UNSTABLE_ActionFontValues", "ActionFontValues"],
    ].forEach(([from, to]) => {
      // Rename named imports with new declaration
      renameNamedImports(declaration, {
        moduleSpecifier: "@salt-ds/core",
        from,
        to,
      });
    });
  }
}
