import {
  moveNamedImports,
  renameImportModuleSpecifier,
  renameNamedImports,
  replaceReactAttribute,
} from "./utils.js";

// Release note: https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.0.0

/**
 *
 * @param {import("ts-morph").SourceFile} file
 */
export function react100(file, saltProviderRenamed) {
  // Imports
  for (const declaration of file.getImportDeclarations()) {
    // Rename import declaration first
    renameImportModuleSpecifier(declaration, {
      from: "@jpmorganchase/uitk-theme",
      to: "@salt-ds/theme",
      partial: true,
    });
    renameImportModuleSpecifier(declaration, {
      from: "@jpmorganchase/uitk-core",
      to: "@salt-ds/core",
    });
    renameImportModuleSpecifier(declaration, {
      from: "@jpmorganchase/uitk-lab",
      to: "@salt-ds/lab",
    });
    renameImportModuleSpecifier(declaration, {
      from: "@jpmorganchase/uitk-icons",
      to: "@salt-ds/icons",
    });
    renameImportModuleSpecifier(declaration, {
      from: "@jpmorganchase/uitk-grid",
      to: "@salt-ds/data-grid",
    });

    // Rename named imports with new declaration
    saltProviderRenamed =
      saltProviderRenamed ||
      renameNamedImports(declaration, {
        moduleSpecifier: "@salt-ds/core",
        from: "ToolkitProvider",
        to: "SaltProvider",
      });
  }

  // Components / Types moved from core to lab
  [
    "Card",
    "CardProps",
    "Panel",
    "PanelProps",
    // Layouts
    "DeckLayout",
    "DeckLayoutProps",
    "SplitLayout",
    "SplitLayoutProps",
    "LayerLayout",
    "LayerLayoutProps",
    "ParentChildLayout",
    "ParentChildLayoutProps",
    // Tooltip
    "Tooltip",
    "TooltipProps",
    "useTooltip",
    // Forms
    "FormField",
    "FormFieldProps",
    "Switch",
    "SwitchProps",
    "Input",
    "InputProps",
    "Checkbox",
    "CheckboxProps",
  ].forEach((c) =>
    moveNamedImports(file, {
      namedImportText: c,
      from: "@salt-ds/core",
      to: "@salt-ds/lab",
    })
  );

  // Components / Types moved from lab to core
  ["Link", "LinkProps", "Text", "TextProps", "H1", "H2", "H3", "H4"].forEach(
    (c) =>
      moveNamedImports(file, {
        namedImportText: c,
        from: "@salt-ds/lab",
        to: "@salt-ds/core",
      })
  );

  // Component props
  if (saltProviderRenamed) {
    renameReactElementName(file, {
      from: "ToolkitProvider",
      to: "SaltProvider",
    });
  }

  // <Panel emphasis="medium"> => <Panel variant="primary">
  // <Panel emphasis="high"> => <Panel variant="secondary">
  replaceReactAttribute(file, {
    elementName: "Panel",
    attributeFrom: "emphasis",
    valueFrom: `"medium"`,
    attributeTo: "variant",
    valueTo: `"primary"`,
  });
  replaceReactAttribute(file, {
    elementName: "Panel",
    attributeFrom: "emphasis",
    valueFrom: `"high"`,
    attributeTo: "variant",
    valueTo: `"secondary"`,
  });

  // BorderItem position rename
  replaceReactAttribute(file, {
    elementName: "BorderItem",
    attributeFrom: "position",
    valueFrom: `"header"`,
    attributeTo: "position",
    valueTo: `"north"`,
  });
  replaceReactAttribute(file, {
    elementName: "BorderItem",
    attributeFrom: "position",
    valueFrom: `"main"`,
    attributeTo: "position",
    valueTo: `"center"`,
  });
  replaceReactAttribute(file, {
    elementName: "BorderItem",
    attributeFrom: "position",
    valueFrom: `"footer"`,
    attributeTo: "position",
    valueTo: `"south"`,
  });
  replaceReactAttribute(file, {
    elementName: "BorderItem",
    attributeFrom: "position",
    valueFrom: `"left"`,
    attributeTo: "position",
    valueTo: `"west"`,
  });
  replaceReactAttribute(file, {
    elementName: "BorderItem",
    attributeFrom: "position",
    valueFrom: `"right"`,
    attributeTo: "position",
    valueTo: `"east"`,
  });
  return saltProviderRenamed;
}

// Everything here is salt prefixed, assuming uitk prefix rename is performed first
export const css100RenameMap = [
  ["--salt-container-background", "--salt-container-primary-background"],
  [
    "--salt-container-background-medium",
    "--salt-container-secondary-background",
  ],
  ["--salt-container-background-low", "--salt-container-tertiary-background"],

  ["--salt-editable-background", "--salt-editable-primary-background"],
  ["--salt-editable-background-low", "--salt-editable-primary-background"],
  ["--salt-editable-background-medium", "--salt-editable-secondary-background"],
  ["--salt-editable-background-high", "--salt-editable-tertiary-background"],
  ["--salt-editable-text-color", "--salt-text-primary-foreground"],

  [
    "--salt-selectable-background-selected",
    "--salt-selectable-cta-background-selected",
  ],
  [
    "--salt-selectable-foreground-selected",
    "--salt-selectable-cta-foreground-selected",
  ],

  ["--salt-separable-border-color-1", "--salt-separable-tertiary-borderColor"],

  [
    "--salt-status-info-background-high",
    "--salt-status-info-background-emphasize",
  ],
  [
    "--salt-status-success-background-high",
    "--salt-status-success-background-emphasize",
  ],
  [
    "--salt-status-warning-background-high",
    "--salt-status-warning-background-emphasize",
  ],
  [
    "--salt-status-error-background-high",
    "--salt-status-error-background-emphasize",
  ],

  ["--salt-text-primary-color", "--salt-text-primary-foreground"],
  ["--salt-text-secondary-color", "--salt-text-secondary-foreground"],

  ["--salt-spacing-unit", "--salt-size-unit"],

  ["--salt-color-grey-10", "--salt-color-gray-10"],
  ["--salt-color-grey-20", "--salt-color-gray-20"],
  ["--salt-color-grey-30", "--salt-color-gray-30"],
  ["--salt-color-grey-40", "--salt-color-gray-40"],
  ["--salt-color-grey-50", "--salt-color-gray-50"],
  ["--salt-color-grey-60", "--salt-color-gray-60"],
  ["--salt-color-grey-70", "--salt-color-gray-70"],
  ["--salt-color-grey-80", "--salt-color-gray-80"],
  ["--salt-color-grey-90", "--salt-color-gray-90"],
  ["--salt-color-grey-100", "--salt-color-gray-100"],
  ["--salt-color-grey-200", "--salt-color-gray-200"],
  ["--salt-color-grey-300", "--salt-color-gray-300"],
  ["--salt-color-grey-400", "--salt-color-gray-400"],
  ["--salt-color-grey-500", "--salt-color-gray-500"],
  ["--salt-color-grey-600", "--salt-color-gray-600"],
  ["--salt-color-grey-700", "--salt-color-gray-700"],
  ["--salt-color-grey-800", "--salt-color-gray-800"],
  ["--salt-color-grey-900", "--salt-color-gray-900"],

  ["--salt-zIndex-appheader", "--salt-zIndex-appHeader"],
  ["--salt-zIndex-dragobject", "--salt-zIndex-dragObject"],
  ["--salt-zIndex-contextmenu", "--salt-zIndex-contextMenu"],
  ["--salt-zIndex-tooltip", "--salt-zIndex-flyover"],
];
