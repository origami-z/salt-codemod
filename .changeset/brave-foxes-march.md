---
"salt-codemod": minor
---

Add --migrateFormControls CLI flag for experimental FormField migration

- Adds `movePropToNewChildElement` utility function to migrate JSX props to child elements
- Adds `formControls` migration to transform FormField from @salt-ds/lab to @salt-ds/core
  - Moves `label` prop to `<FormFieldLabel>` child element
  - Moves `helperText` prop to `<FormFieldHelperText>` child element
  - Migrates FormField import from @salt-ds/lab to @salt-ds/core
- Feature is off by default, enable with `--migrateFormControls` flag
