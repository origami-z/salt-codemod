// https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.20.0

export function react1200(file) {
  [
    "Dialog",
    "DialogProps",
    "DialogHeader",
    "DialogHeaderProps",
    "DialogContent",
    "DialogContent",
    "DialogContentProps",
    "DialogActions",
    "DialogActionsProps",
    "DialogCloseButton",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
