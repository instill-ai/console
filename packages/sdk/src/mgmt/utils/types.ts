export type NamespaceType =
  | "NAMESPACE_UNSPECIFIED"
  | "NAMESPACE_AVAILABLE"
  | "NAMESPACE_USER"
  | "NAMESPACE_ORGANIZATION"
  | "NAMESPACE_RESERVED";

export type NameAvailability = "NAME_AVAILABLE" | "NAME_UNAVAILABLE";

export type CheckNamespaceTypeRequest = {
  id: string;
};

export type CheckNamespaceTypeResponse = {
  type: NamespaceType;
};

export type CheckNameAvailabilityRequest = {
  name: string;
};

export type CheckNameAvailabilityResponse = {
  availability: NameAvailability;
};
