import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  BasicProgressMessageBox,
  BasicSingleSelect,
  BasicTextArea,
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
  AirbyteFieldValues,
  AirbyteFieldErrors,
  SelectedItemMap,
  useBuildAirbyteYup,
} from "@/lib/airbytes";
import { AirbyteDestinationFields } from "@/lib/airbytes/components";
import { ValidationError } from "yup";
import { sendAmplitudeData } from "@/lib/amplitude";

type FieldValues = AirbyteFieldValues;

type FieldErrors = AirbyteFieldErrors;

const CreateDestinationForm: FC = () => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  const [fieldValues, setFieldValues] = useState<Nullable<FieldValues>>(null);
  const [fieldErrors, setFieldErrors] = useState<Nullable<FieldErrors>>(null);

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
    if (!fieldValues || !fieldValues.definition || !destinationOptions) {
      return null;
    }

    return (
      destinationOptions.find((e) => e.value === fieldValues.definition) || null
    );
  }, [fieldValues?.definition, destinationOptions]);

  const selectedDestinationDefinition = useMemo(() => {
    if (
      !destinationDefinitions.isSuccess ||
      !fieldValues ||
      !fieldValues.definition
    ) {
      return null;
    }

    return (
      destinationDefinitions.data.find(
        (e) => e.name === fieldValues.definition
      ) ?? null
    );
  }, [destinationDefinitions.isSuccess, fieldValues?.definition]);

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
      id: yup.string().required(),
      configuration: airbyteYup,
    });
  }, [airbyteYup]);

  const submitHandler = useCallback(async () => {
    if (!fieldValues || !airbyteYup || !formYup) {
      return;
    }

    console.log(fieldValues);

    try {
      formYup.validateSync(fieldValues, { abortEarly: false });
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors = {} as FieldErrors;
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

    const { id, definition, configuration, ...dotNotationConfiguration } =
      fieldValues;

    /**
     * We need to extract data from tunnel_method_tunnel_key: "hi" to tunnel_key: "hi"
     */

    const finalConfiguration: AirbyteFieldValues = {};

    Object.entries(dotNotationConfiguration).forEach(([k, v]) => {
      const pathList = k.split(".");
      finalConfiguration[pathList[pathList.length - 1]] = v;
    });

    const payload: CreateDestinationPayload = {
      id: fieldValues.id as string,
      destination_connector_definition: `destination-connector-definitions/${
        fieldValues.definition as string
      }`,
      connector: {
        description: fieldValues.description as string,
        configuration: JSON.stringify(finalConfiguration),
      },
    };

    console.log(payload);

    setIsCreatingDestination(true);

    createDestination.mutate(payload, {
      onSuccess: () => {
        setIsCreatingDestination(false);
        if (amplitudeIsInit) {
          sendAmplitudeData("create_destination", {
            type: "critical_action",
            process: "destination",
          });
        }
        router.push("/destinations");
      },
      onError: (error) => {
        if (error instanceof Error) {
          setCreateDestinationError(error.message);
          setIsCreatingDestination(false);
        } else {
          setCreateDestinationError(
            "Something went wrong when deploying model"
          );
          setIsCreatingDestination(false);
        }
      },
    });
  }, [amplitudeIsInit, router, createDestination, airbyteYup]);

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
          additionalMessageOnLabel={null}
          description="Pick a name to help you identify this destination in Instill"
          disabled={false}
          readOnly={false}
          required={true}
          placeholder=""
          type="text"
          autoComplete="off"
          value={fieldValues ? (fieldValues.id as string) ?? null : null}
          error={fieldErrors ? (fieldErrors.id as string) ?? null : null}
          onChangeInput={(id, value) => updateFieldValues(id, value)}
        />
        <BasicTextArea
          id="description"
          label="Description"
          key="description"
          additionalMessageOnLabel={null}
          description="Fill with a short description of your data destination"
          disabled={false}
          readOnly={false}
          required={true}
          placeholder=""
          autoComplete="off"
          enableCounter={false}
          counterWordLimit={0}
          error={
            fieldErrors ? (fieldErrors.description as string) ?? null : null
          }
          value={
            fieldValues ? (fieldValues.description as string) ?? null : null
          }
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
          error={
            fieldErrors ? (fieldErrors.definition as string) ?? null : null
          }
          value={selectedDestinationOption}
          options={destinationOptions}
          onChangeInput={(id, option) => {
            setFieldErrors(null);
            setFieldValues((prev) => ({
              id: prev?.id ?? null,
              definition: option?.value ?? null,
            }));
          }}
        />
        <AirbyteDestinationFields
          selectedDestinationDefinition={selectedDestinationDefinition}
          fieldValues={fieldValues}
          setFieldValues={setFieldValues}
          fieldErrors={fieldErrors}
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
