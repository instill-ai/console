import { ModelSettingsTabs } from "./ModelSettingsHead";
import { ModelSettingsVersions } from "./ModelSettingsVersions";

export type ContentViewerProps = {
  selectedTab: ModelSettingsTabs;
};

export const ModelSettingsContentViewer = ({
  selectedTab,
}: ContentViewerProps) => {
  switch (selectedTab) {
    case "versions":
      return <ModelSettingsVersions />;
  }

  return null;
};
