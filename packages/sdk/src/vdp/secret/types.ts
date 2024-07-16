import { Nullable } from "../../types";

export type Secret = {
  name: string;
  uid: string;
  id: string;
  createTime: string;
  updateTime: string;
  description: Nullable<string>;

  // The value of the secret, which is input-only and will never be returned in API responses.
  value: Nullable<string>;
};

export type GetNamespaceSecretRequest = {
  namespaceSecretName: string;
};

export type GetNamespaceSecretResponse = {
  secret: Secret;
};

export type ListNamespaceSecretsRequest = {
  namespaceName: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListNamespaceSecretResponse = {
  secrets: Secret[];
  nextPageToken: string;
  totalSize: number;
};

export type CreateNamespaceSecretRequest = {
  namespaceName: string;
  id: string;
  value: string;
  description?: string;
};

export type CreateNamespaceSecretResponse = {
  secret: Secret;
};

export type DeleteNamespaceSecretRequest = {
  namespaceSecretName: string;
};

export type UpdateNamespaceSecretRequest = {
  namespaceSecretName: string;
  id?: string;
  value?: string;
  description?: string;
};

export type UpdateNamespaceSecretResponse = {
  secret: Secret;
};
