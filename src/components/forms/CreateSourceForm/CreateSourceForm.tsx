import { FC, useEffect, useCallback, useState } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";
import Link from "next/link";

import { SingleSelect, TextField } from "../../formik/FormikField";
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

  const [allSyncSourceCreated, setAllSyncSourceCreated] = useState(false);

  const sources = useSources();
  const createSource = useCreateSource();

  useEffect(() => {
    if (!sources.isSuccess) return;

    const syncSources = [];

    if (!sources.data.find((e) => e.id === "source-grpc")) {
      syncSources.push({
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
      });
    }

    if (!sources.data.find((e) => e.id === "source-http")) {
      syncSources.push({
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
      });
    }

    if (syncSources.length === 0) {
      setAllSyncSourceCreated(true);
    }

    setSyncSourceDefinitionOptions(syncSources);
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
          <FormBase gapY="gap-y-5" padding={null}>
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
              disabled={allSyncSourceCreated ? true : false}
              readOnly={false}
              options={syncSourceDefinitionOptions}
              required={true}
              description={"Setup Guide"}
              menuPlacement="auto"
              value={selectedSyncSourceDefinitionOption}
              onChangeCb={sourceDefinitionOnChange}
              error={formik.errors.definition || null}
            />
            <PrimaryButton
              type="submit"
              disabled={
                allSyncSourceCreated ? true : formik.isValid ? false : true
              }
              position="ml-auto"
            >
              Set up Source
            </PrimaryButton>
            {allSyncSourceCreated ? (
              <div>
                You could only create a http source and a grpc source, click{" "}
                <Link href="/sources">
                  <a className="text-instillBlue50 underline">link</a>
                </Link>{" "}
                to go back to sources list page.
              </div>
            ) : null}
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default CreateSourceForm;
