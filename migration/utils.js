import { SyntaxKind } from "ts-morph";
import { verboseOnlyLog } from "../utils/log.js";

/**
 *
 * @param {import("ts-morph").ImportDeclaration} declaration
 */
export function renameImportModuleSpecifier(
  declaration,
  { from, to, partial }
) {
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
export function renameNamedImports(declaration, { moduleSpecifier, from, to }) {
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
export function moveNamedImports(file, { namedImportText, from, to }) {
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
export function renameReactElementName(file, { from, to }) {
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
export function replaceReactAttribute(
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
export function warnUnknownSaltThemeVars(
  validCssVarsSet,
  line,
  lineIndex,
  filePath
) {
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
 * @param {Map<string, string>} cssMigrationMap
 * @returns {RegExp}
 */
export function getCssRenameCheckRegex(cssMigrationMap) {
  const varEndDetector = "(?!-)";
  return new RegExp(
    "(" + Array.from(cssMigrationMap.keys()).join("|") + ")" + varEndDetector,
    "g"
  );
}

/**
 *
 * @param {string} line
 * @param {RegExp} renameRegex
 * @param {Map<string, string>} renameMap
 */
export function migrateCssVar(line, renameRegex, renameMap) {
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
