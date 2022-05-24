import { FC, useMemo } from "react";
import { useFormikContext } from "formik";

import { PrimaryButton } from "@/components/ui/Buttons";
import { Values } from "../CreatePipelineForm";
import { TextArea, TextField, ToggleField, FormikStep } from "../../../formik";
import { useCreatePipeline } from "@/services/pipeline/PipelineServices";
import { CreatePipelinePayload } from "@/lib/instill";
import { useRouter } from "next/router";

const SetupPipelineDetailsStep: FC = () => {
  const { values } = useFormikContext<Values>();
  const router = useRouter();

  // ###################################################################
  // #                                                                 #
  // # 1 - Create pipeline                                             #
  // #                                                                 #
  // ###################################################################

  const canSetupNewPipeline = useMemo(() => {
    const validator = {
      pipelineIsValid: false,
      sourceIsValid: false,
      modelIsValid: false,
      destinationIsValid: false,
    };

    // Pipeline - Every pipeline's field is required
    if (
      values.pipeline.mode &&
      values.pipeline.id &&
      values.pipeline.description
    ) {
      validator.pipelineIsValid = true;
    }

    // Source - name is required
    if (values.source.existing.name) {
      validator.sourceIsValid = true;
    }

    if (values.source.new.name) {
      validator.sourceIsValid = true;
    }

    // Destination - name id required
    if (values.destination.existing.name) {
      validator.destinationIsValid = true;
    }

    if (values.destination.new.name) {
      validator.destinationIsValid = true;
    }

    // Model - new - github
    if (
      values.model.new.modelDefinition === "github" &&
      values.model.new.id &&
      values.model.new.modelInstance
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

    if (values.model.existing.name) {
      validator.modelIsValid = true;
    }

    console.log(validator);

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

  const createPipeline = useCreatePipeline();

  const handleSetupNewPipeline = () => {
    if (!canSetupNewPipeline || !router.isReady) return;

    const payload: CreatePipelinePayload = {
      id: values.pipeline.id,
      recipe: {
        source:
          values.source.type === "new"
            ? values.source.new.name
            : values.source.existing.name,
        model_instances: [
          values.model.type === "new"
            ? values.model.new.modelInstance
            : values.model.existing.name,
        ],
        destination:
          values.destination.type === "new"
            ? values.destination.new.name
            : values.destination.existing.name,
      },
    };

    console.log(payload, values.model.new.modelInstance);

    createPipeline.mutate(payload, {
      onSuccess: () => {
        router.push("/pipelines");
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
          disabled={false}
          readOnly={false}
          required={true}
          autoComplete="off"
          placeholder=""
          value={values.pipeline.description ? values.pipeline.description : ""}
          enableCounter={false}
          counterWordLimit={0}
        />
        <ToggleField
          name="pipeline.status"
          label="Pipeline status"
          disabled={true}
          readOnly={false}
          required={true}
          defaultChecked={true}
          description="Turn this toggle off if you wish to not activate the pipeline now"
        />
        <PrimaryButton
          position="ml-auto"
          type="button"
          disabled={canSetupNewPipeline ? false : true}
          onClickHandler={handleSetupNewPipeline}
        >
          Set up pipeline
        </PrimaryButton>
      </div>
    </FormikStep>
  );
};

export default SetupPipelineDetailsStep;
