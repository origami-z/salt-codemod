import { moveNamedImports } from "./utils.js";

// Oct 15, 2026
export function react1730(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.73.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.106

  // OnSolidButton moved from lab to core
  ["OnSolidButton", "OnSolidButtonProps"].forEach((x) => {
    moveNamedImports(file, {
      namedImportText: x,
      from: "@salt-ds/lab",
      to: "@salt-ds/core",
    });
  });
}

/**
 * https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ftheme%401.48.0
 *
 * Level specific tokens are also mapped, so they end up in the latest token
 * when migrating across both 1.72.0 and 1.73.0.
 */
export const css1730RenameMap = [
  "--salt-text",
  "--salt-text-action",
  "--salt-text-display",
  "--salt-text-heading",
  "--salt-text-label",
  "--salt-text-notation",
  ...[1, 2, 3, 4].flatMap((n) => [`--salt-text-h${n}`, `--salt-text-display${n}`]),
].flatMap((prefix) => {
  // Level specific tokens resolve to the shared heading / display token
  const target = prefix
    .replace(/^--salt-text-h\d$/, "--salt-text-heading")
    .replace(/^--salt-text-display\d$/, "--salt-text-display");
  return [
    [`${prefix}-fontWeight-small`, `${target}-fontWeight-lighter`],
    [`${prefix}-fontWeight-strong`, `${target}-fontWeight-bolder`],
  ];
});
