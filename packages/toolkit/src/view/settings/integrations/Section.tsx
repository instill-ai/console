import * as React from "react";
import { Nullable } from "instill-sdk";

import { Accordion } from "@instill-ai/design-system";

export const Section = ({
  title,
  children,
  initialAccordionValue,
}: {
  title: string;
  children: React.ReactNode;
  initialAccordionValue: Nullable<string[]>;
}) => {
  const [value, setValue] = React.useState<Nullable<string[]>>(null);

  React.useEffect(() => {
    if (initialAccordionValue) {
      setValue(initialAccordionValue);
    }
  }, [initialAccordionValue]);

  return (
    <div className="mt-6 flex flex-col gap-y-4">
      <div className="text-semantic-fg-primary text-lg font-medium">
        {title}
      </div>
      <Accordion.Root
        value={value ?? undefined}
        type="multiple"
        className="flex flex-col border-semantic-bg-line border rounded"
        onValueChange={setValue}
      >
        {children}
      </Accordion.Root>
    </div>
  );
};
