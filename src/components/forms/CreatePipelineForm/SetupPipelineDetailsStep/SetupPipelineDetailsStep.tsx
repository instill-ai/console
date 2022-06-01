import { FC, useMemo } from "react";
import { useFormikContext } from "formik";

import { PrimaryButton } from "@/components/ui/Buttons";
import { CreatePipelineFormValues } from "../CreatePipelineForm";
import { TextArea, TextField, ToggleField, FormikStep } from "../../../formik";
import { useCreatePipeline } from "@/services/pipeline/PipelineServices";
import { CreatePipelinePayload } from "@/lib/instill";
import { useRouter } from "next/router";

const SetupPipelineDetailsStep: FC = () => {
  const { values, errors } = useFormikContext<CreatePipelineFormValues>();
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
      values.model.new.modelInstanceId
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

  const createPipeline = useCreatePipeline();

  const handleSetupNewPipeline = () => {
    if (!canSetupNewPipeline || !router.isReady || !values.pipeline.id) return;

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
      if (!values.model.new.modelInstanceId || !values.model.new.id) return;
      modelInstanceName = `models/${values.model.new.id}/instances/${values.model.new.modelInstanceId}`;
    } else {
      if (!values.model.existing.id) return;
      modelInstanceName = `models/${values.model.existing.id}/instances/${values.model.existing.modelInstanceId}`;
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
