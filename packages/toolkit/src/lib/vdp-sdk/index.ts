import { InstillAPIClient, InstillError } from "instill-sdk";

import { env } from "../../server";
import { Nullable } from "../type";

export * from "./helper";
export * from "./model";
export * from "./types";

export * from "./helper";

let instillAPIClient: Nullable<InstillAPIClient> = null;
let instillModelAPIClient: Nullable<InstillAPIClient> = null;
let instillApplicationAPIClient: Nullable<InstillAPIClient> = null;

export function getInstillAPIClient({ accessToken }: { accessToken?: string }) {
  if (!instillAPIClient) {
    const baseURL = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_GENERAL_API_VERSION")}`;

    instillAPIClient = new InstillAPIClient({
      baseURL,

      // When non logged in user is viewing some pages, accessToken will be null
      apiToken: accessToken,
    });
  }

  return instillAPIClient;
}

export function getInstillModelAPIClient({
  accessToken,
}: {
  accessToken?: string;
}) {
  if (!instillModelAPIClient) {
    const baseURL = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_MODEL_API_VERSION")}`;

    instillModelAPIClient = new InstillAPIClient({
      baseURL,

      // When non logged in user is viewing some pages, accessToken will be null
      apiToken: accessToken,
    });
  }

  return instillModelAPIClient;
}

export function getInstillApplicationAPIClient({
  accessToken,
}: {
  accessToken?: string;
}) {
  if (!instillApplicationAPIClient) {
    const baseURL = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_APPLICATION_API_VERSION")}`;

    instillApplicationAPIClient = new InstillAPIClient({
      baseURL,
      apiToken: accessToken,
    });
  }

  return instillApplicationAPIClient;
}

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
