import { FC, useEffect, useCallback, useState } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";

import { SingleSelect } from "../../formik/FormikField";
import { PrimaryButton } from "@/components/ui/Buttons";
import { FormBase } from "@/components/formik";
import { ConnectorIcon } from "@/components/ui";
import {
  BasicProgressMessageBox,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { useCreateSource, useSources } from "@/services/connector";
import { CreateSourcePayload } from "@/lib/instill";
import { Nullable } from "@/types/general";

export type CreateSourceFormValues = {
  id: string;
  definition: string;
};

const CreateSourceForm: FC = () => {
  const router = useRouter();

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
  // # 2 - handle state when create destination                        #
  // #                                                                 #
  // ###################################################################

  const [createSourceError, setCreateSourceError] =
    useState<Nullable<string>>(null);
  const [isCreatingSource, setIsCreatingSource] = useState(false);

  return (
    <Formik
      initialValues={{ id: null, definition: null }}
      validate={(values) => {
        const error: Partial<CreateSourceFormValues> = {};

        if (!values.definition) {
          error.definition = "Required";
        }

        if (sources.data?.find((e) => e.id === values.definition)) {
          error.definition =
            "You could only create one http and one grpc source. Check the setup guide for more information.";
        }

        return error;
      }}
      onSubmit={(values) => {
        if (!values.definition) return;

        const payload: CreateSourcePayload = {
          id: values.definition,
          source_connector_definition: `source-connector-definitions/${values.definition}`,
          connector: {
            configuration: "{}",
          },
        };

        setIsCreatingSource(true);

        createSource.mutate(payload, {
          onSuccess: () => {
            setIsCreatingSource(false);
            router.push("/sources");
          },
          onError: (error) => {
            if (error instanceof Error) {
              setCreateSourceError(error.message);
              setIsCreatingSource(false);
            } else {
              setCreateSourceError("Something went wrong when deploying model");
              setIsCreatingSource(false);
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
              {createSourceError ? (
                <BasicProgressMessageBox width="w-[216px]" status="error">
                  {createSourceError}
                </BasicProgressMessageBox>
              ) : isCreatingSource ? (
                <BasicProgressMessageBox width="w-[216px]" status="progressing">
                  Creating source...
                </BasicProgressMessageBox>
              ) : null}
              <PrimaryButton
                disabled={formik.isValid ? false : true}
                position="ml-auto my-auto"
                type="submit"
              >
                Setup new model
              </PrimaryButton>
            </div>
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default CreateSourceForm;
