import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import {
  BasicProgressMessageBox,
  BasicSingleSelect,
  BasicTextArea,
  BasicTextField,
  DataDestinationIcon,
  ProgressMessageBoxState,
  SingleSelectOption,
  SolidButton,
  FormRoot,
  type FormRootProps,
} from "@instill-ai/design-system";

import { shallow } from "zustand/shallow";
import {
  AirbyteDestinationFields,
  AirbyteFieldErrors,
  AirbyteFieldValues,
  ConnectorDefinition,
  CreateConnectorPayload,
  CreateResourceFormStore,
  ImageWithFallback,
  Nullable,
  SelectedItemMap,
  getInstillApiErrorMessage,
  sendAmplitudeData,
  useAirbyteFieldValues,
  useAirbyteFormTree,
  useAmplitudeCtx,
  useBuildAirbyteYup,
  useConnectorDefinitions,
  useCreateConnector,
  useCreateResourceFormStore,
  validateResourceId,
} from "@instill-ai/toolkit";

export type CreateDestinationFormProps = {
  title: Nullable<string>;
  onCreate: Nullable<(id: string, init: () => void) => void>;
  accessToken: Nullable<string>;
  enabledQuery: boolean;
} & Pick<FormRootProps, "width" | "marginBottom" | "formLess">;

const selector = (state: CreateResourceFormStore) => ({
  init: state.init,
  formIsDirty: state.formIsDirty,
  setCreateNewResourceIsComplete: state.setCreateNewResourceIsComplete,
  setFormIsDirty: state.setFormIsDirty,
});

export const CreateDestinationForm = (props: CreateDestinationFormProps) => {
  const {
    title,
    onCreate,
    enabledQuery,
    accessToken,
    marginBottom,
    formLess,
    width,
  } = props;
  const { amplitudeIsInit } = useAmplitudeCtx();

  /* -------------------------------------------------------------------------
   * Initialize form state
   * -----------------------------------------------------------------------*/

  // Notice: We don't directly use our destination form state here because we
  // construct the form with airbyte way. We set our form state at the end.

  const { init, formIsDirty, setCreateNewResourceIsComplete, setFormIsDirty } =
    useCreateResourceFormStore(selector, shallow);

  /* -------------------------------------------------------------------------
   * Get the destination definition and static state for fields
   * -----------------------------------------------------------------------*/

  const destinationDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_DATA",
    accessToken,
    enabled: enabledQuery,
  });

  const destinationOptions = React.useMemo(() => {
    if (!destinationDefinitions.isSuccess) return [];

    return destinationDefinitions.data.map((e) => ({
      label: e.title,
      value: e.name,
      startIcon: (
        <ImageWithFallback
          src={`/icons/${e.vendor}/${e.icon}`}
          width={24}
          height={24}
          alt={`${e.title}-icon`}
          fallbackImg={<DataDestinationIcon width="w-6" height="h-6" />}
        />
      ),
    }));
  }, [destinationDefinitions.isSuccess, destinationDefinitions.data]);

  const [selectedDestinationDefinition, setSelectedDestinationDefinition] =
    React.useState<Nullable<ConnectorDefinition>>(null);

  const [selectedDestinationOption, setSelectedDestinationOption] =
    React.useState<Nullable<SingleSelectOption>>(null);

  // Instill Ai provided response operator can only have default id
  // response. We need to make sure user have
  // proper instruction on this issue.

  const canSetIdField = React.useMemo(() => {
    if (!selectedDestinationDefinition) return true;

    if (selectedDestinationDefinition.id === "response") {
      return false;
    } else {
      return true;
    }
  }, [selectedDestinationDefinition]);

  const defaultId = React.useMemo(() => {
    if (!selectedDestinationDefinition) return null;

    if (selectedDestinationDefinition.id === "response") {
      return "response";
    }

    return null;
  }, [selectedDestinationDefinition]);

  /* -------------------------------------------------------------------------
   * Create interior state for managing the form
   * -----------------------------------------------------------------------*/

  const destinationFormTree = useAirbyteFormTree(selectedDestinationDefinition);

  const { fieldValues, setFieldValues } = useAirbyteFieldValues(
    destinationFormTree,
    null
  );

  const [fieldErrors, setFieldErrors] =
    React.useState<Nullable<AirbyteFieldErrors>>(null);

  const [selectedConditionMap, setSelectedConditionMap] =
    React.useState<Nullable<SelectedItemMap>>(null);

  const [airbuteFormIsDirty, setAirbyteFormIsDirty] = React.useState(false);

  const [messageBoxState, setMessageBoxState] =
    React.useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const createConnector = useCreateConnector();

  const airbyteYup = useBuildAirbyteYup(
    selectedDestinationDefinition?.spec.connection_specification ?? null,
    selectedConditionMap,
    null
  );

  /**
   *  We store our data in two form, one is in dot.notation and the other
   *  is in object and the airbyteYup is planned to verify object part of
   *  the data
   *
   * {
   *    tunnel_method: "SSH",
   *    tunnel_method.tunnel_key: "hi", <--- yup won't verify this
   *    configuration: { <--- yup will verify this object
   *      tunnel_method: {
   *        tunnel_method: "SSH",
   *        tunnel_key: "hi"
   *      }
   *    }
   * }
   *
   */

  const formYup = React.useMemo(() => {
    if (!airbyteYup) return null;

    return yup.object({
      id: canSetIdField
        ? yup.string().required()
        : yup.string().nullable().notRequired(),
      configuration: airbyteYup,
    });
  }, [airbyteYup, canSetIdField]);

  /* -------------------------------------------------------------------------
   * Create the destination
   * -----------------------------------------------------------------------*/

  const submitHandler = React.useCallback(async () => {
    if (!fieldValues || !formYup) {
      return;
    }

    let stripValues = {} as { configuration: AirbyteFieldValues };

    // We don't validate the rest of the field if the ID is incorrect
    if (!validateResourceId(fieldValues.id as string)) {
      setFieldErrors((prev) => ({
        ...prev,
        id: "Resource ID restricts to lowercase letters, numbers, and hyphen, with the first character a letter, the last a letter or a number, and a 63 character maximum.",
      }));
      return;
    }

    try {
      // We use yup to strip not necessary condition values
      // Please read /lib/airbyte/README.md for more information, especially
      // the section: How to remove old condition configuration when user
      // select new one?

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

            // Because we are using { configuration: airbyteYup } to
            // construct the yup, yup will add "configuration" as prefix at
            // the start of the path like configuration.tunnel_method, we
            // need to remove the prefix to make it clearner.

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

    let payload = {} as CreateConnectorPayload;

    // Response come from instill-ai and follow our own payload

    if (selectedDestinationDefinition?.id === "response") {
      payload = {
        connectorName: "connectors/response",
        connector_definition_name: `connector-definitions/response`,
        description: fieldValues.description as string,
        configuration: {},
      };
    } else {
      payload = {
        connectorName: `connectors/${fieldValues.id}` as string,
        connector_definition_name: fieldValues.definition as string,
        description: fieldValues.description as string,
        configuration: stripValues.configuration,
      };
    }

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Creating...",
    }));

    createConnector.mutate(
      { payload, accessToken },
      {
        onSuccess: () => {
          setMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeed.",
          }));

          if (amplitudeIsInit) {
            sendAmplitudeData("create_destination", {
              type: "critical_action",
              process: "destination",
            });
          }

          if (onCreate) {
            onCreate(fieldValues.id as string, init);
            setCreateNewResourceIsComplete(true);
          }
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            setMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: getInstillApiErrorMessage(error),
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
      }
    );
  }, [
    init,
    amplitudeIsInit,
    createConnector,
    formYup,
    fieldValues,
    selectedDestinationDefinition,
    onCreate,
    setCreateNewResourceIsComplete,
    accessToken,
  ]);

  const updateFieldValues = React.useCallback(
    (field: string, value: string) => {
      if (!formIsDirty) setFormIsDirty(true);
      setFieldValues((prev) => {
        return {
          ...prev,
          [field]: value,
        };
      });
    },
    [setFieldValues, formIsDirty, setFormIsDirty]
  );

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <FormRoot formLess={formLess} marginBottom={marginBottom} width={width}>
      <div className="mb-10 flex flex-col gap-y-5">
        {title ? <h3 className="text-black text-instill-h3">{title}</h3> : null}
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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            updateFieldValues("id", event.target.value)
          }
        />
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
        />
        <BasicSingleSelect
          id="destination-definition"
          key="definition"
          label="Data type"
          error={
            fieldErrors ? (fieldErrors.definition as string) ?? null : null
          }
          value={selectedDestinationOption}
          options={destinationOptions}
          onChange={(option) => {
            setFieldErrors(null);
            setSelectedDestinationOption(option);
            setSelectedDestinationDefinition(
              destinationDefinitions.isSuccess
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
          description={`<a href="https://www.instill.tech/docs/destination-connectors/overview">Setup Guide</a>`}
        />
        <AirbyteDestinationFields
          destinationFormTree={destinationFormTree}
          fieldValues={fieldValues}
          setFieldValues={setFieldValues}
          fieldErrors={fieldErrors}
          selectedConditionMap={selectedConditionMap}
          setSelectedConditionMap={setSelectedConditionMap}
          disableAll={false}
          formIsDirty={airbuteFormIsDirty}
          setFormIsDirty={setAirbyteFormIsDirty}
        />
      </div>
      <div className="flex flex-row">
        <BasicProgressMessageBox
          state={messageBoxState}
          setActivate={(activate) =>
            setMessageBoxState((prev) => ({ ...prev, activate }))
          }
          width="w-[25vw]"
          closable={true}
        />
        <SolidButton
          type="button"
          color="primary"
          disabled={selectedDestinationDefinition ? false : true}
          position="ml-auto my-auto"
          onClickHandler={() => submitHandler()}
        >
          Set up
        </SolidButton>
      </div>
    </FormRoot>
  );
};
