import { NextApiResponse } from "next";
import { serialize } from "cookie";
import { ServerResponse } from "http";

import { Nullable } from "../type";

export type SetCookiePayload = {
  res: NextApiResponse | ServerResponse;
  value: string;
  key: string;
  domain: Nullable<string>;
  maxAge: number;
  httpOnly: boolean;
  secure: boolean;
};

export function setCookie({
  res,
  value,
  key,
  domain,
  maxAge,
  httpOnly,
  secure,
}: SetCookiePayload) {
  const cookie = serialize(key, value, {
    expires: new Date(Date.now() + maxAge * 1000),
    path: "/",
    sameSite: "lax",
    domain: domain ? domain : undefined,
    maxAge,
    httpOnly,
    secure,
  });

  res.setHeader("Set-Cookie", cookie);
}

export type RemoveCookiePayload = {
  res: NextApiResponse | ServerResponse;
  key: string;
};

export function removeCookie({ res, key }: RemoveCookiePayload) {
  const cookie = serialize(key, "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
}
