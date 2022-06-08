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

export type CreateDestinationFormValues = {
  id: string;
  definition: string;
};

const CreateDestinationForm: FC = () => {
  const router = useRouter();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the source definition                            #
  // #                                                                 #
  // ###################################################################
  //
  // A user can only have a http source and a grpc source

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

  return (
    <Formik
      initialValues={{ id: null, definition: null }}
      validate={(values) => {
        const error: Partial<CreateDestinationFormValues> = {};

        if (!values.definition) {
          error.definition = "Required";
        }

        if (destinations.data?.find((e) => e.id === values.definition)) {
          error.definition =
            "You could only create one http and one grpc source. Check the setup guide for more information.";
        }

        return error;
      }}
      onSubmit={(values) => {
        if (!values.definition || !destinations.isSuccess) return;

        const payload: CreateDestinationPayload = {
          id: values.definition,
          destination_connector_definition: `destination-connector-definitions/${values.definition}`,
          connector: {
            configuration: "{}",
          },
        };

        setIsCreatingDestination(true);

        createDestination.mutate(payload, {
          onSuccess: () => {
            router.push("/destinations");
            setIsCreatingDestination(false);
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
      }}
    >
      {(formik) => {
        return (
          <FormBase marginBottom={null} gapY="gap-y-5" padding={null}>
            {/* <TextField
              name="id"
              label="Name"
              description="Pick a name to help you identify this source in Instill"
              disabled={allSyncSourceCreated ? true : false}
              readOnly={false}
              required={true}
              placeholder=""
              type="text"
              autoComplete="off"
              value={formik.values.id || ""}
            /> */}
            <SingleSelect
              name="definition"
              label="Source type"
              instanceId="source-type"
              options={syncDestinationDefinitionOptions}
              value={selectedSyncDestinationDefinitionOption}
              additionalOnChangeCb={destinationDefinitionOnChange}
              error={formik.errors.definition || null}
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
                disabled={formik.isValid ? false : true}
                position="ml-auto my-auto"
                type="submit"
              >
                Set up source
              </PrimaryButton>
            </div>
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default CreateDestinationForm;
