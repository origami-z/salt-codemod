import { moveNamedImports } from "./utils.js";

// Feb 4, 2024
export function react1400(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.40.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.31

  // CircularProgress and LinearProgress moved from lab to core
  [
    "CircularProgress",
    "CircularProgressProps",
    "LinearProgress",
    "LinearProgressProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}

/**
 * https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ftheme%401.25.0
 */
export const css1400RenameMap = [
  ["--salt-palette-accent-background", "--salt-palette-accent"],
  ["--salt-palette-accent-border", "--salt-palette-accent"],
  ["--salt-palette-interact-cta-foreground-active", "--salt-palette-interact-cta-foreground"],
  ["--salt-palette-interact-cta-foreground-hover", "--salt-palette-interact-cta-foreground"],
  ["--salt-palette-neutral-primary-border", "--salt-palette-neutral-border"],
  ["--salt-palette-neutral-secondary-border", "--salt-palette-neutral-border"],
];
