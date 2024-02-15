import { Nullable, useEntity, useUserConnectors } from "../../../../../lib";
import { DialogSection } from "./DialogSection";
import { ImageWithFallback } from "../../../../../components";
import { Icons } from "@instill-ai/design-system";
import { PipelineComponentDefinitionOnSelect } from "./SelectPipelineComponentDefinitionDialog";

export const ExistingConnectorSection = ({
  accessToken,
  enableQuery,
  onSelect,
}: {
  accessToken: Nullable<string>;
  enableQuery: boolean;
  onSelect: PipelineComponentDefinitionOnSelect;
}) => {
  const entityObject = useEntity();

  const allConnector = useUserConnectors({
    userName: entityObject.entityName,
    connectorType: "all",
    enabled: enableQuery && entityObject.isSuccess,
    accessToken,
  });

  return (
    <DialogSection.Root title="Existing Connectors">
      <DialogSection.Grid>
        {allConnector.isSuccess
          ? allConnector.data.map((connector) => (
              <DialogSection.Item
                key={connector.id}
                onClick={() => {
                  onSelect(connector);
                }}
              >
                <ImageWithFallback
                  src={`/icons/${connector.connector_definition.id}.svg`}
                  width={32}
                  height={32}
                  alt={`${connector.connector_definition.title}-icon`}
                  fallbackImg={
                    <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                  }
                />
                <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                  {connector.id}
                </p>
              </DialogSection.Item>
            ))
          : null}
      </DialogSection.Grid>
    </DialogSection.Root>
  );
};
