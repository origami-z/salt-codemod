import _yargs from "yargs";
import { hideBin } from "yargs/helpers";
const yargs = _yargs(hideBin(process.argv));

export const latestSupportedVersion = "1.10.0";

export const parsedArgs = await yargs
  .scriptName("salt-ts-morph")
  .usage("$0 <cmd> [args]")
  .option("tsconfig", {
    default: "tsconfig.json",
    description:
      "React code is modified using ts-morph, which needs a path to your tsconfig.json file.",
  })
  .option("tsSourceGlob", {
    default: "packages/**/*.ts*",
    description:
      "React source glob to be used by ts-morph, which is useful for monorepo where tsconfig is not available at the root.",
  })
  .option("verbose", {
    type: "boolean",
    default: false,
    alias: "v",
    description: "verbose logging",
  })
  .option("organizeImports", {
    type: "boolean",
    default: false,
    description: "When set, organise imports for each TypeScript file",
  })
  .option("dryRun", {
    type: "boolean",
    default: false,
    description: "When set, no file change will be saved.",
  })
  .option("only", {
    type: "string",
    description:
      "When set, only operate on the file matching name. Useful for debugging.",
  })
  .option("mode", {
    type: "string",
    description: `Use this to operate only one sub-section of the codemod needed. i.e. "ts", "css". `,
  })
  .option("from", {
    type: "string",
    description: `Semver of salt-ds you're currently on`,
  })
  .option("to", {
    type: "string",
    description: `Semver of salt-ds you're migrating to. Latest supported is ${latestSupportedVersion}`,
  })
  .help().argv;