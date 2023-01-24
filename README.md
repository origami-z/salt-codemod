Trying to write code mod for converting `@jpmorganchase/uitk-` to `@salt-ds/*`.

## To use

1. Clone this codemod repo, then `yarn install` to get all the dependencies (e.g. `ts-morph`)
2. In your project repo, update `package.json` to use `@salt-ds/*` and install dependencies. The script doesn't support updating `package.json` yet, and it reads `@salt-ds/theme/index.css` for CSS variable verification, so you need to manually install new dependencies.
3. Run `node /path/to/this/repo/index.js`
