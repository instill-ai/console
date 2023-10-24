import * as React from "react";
import * as z from "zod";
import cn from "clsx";
import { useRouter } from "next/router";
import { Button, Form, useToast } from "@instill-ai/design-system";
import {
  ConnectorDefinition,
  ConnectorResourceWithDefinition,
  Nullable,
  UpdateUserConnectorResourcePayload,
  useCreateUserConnectorResource,
  useInstillForm,
  useResourceAdditionalForm,
  useUpdateUserConnectorResource,
} from "../../lib";
import {
  recursiveReplaceNullAndEmptyStringWithUndefined,
  recursiveReplaceTargetValue,
} from "../pipeline-builder";
import { toastInstillError } from "../../lib/toastInstillError";
import { LoadingSpin } from "../../components";

export type AIResourceAutoFormProps = {
  aiResource: Nullable<ConnectorResourceWithDefinition>;
  aiDefinition: ConnectorDefinition;
  accessToken: Nullable<string>;
  disabledAll?: boolean;
  onSubmit?: (connectorResource: ConnectorResourceWithDefinition) => void;
  onBack?: () => void;
};

export const AIResourceAutoForm = ({
  aiDefinition,
  aiResource,
  accessToken,
  disabledAll,
  onSubmit,
  onBack,
}: AIResourceAutoFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const { entity } = router.query;

  const [isSaving, setIsSaving] = React.useState(false);

  const { form, fields, ValidatorSchema } = useInstillForm({
    schema: aiDefinition.spec.resource_specification,
    data: aiResource?.configuration ?? null,
  });

  const { form: resourceAdditionalForm, fields: resourceAdditionalFormFields } =
    useResourceAdditionalForm({
      data: aiResource?.id
        ? { id: aiResource.id, description: aiResource.description ?? null }
        : null,
    });

  const {
    trigger: triggerResourceAdditionalFormValidation,
    formState: { isValid: resourceAdditionalFormIsValid },
  } = resourceAdditionalForm;

  const createUserAI = useCreateUserConnectorResource();
  const updateUserAI = useUpdateUserConnectorResource();

  function handleSubmit(data: z.infer<typeof ValidatorSchema>) {
    triggerResourceAdditionalFormValidation();

    if (!resourceAdditionalFormIsValid) {
      return;
    }

    setIsSaving(true);

    const additionalFormData = resourceAdditionalForm.getValues();

    if (!aiResource) {
      const payload = {
        id: additionalFormData.id ?? undefined,
        connector_definition_name: aiDefinition.name,
        description: additionalFormData.description ?? undefined,
        configuration: recursiveReplaceNullAndEmptyStringWithUndefined(data),
      };

      createUserAI.mutate(
        { payload, userName: `users/${entity}`, accessToken },
        {
          onSuccess: ({ connectorResource }) => {
            if (onSubmit) {
              onSubmit({
                ...connectorResource,
                connector_definition: aiDefinition,
              });
            }

            toast({
              title: "Successfully create AI resource",
              variant: "alert-success",
              size: "small",
            });

            setIsSaving(false);
          },
          onError: (error) => {
            toastInstillError({
              title: "Something went wrong when create the AI resource",
              toast,
              error,
            });

            setIsSaving(false);
          },
        }
      );

      return;
    }

    const payload: UpdateUserConnectorResourcePayload = {
      connectorResourceName: aiResource.name,
      description: additionalFormData.description ?? undefined,
      configuration: recursiveReplaceNullAndEmptyStringWithUndefined(
        recursiveReplaceTargetValue(data, "*****MASK*****", undefined)
      ),
    };

    updateUserAI.mutate(
      { payload, accessToken },
      {
        onSuccess: ({ connectorResource }) => {
          if (onSubmit) {
            onSubmit({
              ...connectorResource,
              connector_definition: aiDefinition,
            });
          }

          toast({
            title: "Successfully update AI resource",
            variant: "alert-success",
            size: "small",
          });

          setIsSaving(false);
        },
        onError: (error) => {
          toastInstillError({
            title: "Something went wrong when update the AI resource",
            toast,
            error,
          });

          setIsSaving(false);
        },
      }
    );
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
