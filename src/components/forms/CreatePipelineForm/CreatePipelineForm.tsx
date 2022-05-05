import CreatePipelineProgress from "@/components/ui/CreatePipelineProgress/CreatePipelineProgress";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { FormikMultiStep } from "../FormikMultiStep";
import SetupDestinationStep from "./SetupDestinationStep/SetupDestinationStep";
import SetupModelStep from "./SetupModelStep";
import SetupPipelineDetailsStep from "./SetupPipelineDetailsStep";
import SetupPipelineModeStep from "./SetupPipelineModeStep";
import SetupSourceStep from "./SetupSourceStep/SetupSourceStep";

export type StepNumberState = {
  maximumStepNumber: number;
  stepNumber: number;
  setStepNumber: Dispatch<SetStateAction<number>>;
};

type ExistingDataSource = {
  name: string;
  type: string;
};

type NewDataSource = {
  name: string;
  type: string;
};

type DataSource = {
  existing: ExistingDataSource;
  new: NewDataSource;
};

type ExistingDataDestination = {
  name: string;
  type: string;
};

type NewDataDestination = {
  name: string;
  type: string;
};

type DataDestination = {
  existing: ExistingDataDestination;
  new: NewDataDestination;
};

type ExistingModel = {
  name: string;
};

type NewModel = {
  name: string;
  modelSource: "local" | "github";
  modelInstance: string;
  file: string;
  description: string;
};

type Model = {
  existing: ExistingModel;
  new: NewModel;
};

type Pipeline = {
  mode: "sync" | "async";
  name: string;
  description: string;
  status: string;
};

export type Values = {
  dataSource: DataSource;
  dataDestination: DataDestination;
  model: Model;
  pipeline: Pipeline;
};

const CreatePipelineDataSourceForm: FC<StepNumberState> = (props) => {
  return (
    <FormikMultiStep
      stepNumber={props.stepNumber}
      setStepNumber={props.setStepNumber}
      initialValues={{
        dataSource: {
          new: {
            name: null,
          },
          existing: {
            name: null,
          },
        },
        model: {
          new: {
            name: null,
            modelSource: null,
            modelInstance: null,
            file: null,
            description: null,
          },
          existing: {
            name: null,
          },
        },
        pipeline: {
          mode: null,
          name: null,
          description: null,
          status: true,
        },
        dataDestination: {
          new: {
            name: null,
          },
          existing: {
            name: null,
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
