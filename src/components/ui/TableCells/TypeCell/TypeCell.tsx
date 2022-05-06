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

export type TypeCellProps = {
  type: string;
  name: string;
};

const TypeCell: FC<TypeCellProps> = ({ type, name }) => {
  let icon: ReactNode;
  const width = "w-[30px]";
  const height = "h-[30px]";
  const position = "my-auto";

  switch (type) {
    case "snowflake": {
      icon = (
        <SnowflakeIcon width="w-[30px]" height="h-[30px]" position="my-auto" />
      );
      break;
    }
    case "google_sheet": {
      icon = (
        <GoogleSheetIcon width={width} height={height} position={position} />
      );
      break;
    }
    case "big_query": {
      icon = <BigQueryIcon width={width} height={height} position={position} />;
      break;
    }
    case "grpc": {
      icon = <GrpcIcon width={width} height={height} position={position} />;
      break;
    }
    case "http": {
      icon = <HttpIcon width={width} height={height} position={position} />;
      break;
    }
    case "mongo_db": {
      icon = <MongoDbIcon width={width} height={height} position={position} />;
      break;
    }
    case "mysql": {
      icon = <MySqlIcon width={width} height={height} position={position} />;
      break;
    }
    case "postgresql": {
      icon = (
        <PostgreSqlIcon width={width} height={height} position={position} />
      );
      break;
    }
    case "redshift": {
      icon = <RedshiftIcon width={width} height={height} position={position} />;
      break;
    }
    case "salesforce": {
      icon = (
        <SalesforceIcon width={width} height={height} position={position} />
      );
      break;
    }
    case "shopify": {
      icon = <ShopifyIcon width={width} height={height} position={position} />;
      break;
    }
    case "slack": {
      icon = <SlackIcon width={width} height={height} position={position} />;
      break;
    }
  }

  return (
    <td>
      <div className="w-[233.5px] py-2.5">
        <div className="flex flex-row gap-x-2.5">
          {icon}
          <p className="instill-text-body text-instillGrey90">{name}</p>
        </div>
      </div>
    </td>
  );
};

export default TypeCell;
