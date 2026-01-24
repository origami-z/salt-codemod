import { gt, lte } from "semver";

/**
 * Helper function to apply a migration if the version is in range.
 *
 * @param {import("semver").SemVer} version - The version to check
 * @param {import("semver").SemVer} fromVersion - The starting version (exclusive)
 * @param {import("semver").SemVer} toVersion - The ending version (inclusive)
 * @param {Function} migrationFn - The migration function to execute
 * @param {*} context - The context to pass to the migration function (typically a file or source)
 * @returns {boolean} True if migration was applied, false otherwise
 *
 * @example
 * const v100 = parse("1.0.0");
 * applyMigrationIfInRange(v100, fromVersion, toVersion, react100, file);
 */
export function applyMigrationIfInRange(version, fromVersion, toVersion, migrationFn, context) {
  if (gt(version, fromVersion) && lte(version, toVersion)) {
    migrationFn(context);
    return true;
  }
  return false;
}
