import {
  InstillStore,
  useEntity,
  useInstillStore,
  useShallow,
  useUserConnectors,
} from "../../../../../lib";
import { DialogSection } from "./DialogSection";
import { ImageWithFallback } from "../../../../../components";
import { Icons } from "@instill-ai/design-system";
import { OnSelectComponent } from "./SelectComponentDialog";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ExistingConnectorSection = ({
  onSelect,
}: {
  onSelect: OnSelectComponent;
}) => {
  const entity = useEntity();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const allConnector = useUserConnectors({
    userName: entity.entityName,
    connectorType: "all",
    enabled: entity.isSuccess && enabledQuery,
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
                  onSelect(connector.connector_definition, connector);
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
