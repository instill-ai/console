import { FC, useMemo, useState } from "react";
import { useFormikContext } from "formik";

import { PrimaryButton } from "@/components/ui/Buttons";
import { CreatePipelineFormValues } from "../CreatePipelineForm";
import { TextArea, TextField, ToggleField, FormikStep } from "../../../formik";
import {
  useCreatePipeline,
  useUpdatePipeline,
} from "@/services/pipeline/PipelineServices";
import { CreatePipelinePayload } from "@/lib/instill";
import { useRouter } from "next/router";
import { BasicProgressMessageBox } from "@instill-ai/design-system";
import { Nullable } from "@/types/general";

const SetupPipelineDetailsStep: FC = () => {
  const { values, errors } = useFormikContext<CreatePipelineFormValues>();
  const router = useRouter();

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
    if (
      values.pipeline.mode &&
      values.pipeline.id &&
      values.pipeline.description
    ) {
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
      values.model.new.description &&
      values.model.new.file
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
  // # 2 - Handle pipeline creation                                    #
  // #                                                                 #
  // ###################################################################

  const createPipeline = useCreatePipeline();
  const updatePipeline = useUpdatePipeline();

  const [setupPipelineError, setSetupPipelineError] =
    useState<Nullable<string>>(null);

  const [isSettingPipeline, setIsSettingPipeline] = useState(false);

  const handleSetupNewPipeline = () => {
    if (
      !canSetupNewPipeline ||
      !router.isReady ||
      !values.pipeline.id ||
      !values.pipeline.description
    ) {
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

    setIsSettingPipeline(true);

    createPipeline.mutate(payload, {
      onSuccess: async (newPipeline) => {
        if (!values.pipeline.description) {
          setIsSettingPipeline(false);
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
              setIsSettingPipeline(false);
              router.push("/pipelines");
            },
            onError: (error) => {
              if (error instanceof Error) {
                setSetupPipelineError(error.message);
              } else {
                setSetupPipelineError(
                  "Something went wrong when deploying model"
                );
              }
            },
          }
        );
      },
      onError: (error) => {
        if (error instanceof Error) {
          setSetupPipelineError(error.message);
        } else {
          setSetupPipelineError("Something went wrong when deploying model");
        }
      },
    });
  };

  return (
    <FormikStep>
      <div className="mb-5 flex flex-col gap-y-5">
        <TextField
          name="pipeline.id"
          label="Name"
          description="Pick a name to help you identify this source in Instill"
          value={values.pipeline.id}
          error={errors.pipeline?.id || null}
          additionalOnChangeCb={null}
          disabled={false}
          readOnly={false}
          required={true}
          placeholder=""
          type="text"
          autoComplete="off"
        />
        <TextArea
          name="pipeline.description"
          label="Description"
          description="Fill with a short description of your new pipeline"
          value={values.pipeline.description}
          error={errors.pipeline?.description || null}
          additionalOnChangeCb={null}
          disabled={false}
          readOnly={false}
          required={true}
          autoComplete="off"
          placeholder=""
          enableCounter={false}
          counterWordLimit={0}
        />
        <ToggleField
          name="pipeline.status"
          label="Pipeline status"
          defaultChecked={true}
          error={errors.pipeline?.state || null}
          additionalOnChangeCb={null}
          disabled={true}
          readOnly={false}
          required={true}
          description="Turn this toggle off if you wish to not activate the pipeline now"
        />
        <div className="flex flex-row">
          {setupPipelineError ? (
            <BasicProgressMessageBox width="w-[216px]" status="error">
              {setupPipelineError}
            </BasicProgressMessageBox>
          ) : isSettingPipeline ? (
            <BasicProgressMessageBox width="w-[216px]" status="progressing">
              Setting up pipeline...
            </BasicProgressMessageBox>
          ) : null}
          <PrimaryButton
            position="ml-auto my-auto"
            type="button"
            disabled={canSetupNewPipeline ? false : true}
            onClickHandler={handleSetupNewPipeline}
          >
            Set up pipeline
          </PrimaryButton>
        </div>
      </div>
    </FormikStep>
  );
};

export default SetupPipelineDetailsStep;
