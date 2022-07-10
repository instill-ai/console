import { FC, useCallback, useState } from "react";
import { Logo } from "@instill-ai/design-system";
import LinkTab, { LinkTabProps } from "./LinkTab";
import { CollapseSidebarButton } from "../Buttons";
import { useRouter } from "next/router";

type Tab = Omit<LinkTabProps, "isCollapsed" | "isCurrent"> & { id: string };

const Sidebar: FC = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [resourceTabIsOpen, setResourceTabIsOpen] = useState(false);

  const tabs: Tab[] = [
    {
      id: "sidebar-pipleine",
      tabName: "Pipeline",
      link: "/pipelines",
    },
    {
      id: "sidebar-data-source",
      tabName: "Data source",
      link: "/sources",
    },
    {
      id: "sidebar-model",
      tabName: "Model",
      link: "/models",
    },
    {
      id: "sidebar-data-destination",
      tabName: "Data destination",
      link: "/destinations",
    },
  ];

  const subTabs: Tab[] = [
    // {
    //   id: "sidebar-setting",
    //   tabName: "Setting",
    //   link: "/setting",
    // },
    {
      id: "sidebar-resources",
      tabName: "Resources",
      link: "/resources",
    },
  ];

  const handleCollapseSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const determineCurrentTab = useCallback(
    (link: string) => {
      if (router.asPath === link) {
        return true;
      }
      return false;
    },
    [router.asPath]
  );

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
            <LinkTab
              key={tab.id}
              tabName={tab.tabName}
              link={tab.link}
              isCollapsed={isCollapsed}
              isCurrent={determineCurrentTab(tab.link)}
            />
          ))}
        </div>
        <div className="mt-auto flex flex-col">
          {subTabs.map((tab) => (
            <LinkTab
              key={tab.id}
              tabName={tab.tabName}
              link={tab.link}
              isCollapsed={isCollapsed}
              isCurrent={determineCurrentTab(tab.link)}
            />
          ))}
        </div>
      </div>
      <div className="relative">{resourceTabIsOpen ? <div></div> : null}</div>
    </div>
  );
};

export default Sidebar;
