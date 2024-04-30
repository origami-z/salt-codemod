import _yargs from "yargs";
import { hideBin } from "yargs/helpers";
const yargs = _yargs(hideBin(process.argv));

export const LATEST_SUPPORTED_VERSION = "1.18.0";
export const DEFAULT_FROM_VERSION = "1.0.0";

export const parsedArgs = await yargs
  .scriptName("salt-ts-morph")
  .version(LATEST_SUPPORTED_VERSION)
  .alias("version", "v")
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
    alias: "n",
    default: false,
    description:
      "When set, no file change will be saved but only logging to console.",
  })
  .option("file", {
    type: "string",
    description:
      "When set, only operate on the file matching name, after glob filtering. Useful for debugging.",
  })
  .option("mode", {
    type: "string",
    description: `Use this to operate only one sub-section of the codemod needed. i.e. "ts", "css". `,
  })
  .option("from", {
    type: "string",
    alias: "f",
    default: DEFAULT_FROM_VERSION,
    description: `Semver of @salt-ds/core package you're currently on.`,
  })
  .option("to", {
    type: "string",
    alias: "t",
    description: `Semver of @salt-ds/core package you're migrating to. Latest supported is ${LATEST_SUPPORTED_VERSION}.`,
  })
  .help()
  .alias("help", "h").argv;
