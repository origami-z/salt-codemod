// Sep 29, 2026

/**
 * https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ftheme%401.47.0
 */
export const css1720RenameMap = [
  ["--salt-text-label-fontFamily", "--salt-text-fontFamily"],
  ["--salt-text-notation-fontFamily", "--salt-text-fontFamily"],
  ["--salt-typography-textDecoration-italic", "--salt-typography-fontStyle-italic"],
  ["--salt-color-logo-brown", "--salt-color-jpmBrown"],
  ["--salt-color-logo-brown-rgb", "--salt-color-jpmBrown-rgb"],
  ...[1, 2, 3, 4].flatMap((n) => [
    [`--salt-text-h${n}-fontFamily`, "--salt-text-heading-fontFamily"],
    [`--salt-text-h${n}-fontWeight`, "--salt-text-heading-fontWeight"],
    [`--salt-text-h${n}-fontWeight-small`, "--salt-text-heading-fontWeight-small"],
    [`--salt-text-h${n}-fontWeight-strong`, "--salt-text-heading-fontWeight-strong"],
    [`--salt-text-display${n}-fontFamily`, "--salt-text-display-fontFamily"],
    [`--salt-text-display${n}-fontWeight`, "--salt-text-display-fontWeight"],
    [`--salt-text-display${n}-fontWeight-small`, "--salt-text-display-fontWeight-small"],
    [`--salt-text-display${n}-fontWeight-strong`, "--salt-text-display-fontWeight-strong"],
  ]),
];
