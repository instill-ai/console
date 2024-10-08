import { Nullable } from "instill-sdk";

import { resourceIdPrefix } from "../../constant";
import { formatResourceId } from "./formatResourceId";
import { validateInstillResourceID } from "./validateInstillResourceID";

export type ParseResourceIdResult =
  | {
      isValid: true;
      originalResourceId: string;
      formattedResourceId: undefined;
    }
  | {
      isValid: false;
      originalResourceId: string;
      formattedResourceId: string;
    };

export function parseResourceId({
  resourceId,
  resourceType,
}: {
  resourceId: string;
  resourceType:
    | "RESOURCE_TYPE_UNSPECIFIED"
    | "RESOURCE_TYPE_PIPELINE"
    | "RESOURCE_TYPE_INTEGRATION_CONNECTION"
    | "RESOURCE_TYPE_MODEL"
    | "RESOURCE_TYPE_CATALOG";
}): ParseResourceIdResult {
  const isValid = validateInstillResourceID(resourceId);

  let resourceTypePrefix: Nullable<string> = null;

  switch (resourceType) {
    case "RESOURCE_TYPE_PIPELINE":
      resourceTypePrefix = resourceIdPrefix.pipeline;
      break;
    case "RESOURCE_TYPE_INTEGRATION_CONNECTION":
      resourceTypePrefix = resourceIdPrefix.integrationConnection;
      break;
    case "RESOURCE_TYPE_MODEL":
      resourceTypePrefix = resourceIdPrefix.model;
      break;
    case "RESOURCE_TYPE_CATALOG":
      resourceTypePrefix = resourceIdPrefix.catalog;
      break;
  }

  if (isValid) {
    return {
      isValid: true,
      originalResourceId: resourceId,
      formattedResourceId: undefined,
    };
  } else {
    return {
      isValid: false,
      originalResourceId: resourceId,
      formattedResourceId: formatResourceId(
        resourceId,
        resourceTypePrefix ?? undefined,
      ),
    };
  }
}
