import { moveNamedImports, renameNamedImports } from "./utils.js";

// May 2, 2025
export function react1450(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.45.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.67

  // SteppedTracker moved from lab to core and renamed to Stepper
  // Note: Component structure also changed significantly, manual migration may be needed
  ["Stepper", "StepperProps", "Step", "StepProps", "StepLabel"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });

  // Rename SteppedTracker to Stepper if found
  renameNamedImports(file, {
    oldImportName: "SteppedTracker",
    newImportName: "Stepper",
    packageName: "@salt-ds/core",
  });
}
