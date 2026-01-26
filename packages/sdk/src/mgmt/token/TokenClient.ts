import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  APIToken,
  CreateAPITokenRequest,
  CreateAPITokenResponse,
  DeleteAPITokenRequest,
  GetAPITokenRequest,
  GetAPITokenResponse,
  ListAPITokenRequest,
  ListAPITokensResponse,
  ListPaginatedAPITokenRequest,
  ListPaginatedAPITokensResponse,
} from "./type";

export class TokenClient extends APIResource {
  /* ----------------------------------------------------------------------------
   * Query
   * ---------------------------------------------------------------------------*/

  /**
   * Returns a paginated list of the API tokens of the authenticated user.
   */
  async listPaginatedAPITokens({
    pageSize,
    pageToken,
  }: ListPaginatedAPITokenRequest) {
    const queryString = getQueryString({
      baseURL: "/tokens",
      pageSize,
      pageToken,
    });

    try {
      const data =
        await this._client.get<ListPaginatedAPITokensResponse>(queryString);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Returns a list of the API tokens of the authenticated user.
   */
  async listAPITokens({ pageSize = 100, pageToken }: ListAPITokenRequest) {
    const queryString = getQueryString({
      baseURL: "/tokens",
      pageSize,
      pageToken,
    });

    try {
      const tokens: APIToken[] = [];

      const res =
        await this._client.get<ListPaginatedAPITokensResponse>(queryString);

      tokens.push(...res.tokens);

      if (res.nextPageToken) {
        tokens.push(
          ...(
            await this.listAPITokens({
              pageSize,
              pageToken: res.nextPageToken,
            })
          ).tokens,
        );
      }

      const response: ListAPITokensResponse = {
        tokens,
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Returns the details of an API token.
   */
  async getAPIToken({ tokenId }: GetAPITokenRequest) {
    const queryString = getQueryString({
      baseURL: `/tokens/${tokenId}`,
    });

    try {
      const data = await this._client.get<GetAPITokenResponse>(queryString);
      return Promise.resolve(data);
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
  async createAPIToken({ id, ttl }: CreateAPITokenRequest) {
    const queryString = getQueryString({
      baseURL: "/tokens",
    });

    try {
      const data = await this._client.post<CreateAPITokenResponse>(
        queryString,
        {
          body: JSON.stringify({
            id,
            ttl,
          }),
        },
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Deletes an API token.
   */
  async deleteAPIToken({ tokenId }: DeleteAPITokenRequest) {
    const queryString = getQueryString({
      baseURL: `/tokens/${tokenId}`,
    });

    try {
      await this._client.delete(queryString);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
