import { useMemo } from "react";
import { CodeBlock } from "../../../components";
import { CodeString } from "../../../components/CodeString";
import { Model, ModelTask } from "../../../lib";
import { InstillTaksHttpRequestExample } from "../../../constant";
import React from "react";
import { ModelSectionHeader } from "./SectionHeader";

export type ModelApiProps = {
  model?: Model;
};

const OWNER = {
  name: null,
};

const defaultCodeSnippetStyles = {
  fontSize: "14px",
  backgroundColor: "transparent",
  width: "100%",
  padding: "16px",
};

const getTaskApiHttpCall = (task?: ModelTask) => {
  if (!task) {
    return "";
  }

  return InstillTaksHttpRequestExample[task];
};

export const ModelApi = ({ model }: ModelApiProps) => {
  const owner = useMemo(() => {
    if (!model) {
      return OWNER;
    }

    const owner = model.owner.user || model.owner.organization;

    if (!owner || !owner.profile) {
      return OWNER;
    }

    return {
      name: owner.id || "",
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
            {owner.name}/{model?.id}
          </CodeString>{" "}
          using Instill API.
        </div>
        <CodeBlock
          codeString={getTaskApiHttpCall(model?.task)}
          wrapLongLines={true}
          language="bash"
          customStyle={defaultCodeSnippetStyles}
        />
        {model?.input_schema || model?.output_schema ? (
          <ModelSectionHeader className="mt-5">
            Model JSON schema
          </ModelSectionHeader>
        ) : null}
        {model?.input_schema ? (
          <React.Fragment>
            <h3 className="font-medium text-black">Input</h3>
            <CodeBlock
              codeString={JSON.stringify(model.input_schema, null, 2)}
              wrapLongLines={true}
              language="json"
              customStyle={defaultCodeSnippetStyles}
            />
          </React.Fragment>
        ) : null}
        {model?.output_schema ? (
          <React.Fragment>
            <h3 className="font-medium text-black">Output</h3>
            <CodeBlock
              codeString={JSON.stringify(model.output_schema, null, 2)}
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
