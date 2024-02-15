import { DataDestinationIcon, DataSourceIcon } from "@instill-ai/design-system";
import cn from "clsx";
import { ConnectorDefinition, Nullable } from "../../lib";
import { ImageWithFallback } from "../ImageWithFallback";

export type ConnectionTypeCellProps = {
  connectorName: Nullable<string>;
  connectorDefinition: Nullable<ConnectorDefinition>;
  width: Nullable<string>;
  padding: string;
};

export const ConnectionTypeCell = ({
  connectorDefinition,
  connectorName,
  width,
  padding,
}: ConnectionTypeCellProps) => {
  return (
    <td>
      <div className={cn("py-2.5", width, padding)}>
        {connectorDefinition ? (
          <div className="flex flex-row gap-x-[5px]">
            <ImageWithFallback
              src={`/icons/${connectorDefinition.id}.svg`}
              width={24}
              height={24}
              alt={`${connectorName}-icon`}
              fallbackImg={
                connectorDefinition.name.split("/")[0].split("-")[0] ===
                "source" ? (
                  <DataSourceIcon
                    width="w-6"
                    height="h-6"
                    color="fill-instillGrey90"
                    position="my-auto"
                  />
                ) : (
                  <DataDestinationIcon
                    width="w-6"
                    height="h-6"
                    color="fill-instillGrey90"
                    position="my-auto"
                  />
                )
              }
            />
            <p
              className={cn(
                "text-instillGrey90 text-instill-body my-auto line-clamp-1"
              )}
            >
              {connectorDefinition.title}
            </p>
          </div>
        ) : null}
      </div>
    </td>
  );
};
