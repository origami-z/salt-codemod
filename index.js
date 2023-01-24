import { Project, SyntaxKind } from "ts-morph";
import _yargs from "yargs";
import { hideBin } from "yargs/helpers";
import glob from "fast-glob";
import { join } from "path";
import process from "process";
import { readFileSync, writeFileSync } from "fs";

const yargs = _yargs(hideBin(process.argv));

var { tsconfig, verbose, organizeImports, dryRun, only, mode } = await yargs
  .scriptName("salt-ts-morph")
  .usage("$0 <cmd> [args]")
  .option("tsconfig", {
    default: "tsconfig.json",
    description:
      "React code is modified using ts-morph, which needs a path to your tsconfig.json file.",
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
  .help().argv;

// <-------- TS Code ---------->

if (mode === undefined || mode === "ts") {
  console.log("Initialising TypeScript project from", tsconfig);

  const project = new Project({
    // Optionally specify compiler options, tsconfig.json, in-memory file system, and more here.
    // If you initialize with a tsconfig.json, then it will automatically populate the project
    // with the associated source files.
    // Read more: https://ts-morph.com/setup/
    tsConfigFilePath: tsconfig,
  });

  // console.log(project);

  // project.addSourceFilesFromTsConfig();

  const sourceFiles = project.getSourceFiles();
  console.log("Found", sourceFiles.length, "source files");

  for (const file of sourceFiles) {
    const filePath = file.getFilePath();
    if (only && !filePath.includes(only)) {
      continue;
    }

    verboseOnlyLog("Processing", filePath);

    let saltProviderRenamed = false;

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
      "Panel",
      // Layouts
      "DeckLayout",
      "SplitLayout",
      "LayerLayout",
      "ParentChildLayout",
      // Tooltip
      "Tooltip",
      "TooltipProps",
      "useTooltip",
      // Forms
      "FormField",
      "Switch",
      "Input",
      "Checkbox",
    ].forEach((c) =>
      moveNamedImports(file, {
        namedImportText: c,
        from: "@salt-ds/core",
        to: "@salt-ds/lab",
      })
    );

    // Components / Types moved from lab to core
    ["Link", "Text", "TextProps", "H1", "H2", "H3", "H4"].forEach((c) =>
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

  // TODO: there should be a way to let node to resolve to '@salt-ds/theme' without doing path joining
  const saltThemeCssPath = join(
    process.cwd(),
    "node_modules",
    "@salt-ds/theme/index.css"
  );
  // const require = createRequire(import.meta.url);
  // const pathName = require.resolve("@salt-ds/theme/package.json");
  // // const dependencyAsset = await import.meta.resolve("@salt-ds/theme/index.css");
  // console.log({ pathName });
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

  // Everything here is salt prefixed, assuming uitk prefix rename is performed first
  const knownCssRenamesMap = new Map([
    ["--salt-container-background", "--salt-container-primary-background"],
    [
      "--salt-container-background-medium",
      "--salt-container-secondary-background",
    ],
    ["--salt-container-background-low", "--salt-container-tertiary-background"],

    ["--salt-editable-background", "--salt-editable-primary-background"],
    ["--salt-editable-background-low", "--salt-editable-primary-background"],
    [
      "--salt-editable-background-medium",
      "--salt-editable-secondary-background",
    ],
    ["--salt-editable-background-high", "--salt-editable-tertiary-background"],
    ["--salt-editable-text-color", "--salt-text-primary-foreground"],

    [
      "--salt-selectable-background-selected",
      "--salt-selectable-cta-background-selected",
    ],
    [
      "--salt-selectable-foreground-selected",
      "--salt-selectable-cta-foreground-selected",
    ],

    [
      "--salt-separable-border-color-1",
      "--salt-separable-tertiary-borderColor",
    ],

    [
      "--salt-status-info-background-high",
      "--salt-status-info-background-emphasize",
    ],
    [
      "--salt-status-success-background-high",
      "--salt-status-success-background-emphasize",
    ],
    [
      "--salt-status-warning-background-high",
      "--salt-status-warning-background-emphasize",
    ],
    [
      "--salt-status-error-background-high",
      "--salt-status-error-background-emphasize",
    ],

    ["--salt-text-primary-color", "--salt-text-primary-foreground"],
    ["--salt-text-secondary-color", "--salt-text-secondary-foreground"],

    ["--salt-spacing-unit", "--salt-size-unit"],

    ["--salt-color-grey-10", "--salt-color-gray-10"],
    ["--salt-color-grey-20", "--salt-color-gray-20"],
    ["--salt-color-grey-30", "--salt-color-gray-30"],
    ["--salt-color-grey-40", "--salt-color-gray-40"],
    ["--salt-color-grey-50", "--salt-color-gray-50"],
    ["--salt-color-grey-60", "--salt-color-gray-60"],
    ["--salt-color-grey-70", "--salt-color-gray-70"],
    ["--salt-color-grey-80", "--salt-color-gray-80"],
    ["--salt-color-grey-90", "--salt-color-gray-90"],
    ["--salt-color-grey-100", "--salt-color-gray-100"],
    ["--salt-color-grey-200", "--salt-color-gray-200"],
    ["--salt-color-grey-300", "--salt-color-gray-300"],
    ["--salt-color-grey-400", "--salt-color-gray-400"],
    ["--salt-color-grey-500", "--salt-color-gray-500"],
    ["--salt-color-grey-600", "--salt-color-gray-600"],
    ["--salt-color-grey-700", "--salt-color-gray-700"],
    ["--salt-color-grey-800", "--salt-color-gray-800"],
    ["--salt-color-grey-900", "--salt-color-gray-900"],

    ["--salt-zIndex-appheader", "--salt-zIndex-appHeader"],
    ["--salt-zIndex-dragobject", "--salt-zIndex-dragObject"],
    ["--salt-zIndex-contextmenu", "--salt-zIndex-contextMenu"],
    ["--salt-zIndex-tooltip", "--salt-zIndex-flyover"],
  ]);

  const knownCssRenameCheckRegex = new RegExp(
    Array.from(knownCssRenamesMap.keys()).join("|"),
    "g"
  );

  const filePaths = glob.sync("*/**/*.@(css|ts|tsx)", {
    ignore: ["node_modules", "dist"],
  });

  verboseOnlyLog("Total files to modify CSS variables", filePaths.length);

  for (const filePath of filePaths) {
    verboseOnlyLog("Processing", filePath);

    const originalContent = readFileSync(filePath, {
      encoding: "utf-8",
      flag: "r",
    });

    const newContent = originalContent
      .split(/\r?\n|\r|\n/g)
      .map((line, lineIndex) => {
        const saltPrefixed = line.replace(/--uitk/g, "--salt");

        const knownVarMigrated = migrateCssVar(
          saltPrefixed,
          knownCssRenameCheckRegex,
          knownCssRenamesMap
        );

        warnUnknownSaltThemeVars(
          allSaltThemeCssVars,
          knownVarMigrated,
          lineIndex,
          filePath
        );

        return knownVarMigrated;
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
