import { FC, useEffect, useCallback, useState } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";
import {
  BasicProgressMessageBox,
  SingleSelectOption,
} from "@instill-ai/design-system";

import { SingleSelect } from "../../formik/FormikField";
import { FormBase } from "@/components/formik";
import { ConnectorIcon, PrimaryButton } from "@/components/ui";
import { CreateDestinationPayload } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useCreateDestination, useDestinations } from "@/services/connector";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

export type CreateDestinationFormValues = {
  id: string;
  definition: string;
};

const CreateDestinationForm: FC = () => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the destination definition                       #
  // #                                                                 #
  // ###################################################################
  //
  // A user can only have a http destination and a grpc destination

  const [
    syncDestinationDefinitionOptions,
    setSyncDestinationDefinitionOptions,
  ] = useState<SingleSelectOption[]>([]);
  const [
    selectedSyncDestinationDefinitionOption,
    setSelectedSyncDestinationDefinitionOption,
  ] = useState<Nullable<SingleSelectOption>>(null);

  const destinations = useDestinations();

  useEffect(() => {
    setSyncDestinationDefinitionOptions([
      {
        label: "gRPC",
        value: "destination-grpc",
        startIcon: (
          <ConnectorIcon
            iconName="grpc.svg"
            iconColor="fill-instillGrey90"
            iconHeight="h-[30px]"
            iconWidth="w-[30px]"
            iconPosition="my-auto"
          />
        ),
      },
      {
        label: "HTTP",
        value: "destination-http",
        startIcon: (
          <ConnectorIcon
            iconName="http.svg"
            iconColor="fill-instillGrey90"
            iconHeight="h-[30px]"
            iconWidth="w-[30px]"
            iconPosition="my-auto"
          />
        ),
      },
    ]);
  }, []);

  const destinationDefinitionOnChange = useCallback(
    (option: SingleSelectOption) => {
      setSelectedSyncDestinationDefinitionOption(option);
    },
    []
  );

  // ###################################################################
  // #                                                                 #
  // # 2 - handle state when create destination                        #
  // #                                                                 #
  // ###################################################################

  const [createDestinationError, setCreateDestinationError] =
    useState<Nullable<string>>(null);
  const [isCreatingDestination, setIsCreatingDestination] = useState(false);

  const createDestination = useCreateDestination();

  const validateForm = useCallback(
    (values) => {
      const error: Partial<CreateDestinationFormValues> = {};

      if (!values.destinationDefinition) {
        error.definition = "Required";
      }

      if (
        destinations.data?.find((e) => e.id === values.destinationDefinition)
      ) {
        error.definition =
          "You could only create one http and one grpc destination. Check the setup guide for more information.";
      }

      return error;
    },
    [destinations.data]
  );

  const onSubmitHandler = useCallback(
    (values) => {
      if (!values.destinationDefinition || !destinations.isSuccess) return;

      const payload: CreateDestinationPayload = {
        id: values.destinationDefinition,
        destination_connector_definition: `destination-connector-definitions/${values.destinationDefinition}`,
        connector: {
          configuration: "{}",
        },
      };

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
    },
    [amplitudeIsInit, router, createDestination, destinations.isSuccess]
  );

  return (
    <Formik
      initialValues={{ id: null, destinationDefinition: null }}
      validate={validateForm}
      onSubmit={onSubmitHandler}
    >
      {(formik) => {
        return (
          <FormBase marginBottom={null} gapY="gap-y-5" padding={null}>
            {/* <TextField
              name="id"
              label="Name"
              description="Pick a name to help you identify this destination in Instill"
              disabled={allSyncDestinationCreated ? true : false}
              readOnly={false}
              required={true}
              placeholder=""
              type="text"
              autoComplete="off"
              value={formik.values.id || ""}
            /> */}
            <SingleSelect
              id="destinationDefinition"
              name="destinationDefinition"
              label="Destination type"
              options={syncDestinationDefinitionOptions}
              value={selectedSyncDestinationDefinitionOption}
              additionalOnChangeCb={destinationDefinitionOnChange}
              error={formik.errors.destinationDefinition || null}
              disabled={false}
              readOnly={false}
              required={true}
              description="Setup Guide"
              menuPlacement="auto"
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
                disabled={formik.isValid ? false : true}
                position="ml-auto my-auto"
                onClickHandler={null}
              >
                Set up destination
              </PrimaryButton>
            </div>
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default CreateDestinationForm;
