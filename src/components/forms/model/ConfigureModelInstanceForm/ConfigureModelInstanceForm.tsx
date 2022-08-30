import { FC, useState } from "react";
import cn from "clsx";

import { ModelInstance } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { FormBase } from "../../commons";
import {
  BasicProgressMessageBox,
  BasicTextField,
  ProgressMessageBoxState,
} from "@instill-ai/design-system";

export type ConfigureModelInstanceFormProps = {
  modelInstance: ModelInstance;
  marginBottom: Nullable<string>;
};

export type ConfigureModelInstanceFormValue = {
  repo: Nullable<string>;
  tag: Nullable<string>;
  repoUrl: Nullable<string>;
};

const ConfigureModelInstanceForm: FC<ConfigureModelInstanceFormProps> = ({
  modelInstance,
  marginBottom,
}) => {
  const [canEdit, setCanEdit] = useState(false);

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const handleEditButton = () => {
    if (!canEdit) {
      setCanEdit(true);
      return;
    }
  };

  return (
    <div className={cn("flex flex-col", marginBottom)}>
      <FormBase
        padding={null}
        marginBottom="mb-10"
        noValidate={true}
        flex1={false}
      >
        <div className="flex flex-col gap-y-5">
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
        </div>
      </FormBase>
      {/* <div className="mb-10 flex flex-row">
        <PrimaryButton
          disabled={true}
          onClickHandler={() => handleEditButton()}
          position="ml-auto my-auto"
          type="button"
        >
          {canEdit ? "Done" : "Edit"}
        </PrimaryButton>
      </div> */}
      <div className="flex flex-row">
        <BasicProgressMessageBox
          state={messageBoxState}
          setState={setMessageBoxState}
          width="w-[25vw]"
          closable={true}
        />
      </div>
    </div>
  );
};

export default ConfigureModelInstanceForm;
