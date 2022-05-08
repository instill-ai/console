import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption } from "@instill-ai/design-system";

import { PrimaryButton } from "@/components/ui/Buttons";
import useOnScreen from "@/hooks/useOnScreen";
import { SingleSelect } from "../../../formik";
import { StepNumberState, Values } from "../CreatePipelineForm";

export type UseExistingDestinationFlowProps = StepNumberState;

const UseExistingDestinationFlow: FC<UseExistingDestinationFlowProps> = ({
  maximumStepNumber,
  setStepNumber,
  stepNumber,
}) => {
  const flowRef = useRef<HTMLDivElement>(null);
  const flowIsOnScreen = useOnScreen(flowRef);
  const [destinationOptions, setDestinationOptions] = useState<
    SingleSelectOption[] | null
  >(null);

  const { values } = useFormikContext<Values>();

  useEffect(() => {
    if (!flowIsOnScreen) return;

    setTimeout(() => setDestinationOptions([]), 3000);
  }, [flowIsOnScreen]);

  const canUseExistingDestination = useMemo(() => {
    if (!values.dataDestination.existing.name) {
      return false;
    }

    return true;
  }, [values.dataDestination.existing.name]);

  const handleUseExistingDestination = () => {
    setStepNumber(stepNumber + 1);
  };

  return (
    <div ref={flowRef} className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">
        Select a existing destination
      </h3>
      <SingleSelect
        name="dataDestination.existing.name"
        instanceId="existing-data-source-name"
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
        disabled={canUseExistingDestination ? false : true}
        onClickHandler={handleUseExistingDestination}
      >
        Use destination
      </PrimaryButton>
    </div>
  );
};

export default UseExistingDestinationFlow;
