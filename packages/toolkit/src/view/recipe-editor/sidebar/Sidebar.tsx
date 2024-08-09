"use client";

import * as React from "react";
import { Nullable, PipelineComponentMap } from "instill-sdk";

import { Icons, Separator } from "@instill-ai/design-system";

import { ComponentSection } from "./ComponentSection";
import { PipelineSection } from "./PipelineSection";

export const Sidebar = ({
  pipelineId,
  pipelineComponentMap,
}: {
  pipelineId: Nullable<string>;
  pipelineComponentMap: Nullable<PipelineComponentMap>;
}) => {
  const searchCodeInputRef = React.useRef<HTMLInputElement>(null);
  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);

  return (
    <div className="flex flex-col w-[280px] h-full px-2.5">
      <div
        onClick={() => {
          searchCodeInputRef.current?.focus();
        }}
        className="mb-1.5 pl-2 h-8 w-full items-center flex flex-row gap-x-2 bg-semantic-bg-primary border border-semantic-bg-line rounded"
      >
        <Icons.SearchSm className="w-4 h-4 stroke-semantic-fg-primary" />
        <input
          ref={searchCodeInputRef}
          className="w-full rounded focus:outline-none"
          value={searchCode ?? ""}
          placeholder="Search..."
          onChange={(e) => setSearchCode(e.target.value)}
        />
      </div>
      <PipelineSection className="mb-2" pipelineId={pipelineId} />
      <div className="px-1 mb-2">
        <Separator orientation="horizontal" />
      </div>
      <ComponentSection pipelineComponentMap={pipelineComponentMap} />
    </div>
  );
};
