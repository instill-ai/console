import { FC, useEffect, useCallback, useState } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";
import {
  BasicProgressMessageBox,
  SingleSelectOption,
} from "@instill-ai/design-system";

import { TextField } from "../../../../formik/FormikField";
import { FormikFormBase } from "@/components/formik";
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

  // ###################################################################
  // #                                                                 #
  // # 2 - handle state when create destination                        #
  // #                                                                 #
  // ###################################################################

  const [createDestinationError, setCreateDestinationError] =
    useState<Nullable<string>>(null);
  const [isCreatingDestination, setIsCreatingDestination] = useState(false);

  const createDestination = useCreateDestination();

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
    <FormikFormBase marginBottom={null} gapY="gap-y-5" padding={null}>
      <TextField
        id="id"
        name="id"
        label="ID"
        additionalMessageOnLabel={null}
        description="Pick a name to help you identify this destination in Instill"
        disabled={false}
        readOnly={false}
        required={true}
        placeholder=""
        type="text"
        autoComplete="off"
        value={formik.values.id || ""}
        error={null}
        additionalOnChangeCb={null}
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
    </FormikFormBase>
  );
};

export default CreateDestinationForm;
