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

## Local development

`yarn` to install all dependencies.

Run `npm link` in the root folder, then you'll able to run `salt-codemod` as if it's a command. `npm unlink` to undo.
