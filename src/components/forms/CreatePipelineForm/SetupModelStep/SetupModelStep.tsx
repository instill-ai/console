import { FC, useState } from "react";

import { FormVerticalDividers } from "@/components/ui";
import { FormikStep } from "../../../formik";
import { StepNumberState } from "../CreatePipelineForm";
import CreateNewModelFlow from "./CreateNewModelFlow";
import UseExistingModelFlow from "./UseExistingModelFlow";

export type SetupModelStepProps = StepNumberState;

const SetupModelStep: FC<SetupModelStepProps> = (props) => {
  const [modelCreated, setModelCreated] = useState(false);
  return (
    <FormikStep multiGroup={true}>
      <div className="flex flex-1 flex-row">
        <UseExistingModelFlow
          {...props}
          modelCreated={modelCreated}
          setModelCreated={setModelCreated}
        />
        <FormVerticalDividers />
        <CreateNewModelFlow
          {...props}
          modelCreated={modelCreated}
          setModelCreated={setModelCreated}
        />
      </div>
    </FormikStep>
  );
};

export default SetupModelStep;
