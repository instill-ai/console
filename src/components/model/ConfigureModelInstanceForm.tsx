import { useState } from "react";
import {
  BasicProgressMessageBox,
  BasicTextField,
  ProgressMessageBoxState,
} from "@instill-ai/design-system";

import { ModelInstance } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { FormBase } from "@/components/ui";

export type ConfigureModelInstanceFormProps = {
  modelInstance: ModelInstance;
  marginBottom: Nullable<string>;
};

export const ConfigureModelInstanceForm = ({
  modelInstance,
  marginBottom,
}: ConfigureModelInstanceFormProps) => {
  console.log(modelInstance);

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  return (
    <FormBase
      padding={null}
      marginBottom={marginBottom}
      noValidate={true}
      flex1={false}
    >
      <div className="flex flex-col gap-y-5 mb-10">
        {modelInstance.model_definition === "model-definitions/local" ? (
          <></>
        ) : null}
        {modelInstance.model_definition === "model-definitions/github" ? (
          <>
            <BasicTextField
              id="modelRepo"
              label="GitHub repository"
              description="The name of a public GitHub repository, e.g. `instill-ai/model-mobilenetv2`."
              value={modelInstance.configuration.repository}
              disabled={true}
              required={true}
            />
          </>
        ) : null}
        {modelInstance.model_definition === "model-definitions/artivc" ? (
          <>
            <BasicTextField
              id="tag"
              label="ArtiVC version"
              description="Tag of the ArtiVC, e.g. `v0.1.0`."
              value={modelInstance.configuration.tag}
              disabled={true}
              required={true}
            />
            <BasicTextField
              id="url"
              label="Cloud storage url"
              description="the cloud storage url, e.g. `gs://public-europe-west2-c-artifacts/vdp/public-models/yolov4`."
              value={modelInstance.configuration.url}
              disabled={true}
              required={true}
            />
          </>
        ) : null}
        {modelInstance.model_definition === "model-definitions/huggingface" ? (
          <>
            <BasicTextField
              id="huggingface-model-id"
              label="HuggingFace model ID"
              description="The name of a public HuggingFace model ID, e.g. `google/vit-base-patch16-224`."
              value={modelInstance.configuration.repo_id}
              disabled={true}
              required={true}
            />
          </>
        ) : null}
      </div>
      <div className="flex flex-row">
        <BasicProgressMessageBox
          state={messageBoxState}
          setState={setMessageBoxState}
          width="w-[25vw]"
          closable={true}
        />
      </div>
    </FormBase>
  );
};
