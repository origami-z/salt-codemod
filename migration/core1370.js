import { renameNamedImports } from "./utils.js";

export function react1370(file) {
  // Icon deprecation
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ficons%401.13.0
  const iconPairs = [
    ["SuccessSmallIcon", "CheckmarkIcon"],
    ["SuccessSmallSolidIcon", "CheckmarkSolidIcon"],
    ["SuccessIcon", "CheckmarkIcon"],
    ["SuccessSolidIcon", "CheckmarkSolidIcon"],
    ["StepSuccessIcon", "SuccessCircleIcon"],
    ["SuccessTickIcon", "CheckmarkIcon"],
  ];

  for (const declaration of file.getImportDeclarations()) {
    for (const [before, after] of iconPairs) {
      renameNamedImports(declaration, {
        moduleSpecifier: "@salt-ds/icons",
        from: before,
        to: after,
      });
    }
  }

  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.55
  // TODO: What happened to `TabstripNext`?
  // `TabstripNext` -> `TabsNext` (e.g. `defaultValue` stays there), then more children is needed, e.g., `TabBar` and `TabListNext`...?
  // `<TabstripNext variant="inline">` is now `<TabListNext appearance="transparent">`
}
