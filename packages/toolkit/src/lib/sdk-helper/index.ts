import { InstillError, Nullable } from "instill-sdk";

import { env } from "../../server";

export * from "./checkIsDefinition";
export * from "./createInstillAxiosClient";
export * from "./getInstillApiErrorMessage";
export * from "./getInstillAPIClient";
export * from "./getInstillApplicationAPIClient";
export * from "./getInstillModelAPIClient";
export * from "./getInstillCatalogAPIClient";
export * from "./getInstillArtifactAPIClient";

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export async function changePasswordMutation({
  payload,
  accessToken,
}: {
  payload: ChangePasswordPayload;
  accessToken: Nullable<string>;
}) {
  try {
    const baseURL: Nullable<string> = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_GENERAL_API_VERSION")}`;

    const res = await fetch(baseURL + "/auth/change_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      return Promise.reject(new InstillError(error.message, res.status, error));
    }
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function authLogoutAction({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  try {
    const baseURL: Nullable<string> = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_GENERAL_API_VERSION")}`;

    const res = await fetch(baseURL + "/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return Promise.reject(new InstillError(error.message, res.status, error));
    }
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
    const baseURL: Nullable<string> = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_GENERAL_API_VERSION")}`;

    const res = await fetch(baseURL + "/auth/validate_access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return Promise.reject(new InstillError(error.message, res.status, error));
    }
  } catch (err) {
    console.error("Something went wrong when validate token", err);
    return Promise.reject(err);
  }
}

export type AuthLoginActionPayload = {
  username: string;
  password: string;
};

export type AuthLoginActionResponse = {
  accessToken: string;
};

export async function authLoginAction({
  payload,
}: {
  payload: AuthLoginActionPayload;
}) {
  try {
    const baseURL: Nullable<string> = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_GENERAL_API_VERSION")}`;

    const res = await fetch(baseURL + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      return Promise.reject(new InstillError(error.message, res.status, error));
    }

    const data = (await res.json()) as AuthLoginActionResponse;

    return Promise.resolve(data.accessToken);
  } catch (err) {
    return Promise.reject(err);
  }
}
