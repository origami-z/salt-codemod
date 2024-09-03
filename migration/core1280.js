import { warnRemovedReactAttribute } from "./utils.js";

export function react1280(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.45
  // StepperInput
  warnRemovedReactAttribute(file, {
    elementName: "StepperInput",
    allAttributesRemoved: new Set([
      "liveValue",
      "showRefreshButton",
      "ButtonProps",
      "InputProps",
    ]),
  });
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.45
  // StepperInput
  warnRemovedReactAttribute(file, {
    elementName: "DatePicker",
    allAttributesRemoved: new Set([
      "startDate",
      "endDate",
      "defaultStartDate",
      "defaultEndDate",
    ]),
  });
}

/**
 * @salt-ds/theme@1.16.0
 *
 * https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ftheme%401.16.0
 */
export const css1280RenameMap = [
  ["--salt-status-info-foreground", "--salt-status-info-foreground-decorative"],
  [
    "--salt-status-error-foreground",
    "--salt-status-error-foreground-decorative",
  ],
  [
    "--salt-status-warning-foreground",
    "--salt-status-warning-foreground-decorative",
  ],
  [
    "--salt-status-success-foreground",
    "--salt-status-success-foreground-decorative",
  ],
  [
    "--salt-palette-info-foreground",
    "--salt-palette-info-foreground-decorative",
  ],
  [
    "--salt-palette-error-foreground",
    "--salt-palette-error-foreground-decorative",
  ],
  [
    "--salt-palette-warning-foreground",
    "--salt-palette-warning-foreground-decorative",
  ],
  [
    "--salt-palette-success-foreground",
    "--salt-palette-success-foreground-decorative",
  ],
];
