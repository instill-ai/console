import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  BasicProgressMessageBox,
  BasicUploadFileField,
  ProgressMessageBoxState,
} from "@instill-ai/design-system";
import cn from "clsx";

import {
  getCodeSourceQuery,
  getShikiSourceQuery,
  ModelInstance,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { useTestModelInstance } from "@/services/model";
import { CodeBlock } from "@/components/ui";
import Prism from "prismjs";

export type TestModelInstanceSectionProps = {
  modelInstance: Nullable<ModelInstance>;
  marginBottom: Nullable<string>;
};

const TestModelInstanceSection: FC<TestModelInstanceSectionProps> = ({
  modelInstance,
  marginBottom,
}) => {
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # Handle testing the model                                        #
  // #                                                                 #
  // ###################################################################

  const [testResult, setTestResult] =
    useState<Nullable<{ source: string; code: string }>>(null);

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const testModelInstance = useTestModelInstance();

  const fileOnChangeCb = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!modelInstance || !file) return;

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Testing...",
    }));

    setTestResult(null);

    testModelInstance.mutate(
      {
        modelInstanceName: modelInstance?.name,
        content: file,
      },
      {
        onSuccess: async (result) => {
          setMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeeded",
          }));

          try {
            const source = await getCodeSourceQuery(
              "test-result-template.mdx",
              "instilltestresult",
              JSON.stringify(result, null, "\t")
            );

            console.log(source);

            setTestResult({
              source,
              code: JSON.stringify(result, null, "\t"),
            });

            Prism.highlightAll();
          } catch (err) {
            console.log(err);
            setTestResult(null);
          }

          if (amplitudeIsInit) {
            sendAmplitudeData("test_model_instance", {
              type: "critical_action",
              process: "model",
            });
          }
        },
        onError: (error) => {
          setTestResult(null);
          if (error instanceof Error) {
            setMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: error.message,
            }));
          } else {
            setMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: "Something went wrong when test the model instance",
            }));
          }
        },
      }
    );
  };

  return (
    <div className={cn("flex flex-col", marginBottom)}>
      <h3 className="mb-5 text-black text-instill-h3">Testing</h3>
      <div className="mb-10 flex flex-col gap-y-5">
        <BasicUploadFileField
          id="file"
          label="Upload a file"
          additionalMessageOnLabel={
            modelInstance?.state === "STATE_ONLINE"
              ? null
              : "You could only test model when it is online"
          }
          description="Upload an image file from your computer to test the model instance"
          error={null}
          onChange={fileOnChangeCb}
          placeholder=""
          uploadButtonText="Upload"
          required={true}
          readOnly={false}
          disabled={modelInstance?.state === "STATE_ONLINE" ? false : true}
        />
      </div>
      {testResult ? <CodeBlock marginBottom="mb-10" {...testResult} /> : null}
      <BasicProgressMessageBox
        state={messageBoxState}
        setState={setMessageBoxState}
        width="w-[25vw]"
        closable={true}
      />
    </div>
  );
};

export default TestModelInstanceSection;
