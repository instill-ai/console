import { useMemo } from "react";
import { CodeBlock } from "../../../components";
import { CodeString } from "../../../components/CodeString";
import { Model, ModelTask } from "../../../lib";
import { InstillTaksHttpRequestExample } from "../../../constant";

export type ModelSettingsApiProps = {
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

export const ModelSettingsApi = ({ model }: ModelSettingsApiProps) => {
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
        <h2 className="mb-5 min-w-full rounded bg-semantic-bg-base-bg px-3 py-2.5 text-lg font-medium text-black">
          How to run {model?.id} with API
        </h2>
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
      </div>
    </div>
  );
};
