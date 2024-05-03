#!/usr/bin/env node

import chalk from "chalk";
import glob from "fast-glob";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, relative } from "path";
import process from "process";
import resolvePackagePath from "resolve-package-path";
import { gt, lte, parse } from "semver";
import { Project } from "ts-morph";
import { css100RenameMap, react100 } from "./migration/core100.js";
import { react110 } from "./migration/core110.js";
import { react1110 } from "./migration/core1110.js";
import { css1120RenameMap, react1120 } from "./migration/core1120.js";
import { react1130 } from "./migration/core1130.js";
import { react1140 } from "./migration/core1140.js";
import { react1150 } from "./migration/core1150.js";
import { react1160 } from "./migration/core1160.js";
import { react1170 } from "./migration/core1170.js";
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
import {
  DEFAULT_FROM_VERSION,
  LATEST_SUPPORTED_VERSION,
  parsedArgs,
} from "./utils/args.js";
import { verboseOnlyDimLog } from "./utils/log.js";
import { css1180RenameMap } from "./migration/core1180.js";
import { react1190 } from "./migration/core1190.js";
import { react1200 } from "./migration/core1200.js";
import { react1210 } from "./migration/core1210.js";
import { react1230 } from "./migration/core1230.js";
import { react1240 } from "./migration/core1240.js";
import { react1250 } from "./migration/core1250.js";
import { react1270 } from "./migration/core1270.js";

const {
  tsconfig,
  tsSourceGlob,
  verbose,
  organizeImports,
  dryRun,
  file: fileFilter,
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
const v1130 = parse("1.13.0");
const v1140 = parse("1.14.0");
const v1150 = parse("1.15.0");
const v1160 = parse("1.16.0");
const v1170 = parse("1.17.0");
const v1180 = parse("1.18.0");
const v1190 = parse("1.19.0");
const v1200 = parse("1.20.0");
const v1210 = parse("1.21.0");
// nothing needed for 1.22.0
const v1230 = parse("1.23.0");
const v1240 = parse("1.24.0");
const v1250 = parse("1.25.0");
// nothing needed for 1.26.0
const v1270 = parse("1.27.0");
// NOTE: don't forget to modify `LATEST_SUPPORTED_VERSION`

const fromVersion = parse(fromInput) || parse(DEFAULT_FROM_VERSION);
const toVersion = parse(toInput) || parse(LATEST_SUPPORTED_VERSION);

console.log(
  "Running codemod from version",
  chalk.bold(fromVersion.format()),
  "to version",
  chalk.bold(toVersion.format())
);

if (dryRun) {
  console.log(chalk.bold("Dry run mode"));
}

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
    console.log(chalk.dim("Initialising TypeScript project from", tsconfig));
    // project.addSourceFilesFromTsConfig();
  } else {
    console.log(
      chalk.dim(
        "Initialising TypeScript project from source glob:",
        tsSourceGlob,
        ". (Use --tsSourceGlob flag to customize)"
      )
    );
    // Very bad way of handling monorepo, adding all ts files from `tsSourceGlob` args, by default is all ts* in packages folder
    project.addSourceFilesAtPaths(tsSourceGlob);
  }

  const sourceFiles = project.getSourceFiles();
  console.log(chalk.dim("Found", sourceFiles.length, "source files"));

  for (const file of sourceFiles) {
    const filePath = file.getFilePath();
    if (fileFilter && !filePath.includes(fileFilter)) {
      verboseOnlyDimLog("Skipping file due to --file", filePath);
      continue;
    }

    verboseOnlyDimLog("Processing", filePath);

    if (gt(v100, fromVersion) && lte(v100, toVersion)) {
      react100(file);
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

    if (gt(v1130, fromVersion) && lte(v1130, toVersion)) {
      react1130(file);
    }

    if (gt(v1140, fromVersion) && lte(v1140, toVersion)) {
      react1140(file);
    }

    if (gt(v1150, fromVersion) && lte(v1150, toVersion)) {
      react1150(file);
    }

    if (gt(v1160, fromVersion) && lte(v1160, toVersion)) {
      react1160(file);
    }

    if (gt(v1170, fromVersion) && lte(v1170, toVersion)) {
      react1170(file);
    }

    if (gt(v1190, fromVersion) && lte(v1190, toVersion)) {
      react1190(file);
    }

    if (gt(v1200, fromVersion) && lte(v1200, toVersion)) {
      react1200(file);
    }

    if (gt(v1210, fromVersion) && lte(v1210, toVersion)) {
      react1210(file);
    }

    if (gt(v1230, fromVersion) && lte(v1230, toVersion)) {
      react1230(file);
    }

    if (gt(v1240, fromVersion) && lte(v1240, toVersion)) {
      react1240(file);
    }

    if (gt(v1250, fromVersion) && lte(v1250, toVersion)) {
      react1250(file);
    }

    if (gt(v1270, fromVersion) && lte(v1270, toVersion)) {
      react1270(file);
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

  console.log(chalk.dim("TypeScript conversion done."));
}

// <-------- CSS Var ---------->

if (mode === undefined || mode === "css") {
  console.log(chalk.dim("Starting CSS variable migrations"));

  // Given the script will likely not be installed at the target directory, we need to find `@salt-ds/theme/index.css`
  // so that it would work both in a simple repo as well as monorepo where the package is installed in parent folders
  const saltDsThemePkgJsonPath = resolvePackagePath(
    "@salt-ds/theme",
    process.cwd()
  );

  const saltThemeCssPath = join(dirname(saltDsThemePkgJsonPath), "index.css");

  verboseOnlyDimLog(
    "Reading Salt theme CSS variables from",
    relative(process.cwd(), saltThemeCssPath)
  );
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

  const cssGlob = "*/**/*.@(css|ts|tsx)";
  const cssIgnoreFolders = ["node_modules", "dist", "build"];
  console.log(
    chalk.dim(
      "Scanning CSS using source glob:",
      cssGlob,
      ", ignoring folders:",
      cssIgnoreFolders
    )
  );
  const filePaths = glob.sync(cssGlob, {
    ignore: cssIgnoreFolders,
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

  if (gt(v1180, fromVersion) && lte(v1180, toVersion)) {
    cssMigrationMapArray.push(...css1180RenameMap);
  }

  const cssMigrationMap = new Map(cssMigrationMapArray);

  const knownCssRenameCheckRegex = getCssRenameCheckRegex(cssMigrationMap);

  for (const filePath of filePaths) {
    if (fileFilter && !filePath.includes(fileFilter)) {
      verboseOnlyDimLog("Skipping file due to --file", filePath);
      continue;
    }
    verboseOnlyDimLog("Processing", filePath);

    const originalContent = readFileSync(filePath, {
      encoding: "utf-8",
      flag: "r",
    });

    const newContent = originalContent
      .split(/\r?\n|\r|\n/g)
      .map((line, lineIndex) => {
        let newLine = line;

        if (cssMigrationMap.size > 0) {
          newLine = migrateCssVar(
            // Replace uitk prefix with salt prefix for pre-1.0.0 migration
            gt(v100, fromVersion) ? line : line.replace(/--uitk/g, "--salt"),
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

  console.log(chalk.dim("CSS variable migrations done."));
}

if (dryRun) {
  console.log("Dry run mode done!");
} else {
  console.log("All done!");
}
