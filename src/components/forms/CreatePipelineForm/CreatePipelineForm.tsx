import { Dispatch, FC, SetStateAction } from "react";

import CreatePipelineProgress from "@/components/ui/CreatePipelineProgress";
import { FormikMultiStep } from "../../formik";
import SetupDestinationStep from "./SetupDestinationStep/SetupDestinationStep";
import SetupModelStep from "./SetupModelStep";
import SetupPipelineDetailsStep from "./SetupPipelineDetailsStep";
import SetupPipelineModeStep from "./SetupPipelineModeStep";
import SetupSourceStep from "./SetupSourceStep/SetupSourceStep";
import { PipelineMode } from "@/lib/instill";

export type StepNumberState = {
  maximumStepNumber: number;
  stepNumber: number;
  setStepNumber: Dispatch<SetStateAction<number>>;
};

type ExistingSource = {
  id: string;
};

type NewSource = {
  id: string;
};

type Source = {
  existing: ExistingSource;
  new: NewSource;
};

type ExistingDestination = {
  id: string;
};

type NewDestination = {
  id: string;
};

type Destination = {
  existing: ExistingDestination;
  new: NewDestination;
};

type ExistingModel = {
  id: string;
};

type NewModel = {
  id: string;
  modelDefinition: string;
  modelInstance: string;
  file?: string;
  repo?: string;
  description: string;
};

type Model = {
  existing: ExistingModel;
  new: NewModel;
};

type Pipeline = {
  mode: PipelineMode;
  id: string;
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
          new: {
            id: null,
          },
          existing: {
            id: null,
          },
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
        },
        pipeline: {
          mode: "MODE_SYNC",
          id: null,
          description: null,
          status: true,
        },
        destination: {
          new: {
            id: null,
          },
          existing: {
            id: null,
          },
        },
      }}
      onSubmit={(values, actions) => {
        console.log(values);
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
