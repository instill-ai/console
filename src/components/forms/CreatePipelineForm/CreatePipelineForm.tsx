import CreatePipelineProgress from "@/components/ui/CreatePipelineProgress/CreatePipelineProgress";
import { SingleSelectOption } from "@instill-ai/design-system";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { FormikMultiStep } from "../FormikMultiStep";
import SetupModelStep from "./SetupModelStep";
import SetupSourceStep from "./SetupSourceStep";

export type StepNumberState = {
  maximumStepNumber: number;
  stepNumber: number;
  setStepNumber: Dispatch<SetStateAction<number>>;
};

type DataSource = {
  name: string;
};

type DataDestination = {
  name: string;
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
};

export type Values = {
  dataSource: DataSource;
  dataDestination: DataDestination;
  model: Model;
  pipeline: Pipeline;
};

const CreatePipelineDataSourceForm: FC = () => {
  const [stepNumber, setStepNumber] = useState(0);

  return (
    <FormikMultiStep
      stepNumber={stepNumber}
      setStepNumber={setStepNumber}
      initialValues={{
        dataSource: {
          name: null,
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
          mode: "sync",
        },
        dataDestination: {
          name: null,
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
      <SetupSourceStep stepNumber={stepNumber} setStepNumber={setStepNumber} />
      <SetupModelStep
        stepNumber={stepNumber}
        setStepNumber={setStepNumber}
        maximumStepNumber={3}
      />
    </FormikMultiStep>
  );
};

export default CreatePipelineDataSourceForm;
