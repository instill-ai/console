import { FormVerticalDividers } from "@/components/ui";
import { FC } from "react";
import { FormikStep } from "../../../formik/FormikMultiStep";
import { StepNumberState } from "../CreatePipelineForm";
import CreateNewSourceFlow from "./CreateNewSourceFlow";
import UseExistingSourceFlow from "./UseExistingSourceFlow";

export type SetupSourceStepProps = StepNumberState;

const SetupSourceStep: FC<SetupSourceStepProps> = (props) => {
  return (
    <FormikStep>
      <div className="flex flex-1 flex-row">
        <UseExistingSourceFlow {...props} />
        <FormVerticalDividers {...props} />
        <CreateNewSourceFlow {...props} />
      </div>
    </FormikStep>
  );
};

export default SetupSourceStep;
