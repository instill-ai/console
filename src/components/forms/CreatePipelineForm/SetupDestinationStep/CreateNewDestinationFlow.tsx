import { FC, useState, useEffect, useMemo } from "react";
import { useFormikContext } from "formik";
import { SingleSelectOption } from "@instill-ai/design-system";

import { SingleSelect, TextField } from "../../../formik";
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
        configuration: "{}",
      },
    };

    createDestination.mutate(payload, {
      onSuccess: () => {
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
      <h3 className="instill-text-h3 text-black">Setup a new destination</h3>
      <TextField
        name="destination.new.id"
        label="Name"
        description="Pick a name to help you identify this source in Instill"
        value={values.destination.new.id}
        error={errors.destination?.new?.id || null}
        additionalOnChangeCb={null}
        disabled={false}
        readOnly={false}
        required={true}
        placeholder=""
        type="text"
        autoComplete="off"
      />
      <SingleSelect
        name="dataDestination.new.definition"
        instanceId="new-data-destination"
        label="Source type"
        disabled={false}
        readOnly={false}
        options={destinationDefinitionOptions || []}
        value={selectedDestinationDefinition}
        error={errors.destination?.existing?.definition || null}
        additionalOnChangeCb={null}
        required={true}
        description={"Setup Guide"}
        menuPlacement="auto"
      />
      <PrimaryButton
        position="ml-auto"
        type="button"
        disabled={canCreateNewDestination ? false : true}
        onClickHandler={handleCreateNewDestination}
      >
        Set up source
      </PrimaryButton>
    </div>
  );
};

export default CreateNewDestinationFlow;
