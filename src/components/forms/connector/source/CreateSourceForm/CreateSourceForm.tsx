import { FC, useEffect, useCallback, useState } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";

import { SingleSelect } from "../../../../formik/FormikField";
import { FormikFormBase } from "@/components/formik";
import { ConnectorIcon, PrimaryButton } from "@/components/ui";
import {
  BasicProgressMessageBox,
  ProgressMessageBoxState,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { useCreateSource, useSources } from "@/services/connector";
import { CreateSourcePayload } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

export type CreateSourceFormValues = {
  id: Nullable<string>;
  definition: Nullable<string>;
};

const CreateSourceForm: FC = () => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the source definition                            #
  // #                                                                 #
  // ###################################################################
  //
  // A user can only have a http source and a grpc source

  const [syncSourceDefinitionOptions, setSyncSourceDefinitionOptions] =
    useState<SingleSelectOption[]>([]);
  const [
    selectedSyncSourceDefinitionOption,
    setSelectedSyncSourceDefinitionOption,
  ] = useState<Nullable<SingleSelectOption>>(null);

  const sources = useSources();
  const createSource = useCreateSource();

  useEffect(() => {
    if (!sources.isSuccess) return;

    setSyncSourceDefinitionOptions([
      {
        label: "gRPC",
        value: "source-grpc",
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
        value: "source-http",
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
  }, [sources.isSuccess]);

  const sourceDefinitionOnChange = useCallback((option: SingleSelectOption) => {
    setSelectedSyncSourceDefinitionOption(option);
  }, []);

  // ###################################################################
  // #                                                                 #
  // # 2 - handle create source                                        #
  // #                                                                 #
  // ###################################################################

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const validateForm = useCallback((values: CreateSourceFormValues) => {
    const error: Partial<CreateSourceFormValues> = {};

    if (!values.definition) {
      error.definition = "Required";
    }

    if (sources.data?.find((e) => e.id === values.definition)) {
      error.definition =
        "You could only create one http and one grpc source. Check the setup guide for more information.";
    }

    return error;
  }, []);

  const handleSubmit = useCallback((values: CreateSourceFormValues) => {
    if (!values.definition) return;

    const payload: CreateSourcePayload = {
      id: values.definition,
      source_connector_definition: `source-connector-definitions/${values.definition}`,
      connector: {
        configuration: "{}",
      },
    };

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Creating...",
    }));

    createSource.mutate(payload, {
      onSuccess: () => {
        setMessageBoxState(() => ({
          activate: true,
          status: "progressing",
          description: null,
          message: "Create succeeded",
        }));
        if (amplitudeIsInit) {
          sendAmplitudeData("create_source", {
            type: "critical_action",
            process: "source",
          });
        }
        router.push("/sources");
      },
      onError: (error) => {
        if (error instanceof Error) {
          setMessageBoxState(() => ({
            activate: true,
            status: "error",
            description: null,
            message: error.message,
          }));
        } else {
          setMessageBoxState(() => ({
            activate: true,
            status: "error",
            description: null,
            message: "Something went wrong when creating the source",
          }));
        }
      },
    });
  }, []);

  return (
    <Formik
      initialValues={{ id: null, definition: null } as CreateSourceFormValues}
      validate={validateForm}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        return (
          <FormikFormBase marginBottom={null} gapY="gap-y-5" padding={null}>
            <SingleSelect
              id="sourceDefinition"
              name="sourceDefinition"
              label="Source type"
              additionalMessageOnLabel={null}
              options={syncSourceDefinitionOptions}
              value={selectedSyncSourceDefinitionOption}
              additionalOnChangeCb={sourceDefinitionOnChange}
              error={formik.errors.definition || null}
              disabled={false}
              readOnly={false}
              required={true}
              description="Setup Guide"
              menuPlacement="auto"
            />
            <div className="flex flex-row">
              <BasicProgressMessageBox
                state={messageBoxState}
                setState={setMessageBoxState}
                width="w-[25vw]"
                closable={true}
              />
              <PrimaryButton
                disabled={formik.isValid ? false : true}
                position="ml-auto my-auto"
                type="submit"
                onClickHandler={null}
              >
                Set up source
              </PrimaryButton>
            </div>
          </FormikFormBase>
        );
      }}
    </Formik>
  );
};

export default CreateSourceForm;
