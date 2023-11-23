import * as React from "react";
import * as z from "zod";
import cn from "clsx";
import { Button, Form } from "@instill-ai/design-system";
import {
  ConnectorDefinition,
  ConnectorWithDefinition,
  GeneralRecord,
  Nullable,
  useInstillForm,
  useResourceAdditionalForm,
} from "../../lib";
import { LoadingSpin } from "../../components";

export type ResourceResourceFormProps = {
  resource: Nullable<ConnectorWithDefinition>;
  definition: ConnectorDefinition;
  accessToken: Nullable<string>;
  disabledAll?: boolean;
  onSubmit?: (data: ResourceResourceFormData) => Promise<void>;
  onBack?: () => void;
};

export type ResourceResourceFormData = {
  data: {
    id: string;
    description: Nullable<string>;
  };
} & GeneralRecord;

export const ResourceResourceForm = ({
  definition,
  resource,
  disabledAll,
  onSubmit,
  onBack,
}: ResourceResourceFormProps) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const { form, fields, ValidatorSchema } = useInstillForm(
    definition.spec.resource_specification,
    resource?.configuration ?? null,
    {
      disabledAll,
      chooseTitleFrom: "title",
    }
  );

  const { form: resourceAdditionalForm, fields: resourceAdditionalFormFields } =
    useResourceAdditionalForm({
      data: resource?.id
        ? { id: resource.id, description: resource.description ?? null }
        : null,
    });

  const {
    trigger: triggerResourceAdditionalFormValidation,
    formState: { isValid: resourceAdditionalFormIsValid },
  } = resourceAdditionalForm;

  async function handleSubmit(data: z.infer<typeof ValidatorSchema>) {
    triggerResourceAdditionalFormValidation();

    if (!resourceAdditionalFormIsValid) {
      return;
    }

    const additionalFormData = resourceAdditionalForm.getValues();

    setIsSaving(true);

    if (onSubmit) {
      await onSubmit({
        ...data,
        id: additionalFormData.id,
        description: additionalFormData.description ?? null,
      });
    }

    setIsSaving(false);
  }

  return (
    <div className="flex flex-col gap-x-4">
      <Form.Root {...resourceAdditionalForm}>
        <form className="w-full">
          <div className="mb-10 flex flex-col space-y-5">
            {resourceAdditionalFormFields}
          </div>
        </form>
      </Form.Root>
      <Form.Root {...form}>
        <form className="w-full" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="mb-10 flex flex-col space-y-5">{fields}</div>
          <div className="flex w-full flex-row gap-x-4">
            {onBack ? (
              <Button
                type="button"
                variant="secondaryGrey"
                size="lg"
                className="!w-full !flex-1 gap-x-2"
                onClick={() => {
                  onBack();
                }}
              >
                Back
              </Button>
            ) : null}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className={cn(onBack ? "!w-full !flex-1" : "ml-auto")}
              disabled={isSaving}
            >
              {isSaving ? <LoadingSpin /> : "Save"}
            </Button>
          </div>
        </form>
      </Form.Root>
    </div>
  );
};
