import process from "process";
import { relative } from "path";
import { warnLog } from "../utils/log.js";
import { moveNamedImports, renameNamedImports } from "./utils.js";

// Jun 10, 2026
export function react1640(file) {
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Fcore%401.64.0
  // https://github.com/jpmorganchase/salt-ds/releases/tag/%40salt-ds%2Flab%401.0.0-alpha.95

  // Date components are no longer re-exported from lab, moved to @salt-ds/date-components
  let movedDateComponents = false;
  [
    "Calendar",
    "CalendarBaseProps",
    "CalendarDayProps",
    "CalendarGrid",
    "CalendarGridProps",
    "CalendarMultiselectOffsetProps",
    "CalendarMultiselectRangeProps",
    "CalendarMultiselectSingleProps",
    "CalendarNavigation",
    "CalendarNavigationProps",
    "CalendarOffsetProps",
    "CalendarProps",
    "CalendarRangeProps",
    "CalendarSingleProps",
    "CalendarWeekHeader",
    "CalendarWeekHeaderProps",
    "DateInputRange",
    "DateInputRangeDetails",
    "DateInputRangeProps",
    "DateInputRangeValue",
    "DateInputSingle",
    "DateInputSingleDetails",
    "DateInputSingleProps",
    "DateParserField",
    "DatePicker",
    "DatePickerActions",
    "DatePickerActionsBaseProps",
    "DatePickerActionsProps",
    "DatePickerBaseProps",
    "DatePickerHelperText",
    "DatePickerHelperTextProps",
    "DatePickerMain",
    "DatePickerOpenChangeReason",
    "DatePickerOverlay",
    "DatePickerOverlayProps",
    "DatePickerOverlayProvider",
    "DatePickerPanelBaseProps",
    "DatePickerProps",
    "DatePickerRangeGridPanel",
    "DatePickerRangeGridPanelProps",
    "DatePickerRangeInput",
    "DatePickerRangeInputProps",
    "DatePickerRangePanel",
    "DatePickerRangePanelProps",
    "DatePickerRangeProps",
    "DatePickerSingleGridPanel",
    "DatePickerSingleGridPanelProps",
    "DatePickerSingleInput",
    "DatePickerSingleInputProps",
    "DatePickerSingleProps",
    "DatePickerState",
    "DatePickerTrigger",
    "DatePickerTriggerProps",
    "DateRangeSelection",
    "DayStatus",
    "LocalizationProvider",
    "LocalizationProviderContext",
    "LocalizationProviderProps",
    "LocalizationProviderValue",
    "RangeDatePickerState",
    "SingleDatePickerState",
    "SingleDateSelection",
    "UseCalendarMultiselectOffsetProps",
    "UseCalendarMultiselectRangeProps",
    "UseCalendarMultiselectSingleProps",
    "UseCalendarOffsetProps",
    "UseCalendarProps",
    "UseCalendarRangeProps",
    "UseCalendarReturn",
    "UseCalendarSelectionBaseProps",
    "UseCalendarSelectionMultiselectOffsetProps",
    "UseCalendarSelectionMultiselectRangeProps",
    "UseCalendarSelectionMultiselectSingleProps",
    "UseCalendarSelectionOffsetProps",
    "UseCalendarSelectionProps",
    "UseCalendarSelectionRangeProps",
    "UseCalendarSelectionSingleProps",
    "UseCalendarSingleProps",
    "UseDatePickerContextProps",
    "defaultRangeValidator",
    "isDateRangeSelection",
    "renderCalendarDayProps",
    "useCalendar",
    "useCalendarDay",
    "useCalendarDayProps",
    "useCalendarSelection",
    "useCalendarSelectionDay",
    "useDatePickerContext",
    "useDatePickerOverlay",
    "useLocalization",
  ].forEach((x) => {
    movedDateComponents =
      moveNamedImports(file, {
        namedImportText: x,
        from: "@salt-ds/lab",
        to: "@salt-ds/date-components",
      }) || movedDateComponents;
  });
  if (movedDateComponents) {
    warnLog(
      "Date components are moved to @salt-ds/date-components, make sure it's installed. Used in",
      relative(process.cwd(), file.getFilePath())
    );
  }

  // MegaMenu API changes in lab
  for (const declaration of file.getImportDeclarations()) {
    [
      ["MegaMenuSection", "MegaMenuGroups"],
      ["MegaMenuSectionProps", "MegaMenuGroupsProps"],
      ["MegaMenuContent", "MegaMenuSupportingContent"],
      ["MegaMenuContentProps", "MegaMenuSupportingContentProps"],
    ].forEach(([from, to]) => {
      renameNamedImports(declaration, {
        moduleSpecifier: "@salt-ds/lab",
        from,
        to,
      });
    });
  }
}

export const css1640RenameMap = [
  ["--saltMegaMenuSection-columnWidth", "--saltMegaMenuGroups-columnWidth"],
];
