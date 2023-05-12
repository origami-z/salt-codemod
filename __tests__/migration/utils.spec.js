import { getCssRenameCheckRegex } from "../../migration/utils.js";

describe("getCssRenameCheckRegex", () => {
  test("regex match var intended", () => {
    const actual = getCssRenameCheckRegex(new Map([["--salt-a", "--salt-b"]]));
    expect(actual.test("--my-var: var(--salt-a);")).toBe(true);
    expect(actual.test("--my-var: var(--salt-b);")).toBe(false);
  });
  test("regex does not match var with other suffix", () => {
    const actual = getCssRenameCheckRegex(new Map([["--salt-a", "--salt-b"]]));
    expect(actual.test("--my-var: var(--salt-a-extra);")).toBe(false);
  });
});
