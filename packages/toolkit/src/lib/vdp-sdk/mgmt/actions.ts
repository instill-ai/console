import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../helper";
import { NamespaceType } from "./types";

export async function authLogoutAction({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);

    await client.post("/auth/logout");
  } catch (err) {
    return Promise.reject(err);
  }
}

export type AuthLoginActionPayload = {
  username: string;
  password: string;
};

export type AuthLoginActionResponse = {
  access_token: string;
};

export async function authLoginAction({
  payload,
}: {
  payload: AuthLoginActionPayload;
}) {
  try {
    const client = createInstillAxiosClient(null);

    const { data } = await client.post<AuthLoginActionResponse>(
      "/auth/login",
      payload
    );

    return Promise.resolve(data.access_token);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function authValidateTokenAction({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);
    await client.post("/auth/validate_access_token");
  } catch (err) {
    return Promise.reject(err);
  }
}

export type CheckNamespaceResponse = {
  type: NamespaceType;
};

export async function checkNamespace({
  id,
  accessToken,
}: {
  id: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);
    const { data } = await client.post<CheckNamespaceResponse>(
      "/check-namespace",
      {
        id,
      }
    );
    return Promise.resolve(data.type);
  } catch (err) {
    return Promise.reject(err);
  }
}
