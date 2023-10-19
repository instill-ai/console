import { Nullable } from "../../type";
import { createInstillAxiosClient, getQueryString } from "../helper";
import { ApiToken, User } from "./types";

export type GetUserResponse = {
  user: User;
};

export async function getUserQuery({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "base");

    const { data } = await client.get<GetUserResponse>("/users/me");

    return Promise.resolve(data.user);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type CheckUserIdExistResponse = {
  exists: boolean;
};

export async function checkUserIdExist({
  id,
  accessToken,
}: {
  id: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "base");
    const { data } = await client.get<CheckUserIdExistResponse>(
      `/users/${id}/exist`
    );
    return Promise.resolve(data.exists);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetApiTokenResponse = {
  token: ApiToken;
};

export async function getApiTokenQuery({
  tokenName,
  accessToken,
}: {
  tokenName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "base");

    const { data } = await client.get<GetApiTokenResponse>(`/${tokenName}`);

    return Promise.resolve(data.token);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type ListApiTokensResponse = {
  tokens: ApiToken[];
  next_page_token: string;
  total_size: string;
};

export async function listApiTokensQuery({
  pageSize,
  nextPageToken,
  accessToken,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "base");
    const tokens: ApiToken[] = [];

    const queryString = getQueryString({
      baseURL: "/tokens",
      pageSize,
      nextPageToken,
      filter: null,
    });

    const { data } = await client.get<ListApiTokensResponse>(queryString);

    tokens.push(...data.tokens);

    if (data.next_page_token) {
      tokens.push(
        ...(await listApiTokensQuery({
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
        }))
      );
    }

    return Promise.resolve(tokens);
  } catch (err) {
    return Promise.reject(err);
  }
}
