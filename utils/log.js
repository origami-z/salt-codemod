import { parsedArgs } from "./args.js";
import chalk from "chalk";

const { verbose, dryRun } = parsedArgs;

export function verboseOnlyDimLog(...data) {
  (verbose || dryRun) && console.log(chalk.dim(...data));
}

export function verboseOnlyLog(...data) {
  (verbose || dryRun) && console.log(...data);
}

export function verboseOnlyBoldLog(...data) {
  (verbose || dryRun) && console.log(chalk.bold(...data));
}
