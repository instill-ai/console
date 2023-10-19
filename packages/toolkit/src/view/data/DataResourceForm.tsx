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
  ConnectorResourceWithDefinition,
  CreateUserConnectorResourcePayload,
  Nullable,
  UpdateUserConnectorResourcePayload,
  dot,
  getInstillApiErrorMessage,
  useAirbyteFieldValues,
  useAirbyteFormTree,
  useAirbyteSelectedConditionMap,
  useBuildAirbyteYup,
  useCreateUserConnectorResource,
  useUpdateUserConnectorResource,
  validateResourceId,
} from "../../lib";
import {
  recursiveReplaceNullAndEmptyStringWithUndefined,
  recursiveReplaceTargetValue,
} from "../pipeline-builder";
import { AirbyteDestinationFields } from "../airbyte";
import { useRouter } from "next/router";
import { LoadingSpin } from "../../components";

export type DataResourceFormProps = {
  dataResource: Nullable<ConnectorResourceWithDefinition>;
  dataDefinition: ConnectorDefinition;
  accessToken: Nullable<string>;
  disabledAll?: boolean;
  onSubmit?: (connectorResource: ConnectorResourceWithDefinition) => void;
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
  const router = useRouter();
  const { entity } = router.query;

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

  const createData = useCreateUserConnectorResource();
  const updateData = useUpdateUserConnectorResource();

  const handleCreateData = React.useCallback(async () => {
    if (!fieldValues || !formYup || isSaving) {
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

    setIsSaving(true);

    if (!dataResource) {
      const payload: CreateUserConnectorResourcePayload = {
        id: fieldValues.id as string,
        connector_definition_name: dataDefinition.name,
        description: fieldValues.description as string,
        configuration: stripValues.configuration,
      };

      createData.mutate(
        { userName: `users/${entity}`, payload, accessToken },
        {
          onSuccess: ({ connectorResource }) => {
            if (onSubmit) {
              onSubmit({
                ...connectorResource,
                connector_definition: dataDefinition,
              });
            }

            toast({
              title: "Successfully create data resource",
              variant: "alert-success",
              size: "small",
            });

            setIsSaving(false);
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

            setIsSaving(false);
          },
        }
      );
      return;
    }

    const payload: UpdateUserConnectorResourcePayload = {
      connectorResourceName: dataResource.name,
      description: fieldValues.description as string,
      configuration: recursiveReplaceNullAndEmptyStringWithUndefined(
        recursiveReplaceTargetValue(
          stripValues.configuration,
          "*****MASK*****",
          undefined
        )
      ),
    };

    updateData.mutate(
      { payload, accessToken },
      {
        onSuccess: ({ connectorResource }) => {
          if (onSubmit) {
            onSubmit({
              ...connectorResource,
              connector_definition: dataDefinition,
            });
          }
          toast({
            title: "Successfully update ai resource",
            variant: "alert-success",
            size: "small",
          });

          setIsSaving(false);
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when update the ai resource",
              variant: "alert-error",
              size: "large",
              description: getInstillApiErrorMessage(error),
            });
          } else {
            toast({
              title: "Something went wrong when update the ai resource",
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
    entity,
    isSaving,
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
