"use client";

import { Icons } from "@instill-ai/design-system";
import { ImageWithFallback } from "../../../../../components";
import {
  InstillStore,
  useConnectorDefinitions,
  useInstillStore,
  useShallow,
} from "../../../../../lib";
import { DialogSection } from "./DialogSection";
import { OnSelectComponent } from "./SelectComponentDialog";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const NewConnectorSection = ({
  onSelect,
}: {
  onSelect: OnSelectComponent;
}) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const aiDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_AI",
    enabled: enabledQuery,
    accessToken,
  });

  const applicationDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_APPLICATION",
    enabled: enabledQuery,
    accessToken,
  });

  const dataDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_DATA",
    enabled: enabledQuery,
    accessToken,
  });

  return (
    <DialogSection.Root title="Connectors">
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
      <DialogSection.SubTitle>Application</DialogSection.SubTitle>
      <DialogSection.Grid>
        {applicationDefinitions.isSuccess
          ? applicationDefinitions.data.map((definition) => (
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
