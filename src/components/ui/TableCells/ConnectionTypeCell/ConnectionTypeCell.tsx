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
  iconDefinition: string;
  definitionName: string;
  cellType: "shrink" | "expand";
  connectionName: string;
  width: string;
  lineClamp?: string;
};

const ConnectionTypeCell: FC<ConnectionTypeCellProps> = ({
  iconDefinition,
  definitionName,
  connectionName,
  width,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  cellType,
  lineClamp,
}) => {
  let icon: ReactNode;
  const iconWidth = "w-8";
  const iconHeight = "h-8";
  const position = "my-auto";

  switch (iconDefinition) {
    case "snowflake.svg": {
      icon = (
        <SnowflakeIcon
          width={iconWidth}
          height={iconHeight}
          position="my-auto"
        />
      );
      break;
    }
    case "googlesheet.svg": {
      icon = (
        <GoogleSheetIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "bigquery.svg": {
      icon = (
        <BigQueryIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "grpc.svg": {
      icon = (
        <GrpcIcon width={iconWidth} height={iconHeight} position={position} />
      );
      break;
    }
    case "http.svg": {
      icon = (
        <HttpIcon width={iconWidth} height={iconHeight} position={position} />
      );
      break;
    }
    case "mongodb.svg": {
      icon = (
        <MongoDbIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "mysql.svg": {
      icon = (
        <MySqlIcon width={iconWidth} height={iconHeight} position={position} />
      );
      break;
    }
    case "postgresql.svg": {
      icon = (
        <PostgreSqlIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "redshift.svg": {
      icon = (
        <RedshiftIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "salesforce.svg": {
      icon = (
        <SalesforceIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "shopify.svg": {
      icon = (
        <ShopifyIcon
          width={iconWidth}
          height={iconHeight}
          position={position}
        />
      );
      break;
    }
    case "slack.svg": {
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
            <p
              className={cn(
                "instill-text-body my-auto text-instillGrey90",
                lineClamp
              )}
            >
              {connectionName}
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
              <p className="instill-text-small my-auto text-instillGrey90">
                {definitionName}
              </p>
            </div>
            <p
              className={cn(
                "instill-text-body my-auto text-instillGrey90",
                lineClamp
              )}
            >
              {connectionName}
            </p>
          </div>
        </div>
      </CellBase>
    );
  }
};

export default ConnectionTypeCell;
