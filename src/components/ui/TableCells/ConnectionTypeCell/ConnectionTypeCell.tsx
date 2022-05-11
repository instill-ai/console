import { FC, ReactNode } from "react";
import cn from "clsx";
import {
  BigQueryIcon,
  GoogleSheetIcon,
  GrpcIcon,
  HttpIcon,
  MongoDbIcon,
  MySqlIcon,
  PostgreSqlIcon,
  RedshiftIcon,
  SalesforceIcon,
  ShopifyIcon,
  SlackIcon,
  SnowflakeIcon,
} from "@instill-ai/design-system";

import CellBase, { CellBaseProps } from "../CellBase";

export type ConnectionTypeCellProps = CellBaseProps & {
  type: string;
  cellType: "shrink" | "expand";
  name: string;
  width: string;
};

const ConnectionTypeCell: FC<ConnectionTypeCellProps> = ({
  type,
  name,
  width,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  cellType,
}) => {
  let icon: ReactNode;
  const iconWidth = "w-8";
  const iconHeight = "h-8";
  const position = "my-auto";

  switch (type) {
    case "snowflake": {
      icon = (
        <SnowflakeIcon
          width={iconWidth}
          height={iconHeight}
          position="my-auto"
        />
      );
      break;
    }
    case "google_sheet": {
      icon = (
        <GoogleSheetIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "big_query": {
      icon = (
        <BigQueryIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "grpc": {
      icon = (
        <GrpcIcon width={iconWidth} height={iconHeight} position={position} />
      );
      break;
    }
    case "http": {
      icon = (
        <HttpIcon width={iconWidth} height={iconHeight} position={position} />
      );
      break;
    }
    case "mongo_db": {
      icon = (
        <MongoDbIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "mysql": {
      icon = (
        <MySqlIcon width={iconWidth} height={iconHeight} position={position} />
      );
      break;
    }
    case "postgresql": {
      icon = (
        <PostgreSqlIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "redshift": {
      icon = (
        <RedshiftIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "salesforce": {
      icon = (
        <SalesforceIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "shopify": {
      icon = (
        <ShopifyIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "slack": {
      icon = (
        <SlackIcon width={iconWidth} height={iconHeight} position={position} />
      );
      break;
    }
  }

  if (cellType === "shrink") {
    return (
      <CellBase
        paddingTop={paddingTop}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
        paddingBottom={paddingBottom}
      >
        {}
        <div className={cn("py-2.5", width)}>
          <div className="flex flex-row gap-x-2.5">
            {icon}
            <p className="instill-text-body my-auto text-instillGrey90">
              {name}
            </p>
          </div>
        </div>
      </CellBase>
    );
  } else {
    return (
      <CellBase
        paddingTop={paddingTop}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
        paddingBottom={paddingBottom}
      >
        <div className={cn("py-2.5", width)}>
          <div className="flex flex-col gap-y-[6px]">
            <div className="flex flex-row gap-x-[5px]">
              {icon}
              <p className="instill-text-small my-auto text-instillGrey70">
                {type}
              </p>
            </div>
            <p className="instill-text-body my-auto text-instillGrey90">
              {name}
            </p>
          </div>
        </div>
      </CellBase>
    );
  }
};

export default ConnectionTypeCell;
