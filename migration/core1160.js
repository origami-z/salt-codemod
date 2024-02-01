import { moveNamedImports } from "./utils.js";

export function react1160(file) {
  moveNamedImports(file, {
    namedImportText: "FileDropZone",
    from: "@salt-ds/lab",
    to: "@salt-ds/core",
  });
}
