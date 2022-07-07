import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  BasicProgressMessageBox,
  BasicSingleSelect,
  BasicTextField,
  SingleSelectOption,
} from "@instill-ai/design-system";
import * as yup from "yup";

import { PrimaryButton } from "@/components/ui";
import { CreateDestinationPayload } from "@/lib/instill";
import { Nullable } from "@/types/general";
import {
  useCreateDestination,
  useDestinationDefinitions,
} from "@/services/connector";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { FormBase } from "@/components/forms/commons";
import {
  AirbyteFormErrors,
  AirbyteFormValues,
  SelectedItemMap,
  useBuildYup,
} from "@/lib/airbytes";
import { AirbyteDestinationFields } from "@/lib/airbytes/components";
import { ValidationError } from "yup";

export type CreateDestinationFieldValues = AirbyteFormValues;
export type CreateDestinationFieldErrors = AirbyteFormErrors;

const initialCreateDestinationFieldValues = {
  id: null,
  definition: null,
};

const initialCreateDestinationFieldErrors = {
  id: null,
  definition: null,
};

const CreateDestinationForm: FC = () => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [createDestinationFieldValues, setCreateDestinationFieldValues] =
    useState<CreateDestinationFieldValues>(initialCreateDestinationFieldValues);
  const [createDestinationFieldErrors, setCreateDestinationFieldErrors] =
    useState<CreateDestinationFieldErrors>(initialCreateDestinationFieldErrors);

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
        label: definition.id,
        value: definition.name,
      });
    }

    return options;
  }, [destinationDefinitions.isSuccess, destinationDefinitions.data]);

  const selectedDestinationOption = useMemo(() => {
    if (!createDestinationFieldValues?.definition || !destinationOptions) {
      return null;
    }

    return (
      destinationOptions.find(
        (e) => e.value === createDestinationFieldValues.definition
      ) || null
    );
  }, [createDestinationFieldValues?.definition, destinationOptions]);

  const selectedDestinationDefinition = useMemo(() => {
    if (!destinationDefinitions.isSuccess || !createDestinationFieldValues) {
      return null;
    }

    return (
      destinationDefinitions.data.find(
        (e) => e.name === createDestinationFieldValues.definition
      ) ?? null
    );
  }, [
    destinationDefinitions.isSuccess,
    createDestinationFieldValues?.definition,
  ]);

  // ###################################################################
  // #                                                                 #
  // # 2 - handle state when create destination                        #
  // #                                                                 #
  // ###################################################################

  const [createDestinationError, setCreateDestinationError] =
    useState<Nullable<string>>(null);
  const [isCreatingDestination, setIsCreatingDestination] = useState(false);

  const [selectedConditionMap, setSelectedConditionMap] =
    useState<Nullable<SelectedItemMap>>(null);

  const createDestination = useCreateDestination();

  const validateSchema = useBuildYup(
    selectedDestinationDefinition?.connector_definition.spec
      .connection_specification ?? null,
    selectedConditionMap,
    null
  );

  useEffect(() => {
    console.log(
      "errors",
      createDestinationFieldErrors,
      createDestinationFieldValues
    );
  }, [createDestinationFieldErrors]);

  const submitHandler = useCallback(async () => {
    if (!validateSchema) {
      return;
    }

    try {
      validateSchema.validateSync(createDestinationFieldValues.configuration, {
        abortEarly: false,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Record<string, string> = {};
        for (const err of error.inner) {
          if (err.path) {
            const message = err.message.replace(err.path, "This field");
            errors[err.path] = message;
          }
        }
        setCreateDestinationFieldErrors(errors);
      }

      return;
    }

    console.log("pass");

    const { id, definition, description, ...configuration } =
      createDestinationFieldValues;

    const payload: CreateDestinationPayload = {
      id: createDestinationFieldValues.id as string,
      destination_connector_definition: `destination-connector-definitions/${createDestinationFieldValues.definition}`,
      connector: {
        description: createDestinationFieldValues.description as string,
        configuration: JSON.stringify(configuration),
      },
    };

    // setIsCreatingDestination(true);

    // createDestination.mutate(payload, {
    //   onSuccess: () => {
    //     setIsCreatingDestination(false);
    //     if (amplitudeIsInit) {
    //       sendAmplitudeData("create_destination", {
    //         type: "critical_action",
    //         process: "destination",
    //       });
    //     }
    //     router.push("/destinations");
    //   },
    //   onError: (error) => {
    //     if (error instanceof Error) {
    //       setCreateDestinationError(error.message);
    //       setIsCreatingDestination(false);
    //     } else {
    //       setCreateDestinationError(
    //         "Something went wrong when deploying model"
    //       );
    //       setIsCreatingDestination(false);
    //     }
    //   },
    // });
  }, [amplitudeIsInit, router, createDestination, validateSchema]);

  const updateFieldValues = useCallback((field: string, value: any) => {
    setCreateDestinationFieldValues((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  return (
    <FormBase marginBottom={null} padding={null} noValidate={true}>
      <div className="flex flex-col gap-y-5">
        <BasicTextField
          id="id"
          label="ID"
          key="id"
          additionalMessageOnLabel={null}
          description="Pick a name to help you identify this destination in Instill"
          disabled={false}
          readOnly={false}
          required={true}
          placeholder=""
          type="text"
          autoComplete="off"
          value={(createDestinationFieldValues?.id as string) ?? null}
          error={createDestinationFieldErrors.id ?? null}
          onChangeInput={(id, value) => updateFieldValues(id, value)}
        />
        <BasicSingleSelect
          id="definition"
          key="definition"
          instanceId="definition"
          menuPlacement="auto"
          label="Destination type"
          additionalMessageOnLabel={null}
          description={""}
          disabled={false}
          readOnly={false}
          required={false}
          error={createDestinationFieldErrors.definition ?? null}
          value={selectedDestinationOption}
          options={destinationOptions}
          onChangeInput={(id, option) => {
            setCreateDestinationFieldErrors(
              initialCreateDestinationFieldErrors
            );
            setCreateDestinationFieldValues(
              initialCreateDestinationFieldValues
            );
            updateFieldValues(id, option?.value);
          }}
        />
        <AirbyteDestinationFields
          selectedDestinationDefinition={selectedDestinationDefinition}
          fieldValues={createDestinationFieldValues}
          setFieldValues={setCreateDestinationFieldValues}
          fieldErrors={createDestinationFieldErrors}
          setSelectedConditionMap={setSelectedConditionMap}
        />
      </div>
      <div className="flex flex-row">
        {createDestinationError ? (
          <BasicProgressMessageBox width="w-[216px]" status="error">
            {createDestinationError}
          </BasicProgressMessageBox>
        ) : isCreatingDestination ? (
          <BasicProgressMessageBox width="w-[216px]" status="progressing">
            Updating model...
          </BasicProgressMessageBox>
        ) : null}
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
