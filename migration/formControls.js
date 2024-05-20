import { movePropToNewChildElement } from "./utils.js";

export function formControls(file) {
  movePropToNewChildElement(file, {
    packageName: "@salt-ds/lab",
    elementName: "FormField",
    propName: "label",
    newChildName: "FormFieldLabel",
    newChildPackageName: "@salt-ds/core",
  });

  movePropToNewChildElement(file, {
    packageName: "@salt-ds/lab",
    elementName: "FormField",
    propName: "helperText",
    newChildName: "FormFieldHelperText",
    newChildPackageName: "@salt-ds/core",
  });

  ["FormField"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });

  // TODO: add warning to not supported props
}
