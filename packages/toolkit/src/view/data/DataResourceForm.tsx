import cn from "clsx";
import * as React from "react";
import * as yup from "yup";

import { isAxiosError } from "axios";
import {
  BasicTextField,
  Button,
  FormRoot,
  useToast,
} from "@instill-ai/design-system";
import {
  AirbyteFieldErrors,
  AirbyteFieldValues,
  ConnectorDefinition,
  ConnectorWithDefinition,
  CreateUserConnectorPayload,
  Nullable,
  UpdateUserConnectorPayload,
  dot,
  getInstillApiErrorMessage,
  useAirbyteFieldValues,
  useAirbyteFormTree,
  useAirbyteSelectedConditionMap,
  useBuildAirbyteYup,
  useCreateUserConnector,
  useEntity,
  useUpdateUserConnector,
  validateInstillID,
} from "../../lib";
import { recursiveHelpers } from "../pipeline-builder";
import { AirbyteDestinationFields } from "../airbyte";
import { LoadingSpin } from "../../components";
import { InstillErrors } from "../../constant/errors";

export type DataResourceFormProps = {
  dataResource: Nullable<ConnectorWithDefinition>;
  dataDefinition: ConnectorDefinition;
  accessToken: Nullable<string>;
  disabledAll?: boolean;
  onSubmit?: (connector: ConnectorWithDefinition) => void;
  enableQuery: boolean;
} & BackButtonProps;

type BackButtonProps =
  | {
      enableBackButton: true;
      onBack: () => void;
    }
  | {
      enableBackButton: false;
    };

export const DataResourceForm = (props: DataResourceFormProps) => {
  const {
    disabledAll,
    dataResource,
    dataDefinition,
    onSubmit,
    accessToken,
    enableBackButton,
  } = props;

  const { toast } = useToast();

  const entityObject = useEntity();

  const [isSaving, setIsSaving] = React.useState(false);

  const [airbyteFormIsDirty, setAirbyteFormIsDirty] = React.useState(false);

  const [fieldErrors, setFieldErrors] =
    React.useState<Nullable<AirbyteFieldErrors>>(null);

  const destinationFormTree = useAirbyteFormTree(dataDefinition);

  const initialValues: Nullable<AirbyteFieldValues> = dataResource
    ? {
        id: dataResource.id,
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

  const createData = useCreateUserConnector();
  const updateData = useUpdateUserConnector();

  const handleCreateData = React.useCallback(async () => {
    if (!fieldValues || !formYup || isSaving || !entityObject.isSuccess) {
      return;
    }

    let stripValues = {} as { configuration: AirbyteFieldValues };

    // We don't validate the rest of the field if the ID is incorrect
    if (!validateInstillID(fieldValues.id as string)) {
      setFieldErrors((prev) => ({
        ...prev,
        id: InstillErrors.IDInvalidError,
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
    setIsSaving(true);

    if (!dataResource) {
      const payload: CreateUserConnectorPayload = {
        id: fieldValues.id as string,
        connector_definition_name: dataDefinition.name,
        description: fieldValues.description as string,
        configuration: stripValues.configuration,
      };

      createData.mutate(
        { entityName: entityObject.entityName, payload, accessToken },
        {
          onSuccess: ({ connector }) => {
            if (onSubmit) {
              onSubmit({
                ...connector,
                connector_definition: dataDefinition,
              });
            }

            toast({
              title: "Successfully create data connector",
              variant: "alert-success",
              size: "small",
            });

            setIsSaving(false);
          },
          onError: (error) => {
            if (isAxiosError(error)) {
              toast({
                title: "Something went wrong when create the data connector",
                variant: "alert-error",
                size: "large",
                description: getInstillApiErrorMessage(error),
              });
            } else {
              toast({
                title: "Something went wrong when create the data connector",
                variant: "alert-error",
                size: "large",
                description: "Please try again later",
              });
            }

            setIsSaving(false);
          },
        }
      );
      return;
    }

    const payload: UpdateUserConnectorPayload = {
      connectorName: dataResource.name,
      description: fieldValues.description as string,
      configuration: recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
        recursiveHelpers.replaceTargetValue(
          stripValues.configuration,
          "*****MASK*****",
          undefined
        )
      ),
    };

    updateData.mutate(
      { payload, accessToken },
      {
        onSuccess: ({ connector }) => {
          if (onSubmit) {
            onSubmit({
              ...connector,
              connector_definition: dataDefinition,
            });
          }
          toast({
            title: "Successfully update ai connector",
            variant: "alert-success",
            size: "small",
          });

          setIsSaving(false);
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when update the ai connector",
              variant: "alert-error",
              size: "large",
              description: getInstillApiErrorMessage(error),
            });
          } else {
            toast({
              title: "Something went wrong when update the ai connector",
              variant: "alert-error",
              size: "large",
              description: "Please try again later",
            });
          }

          setIsSaving(false);
        },
      }
    );
  }, [
    createData,
    formYup,
    fieldValues,
    dataDefinition,
    accessToken,
    onSubmit,
    toast,
    dataResource,
    updateData,
    isSaving,
    entityObject.isSuccess,
    entityObject.entityName,
  ]);

  return (
    <FormRoot width="w-full">
      <div className="mb-8 flex flex-col gap-y-5">
        <BasicTextField
          id="destination-id"
          label="ID"
          key="id"
          description="Pick a ID to help you identify this resource. It should be lowercase without any space or special character besides the underscore or hyphen, it can not start with number or hyphen, and should be less than 32 characters."
          required={true}
          disabled={dataResource ? true : disabledAll ? disabledAll : false}
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
        {enableBackButton ? (
          <Button
            type="button"
            variant="secondaryGrey"
            size="lg"
            className="!w-full !flex-1 gap-x-2"
            onClick={() => {
              props.onBack();
            }}
          >
            Back
          </Button>
        ) : null}
        <Button
          variant="primary"
          disabled={disabledAll ? disabledAll : isSaving}
          size="lg"
          className={cn(enableBackButton ? "!w-full !flex-1" : "ml-auto")}
          onClick={() => handleCreateData()}
          type="button"
        >
          {isSaving ? <LoadingSpin /> : "Save"}
        </Button>
      </div>
    </FormRoot>
  );
};
