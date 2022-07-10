import Link from "next/link";
import { FC, ReactElement } from "react";
import cn from "clsx";
import {
  DataDestinationIcon,
  DataSourceIcon,
  GearIcon,
  ModelIcon,
  PipelineIcon,
  ResourceIcon,
} from "@instill-ai/design-system";

export type LinkTabProps = {
  tabName: string;
  link:
    | "/sources"
    | "/pipelines"
    | "/destinations"
    | "/models"
    | "/setting"
    | "/resources";
  isCollapsed: boolean;
  isCurrent: boolean;
};

const LinkTab: FC<LinkTabProps> = ({
  tabName,
  link,
  isCollapsed,
  isCurrent,
}) => {
  let icon: ReactElement;

  const iconColor = cn(
    isCurrent ? "fill-instillBlue50" : "fill-instillGrey30",
    "group-hover:fill-instillBlue10"
  );
  const iconWidth = "w-[30px]";
  const iconHeight = "h-[30px]";
  const iconPosition = "my-auto";

  switch (link) {
    case "/sources":
      icon = (
        <DataSourceIcon
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "/destinations":
      icon = (
        <DataDestinationIcon
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "/models":
      icon = (
        <ModelIcon
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "/pipelines":
      icon = (
        <PipelineIcon
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "/resources":
      icon = (
        <ResourceIcon
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "/setting":
      icon = (
        <GearIcon
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
  }

  return (
    <Link href={link}>
      <a
        className={cn(
          "group flex flex-row py-[15px] px-8 hover:bg-instillBlue50",
          {
            "gap-x-5": !isCollapsed,
          }
        )}
      >
        <div className="px-1"> {icon}</div>
        {isCollapsed ? null : (
          <p
            className={cn(
              "my-auto text-base leading-[28px] group-hover:text-instillBlue10",
              isCurrent ? "text-instillBlue50" : "text-instillGrey30"
            )}
          >
            {tabName}
          </p>
        )}
      </a>
    </Link>
  );
};

export default LinkTab;
