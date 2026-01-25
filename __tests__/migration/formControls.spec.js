import { describe, expect, test } from "vitest";
import * as tsm from "ts-morph";
import { formControls } from "../../migration/formControls.js";

/**
 * @param {string} sourceFileString
 * @returns {import("ts-morph").SourceFile}
 */
function createFileWithContent(sourceFileString) {
  const project = new tsm.Project({ useInMemoryFileSystem: true });
  const file = project.createSourceFile("test.tsx", sourceFileString);
  return file;
}

describe("formControls migration", () => {
  describe("label prop migration", () => {
    test("migrates label prop to FormFieldLabel child", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField label="Username">
      <input />
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>Username</FormFieldLabel>");
      expect(result).not.toContain('label="Username"');
      // FormFieldLabel should be imported from @salt-ds/core (along with FormField after move)
      expect(result).toContain("FormFieldLabel");
      expect(result).toContain(`from "@salt-ds/core"`);
    });

    test("migrates dynamic label prop", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

const labels = { username: "Username" };
export const App = () => {
  return (
    <FormField label={labels.username}>
      <input />
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>{labels.username}</FormFieldLabel>");
      expect(result).not.toContain("label={labels.username}");
    });
  });

  describe("helperText prop migration", () => {
    test("migrates helperText prop to FormFieldHelperText child", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField helperText="Enter your username">
      <input />
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain("<FormFieldHelperText>Enter your username</FormFieldHelperText>");
      expect(result).not.toContain('helperText="Enter your username"');
      expect(result).toContain("FormFieldHelperText");
    });

    test("migrates dynamic helperText prop", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = ({ error }) => {
  return (
    <FormField helperText={error ? "Invalid input" : "Enter value"}>
      <input />
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain('<FormFieldHelperText>{error ? "Invalid input" : "Enter value"}</FormFieldHelperText>');
    });
  });

  describe("combined migrations", () => {
    test("migrates both label and helperText props", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField label="Email" helperText="We'll never share your email">
      <input type="email" />
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>Email</FormFieldLabel>");
      expect(result).toContain("<FormFieldHelperText>We'll never share your email</FormFieldHelperText>");
      expect(result).not.toContain('label="Email"');
      expect(result).not.toContain('helperText="We\'ll never share your email"');
    });

    test("adds both imports to existing @salt-ds/core declaration", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";
import { Button } from "@salt-ds/core";

export const App = () => {
  return (
    <FormField label="Email" helperText="Required">
      <input type="email" />
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain("FormFieldLabel");
      expect(result).toContain("FormFieldHelperText");
      expect(result).toContain(`from "@salt-ds/core"`);
    });
  });

  describe("import migration", () => {
    test("moves FormField import from @salt-ds/lab to @salt-ds/core", () => {
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
      formControls(file);
      const result = file.getText();
      expect(result).toContain(`import { FormField`);
      expect(result).toContain(`from "@salt-ds/core"`);
      expect(result).not.toContain(`@salt-ds/lab`);
    });

    test("merges FormField import with existing @salt-ds/core imports", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";
import { Button, Text } from "@salt-ds/core";

export const App = () => {
  return (
    <FormField label="Name">
      <Button>Submit</Button>
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      // FormField should be added to existing @salt-ds/core import
      expect(result).toContain("FormField");
      expect(result).toContain("Button");
      expect(result).toContain("FormFieldLabel");
      expect(result).not.toContain(`@salt-ds/lab`);
    });

    test("removes empty @salt-ds/lab import declaration", () => {
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
      formControls(file);
      const result = file.getText();
      expect(result).not.toContain("@salt-ds/lab");
    });

    test("preserves other @salt-ds/lab imports", () => {
      const file = createFileWithContent(
        `import { FormField, DatePicker } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField label="Date">
      <DatePicker />
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain(`import { DatePicker } from "@salt-ds/lab"`);
      expect(result).toContain("FormField");
      expect(result).toContain(`from "@salt-ds/core"`);
    });
  });

  describe("edge cases", () => {
    test("handles multiple FormField components", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <form>
      <FormField label="First Name">
        <input />
      </FormField>
      <FormField label="Last Name">
        <input />
      </FormField>
      <FormField label="Email" helperText="Required">
        <input type="email" />
      </FormField>
    </form>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>First Name</FormFieldLabel>");
      expect(result).toContain("<FormFieldLabel>Last Name</FormFieldLabel>");
      expect(result).toContain("<FormFieldLabel>Email</FormFieldLabel>");
      expect(result).toContain("<FormFieldHelperText>Required</FormFieldHelperText>");
    });

    test("handles FormField without label or helperText", () => {
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
      formControls(file);
      const result = file.getText();
      // Should still move the import but not add any child elements
      expect(result).toContain(`import { FormField } from "@salt-ds/core"`);
      expect(result).not.toContain("FormFieldLabel");
      expect(result).not.toContain("FormFieldHelperText");
    });

    test("does not modify FormField from other packages", () => {
      const file = createFileWithContent(
        `import { FormField } from "@other-ui/forms";

export const App = () => {
  return (
    <FormField label="Name">
      <input />
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain('label="Name"');
      expect(result).not.toContain("FormFieldLabel");
      expect(result).toContain(`@other-ui/forms`);
    });

    test("handles aliased FormField import", () => {
      const file = createFileWithContent(
        `import { FormField as SaltFormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <SaltFormField label="Name">
      <input />
    </SaltFormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      // Alias should be preserved and used
      expect(result).toContain("<SaltFormField>");
      expect(result).toContain("</SaltFormField>");
      expect(result).toContain("<FormFieldLabel>Name</FormFieldLabel>");
    });

    test("preserves other props on FormField", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField
      label="Name"
      required
      validationStatus="error"
      className="custom-field"
    >
      <input />
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain("required");
      expect(result).toContain('validationStatus="error"');
      expect(result).toContain('className="custom-field"');
      expect(result).toContain("<FormFieldLabel>Name</FormFieldLabel>");
    });

    test("handles FormField with spread props", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

const fieldProps = { required: true };
export const App = () => {
  return (
    <FormField label="Name" {...fieldProps}>
      <input />
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain("{...fieldProps}");
      expect(result).toContain("<FormFieldLabel>Name</FormFieldLabel>");
    });

    test("handles nested FormField components", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

export const App = () => {
  return (
    <FormField label="Outer">
      <div>
        <FormField label="Inner">
          <input />
        </FormField>
      </div>
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>Outer</FormFieldLabel>");
      expect(result).toContain("<FormFieldLabel>Inner</FormFieldLabel>");
    });

    test("handles FormField inside map function", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

const fields = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
];

export const App = () => {
  return (
    <form>
      {fields.map((field) => (
        <FormField key={field.name} label={field.label}>
          <input name={field.name} />
        </FormField>
      ))}
    </form>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>{field.label}</FormFieldLabel>");
      expect(result).not.toContain("label={field.label}");
    });
  });

  describe("TypeScript specific cases", () => {
    test("handles FormField with TypeScript generic type", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";

interface FormData {
  name: string;
}

export const App = () => {
  return (
    <FormField label="Name">
      <input />
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>Name</FormFieldLabel>");
      expect(result).toContain("interface FormData");
    });

    test("handles FormField in a typed component", () => {
      const file = createFileWithContent(
        `import { FormField } from "@salt-ds/lab";
import { FC } from "react";

interface Props {
  label: string;
}

export const MyFormField: FC<Props> = ({ label }) => {
  return (
    <FormField label={label}>
      <input />
    </FormField>
  );
};`
      );
      formControls(file);
      const result = file.getText();
      expect(result).toContain("<FormFieldLabel>{label}</FormFieldLabel>");
      expect(result).toContain("FC<Props>");
    });
  });
});
