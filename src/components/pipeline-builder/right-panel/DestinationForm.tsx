import * as yup from "yup";
import { isAxiosError } from "axios";
import {
  FormRoot,
  BasicSingleSelect,
  BasicTextArea,
  DataDestinationIcon,
  useToast,
  Button,
  Icons,
  BasicTextField,
  type FormRootProps,
} from "@instill-ai/design-system";
import {
  useAirbyteFieldValues,
  useAirbyteFormTree,
  useBuildAirbyteYup,
  dot,
  useAirbyteSelectedConditionMap,
  useUpdateConnector,
  useAmplitudeCtx,
  sendAmplitudeData,
  getInstillApiErrorMessage,
  testConnectorConnectionAction,
  AirbyteDestinationFields,
  ImageWithFallback,
  type AirbyteFieldErrors,
  type AirbyteFieldValues,
  type ConnectorWithDefinition,
  type UpdateConnectorPayload,
  type Nullable,
  CreateConnectorPayload,
  useCreateConnector,
} from "@instill-ai/toolkit";
import { IncompleteConnectorWithWatchState } from "@/types";
import { PipelineBuilderStore, usePipelineBuilderStore } from "@/stores";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

export type DestinationFormProps = {
  accessToken: Nullable<string>;
  destination: ConnectorWithDefinition | IncompleteConnectorWithWatchState;
} & Pick<FormRootProps, "marginBottom" | "width">;

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  updateResourceFormIsDirty: state.updateResourceFormIsDirty,
  updateSelectedNode: state.updateSelectedNode,
  updateNodes: state.updateNodes,
});

export const DestinationForm = (props: DestinationFormProps) => {
  const { destination, accessToken, width, marginBottom } = props;
  const { amplitudeIsInit } = useAmplitudeCtx();

  /* -------------------------------------------------------------------------
   * Initialize form state
   * -----------------------------------------------------------------------*/

  const { updateResourceFormIsDirty, updateSelectedNode, updateNodes } =
    usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  /* -------------------------------------------------------------------------
   * Get the destination definition and static state for fields
   * -----------------------------------------------------------------------*/

  const isSyncDestination = useMemo(() => {
    if (
      destination.connector_definition.id === "destination-grpc" ||
      destination.connector_definition.id === "destination-http"
    ) {
      return true;
    }

    return false;
  }, [destination]);

  const destinationDefinitionOption = useMemo(() => {
    return {
      label: destination.connector_definition.title,
      value: destination.connector_definition.id,
      startIcon: (
        <ImageWithFallback
          src={
            destination.connector_definition.id.startsWith("airbyte")
              ? `/icons/airbyte/${destination.connector_definition.icon}`
              : `/icons/instill/${destination.connector_definition.icon}`
          }
          width={24}
          height={24}
          alt={`${destination.connector_definition.title}-icon`}
          fallbackImg={<DataDestinationIcon width="w-6" height="h-6" />}
        />
      ),
    };
  }, [destination]);

  /* -------------------------------------------------------------------------
   * Create interior state for managing the form
   * -----------------------------------------------------------------------*/

  const [airbyteFormIsDirty, setAirbyteFormIsDirty] = useState(false);

  useEffect(() => {
    updateResourceFormIsDirty(() => airbyteFormIsDirty);
  }, [airbyteFormIsDirty, updateResourceFormIsDirty]);

  const [fieldErrors, setFieldErrors] =
    useState<Nullable<AirbyteFieldErrors>>(null);

  const destinationFormTree = useAirbyteFormTree(
    destination.connector_definition
  );

  const initialValues: AirbyteFieldValues = {
    id: destination.id,
    configuration: destination.configuration,
    ...dot.toDot(destination.configuration),
    description:
      "description" in destination ? destination.description : undefined,
  };

  const [selectedConditionMap, setSelectedConditionMap] =
    useAirbyteSelectedConditionMap(destinationFormTree, initialValues);

  const { fieldValues, setFieldValues } = useAirbyteFieldValues(
    destinationFormTree,
    initialValues
  );

  const airbyteYup = useBuildAirbyteYup(
    destination.connector_definition.spec.connection_specification ?? null,
    selectedConditionMap,
    null
  );

  const formYup = useMemo(() => {
    if (!airbyteYup) return null;

    return yup.object({
      configuration: airbyteYup,
    });
  }, [airbyteYup]);

  const updateFieldValues = useCallback(
    (field: string, value: string) => {
      setAirbyteFormIsDirty(true);
      setFieldValues((prev) => {
        return {
          ...prev,
          [field]: value,
        };
      });
    },
    [setFieldValues, setAirbyteFormIsDirty]
  );

  /* -------------------------------------------------------------------------
   * Configure destination
   * -----------------------------------------------------------------------*/

  const updateDestination = useUpdateConnector();
  const createDestination = useCreateConnector();
  const { toast } = useToast();

  const handleSubmit = useCallback(async () => {
    if (
      destination.id === "destination-grpc" ||
      destination.id === "destination-http"
    ) {
      return;
    }

    if (!fieldValues || !formYup) {
      return;
    }

    let stripValues = {} as { configuration: AirbyteFieldValues };

    if (!airbyteFormIsDirty) {
      return;
    }

    // We use yup to strip not necessary condition value. Please read
    // /lib/airbyte/README.md for more information, especially the section
    // How to remove old condition configuration when user select new one?

    try {
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

    // Optimistically update the selectedNode'id, because if the user change the pre-defined id
    // and the previous nodes and selectedNodes stay unchanged, we will have a problem to update
    // it once new data is coming in.

    const oldId = destination.id;
    const newId = fieldValues.id as string;

    updateSelectedNode((prev) => {
      if (prev === null) return prev;

      return {
        ...prev,
        data: {
          ...prev.data,
          connector: {
            ...prev.data.connector,
            id: newId,
            name: `connectors/${newId}`,
          },
        },
      };
    });

    updateNodes((prev) => {
      return prev.map((node) => {
        if (node.data.connector.id === oldId) {
          return {
            ...node,
            data: {
              ...node.data,
              connector: {
                ...node.data.connector,
                id: newId,
                name: `connectors/${newId}`,
              },
            },
          };
        }

        return node;
      });
    });

    if ("uid" in destination) {
      const payload: UpdateConnectorPayload = {
        connectorName: destination.name,
        description: fieldValues.description as string | undefined,
        ...stripValues,
      };

      updateDestination.mutate(
        { payload, accessToken },
        {
          onSuccess: () => {
            setAirbyteFormIsDirty(false);

            toast({
              title: "Succeed.",
              description: null,
              variant: "alert-success",
              size: "small",
            });

            if (amplitudeIsInit) {
              sendAmplitudeData("update_destination", {
                type: "critical_action",
                process: "destination",
              });
            }
          },
          onError: (error) => {
            // Rollback the selectedNode'id
            updateSelectedNode((prev) => {
              if (prev === null) return prev;

              return {
                ...prev,
                data: {
                  ...prev.data,
                  id: oldId,
                  name: `connectors/${oldId}`,
                },
              };
            });

            // Rollback the nodes'id
            updateNodes((prev) => {
              return prev.map((node) => {
                if (node.data.connector.id === newId) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      connector: {
                        ...node.data.connector,
                        id: oldId,
                        name: `connectors/${oldId}`,
                      },
                    },
                  };
                }

                return node;
              });
            });

            if (isAxiosError(error)) {
              toast({
                title: "Error",
                description: getInstillApiErrorMessage(error),
                variant: "alert-error",
                size: "large",
              });
            } else {
              toast({
                title: "Error",
                description: "Something went wrong when create the destination",
                variant: "alert-error",
                size: "large",
              });
            }
          },
        }
      );

      return;
    }

    let payload = {} as CreateConnectorPayload;

    // destination-grpc and destination-http come from instill-ai and follow
    // our own payload

    if (destination.id === "destination-grpc") {
      payload = {
        connectorName: "connectors/destination-grpc",
        connector_definition_name: destination.connector_definition_name,
        description: fieldValues.description as string,
        configuration: {},
      };
    } else if (destination.id === "destination-http") {
      payload = {
        connectorName: "connectors/destination-http",
        connector_definition_name: destination.connector_definition_name,
        description: fieldValues.description as string,
        configuration: {},
      };
    } else {
      payload = {
        connectorName: `connectors/${fieldValues.id}` as string,
        connector_definition_name: destination.connector_definition_name,
        description: fieldValues.description as string,
        configuration: stripValues.configuration,
      };
    }

    createDestination.mutate(
      { payload, accessToken },
      {
        onSuccess: () => {
          toast({
            title: "Successfully update destination",
            variant: "alert-success",
            size: "small",
          });

          updateSelectedNode((prev) => {
            if (prev === null) return prev;

            return {
              ...prev,
              data: {
                ...prev.data,
                connector: {
                  ...prev.data.connector,
                  configuration: stripValues.configuration,
                  description: fieldValues.description as string,
                },
              },
            };
          });

          setAirbyteFormIsDirty(false);

          if (amplitudeIsInit) {
            sendAmplitudeData("create_destination", {
              type: "critical_action",
              process: "destination",
            });
          }
        },
        onError: (error) => {
          // Rollback the selectedNode'id
          updateSelectedNode((prev) => {
            if (prev === null) return prev;

            return {
              ...prev,
              data: {
                ...prev.data,
                id: oldId,
                name: `connectors/${oldId}`,
              },
            };
          });

          // Rollback the nodes'id
          updateNodes((prev) => {
            return prev.map((node) => {
              if (node.data.connector.id === newId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    connector: {
                      ...node.data.connector,
                      id: oldId,
                      name: `connectors/${oldId}`,
                    },
                  },
                };
              }

              return node;
            });
          });

          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when create the AI",
              variant: "alert-error",
              size: "large",
              description: getInstillApiErrorMessage(error),
            });
          } else {
            toast({
              title: "Something went wrong when create the AI",
              variant: "alert-error",
              size: "large",
              description: "Please try again later",
            });
          }
        },
      }
    );
    return;
  }, [
    toast,
    amplitudeIsInit,
    formYup,
    fieldValues,
    airbyteFormIsDirty,
    setAirbyteFormIsDirty,
    updateDestination,
    accessToken,
    createDestination,
    destination,
    updateSelectedNode,
    updateNodes,
  ]);

  const [isTesting, setIsTesting] = useState(false);

  const handleTestDestination = async function () {
    if (!destination) return;

    setIsTesting(true);

    try {
      const res = await testConnectorConnectionAction({
        connectorName: destination.name,
        accessToken,
      });

      setIsTesting(false);

      toast({
        title: `${props.destination.id} is ${
          res.state === "STATE_ERROR" ? "not connected" : "connected"
        }`,
        description: `The ${props.destination.id} state is ${res.state}`,
        variant: res.state === "STATE_ERROR" ? "alert-error" : "alert-success",
        size: "large",
      });
    } catch (err) {
      setIsTesting(false);

      toast({
        title: "Error",
        description: `There is something wrong when test connection`,
        variant: "alert-error",
        size: "large",
      });
    }
  };

  return (
    <>
      <FormRoot marginBottom={marginBottom} width={width}>
        <div className="mb-8 flex flex-col gap-y-5">
          <BasicTextField
            id="destination-id"
            label="ID"
            key="id"
            description={
              "Pick a name to help you identify this resource. The ID conforms to RFC-1034, " +
              "which restricts to letters, numbers, and hyphen, with the first character a letter," +
              "the last a letter or a number, and a 63 character maximum."
            }
            required={true}
            disabled={"uid" in destination ? true : false}
            value={fieldValues ? (fieldValues.id as string) ?? null : null}
            error={fieldErrors ? (fieldErrors.id as string) ?? null : null}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateFieldValues("id", event.target.value)
            }
          />
          <BasicSingleSelect
            id="destination-definition"
            key="definition"
            label="Destination type"
            disabled={true}
            value={destinationDefinitionOption}
            options={[destinationDefinitionOption]}
            description={`<a href='${destination.connector_definition.documentation_url}'>Setup Guide</a>`}
          />
          {!isSyncDestination ? (
            <BasicTextArea
              id="destination-description"
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
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateFieldValues("description", event.target.value)
              }
              disabled={false}
            />
          ) : null}
          <AirbyteDestinationFields
            destinationFormTree={destinationFormTree}
            fieldValues={fieldValues}
            setFieldValues={setFieldValues}
            fieldErrors={fieldErrors}
            selectedConditionMap={selectedConditionMap}
            setSelectedConditionMap={setSelectedConditionMap}
            disableAll={false}
            formIsDirty={airbyteFormIsDirty}
            setFormIsDirty={setAirbyteFormIsDirty}
          />
        </div>
        <div className="flex w-full flex-row-reverse gap-x-4">
          <Button
            onClick={handleTestDestination}
            className="gap-x-2"
            variant="primary"
            size="lg"
          >
            Test
            {isTesting ? (
              <svg
                className="m-auto h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <Icons.Play className="h-4 w-4 stroke-semantic-fg-on-default" />
            )}
          </Button>
          <Button
            variant="secondaryColour"
            disabled={airbyteFormIsDirty ? false : true}
            size={airbyteFormIsDirty ? "lg" : "md"}
            className="gap-x-2"
            onClick={() => handleSubmit()}
            type="button"
          >
            {"uid" in destination ? "Update" : "Create"}
            <Icons.Save01 className="h-4 w-4 stroke-semantic-accent-on-bg group-disabled:stroke-semantic-fg-disabled" />
          </Button>
        </div>
      </FormRoot>
    </>
  );
};
