import { FC, useEffect, useMemo, useState } from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption, SolidButton } from "@instill-ai/design-system";

import { SingleSelect } from "@/components/formik";
import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import { useDestinations } from "@/services/connector";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import Image from "next/image";

export type UseExistingDestinationFlowProps = StepNumberState;

export const UseExistingDestinationFlow: FC<
  UseExistingDestinationFlowProps
> = ({ setStepNumber, stepNumber }) => {
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
              startIcon: (
                <Image
                  className="my-auto"
                  src={
                    e.destination_connector_definition.connector_definition.docker_repository.split(
                      "/"
                    )[0] === "airbyte"
                      ? `/icons/airbyte/${e.destination_connector_definition.connector_definition.icon}`
                      : `/icons/instill/${e.destination_connector_definition.connector_definition.icon}`
                  }
                  width={24}
                  height={24}
                  alt={`${e.id}-icon`}
                />
              ),
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
  }, [destinations.isSuccess, destinations.data, values.pipeline.mode]);

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
        Select an existing destination
      </h3>
      <SingleSelect
        id="existingDestinationId"
        name="destination.existing.id"
        label="Destination type"
        options={destinationOptions ? destinationOptions : []}
        value={selectedDestinationOption}
        error={errors.destination?.existing?.id || null}
        required={true}
      />
      <SolidButton
        position="ml-auto"
        type="button"
        color="primary"
        disabled={canUseExistingDestination ? false : true}
        onClickHandler={handleUseExistingDestination}
      >
        Select
      </SolidButton>
    </div>
  );
};
