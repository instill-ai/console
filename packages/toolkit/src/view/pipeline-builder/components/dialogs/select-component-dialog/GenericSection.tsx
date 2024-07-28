import { Icons } from "@instill-ai/design-system";

import { ImageWithFallback } from "../../../../../components";
import {
  InstillStore,
  useConnectorDefinitions,
  useInstillStore,
  useShallow,
} from "../../../../../lib";
import { Section } from "./Section";
import { OnSelectComponent } from "./SelectComponentDialog";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const GenericSection = ({
  onSelect,
}: {
  onSelect: OnSelectComponent;
}) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const genericDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_GENERIC",
    enabled: enabledQuery,
    accessToken,
  });

  return (
    <Section.Root title="Generic">
      <Section.Item
        onClick={() => {
          onSelect({
            id: "iterator",
            title: "Iterator",
            icon: "iterator.svg",
            name: "iterator/iterator",
            uid: "uid",
          });
        }}
      >
        <ImageWithFallback
          src="/icons/iterator.svg"
          width={32}
          height={32}
          alt="iterator-icon"
          fallbackImg={
            <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
          }
        />
        <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
          Iterator
        </p>
      </Section.Item>
      {genericDefinitions.isSuccess
        ? genericDefinitions.data.map((definition) => (
            <Section.Item
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
            </Section.Item>
          ))
        : null}
    </Section.Root>
  );
};
