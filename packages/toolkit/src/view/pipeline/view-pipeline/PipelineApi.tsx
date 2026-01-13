"use client";

import type {
  Pipeline,
  PipelineRelease,
  PipelineVariableFieldMap,
} from "instill-sdk";
import * as React from "react";
import { useSearchParams } from "next/navigation";

import { CodeBlock, EmptyView, ModelSectionHeader } from "../../../components";
import { CodeString } from "../../../components/CodeString";
import { defaultCodeSnippetStyles } from "../../../constant";
import {
  generateInputsPayload,
  getInstillPipelineHttpRequestExample,
} from "../../../constant/pipeline";

export type PipelineApiProps = {
  pipeline?: Pipeline;
  releases: PipelineRelease[];
};

const OWNER = {
  id: null,
};

export const PipelineApi = ({ pipeline, releases }: PipelineApiProps) => {
  const searchParams = useSearchParams();
  const currentVersion = searchParams.get("version");

  // NOTE: In CE, owner is always a user (organizations are EE-only)
  const owner = React.useMemo(() => {
    if (!pipeline) {
      return OWNER;
    }

    const user = pipeline.owner?.user;

    if (!user || !user.profile) {
      return OWNER;
    }

    return {
      id: user.id || "",
    };
  }, [pipeline]);

  const formSchema = React.useMemo(() => {
    if (currentVersion && releases.length > 0) {
      const release = releases.find((release) => release.id === currentVersion);

      if (release) {
        return release.dataSpecification;
      }
    }

    if (pipeline) {
      return pipeline.dataSpecification;
    }

    return {
      input: null,
      output: null,
    };
  }, [currentVersion, pipeline, releases]);

  const runSnippet = React.useMemo(() => {
    if (!formSchema?.input?.properties) {
      return "";
    }

    const input = generateInputsPayload(
      formSchema.input?.properties as PipelineVariableFieldMap,
    );

    return getInstillPipelineHttpRequestExample({
      pipelineName: pipeline?.name,
      version: currentVersion,
      inputsString: JSON.stringify({ inputs: [input] }, null, 2),
    });
  }, [formSchema, currentVersion, pipeline]);

  if (!formSchema || !formSchema.input || !formSchema.output) {
    return (
      <EmptyView
        iconName="AlertCircle"
        title="Pipeline is not runnable"
        description="This pipeline cannot be run. Please check the configuration and ensure all necessary components are set up correctly."
        className="flex-1"
      />
    );
  }

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
          using API.
        </div>
        <CodeBlock
          codeString={runSnippet}
          wrapLongLines={true}
          language="bash"
          customStyle={defaultCodeSnippetStyles}
        />
        {formSchema ? (
          <ModelSectionHeader className="mt-5">JSON schema</ModelSectionHeader>
        ) : null}
        {formSchema?.input ? (
          <React.Fragment>
            <h3 className="font-medium text-black">Input</h3>
            <CodeBlock
              codeString={JSON.stringify(formSchema.input, null, 2)}
              wrapLongLines={true}
              language="json"
              customStyle={defaultCodeSnippetStyles}
            />
          </React.Fragment>
        ) : null}
        {formSchema?.output ? (
          <React.Fragment>
            <h3 className="font-medium text-black">Output</h3>
            <CodeBlock
              codeString={JSON.stringify(formSchema.output, null, 2)}
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
