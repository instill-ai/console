import * as React from "react";
import { Nullable } from "instill-sdk";

import { Collapsible, Icons } from "@instill-ai/design-system";

export const PipelineSection = ({
  pipelineId,
  className,
}: {
  pipelineId: Nullable<string>;
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible.Root className={className} open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className="mb-2" asChild>
        <button className="flex w-full items-center gap-x-2 px-2 py-1.5">
          {open ? (
            <Icons.ChevronDown className="h-3 w-3 stroke-semantic-fg-primary" />
          ) : (
            <Icons.ChevronRight className="h-3 w-3 stroke-semantic-fg-primary" />
          )}
          <p className="text-semantic-fg-primary product-button-button-3">
            Pipeline
          </p>
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className="flex flex-col gap-y-4 px-2">
        <div className="flex flex-row items-center gap-x-2 py-1">
          <Icons.Pipeline className="h-4 w-4 stroke-semantic-accent-default" />
          <p className="text-xs font-sans text-semantic-fg-primary">
            {pipelineId}
          </p>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
