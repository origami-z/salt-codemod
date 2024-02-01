import { warnRemovedReactAttribute } from "./utils.js";

export function react1130(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.25
  // FileDropZone
  warnRemovedReactAttribute(file, {
    elementName: "FileDropZone",
    allAttributesRemoved: new Set([
      "onFilesAccepted",
      "onFilesRejected",
      "validate",
    ]),
  });

  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.26
  // PillNext
  warnRemovedReactAttribute(file, {
    elementName: "PillNext",
    allAttributesRemoved: new Set(["onClose", "icon"]),
  });

  // Pagination
  warnRemovedReactAttribute(file, {
    elementName: "Pagination",
    allAttributesRemoved: new Set([
      "compact",
      "showPreviousNext",
      "FormFieldProps",
    ]),
  });

  // GoToInput
  warnRemovedReactAttribute(file, {
    elementName: "GoToInput",
    allAttributesRemoved: new Set(["FormFieldProps"]),
  });
}
