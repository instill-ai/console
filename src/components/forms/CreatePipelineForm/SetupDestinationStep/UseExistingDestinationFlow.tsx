import { FC, useEffect, useMemo, useState } from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption } from "@instill-ai/design-system";

import { PrimaryButton } from "@/components/ui/Buttons";
import { SingleSelect } from "../../../formik";
import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import { useDestinations } from "@/services/connector";

export type UseExistingDestinationFlowProps = StepNumberState;

const UseExistingDestinationFlow: FC<UseExistingDestinationFlowProps> = ({
  setStepNumber,
  stepNumber,
}) => {
  const { values, errors } = useFormikContext<CreatePipelineFormValues>();

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
    if (!destinations.isSuccess || !destinations.data) return;

    setDestinationOptions(
      destinations.data.map((e) => {
        return {
          label: e.id,
          value: e.id,
        };
      })
    );
  }, [destinations.isSuccess, destinations.data]);

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
    setStepNumber(stepNumber + 1);
  };

  return (
    <div className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">
        Select a existing destination
      </h3>
      <SingleSelect
        name="destination.existing.id"
        instanceId="existing-data-destination-id"
        disabled={false}
        readOnly={false}
        options={destinationOptions ? destinationOptions : []}
        value={selectedDestinationOption}
        error={errors.destination?.existing?.id || null}
        additionalOnChangeCb={null}
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
