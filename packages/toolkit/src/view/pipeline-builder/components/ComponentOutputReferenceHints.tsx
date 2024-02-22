import * as React from "react";
import { ScrollArea } from "@instill-ai/design-system";
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
          <div className="mb-2 flex flex-row items-center justify-between">
            <ReferenceHintTag.Root className="!bg-semantic-bg-primary !px-0">
              <ReferenceHintTag.Icon
                type="check"
                className="!stroke-semantic-fg-disabled"
              />
              <ReferenceHintTag.Label
                label="references"
                className="!text-semantic-fg-disabled"
                disabledCopy={true}
                disabledTooltip={true}
              />
            </ReferenceHintTag.Root>
            {/* <button
              className="rounded px-1.5 py-0.5 text-xs font-medium text-semantic-fg-disabled hover:bg-semantic-bg-base-bg"
              onClick={() =>
                setMode((prev) => {
                  if (prev === "list") {
                    return "groupByFormat";
                  }
                  return "list";
                })
              }
            >
              {mode === "list" ? "list" : "group"}
            </button> */}
          </div>
          <div className="flex flex-col gap-y-4">{hintFields}</div>
        </div>
      </ScrollArea.Root>
    </div>
  );
};
