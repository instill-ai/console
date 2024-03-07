import * as React from "react";
import { Icons, ScrollArea } from "@instill-ai/design-system";
import {
  InstillJSONSchema,
  Nullable,
  useComponentOutputReferenceHintFields,
} from "../../../lib";
import { ReferenceHintTag } from "../../../components";
import { PickComponentsFromReferenceHintsOptions } from "../../../lib/use-instill-form/pick/pickComponentsFromReferenceHints";

export const ComponentOutputReferenceHints = ({
  componentID,
  outputSchema,
}: {
  componentID: string;
  outputSchema: Nullable<InstillJSONSchema>;
}) => {
  const [mode] =
    React.useState<Required<PickComponentsFromReferenceHintsOptions["mode"]>>(
      "groupByFormat"
    );

  const hintFields = useComponentOutputReferenceHintFields(outputSchema, {
    componentID,
    mode,
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
        <div className="flex w-[calc(var(--pipeline-builder-node-available-width)-24px)] flex-col rounded bg-semantic-bg-primary p-4">
          <div className="mb-2 flex flex-row items-center gap-x-1 px-2 py-px">
            <Icons.ReferenceIconCheck className="h-[9px] w-[18px] stroke-semantic-fg-disabled" />
            <p className="font-sans text-[11px] font-medium leading-[14.5px] text-semantic-fg-disabled">
              references
            </p>
          </div>
          <div className="flex flex-col gap-y-4">{hintFields}</div>
        </div>
      </ScrollArea.Root>
    </div>
  );
};
