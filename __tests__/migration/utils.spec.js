import { describe, expect, test } from "vitest";
import * as tsm from "ts-morph";
import {
  detectSaltProviderNext,
  getCssRenameCheckRegex,
  moveNamedImports,
  renameReactElementName,
  replaceReactAttribute,
  migrateCssVar,
  movePropToNewChildElement,
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

describe("detectSaltProviderNext", () => {
  test("detects SaltProviderNext from @salt-ds/core", () => {
    const file = createFileWithContent(
      `import { SaltProvider, SaltProviderNext } from "@salt-ds/core";

  export const App = () => {
    return (
      <SaltProviderNext>
        <div>Hello</div>
      </SaltProviderNext>
    );
  };`
    );

    const project = file.getProject();
    const sourceFiles = project.getSourceFiles();
    const actual = detectSaltProviderNext(sourceFiles);

    expect(actual).toBe(true);
  });

  test("detects SaltProviderNext from @salt-ds/lab", () => {
    const file = createFileWithContent(
      `import { SaltProviderNext } from "@salt-ds/lab";

  export const App = () => {
    return (
      <SaltProviderNext>
        <div>Hello</div>
      </SaltProviderNext>
    );
  };`
    );

    const project = file.getProject();
    const sourceFiles = project.getSourceFiles();
    const actual = detectSaltProviderNext(sourceFiles);

    expect(actual).toBe(true);
  });

  test("returns false when only SaltProvider is imported", () => {
    const file = createFileWithContent(
      `import { SaltProvider } from "@salt-ds/core";

  export const App = () => {
    return (
      <SaltProvider>
        <div>Hello</div>
      </SaltProvider>
    );
  };`
    );

    const project = file.getProject();
    const sourceFiles = project.getSourceFiles();
    const actual = detectSaltProviderNext(sourceFiles);

    expect(actual).toBe(false);
  });

  test("returns false when no salt-ds imports exist", () => {
    const file = createFileWithContent(
      `import React from "react";

  export const App = () => {
    return <div>Hello</div>;
  };`
    );

    const project = file.getProject();
    const sourceFiles = project.getSourceFiles();
    const actual = detectSaltProviderNext(sourceFiles);

    expect(actual).toBe(false);
  });

  test("returns false for empty source files array", () => {
    const actual = detectSaltProviderNext([]);
    expect(actual).toBe(false);
  });

  test("detects SaltProviderNext in multiple files", () => {
    const project = new tsm.Project({ useInMemoryFileSystem: true });

    project.createSourceFile(
      "file1.tsx",
      `import { Button } from "@salt-ds/core";

  export const Component1 = () => <Button>Click</Button>;`
    );

    project.createSourceFile(
      "file2.tsx",
      `import { SaltProviderNext } from "@salt-ds/core";

  export const Component2 = () => (
    <SaltProviderNext>
      <div>Content</div>
    </SaltProviderNext>
  );`
    );

    const sourceFiles = project.getSourceFiles();
    const actual = detectSaltProviderNext(sourceFiles);

    expect(actual).toBe(true);
  });

  test("returns false when SaltProviderNext is from different package", () => {
    const file = createFileWithContent(
      `import { SaltProviderNext } from "some-other-package";

  export const App = () => {
    return (
      <SaltProviderNext>
        <div>Hello</div>
      </SaltProviderNext>
    );
  };`
    );

    const project = file.getProject();
    const sourceFiles = project.getSourceFiles();
    const actual = detectSaltProviderNext(sourceFiles);

    expect(actual).toBe(false);
  });
});

describe("movePropToNewChildElement", () => {
  describe("basic functionality", () => {
    test("moves string literal prop to new child element", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField label="Name">
      <input />
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>Name</FormFieldLabel>");
      expect(result).not.toContain('label="Name"');
      expect(result).toContain(`import { FormFieldLabel } from "@salt-ds/core";`);
    });

    test("moves JSX expression prop with variable to new child element", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

const labelText = "Name";
export const App = () => {
  return (
    <FormField label={labelText}>
      <input />
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>{labelText}</FormFieldLabel>");
      expect(result).not.toContain("label={labelText}");
    });

    test("moves JSX expression prop with function call to new child element", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField label={getLabel()}>
      <input />
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>{getLabel()}</FormFieldLabel>");
      expect(result).not.toContain("label={getLabel()}");
    });

    test("moves template literal prop to new child element", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

const name = "Field";
export const App = () => {
  return (
    <FormField label={\`Enter \${name}\`}>
      <input />
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>{`Enter ${name}`}</FormFieldLabel>");
      expect(result).not.toContain("label={`Enter ${name}`}");
    });
  });

  describe("import handling", () => {
    test("adds import to existing declaration from same package", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";
import { Button } from "@salt-ds/core";

export const App = () => {
  return (
    <FormField label="Name">
      <input />
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain(`import { Button, FormFieldLabel } from "@salt-ds/core";`);
    });

    test("does not duplicate import if already present", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";
import { FormFieldLabel } from "@salt-ds/core";

export const App = () => {
  return (
    <FormField label="Name">
      <input />
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      // Count occurrences of FormFieldLabel import
      const importMatches = result.match(/FormFieldLabel/g);
      // Should appear once in import, once as opening tag, once as closing tag
      expect(importMatches?.length).toBe(3);
    });

    test("creates new import declaration when package not imported", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField label="Name">
      <input />
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain(`import { FormFieldLabel } from "@salt-ds/core";`);
    });

    test("works without newChildPackageName (no import added)", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField label="Name">
      <input />
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
      });
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>Name</FormFieldLabel>");
      expect(result).not.toContain(`from "@salt-ds/core"`);
    });
  });

  describe("component aliasing", () => {
    test("handles aliased import correctly", () => {
      const file = createFileWithContent(
        `import { FormField as FF } from "@salt-ds/lab";

export const App = () => {
  return (
    <FF label="Name">
      <input />
    </FF>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      // The alias should be preserved
      expect(result).toContain("<FF>");
      expect(result).toContain("</FF>");
      expect(result).toContain("<FormFieldLabel>Name</FormFieldLabel>");
    });
  });

  describe("edge cases", () => {
    test("does not modify component from different package", () => {
      const file = createFileWithContent(
        `import { FormField } from "@other-package/forms";

export const App = () => {
  return (
    <FormField label="Name">
      <input />
    </FormField>
  );
};`
      );
      const result = movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      expect(result).toBe(false);
      expect(file.getText()).toContain('label="Name"');
    });

    test("does not modify when prop is not present", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField>
      <input />
    </FormField>
  );
};`
      );
      const result = movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      expect(result).toBe(false);
      expect(file.getText()).not.toContain("FormFieldLabel");
    });

    test("handles multiple instances of the same component", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <div>
      <FormField label="First">
        <input />
      </FormField>
      <FormField label="Second">
        <input />
      </FormField>
    </div>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>First</FormFieldLabel>");
      expect(result).toContain("<FormFieldLabel>Second</FormFieldLabel>");
      expect(result).not.toContain('label="First"');
      expect(result).not.toContain('label="Second"');
    });

    test("preserves other props on the element", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField label="Name" required disabled className="my-field">
      <input />
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain("required");
      expect(result).toContain("disabled");
      expect(result).toContain('className="my-field"');
      expect(result).not.toContain('label="Name"');
    });

    test("preserves existing children", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField label="Name">
      <input type="text" />
      <span>Helper</span>
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      // Note: TS AST transformation may strip space before />, so check for the key parts
      expect(result).toContain('<input type="text"');
      expect(result).toContain("<span>Helper</span>");
      expect(result).toContain("<FormFieldLabel>Name</FormFieldLabel>");
    });

    test("returns false for missing required parameters", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField label="Name">
      <input />
    </FormField>
  );
};`
      );

      expect(
        movePropToNewChildElement(file, {
          elementName: "FormField",
          propName: "label",
          newChildName: "FormFieldLabel",
        })
      ).toBe(false);

      expect(
        movePropToNewChildElement(file, {
          packageName: "@salt-ds/lab",
          propName: "label",
          newChildName: "FormFieldLabel",
        })
      ).toBe(false);

      expect(
        movePropToNewChildElement(file, {
          packageName: "@salt-ds/lab",
          elementName: "FormField",
          newChildName: "FormFieldLabel",
        })
      ).toBe(false);

      expect(
        movePropToNewChildElement(file, {
          packageName: "@salt-ds/lab",
          elementName: "FormField",
          propName: "label",
        })
      ).toBe(false);
    });

    test("handles component with no import", () => {
      const file = createFileWithContent(
        `export const App = () => {
  return (
    <FormField label="Name">
      <input />
    </FormField>
  );
};`
      );
      const result = movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      expect(result).toBe(false);
    });

    test("handles JSX expression with object property access", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

const config = { label: "Name" };
export const App = () => {
  return (
    <FormField label={config.label}>
      <input />
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>{config.label}</FormFieldLabel>");
    });

    test("handles conditional expression in prop", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = ({ isRequired }) => {
  return (
    <FormField label={isRequired ? "Required Name" : "Name"}>
      <input />
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain('<FormFieldLabel>{isRequired ? "Required Name" : "Name"}</FormFieldLabel>');
    });

    test("handles spread attributes on element", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

const props = { disabled: true };
export const App = () => {
  return (
    <FormField label="Name" {...props}>
      <input />
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>Name</FormFieldLabel>");
      expect(result).toContain("{...props}");
    });
  });

  describe("nested components", () => {
    test("handles nested FormField components", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField label="Outer">
      <FormField label="Inner">
        <input />
      </FormField>
    </FormField>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>Outer</FormFieldLabel>");
      expect(result).toContain("<FormFieldLabel>Inner</FormFieldLabel>");
    });

    test("only transforms target component, not similarly named components", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";
import { CustomFormField } from "./custom";

export const App = () => {
  return (
    <div>
      <FormField label="Salt Field">
        <input />
      </FormField>
      <CustomFormField label="Custom Field">
        <input />
      </CustomFormField>
    </div>
  );
};`
      );
      movePropToNewChildElement(file, {
        packageName: "@salt-ds/lab",
        elementName: "FormField",
        propName: "label",
        newChildName: "FormFieldLabel",
        newChildPackageName: "@salt-ds/core",
      });
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>Salt Field</FormFieldLabel>");
      expect(result).toContain('label="Custom Field"');
    });
  });
});
