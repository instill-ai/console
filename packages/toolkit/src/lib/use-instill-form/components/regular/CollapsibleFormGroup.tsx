import * as React from "react";
import { Collapsible, Icons } from "@instill-ai/design-system";
import { Nullable } from "../../../type";

export const CollapsibleFormGroup = ({
  path,
  title,
  children,
  defaultOpen,
  forceCloseCollapsibleFormGroups,
  updateForceCloseCollapsibleFormGroups,
}: {
  path: string;
  title: Nullable<string>;
  children: React.ReactNode;
  defaultOpen?: boolean;
  forceCloseCollapsibleFormGroups?: string[];
  updateForceCloseCollapsibleFormGroups?: (value: string[]) => void;
}) => {
  const [open, setOpen] = React.useState(defaultOpen ?? false);

  React.useEffect(() => {
    if (
      forceCloseCollapsibleFormGroups &&
      forceCloseCollapsibleFormGroups.includes(path)
    ) {
      setOpen(false);
      if (updateForceCloseCollapsibleFormGroups) {
        updateForceCloseCollapsibleFormGroups(
          forceCloseCollapsibleFormGroups.filter((e) => e !== path)
        );
      }
    }
  }, [forceCloseCollapsibleFormGroups, updateForceCloseCollapsibleFormGroups]);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className="mb-2" asChild>
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
      <Collapsible.Content className="flex flex-col gap-y-4">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
