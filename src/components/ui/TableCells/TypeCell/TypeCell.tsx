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
import { FC, ReactNode } from "react";
import cn from "clsx";

export type TypeCellProps = {
  type: string;
  name: string;
  width: string;
};

const TypeCell: FC<TypeCellProps> = ({ type, name, width }) => {
  let icon: ReactNode;
  const iconWidth = "w-[30px]";
  const iconHeight = "h-[30px]";
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

  return (
    <td>
      <div className={cn("py-2.5", width)}>
        <div className="flex flex-row gap-x-2.5">
          {icon}
          <p className="instill-text-body text-instillGrey90">{name}</p>
        </div>
      </div>
    </td>
  );
};

export default TypeCell;
