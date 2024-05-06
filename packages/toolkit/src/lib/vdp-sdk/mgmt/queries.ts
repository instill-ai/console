import { Nullable } from "../../type";
import { createInstillAxiosClient, getQueryString } from "../helper";
import { ApiToken, AuthenticatedUser, User, UserSubscription } from "./types";

export type GetAuthenticatedResponse = {
  user: AuthenticatedUser;
};

export async function getAuthenticatedUserQuery({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);

    const { data } = await client.get<GetAuthenticatedResponse>("/user");

    return Promise.resolve(data.user);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetAuthenticatedUserSubscriptionsResponse = {
  subscription: UserSubscription;
};

export async function getAuthenticatedUserSubscriptionsQuery({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);

    const { data } =
      await client.get<GetAuthenticatedUserSubscriptionsResponse>(
        "/user/subscription"
      );

    return Promise.resolve(data.subscription);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetUserResponse = {
  user: User;
};

export async function getUserQuery({
  userName,
  accessToken,
}: {
  userName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);

    const { data } = await client.get<GetUserResponse>(`/${userName}`);

    return Promise.resolve(data.user);
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
    const client = createInstillAxiosClient(accessToken);

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

export type ListUsersResponse = {
  users: User[];
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
    const client = createInstillAxiosClient(accessToken);
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
export async function listUsersQuery({
  pageSize,
  nextPageToken,
  accessToken,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);
    const users: User[] = [];

    const queryString = getQueryString({
      baseURL: "/users",
      pageSize,
      nextPageToken,
      filter: null,
    });

    const { data } = await client.get<ListUsersResponse>(queryString);

    users.push(...data.users);

    if (data.next_page_token) {
      users.push(
        ...(await listUsersQuery({
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
        }))
      );
    }

    return Promise.resolve(users);
  } catch (err) {
    return Promise.reject(err);
  }
}
