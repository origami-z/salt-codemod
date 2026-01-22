import { SyntaxKind, Node } from "ts-morph";
import { verboseOnlyDimLog, verboseOnlyLog } from "../utils/log.js";
import process from "process";
import { relative } from "path";

/**
 * @typedef {Object} RenameImportModuleSpecifierOption
 * @property {string} from - Package name to be renamed from
 * @property {string} to - Package name to rename to
 * @property {boolean} [partial] - Whether to rename on partial match (default: false)
 */

/**
 * Rename package name in import declaration.
 * Supports both exact and partial matches.
 *
 * @param {import("ts-morph").ImportDeclaration} declaration - The import declaration to modify
 * @param {RenameImportModuleSpecifierOption} option - Rename options
 * @returns {boolean} True if the import was renamed, false otherwise
 *
 * @example
 * // Exact match
 * renameImportModuleSpecifier(declaration, {
 *   from: "@old/package",
 *   to: "@new/package"
 * });
 *
 * // Partial match
 * renameImportModuleSpecifier(declaration, {
 *   from: "@old/",
 *   to: "@new/",
 *   partial: true
 * });
 */
export function renameImportModuleSpecifier(
  declaration,
  { from, to, partial = false }
) {
  if (!from || !to) {
    console.warn("renameImportModuleSpecifier: 'from' and 'to' parameters are required");
    return false;
  }

  const specifier = declaration.getModuleSpecifierValue();

  if (partial) {
    if (specifier.includes(from)) {
      const newSpecifier = specifier.replace(from, to);
      verboseOnlyDimLog("Rename import from", specifier, "to", newSpecifier);
      declaration.setModuleSpecifier(newSpecifier);
      return true;
    }
  } else {
    if (specifier === from) {
      verboseOnlyDimLog("Rename import from", from, "to", to);
      declaration.setModuleSpecifier(to);
      return true;
    }
  }

  return false;
}

/**
 * @typedef {Object} RenameNamedImportsOption
 * @property {string} moduleSpecifier - The module specifier to match
 * @property {string} from - The import name to rename from
 * @property {string} to - The import name to rename to
 */

/**
 * Renames named imports within a specific module.
 * Used when a component is renamed from A -> B. All usage of the import will also be renamed.
 * Also useful when a component is deprecated in favor of another.
 *
 * @param {import("ts-morph").ImportDeclaration} declaration - The import declaration to modify
 * @param {RenameNamedImportsOption} options - Rename options
 * @returns {boolean} True if any imports were renamed, false otherwise
 *
 * @example
 * for (const declaration of file.getImportDeclarations()) {
 *   renameNamedImports(declaration, {
 *     moduleSpecifier: "@salt-ds/core",
 *     from: "OldComponent",
 *     to: "NewComponent"
 *   });
 * }
 */
export function renameNamedImports(declaration, { moduleSpecifier, from, to }) {
  if (!moduleSpecifier || !from || !to) {
    console.warn("renameNamedImports: 'moduleSpecifier', 'from', and 'to' parameters are required");
    return false;
  }

  const specifier = declaration.getModuleSpecifierValue();
  if (specifier !== moduleSpecifier) {
    return false;
  }

  const allNamedImports = declaration.getNamedImports();
  let renamed = false;

  for (const namedImport of allNamedImports) {
    if (namedImport.getName() === from) {
      verboseOnlyDimLog(
        "Rename named imports from",
        from,
        "to",
        to,
        "in",
        specifier
      );

      // Temporarily rename alias to avoid conflicts
      namedImport.renameAlias(from + "Renamed");
      namedImport.setName(to);
      namedImport.removeAliasWithRename();
      renamed = true;
    }
  }

  return renamed;
}

/**
 * @typedef {Object} MoveNamedImportsOption
 * @property {string} namedImportText - The name of the import to move
 * @property {string} from - The source module specifier
 * @property {string} to - The destination module specifier
 * @property {string} [newName] - Optional new name for the import (for simultaneous rename)
 */

/**
 * Move a named import from one package to another.
 * Handles creating new import declarations if needed and cleaning up empty ones.
 * Supports simultaneous renaming via the optional `newName` parameter.
 *
 * @param {import("ts-morph").SourceFile} file - The source file to modify
 * @param {MoveNamedImportsOption} options - Move options
 * @returns {boolean} True if the import was moved, false otherwise
 *
 * @example
 * // Simple move
 * moveNamedImports(file, {
 *   namedImportText: "Button",
 *   from: "@salt-ds/lab",
 *   to: "@salt-ds/core"
 * });
 *
 * // Move and rename
 * moveNamedImports(file, {
 *   namedImportText: "OldButton",
 *   from: "@salt-ds/lab",
 *   to: "@salt-ds/core",
 *   newName: "NewButton"
 * });
 */
export function moveNamedImports(file, { namedImportText, from, to, newName }) {
  if (!namedImportText || !from || !to) {
    console.warn("moveNamedImports: 'namedImportText', 'from', and 'to' parameters are required");
    return false;
  }

  const allDeclarations = file.getImportDeclarations();
  const declarationMap = new Map();

  // Build a map of module specifiers to declarations
  for (const declaration of allDeclarations) {
    const moduleSpecifier = declaration.getModuleSpecifierValue();
    declarationMap.set(moduleSpecifier, declaration);
  }

  // Find and remove the import from source module
  const sourceDeclaration = declarationMap.get(from);
  if (!sourceDeclaration) {
    return false;
  }

  let importFound = false;
  for (const namedImport of sourceDeclaration.getNamedImports()) {
    if (namedImport.getText() === namedImportText) {
      verboseOnlyLog(
        "Removed named import",
        namedImportText,
        "from declaration",
        from
      );

      // Rename before moving if needed
      if (newName && newName !== namedImportText) {
        renameNamedImports(sourceDeclaration, {
          moduleSpecifier: from,
          from: namedImportText,
          to: newName,
        });
      }

      namedImport.remove();
      importFound = true;

      // Clean up empty import declaration
      if (sourceDeclaration.getNamedImports().length === 0) {
        verboseOnlyLog("Removed empty import declaration", from);
        sourceDeclaration.remove();
      }
      break;
    }
  }

  if (!importFound) {
    return false;
  }

  // Add import to destination module
  const importName = newName ?? namedImportText;
  const destinationDeclaration = declarationMap.get(to);

  if (destinationDeclaration) {
    verboseOnlyLog("Added named import", importName, "to declaration", to);
    destinationDeclaration.addNamedImport(importName);
  } else {
    verboseOnlyLog("Created new import declaration for", to, "with", importName);
    file.addImportDeclarations([
      {
        namedImports: [importName],
        moduleSpecifier: to,
      },
    ]);
  }

  return true;
}

/**
 * @deprecated Use `renameNamedImports` instead.
 *
 * Rename a React element name, but not import statement.
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
      const identifierNode = descendant.getTagNameNode();
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
 * @typedef {Object} ReplaceReactAttributeOption
 * @property {string} elementName - The React component name
 * @property {string} attributeFrom - The attribute name to replace
 * @property {string} [valueFrom] - The attribute value to match (if undefined, only attribute name is checked)
 * @property {string} attributeTo - The new attribute name
 * @property {string} [valueTo] - The new attribute value (required if valueFrom is specified)
 * @property {string} [packageName="@salt-ds/core"] - The package name to verify import source
 */

/**
 * Replace prop name/value pair of a React component.
 * Only replaces attributes for components imported from the specified package.
 * Handles aliased imports correctly.
 *
 * @param {import("ts-morph").SourceFile} file - The source file to modify
 * @param {ReplaceReactAttributeOption} options - Replace options
 * @returns {boolean} True if any attributes were replaced, false otherwise
 *
 * @example
 * // Replace both attribute name and value
 * replaceReactAttribute(file, {
 *   elementName: "Button",
 *   attributeFrom: "variant",
 *   valueFrom: '"cta"',
 *   attributeTo: "sentiment",
 *   valueTo: '"accented"',
 *   packageName: "@salt-ds/core"
 * });
 *
 * // Replace only attribute name (keep value)
 * replaceReactAttribute(file, {
 *   elementName: "Button",
 *   attributeFrom: "oldProp",
 *   attributeTo: "newProp"
 * });
 */
export function replaceReactAttribute(
  file,
  {
    elementName,
    attributeFrom,
    valueFrom,
    attributeTo,
    valueTo,
    packageName = "@salt-ds/core",
  }
) {
  if (!elementName || !attributeFrom || !attributeTo) {
    console.warn("replaceReactAttribute: 'elementName', 'attributeFrom', and 'attributeTo' are required");
    return false;
  }

  if (valueFrom !== undefined && valueTo === undefined) {
    console.warn("replaceReactAttribute: 'valueTo' is required when 'valueFrom' is specified");
    return false;
  }

  // Find the actual element name (accounting for aliases)
  const actualElementName = findActualElementName(file, elementName, packageName);
  if (!actualElementName) {
    return false;
  }

  let renamed = false;

  for (const syntaxKind of [
    SyntaxKind.JsxOpeningElement,
    SyntaxKind.JsxSelfClosingElement,
  ]) {
    for (const descendant of file.getDescendantsOfKind(syntaxKind)) {
      const tagNameNode = descendant.getTagNameNode();
      if (!tagNameNode || tagNameNode.getText() !== actualElementName) {
        continue;
      }

      for (const attribute of descendant.getAttributes()) {
        const firstDescendant = attribute.getFirstDescendant();
        if (!firstDescendant || firstDescendant.getText() !== attributeFrom) {
          continue;
        }

        // If no specific value to match, just rename the attribute
        if (valueFrom === undefined) {
          attribute.setName(attributeTo);
          renamed = true;
          continue;
        }

        // Match specific value
        const value = attribute.getFirstChildByKind(SyntaxKind.StringLiteral);
        if (value && value.getText() === valueFrom) {
          verboseOnlyLog(
            `Replace element ${elementName}`,
            actualElementName !== elementName
              ? `(actual ${actualElementName})`
              : "",
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

  return renamed;
}

/**
 * Find the actual element name used in JSX, accounting for import aliases.
 *
 * @param {import("ts-morph").SourceFile} file - The source file
 * @param {string} elementName - The imported element name
 * @param {string} packageName - The package name to verify
 * @returns {string | null} The actual element name used in JSX, or null if not found
 */
function findActualElementName(file, elementName, packageName) {
  const allDeclarations = file.getImportDeclarations();

  for (const declaration of allDeclarations) {
    const moduleSpecifier = declaration.getModuleSpecifierValue();
    if (moduleSpecifier !== packageName) {
      continue;
    }

    for (const namedImport of declaration.getNamedImports()) {
      if (namedImport.getName() === elementName) {
        const aliasNode = namedImport.getAliasNode();
        return aliasNode ? aliasNode.getText() : elementName;
      }
    }
  }

  return null;
}

/**
 * @typedef {Object} WarnRemovedReactAttributeOption
 * @property {string} elementName - The React component name to check
 * @property {Set<string>} allAttributesRemoved - Set of removed attribute names
 */

/**
 * Warn when removed/deprecated props are detected on a component.
 * Logs errors to console with file location for manual fixes.
 *
 * @param {import("ts-morph").SourceFile} file - The source file to check
 * @param {WarnRemovedReactAttributeOption} options - Warning options
 * @returns {void}
 *
 * @example
 * warnRemovedReactAttribute(file, {
 *   elementName: "Button",
 *   allAttributesRemoved: new Set(["deprecated", "oldProp"])
 * });
 */
export function warnRemovedReactAttribute(
  file,
  { elementName, allAttributesRemoved }
) {
  if (!elementName || !allAttributesRemoved) {
    console.warn("warnRemovedReactAttribute: 'elementName' and 'allAttributesRemoved' are required");
    return;
  }

  for (const syntaxKind of [
    SyntaxKind.JsxOpeningElement,
    SyntaxKind.JsxSelfClosingElement,
  ]) {
    for (const descendant of file.getDescendantsOfKind(syntaxKind)) {
      const tagNameNode = descendant.getTagNameNode();
      if (!tagNameNode || tagNameNode.getText() !== elementName) {
        continue;
      }

      for (const attribute of descendant.getAttributes()) {
        const firstDescendant = attribute.getFirstDescendant();
        if (!firstDescendant) {
          continue;
        }

        const attributeText = firstDescendant.getText();
        if (allAttributesRemoved.has(attributeText)) {
          console.error(
            `Error: removed prop \`${attributeText}\` of`,
            elementName,
            "component detected at",
            `${relative(
              process.cwd(),
              file.getFilePath()
            )}:${attribute.getStartLineNumber()}`
          );
        }
      }
    }
  }
}

/**
 * Warn about unknown Salt CSS variables in a line of code.
 * Validates against a set of known valid CSS variables.
 *
 * @param {Set<string>} validCssVarsSet - Set of valid CSS variable names
 * @param {string} line - The line of code to check
 * @param {number} lineIndex - The line index (0-based)
 * @param {string} filePath - The file path for error reporting
 * @returns {void}
 *
 * @example
 * const validVars = new Set(["--salt-color-primary", "--salt-size-unit"]);
 * warnUnknownSaltThemeVars(validVars, "color: var(--salt-invalid);", 42, "src/App.css");
 */
export function warnUnknownSaltThemeVars(
  validCssVarsSet,
  line,
  lineIndex,
  filePath
) {
  if (!validCssVarsSet || !line || lineIndex === undefined || !filePath) {
    return;
  }

  const saltVarMatches = line.match(/--salt[-\w]+\b/g);
  if (!saltVarMatches) {
    return;
  }

  for (const varUsed of saltVarMatches) {
    // Only validate variables with full "--salt-" prefix
    // Component CSS could be matched without the trailing "-"
    if (varUsed.startsWith("--salt-") && !validCssVarsSet.has(varUsed)) {
      console.error(
        "Error: unknown salt css variable",
        varUsed,
        "at",
        `${filePath}:${lineIndex + 1}`
      );
    }
  }
}

/**
 * Create a regex pattern to match CSS variables that need renaming.
 * Uses negative lookahead to ensure exact matches (no suffix matches).
 *
 * @param {Map<string, string>} cssMigrationMap - Map of old variable names to new names
 * @returns {RegExp} A global regex for matching CSS variables
 *
 * @example
 * const map = new Map([["--salt-old", "--salt-new"]]);
 * const regex = getCssRenameCheckRegex(map);
 * // Matches: "--salt-old" but not "--salt-old-extended"
 *
 * @warning
 * The returned regex has the 'g' flag and maintains internal state (lastIndex).
 * Be mindful of side effects when reusing the regex in multiple operations.
 * Reset with `regex.lastIndex = 0` between uses if needed.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex#avoiding_side_effects
 */
export function getCssRenameCheckRegex(cssMigrationMap) {
  if (!cssMigrationMap || cssMigrationMap.size === 0) {
    // Return a regex that matches nothing
    return /(?!.*)/g;
  }

  const varEndDetector = "(?![\\w-])";
  const pattern = Array.from(cssMigrationMap.keys())
    // Escape special regex characters in variable names
    .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  return new RegExp(`(${pattern})${varEndDetector}`, "g");
}

/**
 * Migrate CSS variables in a line of code using a rename map and regex.
 *
 * @param {string} line - The line of code containing CSS variables
 * @param {RegExp} renameRegex - The regex pattern to match variables (from getCssRenameCheckRegex)
 * @param {Map<string, string>} renameMap - Map of old variable names to new names
 * @returns {string} The line with CSS variables renamed
 *
 * @example
 * const map = new Map([["--salt-old", "--salt-new"]]);
 * const regex = getCssRenameCheckRegex(map);
 * const result = migrateCssVar("color: var(--salt-old);", regex, map);
 * // Returns: "color: var(--salt-new);"
 */
export function migrateCssVar(line, renameRegex, renameMap) {
  if (!line || !renameRegex || !renameMap) {
    return line || "";
  }

  return line.replaceAll(renameRegex, (match) => {
    const to = renameMap.get(match);
    if (!to) {
      console.warn(`migrateCssVar: No mapping found for ${match}`);
      return match;
    }
    verboseOnlyLog("Replace css var", match, "to", to);
    return to;
  });
}

/**
 * Detects if SaltProviderNext is imported in any of the source files
 * @param {import('ts-morph').SourceFile[]} files - Array of source files to check
 * @returns {boolean} True if SaltProviderNext is found, false otherwise
 */
export function detectSaltProviderNext(files) {
  for (const file of files) {
    const importDeclarations = file.getImportDeclarations();
    for (const importDecl of importDeclarations) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      if (
        moduleSpecifier === "@salt-ds/core" ||
        moduleSpecifier === "@salt-ds/lab"
      ) {
        const namedImports = importDecl.getNamedImports();
        for (const namedImport of namedImports) {
          if (namedImport.getName() === "SaltProviderNext") {
            verboseOnlyLog(
              "Detected SaltProviderNext in",
              file.getFilePath()
            );
            return true;
          }
        }
      }
    }
  }
  return false;
}
