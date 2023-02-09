Trying to write code mod for converting `@jpmorganchase/uitk-` to `@salt-ds/*`.

## To use

1. Clone this codemod repo, then `yarn install` to get all the dependencies (e.g. `ts-morph`)
2. In your project repo, update `package.json` to use `@salt-ds/*` and install dependencies (Refer to [these lines](https://github.com/origami-z/salt-codemod/blob/f974c4d16a1000248ea16b86c8970924aea33103/index.js#L79-L99) for package name mapping). The script doesn't support updating `package.json` yet, and it reads `@salt-ds/theme/index.css` for CSS variable verification, so you need to manually install new dependencies.
3. Run `node /path/to/this/repo/index.js`

Use `--help` to see all available flags. e.g. if you want to migrate from v1.0.0 to v1.1.0, then do `--from 1.0.0 --to 1.1.0`
