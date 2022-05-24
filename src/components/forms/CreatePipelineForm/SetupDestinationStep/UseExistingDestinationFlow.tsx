import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption } from "@instill-ai/design-system";

import { PrimaryButton } from "@/components/ui/Buttons";
import useOnScreen from "@/hooks/useOnScreen";
import { SingleSelect } from "../../../formik";
import { StepNumberState, Values } from "../CreatePipelineForm";
import { useDestinations } from "@/services/connector/DestinationServices";

export type UseExistingDestinationFlowProps = StepNumberState;

const UseExistingDestinationFlow: FC<UseExistingDestinationFlowProps> = ({
  setStepNumber,
  stepNumber,
}) => {
  const { values, setFieldValue } = useFormikContext<Values>();
  const flowRef = useRef<HTMLDivElement>(null);
  const flowIsOnScreen = useOnScreen(flowRef);

  // ###################################################################
  // #                                                                 #
  // # 1 - Get existing destinations.                                  #
  // #                                                                 #
  // ###################################################################

  const [destinationOptions, setDestinationOptions] = useState<
    SingleSelectOption[] | null
  >(null);
  const destinations = useDestinations();

  useEffect(() => {
    if (!flowIsOnScreen || !destinations.isSuccess) return;

    setDestinationOptions(
      destinations.data.map((e) => {
        return {
          label: e.id,
          value: e.id,
        };
      })
    );
  }, [flowIsOnScreen, destinations.isSuccess]);

  const selectedDestinationOption = useMemo(() => {
    if (!values.destination.existing.id || !destinationOptions) return null;

    return (
      destinationOptions.find(
        (e) => e.value === values.destination.existing.id
      ) || null
    );
  }, [values.destination.existing.id, destinationOptions]);

  // ###################################################################
  // #                                                                 #
  // # 2 - Setup existing destinations                                 #
  // #                                                                 #
  // ###################################################################

  const canUseExistingDestination = useMemo(() => {
    if (!values.destination.existing.id) {
      return false;
    }

    return true;
  }, [values.destination.existing.id]);

  const handleUseExistingDestination = () => {
    if (!values.destination.existing.id || !destinations.isSuccess) return;

    const target = destinations.data.find(
      (e) => e.id === values.destination.existing.id
    );

    setFieldValue("destination.name", target?.name);
    setStepNumber(stepNumber + 1);
  };

  return (
    <div ref={flowRef} className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">
        Select a existing destination
      </h3>
      <SingleSelect
        name="destination.existing.id"
        instanceId="existing-data-destination-id"
        value={selectedDestinationOption}
        disabled={false}
        readOnly={false}
        options={destinationOptions ? destinationOptions : []}
        required={true}
        description={"Setup Guide"}
        label="Destination type"
        menuPlacement="auto"
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
