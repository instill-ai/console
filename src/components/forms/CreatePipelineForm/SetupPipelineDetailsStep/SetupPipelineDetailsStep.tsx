import { PrimaryButton } from "@/components/ui/Buttons";
import { useFormikContext } from "formik";
import { FC, useMemo } from "react";
import { TextArea, TextField, ToggleField } from "../../../formik/FormikField";
import { FormikStep } from "../../../formik/FormikMultiStep";
import { Values } from "../CreatePipelineForm";

const SetupPipelineDetailsStep: FC = () => {
  const { values } = useFormikContext<Values>();

  const canSetupNewPipeline = useMemo(() => {
    console.log(values);
    const validator = {
      pipelineIsValid: false,
      sourceIsValid: false,
      modelIsValid: false,
      destinationIsValid: false,
    };

    // Pipeline - Every pipeline's field is required
    if (
      values.pipeline.mode &&
      values.pipeline.name &&
      values.pipeline.description &&
      values.pipeline.status
    ) {
      validator.pipelineIsValid = true;
    }

    // Source - name and type are required
    if (values.dataSource.existing.name && values.dataSource.existing.type) {
      validator.sourceIsValid = true;
    }

    if (values.dataSource.new.name && values.dataSource.new.type) {
      validator.sourceIsValid = true;
    }

    // Destination - name and type are required
    if (
      values.dataDestination.existing.name &&
      values.dataDestination.existing.type
    ) {
      validator.destinationIsValid = true;
    }

    if (values.dataDestination.new.name && values.dataDestination.new.type) {
      validator.destinationIsValid = true;
    }

    // Model - new - github
    if (
      values.model.new.modelSource === "github" &&
      values.model.new.name &&
      values.model.new.modelInstance
    ) {
      validator.modelIsValid = true;
    }

    // Model - new - local
    if (
      values.model.new.modelSource === "local" &&
      values.model.new.name &&
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

  const handleSetupNewPipeline = () => {
    console.log(values);
  };

  return (
    <FormikStep>
      <div className="mb-5 flex flex-col gap-y-5">
        <TextField
          name="pipeline.name"
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
          value={values.pipeline.description}
          enableCounter={false}
          counterWordLimit={0}
        />
        <ToggleField
          name="pipeline.status"
          label="Pipeline status"
          disabled={false}
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
