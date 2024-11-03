Code mod for [Salt Design System](http://www.saltdesignsystem.com) packages `@salt-ds/*`.

- React props migration due to deprecation, or warning when not possible
- import statement updates due to components being moved from lab to core
- CSS variable renames due to deprecation

```
npx salt-codemod --dryRun
```

Use `--help` to see all available flags. e.g. if you want to migrate from v1.0.0 to v1.1.0, then do `--from 1.0.0 --to 1.1.0`

Note: TypeScript conversion will automatically pick up `tsconfig.json` at the current folder. If you're using monorepo without a tsconfig at the root, could opt to use `--tsSourceGlob` instead.

PS: For local development, run `npm link` in the root folder, then you'll able to run `salt-codemod` as if it's a command. `npm unlink` to undo.
