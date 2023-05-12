import { moveNamedImports } from "./utils.js";

// Release note: https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.3.0

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
export function react130(file) {
  // Components / Types moved from lab to core
  ["Avatar", "AvatarProps"].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );
}

export const css130RenameMap = [
  [
    "--salt-differential-positive-foreground",
    "--salt-status-positive-foreground",
  ],
  [
    "--salt-differential-negative-foreground",
    "--salt-status-negative-foreground",
  ],
];
