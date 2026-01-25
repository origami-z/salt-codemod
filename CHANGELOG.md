# salt-codemod

## 0.1.0-alpha.5

### Minor Changes

- 4d243d5: Add --migrateFormControls CLI flag for experimental FormField migration

  - Adds `movePropToNewChildElement` utility function to migrate JSX props to child elements
  - Adds `formControls` migration to transform FormField from @salt-ds/lab to @salt-ds/core
    - Moves `label` prop to `<FormFieldLabel>` child element
    - Moves `helperText` prop to `<FormFieldHelperText>` child element
    - Migrates FormField import from @salt-ds/lab to @salt-ds/core
  - Feature is off by default, enable with `--migrateFormControls` flag

- 6357671: Supports upto @salt-ds/core@1.54.2
- 35ca1ad: Support CSS variable validation from theme-next.css when SaltProviderNext is detected in the codebase. This prevents false errors for variables defined in theme-next.css.

## 0.1.0-alpha.4

### Patch Changes

- fadcafa: Move `@changesets/cli` to dev dependency

## 0.1.0-alpha.3

### Minor Changes

- 8a5c7a4: Supports upto @salt-ds/core@1.39.0

## 0.1.0-alpha.2

### Patch Changes

- 26c8707: Changed logic so when `tsSourceGlob` is provided, `tsconifg` option is ignored
- 26c8707: Use terminal width for yargs

## 0.1.0-alpha.1

### Patch Changes

- 85745e1: Improve logs around element attribute, package upgrade info
- 85745e1: Fix upgrade package dryRun logic
- 85745e1: - Replaced theme file lookup to the new `--themeCss` option instead of rely on `resolve-package-path`.
  - Added `--cssModeGlob` option to control CSS mode operation area.

## 0.1.0-alpha.0

### Minor Changes

- 0fb4e65: Test npm publish
