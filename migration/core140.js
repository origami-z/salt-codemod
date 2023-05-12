// Release note: https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.4.0

export const css140RenameMap = [
  // selectable to text
  ["--salt-selectable-cta-foreground", "--salt-text-primary-foreground"],
  [
    "--salt-selectable-cta-foreground-disabled",
    "--salt-text-primary-foreground-disabled",
  ],
  ["--salt-selectable-primary-foreground", "--salt-text-primary-foreground"],
  [
    "--salt-selectable-primary-foreground-disabled",
    "--salt-text-primary-foreground-disabled",
  ],
  ["--salt-selectable-secondary-foreground", "--salt-text-primary-foreground"],
  [
    "--salt-selectable-secondary-foreground-disabled",
    "--salt-text-primary-foreground-disabled",
  ],
  ["--salt-selectable-foreground-partial", "--salt-text-primary-foreground"],
  [
    "--salt-selectable-foreground-partialDisabled",
    "--salt-text-primary-foreground-disabled",
  ],
  // Measured to track rename
  ["--salt-measured-borderStyle", "--salt-track-borderStyle"],
  ["--salt-measured-borderStyle-active", "--salt-track-borderStyle-active"],
  ["--salt-measured-borderStyle-complete", "--salt-track-borderStyle-complete"],
  [
    "--salt-measured-borderStyle-incomplete",
    "--salt-track-borderStyle-incomplete",
  ],
  ["--salt-measured-borderWidth", "--salt-track-borderWidth"],
  ["--salt-measured-borderWidth-active", "--salt-track-borderWidth-active"],
  ["--salt-measured-borderWidth-complete", "--salt-track-borderWidth-complete"],
  [
    "--salt-measured-borderWidth-incomplete",
    "--salt-track-borderWidth-incomplete",
  ],
  ["--salt-measured-fontWeight", "--salt-track-fontWeight"],
  ["--salt-measured-textAlign", "--salt-track-textAlign"],
  ["--salt-measured-background", "--salt-track-background"],
  ["--salt-measured-background-disabled", "--salt-track-background-disabled"],
  ["--salt-measured-borderColor", "--salt-track-borderColor"],
  ["--salt-measured-borderColor-disabled", "--salt-track-borderColor-disabled"],
  ["--salt-palette-measured-background", "--salt-palette-track-background"],
  [
    "--salt-palette-measured-background-disabled",
    "--salt-palette-track-background-disabled",
  ],
  ["--salt-palette-measured-border", "--salt-palette-track-border"],
  [
    "--salt-palette-measured-border-disabled",
    "--salt-palette-track-border-disabled",
  ],

  // replace with selectable
  ["--salt-measured-foreground", "--salt-selectable-foreground"],
  [
    "--salt-measured-foreground-disabled",
    "--salt-selectable-foreground-disabled",
  ],
  ["--salt-measured-foreground-hover", "--salt-selectable-foreground-hover"],
  ["--salt-measured-foreground-active", "--salt-selectable-foreground-active"],
  [
    "--salt-measured-foreground-activeDisabled",
    "--salt-selectable-foreground-activeDisabled",
  ],
  [
    "--salt-measured-borderColor-disabled",
    "--salt-selectable-borderColor-disabled",
  ],

  // replace with accent background token
  ["--salt-measured-fill", "--salt-accent-fill"],
  ["--salt-measured-fill-disabled", "--salt-accent-fill-disabled"],

  // deprecated w/ no replacement ?!
  // - --salt-measured-foreground-undo
  // - --salt-palette-measured-fill
  // - --salt-palette-measured-fill-disabled
  // - --salt-palette-measured-foreground-active
  // - --salt-palette-measured-foreground-activeDisabled
  // - --salt-palette-interact-foreground-partial
  // - --salt-palette-interact-foreground-partialDisabled
];
