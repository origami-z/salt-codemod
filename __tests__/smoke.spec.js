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
});
