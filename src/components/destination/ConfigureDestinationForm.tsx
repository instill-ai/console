import { ChangeEvent, useCallback, useMemo, useState } from "react";
import * as yup from "yup";
import {
  BasicProgressMessageBox,
  BasicSingleSelect,
  BasicTextArea,
  ProgressMessageBoxState,
  SolidButton,
} from "@instill-ai/design-system";
import { AxiosError } from "axios";
import Image from "next/image";

import {
  AirbyteFieldErrors,
  AirbyteFieldValues,
  SelectedItemMap,
  useAirbyteFieldValues,
  useAirbyteFormTree,
  useBuildAirbyteYup,
} from "@/lib/airbytes";
import { AirbyteDestinationFields } from "@/lib/airbytes/components";
import dot from "@/lib/dot";
import { DestinationWithDefinition } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { FormBase } from "@/components/forms";
import { useUpdateDestination } from "@/services/connector/destination/mutations";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

export type ConfigureDestinationFormProps = {
  destination: DestinationWithDefinition;
};

const ConfigureDestinationForm = ({
  destination,
}: ConfigureDestinationFormProps) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [fieldErrors, setFieldErrors] =
    useState<Nullable<AirbyteFieldErrors>>(null);
  const [selectedConditionMap, setSelectedConditionMap] =
    useState<Nullable<SelectedItemMap>>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const destinationFormTree = useAirbyteFormTree(
    destination.destination_connector_definition
  );

  const initialValues = {
    configuration: destination.connector.configuration,
    ...dot.toDot(destination.connector.configuration),
  };

  const { fieldValues, setFieldValues } = useAirbyteFieldValues(
    destinationFormTree,
    initialValues
  );

  const airbyteYup = useBuildAirbyteYup(
    destination.destination_connector_definition.connector_definition.spec
      .connection_specification ?? null,
    selectedConditionMap,
    null
  );

  const formYup = useMemo(() => {
    if (!airbyteYup) return null;

    return yup.object({
      configuration: airbyteYup,
    });
  }, [airbyteYup]);

  const updateDestination = useUpdateDestination();

  const updateFieldValues = useCallback((field: string, value: string) => {
    setFieldValues((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (
      destination.destination_connector_definition.connector_definition
        .docker_repository === "instill-ai/destination-grpc" ||
      destination.destination_connector_definition.connector_definition
        .docker_repository === "instill-ai/destination-http"
    ) {
      return;
    }

    if (!fieldValues || !formYup) {
      return;
    }

    if (!canEdit) {
      setCanEdit(true);
      return;
    } else {
      try {
        formYup.validateSync(fieldValues, {
          abortEarly: false,
          strict: true,
        });
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const errors = {} as AirbyteFieldErrors;
          for (const err of error.inner) {
            if (err.path) {
              const message = err.message.replace(err.path, "This field");
              const pathList = err.path.split(".");

              // Because we are using { configuration: airbyteYup } to construct the yup, yup will add "configuration" as prefix at the start
              // of the path like configuration.tunnel_method
              if (pathList[0] === "configuration") {
                pathList.shift();
              }

              const removeConfigurationPrefixPath = pathList.join(".");
              errors[removeConfigurationPrefixPath] = message;
            }
          }
          setFieldErrors(errors);
        }

        return;
      }
      setFieldErrors(null);

      const payload = {
        name: destination.name,
        connector: {
          configuration:
            (fieldValues.configuration as AirbyteFieldValues) ?? {},
        },
      };

      console.log(payload);

      setMessageBoxState(() => ({
        activate: true,
        status: "progressing",
        description: null,
        message: "Creating...",
      }));
      updateDestination.mutate(payload, {
        onSuccess: () => {
          setCanEdit(false);
          setMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeed.",
          }));

          if (amplitudeIsInit) {
            sendAmplitudeData("update_destination", {
              type: "critical_action",
              process: "destination",
            });
          }
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            console.log(error);
            // setMessageBoxState(() => ({
            //   activate: true,
            //   status: "error",
            //   description:
            //     (error.response?.data.details as ErrorDetails[])[0]
            //       .description ?? null,
            //   message: error.message,
            // }));
          } else {
            setMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: "Something went wrong when create the destination",
            }));
          }
        },
      });

      return;
    }
  }, [amplitudeIsInit, formYup, fieldValues]);

  return (
    <FormBase padding="" noValidate={true} flex1={false} marginBottom={null}>
      <div className="flex flex-col mb-8 gap-y-5">
        <BasicSingleSelect
          id="definition"
          key="definition"
          instanceId="definition"
          label="Destination type"
          disabled={true}
          value={{
            label: destination.destination_connector_definition.id,
            value: destination.destination_connector_definition.id,
            startIcon: (
              <Image
                className="my-auto"
                src={
                  destination.destination_connector_definition.connector_definition.docker_repository.split(
                    "/"
                  )[0] === "airbyte"
                    ? `/icons/airbyte/${destination.destination_connector_definition.connector_definition.icon}`
                    : `/icons/instill/${destination.destination_connector_definition.connector_definition.icon}`
                }
                width={24}
                height={24}
                layout="fixed"
              />
            ),
          }}
          options={[
            {
              label: destination.destination_connector_definition.id,
              value: destination.destination_connector_definition.id,
            },
          ]}
          description={`<a href='${destination.destination_connector_definition.connector_definition.documentation_url}'>Setup Guide</a>`}
        />
        <BasicTextArea
          id="description"
          label="Description"
          key="description"
          description="Fill with a short description."
          required={false}
          error={
            fieldErrors ? (fieldErrors.description as string) ?? null : null
          }
          value={
            fieldValues ? (fieldValues.description as string) ?? null : null
          }
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            updateFieldValues("description", event.target.value)
          }
          disabled={!canEdit}
        />
        <AirbyteDestinationFields
          destinationFormTree={destinationFormTree}
          fieldValues={fieldValues}
          setFieldValues={setFieldValues}
          fieldErrors={fieldErrors}
          selectedConditionMap={selectedConditionMap}
          setSelectedConditionMap={setSelectedConditionMap}
          disableAll={!canEdit}
        />
      </div>

      <div className="flex flex-row">
        <BasicProgressMessageBox
          state={messageBoxState}
          setState={setMessageBoxState}
          width="w-[25vw]"
          closable={true}
        />
        <SolidButton
          type="button"
          color="primary"
          disabled={false}
          position="ml-auto my-auto"
          onClickHandler={() => handleSubmit()}
        >
          {canEdit ? "Save" : "Edit"}
        </SolidButton>
      </div>
    </FormBase>
  );
};

export default ConfigureDestinationForm;
