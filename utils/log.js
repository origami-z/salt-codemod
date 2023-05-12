import { parsedArgs } from "./args.js";

const { verbose, dryRun } = parsedArgs;

export function verboseOnlyLog(...data) {
  (verbose || dryRun) && console.log(...data);
}
