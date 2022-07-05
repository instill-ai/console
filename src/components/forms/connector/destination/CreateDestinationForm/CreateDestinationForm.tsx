import { FC, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  BasicProgressMessageBox,
  BasicSingleSelect,
  BasicTextField,
  SingleSelectOption,
} from "@instill-ai/design-system";

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
  useBuildYup,
} from "@/lib/airbytes";
import { AirbyteDestinationFields } from "@/lib/airbytes/components";

export type CreateDestinationFormValues = AirbyteFormValues;
export type CreateDestinationFormErrors = AirbyteFormErrors;

const CreateDestinationForm: FC = () => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [createDestinationValues, setCreateDestinationFormValues] =
    useState<CreateDestinationFormValues>({
      id: null,
      definition: null,
    });
  const [createDestinationErrors, setCreateDestinationErrors] =
    useState<CreateDestinationFormErrors>({
      id: null,
      definition: null,
    });

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
    if (!createDestinationValues?.definition || !destinationOptions) {
      return null;
    }

    return (
      destinationOptions.find(
        (e) => e.value === createDestinationValues.definition
      ) || null
    );
  }, [createDestinationValues?.definition, destinationOptions]);

  const selectedDestinationDefinition = useMemo(() => {
    if (!destinationDefinitions.isSuccess || !createDestinationValues) {
      return null;
    }

    return (
      destinationDefinitions.data.find(
        (e) => e.name === createDestinationValues.definition
      ) ?? null
    );
  }, [destinationDefinitions.isSuccess, createDestinationValues?.definition]);

  // ###################################################################
  // #                                                                 #
  // # 2 - handle state when create destination                        #
  // #                                                                 #
  // ###################################################################

  const [createDestinationError, setCreateDestinationError] =
    useState<Nullable<string>>(null);
  const [isCreatingDestination, setIsCreatingDestination] = useState(false);

  const createDestination = useCreateDestination();

  const validateSchema = useBuildYup(
    selectedDestinationDefinition?.connector_definition.spec
      .connection_specification ?? null,
    null
  );

  const submitHandler = useCallback(async () => {
    if (
      !createDestinationValues.id ||
      !createDestinationValues.definition ||
      !validateSchema
    ) {
      return;
    }

    console.log(createDestinationValues, validateSchema);

    try {
      validateSchema.validateSync(createDestinationValues);
    } catch (err) {
      console.log(err);
      return;
    }

    console.log("pass");

    const { id, definition, description, ...configuration } =
      createDestinationValues;

    const payload: CreateDestinationPayload = {
      id: createDestinationValues.id as string,
      destination_connector_definition: `destination-connector-definitions/${createDestinationValues.definition}`,
      connector: {
        description: createDestinationValues.description as string,
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
    setCreateDestinationFormValues((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  return (
    <FormBase marginBottom={null} gapY="gap-y-5" padding={null}>
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
        value={(createDestinationValues?.id as string) ?? null}
        error={null}
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
        error={null}
        value={selectedDestinationOption}
        options={destinationOptions}
        onChangeInput={(id, option) => updateFieldValues(id, option?.value)}
      />
      <AirbyteDestinationFields
        selectedDestinationDefinition={selectedDestinationDefinition}
        fieldValues={createDestinationValues}
        setFieldValues={setCreateDestinationFormValues}
        fieldErrors={createDestinationErrors}
      />
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
