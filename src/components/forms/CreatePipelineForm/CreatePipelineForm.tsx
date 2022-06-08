import { Dispatch, FC, SetStateAction } from "react";

import CreatePipelineProgress from "@/components/ui/CreatePipelineProgress";
import { FormikMultiStep } from "../../formik";
import SetupDestinationStep from "./SetupDestinationStep/SetupDestinationStep";
import SetupModelStep from "./SetupModelStep";
import SetupPipelineDetailsStep from "./SetupPipelineDetailsStep";
import SetupPipelineModeStep from "./SetupPipelineModeStep";
import SetupSourceStep from "./SetupSourceStep/SetupSourceStep";
import { PipelineMode, PipelineState } from "@/lib/instill";
import { Nullable } from "@/types/general";

export type StepNumberState = {
  maximumStepNumber: number;
  stepNumber: number;
  setStepNumber: Dispatch<SetStateAction<number>>;
};

type NewSource = {
  id: Nullable<string>;
  definition: Nullable<string>;
};

type ExistingSource = {
  id: Nullable<string>;
  definition: Nullable<string>;
};

type Source = {
  new: NewSource;
  existing: ExistingSource;
  type: Nullable<"existing" | "new">;
};

type NewDestination = {
  id: Nullable<string>;
  definition: Nullable<string>;
};

type ExistingDestination = {
  id: Nullable<string>;
  definition: Nullable<string>;
};

type Destination = {
  new: NewDestination;
  existing: ExistingDestination;
  type: Nullable<"existing" | "new">;
};

type ExistingModel = {
  id: Nullable<string>;
  modelInstanceName: Nullable<string>;
};

type NewModel = {
  id: Nullable<string>;
  modelDefinition: Nullable<string>;
  modelInstanceName: Nullable<string>;
  file: Nullable<string>;
  repo: Nullable<string>;
  description: Nullable<string>;
};

type Model = {
  existing: ExistingModel;
  new: NewModel;
  type: Nullable<"existing" | "new">;
};

type Pipeline = {
  id: Nullable<string>;
  mode: Nullable<PipelineMode>;
  description: Nullable<string>;
  state: Nullable<PipelineState>;
};

export type CreatePipelineFormValues = {
  source: Source;
  destination: Destination;
  model: Model;
  pipeline: Pipeline;
};

const CreatePipelineDataSourceForm: FC<StepNumberState> = (props) => {
  return (
    <FormikMultiStep
      stepNumber={props.stepNumber}
      setStepNumber={props.setStepNumber}
      initialValues={
        {
          source: {
            new: { id: null, definition: null },
            existing: { id: null, definition: null },
            type: null,
          },
          model: {
            new: {
              id: null,
              modelDefinition: null,
              modelInstanceName: null,
              file: null,
              description: null,
              repo: null,
            },
            existing: {
              id: null,
              modelInstanceName: null,
            },
            type: null,
          },
          pipeline: {
            mode: "MODE_SYNC",
            id: null,
            description: null,
            state: "STATE_UNSPECIFIED",
          },
          destination: {
            new: { id: null, definition: null },
            existing: { id: null, definition: null },
            type: null,
          },
        } as CreatePipelineFormValues
      }
      onSubmit={(_, actions) => {
        actions.setSubmitting(false);
      }}
      enableBackToPrevious={false}
      getProgressionIndicator={(stepNumber: number) => (
        <CreatePipelineProgress currentProgress={stepNumber} />
      )}
    >
      <SetupPipelineModeStep {...props} />
      <SetupSourceStep {...props} />
      <SetupModelStep {...props} />
      <SetupDestinationStep {...props} />
      <SetupPipelineDetailsStep />
    </FormikMultiStep>
  );
};

export default CreatePipelineDataSourceForm;
