import cn from "clsx";
import * as React from "react";
import { Collapsible, Icons } from "@instill-ai/design-system";

export const LeftSidebarCollapsible = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className="mb-2 px-2" asChild>
        <button className="flex w-full flex-row items-center gap-x-1 rounded py-1 hover:bg-semantic-bg-secondary">
          {open ? (
            <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-primary" />
          ) : (
            <Icons.ChevronRight className="h-4 w-4 stroke-semantic-fg-primary" />
          )}
          <p className=" text-semantic-fg-primary product-body-text-3-semibold">
            {title}
          </p>
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content
        className={cn(
          "flex w-full flex-col gap-y-4 border-b border-semantic-bg-line px-6",
          { "pb-4": open }
        )}
      >
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
