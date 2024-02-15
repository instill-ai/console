import { Icons } from "@instill-ai/design-system";
import { ImageWithFallback } from "../../../../../components";
import { Nullable, useConnectorDefinitions } from "../../../../../lib";
import { DialogSection } from "./DialogSection";
import { PipelineComponentDefinitionOnSelect } from "./SelectPipelineComponentDefinitionDialog";

export const NewConnectorSection = ({
  accessToken,
  enableQuery,
  onSelect,
}: {
  accessToken: Nullable<string>;
  enableQuery: boolean;
  onSelect: PipelineComponentDefinitionOnSelect;
}) => {
  const aiDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_AI",
    enabled: enableQuery,
    accessToken,
  });

  const blockchainDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_BLOCKCHAIN",
    enabled: enableQuery,
    accessToken,
  });

  const dataDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_DATA",
    enabled: enableQuery,
    accessToken,
  });

  return (
    <DialogSection.Root title="New Connectors">
      <DialogSection.SubTitle>AI</DialogSection.SubTitle>
      <DialogSection.Grid>
        {aiDefinitions.isSuccess
          ? aiDefinitions.data.map((definition) => (
              <DialogSection.Item
                key={definition.id}
                onClick={() => {
                  onSelect(definition);
                }}
              >
                <ImageWithFallback
                  src={`/icons/${definition.id}.svg`}
                  width={32}
                  height={32}
                  alt={`${definition.title}-icon`}
                  fallbackImg={
                    <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                  }
                />
                <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                  {definition.title}
                </p>
              </DialogSection.Item>
            ))
          : null}
      </DialogSection.Grid>
      <DialogSection.SubTitle>Blockchain</DialogSection.SubTitle>
      <DialogSection.Grid>
        {blockchainDefinitions.isSuccess
          ? blockchainDefinitions.data.map((definition) => (
              <DialogSection.Item
                key={definition.id}
                onClick={() => {
                  onSelect(definition);
                }}
              >
                <ImageWithFallback
                  src={`/icons/${definition.id}.svg`}
                  width={32}
                  height={32}
                  alt={`${definition.title}-icon`}
                  fallbackImg={
                    <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                  }
                />
                <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                  {definition.title}
                </p>
              </DialogSection.Item>
            ))
          : null}
      </DialogSection.Grid>
      <DialogSection.SubTitle>Data</DialogSection.SubTitle>
      <DialogSection.Grid>
        {dataDefinitions.isSuccess
          ? dataDefinitions.data.map((definition) => (
              <DialogSection.Item
                key={definition.id}
                onClick={() => {
                  onSelect(definition);
                }}
              >
                <ImageWithFallback
                  src={`/icons/${definition.id}.svg`}
                  width={32}
                  height={32}
                  alt={`${definition.title}-icon`}
                  fallbackImg={
                    <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                  }
                />
                <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                  {definition.title}
                </p>
              </DialogSection.Item>
            ))
          : null}
      </DialogSection.Grid>
    </DialogSection.Root>
  );
};
