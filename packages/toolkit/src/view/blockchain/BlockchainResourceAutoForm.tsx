import { useRouter } from "next/router";
import { useToast } from "@instill-ai/design-system";
import {
	ConnectorDefinition,
	ConnectorResourceWithDefinition,
	Nullable,
	UpdateUserConnectorResourcePayload,
	useCreateUserConnectorResource,
	useUpdateUserConnectorResource,
} from "../../lib";
import {
	recursiveReplaceNullAndEmptyStringWithUndefined,
	recursiveReplaceTargetValue,
} from "../pipeline-builder";
import { toastInstillError } from "../../lib/toastInstillError";
import { ResourceResourceForm, ResourceResourceFormData } from "../resource";

export type BlockchainResourceAutoFormProps = {
	resource: Nullable<ConnectorResourceWithDefinition>;
	definition: ConnectorDefinition;
	accessToken: Nullable<string>;
	disabledAll?: boolean;
	onSubmit?: (connectorResource: ConnectorResourceWithDefinition) => void;
	onBack?: () => void;
};

export const BlockchainResourceAutoForm = (
	props: BlockchainResourceAutoFormProps
) => {
	const { definition, resource, accessToken, onSubmit } = props;
	const { toast } = useToast();
	const router = useRouter();
	const { entity } = router.query;

	const createUserConnectorResource = useCreateUserConnectorResource();
	const updateUserConnectorResource = useUpdateUserConnectorResource();

	async function handleSubmit(data: ResourceResourceFormData) {
		if (!resource) {
			try {
				const payload = {
					id: data.id ?? undefined,
					connector_definition_name: definition.name,
					description: data.description ?? undefined,
					configuration: recursiveReplaceNullAndEmptyStringWithUndefined(data),
				};

				const { connectorResource } =
					await createUserConnectorResource.mutateAsync({
						payload,
						userName: `users/${entity}`,
						accessToken,
					});

				if (onSubmit) {
					onSubmit({
						...connectorResource,
						connector_definition: definition,
					});
				}

				toast({
					title: "Successfully create blockchain resource",
					variant: "alert-success",
					size: "small",
				});
			} catch (error) {
				toastInstillError({
					title: "Something went wrong when create the blockchain resource",
					toast,
					error,
				});
			}

			return;
		}

		try {
			const payload: UpdateUserConnectorResourcePayload = {
				connectorResourceName: resource.name,
				description: data.description ?? undefined,
				configuration: recursiveReplaceNullAndEmptyStringWithUndefined(
					recursiveReplaceTargetValue(data, "*****MASK*****", undefined)
				),
			};

			const { connectorResource } =
				await updateUserConnectorResource.mutateAsync({
					payload,
					accessToken,
				});

			if (onSubmit) {
				onSubmit({
					...connectorResource,
					connector_definition: definition,
				});
			}

			toast({
				title: "Successfully update blockchain resource",
				variant: "alert-success",
				size: "small",
			});
		} catch (error) {
			toastInstillError({
				title: "Something went wrong when update the blockchain resource",
				toast,
				error,
			});
		}
	}

	return <ResourceResourceForm {...props} onSubmit={handleSubmit} />;
};
