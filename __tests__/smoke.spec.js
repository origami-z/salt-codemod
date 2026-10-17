import { describe, expect, test } from "vitest";
import { LATEST_SUPPORTED_VERSION, DEFAULT_FROM_VERSION } from "../utils/args";
import * as tsm from "ts-morph";
import { react100 } from "../migration/core100";
import { react110 } from "../migration/core110";
import { react120 } from "../migration/core120";
import { react130 } from "../migration/core130";
import { react150 } from "../migration/core150";
import { react160 } from "../migration/core160";
import { react180 } from "../migration/core180";
import { react1110 } from "../migration/core1110";
import { react1120 } from "../migration/core1120";
import { react1130 } from "../migration/core1130";
import { react1140 } from "../migration/core1140";
import { react1150 } from "../migration/core1150";
import { react1160 } from "../migration/core1160";
import { react1170 } from "../migration/core1170";
import { react1190 } from "../migration/core1190";
import { react1200 } from "../migration/core1200";
import { react1210 } from "../migration/core1210";
import { react1230 } from "../migration/core1230";
import { react1240 } from "../migration/core1240";
import { react1250 } from "../migration/core1250";
import { react1270 } from "../migration/core1270";
import { react1280 } from "../migration/core1280";
import { react1300 } from "../migration/core1300";
import { react1320 } from "../migration/core1320";
import { react1330 } from "../migration/core1330";
import { react1360 } from "../migration/core1360";
import { react1372 } from "../migration/core1372";
import { react1380 } from "../migration/core1380";
import { react1390 } from "../migration/core1390";
import { react1400 } from "../migration/core1400";
import { react1410 } from "../migration/core1410";
import { react1420 } from "../migration/core1420";
import { react1430 } from "../migration/core1430";
import { react1440 } from "../migration/core1440";
import { react1450 } from "../migration/core1450";
import { react1460 } from "../migration/core1460";
import { react1471 } from "../migration/core1471";
import { react1480 } from "../migration/core1480";
import { react1530 } from "../migration/core1530";
import { react1560 } from "../migration/core1560";
import { react1580 } from "../migration/core1580";
import { react1610 } from "../migration/core1610";
import { react1620 } from "../migration/core1620";
import { react1630 } from "../migration/core1630";
import { react1640 } from "../migration/core1640";
import { react1641 } from "../migration/core1641";
import { react1650 } from "../migration/core1650";
import { react1660 } from "../migration/core1660";
import { react1690 } from "../migration/core1690";
import { react1710 } from "../migration/core1710";
import { react1730 } from "../migration/core1730";
import { css1720RenameMap } from "../migration/core1720";
import { css1730RenameMap } from "../migration/core1730";
import { getCssRenameCheckRegex, migrateCssVar } from "../migration/utils";

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

// Just to make sure no missing imports
describe("Smoke test all migration script will run", () => {
  const file =
    createFileWithContent(`import { ComponentOne, ComponentThree } from "package-a";
    export const App = () => {
      return (
          <ComponentOne />
      );
    };`);
  test("react100", () => {
    react100(file);
  });
  test("react110", () => {
    react110(file);
  });
  test("react120", () => {
    react120(file);
  });
  test("react130", () => {
    react130(file);
  });
  test("react150", () => {
    react150(file);
  });
  test("react160", () => {
    react160(file);
  });
  test("react180", () => {
    react180(file);
  });
  test("react1110", () => {
    react1110(file);
  });
  test("react1120", () => {
    react1120(file);
  });
  test("react1130", () => {
    react1130(file);
  });
  test("react1140", () => {
    react1140(file);
  });
  test("react1150", () => {
    react1150(file);
  });
  test("react1160", () => {
    react1160(file);
  });
  test("react1170", () => {
    react1170(file);
  });
  test("react1190", () => {
    react1190(file);
  });
  test("react1200", () => {
    react1200(file);
  });
  test("react1210", () => {
    react1210(file);
  });
  test("react1230", () => {
    react1230(file);
  });
  test("react1240", () => {
    react1240(file);
  });
  test("react1250", () => {
    react1250(file);
  });
  test("react1270", () => {
    react1270(file);
  });
  test("react1280", () => {
    react1280(file);
  });
  test("react1300", () => {
    react1300(file);
  });
  test("react1320", () => {
    const file =
      createFileWithContent(`import { UNSTABLE_SaltProviderNext } from "@salt-ds/core";
    export const App = () => {
      return (
          <UNSTABLE_SaltProviderNext><div>1</div></UNSTABLE_SaltProviderNext>
      );
    };`);
    react1320(file);

    const actualResultText = file.getText();

    expect(
      actualResultText.includes(
        "<SaltProviderNext><div>1</div></SaltProviderNext>"
      )
    ).toBeTruthy();
  });
  test("react1330", () => {
    react1330(file);
  });

  test("react1360", () => {
    const file = createFileWithContent(`import { Button } from "@salt-ds/core";
    export const App = () => {
      return (
        <>
          <Button variant="cta">CTA</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
        </>
      );
    };`);
    react1360(file);

    const actualResultText = file.getText();

    expect(
      actualResultText.includes(`<Button sentiment="accented">CTA</Button>`)
    ).toBeTruthy();

    expect(
      actualResultText.includes(`<Button sentiment="neutral">Primary</Button>`)
    ).toBeTruthy();

    expect(
      actualResultText.includes(
        `<Button appearance="transparent">Secondary</Button>`
      )
    ).toBeTruthy();
  });
  test("react1372", () => {
    const file =
      createFileWithContent(`import { SuccessSmallIcon } from "@salt-ds/icons";
  export const App = () => {
    return (
      <SuccessSmallIcon />
    );
  };`);
    react1372(file);

    const actualResultText = file.getText();

    expect(actualResultText.includes(`<CheckmarkIcon />`)).toBeTruthy();
  });
  test("react1380", () => {
    react1380(file);
  });
  test("react1390", () => {
    const file =
      createFileWithContent(`import { SkipLink } from "@salt-ds/lab";
  export const App = () => {
    return (
      <SkipLink href="#main">Skip to main</SkipLink>
    );
  };`);
    react1390(file);

    const actualResultText = file.getText();

    expect(actualResultText.includes(`from "@salt-ds/core"`)).toBeTruthy();
  });
  test("react1400", () => {
    const file =
      createFileWithContent(`import { CircularProgress, LinearProgress } from "@salt-ds/lab";
  export const App = () => {
    return (
      <>
        <CircularProgress />
        <LinearProgress value={50} />
      </>
    );
  };`);
    react1400(file);

    const actualResultText = file.getText();

    expect(actualResultText.includes(`from "@salt-ds/core"`)).toBeTruthy();
  });
  test("react1410", () => {
    const file =
      createFileWithContent(`import { Switch } from "@salt-ds/lab";
  export const App = () => {
    return (
      <Switch checked={true} />
    );
  };`);
    react1410(file);

    const actualResultText = file.getText();

    expect(actualResultText.includes(`from "@salt-ds/core"`)).toBeTruthy();
  });
  test("react1420", () => {
    const file =
      createFileWithContent(`import { Dialog, Option } from "@salt-ds/lab";
  export const App = () => {
    return (
      <Dialog open={true}>
        <Option value="1">Option 1</Option>
      </Dialog>
    );
  };`);
    react1420(file);

    const actualResultText = file.getText();

    expect(actualResultText.includes(`from "@salt-ds/core"`)).toBeTruthy();
  });
  test("react1430", () => {
    const file =
      createFileWithContent(`import { SegmentedButtonGroup, DialogHeader } from "@salt-ds/lab";
  export const App = () => {
    return (
      <>
        <SegmentedButtonGroup />
        <DialogHeader />
      </>
    );
  };`);
    react1430(file);

    const actualResultText = file.getText();

    expect(actualResultText.includes(`from "@salt-ds/core"`)).toBeTruthy();
  });
  test("react1440", () => {
    const file =
      createFileWithContent(`import { Slider, RangeSlider } from "@salt-ds/lab";
  export const App = () => {
    return (
      <>
        <Slider min={0} max={100} />
        <RangeSlider min={0} max={100} />
      </>
    );
  };`);
    react1440(file);

    const actualResultText = file.getText();

    expect(actualResultText.includes(`from "@salt-ds/core"`)).toBeTruthy();
  });
  test("react1450", () => {
    const file =
      createFileWithContent(`import { Stepper } from "@salt-ds/lab";
  export const App = () => {
    return (
      <Stepper />
    );
  };`);
    react1450(file);

    const actualResultText = file.getText();

    expect(actualResultText.includes(`from "@salt-ds/core"`)).toBeTruthy();
  });
  test("react1460", () => {
    const file =
      createFileWithContent(`import { Overlay, OverlayTrigger } from "@salt-ds/lab";
  export const App = () => {
    return (
      <Overlay>
        <OverlayTrigger />
      </Overlay>
    );
  };`);
    react1460(file);

    const actualResultText = file.getText();

    expect(actualResultText.includes(`from "@salt-ds/core"`)).toBeTruthy();
  });
  test("react1471", () => {
    const file =
      createFileWithContent(`import { Divider } from "@salt-ds/lab";
  export const App = () => {
    return (
      <Divider />
    );
  };`);
    react1471(file);

    const actualResultText = file.getText();

    expect(actualResultText.includes(`from "@salt-ds/core"`)).toBeTruthy();
  });
  test("react1480", () => {
    const file =
      createFileWithContent(`import { Collapsible, VerticalNavigation } from "@salt-ds/lab";
  export const App = () => {
    return (
      <>
        <Collapsible />
        <VerticalNavigation />
      </>
    );
  };`);
    react1480(file);

    const actualResultText = file.getText();

    expect(actualResultText.includes(`from "@salt-ds/core"`)).toBeTruthy();
  });
  test("react1530", () => {
    const file =
      createFileWithContent(`import { NumberInput } from "@salt-ds/lab";
  export const App = () => {
    return (
      <NumberInput value={42} />
    );
  };`);
    react1530(file);

    const actualResultText = file.getText();

    expect(actualResultText.includes(`from "@salt-ds/core"`)).toBeTruthy();
  });
  test("react1560", () => {
    const file = createFileWithContent(`import { Table, TR, TD } from "@salt-ds/lab";
  export const App = () => <Table><tbody><TR><TD /></TR></tbody></Table>;`);
    react1560(file);
    expect(file.getText()).toContain(`import { Table, TR, TD } from "@salt-ds/core";`);
  });
  test("react1580", () => {
    const file = createFileWithContent(`import { Kbd } from "@salt-ds/lab";
  export const App = () => <Kbd>cmd</Kbd>;`);
    react1580(file);
    expect(file.getText()).toContain(`import { Kbd } from "@salt-ds/core";`);
  });
  test("react1610", () => {
    const file = createFileWithContent(`import { Rating, TabsNext, TabNext, TabNextTrigger, TabListNext, TabBar } from "@salt-ds/lab";
  export const App = () => (
    <>
      <Rating />
      <TabsNext>
        <TabBar>
          <TabListNext>
            <TabNext value="a"><TabNextTrigger>A</TabNextTrigger></TabNext>
          </TabListNext>
        </TabBar>
      </TabsNext>
    </>
  );`);
    react1610(file);
    const text = file.getText();
    expect(text).not.toContain("@salt-ds/lab");
    expect(text).not.toContain("Next");
    expect(text).toContain("<Tabs>");
    expect(text).toContain("<TabTrigger>A</TabTrigger>");
    expect(text).toContain(`from "@salt-ds/core"`);
  });
  test("react1610 skips rename clashing with legacy lab Tabs", () => {
    const file = createFileWithContent(`import { Tabs, TabsNext } from "@salt-ds/lab";
  export const App = () => <><Tabs /><TabsNext /></>;`);
    react1610(file);
    expect(file.getText()).toContain(`import { Tabs, TabsNext } from "@salt-ds/lab";`);
  });
  test("react1620", () => {
    const file = createFileWithContent(`import { SidePanel, useSidePanel } from "@salt-ds/lab";
  export const App = () => <SidePanel />;`);
    react1620(file);
    expect(file.getText()).toContain(`import { SidePanel, useSidePanel } from "@salt-ds/core";`);
  });
  test("react1630", () => {
    const file = createFileWithContent(`import { Tree, TreeNode } from "@salt-ds/lab";
  export const App = () => <Tree><TreeNode value="a" /></Tree>;`);
    react1630(file);
    expect(file.getText()).toContain(`import { Tree, TreeNode } from "@salt-ds/core";`);
  });
  test("react1640", () => {
    const file = createFileWithContent(`import { DatePicker, MegaMenuSection, MegaMenuContent, Tabstrip } from "@salt-ds/lab";
  export const App = () => (
    <>
      <DatePicker selectionVariant="single" />
      <MegaMenuSection />
      <MegaMenuContent />
      <Tabstrip />
    </>
  );`);
    react1640(file);
    const text = file.getText();
    expect(text).toContain(`import { DatePicker } from "@salt-ds/date-components";`);
    expect(text).toContain(`import { MegaMenuGroups, MegaMenuSupportingContent, Tabstrip } from "@salt-ds/lab";`);
    expect(text).toContain("<MegaMenuGroups />");
    expect(text).toContain("<MegaMenuSupportingContent />");
  });
  test("react1641", () => {
    const file = createFileWithContent(`import { MegaMenuHeader, MegaMenuItem, MegaMenuSupportingContent, MegaMenuSupportingActions } from "@salt-ds/lab";
  export const App = () => (
    <>
      <MegaMenuHeader />
      <MegaMenuItem />
      <MegaMenuSupportingContent />
      <MegaMenuSupportingActions />
    </>
  );`);
    react1641(file);
    expect(file.getText()).toContain(
      `import { MegaMenuGroupHeading, MegaMenuListItem, MegaMenuAside, MegaMenuActions } from "@salt-ds/lab";`
    );
  });
  test("react1650", () => {
    const file = createFileWithContent(`import { ToolbarNext, TooltrayNext } from "@salt-ds/lab";
  export const App = () => <ToolbarNext><TooltrayNext /></ToolbarNext>;`);
    react1650(file);
    const text = file.getText();
    expect(text).toContain(`import { Toolbar, Tooltray } from "@salt-ds/core";`);
    expect(text).toContain("<Toolbar><Tooltray /></Toolbar>");
  });
  test("react1660", () => {
    const file = createFileWithContent(`import { MegaMenu, MegaMenuTrigger, MegaMenuPanel } from "@salt-ds/lab";
  export const App = () => <MegaMenu><MegaMenuTrigger /><MegaMenuPanel /></MegaMenu>;`);
    react1660(file);
    expect(file.getText()).toContain(`import { MegaMenu, MegaMenuTrigger, MegaMenuPanel } from "@salt-ds/core";`);
  });
  test("react1690", () => {
    const file = createFileWithContent(`import { BreadcrumbsNext, BreadcrumbNext } from "@salt-ds/lab";
  export const App = () => <BreadcrumbsNext><BreadcrumbNext href="/" /></BreadcrumbsNext>;`);
    react1690(file);
    const text = file.getText();
    expect(text).toContain(`import { Breadcrumbs, Breadcrumb } from "@salt-ds/core";`);
    expect(text).toContain(`<Breadcrumbs><Breadcrumb href="/" /></Breadcrumbs>`);
  });
  test("react1710", () => {
    const file = createFileWithContent(`import { LinkButton } from "@salt-ds/lab";
  export const App = () => <LinkButton href="/" />;`);
    react1710(file);
    expect(file.getText()).toContain(`import { LinkButton } from "@salt-ds/core";`);
  });
  test("react1730", () => {
    const file = createFileWithContent(`import { OnSolidButton } from "@salt-ds/lab";
  export const App = () => <OnSolidButton />;`);
    react1730(file);
    expect(file.getText()).toContain(`import { OnSolidButton } from "@salt-ds/core";`);
  });
  test("css1720 and css1730 chain to latest font weight token", () => {
    const map = new Map([...css1720RenameMap, ...css1730RenameMap]);
    const regex = getCssRenameCheckRegex(map);
    expect(
      migrateCssVar("font-weight: var(--salt-text-h1-fontWeight-strong);", regex, map)
    ).toBe("font-weight: var(--salt-text-heading-fontWeight-bolder);");
    expect(
      migrateCssVar("font-family: var(--salt-text-h2-fontFamily);", regex, map)
    ).toBe("font-family: var(--salt-text-heading-fontFamily);");
  });
});
