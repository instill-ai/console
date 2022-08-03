import { FC, useEffect, useMemo, useState } from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption } from "@instill-ai/design-system";

import { PrimaryButton } from "@/components/ui";
import { SingleSelect } from "@/components/formik";
import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import { useDestinations } from "@/services/connector";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

export type UseExistingDestinationFlowProps = StepNumberState;

const UseExistingDestinationFlow: FC<UseExistingDestinationFlowProps> = ({
  setStepNumber,
  stepNumber,
}) => {
  const { values, errors } = useFormikContext<CreatePipelineFormValues>();
  const { amplitudeIsInit } = useAmplitudeCtx();

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

    if (values.pipeline.mode === "MODE_ASYNC") {
      setDestinationOptions(
        destinations.data
          .filter(
            (e) =>
              e.name !== "destination-connectors/destination-http" &&
              e.name !== "destination-connectors/destination-grpc"
          )
          .map((e) => {
            return {
              label: e.id,
              value: e.id,
            };
          })
      );
    } else {
      setDestinationOptions(
        destinations.data.map((e) => {
          return {
            label: e.id,
            value: e.id,
          };
        })
      );
    }
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
    if (amplitudeIsInit) {
      sendAmplitudeData("use_existing_destination", {
        type: "critical_action",
        process: "pipeline",
      });
    }
    setStepNumber(stepNumber + 1);
  };

  return (
    <div className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="text-black text-instill-h3">
        Select a existing destination
      </h3>
      <SingleSelect
        id="existingDestinationId"
        name="destination.existing.id"
        label="Destination type"
        options={destinationOptions ? destinationOptions : []}
        value={selectedDestinationOption}
        error={errors.destination?.existing?.id || null}
        required={true}
        description={"Setup Guide"}
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
