import { SyntaxKind, Node, JsxElement, ts } from "ts-morph";
import { verboseOnlyDimLog, verboseOnlyLog } from "../utils/log.js";
import process from "process";
import { relative } from "path";

/**
 * @typedef {Object} RenameImportModuleSpecifierOption
 * @property {string} from package name to be renamed from
 * @property {string} to package name rename to
 * @property {boolean} partial whether rename on partial match
 */

/**
 *
 * @param {import("ts-morph").ImportDeclaration} declaration
 * @param {RenameImportModuleSpecifierOption} option
 * @returns
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
      verboseOnlyDimLog("Rename import from", specifier, "to", newSpecifier);
      declaration.setModuleSpecifier(newSpecifier);
      renamed = true;
    }
  } else {
    if (specifier === from) {
      verboseOnlyDimLog("Rename import from", from, "to", to);
      declaration.setModuleSpecifier(to);
      renamed = true;
    }
  }
  return renamed;
}

/**
 * Used when a component is renamed from A -> B. All usage of the import will also be renamed.
 *
 * ```
 * for (const declaration of file.getImportDeclarations()) {...}
 * ```
 *
 * @param {import("ts-morph").ImportDeclaration} declaration
 */
export function renameNamedImports(declaration, { moduleSpecifier, from, to }) {
  const specifier = declaration.getModuleSpecifierValue();
  let renamed = false;
  if (specifier === moduleSpecifier) {
    const allNamedImports = declaration.getNamedImports();
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
        renamed = true;

        namedImport.renameAlias(from + "Renamed");
        namedImport.setName(to);
        namedImport.removeAliasWithRename();
      }
    }
  }
  return renamed;
}

/**
 * Move a named import from one package to another.
 *
 * Optional `newName` in option, in case a component gets renamed at the same time.
 * @param {import("ts-morph").SourceFile} file
 */
export function moveNamedImports(file, { namedImportText, from, to, newName }) {
  const allDeclarations = file.getImportDeclarations();

  let importRemovedFromFrom = false;
  const declarationMap = new Map();

  for (const declaration of allDeclarations) {
    const moduleSpecifier = declaration.getModuleSpecifierValue();
    declarationMap.set(moduleSpecifier, declaration);

    if (moduleSpecifier === from) {
      for (const namedImport of declaration.getNamedImports()) {
        if (namedImport.getText() === namedImportText) {
          verboseOnlyLog(
            "Removed named import",
            namedImportText,
            "from declaration",
            moduleSpecifier
          );
          importRemovedFromFrom = true;
          if (newName && newName !== namedImportText) {
            renameNamedImports(declaration, {
              moduleSpecifier,
              from: namedImportText,
              to: newName,
            });
          }
          namedImport.remove();

          if (declaration.getNamedImports().length === 0) {
            verboseOnlyLog(
              "Removed remained empty import line",
              moduleSpecifier
            );
            declaration.remove();
          }
          break;
        }
      }
    }
  }
  if (importRemovedFromFrom) {
    const newImportName = newName ?? namedImportText;
    if (declarationMap.has(to)) {
      addImportToDeclaration(declarationMap.get(to), {
        importName: newImportName,
      });
    } else {
      addImportToNewDeclarations(file, {
        importName: newImportName,
        moduleSpecifier: to,
      });
    }
  }

  return importRemovedFromFrom;
}

/**
 * Add a new namedImport to an existing declaration
 *
 * @param {import("ts-morph").ImportDeclaration} declaration
 */
export function addImportToDeclaration(declaration, { importName }) {
  verboseOnlyLog(
    "Added named import",
    importName,
    "to declaration",
    declaration.getModuleSpecifierValue()
  );
  declaration.addNamedImport(importName);
}

/**
 * Add a new namedImport to a net new declaration.
 *
 * @param {import("ts-morph").SourceFile} file
 */
export function addImportToNewDeclarations(
  file,
  { importName, moduleSpecifier }
) {
  verboseOnlyLog(
    "New named import",
    importName,
    "added to new declaration",
    moduleSpecifier
  );
  file.addImportDeclarations([
    {
      namedImports: [importName],
      moduleSpecifier,
    },
  ]);
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
 * Replace prop name/value to a new pair of a component.
 *
 * @param {import("ts-morph").SourceFile} file
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
  // Try find matching package name first

  const allDeclarations = file.getImportDeclarations();
  let actualElementName = elementName;
  let foundMatchNamedImport = false;
  for (const declaration of allDeclarations) {
    const moduleSpecifier = declaration.getModuleSpecifierValue();
    if (moduleSpecifier === packageName) {
      for (const namedImport of declaration.getNamedImports()) {
        if (namedImport.getName() === elementName) {
          foundMatchNamedImport = true;
          const aliasNode = namedImport.getAliasNode();
          if (aliasNode) {
            actualElementName = aliasNode.getText();
          }
        }
      }
    }
  }
  if (!foundMatchNamedImport) return false;

  let renamed = false;

  for (const syntaxKind of [
    SyntaxKind.JsxOpeningElement,
    SyntaxKind.JsxSelfClosingElement,
  ]) {
    for (const descendant of file.getDescendantsOfKind(syntaxKind)) {
      if (descendant.getTagNameNode().getText() === actualElementName) {
        for (const attribute of descendant.getAttributes()) {
          if (attribute.getFirstDescendant().getText() === attributeFrom) {
            const value = attribute.getFirstChildByKind(
              SyntaxKind.StringLiteral
            );
            if (valueFrom === undefined) {
              attribute.setName(attributeTo);
              renamed = true;
            } else if (value && value.getText() === valueFrom) {
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
    }
  }
  return renamed;
}

/**
 * Warn when detected removed props of a component.
 *
 * @param {import("ts-morph").SourceFile} file
 */
export function warnRemovedReactAttribute(
  file,
  { elementName, allAttributesRemoved }
) {
  for (const syntaxKind of [
    SyntaxKind.JsxOpeningElement,
    SyntaxKind.JsxSelfClosingElement,
  ]) {
    for (const descendant of file.getDescendantsOfKind(syntaxKind)) {
      if (descendant.getTagNameNode().getText() === elementName) {
        for (const attribute of descendant.getAttributes()) {
          const attributeText = attribute.getFirstDescendant().getText();
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
 * !WARN: Be mindful of regex side effect when reusing regex
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex#avoiding_side_effects
 *
 * @param {Map<string, string>} cssMigrationMap
 * @returns {RegExp}
 */
export function getCssRenameCheckRegex(cssMigrationMap) {
  const varEndDetector = "(?![\\w-])";
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
  return line.replaceAll(renameRegex, (match, offset, string) => {
    const to = renameMap.get(match);
    verboseOnlyLog("Replace css var", match, "to", to);
    return to;
  });
}

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
export function movePropToNewChildElement(
  file,
  { packageName, elementName, propName, newChildName, newChildPackageName }
) {
  const allDeclarations = file.getImportDeclarations();

  let newChildAdded = false;

  for (const declaration of allDeclarations) {
    const moduleSpecifier = declaration.getModuleSpecifierValue();

    if (moduleSpecifier === packageName) {
      for (const namedImport of declaration.getNamedImports()) {
        if (namedImport.getText() === elementName) {
          verboseOnlyLog(
            "Found component named",
            elementName,
            "from declaration",
            packageName
          );

          // Below may be useful to find node directly from declaration with using name matching
          // const nodes = classDeclaration.findReferencesAsNodes();

          // Temporary rename component name with "Renamed" suffix
          const tempEleName = elementName + "Renamed";
          namedImport.renameAlias(tempEleName);

          for (const descendant of file.getDescendantsOfKind(
            SyntaxKind.JsxOpeningElement
          )) {
            if (descendant.getTagNameNode().getText() === tempEleName) {
              for (const attribute of descendant.getAttributes()) {
                const attributeText = attribute.getFirstDescendant().getText();
                if (attributeText === propName) {
                  verboseOnlyLog(
                    "Found prop named",
                    propName,
                    "on element",
                    elementName,
                    "with temporary name",
                    tempEleName
                  );

                  const element = descendant.getFirstAncestorByKind(
                    SyntaxKind.JsxElement
                  );
                  element.transform((traversal) => {
                    const currentNode = traversal.currentNode;
                    if (ts.isJsxElement(currentNode)) {
                      const attributesProperties =
                        currentNode.openingElement.attributes.properties;
                      for (const property of attributesProperties) {
                        if (ts.isJsxAttribute(property)) {
                          if (property.name.escapedText === propName) {
                            if (property.initializer) {
                              const newChildElement =
                                traversal.factory.createJsxElement(
                                  traversal.factory.createJsxOpeningElement(
                                    traversal.factory.createIdentifier(
                                      newChildName
                                    ),
                                    undefined, // what is type argument?
                                    traversal.factory.createJsxAttributes([])
                                  ),
                                  ts.isStringLiteral(property.initializer)
                                    ? [
                                        traversal.factory.createJsxText(
                                          property.initializer.text
                                        ),
                                      ]
                                    : // otherwise it should be a JsxExpression, which we can move directly to a new element as children?
                                      [property.initializer],
                                  traversal.factory.createJsxClosingElement(
                                    traversal.factory.createIdentifier(
                                      newChildName
                                    )
                                  )
                                );

                              const prevChildren =
                                traversal.visitChildren().children;

                              const newCurrent =
                                traversal.factory.createJsxElement(
                                  traversal.factory.createJsxOpeningElement(
                                    currentNode.openingElement.tagName,
                                    currentNode.openingElement.typeArguments,
                                    traversal.factory.createJsxAttributes(
                                      attributesProperties.filter(
                                        (p) => p.name.escapedText !== propName
                                      )
                                    )
                                  ),
                                  [
                                    // adds a bit of smart formatting, keep existing indentation
                                    ...(prevChildren.length &&
                                    ts.isJsxText(prevChildren[0]) &&
                                    prevChildren[0]
                                      .containsOnlyTriviaWhiteSpaces
                                      ? [prevChildren[0]]
                                      : []),
                                    newChildElement,
                                    ...traversal.visitChildren().children,
                                  ],
                                  currentNode.closingElement
                                );

                              newChildAdded = true;

                              return newCurrent;
                            }
                          }
                        }
                      }
                    }

                    return currentNode;
                  });

                  // Break the loop for getAttributes()
                  break;
                }
              }
            }
          }

          // Rename back to original elementName
          namedImport.renameAlias(elementName);
        }
      }
    }
  }

  if (newChildAdded && newChildPackageName) {
    const existingDecl = allDeclarations.find(
      (d) => d.getModuleSpecifierValue() === newChildPackageName
    );

    if (existingDecl) {
      if (
        !existingDecl
          .getNamedImports()
          .find((n) => n.getName() === newChildName)
      ) {
        addImportToDeclaration(existingDecl, { importName: newChildName });
      }
      // else, skip if namedImport existed
    } else {
      addImportToNewDeclarations(file, {
        importName: newChildName,
        moduleSpecifier: newChildPackageName,
      });
    }
  }
}
