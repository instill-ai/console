import * as React from "react";
import * as yup from "yup";

import {
  AirbyteDestinationFields,
  AirbyteFieldErrors,
  AirbyteFieldValues,
  ConnectorDefinition,
  ConnectorResourceType,
  ConnectorResourceWithDefinition,
  CreateUserConnectorResourcePayload,
  Nullable,
  dot,
  getInstillApiErrorMessage,
  useAirbyteFieldValues,
  useAirbyteFormTree,
  useAirbyteSelectedConditionMap,
  useBuildAirbyteYup,
  useCreateUserConnectorResource,
  useUser,
  validateResourceId,
} from "@instill-ai/toolkit";
import { isAxiosError } from "axios";
import {
  BasicTextField,
  Button,
  FormRoot,
  useToast,
} from "@instill-ai/design-system";

export type DataResourceFormProps = {
  disabledAll?: boolean;
  dataResource: Nullable<ConnectorResourceWithDefinition>;
  dataDefinition: ConnectorDefinition;
  setNewConnectorDefinition: React.Dispatch<
    React.SetStateAction<Nullable<ConnectorDefinition>>
  >;
  setNewConnectorType: React.Dispatch<
    React.SetStateAction<Nullable<ConnectorResourceType>>
  >;
  onSelectConnectorResource: (
    connectorResource: ConnectorResourceWithDefinition
  ) => void;
  accessToken: Nullable<string>;
};

export const DataResourceForm = (props: DataResourceFormProps) => {
  const {
    disabledAll,
    dataResource,
    dataDefinition,
    setNewConnectorDefinition,
    setNewConnectorType,
    onSelectConnectorResource,
    accessToken,
  } = props;

  const { toast } = useToast();

  const user = useUser({
    enabled: true,
    accessToken: null,
  });

  const [airbyteFormIsDirty, setAirbyteFormIsDirty] = React.useState(false);

  const [fieldErrors, setFieldErrors] =
    React.useState<Nullable<AirbyteFieldErrors>>(null);

  const destinationFormTree = useAirbyteFormTree(dataDefinition);

  const initialValues: Nullable<AirbyteFieldValues> = dataResource
    ? {
        configuration: dataResource.configuration,
        ...dot.toDot(dataResource.configuration),
        description: dataResource.description || undefined,
      }
    : null;

  const [selectedConditionMap, setSelectedConditionMap] =
    useAirbyteSelectedConditionMap(destinationFormTree, initialValues);

  const { fieldValues, setFieldValues } = useAirbyteFieldValues(
    destinationFormTree,
    initialValues
  );

  const updateFieldValues = React.useCallback(
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
  const airbyteYup = useBuildAirbyteYup(
    dataDefinition?.spec.resource_specification ?? null,
    selectedConditionMap,
    null
  );

  const formYup = React.useMemo(() => {
    if (!airbyteYup) return null;

    return yup.object({
      id: yup.string().nullable().notRequired(),
      configuration: airbyteYup,
    });
  }, [airbyteYup]);

  const createUserDataConnectorResource = useCreateUserConnectorResource();

  const onSubmit = React.useCallback(async () => {
    if (!fieldValues || !formYup || !user.isSuccess) {
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

    const payload: CreateUserConnectorResourcePayload = {
      id: `connector-resources/${fieldValues.id}` as string,
      connector_definition_name: dataDefinition.name,
      description: fieldValues.description as string,
      configuration: stripValues.configuration,
    };

    createUserDataConnectorResource.mutate(
      { userName: user.data.name, payload, accessToken },
      {
        onSuccess: ({ connectorResource }) => {
          onSelectConnectorResource({
            ...connectorResource,
            connector_definition: dataDefinition,
          });

          toast({
            title: "Successfully create data resource",
            variant: "alert-success",
            size: "small",
          });
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when create the data resource",
              variant: "alert-error",
              size: "large",
              description: getInstillApiErrorMessage(error),
            });
          } else {
            toast({
              title: "Something went wrong when create the data resource",
              variant: "alert-error",
              size: "large",
              description: "Please try again later",
            });
          }
        },
      }
    );
  }, [
    createUserDataConnectorResource,
    formYup,
    fieldValues,
    dataDefinition,
    accessToken,
    onSelectConnectorResource,
    toast,
  ]);

  return (
    <FormRoot width="w-full">
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
          disabled={disabledAll ? disabledAll : false}
          value={fieldValues ? (fieldValues.id as string) ?? null : null}
          error={fieldErrors ? (fieldErrors.id as string) ?? null : null}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            updateFieldValues("id", event.target.value)
          }
        />
        <AirbyteDestinationFields
          destinationFormTree={destinationFormTree}
          fieldValues={fieldValues}
          setFieldValues={setFieldValues}
          fieldErrors={fieldErrors}
          selectedConditionMap={selectedConditionMap}
          setSelectedConditionMap={setSelectedConditionMap}
          disableAll={disabledAll ? disabledAll : false}
          formIsDirty={airbyteFormIsDirty}
          setFormIsDirty={setAirbyteFormIsDirty}
        />
      </div>
      <div className="flex w-full flex-row gap-x-4">
        <Button
          type="button"
          variant="secondaryGrey"
          size="lg"
          className="!w-full !flex-1"
          onClick={() => {
            setNewConnectorDefinition(null);
            setNewConnectorType(null);
          }}
        >
          Back
        </Button>
        <Button
          variant="secondaryColour"
          disabled={disabledAll ? disabledAll : false}
          size="lg"
          className="!w-full !flex-1"
          onClick={() => onSubmit()}
          type="button"
        >
          Save
        </Button>
      </div>
    </FormRoot>
  );
};
