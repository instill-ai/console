import { FC, useEffect, useCallback, useState } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";

import { SingleSelect } from "../../formik/FormikField";
import { PrimaryButton } from "@/components/ui/Buttons";
import { FormBase } from "@/components/formik";
import { ConnectorIcon } from "@/components/ui";
import { SingleSelectOption } from "@instill-ai/design-system";
import {
  useCreateSource,
  useSources,
} from "@/services/connector/SourceServices";
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

        createSource.mutate(payload, {
          onSuccess: () => {
            router.push("/sources");
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
              onChangeCb={sourceDefinitionOnChange}
              error={formik.errors.definition || null}
              disabled={false}
              readOnly={false}
              required={true}
              description="Setup Guide"
              menuPlacement="auto"
            />
            <PrimaryButton
              type="submit"
              disabled={formik.isValid ? false : true}
              position="ml-auto"
            >
              Set up Source
            </PrimaryButton>
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default CreateSourceForm;
