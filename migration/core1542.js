// Jan 21, 2026

/**
 * https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ftheme%401.38.0
 */
export const css1542RenameMap = Array.from({ length: 20 }, (_, i) => i + 1).flatMap(
  (n) =>
    ["background", "borderColor", "foreground"].map((suffix) => [
      `--salt-category-${n}-subtle-${suffix}`,
      `--salt-category-${n}-${suffix}`,
    ])
);
