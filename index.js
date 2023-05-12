import glob from "fast-glob";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import process from "process";
import resolvePackagePath from "resolve-package-path";
import { gt, lte, parse } from "semver";
import { Project, SyntaxKind } from "ts-morph";
import _yargs from "yargs";
import { hideBin } from "yargs/helpers";

import {
  css100RenameMap,
  css130RenameMap,
  css140RenameMap,
  css160RenameMap,
} from "./cssMaps.js";

const yargs = _yargs(hideBin(process.argv));

const v100 = parse("1.0.0");
const v110 = parse("1.1.0");
const v120 = parse("1.2.0");
const v130 = parse("1.3.0");
const v140 = parse("1.4.0");
const v150 = parse("1.5.0");
const v160 = parse("1.6.0");
// nothing needed for 1.7.0

const latestSupportedVersion = "1.7.0";

var {
  tsconfig,
  tsSourceGlob,
  verbose,
  organizeImports,
  dryRun,
  only,
  mode,
  from: fromInput,
  to: toInput,
} = await yargs
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

const fromVersion = parse(fromInput) || parse("0.0.0");
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

    verboseOnlyLog("Processing", filePath);

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

  verboseOnlyLog("Reading Salt theme CSS variables from", saltThemeCssPath);
  const saltThemeCssContent = readFileSync(saltThemeCssPath, {
    encoding: "utf8",
    flag: "r",
  });
  const allSaltThemeCssVars = new Set(
    [...saltThemeCssContent.matchAll(/--salt[-\w]+\b/g)].map((x) => x[0])
  );
  verboseOnlyLog(
    "Total valid Salt theme CSS var count:",
    allSaltThemeCssVars.size
  );

  const filePaths = glob.sync("*/**/*.@(css|ts|tsx)", {
    ignore: ["node_modules", "dist"],
  });

  verboseOnlyLog("Total files to modify CSS variables", filePaths.length);

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

  const cssMigrationMap = new Map(cssMigrationMapArray);

  const varEndDetector = "(?!-)";
  const knownCssRenameCheckRegex = new RegExp(
    "(" + Array.from(cssMigrationMap.keys()).join("|") + ")" + varEndDetector,
    "g"
  );

  for (const filePath of filePaths) {
    verboseOnlyLog("Processing", filePath);

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
      verboseOnlyLog("Writing new", filePath);
    }
  }

  console.log("CSS variable migrations done.");
}

console.log("All done!");

function react100(file, saltProviderRenamed) {
  // Imports
  for (const declaration of file.getImportDeclarations()) {
    // Rename import declaration first
    renameImportModuleSpecifier(declaration, {
      from: "@jpmorganchase/uitk-theme",
      to: "@salt-ds/theme",
      partial: true,
    });
    renameImportModuleSpecifier(declaration, {
      from: "@jpmorganchase/uitk-core",
      to: "@salt-ds/core",
    });
    renameImportModuleSpecifier(declaration, {
      from: "@jpmorganchase/uitk-lab",
      to: "@salt-ds/lab",
    });
    renameImportModuleSpecifier(declaration, {
      from: "@jpmorganchase/uitk-icons",
      to: "@salt-ds/icons",
    });
    renameImportModuleSpecifier(declaration, {
      from: "@jpmorganchase/uitk-grid",
      to: "@salt-ds/data-grid",
    });

    // Rename named imports with new declaration
    saltProviderRenamed =
      saltProviderRenamed ||
      renameNamedImports(declaration, {
        moduleSpecifier: "@salt-ds/core",
        from: "ToolkitProvider",
        to: "SaltProvider",
      });
  }

  // Components / Types moved from core to lab
  [
    "Card",
    "CardProps",
    "Panel",
    "PanelProps",
    // Layouts
    "DeckLayout",
    "DeckLayoutProps",
    "SplitLayout",
    "SplitLayoutProps",
    "LayerLayout",
    "LayerLayoutProps",
    "ParentChildLayout",
    "ParentChildLayoutProps",
    // Tooltip
    "Tooltip",
    "TooltipProps",
    "useTooltip",
    // Forms
    "FormField",
    "FormFieldProps",
    "Switch",
    "SwitchProps",
    "Input",
    "InputProps",
    "Checkbox",
    "CheckboxProps",
  ].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/core",
      to: "@salt-ds/lab",
    })
  );

  // Components / Types moved from lab to core
  ["Link", "LinkProps", "Text", "TextProps", "H1", "H2", "H3", "H4"].forEach(
    (c) =>
      moveNamedImports(file, {
        namedImportText: c,
        from: "@salt-ds/lab",
        to: "@salt-ds/core",
      })
  );

  // Component props
  if (saltProviderRenamed) {
    renameReactElementName(file, {
      from: "ToolkitProvider",
      to: "SaltProvider",
    });
  }

  // <Panel emphasis="medium"> => <Panel variant="primary">
  // <Panel emphasis="high"> => <Panel variant="secondary">
  replaceReactAttribute(file, {
    elementName: "Panel",
    attributeFrom: "emphasis",
    valueFrom: `"medium"`,
    attributeTo: "variant",
    valueTo: `"primary"`,
  });
  replaceReactAttribute(file, {
    elementName: "Panel",
    attributeFrom: "emphasis",
    valueFrom: `"high"`,
    attributeTo: "variant",
    valueTo: `"secondary"`,
  });

  // BorderItem position rename
  replaceReactAttribute(file, {
    elementName: "BorderItem",
    attributeFrom: "position",
    valueFrom: `"header"`,
    attributeTo: "position",
    valueTo: `"north"`,
  });
  replaceReactAttribute(file, {
    elementName: "BorderItem",
    attributeFrom: "position",
    valueFrom: `"main"`,
    attributeTo: "position",
    valueTo: `"center"`,
  });
  replaceReactAttribute(file, {
    elementName: "BorderItem",
    attributeFrom: "position",
    valueFrom: `"footer"`,
    attributeTo: "position",
    valueTo: `"south"`,
  });
  replaceReactAttribute(file, {
    elementName: "BorderItem",
    attributeFrom: "position",
    valueFrom: `"left"`,
    attributeTo: "position",
    valueTo: `"west"`,
  });
  replaceReactAttribute(file, {
    elementName: "BorderItem",
    attributeFrom: "position",
    valueFrom: `"right"`,
    attributeTo: "position",
    valueTo: `"east"`,
  });
  return saltProviderRenamed;
}

// Release note: https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.1.0
function react110(file) {
  // Components / Types moved from lab to core
  ["Card", "CardProps", "Panel", "PanelProps"].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );
}

function react120(file) {
  // Components / Types moved from lab to core
  [
    "Tooltip",
    "TooltipProps",
    "useFloatingUI",
    "Spinner",
    "SplitLayout",
    "SplitLayoutProps",
  ].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );
}

function react130(file) {
  // Components / Types moved from lab to core
  ["Avatar", "AvatarProps"].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );
}

function react150(file) {
  // Components / Types moved from lab to core
  [
    "Checkbox",
    "CheckboxProps",
    "RadioButton",
    "RadioButtonProps",
    "RadioButtonGroup",
    "RadioButtonGroupProps",
    "RadioButtonIcon",
    "RadioButtonIconProps",
    "capitalize",
  ].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );

  // TODO: <Card interactable> => <InteractableCard>
}

function react160(file) {
  // Components / Types moved from lab to core
  ["mergeProps"].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    })
  );
}

/**
 *
 * @param {import("ts-morph").ImportDeclaration} declaration
 */
function renameImportModuleSpecifier(declaration, { from, to, partial }) {
  const specifier = declaration.getModuleSpecifierValue();
  let renamed = false;
  if (partial) {
    if (specifier.includes(from)) {
      const newSpecifier = specifier.replace(from, to);
      verboseOnlyLog("Rename import from", specifier, "to", newSpecifier);
      declaration.setModuleSpecifier(newSpecifier);
      renamed = true;
    }
  } else {
    if (specifier === from) {
      verboseOnlyLog("Rename import from", from, "to", to);
      declaration.setModuleSpecifier(to);
      renamed = true;
    }
  }
  return renamed;
}

/**
 *
 * @param {import("ts-morph").ImportDeclaration} declaration
 */
function renameNamedImports(declaration, { moduleSpecifier, from, to }) {
  const specifier = declaration.getModuleSpecifierValue();
  let renamed = false;
  if (specifier === moduleSpecifier) {
    const allNamedImports = declaration.getNamedImports();
    for (const namedImports of allNamedImports) {
      if (namedImports.getName() === from) {
        verboseOnlyLog(
          "Rename named imports from",
          from,
          "to",
          to,
          "in",
          specifier
        );
        renamed = true;
        namedImports.setName(to);
      }
    }
  }
  return renamed;
}

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
function moveNamedImports(file, { namedImportText, from, to }) {
  const allDeclarations = file.getImportDeclarations();

  let importRemovedFromFrom = false;
  const declarationMap = new Map();

  for (const declaration of allDeclarations) {
    const specifier = declaration.getModuleSpecifierValue();
    declarationMap.set(specifier, declaration);

    if (specifier === from) {
      for (const namedImport of declaration.getNamedImports()) {
        if (namedImport.getText() === namedImportText) {
          verboseOnlyLog(
            "Removed named import",
            namedImportText,
            "from declaration",
            specifier
          );
          importRemovedFromFrom = true;
          namedImport.remove();

          if (declaration.getNamedImports().length === 0) {
            verboseOnlyLog("Removed remained empty import line", specifier);
            declaration.remove();
          }
          break;
        }
      }
    }
  }
  if (importRemovedFromFrom) {
    if (declarationMap.has(to)) {
      verboseOnlyLog(
        "Added named import",
        namedImportText,
        "to declaration",
        to
      );
      declarationMap.get(to).addNamedImport(namedImportText);
    } else {
      verboseOnlyLog(
        "New named import",
        namedImportText,
        "to new declaration",
        to
      );
      file.addImportDeclarations([
        {
          namedImports: [namedImportText],
          moduleSpecifier: to,
        },
      ]);
    }
  }

  return importRemovedFromFrom;
}

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
function renameReactElementName(file, { from, to }) {
  // There are 3 places to replace:
  // JsxSelfClosingElement = 282,
  // JsxOpeningElement = 283,
  // JsxClosingElement = 284,

  let renamed = false;

  for (const syntaxKind of [
    SyntaxKind.JsxOpeningElement,
    SyntaxKind.JsxClosingElement,
    SyntaxKind.JsxSelfClosingElement,
  ]) {
    for (const descendant of file.getDescendantsOfKind(syntaxKind)) {
      const identifierNode = descendant.getFirstDescendantByKind(
        SyntaxKind.Identifier
      );
      if (identifierNode) {
        if (identifierNode.getText() === from) {
          verboseOnlyLog(
            "Rename tag name from",
            from,
            "to",
            to,
            "of syntaxKind",
            syntaxKind
          );
          renamed = true;
          identifierNode.replaceWithText(to);
        }
      }
    }
  }
  return renamed;
}

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
function replaceReactAttribute(
  file,
  { elementName, attributeFrom, valueFrom, attributeTo, valueTo }
) {
  let renamed = false;

  for (const syntaxKind of [
    SyntaxKind.JsxOpeningElement,
    SyntaxKind.JsxSelfClosingElement,
  ]) {
    for (const descendant of file.getDescendantsOfKind(syntaxKind)) {
      if (descendant.getTagNameNode().getText() === elementName) {
        for (const attribute of descendant.getAttributes()) {
          if (attribute.getFirstDescendant().getText() === attributeFrom) {
            const value = attribute.getFirstChildByKind(
              SyntaxKind.StringLiteral
            );
            if (value && value.getText() === valueFrom) {
              verboseOnlyLog(
                "Replace element",
                elementName,
                "attribute",
                attributeFrom,
                valueFrom,
                "to",
                attributeTo,
                valueTo
              );
              attribute.replaceWithText(`${attributeTo}=${valueTo}`);
              renamed = true;
            }
          }
        }
      }
    }
  }
  return renamed;
}

/**
 *
 * @param {Set<string>} validCssVarsSet
 * @param {string} line
 * @param {number} lineIndex
 * @param {string} filePath
 */
function warnUnknownSaltThemeVars(validCssVarsSet, line, lineIndex, filePath) {
  const saltVarMatches = line.match(/--salt[-\w]+\b/g);
  if (saltVarMatches) {
    const allVars = [...saltVarMatches];
    for (const varUsed of allVars) {
      // Component CSS could be matched without the trailing "-"
      if (varUsed.startsWith("--salt-")) {
        if (!validCssVarsSet.has(varUsed)) {
          console.error(
            "Error: unknown salt css variable",
            varUsed,
            "at",
            `${filePath}:${lineIndex + 1}`
          );
        }
      }
    }
  }
}

/**
 *
 * @param {string} line
 * @param {RegExp} renameRegex
 * @param {Map<string, string>} renameMap
 */
function migrateCssVar(line, renameRegex, renameMap) {
  let result = line;
  let match = result.match(renameRegex);
  while (match) {
    const from = match[0];
    const to = renameMap.get(from);
    verboseOnlyLog("Replace css var", from, "to", to);
    result = result.replace(from, to);
    match = result.match(renameRegex);
  }
  return result;
}

function verboseOnlyLog(...data) {
  (verbose || dryRun) && console.log(...data);
}
