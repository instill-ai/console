import { FC, useMemo, useState } from "react";
import { useFormikContext } from "formik";
import {
  BasicProgressMessageBox,
  ProgressMessageBoxState,
} from "@instill-ai/design-system";

import { PrimaryButton } from "@/components/ui";
import { CreatePipelineFormValues } from "../CreatePipelineForm";
import { TextArea, TextField, FormikStep } from "@/components/formik";
import { useCreatePipeline, useUpdatePipeline } from "@/services/pipeline";
import { CreatePipelinePayload } from "@/lib/instill";
import { useRouter } from "next/router";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

const SetupPipelineDetailsStep: FC = () => {
  const { values, errors } = useFormikContext<CreatePipelineFormValues>();
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # 1 - Validate create pipeline form data                          #
  // #                                                                 #
  // ###################################################################

  const canSetupNewPipeline = useMemo(() => {
    const validator = {
      pipelineIsValid: false,
      sourceIsValid: false,
      modelIsValid: false,
      destinationIsValid: false,
    };

    // Pipeline - Every pipeline's fields are required
    if (values.pipeline.mode && values.pipeline.id) {
      validator.pipelineIsValid = true;
    }

    // Source - id and definition are required
    if (values.source.existing.id || values.source.existing.definition) {
      validator.sourceIsValid = true;
    }

    if (values.source.new.id || values.source.new.definition) {
      validator.sourceIsValid = true;
    }

    // Destination - id and definition are required
    if (
      values.destination.existing.id ||
      values.destination.existing.definition
    ) {
      validator.destinationIsValid = true;
    }

    if (values.destination.new.id || values.destination.new.definition) {
      validator.destinationIsValid = true;
    }

    // Model - new - github
    if (
      values.model.new.modelDefinition === "github" &&
      values.model.new.id &&
      values.model.new.modelInstanceName
    ) {
      validator.modelIsValid = true;
    }

    // Model - new - local
    if (
      values.model.new.modelDefinition === "local" &&
      values.model.new.id &&
      values.model.new.file
    ) {
      validator.modelIsValid = true;
    }

    // Model - new - artivc
    if (
      values.model.new.modelDefinition === "artivc" &&
      values.model.new.gcsBucketPath
    ) {
      validator.modelIsValid = true;
    }

    if (values.model.existing.id) {
      validator.modelIsValid = true;
    }

    if (
      validator.pipelineIsValid &&
      validator.sourceIsValid &&
      validator.modelIsValid &&
      validator.destinationIsValid
    ) {
      return true;
    } else {
      return false;
    }
  }, [values]);

  // ###################################################################
  // #                                                                 #
  // # 2 - Handle create pipeline                                      #
  // #                                                                 #
  // ###################################################################

  const createPipeline = useCreatePipeline();
  const updatePipeline = useUpdatePipeline();

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const handleSetupNewPipeline = () => {
    if (!canSetupNewPipeline || !router.isReady || !values.pipeline.id) {
      return;
    }
    let sourceName: string;

    if (values.source.type === "new") {
      if (!values.source.new.id) return;
      sourceName = `source-connectors/${values.source.new.id}`;
    } else {
      if (!values.source.existing.id) return;
      sourceName = `source-connectors/${values.source.existing.id}`;
    }

    let modelInstanceName: string;

    if (values.model.type === "new") {
      if (!values.model.new.modelInstanceName || !values.model.new.id) {
        return;
      }
      modelInstanceName = values.model.new.modelInstanceName;
    } else {
      if (
        !values.model.existing.id ||
        !values.model.existing.modelInstanceName
      ) {
        return;
      }

      modelInstanceName = values.model.existing.modelInstanceName;
    }

    let destinationName: string;

    if (values.destination.type === "new") {
      if (!values.destination.new.id) return;
      destinationName = `destination-connectors/${values.destination.new.id}`;
    } else {
      if (!values.destination.existing.id) return;
      destinationName = `destination-connectors/${values.destination.existing.id}`;
    }

    const payload: CreatePipelinePayload = {
      id: values.pipeline.id,
      recipe: {
        source: sourceName,
        model_instances: [modelInstanceName],
        destination: destinationName,
      },
    };

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Creating...",
    }));

    createPipeline.mutate(payload, {
      onSuccess: async (newPipeline) => {
        if (!values.pipeline.description) {
          setMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeed.",
          }));

          router.push("/pipelines");
          return;
        }
        updatePipeline.mutate(
          {
            name: newPipeline.name,
            description: values.pipeline.description,
          },
          {
            onSuccess: () => {
              if (amplitudeIsInit) {
                sendAmplitudeData("create_pipeline", {
                  type: "critical_action",
                  process: "pipeline",
                });
              }
              router.push("/pipelines");
            },
            onError: (error) => {
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
                  message: "Something went wrong when create the pipeline",
                }));
              }
            },
          }
        );
      },
      onError: (error) => {
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
            message: "Something went wrong when create the pipeline",
          }));
        }
      },
    });
  };

  return (
    <FormikStep>
      <div className="mb-5 flex flex-col gap-y-5">
        <TextField
          id="pipelineId"
          name="pipeline.id"
          label="ID"
          description={
            "Pick a name to help you identify this resource. The ID conforms to RFC-1034, " +
            "which restricts to letters, numbers, and hyphen, with the first character a letter," +
            "the last a letter or a number, and a 63 character maximum."
          }
          value={values.pipeline.id}
          error={errors.pipeline?.id || null}
          required={true}
        />
        <TextArea
          id="pipelineDescription"
          name="pipeline.description"
          label="Description"
          description="Fill with a short description."
          value={values.pipeline.description}
          error={errors.pipeline?.description || null}
        />
        <div className="flex flex-row">
          <BasicProgressMessageBox
            state={messageBoxState}
            setState={setMessageBoxState}
            width="w-[25vw]"
            closable={true}
          />
          <PrimaryButton
            position="ml-auto my-auto"
            type="button"
            disabled={canSetupNewPipeline ? false : true}
            onClickHandler={handleSetupNewPipeline}
          >
            Set up
          </PrimaryButton>
        </div>
      </div>
    </FormikStep>
  );
};

export default SetupPipelineDetailsStep;
