import cn from "clsx";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Icons } from "@instill-ai/design-system";
import * as Collapsible from "@radix-ui/react-collapsible";

export const PipelineCollapsible = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="relative">
        <Link
          href="/pipelines"
          className={cn(
            "mb-2 flex flex-row items-center rounded-xs border border-transparent px-3 py-2 hover:bg-semantic-bg-base-bg",
            {
              "!border-semantic-accent-default border-opacity-100 bg-semantic-accent-bg":
                router.pathname === "/pipelines",
            }
          )}
        >
          <div className="flex flex-row items-center space-x-3">
            <Icons.Pipeline className="h-6 w-6 stroke-semantic-fg-primary" />
            <h4 className="text-semantic-fg-primary product-body-text-2-semibold">
              Pipelines
            </h4>
          </div>
        </Link>
        <Collapsible.Trigger className="absolute right-3 top-1/2 z-30 ml-auto -translate-y-1/2">
          {isOpen ? (
            <Icons.ChevronUp className="h-6 w-6 stroke-semantic-fg-primary" />
          ) : (
            <Icons.ChevronDown className="h-6 w-6 stroke-semantic-fg-primary" />
          )}
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content className="flex flex-col space-y-1">
        <Link
          href="/sources"
          className={cn(
            "flex flex-row items-center space-x-2 rounded-xs border border-transparent py-2 pl-12 pr-3 hover:bg-semantic-bg-base-bg",
            {
              "!border-semantic-accent-default border-opacity-100 bg-semantic-accent-bg":
                router.pathname === "/sources",
            }
          )}
        >
          <Icons.Database01 className="h-6 w-6 stroke-semantic-fg-primary" />
          <p className="stroke-semantic-fg-primary product-body-text-2-semibold">
            Sources
          </p>
        </Link>
        <Link
          href="/models"
          className={cn(
            "flex flex-row items-center space-x-2 rounded-xs border border-transparent py-2 pl-12 pr-3 hover:bg-semantic-bg-base-bg",
            {
              "!border-semantic-accent-default border-opacity-100 bg-semantic-accent-bg":
                router.pathname === "/models",
            }
          )}
        >
          <Icons.Model className="h-6 w-6 stroke-semantic-fg-primary" />
          <p className="stroke-semantic-fg-primary product-body-text-2-semibold">
            Models
          </p>
        </Link>
        <Link
          href="/destinations"
          className={cn(
            "flex flex-row items-center space-x-2 rounded-xs border border-transparent py-2 pl-12 pr-3 hover:bg-semantic-bg-base-bg",
            {
              "!border-semantic-accent-default border-opacity-100 bg-semantic-accent-bg":
                router.pathname === "/destinations",
            }
          )}
        >
          <Icons.Box className="h-6 w-6 stroke-semantic-fg-primary" />
          <p className="stroke-semantic-fg-primary product-body-text-2-semibold">
            Destinations
          </p>
        </Link>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
