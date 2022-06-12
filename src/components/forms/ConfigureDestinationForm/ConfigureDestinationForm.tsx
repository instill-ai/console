import { FC, useState, useEffect, useCallback } from "react";
import {
  BasicProgressMessageBox,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { Formik } from "formik";
import { useRouter } from "next/router";

import { FormBase, SingleSelect } from "@/components/formik";
import { ConnectorIcon, PrimaryButton } from "@/components/ui";
import { DestinationWithDefinition } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { DeleteResourceModal } from "@/components/modals";
import { useDeleteDestination } from "@/services/connector";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

export type ConfigureDestinationFormProps = {
  destination: Nullable<DestinationWithDefinition>;
};

type ConfigureDestinationFormValue = {
  definition: Nullable<string>;
};

const ConfigureDestinationForm: FC<ConfigureDestinationFormProps> = ({
  destination,
}) => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # Initialize the destination definition                           #
  // #                                                                 #
  // ###################################################################

  const [
    syncDestinationDefinitionOptions,
    setSyncDestinationDefinitionOptions,
  ] = useState<SingleSelectOption[]>([]);
  const [
    selectedDestinationDefinitionOption,
    setSelectedDestinationDefinitionOption,
  ] = useState<Nullable<SingleSelectOption>>(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (!destination) return;

    const options = [
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
    ];

    setSyncDestinationDefinitionOptions(options);
    setSelectedDestinationDefinitionOption(
      options.find((e) => e.value === destination.id) || null
    );
  }, [destination]);

  const destinationDefinitionOnChangeCb = useCallback(
    (option: SingleSelectOption) => {
      setSelectedDestinationDefinitionOption(
        syncDestinationDefinitionOptions.find(
          (e) => e.value === option.value
        ) || null
      );
    },
    [syncDestinationDefinitionOptions]
  );

  // ###################################################################
  // #                                                                 #
  // # Handle delete source                                            #
  // #                                                                 #
  // ###################################################################

  const [deleteDestinationModalIsOpen, setDeleteDestinationModalIsOpen] =
    useState(false);
  const [isDeletingDestination, setIsDeletingDestination] = useState(false);
  const [deleteDestinationError, setDeleteDestinationError] =
    useState<Nullable<string>>(null);

  const deleteDestination = useDeleteDestination();

  const handleDeleteDestination = useCallback(() => {
    if (!destination) return;

    setIsDeletingDestination(true);
    deleteDestination.mutate(destination.name, {
      onSuccess: () => {
        setIsDeletingDestination(false);
        if (amplitudeIsInit) {
          sendAmplitudeData("delete_destination", {
            type: "critical_action",
            process: "destination",
          });
        }
        router.push("/destinations");
      },
      onError: (error) => {
        if (error instanceof Error) {
          setDeleteDestinationError(error.message);
          setIsDeletingDestination(false);
        } else {
          setDeleteDestinationError(
            "Something went wrong when deleting destination"
          );
          setIsDeletingDestination(false);
        }
      },
    });
    setDeleteDestinationModalIsOpen(false);
  }, [destination]);

  return (
    <>
      <Formik
        initialValues={
          {
            definition: destination ? destination.id : null,
          } as ConfigureDestinationFormValue
        }
        onSubmit={() => {
          if (!canEdit) {
            setCanEdit(true);
            return;
          }
        }}
      >
        {(formik) => {
          return (
            <FormBase marginBottom={null} gapY={null} padding={null}>
              <div className="mb-10 flex flex-col gap-y-5">
                <SingleSelect
                  name="definition"
                  label="Data destination"
                  instanceId="destination-definition"
                  value={selectedDestinationDefinitionOption}
                  options={syncDestinationDefinitionOptions}
                  additionalOnChangeCb={destinationDefinitionOnChangeCb}
                  error={formik.errors.definition || null}
                  disabled={true}
                  readOnly={false}
                  required={true}
                  description={"Setup Guide"}
                  menuPlacement="auto"
                />
              </div>
              <div className="mb-10 flex flex-row">
                <PrimaryButton
                  type="button"
                  disabled={true}
                  position="mr-auto my-auto"
                  onClickHandler={() => {
                    setDeleteDestinationModalIsOpen(true);
                  }}
                >
                  Delete
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  disabled={true}
                  position="ml-auto my-auto"
                >
                  {canEdit ? "Done" : "Edit"}
                </PrimaryButton>
              </div>
              <div className="flex">
                {deleteDestinationError ? (
                  <BasicProgressMessageBox width="w-[25vw]" status="error">
                    {deleteDestinationError}
                  </BasicProgressMessageBox>
                ) : isDeletingDestination ? (
                  <BasicProgressMessageBox
                    width="w-[25vw]"
                    status="progressing"
                  >
                    Deleting destination...
                  </BasicProgressMessageBox>
                ) : null}
              </div>
            </FormBase>
          );
        }}
      </Formik>
      <DeleteResourceModal
        modalIsOpen={deleteDestinationModalIsOpen}
        setModalIsOpen={setDeleteDestinationModalIsOpen}
        handleDeleteResource={handleDeleteDestination}
        resource={destination}
      />
    </>
  );
};

export default ConfigureDestinationForm;
