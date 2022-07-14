import { FC, ReactElement, useCallback, useMemo, useState } from "react";
import cn from "clsx";
import {
  DataDestinationIcon,
  DataSourceIcon,
  Logo,
  ModelIcon,
  PipelineIcon,
  ResourceIcon,
  RotatableArrowIcon,
  DiscordIcon,
  GitHubIcon,
} from "@instill-ai/design-system";
import { useRouter } from "next/router";

import LinkTab from "./LinkTab";
import { CollapseSidebarButton } from "../Buttons";
import ButtonTab from "./ButtonTab";

type Tab =
  | {
      id: string;
      type: "link";
      tabName: string;
      link: string;
      startIcon?: ReactElement;
      endIcon?: ReactElement;
      getTextColor?: () => string;
    }
  | {
      id: string;
      type: "button";
      tabName: string;
      startIcon?: ReactElement;
      endIcon?: ReactElement;
      onClickHandler: () => void;
      getTextColor?: () => string;
    };

const iconWidth = "w-[30px]";
const iconHeight = "h-[30px]";
const iconPosition = "my-auto";

const Sidebar: FC = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [resourceTabIsOpen, setResourceTabIsOpen] = useState(false);

  const currentTab = useMemo(() => {
    setResourceTabIsOpen(false);
    return router.asPath;
  }, [router.asPath]);

  const getIconColor = useCallback(
    (tabLink: string) => {
      return cn(
        currentTab === tabLink ? "fill-instillBlue50" : "fill-instillGrey30",
        "group-hover:fill-instillBlue10"
      );
    },
    [currentTab]
  );

  const tabs: Tab[] = useMemo(() => {
    return [
      {
        id: "sidebar-pipleine",
        type: "link",
        tabName: "Pipeline",
        link: "/pipelines",
        startIcon: (
          <PipelineIcon
            color={getIconColor("/pipelines")}
            width={iconWidth}
            height={iconHeight}
            position={iconPosition}
          />
        ),
      },
      {
        id: "sidebar-data-source",
        type: "link",
        tabName: "Data source",
        link: "/sources",
        startIcon: (
          <DataSourceIcon
            color={getIconColor("/sources")}
            width={iconWidth}
            height={iconHeight}
            position={iconPosition}
          />
        ),
      },
      {
        id: "sidebar-model",
        type: "link",
        tabName: "Model",
        link: "/models",
        startIcon: (
          <ModelIcon
            color={getIconColor("/models")}
            width={iconWidth}
            height={iconHeight}
            position={iconPosition}
          />
        ),
      },
      {
        id: "sidebar-data-destination",
        type: "link",
        tabName: "Data destination",
        link: "/destinations",
        startIcon: (
          <DataDestinationIcon
            color={getIconColor("/destinations")}
            width={iconWidth}
            height={iconHeight}
            position={iconPosition}
          />
        ),
      },
    ];
  }, [getIconColor]);

  const subTabs: Tab[] = useMemo(() => {
    return [
      {
        id: "sidebar-documentation",
        type: "link",
        tabName: "Documentation",
        link: "https://docs.instill.tech",
        startIcon: (
          <ResourceIcon
            color="group-hover:fill-instillBlue10 fill-instillGrey30"
            width={iconWidth}
            height={iconHeight}
            position={iconPosition}
          />
        ),
      },
      {
        id: "sidebar-community",
        type: "link",
        tabName: "Community",
        link: "https://discord.com/invite/sevxWsqpGh",
        startIcon: (
          <DiscordIcon
            color="group-hover:fill-instillBlue10 fill-instillGrey30"
            width={iconWidth}
            height={iconHeight}
            position={iconPosition}
          />
        ),
      },
      {
        id: "sidebar-github",
        type: "link",
        tabName: "GitHub",
        link: "https://github.com/instill-ai/vdp",
        startIcon: (
          <GitHubIcon
            color="group-hover:fill-instillBlue10 fill-instillGrey30"
            width={iconWidth}
            height={iconHeight}
            position={iconPosition}
          />
        ),
      },
    ];
  }, []);

  // The way we make collasable resource tab

  // const subTabs: Tab[] = useMemo(() => {
  //   return [
  //     // {
  //     //   id: "sidebar-setting",
  //     //   tabName: "Setting",
  //     //   link: "/setting",
  //     // },
  //     {
  //       id: "sidebar-resources",
  //       type: "button",
  //       tabName: "Resources",
  //       startIcon: (
  //         <ResourceIcon
  //           color={cn(
  //             resourceTabIsOpen ? "fill-instillBlue50" : "fill-instillGrey30",
  //             "group-hover:fill-instillBlue10"
  //           )}
  //           width={iconWidth}
  //           height={iconHeight}
  //           position={iconPosition}
  //         />
  //       ),
  //       onClickHandler: () => {
  //         setResourceTabIsOpen((prev) => !prev);
  //       },
  //       getTextColor: () => {
  //         return resourceTabIsOpen
  //           ? "text-instillBlue50"
  //           : "text-instillGrey30";
  //       },
  //     },
  //   ];
  // }, [resourceTabIsOpen]);

  // const resourceTabs: Tab[] = useMemo(() => {
  //   return [
  //     {
  //       id: "docs",
  //       type: "link",
  //       tabName: "Documentation",
  //       link: "https://docs.instill.tech/",
  //       endIcon: (
  //         <RotatableArrowIcon
  //           color="fill-instillGrey30 group-hover:fill-instillBlue10"
  //           width={iconWidth}
  //           height={iconHeight}
  //           position={iconPosition}
  //           rotate="-rotate-45"
  //         />
  //       ),
  //     },
  //     {
  //       id: "discord",
  //       type: "link",
  //       tabName: "Join our Discord",
  //       link: "https://discord.com/invite/sevxWsqpGh",
  //       endIcon: (
  //         <RotatableArrowIcon
  //           color="fill-instillGrey30 group-hover:fill-instillBlue10"
  //           width={iconWidth}
  //           height={iconHeight}
  //           position={iconPosition}
  //           rotate="-rotate-45"
  //         />
  //       ),
  //     },
  //   ];
  // }, []);

  const handleCollapseSidebar = useCallback(() => {
    setResourceTabIsOpen(false);
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="sticky top-0 flex h-screen flex-col bg-instillGrey90 pb-5">
      <div className="relative mb-20 py-6">
        <div className="flex px-5">
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
          {tabs.map((tab) => {
            if (tab.type === "link") {
              return (
                <LinkTab
                  key={tab.id}
                  tabName={tab.tabName}
                  link={tab.link}
                  isCollapsed={isCollapsed}
                  isCurrent={currentTab === tab.link}
                  startIcon={tab.startIcon}
                  endIcon={tab.endIcon}
                />
              );
            } else {
              return (
                <ButtonTab
                  key={tab.id}
                  tabName={tab.tabName}
                  isCollapsed={isCollapsed}
                  startIcon={tab.startIcon}
                  endIcon={tab.endIcon}
                  onClickHandler={tab.onClickHandler}
                />
              );
            }
          })}
        </div>
        <div className="mt-auto flex flex-col">
          {subTabs.map((tab) => {
            if (tab.type === "link") {
              return (
                <LinkTab
                  key={tab.id}
                  tabName={tab.tabName}
                  link={tab.link}
                  isCollapsed={isCollapsed}
                  isCurrent={currentTab === tab.link}
                  startIcon={tab.startIcon}
                  endIcon={tab.endIcon}
                />
              );
            } else {
              return (
                <ButtonTab
                  key={tab.id}
                  tabName={tab.tabName}
                  isCollapsed={isCollapsed}
                  startIcon={tab.startIcon}
                  endIcon={tab.endIcon}
                  onClickHandler={tab.onClickHandler}
                  getTextColor={tab.getTextColor}
                />
              );
            }
          })}
        </div>
      </div>
      {/* <div className="relative">
        {resourceTabIsOpen ? (
          <div className="absolute bottom-0 right-0 translate-x-full translate-y-5 bg-instillGrey90 py-5">
            {resourceTabs.map((tab) => {
              if (tab.type === "link") {
                return (
                  <LinkTab
                    key={tab.id}
                    tabName={tab.tabName}
                    link={tab.link}
                    isCollapsed={isCollapsed}
                    isCurrent={currentTab === tab.link}
                    startIcon={tab.startIcon}
                    endIcon={tab.endIcon}
                  />
                );
              } else {
                return (
                  <ButtonTab
                    key={tab.id}
                    tabName={tab.tabName}
                    isCollapsed={isCollapsed}
                    startIcon={tab.startIcon}
                    endIcon={tab.endIcon}
                    onClickHandler={tab.onClickHandler}
                  />
                );
              }
            })}
          </div>
        ) : null}
      </div> */}
    </div>
  );
};

export default Sidebar;
