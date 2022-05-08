import { FC } from "react";

import { FormVerticalDividers } from "@/components/ui";
import { FormikStep } from "../../../formik";
import { StepNumberState } from "../CreatePipelineForm";
import CreateNewModelFlow from "./CreateNewModelFlow";
import UseExistingModelFlow from "./UseExistingModelFlow";

export type SetupModelStepProps = StepNumberState;

const SetupModelStep: FC<SetupModelStepProps> = (props) => {
  return (
    <FormikStep multiGroup={true}>
      <div className="flex flex-1 flex-row">
        <UseExistingModelFlow {...props} />
        <FormVerticalDividers />
        <CreateNewModelFlow {...props} />
      </div>
    </FormikStep>
  );
};

export default SetupModelStep;
