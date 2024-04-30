// https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.21.0

export function react1210(file) {
  [
    "Dropdown",
    "DropdownProps",
    "ComboBox",
    "ComboBoxProps",
    "Option",
    "OptionProps",
    "OptionGroup",
    "OptionGroupProps",
  ].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}
