import { FC, useState, useEffect, useCallback } from "react";
import { SingleSelectOption } from "@instill-ai/design-system";
import { Formik } from "formik";

import { FormBase, SingleSelect } from "@/components/formik";
import { ConnectorIcon, PrimaryButton } from "@/components/ui";
import { DestinationWithDefinition } from "@/lib/instill";
import { Nullable } from "@/types/general";

export type ConfigureDestinationFormProps = {
  destination: Nullable<DestinationWithDefinition>;
};

type ConfigureDestinationFormValue = {
  definition: Nullable<string>;
};

const ConfigureDestinationForm: FC<ConfigureDestinationFormProps> = ({
  destination,
}) => {
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

  return (
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
          <FormBase marginBottom={null} gapY="gap-y-5" padding={null}>
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
            <div className="mt-10 flex flex-row">
              <PrimaryButton
                type="button"
                disabled={true}
                position="mr-auto my-auto"
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
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default ConfigureDestinationForm;
