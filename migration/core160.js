import { moveNamedImports } from "./utils.js";

// Release note: https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.6.0

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
export function react160(file) {
  // Components / Types moved from lab to core
  ["mergeProps"].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );
}

export const css160RenameMap = [
  // Deprecated -emphasize tokens in status and palette; replaced with default tokens
  [
    "--salt-status-error-background-emphasize",
    "--salt-status-error-background",
  ],
  ["--salt-status-info-background-emphasize", "--salt-status-info-background"],
  [
    "--salt-status-success-background-emphasize",
    "--salt-status-success-background",
  ],
  [
    "--salt-status-warning-background-emphasize",
    "--salt-status-warning-background",
  ],
  [
    "--salt-palette-error-background-emphasize",
    "--salt-palette-error-background",
  ],
  [
    "--salt-palette-info-background-emphasize",
    "--salt-palette-info-background",
  ],
  [
    "--salt-palette-success-background-emphasize",
    "--salt-palette-success-background",
  ],
  [
    "--salt-palette-warning-background-emphasize",
    "--salt-palette-warning-background",
  ],

  // Deprecated --salt-size-icon-base, replaced with --salt-icon-size-base
  ["--salt-size-icon-base", "--salt-icon-size-base"],
];
