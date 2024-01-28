import { ScrollArea } from "@instill-ai/design-system";
import {
  InstillJSONSchema,
  Nullable,
  useComponentOutputReferenceHintFields,
} from "../../../lib";
import { ReferenceHintTag } from "../../../components";

export const ComponentOutputReferenceHints = ({
  componentID,
  outputSchema,
}: {
  componentID: string;
  outputSchema: Nullable<InstillJSONSchema>;
}) => {
  const hintFields = useComponentOutputReferenceHintFields(outputSchema, {
    componentID,
  });

  return (
    <div className="flex flex-col">
      <p className="mb-2 text-semantic-fg-secondary product-body-text-4-medium">
        Output
      </p>

      <ScrollArea.Root
        className="nodrag nowheel h-full"
        viewPortClassName="max-h-[400px]"
      >
        <div className="flex flex-col rounded bg-semantic-bg-primary p-4">
          <div className="mb-2 flex">
            <ReferenceHintTag.Root className="!bg-semantic-bg-primary !px-0">
              <ReferenceHintTag.Icon
                type="check"
                className="!stroke-semantic-fg-disabled"
              />
              <ReferenceHintTag.Label className="!text-semantic-fg-disabled">
                references
              </ReferenceHintTag.Label>
            </ReferenceHintTag.Root>
          </div>
          <div className="flex flex-col gap-y-2">{hintFields}</div>
        </div>
      </ScrollArea.Root>
    </div>
  );
};
