import * as React from "react";
import Fuse from "fuse.js";
import {
  Nullable,
  PipelineOutputField,
  PipelineOutputFieldMap,
} from "instill-sdk";

import { Icons } from "@instill-ai/design-system";

import { SidebarSection } from "./SidebarSection";

type VariableFieldWKey = PipelineOutputField & {
  key: string;
};

export const OutputSection = ({
  pipelineOutputFieldMap,
  className,
  searchCode,
}: {
  pipelineOutputFieldMap: Nullable<PipelineOutputFieldMap>;
  className?: string;
  searchCode: Nullable<string>;
}) => {
  const searchedOutputFields: VariableFieldWKey[] = React.useMemo(() => {
    if (!pipelineOutputFieldMap) return [];
    const variableFieldsWithKey = Object.entries(pipelineOutputFieldMap).map(
      ([key, field]) => ({
        key,
        ...field,
      }),
    );

    if (!searchCode) return variableFieldsWithKey;

    const fuse = new Fuse(variableFieldsWithKey, {
      keys: ["key"],
    });

    return fuse.search(searchCode).map((result) => result.item);
  }, [pipelineOutputFieldMap, searchCode]);

  return (
    <SidebarSection className={className} heading="Output">
      {searchedOutputFields
        ? searchedOutputFields.map((field) => (
            <div key={field.key} className="flex flex-row gap-x-2">
              <div className="rounded-[2px] flex items-center justify-center w-6 h-6 bg-semantic-bg-primary border border-semantic-bg-line">
                <Icons.Box className="w-4 h-4 stroke-semantic-fg-primary" />
              </div>
              <p className="text-xs text-semantic-fg-primary my-auto">
                {field.key}
              </p>
            </div>
          ))
        : null}
    </SidebarSection>
  );
};
