"use client";

import * as React from "react";
import {
  Nullable,
  PipelineComponentMap,
  PipelineOutputFieldMap,
  PipelineVariableFieldMap,
} from "instill-sdk";

import { Icons, Separator } from "@instill-ai/design-system";

import { env } from "../../../server";
import { ComponentSection } from "./ComponentSection";
import { OutputSection } from "./OutputSection";
import { SubscribeCTA } from "./SubscribeCTA";
import { SupportLinks } from "./SupportLinks";
import { VariableSection } from "./VariableSection";

export const Sidebar = ({
  pipelineComponentMap,
  pipelineVariableFieldMap,
  pipelineOutputFieldMap,
}: {
  pipelineComponentMap: Nullable<PipelineComponentMap>;
  pipelineVariableFieldMap: Nullable<PipelineVariableFieldMap>;
  pipelineOutputFieldMap: Nullable<PipelineOutputFieldMap>;
}) => {
  const searchCodeInputRef = React.useRef<HTMLInputElement>(null);
  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);

  return (
    <div className="flex flex-col h-full px-2.5">
      <div className="flex flex-col mb-auto">
        <div
          onClick={() => {
            searchCodeInputRef.current?.focus();
          }}
          className="mb-2 pl-2 h-8 w-full items-center flex flex-row gap-x-2 bg-semantic-bg-primary border border-semantic-bg-line rounded"
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
        <VariableSection
          searchCode={searchCode}
          pipelineVariableFieldMap={pipelineVariableFieldMap}
        />
        <div className="px-1 my-2">
          <Separator orientation="horizontal" />
        </div>
        <ComponentSection
          searchCode={searchCode}
          pipelineComponentMap={pipelineComponentMap}
        />
        <div className="px-1 my-2">
          <Separator orientation="horizontal" />
        </div>
        <OutputSection
          searchCode={searchCode}
          pipelineOutputFieldMap={pipelineOutputFieldMap}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <SupportLinks />

        {env("NEXT_PUBLIC_APP_ENV") === "CLOUD" ? <SubscribeCTA /> : null}
      </div>
    </div>
  );
};
