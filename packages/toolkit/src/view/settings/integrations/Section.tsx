import * as React from "react";

import { Accordion } from "@instill-ai/design-system";

export const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="mt-6 flex flex-col gap-y-4">
      <div className="text-semantic-fg-primary text-lg font-medium">
        {title}
      </div>
      <Accordion.Root
        collapsible={true}
        type="single"
        className="flex flex-col border-semantic-bg-line border rounded"
      >
        {children}
      </Accordion.Root>
    </div>
  );
};
