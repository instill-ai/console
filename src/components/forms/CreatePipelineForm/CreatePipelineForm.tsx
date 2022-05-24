import { Dispatch, FC, SetStateAction } from "react";

import CreatePipelineProgress from "@/components/ui/CreatePipelineProgress";
import { FormikMultiStep } from "../../formik";
import SetupDestinationStep from "./SetupDestinationStep/SetupDestinationStep";
import SetupModelStep from "./SetupModelStep";
import SetupPipelineDetailsStep from "./SetupPipelineDetailsStep";
import SetupPipelineModeStep from "./SetupPipelineModeStep";
import SetupSourceStep from "./SetupSourceStep/SetupSourceStep";
import { PipelineMode } from "@/lib/instill";
import { Nullable } from "@/types/general";

export type StepNumberState = {
  maximumStepNumber: number;
  stepNumber: number;
  setStepNumber: Dispatch<SetStateAction<number>>;
};

type NewSource = {
  id: string;
  name: string;
};

type ExistingSource = {
  id: string;
  name: string;
};

type Source = {
  new: NewSource;
  existing: ExistingSource;
  type: Nullable<"existing" | "new">;
};

type NewDestination = {
  id: string;
  name: string;
};

type ExistingDestination = {
  id: string;
  name: string;
};

type Destination = {
  new: NewDestination;
  existing: ExistingDestination;
  type: Nullable<"existing" | "new">;
};

type ExistingModel = {
  id: string;
  name: string;
};

type NewModel = {
  id: string;
  name: string;
  modelDefinition: string;
  modelInstance: string;
  file?: string;
  repo?: string;
  description: string;
};

type Model = {
  existing: ExistingModel;
  new: NewModel;
  type: Nullable<"existing" | "new">;
};

type Pipeline = {
  id: string;
  name: string;
  mode: PipelineMode;
  description: string;
  status: string;
};

export type Values = {
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
      initialValues={{
        source: {
          new: { id: null },
          existing: { id: null },
          type: null,
        },
        model: {
          new: {
            id: null,
            modelDefinition: null,
            modelInstance: null,
            file: null,
            description: null,
            repo: null,
          },
          existing: {
            id: null,
          },
          type: null,
        },
        pipeline: {
          mode: "MODE_SYNC",
          id: null,
          description: null,
          status: true,
        },
        destination: {
          new: { id: null },
          existing: { id: null },
          type: null,
        },
      }}
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
