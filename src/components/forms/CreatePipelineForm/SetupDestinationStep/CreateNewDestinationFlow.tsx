import { FC, useRef, useState, useEffect, useMemo } from "react";
import { SingleSelectOption } from "@instill-ai/design-system";
import { useFormikContext } from "formik";

import { PrimaryButton } from "@/components/ui/Buttons";
import useOnScreen from "@/hooks/useOnScreen";
import { SingleSelect, TextField } from "../../../formik";
import { mockAsyncDataConnectionOptions } from "../../MockData";
import { StepNumberState, Values } from "../CreatePipelineForm";

export type CreateNewDestinationFlowProps = StepNumberState;

const CreateNewDestinationFlow: FC<CreateNewDestinationFlowProps> = ({
  maximumStepNumber,
  setStepNumber,
  stepNumber,
}) => {
  const [destinationOptions, setDestinationOptions] = useState<
    SingleSelectOption[] | null
  >(null);

  const { values } = useFormikContext<Values>();

  const flowRef = useRef<HTMLDivElement>(null);
  const flowIsOnScreen = useOnScreen(flowRef);

  useEffect(() => {
    if (!flowIsOnScreen) return;

    setTimeout(
      () => setDestinationOptions(mockAsyncDataConnectionOptions),
      3000
    );
  }, [flowIsOnScreen]);

  const canSetupNewDestination = useMemo(() => {
    if (!values.dataDestination.new.name || !values.dataDestination.new.type)
      return false;

    return true;
  }, [values.dataDestination.new.name, values.dataDestination.new.type]);

  const handleSetupNewDestination = () => {
    setStepNumber(stepNumber + 1);
  };

  return (
    <div ref={flowRef} className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">Setup a new destination</h3>
      <TextField
        name="dataDestination.new.name"
        label="Name"
        description="Pick a name to help you identify this source in Instill"
        disabled={false}
        readOnly={false}
        required={true}
        placeholder=""
        type="text"
        autoComplete="off"
      />
      <SingleSelect
        name="dataDestination.new.type"
        instanceId="new-data-destination-type"
        disabled={false}
        readOnly={false}
        options={destinationOptions ? destinationOptions : []}
        required={true}
        description={"Setup Guide"}
        label="Source type"
      />
      <PrimaryButton
        position="ml-auto"
        type="button"
        disabled={canSetupNewDestination ? false : true}
        onClickHandler={handleSetupNewDestination}
      >
        Set up source
      </PrimaryButton>
    </div>
  );
};

export default CreateNewDestinationFlow;
