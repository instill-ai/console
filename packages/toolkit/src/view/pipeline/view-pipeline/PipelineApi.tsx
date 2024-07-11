import React, { useMemo } from "react";

import { CodeBlock, ModelSectionHeader } from "../../../components";
import { CodeString } from "../../../components/CodeString";
import {
  defaultCodeSnippetStyles,
} from "../../../constant";
import type { Pipeline, PipelineVariableFieldMap } from "../../../lib";
import { generateInputsPayload, getInstillPipelineHttpRequestExample } from "../../../constant/pipeline";
import { useSearchParams } from "next/navigation";

export type PipelineApiProps = {
  pipeline?: Pipeline;
};

const OWNER = {
  id: null,
};

export const PipelineApi = ({ pipeline }: PipelineApiProps) => {
  const searchParams = useSearchParams();
  const version = searchParams.get("version");

  const owner = useMemo(() => {
    if (!pipeline) {
      return OWNER;
    }

    const owner = 'user' in pipeline.owner ? pipeline.owner.user : pipeline.owner.organization;

    if (!owner || !owner.profile) {
      return OWNER;
    }

    return {
      id: owner.id || "",
    };
  }, [pipeline]);

  const runSnippet = React.useMemo(() => {
    if (!pipeline?.dataSpecification?.input?.properties) {
      return "";
    }

    const input = generateInputsPayload(pipeline.dataSpecification?.input.properties as PipelineVariableFieldMap);

    return getInstillPipelineHttpRequestExample({
      pipelineName: pipeline?.name,
      version,
      inputsString: JSON.stringify({ inputs: [ input ] }, null, 2),
    })
  }, [version, pipeline])

  return (
    <div className="flex flex-col">
      <div className="mb-5 flex border-b border-semantic-bg-line">
        <ModelSectionHeader className="mb-5">
          How to run {pipeline?.id} with API
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
            {owner.id}/{pipeline?.id}
          </CodeString>{" "}
          using Instill API.
        </div>
        <CodeBlock
          codeString={runSnippet}
          wrapLongLines={true}
          language="bash"
          customStyle={defaultCodeSnippetStyles}
        />
        {pipeline?.dataSpecification?.input || pipeline?.dataSpecification?.output ? (
          <ModelSectionHeader className="mt-5">
            Model JSON schema
          </ModelSectionHeader>
        ) : null}
        {pipeline?.dataSpecification?.input ? (
          <React.Fragment>
            <h3 className="font-medium text-black">Input</h3>
            <CodeBlock
              codeString={JSON.stringify(pipeline?.dataSpecification?.input, null, 2)}
              wrapLongLines={true}
              language="json"
              customStyle={defaultCodeSnippetStyles}
            />
          </React.Fragment>
        ) : null}
        {pipeline?.dataSpecification?.output ? (
          <React.Fragment>
            <h3 className="font-medium text-black">Output</h3>
            <CodeBlock
              codeString={JSON.stringify(pipeline?.dataSpecification?.output, null, 2)}
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
