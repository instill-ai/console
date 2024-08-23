import * as React from "react";
import Fuse from "fuse.js";
import {
  Nullable,
  PipelineVariableField,
  PipelineVariableFieldMap,
} from "instill-sdk";

import { Icons } from "@instill-ai/design-system";

import { SidebarSection } from "./SidebarSection";

type VariableFieldWKey = PipelineVariableField & {
  key: string;
};

export const VariableSection = ({
  pipelineVariableFieldMap,
  className,
  searchCode,
}: {
  pipelineVariableFieldMap: Nullable<PipelineVariableFieldMap>;
  className?: string;
  searchCode: Nullable<string>;
}) => {
  const searchedVariableFields: VariableFieldWKey[] = React.useMemo(() => {
    if (!pipelineVariableFieldMap) return [];
    const variableFieldsWithKey = Object.entries(pipelineVariableFieldMap).map(
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
  }, [pipelineVariableFieldMap, searchCode]);

  return (
    <SidebarSection className={className} heading="Variable">
      {searchedVariableFields
        ? searchedVariableFields.map((field) => (
            <div key={field.key} className="flex flex-row gap-x-2">
              <div className="rounded-[2px] flex items-center justify-center w-6 h-6 bg-semantic-bg-primary border border-semantic-bg-line">
                <Icons.Lightning01 className="w-4 h-4 stroke-semantic-fg-primary" />
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
