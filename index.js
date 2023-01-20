import { Project, SyntaxKind } from "ts-morph";
import _yargs from "yargs";
import { hideBin } from "yargs/helpers";
const yargs = _yargs(hideBin(process.argv));

var { tsconfig, verbose, organizeImports, dryRun, only } = await yargs
  .scriptName("salt-ts-morph")
  .usage("$0 <cmd> [args]")
  .default("tsconfig", "tsconfig.json")
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
  .help().argv;

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

console.log("Done!");

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

function verboseOnlyLog(...data) {
  (verbose || dryRun) && console.log(...data);
}
