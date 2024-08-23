import * as React from "react";

import { Collapsible, Icons } from "@instill-ai/design-system";

export const SidebarSection = ({
  heading,
  children,
  className,
}: {
  heading: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible.Root className={className} open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className={open ? "mb-2" : ""} asChild>
        <button className="flex w-full items-center gap-x-2 px-2 py-1.5">
          {open ? (
            <Icons.ChevronDown className="h-3 w-3 stroke-semantic-fg-primary" />
          ) : (
            <Icons.ChevronRight className="h-3 w-3 stroke-semantic-fg-primary" />
          )}
          <p className="text-semantic-fg-primary product-button-button-3">
            {heading}
          </p>
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className="flex flex-col gap-y-1 px-2">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
