import { warnRemovedReactAttribute } from "./utils.js";

// https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.33.0
export function react1330(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.51
  // TrackerStep
  warnRemovedReactAttribute(file, {
    elementName: "TrackerStep",
    allAttributesRemoved: new Set(["state"]),
  });
}
