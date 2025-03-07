// Release note: https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.12.0

import { moveNamedImports } from "./utils.js";

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
export function react1120(file) {
  // Components / Types moved from lab to core
  ["Badge", "BadgeProps"].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );
}

/**
 * @salt-ds/theme@1.10.0 changes
 */
export const css1120RenameMap = [
  // // Characteristics
  // text-* to content
  ["--salt-text-link-foreground-hover", "--salt-content-foreground-hover"],
  ["--salt-text-link-foreground-active", "--salt-content-foreground-active"],
  ["--salt-text-link-foreground-visited", "--salt-content-foreground-visited"],

  ["--salt-text-primary-foreground", "--salt-content-primary-foreground"],
  [
    "--salt-text-primary-foreground-disabled",
    "--salt-content-primary-foreground-disabled",
  ],
  ["--salt-text-secondary-foreground", "--salt-content-secondary-foreground"],
  [
    "--salt-text-secondary-foreground-disabled",
    "--salt-content-secondary-foreground-disabled",
  ],

  ["--salt-text-background-selected", "--salt-content-foreground-highlight"],

  // actionable to text-action
  ["--salt-actionable-cta-fontWeight", "--salt-text-action-fontWeight"],
  ["--salt-actionable-primary-fontWeight", "--salt-text-action-fontWeight"],
  ["--salt-actionable-secondary-fontWeight", "--salt-text-action-fontWeight"],
  ["--salt-actionable-letterSpacing", "--salt-text-action-letterSpacing"],
  ["--salt-actionable-textTransform", "--salt-text-action-textTransform"],
  ["--salt-actionable-textAlign", "--salt-text-action-textAlign"],

  // selectable to various others
  [
    "--salt-selectable-primary-foreground-selected",
    "--salt-actionable-primary-foreground-active",
  ],
  [
    "--salt-selectable-primary-foreground-selectedDisabled",
    "--salt-color-white-fade-foreground",
  ],
  [
    "--salt-selectable-primary-background",
    "--salt-palette-interact-background",
  ],
  [
    "--salt-selectable-primary-background-disabled",
    "--salt-palette-interact-background-disabled",
  ],
  [
    "--salt-selectable-primary-background-hover",
    "--salt-palette-interact-primary-background-hover",
  ],
  [
    "--salt-selectable-primary-background-selected",
    "--salt-palette-interact-primary-background-active",
  ],
  [
    "--salt-selectable-primary-background-selectedDisabled",
    "--salt-palette-interact-primary-background-activeDisabled",
  ],
  [
    "--salt-selectable-secondary-foreground-hover",
    "--salt-palette-interact-secondary-foreground-hover",
  ],
  [
    "--salt-selectable-secondary-foreground-selected",
    "--salt-palette-interact-secondary-foreground-active",
  ],
  [
    "--salt-selectable-secondary-foreground-selectedDisabled",
    "--salt-palette-interact-secondary-foreground-activeDisabled",
  ],
  [
    "--salt-selectable-secondary-background",
    "--salt-palette-interact-background",
  ],
  [
    "--salt-selectable-secondary-background-disabled",
    "--salt-palette-interact-background-disabled",
  ],
  [
    "--salt-selectable-secondary-background-hover",
    "--salt-palette-interact-secondary-background-hover",
  ],
  [
    "--salt-selectable-secondary-background-selected",
    "--salt-palette-interact-secondary-background-active",
  ],
  [
    "--salt-selectable-secondary-background-selectedDisabled",
    "--salt-palette-interact-secondary-background-activeDisabled",
  ],

  // track to various others
  ["--salt-track-borderWidth", "--salt-size-border-strong"],
  ["--salt-track-borderWidth-active", "--salt-size-border-strong"],
  ["--salt-track-borderWidth-complete", "--salt-size-border-strong"],
  ["--salt-track-borderWidth-incomplete", "--salt-size-border-strong"],
  // Undeprecate in @salt-ds/lab@1.0.0-alpha.31
  // ["--salt-track-borderColor", "--salt-palette-neutral-secondary-border"],

  // Miscellaneous
  [
    "--salt-overlayable-shadow-borderRegion",
    "--salt-overlayable-shadow-region",
  ],
  ["--salt-text-link-textDecoration", "--salt-navigable-textDecoration"],
  [
    "--salt-text-link-textDecoration-hover",
    "--salt-navigable-textDecoration-hover",
  ],
  [
    "--salt-text-link-textDecoration-selected",
    "--salt-navigable-textDecoration-selected",
  ],
  [
    "--salt-navigable-primary-background-hover",
    "--salt-navigable-background-hover",
  ],
  ["--salt-accent-fontWeight", "--salt-text-notation-fontWeight"],
  ["--salt-accent-fontSize", "--salt-text-notation-fontSize"],
  ["--salt-accent-lineHeight", "--salt-text-notation-lineHeight"],

  // Deprecated ones
  ["--salt-taggable-cursor-hover", "pointer"],
  ["--salt-taggable-cursor-active", "pointer"],
  ["--salt-taggable-cursor-disabled", "not-allowed"],

  ["--salt-taggable-background", "rgb(197, 201, 208)"], // Assume in light mode, rgb(76, 80, 91) in dark mode
  ["--salt-taggable-background-hover", "rgb(217, 221, 227)"], // Assume in light mode, rgb(97, 101, 110) in dark mode
  [
    "--salt-taggable-background-active",
    "--salt-palette-interact-primary-background-active",
  ], //  Use rgb(97, 101, 110) in light mode, rgb(180, 183, 190) in dark mode
  [
    "--salt-taggable-background-disabled",
    "--salt-palette-interact-primary-background-disabled",
  ], // Use rgba(197, 201, 208, 0.4) in light mode, rgba(76, 80, 91, 0.4) in dark mode

  ["--salt-taggable-foreground", "rgb(255, 255, 255)"],
  ["--salt-taggable-foreground-hover", "rgb(255, 255, 255)"],
  ["--salt-taggable-foreground-active", "rgb(22, 22, 22)"],
  ["--salt-taggable-foreground-disabled", "rgba(255, 255, 255, 0.4)"],

  ["--salt-navigable-primary-background", "transparent"],
  ["--salt-navigable-primary-background-active", "transparent"],
  ["--salt-navigable-secondary-background", "transparent"],
  ["--salt-navigable-secondary-background-hover", "rgb(76, 80, 91)"], // Assume in light mode, rgb(47, 49, 54) in dark mode
  ["--salt-navigable-secondary-background-active", "transparent"],
  ["--salt-navigable-tertiary-background", "transparent"],
  ["--salt-navigable-tertiary-background-hover", "rgb(234, 237, 239)"], // Assume in light mode,  rgb(42, 44, 47) in dark mode
  ["--salt-navigable-tertiary-background-active", "transparent"],

  ["--salt-navigable-indicator-activeDisabled", "rgba(224, 101, 25, 0.4)"], // Assume in light mode, rgba(238, 133, 43, 0.4) in dark mode

  ["--salt-accent-foreground-disabled", "rgba(255, 255, 255, 0.4)"],
  // ["--salt-accent-background-disabled", "rgba(38, 112, 169, 0.4)"], // Undeprecate in https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ftheme%401.23.3
  [
    "--salt-accent-borderColor-disabled",
    "--salt-container-primary-borderColor-disabled",
  ],

  ["--salt-track-fontWeight", "--salt-typography-fontWeight-semiBold"],
  ["--salt-track-textAlign", "center"],

  ["--salt-track-background", "rgb(197, 201, 208)"], // Assume in light mode, rgb(76, 80, 91); in dark mode
  ["--salt-track-background-disabled", "rgba(197, 201, 208,0.4)"], // Assume in light mode, rgba(76, 80, 91,0.4) in dark mode

  ["--salt-track-borderColor-disabled", "rgba(132, 135, 142, 0.4)"],

  ["--salt-selectable-cta-foreground-hover", "rgb(255, 255, 255)"],
  ["--salt-selectable-cta-foreground-selected", "rgb(255, 255, 255)"],
  [
    "--salt-selectable-cta-foreground-selectedDisabled",
    "rgba(255, 255, 255,0.4)",
  ],

  ["--salt-selectable-cta-background", "transparent"],
  ["--salt-selectable-cta-background-disabled", "transparent"],
  ["--salt-selectable-cta-background-hover", "rgb(203, 231, 249)"], // Assume in light mode, rgb(39, 60, 77) in dark mode
  ["--salt-selectable-cta-background-selected", "rgb(164, 213, 244)"], // Assume in light mode, rgb(0, 71, 123) in dark mode
  [
    "--salt-selectable-cta-background-selectedDisabled",
    "rgba(164, 213, 244, 0.4)",
  ], // Assume in light mode,rgba(0, 71, 123, 0.4) in dark mode
  ["--salt-selectable-primary-foreground-hover", "rgb(38, 112, 169)"],

  ["--salt-container-tertiary-background", "transparent"],
  ["--salt-container-tertiary-background-disabled", "transparent"],
  ["--salt-container-tertiary-borderColor", "transparent"],
  ["--salt-container-tertiary-borderColor-disabled", "transparent"],

  // // Foundation
  ["--salt-icon-size-base", "--salt-size-icon"],
  ["--salt-icon-size-status-adornment", "--salt-size-adornment"],

  ["--salt-shadow-1", "--salt-shadow-100"],
  ["--salt-shadow-2", "--salt-shadow-200"],
  ["--salt-shadow-3", "--salt-shadow-300"],
  ["--salt-shadow-4", "--salt-shadow-400"],
  ["--salt-shadow-5", "--salt-shadow-500"],

  ["--salt-shadow-1-color", "--salt-shadow-100-color"],
  ["--salt-shadow-2-color", "--salt-shadow-200-color"],
  ["--salt-shadow-3-color", "--salt-shadow-300-color"],
  ["--salt-shadow-4-color", "--salt-shadow-400-color"],
  ["--salt-shadow-5-color", "--salt-shadow-500-color"],

  [
    "--salt-palette-navigate-primary-background-hover",
    "--salt-palette-navigate-background-hover",
  ],

  // deprecated
  ["--salt-shadow-0", "none"],

  // // Palette

  ["--salt-palette-navigate-primary-background", "transparent"],
  ["--salt-palette-navigate-primary-background-active", "transparent"],
  ["--salt-palette-navigate-secondary-background", "transparent"],
  [
    "--salt-palette-navigate-secondary-background-hover",
    "--salt-color-gray-30",
  ], // Assume in light mode, --salt-color-gray-600 in dark mode
  ["--salt-palette-navigate-secondary-background-active", "transparent"],
  ["--salt-palette-navigate-tertiary-background", "transparent"],
  ["--salt-palette-navigate-tertiary-background-hover", "--salt-color-gray-20"], // Assume in light mode, --salt-color-gray-700 in dark mode
  ["--salt-palette-navigate-tertiary-background-active", "transparent"],

  [
    "--salt-palette-navigate-indicator-activeDisabled",
    "--salt-color-orange-600-fade-border",
  ], // Assume in light mode, --salt-color-orange-400-fade-border in dark mode

  // Undeprecated : https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ftheme%401.21.0
  // ["--salt-palette-neutral-tertiary-background", "transparent"],
  // ["--salt-palette-neutral-tertiary-background-disabled", "transparent"],
  // ["--salt-palette-neutral-tertiary-border", "transparent"],
  // ["--salt-palette-neutral-tertiary-border-disabled", "transparent"],

  ["--salt-palette-track-border", "--salt-color-gray-90"],
  ["--salt-palette-track-border-disabled", "--salt-color-gray-90-fade-border"],

  ["--salt-palette-track-background", "--salt-color-gray-60"], // Assume in light mode, --salt-color-gray-300 in dark mode
  [
    "--salt-palette-track-background-disabled",
    "--salt-color-gray-60-fade-border",
  ], // Assume in light mode, --salt-color-gray-300-fade-border in dark mode

  [
    "--salt-palette-interact-cta-foreground-activeDisabled",
    "--salt-color-white-fade-foreground",
  ],
  [
    "--salt-palette-interact-cta-background-activeDisabled",
    "--salt-color-blue-700-fade-background",
  ],

  [
    "--salt-palette-interact-primary-foreground-activeDisabled",
    "--salt-color-white-fade-foreground",
  ], // Assume in light mode, --salt-color-gray-900-fade-foreground in dark mode
  [
    "--salt-palette-interact-primary-background-activeDisabled",
    "--salt-color-gray-200-fade-background",
  ], // Assume in light mode, --salt-color-gray-70-fade-background in dark mode

  [
    "--salt-palette-interact-secondary-foreground-activeDisabled",
    "--salt-color-white-fade-foreground",
  ], // Assume in light mode, --salt-color-gray-900-fade-foreground in dark mode
  [
    "--salt-palette-interact-secondary-background-activeDisabled",
    "--salt-color-gray-200-fade-background",
  ], // Assume in light mode, --salt-color-gray-70-fade-background in dark mode

  [
    "--salt-palette-accent-foreground-disabled",
    "--salt-color-white-fade-foreground",
  ],
  [
    "--salt-palette-accent-background-disabled",
    "--salt-color-blue-500-fade-background",
  ],
  [
    "--salt-palette-accent-border-disabled",
    "--salt-color-blue-500-fade-border",
  ],
];
