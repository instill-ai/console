import { FC, useState, useEffect, useCallback } from "react";
import {
  BasicProgressMessageBox,
  ProgressMessageBoxState,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { Formik } from "formik";
import { useRouter } from "next/router";

import { FormikFormBase, SingleSelect } from "@/components/formik";
import { ConnectorIcon, PrimaryButton } from "@/components/ui";
import { DestinationWithDefinition } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { DeleteResourceModal } from "@/components/modals";
import { useDeleteDestination } from "@/services/connector";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { AxiosError } from "axios";
import { ErrorDetails } from "@/lib/instill/types";

export type ConfigureDestinationFormProps = {
  destination: Nullable<DestinationWithDefinition>;
};

export type ConfigureDestinationFormValue = {
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

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const deleteDestination = useDeleteDestination();

  const handleDeleteDestination = useCallback(() => {
    if (!destination) return;

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Deleting...",
    }));

    deleteDestination.mutate(destination.name, {
      onSuccess: () => {
        setMessageBoxState(() => ({
          activate: true,
          status: "success",
          description: null,
          message: "Delete succeeded.",
        }));
        if (amplitudeIsInit) {
          sendAmplitudeData("delete_destination", {
            type: "critical_action",
            process: "destination",
          });
        }
        router.push("/destinations");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          setMessageBoxState(() => ({
            activate: true,
            message: `${error.response?.status} - ${error.response?.data.message}`,
            description: (error.response?.data.details as ErrorDetails[])[0]
              .violations[0].description,
            status: "error",
          }));
        } else {
          setMessageBoxState(() => ({
            activate: true,
            status: "error",
            description: null,
            message: "Something went wrong when delete the destination",
          }));
        }
      },
    });
    setDeleteDestinationModalIsOpen(false);
  }, [destination, amplitudeIsInit, router, deleteDestination]);

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
            <FormikFormBase marginBottom={null} gapY={null} padding={null}>
              <div className="mb-10 flex flex-col gap-y-5">
                <SingleSelect
                  id="destinationDefinition"
                  name="definition"
                  label="Data destination"
                  value={selectedDestinationDefinitionOption}
                  options={syncDestinationDefinitionOptions}
                  additionalOnChangeCb={destinationDefinitionOnChangeCb}
                  error={formik.errors.definition || null}
                  disabled={true}
                  required={true}
                  description={"Setup Guide"}
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
                  onClickHandler={null}
                >
                  {canEdit ? "Done" : "Edit"}
                </PrimaryButton>
              </div>
              <div className="flex">
                <BasicProgressMessageBox
                  state={messageBoxState}
                  setState={setMessageBoxState}
                  width="w-[25vw]"
                  closable={true}
                />
              </div>
            </FormikFormBase>
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
