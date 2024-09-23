import * as React from "react";
import Fuse from "fuse.js";
import { Nullable, PipelineComponent, PipelineComponentMap } from "instill-sdk";

import { Icons } from "@instill-ai/design-system";

import { ImageWithFallback } from "../../../components";
import { checkComponentTypeHelper } from "../lib/checkComponentTypeHelper";
import { SidebarSection } from "./SidebarSection";

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
    <SidebarSection heading="Component" className={className}>
      {pipelineComponentMap
        ? searchedComponents.map((component) => (
            <div key={component.key} className="flex flex-row gap-x-2">
              <div className="rounded-[2px] flex items-center justify-center w-6 h-6 bg-semantic-bg-primary border border-semantic-bg-line">
                {checkComponentTypeHelper.isPipelineGeneralComponent(
                  component,
                ) ? (
                  <ImageWithFallback
                    src={`/icons/${component.definition?.id}.svg`}
                    width={16}
                    height={16}
                    alt={`${component.definition?.title}-icon`}
                    fallbackImg={
                      <Icons.Box className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                    }
                  />
                ) : null}
                {checkComponentTypeHelper.isPipelineIteratorComponent(
                  component,
                ) ? (
                  <ImageWithFallback
                    src={`/icons/iterator.svg`}
                    width={16}
                    height={16}
                    alt="iterator-icon"
                    fallbackImg={
                      <Icons.Box className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
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
    </SidebarSection>
  );
};
