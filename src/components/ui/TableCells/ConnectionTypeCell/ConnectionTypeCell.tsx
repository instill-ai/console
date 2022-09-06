import cn from "clsx";
import Image from "next/image";
import CellBase, { CellBaseProps } from "../CellBase";
import { ConnectorDefinition } from "@/lib/instill";

export type ConnectionTypeCellProps = CellBaseProps & {
  cellType: "shrink" | "expand";
  connectorName: string;
  width: string;
  lineClamp?: string;
  connectorDefinition: ConnectorDefinition;
};

const ConnectionTypeCell = ({
  connectorDefinition,
  connectorName,
  width,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  cellType,
  lineClamp,
}: ConnectionTypeCellProps) => {
  if (cellType === "shrink") {
    return (
      <CellBase
        paddingTop={paddingTop}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
        paddingBottom={paddingBottom}
      >
        <div className={cn("py-2.5", width)}>
          <div className="flex flex-row gap-x-2.5">
            <Image
              className="my-auto"
              src={
                connectorDefinition.connector_definition.docker_repository.split(
                  "/"
                )[0] === "airbyte"
                  ? `/icons/airbyte/${connectorDefinition.connector_definition.icon}`
                  : `/icons/instill/${connectorDefinition.connector_definition.icon}`
              }
              width={32}
              height={32}
              layout="fixed"
            />
            <p
              className={cn(
                "my-auto text-instillGrey90 text-instill-body",
                lineClamp
              )}
            >
              {connectorDefinition.connector_definition.title}
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
              <Image
                className="my-auto"
                src={
                  connectorDefinition.connector_definition.docker_repository.split(
                    "/"
                  )[0] === "airbyte"
                    ? `/icons/airbyte/${connectorDefinition.connector_definition.icon}`
                    : `/icons/instill/${connectorDefinition.connector_definition.icon}`
                }
                width={32}
                height={32}
                layout="fixed"
              />
              <p className="my-auto text-instillGrey90 text-instill-small">
                {connectorDefinition.connector_definition.title}
              </p>
            </div>
            <p
              className={cn(
                "my-auto text-instillGrey90 text-instill-body",
                lineClamp
              )}
            >
              {connectorName}
            </p>
          </div>
        </div>
      </CellBase>
    );
  }
};

export default ConnectionTypeCell;
