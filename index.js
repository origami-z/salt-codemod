#!/usr/bin/env node

import glob from "fast-glob";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import process from "process";
import resolvePackagePath from "resolve-package-path";
import { gt, lte, parse } from "semver";
import { Project } from "ts-morph";
import { css100RenameMap, react100 } from "./migration/core100.js";
import { react110 } from "./migration/core110.js";
import { react1110 } from "./migration/core1110.js";
import { react120 } from "./migration/core120.js";
import { css130RenameMap, react130 } from "./migration/core130.js";
import { css140RenameMap } from "./migration/core140.js";
import { react150 } from "./migration/core150.js";
import { css160RenameMap, react160 } from "./migration/core160.js";
import { react180 } from "./migration/core180.js";
import { css182RenameMap } from "./migration/core182.js";
import {
  getCssRenameCheckRegex,
  migrateCssVar,
  warnUnknownSaltThemeVars,
} from "./migration/utils.js";
import { latestSupportedVersion, parsedArgs } from "./utils/args.js";
import { verboseOnlyDimLog } from "./utils/log.js";
import { css1120RenameMap, react1120 } from "./migration/core1120.js";

const {
  tsconfig,
  tsSourceGlob,
  verbose,
  organizeImports,
  dryRun,
  only,
  mode,
  from: fromInput,
  to: toInput,
} = parsedArgs;

const v100 = parse("1.0.0");
const v110 = parse("1.1.0");
const v120 = parse("1.2.0");
const v130 = parse("1.3.0");
const v140 = parse("1.4.0");
const v150 = parse("1.5.0");
const v160 = parse("1.6.0");
// nothing needed for 1.7.0
const v180 = parse("1.8.0");
const v182 = parse("1.8.2");
// nothing needed for 1.9.0
// nothing needed for 1.10.0
const v1110 = parse("1.11.0");
const v1120 = parse("1.12.0");
// NOTE: don't forget to modify `latestSupportedVersion`

const fromVersion = parse(fromInput) || parse("1.0.0");
const toVersion = parse(toInput) || parse(latestSupportedVersion);

console.log(
  "Running codemod from version",
  fromVersion.format(),
  "to version",
  toVersion.format()
);

// <-------- TS Code ---------->

if (mode === undefined || mode === "ts") {
  // Check, in case of monorepo which doesn't have tsconfig at the root
  const tsConfigExisted = existsSync(tsconfig);

  const project = new Project({
    // Optionally specify compiler options, tsconfig.json, in-memory file system, and more here.
    // If you initialize with a tsconfig.json, then it will automatically populate the project
    // with the associated source files.
    // Read more: https://ts-morph.com/setup/
    tsConfigFilePath: tsConfigExisted ? tsconfig : undefined,
  });

  // console.log(project);

  if (tsConfigExisted) {
    console.log("Initialising TypeScript project from", tsconfig);
    // project.addSourceFilesFromTsConfig();
  } else {
    console.log(
      "Initialising TypeScript project from source glob:",
      tsSourceGlob
    );
    // Very bad way of handling monorepo, adding all ts files from `tsSourceGlob` args, by default is all ts* in packages folder
    project.addSourceFilesAtPaths(tsSourceGlob);
  }

  const sourceFiles = project.getSourceFiles();
  console.log("Found", sourceFiles.length, "source files");

  for (const file of sourceFiles) {
    const filePath = file.getFilePath();
    if (only && !filePath.includes(only)) {
      continue;
    }

    verboseOnlyDimLog("Processing", filePath);

    let saltProviderRenamed = false;

    if (gt(v100, fromVersion) && lte(v100, toVersion)) {
      saltProviderRenamed = react100(file, saltProviderRenamed);
    }

    if (gt(v110, fromVersion) && lte(v110, toVersion)) {
      react110(file);
    }

    if (gt(v120, fromVersion) && lte(v120, toVersion)) {
      react120(file);
    }

    if (gt(v130, fromVersion) && lte(v130, toVersion)) {
      react130(file);
    }

    if (gt(v150, fromVersion) && lte(v150, toVersion)) {
      react150(file);
    }

    if (gt(v160, fromVersion) && lte(v160, toVersion)) {
      react160(file);
    }

    if (gt(v180, fromVersion) && lte(v180, toVersion)) {
      react180(file);
    }

    if (gt(v1110, fromVersion) && lte(v1110, toVersion)) {
      react1110(file);
    }

    if (gt(v1120, fromVersion) && lte(v1120, toVersion)) {
      react1120(file);
    }

    if (organizeImports) {
      file.organizeImports();
    }

    //   break;
  }

  if (!dryRun) {
    // asynchronously save all the changes above
    await project.save();
  }

  console.log("TypeScript conversion done.");
}

// <-------- CSS Var ---------->

if (mode === undefined || mode === "css") {
  console.log("Starting CSS variable migrations");

  // Given the script will likely not be installed at the target directory, we need to find `@salt-ds/theme/index.css`
  // so that it would work both in a simple repo as well as monorepo where the package is installed in parent folders
  const saltDsThemePkgJsonPath = resolvePackagePath(
    "@salt-ds/theme",
    process.cwd()
  );

  const saltThemeCssPath = join(dirname(saltDsThemePkgJsonPath), "index.css");

  verboseOnlyDimLog("Reading Salt theme CSS variables from", saltThemeCssPath);
  const saltThemeCssContent = readFileSync(saltThemeCssPath, {
    encoding: "utf8",
    flag: "r",
  });
  const allSaltThemeCssVars = new Set(
    [...saltThemeCssContent.matchAll(/--salt[-\w]+\b/g)].map((x) => x[0])
  );
  verboseOnlyDimLog(
    "Total valid Salt theme CSS var count:",
    allSaltThemeCssVars.size
  );

  const filePaths = glob.sync("*/**/*.@(css|ts|tsx)", {
    ignore: ["node_modules", "dist"],
  });

  verboseOnlyDimLog("Total files to modify CSS variables", filePaths.length);

  /** A array of css variable to move from version a to b. */
  const cssMigrationMapArray = [];

  if (gt(v100, fromVersion) && lte(v100, toVersion)) {
    cssMigrationMapArray.push(...css100RenameMap);
  }

  if (gt(v130, fromVersion) && lte(v130, toVersion)) {
    cssMigrationMapArray.push(...css130RenameMap);
  }

  if (gt(v140, fromVersion) && lte(v140, toVersion)) {
    cssMigrationMapArray.push(...css140RenameMap);
  }

  if (gt(v160, fromVersion) && lte(v160, toVersion)) {
    cssMigrationMapArray.push(...css160RenameMap);
  }

  if (gt(v182, fromVersion) && lte(v182, toVersion)) {
    cssMigrationMapArray.push(...css182RenameMap);
  }

  if (gt(v1120, fromVersion) && lte(v1120, toVersion)) {
    cssMigrationMapArray.push(...css1120RenameMap);
  }

  const cssMigrationMap = new Map(cssMigrationMapArray);

  const knownCssRenameCheckRegex = getCssRenameCheckRegex(cssMigrationMap);

  for (const filePath of filePaths) {
    verboseOnlyDimLog("Processing", filePath);

    const originalContent = readFileSync(filePath, {
      encoding: "utf-8",
      flag: "r",
    });

    const newContent = originalContent
      .split(/\r?\n|\r|\n/g)
      .map((line, lineIndex) => {
        let newLine = line;

        const saltPrefixed = line.replace(/--uitk/g, "--salt");

        if (cssMigrationMap.size > 0) {
          newLine = migrateCssVar(
            saltPrefixed,
            knownCssRenameCheckRegex,
            cssMigrationMap
          );
        }

        warnUnknownSaltThemeVars(
          allSaltThemeCssVars,
          newLine,
          lineIndex,
          filePath
        );

        return newLine;
      })
      .join("\n");

    if (newContent !== originalContent && !dryRun) {
      writeFileSync(filePath, newContent, { encoding: "utf-8" });
      verboseOnlyDimLog("Writing new", filePath);
    }
  }

  console.log("CSS variable migrations done.");
}

console.log("All done!");
