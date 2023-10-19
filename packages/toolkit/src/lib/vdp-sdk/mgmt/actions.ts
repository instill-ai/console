import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../helper";

export async function authLogoutAction({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "base");

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
    const client = createInstillAxiosClient(null, "base");

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
    const client = createInstillAxiosClient(accessToken, "base");
    await client.post("/auth/validate_access_token");
  } catch (err) {
    return Promise.reject(err);
  }
}
