import { describe, expect, test } from "vitest";
import * as tsm from "ts-morph";
import {
  getCssRenameCheckRegex,
  moveNamedImports,
  renameReactElementName,
  replaceReactAttribute,
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

describe("getCssRenameCheckRegex", () => {
  test("regex match var intended", () => {
    const actual = getCssRenameCheckRegex(
      new Map([["--salt-a", "--salt-a-new"]])
    );
    expect(actual.test("--my-var: var(--salt-a);")).toBe(true);
    expect(actual.test("--my-var: var(--salt-b);")).toBe(false);
  });
  test("regex does not match var with other suffix", () => {
    const actual = getCssRenameCheckRegex(
      new Map([["--salt-a", "--salt-a-new"]])
    );
    expect(actual.test("--my-var: var(--salt-a-extra);")).toBe(false);
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
  test("Renames prop name and value for a component with children", () => {
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
    });
    const actualResultText = file.getText();
    expect(actualResultText).toContain(`<ComponentOne prop2="b">`);
  });
});
