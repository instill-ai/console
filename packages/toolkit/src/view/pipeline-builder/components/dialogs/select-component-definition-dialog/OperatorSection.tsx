import { Icons } from "@instill-ai/design-system";
import { ImageWithFallback } from "../../../../../components";
import { Nullable, useOperatorDefinitions } from "../../../../../lib";
import { DialogSection } from "./DialogSection";
import { PipelineComponentDefinitionOnSelect } from "./SelectPipelineComponentDefinitionDialog";

export const OperatorSection = ({
  accessToken,
  enableQuery,
  onSelect,
}: {
  accessToken: Nullable<string>;
  enableQuery: boolean;
  onSelect: PipelineComponentDefinitionOnSelect;
}) => {
  const operatorDefinitions = useOperatorDefinitions({
    enabled: enableQuery,
    accessToken,
  });

  return (
    <DialogSection.Root title="Operators">
      <DialogSection.Grid>
        {operatorDefinitions.isSuccess
          ? operatorDefinitions.data
              .filter((definition) => {
                if (definition.id === "start" || definition.id === "end") {
                  return false;
                } else {
                  return true;
                }
              })
              .map((definition) => (
                <DialogSection.Item
                  key={definition.id}
                  onClick={() => {
                    onSelect(definition);
                  }}
                >
                  <ImageWithFallback
                    src={`/icons/${definition.icon}`}
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
