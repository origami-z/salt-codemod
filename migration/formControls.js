import { movePropToNewChildElement, moveNamedImports } from "./utils.js";

/**
 * Migrate FormField component from @salt-ds/lab to @salt-ds/core.
 * This migration:
 * - Moves the `label` prop to a FormFieldLabel child element
 * - Moves the `helperText` prop to a FormFieldHelperText child element
 * - Moves the FormField import from @salt-ds/lab to @salt-ds/core
 *
 * @param {import("ts-morph").SourceFile} file - The source file to migrate
 * @returns {void}
 *
 * @example
 * // Before:
 * import { FormField } from "@salt-ds/lab";
 * <FormField label="Name" helperText="Enter your name">
 *   <Input />
 * </FormField>
 *
 * // After:
 * import { FormField, FormFieldLabel, FormFieldHelperText } from "@salt-ds/core";
 * <FormField>
 *   <FormFieldLabel>Name</FormFieldLabel>
 *   <Input />
 *   <FormFieldHelperText>Enter your name</FormFieldHelperText>
 * </FormField>
 */
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
