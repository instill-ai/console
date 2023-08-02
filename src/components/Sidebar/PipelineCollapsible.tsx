import cn from "clsx";
import { useState } from "react";
import { useRouter } from "next/router";
import { Icons } from "@instill-ai/design-system";
import * as Collapsible from "@radix-ui/react-collapsible";
import { SidebarLink } from "./SidebarLink";

export type PipelineCollapsibleProps = {
  className?: string;
};

export const PipelineCollapsible = (props: PipelineCollapsibleProps) => {
  const { className } = props;
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("w-full", className)}
    >
      <div className="relative py-4">
        <SidebarLink
          href="/pipelines"
          icon={
            <Icons.Pipeline className="h-6 w-6 stroke-semantic-fg-primary" />
          }
          name="Pipelines"
          hightlighted={router.pathname.split("/")[1] === "pipelines"}
          className="px-3"
        />
        <Collapsible.Trigger className="absolute right-3 top-1/2 z-30 ml-auto -translate-y-1/2">
          {isOpen ? (
            <Icons.ChevronUp className="h-6 w-6 stroke-semantic-fg-primary" />
          ) : (
            <Icons.ChevronDown className="h-6 w-6 stroke-semantic-fg-primary" />
          )}
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content className="flex flex-col">
        <SidebarLink
          href="/operators"
          icon={
            <Icons.Database01 className="h-6 w-6 stroke-semantic-fg-primary" />
          }
          name="Operator"
          hightlighted={router.pathname.split("/")[1] === "operators"}
          className="pl-12 pr-3"
        />
        <SidebarLink
          href="/ais"
          icon={<Icons.Model className="h-6 w-6 stroke-semantic-fg-primary" />}
          name="AI"
          hightlighted={router.pathname.split("/")[1] === "ais"}
          className="pl-12 pr-3"
        />
        <SidebarLink
          href="/blockchains"
          icon={
            <Icons.CubeOutline className="h-6 w-6 stroke-semantic-fg-primary" />
          }
          name="Blockchain"
          hightlighted={router.pathname.split("/")[1] === "blockchains"}
          className="pl-12 pr-3"
        />
        <SidebarLink
          href="/data"
          icon={<Icons.Box className="h-6 w-6 stroke-semantic-fg-primary" />}
          name="Data"
          hightlighted={router.pathname.split("/")[1] === "data"}
          className="pl-12 pr-3"
        />
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
