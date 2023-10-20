import axios from "axios";
import { env } from "../../utility";
import { Nullable } from "../../type";

export function createInstillAxiosClient(
  accessToken: Nullable<string>,
  product: "core" | "model" | "vdp"
) {
  const headers = accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
        "CF-Access-Client-Id": env("CF_ACCESS_CLIENT_ID")
          ? env("CF_ACCESS_CLIENT_ID")
          : undefined,
        "CF-Access-Client-Secret": env("CF_ACCESS_CLIENT_SECRET")
          ? env("CF_ACCESS_CLIENT_SECRET")
          : undefined,
      }
    : {};

  if (
    !process.env.NEXT_SERVER_API_GATEWAY_URL &&
    !env("NEXT_PUBLIC_API_GATEWAY_URL")
  ) {
    throw new Error(
      "NEXT_SERVER_API_GATEWAY_URL or NEXT_PUBLIC_API_GATEWAY_URL is not defined"
    );
  }

  let baseURL: Nullable<string> = `${
    process.env.NEXT_SERVER_API_GATEWAY_URL ??
    env("NEXT_PUBLIC_API_GATEWAY_URL")
  }/${product}/${env("NEXT_PUBLIC_API_VERSION")}`;

  return axios.create({
    baseURL,
    headers,
  });
}
