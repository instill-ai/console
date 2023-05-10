import { FC, ReactElement, useCallback, useMemo, useState } from "react";
import cn from "clsx";
import {
  DataDestinationIcon,
  DataSourceIcon,
  VdpLogo,
  ModelIcon,
  PipelineIcon,
  ResourceIcon,
  DiscordIcon,
  GitHubIcon,
  CollapseSidebarButton,
} from "@instill-ai/design-system";
import { useRouter } from "next/router";

import { LinkTab } from "./LinkTab";
import { ButtonTab } from "./ButtonTab";

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

export const Sidebar: FC = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const [resourceTabIsOpen, setResourceTabIsOpen] = useState(false);

  const iconWidth = "w-[30px]";
  const iconHeight = "h-[30px]";
  const iconPosition = "my-auto";

  const currentTab = useMemo(() => {
    return "/" + router.asPath.split("/")[1];
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
        tabName: "Source",
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
        tabName: "Destination",
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
        link: "https://www.instill.tech/docs",
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
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="sticky top-0 flex h-screen flex-col bg-instillGrey90 pb-5">
      <div className="relative mb-20 py-6">
        <div className="flex px-5">
          <VdpLogo
            type={isCollapsed ? "square" : "expand"}
            width={isCollapsed ? 44 : 124}
          />
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
          <CollapseSidebarButton
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
