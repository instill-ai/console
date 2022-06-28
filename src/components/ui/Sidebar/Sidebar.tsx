import { FC, useCallback, useState } from "react";
import {
  DataDestinationIcon,
  DataSourceIcon,
  GearIcon,
  Logo,
  ModelIcon,
  PipelineIcon,
  ResourceIcon,
} from "@instill-ai/design-system";
import Tab from "./Tab";
import { CollapseSidebarButton } from "../Buttons";

const Sidebar: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const iconColor = "fill-instillGrey30 group-hover:fill-instillBlue10";
  const iconWidth = "w-[30px]";
  const iconHeight = "h-[30px]";
  const iconPosition = isCollapsed ? "my-auto" : "my-auto";

  const tabs = [
    {
      icon: (
        <PipelineIcon
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      ),
      id: "sidebar-pipleine",
      tabName: "Pipeline",
      link: "/pipelines",
    },
    {
      icon: (
        <DataSourceIcon
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      ),
      id: "sidebar-data-source",
      tabName: "Data source",
      link: "/sources",
    },
    {
      icon: (
        <ModelIcon
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      ),
      id: "sidebar-model",
      tabName: "Model",
      link: "/models",
    },
    {
      icon: (
        <DataDestinationIcon
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      ),
      id: "sidebar-data-destination",
      tabName: "Data destination",
      link: "/destinations",
    },
  ];

  const subTabs = [
    {
      icon: (
        <GearIcon
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      ),
      id: "sidebar-setting",
      tabName: "Setting",
      link: "/setting",
    },
    {
      icon: (
        <ResourceIcon
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      ),
      id: "sidebar-resources",
      tabName: "Resources",
      link: "/resources",
    },
  ];

  const handleCollapseSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="sticky top-0 flex h-screen flex-col bg-instillGrey90 pb-5">
      <div className="relative mb-20 py-6">
        <div className="flex px-8">
          <Logo
            type={isCollapsed ? "colourLogomark" : "ColourLogomarkWhiteType"}
            width={isCollapsed ? 38 : 182}
          />
        </div>

        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
          <CollapseSidebarButton
            type="button"
            disabled={false}
            isCollapse={isCollapsed}
            position="m-auto"
            onClickHandler={handleCollapseSidebar}
          />
        </div>
      </div>
      <div className="flex h-full flex-col">
        <div className="mb-auto flex flex-col">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              tabName={tab.tabName}
              link={tab.link}
              icon={tab.icon}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
        <div className="mt-auto flex flex-col">
          {subTabs.map((tab) => (
            <Tab
              key={tab.id}
              tabName={tab.tabName}
              link={tab.link}
              icon={tab.icon}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
