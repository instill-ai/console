"use client";

import { useToast } from "@instill-ai/design-system";
import {
  ConnectorDefinition,
  ConnectorWithDefinition,
  CreateUserConnectorPayload,
  Nullable,
  UpdateUserConnectorPayload,
  sendAmplitudeData,
  useAmplitudeCtx,
  useCreateUserConnector,
  useUpdateUserConnector,
} from "../../lib";
import { recursiveHelpers } from "../pipeline-builder";
import { toastInstillError } from "../../lib/toastInstillError";
import { ResourceResourceForm, ResourceResourceFormData } from "../resource";

export type AIResourceAutoFormProps = {
  resource: Nullable<ConnectorWithDefinition>;
  definition: ConnectorDefinition;
  accessToken: Nullable<string>;
  disabledAll?: boolean;
  onSubmit?: (connector: ConnectorWithDefinition) => void;
  onBack?: () => void;
  entityName: Nullable<string>;
};

export const AIResourceAutoForm = (props: AIResourceAutoFormProps) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { definition, resource, accessToken, onSubmit, entityName } = props;
  const { toast } = useToast();

  const createUserConnector = useCreateUserConnector();
  const updateUserConnector = useUpdateUserConnector();

  async function handleSubmit(data: ResourceResourceFormData) {
    if (!entityName) {
      return;
    }

    if (!resource) {
      try {
        const payload: CreateUserConnectorPayload = {
          id: data.id ?? undefined,
          connector_definition_name: definition.name,
          description: data.description ?? undefined,
          configuration:
            recursiveHelpers.replaceNullAndEmptyStringWithUndefined(data),
        };

        const { connector } = await createUserConnector.mutateAsync({
          payload,
          entityName,
          accessToken,
        });

        if (amplitudeIsInit) {
          sendAmplitudeData("create_connector", {
            connector_definition_name: definition.name,
          });
        }

        if (onSubmit) {
          onSubmit(connector);
        }

        toast({
          title: "Successfully create AI connector",
          variant: "alert-success",
          size: "small",
        });
      } catch (error) {
        toastInstillError({
          title: "Something went wrong when create the AI connector",
          toast,
          error,
        });
      }

      return;
    }

    try {
      const payload: UpdateUserConnectorPayload = {
        connectorName: resource.name,
        description: data.description ?? undefined,
        configuration: recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
          recursiveHelpers.replaceTargetValue(data, "*****MASK*****", undefined)
        ),
      };

      const { connector } = await updateUserConnector.mutateAsync({
        payload,
        accessToken,
      });

      if (amplitudeIsInit) {
        sendAmplitudeData("update_connector");
      }

      if (onSubmit) {
        onSubmit(connector);
      }

      toast({
        title: "Successfully update AI connector",
        variant: "alert-success",
        size: "small",
      });
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when update the AI connector",
        toast,
        error,
      });
    }
  }

  return <ResourceResourceForm {...props} onSubmit={handleSubmit} />;
};
