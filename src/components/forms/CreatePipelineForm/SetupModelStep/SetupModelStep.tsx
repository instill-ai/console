import { Dispatch, FC, SetStateAction } from "react";
import { FormikStep } from "../../FormikMultiStep";
import { StepNumberState } from "../CreatePipelineDataSourceForm/CreatePipelineDataSourceForm";
import CreateNewModelFlow from "./CreateNewModelFlow";
import UseExistingModelFlow from "./UseExistingModelFlow";

export type SetupModelStepProps = StepNumberState;

const SetupModelStep: FC<SetupModelStepProps> = (props) => {
  return (
    <FormikStep multiGroup={true}>
      <div className="flex flex-1 flex-row">
        <UseExistingModelFlow {...props} />
        <div className="relative mx-5 h-full w-6">
          <p className="instill-text-h3 absolute top-5 z-10 bg-instillGrey05">
            OR
          </p>
          <div className="absolute left-1/2 h-full border-r"></div>
        </div>
        <CreateNewModelFlow {...props} />
      </div>
    </FormikStep>
  );
};

export default SetupModelStep;
