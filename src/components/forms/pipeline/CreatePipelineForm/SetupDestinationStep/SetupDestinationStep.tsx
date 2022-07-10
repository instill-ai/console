import { FC, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption } from "@instill-ai/design-system";

import {
  ConnectorIcon,
  FormVerticalDividers,
  PrimaryButton,
} from "@/components/ui";
import { SingleSelect, FormikStep } from "@/components/formik";
import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import CreateNewDestinationFlow from "./CreateNewDestinationFlow";
import UseExistingDestinationFlow from "./UseExistingDestinationFlow";
import { useCreateDestination, useDestinations } from "@/services/connector";
import { CreateDestinationPayload } from "@/lib/instill";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

export type SetupDestinationStepProps = StepNumberState;

const SetupDestinationStep: FC<SetupDestinationStepProps> = (props) => {
  const { values, setFieldValue, errors } =
    useFormikContext<CreatePipelineFormValues>();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the destination definition                       #
  // #                                                                 #
  // ###################################################################

  const [syncDestinationOptions, setSyncDestinationOptions] = useState<
    SingleSelectOption[]
  >([]);

  useEffect(() => {
    setSyncDestinationOptions([
      {
        label: "gRPC",
        value: "destination-grpc",
        startIcon: (
          <ConnectorIcon
            iconName="grpc.svg"
            iconColor="fill-instillGrey90"
            iconHeight="h-[30px]"
            iconWidth="w-[30px]"
            iconPosition="my-auto"
          />
        ),
      },
      {
        label: "HTTP",
        value: "destination-http",
        startIcon: (
          <ConnectorIcon
            iconName="http.svg"
            iconColor="fill-instillGrey90"
            iconHeight="h-[30px]"
            iconWidth="w-[30px]"
            iconPosition="my-auto"
          />
        ),
      },
    ]);
  }, []);

  // ###################################################################
  // #                                                                 #
  // # 2 - Choose the default destination as same as source when the   #
  // #     pipeline is in sync mode                                    #
  // #                                                                 #
  // ###################################################################

  const [selectedSyncDestinationIndex, setSelectedSyncDestinationIndex] =
    useState<number>(-1);

  useEffect(() => {
    if (values.pipeline.mode !== "MODE_SYNC" || !values.source.existing.id) {
      return;
    }

    const destinationId = values.source.existing.id.replace(
      "source",
      "destination"
    );

    const index = syncDestinationOptions.findIndex(
      (e) => e.value === destinationId
    );

    setSelectedSyncDestinationIndex(index);

    setFieldValue("destination.existing.id", destinationId);
  }, [
    values.pipeline.mode,
    values.source.existing.id,
    syncDestinationOptions,
    setFieldValue,
  ]);

  // ###################################################################
  // #                                                                 #
  // # 3 - Create target destination.                                  #
  // #                                                                 #
  // ###################################################################
  //
  // We have to make sure there has no duplicated destination

  const createDestination = useCreateDestination();
  const destinations = useDestinations();

  const handleGoNext = () => {
    if (!destinations.isSuccess || !values.destination.existing.id) {
      return;
    }

    const { setStepNumber, stepNumber } = props;

    if (values.pipeline.mode === "MODE_SYNC") {
      const destinationIndex = destinations.data.findIndex(
        (e) => e.id === values.destination.existing.id
      );

      if (destinationIndex !== -1) {
        if (amplitudeIsInit) {
          sendAmplitudeData("use_existing_destination", {
            type: "critical_action",
            process: "pipeline",
          });
        }
        setFieldValue("destination.type", "existing");
        setStepNumber(stepNumber + 1);
        return;
      }
      const payload: CreateDestinationPayload = {
        id: values.destination.existing.id,
        destination_connector_definition: `destination-connector-definitions/${values.destination.existing.id}`,
        connector: {
          configuration: "{}",
        },
      };

      createDestination.mutate(payload, {
        onSuccess: () => {
          if (amplitudeIsInit) {
            sendAmplitudeData("create_destination", {
              type: "critical_action",
              process: "pipeline",
            });
          }
          setFieldValue("destination.type", "existing");
          setStepNumber(stepNumber + 1);
        },
      });
    }
  };

  return (
    <FormikStep>
      {values.pipeline.mode === "MODE_SYNC" ? (
        <div className="flex flex-col gap-y-5">
          <SingleSelect
            id="existingDestinationId"
            name="destination.existing.id"
            label="Destination type"
            description="With the selection of Sync type for the Pipeline, the destination will be same as the source."
            options={syncDestinationOptions}
            value={syncDestinationOptions[selectedSyncDestinationIndex]}
            error={errors.destination?.existing?.id || null}
            disabled={true}
            required={true}
          />
          <PrimaryButton
            position="ml-auto"
            disabled={false}
            type="button"
            onClickHandler={handleGoNext}
          >
            Next
          </PrimaryButton>
        </div>
      ) : (
        <div className="flex flex-1 flex-row">
          <UseExistingDestinationFlow {...props} />
          <FormVerticalDividers />
          <CreateNewDestinationFlow {...props} />
          {/* <CreateDestinationForm
            setStepNumber={props.setStepNumber}
            setResult={(id) => {
              setFieldValue("destination.new.id", id);
            }}
          /> */}
        </div>
      )}
    </FormikStep>
  );
};

export default SetupDestinationStep;
