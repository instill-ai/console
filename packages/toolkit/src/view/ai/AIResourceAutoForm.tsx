import { useRouter } from "next/router";
import { useToast } from "@instill-ai/design-system";
import {
  ConnectorDefinition,
  ConnectorWithDefinition,
  CreateUserConnectorPayload,
  NamespaceType,
  Nullable,
  UpdateUserConnectorPayload,
  checkNamespace,
  useCreateUserConnector,
  useUpdateUserConnector,
} from "../../lib";
import {
  recursiveReplaceNullAndEmptyStringWithUndefined,
  recursiveReplaceTargetValue,
} from "../pipeline-builder";
import { toastInstillError } from "../../lib/toastInstillError";
import { ResourceResourceForm, ResourceResourceFormData } from "../resource";

export type AIResourceAutoFormProps = {
  resource: Nullable<ConnectorWithDefinition>;
  definition: ConnectorDefinition;
  accessToken: Nullable<string>;
  disabledAll?: boolean;
  onSubmit?: (connector: ConnectorWithDefinition) => void;
  onBack?: () => void;
};

export const AIResourceAutoForm = (props: AIResourceAutoFormProps) => {
  const { definition, resource, accessToken, onSubmit } = props;
  const { toast } = useToast();
  const router = useRouter();
  const { entity } = router.query;

  const createUserConnector = useCreateUserConnector();
  const updateUserConnector = useUpdateUserConnector();

  async function handleSubmit(data: ResourceResourceFormData) {
    if (!entity) {
      return;
    }

    let namespaceType: Nullable<NamespaceType> = null;

    try {
      namespaceType = await checkNamespace({
        accessToken,
        id: String(entity),
      });
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when check namespace",
        toast,
        error,
      });
    }

    if (!namespaceType) {
      return;
    }

    const entityName =
      namespaceType === "NAMESPACE_ORGANIZATION"
        ? `organizations/${entity}`
        : `users/${entity}`;

    if (!resource) {
      try {
        const payload: CreateUserConnectorPayload = {
          id: data.id ?? undefined,
          connector_definition_name: definition.name,
          description: data.description ?? undefined,
          configuration: recursiveReplaceNullAndEmptyStringWithUndefined(data),
        };

        const { connector } = await createUserConnector.mutateAsync({
          payload,
          entityName,
          accessToken,
        });

        if (onSubmit) {
          onSubmit({
            ...connector,
            connector_definition: definition,
          });
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
        configuration: recursiveReplaceNullAndEmptyStringWithUndefined(
          recursiveReplaceTargetValue(data, "*****MASK*****", undefined)
        ),
      };

      const { connector } = await updateUserConnector.mutateAsync({
        payload,
        accessToken,
      });

      if (onSubmit) {
        onSubmit({
          ...connector,
          connector_definition: definition,
        });
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
