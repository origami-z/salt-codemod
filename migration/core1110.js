// Release note: https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.11.0

import { moveNamedImports, replaceReactAttribute } from "./utils.js";

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
export function react1110(file) {
  // Components / Types moved from lab to core
  ["Switch", "SwitchProps"].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );

  // `default` is deprecated in favour of `medium`
  replaceReactAttribute(file, {
    elementName: "Spinner",
    attributeFrom: "size",
    valueFrom: `"default"`,
    attributeTo: "size",
    valueTo: `"medium"`,
  });
}
