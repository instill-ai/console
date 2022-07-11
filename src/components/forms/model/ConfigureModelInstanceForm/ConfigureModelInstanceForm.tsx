import { FC, useCallback, useState } from "react";
import cn from "clsx";

import { ModelInstance } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { FormBase } from "../../commons";
import { PrimaryButton } from "@/components/ui";
import {
  BasicProgressMessageBox,
  BasicTextField,
  ProgressMessageBoxState,
} from "@instill-ai/design-system";
import { TestModelInstanceSection } from "@/components/sections";

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

  const handler = useCallback(() => {
    console.log("hi");
  }, []);

  return (
    <div className={cn("flex flex-col", marginBottom)}>
      <FormBase padding={null} marginBottom="mb-10" noValidate={true}>
        <div className="flex flex-col gap-y-5">
          {modelInstance.model_definition === "model-definitions/local" ? (
            <></>
          ) : null}
          {modelInstance.model_definition === "model-definitions/github" ? (
            <>
              <BasicTextField
                id="modelRepo"
                label="GitHub repository"
                additionalMessageOnLabel={null}
                description="The name of a public GitHub repository, e.g. `instill-ai/yolov4`."
                value={modelInstance.configuration.repository}
                error={null}
                disabled={true}
                readOnly={false}
                required={true}
                placeholder=""
                type="text"
                autoComplete="off"
                onChangeInput={handler}
              />
            </>
          ) : null}
          {modelInstance.model_definition === "model-definitions/artivc" ? (
            <>
              <BasicTextField
                id="tag"
                label="ArtiVC version"
                additionalMessageOnLabel={null}
                description="Tag of the ArtiVC, e.g., `v0.1.0`."
                value={modelInstance.configuration.tag}
                error={null}
                disabled={true}
                readOnly={false}
                required={true}
                placeholder=""
                type="text"
                autoComplete="off"
                onChangeInput={handler}
              />
              <BasicTextField
                id="url"
                label="Cloud storage url"
                additionalMessageOnLabel={null}
                description="the cloud storage url, e.g. `gs://public-europe-west2-c-artifacts/vdp/public-models/yolov4`."
                value={modelInstance.configuration.url}
                error={null}
                disabled={true}
                readOnly={false}
                required={true}
                placeholder=""
                type="text"
                autoComplete="off"
                onChangeInput={handler}
              />
            </>
          ) : null}
        </div>
      </FormBase>
      <TestModelInstanceSection
        modelInstance={modelInstance}
        marginBottom="mb-10"
      />
      <div className="mb-10 flex flex-row">
        <PrimaryButton
          disabled={true}
          onClickHandler={() => handleEditButton()}
          position="ml-auto my-auto"
          type="button"
        >
          {canEdit ? "Done" : "Edit"}
        </PrimaryButton>
      </div>
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
