import { moveNamedImports } from "./utils.js";

export function react1160(file) {
  [
    "FileDropZone",
    "FileDropZoneProps",
    "FileDropZoneIcon",
    "FileDropZoneTrigger",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
