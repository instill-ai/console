import { ChangeEvent, useCallback, useMemo, useState } from "react";
import * as yup from "yup";
import {
  BasicProgressMessageBox,
  BasicSingleSelect,
  BasicTextArea,
  OutlineButton,
  ProgressMessageBoxState,
  SolidButton,
} from "@instill-ai/design-system";
import { AxiosError } from "axios";
import Image from "next/image";

import {
  AirbyteFieldErrors,
  AirbyteFieldValues,
  useAirbyteFieldValues,
  useAirbyteFormTree,
  useBuildAirbyteYup,
  useAirbyteSelectedConditionMap,
} from "@/lib/airbytes";
import { AirbyteDestinationFields } from "@/lib/airbytes/components";
import { dot } from "@/lib/dot";
import {
  DestinationWithDefinition,
  UpdateDestinationPayload,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { DeleteResourceModal, FormBase } from "@/components/ui";
import {
  useDeleteDestination,
  useUpdateDestination,
} from "@/services/connector";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { useDeleteResourceGuard } from "@/hooks";
import { useRouter } from "next/router";

export type ConfigureDestinationFormProps = {
  destination: DestinationWithDefinition;
};

export const ConfigureDestinationForm = ({
  destination,
}: ConfigureDestinationFormProps) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const router = useRouter();

  // ##########################################################################
  // # 1 - Get the destination definition and static state for fields         #
  // ##########################################################################

  const isSyncDestination = useMemo(() => {
    if (
      destination.destination_connector_definition.connector_definition
        .docker_repository === "instill-ai/destination-grpc" ||
      destination.destination_connector_definition.connector_definition
        .docker_repository === "instill-ai/destination-http"
    ) {
      return true;
    }

    return false;
  }, [destination]);

  const destinationDefinitionOption = useMemo(() => {
    return {
      label:
        destination.destination_connector_definition.connector_definition.title,
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
          alt={`${destination.destination_connector_definition.connector_definition.title}-icon`}
        />
      ),
    };
  }, [
    destination.destination_connector_definition.id,
    destination.destination_connector_definition.connector_definition
      .docker_repository,
    destination.destination_connector_definition.connector_definition.icon,
    destination.destination_connector_definition.connector_definition.title,
  ]);

  // ##########################################################################
  // # 2 - Create interior state for managing the form                        #
  // ##########################################################################

  const [formIsDirty, setFormIsDirty] = useState(false);

  const [fieldErrors, setFieldErrors] =
    useState<Nullable<AirbyteFieldErrors>>(null);

  const destinationFormTree = useAirbyteFormTree(
    destination.destination_connector_definition
  );

  const initialValues: AirbyteFieldValues = {
    configuration: destination.connector.configuration,
    ...dot.toDot(destination.connector.configuration),
    description: destination.connector.description || undefined,
  };

  const [selectedConditionMap, setSelectedConditionMap] =
    useAirbyteSelectedConditionMap(destinationFormTree, initialValues);

  const { fieldValues, setFieldValues } = useAirbyteFieldValues(
    destinationFormTree,
    initialValues
  );

  const [canEdit, setCanEdit] = useState(false);
  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

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

  const updateFieldValues = useCallback(
    (field: string, value: string) => {
      setFormIsDirty(true);
      setFieldValues((prev) => {
        return {
          ...prev,
          [field]: value,
        };
      });
    },
    [setFieldValues, setFormIsDirty]
  );

  // ##########################################################################
  // # 2 - Configure destination                                              #
  // ##########################################################################

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

    let stripValues = {} as { configuration: AirbyteFieldValues };

    if (!canEdit) {
      setCanEdit(true);
      return;
    } else {
      if (!formIsDirty) return;
      try {
        // We use yup to strip not necessary condition value. Please read
        // /lib/airbyte/README.md for more information, especially the section
        // How to remove old condition configuration when user select new one?

        stripValues = formYup.validateSync(fieldValues, {
          abortEarly: false,
          strict: false,
          stripUnknown: true,
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

      const payload: UpdateDestinationPayload = {
        name: destination.name,
        connector: {
          description: fieldValues.description as string | undefined,
          ...stripValues,
        },
      };

      setMessageBoxState(() => ({
        activate: true,
        status: "progressing",
        description: null,
        message: "Updating...",
      }));

      updateDestination.mutate(payload, {
        onSuccess: () => {
          setCanEdit(false);
          setFormIsDirty(false);
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
            setMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: JSON.stringify(
                error.response?.data.details,
                null,
                "\t"
              ),
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

      return;
    }
  }, [
    amplitudeIsInit,
    formYup,
    fieldValues,
    canEdit,
    setCanEdit,
    formIsDirty,
    setFormIsDirty,
    destination.destination_connector_definition.connector_definition
      .docker_repository,
    destination.name,
    updateDestination,
  ]);

  // ##########################################################################
  // # 3 - Handle delete destination                                          #
  // ##########################################################################

  const { disableResourceDeletion } = useDeleteResourceGuard();

  const [deleteDestinationModalIsOpen, setDeleteDestinationModalIsOpen] =
    useState(false);

  const deleteDestination = useDeleteDestination();

  const handleDeleteDestination = useCallback(() => {
    if (!destination) return;

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Deleting...",
    }));

    deleteDestination.mutate(destination.name, {
      onSuccess: () => {
        setMessageBoxState(() => ({
          activate: true,
          status: "success",
          description: null,
          message: "Succeed.",
        }));

        if (amplitudeIsInit) {
          sendAmplitudeData("delete_destination", {
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
            message: `${error.response?.status} - ${error.response?.data.message}`,
            description: JSON.stringify(
              error.response?.data.details,
              null,
              "\t"
            ),
            status: "error",
          }));
        } else {
          setMessageBoxState(() => ({
            activate: true,
            status: "error",
            description: null,
            message: "Something went wrong when delete the source",
          }));
        }
      },
    });
    setDeleteDestinationModalIsOpen(false);
  }, [amplitudeIsInit, deleteDestination, destination, router]);

  return (
    <>
      <FormBase
        noValidate={true}
        flex1={false}
        padding={null}
        marginBottom={null}
      >
        <div className="flex flex-col mb-8 gap-y-5">
          <BasicSingleSelect
            id="definition"
            key="definition"
            instanceId="definition"
            label="Destination type"
            disabled={true}
            value={destinationDefinitionOption}
            options={[]}
            description={`<a href='${destination.destination_connector_definition.connector_definition.documentation_url}'>Setup Guide</a>`}
          />
          {!isSyncDestination ? (
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
          ) : null}
          <AirbyteDestinationFields
            destinationFormTree={destinationFormTree}
            fieldValues={fieldValues}
            setFieldValues={setFieldValues}
            fieldErrors={fieldErrors}
            selectedConditionMap={selectedConditionMap}
            setSelectedConditionMap={setSelectedConditionMap}
            disableAll={!canEdit}
            formIsDirty={formIsDirty}
            setFormIsDirty={setFormIsDirty}
          />
        </div>
        <div className="flex flex-row mb-10">
          <OutlineButton
            disabled={disableResourceDeletion}
            onClickHandler={() => setDeleteDestinationModalIsOpen(true)}
            position="mr-auto my-auto"
            type="button"
            color="danger"
            hoveredShadow={null}
          >
            Delete
          </OutlineButton>
          <SolidButton
            type="button"
            color="primary"
            disabled={isSyncDestination}
            position="ml-auto my-auto"
            onClickHandler={() => handleSubmit()}
          >
            {canEdit ? "Save" : "Edit"}
          </SolidButton>
        </div>
        <div className="flex">
          <BasicProgressMessageBox
            state={messageBoxState}
            setState={setMessageBoxState}
            width="w-[25vw]"
            closable={true}
          />
        </div>
      </FormBase>
      <DeleteResourceModal
        resource={destination}
        modalIsOpen={deleteDestinationModalIsOpen}
        setModalIsOpen={setDeleteDestinationModalIsOpen}
        handleDeleteResource={handleDeleteDestination}
      />
    </>
  );
};
