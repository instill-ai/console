import { FC, useState, useEffect, useMemo } from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption } from "@instill-ai/design-system";
import Image from "next/image";

import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import {
  useCreateDestination,
  useDestinationDefinitions,
} from "@/services/connector";
import { ConnectorIcon, PrimaryButton } from "@/components/ui";
import { CreateDestinationPayload } from "@/lib/instill";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { SingleSelect, TextField } from "@/components/formik";

export type CreateNewDestinationFlowProps = StepNumberState;

const CreateNewDestinationFlow: FC<CreateNewDestinationFlowProps> = ({
  setStepNumber,
  stepNumber,
}) => {
  const { values, errors, setFieldValue } =
    useFormikContext<CreatePipelineFormValues>();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the destination definition                       #
  // #                                                                 #
  // ###################################################################

  const destinationDefinitions = useDestinationDefinitions();

  const [destinationDefinitionOptions, setDestinationDefinitionOptions] =
    useState<SingleSelectOption[] | null>(null);

  useEffect(() => {
    if (!destinationDefinitions.isSuccess || !destinationDefinitions.data)
      return;

    if (values.pipeline.mode === "MODE_ASYNC") {
      console.log(destinationDefinitions);
      setDestinationDefinitionOptions(
        destinationDefinitions.data
          .filter(
            (e) =>
              e.name !== "destination-connector-definitions/destination-http" &&
              e.name !== "destination-connector-definitions/destination-grpc"
          )
          .map((e) => {
            return {
              label: e.connector_definition.title,
              value: e.id,
              startIcon: (
                <Image
                  className="my-auto"
                  src={
                    e.connector_definition.docker_repository.split("/")[0] ===
                    "airbyte"
                      ? `/icons/airbyte/${e.connector_definition.icon}`
                      : `/icons/instill/${e.connector_definition.icon}`
                  }
                  width={24}
                  height={24}
                  layout="fixed"
                />
              ),
            };
          })
      );
    } else {
      setDestinationDefinitionOptions(
        destinationDefinitions.data.map((e) => {
          return {
            label: e.connector_definition.title,
            value: e.id,
            startIcon: (
              <ConnectorIcon
                iconName={e.connector_definition.icon}
                iconColor="fill-instillGrey90"
                iconHeight="h-[30px]"
                iconWidth="w-[30px]"
                iconPosition="my-auto"
              />
            ),
          };
        })
      );
    }
  }, [destinationDefinitions.isSuccess, destinationDefinitions.data]);

  const selectedDestinationDefinition = useMemo(() => {
    if (
      !destinationDefinitions.isSuccess ||
      !destinationDefinitionOptions ||
      !values.destination.new.definition
    ) {
      return null;
    }

    return (
      destinationDefinitionOptions.find(
        (e) => e.value === values.destination.new.definition
      ) || null
    );
  }, [
    destinationDefinitions.isSuccess,
    destinationDefinitionOptions,
    values.destination.new.definition,
  ]);

  // ###################################################################
  // #                                                                 #
  // # 2 - Create new destination                                      #
  // #                                                                 #
  // ###################################################################
  //
  // TODO: verify whether the destination already exist or not

  const canCreateNewDestination = useMemo(() => {
    if (!values.destination.new.id) return false;

    return true;
  }, [values.destination.new.id]);

  const createDestination = useCreateDestination();

  const handleCreateNewDestination = () => {
    if (!values.destination.existing.id) return;

    const payload: CreateDestinationPayload = {
      id: values.destination.existing.id,
      destination_connector_definition: `destination-connector-definitions/${values.destination.existing.id}`,
      connector: {
        configuration: {},
      },
    };

    createDestination.mutate(payload, {
      onSuccess: () => {
        setFieldValue("destination.type", "existing");
        setFieldValue("destination.type", "existing");
        if (amplitudeIsInit) {
          sendAmplitudeData("create_destination", {
            type: "critical_action",
            process: "pipeline",
          });
        }
        setStepNumber(stepNumber + 1);
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="text-black text-instill-h3">Setup a new destination</h3>
      <TextField
        id="destinationId"
        name="destination.new.id"
        label="ID"
        description={
          "Pick a name to help you identify this resource. The ID conforms to RFC-1034, " +
          "which restricts to letters, numbers, and hyphen, with the first character a letter," +
          "the last a letter or a number, and a 63 character maximum."
        }
        value={values.destination.new.id}
        error={errors.destination?.new?.id || null}
        required={true}
      />
      <SingleSelect
        id="destinationDefinition"
        name="destination.new.definition"
        label="Destination type"
        options={destinationDefinitionOptions || []}
        value={selectedDestinationDefinition}
        error={errors.destination?.existing?.definition || null}
        required={true}
        description={"Setup Guide"}
      />
      <PrimaryButton
        position="ml-auto"
        type="button"
        disabled={canCreateNewDestination ? false : true}
        onClickHandler={handleCreateNewDestination}
      >
        Set up
      </PrimaryButton>
    </div>
  );
};

export default CreateNewDestinationFlow;
