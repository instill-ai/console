export type NamespaceType =
  | "NAMESPACE_UNSPECIFIED"
  | "NAMESPACE_AVAILABLE"
  | "NAMESPACE_USER"
  | "NAMESPACE_ORGANIZATION"
  | "NAMESPACE_RESERVED";

export type CheckNamespaceTypeRequest = {
  id: string;
};

export type CheckNamespaceTypeResponse = {
  type: NamespaceType;
};
