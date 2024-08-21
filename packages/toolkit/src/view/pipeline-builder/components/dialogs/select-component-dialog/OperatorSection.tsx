import { Icons } from "@instill-ai/design-system";

import { ImageWithFallback } from "../../../../../components";
import {
  InstillStore,
  useComponentDefinitions,
  useInstillStore,
  useShallow,
} from "../../../../../lib";
import { Section } from "./Section";
import { OnSelectComponent } from "./SelectComponentDialog";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const OperatorSection = ({
  onSelect,
}: {
  onSelect: OnSelectComponent;
}) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const operatorDefinitions = useComponentDefinitions({
    componentType: "COMPONENT_TYPE_OPERATOR",
    enabled: enabledQuery,
    accessToken,
  });

  return (
    <Section.Root title="Operator">
      {operatorDefinitions.isSuccess
        ? operatorDefinitions.data.map((definition) => (
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
