import { warnRemovedReactAttribute, replaceReactAttribute } from "./utils.js";

export function react1360(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.36.0
  // Button
  replaceReactAttribute(file, {
    elementName: "Button",
    attributeFrom: "variant",
    valueFrom: `"cta"`,
    attributeTo: "sentiment",
    valueTo: `"accented"`,
  });
  replaceReactAttribute(file, {
    elementName: "Button",
    attributeFrom: "variant",
    valueFrom: `"primary"`,
    attributeTo: "sentiment",
    valueTo: `"neutral"`,
  });
  replaceReactAttribute(file, {
    elementName: "Button",
    attributeFrom: "variant",
    valueFrom: `"secondary"`,
    attributeTo: "appearance",
    valueTo: `"transparent"`,
  });

  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.52
  // Slider
  warnRemovedReactAttribute(file, {
    elementName: "Slider",
    allAttributesRemoved: new Set([
      "pageStep",
      "pushable",
      "pushDistance",
      "disabled",
      "hideMarks",
    ]),
  });
}

// https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ftheme%401.22.0
export const css1360RenameMap = [
  [
    `--salt-actionable-cta-background-active`,
    `--salt-actionable-accented-bold-background-active`,
  ],
  [
    `--salt-actionable-cta-background-disabled`,
    `--salt-actionable-accented-bold-background-disabled`,
  ],
  [
    `--salt-actionable-cta-background-hover`,
    `--salt-actionable-accented-bold-background-hover`,
  ],
  [
    `--salt-actionable-cta-background`,
    `--salt-actionable-accented-bold-background`,
  ],
  [
    `--salt-actionable-cta-borderColor-active`,
    `--salt-actionable-accented-bold-borderColor-active`,
  ],
  [
    `--salt-actionable-cta-borderColor-disabled`,
    `--salt-actionable-accented-bold-borderColor-disabled`,
  ],
  [
    `--salt-actionable-cta-borderColor-hover`,
    `--salt-actionable-accented-bold-borderColor-hover`,
  ],
  [
    `--salt-actionable-cta-borderColor`,
    `--salt-actionable-accented-bold-borderColor`,
  ],
  [
    `--salt-actionable-cta-foreground-active`,
    `--salt-actionable-accented-bold-foreground-active`,
  ],
  [
    `--salt-actionable-cta-foreground-disabled`,
    `--salt-actionable-accented-bold-foreground-disabled`,
  ],
  [
    `--salt-actionable-cta-foreground-hover`,
    `--salt-actionable-accented-bold-foreground-hover`,
  ],
  [
    `--salt-actionable-cta-foreground`,
    `--salt-actionable-accented-bold-foreground`,
  ],
  [
    `--salt-actionable-primary-background-active`,
    `--salt-actionable-bold-background-active`,
  ],
  [
    `--salt-actionable-primary-background-disabled`,
    `--salt-actionable-bold-background-disabled`,
  ],
  [
    `--salt-actionable-primary-background-hover`,
    `--salt-actionable-bold-background-hover`,
  ],
  [`--salt-actionable-primary-background`, `--salt-actionable-bold-background`],
  [
    `--salt-actionable-primary-borderColor-active`,
    `--salt-actionable-bold-borderColor-active`,
  ],
  [
    `--salt-actionable-primary-borderColor-disabled`,
    `--salt-actionable-bold-borderColor-disabled`,
  ],
  [
    `--salt-actionable-primary-borderColor-hover`,
    `--salt-actionable-bold-borderColor-hover`,
  ],
  [
    `--salt-actionable-primary-borderColor`,
    `--salt-actionable-bold-borderColor`,
  ],
  [
    `--salt-actionable-primary-foreground-active`,
    `--salt-actionable-bold-foreground-active`,
  ],
  [
    `--salt-actionable-primary-foreground-disabled`,
    `--salt-actionable-bold-foreground-disabled`,
  ],
  [
    `--salt-actionable-primary-foreground-hover`,
    `--salt-actionable-bold-foreground-hover`,
  ],
  [`--salt-actionable-primary-foreground`, `--salt-actionable-bold-foreground`],
  [
    `--salt-actionable-secondary-background-active`,
    `--salt-actionable-subtle-background-active`,
  ],
  [
    `--salt-actionable-secondary-background-disabled`,
    `--salt-actionable-subtle-background-disabled`,
  ],
  [
    `--salt-actionable-secondary-background-hover`,
    `--salt-actionable-subtle-background-hover`,
  ],
  [
    `--salt-actionable-secondary-background`,
    `--salt-actionable-subtle-background`,
  ],
  [
    `--salt-actionable-secondary-borderColor-active`,
    `--salt-actionable-subtle-borderColor-active`,
  ],
  [
    `--salt-actionable-secondary-borderColor-disabled`,
    `--salt-actionable-subtle-borderColor-disabled`,
  ],
  [
    `--salt-actionable-secondary-borderColor-hover`,
    `--salt-actionable-subtle-borderColor-hover`,
  ],
  [
    `--salt-actionable-secondary-borderColor`,
    `--salt-actionable-subtle-borderColor`,
  ],
  [
    `--salt-actionable-secondary-foreground-active`,
    `--salt-actionable-subtle-foreground-active`,
  ],
  [
    `--salt-actionable-secondary-foreground-disabled`,
    `--salt-actionable-subtle-foreground-disabled`,
  ],
  [
    `--salt-actionable-secondary-foreground-hover`,
    `--salt-actionable-subtle-foreground-hover`,
  ],
  [
    `--salt-actionable-secondary-foreground`,
    `--salt-actionable-subtle-foreground`,
  ],
];
