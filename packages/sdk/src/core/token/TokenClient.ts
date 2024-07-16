import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  ApiToken,
  CreateApiTokenRequest,
  CreateApiTokenResponse,
  DeleteApiTokenRequest,
  GetApiTokenRequest,
  GetApiTokenResponse,
  ListApiTokenRequest,
  ListApiTokensResponse,
} from "./type";

export class TokenClient extends APIResource {
  /* ----------------------------------------------------------------------------
   * Query
   * ---------------------------------------------------------------------------*/

  /**
   * Returns a paginated list of the API tokens of the authenticated user.
   */
  async listAPITokens(
    props: ListApiTokenRequest & { enablePagination: true },
  ): Promise<ListApiTokensResponse>;
  async listAPITokens(
    props: ListApiTokenRequest & { enablePagination: false },
  ): Promise<ApiToken[]>;
  async listAPITokens(
    props: ListApiTokenRequest & { enablePagination: undefined },
  ): Promise<ApiToken[]>;
  async listAPITokens(
    props: ListApiTokenRequest & { enablePagination?: boolean },
  ): Promise<ListApiTokensResponse | ApiToken[]>;
  async listAPITokens(
    props: ListApiTokenRequest & { enablePagination?: boolean },
  ) {
    const { pageSize, pageToken, enablePagination } = props;

    try {
      const tokens: ApiToken[] = [];

      const queryString = getQueryString({
        baseURL: "/tokens",
        pageSize,
        pageToken,
      });

      const data = await this._client.get<ListApiTokensResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      tokens.push(...data.tokens);

      if (data.nextPageToken) {
        tokens.push(
          ...(await this.listAPITokens({
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
          })),
        );
      }

      return Promise.resolve(tokens);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Returns the details of an API token.
   */
  async getApiToken({ tokenName }: GetApiTokenRequest) {
    try {
      const data = await this._client.get<GetApiTokenResponse>(`/${tokenName}`);
      return Promise.resolve(data.token);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Mutation
   * ---------------------------------------------------------------------------*/

  /**
   * Creates an API token for the authenticated user.
   */
  async createApiToken({ id, ttl }: CreateApiTokenRequest) {
    try {
      const data = await this._client.post<CreateApiTokenResponse>("/tokens", {
        body: JSON.stringify({
          id,
          ttl,
        }),
      });
      return Promise.resolve(data.token);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Deletes an API token.
   */
  async deleteApiToken({ tokenName }: DeleteApiTokenRequest) {
    try {
      await this._client.delete(`/${tokenName}`);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
