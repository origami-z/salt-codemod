import { describe, expect, test } from "vitest";
import * as tsm from "ts-morph";
import {
  getCssRenameCheckRegex,
  moveNamedImports,
  renameReactElementName,
  replaceReactAttribute,
  migrateCssVar,
} from "../../migration/utils.js";

/**
 *
 * @param {string} sourceFileString
 * @returns
 */
function createFileWithContent(sourceFileString) {
  const project = new tsm.Project({ useInMemoryFileSystem: true });
  const file = project.createSourceFile("test.tsx", sourceFileString);
  return file;
}

describe("CSS migration", () => {
  const cssMap = new Map([
    ["--salt-a", "--salt-a-new"],
    ["--salt-b-1", "--salt-b-100"],
  ]);

  describe("getCssRenameCheckRegex", () => {
    test("regex match var intended", () => {
      const actual = getCssRenameCheckRegex(cssMap);
      expect(actual.test("--my-var: var(--salt-a);")).toBe(true);
      actual.lastIndex = 0;
      expect(actual.test("--my-var: var(--salt-b-1);")).toBe(true);
      actual.lastIndex = 0;
    });
    test("regex does not match var with other suffix", () => {
      const actual = getCssRenameCheckRegex(cssMap);
      expect(actual.test("--my-var: var(--salt-a-extra);")).toBe(false);
      actual.lastIndex = 0;
      expect(actual.test("--my-var: var(--salt-b);")).toBe(false);
      actual.lastIndex = 0;
      expect(actual.test("--my-var: var(--salt-b-100);")).toBe(false);
      actual.lastIndex = 0;
    });
  });

  describe("migrateCssVar", () => {
    const regexCheck = getCssRenameCheckRegex(cssMap);
    test("migrate all instances of the same var", () => {
      const actual = migrateCssVar(
        "--my-var: var(--salt-a); --my-var: var(--salt-a);",
        regexCheck,
        cssMap
      );
      expect(actual).toEqual(
        "--my-var: var(--salt-a-new); --my-var: var(--salt-a-new);"
      );
    });
    test("does not result in a infinite loop when new value includes old value", () => {
      const actual = migrateCssVar(
        "--my-var: var(--salt-b-1);",
        regexCheck,
        cssMap
      );
      expect(actual).toEqual("--my-var: var(--salt-b-100);");
    });
  });
});

describe("moveNamedImports", () => {
  test("move import to another existing import declaration", () => {
    const file =
      createFileWithContent(`import { ComponentOne, ComponentThree } from "package-a";
  import { ComponentTwo } from "package-b";

  export const App = () => {
    return (
        <ComponentOne />
    );
  };`);
    moveNamedImports(file, {
      namedImportText: "ComponentOne",
      from: "package-a",
      to: "package-b",
    });
    const actualResultText = file.getText();
    expect(actualResultText).toContain(
      `import { ComponentTwo, ComponentOne } from "package-b";`
    );
    expect(actualResultText).toContain(
      `import { ComponentThree } from "package-a";`
    );
  });

  test("move to a newly created import declaration", () => {
    const file = createFileWithContent(
      `import { ComponentOne, ComponentThree } from "package-a";

  export const App = () => {
    return (
        <ComponentOne />
    );
  };`
    );
    moveNamedImports(file, {
      namedImportText: "ComponentOne",
      from: "package-a",
      to: "package-b",
    });
    const actualResultText = file.getText();
    expect(actualResultText).toContain(
      `import { ComponentOne } from "package-b";`
    );
    expect(actualResultText).toContain(
      `import { ComponentThree } from "package-a";`
    );
  });

  test("removes empty import declaration after move", () => {
    const file = createFileWithContent(
      `import { ComponentOne } from "package-a";

  export const App = () => {
    return (
        <ComponentOne />
    );
  };`
    );
    moveNamedImports(file, {
      namedImportText: "ComponentOne",
      from: "package-a",
      to: "package-b",
    });
    const actualResultText = file.getText();
    expect(actualResultText).toContain(
      `import { ComponentOne } from "package-b";`
    );
    expect(actualResultText).not.toContain(`package-a`);
  });

  test("move and rename at the same time", () => {
    const file = createFileWithContent(
      `import { ComponentNext } from "package-one";
  
  export const App = () => {
    return (
        <ComponentNext />
    );
  };`
    );
    moveNamedImports(file, {
      namedImportText: "ComponentNext",
      newName: "NewComponent",
      from: "package-one",
      to: "package-two",
    });
    const actualResultText = file.getText();
    expect(actualResultText).toContain(
      `import { NewComponent } from "package-two";`
    );
    expect(actualResultText).toContain(`<NewComponent />`);
  });
});

describe("renameReactElementName", () => {
  test("renames both opening and closing tag", () => {
    const file =
      createFileWithContent(`import { ComponentOne } from "package-a";
    export const App = () => {
      return (
          <ComponentOne>
            Some text
          </ComponentOne>
      );
    };`);
    renameReactElementName(file, {
      from: "ComponentOne",
      to: "AnotherComponent",
    });
    const actualResultText = file.getText();

    expect(actualResultText).toContain(`<AnotherComponent>`);
    expect(actualResultText).toContain(`</AnotherComponent>`);
    expect(actualResultText).not.toContain(`<ComponentOne>`);
    expect(actualResultText).not.toContain(`</ComponentOne>`);
  });
  test("renames self closing tag", () => {
    const file =
      createFileWithContent(`import { ComponentOne } from "package-a";
    export const App = () => {
      return (
          <ComponentOne />
      );
    };`);
    renameReactElementName(file, {
      from: "ComponentOne",
      to: "AnotherComponent",
    });
    const actualResultText = file.getText();

    expect(actualResultText).toContain(`<AnotherComponent />`);
    expect(actualResultText).not.toContain(`<ComponentOne />`);
  });
});

describe("replaceReactAttribute", () => {
  test("renames prop name and value for a component with children", () => {
    const file =
      createFileWithContent(`import { ComponentOne } from "package-a";
    export const App = () => {
      return (
          <ComponentOne prop1="a">
            Some text
          </ComponentOne>
      );
    };`);
    replaceReactAttribute(file, {
      elementName: "ComponentOne",
      attributeFrom: "prop1",
      valueFrom: `"a"`,
      attributeTo: "prop2",
      valueTo: `"b"`,
      packageName: "package-a",
    });
    const actualResultText = file.getText();
    expect(actualResultText).toContain(`<ComponentOne prop2="b">`);
  });

  test("renames prop name if only attribute is specificed", () => {
    const file =
      createFileWithContent(`import { ComponentOne } from "package-a";
    export const App = () => {
      return (
          <ComponentOne prop1="a">
            Some text
          </ComponentOne>
      );
    };`);
    replaceReactAttribute(file, {
      elementName: "ComponentOne",
      attributeFrom: "prop1",
      attributeTo: "prop2",
      packageName: "package-a",
    });
    const actualResultText = file.getText();
    expect(actualResultText).toContain(`<ComponentOne prop2="a">`);
  });

  test("will not rename component from unmatched package name", () => {
    const file =
      createFileWithContent(`import { ComponentOne } from "package-a";
      export const App = () => {
        return (
            <ComponentOne prop1="a">
              Some text
            </ComponentOne>
        );
      };`);
    replaceReactAttribute(file, {
      elementName: "ComponentOne",
      attributeFrom: "prop1",
      valueFrom: `"a"`,
      attributeTo: "prop2",
      valueTo: `"b"`,
      packageName: "DIFFERENT_PACAKGE_NAME!!",
    });
    const actualResultText = file.getText();
    expect(actualResultText).not.toContain(`<ComponentOne prop2="b">`);
  });

  test("will update named import with changed name (as)", () => {
    const file =
      createFileWithContent(`import { ComponentOne as ComponentTWO } from "package-a";
    export const App = () => {
      return (
          <ComponentTWO prop1="a">
            Some text
          </ComponentTWO>
      );
    };`);
    replaceReactAttribute(file, {
      elementName: "ComponentOne",
      attributeFrom: "prop1",
      valueFrom: `"a"`,
      attributeTo: "prop2",
      valueTo: `"b"`,
      packageName: "package-a",
    });
    const actualResultText = file.getText();
    expect(actualResultText).toContain(`<ComponentTWO prop2="b">`);
  });
});
