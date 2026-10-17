import process from "process";
import { relative } from "path";
import { warnLog } from "../utils/log.js";
import { moveNamedImports } from "./utils.js";

// Aug 11, 2026
export function react1690(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.69.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.102

  // BreadcrumbsNext and related components moved from lab to core, and renamed
  [
    ["BreadcrumbsNext", "Breadcrumbs"],
    ["BreadcrumbsNextProps", "BreadcrumbsProps"],
    ["BreadcrumbNext", "Breadcrumb"],
    ["BreadcrumbNextProps", "BreadcrumbProps"],
    ["BreadcrumbNextTrigger", "BreadcrumbTrigger"],
    ["BreadcrumbNextTriggerProps", "BreadcrumbTriggerProps"],
    ["BreadcrumbNextLabel", "BreadcrumbLabel"],
    ["BreadcrumbNextLabelProps", "BreadcrumbLabelProps"],
  ].forEach(([from, to]) => {
    moveNamedImports(file, {
      namedImportText: from,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
      newName: to,
    });
  });

  // Legacy Breadcrumbs removed from lab, which has a different API to the one in core
  const legacyBreadcrumbs = new Set([
    "Breadcrumbs",
    "BreadcrumbsProps",
    "Breadcrumb",
    "BreadcrumbProps",
  ]);
  for (const declaration of file.getImportDeclarations()) {
    if (declaration.getModuleSpecifierValue() !== "@salt-ds/lab") {
      continue;
    }
    for (const namedImport of declaration.getNamedImports()) {
      if (legacyBreadcrumbs.has(namedImport.getName())) {
        warnLog(
          `Legacy ${namedImport.getName()} is removed from @salt-ds/lab, migrate to the one in @salt-ds/core manually at`,
          `${relative(
            process.cwd(),
            file.getFilePath()
          )}:${namedImport.getStartLineNumber()}`
        );
      }
    }
  }
}

/**
 * https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ftheme%401.44.0
 */
export const css1690RenameMap = [
  ["--salt-container-primary-borderColor", "--salt-container-bold-borderColor"],
  ["--salt-container-primary-borderColor-disabled", "--salt-container-bold-borderColor-disabled"],
  ["--salt-container-secondary-borderColor", "--salt-container-bold-borderColor"],
  ["--salt-container-secondary-borderColor-disabled", "--salt-container-bold-borderColor-disabled"],
  ["--salt-container-tertiary-borderColor", "--salt-container-bold-borderColor"],
  ["--salt-container-tertiary-borderColor-disabled", "--salt-container-bold-borderColor-disabled"],
];
