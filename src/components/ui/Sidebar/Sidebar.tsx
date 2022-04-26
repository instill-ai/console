import { FC } from "react";
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

const Sidebar: FC = () => {
  const tabs = [
    {
      icon: (
        <PipelineIcon
          color="fill-instillGrey30"
          width="w-[30px]"
          height="h-[30px]"
          position="my-auto"
        />
      ),
      id: "sidebar-pipleine",
      tabName: "Pipeline",
      link: "/pipeline",
    },
    {
      icon: (
        <DataSourceIcon
          color="fill-instillGrey30"
          width="w-[30px]"
          height="h-[30px]"
          position="my-auto"
        />
      ),
      id: "sidebar-data-source",
      tabName: "Data source",
      link: "/data-source",
    },
    {
      icon: (
        <ModelIcon
          color="fill-instillGrey30"
          width="w-[30px]"
          height="h-[30px]"
          position="my-auto"
        />
      ),
      id: "sidebar-model",
      tabName: "Model",
      link: "/model",
    },
    {
      icon: (
        <DataDestinationIcon
          color="fill-instillGrey30"
          width="w-[30px]"
          height="h-[30px]"
          position="my-auto"
        />
      ),
      id: "sidebar-data-destination",
      tabName: "Data destination",
      link: "/data-destination",
    },
  ];

  const subTabs = [
    {
      icon: (
        <GearIcon
          color="fill-instillGrey30"
          width="w-[30px]"
          height="h-[30px]"
          position="my-auto"
        />
      ),
      id: "sidebar-setting",
      tabName: "Setting",
      link: "/setting",
    },
    {
      icon: (
        <ResourceIcon
          color="fill-instillGrey30"
          width="w-[30px]"
          height="h-[30px]"
          position="my-auto"
        />
      ),
      id: "sidebar-resources",
      tabName: "Resources",
      link: "/resources",
    },
  ];

  return (
    <div className="flex h-screen w-[237px] flex-col bg-instillGrey95 pb-5">
      <div className="mb-20 p-6">
        <Logo type="ColourLogomarkWhiteType" width={182} />
      </div>
      <div className="flex h-full flex-col">
        <div className="mb-auto flex flex-col">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              tabName={tab.tabName}
              link={tab.link}
              icon={tab.icon}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
