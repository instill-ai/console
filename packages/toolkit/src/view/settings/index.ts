import { SettingRoot } from "./SettingRoot";
import { SettingSidebarItem, SettingSidebarRoot } from "./SettingSidebar";
import {
  SettingTabHeader,
  SettingTabRoot,
  SettingTabSectionContent,
  SettingTabSectionHeader,
  SettingTabSectionRoot,
  SettingTabSectionSeparator,
} from "./SettingTab";

export * from "./user";
export * from "./instillUserRoles";

export const Setting = {
  Root: SettingRoot,
  SidebarRoot: SettingSidebarRoot,
  SidebarItem: SettingSidebarItem,
  TabRoot: SettingTabRoot,
  TabHeader: SettingTabHeader,
  TabSectionRoot: SettingTabSectionRoot,
  TabSectionHeader: SettingTabSectionHeader,
  TabSectionContent: SettingTabSectionContent,
  TabSectionSeparator: SettingTabSectionSeparator,
};
