"use client";

import type { Model } from "instill-sdk";
import * as React from "react";

import { CodeBlock, ModelSectionHeader } from "../../../components";
import { CodeString } from "../../../components/CodeString";
import {
  defaultCodeSnippetStyles,
  getInstillTaskHttpRequestExample,
} from "../../../constant";

export type ModelApiProps = {
  model?: Model;
};

const OWNER = {
  id: null,
};

export const ModelApi = ({ model }: ModelApiProps) => {
  const owner = React.useMemo(() => {
    if (!model) {
      return OWNER;
    }

    const owner = model.owner?.user || model.owner?.organization;

    if (!owner || !owner.profile) {
      return OWNER;
    }

    return {
      id: owner.id || "",
    };
  }, [model]);

  return (
    <div className="flex flex-col">
      <div className="mb-5 flex border-b border-semantic-bg-line">
        <ModelSectionHeader className="mb-5">
          How to run {model?.id} with API
        </ModelSectionHeader>
      </div>
      <div className="flex flex-col gap-y-6">
        <div className="mt-5 font-semibold text-semantic-fg-secondary">
          Set the <CodeString>INSTILL_API_TOKEN</CodeString> env variable.
        </div>
        <CodeBlock
          codeString={"$ export INSTILL_API_TOKEN=********"}
          wrapLongLines={true}
          language="bash"
          customStyle={defaultCodeSnippetStyles}
        />
        <div className="mt-5 font-semibold text-semantic-fg-secondary">
          Run{" "}
          <CodeString>
            {owner.id}/{model?.id}
          </CodeString>{" "}
          using API.
        </div>
        <CodeBlock
          codeString={getInstillTaskHttpRequestExample(model)}
          wrapLongLines={true}
          language="bash"
          customStyle={defaultCodeSnippetStyles}
        />
        {model?.inputSchema || model?.outputSchema ? (
          <ModelSectionHeader className="mt-5">JSON schema</ModelSectionHeader>
        ) : null}
        {model?.inputSchema ? (
          <React.Fragment>
            <h3 className="font-medium text-black">Input</h3>
            <CodeBlock
              codeString={JSON.stringify(model.inputSchema, null, 2)}
              wrapLongLines={true}
              language="json"
              customStyle={defaultCodeSnippetStyles}
            />
          </React.Fragment>
        ) : null}
        {model?.outputSchema ? (
          <React.Fragment>
            <h3 className="font-medium text-black">Output</h3>
            <CodeBlock
              codeString={JSON.stringify(model.outputSchema, null, 2)}
              wrapLongLines={true}
              language="json"
              customStyle={defaultCodeSnippetStyles}
            />
          </React.Fragment>
        ) : null}
      </div>
    </div>
  );
};
