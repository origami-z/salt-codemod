/**
 * @salt-ds/theme@1.8.0 changes
 */
export const css182RenameMap = [
  ["--salt-size-basis-unit", "4px"],
  ["--salt-size-adornmentGap", "--salt-spacing-75"],
  ["--salt-size-container-spacing", "--salt-spacing-300"],
  ["--salt-size-divider-strokeWidth", "--salt-size-border"],
  ["--salt-size-separator-height", "--salt-size-base"],
  [
    "--salt-size-stackable",
    // not ideal, best guess for find and replacement
    "calc(var(--salt-size-base) + var(--salt-spacing-100))",
  ],
  ["--salt-size-unit", "--salt-spacing-100"],
  ["--salt-size-compact", "--salt-size-adornment"],
  ["--salt-size-accent", "--salt-size-bar"],
  ["--salt-size-sharktooth-height", "5px"],
  ["--salt-size-sharktooth-width", "10px"],

  ["--salt-zIndex-docked", "1050"],
];
