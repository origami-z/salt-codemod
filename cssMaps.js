// Everything here is salt prefixed, assuming uitk prefix rename is performed first
export const css100RenameMap = [
  ["--salt-container-background", "--salt-container-primary-background"],
  [
    "--salt-container-background-medium",
    "--salt-container-secondary-background",
  ],
  ["--salt-container-background-low", "--salt-container-tertiary-background"],

  ["--salt-editable-background", "--salt-editable-primary-background"],
  ["--salt-editable-background-low", "--salt-editable-primary-background"],
  ["--salt-editable-background-medium", "--salt-editable-secondary-background"],
  ["--salt-editable-background-high", "--salt-editable-tertiary-background"],
  ["--salt-editable-text-color", "--salt-text-primary-foreground"],

  [
    "--salt-selectable-background-selected",
    "--salt-selectable-cta-background-selected",
  ],
  [
    "--salt-selectable-foreground-selected",
    "--salt-selectable-cta-foreground-selected",
  ],

  ["--salt-separable-border-color-1", "--salt-separable-tertiary-borderColor"],

  [
    "--salt-status-info-background-high",
    "--salt-status-info-background-emphasize",
  ],
  [
    "--salt-status-success-background-high",
    "--salt-status-success-background-emphasize",
  ],
  [
    "--salt-status-warning-background-high",
    "--salt-status-warning-background-emphasize",
  ],
  [
    "--salt-status-error-background-high",
    "--salt-status-error-background-emphasize",
  ],

  ["--salt-text-primary-color", "--salt-text-primary-foreground"],
  ["--salt-text-secondary-color", "--salt-text-secondary-foreground"],

  ["--salt-spacing-unit", "--salt-size-unit"],

  ["--salt-color-grey-10", "--salt-color-gray-10"],
  ["--salt-color-grey-20", "--salt-color-gray-20"],
  ["--salt-color-grey-30", "--salt-color-gray-30"],
  ["--salt-color-grey-40", "--salt-color-gray-40"],
  ["--salt-color-grey-50", "--salt-color-gray-50"],
  ["--salt-color-grey-60", "--salt-color-gray-60"],
  ["--salt-color-grey-70", "--salt-color-gray-70"],
  ["--salt-color-grey-80", "--salt-color-gray-80"],
  ["--salt-color-grey-90", "--salt-color-gray-90"],
  ["--salt-color-grey-100", "--salt-color-gray-100"],
  ["--salt-color-grey-200", "--salt-color-gray-200"],
  ["--salt-color-grey-300", "--salt-color-gray-300"],
  ["--salt-color-grey-400", "--salt-color-gray-400"],
  ["--salt-color-grey-500", "--salt-color-gray-500"],
  ["--salt-color-grey-600", "--salt-color-gray-600"],
  ["--salt-color-grey-700", "--salt-color-gray-700"],
  ["--salt-color-grey-800", "--salt-color-gray-800"],
  ["--salt-color-grey-900", "--salt-color-gray-900"],

  ["--salt-zIndex-appheader", "--salt-zIndex-appHeader"],
  ["--salt-zIndex-dragobject", "--salt-zIndex-dragObject"],
  ["--salt-zIndex-contextmenu", "--salt-zIndex-contextMenu"],
  ["--salt-zIndex-tooltip", "--salt-zIndex-flyover"],
];

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
