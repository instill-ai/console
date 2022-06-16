import { FC, useState } from "react";
import {
  BasicProgressMessageBox,
  BasicUploadFileField,
} from "@instill-ai/design-system";
import { AxiosError } from "axios";

import { ModelInstance } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import TestModelInstanceResultBlock from "@/components/ui/TestModelInstanceResultBlock";
import { useTestModelInstance } from "@/services/model";

export type TestModelInstanceFormProps = {
  modelInstance: Nullable<ModelInstance>;
};

const TestModelInstanceForm: FC<TestModelInstanceFormProps> = ({
  modelInstance,
}) => {
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # Handle testing the model                                        #
  // #                                                                 #
  // ###################################################################

  const [resultBlockIsOpen, setResultBlockIsOpen] = useState(false);

  const [isTestingModelInstance, setIsTestingModelInstance] = useState(false);
  const [testModelInstanceError, setTestModelInstanceError] =
    useState<Nullable<string>>(null);
  const [testModelInstanceResult, setTestModelInstanceResult] =
    useState<Nullable<string>>(null);

  const testModelInstance = useTestModelInstance();

  const fileOnChangeCb = (_: string, file: string) => {
    if (!modelInstance || !file) return;

    setTestModelInstanceError(null);
    setIsTestingModelInstance(true);

    testModelInstance.mutate(
      {
        modelInstanceName: modelInstance?.name,
        content: file,
      },
      {
        onSuccess: (result) => {
          setIsTestingModelInstance(false);
          setResultBlockIsOpen(true);
          setTestModelInstanceResult(JSON.stringify(result, null, "\t"));
          if (amplitudeIsInit) {
            sendAmplitudeData("test_model_instance", {
              type: "critical_action",
              process: "model",
            });
          }
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            setTestModelInstanceError(error.response?.data.title);
            setResultBlockIsOpen(false);
            setIsTestingModelInstance(false);
          } else {
            setTestModelInstanceError(
              "Something went wrong when deploying model"
            );
            setIsTestingModelInstance(false);
          }
        },
      }
    );
  };

  return (
    <>
      <div className="mb-10 flex flex-col gap-y-5">
        <BasicUploadFileField
          id="file"
          label="Upload a file"
          description="Create and upload a zip file that contains all the model files from your computer"
          error={null}
          onChangeInput={fileOnChangeCb}
          placeholder=""
          uploadButtonText="Upload"
          required={true}
          readOnly={false}
          disabled={false}
        />
      </div>
      <div className="flex flex-row">
        <div className="mr-auto flex">
          {testModelInstanceError ? (
            <BasicProgressMessageBox width="w-[25vw]" status="error">
              {testModelInstanceError}
            </BasicProgressMessageBox>
          ) : isTestingModelInstance ? (
            <BasicProgressMessageBox width="w-[25vw]" status="progressing">
              Testing...
            </BasicProgressMessageBox>
          ) : null}
        </div>
        <TestModelInstanceResultBlock
          width="w-[42vw]"
          result={testModelInstanceResult ? testModelInstanceResult : ""}
          blockIsOpen={resultBlockIsOpen}
          setBlockIsOpen={setResultBlockIsOpen}
        />
      </div>
    </>
  );
};

export default TestModelInstanceForm;
