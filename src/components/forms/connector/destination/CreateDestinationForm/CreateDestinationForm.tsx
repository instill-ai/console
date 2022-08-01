import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
  ChangeEvent,
} from "react";
import { useRouter } from "next/router";
import {
  BasicProgressMessageBox,
  BasicSingleSelect,
  BasicTextArea,
  BasicTextField,
  ProgressMessageBoxState,
  SingleSelectOption,
} from "@instill-ai/design-system";
import * as yup from "yup";
import Image from "next/image";

import { PrimaryButton } from "@/components/ui";
import { ConnectorDefinition, CreateDestinationPayload } from "@/lib/instill";
import { Nullable } from "@/types/general";
import {
  useCreateDestination,
  useDestinationDefinitions,
} from "@/services/connector";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { FormBase } from "@/components/forms/commons";
import {
  AirbyteFieldValues,
  AirbyteFieldErrors,
  SelectedItemMap,
  useBuildAirbyteYup,
  useAirbyteFormTree,
  useAirbyteFieldValues,
} from "@/lib/airbytes";
import { AirbyteDestinationFields } from "@/lib/airbytes/components";
import { ValidationError } from "yup";
import { sendAmplitudeData } from "@/lib/amplitude";
import { AxiosError } from "axios";
import { ErrorDetails } from "@/lib/instill/types";

export type CreateDestinationFormProps = {
  setResult: Nullable<(destinationId: string) => void>;
  setStepNumber: Nullable<Dispatch<SetStateAction<number>>>;
};

const CreateDestinationForm: FC<CreateDestinationFormProps> = ({
  setResult,
  setStepNumber,
}) => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the destination definition                       #
  // #                                                                 #
  // ###################################################################

  const destinationDefinitions = useDestinationDefinitions();

  const destinationOptions = useMemo(() => {
    if (!destinationDefinitions.isSuccess) return [];

    const options: SingleSelectOption[] = [];

    for (const definition of destinationDefinitions.data) {
      options.push({
        label: definition.connector_definition.title,
        value: definition.name,
        startIcon: (
          <Image
            className="my-auto"
            src={
              definition.connector_definition.docker_repository.split(
                "/"
              )[0] === "airbyte"
                ? `/icons/airbyte/${definition.connector_definition.icon}`
                : `/icons/instill/${definition.connector_definition.icon}`
            }
            width={24}
            height={24}
            layout="fixed"
          />
        ),
      });
    }

    return options;
  }, [destinationDefinitions.isSuccess, destinationDefinitions.data]);

  const [selectedDestinationDefinition, setSelectedDestinationDefinition] =
    useState<Nullable<ConnectorDefinition>>(null);

  const [selectedDestinationOption, setSelectedDestinationOption] =
    useState<Nullable<SingleSelectOption>>(null);

  const destinationFormTree = useAirbyteFormTree(selectedDestinationDefinition);

  const { fieldValues, setFieldValues } =
    useAirbyteFieldValues(destinationFormTree);

  const [fieldErrors, setFieldErrors] =
    useState<Nullable<AirbyteFieldErrors>>(null);

  // Instill Ai provided connector HTTP and gRPC can only have default id destination-http and destination-grpc
  // We need to make sure user have proper instruction on this issue.

  const canSetIdField = useMemo(() => {
    if (!selectedDestinationDefinition) return true;

    if (
      selectedDestinationDefinition.connector_definition.docker_repository ===
        "instill-ai/destination-grpc" ||
      selectedDestinationDefinition.connector_definition.docker_repository ===
        "instill-ai/destination-http"
    ) {
      return false;
    } else {
      return true;
    }
  }, [selectedDestinationDefinition]);

  const defaultId = useMemo(() => {
    if (!selectedDestinationDefinition) return null;

    if (
      selectedDestinationDefinition.connector_definition.docker_repository ===
      "instill-ai/destination-grpc"
    ) {
      return "destination-grpc";
    }

    if (
      selectedDestinationDefinition.connector_definition.docker_repository ===
      "instill-ai/destination-http"
    ) {
      return "destination-http";
    }

    return null;
  }, [selectedDestinationDefinition]);

  // ###################################################################
  // #                                                                 #
  // # 2 - handle state when create destination                        #
  // #                                                                 #
  // ###################################################################
  const [selectedConditionMap, setSelectedConditionMap] =
    useState<Nullable<SelectedItemMap>>(null);

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const createDestination = useCreateDestination();

  const airbyteYup = useBuildAirbyteYup(
    selectedDestinationDefinition?.connector_definition.spec
      .connection_specification ?? null,
    selectedConditionMap,
    null
  );

  /**
   *  We store our data in two form, one is in dot.notation and the other is in object and
   *  the airbyteYup is planned to verify object part of the data
   *
   * {
   *    tunnel_method: "SSH",
   *    tunnel_method.tunnel_key: "hi",
   *    configuration: {
   *      tunnel_method: {
   *        tunnel_method: "SSH",
   *        tunnel_key: "hi"
   *      }
   *    }
   * }
   *
   */

  const formYup = useMemo(() => {
    if (!airbyteYup) return null;

    return yup.object({
      id: canSetIdField
        ? yup.string().required()
        : yup.string().nullable().notRequired(),
      configuration: airbyteYup,
    });
  }, [airbyteYup]);

  const submitHandler = useCallback(async () => {
    if (!fieldValues || !formYup) {
      return;
    }

    try {
      formYup.validateSync(fieldValues, {
        abortEarly: false,
        strict: true,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
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

    let payload = {} as CreateDestinationPayload;

    if (
      selectedDestinationDefinition?.connector_definition.docker_repository ===
      "instill-ai/destination-grpc"
    ) {
      payload = {
        id: "destination-grpc",
        destination_connector_definition: `destination-connector-definitions/${
          fieldValues.definition as string
        }`,
        connector: {
          description: fieldValues.description as string,
          configuration:
            (fieldValues.configuration as AirbyteFieldValues) ?? {},
        },
      };
    } else if (
      selectedDestinationDefinition?.connector_definition.docker_repository ===
      "instill-ai/destination-http"
    ) {
      payload = {
        id: "destination-http",
        destination_connector_definition: `destination-connector-definitions/${
          fieldValues.definition as string
        }`,
        connector: {
          description: fieldValues.description as string,
          configuration:
            (fieldValues.configuration as AirbyteFieldValues) ?? {},
        },
      };
    } else {
      payload = {
        id: fieldValues.id as string,
        destination_connector_definition: `destination-connector-definitions/${
          fieldValues.definition as string
        }`,
        connector: {
          description: fieldValues.description as string,
          configuration:
            (fieldValues.configuration as AirbyteFieldValues) ?? {},
        },
      };
    }

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Creating...",
    }));

    createDestination.mutate(payload, {
      onSuccess: (newDestination) => {
        setMessageBoxState(() => ({
          activate: true,
          status: "success",
          description: null,
          message: "Create succeeded.",
        }));
        if (setResult) {
          setResult(newDestination.id);
        }

        if (setStepNumber) {
          setStepNumber((prev) => prev + 1);
        }
        if (amplitudeIsInit) {
          sendAmplitudeData("create_destination", {
            type: "critical_action",
            process: "destination",
          });
        }
        router.push("/destinations");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          setMessageBoxState(() => ({
            activate: true,
            status: "error",
            description:
              (error.response?.data.details as ErrorDetails[])[0].description ??
              null,
            message: error.message,
          }));
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
  }, [
    amplitudeIsInit,
    router,
    createDestination,
    formYup,
    fieldValues,
    setResult,
    setStepNumber,
    selectedDestinationDefinition,
  ]);

  const updateFieldValues = useCallback((field: string, value: string) => {
    setFieldValues((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  return (
    <FormBase marginBottom={null} padding={null} noValidate={true}>
      <div className="mb-10 flex flex-col gap-y-5">
        <BasicTextField
          id="id"
          label="ID"
          key="id"
          description="Pick a name to help you identify this destination in Instill"
          required={true}
          disabled={canSetIdField ? false : true}
          additionalMessageOnLabel={
            canSetIdField
              ? null
              : `${selectedDestinationOption?.label} destination's id can only be ${defaultId}`
          }
          value={
            canSetIdField
              ? fieldValues
                ? (fieldValues.id as string) ?? null
                : null
              : defaultId
          }
          error={fieldErrors ? (fieldErrors.id as string) ?? null : null}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            updateFieldValues("id", event.target.value)
          }
        />

        <BasicTextArea
          id="description"
          label="Description"
          key="description"
          description="Fill with a short description of your data destination"
          required={false}
          error={
            fieldErrors ? (fieldErrors.description as string) ?? null : null
          }
          value={
            fieldValues ? (fieldValues.description as string) ?? null : null
          }
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            updateFieldValues("id", event.target.value)
          }
        />
        <BasicSingleSelect
          id="definition"
          key="definition"
          instanceId="definition"
          menuPlacement="auto"
          label="Destination type"
          error={
            fieldErrors ? (fieldErrors.definition as string) ?? null : null
          }
          value={selectedDestinationOption}
          options={destinationOptions}
          onChange={(option) => {
            setFieldErrors(null);
            setSelectedDestinationOption(option);
            setSelectedDestinationDefinition(
              destinationDefinitions.data
                ? destinationDefinitions.data.find(
                    (e) => e.name === option?.value
                  ) ?? null
                : null
            );
            setFieldValues((prev) => ({
              id: prev?.id ?? null,
              definition: option?.value ?? null,
            }));
          }}
        />
        <AirbyteDestinationFields
          destinationFormTree={destinationFormTree}
          fieldValues={fieldValues}
          setFieldValues={setFieldValues}
          fieldErrors={fieldErrors}
          selectedConditionMap={selectedConditionMap}
          setSelectedConditionMap={setSelectedConditionMap}
        />
      </div>
      <div className="flex flex-row">
        <BasicProgressMessageBox
          state={messageBoxState}
          setState={setMessageBoxState}
          width="w-[25vw]"
          closable={true}
        />
        <PrimaryButton
          type="submit"
          disabled={false}
          position="ml-auto my-auto"
          onClickHandler={() => submitHandler()}
        >
          Set up destination
        </PrimaryButton>
      </div>
    </FormBase>
  );
};

export default CreateDestinationForm;
