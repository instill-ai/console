import { useToast } from "@instill-ai/design-system";
import {
  ConnectorDefinition,
  ConnectorWithDefinition,
  Nullable,
  UpdateUserConnectorPayload,
  useCreateUserConnector,
  useEntity,
  useUpdateUserConnector,
} from "../../lib";
import { recursiveHelpers } from "../pipeline-builder";
import { toastInstillError } from "../../lib/toastInstillError";
import { ResourceResourceForm, ResourceResourceFormData } from "../resource";

export type BlockchainResourceAutoFormProps = {
  resource: Nullable<ConnectorWithDefinition>;
  definition: ConnectorDefinition;
  accessToken: Nullable<string>;
  disabledAll?: boolean;
  onSubmit?: (connector: ConnectorWithDefinition) => void;
  onBack?: () => void;
};

export const BlockchainResourceAutoForm = (
  props: BlockchainResourceAutoFormProps
) => {
  const { definition, resource, accessToken, onSubmit } = props;
  const { toast } = useToast();

  const entityObject = useEntity();

  const createUserConnector = useCreateUserConnector();
  const updateUserConnector = useUpdateUserConnector();
  async function handleSubmit(data: ResourceResourceFormData) {
    if (!entityObject.isSuccess) {
      return;
    }

    if (!resource) {
      try {
        const payload = {
          id: data.id ?? undefined,
          connector_definition_name: definition.name,
          description: data.description ?? undefined,
          configuration:
            recursiveHelpers.replaceNullAndEmptyStringWithUndefined(data),
        };

        const { connector } = await createUserConnector.mutateAsync({
          payload,
          entityName: entityObject.entityName,
          accessToken,
        });

        if (onSubmit) {
          onSubmit({
            ...connector,
            connector_definition: definition,
          });
        }

        toast({
          title: "Successfully create blockchain connector",
          variant: "alert-success",
          size: "small",
        });
      } catch (error) {
        toastInstillError({
          title: "Something went wrong when create the blockchain connector",
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

      if (onSubmit) {
        onSubmit({
          ...connector,
          connector_definition: definition,
        });
      }

      toast({
        title: "Successfully update blockchain connector",
        variant: "alert-success",
        size: "small",
      });
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when update the blockchain connector",
        toast,
        error,
      });
    }
  }

  return <ResourceResourceForm {...props} onSubmit={handleSubmit} />;
};
