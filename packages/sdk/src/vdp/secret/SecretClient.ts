import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  CreateNamespaceSecretRequest,
  CreateNamespaceSecretResponse,
  DeleteNamespaceSecretRequest,
  GetNamespaceSecretRequest,
  GetNamespaceSecretResponse,
  ListNamespaceSecretResponse,
  ListNamespaceSecretsRequest,
  Secret,
  UpdateNamespaceSecretRequest,
} from "./types";

export class SecretClient extends APIResource {
  /* ----------------------------------------------------------------------------
   * Query
   * ---------------------------------------------------------------------------*/

  async getNamespaceSecret({
    namespaceId,
    secretId,
  }: GetNamespaceSecretRequest) {
    try {
      const data = await this._client.get<GetNamespaceSecretResponse>(
        `/namespaces/${namespaceId}/secrets/${secretId}`,
      );
      return Promise.resolve(data.secret);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespaceSecrets(
    props: ListNamespaceSecretsRequest & { enablePagination: true },
  ): Promise<ListNamespaceSecretResponse>;
  async listNamespaceSecrets(
    props: ListNamespaceSecretsRequest & { enablePagination: false },
  ): Promise<Secret[]>;
  async listNamespaceSecrets(
    props: ListNamespaceSecretsRequest & { enablePagination: boolean },
  ): Promise<ListNamespaceSecretResponse | Secret[]>;
  async listNamespaceSecrets(
    props: ListNamespaceSecretsRequest & { enablePagination: boolean },
  ) {
    const { namespaceId, pageSize, pageToken, enablePagination } = props;

    try {
      const secrets: Secret[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/secrets`,
        pageSize,
        pageToken,
      });

      const data =
        await this._client.get<ListNamespaceSecretResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      secrets.push(...data.secrets);

      if (data.nextPageToken) {
        secrets.push(
          ...(await this.listNamespaceSecrets({
            namespaceId,
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination,
          })),
        );
      }

      return Promise.resolve(secrets);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /* ----------------------------------------------------------------------------
   * Mutation
   * ---------------------------------------------------------------------------*/

  async createNamespaceSecret(props: CreateNamespaceSecretRequest) {
    const { namespaceId, ...payload } = props;

    try {
      const data = await this._client.post<CreateNamespaceSecretResponse>(
        `/namespaces/${namespaceId}/secrets`,
        {
          body: JSON.stringify(payload),
        },
      );
      return Promise.resolve(data.secret);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteNamespaceSecret({
    namespaceId,
    secretId,
  }: DeleteNamespaceSecretRequest) {
    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/secrets/${secretId}`,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespaceSecret(props: UpdateNamespaceSecretRequest) {
    const { namespaceId, secretId, ...payload } = props;

    try {
      const data = await this._client.patch(
        `/namespaces/${namespaceId}/secrets/${secretId}`,
        {
          body: JSON.stringify(payload),
        },
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
