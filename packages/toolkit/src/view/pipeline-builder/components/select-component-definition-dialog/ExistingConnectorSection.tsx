import { useRouter } from "next/router";
import { Nullable, useUserConnectorResources } from "../../../../lib";
import { DialogSection } from "./DialogSection";
import { ImageWithFallback } from "../../../../components";
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
  const router = useRouter();
  const { entity } = router.query;

  const allConnectorResources = useUserConnectorResources({
    userName: `users/${entity}`,
    connectorResourceType: "all",
    enabled: enableQuery,
    accessToken,
  });

  return (
    <DialogSection.Root title="Existing Connectors">
      <DialogSection.Grid>
        {allConnectorResources.isSuccess
          ? allConnectorResources.data.map((connectorResource) => (
              <DialogSection.Item
                key={connectorResource.id}
                onClick={() => {
                  onSelect(connectorResource);
                }}
              >
                <ImageWithFallback
                  src={`/icons/${connectorResource.connector_definition.vendor}/${connectorResource.connector_definition.icon}`}
                  width={32}
                  height={32}
                  alt={`${connectorResource.connector_definition.title}-icon`}
                  fallbackImg={
                    <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                  }
                />
                <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                  {connectorResource.id}
                </p>
              </DialogSection.Item>
            ))
          : null}
      </DialogSection.Grid>
    </DialogSection.Root>
  );
};
