Code mod for [Salt Design System](http://www.saltdesignsystem.com) packages, features include

- Upgrade `@salt-ds/*` to latest version
- React props migration due to deprecation, or warning when not possible
- Import statement updates due to components being moved from lab to core
- CSS variable renames due to deprecation
- Warn invalid Salt CSS variables

```
npx salt-codemod --dryRun
```

## Options

Use `--help` to see all available options.

The script will first attempt to upgrade all `@salt-ds/*` packages using [`npm-check-updates`](https://www.npmjs.com/package/npm-check-updates). You can skip it via `--skipUpgrade`.

JavaScript files are included based on `tsConfig.json` using [`ts-morph`](https://www.npmjs.com/package/ts-morph), which can be cusmised via `--tsconfig "./another/path/tsConfig.json"`. You may override this entirely and provide files by `--tsSourceGlob`, which may help in a monorepo setup.

Invalid CSS variables are extracted from `@salt-ds/theme/index.css`, which path can be changed using `--themeCss`. By default all `*.css|ts|tsx` will be included for scanning and processing, you can change it using `--cssModeGlob`.

There is `--mode` option available if you just want to run React or CSS part of the codemod.

## Experimental Features

### FormField Migration (`--migrateFormControls`)

This experimental feature migrates `FormField` components from `@salt-ds/lab` to `@salt-ds/core`. It transforms the `label` and `helperText` props into child elements.

```bash
npx salt-codemod --migrateFormControls
```

**Before:**
```jsx
import { FormField } from "@salt-ds/lab";

<FormField label="Username" helperText="Enter your username">
  <Input />
</FormField>
```

**After:**
```jsx
import { FormField, FormFieldLabel, FormFieldHelperText } from "@salt-ds/core";

<FormField>
  <FormFieldLabel>Username</FormFieldLabel>
  <Input />
  <FormFieldHelperText>Enter your username</FormFieldHelperText>
</FormField>
```

The migration handles:
- String literal props (`label="Name"`)
- JSX expression props (`label={variable}`, `label={getLabel()}`)
- Template literals (`label={\`Hello ${name}\`}`)
- Conditional expressions (`label={isRequired ? "Required" : "Optional"}`)
- Aliased imports (`import { FormField as FF }`)
- Multiple FormField instances in the same file
- Nested FormField components

**Note:** This feature is off by default. Enable it with `--migrateFormControls`.

## Supported Versions

This codemod currently supports @salt-ds/core versions **1.0.0 through 1.54.2**.

## Adding Support for New Versions

To add support for newer @salt-ds versions, follow these steps:

### 1. Update Version Constant
Update `LATEST_SUPPORTED_VERSION` in `utils/args.js`:
```javascript
export const LATEST_SUPPORTED_VERSION = "1.XX.0";
```

### 2. Create Migration File
Create a new migration file `migration/coreXXXX.js` (e.g., `core1540.js` for v1.54.0):
```javascript
import { moveNamedImports } from "./utils.js";

// MMM DD, YYYY (use npm publish date)
export function reactXXXX(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%40X.XX.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%40X.X.X-alpha.XX

  // Component migrations (if any)
  ["ComponentName", "ComponentNameProps"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}

// CSS migrations (if any)
export const cssXXXXRenameMap = [
  ["--old-variable", "--new-variable"],
];
```

**Getting the correct publish date:**
```bash
npm view @salt-ds/core@X.XX.0 time.X.XX.0
```

### 3. Update index.js

Add imports:
```javascript
import { reactXXXX, cssXXXXRenameMap } from "./migration/coreXXXX.js";
```

Add version constant:
```javascript
const vXXXX = parse("X.XX.0");
```

Add React migration logic (around line 204-318):
```javascript
if (gt(vXXXX, fromVersion) && lte(vXXXX, toVersion)) {
  reactXXXX(file);
}
```

Add CSS migration logic (around line 377-415, if CSS changes exist):
```javascript
if (gt(vXXXX, fromVersion) && lte(vXXXX, toVersion)) {
  cssMigrationMapArray.push(...cssXXXXRenameMap);
}
```

### 4. Add Tests
Add smoke tests in `__tests__/smoke.spec.js`:
```javascript
import { reactXXXX } from "../migration/coreXXXX";

test("reactXXXX", () => {
  const file = createFileWithContent(`import { Component } from "@salt-ds/lab";
    export const App = () => <Component />;
  `);
  reactXXXX(file);
  expect(file.getText().includes(`from "@salt-ds/core"`)).toBeTruthy();
});
```

### 5. Create Changeset
```bash
npx changeset
```
Select "minor" and describe: "Supports upto @salt-ds/core@X.XX.0"

### 6. Run Tests
```bash
npm test
```

## Key Migration Patterns

### Moving Components from Lab to Core
```javascript
moveNamedImports(file, {
  namedImportText: "ComponentName",
  from: "@salt-ds/lab",
  to: "@salt-ds/core",
});
```

### Renaming Components
```javascript
for (const declaration of file.getImportDeclarations()) {
  renameNamedImports(declaration, {
    moduleSpecifier: "@salt-ds/core",
    from: "OldName",
    to: "NewName",
  });
}
```

### Replacing Props
```javascript
replaceReactAttribute(file, {
  elementName: "Button",
  attributeFrom: "variant",
  valueFrom: `"cta"`,
  attributeTo: "sentiment",
  valueTo: `"accented"`,
});
```

### Moving Props to Child Elements
```javascript
movePropToNewChildElement(file, {
  packageName: "@salt-ds/lab",
  elementName: "FormField",
  propName: "label",
  newChildName: "FormFieldLabel",
  newChildPackageName: "@salt-ds/core",
});
```

This transforms `<FormField label="Name">` into:
```jsx
<FormField>
  <FormFieldLabel>Name</FormFieldLabel>
</FormField>
```

### CSS Variable Renames
Theme package CSS variable changes are tracked separately. Check:
```bash
npm view @salt-ds/theme time --json | grep -E '"X\.XX\.0"'
```

## Resources

- [Salt DS Releases](https://github.com/jpmorganchase/salt-ds/releases)
- [Salt DS Core Changelog](https://github.com/jpmorganchase/salt-ds/blob/main/packages/core/CHANGELOG.md)
- [Salt DS Lab Changelog](https://github.com/jpmorganchase/salt-ds/blob/main/packages/lab/CHANGELOG.md)
- [Salt DS Theme Changelog](https://github.com/jpmorganchase/salt-ds/blob/main/packages/theme/CHANGELOG.md)

## Local development

`yarn` to install all dependencies.

Run `npm link` in the root folder, then you'll able to run `salt-codemod` as if it's a command. `npm unlink` to undo.
