import * as React from "react";
import Fuse from "fuse.js";
import { Nullable, PipelineComponent, PipelineComponentMap } from "instill-sdk";

import { Collapsible, Icons } from "@instill-ai/design-system";

import { ImageWithFallback } from "../../../components";
import {
  isPipelineGeneralComponent,
  isPipelineIteratorComponent,
} from "../../pipeline-builder/lib/checkComponentType";

type PipelineComponentWKey = PipelineComponent & {
  key: string;
};

export const ComponentSection = ({
  pipelineComponentMap,
  className,
  searchCode,
}: {
  pipelineComponentMap: Nullable<PipelineComponentMap>;
  className?: string;
  searchCode: Nullable<string>;
}) => {
  const [open, setOpen] = React.useState(false);

  const searchedComponents: PipelineComponentWKey[] = React.useMemo(() => {
    if (!pipelineComponentMap) return [];
    const componentsWithKey = Object.entries(pipelineComponentMap).map(
      ([key, component]) => ({
        key,
        ...component,
      }),
    );

    if (!searchCode) return componentsWithKey;

    const fuse = new Fuse(componentsWithKey, {
      keys: ["key", "definition.title", "definition.id"],
    });

    return fuse.search(searchCode).map((result) => result.item);
  }, [pipelineComponentMap, searchCode]);

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
            Components
          </p>
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className="flex flex-col gap-y-1 px-2">
        {pipelineComponentMap
          ? searchedComponents.map((component) => (
              <div key={component.key} className="flex flex-row gap-x-2">
                <div className="rounded-[2px] flex items-center justify-center w-6 h-6 bg-semantic-bg-primary border border-semantic-bg-line">
                  {isPipelineGeneralComponent(component) ? (
                    <ImageWithFallback
                      src={`/icons/${component.definition?.id}.svg`}
                      width={16}
                      height={16}
                      alt={`${component.definition?.title}-icon`}
                      fallbackImg={
                        <Icons.Box className="my-auto h-8 w-8 stroke-semantic-fg-primary" />
                      }
                    />
                  ) : null}
                  {isPipelineIteratorComponent(component) ? (
                    <ImageWithFallback
                      src={`/icons/iterator.svg`}
                      width={16}
                      height={16}
                      alt="iterator-icon"
                      fallbackImg={
                        <Icons.Box className="my-auto h-8 w-8 stroke-semantic-fg-primary" />
                      }
                    />
                  ) : null}
                </div>
                <p className="text-xs text-semantic-fg-primary my-auto">
                  {component.key}
                </p>
              </div>
            ))
          : null}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
