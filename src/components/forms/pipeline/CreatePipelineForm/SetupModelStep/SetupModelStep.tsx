import { FC, useState } from "react";

import { FormVerticalDivider } from "@/components/ui";
import { FormikStep } from "@/components/formik";
import { StepNumberState } from "../CreatePipelineForm";
import CreateNewModelInstanceFlow from "./CreateNewModelInstanceFlow";
import UseExistingModeInstancelFlow from "./UseExistingModeInstancelFlow";

export type SetupModelStepProps = StepNumberState;

const SetupModelStep: FC<SetupModelStepProps> = (props) => {
  const [modelCreated, setModelCreated] = useState(false);
  return (
    <FormikStep multiGroup={true}>
      <div className="flex flex-1 flex-row">
        <UseExistingModeInstancelFlow
          {...props}
          modelCreated={modelCreated}
          setModelCreated={setModelCreated}
        />
        <FormVerticalDivider />
        <CreateNewModelInstanceFlow
          {...props}
          modelCreated={modelCreated}
          setModelCreated={setModelCreated}
        />
      </div>
    </FormikStep>
  );
};

export default SetupModelStep;
