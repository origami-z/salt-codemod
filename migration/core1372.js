import {
  renameNamedImports,
  moveNamedImports,
  warnRemovedReactAttribute,
} from "./utils.js";

// Nov 15, 2024
export function react1372(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Ficons%401.13.0
  for (const declaration of file.getImportDeclarations()) {
    // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.34
    [
      ["SuccessSmallIcon", "CheckmarkIcon"],
      ["SuccessSmallSolidIcon", "CheckmarkSolidIcon"],
      ["SuccessIcon", "CheckmarkIcon"],
      ["SuccessSolidIcon", "CheckmarkSolidIcon"],
      ["StepSuccessIcon", "SuccessCircleIcon"],
      ["SuccessTickIcon", "CheckmarkIcon"],
    ].forEach(([from, to]) => {
      renameNamedImports(declaration, {
        moduleSpecifier: "@salt-ds/icons",
        from,
        to,
      });
    });
  }

  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.55
  // TODO: Tabs update

  /**
- <TabstripNext defaultValue={defaultValue} align="center">
-   {tabs.map((label) => (
-    <TabNext value={label} key={label}>
-       {label}
-    </TabNext>
-   ))}
- </TabstripNext>
+ <TabsNext defaultValue={defaultValue}>
+   <TabBar divider={divider} inset={inset}>
+     <TabListNext appearance={appearance}>
+       {tabs.map((label) => (
+         <TabNext value={label} key={label}>
+           <TabNextTrigger>{label}</TabNextTrigger>
+           <TabNextAction onClick={click} >...</TabNextAction>
+         </TabNext>
+       ))}
+     </TabListNext>
+   </TabBar>
+ </TabsNext>
 */
}
