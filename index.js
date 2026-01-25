#!/usr/bin/env node

import chalk from "chalk";
import glob from "fast-glob";
import { existsSync, readFileSync, writeFileSync } from "fs";
import ncu from "npm-check-updates";
import { relative } from "path";
import process from "process";
import { coerce, gt, lte, parse } from "semver";
import { Project } from "ts-morph";

// Constants
const CSS_IGNORE_FOLDERS = ["node_modules", "dist", "build"];
const SALT_DS_PACKAGE_FILTER = /@salt-ds/;
import { css100RenameMap, react100 } from "./migration/core100.js";
import { react110 } from "./migration/core110.js";
import { react1110 } from "./migration/core1110.js";
import { css1120RenameMap, react1120 } from "./migration/core1120.js";
import { react1130 } from "./migration/core1130.js";
import { react1140 } from "./migration/core1140.js";
import { react1150 } from "./migration/core1150.js";
import { react1160 } from "./migration/core1160.js";
import { react1170 } from "./migration/core1170.js";
import { css1180RenameMap } from "./migration/core1180.js";
import { react1190 } from "./migration/core1190.js";
import { react120 } from "./migration/core120.js";
import { react1200 } from "./migration/core1200.js";
import { react1210 } from "./migration/core1210.js";
import { react1230 } from "./migration/core1230.js";
import { react1240 } from "./migration/core1240.js";
import { react1250 } from "./migration/core1250.js";
import { css1270RenameMap, react1270 } from "./migration/core1270.js";
import { css1280RenameMap, react1280 } from "./migration/core1280.js";
import { css130RenameMap, react130 } from "./migration/core130.js";
import { react1300 } from "./migration/core1300.js";
import { react1320 } from "./migration/core1320.js";
import { react1330 } from "./migration/core1330.js";
import { css1360RenameMap, react1360 } from "./migration/core1360.js";
import { css140RenameMap } from "./migration/core140.js";
import { react150 } from "./migration/core150.js";
import { css160RenameMap, react160 } from "./migration/core160.js";
import { react180 } from "./migration/core180.js";
import { css182RenameMap } from "./migration/core182.js";
import {
  detectSaltProviderNext,
  getCssRenameCheckRegex,
  migrateCssVar,
  warnUnknownSaltThemeVars,
} from "./migration/utils.js";
import {
  DEFAULT_FROM_VERSION,
  LATEST_SUPPORTED_VERSION,
  parsedArgs,
} from "./utils/args.js";
import {
  verboseOnlyDimLog,
  verboseOnlyTableLog,
  verboseOnlyLog,
  infoLog,
  errorLog,
  warnLog,
} from "./utils/log.js";
import { applyMigrationIfInRange } from "./utils/migration-helpers.js";
import { react1372 } from "./migration/core1372.js";
import { react1380 } from "./migration/core1380.js";
import { react1390 } from "./migration/core1390.js";
import { css1400RenameMap, react1400 } from "./migration/core1400.js";
import { react1410 } from "./migration/core1410.js";
import { react1420 } from "./migration/core1420.js";
import { react1430 } from "./migration/core1430.js";
import { react1440 } from "./migration/core1440.js";
import { react1450 } from "./migration/core1450.js";
import { react1460 } from "./migration/core1460.js";
import { react1471 } from "./migration/core1471.js";
import { react1480 } from "./migration/core1480.js";
import { css1490RenameMap } from "./migration/core1490.js";
import { css1500RenameMap } from "./migration/core1500.js";
import { css1520RenameMap } from "./migration/core1520.js";
import { react1530 } from "./migration/core1530.js";
import { formControls } from "./migration/formControls.js";

verboseOnlyLog("Args used:");
verboseOnlyTableLog(parsedArgs);

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
  skipUpgrade,
  themeCss,
  themeNextCss,
  cssModeGlob: cssGlob,
  migrateFormControls,
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
const v1280 = parse("1.28.0");
// nothing needed for 1.29.0
const v1300 = parse("1.30.0");
// nothing needed for 1.31.0
const v1320 = parse("1.32.0");
const v1330 = parse("1.33.0");
// nothing needed for 1.34.0
// nothing needed for 1.35.0
const v1360 = parse("1.36.0");
// nothing needed for 1.37.0
// nothing needed for 1.37.1
const v1372 = parse("1.37.2");
const v1380 = parse("1.38.0");
const v1390 = parse("1.39.0");
const v1400 = parse("1.40.0");
const v1410 = parse("1.41.0");
const v1420 = parse("1.42.0");
const v1430 = parse("1.43.0");
const v1440 = parse("1.44.0");
const v1450 = parse("1.45.0");
const v1460 = parse("1.46.0");
// nothing needed for 1.47.0
const v1471 = parse("1.47.1");
// nothing needed for 1.47.2, 1.47.3, 1.47.4, 1.47.5
const v1480 = parse("1.48.0");
const v1490 = parse("1.49.0");
const v1500 = parse("1.50.0");
// nothing needed for 1.51.0
const v1520 = parse("1.52.0");
// nothing needed for 1.52.1
const v1530 = parse("1.53.0");
// nothing needed for 1.54.0, 1.54.1, 1.54.2
// NOTE: don't forget to modify `LATEST_SUPPORTED_VERSION` in args.js

if (dryRun) {
  infoLog(chalk.bold("Dry run mode"));
}

// <-------- Upgrade package.json version ---------->

let upgradedVersion = undefined;

if (!skipUpgrade || dryRun) {
  try {
    const upgraded = await ncu.run({
      upgrade: true,
      filter: SALT_DS_PACKAGE_FILTER,
      install: "always",
      // Logging is not supported in json mode - https://github.com/raineorshine/npm-check-updates/blob/982bd407dd46ec4f8173ed867f117e4d45686981/src/lib/logging.ts#L53-L70
    });

    if (Object.entries(upgraded).length) {
      verboseOnlyDimLog("Package upgraded to ", JSON.stringify(upgraded)); // { '@salt-ds/core': '^1.37.1', ... }
      const newCoreRange = upgraded["@salt-ds/core"];
      upgradedVersion = coerce(newCoreRange)?.version;
    } else {
      verboseOnlyDimLog("No @salt-ds/* package was upgraded");
    }
  } catch (error) {
    errorLog(chalk.red("Failed to upgrade packages:"), error.message);
    infoLog(chalk.yellow("Continuing with codemod using specified versions..."));
  }
}

const fromVersion = parse(fromInput) || parse(DEFAULT_FROM_VERSION);
const toVersion =
  parse(toInput) || parse(upgradedVersion) || parse(LATEST_SUPPORTED_VERSION);

infoLog(
  "Running codemod from version",
  chalk.bold(fromVersion.format()),
  "to version",
  chalk.bold(toVersion.format())
);

// ============================================================================
// TypeScript/React Migrations
// ============================================================================
// This section handles all React component and TypeScript code migrations
// using ts-morph to parse and transform source files.

// Keep track of project and source files for SaltProviderNext detection
let project = null;
let sourceFiles = [];

if (mode === undefined || mode === "ts") {
  // Check, in case of monorepo which doesn't have tsconfig at the root
  const tsConfigExisted = existsSync(tsconfig);

  // Ignore tsconfig if `tsSourceGlob` option is provided
  const initialiseFromTsConfig = !tsSourceGlob && tsConfigExisted;

  project = new Project({
    // Optionally specify compiler options, tsconfig.json, in-memory file system, and more here.
    // If you initialize with a tsconfig.json, then it will automatically populate the project
    // with the associated source files.
    // Read more: https://ts-morph.com/setup/
    tsConfigFilePath: initialiseFromTsConfig ? tsconfig : undefined,
  });

  // infoLog(project);

  if (initialiseFromTsConfig) {
    infoLog(chalk.dim("Initialising TypeScript project from", tsconfig));
    // project.addSourceFilesFromTsConfig();
  } else {
    infoLog(
      chalk.dim(
        "Initialising TypeScript project from source glob:",
        tsSourceGlob,
        ". (Use --tsSourceGlob flag to customize)"
      )
    );
    // One example way of handling monorepo, adding all ts files from `tsSourceGlob` args, by default is all ts* in packages folder
    project.addSourceFilesAtPaths(tsSourceGlob);
  }

  sourceFiles = project.getSourceFiles();
  infoLog(chalk.dim("Found", sourceFiles.length, "source files"));

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

    if (gt(v1280, fromVersion) && lte(v1280, toVersion)) {
      react1280(file);
    }

    if (gt(v1300, fromVersion) && lte(v1300, toVersion)) {
      react1300(file);
    }

    if (gt(v1320, fromVersion) && lte(v1320, toVersion)) {
      react1320(file);
    }

    if (gt(v1330, fromVersion) && lte(v1330, toVersion)) {
      react1330(file);
    }

    if (gt(v1360, fromVersion) && lte(v1360, toVersion)) {
      react1360(file);
    }

    if (gt(v1372, fromVersion) && lte(v1372, toVersion)) {
      react1372(file);
    }

    if (gt(v1380, fromVersion) && lte(v1380, toVersion)) {
      react1380(file);
    }

    if (gt(v1390, fromVersion) && lte(v1390, toVersion)) {
      react1390(file);
    }

    if (gt(v1400, fromVersion) && lte(v1400, toVersion)) {
      react1400(file);
    }

    if (gt(v1410, fromVersion) && lte(v1410, toVersion)) {
      react1410(file);
    }

    if (gt(v1420, fromVersion) && lte(v1420, toVersion)) {
      react1420(file);
    }

    if (gt(v1430, fromVersion) && lte(v1430, toVersion)) {
      react1430(file);
    }

    if (gt(v1440, fromVersion) && lte(v1440, toVersion)) {
      react1440(file);
    }

    if (gt(v1450, fromVersion) && lte(v1450, toVersion)) {
      react1450(file);
    }

    if (gt(v1460, fromVersion) && lte(v1460, toVersion)) {
      react1460(file);
    }

    if (gt(v1471, fromVersion) && lte(v1471, toVersion)) {
      react1471(file);
    }

    if (gt(v1480, fromVersion) && lte(v1480, toVersion)) {
      react1480(file);
    }

    if (gt(v1530, fromVersion) && lte(v1530, toVersion)) {
      react1530(file);
    }

    // Experimental: FormField migration from @salt-ds/lab to @salt-ds/core
    if (migrateFormControls) {
      formControls(file);
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

  infoLog(chalk.dim("TypeScript conversion done."));
}

// ============================================================================
// CSS Variable Migrations
// ============================================================================
// This section handles CSS variable renames and validations across
// CSS, TypeScript, and TSX files.

if (mode === undefined || mode === "css") {
  infoLog(chalk.dim("Starting CSS variable migrations"));

  // Detect if SaltProviderNext is being used in the codebase
  let usesSaltProviderNext = false;

  // If we didn't run TS mode, we need to create a project just for detection
  if (mode === "css") {
    try {
      const tsConfigExisted = existsSync(tsconfig);
      const initialiseFromTsConfig = !tsSourceGlob && tsConfigExisted;

      const detectionProject = new Project({
        tsConfigFilePath: initialiseFromTsConfig ? tsconfig : undefined,
      });

      if (!initialiseFromTsConfig && tsSourceGlob) {
        detectionProject.addSourceFilesAtPaths(tsSourceGlob);
      }

      const detectionFiles = detectionProject.getSourceFiles();
      usesSaltProviderNext = detectSaltProviderNext(detectionFiles);
    } catch (error) {
      verboseOnlyDimLog(
        "Could not check for SaltProviderNext usage:",
        error.message
      );
    }
  } else if (sourceFiles.length > 0) {
    // Reuse the source files from TS mode
    usesSaltProviderNext = detectSaltProviderNext(sourceFiles);
  }

  verboseOnlyDimLog(
    "Reading Salt theme CSS variables from",
    relative(process.cwd(), themeCss)
  );

  let allSaltThemeCssVars = new Set();
  try {
    const saltThemeCssContent = readFileSync(themeCss, {
      encoding: "utf8",
      flag: "r",
    });
    allSaltThemeCssVars = new Set(
      [...saltThemeCssContent.matchAll(/--salt[-\w]+\b/g)].map((x) => x[0])
    );

    // If SaltProviderNext is detected and theme-next.css exists, also load its variables
    if (usesSaltProviderNext && existsSync(themeNextCss)) {
      verboseOnlyDimLog(
        "Reading additional Salt theme CSS variables from",
        relative(process.cwd(), themeNextCss)
      );
      const saltThemeNextCssContent = readFileSync(themeNextCss, {
        encoding: "utf8",
        flag: "r",
      });
      const themeNextVars = [
        ...saltThemeNextCssContent.matchAll(/--salt[-\w]+\b/g),
      ].map((x) => x[0]);

      themeNextVars.forEach((cssVar) => allSaltThemeCssVars.add(cssVar));

      verboseOnlyDimLog(
        "Added",
        themeNextVars.length,
        "variables from theme-next.css"
      );
    }

    verboseOnlyDimLog(
      "Total valid Salt theme CSS var count:",
      allSaltThemeCssVars.size
    );
  } catch (error) {
    errorLog(
      chalk.yellow("Warning: Could not read theme CSS file:"),
      error.message
    );
    infoLog(chalk.yellow("CSS variable validation will be skipped."));
  }

  infoLog(
    chalk.dim(
      "Scanning CSS using source glob:",
      cssGlob,
      ", ignoring folders:",
      CSS_IGNORE_FOLDERS
    )
  );
  const filePaths = glob.sync(cssGlob, {
    ignore: CSS_IGNORE_FOLDERS,
  });

  verboseOnlyDimLog(
    "Total files to scan for migrating CSS variables:",
    filePaths.length
  );

  // Collect all CSS variable migrations that apply to the version range
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

  if (gt(v1270, fromVersion) && lte(v1270, toVersion)) {
    cssMigrationMapArray.push(...css1270RenameMap);
  }

  if (gt(v1280, fromVersion) && lte(v1280, toVersion)) {
    cssMigrationMapArray.push(...css1280RenameMap);
  }

  if (gt(v1360, fromVersion) && lte(v1360, toVersion)) {
    cssMigrationMapArray.push(...css1360RenameMap);
  }

  if (gt(v1400, fromVersion) && lte(v1400, toVersion)) {
    cssMigrationMapArray.push(...css1400RenameMap);
  }

  if (gt(v1490, fromVersion) && lte(v1490, toVersion)) {
    cssMigrationMapArray.push(...css1490RenameMap);
  }

  if (gt(v1500, fromVersion) && lte(v1500, toVersion)) {
    cssMigrationMapArray.push(...css1500RenameMap);
  }

  if (gt(v1520, fromVersion) && lte(v1520, toVersion)) {
    cssMigrationMapArray.push(...css1520RenameMap);
  }

  const cssMigrationMap = new Map(cssMigrationMapArray);

  const knownCssRenameCheckRegex = getCssRenameCheckRegex(cssMigrationMap);

  for (const filePath of filePaths) {
    if (fileFilter && !filePath.includes(fileFilter)) {
      verboseOnlyDimLog("Skipping file due to --file", filePath);
      continue;
    }
    verboseOnlyDimLog("Processing", filePath);

    try {
      const originalContent = readFileSync(filePath, {
        encoding: "utf-8",
        flag: "r",
      });

      const newContent = originalContent
        .split(/\r?\n|\r|\n/g)
        .map((line, lineIndex) => {
          let newLine = line;

          if (cssMigrationMap.size > 0) {
            // Apply uitk -> salt prefix migration for pre-1.0.0
            const lineToMigrate = gt(v100, fromVersion)
              ? line
              : line.replace(/--uitk/g, "--salt");

            newLine = migrateCssVar(
              lineToMigrate,
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
    } catch (error) {
      errorLog(chalk.red(`Failed to process ${filePath}:`), error.message);
    }
  }

  infoLog(chalk.dim("CSS variable migrations done."));
}

// ============================================================================
// Completion
// ============================================================================

if (dryRun) {
  infoLog(chalk.bold.cyan("Dry run mode complete!"));
  infoLog(chalk.dim("No files were modified. Remove --dryRun to apply changes."));
} else {
  infoLog(chalk.bold.green("All migrations complete!"));
}
