import {
  renameNamedImports,
  moveNamedImports,
  warnRemovedReactAttribute,
} from "./utils.js";

// Jan 14
export function react1380(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.58
  // SkipLink
  warnRemovedReactAttribute(file, {
    elementName: "SkipLink",
    allAttributesRemoved: new Set(["targetRef"]),
  });

  // TODO: SteppedTracker: https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.58
  // <SteppedTracker activeStep={0}>
  //   <TrackerStep>
  //   <StepLabel>Step One</StepLabel>
  // </TrackerStep>
  // After
  // <SteppedTracker>
  //   <Step label="Step One" stage="active" />
  // </SteppedTracker>
}

/**
 * https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ftheme%401.24.0
 */
export const css1380RenameMap = [
  ["--salt-palette-foreground-active", "--salt-palette-accent-stronger"],
  ["--salt-palette-foreground-hover", "--salt-palette-accent-strong"],
];
